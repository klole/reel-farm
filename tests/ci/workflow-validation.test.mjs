/* global process structuredClone */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile, execFileSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { test } from "node:test";
import { assertAllowedLockfileDelta, assertAllowedRootManifestDelta } from "../../scripts/ci/pin-scope.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = process.cwd();
const wrapper = resolve(repositoryRoot, "scripts/ci/lint-workflow.mjs");
const runtimeHelper = resolve(repositoryRoot, "scripts/ci/initialize-sandbox-state.sh");
const validFixture = resolve(repositoryRoot, "tests/fixtures/workflow-validation/valid-runtime.yml");
const invalidStepsFixture = resolve(repositoryRoot, "tests/fixtures/workflow-validation/invalid-steps.yml");
const invalidYamlFixture = resolve(repositoryRoot, "tests/fixtures/workflow-validation/invalid-yaml.yml");
const t6Commit = "e0ea57665d00a643a8c392dfb9f6a84a723729af";
const t6WorkflowSha256 = "e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85";

function withEnvironment(baseEnvironment, overrides = {}) {
  const environment = { ...baseEnvironment };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete environment[key];
    else environment[key] = value;
  }
  return environment;
}

function minimalRuntimeEnvironment(home = repositoryRoot) {
  const environment = {
    PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin",
    HOME: home,
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    TMPDIR: process.env.TMPDIR ?? tmpdir(),
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0"
  };
  if (process.env.ACTIONLINT_BIN) environment.ACTIONLINT_BIN = process.env.ACTIONLINT_BIN;
  return environment;
}

function hostedLikeParentEnvironment(directory) {
  return withEnvironment(minimalRuntimeEnvironment(directory), {
    RUNNER_TEMP: resolve(directory, "parent runner temp"),
    GITHUB_ENV: resolve(directory, "parent github-env"),
    GITHUB_PATH: resolve(directory, "parent github-path"),
    GITHUB_STEP_SUMMARY: resolve(directory, "parent step-summary"),
    GITHUB_OUTPUT: resolve(directory, "parent github-output"),
    GITHUB_RUN_ID: "999999999",
    GITHUB_RUN_ATTEMPT: "1",
    CH001_SANDBOX_STATE_DIR: resolve(directory, "inherited sandbox state")
  });
}

