/* global process */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import {
  collectComposeDiagnostics,
  parseComposePsOutput,
  sanitizeComposeDiagnostic,
  teardownComposeProject,
  verifyComposeProjectOwnership,
  writeComposeNotRunEvidence
} from "../../scripts/ch001-compose-diagnostics.mjs";

const runId = "r10-compose-test";

async function withTemporaryDirectory(operation) {
  const directory = await mkdtemp(resolve(tmpdir(), "ch001r10-compose-diagnostics-"));
  try {
    return await operation(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function makeProject({ ps = "[]", volumes = "", logs = {}, images = "a".repeat(64), down = "", postPs = "[]", postVolumes = "" } = {}) {
  const calls = [];
  let afterDown = false;
  const project = {
    projectName: `oss-ch001-${runId}`,
    envPath: "/tmp/ch001r10-compose-test.env",
    root: process.cwd(),
    calls,
    async run(args, options = {}) {
      calls.push({ kind: "compose", args, options });
      const name = args[0];
      if (name === "ps") return result(args, afterDown ? postPs : ps);
      if (name === "images") return result(args, images);
      if (name === "logs") return result(args, logs[args.at(-1)] ?? "");
      if (name === "down") { afterDown = true; return result(args, down); }
      return result(args, "");
    },
    async dockerRun(args, options = {}) {
      calls.push({ kind: "docker", args, options });
      return result(args, afterDown ? postVolumes : volumes);
    }
  };
  return project;
}

function result(args, output, exitCode = 0) {
  return {
    command: ["docker", "compose", ...args].join(" "),
    startedAt: "2026-09-15T00:00:00.000Z",
    endedAt: "2026-09-15T00:00:01.000Z",
    exitCode,
    output
  };
}

test("R10-T08 parses Compose JSON arrays and JSON-lines without treating malformed output as empty", () => {
  assert.deepEqual(parseComposePsOutput("[]"), { status: "OK", records: [] });
  const lines = [
    JSON.stringify({ Service: "migrate", ID: "abc123", Name: "migrate-1", State: "exited", ExitCode: 1 }),
    JSON.stringify({ Service: "db", ID: "def456", Name: "db-1", State: "running", Health: "healthy" })
  ].join("\n");
  const parsed = parseComposePsOutput(lines);
  assert.equal(parsed.status, "OK");
  assert.deepEqual(parsed.records[0], { service: "migrate", container_name: "migrate-1", container_id: "abc123", state: "exited", health: null, exit_code: 1 });
  assert.equal(parseComposePsOutput("not json").status, "MALFORMED");
});

test("R10-T09 redacts credentials, connection strings, bearer tokens, and cookies while preserving useful errors", () => {
  const secret = "synthetic-secret-value";
  const sanitized = sanitizeComposeDiagnostic([
    `BOOTSTRAP_TOKEN=${secret}`,
    "DATABASE_URL=postgres://oss:oss@db:5432/oss",
    "Authorization: Bearer bearer-token-value",
    "Cookie: session=private-cookie-value",
    "Error: migration failed at statement 7"
  ].join("\n"), [secret]);
  assert.doesNotMatch(sanitized, /synthetic-secret-value|oss:oss|bearer-token-value|private-cookie-value/);
  assert.match(sanitized, /Error: migration failed at statement 7/);
  assert.match(sanitized, /<redacted>/);
});

test("R10-T08/R10-T09/R10-T11 capture stopped migration diagnostics before scoped cleanup", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const publicDir = resolve(temporary, "public");
    const privateDir = resolve(temporary, "private");
    const secret = "compose-secret-value";
    const ps = JSON.stringify([
      { Service: "db", ID: "db1234567890", Name: "db-1", State: "running", Health: "healthy" },
      { Service: "migrate", ID: "mig1234567890", Name: "migrate-1", State: "exited", ExitCode: 1 },
      { Service: "web", ID: "web1234567890", Name: "web-1", State: "created", ExitCode: 0 },
      { Service: "worker", ID: "wrk1234567890", Name: "worker-1", State: "created", ExitCode: 0 }
    ]);
    const project = makeProject({
      ps,
      volumes: JSON.stringify({ Name: "oss-ch001-r10-compose-test_oss_db_data", Driver: "local" }),
      logs: {
        db: `2026-09-15T00:00:00Z database ready token=${secret}\n`,
        migrate: `2026-09-15T00:00:01Z Error: migration failed; DATABASE_URL=postgres://oss:oss@db:5432/oss\n`,
        web: "web was not started\n",
        worker: "worker was not started\n"
      },
      images: `${"a".repeat(64)}\n${"b".repeat(64)}\n`,
      postPs: "[]",
      postVolumes: ""
    });
    const ownership = { owned: true, status: "VERIFIED_ABSENT" };
    const startupResult = {
      command: "docker compose -p oss-ch001-r10-compose-test up --build -d db migrate web worker",
      startedAt: "2026-09-15T00:00:00.000Z",
      endedAt: "2026-09-15T00:00:02.000Z",
      exitCode: 1,
      output: `service "migrate" failed ${secret}\n`
    };
    const diagnostics = await collectComposeDiagnostics({
      project,
      repositoryRoot: process.cwd(),
      publicDir,
      privateDir,
      runId,
      startupResult,
      ownership,
      secrets: [secret]
    });
    const state = JSON.parse(await readFile(diagnostics.statePath, "utf8"));
    const publicMigrateLog = await readFile(resolve(publicDir, "compose-service-logs/migrate.log"), "utf8");
    const privateMigrateLog = await readFile(resolve(privateDir, "compose-service-logs/migrate.log"), "utf8");
    assert.equal(state.startup.startup_attempted, undefined);
    assert.equal(state.startup.exit_code, 1);
    assert.equal(state.ps.services.find((service) => service.service === "migrate").exit_code, 1);
    assert.equal(state.services.find((service) => service.service === "migrate").log_status, "CAPTURED");
    assert.match(publicMigrateLog, /migration failed/);
    assert.doesNotMatch(publicMigrateLog, /oss:oss|compose-secret-value/);
    assert.match(privateMigrateLog, /oss:oss/);
    assert.ok(project.calls.find((call) => call.kind === "compose" && call.args[0] === "logs" && call.args.includes("--timestamps")));
    assert.ok(project.calls.every((call) => call.options.timeoutMs === 20_000 && call.options.maxOutputBytes === 128 * 1024));

    const cleanup = await teardownComposeProject({ project, repositoryRoot: process.cwd(), publicDir, runId, ownershipVerified: true, startupAttempted: true });
    assert.deepEqual(cleanup.secondaryFailures, []);
    assert.equal(cleanup.receipt.status, "PASS");
    assert.equal(cleanup.receipt.post_cleanup.status, "REMOVED");
    assert.ok(project.calls.find((call) => call.kind === "compose" && call.args[0] === "down" && call.args.includes("-v")));
    assert.equal(await stat(resolve(publicDir, "compose-service-logs.log")).then(() => true), true);
  });
});

