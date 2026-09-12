#!/usr/bin/env node
/* global process, console, setTimeout, clearTimeout */

import { createHash } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import {
  appendFile,
  chmod,
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  rmdir,
  writeFile
} from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, posix, resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";
import https from "node:https";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_MANIFEST = resolve(SCRIPT_DIR, "pnpm-native-release.json");
const DEFAULT_DOWNLOAD_RETRIES = 3;
const DEFAULT_DOWNLOAD_TIMEOUT_MS = 20_000;
const DEFAULT_MAX_REDIRECTS = 5;

export class BootstrapError extends Error {
  constructor(classification, message, details = {}) {
    super(message);
    this.name = "BootstrapError";
    this.classification = classification;
    this.details = details;
  }
}

function bootstrapError(classification, message, details = {}) {
  return new BootstrapError(classification, message, details);
}

export function parsePackageManagerPin(value) {
  if (typeof value !== "string" || !/^pnpm@\d+\.\d+\.\d+$/.test(value)) {
    throw bootstrapError("PACKAGE_MANAGER_PIN_INVALID", "packageManager must be an exact pnpm@x.y.z pin.");
  }
  return { name: "pnpm", version: value.slice("pnpm@".length), pin: value };
}

export function detectLibc(report = process.report) {
  try {
    const glibcVersion = report?.getReport?.().header?.glibcVersionRuntime;
    if (typeof glibcVersion === "string" && glibcVersion.length > 0) return "glibc";
  } catch {
    // An unknown libc is intentionally rejected by selectTarget below.
  }
  return "unknown";
}

export function selectTarget({ platform = process.platform, arch = process.arch, libc = detectLibc() } = {}, manifest) {
  if (platform !== "linux") {
    throw bootstrapError("UNSUPPORTED_PLATFORM", `Unsupported pnpm native target: ${platform}; only Linux glibc targets are pinned.`);
  }
  const normalizedArch = arch === "x64" ? "x64" : arch === "arm64" ? "arm64" : null;
  if (!normalizedArch) {
    throw bootstrapError("UNSUPPORTED_ARCHITECTURE", `Unsupported pnpm native architecture: ${arch}; use a pinned Linux x64 or arm64 runner.`);
  }
  if (libc !== "glibc") {
    throw bootstrapError("UNSUPPORTED_LIBC", `Unsupported Linux libc: ${libc}; the checked-in assets are glibc-only.`);
  }
  const targetKey = `linux-${normalizedArch}-glibc`;
  const target = manifest?.targets?.[targetKey];
  if (!target || typeof target !== "object") {
    throw bootstrapError("TARGET_PIN_MISSING", `No checked-in native pnpm asset is pinned for ${targetKey}.`);
  }
  return { key: targetKey, ...target };
}

function assertString(value, label) {
  if (typeof value !== "string" || value.length === 0) throw bootstrapError("MANIFEST_INVALID", `${label} must be a non-empty string.`);
  return value;
}

function assertSha256(value, label) {
  if (typeof value !== "string" || !/^[0-9a-f]{64}$/.test(value)) throw bootstrapError("MANIFEST_INVALID", `${label} must be a lowercase SHA-256 digest.`);
  return value;
}

