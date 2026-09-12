/* global process */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { dirname, relative, resolve } from "node:path";
import { mkdtemp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { test } from "node:test";
import {
  assertValidProofRunId,
  prepareProofEvidenceDirectories,
  resolveProofEvidenceRoot,
  writeCoordinatorFailureReport
} from "../../scripts/ch001-proof-boundary.mjs";

const execFileAsync = promisify(execFile);
const implementation = "a".repeat(40);
const workflow = "b".repeat(40);

async function withTemporaryDirectory(operation) {
  const directory = await mkdtemp(resolve(tmpdir(), "ch001r5-boundary-"));
  try {
    return await operation(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function directoryEntries(path) {
  return (await readdir(path)).sort();
}

async function exists(path) {
  return stat(path).then(() => true).catch(() => false);
}

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

async function runNode(args, environment = {}) {
  return execFileAsync(process.execPath, args, { cwd: process.cwd(), env: { ...process.env, ...environment } });
}

test("R5-T01 old boundary: proof/public created before preparation is rejected", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const evidenceRoot = resolve(temporary, "run/proof");
    await mkdir(resolve(evidenceRoot, "public"), { recursive: true });
    await assert.rejects(() => prepareProofEvidenceDirectories(evidenceRoot), /already exists and is non-empty/);
    assert.deepEqual(await directoryEntries(evidenceRoot), ["public"]);
  });
});

test("R5-T02 corrected workflow setup initializes bootstrap output without populating proof", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const bootstrapReport = resolve(temporary, "run parent with spaces/bootstrap/public/bootstrap-result.json");
    const proofRoot = resolve(temporary, "run parent with spaces/proof");
    const workflowText = await readFile(resolve(process.cwd(), ".github/workflows/ch001-live-proof.yml"), "utf8");
    assert.match(workflowText, /mkdir -p "\$\(dirname "\$CI_BOOTSTRAP_REPORT"\)"/);
    assert.doesNotMatch(workflowText, /mkdir[^\n]*\$CH001_EVIDENCE_ROOT/);
    await execFileAsync("bash", ["-euo", "pipefail", "-c", "mkdir -p \"$(dirname \"$CI_BOOTSTRAP_REPORT\")\"\nnode scripts/ci/ci-result.mjs init --report \"$CI_BOOTSTRAP_REPORT\""], {
      cwd: process.cwd(),
      env: { ...process.env, CI_BOOTSTRAP_REPORT: bootstrapReport, CH001_EVIDENCE_ROOT: proofRoot, CH001_RUN_ID: "r5-bootstrap-test", REQUESTED_SHA: implementation, CH001_WORKFLOW_SHA: workflow }
    });
    assert.equal(await exists(bootstrapReport), true);
    assert.equal(await exists(resolve(dirname(bootstrapReport), "ci-result.json")), true);
    assert.equal(await exists(proofRoot), false);
  });
});

test("R5-T03 corrected handoff: coordinator preparation creates its owned children", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const prepared = await prepareProofEvidenceDirectories(resolve(temporary, "proof"));
    assert.deepEqual(await directoryEntries(prepared.evidenceRoot), ["private", "public"]);
    assert.equal(await exists(prepared.privateCommandDir), true);
    assert.equal(await exists(prepared.publicCommandDir), true);
    assert.equal(prepared.emptyEnvPath, resolve(prepared.privateDir, "empty.env"));
  });
});

test("R5-T04 an empty preexisting public child still refuses the proof root", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const evidenceRoot = resolve(temporary, "proof");
    await mkdir(resolve(evidenceRoot, "public"), { recursive: true });
    assert.deepEqual(await directoryEntries(resolve(evidenceRoot, "public")), []);
    await assert.rejects(() => prepareProofEvidenceDirectories(evidenceRoot), /already exists and is non-empty/);
  });
});

test("R5-T05 refusal preserves prior evidence bytes and does not write a failure report", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const evidenceRoot = resolve(temporary, "proof");
    const publicDir = resolve(evidenceRoot, "public");
    const report = resolve(publicDir, "proof-result.json");
    const sentinel = resolve(publicDir, "sentinel.bin");
    await mkdir(publicDir, { recursive: true });
    await writeFile(report, '{"status":"historical"}\n');
    await writeFile(sentinel, "keep-this-byte-sequence\n");
    const before = { report: await sha256(report), sentinel: await sha256(sentinel), entries: await directoryEntries(evidenceRoot) };
    await assert.rejects(() => prepareProofEvidenceDirectories(evidenceRoot), /already exists and is non-empty/);
    assert.equal(await writeCoordinatorFailureReport({ publicDir, ownsEvidence: false, report: { status: "TEST_FAILURE" } }), false);
    assert.deepEqual({ report: await sha256(report), sentinel: await sha256(sentinel), entries: await directoryEntries(evidenceRoot) }, before);
    assert.deepEqual(JSON.parse(await readFile(report, "utf8")), { status: "historical" });
  });
});

