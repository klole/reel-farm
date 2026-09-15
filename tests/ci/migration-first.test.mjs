/* global structuredClone */

import assert from "node:assert/strict";
import { test } from "node:test";
import { isSuccessfulExpectedFailure, isSuccessfulMigrationTerminal, runMigrationFirstQualification } from "../../scripts/ch001-migration-verification.mjs";

const identity = {
  run_id: "r11-control-test",
  implementation_commit: "a".repeat(40),
  source_tree: "b".repeat(40),
  module_import: { status: "PASS", classification: "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF" }
};

function terminal(exitCode = 0, state = "exited") {
  return { cli: { exit_code: exitCode, timed_out: false }, container: { exit_code: exitCode, state, timed_out: false } };
}

function adapterFor({ failStage = null, unknownExit = false, cleanupFailure = false } = {}) {
  const calls = [];
  const call = (name, value) => { calls.push(name); if (failStage === name) throw new Error(`${name} fixture failure`); return value; };
  return {
    calls,
    buildImages: async () => call("build", terminal()),
    verifyModuleImport: async () => call("module_import", { status: "PASS", classification: "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF" }),
    startDatabase: async () => call("database_start", terminal()),
    waitForDatabase: async () => call("database_ready", { status: "PASS", healthy: true }),
    confirmFreshMarkerAbsent: async () => call("fresh_precondition", { status: "PASS", marker_count: 0 }),
    runMigration: async (stage) => call(stage, unknownExit && stage === "fresh" ? { cli: { exit_code: null }, container: { exit_code: null, state: "unknown" } } : terminal()),
    inspectSchema: async () => call("schema", { status: "PASS", marker_count: 1, schema_fingerprint: "schema" }),
    createSentinel: async () => call("sentinel", { status: "PASS", sentinel: "preserved" }),
    inspectRepeatState: async () => call("repeat_assertions", { status: "PASS", marker_count: 1, marker_unchanged: true, sentinel: "preserved" }),
    runFailureControl: async () => call("failure_control", { ...terminal(1), marker_count: 0, error_observed: true }),
    cleanupFixtures: async () => { calls.push("fixture_cleanup"); return cleanupFailure ? { status: "FAIL", error: "cleanup fixture failure" } : { status: "PASS", removed: true }; }
  };
}

async function runQualification(adapter) {
  let persisted;
  const result = await runMigrationFirstQualification({ identity, adapter, writeResult: async (value) => { persisted = structuredClone(value); } });
  return { result, persisted };
}

test("R11-T08 migration-first control flow persists before worker readiness and orders all qualification stages", async () => {
  const adapter = adapterFor();
  const { result, persisted } = await runQualification(adapter);
  assert.equal(result.status, "PASS");
  assert.equal(result.migration_qualified, true);
  assert.equal(result.persisted_before_worker_readiness, true);
  assert.equal(result.worker_readiness_attempted, false);
  assert.deepEqual(adapter.calls, ["build", "module_import", "database_start", "database_ready", "fresh_precondition", "fresh", "schema", "sentinel", "repeat", "repeat_assertions", "failure_control", "fixture_cleanup"]);
  assert.equal(persisted.persisted_before_worker_readiness, true);
  assert.equal(isSuccessfulMigrationTerminal(terminal()), true);
  assert.equal(isSuccessfulMigrationTerminal({ cli: { exit_code: null }, container: { exit_code: 0, state: "exited" } }), false);
  assert.equal(isSuccessfulExpectedFailure({ ...terminal(1), marker_count: 0, error_observed: true }), true);
});

test("R11-T08 migration-first stops before repeat/worker readiness after fresh, schema, or unknown-exit failure", async () => {
  for (const failStage of ["fresh", "schema"]) {
    const adapter = adapterFor({ failStage });
    const { result } = await runQualification(adapter);
    assert.equal(result.status, "FAIL", failStage);
    assert.equal(result.worker_readiness_attempted, false);
    assert.equal(result.stages.repeat.status, "NOT_RUN");
    assert.equal(result.stages.failure_control.status, "NOT_RUN");
    assert.equal(adapter.calls.includes("repeat"), false);
  }
  const unknown = adapterFor({ unknownExit: true });
  const { result: unknownResult } = await runQualification(unknown);
  assert.equal(unknownResult.status, "FAIL");
  assert.equal(unknownResult.stages.fresh.status, "FAIL");
  assert.equal(unknownResult.stages.repeat.status, "NOT_RUN");
});

test("R11-T08 migration-first preserves completed migration results when fixture cleanup fails", async () => {
  const adapter = adapterFor({ cleanupFailure: true });
  const { result, persisted } = await runQualification(adapter);
  assert.equal(result.status, "FAIL");
  assert.equal(result.stages.fresh.status, "PASS");
  assert.equal(result.stages.repeat_assertions.status, "PASS");
  assert.equal(result.stages.fixture_cleanup.status, "FAIL");
  assert.equal(persisted.stages.fresh.status, "PASS");
  assert.equal(persisted.stages.failure_control.status, "PASS");
});