export function validateManifest(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) throw bootstrapError("MANIFEST_INVALID", "The native pnpm manifest must be a JSON object.");
  const packageManager = parsePackageManagerPin(manifest.package_manager);
  if (manifest.version !== packageManager.version) throw bootstrapError("MANIFEST_INVALID", "Manifest version does not match manifest package_manager.");
  if (typeof manifest.targets !== "object" || manifest.targets === null || Array.isArray(manifest.targets)) throw bootstrapError("MANIFEST_INVALID", "Manifest targets must be an object.");
  for (const [key, target] of Object.entries(manifest.targets)) {
    if (!target || typeof target !== "object" || Array.isArray(target)) throw bootstrapError("MANIFEST_INVALID", `Manifest target ${key} must be an object.`);
    assertString(target.asset, `Manifest target ${key} asset`);
    const url = assertString(target.url, `Manifest target ${key} URL`);
    if (!url.startsWith("https://")) throw bootstrapError("MANIFEST_INVALID", `Manifest target ${key} URL must use HTTPS.`);
    assertSha256(target.sha256, `Manifest target ${key} sha256`);
    assertString(target.entrypoint, `Manifest target ${key} entrypoint`);
    assertString(target.runtime_directory, `Manifest target ${key} runtime_directory`);
    if (target.entrypoint !== "pnpm" || target.runtime_directory !== "dist") throw bootstrapError("MANIFEST_INVALID", `Manifest target ${key} must use the inspected pnpm/dist archive layout.`);
    validateMemberName(target.entrypoint);
    validateMemberName(target.runtime_directory);
  }
  return { ...manifest, packageManager };
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw bootstrapError("INPUT_READ_FAILURE", `Unable to read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function readProjectPin(root) {
  const packageJson = await readJson(resolve(root, "package.json"), "package.json");
  const packageManager = parsePackageManagerPin(packageJson?.packageManager);
  try {
    const toolVersions = await readFile(resolve(root, ".tool-versions"), "utf8");
    const pnpmLine = toolVersions.split(/\r?\n/).find((line) => /^\s*pnpm\s+/.test(line));
    if (pnpmLine) {
      const toolVersion = pnpmLine.trim().split(/\s+/)[1];
      if (toolVersion !== packageManager.version) throw bootstrapError("PACKAGE_MANAGER_PIN_DRIFT", `.tool-versions pins pnpm ${toolVersion}, but package.json pins ${packageManager.pin}.`);
    }
  } catch (error) {
    if (error instanceof BootstrapError) throw error;
    if (error?.code !== "ENOENT") throw error;
  }
  return packageManager;
}

function sanitizeDiagnostic(value) {
  const text = [...String(value)].filter((character) => {
    const code = character.charCodeAt(0);
    return !(code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127);
  }).join("");
  return text
    .replace(/(?:postgres(?:ql)?:\/\/)[^\s"'`]+/gi, "postgres://<redacted>")
    .replace(/\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_-]+/g, "<redacted-token>")
    .replace(/(authorization\s*[:=]\s*bearer\s+)[^\s]+/gi, "$1<redacted>")
    .replace(/((?:password|passwd|secret|token|cookie)\s*[:=]\s*)[^\s,;]+/gi, "$1<redacted>")
    .slice(-4_000);
}

async function sha256File(path) {
  const hash = createHash("sha256");
  return new Promise((resolveHash, reject) => {
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolveHash(hash.digest("hex")));
  });
}

function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));
}

function downloadOnce(url, destination, timeoutMs, redirectsRemaining) {
  return new Promise((resolveDownload, rejectDownload) => {
    let parsed;
    try {
      parsed = new URL(url);
    } catch (error) {
      rejectDownload(bootstrapError("DOWNLOAD_URL_INVALID", `Invalid native pnpm download URL: ${error instanceof Error ? error.message : String(error)}`));
      return;
    }
    if (parsed.protocol !== "https:") {
      rejectDownload(bootstrapError("DOWNLOAD_URL_INSECURE", "Native pnpm downloads must use HTTPS."));
      return;
    }
    const request = https.get(parsed, { headers: { "User-Agent": "open-slideshow-studio-ci/0.1" } }, (response) => {
      const status = response.statusCode ?? 0;
      if (status >= 300 && status < 400 && response.headers.location) {
        response.resume();
        if (redirectsRemaining <= 0) {
          rejectDownload(bootstrapError("DOWNLOAD_REDIRECT_LIMIT", "Native pnpm download exceeded the HTTPS redirect limit."));
          return;
        }
        let redirectUrl;
        try { redirectUrl = new URL(response.headers.location, parsed).toString(); }
        catch (error) {
          rejectDownload(bootstrapError("DOWNLOAD_URL_INVALID", `Invalid native pnpm redirect: ${error instanceof Error ? error.message : String(error)}`));
          return;
        }
        if (new URL(redirectUrl).protocol !== "https:") {
          rejectDownload(bootstrapError("DOWNLOAD_URL_INSECURE", "Native pnpm download redirects must remain HTTPS."));
          return;
        }
        downloadOnce(redirectUrl, destination, timeoutMs, redirectsRemaining - 1).then(resolveDownload, rejectDownload);
        return;
      }
      if (status < 200 || status >= 300) {
        response.resume();
        rejectDownload(bootstrapError("DOWNLOAD_HTTP_FAILURE", `Native pnpm download returned HTTP ${status}.`));
        return;
      }
      const output = createWriteStream(destination, { flags: "w", mode: 0o600 });
      let settled = false;
      const fail = (error) => {
        if (settled) return;
        settled = true;
        output.destroy();
        rejectDownload(error);
      };
      response.on("error", (error) => fail(error));
      output.on("error", (error) => fail(error));
      output.on("finish", () => {
        if (settled) return;
        settled = true;
        output.close(() => resolveDownload());
      });
      response.pipe(output);
    });
    request.setTimeout(timeoutMs, () => request.destroy(new Error(`download timed out after ${timeoutMs}ms`)));
    request.on("error", (error) => rejectDownload(error));
  });
}

