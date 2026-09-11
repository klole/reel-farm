import { randomBytes } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { writeJson } from "./ch001-harness.js";

const runId = process.env.CH001_RUN_ID ?? "local";
if (!/^[a-z0-9][a-z0-9-]{2,31}$/.test(runId)) throw new Error("CH001_RUN_ID must be a short lowercase run-owned identifier.");
const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? `artifacts/ch001r2/${runId}`);
const projectName = `oss-ch001-${runId}`;
const envDir = await mkdtemp(resolve(tmpdir(), "oss-ch001-env-"));
const envPath = resolve(envDir, ".env");
let cleaned = false;

async function freePort(): Promise<number> {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") { server.close(); reject(new Error("Could not allocate a loopback port.")); return; }
      const port = address.port;
      server.close((error) => error ? reject(error) : resolvePort(port));
    });
  });
}

async function runCompose(args: string[]): Promise<{ code: number; output: string }> {
  return new Promise((resolveResult) => {
    const child = spawn("docker", ["compose", "-p", projectName, "--env-file", envPath, ...args], { cwd: resolve(process.cwd()), env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", (error) => resolveResult({ code: 1, output: `${output}${error.message}\n` }));
    child.on("close", (code) => resolveResult({ code: code ?? 1, output }));
  });
}

async function waitForWeb(url: string, timeoutMs = 180_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = "not attempted";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${url}/api/health/live`, { signal: AbortSignal.timeout(4_000) });
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) { lastError = error instanceof Error ? error.message : "connection failed"; }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 2_000));
  }
  throw new Error(`Compose web health did not become ready: ${lastError}`);
}

async function captureLogs(): Promise<void> {
  const logs = await runCompose(["logs", "--no-color", "web", "worker", "migrate"]);
  await writeFile(resolve(evidenceDir, "compose.log"), logs.output, { mode: 0o640 });
}

async function cleanup(): Promise<void> {
  if (cleaned) return;
  cleaned = true;
  await captureLogs().catch(() => undefined);
  // The project name is generated above and the marker is written before any
  // destructive cleanup. This cannot target the operator's default Compose
  // project.
  await runCompose(["down", "-v", "--remove-orphans"]).catch(() => undefined);
  await rm(envDir, { recursive: true, force: true }).catch(() => undefined);
}

const port = await freePort();
const ownerEmail = `owner-${runId}@invalid.test`;
const ownerPassword = `Synthetic-${randomBytes(18).toString("base64url")}!`;
const bootstrapToken = randomBytes(24).toString("base64url");
const smokeAssertions: string[] = [];
await mkdir(evidenceDir, { recursive: true });
await writeFile(envPath, [
  `APP_ORIGIN=http://127.0.0.1:${port}`,
  `CH001_WEB_PORT=${port}`,
  "POSTGRES_USER=oss",
  "POSTGRES_PASSWORD=oss",
  "POSTGRES_DB=oss",
  "DATABASE_URL=postgres://oss:oss@db:5432/oss",
  "MEDIA_ROOT=/data/media",
  `BOOTSTRAP_TOKEN=${bootstrapToken}`,
  `BETTER_AUTH_SECRET=${randomBytes(48).toString("base64url")}`,
  "RENDERER_BUILD_ID=oss-renderer-0.1.0",
  "PLAYWRIGHT_BROWSERS_PATH=/ms-playwright",
  "NODE_ENV=production",
  ""
].join("\n"), { mode: 0o600 });
await writeFile(resolve(evidenceDir, "disposable-run-marker.json"), JSON.stringify({ run_id: runId, compose_project: projectName, env_file: "private temporary file; not committed", web_port: port }, null, 2) + "\n", { mode: 0o640 });

process.once("SIGINT", () => { void cleanup().finally(() => process.exit(130)); });
process.once("SIGTERM", () => { void cleanup().finally(() => process.exit(143)); });

try {
  const config = await runCompose(["config", "--quiet"]);
  if (config.code !== 0) throw new Error(`Compose config failed: ${config.output}`);
  smokeAssertions.push("compose config validates");
  const started = await runCompose(["up", "--build", "-d", "db", "migrate", "web", "worker"]);
  if (started.code !== 0) throw new Error(`Compose startup failed: ${started.output}`);
  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForWeb(baseUrl);
  smokeAssertions.push("clean image startup and web health");
  const e2e = await new Promise<{ code: number; output: string }>((resolveResult) => {
    const child = spawn("pnpm", ["test:e2e"], { cwd: process.cwd(), env: { ...process.env, E2E_BASE_URL: baseUrl, BROWSER_EXECUTABLE_PATH: process.env.BROWSER_EXECUTABLE_PATH ?? "/usr/bin/google-chrome", CH001_E2E_SETUP: "1", CH001_BOOTSTRAP_TOKEN: bootstrapToken, CH001_OWNER_EMAIL: ownerEmail, CH001_OWNER_PASSWORD: ownerPassword, CH001_ALLOW_DISPOSABLE_DATABASE: "1", CH001_DISPOSABLE_RUN_ID: runId }, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", (error) => resolveResult({ code: 1, output: `${output}${error.message}\n` }));
    child.on("close", (code) => resolveResult({ code: code ?? 1, output }));
  });
  await writeFile(resolve(evidenceDir, "compose-e2e.log"), e2e.output, { mode: 0o640 });
  if (e2e.code !== 0) throw new Error(`Authenticated browser journey failed in Compose: ${e2e.output}`);
  smokeAssertions.push("authenticated UI journey");
  const repeatedMigration = await runCompose(["run", "--rm", "migrate"]);
  await writeFile(resolve(evidenceDir, "compose-migration-rerun.log"), repeatedMigration.output, { mode: 0o640 });
  if (repeatedMigration.code !== 0) throw new Error(`Second migration invocation failed: ${repeatedMigration.output}`);
  smokeAssertions.push("second migration invocation");
  const stopped = await runCompose(["stop", "worker"]);
  if (stopped.code !== 0) throw new Error(`Worker stop failed: ${stopped.output}`);
  await waitForWeb(baseUrl);
  const restarted = await runCompose(["start", "worker"]);
  if (restarted.code !== 0) throw new Error(`Worker restart failed: ${restarted.output}`);
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 3_000));
  await waitForWeb(baseUrl);
  smokeAssertions.push("worker stop/start preserves web availability");
  const recreated = await runCompose(["up", "--build", "-d", "--force-recreate", "db", "migrate", "web", "worker"]);
  if (recreated.code !== 0) throw new Error(`Compose recreation failed: ${recreated.output}`);
  await waitForWeb(baseUrl);
  smokeAssertions.push("container recreation with named volumes");
  const smoke = { numTotalTests: smokeAssertions.length, numPassedTests: smokeAssertions.length, numFailedTests: 0, numPendingTests: 0, numTodoTests: 0, assertions: smokeAssertions };
  await writeJson(resolve(evidenceDir, "smoke-results.json"), smoke);
  await writeJson(resolve(evidenceDir, "compose-lifecycle.json"), { run_id: runId, compose_project: projectName, base_url: baseUrl, migration_rerun: "passed", worker_stop_restart: "passed", recreation_with_volumes: "passed", synthetic_owner: ownerEmail, note: "No credential value is stored." });
  console.log(`Compose smoke passed for ${projectName}.`);
} finally {
  await cleanup();
}
