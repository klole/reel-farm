/* global process, console, setTimeout, clearTimeout */

import { appendFile, access, chmod, constants, mkdir, open, readFile, readdir, readlink, realpath, rm, stat, unlink, writeFile, rename } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { dirname, basename, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

export const R6_PHASE = "CH-001R-r6";
export const SANDBOX_LAUNCH_OPTIONS = Object.freeze({ headless: true, chromiumSandbox: true });

const RUN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{2,47}$/;
const PROFILE_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_.-]{2,127}$/;
const REVISION_PATTERN = /^(?:chromium|chromium_headless_shell)-[0-9]+$/;
const EXECUTABLE_LAYOUTS = [
  [/^chrome-linux(?:64)?$/, "chrome"],
  [/^chrome-headless-shell-linux(?:64)?$/, "headless_shell"]
];
const FORBIDDEN_SWITCHES = new Set([
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-seccomp-filter-sandbox",
  "--disable-namespace-sandbox",
  "--disable-gpu-sandbox"
]);
const APPARMOR_PROFILE_DIRECTORY = "/etc/apparmor.d";
const SYSCTL_PATHS = {
  apparmor_restrict_unprivileged_userns: "/proc/sys/kernel/apparmor_restrict_unprivileged_userns",
  unprivileged_userns_clone: "/proc/sys/kernel/unprivileged_userns_clone",
  max_user_namespaces: "/proc/sys/user/max_user_namespaces"
};

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function sanitizeText(value, limit = 4_000) {
  return [...String(value ?? "")].filter((character) => {
    const code = character.charCodeAt(0);
    return !(code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127);
  }).join("").slice(-limit);
}

function isMissing(error) {
  return error && typeof error === "object" && error.code === "ENOENT";
}

function isPathInside(parent, candidate) {
  const child = relative(parent, candidate);
  return Boolean(child) && !child.startsWith("..") && !isAbsolute(child);
}

function assertRunId(runId) {
  if (typeof runId !== "string" || !RUN_ID_PATTERN.test(runId)) throw new Error("CH001_RUN_ID must be a short lowercase run-owned identifier.");
  return runId;
}

function assertProfileName(profileName) {
  if (typeof profileName !== "string" || !PROFILE_NAME_PATTERN.test(profileName) || profileName === "." || profileName === "..") throw new Error("AppArmor profile name is invalid.");
  return profileName;
}

function assertSafeAttachment(executablePath, managedRoot = null) {
  if (typeof executablePath !== "string" || !isAbsolute(executablePath)) throw new Error("AppArmor attachment must be an absolute canonical path.");
  if (/[^A-Za-z0-9._/ -]/.test(executablePath) || /[\0\r\n]/.test(executablePath)) throw new Error("AppArmor attachment contains unsupported profile-language characters.");
  if (managedRoot && !isPathInside(managedRoot, executablePath)) throw new Error("AppArmor attachment must remain inside the managed browser root.");
  return executablePath;
}

export function sha256Bytes(value) {
  return createHash("sha256").update(value).digest("hex");
}

export async function sha256File(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

async function inspectCanonicalExecutable(inputPath, cwd = process.cwd()) {
  if (typeof inputPath !== "string" || inputPath.length === 0 || /[\0\r\n]/.test(inputPath)) throw new Error("Browser executable path is missing or contains a control character.");
  const requested = resolve(cwd, inputPath);
  const canonical = await realpath(requested);
  const details = await stat(canonical);
  if (!details.isFile()) throw new Error(`Managed browser target is not a regular file: ${canonical}`);
  await access(canonical, constants.X_OK);
  return { requested, canonical, details };
}

function inferManagedRoot(canonicalPath) {
  const pieces = canonicalPath.split(sep);
  const revisionIndex = pieces.findIndex((piece) => REVISION_PATTERN.test(piece));
  if (revisionIndex <= 0) throw new Error(`Pinned Playwright executable is not under a recognized managed browser revision: ${canonicalPath}`);
  return pieces.slice(0, revisionIndex).join(sep) || sep;
}

function assertManagedLayout(root, canonicalPath) {
  const child = relative(root, canonicalPath);
  if (!child || child.startsWith("..") || isAbsolute(child)) throw new Error("Pinned browser executable escapes its managed browser root.");
  const pieces = child.split(sep);
  if (pieces.length !== 3 || !REVISION_PATTERN.test(pieces[0])) throw new Error(`Unsupported managed Playwright browser layout: ${child}`);
  const layout = EXECUTABLE_LAYOUTS.find(([directory, filename]) => directory.test(pieces[1]) && pieces[2] === filename);
  if (!layout) throw new Error(`Unsupported managed Playwright browser executable layout: ${child}`);
  return { revision: pieces[0], platformDirectory: pieces[1], filename: pieces[2] };
}

/**
 * Resolve the exact executable selected by Playwright's pinned package. The
 * selected path is compared after realpath resolution and must use the
 * managed Playwright revision layout; a same-name system binary is rejected.
 */
export async function resolveManagedBrowserExecutable({
  playwrightExecutablePath,
  selectedExecutablePath = playwrightExecutablePath,
  browsersPath,
  cwd = process.cwd()
} = {}) {
  const managed = await inspectCanonicalExecutable(playwrightExecutablePath, cwd);
  const selected = await inspectCanonicalExecutable(selectedExecutablePath, cwd);
  if (managed.canonical !== selected.canonical) throw new Error(`Selected browser does not match Playwright's pinned executable: ${selected.canonical}`);

  const configuredRoot = browsersPath && browsersPath !== "0" ? resolve(cwd, browsersPath) : null;
  const root = await realpath(configuredRoot ?? inferManagedRoot(managed.canonical));
  const layout = assertManagedLayout(root, selected.canonical);
  const relativePath = relative(root, selected.canonical);
  const digest = await sha256File(selected.canonical);
  return {
    path: selected.canonical,
    requested_path: selected.requested,
    browsers_root: root,
    relative_path: relativePath,
    revision: layout.revision,
    platform_directory: layout.platformDirectory,
    filename: layout.filename,
    sha256: digest,
    mode: detailsMode(selected.details.mode),
    uid: selected.details.uid ?? null,
    gid: selected.details.gid ?? null,
    size_bytes: selected.details.size
  };
}

function detailsMode(mode) {
  return `0${(mode & 0o7777).toString(8).padStart(3, "0")}`;
}

export async function assertManagedBrowserIdentity({ resolution, ...options } = {}) {
  const current = await resolveManagedBrowserExecutable(options);
  if (!resolution || current.path !== resolution.path || current.sha256 !== resolution.sha256 || current.mode !== resolution.mode || current.uid !== resolution.uid || current.gid !== resolution.gid) {
    throw new Error(`Managed browser identity changed after qualification: expected ${resolution?.path ?? "missing"}/${resolution?.sha256 ?? "missing"}, observed ${current.path}/${current.sha256}.`);
  }
  return current;
}

export function makeProfileName(runId, suffix = `${process.pid}-${randomUUID().slice(0, 8)}`) {
  assertRunId(runId);
  const candidate = `ch001r6-${runId}-${suffix}`;
  return assertProfileName(candidate.slice(0, 128));
}

function escapeAppArmorQuoted(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

export function buildAppArmorProfile({ profileName, executablePath, managedRoot = null } = {}) {
  assertProfileName(profileName);
  const attachment = assertSafeAttachment(executablePath, managedRoot);
  return [
    "abi <abi/4.0>,",
    "include <tunables/global>",
    `profile ${profileName} "${escapeAppArmorQuoted(attachment)}" flags=(unconfined) {`,
    "  userns,",
    "}",
    ""
  ].join("\n");
}

export function profilePathForName(profileName, directory = APPARMOR_PROFILE_DIRECTORY) {
  assertProfileName(profileName);
  if (!isAbsolute(directory)) throw new Error("AppArmor profile directory must be absolute.");
  return resolve(directory, profileName);
}

export function policySpec({ runId, executablePath, executableSha256 = null, managedRoot = null, profileName, profileDirectory = APPARMOR_PROFILE_DIRECTORY } = {}) {
  const name = profileName ?? makeProfileName(runId);
  const content = buildAppArmorProfile({ profileName: name, executablePath, managedRoot });
  return {
    profile_name: name,
    profile_path: profilePathForName(name, profileDirectory),
    attachment: executablePath,
    executable_path: executablePath,
    executable_sha256: executableSha256,
    managed_browsers_root: managedRoot,
    content,
    sha256: sha256Bytes(content)
  };
}

/**
 * This guard is deliberately stricter than a normal local diagnostic. It is
 * evaluated before any sudo operation and is repeated from the root-only
 * install/remove entry points using the request record.
 */
export function checkHostedPolicyContext(env = process.env, { platform = process.platform, uid = typeof process.getuid === "function" ? process.getuid() : null } = {}) {
  const checks = [];
  const requireEqual = (name, actual, expected) => checks.push({ name, ok: actual === expected, actual: actual ?? null, expected });
  requireEqual("repository", env.GITHUB_REPOSITORY, "klole/reel-farm");
  requireEqual("event", env.GITHUB_EVENT_NAME, "workflow_dispatch");
  requireEqual("runner_environment", env.RUNNER_ENVIRONMENT, "github-hosted");
  requireEqual("runner_os", env.RUNNER_OS, "Linux");
  requireEqual("github_actions", env.GITHUB_ACTIONS, "true");
  if (env.REPOSITORY_PRIVATE !== undefined) requireEqual("public_repository", env.REPOSITORY_PRIVATE, "false");
  if (env.GITHUB_REF !== undefined) requireEqual("main_ref", env.GITHUB_REF, "refs/heads/main");
  checks.push({ name: "linux_process", ok: platform === "linux", actual: platform, expected: "linux" });
  checks.push({ name: "non_root_browser_uid", ok: Number.isInteger(uid) && uid > 0, actual: uid, expected: "positive uid" });
  requireEqual("sandbox_opt_in", String(env.CH001_SANDBOX_OPT_IN ?? "").toLowerCase(), "true");
  const requested = env.REQUESTED_SHA;
  const actual = env.CH001_IMPLEMENTATION_COMMIT;
  const identityOk = typeof requested === "string" && /^[0-9a-f]{40}$/.test(requested) && typeof actual === "string" && /^[0-9a-f]{40}$/.test(actual) && requested === actual;
  checks.push({ name: "requested_checkout_identity", ok: identityOk, actual: { requested: requested ?? null, actual: actual ?? null }, expected: "equal full SHA values" });
  const image = env.ImageOS ?? env.IMAGE_OS ?? null;
  if (image !== null) checks.push({ name: "ubuntu_image", ok: /ubuntu/i.test(image), actual: image, expected: "Ubuntu" });
  const failed = checks.filter((check) => !check.ok);
  return { allowed: failed.length === 0, checks, failures: failed.map((check) => `${check.name} check failed.`), browser_uid: uid };
}

export function classifyBrowserLaunchFailure(error) {
  const text = errorMessage(error);
  if (/no usable sandbox|sandbox.{0,40}(?:user.?namespace|apparmor|setuid)|user.?namespace|apparmor|setuid sandbox|unprivileged namespace/i.test(text)) return "APPARMOR_OR_USERNS_POLICY_BLOCK";
  if (/enoent|executable.{0,30}(?:does not exist|not found)|shared object|cannot open shared object|wrong architecture|invalid elf|permission denied/i.test(text)) return "BROWSER_EXECUTABLE_OR_DEPENDENCY_FAILURE";
  return "UNKNOWN_BROWSER_LAUNCH_FAILURE";
}

export function makeSandboxLaunchOptions({ executablePath, environment = process.env, timeoutMs = 30_000 } = {}) {
  if (!executablePath) throw new Error("A qualified browser executable path is required.");
  return {
    ...SANDBOX_LAUNCH_OPTIONS,
    executablePath,
    timeout: timeoutMs,
    env: {
      PATH: environment.PATH ?? "/usr/local/bin:/usr/bin:/bin",
      HOME: "/tmp",
      LANG: "C.UTF-8",
      LC_ALL: "C.UTF-8",
      ...(environment.PLAYWRIGHT_BROWSERS_PATH ? { PLAYWRIGHT_BROWSERS_PATH: environment.PLAYWRIGHT_BROWSERS_PATH } : {})
    }
  };
}

export function runExternal(command, args = [], { cwd = process.cwd(), env = process.env, timeoutMs = 15_000 } = {}) {
  return new Promise((resolveResult) => {
    const startedAt = new Date().toISOString();
    let output = "";
    let settled = false;
    let timer;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolveResult({ command: [command, ...args].join(" "), started_at: startedAt, ended_at: new Date().toISOString(), ...result, output: sanitizeText(output) });
    };
    let child;
    try {
      child = spawn(command, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
    } catch (error) {
      finish({ exit_code: 1, timed_out: false, error: sanitizeText(errorMessage(error)) });
      return;
    }
    child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk) => { output += chunk.toString(); });
    child.on("error", (error) => finish({ exit_code: 1, timed_out: false, error: sanitizeText(errorMessage(error)) }));
    child.on("close", (code) => finish({ exit_code: code ?? 1, timed_out: false, error: null }));
    timer = setTimeout(() => {
      child.kill("SIGTERM");
      finish({ exit_code: null, timed_out: true, error: `Command timed out after ${timeoutMs}ms.` });
    }, timeoutMs);
  });
}