async function downloadArchive(url, destination, retries = DEFAULT_DOWNLOAD_RETRIES, timeoutMs = DEFAULT_DOWNLOAD_TIMEOUT_MS) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await downloadOnce(url, destination, timeoutMs, DEFAULT_MAX_REDIRECTS);
      return { attempts: attempt };
    } catch (error) {
      lastError = error;
      await rm(destination, { force: true }).catch(() => undefined);
      if (attempt < retries) await wait(250 * attempt);
    }
  }
  throw bootstrapError("DOWNLOAD_FAILURE", `Unable to download the pinned native pnpm archive after ${retries} attempts: ${sanitizeDiagnostic(lastError instanceof Error ? lastError.message : String(lastError))}`);
}

async function runCommand(command, args, options = {}) {
  const { cwd, timeoutMs = 30_000 } = options;
  return new Promise((resolveCommand) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolveCommand(result);
    };
    child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk) => { output += chunk.toString(); });
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      finish({ exitCode: 124, output: `${output}command timed out after ${timeoutMs}ms\n` });
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timeout);
      finish({ exitCode: 1, output: `${output}${error.message}\n` });
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      finish({ exitCode: code ?? 1, output });
    });
  });
}

function validateMemberName(rawName) {
  const name = rawName.endsWith("/") ? rawName.slice(0, -1) : rawName;
  if (!name || name.includes("\\") || name.includes("\u0000") || /[\r\n\t ]/.test(name)) throw bootstrapError("UNSAFE_ARCHIVE", `Unsafe native pnpm archive member name: ${JSON.stringify(rawName)}.`);
  if (name.startsWith("/") || /^[A-Za-z]:\//.test(name)) throw bootstrapError("UNSAFE_ARCHIVE", `Absolute native pnpm archive member is not allowed: ${JSON.stringify(rawName)}.`);
  const segments = name.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) throw bootstrapError("UNSAFE_ARCHIVE", `Traversal or empty segment in native pnpm archive member: ${JSON.stringify(rawName)}.`);
  const normalized = posix.normalize(name);
  if (normalized !== name || normalized.startsWith("../")) throw bootstrapError("UNSAFE_ARCHIVE", `Non-normalized native pnpm archive member: ${JSON.stringify(rawName)}.`);
  return name;
}

function parseVerboseMember(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const type = trimmed[0];
  const dateMatch = trimmed.match(/\s\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}(?:\.\d+)?\s(.+)$/);
  if (!dateMatch) throw bootstrapError("UNSAFE_ARCHIVE", `Unable to parse native pnpm archive metadata line: ${JSON.stringify(trimmed.slice(0, 300))}.`);
  let name = dateMatch[1];
  let linkTarget = null;
  const linkMarker = " link to ";
  const linkIndex = name.indexOf(linkMarker);
  if (type === "h") {
    if (linkIndex < 0) throw bootstrapError("UNSAFE_ARCHIVE", "A native pnpm hardlink member did not declare its target.");
    linkTarget = name.slice(linkIndex + linkMarker.length);
    name = name.slice(0, linkIndex);
  }
  return { type, name: validateMemberName(name), linkTarget: linkTarget ? validateMemberName(linkTarget) : null };
}

