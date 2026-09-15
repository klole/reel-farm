/* global process */

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { test } from "node:test";
import { extractWorkflowJobEnvironment, extractWorkflowRunBody } from "../../scripts/ci/workflow-shell.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = process.cwd();
const workflowPath = resolve(repositoryRoot, ".github/workflows/ch001-live-proof.yml");
const reporterScript = resolve(repositoryRoot, "scripts/ci/ci-result.mjs");
const currentImplementation = "e".repeat(40);
const currentWorkflow = "f".repeat(40);
const currentBlob = "a".repeat(40);
const currentWorkflowFile = "b".repeat(64);
const expectedArchiveSha256 = "023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757";

async function withTemporaryDirectory(operation) {
  const directory = await mkdtemp(resolve(tmpdir(), "ch001r9-workflow-boundary-"));
  try {
    return await operation(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function minimalEnvironment(directory) {
  return {
    PATH: [dirname(process.execPath), "/usr/local/sbin", "/usr/local/bin", "/usr/sbin", "/usr/bin", "/sbin", "/bin"].join(":"),
    HOME: directory,
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    TMPDIR: directory,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0"
  };
}

async function run(command, argumentsList, environment, cwd = repositoryRoot) {
  try {
    const result = await execFileAsync(command, argumentsList, { cwd, env: environment, maxBuffer: 20_000_000 });
    return { exit_code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return { exit_code: typeof error.code === "number" ? error.code : null, stdout: error.stdout ?? "", stderr: error.stderr ?? "" };
  }
}

async function sha256File(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

async function findOfficialArchive() {
  const candidate = process.env.ACTIONLINT_BOOTSTRAP_ARCHIVE;
  if (!candidate) return null;
  const path = resolve(candidate);
  if (await stat(path).catch(() => null) === null) return null;
  assert.equal(await sha256File(path), expectedArchiveSha256, "ACTIONLINT_BOOTSTRAP_ARCHIVE must be the official digest-verified v1.7.7 archive");
  return path;
}

function environmentRecords(environmentFile, previous) {
  const next = { ...previous };
  const records = environmentFile.slice(environmentFile.indexOf("\n", 0) + 1).split("\n").filter(Boolean);
  for (const record of records) {
    assert.match(record, /^[A-Za-z_][A-Za-z0-9_]*=[^\r\n]*$/);
    const separator = record.indexOf("=");
    next[record.slice(0, separator)] = record.slice(separator + 1);
  }
  return next;
}

async function makeBoundaryEnvironment(directory, rawReport) {
  const runnerTemp = resolve(directory, "runner temp");
  const githubEnv = resolve(directory, "github env");
  const githubPath = resolve(directory, "github path");
  const githubOutput = resolve(directory, "github output");
  const githubSummary = resolve(directory, "github summary");
  await mkdir(runnerTemp, { recursive: true });
  await writeFile(githubEnv, "PREVIOUS=preserve\n", "utf8");
  await writeFile(githubPath, "PATH_SENTINEL=preserve\n", "utf8");
  await writeFile(githubOutput, "OUTPUT_SENTINEL=preserve\n", "utf8");
  await writeFile(githubSummary, "SUMMARY_SENTINEL=preserve\n", "utf8");
  const environment = {
    ...minimalEnvironment(directory),
    GITHUB_REPOSITORY: "klole/reel-farm",
    GITHUB_RUN_ID: "910000001",
    GITHUB_RUN_ATTEMPT: "1",
    GITHUB_WORKFLOW_SHA: currentWorkflow,
    REQUESTED_SHA: currentImplementation,
    REPOSITORY_PRIVATE: "false",
    CH001_SANDBOX_OPT_IN: "false",
    CH001_RUN_ID: "r4-910000001-1",
    CH001_WORKFLOW_SHA: currentWorkflow,
    CH001_WORKFLOW_BLOB_SHA: currentBlob,
    CH001_WORKFLOW_FILE_SHA256: currentWorkflowFile,
    CI: "true",
    CI_BOOTSTRAP_REPORT: rawReport,
    CI_RESULT_REPORT: "artifacts/ch001r4/r4-910000001-1/bootstrap/public/ci-result.json",
    CI_PROOF_REPORT: "artifacts/ch001r4/r4-910000001-1/proof/public/proof-result.json",
    CH001_EVIDENCE_ROOT: "artifacts/ch001r4/r4-910000001-1/proof",
    CH001_SANDBOX_REPORT: resolve(directory, "sandbox-qualification.json"),
    RUNNER_TEMP: runnerTemp,
    GITHUB_ENV: githubEnv,
    GITHUB_PATH: githubPath,
    GITHUB_OUTPUT: githubOutput,
    GITHUB_STEP_SUMMARY: githubSummary
  };
  const archive = await findOfficialArchive();
  if (archive) environment.ACTIONLINT_BOOTSTRAP_ARCHIVE = archive;
  return { environment, githubEnv, githubPath, githubOutput, githubSummary, runnerTemp };
}

async function initializeOuterReport(environment) {
  const result = await run(process.execPath, [reporterScript, "init", "--report", environment.CI_BOOTSTRAP_REPORT], environment);
  assert.equal(result.exit_code, 0, `${result.stdout}\n${result.stderr}`);
}

async function runWorkflowBody(body, environment) {
  return run("bash", ["--noprofile", "--norc", "-euo", "pipefail", "-c", body], environment);
}

async function readReports(environment, stageReport) {
  const outerPath = resolve(repositoryRoot, environment.CI_BOOTSTRAP_REPORT);
  const innerPath = resolve(repositoryRoot, stageReport);
  const outer = JSON.parse(await readFile(outerPath, "utf8"));
  const inner = JSON.parse(await readFile(innerPath, "utf8"));
  return { outerPath, innerPath, outer, inner };
}

test("the exact current workflow shell body resolves a raw relative report and records the real PASS attestation", async () => {
  const workflow = await readFile(workflowPath, "utf8");
  const step = extractWorkflowRunBody(workflow, "actionlint_bootstrap");
  assert.match(step.body, /path\.resolve\(path\.dirname\(base\), "actionlint-bootstrap\.json"\)/);
  assert.equal((step.body.match(/--report "\$stage_report"/g) ?? []).length, 1);
  assert.equal((step.body.match(/--detail-file "\$stage_report"/g) ?? []).length, 1);
  await withTemporaryDirectory(async (directory) => {
    const rawReport = "artifacts/ch001r4/r4-910000001-1/bootstrap/public/bootstrap-result.json";
    const fixture = await makeBoundaryEnvironment(directory, rawReport);
    try {
      await initializeOuterReport(fixture.environment);
      const result = await runWorkflowBody(step.body, fixture.environment);
      assert.equal(result.exit_code, 0, `${result.stdout}\n${result.stderr}`);
      assert.equal(result.stdout, "");
      const stageReport = resolve(repositoryRoot, dirname(rawReport), "actionlint-bootstrap.json");
      const reports = await readReports(fixture.environment, stageReport);
      assert.equal(reports.inner.status, "PASS");
      assert.equal(reports.inner.actual_exit, 0);
      assert.equal(reports.inner.archive.measured_sha256, expectedArchiveSha256);
      assert.equal(reports.inner.executable.observed_version, "1.7.7");
      assert.equal(reports.outer.stages.find((stage) => stage.name === "actionlint-bootstrap")?.status, "PASS");
      const stage = reports.outer.stages.find((entry) => entry.name === "actionlint-bootstrap");
      assert.equal(stage.exit_code, 0);
      assert.equal(stage.metadata.bootstrap_attestation.status, "PASS");
      const envText = await readFile(fixture.githubEnv, "utf8");
      const env = environmentRecords(envText, fixture.environment);
      assert.equal(env.ACTIONLINT_BIN, reports.inner.executable.path);
      assert.equal(isAbsolute(env.ACTIONLINT_BIN), true);
      assert.equal(await readFile(fixture.githubPath, "utf8"), "PATH_SENTINEL=preserve\n");
      assert.equal(await readFile(fixture.githubOutput, "utf8"), "OUTPUT_SENTINEL=preserve\n");
      assert.equal(await readFile(fixture.githubSummary, "utf8"), "SUMMARY_SENTINEL=preserve\n");
      assert.equal(await stat(resolve(repositoryRoot, "artifacts/ch001r4/r4-910000001-1/proof")).catch(() => null), null);
    } finally {
      await rm(resolve(repositoryRoot, "artifacts/ch001r4/r4-910000001-1"), { recursive: true, force: true });
    }
  });
});

test("the same extracted workflow step handles quoted spaces and an already-absolute report base", async () => {
  const workflow = await readFile(workflowPath, "utf8");
  const step = extractWorkflowRunBody(workflow, "actionlint_bootstrap");
  for (const rawReportFactory of [
    () => "artifacts/ch001r9 quoted path/r4-910000002-1/bootstrap/public/bootstrap-result.json",
    (directory) => resolve(directory, "absolute quoted path/bootstrap/public/bootstrap-result.json")
  ]) {
    await withTemporaryDirectory(async (directory) => {
      const rawReport = rawReportFactory(directory);
      const fixture = await makeBoundaryEnvironment(directory, rawReport);
      try {
        await initializeOuterReport(fixture.environment);
        const result = await runWorkflowBody(step.body, fixture.environment);
        assert.equal(result.exit_code, 0, `${result.stdout}\n${result.stderr}`);
        const stageReport = resolve(dirname(rawReport), "actionlint-bootstrap.json");
        const reports = await readReports(fixture.environment, stageReport);
        assert.equal(reports.inner.status, "PASS");
        assert.equal(reports.outer.stages.find((stage) => stage.name === "actionlint-bootstrap")?.status, "PASS");
        assert.equal(reports.inner.executable.path.startsWith("/"), true);
      } finally {
        if (!isAbsolute(rawReport)) await rm(resolve(repositoryRoot, dirname(rawReport).split("/").slice(0, 2).join("/")), { recursive: true, force: true });
      }
    });
  }
});

test("the exact T8 workflow body is a historical negative control for the unchanged absolute-path contract", async () => {
  const t8WorkflowResult = await execFileAsync("git", ["show", "0144f6c41ae4c6143a2dc46fe22d59d453ce8763:.github/workflows/ch001-live-proof.yml"], { cwd: repositoryRoot, maxBuffer: 2_000_000 });
  const oldStep = extractWorkflowRunBody(t8WorkflowResult.stdout, "actionlint_bootstrap");
  assert.match(oldStep.body, /stage_report="\$\(dirname "\$CI_BOOTSTRAP_REPORT"\)\/actionlint-bootstrap\.json"/);
  await withTemporaryDirectory(async (directory) => {
    const rawReport = "artifacts/ch001r4/r4-910000010-1/bootstrap/public/bootstrap-result.json";
    const fixture = await makeBoundaryEnvironment(directory, rawReport);
    await initializeOuterReport(fixture.environment);
    const result = await runWorkflowBody(oldStep.body, fixture.environment);
    assert.equal(result.exit_code, 1, `${result.stdout}\n${result.stderr}`);
    const outerPath = resolve(repositoryRoot, rawReport);
    const outer = JSON.parse(await readFile(outerPath, "utf8"));
    const stage = outer.stages.find((entry) => entry.name === "actionlint-bootstrap");
    assert.equal(stage.status, "FAIL");
    assert.match(stage.error, /absolute path/);
    assert.equal(outer.proof_invoked, false);
    assert.equal(outer.proof_exit_code, null);
    assert.equal(await readFile(fixture.githubEnv, "utf8"), "PREVIOUS=preserve\n");
    assert.deepEqual(await readdir(fixture.runnerTemp), []);
    assert.equal(await stat(resolve(repositoryRoot, dirname(rawReport), "actionlint-bootstrap.json")).catch(() => null), null);
    await rm(resolve(repositoryRoot, "artifacts/ch001r4/r4-910000010-1"), { recursive: true, force: true });
  });
});

test("workflow extraction fails closed for ambiguous IDs and unsupported run formatting", () => {
  assert.throws(() => extractWorkflowRunBody("jobs:\n  one:\n    steps:\n      - id: target\n        run: |\n          true\n      - id: target\n        run: |\n          true\n", "target"), /exactly one/);
  assert.throws(() => extractWorkflowRunBody("jobs:\n  one:\n    steps:\n      - name: target\n        id: target\n        run: >-\n          true\n", "target"), /literal run/);
  assert.throws(() => extractWorkflowJobEnvironment("jobs:\n  one:\n    env:\n      - BAD\n"), /job-level env/);
});