async function runExact(command, argumentsList, completeEnvironment) {
  try {
    const result = await execFileAsync(command, argumentsList, {
      cwd: repositoryRoot,
      env: completeEnvironment,
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

function runWithOverrides(command, argumentsList, overrides = {}, baseEnvironment = minimalRuntimeEnvironment()) {
  return runExact(command, argumentsList, withEnvironment(baseEnvironment, overrides));
}

async function runWrapper(argumentsList, overrides = {}) {
  return runWithOverrides(process.execPath, [wrapper, ...argumentsList], overrides);
}

function runActionlintDirect(path, environment = minimalRuntimeEnvironment()) {
  const actionlint = environment.ACTIONLINT_BIN ?? "actionlint";
  try {
    return {
      status: 0,
      stdout: execFileSync(actionlint, ["-shellcheck=", "-pyflakes=", path], {
        cwd: repositoryRoot,
        env: environment,
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
  const parent = hostedLikeParentEnvironment(directory);
  await mkdir(parent.RUNNER_TEMP, { recursive: true });
  await writeFile(parent.GITHUB_ENV, "PARENT=preserve\n", "utf8");
  await writeFile(parent.GITHUB_PATH, "PARENT_PATH=preserve\n", "utf8");
  await writeFile(parent.GITHUB_STEP_SUMMARY, "PARENT_SUMMARY=preserve\n", "utf8");
  await writeFile(parent.GITHUB_OUTPUT, "PARENT_OUTPUT=preserve\n", "utf8");
  await mkdir(runnerTemp, { recursive: true });
  await writeFile(envFile, "PREVIOUS=preserve\n", "utf8");
  const environment = withEnvironment(parent, {
    RUNNER_TEMP: runnerTemp,
    GITHUB_RUN_ID: "123456789",
    GITHUB_RUN_ATTEMPT: "1",
    GITHUB_ENV: envFile,
    CH001_SANDBOX_STATE_DIR: undefined,
    ...overrides
  });
  return { runnerTemp, envFile, parentEnvFile: parent.GITHUB_ENV, parent, environment };
}

async function observeChildEnvironment(environment, destination, keys) {
  const source = "const fs = require('node:fs'); const keys = process.argv.slice(2); const observed = Object.fromEntries(keys.map((key) => [key, { present: Object.hasOwn(process.env, key), value: process.env[key] ?? null }])); fs.writeFileSync(process.argv[1], JSON.stringify(observed));";
  return runExact(process.execPath, ["-e", source, destination, ...keys], environment);
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

    const wrongVersionTool = resolve(directory, "actionlint-wrong-version");
    await writeFile(wrongVersionTool, "#!/bin/sh\nif [ \"$1\" = \"-version\" ]; then printf '%s\\n' '1.7.6'; else exit 0; fi\n");
    await chmod(wrongVersionTool, 0o755);
    const wrongVersion = await runWrapper(["--file", validFixture], { ACTIONLINT_BIN: wrongVersionTool });
    assert.equal(wrongVersion.status, 2);

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
    const initialized = await runExact("bash", [runtimeHelper], environment);
    assert.equal(initialized.status, 0, `${initialized.stdout}\n${initialized.stderr}`);
    const expected = `${runnerTemp}/ch001r6/123456789-1/sandbox`;
    const entries = (await readFile(envFile, "utf8")).split("\n");
    const stateEntries = entries.filter((line) => line.startsWith("CH001_SANDBOX_STATE_DIR="));
    assert.deepEqual(stateEntries, [`CH001_SANDBOX_STATE_DIR=${expected}`]);
    assert.equal(await stat(expected).catch(() => null), null);

    for (const consumer of ["qualification", "cleanup"]) {
      const observedPath = resolve(directory, `${consumer}.observed`);
      const observed = await runExact(process.execPath, ["-e", "require('node:fs').writeFileSync(process.argv[1], process.env.CH001_SANDBOX_STATE_DIR ?? '')", observedPath], withEnvironment(environment, {
        CH001_SANDBOX_STATE_DIR: expected,
        R7_CONSUMER: consumer
      }));
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
    const initialized = await runExact("bash", [runtimeHelper], environment);
    assert.equal(initialized.status, 0, `${initialized.stdout}\n${initialized.stderr}`);
    const expected = `${shellLookingTemp}/ch001r6/123456789-1/sandbox`;
    assert.equal(await readFile(envFile, "utf8"), `PREVIOUS=preserve\nCH001_SANDBOX_STATE_DIR=${expected}\n`);
    assert.equal(await stat(marker).catch(() => null), null);
  });
});

test("R8-T06 keeps missing RUNNER_TEMP absent under a hosted-like parent", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { envFile, parentEnvFile, environment } = await makeRuntimeFixture(directory, { RUNNER_TEMP: undefined });
    const observedPath = resolve(directory, "missing-runner-temp.observed.json");
    const observed = await observeChildEnvironment(environment, observedPath, ["RUNNER_TEMP", "GITHUB_ENV", "CH001_SANDBOX_STATE_DIR"]);
    assert.equal(observed.status, 0, `${observed.stdout}\n${observed.stderr}`);
    assert.deepEqual(JSON.parse(await readFile(observedPath, "utf8")), {
      RUNNER_TEMP: { present: false, value: null },
      GITHUB_ENV: { present: true, value: envFile },
      CH001_SANDBOX_STATE_DIR: { present: false, value: null }
    });
    const fixtureBefore = await readFile(envFile, "utf8");
    const parentBefore = await readFile(parentEnvFile, "utf8");
    const result = await runExact("bash", [runtimeHelper], environment);
    assert.notEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.equal(await readFile(envFile, "utf8"), fixtureBefore);
    assert.equal(await readFile(parentEnvFile, "utf8"), parentBefore);
  });
});

test("R8-T07 keeps missing GITHUB_ENV absent under a hosted-like parent", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { envFile, parentEnvFile, environment } = await makeRuntimeFixture(directory, { GITHUB_ENV: undefined });
    const observedPath = resolve(directory, "missing-github-env.observed.json");
    const observed = await observeChildEnvironment(environment, observedPath, ["RUNNER_TEMP", "GITHUB_ENV", "CH001_SANDBOX_STATE_DIR"]);
    assert.equal(observed.status, 0, `${observed.stdout}\n${observed.stderr}`);
    assert.deepEqual(JSON.parse(await readFile(observedPath, "utf8")), {
      RUNNER_TEMP: { present: true, value: resolve(directory, "runner temp") },
      GITHUB_ENV: { present: false, value: null },
      CH001_SANDBOX_STATE_DIR: { present: false, value: null }
    });
    const fixtureBefore = await readFile(envFile, "utf8");
    const parentBefore = await readFile(parentEnvFile, "utf8");
    const result = await runExact("bash", [runtimeHelper], environment);
    assert.notEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.equal(await readFile(envFile, "utf8"), fixtureBefore);
    assert.equal(await readFile(parentEnvFile, "utf8"), parentBefore);
  });
});