export function validateArchiveMembers(namesText, verboseText) {
  const names = namesText.split(/\r?\n/).filter((name) => name.length > 0).map(validateMemberName);
  if (names.length === 0) throw bootstrapError("UNSAFE_ARCHIVE", "The native pnpm archive is empty.");
  for (const name of names) {
    if (name !== "pnpm" && name !== "dist" && !name.startsWith("dist/")) throw bootstrapError("UNEXPECTED_ARCHIVE_MEMBER", `Unexpected native pnpm archive member: ${name}.`);
  }
  if (!names.includes("pnpm") || !names.includes("dist")) throw bootstrapError("ARCHIVE_LAYOUT_INVALID", "Native pnpm archive must contain regular pnpm and dist/ members.");

  const verboseMembers = verboseText.split(/\r?\n/).map(parseVerboseMember).filter(Boolean);
  if (verboseMembers.length !== names.length) throw bootstrapError("ARCHIVE_METADATA_INVALID", "Native pnpm archive listing and metadata counts differ.");
  const typesByName = new Map();
  for (const member of verboseMembers) {
    if (typesByName.has(member.name)) throw bootstrapError("ARCHIVE_METADATA_INVALID", `Native pnpm archive lists member more than once: ${member.name}.`);
    typesByName.set(member.name, member.type);
    if (!["-", "d", "h"].includes(member.type)) throw bootstrapError("UNSAFE_ARCHIVE", `Native pnpm archive contains unsupported special member ${member.name}.`);
    if (member.type === "h" && !names.includes(member.linkTarget)) throw bootstrapError("UNSAFE_ARCHIVE", `Native pnpm hardlink target is not present: ${member.linkTarget}.`);
  }
  if (typesByName.get("pnpm") !== "-") throw bootstrapError("ARCHIVE_LAYOUT_INVALID", "Native pnpm archive pnpm member must be regular, not a link or directory.");
  if (typesByName.get("dist") !== "d") throw bootstrapError("ARCHIVE_LAYOUT_INVALID", "Native pnpm archive dist member must be a directory.");
  return { names, typesByName };
}

async function inspectArchive(archivePath) {
  const listing = await runCommand("tar", ["--list", "--gzip", "--file", archivePath]);
  if (listing.exitCode !== 0) throw bootstrapError("ARCHIVE_READ_FAILURE", `Unable to list native pnpm archive: ${sanitizeDiagnostic(listing.output)}`);
  const verbose = await runCommand("tar", ["--list", "--verbose", "--full-time", "--quoting-style=escape", "--gzip", "--file", archivePath]);
  if (verbose.exitCode !== 0) throw bootstrapError("ARCHIVE_READ_FAILURE", `Unable to inspect native pnpm archive metadata: ${sanitizeDiagnostic(verbose.output)}`);
  return validateArchiveMembers(listing.output, verbose.output);
}

async function assertRegularExecutable(path, label) {
  const info = await lstat(path).catch(() => null);
  if (!info || !info.isFile() || (info.mode & 0o111) === 0) throw bootstrapError("ARCHIVE_LAYOUT_INVALID", `${label} must be a regular executable file.`);
  return info;
}

async function assertDirectory(path, label) {
  const info = await lstat(path).catch(() => null);
  if (!info || !info.isDirectory()) throw bootstrapError("ARCHIVE_LAYOUT_INVALID", `${label} must be a directory.`);
  return info;
}

async function versionFromExecutable(path, root) {
  const result = await runCommand(path, ["--version"], { cwd: root, timeoutMs: 10_000 });
  const version = result.output.trim().split(/\r?\n/).at(-1) ?? "";
  if (result.exitCode !== 0) throw bootstrapError("NATIVE_EXECUTION_FAILURE", `Verified native pnpm executable did not start: ${sanitizeDiagnostic(result.output)}`);
  return version;
}

