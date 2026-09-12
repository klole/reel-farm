/* global process */

import assert from "node:assert/strict";
import { lstat } from "node:fs/promises";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { test } from "node:test";
import { detectLibc, parsePackageManagerPin, selectTarget, validateArchiveMembers, validateManifest, bootstrap } from "../../scripts/ci/pnpm-bootstrap.mjs";
import { classifyResult, formatSummary, validateProofReport } from "../../scripts/ci/ci-result.mjs";

const implementation = "0b79ed07a25a618ab4da2bf56a2fed6047398cb5";
const workflow = "4cf020317cfc2e8755f35ee6da10f7397c8676f2";
const runKey = "r4-test-001";
const passArtifact = { status: "PASS", artifact_id: 123, artifact_digest: "sha256:" + "a".repeat(64) };

function report(overrides = {}) {
  return {
    requested_implementation_sha: implementation,
    actual_checkout_sha: implementation,
    workflow_definition_sha: workflow,
    workflow_blob_sha: "a".repeat(40),
    run_key: runKey,
    bootstrap_status: "PASS",
    proof_invoked: true,
    proof_exit_code: 0,
    proof_report_path: "proof-result.json",
    artifact_delivery: passArtifact,
    summary_exit_code: null,
    stages: [{ name: "docker-preflight", status: "PASS", blocking: false, exit_code: 0 }],
    ...overrides
  };
}

function validProof(overrides = {}) {
  return {
    status: "LIVE_PROOF_READY_FOR_REVIEW",
    exit_code: 0,
    run_id: runKey,
    implementation_commit: implementation,
    application_acceptance: false,
    accepted_application_version: "none",
    required_live_artifacts: ["a-little-room-to-focus.zip"],
    evidence_root: "artifacts/ch001r4/r4-test-001/proof/public",
    ...overrides
  };
}

test("summary formatter treats backticks, substitutions, percent signs, and spaces as data", async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), "ch001r4-summary-test-"));
  const marker = resolve(temporary, "marker");
  const hostile = `sha \`touch ${marker}\` $(touch ${marker}) %s value with spaces`;
  const summary = formatSummary({
    report: report({ requested_implementation_sha: hostile, actual_checkout_sha: hostile, proof_invoked: false, proof_exit_code: null }),
    result: { classification: "CI_BOOTSTRAP_FAILURE" }
  });
  assert.match(summary, /touch/);
  assert.match(summary, /%s/);
  assert.match(summary, /value with spaces/);
  assert.equal((await lstat(marker).catch(() => null)), null);
  await rm(temporary, { recursive: true, force: true });
});

test("absent proof remains not invoked with a nullable proof exit and a failing final classification", () => {
  const result = classifyResult({ report: report({ proof_invoked: false, proof_exit_code: null }) });
  assert.equal(result.classification, "CI_BOOTSTRAP_FAILURE");
  assert.equal(result.final_exit_code > 0, true);
  assert.equal(result.proof_validation, null);
});

test("proof exits 1 and 2 remain distinct from bootstrap failure", () => {
  const failed = classifyResult({ report: report({ proof_exit_code: 1 }), proofReport: validProof({ exit_code: 1, status: "TEST_FAILURE" }) });
  const blocked = classifyResult({ report: report({ proof_exit_code: 2 }), proofReport: validProof({ exit_code: 2, status: "BLOCKED_ENVIRONMENT" }) });
  assert.equal(failed.classification, "LIVE_PROOF_FAILED");
  assert.equal(failed.final_exit_code, 1);
  assert.equal(blocked.classification, "BLOCKED_ENVIRONMENT");
  assert.equal(blocked.final_exit_code, 2);
});

test("exit 0 requires a fresh, identity-matching proof report and delivered artifact", () => {
  const ready = classifyResult({ report: report(), proofReport: validProof() });
  const missing = classifyResult({ report: report(), proofReport: null });
  const stale = classifyResult({ report: report(), proofReport: validProof({ implementation_commit: "f".repeat(40) }) });
  const malformed = classifyResult({ report: report(), proofReport: { run_id: runKey } });
  const undelivered = classifyResult({ report: report({ artifact_delivery: { status: "FAIL" } }), proofReport: validProof() });
  assert.equal(ready.classification, "LIVE_PROOF_READY_FOR_REVIEW");
  assert.equal(ready.final_exit_code, 0);
  assert.equal(missing.classification, "EVIDENCE_INVALID");
  assert.equal(stale.classification, "EVIDENCE_INVALID");
  assert.equal(malformed.classification, "EVIDENCE_INVALID");
  assert.equal(undelivered.classification, "ARTIFACT_DELIVERY_FAILURE");
  assert.equal(validateProofReport(validProof(), { runKey, implementation }).ok, true);
});

