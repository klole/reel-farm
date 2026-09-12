/* global process */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile, execFileSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { test } from "node:test";

const execFileAsync = promisify(execFile);
const repositoryRoot = process.cwd();
const wrapper = resolve(repositoryRoot, "scripts/ci/lint-workflow.mjs");
const runtimeHelper = resolve(repositoryRoot, "scripts/ci/initialize-sandbox-state.sh");
const validFixture = resolve(repositoryRoot, "tests/fixtures/workflow-validation/valid-runtime.yml");
const invalidStepsFixture = resolve(repositoryRoot, "tests/fixtures/workflow-validation/invalid-steps.yml");
const invalidYamlFixture = resolve(repositoryRoot, "tests/fixtures/workflow-validation/invalid-yaml.yml");
const t6Commit = "e0ea57665d00a643a8c392dfb9f6a84a723729af";
const t6WorkflowSha256 = "e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85";

function withEnvironment(overrides = {}) {
  const environment = { ...process.env };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete environment[key];
    else environment[key] = value;
  }
  return environment;
}

async function run(command, argumentsList, overrides = {}) {
  try {
    const result = await execFileAsync(command, argumentsList, {
      cwd: repositoryRoot,
      env: withEnvironment(overrides),
      maxBuffer: 10_000_000
    });
    return { status: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      status: typeof error.code === "number" ? error.code : null,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
      error
    };
  }
}

async function runWrapper(argumentsList, overrides = {}) {
  return run(process.execPath, [wrapper, ...argumentsList], overrides);
}

function runActionlintDirect(path) {
  const actionlint = process.env.ACTIONLINT_BIN ?? "actionlint";
  try {
    return {
      status: 0,
      stdout: execFileSync(actionlint, ["-shellcheck=", "-pyflakes=", path], {
        cwd: repositoryRoot,
        encoding: "utf8",
        maxBuffer: 10_000_000
      }),
      stderr: ""
    };
  } catch (error) {
    return {
      status: typeof error.status === "number" ? error.status : null,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? ""
    };
  }
}

async function gitShow(path) {
  const result = await execFileAsync("git", ["show", `${t6Commit}:${path}`], { cwd: repositoryRoot, maxBuffer: 10_000_000 });
  return result.stdout;
}

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