async function findExecutable(command) {
  const candidates = command === "apparmor_parser"
    ? ["/usr/sbin/apparmor_parser", "/sbin/apparmor_parser", "/usr/bin/apparmor_parser"]
    : command === "aa-status"
      ? ["/usr/sbin/aa-status", "/sbin/aa-status", "/usr/bin/aa-status"]
      : String(process.env.PATH ?? "").split(":").filter(Boolean).map((directory) => resolve(directory, command));
  for (const candidate of candidates) {
    try { await access(candidate, constants.X_OK); return candidate; } catch { /* try next known location */ }
  }
  return null;
}

async function readOptional(path) {
  try { return await readFile(path, "utf8"); } catch { return null; }
}

async function readNumericSysctl(path) {
  const raw = await readOptional(path);
  if (raw === null) return { value: null, reason: "unavailable" };
  const value = raw.trim();
  if (!/^\d+$/.test(value)) return { value: null, reason: "unparseable" };
  return { value: Number(value), reason: null };
}

async function parseOsRelease() {
  const raw = await readOptional("/etc/os-release");
  if (raw === null) return { available: false, id: null, version_id: null, pretty_name: null };
  const values = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^"|"$/g, "").slice(0, 200);
  }
  return { available: true, id: values.ID ?? null, version_id: values.VERSION_ID ?? null, pretty_name: values.PRETTY_NAME ?? null };
}

async function readAppArmorFacts({ profileName = null, attachment = null } = {}) {
  const enabledRaw = await readOptional("/sys/module/apparmor/parameters/enabled");
  const enabled = enabledRaw === null ? null : /^Y$/i.test(enabledRaw.trim()) ? true : /^N$/i.test(enabledRaw.trim()) ? false : null;
  const parserPath = await findExecutable("apparmor_parser");
  const parserVersion = parserPath ? await runExternal(parserPath, ["--version"], { timeoutMs: 5_000 }) : null;
  const statusPath = await findExecutable("aa-status");
  const status = statusPath ? await runExternal(statusPath, ["--enabled"], { timeoutMs: 5_000 }) : null;
  const profilesRaw = await readOptional("/sys/kernel/security/apparmor/profiles");
  const needles = [profileName, attachment ? basename(attachment) : null].filter(Boolean).map((value) => String(value));
  const relevantProfiles = profilesRaw === null ? [] : profilesRaw.split(/\r?\n/).filter((line) => needles.some((needle) => line.includes(needle))).slice(0, 20).map((line) => sanitizeText(line, 500));
  return {
    enabled,
    enabled_reason: enabledRaw === null ? "unavailable" : enabled === null ? "unparseable" : null,
    parser: { available: Boolean(parserPath), path: parserPath, version: parserVersion ? sanitizeText(parserVersion.output, 500) : null, exit_code: parserVersion?.exit_code ?? null },
    status_command: { available: Boolean(statusPath), enabled_exit_code: status?.exit_code ?? null, enabled: status?.exit_code === 0 ? true : status?.exit_code === 1 ? false : null },
    profiles: { available: profilesRaw !== null, relevant: relevantProfiles, reason: profilesRaw === null ? "unavailable" : null }
  };
}

function parseStatusValue(status, key) {
  const match = status.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : null;
}