test("summary failure is secondary to an earlier live-proof failure", () => {
  const result = classifyResult({ report: report({ proof_exit_code: 1, summary_exit_code: 1 }), proofReport: validProof({ exit_code: 1, status: "TEST_FAILURE" }) });
  assert.equal(result.classification, "LIVE_PROOF_FAILED");
  assert.deepEqual(result.secondary_failures, ["CI_REPORTING_FAILURE"]);
});

test("native archive validation accepts the inspected pnpm/dist layout and safe hardlinks", () => {
  const names = ["pnpm", "dist", "dist/index.js", "dist/package.json"];
  const verbose = [
    "-rwxr-xr-x runner/runner 10 2026-09-04 13:55:00 pnpm",
    "drwxr-xr-x runner/runner 0 2026-09-04 13:47:00 dist",
    "-rw-r--r-- runner/runner 10 2026-09-04 13:47:00 dist/index.js",
    "hrw-r--r-- runner/runner 0 2026-09-04 13:47:00 dist/package.json link to dist/index.js"
  ];
  const result = validateArchiveMembers(names.join("\n"), verbose.join("\n"));
  assert.equal(result.typesByName.get("pnpm"), "-");
  assert.equal(result.typesByName.get("dist/package.json"), "h");
});

test("native archive validation rejects traversal, symlinks, and unexpected members", () => {
  assert.throws(() => validateArchiveMembers("../pnpm\ndist\n", "-rwxr-xr-x runner/runner 10 2026-09-04 13:55:00 ../pnpm\ndrwxr-xr-x runner/runner 0 2026-09-04 13:47:00 dist"), /Unsafe|Traversal/);
  assert.throws(() => validateArchiveMembers("pnpm\ndist\n", "lrwxrwxrwx runner/runner 0 2026-09-04 13:55:00 pnpm -> marker\ndrwxr-xr-x runner/runner 0 2026-09-04 13:47:00 dist"), /Unsafe|unsupported|regular|special|layout/i);
  assert.throws(() => validateArchiveMembers("pnpm\ndist\nsecret\n", "-rwxr-xr-x runner/runner 10 2026-09-04 13:55:00 pnpm\ndrwxr-xr-x runner/runner 0 2026-09-04 13:47:00 dist\n-rw-r--r-- runner/runner 10 2026-09-04 13:47:00 secret"), /Unexpected/);
});

test("pin parsing and target selection fail closed for drift and unsupported targets", async () => {
  const manifest = JSON.parse(await readFile(resolve(process.cwd(), "scripts/ci/pnpm-native-release.json"), "utf8"));
  assert.deepEqual(parsePackageManagerPin("pnpm@12.3.4"), { name: "pnpm", version: "12.3.4", pin: "pnpm@12.3.4" });
  assert.throws(() => parsePackageManagerPin("pnpm@latest"), /exact/);
  assert.throws(() => selectTarget({ platform: "linux", arch: "riscv64", libc: "glibc" }, manifest), /Unsupported/);
  assert.throws(() => selectTarget({ platform: "linux", arch: "x64", libc: "musl" }, manifest), /Unsupported/);
  assert.ok(detectLibc() === "glibc" || detectLibc() === "unknown");
  assert.equal(validateManifest(manifest).packageManager.pin, "pnpm@12.3.4");
});

test("wrong archive digest is rejected before extraction or execution", async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), "ch001r4-digest-test-"));
  const archive = resolve(temporary, "wrong.tar.gz");
  const destination = resolve(temporary, "owned-pnpm");
  const manifest = JSON.parse(await readFile(resolve(process.cwd(), "scripts/ci/pnpm-native-release.json"), "utf8"));
  manifest.targets["linux-x64-glibc"].sha256 = "0".repeat(64);
  const manifestPath = resolve(temporary, "manifest.json");
  await writeFile(manifestPath, `${JSON.stringify(manifest)}\n`);
  await writeFile(archive, "not a tar archive");
  await assert.rejects(() => bootstrap({ root: process.cwd(), manifest: manifestPath, archive, destination, noGithubPath: true }), (error) => error.classification === "ARCHIVE_INTEGRITY_FAILURE");
  assert.equal((await lstat(destination).catch(() => null)), null);
  await rm(temporary, { recursive: true, force: true });
});