async function withTemporaryDirectory(operation) {
  const directory = await mkdtemp(resolve(tmpdir(), "ch001r7-workflow-"));
  try {
    return await operation(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function makeRuntimeFixture(directory, overrides = {}) {
  const runnerTemp = resolve(directory, "runner temp");
  const envFile = resolve(directory, "github-env");
  await mkdir(runnerTemp, { recursive: true });
  await writeFile(envFile, "PREVIOUS=preserve\n", "utf8");
  const environment = withEnvironment({
    RUNNER_TEMP: runnerTemp,
    GITHUB_RUN_ID: "123456789",
    GITHUB_RUN_ATTEMPT: "1",
    GITHUB_ENV: envFile,
    CH001_SANDBOX_STATE_DIR: undefined,
    ...overrides
  });
  return { runnerTemp, envFile, environment };
}

test("R7-T01 rejects the complete frozen T6 workflow for the job-level runner context", async () => {
  await withTemporaryDirectory(async (directory) => {
    const frozenWorkflow = resolve(directory, "ch001-live-proof-t6.yml");
    await writeFile(frozenWorkflow, await gitShow(".github/workflows/ch001-live-proof.yml"));
    assert.equal(await sha256(frozenWorkflow), t6WorkflowSha256);
    const result = await runWrapper(["--file", frozenWorkflow]);
    assert.equal(result.status, 1);
    const diagnostic = runActionlintDirect(frozenWorkflow);
    assert.equal(diagnostic.status, 1, `${diagnostic.stdout}\n${diagnostic.stderr}`);
    assert.match(`${diagnostic.stdout}\n${diagnostic.stderr}`, /context "runner" is not allowed here/);
    assert.match(`${diagnostic.stdout}\n${diagnostic.stderr}`, /ch001-live-proof-t6\.yml:39:/);
  });
});

test("R7-T02 accepts the complete repaired workflow with context checks enabled", async () => {
  const result = await runWrapper([]);
  const workflowSha256 = await sha256(resolve(repositoryRoot, ".github/workflows/ch001-live-proof.yml"));
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(await readFile(resolve(repositoryRoot, "scripts/ci/lint-workflow.mjs"), "utf8"), /sha256File/);
  assert.match(workflowSha256, /^[0-9a-f]{64}$/);
});

test("R7-T03 fails closed for missing tools, tool failures, zero inputs, and malformed YAML", async () => {
  await withTemporaryDirectory(async (directory) => {
    const missing = await runWrapper(["--file", validFixture], { ACTIONLINT_BIN: resolve(directory, "missing-actionlint") });
    assert.equal(missing.status, 2);

    const failingTool = resolve(directory, "actionlint-fails");
    await writeFile(failingTool, "#!/bin/sh\nif [ \"$1\" = \"-version\" ]; then printf '%s\\n' '1.7.7'; else printf '%s\\n' 'intentional validator failure' >&2; exit 17; fi\n");
    await chmod(failingTool, 0o755);
    const nonzero = await runWrapper(["--file", validFixture], { ACTIONLINT_BIN: failingTool });
    assert.equal(nonzero.status, 17);

    const emptyRepository = resolve(directory, "empty-repository");
    await mkdir(emptyRepository, { recursive: true });
    await execFileAsync("git", ["init", "--quiet"], { cwd: emptyRepository });
    const zeroInputs = await runWrapper(["--root", emptyRepository], { ACTIONLINT_BIN: process.env.ACTIONLINT_BIN });
    assert.equal(zeroInputs.status, 2);

    const malformed = await runWrapper(["--file", invalidYamlFixture]);
    assert.notEqual(malformed.status, 0);
    const malformedDiagnostic = runActionlintDirect(invalidYamlFixture);
    assert.notEqual(malformedDiagnostic.status, 0);
    assert.match(`${malformedDiagnostic.stdout}\n${malformedDiagnostic.stderr}`, /invalid YAML|yaml|parse/i);
  });
});

test("R7-T04 uses actual actionlint semantics for missing steps and supported runtime context", async () => {
  const invalid = await runWrapper(["--file", invalidStepsFixture]);
  assert.notEqual(invalid.status, 0);
  const invalidDiagnostic = runActionlintDirect(invalidStepsFixture);
  assert.notEqual(invalidDiagnostic.status, 0);
  assert.match(`${invalidDiagnostic.stdout}\n${invalidDiagnostic.stderr}`, /property "missing" is not defined|steps\.missing/);

  const valid = await runWrapper(["--file", validFixture]);
  assert.equal(valid.status, 0, `${valid.stdout}\n${valid.stderr}`);
});

test("R7-T05 transfers one run-owned absolute path to independent qualification and cleanup consumers", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { runnerTemp, envFile, environment } = await makeRuntimeFixture(directory);
    const initialized = await run("bash", [runtimeHelper], environment);
    assert.equal(initialized.status, 0, `${initialized.stdout}\n${initialized.stderr}`);
    const expected = `${runnerTemp}/ch001r6/123456789-1/sandbox`;
    const entries = (await readFile(envFile, "utf8")).split("\n");
    const stateEntries = entries.filter((line) => line.startsWith("CH001_SANDBOX_STATE_DIR="));
    assert.deepEqual(stateEntries, [`CH001_SANDBOX_STATE_DIR=${expected}`]);
    assert.equal(await stat(expected).catch(() => null), null);

    for (const consumer of ["qualification", "cleanup"]) {
      const observedPath = resolve(directory, `${consumer}.observed`);
      const observed = await run(process.execPath, ["-e", "require('node:fs').writeFileSync(process.argv[1], process.env.CH001_SANDBOX_STATE_DIR ?? '')", observedPath], {
        ...environment,
        CH001_SANDBOX_STATE_DIR: expected,
        R7_CONSUMER: consumer
      });
      assert.equal(observed.status, 0, `${consumer}: ${observed.stderr}`);
      assert.equal(await readFile(observedPath, "utf8"), expected);
    }
  });
});

test("R7-T06 keeps spaces and shell-looking values literal without evaluating the environment file", async () => {
  await withTemporaryDirectory(async (directory) => {
    const marker = resolve(directory, "marker");
    const shellLookingTemp = `${directory}/runner temp $(touch ${marker})`;
    const { envFile, environment } = await makeRuntimeFixture(directory, { RUNNER_TEMP: shellLookingTemp });
    const initialized = await run("bash", [runtimeHelper], environment);
    assert.equal(initialized.status, 0, `${initialized.stdout}\n${initialized.stderr}`);
    const expected = `${shellLookingTemp}/ch001r6/123456789-1/sandbox`;
    assert.equal(await readFile(envFile, "utf8"), `PREVIOUS=preserve\nCH001_SANDBOX_STATE_DIR=${expected}\n`);
    assert.equal(await stat(marker).catch(() => null), null);
  });
});

