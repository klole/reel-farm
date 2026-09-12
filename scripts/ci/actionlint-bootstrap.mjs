#!/usr/bin/env node
/* global process, console, setTimeout, clearTimeout */

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  appendFile,
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile
} from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, isAbsolute, join, posix, relative, resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";
import https from "node:https";

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PROVENANCE = resolve(SCRIPT_DIRECTORY, "actionlint-provenance.json");
const EXPECTED_VERSION = "1.7.7";
const EXPECTED_ARCHIVE = "actionlint_1.7.7_linux_amd64.tar.gz";
const EXPECTED_ARCHIVE_URL = "https://github.com/rhysd/actionlint/releases/download/v1.7.7/actionlint_1.7.7_linux_amd64.tar.gz";
const EXPECTED_ARCHIVE_SHA256 = "023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757";
const EXPECTED_EXECUTABLE_SHA256 = "9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c";
const DEFAULT_DOWNLOAD_RETRIES = 3;
const DEFAULT_DOWNLOAD_TIMEOUT_MS = 20_000;
const DEFAULT_MAX_REDIRECTS = 5;
const DEFAULT_COMMAND_TIMEOUT_MS = 30_000;

export class ActionlintBootstrapError extends Error {
  constructor(classification, message, details = {}) {
    super(message);
    this.name = "ActionlintBootstrapError";
    this.classification = classification;
    this.details = details;
    this.exitCode = 1;
  }
}

function bootstrapError(classification, message, details = {}) {
  return new ActionlintBootstrapError(classification, message, details);
}

function now() {
  return new Date().toISOString();
}