test("R10-T10 refuses preexisting project state and never tears down an unowned project", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const project = makeProject({ ps: JSON.stringify({ Service: "db", ID: "existing123456", Name: "existing-db", State: "running" }) });
    project.envPath = resolve(temporary, "compose.env");
    await import("node:fs/promises").then(({ writeFile }) => writeFile(project.envPath, "synthetic=true\n"));
    const ownership = await verifyComposeProjectOwnership({ project, repositoryRoot: process.cwd(), runId });
    assert.equal(ownership.owned, false);
    assert.match(ownership.reason, /already has containers/);
    const cleanup = await teardownComposeProject({ project, repositoryRoot: process.cwd(), publicDir: resolve(temporary, "public"), runId, ownershipVerified: false, startupAttempted: false });
    assert.equal(cleanup.receipt.status, "NOT_RUN");
    assert.equal(project.calls.some((call) => call.args[0] === "down"), false);
  });
});

test("R10-T10/R10-T12 early refusal writes honest no-startup evidence", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const result = await writeComposeNotRunEvidence({ publicDir: resolve(temporary, "public"), runId, projectName: `oss-ch001-${runId}`, reason: "Docker preflight unavailable." });
    const state = JSON.parse(await readFile(result.statePath, "utf8"));
    const cleanup = JSON.parse(await readFile(result.cleanupPath, "utf8"));
    assert.equal(state.startup_attempted, false);
    assert.equal(cleanup.status, "NOT_RUN");
    assert.match(cleanup.reason, /no teardown command/);
  });
});
