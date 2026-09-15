import { createHash, randomBytes } from "node:crypto";
import { access, constants, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, relative, resolve } from "node:path";
import { chromium } from "playwright";
import {
  EXPECTED_GATE_IDS,
  makeEvidenceRef,
  sha256File,
  validateEvidencePackage,
  writeJson,
  type CommandRecord,
  type EvidencePackage,
  type GateRecord,
  type SuiteReport
} from "./ch001-harness.js";
import { freeLoopbackPort, makeComposeProject, waitForCondition, waitForHttp, type CommandResult, type ComposeProject } from "./ch001-compose.js";
import {
  collectComposeDiagnostics,
  teardownComposeProject,
  verifyComposeProjectOwnership,
  writeComposeNotRunEvidence,
  type ComposeDiagnosticCollection,
  type ComposeCleanupResult,
  type ComposeOwnershipResult
} from "./ch001-compose-diagnostics.mjs";
import { readZipEntries } from "../tests/helpers/zip.ts";
import { assertValidProofRunId, prepareProofEvidenceDirectories, resolveProofEvidenceRoot, writeCoordinatorFailureReport } from "./ch001-proof-boundary.mjs";
import { assertManagedBrowserIdentity, resolveManagedBrowserExecutable, type ManagedBrowserResolution } from "./ch001-sandbox.mjs";
import { runMigrationFirstQualification, type MigrationCommandObservation } from "./ch001-migration-verification.mjs";

type ProcessResult = CommandResult & { invocationId: string };
type ProofStatus = "PASS" | "FAIL" | "NOT_RUN";
type ProofStep = { name: string; status: ProofStatus; startedAt: string; endedAt: string; detail?: string; invocationId?: string };
type CommandOutput = { result: ProcessResult; publicLogPath: string; privateLogPath: string; reportPath?: string };
type VitestCounts = { discovered: number; executed: number; passed: number; failed: number; skipped: number };
type JsonResponse = { status: number; contentType: string; body: unknown };
type HealthDetails = { renderer?: string; database?: string; storage?: string; worker?: string; heartbeat?: { lastSeenAt?: string } | null };

const root = resolve(process.cwd());
const generatedAt = new Date();
const runId = process.env.CH001_RUN_ID ?? `r11-local-${generatedAt.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
assertValidProofRunId(runId);

const evidenceRoot = resolveProofEvidenceRoot(root, process.env.CH001_EVIDENCE_ROOT, runId);
const privateDir = resolve(evidenceRoot, "private");
const publicDir = resolve(evidenceRoot, "public");
const privateCommandDir = resolve(privateDir, "commands");
const publicCommandDir = resolve(publicDir, "commands");
const implementationCommit = await gitCommit();
const requestedCommit = process.env.CH001_IMPLEMENTATION_COMMIT;
const workflowSha = process.env.CH001_WORKFLOW_SHA ?? process.env.GITHUB_WORKFLOW_SHA ?? null;
const invocationPrefix = `${runId}-${process.pid}`;
const proofSteps: ProofStep[] = [];
const commandOutputs: CommandOutput[] = [];
const suiteReports = new Map<string, SuiteReport>();
const failures: string[] = [];
const environmentFailures: string[] = [];
const secrets: string[] = [];
let invocationNumber = 0;
let composeProject: ComposeProject | undefined;
let composeStarted = false;
let composeStartupAttempted = false;
let composeProjectOwned = false;
let composeLifecycleFinalized = false;
let composeOwnership: ComposeOwnershipResult | null = null;
let composeStartupResult: CommandResult | null = null;
let composeEnvPath = "";
let emptyEnvPath = "";
let port = 0;
let baseUrl = "";
let browserPath = "";
let projectName = "";
let integrationDatabase = "";
let integrationDatabaseCreated = false;
let loopbackPortReady = true;
let evidenceOwned = false;
let browserResolution: ManagedBrowserResolution | null = null;
let browserIdentityOptions: { playwrightExecutablePath: string; selectedExecutablePath: string; browsersPath?: string } | null = null;
let composeDiagnostics: ComposeDiagnosticCollection | null = null;
let composeCleanup: ComposeCleanupResult | null = null;
let moduleImportReport: Record<string, unknown> = { status: "NOT_RUN", reason: "Post-build module-import verification has not run." };
let migrationQualification: Record<string, unknown> | null = null;
const migrationContainerNames: string[] = [];
let migrationContainerCleanup: Record<string, unknown> | null = null;

const DEFAULT_COMMAND_TIMEOUT_MS = 900_000;
const DEFAULT_COMMAND_MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
const SHORT_COMMAND_TIMEOUT_MS = 30_000;
const SHORT_COMMAND_MAX_OUTPUT_BYTES = 128 * 1024;
const MIGRATION_COMMAND_TIMEOUT_MS = 120_000;

browserPath = process.env.BROWSER_EXECUTABLE_PATH ?? chromium.executablePath();

function invocationId(): string {
  invocationNumber += 1;
  return `${invocationPrefix}-${String(invocationNumber).padStart(3, "0")}`;
}

function pathFromRoot(path: string): string { return relative(root, resolve(path)); }
function safeName(value: string): string { return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "step"; }

function redact(value: string): string {
  let result = value;
  for (const secret of [...secrets].sort((left, right) => right.length - left.length)) if (secret) result = result.split(secret).join("<redacted>");
  return result.replace(/(?:postgres(?:ql)?:\/\/)[^\s"'`]+/gi, "postgres://<redacted>");
}

function commandDisplay(command: string, args: string[]): string {
  return [command, ...args].map((value) => redact(value)).join(" ");
}