async function processFactsForExecutable(executablePath) {
  const entries = [];
  let procEntries;
  try { procEntries = await readdir("/proc"); } catch { return { available: false, processes: [], reason: "/proc is unavailable" }; }
  for (const pid of procEntries.filter((entry) => /^\d+$/.test(entry)).slice(0, 1_000)) {
    const base = resolve("/proc", pid);
    let processExecutable;
    try { processExecutable = (await readlink(resolve(base, "exe"))).replace(/ \(deleted\)$/, ""); } catch { continue; }
    if (resolve(processExecutable) !== resolve(executablePath)) continue;
    const [status, cmdline, userNamespace, pidNamespace, mountNamespace, networkNamespace, profile] = await Promise.all([
      readOptional(resolve(base, "status")),
      readFile(resolve(base, "cmdline")).then((value) => value.toString()).catch(() => null),
      readlink(resolve(base, "ns/user")).catch(() => null),
      readlink(resolve(base, "ns/pid")).catch(() => null),
      readlink(resolve(base, "ns/mnt")).catch(() => null),
      readlink(resolve(base, "ns/net")).catch(() => null),
      readOptional(resolve(base, "attr/current"))
    ]);
    const args = cmdline ? cmdline.split("\0").filter(Boolean) : [];
    const uidText = status ? parseStatusValue(status, "Uid") : null;
    const seccompText = status ? parseStatusValue(status, "Seccomp") : null;
    const seccompFiltersText = status ? parseStatusValue(status, "Seccomp_filters") : null;
    entries.push({
      pid: Number(pid),
      ppid: status ? Number((parseStatusValue(status, "PPid") ?? "0").split(/\s+/)[0]) : null,
      uid: uidText ? Number(uidText.split(/\s+/)[0]) : null,
      executable: processExecutable,
      is_renderer: args.includes("--type=renderer"),
      argument_count: args.length,
      forbidden_switches: args.filter((arg) => FORBIDDEN_SWITCHES.has(arg)),
      namespaces: { user: userNamespace, pid: pidNamespace, mnt: mountNamespace, net: networkNamespace },
      seccomp: { mode: seccompText === null ? null : Number(seccompText), filters: seccompFiltersText === null ? null : Number(seccompFiltersText) },
      apparmor_profile: profile ? sanitizeText(profile.trim(), 300) : null
    });
  }
  return { available: true, processes: entries, reason: null };
}

function chromeSandboxResult(body) {
  if (typeof body !== "string" || body.length === 0) return { result: null, excerpt: null, reason: "chrome://sandbox did not return readable content" };
  const excerpt = sanitizeText(body.replace(/\s+/g, " "), 2_000);
  if (/no usable sandbox|sandbox[^.]{0,50}(?:disabled|not active|not enabled|off)/i.test(excerpt)) return { result: "negative", excerpt, reason: "Chromium diagnostic page reported disabled or unavailable sandboxing" };
  if (/namespace sandbox|user namespace|seccomp|sandbox[^.]{0,50}(?:enabled|active|working|yes)/i.test(excerpt)) return { result: "positive", excerpt, reason: null };
  return { result: "unknown", excerpt, reason: "Chromium diagnostic page was available but had no recognized positive/negative marker" };
}

export async function collectKernelDenials({ executablePath, pids = [], profileName = null, startedAt = null } = {}) {
  const commands = [
    ["dmesg", ["--color=never", "--time-format=iso", "--level=err,warn,notice,info"]],
    ["journalctl", ["--no-pager", "--quiet", "--kernel", "--output=short-iso", "-n", "200"]]
  ];
  const results = [];
  const lines = [];
  for (const [command, args] of commands) {
    const result = await runExternal(command, args, { timeoutMs: 8_000 });
    results.push({ command, exit_code: result.exit_code, available: result.exit_code !== 1 || !/not found|enoent|permission denied|failed to read/i.test(result.error ?? result.output), error: result.error });
    if (result.exit_code === 0) lines.push(...result.output.split(/\r?\n/));
  }
  const pidStrings = pids.map((pid) => String(pid));
  const executableName = executablePath ? basename(executablePath) : null;
  const matched = lines.filter((line) => /apparmor|audit/i.test(line) && /denied|userns|user.?namespace|namespace/i.test(line)).filter((line) => {
    const tied = pidStrings.some((pid) => new RegExp(`(?:pid=|\\b)${pid}(?:\\b|\\s)`).test(line)) || Boolean(executableName && line.includes(executableName)) || Boolean(profileName && line.includes(profileName));
    return tied;
  }).map((line) => sanitizeText(line, 1_200)).slice(-20);
  return {
    available: results.some((result) => result.available),
    results,
    matched,
    tied_to_probe: matched.length > 0,
    started_at: startedAt,
    interpretation: matched.length > 0 ? "A bounded kernel/AppArmor denial excerpt matched the selected browser probe." : "No bounded denial tied to the selected browser probe was readable; absence is not evidence that no denial occurred."
  };
}

export async function collectHostSnapshot({ executablePath, profileName = null, attachment = executablePath, probePids = [] } = {}) {
  const [osRelease, kernel, uid, gid, sysctlEntries, apparmor, processes, denials] = await Promise.all([
    parseOsRelease(),
    runExternal("uname", ["-srvm"], { timeoutMs: 5_000 }),
    Promise.resolve(typeof process.getuid === "function" ? process.getuid() : null),
    Promise.resolve(typeof process.getgid === "function" ? process.getgid() : null),
    Promise.all(Object.entries(SYSCTL_PATHS).map(async ([key, path]) => [key, await readNumericSysctl(path)])),
    readAppArmorFacts({ profileName, attachment }),
    processFactsForExecutable(executablePath),
    collectKernelDenials({ executablePath, pids: probePids, profileName })
  ]);
  const sysctls = Object.fromEntries(sysctlEntries.map(([key, value]) => [key, value.value]));
  const sysctlReasons = Object.fromEntries(sysctlEntries.filter(([, value]) => value.reason).map(([key, value]) => [key, value.reason]));
  return {
    os_release: osRelease,
    kernel: kernel.exit_code === 0 ? sanitizeText(kernel.output, 500) : null,
    uid,
    gid,
    sysctls,
    sysctl_reasons: sysctlReasons,
    apparmor,
    process_facts: processes,
    kernel_denials: denials
  };
}

function withTimeout(operation, timeoutMs, label) {
  let timer;
  return Promise.race([
    operation,
    new Promise((_, reject) => { timer = setTimeout(() => reject(Object.assign(new Error(`${label} timed out after ${timeoutMs}ms.`), { timedOut: true })), timeoutMs); })
  ]).finally(() => { if (timer) clearTimeout(timer); });
}

/**
 * Run the real ordinary-user Playwright route with chromiumSandbox=true. The
 * default launcher uses a disposable persistent context so the probe owns a
 * temporary profile and can inspect process facts while Chromium is alive.
 */