test("R5-T06 repeating the same initialization is rejected without implicit resumption", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const evidenceRoot = resolve(temporary, "proof");
    await prepareProofEvidenceDirectories(evidenceRoot);
    await assert.rejects(() => prepareProofEvidenceDirectories(evidenceRoot), /already exists and is non-empty/);
  });
});

test("R5-T07 a separate run succeeds without touching its sibling evidence", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const first = await prepareProofEvidenceDirectories(resolve(temporary, "run-a/proof"));
    const marker = resolve(first.publicDir, "marker.txt");
    await writeFile(marker, "run-a\n");
    const second = await prepareProofEvidenceDirectories(resolve(temporary, "run-b/proof"));
    assert.equal(await readFile(marker, "utf8"), "run-a\n");
    assert.equal(await exists(resolve(second.publicDir, "marker.txt")), false);
  });
});

test("R5-T08 quoted repository and run-parent paths are handled correctly", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const repositoryRoot = resolve(temporary, "repository with spaces");
    const configuredRoot = "artifacts/run parent with spaces/proof";
    const evidenceRoot = resolveProofEvidenceRoot(repositoryRoot, configuredRoot, "r5-quoted-path");
    const prepared = await prepareProofEvidenceDirectories(evidenceRoot);
    assert.equal(prepared.evidenceRoot, resolve(repositoryRoot, configuredRoot));
    assert.equal(relative(repositoryRoot, prepared.evidenceRoot), configuredRoot);
  });
});

test("R5-T09 invalid run IDs and outside-repository evidence paths remain rejected", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const repositoryRoot = resolve(temporary, "repository");
    assert.throws(() => assertValidProofRunId("R5 unsafe"), /short lowercase run-owned identifier/);
    assert.throws(() => resolveProofEvidenceRoot(repositoryRoot, "../outside", "r5-safe"), /remain inside the repository/);
    assert.throws(() => resolveProofEvidenceRoot(repositoryRoot, resolve(temporary, "outside"), "r5-safe"), /remain inside the repository/);
  });
});

test("R5-T10 refusal propagation keeps the actual child exit and does not claim app tests ran", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const bootstrapReport = resolve(temporary, "bootstrap/public/bootstrap-result.json");
    const proofReport = resolve(temporary, "proof/public/proof-result.json");
    const refusalLog = resolve(temporary, "refusal.log");
    await writeFile(refusalLog, "Evidence run directory already exists and is non-empty\n");
    const environment = { CI_BOOTSTRAP_REPORT: bootstrapReport, CI_PROOF_REPORT: proofReport, CH001_RUN_ID: "r5-refusal-test", REQUESTED_SHA: implementation, CH001_IMPLEMENTATION_COMMIT: implementation, CH001_WORKFLOW_SHA: workflow };
    await runNode(["scripts/ci/ci-result.mjs", "init", "--report", bootstrapReport], environment);
    await runNode(["scripts/ci/ci-result.mjs", "record-stage", "--report", bootstrapReport, "--name", "bounded-proof", "--blocking", "false", "--proof-invoked", "true", "--proof-report", proofReport, "--exit-code", "1", "--log-file", refusalLog], environment);
    const result = JSON.parse(await readFile(resolve(dirname(bootstrapReport), "ci-result.json"), "utf8"));
    assert.equal(result.proof_invoked, true);
    assert.equal(result.proof_exit_code, 1);
    assert.equal(result.classification, "LIVE_PROOF_FAILED");
    assert.equal(result.final_exit_code, 1);
    assert.equal(result.proof_report_validation, null);
    assert.equal(await exists(proofReport), false);
  });
});

test("R5-T11 failure after successful preparation writes only the owned run report", async () => {
  await withTemporaryDirectory(async (temporary) => {
    const first = await prepareProofEvidenceDirectories(resolve(temporary, "run-a/proof"));
    const second = resolve(temporary, "run-b/proof");
    const report = { profile: "CH-001R-r3 bounded live proof", status: "TEST_FAILURE", exit_code: 1, application_acceptance: false, accepted_application_version: "none" };
    assert.equal(await writeCoordinatorFailureReport({ publicDir: first.publicDir, ownsEvidence: true, report }), true);
    assert.deepEqual(JSON.parse(await readFile(resolve(first.publicDir, "proof-result.json"), "utf8")), report);
    assert.equal(await exists(second), false);
  });
});

test("R5-T12 existing CI regression command remains wired alongside the boundary suite", async () => {
  const packageJson = JSON.parse(await readFile(resolve(process.cwd(), "package.json"), "utf8"));
  assert.equal(packageJson.scripts["test:ci"], "node --test tests/ci");
  assert.equal(await exists(resolve(process.cwd(), "tests/ci/ci-repair.test.mjs")), true);
});