async function readAttestation(path) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch { return null; }
}

async function existingInstallation(base, target, packageManager, root) {
  const markerPath = resolve(base, ".pnpm-native-bootstrap.json");
  const marker = await readAttestation(markerPath);
  if (!marker) return null;
  const expectedExecutable = resolve(base, "bin", target.entrypoint);
  if (marker.status !== "PASS" || marker.version !== packageManager.version || marker.target !== target.key || marker.archive_sha256 !== target.sha256 || marker.executable !== expectedExecutable) {
    throw bootstrapError("DESTINATION_CONFLICT", `Owned pnpm destination has an attestation for a different release: ${base}.`);
  }
  await assertRegularExecutable(expectedExecutable, "Existing native pnpm executable");
  await assertDirectory(resolve(base, target.runtime_directory), "Existing native pnpm runtime directory");
  const version = await versionFromExecutable(expectedExecutable, root);
  if (version !== packageManager.version) throw bootstrapError("NATIVE_VERSION_MISMATCH", `Existing native pnpm reports ${version}, expected ${packageManager.version}.`);
  return { base, binDir: resolve(base, "bin"), executable: expectedExecutable, version, archiveSource: "existing_attestation", archiveSha256: target.sha256 };
}

async function destinationState(base) {
  const info = await lstat(base).catch(() => null);
  if (!info) return "absent";
  if (info.isSymbolicLink()) throw bootstrapError("DESTINATION_UNSAFE", `Native pnpm destination must not be a symlink: ${base}.`);
  if (!info.isDirectory()) throw bootstrapError("DESTINATION_CONFLICT", `Native pnpm destination is not a directory: ${base}.`);
  const entries = await readdir(base);
  return entries.length === 0 ? "empty" : "occupied";
}

async function installArchive({ archivePath, archiveSha256, target, packageManager, root, destination }) {
  const base = resolve(destination);
  const state = await destinationState(base);
  const prior = await existingInstallation(base, target, packageManager, root);
  if (prior) return prior;
  if (state === "occupied") throw bootstrapError("DESTINATION_CONFLICT", `Native pnpm destination is occupied without a matching attestation: ${base}.`);
  await mkdir(dirname(base), { recursive: true });
  if (state === "empty") await rmdir(base);

  const extractionDir = await mkdtemp(resolve(tmpdir(), "ch001r4-pnpm-extract-"));
  const stageDir = await mkdtemp(resolve(dirname(base), ".ch001r4-pnpm-stage-"));
  try {
    const extraction = await runCommand("tar", ["--extract", "--gzip", "--file", archivePath, "--directory", extractionDir, "--no-same-owner", "--no-same-permissions", "--no-overwrite-dir"]);
    if (extraction.exitCode !== 0) throw bootstrapError("ARCHIVE_EXTRACTION_FAILURE", `Unable to extract the verified native pnpm archive: ${sanitizeDiagnostic(extraction.output)}`);
    const extractedExecutable = resolve(extractionDir, target.entrypoint);
    const extractedRuntime = resolve(extractionDir, target.runtime_directory);
    await assertRegularExecutable(extractedExecutable, "Extracted native pnpm executable");
    await assertDirectory(extractedRuntime, "Extracted native pnpm runtime directory");
    const stagedExecutable = resolve(stageDir, "bin", target.entrypoint);
    const stagedRuntime = resolve(stageDir, target.runtime_directory);
    await mkdir(dirname(stagedExecutable), { recursive: true });
    await cp(extractedExecutable, stagedExecutable, { force: false, errorOnExist: true });
    await chmod(stagedExecutable, 0o755);
    await cp(extractedRuntime, stagedRuntime, { recursive: true, force: false, errorOnExist: true });
    await assertRegularExecutable(stagedExecutable, "Staged native pnpm executable");
    const version = await versionFromExecutable(stagedExecutable, root);
    if (version !== packageManager.version) throw bootstrapError("NATIVE_VERSION_MISMATCH", `Downloaded native pnpm reports ${version}, expected ${packageManager.version}.`);
    const marker = {
      schema_version: 1,
      status: "PASS",
      package_manager: packageManager.pin,
      version: packageManager.version,
      target: target.key,
      archive: target.asset,
      archive_sha256: archiveSha256,
      archive_member: target.entrypoint,
      runtime_directory: target.runtime_directory,
      executable: resolve(base, "bin", target.entrypoint),
      installed_at: new Date().toISOString()
    };
    await writeFile(resolve(stageDir, ".pnpm-native-bootstrap.json"), `${JSON.stringify(marker, null, 2)}\n`, { mode: 0o640 });
    await rename(stageDir, base);
    return { base, binDir: resolve(base, "bin"), executable: resolve(base, "bin", target.entrypoint), version, archiveSource: "downloaded_archive", archiveSha256 };
  } finally {
    await rm(extractionDir, { recursive: true, force: true });
    await rm(stageDir, { recursive: true, force: true });
  }
}