export async function runSandboxProbe({ executablePath, environment = process.env, timeoutMs = 45_000, launchPersistentContext, processFacts = processFactsForExecutable } = {}) {
  const profileDir = await (async () => {
    const parent = environment.TMPDIR ? resolve(environment.TMPDIR) : tmpdir();
    await mkdir(parent, { recursive: true });
    return resolve(parent, `ch001r6-browser-${process.pid}-${randomUUID()}`);
  })();
  const launcher = launchPersistentContext ?? (async (directory, options) => {
    const { chromium } = await import("playwright");
    return chromium.launchPersistentContext(directory, options);
  });
  const startedAt = new Date().toISOString();
  let context;
  let processObservation = { available: false, processes: [], reason: "browser did not launch" };
  let chromeDiagnostic = { result: null, excerpt: null, reason: "not attempted" };
  let browserVersion = null;
  let rendered = false;
  let timedOut = false;
  let error = null;
  let launchPromise = null;
  try {
    launchPromise = Promise.resolve(launcher(profileDir, makeSandboxLaunchOptions({ executablePath, environment, timeoutMs: Math.min(timeoutMs, 30_000) })));
    launchPromise.catch(() => undefined);
    context = await withTimeout(launchPromise, timeoutMs, "sandboxed Chromium launch");
    const browser = typeof context.browser === "function" ? context.browser() : null;
    browserVersion = browser && typeof browser.version === "function" ? browser.version() : null;
    const page = await context.newPage();
    await withTimeout(page.setContent("<!doctype html><html><body><main id=probe>CH001-R6-SANDBOX-PROBE</main></body></html>", { waitUntil: "domcontentloaded", timeout: 10_000 }), 15_000, "sandbox probe content");
    rendered = (await page.locator("#probe").textContent()) === "CH001-R6-SANDBOX-PROBE";
    await page.close().catch(() => undefined);
    const diagnosticPage = await context.newPage();
    try {
      await diagnosticPage.goto("chrome://sandbox", { waitUntil: "domcontentloaded", timeout: 10_000 });
      chromeDiagnostic = chromeSandboxResult(await diagnosticPage.locator("body").innerText({ timeout: 5_000 }));
    } catch (diagnosticError) {
      chromeDiagnostic = { result: null, excerpt: null, reason: sanitizeText(`chrome://sandbox unavailable: ${errorMessage(diagnosticError)}`, 1_000) };
    } finally {
      await diagnosticPage.close().catch(() => undefined);
    }
    processObservation = await processFacts(executablePath);
  } catch (probeError) {
    timedOut = Boolean(probeError && typeof probeError === "object" && probeError.timedOut);
    error = sanitizeText(errorMessage(probeError));
    if (!context && launchPromise) void launchPromise.then((lateContext) => Promise.resolve(lateContext?.close?.()).catch(() => undefined)).catch(() => undefined);
    if (context) processObservation = await processFacts(executablePath);
  } finally {
    if (context) await context.close().catch(() => undefined);
    await rm(profileDir, { recursive: true, force: true }).catch(() => undefined);
  }
  const processes = processObservation.processes ?? [];
  const forbiddenSwitches = [...new Set(processes.flatMap((entry) => entry.forbidden_switches ?? []))];
  const rendererFacts = processes.filter((entry) => entry.is_renderer);
  const processPositive = rendererFacts.some((entry) => entry.seccomp?.mode === 2 && Boolean(entry.namespaces?.user));
  const launched = typeof browserVersion === "string" && browserVersion.length > 0 && rendered;
  let observed = null;
  if (launched) {
    if (forbiddenSwitches.length > 0 || chromeDiagnostic.result === "negative") observed = false;
    else if (chromeDiagnostic.result === "positive" || processPositive) observed = true;
  }
  return {
    sandbox_requested: true,
    launch_succeeded: launched,
    sandbox_observed: observed,
    browser_version: launched ? browserVersion : null,
    error,
    error_classification: error ? classifyBrowserLaunchFailure(error) : null,
    timed_out: timedOut,
    process_exit_code: null,
    synthetic_render: { attempted: true, content_marker: "CH001-R6-SANDBOX-PROBE", content_observed: rendered },
    diagnostic_evidence: [
      { kind: "chrome://sandbox", available: chromeDiagnostic.result !== null, result: chromeDiagnostic.result, excerpt: chromeDiagnostic.excerpt, reason: chromeDiagnostic.reason },
      { kind: "renderer-process-seccomp-and-userns", available: rendererFacts.length > 0, result: processPositive ? "positive" : rendererFacts.length > 0 ? "unknown" : null, renderer_count: rendererFacts.length, facts: rendererFacts.map((entry) => ({ pid: entry.pid, uid: entry.uid, seccomp: entry.seccomp, user_namespace: entry.namespaces?.user, apparmor_profile: entry.apparmor_profile })) },
      { kind: "effective-launch-switches", available: processes.length > 0, result: forbiddenSwitches.length === 0 ? "no-forbidden-switches-observed" : "forbidden-switch-observed", forbidden_switches: forbiddenSwitches }
    ],
    process_facts: processObservation,
    pids: processes.map((entry) => entry.pid),
    started_at: startedAt,
    ended_at: new Date().toISOString()
  };
}