export function sanitizeDiagnostic(value) {
  const text = [...String(value)].filter((character) => {
    const code = character.charCodeAt(0);
    return !(code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127);
  }).join("");
  return text
    .replace(/(?:postgres(?:ql)?:\/\/)[^\s"'`]+/gi, "postgres://<redacted>")
    .replace(/\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_-]+/g, "<redacted-token>")
    .replace(/(authorization\s*[:=]\s*bearer\s+)[^\s]+/gi, "$1<redacted>")
    .replace(/((?:password|passwd|secret|token|cookie)\s*[:=]\s*)[^\s,;]+/gi, "$1<redacted>")
    .slice(-6_000);
}

function safeText(value, fallback = null) {
  if (value === null || value === undefined) return fallback;
  const text = String(value);
  return text.length > 0 ? text : fallback;
}

function safeSha(value) {
  return typeof value === "string" && /^[0-9a-f]{40}$/.test(value) ? value : null;
}

function safeSha256(value) {
  return typeof value === "string" && /^[0-9a-f]{64}$/.test(value) ? value : null;
}

function assertSingleLine(value, label) {
  if (typeof value !== "string" || value.length === 0 || /[\0\r\n]/.test(value)) {
    throw bootstrapError("INPUT_INVALID", `${label} must be a non-empty single-line value.`);
  }
  return value;
}

export function assertAbsolutePath(value, label) {
  const text = assertSingleLine(value, label);
  if (!isAbsolute(text)) throw bootstrapError("INPUT_INVALID", `${label} must be an absolute path.`);
  return resolve(text);
}

function numericIdentifier(value, label, minimum = 0) {
  const text = assertSingleLine(value, label);
  if (!/^\d+$/.test(text) || Number(text) < minimum || !Number.isSafeInteger(Number(text))) {
    throw bootstrapError("INPUT_INVALID", `${label} must be a numeric identifier of at least ${minimum}.`);
  }
  return text;
}

function pathOverlaps(first, second) {
  if (!first || !second) return false;
  const left = resolve(first);
  const right = resolve(second);
  const leftToRight = relative(left, right);
  const rightToLeft = relative(right, left);
  const isContained = (value) => value === "" || (!value.startsWith("..") && !isAbsolute(value));
  return isContained(leftToRight) || isContained(rightToLeft);
}

function requireNonOverlapping(path, other, label) {
  if (pathOverlaps(path, other)) throw bootstrapError("INPUT_INVALID", `${label} must be separate from ${other}.`);
}

function environmentValue(environment, key, fallback = undefined) {
  return environment[key] === undefined ? fallback : environment[key];
}

export function assertSupportedPlatform({ platform = process.platform, arch = process.arch } = {}) {
  if (platform !== "linux") {
    throw bootstrapError("UNSUPPORTED_PLATFORM", `Unsupported actionlint platform: ${platform}; only Linux amd64 is pinned.`);
  }
  if (arch !== "x64") {
    throw bootstrapError("UNSUPPORTED_ARCHITECTURE", `Unsupported actionlint architecture: ${arch}; only Linux amd64 is pinned.`);
  }
  return { platform, arch, distribution_architecture: "amd64" };
}

function assertString(value, label) {
  return assertSingleLine(value, label);
}

function assertSha256(value, label) {
  if (!safeSha256(value)) throw bootstrapError("PROVENANCE_INVALID", `${label} must be a lowercase SHA-256 digest.`);
  return value;
}

export function validateProvenance(provenance, { enforcePinned = true } = {}) {
  if (!provenance || typeof provenance !== "object" || Array.isArray(provenance)) {
    throw bootstrapError("PROVENANCE_INVALID", "Pinned actionlint provenance must be a JSON object.");
  }
  if (provenance.name !== "actionlint" || provenance.version !== EXPECTED_VERSION || provenance.release_tag !== `v${EXPECTED_VERSION}`) {
    throw bootstrapError("PROVENANCE_INVALID", `Pinned actionlint provenance must identify version ${EXPECTED_VERSION}.`);
  }
  const distribution = provenance.distribution;
  if (!distribution || typeof distribution !== "object" || Array.isArray(distribution)) {
    throw bootstrapError("PROVENANCE_INVALID", "Pinned actionlint distribution metadata is missing.");
  }
  const archive = assertString(distribution.archive, "Pinned actionlint archive");
  const archiveUrl = assertString(distribution.archive_url, "Pinned actionlint archive URL");
  const archiveSha256 = assertSha256(distribution.archive_sha256, "Pinned actionlint archive SHA-256");
  const executable = assertString(distribution.executable, "Pinned actionlint executable");
  const executableSha256 = assertSha256(distribution.executable_sha256, "Pinned actionlint executable SHA-256");
  if (distribution.platform !== "linux" || distribution.architecture !== "amd64") {
    throw bootstrapError("PROVENANCE_INVALID", "Pinned actionlint distribution must be Linux amd64.");
  }
  if (!archiveUrl.startsWith("https://")) throw bootstrapError("PROVENANCE_INVALID", "Pinned actionlint archive URL must use HTTPS.");
  if (executable !== "actionlint") throw bootstrapError("PROVENANCE_INVALID", "Pinned actionlint executable member must be actionlint.");
  if (enforcePinned && (archive !== EXPECTED_ARCHIVE || archiveUrl !== EXPECTED_ARCHIVE_URL || archiveSha256 !== EXPECTED_ARCHIVE_SHA256 || executableSha256 !== EXPECTED_EXECUTABLE_SHA256)) {
    throw bootstrapError("PROVENANCE_INVALID", "Checked-in actionlint provenance does not match the approved v1.7.7 Linux amd64 pin.");
  }
  return {
    ...provenance,
    distribution: {
      ...distribution,
      archive,
      archive_url: archiveUrl,
      archive_sha256: archiveSha256,
      executable,
      executable_sha256: executableSha256
    }
  };
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw bootstrapError("INPUT_READ_FAILURE", `Unable to read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function readPinnedProvenance(path = DEFAULT_PROVENANCE) {
  return validateProvenance(await readJson(path, "pinned actionlint provenance"));
}

export async function sha256File(path) {
  const hash = createHash("sha256");
  return new Promise((resolveHash, rejectHash) => {
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", rejectHash);
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
      rejectDownload(bootstrapError("DOWNLOAD_URL_INVALID", `Invalid actionlint download URL: ${error instanceof Error ? error.message : String(error)}`));
      return;
    }
    if (parsed.protocol !== "https:") {
      rejectDownload(bootstrapError("DOWNLOAD_URL_INSECURE", "Actionlint downloads must use HTTPS."));
      return;
    }
    let settled = false;
    const settle = (callback, value) => {
      if (settled) return;
      settled = true;
      callback(value);
    };
    const request = https.get(parsed, { headers: { "User-Agent": "open-slideshow-studio-ci/0.1" } }, (response) => {
      const status = response.statusCode ?? 0;
      if (status >= 300 && status < 400 && response.headers.location) {
        response.resume();
        if (redirectsRemaining <= 0) {
          settle(rejectDownload, bootstrapError("DOWNLOAD_REDIRECT_LIMIT", "Actionlint download exceeded the HTTPS redirect limit."));
          return;
        }
        let redirectUrl;
        try {
          redirectUrl = new URL(response.headers.location, parsed).toString();
        } catch (error) {
          settle(rejectDownload, bootstrapError("DOWNLOAD_URL_INVALID", `Invalid actionlint redirect: ${error instanceof Error ? error.message : String(error)}`));
          return;
        }
        if (new URL(redirectUrl).protocol !== "https:") {
          settle(rejectDownload, bootstrapError("DOWNLOAD_URL_INSECURE", "Actionlint download redirects must remain HTTPS."));
          return;
        }
        downloadOnce(redirectUrl, destination, timeoutMs, redirectsRemaining - 1).then(
          (value) => settle(resolveDownload, value),
          (error) => settle(rejectDownload, error)
        );
        return;
      }
      if (status < 200 || status >= 300) {
        response.resume();
        settle(rejectDownload, bootstrapError("DOWNLOAD_HTTP_FAILURE", `Actionlint download returned HTTP ${status}.`));
        return;
      }
      import("node:fs").then(({ createWriteStream }) => {
        const output = createWriteStream(destination, { flags: "w", mode: 0o600 });
        const fail = (error) => {
          output.destroy();
          settle(rejectDownload, error);
        };
        response.on("error", fail);
        output.on("error", fail);
        output.on("finish", () => {
          output.close(() => settle(resolveDownload, undefined));
        });
        response.pipe(output);
      }, (error) => settle(rejectDownload, error));
    });
    request.setTimeout(timeoutMs, () => request.destroy(new Error(`download timed out after ${timeoutMs}ms`)));
    request.on("error", (error) => settle(rejectDownload, error));
  });
}

export async function downloadArchive(url, destination, { retries = DEFAULT_DOWNLOAD_RETRIES, timeoutMs = DEFAULT_DOWNLOAD_TIMEOUT_MS } = {}) {
  if (!Number.isInteger(retries) || retries < 1 || retries > 5) throw bootstrapError("INPUT_INVALID", "Actionlint download retries must be between 1 and 5.");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 120_000) throw bootstrapError("INPUT_INVALID", "Actionlint download timeout must be between 100ms and 120000ms.");
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
  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw bootstrapError("DOWNLOAD_FAILURE", `Unable to download the pinned actionlint archive after ${retries} attempts: ${sanitizeDiagnostic(detail)}`, { cause: lastError?.classification ?? null });
}

function validateMemberName(rawName) {
  const name = rawName.endsWith("/") ? rawName.slice(0, -1) : rawName;
  if (!name || name.includes("\\") || name.includes("\u0000") || /[\r\n\t]/.test(name)) {
    throw bootstrapError("UNSAFE_ARCHIVE", `Unsafe actionlint archive member name: ${JSON.stringify(rawName)}.`);
  }
  if (name.startsWith("/") || /^[A-Za-z]:\//.test(name)) {
    throw bootstrapError("UNSAFE_ARCHIVE", `Absolute actionlint archive member is not allowed: ${JSON.stringify(rawName)}.`);
  }
  const segments = name.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    throw bootstrapError("UNSAFE_ARCHIVE", `Traversal or empty actionlint archive member: ${JSON.stringify(rawName)}.`);
  }
  const normalized = posix.normalize(name);
  if (normalized !== name || normalized.startsWith("../")) {
    throw bootstrapError("UNSAFE_ARCHIVE", `Non-normalized actionlint archive member: ${JSON.stringify(rawName)}.`);
  }
  return name;
}

function parseVerboseMember(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const type = trimmed[0];
  if (!["-", "d"].includes(type)) {
    throw bootstrapError("UNSAFE_ARCHIVE", `Actionlint archive contains unsupported member type: ${JSON.stringify(trimmed.slice(0, 300))}.`);
  }
  const dateMatch = trimmed.match(/^\S+\s+.*?\s+\d+\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?\s+(.+)$/);
  if (!dateMatch) throw bootstrapError("UNSAFE_ARCHIVE", `Unable to parse actionlint archive metadata line: ${JSON.stringify(trimmed.slice(0, 300))}.`);
  return { type, name: validateMemberName(dateMatch[1]) };
}

export function validateArchiveMembers(namesText, verboseText) {
  const names = String(namesText).split(/\r?\n/).filter(Boolean).map(validateMemberName);
  if (names.length === 0) throw bootstrapError("UNSAFE_ARCHIVE", "The actionlint archive is empty.");
  if (!names.includes("actionlint")) throw bootstrapError("ARCHIVE_LAYOUT_INVALID", "The actionlint archive does not contain the intended actionlint executable.");

  const verboseMembers = String(verboseText).split(/\r?\n/).map(parseVerboseMember).filter(Boolean);
  if (verboseMembers.length !== names.length) throw bootstrapError("ARCHIVE_METADATA_INVALID", "Actionlint archive listing and metadata counts differ.");
  const typesByName = new Map();
  for (const member of verboseMembers) {
    if (typesByName.has(member.name)) throw bootstrapError("ARCHIVE_METADATA_INVALID", `Actionlint archive lists a member more than once: ${member.name}.`);
    typesByName.set(member.name, member.type);
    if (!names.includes(member.name)) throw bootstrapError("ARCHIVE_METADATA_INVALID", `Actionlint archive metadata contains an unlisted member: ${member.name}.`);
  }
  if (typesByName.get("actionlint") !== "-") throw bootstrapError("ARCHIVE_LAYOUT_INVALID", "The actionlint archive executable must be a regular file.");
  return { names, typesByName };
}

async function runCommand(command, argumentsList, { cwd = process.cwd(), timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS } = {}) {
  return new Promise((resolveCommand) => {
    const child = spawn(command, argumentsList, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolveCommand(result);
    };
    child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk) => { output += chunk.toString(); });
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      finish({ exitCode: 124, output: `${output}command timed out after ${timeoutMs}ms\n` });
    }, timeoutMs);
    child.on("error", (error) => finish({ exitCode: 1, output: `${output}${error.message}\n` }));
    child.on("close", (code) => finish({ exitCode: code ?? 1, output }));
  });
}

async function assertRegularExecutable(path, label) {
  const info = await lstat(path).catch(() => null);
  if (!info || !info.isFile() || (info.mode & 0o111) === 0) {
    throw bootstrapError("ARCHIVE_LAYOUT_INVALID", `${label} must be a regular executable file.`);
  }
  return info;
}

export async function verifyExecutable({ path, expectedSha256, expectedVersion = EXPECTED_VERSION, root = process.cwd(), timeoutMs = 10_000 }) {
  const executable = assertAbsolutePath(path, "Actionlint executable path");
  await assertRegularExecutable(executable, "Actionlint executable");
  const measuredSha256 = await sha256File(executable);
  if (measuredSha256 !== expectedSha256) {
    throw bootstrapError("EXECUTABLE_INTEGRITY_FAILURE", `Actionlint executable SHA-256 mismatch: expected ${expectedSha256}, measured ${measuredSha256}.`, { measuredSha256 });
  }
  const versionResult = await runCommand(executable, ["-version"], { cwd: root, timeoutMs });
  const versionMatch = versionResult.output.match(/(?:^|\n)\s*(\d+\.\d+\.\d+)(?:\s|$)/);
  const observedVersion = versionMatch?.[1] ?? null;
  if (versionResult.exitCode !== 0) {
    throw bootstrapError("EXECUTABLE_START_FAILURE", `Actionlint -version failed with exit ${versionResult.exitCode}: ${sanitizeDiagnostic(versionResult.output)}`, { observedVersion, versionOutput: versionResult.output });
  }
  if (observedVersion !== expectedVersion) {
    throw bootstrapError("VERSION_MISMATCH", `Expected actionlint ${expectedVersion}, observed ${observedVersion ?? "unknown"}.`, { observedVersion, versionOutput: versionResult.output });
  }
  return { path: executable, measuredSha256, observedVersion, versionOutput: sanitizeDiagnostic(versionResult.output), actualExit: 0 };
}

async function inspectArchive(archivePath) {
  const listing = await runCommand("tar", ["--list", "--gzip", "--file", archivePath]);
  if (listing.exitCode !== 0) throw bootstrapError("ARCHIVE_READ_FAILURE", `Unable to list the verified actionlint archive: ${sanitizeDiagnostic(listing.output)}`);
  const verbose = await runCommand("tar", ["--list", "--verbose", "--full-time", "--quoting-style=escape", "--gzip", "--file", archivePath]);
  if (verbose.exitCode !== 0) throw bootstrapError("ARCHIVE_READ_FAILURE", `Unable to inspect the verified actionlint archive: ${sanitizeDiagnostic(verbose.output)}`);
  return validateArchiveMembers(listing.output, verbose.output);
}

async function extractExecutable(archivePath, extractionDirectory) {
  const extraction = await runCommand("tar", ["--extract", "--gzip", "--file", archivePath, "--directory", extractionDirectory, "--no-same-owner", "--no-same-permissions", "--no-overwrite-dir", "--", "actionlint"]);
  if (extraction.exitCode !== 0) throw bootstrapError("ARCHIVE_EXTRACTION_FAILURE", `Unable to extract the verified actionlint executable: ${sanitizeDiagnostic(extraction.output)}`);
  return resolve(extractionDirectory, "actionlint");
}

async function appendGithubEnvironment(path, executable) {
  const existing = await readFile(path, "utf8").catch((error) => {
    if (error?.code === "ENOENT") return "";
    throw error;
  });
  const separator = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
  await appendFile(path, `${separator}ACTIONLINT_BIN=${executable}\n`, { mode: 0o600 });
}

function checkoutIdentity(environment) {
  return {
    requested_implementation_sha: safeSha(environment.REQUESTED_SHA),
    actual_checkout_sha: safeSha(environment.CH001_IMPLEMENTATION_COMMIT),
    workflow_definition_sha: safeSha(environment.CH001_WORKFLOW_SHA ?? environment.GITHUB_WORKFLOW_SHA),
    workflow_blob_sha: safeSha(environment.CH001_WORKFLOW_BLOB_SHA),
    workflow_file_sha256: safeSha256(environment.CH001_WORKFLOW_FILE_SHA256),
    repository: safeText(environment.GITHUB_REPOSITORY, "klole/reel-farm")
  };
}

function createInitialReport({ environment, root, platform, runId, runAttempt, archiveName = EXPECTED_ARCHIVE, executableName = "actionlint", archiveUrl, expectedArchiveSha256, expectedExecutableSha256 }) {
  return {
    schema_version: 1,
    record_kind: "ACTIONLINT_BOOTSTRAP_ATTESTATION",
    phase: "CH-001R-r8",
    status: "NOT_RUN",
    error_classification: null,
    error: null,
    actual_exit: null,
    root,
    platform: {
      operating_system: platform.platform,
      architecture: platform.arch,
      distribution_architecture: platform.distribution_architecture
    },
    run_id: runId,
    run_attempt: runAttempt,
    run_key: safeText(environment.CH001_RUN_ID),
    checkout_identity: checkoutIdentity(environment),
    version: EXPECTED_VERSION,
    archive: {
      name: archiveName,
      url: archiveUrl,
      expected_sha256: expectedArchiveSha256,
      measured_sha256: null,
      source: null,
      path: null,
      download_attempts: null
    },
    executable: {
      name: executableName,
      expected_sha256: expectedExecutableSha256,
      measured_sha256: null,
      path: null,
      observed_version: null,
      version_output: null,
      actual_exit: null
    },
    tool_directory: null,
    bin_dir: null,
    github_env: safeText(environment.GITHUB_ENV),
    path_updated: false,
    started_at: now(),
    ended_at: null
  };
}

async function writeReport(path, report) {
  if (!path) return;
  const reportPath = assertAbsolutePath(path, "Actionlint report path");
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o640 });
}

function contextFor(environment, root, writeGithubEnv) {
  const runId = numericIdentifier(environmentValue(environment, "GITHUB_RUN_ID"), "GITHUB_RUN_ID", 1);
  const runAttempt = numericIdentifier(environmentValue(environment, "GITHUB_RUN_ATTEMPT"), "GITHUB_RUN_ATTEMPT", 1);
  const runnerTemp = assertAbsolutePath(environmentValue(environment, "RUNNER_TEMP"), "RUNNER_TEMP");
  const githubEnv = writeGithubEnv ? assertAbsolutePath(environmentValue(environment, "GITHUB_ENV"), "GITHUB_ENV") : null;
  const rootPath = assertAbsolutePath(root, "Actionlint repository root");
  const evidenceRaw = environmentValue(environment, "CH001_EVIDENCE_ROOT");
  const evidenceRoot = evidenceRaw ? (isAbsolute(String(evidenceRaw)) ? assertAbsolutePath(evidenceRaw, "CH001_EVIDENCE_ROOT") : resolve(rootPath, assertSingleLine(evidenceRaw, "CH001_EVIDENCE_ROOT"))) : null;
  const sandboxRaw = environmentValue(environment, "CH001_SANDBOX_STATE_DIR");
  const sandboxState = sandboxRaw ? assertAbsolutePath(sandboxRaw, "CH001_SANDBOX_STATE_DIR") : null;
  return { runId, runAttempt, runnerTemp, githubEnv, root: rootPath, evidenceRoot, sandboxState };
}

export async function provisionActionlint(options = {}) {
  const environment = options.environment ?? process.env;
  const root = options.root ?? process.cwd();
  const reportPath = options.reportPath ?? environment.ACTIONLINT_BOOTSTRAP_REPORT ?? null;
  const writeGithubEnv = options.writeGithubEnv ?? true;
  let context;
  let platform;
  let report;
  let toolDirectory = null;
  let keepToolDirectory = false;
  try {
    platform = assertSupportedPlatform(options.platform ?? { platform: process.platform, arch: process.arch });
    const provenance = validateProvenance(options.provenance ?? await readPinnedProvenance(options.provenancePath ?? DEFAULT_PROVENANCE), { enforcePinned: options.enforcePinned ?? true });
    context = contextFor(environment, root, writeGithubEnv);
    report = createInitialReport({
      environment,
      root: context.root,
      platform,
      runId: context.runId,
      runAttempt: context.runAttempt,
      archiveName: provenance.distribution.archive,
      executableName: provenance.distribution.executable,
      archiveUrl: provenance.distribution.archive_url,
      expectedArchiveSha256: provenance.distribution.archive_sha256,
      expectedExecutableSha256: provenance.distribution.executable_sha256
    });
    await mkdir(context.runnerTemp, { recursive: true });
    toolDirectory = await mkdtemp(join(context.runnerTemp, `ch001r8-actionlint-${context.runId}-${context.runAttempt}-`));
    report.tool_directory = toolDirectory;
    report.bin_dir = toolDirectory;
    requireNonOverlapping(toolDirectory, context.evidenceRoot, "Actionlint tool directory");
    requireNonOverlapping(toolDirectory, context.sandboxState, "Actionlint tool directory");

    let archivePath;
    if (options.archivePath) {
      archivePath = assertAbsolutePath(options.archivePath, "Actionlint archive path");
      const archiveInfo = await lstat(archivePath).catch(() => null);
      if (!archiveInfo?.isFile()) throw bootstrapError("INPUT_INVALID", `Actionlint archive is not a regular file: ${archivePath}.`);
      report.archive.source = "local_override";
    } else {
      archivePath = resolve(toolDirectory, provenance.distribution.archive);
      report.archive.source = "downloaded_archive";
      const download = await downloadArchive(provenance.distribution.archive_url, archivePath, {
        retries: options.downloadRetries ?? DEFAULT_DOWNLOAD_RETRIES,
        timeoutMs: options.downloadTimeoutMs ?? DEFAULT_DOWNLOAD_TIMEOUT_MS
      });
      report.archive.download_attempts = download.attempts;
    }
    report.archive.path = archivePath;
    const measuredArchiveSha256 = await sha256File(archivePath);
    report.archive.measured_sha256 = measuredArchiveSha256;
    if (measuredArchiveSha256 !== provenance.distribution.archive_sha256) {
      throw bootstrapError("ARCHIVE_INTEGRITY_FAILURE", `Actionlint archive SHA-256 mismatch: expected ${provenance.distribution.archive_sha256}, measured ${measuredArchiveSha256}.`, { measuredArchiveSha256 });
    }

    await inspectArchive(archivePath);
    const extractionDirectory = await mkdtemp(join(context.runnerTemp, `ch001r8-actionlint-extract-${context.runId}-${context.runAttempt}-`));
    try {
      const extracted = await extractExecutable(archivePath, extractionDirectory);
      await verifyExecutable({
        path: extracted,
        expectedSha256: provenance.distribution.executable_sha256,
        expectedVersion: provenance.version,
        root: context.root
      });
      const installed = resolve(toolDirectory, provenance.distribution.executable);
      await writeFile(installed, await readFile(extracted), { mode: 0o700 });
      await chmod(installed, 0o755);
      const installedVerification = await verifyExecutable({
        path: installed,
        expectedSha256: provenance.distribution.executable_sha256,
        expectedVersion: provenance.version,
        root: context.root
      });
      report.executable.path = installedVerification.path;
      report.executable.measured_sha256 = installedVerification.measuredSha256;
      report.executable.observed_version = installedVerification.observedVersion;
      report.executable.version_output = installedVerification.versionOutput;
      report.executable.actual_exit = installedVerification.actualExit;
      report.path_updated = false;
      if (context.githubEnv) {
        await appendGithubEnvironment(context.githubEnv, installedVerification.path);
        report.path_updated = true;
      }
      report.status = "PASS";
      report.actual_exit = 0;
      keepToolDirectory = true;
      return { report, binPath: installedVerification.path };
    } finally {
      await rm(extractionDirectory, { recursive: true, force: true });
    }
  } catch (error) {
    const failure = error instanceof ActionlintBootstrapError ? error : bootstrapError("BOOTSTRAP_FAILURE", error instanceof Error ? error.message : String(error));
    if (!report) {
      report = createInitialReport({
        environment,
        root: safeText(root, process.cwd()),
        platform: platform ?? { platform: process.platform, arch: process.arch, distribution_architecture: "amd64" },
        runId: context?.runId ?? safeText(environment.GITHUB_RUN_ID),
        runAttempt: context?.runAttempt ?? safeText(environment.GITHUB_RUN_ATTEMPT),
        archiveName: safeText(options.provenance?.distribution?.archive, EXPECTED_ARCHIVE),
        executableName: safeText(options.provenance?.distribution?.executable, "actionlint"),
        archiveUrl: safeText(options.provenance?.distribution?.archive_url, EXPECTED_ARCHIVE_URL),
        expectedArchiveSha256: safeText(options.provenance?.distribution?.archive_sha256, EXPECTED_ARCHIVE_SHA256),
        expectedExecutableSha256: safeText(options.provenance?.distribution?.executable_sha256, EXPECTED_EXECUTABLE_SHA256)
      });
    }
    report.status = "FAIL";
    report.error_classification = failure.classification ?? "BOOTSTRAP_FAILURE";
    report.error = sanitizeDiagnostic(failure.message);
    report.actual_exit = failure.exitCode ?? 1;
    if (failure.details?.measuredSha256) report.executable.measured_sha256 = failure.details.measuredSha256;
    throw Object.assign(failure, { report });
  } finally {
    if (report) {
      report.ended_at = now();
      await writeReport(reportPath, report).catch((error) => {
        if (!keepToolDirectory && toolDirectory) return rm(toolDirectory, { recursive: true, force: true }).then(() => { throw error; });
        throw error;
      });
    }
    if (!keepToolDirectory && toolDirectory) await rm(toolDirectory, { recursive: true, force: true });
  }
}

function parseArguments(argumentsList) {
  const options = {
    reportPath: process.env.ACTIONLINT_BOOTSTRAP_REPORT ?? null,
    archivePath: process.env.ACTIONLINT_BOOTSTRAP_ARCHIVE ?? null,
    root: process.cwd(),
    printBin: false
  };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    const next = argumentsList[index + 1];
    if (["--report", "--archive", "--root"].includes(argument)) {
      if (!next || next.startsWith("--")) throw new Error(`${argument} requires a value.`);
      const key = argument === "--report" ? "reportPath" : argument === "--archive" ? "archivePath" : "root";
      options[key] = next;
      index += 1;
    } else if (argument === "--print-bin") options.printBin = true;
    else if (argument === "--help" || argument === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

function help() {
  return [
    "Usage: node scripts/ci/actionlint-bootstrap.mjs [--report PATH] [--print-bin]",
    "Downloads and verifies the checked-in actionlint 1.7.7 Linux amd64 pin before extraction.",
    "ACTIONLINT_BOOTSTRAP_ARCHIVE is a local test/archive override; its pinned digest is still required."
  ].join("\n");
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(help());
    return 0;
  }
  try {
    const result = await provisionActionlint(options);
    if (options.printBin) process.stdout.write(`${result.binPath}\n`);
    return 0;
  } catch (error) {
    console.error(`actionlint bootstrap failed: ${sanitizeDiagnostic(error instanceof Error ? error.message : String(error))}`);
    return error?.exitCode ?? 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((exitCode) => { process.exitCode = exitCode; }).catch((error) => {
    console.error(`actionlint bootstrap failed: ${sanitizeDiagnostic(error instanceof Error ? error.message : String(error))}`);
    process.exitCode = 1;
  });
}