async function updateGithubPath(binDir) {
  const githubPath = process.env.GITHUB_PATH;
  if (!githubPath) return false;
  const current = await readFile(githubPath, "utf8").catch(() => "");
  const lines = current.split(/\r?\n/).filter(Boolean);
  if (!lines.includes(binDir)) await appendFile(githubPath, `${binDir}\n`);
  return true;
}

function defaultDestination() {
  const owner = process.env.RUNNER_TEMP ?? process.env.TMPDIR ?? tmpdir();
  return resolve(owner, "open-slideshow-studio-pnpm");
}

function parseArgs(argv) {
  const options = { manifest: DEFAULT_MANIFEST, destination: process.env.PNPM_BOOTSTRAP_DIR ?? defaultDestination(), report: process.env.PNPM_BOOTSTRAP_REPORT ?? null, archive: process.env.PNPM_BOOTSTRAP_ARCHIVE ?? null, printBinDir: false, noGithubPath: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === "--manifest" || arg === "--destination" || arg === "--report" || arg === "--archive") {
      if (!next || next.startsWith("--")) throw new Error(`${arg} requires a value`);
      const key = arg.slice(2).replace("-", "");
      options[key === "printBinDir" ? "printBinDir" : key] = next;
      index += 1;
    } else if (arg === "--print-bin-dir") options.printBinDir = true;
    else if (arg === "--no-github-path") options.noGithubPath = true;
    else if (arg === "--help") options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function help() {
  return [
    "Usage: node scripts/ci/pnpm-bootstrap.mjs [options]",
    "  --manifest PATH       checked-in native release manifest",
    "  --destination PATH    explicitly owned installation directory",
    "  --report PATH         dependency-free bootstrap attestation output",
    "  --archive PATH        test/local archive override; digest is still pinned and verified",
    "  --print-bin-dir       print only the verified bin directory to stdout",
    "  --no-github-path      do not update GITHUB_PATH"
  ].join("\n");
}

async function writeReport(path, report) {
  if (!path) return;
  await mkdir(dirname(resolve(path)), { recursive: true });
  await writeFile(resolve(path), `${JSON.stringify(report, null, 2)}\n`, { mode: 0o640 });
}

export async function bootstrap(options = {}) {
  const startedAt = new Date().toISOString();
  const root = resolve(options.root ?? process.cwd());
  const reportPath = options.report ? resolve(options.report) : null;
  let context = { package_manager: null, version: null, target: null, archive: null, archive_sha256: null, destination: options.destination ? resolve(options.destination) : null, executable: null, runtime_directory: null };
  try {
    const rawManifest = await readJson(resolve(options.manifest ?? DEFAULT_MANIFEST), "native pnpm manifest");
    const manifest = validateManifest(rawManifest);
    const packageManager = await readProjectPin(root);
    if (packageManager.pin !== manifest.packageManager.pin) throw bootstrapError("PACKAGE_MANAGER_PIN_DRIFT", `package.json pins ${packageManager.pin}, but the native release manifest pins ${manifest.packageManager.pin}.`);
    const target = selectTarget({}, manifest);
    context = { package_manager: packageManager.pin, version: packageManager.version, target: target.key, archive: target.asset, archive_sha256: target.sha256, destination: resolve(options.destination ?? process.env.PNPM_BOOTSTRAP_DIR ?? defaultDestination()), executable: resolve(options.destination ?? process.env.PNPM_BOOTSTRAP_DIR ?? defaultDestination(), "bin", target.entrypoint), runtime_directory: resolve(options.destination ?? process.env.PNPM_BOOTSTRAP_DIR ?? defaultDestination(), target.runtime_directory) };
    let existing = await existingInstallation(context.destination, target, packageManager, root);
    let archiveSource = "existing_attestation";
    let archiveSha256 = target.sha256;
    let downloadAttempts = 0;
    if (!existing) {
      const downloadDir = await mkdtemp(resolve(tmpdir(), "ch001r4-pnpm-download-"));
      const archivePath = options.archive ? resolve(options.archive) : resolve(downloadDir, target.asset);
      try {
        if (options.archive) {
          const archiveInfo = await lstat(archivePath).catch(() => null);
          if (!archiveInfo?.isFile()) throw bootstrapError("ARCHIVE_READ_FAILURE", `Native pnpm archive is not a regular file: ${archivePath}.`);
        } else {
          const download = await downloadArchive(target.url, archivePath);
          downloadAttempts = download.attempts;
        }
        archiveSha256 = await sha256File(archivePath);
        if (archiveSha256 !== target.sha256) throw bootstrapError("ARCHIVE_INTEGRITY_FAILURE", `Native pnpm archive SHA-256 ${archiveSha256} does not match the checked-in pin ${target.sha256}.`);
        await inspectArchive(archivePath);
        const installed = await installArchive({ archivePath, archiveSha256, target, packageManager, root, destination: context.destination });
        existing = installed;
        archiveSource = installed.archiveSource;
      } finally {
        if (!options.archive) await rm(downloadDir, { recursive: true, force: true });
      }
    }
    const pathUpdated = options.noGithubPath ? false : await updateGithubPath(existing.binDir);
    const report = {
      schema_version: 1,
      record_kind: "PNPM_NATIVE_BOOTSTRAP",
      phase: "CH-001R-r4",
      status: "PASS",
      package_manager: packageManager.pin,
      version: packageManager.version,
      target: target.key,
      asset: { name: target.asset, url: target.url, sha256: target.sha256 },
      archive_source: archiveSource,
      archive_sha256: archiveSha256,
      download_attempts: downloadAttempts,
      archive_member: target.entrypoint,
      runtime_directory: target.runtime_directory,
      destination: existing.base,
      bin_dir: existing.binDir,
      executable: existing.executable,
      executable_version: existing.version,
      path_updated: pathUpdated,
      started_at: startedAt,
      ended_at: new Date().toISOString(),
      error_classification: null,
      error: null
    };
    await writeReport(reportPath, report);
    return report;
  } catch (error) {
    const classification = error instanceof BootstrapError ? error.classification : "BOOTSTRAP_UNEXPECTED_FAILURE";
    const message = sanitizeDiagnostic(error instanceof Error ? error.message : String(error));
    const report = {
      schema_version: 1,
      record_kind: "PNPM_NATIVE_BOOTSTRAP",
      phase: "CH-001R-r4",
      status: "FAIL",
      ...context,
      started_at: startedAt,
      ended_at: new Date().toISOString(),
      error_classification: classification,
      error: message
    };
    await writeReport(reportPath, report).catch(() => undefined);
    throw error;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(help());
    return;
  }
  try {
    const report = await bootstrap(options);
    if (options.printBinDir) console.log(report.bin_dir);
    else console.error(`Verified native pnpm ${report.executable_version} at ${report.executable}`);
  } catch (error) {
    const message = sanitizeDiagnostic(error instanceof Error ? error.message : String(error));
    console.error(`Native pnpm bootstrap failed: ${message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