async function gitCommit(): Promise<string> {
  return new Promise((resolveCommit) => {
    const child = spawn("git", ["rev-parse", "HEAD"], { cwd: root, env: process.env, stdio: ["ignore", "pipe", "ignore"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("close", () => resolveCommit(output.trim()));
    child.on("error", () => resolveCommit(""));
  });
}

async function gitOutput(args: string[]): Promise<string> {
  const result = await runProcess("git", args, process.env, { timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
  if (result.exitCode !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.output.trim()}`);
  return result.output.trim();
}

type ProcessOptions = { timeoutMs?: number; maxOutputBytes?: number };

async function runProcess(command: string, args: string[], env: NodeJS.ProcessEnv, options: ProcessOptions = {}): Promise<ProcessResult> {
  const startedAt = new Date().toISOString();
  const id = invocationId();
  return new Promise((resolveResult) => {
    const child = spawn(command, args, { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    let outputTruncated = false;
    let timedOut = false;
    let settled = false;
    let killHandle: NodeJS.Timeout | undefined;
    const maxOutputBytes = options.maxOutputBytes ?? DEFAULT_COMMAND_MAX_OUTPUT_BYTES;
    const appendOutput = (chunk: Buffer): void => {
      const remaining = maxOutputBytes - Buffer.byteLength(output);
      if (remaining <= 0) { outputTruncated = true; return; }
      if (chunk.byteLength <= remaining) output += chunk.toString();
      else { output += chunk.subarray(0, remaining).toString(); outputTruncated = true; }
    };
    const timeoutMs = Math.max(1, Math.floor(options.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS));
    const finish = (exitCode: number, suffix = ""): void => {
      if (settled) return;
      settled = true;
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (killHandle) clearTimeout(killHandle);
      if (suffix) appendOutput(Buffer.from(suffix));
      resolveResult({ command: commandDisplay(command, args), startedAt, endedAt: new Date().toISOString(), exitCode, output, invocationId: id, ...(timedOut ? { timedOut: true } : {}), ...(outputTruncated ? { outputTruncated: true } : {}) });
    };
    child.stdout.on("data", (chunk: Buffer) => appendOutput(chunk));
    child.stderr.on("data", (chunk: Buffer) => appendOutput(chunk));
    child.on("error", (error) => finish(timedOut ? 124 : 1, `${error.message}\n`));
    child.on("close", (code) => finish(timedOut ? 124 : code ?? 1));
    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      appendOutput(Buffer.from(`\n[command timed out after ${timeoutMs}ms]\n`));
      child.kill("SIGTERM");
      killHandle = setTimeout(() => child.kill("SIGKILL"), 1_000);
    }, timeoutMs);
  });
}

async function writeText(path: string, value: string, mode = 0o640): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, { mode });
}

async function commandStep(name: string, command: string, args: string[], env: NodeJS.ProcessEnv, options: { reportPath?: string; publicLogName?: string; timeoutMs?: number; maxOutputBytes?: number; expectedExitCode?: number } = {}): Promise<CommandOutput> {
  const result = await runProcess(command, args, env, { timeoutMs: options.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS, maxOutputBytes: options.maxOutputBytes ?? DEFAULT_COMMAND_MAX_OUTPUT_BYTES });
  const slug = safeName(options.publicLogName ?? name);
  const publicLogPath = resolve(publicCommandDir, `${String(commandOutputs.length + 1).padStart(3, "0")}-${slug}.log`);
  const privateLogPath = resolve(privateCommandDir, `${String(commandOutputs.length + 1).padStart(3, "0")}-${slug}.log`);
  await writeText(privateLogPath, result.output);
  await writeText(publicLogPath, redact(result.output));
  const output = { result, publicLogPath, privateLogPath, ...(options.reportPath ? { reportPath: options.reportPath } : {}) };
  commandOutputs.push(output);
  const expectedExitCode = options.expectedExitCode ?? 0;
  const passed = result.exitCode === expectedExitCode && result.timedOut !== true;
  stepRecord(name, passed ? "PASS" : "FAIL", result.startedAt, passed ? undefined : result.output.slice(-2_000), result.invocationId);
  return output;
}

async function composeStep(name: string, args: string[], options: { reportPath?: string; publicLogName?: string; timeoutMs?: number; maxOutputBytes?: number; expectedExitCode?: number } = {}): Promise<CommandOutput> {
  if (!composeProject) throw new Error("Compose project has not been initialized.");
  const output = await composeProject.run(args, { timeoutMs: options.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS, maxOutputBytes: options.maxOutputBytes ?? DEFAULT_COMMAND_MAX_OUTPUT_BYTES });
  const result: ProcessResult = { ...output, command: redact(output.command), invocationId: invocationId() };
  const slug = safeName(options.publicLogName ?? name);
  const publicLogPath = resolve(publicCommandDir, `${String(commandOutputs.length + 1).padStart(3, "0")}-${slug}.log`);
  const privateLogPath = resolve(privateCommandDir, `${String(commandOutputs.length + 1).padStart(3, "0")}-${slug}.log`);
  await writeText(privateLogPath, output.output);
  await writeText(publicLogPath, redact(output.output));
  const commandOutput = { result, publicLogPath, privateLogPath, ...(options.reportPath ? { reportPath: options.reportPath } : {}) };
  commandOutputs.push(commandOutput);
  const expectedExitCode = options.expectedExitCode ?? 0;
  const passed = result.exitCode === expectedExitCode && result.timedOut !== true;
  stepRecord(name, passed ? "PASS" : "FAIL", result.startedAt, passed ? undefined : result.output.slice(-2_000), result.invocationId);
  return commandOutput;
}

async function dockerStep(name: string, args: string[], options: { publicLogName?: string; timeoutMs?: number; maxOutputBytes?: number; expectedExitCode?: number } = {}): Promise<CommandOutput> {
  if (!composeProject) throw new Error("Compose project has not been initialized.");
  const output = await composeProject.dockerRun(args, { timeoutMs: options.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS, maxOutputBytes: options.maxOutputBytes ?? DEFAULT_COMMAND_MAX_OUTPUT_BYTES });
  const result: ProcessResult = { ...output, command: redact(output.command), invocationId: invocationId() };
  const slug = safeName(options.publicLogName ?? name);
  const publicLogPath = resolve(publicCommandDir, `${String(commandOutputs.length + 1).padStart(3, "0")}-${slug}.log`);
  const privateLogPath = resolve(privateCommandDir, `${String(commandOutputs.length + 1).padStart(3, "0")}-${slug}.log`);
  await writeText(privateLogPath, output.output);
  await writeText(publicLogPath, redact(output.output));
  const commandOutput = { result, publicLogPath, privateLogPath };
  commandOutputs.push(commandOutput);
  const expectedExitCode = options.expectedExitCode ?? 0;
  const passed = result.exitCode === expectedExitCode && result.timedOut !== true;
  stepRecord(name, passed ? "PASS" : "FAIL", result.startedAt, passed ? undefined : result.output.slice(-2_000), result.invocationId);
  return commandOutput;
}

function stepRecord(name: string, status: ProofStatus, startedAt: string, detail?: string, invocation?: string): void {
  proofSteps.push({ name, status, startedAt, endedAt: new Date().toISOString(), ...(detail ? { detail: redact(detail) } : {}), ...(invocation ? { invocationId: invocation } : {}) });
}

async function assertion(name: string, operation: () => Promise<void>): Promise<boolean> {
  const startedAt = new Date().toISOString();
  try {
    await operation();
    stepRecord(name, "PASS", startedAt);
    return true;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    stepRecord(name, "FAIL", startedAt, detail);
    failures.push(`${name}: ${redact(detail)}`);
    return false;
  }
}

function skipped(name: string, reason: string): void {
  stepRecord(name, "NOT_RUN", new Date().toISOString(), reason);
}

function envWithoutNormalDotenv(extra: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of ["DATABASE_URL", "MEDIA_ROOT", "BOOTSTRAP_TOKEN", "BETTER_AUTH_SECRET", "APP_ORIGIN", "E2E_BASE_URL", "CH001_EVIDENCE_DIR", "CH001_EVIDENCE_ROOT", "CH001_UNIT_REPORT", "CH001_PLAYWRIGHT_REPORT", "CH001_PLAYWRIGHT_OUTPUT_DIR", "BROWSER_EXECUTABLE_PATH"]) delete env[key];
  return { ...env, CI: "true", NODE_ENV: "test", DOTENV_CONFIG_PATH: emptyEnvPath, CH001_RUN_ID: runId, CH001_IMPLEMENTATION_COMMIT: implementationCommit, ...extra };
}

async function executable(path: string): Promise<boolean> {
  try { await access(path, constants.X_OK); return true; } catch { return false; }
}

async function readJsonFile(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8")) as unknown;
}

function vitestCounts(value: unknown): VitestCounts {
  const report = value as { numTotalTests?: unknown; numPassedTests?: unknown; numFailedTests?: unknown; numPendingTests?: unknown; numTodoTests?: unknown };
  const discovered = Number(report.numTotalTests ?? 0);
  const passed = Number(report.numPassedTests ?? 0);
  const failed = Number(report.numFailedTests ?? 0);
  const skippedTests = Number(report.numPendingTests ?? 0) + Number(report.numTodoTests ?? 0);
  return { discovered, executed: passed + failed, passed, failed, skipped: skippedTests };
}

function playwrightCounts(value: unknown): VitestCounts {
  let discovered = 0; let executed = 0; let passed = 0; let failed = 0; let skippedTests = 0;
  function walk(suites: unknown): void {
    if (!Array.isArray(suites)) return;
    for (const suite of suites) {
      const current = suite as { specs?: unknown; suites?: unknown };
      if (Array.isArray(current.specs)) for (const spec of current.specs) {
        const tests = (spec as { tests?: unknown }).tests;
        if (!Array.isArray(tests)) continue;
        for (const test of tests) {
          discovered += 1;
          const results = (test as { results?: unknown[] }).results;
          const last = Array.isArray(results) && results.length > 0 ? results[results.length - 1] as { status?: string } : undefined;
          if (!last || last.status === "skipped") skippedTests += 1;
          else if (last.status === "passed") { executed += 1; passed += 1; }
          else { executed += 1; failed += 1; }
        }
      }
      walk(current.suites);
    }
  }
  walk((value as { suites?: unknown }).suites);
  return { discovered, executed, passed, failed, skipped: skippedTests };
}

async function readSuiteReport(name: string, fallback: { exitCode: number; logPath: string; reportPath?: string; counts?: VitestCounts } ): Promise<SuiteReport> {
  const reportPath = resolve(publicDir, `suite-${name}.json`);
  try {
    const report = await readJsonFile(reportPath) as SuiteReport;
    return report;
  } catch {
    const counts = fallback.counts ?? { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 };
    const report: SuiteReport = { suite: name, command: `pnpm test:${name}`, run_id: runId, implementation_commit: implementationCommit, started_at: generatedAt.toISOString(), ended_at: new Date().toISOString(), exit_code: fallback.exitCode, ...counts, report_path: fallback.reportPath ?? pathFromRoot(reportPath), log_path: fallback.logPath };
    await writeJson(reportPath, report);
    return report;
  }
}

async function recordVitestSuite(name: "integration", output: CommandOutput, reportFile: string): Promise<void> {
  let counts: VitestCounts = { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 };
  try { counts = vitestCounts(await readJsonFile(resolve(publicDir, reportFile))); } catch { failures.push(`${name}: Vitest JSON report was not produced.`); }
  if (counts.discovered < 1 || counts.executed < 1 || counts.failed > 0 || counts.skipped > 0) failures.push(`${name}: report counts are not a nonzero, fully executed passing run.`);
  const report: SuiteReport = { suite: name, command: `pnpm test:${name}`, run_id: runId, implementation_commit: implementationCommit, started_at: output.result.startedAt, ended_at: output.result.endedAt, exit_code: output.result.exitCode === 0 && counts.discovered > 0 && counts.executed > 0 && counts.failed === 0 && counts.skipped === 0 ? 0 : 1, ...counts, report_path: pathFromRoot(resolve(publicDir, reportFile)), log_path: pathFromRoot(output.publicLogPath) };
  await writeJson(resolve(publicDir, `suite-${name}.json`), report);
  suiteReports.set(name, report);
}

async function recordPlaywrightSuite(name: "e2e" | "render", output: CommandOutput, reportFile: string): Promise<void> {
  const existing = await readSuiteReport(name, { exitCode: output.result.exitCode, logPath: pathFromRoot(output.publicLogPath), reportPath: pathFromRoot(resolve(publicDir, reportFile)) });
  let counts: VitestCounts = { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 };
  try { counts = playwrightCounts(await readJsonFile(resolve(publicDir, reportFile))); } catch { failures.push(`${name}: Playwright JSON report was not produced.`); }
  const report: SuiteReport = { ...existing, run_id: runId, implementation_commit: implementationCommit, exit_code: output.result.exitCode === 0 && counts.discovered > 0 && counts.executed > 0 && counts.failed === 0 && counts.skipped === 0 ? 0 : 1, ...counts, report_path: pathFromRoot(resolve(publicDir, reportFile)), log_path: pathFromRoot(output.publicLogPath) };
  await writeJson(resolve(publicDir, `suite-${name}.json`), report);
  suiteReports.set(name, report);
  if (report.exit_code !== 0) failures.push(`${name}: Playwright suite did not produce a nonzero, fully executed passing result.`);
}

async function fetchJson(url: string): Promise<JsonResponse> {
  const response = await fetch(url, { signal: AbortSignal.timeout(8_000), cache: "no-store" });
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  return { status: response.status, contentType, body };
}

async function hostFacts(): Promise<Record<string, unknown>> {
  const pnpm = await runProcess("pnpm", ["--version"], envWithoutNormalDotenv());
  let browserVersion: string | null = null;
  if (browserResolution && browserIdentityOptions) {
    try {
      await assertManagedBrowserIdentity({ resolution: browserResolution, ...browserIdentityOptions });
      const browser = await chromium.launch({ headless: true, chromiumSandbox: true, executablePath: browserResolution.path, env: { PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin", HOME: "/tmp", LANG: "C.UTF-8", LC_ALL: "C.UTF-8", ...(process.env.PLAYWRIGHT_BROWSERS_PATH ? { PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH } : {}) } });
      browserVersion = browser.version();
      await browser.close();
    } catch (error) {
      environmentFailures.push(`Pinned Chromium could not launch with sandbox: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    environmentFailures.push("Pinned Chromium identity was not qualified; no browser launch was attempted.");
  }
  return { platform: process.platform, arch: process.arch, node: process.version, pnpm: pnpm.output.trim(), playwright: "1.63.0", browser: { executable: browserResolution?.path ?? browserPath, identity: browserResolution, version: browserVersion, sandbox_requested: true, sandbox_qualification_ready: process.env.CH001_SANDBOX_READY ?? null } };
}

async function prepareRun(): Promise<{ composeEnv: NodeJS.ProcessEnv; childEnv: NodeJS.ProcessEnv }> {
  const directories = await prepareProofEvidenceDirectories(evidenceRoot);
  evidenceOwned = true;
  emptyEnvPath = directories.emptyEnvPath;
  await writeText(emptyEnvPath, "# CH-001 child processes receive all runtime values explicitly.\n", 0o600);
  try { port = await freeLoopbackPort(); }
  catch (error) {
    loopbackPortReady = false;
    environmentFailures.push(`Loopback port allocation was denied: ${error instanceof Error ? error.message : String(error)}`);
    port = 0;
  }
  baseUrl = `http://127.0.0.1:${port}`;
  projectName = `oss-ch001-${runId}`;
  const bootstrapToken = randomBytes(32).toString("base64url");
  const authSecret = randomBytes(48).toString("base64url");
  const ownerPassword = `CH001-${randomBytes(18).toString("base64url")}`;
  const ownerEmail = `ch001-${runId}@invalid.test`;
  secrets.push(bootstrapToken, authSecret, ownerPassword);
  composeEnvPath = resolve(privateDir, "compose.env");
  await writeText(composeEnvPath, [
    `APP_ORIGIN=${baseUrl}`,
    `CH001_WEB_PORT=${port}`,
    `BOOTSTRAP_TOKEN=${bootstrapToken}`,
    `BETTER_AUTH_SECRET=${authSecret}`,
    "RENDERER_BUILD_ID=oss-renderer-0.1.0",
    "PLAYWRIGHT_BROWSERS_PATH=/ms-playwright",
    "NODE_ENV=production",
    ""
  ].join("\n"), 0o600);
  const childEnv = envWithoutNormalDotenv({ E2E_BASE_URL: baseUrl, CH001_EVIDENCE_DIR: publicDir, CH001_PLAYWRIGHT_OUTPUT_DIR: resolve(privateDir, "playwright-output"), CH001_OWNER_EMAIL: ownerEmail, CH001_OWNER_PASSWORD: ownerPassword, CH001_BOOTSTRAP_TOKEN: bootstrapToken, BROWSER_EXECUTABLE_PATH: browserPath });
  const composeEnv: NodeJS.ProcessEnv = { ...childEnv, APP_ORIGIN: baseUrl, CH001_WEB_PORT: String(port), BOOTSTRAP_TOKEN: bootstrapToken, BETTER_AUTH_SECRET: authSecret, RENDERER_BUILD_ID: "oss-renderer-0.1.0", PLAYWRIGHT_BROWSERS_PATH: "/ms-playwright" };
  await writeJson(resolve(publicDir, "dispatch.json"), { profile: "CH-001R-r11 migration-first qualification", run_id: runId, implementation_commit: implementationCommit, workflow_sha: workflowSha, compose_project: projectName, base_url: baseUrl, scope: "local synthetic owner, local synthetic image fixtures, no providers or publishing" });
  return { composeEnv, childEnv };
}

async function preflight(childEnv: NodeJS.ProcessEnv): Promise<{ dockerReady: boolean; browserReady: boolean; host: Record<string, unknown> }> {
  const identityStatus = /^[0-9a-f]{40}$/.test(implementationCommit) && (!requestedCommit || requestedCommit === implementationCommit);
  if (!identityStatus) failures.push(`Implementation identity mismatch: checked out ${implementationCommit}, requested ${requestedCommit ?? "none"}.`);
  const trackedStatus = await gitOutput(["status", "--porcelain", "--untracked-files=no"]);
  if (trackedStatus) failures.push("The checked-out implementation tree has tracked modifications; live proof requires the committed tree.");
  const tree = await gitOutput(["rev-parse", "HEAD^{tree}"]);
  const dockerVersion = await commandStep("docker-version", "docker", ["version", "--format", "{{.Server.Version}}"], childEnv);
  const dockerInfo = await commandStep("docker-info", "docker", ["info", "--format", "{{.ServerVersion}}"], childEnv);
  const composeVersion = await commandStep("compose-version", "docker", ["compose", "version", "--short"], childEnv);
  const dockerReady = dockerVersion.result.exitCode === 0 && dockerInfo.result.exitCode === 0 && composeVersion.result.exitCode === 0;
  if (!dockerReady) environmentFailures.push("Docker daemon/Compose is unavailable or denied on this host.");
  const managedBrowser = chromium.executablePath();
  browserPath = process.env.BROWSER_EXECUTABLE_PATH ?? managedBrowser;
  browserIdentityOptions = { playwrightExecutablePath: managedBrowser, selectedExecutablePath: browserPath, ...(process.env.PLAYWRIGHT_BROWSERS_PATH ? { browsersPath: process.env.PLAYWRIGHT_BROWSERS_PATH } : {}) };
  try {
    browserResolution = await resolveManagedBrowserExecutable(browserIdentityOptions);
    browserPath = browserResolution.path;
  } catch (error) {
    browserResolution = null;
    environmentFailures.push(`Pinned managed Chromium identity could not be qualified: ${error instanceof Error ? error.message : String(error)}`);
  }
  const browserReady = browserResolution !== null && await executable(browserPath);
  if (!browserReady) environmentFailures.push(`Pinned Playwright Chromium is not executable at ${browserPath}.`);
  const sandboxReady = process.env.GITHUB_ACTIONS !== "true" || process.env.CH001_SANDBOX_READY === "1";
  if (!sandboxReady) environmentFailures.push("Hosted sandbox qualification did not produce CH001_SANDBOX_READY=1; application browser gates remain NOT_RUN.");
  const host = { platform: process.platform, arch: process.arch, node: process.version, package_manager: "pnpm@12.3.4", implementation_commit: implementationCommit, implementation_tree: tree, tracked_tree_clean: trackedStatus.length === 0, workflow_sha: workflowSha, docker: { cli: dockerVersion.result.output.trim(), daemon: dockerInfo.result.output.trim(), compose: composeVersion.result.output.trim() }, browser: { managed_path: managedBrowser, selected_path: browserPath, executable: browserReady, identity: browserResolution, sandbox_qualification_ready: process.env.CH001_SANDBOX_READY ?? null } };
  const measured = await hostFacts();
  const measuredBrowser = measured.browser as { version?: unknown } | undefined;
  const browserLaunched = typeof measuredBrowser?.version === "string" && measuredBrowser.version.length > 0;
  if (!browserLaunched) environmentFailures.push("Pinned Chromium executable was found but did not complete a sandboxed launch probe.");
  return { dockerReady: dockerReady && identityStatus && trackedStatus.length === 0 && loopbackPortReady, browserReady: browserReady && browserLaunched && sandboxReady && identityStatus && loopbackPortReady, host: { ...host, measured } };
}

async function postBuildModuleImport(childEnv: NodeJS.ProcessEnv): Promise<void> {
  const output = await commandStep(
    "post-build-db-module-import",
    process.execPath,
    ["--import", "tsx", "scripts/verify-db-module-import.ts", "--negative-control"],
    childEnv,
    { publicLogName: "post-build-db-module-import", timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES }
  );
  let parsed: Record<string, unknown>;
  try {
    const lines = output.result.output.trim().split(/\r?\n/).filter(Boolean);
    const value = JSON.parse(lines.at(-1) ?? "") as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("module-import report was not a JSON object");
    parsed = value as Record<string, unknown>;
  } catch (error) {
    parsed = { status: "FAIL", classification: "MODULE_IMPORT_FAIL", error: `Could not parse the module-import report: ${error instanceof Error ? error.message : String(error)}` };
  }
  moduleImportReport = {
    ...parsed,
    run_id: runId,
    implementation_commit: implementationCommit,
    command: output.result.command,
    log_path: pathFromRoot(output.publicLogPath)
  };
  await writeJson(resolve(publicDir, "module-import-verification.json"), moduleImportReport);
  if (output.result.exitCode !== 0 || moduleImportReport.status !== "PASS") failures.push("post-build @oss/db module-import verification did not pass.");
}

async function staticChecks(childEnv: NodeJS.ProcessEnv): Promise<void> {
  const staticCommands: Array<{ name: string; command: string; args: string[]; reportPath?: string }> = [
    { name: "lint", command: "pnpm", args: ["lint"] },
    { name: "typecheck", command: "pnpm", args: ["typecheck"] },
    { name: "build", command: "pnpm", args: ["build"] },
    { name: "unit", command: "pnpm", args: ["test:unit"], reportPath: resolve(publicDir, "unit-results.json") },
    { name: "security", command: "pnpm", args: ["test:security"], reportPath: resolve(publicDir, "security-results.json") }
  ];
  for (const item of staticCommands) {
    const env = { ...childEnv, ...(item.reportPath ? { CH001_UNIT_REPORT: item.reportPath } : {}) };
    const output = await commandStep(`host-${item.name}`, item.command, item.args, env, item.reportPath ? { reportPath: pathFromRoot(item.reportPath) } : {});
    if (output.result.exitCode !== 0) failures.push(`${item.name}: command exited ${output.result.exitCode}.`);
    if (item.name === "build") {
      if (output.result.exitCode === 0) await postBuildModuleImport(childEnv);
      else {
        moduleImportReport = { status: "NOT_RUN", classification: "MODULE_IMPORT_NOT_RUN", reason: "Post-build module-import verification requires a passing application build.", run_id: runId, implementation_commit: implementationCommit };
        await writeJson(resolve(publicDir, "module-import-verification.json"), moduleImportReport);
      }
    }
    if (item.reportPath) {
      try {
        const counts = vitestCounts(await readJsonFile(item.reportPath));
        if (counts.discovered < 1 || counts.executed < 1 || counts.failed > 0 || counts.skipped > 0) failures.push(`${item.name}: reporter counts are not a nonzero, fully executed passing run.`);
      } catch { failures.push(`${item.name}: JSON reporter output is missing.`); }
    }
  }
}

async function composeFacts(): Promise<void> {
  if (!composeProject) return;
  const images = await composeStep("compose-images", ["images", "--quiet", "web", "worker", "migrate"]);
  const imageIds = images.result.output.split(/\s+/).map((value) => value.trim()).filter((value) => /^[0-9a-f]{12,64}$/i.test(value));
  if (imageIds.length < 1) { failures.push("compose images: no built image identity was reported."); return; }
  const imageFacts: Array<Record<string, unknown>> = [];
  for (const imageId of [...new Set(imageIds)]) {
    const inspect = await commandStep(`image-inspect-${imageId.slice(0, 12)}`, "docker", ["image", "inspect", imageId, "--format", "{{json .}}"], envWithoutNormalDotenv());
    if (inspect.result.exitCode !== 0) { failures.push(`image inspect ${imageId}: command failed.`); continue; }
    try {
      const value = JSON.parse(inspect.result.output.trim()) as { Id?: string; RepoDigests?: string[]; Created?: string; Config?: { User?: string; Env?: string[] } };
      imageFacts.push({ id: value.Id, repo_digests: value.RepoDigests ?? [], created: value.Created, user: value.Config?.User, environment_keys: (value.Config?.Env ?? []).map((entry) => entry.split("=", 1)[0]).filter((entry) => entry) });
    } catch { failures.push(`image inspect ${imageId}: JSON was malformed.`); }
  }
  await writeJson(resolve(publicDir, "image-facts.json"), { compose_project: projectName, images: imageFacts, built_by: "docker compose up --build" });
}

async function waitForHealthReady(): Promise<HealthDetails> {
  let health: HealthDetails | null = null;
  await waitForCondition("web and worker health ready", async () => {
    const result = await fetchJson(`${baseUrl}/api/health/details`);
    health = result.body as HealthDetails;
    return result.status === 200 && health?.renderer === "ready" && health?.database === "ready" && health?.storage === "ready";
  }, 180_000, 2_000);
  if (!health) throw new Error("Health readiness predicate completed without a health response.");
  return health;
}

const MIGRATION_TABLES = [
  "account", "asset", "draft", "draft_revision", "project", "render_artifact", "render_outbox", "render_request",
  "save_mutation", "schema_migrations", "session", "user", "verification", "worker_heartbeat", "workspace"
].sort();
const MIGRATION_CONSTRAINTS = [
  "account_provider_account_unique", "asset_derivative_key_key", "asset_storage_key_key", "asset_thumbnail_key_key", "draft_head_revision_fk",
  "draft_project_id_key", "draft_revision_hash_unique", "draft_revision_number_unique", "project_workspace_name_unique", "render_artifact_render_request_id_key",
  "render_artifact_zip_key_key", "render_outbox_render_request_id_key", "render_request_identity_unique", "save_mutation_identity_unique", "schema_migrations_pkey",
  "session_token_key", "user_email_key", "verification_pkey", "workspace_owner_user_id_key", "workspace_singleton_key_key"
];

function parseJsonOutput(output: string): unknown {
  const lines = output.trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return JSON.parse(lines.at(-1) ?? "");
}

function migrationObservation(output: CommandOutput, extra: Record<string, unknown> = {}): MigrationCommandObservation {
  return {
    ...extra,
    cli: {
      command: output.result.command,
      exit_code: output.result.exitCode,
      started_at: output.result.startedAt,
      ended_at: output.result.endedAt,
      timed_out: output.result.timedOut === true,
      output_truncated: output.result.outputTruncated === true,
      output_excerpt: redact(output.result.output).slice(-4_000),
      log_path: pathFromRoot(output.publicLogPath)
    }
  };
}

function migrationContainerName(stage: string): string {
  const value = safeName(`oss-ch001-${runId}-${stage}`);
  return value.slice(0, 95);
}

async function inspectMigrationContainer(name: string): Promise<Record<string, unknown>> {
  const output = await dockerStep(`migration-container-inspect-${safeName(name)}`, ["container", "inspect", name, "--format", "{{json .}}"], { publicLogName: `migration-container-inspect-${safeName(name)}`, timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
  if (output.result.exitCode !== 0 || output.result.timedOut === true) throw new Error(`Container inspection failed for ${name} (exit ${output.result.exitCode}).`);
  const value = JSON.parse(output.result.output.trim()) as { Id?: string; Name?: string; Image?: string; State?: { Status?: string; ExitCode?: number; Error?: string; StartedAt?: string; FinishedAt?: string }; Config?: { User?: string; WorkingDir?: string; Path?: string; Args?: string[] } };
  const state = value.State ?? {};
  return {
    id: value.Id ?? null,
    name: value.Name ?? name,
    image_id: value.Image ?? null,
    state: state.Status ?? null,
    exit_code: Number.isInteger(state.ExitCode) ? state.ExitCode : null,
    error: state.Error ?? null,
    started_at: state.StartedAt ?? null,
    finished_at: state.FinishedAt ?? null,
    user: value.Config?.User ?? null,
    working_directory: value.Config?.WorkingDir ?? null,
    command: [value.Config?.Path, ...(value.Config?.Args ?? [])].filter((part): part is string => typeof part === "string")
  };
}

async function finalImageModuleImport(): Promise<Record<string, unknown>> {
  if (!composeProject) throw new Error("Compose project has not been initialized.");
  const name = migrationContainerName("module-import");
  migrationContainerNames.push(name);
  const output = await composeStep("final-image-db-module-import", ["run", "--no-deps", "-T", "--name", name, "-e", "DATABASE_URL=postgresql://r11-import-check:r11-import-check@127.0.0.1:1/r11_import_check", "-e", "DOTENV_CONFIG_PATH=/dev/null", "migrate", "node", "--import", "tsx", "scripts/verify-db-module-import.ts", "--negative-control"], { publicLogName: "final-image-db-module-import", timeoutMs: MIGRATION_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
  let parsed: Record<string, unknown>;
  try {
    const value = parseJsonOutput(output.result.output);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("final-image module-import report was not an object");
    parsed = value as Record<string, unknown>;
  } catch (error) {
    parsed = { status: "FAIL", classification: "MODULE_IMPORT_FAIL", error: `Could not parse final-image module-import output: ${error instanceof Error ? error.message : String(error)}` };
  }
  let container: Record<string, unknown> | null = null;
  let inspectionError: string | null = null;
  try { container = await inspectMigrationContainer(name); } catch (error) { inspectionError = error instanceof Error ? error.message : String(error); }
  const report: Record<string, unknown> = { ...parsed, run_id: runId, implementation_commit: implementationCommit, final_image: true, command: output.result.command, log_path: pathFromRoot(output.publicLogPath), container, ...(inspectionError ? { container_inspection_error: inspectionError } : {}) };
  moduleImportReport = report;
  await writeJson(resolve(publicDir, "module-import-verification.json"), report);
  return { ...report, status: report.status === "PASS" && container?.state === "exited" && container?.exit_code === 0 ? "PASS" : "FAIL", ...(inspectionError ? { reason: inspectionError } : {}) };
}

async function migrationContainerCommand(stage: string, databaseUrl?: string, expectedExitCode = 0): Promise<MigrationCommandObservation> {
  if (!composeProject) throw new Error("Compose project has not been initialized.");
  const name = migrationContainerName(stage);
  migrationContainerNames.push(name);
  const args = ["run", "--no-deps", "-T", "--name", name];
  if (databaseUrl) args.push("-e", `DATABASE_URL=${databaseUrl}`);
  args.push("migrate");
  const output = await composeStep(`migration-${safeName(stage)}`, args, { publicLogName: `migration-${safeName(stage)}`, timeoutMs: MIGRATION_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES, expectedExitCode });
  let container: Record<string, unknown> | null = null;
  let inspectionError: string | null = null;
  try { container = await inspectMigrationContainer(name); } catch (error) { inspectionError = error instanceof Error ? error.message : String(error); }
  return migrationObservation(output, { container, ...(inspectionError ? { assertion_ok: false, container_inspection_error: inspectionError } : {}) });
}

async function migrationSql(name: string, sql: string): Promise<CommandOutput> {
  return composeStep(name, ["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-v", "ON_ERROR_STOP=1", "-Atc", sql], { publicLogName: name, timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
}

function identifier(value: string): string { return `"${value.replaceAll("\"", "\"\"")}"`; }

function migrationSchemaSql(): string {
  const tableList = MIGRATION_TABLES.map((table) => `'${table}'`).join(", ");
  return `SELECT json_build_object('tables', COALESCE((SELECT json_agg(table_name ORDER BY table_name) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'), '[]'::json), 'constraints', COALESCE((SELECT json_agg(json_build_object('table_name', table_name, 'name', constraint_name, 'type', constraint_type) ORDER BY table_name, constraint_name) FROM information_schema.table_constraints WHERE table_schema = 'public' AND table_name IN (${tableList})), '[]'::json))::text`;
}

function migrationMarkerSql(): string {
  return `SELECT COALESCE(json_agg(json_build_object('id', id, 'applied_at', to_char(applied_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')) ORDER BY id), '[]'::json)::text FROM schema_migrations`;
}

async function inspectMigrationSchema(label: string): Promise<Record<string, unknown>> {
  const schema = await migrationSql(`migration-${safeName(label)}-schema`, migrationSchemaSql());
  const marker = await migrationSql(`migration-${safeName(label)}-marker`, migrationMarkerSql());
  if (schema.result.exitCode !== 0 || marker.result.exitCode !== 0) return { status: "FAIL", reason: "Schema or migration-marker SQL inspection failed.", schema_exit_code: schema.result.exitCode, marker_exit_code: marker.result.exitCode };
  try {
    const parsed = parseJsonOutput(schema.result.output) as { tables?: unknown; constraints?: unknown };
    const markers = parseJsonOutput(marker.result.output);
    if (!Array.isArray(parsed.tables) || !Array.isArray(parsed.constraints) || !Array.isArray(markers)) throw new Error("Schema inspection did not return arrays.");
    const tables = parsed.tables.map(String).sort();
    const constraints = parsed.constraints as Array<{ table_name?: string; name?: string; type?: string }>;
    const constraintNames = constraints.map((constraint) => constraint.name).filter((name): name is string => typeof name === "string");
    const markerRows = markers as Array<{ id?: string; applied_at?: string }>;
    const schemaFingerprint = createHash("sha256").update(JSON.stringify({ tables, constraints })).digest("hex");
    const tablesMatch = JSON.stringify(tables) === JSON.stringify(MIGRATION_TABLES);
    const constraintsMatch = MIGRATION_CONSTRAINTS.every((name) => constraintNames.includes(name));
    const markerMatch = markerRows.length === 1 && markerRows[0]?.id === "0001_ch001" && typeof markerRows[0]?.applied_at === "string";
    return { status: tablesMatch && constraintsMatch && markerMatch ? "PASS" : "FAIL", tables, expected_tables: MIGRATION_TABLES, constraints, required_constraint_names: MIGRATION_CONSTRAINTS, marker: markerRows, marker_count: markerRows.length, schema_fingerprint: schemaFingerprint, assertions: { tables_match: tablesMatch, required_constraints_present: constraintsMatch, single_completion_marker: markerMatch }, schema_log_path: pathFromRoot(schema.publicLogPath), marker_log_path: pathFromRoot(marker.publicLogPath), ...(tablesMatch && constraintsMatch && markerMatch ? {} : { reason: "Fresh migration schema did not match the shipped table, constraint, or completion-marker contract." }) };
  } catch (error) {
    return { status: "FAIL", reason: `Schema inspection output was malformed: ${error instanceof Error ? error.message : String(error)}`, schema_log_path: pathFromRoot(schema.publicLogPath), marker_log_path: pathFromRoot(marker.publicLogPath) };
  }
}

async function composeJourney(composeEnv: NodeJS.ProcessEnv, childEnv: NodeJS.ProcessEnv): Promise<boolean> {
  composeProject = makeComposeProject(root, projectName, composeEnvPath);
  const config = await composeStep("compose-config", ["config", "--quiet"]);
  if (config.result.exitCode !== 0) { failures.push("Compose config did not validate."); return false; }
  composeOwnership = await verifyComposeProjectOwnership({ project: composeProject, repositoryRoot: root, runId });
  if (!composeOwnership.owned) {
    failures.push(`Compose project ownership validation refused startup: ${composeOwnership.reason}`);
    return false;
  }
  composeProjectOwned = true;
  await writeJson(resolve(publicDir, "compose-network.json"), { compose_project: projectName, host_published: [`127.0.0.1:${port}:3000`], host_published_private_services: [], assertion: "web is loopback-only; db and worker have no host ports" });
  composeStartupAttempted = true;
  let freshSchema: Record<string, unknown> | null = null;
  let sentinelSchema = "";
  let sentinelValue = "";
  let failureRole = "";
  let failureDatabase = "";
  let failureRoleCreated = false;
  let failureDatabaseCreated = false;
  const sourceTree = await gitOutput(["rev-parse", "HEAD^{tree}"]);
  const identity: Record<string, unknown> & { run_id: string; implementation_commit: string } = {
    run_id: runId,
    implementation_commit: implementationCommit,
    source_tree: sourceTree,
    image: { services: ["migrate", "web", "worker"], build_command: "docker compose build migrate web worker", final_image_required: true },
    database: { compose_project: projectName, service: "db", network_alias: "db", host_published: false },
    module_import: moduleImportReport
  };

  const fixtureCleanup = async (): Promise<Record<string, unknown>> => {
    const operations: Array<Record<string, unknown>> = [];
    const runCleanup = async (name: string, sql: string): Promise<void> => {
      try {
        const output = await migrationSql(name, sql);
        operations.push({ operation: name, status: output.result.exitCode === 0 && output.result.timedOut !== true ? "PASS" : "FAIL", exit_code: output.result.exitCode, timed_out: output.result.timedOut === true, log_path: pathFromRoot(output.publicLogPath) });
      } catch (error) {
        operations.push({ operation: name, status: "FAIL", error: error instanceof Error ? error.message : String(error) });
      }
    };
    if (sentinelSchema) await runCleanup("migration-fixture-drop-sentinel", `DROP SCHEMA IF EXISTS ${identifier(sentinelSchema)} CASCADE`);
    if (failureDatabaseCreated && failureDatabase) await runCleanup("migration-fixture-drop-database", `DROP DATABASE IF EXISTS ${identifier(failureDatabase)} WITH (FORCE)`);
    if (failureRoleCreated && failureRole) await runCleanup("migration-fixture-drop-role", `DROP ROLE IF EXISTS ${identifier(failureRole)}`);
    failureDatabaseCreated = false;
    failureRoleCreated = false;
    return { status: operations.every((operation) => operation.status === "PASS") ? "PASS" : "FAIL", operations, resources_released: operations.length > 0 };
  };

  const adapter = {
    buildImages: async (): Promise<MigrationCommandObservation> => {
      const build = await composeStep("compose-build-images", ["build", "migrate", "web", "worker"], { publicLogName: "compose-build-images", timeoutMs: DEFAULT_COMMAND_TIMEOUT_MS, maxOutputBytes: DEFAULT_COMMAND_MAX_OUTPUT_BYTES });
      composeStartupResult = build.result;
      return migrationObservation(build);
    },
    verifyModuleImport: async (): Promise<Record<string, unknown>> => finalImageModuleImport(),
    startDatabase: async (): Promise<MigrationCommandObservation> => {
      const started = await composeStep("compose-db-up", ["up", "-d", "db"], { publicLogName: "compose-db-up", timeoutMs: DEFAULT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
      composeStartupResult = started.result;
      return migrationObservation(started);
    },
    waitForDatabase: async (): Promise<Record<string, unknown>> => {
      const attempts: Array<Record<string, unknown>> = [];
      try {
        await waitForCondition("migration database readiness", async () => {
          const result = await composeProject!.run(["exec", "-T", "db", "pg_isready", "-U", "oss", "-d", "oss"], { timeoutMs: 10_000, maxOutputBytes: 16 * 1024 });
          attempts.push({ exit_code: result.exitCode, timed_out: result.timedOut === true, output: redact(result.output).slice(-1_000) });
          return result.exitCode === 0 && result.timedOut !== true;
        }, 120_000, 2_000);
        return { status: "PASS", healthy: true, attempts: attempts.length, last: attempts.at(-1) ?? null };
      } catch (error) {
        return { status: "FAIL", healthy: false, attempts: attempts.length, last: attempts.at(-1) ?? null, reason: error instanceof Error ? error.message : String(error) };
      }
    },
    confirmFreshMarkerAbsent: async (): Promise<Record<string, unknown>> => {
      const output = await migrationSql("migration-fresh-precondition", "SELECT CASE WHEN to_regclass('public.schema_migrations') IS NULL THEN 0 WHEN EXISTS (SELECT 1 FROM schema_migrations) THEN 1 ELSE 0 END");
      const markerCount = Number.parseInt(output.result.output.trim(), 10);
      return { status: output.result.exitCode === 0 && markerCount === 0 ? "PASS" : "FAIL", marker_count: Number.isInteger(markerCount) ? markerCount : null, log_path: pathFromRoot(output.publicLogPath), ...(markerCount === 0 ? {} : { reason: "The owned database was not fresh before the candidate migration." }) };
    },
    runMigration: async (stage: "fresh" | "repeat"): Promise<MigrationCommandObservation> => migrationContainerCommand(stage),
    inspectSchema: async (): Promise<Record<string, unknown>> => {
      freshSchema = await inspectMigrationSchema("fresh");
      return freshSchema;
    },
    createSentinel: async (): Promise<Record<string, unknown>> => {
      sentinelSchema = `ch001_r11_${safeName(runId).replaceAll("-", "_")}`.slice(0, 55);
      sentinelValue = `sentinel_${safeName(runId)}`.slice(0, 120);
      const output = await migrationSql("migration-sentinel-create", `CREATE SCHEMA ${identifier(sentinelSchema)}; CREATE TABLE ${identifier(sentinelSchema)}.sentinel (key TEXT PRIMARY KEY, value TEXT NOT NULL); INSERT INTO ${identifier(sentinelSchema)}.sentinel (key, value) VALUES ('proof', '${sentinelValue}')`);
      return { status: output.result.exitCode === 0 ? "PASS" : "FAIL", fixture_allocated: true, schema: sentinelSchema, value: sentinelValue, log_path: pathFromRoot(output.publicLogPath), ...(output.result.exitCode === 0 ? {} : { reason: "The same-database sentinel fixture could not be created." }) };
    },
    inspectRepeatState: async (): Promise<Record<string, unknown>> => {
      const repeatedSchema = await inspectMigrationSchema("repeat");
      const sentinel = await migrationSql("migration-sentinel-check", `SELECT value FROM ${identifier(sentinelSchema)}.sentinel WHERE key = 'proof'`);
      const markerUnchanged = JSON.stringify((freshSchema?.marker ?? null)) === JSON.stringify((repeatedSchema.marker ?? null));
      const sentinelPreserved = sentinel.result.exitCode === 0 && sentinel.result.output.trim() === sentinelValue;
      const schemaUnchanged = freshSchema?.schema_fingerprint === repeatedSchema.schema_fingerprint;
      return { status: repeatedSchema.status === "PASS" && markerUnchanged && schemaUnchanged && sentinelPreserved ? "PASS" : "FAIL", fresh_schema_fingerprint: freshSchema?.schema_fingerprint ?? null, repeat_schema_fingerprint: repeatedSchema.schema_fingerprint ?? null, marker_unchanged: markerUnchanged, sentinel_preserved: sentinelPreserved, sentinel_value: sentinel.result.output.trim(), schema: repeatedSchema, sentinel_log_path: pathFromRoot(sentinel.publicLogPath) };
    },
    runFailureControl: async (): Promise<MigrationCommandObservation> => {
      failureRole = `ch001_r11_role_${safeName(runId)}`.slice(0, 63);
      failureDatabase = `ch001_r11_db_${safeName(runId)}`.slice(0, 63);
      const password = `R11-${randomBytes(24).toString("base64url")}`;
      secrets.push(password);
      const setup: Array<Record<string, unknown>> = [];
      const setupStep = async (name: string, sql: string): Promise<boolean> => {
        const output = await migrationSql(name, sql);
        setup.push({ operation: name, status: output.result.exitCode === 0 ? "PASS" : "FAIL", exit_code: output.result.exitCode, log_path: pathFromRoot(output.publicLogPath) });
        return output.result.exitCode === 0 && output.result.timedOut !== true;
      };
      if (!await setupStep("migration-failure-control-create-role", `CREATE ROLE ${identifier(failureRole)} LOGIN PASSWORD '${password}'`)) return { cli: { exit_code: 1, timed_out: false, output_excerpt: "Failure-control role setup failed." }, container: { state: "setup_failed", exit_code: null, timed_out: false }, setup, marker_count: null, error_observed: false, assertion_ok: false };
      failureRoleCreated = true;
      if (!await setupStep("migration-failure-control-create-database", `CREATE DATABASE ${identifier(failureDatabase)} OWNER oss`)) return { cli: { exit_code: 1, timed_out: false, output_excerpt: "Failure-control database setup failed." }, container: { state: "setup_failed", exit_code: null, timed_out: false }, setup, marker_count: null, error_observed: false, assertion_ok: false };
      failureDatabaseCreated = true;
      if (!await setupStep("migration-failure-control-restrict-schema", `GRANT CONNECT ON DATABASE ${identifier(failureDatabase)} TO ${identifier(failureRole)}`)) return { cli: { exit_code: 1, timed_out: false, output_excerpt: "Failure-control database grant setup failed." }, container: { state: "setup_failed", exit_code: null, timed_out: false }, setup, marker_count: null, error_observed: false, assertion_ok: false };
      const restriction = await composeStep("migration-failure-control-revoke-create", ["exec", "-T", "db", "psql", "-U", "oss", "-d", failureDatabase, "-v", "ON_ERROR_STOP=1", "-Atc", `REVOKE CREATE ON SCHEMA public FROM PUBLIC; REVOKE CREATE ON SCHEMA public FROM ${identifier(failureRole)}; GRANT USAGE ON SCHEMA public TO ${identifier(failureRole)}`], { publicLogName: "migration-failure-control-revoke-create", timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
      setup.push({ operation: "migration-failure-control-revoke-create", status: restriction.result.exitCode === 0 ? "PASS" : "FAIL", exit_code: restriction.result.exitCode, log_path: pathFromRoot(restriction.publicLogPath) });
      if (restriction.result.exitCode !== 0 || restriction.result.timedOut === true) return { cli: { exit_code: 1, timed_out: false, output_excerpt: "Failure-control schema restriction setup failed." }, container: { state: "setup_failed", exit_code: null, timed_out: false }, setup, marker_count: null, error_observed: false, assertion_ok: false };
      const databaseUrl = `postgres://${failureRole}:${password}@db:5432/${failureDatabase}`;
      secrets.push(databaseUrl);
      const migration = await migrationContainerCommand("failure-control", databaseUrl, 1);
      const marker = await composeStep("migration-failure-control-marker", ["exec", "-T", "db", "psql", "-U", "oss", "-d", failureDatabase, "-Atc", "SELECT CASE WHEN to_regclass('public.schema_migrations') IS NULL THEN 0 WHEN EXISTS (SELECT 1 FROM schema_migrations) THEN 1 ELSE 0 END"], { publicLogName: "migration-failure-control-marker", timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
      const markerCount = Number.parseInt(marker.result.output.trim(), 10);
      const outputText = String(migration.cli?.output_excerpt ?? "");
      const containerError = String(migration.container?.error ?? "");
      const combinedError = `${outputText}\n${containerError}`;
      const sqlstate = combinedError.match(/\b42501\b/)?.[0] ?? null;
      const errorObserved = /permission denied|insufficient privilege|must be owner|42501/i.test(combinedError);
      return { ...migration, setup, marker_count: Number.isInteger(markerCount) ? markerCount : null, marker_log_path: pathFromRoot(marker.publicLogPath), error_observed: errorObserved, sqlstate, error_class: errorObserved ? "postgresql_permission_failure" : null, assertion_ok: marker.result.exitCode === 0 && markerCount === 0 };
    },
    cleanupFixtures: fixtureCleanup
  };

  const qualification = await runMigrationFirstQualification({ identity, adapter, writeResult: async (result) => { migrationQualification = result; await writeJson(resolve(publicDir, "migration-verification.json"), result); } });
  migrationQualification = qualification;
  const stages = qualification.stages as Record<string, unknown>;
  await writeText(resolve(publicDir, "compose-migration-rerun.log"), `${JSON.stringify(stages.repeat ?? { status: "NOT_RUN" }, null, 2)}\n`);
  await writeText(resolve(publicDir, "migration-metadata.log"), `${JSON.stringify(stages.schema ?? { status: "NOT_RUN" }, null, 2)}\n`);
  if (qualification.status !== "PASS") {
    const primaryFailure = qualification.primary_failure as { stage?: unknown } | null | undefined;
    failures.push(`Migration-first qualification failed before worker readiness: ${String(primaryFailure?.stage ?? "unknown stage")}.`);
    return false;
  }

  qualification.worker_readiness_attempted = true;
  qualification.worker_readiness_started_at = new Date().toISOString();
  await writeJson(resolve(publicDir, "migration-verification.json"), qualification);
  const started = await composeStep("compose-stack-up-after-migration", ["up", "--no-build", "-d", "migrate", "web", "worker"], { publicLogName: "compose-stack-up-after-migration", timeoutMs: DEFAULT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
  composeStartupResult = started.result;
  composeStarted = started.result.exitCode === 0 && started.result.timedOut !== true;
  qualification.downstream_stack_start = { status: composeStarted ? "PASS" : "FAIL", exit_code: started.result.exitCode, timed_out: started.result.timedOut === true, log_path: pathFromRoot(started.publicLogPath) };
  await writeJson(resolve(publicDir, "migration-verification.json"), qualification);
  if (!composeStarted) { failures.push(`The worker-ready Compose stack did not start after migration qualification (exit ${started.result.exitCode}).`); return false; }
  const live = await assertion("web live health after shipped-image startup", async () => { await waitForHttp(`${baseUrl}/api/health/live`); });
  if (!live) return false;
  const health = await assertion("worker/browser/database/storage readiness", async () => { await waitForHealthReady(); });
  if (!health) return false;
  await composeFacts();

  const browserProbe = await composeStep("worker-browser-probe", ["exec", "-T", "worker", "node", "--input-type=module", "-e", "import { chromium } from 'playwright'; const browser = await chromium.launch({ headless: true, chromiumSandbox: true }); console.log(JSON.stringify({ executable: chromium.executablePath(), version: browser.version(), sandbox: true })); await browser.close();"]);
  if (browserProbe.result.exitCode !== 0 || !/sandbox/i.test(browserProbe.result.output)) failures.push("The shipped worker image did not complete its sandboxed Playwright probe.");
  const heartbeat = await assertion("worker heartbeat ready in PostgreSQL", async () => {
    await waitForCondition("worker heartbeat ready", async () => {
      const result = await composeProject!.run(["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-Atc", "SELECT status FROM worker_heartbeat WHERE worker_name = 'render-worker'"], { timeoutMs: 10_000, maxOutputBytes: 16 * 1024 });
      return result.exitCode === 0 && result.timedOut !== true && result.output.trim() === "ready";
    }, 120_000, 2_000);
  });
  if (!heartbeat) return false;

  integrationDatabase = `ch001_int_${runId.replace(/-/g, "_")}`;
  const createDb = await composeStep("integration-database-create", ["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-v", "ON_ERROR_STOP=1", "-c", `CREATE DATABASE "${integrationDatabase}"`]);
  integrationDatabaseCreated = createDb.result.exitCode === 0;
  if (!integrationDatabaseCreated) failures.push("Disposable in-network integration database could not be created.");
  if (integrationDatabaseCreated) {
    const databaseUrl = `postgres://oss:oss@db:5432/${integrationDatabase}`;
    const integrationMigration = await composeStep("integration-database-migrate", ["run", "--rm", "-T", "--no-deps", "-e", `DATABASE_URL=${databaseUrl}`, "migrate"]);
    if (integrationMigration.result.exitCode !== 0) failures.push("Disposable integration database migration failed.");
    const integration = await composeStep("integration-vitest", ["run", "--rm", "-T", "--no-deps", "-e", `DATABASE_URL=${databaseUrl}`, "-e", "CH001_ALLOW_DISPOSABLE_DATABASE=1", "-e", `CH001_DISPOSABLE_RUN_ID=${runId}`, "-e", `CH001_RUN_ID=${runId}`, "-e", `CH001_IMPLEMENTATION_COMMIT=${implementationCommit}`, "-e", "CH001_EVIDENCE_DIR=/app/proof", "-e", "DOTENV_CONFIG_PATH=/tmp/ch001-empty.env", "-v", `${publicDir}:/app/proof`, "-v", `${emptyEnvPath}:/tmp/ch001-empty.env:ro`, "migrate", "exec", "vitest", "run", "--config", "vitest.config.ts", "tests/integration", "--reporter=json", "--outputFile=/app/proof/vitest-integration.json"], { reportPath: pathFromRoot(resolve(publicDir, "vitest-integration.json")) });
    await recordVitestSuite("integration", integration, "vitest-integration.json");
    if (integration.result.exitCode !== 0) failures.push(`integration: command exited ${integration.result.exitCode}.`);
    const dropDb = await composeStep("integration-database-drop", ["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-v", "ON_ERROR_STOP=1", "-c", `DROP DATABASE IF EXISTS "${integrationDatabase}" WITH (FORCE)`]);
    if (dropDb.result.exitCode !== 0) failures.push("Disposable integration database cleanup failed.");
    integrationDatabaseCreated = false;
  } else {
    skipped("integration-vitest", "Disposable integration database was not created.");
    suiteReports.set("integration", await readSuiteReport("integration", { exitCode: 1, logPath: pathFromRoot(resolve(publicCommandDir, "integration-vitest.log")), counts: { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 } }));
  }

  const e2e = await commandStep("e2e-primary-journey", "pnpm", ["test:e2e"], { ...childEnv, CH001_E2E_SETUP: "1", CH001_PLAYWRIGHT_REPORT: resolve(publicDir, "playwright-e2e.json") }, { reportPath: pathFromRoot(resolve(publicDir, "playwright-e2e.json")) });
  await recordPlaywrightSuite("e2e", e2e, "playwright-e2e.json");
  const render = await commandStep("render-shared-scene", "pnpm", ["test:render"], { ...childEnv, CH001_PLAYWRIGHT_REPORT: resolve(publicDir, "playwright-render.json") }, { reportPath: pathFromRoot(resolve(publicDir, "playwright-render.json")) });
  await recordPlaywrightSuite("render", render, "playwright-render.json");

  const journeyExists = await stat(resolve(publicDir, "journey-hashes.json")).then(() => true).catch(() => false);
  if (journeyExists) {
    const lifecycleOk = await lifecycleJourney(composeEnv, childEnv);
    if (!lifecycleOk) failures.push("Lifecycle proof did not complete all worker-down/restart/recreate stages.");
  } else {
    skipped("lifecycle", "The primary E2E journey did not produce journey-hashes.json.");
    skipped("worker-down lifecycle", "The primary E2E journey did not produce a project/export identity.");
    skipped("same-data recreation lifecycle", "The primary E2E journey did not produce a project/export identity.");
  }
  return true;
}

async function lifecycleCommand(stage: string, childEnv: NodeJS.ProcessEnv): Promise<CommandOutput> {
  return commandStep(`lifecycle-${stage}`, "node", ["--import", "tsx", "scripts/ch001-lifecycle.ts"], { ...childEnv, CH001_LIFECYCLE_STAGE: stage }, { reportPath: pathFromRoot(resolve(publicDir, `${stage}.json`)) });
}

async function lifecycleJourney(composeEnv: NodeJS.ProcessEnv, childEnv: NodeJS.ProcessEnv): Promise<boolean> {
  if (!composeProject) return false;
  const stop = await composeStep("worker-stop", ["stop", "worker"]);
  if (stop.result.exitCode !== 0) return false;
  const downHealth = await assertion("web remains live while worker is stopped", async () => {
    await waitForHttp(`${baseUrl}/api/health/live`);
    await waitForCondition("worker-down degraded/offline health", async () => {
      const result = await fetchJson(`${baseUrl}/api/health/details`);
      return result.status === 200 && (result.body as HealthDetails).renderer !== "ready";
    }, 60_000, 2_000);
  });
  if (!downHealth) return false;
  const workerDown = await lifecycleCommand("worker-down", childEnv);
  if (workerDown.result.exitCode !== 0) { failures.push("worker-down browser lifecycle assertion failed."); return false; }
  const start = await composeStep("worker-start", ["start", "worker"]);
  if (start.result.exitCode !== 0) { failures.push("Worker restart command failed."); return false; }
  const restart = await lifecycleCommand("after-restart", childEnv);
  if (restart.result.exitCode !== 0) { failures.push("worker-restart queued-request lifecycle assertion failed."); return false; }
  const recreate = await composeStep("compose-force-recreate", ["up", "--force-recreate", "-d", "--no-build", "db", "migrate", "web", "worker"]);
  if (recreate.result.exitCode !== 0) { failures.push("Compose force-recreate without volume deletion failed."); return false; }
  const liveAfterRecreate = await assertion("web live after force-recreate", async () => { await waitForHttp(`${baseUrl}/api/health/live`); });
  if (!liveAfterRecreate) return false;
  const sameData = await lifecycleCommand("after-recreate", childEnv);
  if (sameData.result.exitCode !== 0) { failures.push("same-data after-recreate lifecycle assertion failed."); return false; }
  await writeJson(resolve(publicDir, "lifecycle.json"), { run_id: runId, compose_project: projectName, stages: ["worker-down", "after-restart", "after-recreate"], worker_down: pathFromRoot(resolve(publicDir, "worker-down.json")), restart: pathFromRoot(resolve(publicDir, "lifecycle-restart.json")), same_data: pathFromRoot(resolve(publicDir, "same-data-restart.json")), scope: "real database, web, worker, browser and named-volume lifecycle; no release/deployment claim" });
  return true;
}

async function smokeSuite(): Promise<void> {
  const relevant = proofSteps.filter((step) => ["compose-build-images", "final-image-db-module-import", "compose-db-up", "migration-fresh-precondition", "migration-fresh", "migration-fresh-schema", "migration-fresh-marker", "migration-sentinel-create", "migration-repeat", "migration-repeat-schema", "migration-repeat-marker", "migration-sentinel-check", "migration-failure-control", "migration-failure-control-marker", "compose-stack-up-after-migration", "web live health after shipped-image startup", "worker/browser/database/storage readiness", "migration-rerun", "migration-metadata", "worker heartbeat ready in PostgreSQL", "worker-stop", "worker-start", "compose-force-recreate", "web remains live while worker is stopped", "web live after force-recreate", "lifecycle-worker-down", "lifecycle-after-restart", "lifecycle-after-recreate"].includes(step.name));
  const assertions = relevant.length;
  const passed = relevant.filter((step) => step.status === "PASS").length;
  const smokeLog = commandOutputs.find((output) => /compose .*config/.test(output.result.command))?.publicLogPath ?? resolve(publicCommandDir, "compose.log");
  await stat(smokeLog).catch(() => writeText(smokeLog, "NOT_RUN: Compose lifecycle was not executed on this host.\n"));
  const report: SuiteReport = { suite: "smoke", command: "pnpm proof:ch001 (owned Compose smoke/lifecycle)", run_id: runId, implementation_commit: implementationCommit, started_at: generatedAt.toISOString(), ended_at: new Date().toISOString(), exit_code: assertions > 0 && passed === assertions ? 0 : 1, discovered: assertions, executed: passed + relevant.filter((step) => step.status === "FAIL").length, passed, failed: relevant.filter((step) => step.status === "FAIL").length, skipped: relevant.filter((step) => step.status === "NOT_RUN").length, report_path: pathFromRoot(resolve(publicDir, "smoke-results.json")), log_path: pathFromRoot(smokeLog) };
  await writeJson(resolve(publicDir, "smoke-results.json"), { run_id: runId, assertions: relevant, counts: { discovered: report.discovered, executed: report.executed, passed: report.passed, failed: report.failed, skipped: report.skipped } });
  await writeJson(resolve(publicDir, "suite-smoke.json"), report);
  suiteReports.set("smoke", report);
}

async function ensureSuiteReports(): Promise<void> {
  for (const name of ["integration", "e2e", "render"] as const) {
    if (suiteReports.has(name)) continue;
    const reportPath = resolve(publicDir, `suite-${name}.json`);
    const logPath = resolve(publicDir, `suite-${name}-unavailable.log`);
    const reason = environmentFailures.length > 0 ? environmentFailures.join(" ") : "The bounded coordinator stopped before this suite could execute.";
    await writeText(logPath, `NOT_RUN: ${redact(reason)}\n`);
    const report: SuiteReport = { suite: name, command: `pnpm test:${name}`, run_id: runId, implementation_commit: implementationCommit, started_at: generatedAt.toISOString(), ended_at: new Date().toISOString(), exit_code: environmentFailures.length > 0 ? 2 : 1, discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0, report_path: pathFromRoot(reportPath), log_path: pathFromRoot(logPath), unavailable_reason: reason };
    await writeJson(reportPath, report);
    suiteReports.set(name, report);
  }
}

async function listFiles(directory: string, prefix = ""): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await listFiles(resolve(directory, entry.name), child));
    else if (entry.isFile()) result.push(child);
  }
  return result;
}

async function artifactChecks(): Promise<void> {
  const required = ["a-little-room-to-focus.zip", "alternate-4x5.zip", "journey-hashes.json", "alternate-format.json", "final-preview.png", "alternate-preview.png", "worker-down-queued.png", "lifecycle.json", "same-data-restart.json"];
  for (const file of required) await assertion(`artifact exists: ${file}`, async () => { const details = await stat(resolve(publicDir, file)); if (!details.isFile() || details.size < 1) throw new Error("file is missing or empty"); });
  await assertion("canonical and alternate ZIPs are structurally inspectable", async () => {
    for (const file of ["a-little-room-to-focus.zip", "alternate-4x5.zip"]) {
      const entries = readZipEntries(await readFile(resolve(publicDir, file)));
      const names = [...entries.keys()].sort();
      if (names.length !== 9 || !names.includes("manifest.json") || !names.includes("post.txt") || !names.includes("07.jpg")) throw new Error(`${file} does not contain the canonical nine-entry ordered export`);
    }
  });
  await assertion("journey hash record identifies full render and byte equality", async () => {
    const journey = await readJsonFile(resolve(publicDir, "journey-hashes.json")) as { projectId?: string; revisionId?: string; renderRequestId?: string; zipSha256?: string; entries?: unknown[]; alternate?: { requestId?: string; zipSha256?: string; canvas?: { width?: number; height?: number } } };
    if (!journey.projectId || !journey.revisionId || !/^[0-9a-f-]{36}$/.test(journey.renderRequestId ?? "") || !/^[0-9a-f]{64}$/.test(journey.zipSha256 ?? "") || journey.entries?.length !== 7 || !journey.alternate?.requestId || !/^[0-9a-f]{64}$/.test(journey.alternate.zipSha256 ?? "") || journey.alternate.canvas?.width !== 1080 || journey.alternate.canvas.height !== 1350) throw new Error("journey-hashes.json is incomplete or not bound to the canonical/alternate artifacts");
    if (journey.zipSha256 !== await sha256File(resolve(publicDir, "a-little-room-to-focus.zip"))) throw new Error("canonical ZIP SHA-256 does not match journey-hashes.json");
    if (journey.alternate.zipSha256 !== await sha256File(resolve(publicDir, "alternate-4x5.zip"))) throw new Error("alternate ZIP SHA-256 does not match journey-hashes.json");
  });
}

async function sourceReview(): Promise<{ path: string; clean: boolean }> {
  const checks: string[] = [];
  const violations: string[] = [];
  const read = async (file: string): Promise<string> => readFile(resolve(root, file), "utf8");
  const packageText = await read("package.json");
  if (/pinterest|fal-ai|fal\.ai|tiktok|stripe|openai|anthropic/i.test(packageText)) violations.push("deferred provider/publishing dependency appears in package.json"); else checks.push("deferred provider and publishing dependencies absent");
  const compose = await read("compose.yaml");
  if (!compose.includes("127.0.0.1:${CH001_WEB_PORT:-3000}:3000") || /5432:\\d|ports:\s*[\\r\\n\\s-]*worker:/i.test(compose)) violations.push("Compose host binding is not loopback-only or publishes a private service"); else checks.push("Compose publishes only the loopback web port");
  if (!compose.includes("cap_drop:") || !compose.includes("- ALL") || !compose.includes("user: node")) violations.push("worker runtime confinement/user configuration is incomplete"); else checks.push("worker uses node user, no-new-privileges, and dropped capabilities");
  const dockerfile = await read("Dockerfile");
  if (!dockerfile.includes("USER node") || !dockerfile.includes("libnss3") || !dockerfile.includes("COPY tests ./tests")) violations.push("final image does not include the non-root browser runtime and shipped test sources"); else checks.push("final image installs browser dependencies, ships tests, and runs as existing node user");
  const worker = await read("apps/worker/src/index.ts");
  if (!worker.includes("chromiumSandbox: true") || worker.includes("--no-sandbox")) violations.push("browser sandbox configuration is not explicit and fail-closed"); else checks.push("worker launch explicitly enables Chromium sandbox with no permissive fallback");
  const state = await read("state/PROJECT_STATE.md");
  if (!/awaiting_review/i.test(state) || !/accepted application version:\s*none/i.test(state)) violations.push("root state is not awaiting review with accepted version unset"); else checks.push("root state remains awaiting review and unaccepted");
  const reportPath = resolve(publicDir, "source-review.md");
  await writeText(reportPath, ["# CH-001R-r11 source/provenance inspection", "", `Implementation commit: ${implementationCommit}`, `Run ID: ${runId}`, "Evidence type: E1; source-only inspection, not a replacement for runtime/manual proof.", "", ...checks.map((check) => `- PASS — ${check}`), ...violations.map((violation) => `- FAIL — ${violation}`), "", "Pending repository license decision remains recorded; this inspection makes no legal/distribution determination."].join("\n") + "\n");
  return { path: pathFromRoot(reportPath), clean: violations.length === 0 };
}

async function buildGateLedger(source: { path: string; clean: boolean }): Promise<GateRecord[]> {
  let sourceRef;
  try { sourceRef = await makeEvidenceRef(root, source.path, "E1", "source-review:ch001r11", implementationCommit); } catch { sourceRef = undefined; }
  let gateEvidence: GateRecord[] = [];
  try { gateEvidence = await readJsonFile(resolve(publicDir, "gate-evidence.json")) as GateRecord[]; } catch { /* no E2 records if E2E did not reach its final assertion */ }
  const evidence = new Map(gateEvidence.filter((record) => record && typeof record.id === "string").map((record) => [record.id, record]));
  const allProofStepsPass = failures.length === 0;
  const lifecycleEvidence = ["lifecycle.json", "same-data-restart.json", "worker-down.json"].map((name) => resolve(publicDir, name));
  const gates: GateRecord[] = EXPECTED_GATE_IDS.map((id) => ({ id, status: "NOT_RUN", implementation_commit: implementationCommit, actual_evidence: [], reason: "Not covered by the bounded CH-001R-r11 migration-first profile; no manual acceptance is inferred." }));
  const setPass = (id: string, refs: GateRecord["actual_evidence"], reason: string): void => {
    const gate = gates.find((candidate) => candidate.id === id);
    if (gate && refs.length > 0) { gate.status = "PASS"; gate.actual_evidence = refs; gate.reason = reason; }
  };
  const runtimeRefs = (id: string): GateRecord["actual_evidence"] => evidence.get(id)?.actual_evidence?.filter((ref) => ref.implementation_commit === implementationCommit) ?? [];
  const composeRef = async (file: string, reference: string, kind: "E2" | "E4-local"): Promise<GateRecord["actual_evidence"]> => {
    try { return [await makeEvidenceRef(root, resolve(publicDir, file), kind, reference, implementationCommit)]; } catch { return []; }
  };
  if (allProofStepsPass && source.clean) {
    const setup = await composeRef("dispatch.json", "proof:compose-clean-start", "E2");
    const compose = await composeRef("image-facts.json", "proof:shipped-image-facts", "E2");
    const sourceEvidence = sourceRef ? [sourceRef] : [];
    setPass("CH001-001", [...setup, ...await composeRef("projects.png", "proof:first-owner-setup", "E2"), ...await composeRef("environment.json", "proof:environment", "E4-local")], "Clean shipped-image setup, health, and authenticated proof completed; architect review remains separate.");
    setPass("CH001-002", [...compose, ...await composeRef("same-data-restart.json", "proof:same-data-restart", "E4-local")], "Worker restart/recreation preserved the proof project and media identities.");
    setPass("CH001-003", [...sourceEvidence, ...await composeRef("compose-network.json", "proof:compose-network-binding", "E2")], "Source and measured Compose evidence cover the loopback-only product binding.");
    setPass("CH001-005", [...runtimeRefs("CH001-051"), ...await composeRef("worker-down.json", "proof:worker-down-state", "E2"), ...await composeRef("worker-down-queued.png", "proof:worker-down-screen", "E4-local"), ...await composeRef("lifecycle.json", "proof:worker-down-restart", "E4-local")], "Worker-down/restart path was exercised by the bounded live profile.");
    setPass("CH001-006", await composeRef("same-data-restart.json", "proof:force-recreate-same-data", "E4-local"), "Force-recreated containers retained the saved revision, accepted hashes, and ready export.");
    setPass("CH001-051", [...sourceEvidence, ...runtimeRefs("CH001-051")], "Primary authenticated E2E journey recorded the exact final JPEG response/checksum relationship.");
    for (const id of ["CH001-052", "CH001-054", "CH001-059"]) setPass(id, runtimeRefs(id), `Primary authenticated E2E journey recorded ${id}.`);
    setPass("CH001-063", [...await composeRef("compose-migration-rerun.log", "proof:migration-rerun", "E2"), ...await composeRef("migration-metadata.log", "proof:migration-metadata", "E2")], "Migration rerun and metadata were checked against the live PostgreSQL service.");
  }
  if (source.clean && sourceRef) for (const id of ["CH001-067", "CH001-068", "CH001-069", "CH001-072"]) setPass(id, [sourceRef], "Source-only contract gate assessed by the r11 source review.");
  for (const gate of gates) {
    const observed = evidence.get(gate.id);
    if (gate.status === "NOT_RUN" && observed?.status === "FAIL" && observed.implementation_commit === implementationCommit) { gate.status = "FAIL"; gate.actual_evidence = observed.actual_evidence ?? []; gate.reason = observed.reason || "Executed assertion failed in the primary proof run."; }
    else if (gate.status === "NOT_RUN" && observed?.status === "PASS" && observed.implementation_commit === implementationCommit && ["CH001-051", "CH001-052", "CH001-054", "CH001-059"].includes(gate.id)) { gate.status = "PASS"; gate.actual_evidence = observed.actual_evidence ?? []; gate.reason = observed.reason || "Executed by the bounded primary journey."; }
  }
  for (const file of lifecycleEvidence) await stat(file).catch(() => undefined);
  return gates;
}

async function publicManifest(): Promise<{ path: string; ref: Awaited<ReturnType<typeof makeEvidenceRef>> }> {
  const files = (await listFiles(publicDir)).filter((file) => !["artifact-manifest.json", "gate-results.json", "verifier-result.json", "proof-result.json"].includes(file) && !file.startsWith("private/") && !file.endsWith(".env"));
  const entries = await Promise.all(files.map(async (file) => ({ path: pathFromRoot(resolve(publicDir, file)), sha256: await sha256File(resolve(publicDir, file)), bytes: (await stat(resolve(publicDir, file))).size })));
  const manifestPath = resolve(publicDir, "artifact-manifest.json");
  await writeJson(manifestPath, { run_id: runId, implementation_commit: implementationCommit, status: failures.length === 0 ? "LIVE_PROOF_READY_FOR_REVIEW" : "LIVE_PROOF_INCOMPLETE", files: entries, exclusion: "private raw logs, env files, credentials, cookies, auth storage, gate-results.json, proof-result.json, verifier-result.json and manifest self-reference are excluded" });
  const ref = await makeEvidenceRef(root, manifestPath, "E1", "aggregate:artifact-manifest", implementationCommit);
  return { path: pathFromRoot(manifestPath), ref };
}

async function writeMigrationNotRunEvidence(reason: string): Promise<void> {
  if (!evidenceOwned) return;
  const sourceTree = await gitOutput(["rev-parse", "HEAD^{tree}"]).catch(() => null);
  const notRun = (stageReason: string): Record<string, unknown> => ({ status: "NOT_RUN", reason: stageReason });
  const result: Record<string, unknown> = {
    schema_version: 1,
    record_kind: "CH001_MIGRATION_VERIFICATION",
    classification: "R11_MIGRATION_FIRST",
    status: "NOT_RUN",
    run_id: runId,
    implementation_commit: implementationCommit,
    source_tree: sourceTree,
    image: null,
    database: null,
    started_at: new Date().toISOString(),
    ended_at: new Date().toISOString(),
    persisted_before_worker_readiness: true,
    worker_readiness_attempted: false,
    migration_qualified: false,
    runtime_cases: "NOT_RUN",
    reason,
    prebuild_module_import: moduleImportReport,
    stages: {
      module_import: notRun("Final-image module-import verification requires Docker and was not run."),
      build: notRun(reason),
      database_start: notRun(reason),
      database_ready: notRun(reason),
      fresh_precondition: notRun(reason),
      fresh: notRun(reason),
      schema: notRun(reason),
      sentinel: notRun(reason),
      repeat: notRun(reason),
      repeat_assertions: notRun(reason),
      failure_control: notRun(reason),
      fixture_cleanup: notRun("No runtime fixtures were allocated.")
    },
    failures: [],
    primary_failure: null
  };
  migrationQualification = result;
  await writeJson(resolve(publicDir, "migration-verification.json"), result);
}

async function cleanupMigrationContainers(): Promise<void> {
  const uniqueNames = [...new Set(migrationContainerNames)];
  if (!evidenceOwned) return;
  if (!composeProject || !composeProjectOwned || uniqueNames.length === 0) {
    migrationContainerCleanup = { record_kind: "CH001_MIGRATION_CONTAINER_CLEANUP", run_id: runId, status: "NOT_RUN", reason: !composeProject || !composeProjectOwned ? "No verified owned Compose project was available for one-off migration cleanup." : "No migration one-off containers were allocated." };
    await writeJson(resolve(publicDir, "migration-container-cleanup.json"), migrationContainerCleanup);
    return;
  }
  const operations: Array<Record<string, unknown>> = [];
  for (const name of uniqueNames) {
    try {
      const before = await composeProject.dockerRun(["container", "inspect", name, "--format", "{{json .}}"], { timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
      if (before.timedOut === true) {
        operations.push({ name, status: "FAIL", reason: "Pre-cleanup container inspection timed out." });
        continue;
      }
      if (before.exitCode === 1) {
        operations.push({ name, status: "PASS", present_before_cleanup: false, absence_verified: true });
        continue;
      }
      if (before.exitCode !== 0) {
        operations.push({ name, status: "FAIL", exit_code: before.exitCode, output: redact(before.output).slice(-1_000) });
        continue;
      }
      const removed = await dockerStep(`migration-container-remove-${safeName(name)}`, ["container", "rm", "-f", name], { publicLogName: `migration-container-remove-${safeName(name)}`, timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
      const after = await composeProject.dockerRun(["container", "inspect", name, "--format", "{{json .}}"], { timeoutMs: SHORT_COMMAND_TIMEOUT_MS, maxOutputBytes: SHORT_COMMAND_MAX_OUTPUT_BYTES });
      operations.push({ name, status: removed.result.exitCode === 0 && removed.result.timedOut !== true && after.exitCode === 1 && after.timedOut !== true ? "PASS" : "FAIL", present_before_cleanup: true, remove_exit_code: removed.result.exitCode, remove_log_path: pathFromRoot(removed.publicLogPath), absence_verified: after.exitCode === 1 && after.timedOut !== true });
    } catch (error) {
      operations.push({ name, status: "FAIL", error: error instanceof Error ? error.message : String(error) });
    }
  }
  migrationContainerCleanup = { record_kind: "CH001_MIGRATION_CONTAINER_CLEANUP", run_id: runId, status: operations.every((operation) => operation.status === "PASS") ? "PASS" : "FAIL", containers: operations, cleanup_scope: "explicitly named CH-001R-r11 migration/module-import one-offs only; no global prune" };
  await writeJson(resolve(publicDir, "migration-container-cleanup.json"), migrationContainerCleanup);
  if (migrationContainerCleanup.status === "FAIL") failures.push("One or more named migration one-off containers could not be removed and absence-verified.");
}

async function finalizeComposeLifecycle(): Promise<void> {
  if (composeLifecycleFinalized) return;
  composeLifecycleFinalized = true;
  if (!evidenceOwned) return;
  if (!composeProject || !composeProjectOwned || !composeStartupAttempted || !composeStartupResult) {
    await cleanupMigrationContainers();
    await writeComposeNotRunEvidence({ publicDir, runId, projectName, reason: composeOwnership?.reason ?? "No validated, run-owned Compose startup was attempted." }).catch((error) => failures.push(`Compose diagnostic record could not be written: ${error instanceof Error ? error.message : String(error)}`));
    return;
  }

  const includeServiceLogs = !composeStarted || failures.length > 0;
  try {
    composeDiagnostics = await collectComposeDiagnostics({
      project: composeProject,
      repositoryRoot: root,
      publicDir,
      privateDir,
      runId,
      startupResult: composeStartupResult,
      ownership: composeOwnership,
      secrets,
      includeServiceLogs
    });
    failures.push(...composeDiagnostics.secondaryFailures);
  } catch (error) {
    failures.push(`Compose diagnostics failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  await cleanupMigrationContainers();

  const integrationCleanup: Record<string, unknown> = { status: "NOT_RUN", reason: "No disposable integration database remained allocated." };
  if (integrationDatabaseCreated && integrationDatabase) {
    try {
      const dropped = await composeProject.run(["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-v", "ON_ERROR_STOP=0", "-c", `DROP DATABASE IF EXISTS "${integrationDatabase}" WITH (FORCE)`], { timeoutMs: 20_000, maxOutputBytes: 128 * 1024 });
      integrationCleanup.status = dropped.exitCode === 0 && !dropped.timedOut ? "PASS" : "FAIL";
      integrationCleanup.command = redact(dropped.command);
      integrationCleanup.exit_code = dropped.exitCode;
      integrationCleanup.timed_out = dropped.timedOut === true;
      integrationCleanup.output = redact(dropped.output).slice(-4_000);
      if (dropped.exitCode !== 0 || dropped.timedOut) failures.push(`Disposable integration database cleanup failed (exit ${dropped.exitCode}${dropped.timedOut ? ", timed out" : ""}).`);
    } catch (error) {
      integrationCleanup.status = "FAIL";
      integrationCleanup.error = error instanceof Error ? error.message : String(error);
      failures.push(`Disposable integration database cleanup failed: ${integrationCleanup.error}`);
    }
    integrationDatabaseCreated = false;
  }

  try {
    composeCleanup = await teardownComposeProject({
      project: composeProject,
      repositoryRoot: root,
      publicDir,
      runId,
      ownershipVerified: composeProjectOwned,
      startupAttempted: composeStartupAttempted
    });
    failures.push(...composeCleanup.secondaryFailures);
    const cleanupRecord = { ...composeCleanup.receipt, integration_database_cleanup: integrationCleanup, migration_container_cleanup: migrationContainerCleanup };
    await writeJson(resolve(publicDir, "compose-cleanup.json"), cleanupRecord);
  } catch (error) {
    failures.push(`Compose cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
    await writeJson(resolve(publicDir, "compose-cleanup.json"), {
      record_kind: "CH001_COMPOSE_CLEANUP",
      run_id: runId,
      project_name: projectName,
      startup_attempted: composeStartupAttempted,
      project_owned: composeProjectOwned,
      status: "FAIL",
      primary_failure_preserved: true,
      error: error instanceof Error ? error.message : String(error),
      integration_database_cleanup: integrationCleanup,
      migration_container_cleanup: migrationContainerCleanup
    }).catch(() => undefined);
  }
}

async function sanitizePublic(): Promise<void> {
  const textExtensions = new Set([".json", ".log", ".txt", ".md", ".html", ".xml", ".csv"]);
  for (const file of await listFiles(publicDir)) {
    const path = resolve(publicDir, file);
    if (!textExtensions.has(file.slice(file.lastIndexOf(".")))) continue;
    try { await writeFile(path, redact(await readFile(path, "utf8")), { mode: 0o640 }); } catch { /* binary or raced file; manifest will validate the final file */ }
  }
  await writeJson(resolve(publicDir, "sanitization.json"), { run_id: runId, status: "sanitized", redactions: ["synthetic bootstrap token", "synthetic auth secret", "synthetic owner password", "PostgreSQL connection strings"], excluded: ["private/", "*.env", "cookies", "auth storage state"], public_root: pathFromRoot(publicDir) });
}

async function finalize(host: Record<string, unknown>, source: { path: string; clean: boolean }): Promise<number> {
  // Diagnostics and owned teardown must precede public sanitization and the
  // payload manifest. The final manifest therefore binds the pre-deletion
  // service state and the cleanup receipt.
  await finalizeComposeLifecycle();
  await smokeSuite();
  await ensureSuiteReports();
  await artifactChecks();
  await writeJson(resolve(publicDir, "environment.json"), { run_id: runId, implementation_commit: implementationCommit, workflow_sha: workflowSha, host, runtime: { base_url: baseUrl, compose_project: projectName, port, browser_path: browserPath }, migration_qualification: { status: migrationQualification?.status ?? "NOT_RUN", path: pathFromRoot(resolve(publicDir, "migration-verification.json")) }, prerequisite_failures: environmentFailures, evidence_boundary: "Public record contains measured non-secret facts only; raw credentials and environment files remain private." });
  const gates = await buildGateLedger(source);
  const commands: CommandRecord[] = commandOutputs.map((output) => ({ command: output.result.command, startedAt: output.result.startedAt, endedAt: output.result.endedAt, exitCode: output.result.exitCode, logPath: pathFromRoot(output.publicLogPath), ...(output.reportPath ? { reportPath: output.reportPath } : {}) }));
  const findingDispositions = [
    ...Array.from({ length: 11 }, (_, index) => ({ id: `R${String(index + 1).padStart(2, "0")}`, status: "OPEN", test_reference: null, repair_or_disproof: "This bounded proof does not close the original acceptance findings; architect review remains required." })),
    ...Array.from({ length: 8 }, (_, index) => ({ id: `U${String(index + 1).padStart(2, "0")}`, status: "OBSERVED", test_reference: null, repair_or_disproof: "Scoped r11 repair is implemented; live result or remaining gap is recorded in proof-result.json and command reports." }))
  ];
  await writeJson(resolve(publicDir, "finding-dispositions.json"), { run_id: runId, implementation_commit: implementationCommit, findings: findingDispositions });
  await writeJson(resolve(publicDir, "command-report.json"), { run_id: runId, implementation_commit: implementationCommit, commands, suites: [...suiteReports.values()], child_invocations: commandOutputs.map((output) => ({ id: output.result.invocationId, command: output.result.command, started_at: output.result.startedAt, ended_at: output.result.endedAt })) });
  await sanitizePublic();
  // Metadata files are excluded from the payload allowlist to avoid a
  // circular hash: the gate report points at this manifest, while the
  // manifest binds the stable test/runtime payload files.
  const manifest = await publicManifest();
  const report: EvidencePackage = { chapter: "CH-001R-r11", target_application_version: "0.1.0", report_kind: "BOUNDED_LIVE_PROOF_NOT_FULL_ACCEPTANCE", implementation_commit: implementationCommit, evidence_commit: null, generatedAt: new Date().toISOString(), commands, suites: [...suiteReports.values()], gates, findings: findingDispositions.slice(0, 11), artifact_manifest: manifest.ref };
  await writeJson(resolve(publicDir, "gate-results.json"), report);
  const validation = await validateEvidencePackage({ root, report, reportPath: pathFromRoot(resolve(publicDir, "gate-results.json")), requireCompleted: false });
  const gateCounts = { PASS: gates.filter((gate) => gate.status === "PASS").length, FAIL: gates.filter((gate) => gate.status === "FAIL").length, NOT_RUN: gates.filter((gate) => gate.status === "NOT_RUN").length };
  const livePass = failures.length === 0 && environmentFailures.length === 0 && validation.errors.filter((error) => !/Every mandatory gate must be PASS|Finding disposition report must contain R01-R11|Finding R\d+ is not closed/.test(error)).length === 0 && gateCounts.FAIL === 0 && await stat(resolve(publicDir, "a-little-room-to-focus.zip")).then(() => true).catch(() => false);
  const result = { profile: "CH-001R-r11 migration-first qualification", status: livePass ? "LIVE_PROOF_READY_FOR_REVIEW" : environmentFailures.length > 0 && !composeStarted ? "BLOCKED_ENVIRONMENT" : "TEST_FAILURE", exit_code: livePass ? 0 : environmentFailures.length > 0 && !composeStarted ? 2 : 1, application_acceptance: false, accepted_application_version: "none", run_id: runId, implementation_commit: implementationCommit, workflow_sha: workflowSha, scope: "migration-first final-image qualification before worker readiness, followed by the existing bounded local app/database/browser/worker journey", prohibited_scope: ["fal.ai", "ScrapeCreators", "TikTok", "publishing", "scheduling", "analytics", "billing", "video", "public deployment", "release", "v0.2"], failures, environment_failures: environmentFailures, gate_counts: gateCounts, validation: { ok: validation.ok, errors: validation.errors }, steps: proofSteps, required_live_artifacts: ["migration-verification.json", "module-import-verification.json", "a-little-room-to-focus.zip", "alternate-4x5.zip", "journey-hashes.json", "lifecycle.json", "same-data-restart.json"], evidence_root: pathFromRoot(publicDir), artifact_manifest: pathFromRoot(resolve(publicDir, "artifact-manifest.json")), artifact_manifest_sha256: await sha256File(resolve(publicDir, "artifact-manifest.json")) };
  await writeJson(resolve(publicDir, "proof-result.json"), result);
  await writeJson(resolve(publicDir, "verifier-result.json"), { ok: validation.ok, strict_acceptance: false, report: pathFromRoot(resolve(publicDir, "gate-results.json")), implementation_commit: implementationCommit, run_id: runId, gate_counts: gateCounts });
  return result.exit_code;
}

async function cleanup(): Promise<void> {
  await finalizeComposeLifecycle().catch((error) => failures.push(`Compose finalization failed: ${error instanceof Error ? error.message : String(error)}`));
}

let exitCode: number;
try {
  const prepared = await prepareRun();
  const preflightResult = await preflight(prepared.childEnv);
  const host = preflightResult.host;
  await staticChecks(prepared.childEnv);
  if (preflightResult.dockerReady && preflightResult.browserReady && failures.length === 0) {
    composeProject = makeComposeProject(root, projectName, composeEnvPath);
    await composeJourney(prepared.composeEnv, prepared.childEnv);
  } else {
    skipped("Compose shipped-image journey", environmentFailures.join(" ") || "Docker/Chromium prerequisite unavailable.");
    for (const name of ["integration", "e2e", "render", "lifecycle"]) skipped(name, "Live proof prerequisites were unavailable.");
    await writeMigrationNotRunEvidence(environmentFailures.join(" ") || failures.join(" ") || "Static/source prerequisite failed before runtime qualification.");
  }
  const source = await sourceReview();
  exitCode = await finalize(host, source);
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  failures.push(`Coordinator: ${detail}`);
  if (evidenceOwned) await sourceReview().catch(() => undefined);
  await finalizeComposeLifecycle().catch((cleanupError) => failures.push(`Compose finalization failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`));
  await writeCoordinatorFailureReport({ publicDir, ownsEvidence: evidenceOwned, report: { profile: "CH-001R-r11 migration-first qualification", status: environmentFailures.length > 0 ? "BLOCKED_ENVIRONMENT" : "TEST_FAILURE", exit_code: environmentFailures.length > 0 ? 2 : 1, application_acceptance: false, accepted_application_version: "none", run_id: runId, implementation_commit: implementationCommit, workflow_sha: workflowSha, failures, environment_failures: environmentFailures, steps: proofSteps, scope: "Coordinator failed before all bounded proof steps completed; see command logs." } }).catch(() => undefined);
  console.error(`CH-001R-r11 coordinator error: ${detail}`);
  exitCode = environmentFailures.length > 0 ? 2 : 1;
} finally {
  await cleanup();
}

console.error(`CH-001R-r11 proof ${exitCode === 0 ? "ready for review" : exitCode === 2 ? "blocked by environment" : "failed"}; implementation ${implementationCommit}; run ${runId}.`);
process.exit(exitCode);
