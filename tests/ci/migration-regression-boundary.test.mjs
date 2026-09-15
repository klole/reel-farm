import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { test } from "node:test";
import { buildMigrationSqlArgs, createMigrationSqlAdapter } from "../../scripts/ch001-migration-command.mjs";
import { MARKER_COUNT_QUERY, MARKER_PRESENCE_QUERY, observeSchemaMigrations } from "../../scripts/ch001-migration-marker-observer.mjs";
import { runMigrationFirstQualification } from "../../scripts/ch001-migration-verification.mjs";

const execFileAsync = promisify(execFile);
const T12 = "cc9da96079fc681ce162a99bd4e3df21f05cb382";
const fixtureDatabase = "ch001_r13_marker_fixture";
const fixtureRole = "ch001_r13_observer_role";
const ACL_SQL = "REVOKE ALL ON TABLE public.schema_migrations FROM PUBLIC; GRANT USAGE ON SCHEMA public TO \"ch001_r13_observer_role\"";

function argumentValue(args, flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function databaseAwareFake({ mainTablePresent }) {
  const calls = [];
  const wrongDatabaseAcl = [];
  return {
    calls,
    wrongDatabaseAcl,
    async execute(name, args) {
      const database = argumentValue(args, "-d");
      const user = argumentValue(args, "-U");
      const sql = args.at(-1);
      calls.push({ name, args: [...args], database, user, sql });
      if (sql === ACL_SQL && database !== fixtureDatabase) {
        wrongDatabaseAcl.push({ database, user, mainTablePresent });
        return { exit_code: mainTablePresent ? 0 : 1, output: mainTablePresent ? "" : "relation does not exist\n" };
      }
      const output = sql === MARKER_PRESENCE_QUERY ? "0\n" : sql === MARKER_COUNT_QUERY ? "0\n" : "";
      return { exit_code: 0, timed_out: false, output_truncated: false, output, command: ["docker", ...args].join(" "), log_path: `${name}.log`, database, user };
    }
  };
}

test("R13-T02/T03 production migration adapter requires explicit targets and preserves database/user argv", async () => {
  const emptyMain = databaseAwareFake({ mainTablePresent: false });
  const adapter = createMigrationSqlAdapter((name, args) => emptyMain.execute(name, args));
  await assert.rejects(() => adapter("missing-target", ACL_SQL, undefined), /non-empty database/i);

  await adapter("fixture-acl", ACL_SQL, fixtureDatabase, "oss");
  const corrected = emptyMain.calls.at(-1);
  assert.equal(corrected.database, fixtureDatabase);
  assert.equal(corrected.user, "oss");
  assert.equal(emptyMain.wrongDatabaseAcl.length, 0);

  const legacyArgs = buildMigrationSqlArgs({ database: "oss", user: "oss", sql: ACL_SQL });
  const legacyResult = await emptyMain.execute("t12-omitted-target-witness", legacyArgs);
  assert.equal(argumentValue(legacyArgs, "-d"), "oss");
  assert.equal(legacyResult.exit_code, 1);
  assert.equal(emptyMain.wrongDatabaseAcl.length, 1);
});

test("R13-T02 existing-main witness detects a wrong-database ACL mutation even if the main table would let it succeed", async () => {
  const existingMain = databaseAwareFake({ mainTablePresent: true });
  const adapter = createMigrationSqlAdapter((name, args) => existingMain.execute(name, args));
  const legacyArgs = buildMigrationSqlArgs({ database: "oss", user: "oss", sql: ACL_SQL });
  const legacyResult = await existingMain.execute("t12-omitted-target-existing-main-witness", legacyArgs);
  assert.equal(legacyResult.exit_code, 0);
  assert.deepEqual(existingMain.wrongDatabaseAcl, [{ database: "oss", user: "oss", mainTablePresent: true }]);

  await adapter("fixture-acl-existing-main", ACL_SQL, fixtureDatabase, "oss");
  assert.equal(existingMain.wrongDatabaseAcl.length, 1);
  assert.equal(existingMain.calls.at(-1).database, fixtureDatabase);
});

test("R13-T03 production adapter drives the unchanged observer through the fixture database and user", async () => {
  const fake = databaseAwareFake({ mainTablePresent: false });
  const adapter = createMigrationSqlAdapter((name, args) => fake.execute(name, args));
  const observation = await observeSchemaMigrations(async ({ kind, sql }) => {
    const result = await adapter(`observer-${kind}`, sql, fixtureDatabase, fixtureRole);
    return result;
  });
  assert.equal(observation.status, "PASS");
  assert.equal(observation.table_present, false);
  assert.equal(observation.count_executed, false);
  assert.deepEqual(fake.calls.map(({ database, user, sql }) => ({ database, user, sql })), [{ database: fixtureDatabase, user: fixtureRole, sql: MARKER_PRESENCE_QUERY }]);
  assert.equal(observation.queries[0].database, fixtureDatabase);
  assert.equal(observation.queries[0].user, fixtureRole);
});

test("R13-T04 frozen T12 omission is tied to the old call site while the candidate requires an explicit local target", async () => {
  const { stdout: oldSource } = await execFileAsync("git", ["show", `${T12}:scripts/ch001-proof.ts`], { encoding: "utf8" });
  assert.match(oldSource, /const runSetup = async \(name: string, sql: string\)/);
  assert.match(oldSource, /const output = await migrationSql\(name, sql\);/);
  const candidate = await readFile("scripts/ch001-proof.ts", "utf8");
  assert.match(candidate, /const runSetup = async \(name: string, sql: string, database: string, user: string\)/);
  assert.match(candidate, /migration-marker-regression-restrict-role[\s\S]*?fixtureDatabase, "oss"/);
  assert.doesNotMatch(candidate, /const runSetup = async \(name: string, sql: string\)[\s\S]*?migrationSql\(name, sql\);/);
});

test("R13-T04 production observer error stops before migration and keeps cleanup ordering visible", async () => {
  const calls = [];
  const scalar = (output, extra = {}) => ({ exit_code: 0, timed_out: false, output_truncated: false, output, ...extra });
  const adapter = {
    buildImages: async () => { calls.push("build"); return { cli: { exit_code: 0, timed_out: false } }; },
    verifyModuleImport: async () => { calls.push("module_import"); return { status: "PASS" }; },
    startDatabase: async () => { calls.push("database_start"); return { cli: { exit_code: 0, timed_out: false } }; },
    waitForDatabase: async () => { calls.push("database_ready"); return { status: "PASS" }; },
    runMarkerObserverRegression: async () => {
      calls.push("marker_observer_regression");
      const observation = await observeSchemaMigrations(async ({ kind }) => {
        calls.push(`observer_${kind}`);
        return kind === "presence" ? scalar("1\n") : scalar("not-a-count\n");
      });
      calls.push("marker_fixture_cleanup");
      return { status: "FAIL", cases: { malformed_count: observation } };
    },
    confirmFreshMarkerAbsent: async () => { calls.push("fresh_precondition"); return { status: "PASS" }; },
    runMigration: async () => { calls.push("fresh"); return { cli: { exit_code: 0 }, container: { id: "container", image_id: "image", state: "exited", inspection_status: "PASS", exit_code: 0 } }; },
    cleanupFixtures: async () => { calls.push("main_fixture_cleanup"); return { status: "PASS" }; }
  };
  const result = await runMigrationFirstQualification({
    identity: { run_id: "r13-boundary-test", implementation_commit: "a".repeat(40) },
    adapter,
    writeResult: async () => undefined
  });
  assert.equal(result.status, "FAIL");
  assert.equal(result.worker_readiness_attempted, false);
  assert.equal(result.stages.fresh.status, "NOT_RUN");
  assert.equal(calls.includes("fresh"), false);
  assert.equal(calls.includes("fresh_precondition"), false);
  assert.equal(calls.indexOf("marker_fixture_cleanup") >= 0, true);
  assert.equal(result.stages.marker_observer_regression.status, "FAIL");
});
