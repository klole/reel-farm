/* global process */

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { chmod, lstat, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { test } from "node:test";
import {
  ActionlintBootstrapError,
  assertSupportedPlatform,
  downloadArchive,
  provisionActionlint,
  sha256File,
  validateArchiveMembers
} from "../../scripts/ci/actionlint-bootstrap.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = process.cwd();

async function withTemporaryDirectory(operation) {
  const directory = await mkdtemp(resolve(tmpdir(), "ch001r8-actionlint-test-"));
  try {
    return await operation(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function makeArchive(directory, { version = "1.7.7", output = 0 } = {}) {
  const sourceDirectory = resolve(directory, `source-${version}-${output}`);
  const executable = resolve(sourceDirectory, "actionlint");
  const archive = resolve(directory, `actionlint-${version}-${output}.tar.gz`);
  await mkdir(sourceDirectory, { recursive: true });
  await writeFile(executable, `#!/bin/sh\nif [ "$1" = "-version" ]; then printf '%s\\n' '${version}'; else exit ${output}; fi\n`, "utf8");
  await chmod(executable, 0o755);
  await execFileAsync("tar", ["--create", "--gzip", "--file", archive, "--directory", sourceDirectory, "actionlint"]);
  return { archive, executable, archiveSha256: await sha256File(archive), executableSha256: await sha256File(executable) };
}

function provenanceFor(archiveInfo, overrides = {}) {
  return {
    schema_version: 1,
    name: "actionlint",
    version: "1.7.7",
    release_tag: "v1.7.7",
    release_url: "https://example.invalid/actionlint/v1.7.7",
    distribution: {
      platform: "linux",
      architecture: "amd64",
      archive: "fixture.tar.gz",
      archive_url: "https://example.invalid/actionlint/fixture.tar.gz",
      archive_sha256: archiveInfo.archiveSha256,
      executable: "actionlint",
      executable_sha256: archiveInfo.executableSha256,
      ...overrides
    }
  };
}

async function makeEnvironment(directory) {
  const runnerTemp = resolve(directory, "runner temp");
  const githubEnv = resolve(directory, "github-env");
  await mkdir(runnerTemp, { recursive: true });
  await writeFile(githubEnv, "PREVIOUS=preserve\n", "utf8");
  return {
    PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin",
    HOME: directory,
    RUNNER_TEMP: runnerTemp,
    GITHUB_ENV: githubEnv,
    GITHUB_RUN_ID: "123456789",
    GITHUB_RUN_ATTEMPT: "1",
    CH001_RUN_ID: "r8-test-123456789-1",
    REQUESTED_SHA: "a".repeat(40),
    CH001_IMPLEMENTATION_COMMIT: "a".repeat(40),
    CH001_WORKFLOW_SHA: "b".repeat(40),
    CH001_WORKFLOW_BLOB_SHA: "c".repeat(40),
    CH001_WORKFLOW_FILE_SHA256: "d".repeat(64)
  };
}

async function assertFailure(operation, classification) {
  await assert.rejects(operation, (error) => {
    assert.equal(error instanceof ActionlintBootstrapError, true);
    assert.equal(error.classification, classification);
    return true;
  });
}

test("pinned actionlint archive is installed, attested, and exported without replacing prior env entries", async () => {
  await withTemporaryDirectory(async (directory) => {
    const archiveInfo = await makeArchive(directory);
    const environment = await makeEnvironment(directory);
    const reportPath = resolve(directory, "reports/actionlint-bootstrap.json");
    const result = await provisionActionlint({
      root: repositoryRoot,
      environment,
      provenance: provenanceFor(archiveInfo),
      enforcePinned: false,
      archivePath: archiveInfo.archive,
      reportPath
    });
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    assert.equal(result.report.status, "PASS");
    assert.equal(report.status, "PASS");
    assert.equal(report.actual_exit, 0);
    assert.equal(report.run_id, "123456789");
    assert.equal(report.run_attempt, "1");
    assert.equal(report.checkout_identity.actual_checkout_sha, "a".repeat(40));
    assert.equal(report.archive.measured_sha256, archiveInfo.archiveSha256);
    assert.equal(report.executable.measured_sha256, archiveInfo.executableSha256);
    assert.equal(report.executable.observed_version, "1.7.7");
    assert.equal(report.executable.path, result.binPath);
    assert.equal(report.path_updated, true);
    assert.equal((await lstat(result.binPath)).isFile(), true);
    assert.equal(await readFile(environment.GITHUB_ENV, "utf8"), `PREVIOUS=preserve\nACTIONLINT_BIN=${result.binPath}\n`);

    const consumerPath = resolve(directory, "consumer-actionlint-bin");
    const consumer = await execFileAsync(process.execPath, ["-e", "require('node:fs').writeFileSync(process.argv[1], process.env.ACTIONLINT_BIN ?? '')", consumerPath], {
      cwd: repositoryRoot,
      env: { ...environment, ACTIONLINT_BIN: result.binPath }
    });
    assert.equal(consumer.stdout, "");
    assert.equal(await readFile(consumerPath, "utf8"), result.binPath);
    assert.equal(await stat(resolve(directory, "proof")).catch(() => null), null);
  });
});

test("archive digest failure stops before extraction and leaves no tool directory", async () => {
  await withTemporaryDirectory(async (directory) => {
    const archiveInfo = await makeArchive(directory);
    const wrongArchive = resolve(directory, "wrong.tar.gz");
    await writeFile(wrongArchive, "not the pinned archive\n", "utf8");
    const environment = await makeEnvironment(directory);
    const reportPath = resolve(directory, "reports/wrong-archive.json");
    await assertFailure(() => provisionActionlint({
      root: repositoryRoot,
      environment,
      provenance: provenanceFor(archiveInfo),
      enforcePinned: false,
      archivePath: wrongArchive,
      reportPath
    }), "ARCHIVE_INTEGRITY_FAILURE");
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    assert.equal(report.status, "FAIL");
    assert.equal(report.actual_exit > 0, true);
    assert.equal(report.archive.measured_sha256, await sha256File(wrongArchive));
    assert.equal((await stat(report.tool_directory).catch(() => null)), null);
  });
});

test("executable digest and version failures are fail-closed after safe extraction", async () => {
  await withTemporaryDirectory(async (directory) => {
    const archiveInfo = await makeArchive(directory);
    const environment = await makeEnvironment(directory);
    await assertFailure(() => provisionActionlint({
      root: repositoryRoot,
      environment,
      provenance: provenanceFor(archiveInfo, { executable_sha256: "0".repeat(64) }),
      enforcePinned: false,
      archivePath: archiveInfo.archive,
      reportPath: resolve(directory, "reports/wrong-executable.json")
    }), "EXECUTABLE_INTEGRITY_FAILURE");

    const wrongVersion = await makeArchive(directory, { version: "1.7.6", output: 1 });
    const wrongVersionEnvironment = await makeEnvironment(resolve(directory, "wrong-version"));
    await assertFailure(() => provisionActionlint({
      root: repositoryRoot,
      environment: wrongVersionEnvironment,
      provenance: provenanceFor(wrongVersion),
      enforcePinned: false,
      archivePath: wrongVersion.archive,
      reportPath: resolve(directory, "reports/wrong-version.json")
    }), "VERSION_MISMATCH");
  });
});

test("unsupported targets, unsafe members, and bounded download failures are rejected", async () => {
  assert.throws(() => assertSupportedPlatform({ platform: "darwin", arch: "x64" }), /Unsupported actionlint platform/);
  assert.throws(() => assertSupportedPlatform({ platform: "linux", arch: "arm64" }), /Unsupported actionlint architecture/);
  assert.throws(() => validateArchiveMembers("../actionlint\n", "-rwxr-xr-x runner/runner 10 2026-01-01 00:00:00 ../actionlint"), /Traversal|Unsafe/);
  assert.throws(() => validateArchiveMembers("actionlint\n", "lrwxrwxrwx runner/runner 10 2026-01-01 00:00:00 actionlint -> marker"), /unsupported|special|member type/i);
  await withTemporaryDirectory(async (directory) => {
    await assertFailure(() => downloadArchive("https://127.0.0.1:1/actionlint.tar.gz", resolve(directory, "missing.tar.gz"), { retries: 1, timeoutMs: 100 }), "DOWNLOAD_FAILURE");
  });
});

test("explicit report paths are rejected before provisioning side effects", async () => {
  const invalidPaths = [
    ["relative", "reports/actionlint-bootstrap.json"],
    ["empty", ""],
    ["newline", `${resolve(tmpdir(), "actionlint-report")}\nSECOND=value`],
    ["carriage return", `${resolve(tmpdir(), "actionlint-report")}\rSECOND=value`]
  ];
  for (const [name, reportPath] of invalidPaths) {
    await withTemporaryDirectory(async (directory) => {
      const environment = await makeEnvironment(directory);
      const before = await readFile(environment.GITHUB_ENV, "utf8");
      await assertFailure(() => provisionActionlint({
        root: repositoryRoot,
        environment,
        archivePath: resolve(directory, "missing-archive.tar.gz"),
        reportPath
      }), "INPUT_INVALID");
      assert.equal(await readFile(environment.GITHUB_ENV, "utf8"), before, name);
      assert.deepEqual(await readdir(environment.RUNNER_TEMP), [], name);
      assert.equal(await stat(resolve(directory, "reports")).catch(() => null), null, name);
    });
  }

  await withTemporaryDirectory(async (directory) => {
    const environment = await makeEnvironment(directory);
    environment.ACTIONLINT_BOOTSTRAP_REPORT = "relative/actionlint-bootstrap.json";
    const before = await readFile(environment.GITHUB_ENV, "utf8");
    await assertFailure(() => provisionActionlint({
      root: repositoryRoot,
      environment,
      archivePath: resolve(directory, "missing-archive.tar.gz")
    }), "INPUT_INVALID");
    assert.equal(await readFile(environment.GITHUB_ENV, "utf8"), before);
    assert.deepEqual(await readdir(environment.RUNNER_TEMP), []);
    assert.equal(await stat(resolve(directory, "relative")).catch(() => null), null);
  });
});

test("null report path preserves the supported no-report behavior", async () => {
  await withTemporaryDirectory(async (directory) => {
    const archiveInfo = await makeArchive(directory);
    const environment = await makeEnvironment(directory);
    const result = await provisionActionlint({
      root: repositoryRoot,
      environment,
      provenance: provenanceFor(archiveInfo),
      enforcePinned: false,
      archivePath: archiveInfo.archive,
      reportPath: null,
      writeGithubEnv: false
    });
    assert.equal(result.report.status, "PASS");
    assert.equal(await stat(resolve(directory, "reports")).catch(() => null), null);
  });
});