test("R7-T07 rejects invalid runtime inputs before changing existing environment entries", async () => {
  const cases = [
    ["missing RUNNER_TEMP", { RUNNER_TEMP: undefined }],
    ["missing GITHUB_ENV", { GITHUB_ENV: undefined }],
    ["relative RUNNER_TEMP", { RUNNER_TEMP: "relative" }],
    ["newline RUNNER_TEMP", { RUNNER_TEMP: `${resolve(tmpdir(), "r7")}\nOTHER=value` }],
    ["invalid run ID", { GITHUB_RUN_ID: "not-a-run" }],
    ["zero attempt", { GITHUB_RUN_ATTEMPT: "0" }]
  ];
  for (const [name, overrides] of cases) {
    await withTemporaryDirectory(async (directory) => {
      const { envFile, environment } = await makeRuntimeFixture(directory, overrides);
      const before = await readFile(envFile, "utf8");
      const result = await run("bash", [runtimeHelper], environment);
      assert.notEqual(result.status, 0, name);
      assert.equal(await readFile(envFile, "utf8"), before, name);
    });
  }

  await withTemporaryDirectory(async (directory) => {
    const invalidEnvTarget = resolve(directory, "github-env-directory");
    await mkdir(invalidEnvTarget, { recursive: true });
    const { envFile, environment } = await makeRuntimeFixture(directory, { GITHUB_ENV: invalidEnvTarget });
    const before = await readFile(envFile, "utf8");
    const result = await run("bash", [runtimeHelper], environment);
    assert.notEqual(result.status, 0);
    assert.equal(await readFile(envFile, "utf8"), before);
  });
});

test("R7-T08 initialization creates no proof or policy tree and preserves prior evidence", async () => {
  await withTemporaryDirectory(async (directory) => {
    const priorEvidence = resolve(directory, "prior-run/proof/public");
    await mkdir(priorEvidence, { recursive: true });
    await writeFile(resolve(priorEvidence, "sentinel.txt"), "preserve\n");
    const before = await readdir(priorEvidence);
    const { environment } = await makeRuntimeFixture(directory);
    const result = await run("bash", [runtimeHelper], environment);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.deepEqual(await readdir(priorEvidence), before);
    assert.equal(await stat(resolve(directory, "proof/public")).catch(() => null), null);
    assert.equal(await stat(resolve(directory, "policy")).catch(() => null), null);
    assert.equal(await stat(resolve(environment.RUNNER_TEMP, "ch001r6/123456789-1/sandbox")).catch(() => null), null);
  });
});

test("R7-T09 preserves explicit opt-in, public/manual guard, exact sandbox wiring, and owned cleanup", async () => {
  const workflow = await readFile(resolve(repositoryRoot, ".github/workflows/ch001-live-proof.yml"), "utf8");
  const sandbox = await readFile(resolve(repositoryRoot, "scripts/ch001-sandbox.mjs"), "utf8");
  const playwright = await readFile(resolve(repositoryRoot, "playwright.config.ts"), "utf8");
  const worker = await readFile(resolve(repositoryRoot, "apps/worker/src/index.ts"), "utf8");
  const jobEnv = workflow.slice(workflow.indexOf("    env:\n"), workflow.indexOf("    steps:\n"));
  assert.doesNotMatch(jobEnv, /CH001_SANDBOX_STATE_DIR/);
  assert.match(workflow, /bash scripts\/ci\/initialize-sandbox-state\.sh/);
  assert.match(workflow, /sandbox_qualification:[\s\S]*?required: true[\s\S]*?default: false[\s\S]*?type: boolean/);
  assert.match(workflow, /REPOSITORY_PRIVATE.*false/);
  assert.match(workflow, /node scripts\/ch001-sandbox\.mjs qualify/);
  assert.match(workflow, /node scripts\/ch001-sandbox\.mjs cleanup/);
  assert.match(workflow, /if: \$\{\{ always\(\) \}\}/);
  assert.match(sandbox, /chromiumSandbox: true|chromiumSandbox/);
  assert.match(playwright, /chromiumSandbox: true/);
  assert.match(worker, /chromiumSandbox: true/);
  assert.doesNotMatch(worker, /--no-sandbox|BROWSER_EXECUTABLE_PATH/);
});

test("R7-T11 keeps toolchain, dependency, native release, and runtime pins unchanged apart from one script", async () => {
  const currentPackage = JSON.parse(await readFile(resolve(repositoryRoot, "package.json"), "utf8"));
  const t6Package = JSON.parse(await gitShow("package.json"));
  const packageWithoutWorkflowScript = { ...currentPackage, scripts: { ...currentPackage.scripts } };
  delete packageWithoutWorkflowScript.scripts["lint:workflow"];
  assert.deepEqual(packageWithoutWorkflowScript, t6Package);
  for (const path of [".nvmrc", "pnpm-lock.yaml", "scripts/ci/pnpm-native-release.json", "Dockerfile", "compose.yaml", "playwright.config.ts"]) {
    assert.equal(await readFile(resolve(repositoryRoot, path), "utf8"), await gitShow(path), `${path} changed unexpectedly`);
  }
});
