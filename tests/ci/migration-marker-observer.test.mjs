import assert from "node:assert/strict";
import { test } from "node:test";
import { MARKER_COUNT_QUERY, MARKER_PRESENCE_QUERY, observeSchemaMigrations } from "../../scripts/ch001-migration-marker-observer.mjs";
import { projectDockerImageInspection, projectMigrationContainerInspection } from "../../scripts/ch001-container-facts.mjs";
import { evaluateFinalImageModuleImport } from "../../scripts/ch001-module-import-verdict.mjs";

function scalar(output, extra = {}) {
  return { exit_code: 0, timed_out: false, output_truncated: false, output, ...extra };
}

const validChildReport = {
  status: "PASS",
  classification: "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF",
  database_connection_attempted: false,
  pool_api: { connect: true, end: true },
  pool_closed: true,
  negative_control: { status: "PASS" }
};

const validContainer = { id: "container-id", image_id: "image-id", state: "exited", exit_code: 0 };

test("R12-T02/T03 absent marker observation is catalog-only and never executes a missing relation COUNT", async () => {
  const calls = [];
  const result = await observeSchemaMigrations(async (request) => {
    calls.push(request);
    assert.equal(request.kind, "presence");
    assert.equal(request.sql, MARKER_PRESENCE_QUERY);
    return scalar("0\n");
  });
  assert.equal(result.status, "PASS");
  assert.equal(result.table_present, false);
  assert.equal(result.marker_count, 0);
  assert.equal(result.count_executed, false);
  assert.deepEqual(calls.map(({ kind, sql }) => ({ kind, sql })), [{ kind: "presence", sql: MARKER_PRESENCE_QUERY }]);
});

test("R12-T03 shared observer performs a separate COUNT only after presence and distinguishes empty from positive markers", async () => {
  for (const [count, expectedStatus, expectedNoMarker] of [["0", "PASS", true], ["1", "FAIL", false]]) {
    const calls = [];
    const result = await observeSchemaMigrations(async (request) => {
      calls.push(request);
      return request.kind === "presence" ? scalar("1\n") : scalar(`${count}\n`);
    });
    assert.equal(result.status, expectedStatus);
    assert.equal(result.observation_status, "PASS");
    assert.equal(result.table_present, true);
    assert.equal(result.marker_count, Number(count));
    assert.equal(result.no_completion_marker, expectedNoMarker);
    assert.equal(result.count_executed, true);
    assert.deepEqual(calls.map(({ kind, sql }) => ({ kind, sql })), [{ kind: "presence", sql: MARKER_PRESENCE_QUERY }, { kind: "count", sql: MARKER_COUNT_QUERY }]);
  }
});

test("R12-T04 observer failures fail closed without publishing query output", async () => {
  const failureCases = [
    { name: "presence exit", responses: [scalar("0\n", { exit_code: 1 })] },
    { name: "presence timeout", responses: [scalar("0\n", { timed_out: true })] },
    { name: "presence truncation", responses: [scalar("0\n", { output_truncated: true })] },
    { name: "presence malformed", responses: [scalar("0\n1\n")] },
    { name: "count malformed", responses: [scalar("1\n"), scalar("not-a-count\n")] },
    { name: "count exit", responses: [scalar("1\n"), scalar("SECRET permission detail\n", { exit_code: 1 })] }
  ];
  for (const failureCase of failureCases) {
    let index = 0;
    const result = await observeSchemaMigrations(async () => failureCase.responses[index++]);
    assert.equal(result.status, "FAIL", failureCase.name);
    assert.equal(result.marker_count === null || result.marker_count === 0, true, failureCase.name);
    assert.doesNotMatch(JSON.stringify(result), /SECRET/, failureCase.name);
  }
  const thrown = await observeSchemaMigrations(async () => { throw new Error("SECRET raw adapter detail"); });
  assert.equal(thrown.status, "FAIL");
  assert.doesNotMatch(JSON.stringify(thrown), /SECRET/);
});

