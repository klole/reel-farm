import { randomBytes } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { makeComposeProject, freeLoopbackPort, waitForCondition, waitForHttp } from "./ch001-compose.js";
import { writeJson } from "./ch001-harness.js";

const runId = process.env.CH001_RUN_ID ?? "smoke-local";
if (!/^[a-z0-9][a-z0-9-]{2,47}$/.test(runId)) throw new Error("CH001_RUN_ID must be a short lowercase run-owned identifier.");
const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? `artifacts/ch001r3/${runId}`);
const root = resolve(process.cwd());
const projectName = `oss-ch001-smoke-${runId}`;
const envDir = await mkdtemp(resolve(tmpdir(), "oss-ch001-smoke-env-"));
const envPath = resolve(envDir, ".env");
const project = makeComposeProject(root, projectName, envPath);
let cleaned = false;

async function captureLogs(): Promise<void> {
  const logs = await project.run(["logs", "--no-color", "web", "worker", "migrate"]);
  await writeFile(resolve(evidenceDir, "compose.log"), logs.output, { mode: 0o640 });
}

async function cleanup(): Promise<void> {
  if (cleaned) return;
  cleaned = true;
  await captureLogs().catch(() => undefined);
  // projectName is generated from the run-owned identifier; this cleanup can
  // never target the operator's default Compose project.
  await project.run(["down", "-v", "--remove-orphans"]).catch(() => undefined);
  await rm(envDir, { recursive: true, force: true }).catch(() => undefined);
}

const port = await freeLoopbackPort();
const bootstrapToken = randomBytes(24).toString("base64url");
await mkdir(evidenceDir, { recursive: true });
await writeFile(envPath, [
  `APP_ORIGIN=http://127.0.0.1:${port}`,
  `CH001_WEB_PORT=${port}`,
  "POSTGRES_USER=oss",
  "POSTGRES_PASSWORD=oss",
  "POSTGRES_DB=oss",
  "MEDIA_ROOT=/data/media",
  `BOOTSTRAP_TOKEN=${bootstrapToken}`,
  `BETTER_AUTH_SECRET=${randomBytes(48).toString("base64url")}`,
  "RENDERER_BUILD_ID=oss-renderer-0.1.0",
  "PLAYWRIGHT_BROWSERS_PATH=/ms-playwright",
  "NODE_ENV=production",
  ""
].join("\n"), { mode: 0o600 });
await writeJson(resolve(evidenceDir, "disposable-run-marker.json"), { run_id: runId, compose_project: projectName, env_file: "private temporary file; not committed", web_port: port });

process.once("SIGINT", () => { void cleanup().finally(() => process.exit(130)); });
process.once("SIGTERM", () => { void cleanup().finally(() => process.exit(143)); });

const assertions: string[] = [];
try {
  const config = await project.run(["config", "--quiet"]);
  if (config.exitCode !== 0) throw new Error(`Compose config failed: ${config.output}`);
  assertions.push("compose config validates");
  const started = await project.run(["up", "--build", "-d", "db", "migrate", "web", "worker"]);
  if (started.exitCode !== 0) throw new Error(`Compose startup failed: ${started.output}`);
  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForHttp(`${baseUrl}/api/health/live`);
  assertions.push("clean shipped image startup and web health");
  const rerun = await project.run(["run", "--rm", "-T", "--no-deps", "migrate"]);
  await writeFile(resolve(evidenceDir, "compose-migration-rerun.log"), rerun.output, { mode: 0o640 });
  if (rerun.exitCode !== 0) throw new Error(`Second migration invocation failed: ${rerun.output}`);
  assertions.push("second migration invocation");
  const schema = await project.run(["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-Atc", "SELECT id FROM schema_migrations WHERE id = '0001_ch001'"]);
  if (schema.exitCode !== 0 || schema.output.trim() !== "0001_ch001") throw new Error(`Migration metadata check failed: ${schema.output}`);
  assertions.push("migration metadata is present");
  await waitForCondition("worker heartbeat ready", async () => {
    const heartbeat = await project.run(["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-Atc", "SELECT status FROM worker_heartbeat WHERE worker_name = 'render-worker'"]);
    return heartbeat.exitCode === 0 && heartbeat.output.trim() === "ready";
  });
  assertions.push("worker heartbeat ready");
  const stopped = await project.run(["stop", "worker"]);
  if (stopped.exitCode !== 0) throw new Error(`Worker stop failed: ${stopped.output}`);
  await waitForHttp(`${baseUrl}/api/health/live`);
  assertions.push("web remains live while worker is stopped");
  const restarted = await project.run(["start", "worker"]);
  if (restarted.exitCode !== 0) throw new Error(`Worker restart failed: ${restarted.output}`);
  await waitForCondition("worker heartbeat after restart", async () => {
    const heartbeat = await project.run(["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-Atc", "SELECT status FROM worker_heartbeat WHERE worker_name = 'render-worker'"]);
    return heartbeat.exitCode === 0 && heartbeat.output.trim() === "ready";
  });
  assertions.push("worker stop/start readiness");
  const recreated = await project.run(["up", "--force-recreate", "-d", "--no-build", "db", "migrate", "web", "worker"]);
  if (recreated.exitCode !== 0) throw new Error(`Compose recreation failed: ${recreated.output}`);
  await waitForHttp(`${baseUrl}/api/health/live`);
  await waitForCondition("worker heartbeat after recreation", async () => {
    const heartbeat = await project.run(["exec", "-T", "db", "psql", "-U", "oss", "-d", "oss", "-Atc", "SELECT status FROM worker_heartbeat WHERE worker_name = 'render-worker'"]);
    return heartbeat.exitCode === 0 && heartbeat.output.trim() === "ready";
  });
  assertions.push("container recreation with named volumes");
  await writeJson(resolve(evidenceDir, "smoke-results.json"), { numTotalTests: assertions.length, numPassedTests: assertions.length, numFailedTests: 0, numPendingTests: 0, numTodoTests: 0, assertions });
  await writeJson(resolve(evidenceDir, "compose-lifecycle.json"), { run_id: runId, compose_project: projectName, base_url: baseUrl, migration_rerun: "passed", worker_stop_restart: "passed", recreation_with_volumes: "passed", scope: "standalone smoke command; no authenticated export claim" });
  console.log(`Compose smoke passed for ${projectName}.`);
} finally {
  await cleanup();
}