test("R8-T08 rejects invalid runtime inputs before changing any environment entries", async () => {
  const cases = [
    ["relative RUNNER_TEMP", { RUNNER_TEMP: "relative" }],
    ["newline RUNNER_TEMP", { RUNNER_TEMP: `${resolve(tmpdir(), "r7")}\nOTHER=value` }],
    ["invalid run ID", { GITHUB_RUN_ID: "not-a-run" }],
    ["zero attempt", { GITHUB_RUN_ATTEMPT: "0" }]
  ];
  for (const [name, overrides] of cases) {
    await withTemporaryDirectory(async (directory) => {
      const { envFile, parentEnvFile, environment } = await makeRuntimeFixture(directory, overrides);
      const before = await readFile(envFile, "utf8");
      const parentBefore = await readFile(parentEnvFile, "utf8");
      const result = await runExact("bash", [runtimeHelper], environment);
      assert.notEqual(result.status, 0, name);
      assert.equal(await readFile(envFile, "utf8"), before, name);
      assert.equal(await readFile(parentEnvFile, "utf8"), parentBefore, name);
    });
  }

  await withTemporaryDirectory(async (directory) => {
    const invalidEnvTarget = resolve(directory, "github-env-directory");
    await mkdir(invalidEnvTarget, { recursive: true });
    const { envFile, parentEnvFile, environment } = await makeRuntimeFixture(directory, { GITHUB_ENV: invalidEnvTarget });
    const before = await readFile(envFile, "utf8");
    const parentBefore = await readFile(parentEnvFile, "utf8");
    const result = await runExact("bash", [runtimeHelper], environment);
    assert.notEqual(result.status, 0);
    assert.equal(await readFile(envFile, "utf8"), before);
    assert.equal(await readFile(parentEnvFile, "utf8"), parentBefore);
  });
});

test("R8-T09 detects the old second environment merge as a real contamination", async () => {
  await withTemporaryDirectory(async (directory) => {
    for (const missing of ["RUNNER_TEMP", "GITHUB_ENV"]) {
      const fixture = await makeRuntimeFixture(directory, { [missing]: undefined });
      const observedPath = resolve(directory, `${missing}.legacy.observed.json`);
      const legacyEnvironment = withEnvironment(fixture.parent, fixture.environment);
      const observed = await observeChildEnvironment(legacyEnvironment, observedPath, ["RUNNER_TEMP", "GITHUB_ENV"]);
      assert.equal(observed.status, 0, `${missing}: ${observed.stdout}\n${observed.stderr}`);
      assert.equal(JSON.parse(await readFile(observedPath, "utf8"))[missing].present, true, missing);
      const result = await runExact("bash", [runtimeHelper], legacyEnvironment);
      assert.equal(result.status, 0, `${missing}: ${result.stdout}\n${result.stderr}`);
      if (missing === "RUNNER_TEMP") {
        assert.match(await readFile(fixture.envFile, "utf8"), /CH001_SANDBOX_STATE_DIR=/);
        assert.equal(await readFile(fixture.parentEnvFile, "utf8"), "PARENT=preserve\n");
      } else {
        assert.equal(await readFile(fixture.envFile, "utf8"), "PREVIOUS=preserve\n");
        assert.match(await readFile(fixture.parentEnvFile, "utf8"), /CH001_SANDBOX_STATE_DIR=/);
      }
      await rm(fixture.runnerTemp, { recursive: true, force: true });
      await writeFile(fixture.envFile, "PREVIOUS=preserve\n", "utf8");
      await writeFile(fixture.parentEnvFile, "PARENT=preserve\n", "utf8");
    }
  });
});