test("R12-T06/T07 container and image projections publish selected process facts without raw environment, host, labels, or mount sources", () => {
  const rawContainer = {
    Id: "container-id",
    Name: "/oss-migrate",
    Image: "image-id",
    Path: "node",
    Args: ["node", "scripts/migrate.ts"],
    State: { Status: "exited", ExitCode: 0, Error: "", StartedAt: "start", FinishedAt: "finish" },
    Config: {
      User: "node",
      WorkingDir: "/app",
      Entrypoint: ["node"],
      Cmd: ["scripts/migrate.ts"],
      Env: ["SECRET_ENV=DO_NOT_PUBLISH"],
      Labels: { "com.docker.compose.project": "oss", "com.docker.compose.service": "migrate", "unrestricted.secret": "DO_NOT_PUBLISH" }
    },
    HostConfig: { Mounts: [{ Source: "/secret/host/path" }] },
    Mounts: [{ Source: "/secret/host/path", Destination: "/app", Type: "bind", RW: false }]
  };
  const container = projectMigrationContainerInspection(rawContainer, "fallback", (value) => value);
  const containerText = JSON.stringify(container);
  assert.equal(container.inspection_status, "PASS");
  assert.equal(container.process.path, "node");
  assert.deepEqual(container.process.args, ["node", "scripts/migrate.ts"]);
  assert.deepEqual(container.configured_process.entrypoint, ["node"]);
  assert.deepEqual(container.configured_process.cmd, ["scripts/migrate.ts"]);
  assert.equal(container.user, "node");
  assert.equal(container.project_identity.project, "oss");
  assert.equal(container.mounts[0].destination, "/app");
  assert.doesNotMatch(containerText, /DO_NOT_PUBLISH|secret\/host|HostConfig|Env|unrestricted/);

  const image = projectDockerImageInspection({ Id: "image-id", RepoDigests: ["repo@sha256:abc"], Created: "created", Config: { User: "node", Env: ["SECRET_ENV=DO_NOT_PUBLISH", "PATH=/usr/bin"] } }, null, (value) => value);
  const imageText = JSON.stringify(image);
  assert.deepEqual(image.environment_keys, ["SECRET_ENV", "PATH"]);
  assert.doesNotMatch(imageText, /DO_NOT_PUBLISH/);
});

test("R12-T08 final-image import has one effective verdict requiring CLI, child report, and inspected terminal identity", () => {
  const pass = evaluateFinalImageModuleImport({ cli: { exit_code: 0, timed_out: false, output_truncated: false }, parsed: validChildReport, container: validContainer });
  assert.equal(pass.status, "PASS");
  assert.equal(pass.effective_verdict, "PASS");
  assert.equal(pass.classification, "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF");

  const invalidInputs = [
    { cli: { exit_code: 1, timed_out: false, output_truncated: false }, parsed: validChildReport, container: validContainer },
    { cli: { exit_code: 0, timed_out: true, output_truncated: false }, parsed: validChildReport, container: validContainer },
    { cli: { exit_code: 0, timed_out: false, output_truncated: true }, parsed: validChildReport, container: validContainer },
    { cli: { exit_code: 0, timed_out: false, output_truncated: false }, parsed: null, container: validContainer },
    { cli: { exit_code: 0, timed_out: false, output_truncated: false }, parsed: { ...validChildReport, status: "FAIL" }, container: validContainer },
    { cli: { exit_code: 0, timed_out: false, output_truncated: false }, parsed: validChildReport, container: null },
    { cli: { exit_code: 0, timed_out: false, output_truncated: false }, parsed: validChildReport, container: { ...validContainer, state: "running" } },
    { cli: { exit_code: 0, timed_out: false, output_truncated: false }, parsed: validChildReport, container: { state: "exited", exit_code: 0 } },
    { cli: { exit_code: 0, timed_out: false, output_truncated: false }, parsed: validChildReport, container: validContainer, inspectionError: "inspection_failed" }
  ];
  for (const input of invalidInputs) {
    const result = evaluateFinalImageModuleImport(input);
    assert.equal(result.status, "FAIL");
    assert.equal(result.effective_verdict, "FAIL");
    assert.equal(result.classification, "MODULE_IMPORT_FAIL");
  }
});
