import { access, constants, mkdir, readFile, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { REQUIRED_GATED_COMMANDS, type SuiteReport, writeJson } from "./ch001-harness.js";

type Check = (typeof REQUIRED_GATED_COMMANDS)[number];
type ProcessResult = { exitCode: number; output: string; startedAt: string; endedAt: string };

const check = process.argv[2] as Check | undefined;
const root = resolve(process.cwd());
const runId = process.env.CH001_RUN_ID ?? "unscoped";
const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? `artifacts/ch001r2/${runId}`);
const implementationCommit = process.env.CH001_IMPLEMENTATION_COMMIT ?? await gitCommit();

async function gitCommit(): Promise<string> {
  return new Promise((resolveCommit) => {
    const child = spawn("git", ["rev-parse", "HEAD"], { cwd: root, stdio: ["ignore", "pipe", "ignore"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("close", () => resolveCommit(output.trim() || "working-tree"));
    child.on("error", () => resolveCommit("working-tree"));
  });
}

async function executable(path: string): Promise<boolean> {
  try { await access(path, constants.X_OK); return true; } catch { return false; }
}

async function run(command: string, args: string[], env: NodeJS.ProcessEnv = process.env): Promise<ProcessResult> {
  const startedAt = new Date().toISOString();
  return new Promise((resolveResult) => {
    const child = spawn(command, args, { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", (error) => resolveResult({ exitCode: 1, output: `${output}${error.message}\n`, startedAt, endedAt: new Date().toISOString() }));
    child.on("close", (code) => resolveResult({ exitCode: code ?? 1, output, startedAt, endedAt: new Date().toISOString() }));
  });
}

function relativePath(path: string): string { return relative(root, resolve(path)); }

async function unavailable(suite: Check, reason: string): Promise<never> {
  await mkdir(evidenceDir, { recursive: true });
  const reportPath = resolve(evidenceDir, `runner-${suite}-unavailable.json`);
  const logPath = resolve(evidenceDir, `runner-${suite}-unavailable.log`);
  const report = { suite, run_id: runId, implementation_commit: implementationCommit, status: "NOT_RUN", reason };
  await writeJson(reportPath, report);
  await writeFile(logPath, `NOT_RUN: ${reason}\n`, { mode: 0o640 });
  const suiteReport: SuiteReport = { suite, command: `pnpm test:${suite}`, run_id: runId, implementation_commit: implementationCommit, started_at: new Date().toISOString(), ended_at: new Date().toISOString(), exit_code: 2, discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0, report_path: relativePath(reportPath), log_path: relativePath(logPath), unavailable_reason: reason };
  await writeJson(resolve(evidenceDir, `suite-${suite}.json`), suiteReport);
  console.error(`NOT_RUN: ${reason}`);
  process.exit(2);
}

async function requireBrowser(suite: Check): Promise<string> {
  const configured = process.env.BROWSER_EXECUTABLE_PATH;
  if (configured) {
    if (await executable(configured)) return configured;
    await unavailable(suite, `BROWSER_EXECUTABLE_PATH is not executable: ${configured}`);
  }
  const managed = chromium.executablePath();
  if (!(await executable(managed))) await unavailable(suite, `Pinned Playwright Chromium is unavailable at ${managed}; set BROWSER_EXECUTABLE_PATH only for an explicitly documented compatible diagnostic profile.`);
  return managed;
}

function vitestCounts(value: unknown): { discovered: number; executed: number; passed: number; failed: number; skipped: number } {
  const report = value as { numTotalTests?: unknown; numPassedTests?: unknown; numFailedTests?: unknown; numPendingTests?: unknown; numTodoTests?: unknown };
  const discovered = Number(report.numTotalTests ?? 0);
  const passed = Number(report.numPassedTests ?? 0);
  const failed = Number(report.numFailedTests ?? 0);
  const skipped = Number(report.numPendingTests ?? 0) + Number(report.numTodoTests ?? 0);
  return { discovered, executed: passed + failed, passed, failed, skipped };
}

function playwrightCounts(value: unknown): { discovered: number; executed: number; passed: number; failed: number; skipped: number } {
  let discovered = 0; let executed = 0; let passed = 0; let failed = 0; let skipped = 0;
  function walk(suites: unknown): void {
    if (!Array.isArray(suites)) return;
    for (const suite of suites) {
      const value = suite as { specs?: unknown; suites?: unknown };
      if (Array.isArray(value.specs)) for (const spec of value.specs) {
        const tests = (spec as { tests?: unknown }).tests;
        if (!Array.isArray(tests)) continue;
        for (const test of tests) {
          discovered += 1;
          const results = (test as { results?: unknown[] }).results;
          const last = Array.isArray(results) && results.length > 0 ? results[results.length - 1] as { status?: string } : undefined;
          if (!last || last.status === "skipped") skipped += 1;
          else if (last.status === "passed") { executed += 1; passed += 1; }
          else { executed += 1; failed += 1; }
        }
      }
      walk(value.suites);
    }
  }
  const report = value as { suites?: unknown };
  walk(report.suites);
  return { discovered, executed, passed, failed, skipped };
}

async function runVitestSuite(suite: "integration"): Promise<never> {
  if (!process.env.DATABASE_URL) await unavailable(suite, "DATABASE_URL is not configured.");
  if (process.env.CH001_ALLOW_DISPOSABLE_DATABASE !== "1" || !process.env.CH001_DISPOSABLE_RUN_ID) await unavailable(suite, "Real integration tests require CH001_ALLOW_DISPOSABLE_DATABASE=1 and a run-owned CH001_DISPOSABLE_RUN_ID.");
  const reportPath = resolve(evidenceDir, `vitest-${suite}.json`);
  const result = await run("pnpm", ["exec", "vitest", "run", "--config", "vitest.config.ts", "tests/integration", "--reporter=json", "--outputFile", reportPath], { ...process.env, CH001_RUN_ID: runId, CH001_EVIDENCE_DIR: evidenceDir });
  await mkdir(evidenceDir, { recursive: true });
  await writeFile(resolve(evidenceDir, `runner-${suite}.log`), result.output, { mode: 0o640 });
  let counts = { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 };
  try { counts = vitestCounts(JSON.parse(await readFile(reportPath, "utf8")) as unknown); } catch { result.exitCode = 1; }
  if (counts.discovered < 1 || counts.executed < 1) result.exitCode = 1;
  const suiteReport: SuiteReport = { suite, command: `pnpm test:${suite}`, run_id: runId, implementation_commit: implementationCommit, started_at: result.startedAt, ended_at: result.endedAt, exit_code: result.exitCode, ...counts, report_path: relativePath(reportPath), log_path: relativePath(resolve(evidenceDir, `runner-${suite}.log`)) };
  await writeJson(resolve(evidenceDir, `suite-${suite}.json`), suiteReport);
  if (result.output) process.stdout.write(result.output);
  process.exit(result.exitCode);
}

async function runPlaywrightSuite(suite: "e2e" | "render"): Promise<never> {
  const executablePath = await requireBrowser(suite);
  if (suite === "e2e" && !process.env.E2E_BASE_URL) await unavailable(suite, "E2E_BASE_URL is not configured.");
  if (suite === "e2e" && (!process.env.CH001_OWNER_EMAIL || !process.env.CH001_OWNER_PASSWORD)) await unavailable(suite, "Synthetic CH001_OWNER_EMAIL and CH001_OWNER_PASSWORD are required for the authenticated browser journey.");
  const reportPath = resolve(evidenceDir, `playwright-${suite}.json`);
  const result = await run("pnpm", ["exec", "playwright", "test", `tests/${suite}`, "--config", "playwright.config.ts"], { ...process.env, CH001_RUN_ID: runId, CH001_EVIDENCE_DIR: evidenceDir, BROWSER_EXECUTABLE_PATH: executablePath, CH001_PLAYWRIGHT_REPORT: reportPath });
  await mkdir(evidenceDir, { recursive: true });
  await writeFile(resolve(evidenceDir, `runner-${suite}.log`), result.output, { mode: 0o640 });
  let counts = { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 };
  try { counts = playwrightCounts(JSON.parse(await readFile(reportPath, "utf8")) as unknown); } catch { result.exitCode = 1; }
  if (counts.discovered < 1 || counts.executed < 1) result.exitCode = 1;
  const suiteReport: SuiteReport = { suite, command: `pnpm test:${suite}`, run_id: runId, implementation_commit: implementationCommit, started_at: result.startedAt, ended_at: result.endedAt, exit_code: result.exitCode, ...counts, report_path: relativePath(reportPath), log_path: relativePath(resolve(evidenceDir, `runner-${suite}.log`)) };
  await writeJson(resolve(evidenceDir, `suite-${suite}.json`), suiteReport);
  if (result.output) process.stdout.write(result.output);
  process.exit(result.exitCode);
}

async function runSmoke(): Promise<never> {
  const docker = await run("docker", ["--version"]);
  if (docker.exitCode !== 0) await unavailable("smoke", "Docker CLI is unavailable or could not start.");
  const compose = await run("docker", ["compose", "version"]);
  if (compose.exitCode !== 0) await unavailable("smoke", "Docker Compose is unavailable.");
  const result = await run("node", ["--import", "tsx", "scripts/ch001-compose-smoke.ts"], { ...process.env, CH001_RUN_ID: runId, CH001_EVIDENCE_DIR: evidenceDir });
  await mkdir(evidenceDir, { recursive: true });
  const logPath = resolve(evidenceDir, "runner-smoke.log");
  await writeFile(logPath, `${docker.output}${compose.output}${result.output}`, { mode: 0o640 });
  let counts = { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 };
  const smokeReportPath = resolve(evidenceDir, "smoke-results.json");
  try { counts = vitestCounts(JSON.parse(await readFile(smokeReportPath, "utf8")) as unknown); } catch { result.exitCode = 1; }
  if (counts.discovered < 1 || counts.executed < 1) result.exitCode = 1;
  const suiteReport: SuiteReport = { suite: "smoke", command: "pnpm test:smoke", run_id: runId, implementation_commit: implementationCommit, started_at: result.startedAt, ended_at: result.endedAt, exit_code: result.exitCode, ...counts, report_path: relativePath(smokeReportPath), log_path: relativePath(logPath) };
  await writeJson(resolve(evidenceDir, "suite-smoke.json"), suiteReport);
  if (result.output) process.stdout.write(result.output);
  process.exit(result.exitCode);
}

if (check === "integration") await runVitestSuite("integration");
else if (check === "e2e" || check === "render") await runPlaywrightSuite(check);
else if (check === "smoke") await runSmoke();
else {
  console.error(`NOT_RUN: unknown gated check ${check ?? "undefined"}.`);
  process.exit(2);
}