test("R7-T08 initialization creates no proof or policy tree and preserves prior evidence", async () => {
  await withTemporaryDirectory(async (directory) => {
    const priorEvidence = resolve(directory, "prior-run/proof/public");
    await mkdir(priorEvidence, { recursive: true });
    await writeFile(resolve(priorEvidence, "sentinel.txt"), "preserve\n");
    const before = await readdir(priorEvidence);
    const { environment } = await makeRuntimeFixture(directory);
    const result = await runExact("bash", [runtimeHelper], environment);
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
  assert.match(workflow, /Provision and verify pinned actionlint 1\.7\.7/);
  assert.match(workflow, /Validate current tracked workflows with pinned actionlint/);
  assert.match(workflow, /Run complete CI repair regressions with pinned actionlint/);
  assert.ok(workflow.indexOf("Provision and verify pinned actionlint 1.7.7") < workflow.indexOf("Run complete CI repair regressions with pinned actionlint"));
  assert.ok(workflow.indexOf("Validate current tracked workflows with pinned actionlint") < workflow.indexOf("Run complete CI repair regressions with pinned actionlint"));
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
  assertAllowedRootManifestDelta(currentPackage, t6Package);
  assertAllowedLockfileDelta(await readFile(resolve(repositoryRoot, "pnpm-lock.yaml"), "utf8"), await gitShow("pnpm-lock.yaml"));
  for (const path of [".nvmrc", ".tool-versions", ".npmrc", "scripts/ci/pnpm-native-release.json", "Dockerfile", "compose.yaml", "playwright.config.ts"]) {
    assert.equal(await readFile(resolve(repositoryRoot, path), "utf8"), await gitShow(path), `${path} changed unexpectedly`);
  }
});

test("R11-T04 pin guard rejects wrong or missing workspace dependency forms and unrelated root changes", async () => {
  const currentPackage = JSON.parse(await readFile(resolve(repositoryRoot, "package.json"), "utf8"));
  const t6Package = JSON.parse(await gitShow("package.json"));
  const currentLock = await readFile(resolve(repositoryRoot, "pnpm-lock.yaml"), "utf8");
  const t6Lock = await gitShow("pnpm-lock.yaml");
  const rootLink = ["      '@oss/db':", "        specifier: workspace:*", "        version: link:packages/db"].join("\n");
  const rootLinkIndex = currentLock.indexOf(rootLink);
  assert.notEqual(rootLinkIndex, -1);

  const wrongSpecifier = structuredClone(currentPackage);
  wrongSpecifier.dependencies["@oss/db"] = "8.16.3";
  assert.throws(() => assertAllowedRootManifestDelta(wrongSpecifier, t6Package), /workspace:\*/);

  const missingEdge = structuredClone(currentPackage);
  delete missingEdge.dependencies["@oss/db"];
  assert.throws(() => assertAllowedRootManifestDelta(missingEdge, t6Package), /workspace:\*/);

  const secondRootDependency = structuredClone(currentPackage);
  secondRootDependency.dependencies["@oss/not-authorized"] = "workspace:*";
  assert.throws(() => assertAllowedRootManifestDelta(secondRootDependency, t6Package), /unapproved change/i);

  const changedExternal = structuredClone(currentPackage);
  changedExternal.dependencies.pg = "8.16.2";
  assert.throws(() => assertAllowedRootManifestDelta(changedExternal, t6Package), /unapproved change/i);

  const changedRuntimePin = structuredClone(currentPackage);
  changedRuntimePin.engines.node = ">=20.10.0 <21";
  assert.throws(() => assertAllowedRootManifestDelta(changedRuntimePin, t6Package), /unapproved change/i);

  const wrongLockSpecifier = currentLock.replace("        specifier: workspace:*\n        version: link:packages/db", "        specifier: workspace:^0.1.0\n        version: link:packages/db");
  assert.throws(() => assertAllowedLockfileDelta(wrongLockSpecifier, t6Lock), /authorized|local link|workspace/i);
  assert.throws(() => assertAllowedLockfileDelta(currentLock.slice(0, rootLinkIndex) + currentLock.slice(rootLinkIndex + rootLink.length), t6Lock), /exactly one|relationship/i);
  const secondLockEdge = currentLock.slice(0, rootLinkIndex + rootLink.length) + "\n" + rootLink.replace("@oss/db", "@oss/not-authorized").replace("link:packages/db", "link:packages/contracts") + currentLock.slice(rootLinkIndex + rootLink.length);
  assert.throws(() => assertAllowedLockfileDelta(secondLockEdge, t6Lock), /outside|unapproved|relationship/i);

  const changedLockExternal = currentLock.replace("      pg:\n        specifier: 8.16.3\n        version: 8.16.3", "      pg:\n        specifier: 8.16.2\n        version: 8.16.2");
  assert.throws(() => assertAllowedLockfileDelta(changedLockExternal, t6Lock), /outside|change/i);
  const changedLockMetadata = currentLock.replace("lockfileVersion: '9.0'", "lockfileVersion: '8.0'");
  assert.throws(() => assertAllowedLockfileDelta(changedLockMetadata, t6Lock), /outside|change|documents/i);
});