async function writeJsonAtomic(path, value, mode = 0o640) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = resolve(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode });
  await rename(temporary, path);
  return path;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function appendGithubEnv(values) {
  const path = process.env.GITHUB_ENV;
  if (!path) return false;
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value)}`);
  await appendFile(path, `${lines.join("\n")}\n`);
  return true;
}

function reportOutsideProof(reportPath, evidenceRoot = process.env.CH001_EVIDENCE_ROOT) {
  if (!evidenceRoot) return true;
  const report = resolve(reportPath);
  const proof = resolve(evidenceRoot);
  return !isPathInside(proof, report) && report !== proof;
}

function baseReport({ runId, implementationCommit, workflowSha, resolution = null, context = null } = {}) {
  return {
    schema_version: 1,
    phase: R6_PHASE,
    run_id: runId,
    context: "host-proof-browser",
    implementation_commit: implementationCommit ?? null,
    workflow_definition_commit: workflowSha ?? null,
    requested_implementation_sha: process.env.REQUESTED_SHA ?? null,
    context_guard: context,
    selected_executable: resolution ? { path: resolution.path, sha256: resolution.sha256, browsers_root: resolution.browsers_root, revision: resolution.revision, mode: resolution.mode, uid: resolution.uid, gid: resolution.gid } : { path: null, sha256: null },
    uid: typeof process.getuid === "function" ? process.getuid() : null,
    apparmor_enabled: null,
    restriction_before: { ...Object.fromEntries(Object.keys(SYSCTL_PATHS).map((key) => [key, null])) },
    restriction_after: { ...Object.fromEntries(Object.keys(SYSCTL_PATHS).map((key) => [key, null])) },
    default_probe: { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, error: null },
    policy: { decision: "NOT_RUN", policy_changed: false, profile_name: null, profile_path: null, attachment: null, sha256: null, loaded: false },
    qualified_probe: { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, diagnostic_evidence: [] },
    cleanup: { status: "NOT_RUN", owned_resources_removed: null, ownership_record: null },
    global_policy: { before: null, after_policy: null, after_cleanup: null, unchanged: null },
    application_acceptance: false,
    accepted_application_version: "none",
    status: "NOT_RUN",
    error_classification: null,
    error: null,
    limitations: [],
    launch_site_coverage: [
      { site: "scripts/ch001-proof.ts host preflight", executable_source: "BROWSER_EXECUTABLE_PATH from qualified workflow path", sandbox_requested: true },
      { site: "playwright.config.ts host E2E/render", executable_source: "BROWSER_EXECUTABLE_PATH from qualified workflow path", sandbox_requested: true },
      { site: "scripts/ch001-lifecycle.ts host lifecycle", executable_source: "BROWSER_EXECUTABLE_PATH from qualified workflow path", sandbox_requested: true },
      { site: "apps/worker/src/index.ts container worker", executable_source: "image-local Playwright managed executable", sandbox_requested: true, separate_context: true }
    ]
  };
}

async function gitHead() {
  const result = await runExternal("git", ["rev-parse", "HEAD"], { timeoutMs: 5_000 });
  return result.exit_code === 0 ? result.output.trim() : null;
}

export function isSandboxQualified(probe) {
  return probe?.launch_succeeded === true && probe?.sandbox_observed === true;
}

function likelyPolicyFailure(probe) {
  return probe.error_classification === "APPARMOR_OR_USERNS_POLICY_BLOCK";
}

export function decideSandboxPolicy({ defaultProbe, context, apparmorEnabled, parserAvailable, ubuntuHost } = {}) {
  if (isSandboxQualified(defaultProbe)) return { decision: "NOT_NEEDED_DEFAULT_SANDBOX_WORKED", status: "HOST_SANDBOX_QUALIFIED", error_classification: null };
  if (defaultProbe?.launch_succeeded) return { decision: "NOT_INSTALLED_SANDBOX_OBSERVATION_INCONCLUSIVE", status: "BLOCKED_ENVIRONMENT", error_classification: "SANDBOX_OBSERVATION_INCONCLUSIVE" };
  if (!likelyPolicyFailure(defaultProbe)) return { decision: "NOT_INSTALLED_OTHER_LAUNCH_CAUSE", status: "BLOCKED_ENVIRONMENT", error_classification: defaultProbe?.error_classification ?? "UNKNOWN_BROWSER_LAUNCH_FAILURE" };
  if (!context?.allowed) return { decision: "NOT_INSTALLED_CONTEXT_NOT_AUTHORIZED", status: "BLOCKED_ENVIRONMENT", error_classification: "HOSTED_POLICY_CONTEXT_NOT_AUTHORIZED" };
  if (ubuntuHost === false) return { decision: "NOT_INSTALLED_UBUNTU_HOST_EXPECTATION_FAILED", status: "BLOCKED_ENVIRONMENT", error_classification: "HOST_OS_EXPECTATION_FAILED" };
  if (apparmorEnabled !== true || parserAvailable !== true) return { decision: "NOT_INSTALLED_APPARMOR_UNAVAILABLE", status: "BLOCKED_ENVIRONMENT", error_classification: "APPARMOR_POLICY_UNAVAILABLE" };
  return { decision: "INSTALL_EXACT_MANAGED_EXECUTABLE", status: "INSTALL_REQUIRED", error_classification: null };
}

export function makePolicyOwnership({ runId, spec, requestingUid, requestedImplementationSha, implementationCommit, workflowSha } = {}) {
  return {
    schema_version: 1,
    phase: R6_PHASE,
    run_id: runId,
    profile_name: spec.profile_name,
    profile_path: spec.profile_path,
    attachment: spec.attachment,
    profile_sha256: spec.sha256,
    managed_executable_path: spec.executable_path,
    managed_executable_sha256: spec.executable_sha256,
    managed_browsers_root: spec.managed_browsers_root,
    requesting_uid: requestingUid,
    requested_implementation_sha: requestedImplementationSha,
    implementation_commit: implementationCommit,
    workflow_definition_commit: workflowSha,
    created_at: new Date().toISOString(),
    resource_may_exist: true,
    resource_created: false,
    loaded: false,
    removed: false
  };
}

export function recordPolicyInstall(ownership, install) {
  return {
    ...ownership,
    resource_created: install?.parsed?.created === true,
    loaded: install?.parsed?.loaded === true,
    install_exit_code: install?.exit_code ?? null,
    install_status: install?.parsed?.status ?? null,
    install_error: install?.parsed?.error ?? null
  };
}

export function assertPolicyInstallPathAvailable(existing) {
  if (existing) throw new Error("Refusing to replace an existing AppArmor profile file.");
  return true;
}

export function ownedCleanupDecision({ ownership, current, currentSha256 } = {}) {
  if (!current) return { decision: "ALREADY_REMOVED", status: "ALREADY_REMOVED", owned_resources_removed: true };
  if (ownership?.resource_created !== true || !current.isFile || current.isFile() !== true || currentSha256 !== ownership?.profile_sha256) return { decision: "REFUSE_MODIFIED_OR_UNOWNED", status: "REFUSED", owned_resources_removed: false };
  return { decision: "REMOVE_OWNED_UNCHANGED", status: "REMOVE", owned_resources_removed: false };
}

async function writeOwnership(path, value) {
  return writeJsonAtomic(path, value, 0o600);
}

async function createFreshStateDirectory(path) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  try {
    await mkdir(path, { recursive: false, mode: 0o700 });
  } catch (error) {
    if (error && typeof error === "object" && error.code === "EEXIST") throw new Error(`Sandbox state directory already exists; refusing to resume or overwrite a prior run: ${path}`, { cause: error });
    throw error;
  }
}

function requestForPolicy({ spec, runId, implementationCommit, workflowSha, context, requestingUid }) {
  return {
    schema_version: 1,
    phase: R6_PHASE,
    run_id: runId,
    profile_name: spec.profile_name,
    profile_path: spec.profile_path,
    attachment: spec.attachment,
    profile_sha256: spec.sha256,
    profile_content: spec.content,
    managed_executable_path: spec.executable_path,
    managed_executable_sha256: spec.executable_sha256,
    managed_browsers_root: spec.managed_browsers_root,
    requesting_uid: requestingUid,
    requested_implementation_sha: process.env.REQUESTED_SHA ?? null,
    implementation_commit: implementationCommit,
    workflow_definition_commit: workflowSha,
    context: {
      allowed: true,
      repository: context.checks.find((check) => check.name === "repository")?.actual,
      event: context.checks.find((check) => check.name === "event")?.actual,
      runner_environment: context.checks.find((check) => check.name === "runner_environment")?.actual,
      runner_os: context.checks.find((check) => check.name === "runner_os")?.actual,
      github_actions: context.checks.find((check) => check.name === "github_actions")?.actual,
      public_repository: context.checks.find((check) => check.name === "public_repository")?.actual,
      main_ref: context.checks.find((check) => check.name === "main_ref")?.actual,
      sandbox_opt_in: "true"
    }
  };
}

async function runSudoAction(action, recordPath) {
  const script = fileURLToPath(import.meta.url);
  const result = await runExternal("sudo", ["-n", process.execPath, script, action, "--record", recordPath], { timeoutMs: 20_000 });
  let parsed = null;
  const outputLines = result.output.split(/\r?\n/).filter(Boolean);
  for (let index = outputLines.length - 1; index >= 0; index -= 1) {
    try { parsed = JSON.parse(outputLines[index]); break; } catch { /* root helper may have emitted a diagnostic before its JSON */ }
  }
  return { ...result, parsed };
}

async function installPolicyRootChecked(recordPath) {
  if (typeof process.getuid !== "function" || process.getuid() !== 0) throw new Error("Policy install helper must run only as root through noninteractive sudo.");
  const request = await readJson(recordPath);
  const recordStat = await stat(recordPath);
  if (recordStat.uid === 0 || recordStat.uid !== Number(request.requesting_uid) || (recordStat.mode & 0o077) !== 0) throw new Error("Policy request ownership or permissions are invalid.");
  assertRunId(request.run_id);
  assertProfileName(request.profile_name);
  if (request.profile_path !== profilePathForName(request.profile_name)) throw new Error("Policy request profile path is not the canonical run-owned AppArmor path.");
  assertSafeAttachment(request.attachment);
  if (!request.context || request.context.allowed !== true || request.context.repository !== "klole/reel-farm" || request.context.event !== "workflow_dispatch" || request.context.runner_environment !== "github-hosted" || request.context.runner_os !== "Linux" || request.context.github_actions !== "true" || request.context.sandbox_opt_in !== "true") throw new Error("Policy request context is not the explicitly authorized hosted r6 context.");
  if (request.context.public_repository !== "false" || request.context.main_ref !== "refs/heads/main") throw new Error("Policy request is not for the public main-branch hosted context.");
  if (!Number.isInteger(request.requesting_uid) || request.requesting_uid <= 0) throw new Error("Policy request must identify a non-root browser uid.");
  if (!/^[0-9a-f]{40}$/.test(request.requested_implementation_sha ?? "") || request.requested_implementation_sha !== request.implementation_commit) throw new Error("Policy request implementation identity is not a matching full SHA.");
  if (!/^[0-9a-f]{40}$/.test(request.implementation_commit ?? "") || !/^[0-9a-f]{40}$/.test(request.workflow_definition_commit ?? "")) throw new Error("Policy request commit identities must be full SHAs.");
  if (typeof request.managed_executable_path !== "string" || request.managed_executable_path !== request.attachment || typeof request.managed_executable_sha256 !== "string" || !/^[0-9a-f]{64}$/.test(request.managed_executable_sha256) || typeof request.managed_browsers_root !== "string" || !isAbsolute(request.managed_browsers_root)) throw new Error("Policy request does not identify the exact managed executable.");
  const managedRoot = await realpath(request.managed_browsers_root);
  const executable = await inspectCanonicalExecutable(request.managed_executable_path);
  assertManagedLayout(managedRoot, executable.canonical);
  if (executable.canonical !== request.managed_executable_path || (await sha256File(executable.canonical)) !== request.managed_executable_sha256) throw new Error("Managed executable identity changed before policy installation.");
  assertSafeAttachment(request.attachment, managedRoot);
  if (typeof request.profile_content !== "string" || sha256Bytes(request.profile_content) !== request.profile_sha256) throw new Error("Policy request profile content hash does not match.");
  const expectedProfile = buildAppArmorProfile({ profileName: request.profile_name, executablePath: request.attachment, managedRoot });
  if (request.profile_content !== expectedProfile) throw new Error("Policy request is not the exact minimal userns exception profile.");
  const existing = await stat(request.profile_path).then((value) => value).catch((error) => { if (isMissing(error)) return null; throw error; });
  assertPolicyInstallPathAvailable(existing);
  const loadedProfiles = await readOptional("/sys/kernel/security/apparmor/profiles");
  if (loadedProfiles && loadedProfiles.split(/\r?\n/).some((line) => line === request.profile_name || line.startsWith(`${request.profile_name} `) || line.startsWith(`${request.profile_name}(`))) throw new Error(`Refusing to replace an already loaded AppArmor profile: ${request.profile_name}`);
  const parser = await findExecutable("apparmor_parser");
  if (!parser) throw new Error("apparmor_parser is unavailable on the hosted runner.");
  let created = false;
  try {
    const handle = await open(request.profile_path, "wx", 0o644);
    created = true;
    await handle.writeFile(request.profile_content, "utf8");
    await handle.sync();
    await handle.close();
    await chmod(request.profile_path, 0o644);
    const syntax = await runExternal(parser, ["-p", request.profile_path], { timeoutMs: 10_000 });
    if (syntax.exit_code !== 0) throw new Error(`AppArmor profile syntax validation failed: ${sanitizeText(syntax.output, 1_500)}`);
    const loaded = await runExternal(parser, ["-r", request.profile_path], { timeoutMs: 10_000 });
    if (loaded.exit_code !== 0) throw new Error(`AppArmor profile load failed: ${sanitizeText(loaded.output, 1_500)}`);
    const finalStat = await stat(request.profile_path);
    if (finalStat.uid !== 0 || !finalStat.isFile() || (await sha256File(request.profile_path)) !== request.profile_sha256) throw new Error("Loaded AppArmor profile failed root ownership or hash verification.");
    console.log(JSON.stringify({ status: "INSTALLED", profile_name: request.profile_name, profile_path: request.profile_path, attachment: request.attachment, profile_sha256: request.profile_sha256, parser: parser, syntax_exit_code: syntax.exit_code, load_exit_code: loaded.exit_code, created: true, loaded: true }));
    return 0;
  } catch (error) {
    if (created) {
      await runExternal(parser, ["-R", request.profile_path], { timeoutMs: 10_000 }).catch(() => undefined);
      await unlink(request.profile_path).catch(() => undefined);
    }
    console.error(sanitizeText(errorMessage(error), 2_000));
    console.log(JSON.stringify({ status: "FAILED", profile_name: request.profile_name, profile_path: request.profile_path, attachment: request.attachment, profile_sha256: request.profile_sha256, created, loaded: false, error: sanitizeText(errorMessage(error), 2_000) }));
    return 2;
  }
}

async function installPolicyRoot(recordPath) {
  try {
    return await installPolicyRootChecked(recordPath);
  } catch (error) {
    const request = await readJson(recordPath).catch(() => ({}));
    console.error(sanitizeText(errorMessage(error), 2_000));
    console.log(JSON.stringify({ status: "FAILED", profile_name: request.profile_name ?? null, profile_path: request.profile_path ?? null, attachment: request.attachment ?? null, profile_sha256: request.profile_sha256 ?? null, created: false, loaded: false, error: sanitizeText(errorMessage(error), 2_000) }));
    return 2;
  }
}

async function removePolicyRoot(recordPath) {
  if (typeof process.getuid !== "function" || process.getuid() !== 0) throw new Error("Policy cleanup helper must run only as root through noninteractive sudo.");
  const ownership = await readJson(recordPath);
  assertRunId(ownership.run_id);
  assertProfileName(ownership.profile_name);
  if (ownership.profile_path !== profilePathForName(ownership.profile_name)) throw new Error("Cleanup profile path is not the canonical run-owned AppArmor path.");
  assertSafeAttachment(ownership.attachment);
  const current = await stat(ownership.profile_path).then((value) => value).catch((error) => { if (isMissing(error)) return null; throw error; });
  const currentSha256 = current?.isFile() === true ? await sha256File(ownership.profile_path) : null;
  const cleanupDecision = ownedCleanupDecision({ ownership, current, currentSha256 });
  if (cleanupDecision.decision === "ALREADY_REMOVED") {
    const profilesAfter = await readOptional("/sys/kernel/security/apparmor/profiles");
    const stillLoaded = profilesAfter === null ? null : profilesAfter.split(/\r?\n/).some((line) => line === ownership.profile_name || line.startsWith(`${ownership.profile_name} `) || line.startsWith(`${ownership.profile_name}(`));
    if (stillLoaded === true || stillLoaded === null) throw new Error(`Owned AppArmor profile file is absent but loaded-state verification was ${stillLoaded === true ? "positive" : "unavailable"}.`);
    console.log(JSON.stringify({ status: "ALREADY_REMOVED", profile_name: ownership.profile_name, profile_path: ownership.profile_path, profile_loaded_after: false, owned_resources_removed: true }));
    return 0;
  }
  if (ownership.resource_created !== true) {
    console.log(JSON.stringify({ status: "PRESERVED_UNOWNED", profile_name: ownership.profile_name, profile_path: ownership.profile_path, owned_resources_removed: false, preserved: true, reason: "The profile existed before this invocation or its creation was not observed." }));
    return 0;
  }
  if (cleanupDecision.decision !== "REMOVE_OWNED_UNCHANGED") throw new Error("Refusing cleanup: owned AppArmor profile is missing, non-regular, or modified.");
  const parser = await findExecutable("apparmor_parser");
  if (!parser) throw new Error("apparmor_parser is unavailable for owned-profile cleanup.");
  const removal = await runExternal(parser, ["-R", ownership.profile_path], { timeoutMs: 10_000 });
  const alreadyAbsent = removal.exit_code !== 0 && /not found|does not exist|not loaded|no such profile/i.test(removal.output);
  if (removal.exit_code !== 0 && !alreadyAbsent) throw new Error(`AppArmor profile removal failed: ${sanitizeText(removal.output, 1_500)}`);
  const profilesAfterRemoval = await readOptional("/sys/kernel/security/apparmor/profiles");
  const stillLoaded = profilesAfterRemoval === null ? null : profilesAfterRemoval.split(/\r?\n/).some((line) => line === ownership.profile_name || line.startsWith(`${ownership.profile_name} `) || line.startsWith(`${ownership.profile_name}(`));
  if (stillLoaded === true) throw new Error(`AppArmor profile remained loaded after removal: ${ownership.profile_name}`);
  await unlink(ownership.profile_path);
  console.log(JSON.stringify({ status: "REMOVED", profile_name: ownership.profile_name, profile_path: ownership.profile_path, parser: parser, parser_exit_code: removal.exit_code, parser_already_absent: alreadyAbsent, profile_loaded_after: stillLoaded, owned_resources_removed: true }));
  return 0;
}

async function qualifyFromEnvironment() {
  const runId = assertRunId(process.env.CH001_RUN_ID ?? "");
  if (!process.env.CH001_SANDBOX_REPORT || !isAbsolute(process.env.CH001_SANDBOX_REPORT)) throw new Error("CH001_SANDBOX_REPORT must be an absolute path.");
  if (!process.env.CH001_SANDBOX_STATE_DIR || !isAbsolute(process.env.CH001_SANDBOX_STATE_DIR)) throw new Error("CH001_SANDBOX_STATE_DIR must be an absolute path.");
  const reportPath = resolve(process.env.CH001_SANDBOX_REPORT);
  const stateDirectory = resolve(process.env.CH001_SANDBOX_STATE_DIR);
  if (!reportOutsideProof(reportPath)) throw new Error("Sandbox report must be outside CH001_EVIDENCE_ROOT until the coordinator owns it.");
  if (process.env.RUNNER_TEMP && !isPathInside(resolve(process.env.RUNNER_TEMP), stateDirectory)) throw new Error("Sandbox state must remain under RUNNER_TEMP.");
  await createFreshStateDirectory(stateDirectory);
  const implementationCommit = process.env.CH001_IMPLEMENTATION_COMMIT ?? null;
  const workflowSha = process.env.CH001_WORKFLOW_SHA ?? process.env.GITHUB_WORKFLOW_SHA ?? null;
  const context = checkHostedPolicyContext(process.env);
  let report = baseReport({ runId, implementationCommit, workflowSha, context });
  await writeJsonAtomic(reportPath, report);
  try {
    const checkout = await gitHead();
    if (!checkout || checkout !== implementationCommit || process.env.REQUESTED_SHA !== implementationCommit) throw new Error(`Requested/checked-out implementation identity mismatch: requested=${process.env.REQUESTED_SHA ?? "null"}, environment=${implementationCommit ?? "null"}, git=${checkout ?? "null"}.`);
    const { chromium } = await import("playwright");
    const playwrightExecutablePath = chromium.executablePath();
    const selectedExecutablePath = process.env.BROWSER_EXECUTABLE_PATH ?? playwrightExecutablePath;
    const identityOptions = { playwrightExecutablePath, selectedExecutablePath, browsersPath: process.env.PLAYWRIGHT_BROWSERS_PATH };
    const resolution = await resolveManagedBrowserExecutable(identityOptions);
    report = baseReport({ runId, implementationCommit, workflowSha, resolution, context });
    await assertManagedBrowserIdentity({ resolution, ...identityOptions });
    const before = await collectHostSnapshot({ executablePath: resolution.path });
    report.host_before_policy = before;
    report.apparmor_enabled = before.apparmor.enabled;
    report.restriction_before = before.sysctls;
    report.global_policy.before = before.sysctls;
    report.global_policy.apparmor_before = before.apparmor;
    await writeJsonAtomic(reportPath, report);

    await assertManagedBrowserIdentity({ resolution, ...identityOptions });
    const defaultProbe = await runSandboxProbe({ executablePath: resolution.path });
    const defaultDenials = await collectKernelDenials({ executablePath: resolution.path, pids: defaultProbe.pids, startedAt: defaultProbe.started_at });
    defaultProbe.diagnostic_evidence.push({ kind: "kernel-denial-excerpt", available: defaultDenials.available, tied_to_probe: defaultDenials.tied_to_probe, matched: defaultDenials.matched, interpretation: defaultDenials.interpretation });
    report.default_probe = defaultProbe;
    report.host_before_policy.process_facts_after_default_probe = defaultProbe.process_facts;
    report.host_before_policy.kernel_denials_after_default_probe = defaultDenials;

    let qualifiedProbe = defaultProbe;
    let ownershipPath = null;
    const ubuntuHost = before.os_release.id === "ubuntu" && /^24\.04(?:$|\.)/.test(before.os_release.version_id ?? "");
    const policyDecision = decideSandboxPolicy({ defaultProbe, context, ubuntuHost, apparmorEnabled: before.apparmor.enabled, parserAvailable: before.apparmor.parser.available });
    if (policyDecision.decision === "NOT_NEEDED_DEFAULT_SANDBOX_WORKED") {
      report.policy = { decision: "NOT_NEEDED_DEFAULT_SANDBOX_WORKED", policy_changed: false, profile_name: null, profile_path: null, attachment: resolution.path, sha256: null, loaded: false };
      report.status = "HOST_SANDBOX_QUALIFIED";
      report.qualified_probe = qualifiedProbe;
      report.cleanup = { status: "NOT_REQUIRED", owned_resources_removed: true, ownership_record: null };
      await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "1" });
      report.limitations.push("The default sandboxed launch succeeded, so no AppArmor policy was installed.");
    } else if (policyDecision.decision === "NOT_INSTALLED_SANDBOX_OBSERVATION_INCONCLUSIVE") {
      report.policy = { decision: "NOT_INSTALLED_SANDBOX_OBSERVATION_INCONCLUSIVE", policy_changed: false, profile_name: null, profile_path: null, attachment: resolution.path, sha256: null, loaded: false };
      report.status = "BLOCKED_ENVIRONMENT";
      report.error_classification = "SANDBOX_OBSERVATION_INCONCLUSIVE";
      report.error = defaultProbe.sandbox_observed === false ? "The requested browser launch completed, but effective sandbox evidence was negative." : "The requested browser launch completed, but effective sandbox evidence was unavailable.";
      report.qualified_probe = { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, diagnostic_evidence: [], reason: report.error };
      report.limitations.push("A successful render without positive effective sandbox evidence was not treated as qualification; no policy was installed.");
      await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "0" });
    } else if (policyDecision.decision === "NOT_INSTALLED_OTHER_LAUNCH_CAUSE") {
      report.policy = { decision: "NOT_INSTALLED_OTHER_LAUNCH_CAUSE", policy_changed: false, profile_name: null, profile_path: null, attachment: resolution.path, sha256: null, loaded: false };
      report.status = "BLOCKED_ENVIRONMENT";
      report.error_classification = policyDecision.error_classification;
      report.error = defaultProbe.error;
      report.qualified_probe = { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, diagnostic_evidence: [], reason: "Qualified launch was not attempted because the default failure was not classified as an AppArmor/user-namespace policy block." };
      report.limitations.push("The default browser failure was not safely attributable to the permitted AppArmor/user-namespace case; no policy was installed.");
      await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "0" });
    } else if (policyDecision.decision === "NOT_INSTALLED_CONTEXT_NOT_AUTHORIZED") {
      report.policy = { decision: "NOT_INSTALLED_CONTEXT_NOT_AUTHORIZED", policy_changed: false, profile_name: null, profile_path: null, attachment: resolution.path, sha256: null, loaded: false };
      report.status = "BLOCKED_ENVIRONMENT";
      report.error_classification = "HOSTED_POLICY_CONTEXT_NOT_AUTHORIZED";
      report.error = context.failures.join(" ");
      report.qualified_probe = { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, diagnostic_evidence: [], reason: "The explicit hosted r6 opt-in/context guard did not pass; no privileged policy operation was attempted." };
      report.limitations.push(...context.failures);
      await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "0" });
    } else if (policyDecision.decision === "NOT_INSTALLED_UBUNTU_HOST_EXPECTATION_FAILED") {
      report.policy = { decision: "NOT_INSTALLED_UBUNTU_HOST_EXPECTATION_FAILED", policy_changed: false, profile_name: null, profile_path: null, attachment: resolution.path, sha256: null, loaded: false };
      report.status = "BLOCKED_ENVIRONMENT";
      report.error_classification = "HOST_OS_EXPECTATION_FAILED";
      report.error = `The measured host was not Ubuntu 24.04 (id=${before.os_release.id ?? "null"}, version_id=${before.os_release.version_id ?? "null"}); no policy was installed.`;
      report.qualified_probe = { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, diagnostic_evidence: [], reason: report.error };
      report.limitations.push("The host OS did not match the explicitly approved Ubuntu 24.04 qualification context.");
      await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "0" });
    } else if (policyDecision.decision === "NOT_INSTALLED_APPARMOR_UNAVAILABLE") {
      report.policy = { decision: "NOT_INSTALLED_APPARMOR_UNAVAILABLE", policy_changed: false, profile_name: null, profile_path: null, attachment: resolution.path, sha256: null, loaded: false };
      report.status = "BLOCKED_ENVIRONMENT";
      report.error_classification = "APPARMOR_POLICY_UNAVAILABLE";
      report.error = "The measured runner did not expose both enabled AppArmor and apparmor_parser; the Chromium sandbox remained enabled and no fallback was attempted.";
      report.qualified_probe = { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, diagnostic_evidence: [], reason: report.error };
      report.limitations.push("AppArmor policy setup was unavailable from measured host facts.");
      await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "0" });
    } else {
      await assertManagedBrowserIdentity({ resolution, ...identityOptions });
      const profileName = makeProfileName(runId);
      const spec = policySpec({ profileName, executablePath: resolution.path, executableSha256: resolution.sha256, managedRoot: resolution.browsers_root });
      const ownership = makePolicyOwnership({ spec, runId, requestingUid: context.browser_uid, requestedImplementationSha: process.env.REQUESTED_SHA ?? null, implementationCommit, workflowSha });
      ownershipPath = resolve(stateDirectory, "apparmor-ownership.json");
      await writeOwnership(ownershipPath, ownership);
      const requestPath = resolve(stateDirectory, "apparmor-install-request.json");
      await writeJsonAtomic(requestPath, requestForPolicy({ spec, runId, implementationCommit, workflowSha, context, requestingUid: context.browser_uid }), 0o600);
      const install = await runSudoAction("install", requestPath);
      report.policy = { decision: "INSTALL_EXACT_MANAGED_EXECUTABLE", policy_changed: install.parsed?.loaded === true, profile_name: spec.profile_name, profile_path: spec.profile_path, attachment: spec.attachment, sha256: spec.sha256, loaded: install.parsed?.loaded === true, install_exit_code: install.exit_code, install_status: install.parsed?.status ?? null, install_error: install.parsed?.error ?? (install.exit_code === 0 ? null : sanitizeText(install.output, 2_000)) };
      const updatedOwnership = recordPolicyInstall(ownership, install);
      await writeOwnership(ownershipPath, updatedOwnership);
      if (install.exit_code !== 0 || install.parsed?.loaded !== true) {
        report.status = "BLOCKED_ENVIRONMENT";
        report.error_classification = "APPARMOR_POLICY_INSTALL_FAILED";
        report.error = sanitizeText(install.parsed?.error ?? install.output ?? "AppArmor policy install failed.");
        report.qualified_probe = { sandbox_requested: true, launch_succeeded: false, sandbox_observed: null, browser_version: null, diagnostic_evidence: [], reason: "The exact profile was not loaded; an unsandboxed fallback was not attempted." };
        report.limitations.push("Policy setup failed; cleanup will verify and remove only resources owned by this invocation.");
        await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "0" });
      } else {
        const afterPolicy = await collectHostSnapshot({ executablePath: resolution.path, profileName: spec.profile_name, attachment: spec.attachment });
        report.host_after_policy = afterPolicy;
        report.global_policy.after_policy = afterPolicy.sysctls;
        report.global_policy.apparmor_after_policy = afterPolicy.apparmor;
        await assertManagedBrowserIdentity({ resolution, ...identityOptions });
        qualifiedProbe = await runSandboxProbe({ executablePath: resolution.path });
        const qualifiedDenials = await collectKernelDenials({ executablePath: resolution.path, pids: qualifiedProbe.pids, profileName: spec.profile_name, startedAt: qualifiedProbe.started_at });
        qualifiedProbe.diagnostic_evidence.push({ kind: "kernel-denial-excerpt", available: qualifiedDenials.available, tied_to_probe: qualifiedDenials.tied_to_probe, matched: qualifiedDenials.matched, interpretation: qualifiedDenials.interpretation });
        report.qualified_probe = qualifiedProbe;
        report.policy.policy_active_during_probe = true;
        report.cleanup = { status: "PENDING_UNTIL_HOST_PROOF_FINISHES", owned_resources_removed: false, ownership_record: ownershipPath };
        const qualified = qualifiedProbe.launch_succeeded === true && qualifiedProbe.sandbox_observed === true;
        report.status = qualified ? "HOST_SANDBOX_QUALIFIED_POLICY_ACTIVE" : "BLOCKED_ENVIRONMENT";
        if (!qualified) {
          report.error_classification = qualifiedProbe.launch_succeeded ? "QUALIFIED_SANDBOX_OBSERVATION_FAILED" : "QUALIFIED_SANDBOX_LAUNCH_FAILED";
          report.error = qualifiedProbe.error ?? (qualifiedProbe.sandbox_observed === false ? "The exact policy loaded, but effective sandbox evidence was negative." : "The exact policy loaded, but effective sandbox evidence was unavailable.");
          report.limitations.push("The exact policy loaded, but the same pinned browser did not produce positive effective sandbox evidence after the synthetic render.");
          await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "0" });
        } else {
          await appendGithubEnv({ BROWSER_EXECUTABLE_PATH: resolution.path, CH001_SANDBOX_READY: "1", CH001_SANDBOX_PROFILE_NAME: spec.profile_name });
        }
      }
    }
    report.restriction_after = report.global_policy.after_policy ?? report.restriction_before;
    await writeJsonAtomic(reportPath, report);
    console.log(`CH-001R-r6 host sandbox ${report.status}; executable ${resolution.path}; policy ${report.policy.decision}.`);
    return report.status.startsWith("HOST_SANDBOX_QUALIFIED") ? 0 : 2;
  } catch (error) {
    report.status = "BLOCKED_ENVIRONMENT";
    report.error_classification = report.error_classification ?? "SANDBOX_HELPER_FAILURE";
    report.error = sanitizeText(errorMessage(error));
    report.limitations.push("The sandbox helper could not complete its measured route; Chromium sandboxing was not disabled.");
    await writeJsonAtomic(reportPath, report).catch(() => undefined);
    console.error(`CH-001R-r6 sandbox qualification blocked: ${report.error}`);
    return 2;
  }
}

async function cleanupFromEnvironment() {
  if (!process.env.CH001_SANDBOX_REPORT || !isAbsolute(process.env.CH001_SANDBOX_REPORT)) throw new Error("CH001_SANDBOX_REPORT must be an absolute path.");
  if (!process.env.CH001_SANDBOX_STATE_DIR || !isAbsolute(process.env.CH001_SANDBOX_STATE_DIR)) throw new Error("CH001_SANDBOX_STATE_DIR must be an absolute path.");
  const reportPath = resolve(process.env.CH001_SANDBOX_REPORT);
  const stateDirectory = resolve(process.env.CH001_SANDBOX_STATE_DIR);
  if (!reportOutsideProof(reportPath)) throw new Error("Sandbox report must be outside CH001_EVIDENCE_ROOT until the coordinator owns it.");
  if (process.env.RUNNER_TEMP && !isPathInside(resolve(process.env.RUNNER_TEMP), stateDirectory)) throw new Error("Sandbox state must remain under RUNNER_TEMP.");
  const ownershipPath = resolve(stateDirectory, "apparmor-ownership.json");
  let report = await readJson(reportPath).catch(() => baseReport({ runId: process.env.CH001_RUN_ID, implementationCommit: process.env.CH001_IMPLEMENTATION_COMMIT, workflowSha: process.env.CH001_WORKFLOW_SHA }));
  const ownership = await readJson(ownershipPath).catch(() => null);
  if (!ownership) {
    report.cleanup = { status: report.cleanup?.status === "NOT_REQUIRED" ? "NOT_REQUIRED" : "NOT_RUN_NO_OWNED_POLICY", owned_resources_removed: report.cleanup?.status === "NOT_REQUIRED" ? true : null, ownership_record: null };
    report.restriction_after = report.restriction_before ?? null;
    report.global_policy.after_cleanup = report.restriction_after;
    report.global_policy.apparmor_after_cleanup = report.host_before_policy?.apparmor ?? null;
    report.global_policy.unchanged = true;
    await writeJsonAtomic(reportPath, report);
    console.log("CH-001R-r6 sandbox cleanup: no owned policy record.");
    return 0;
  }
  const removal = await runSudoAction("remove", ownershipPath);
  const after = await collectHostSnapshot({ executablePath: report.selected_executable?.path ?? ownership.attachment, profileName: ownership.profile_name, attachment: ownership.attachment }).catch(() => null);
  const preservedUnowned = removal.parsed?.status === "PRESERVED_UNOWNED" && removal.parsed?.preserved === true;
  const removed = removal.parsed?.owned_resources_removed === true && removal.exit_code === 0;
  const cleanupSucceeded = (removed || (preservedUnowned && removal.exit_code === 0));
  report.cleanup = { status: cleanupSucceeded ? "PASS" : "FAIL", owned_resources_removed: removed, preserved_unowned: preservedUnowned, ownership_record: ownershipPath, removal_exit_code: removal.exit_code, removal_status: removal.parsed?.status ?? null, profile_loaded_after: typeof removal.parsed?.profile_loaded_after === "boolean" ? removal.parsed.profile_loaded_after : null, removal_error: removal.parsed?.error ?? (cleanupSucceeded ? null : sanitizeText(removal.output, 2_000)), removed_at: removed ? new Date().toISOString() : null };
  report.restriction_after = after?.sysctls ?? report.restriction_before ?? null;
  report.global_policy.after_cleanup = report.restriction_after;
  report.global_policy.apparmor_after_cleanup = after?.apparmor ?? null;
  report.global_policy.unchanged = JSON.stringify({ restrictions: report.restriction_before ?? null, apparmor: report.global_policy.apparmor_before ?? null }) === JSON.stringify({ restrictions: report.restriction_after ?? null, apparmor: report.global_policy.apparmor_after_cleanup ?? null });
  report.policy.cleanup_profile = { name: ownership.profile_name, path: ownership.profile_path, expected_sha256: ownership.profile_sha256, removal_status: report.cleanup.status };
  await writeJsonAtomic(reportPath, report);
  console.log(`CH-001R-r6 sandbox cleanup ${report.cleanup.status}; owned_resources_removed=${removed}.`);
  return cleanupSucceeded ? 0 : 1;
}

function parseRecordArgument(args) {
  const index = args.indexOf("--record");
  if (index < 0 || !args[index + 1] || args[index + 1].startsWith("--")) throw new Error("--record requires a path.");
  return resolve(args[index + 1]);
}

async function main() {
  const command = process.argv[2];
  if (command === "qualify") return qualifyFromEnvironment();
  if (command === "cleanup") return cleanupFromEnvironment();
  if (command === "install") return installPolicyRoot(parseRecordArgument(process.argv.slice(3)));
  if (command === "remove") return removePolicyRoot(parseRecordArgument(process.argv.slice(3)));
  if (command === "--help" || !command) {
    console.log("Usage: node scripts/ch001-sandbox.mjs <qualify|cleanup|install|remove>");
    return 0;
  }
  throw new Error(`Unknown CH-001R-r6 sandbox helper command: ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = await main(); }
  catch (error) {
    console.error(`CH-001R-r6 sandbox helper failed: ${sanitizeText(errorMessage(error))}`);
    process.exitCode = 1;
  }
}
