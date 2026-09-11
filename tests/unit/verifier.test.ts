import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { EXPECTED_GATE_IDS, REQUIRED_ROOT_COMMANDS, makeEvidenceRef, type EvidencePackage, type EvidenceRef, validateEvidencePackage, writeJson } from "../../scripts/ch001-harness.ts";

const testCommit = "a".repeat(40);

async function fixture(): Promise<{ root: string; report: EvidencePackage; evidence: EvidenceRef }> {
  const root = await mkdtemp(resolve(tmpdir(), "oss-ch001-verifier-"));
  await mkdir(resolve(root, "architect/Luna_CH001_v0.1.0_Pack"), { recursive: true });
  await cp(resolve(process.cwd(), "architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md"), resolve(root, "architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md"));
  await cp(resolve(process.cwd(), "architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json"), resolve(root, "architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json"));
  await writeFile(resolve(root, "evidence.txt"), "synthetic verifier evidence\n");
  const evidence = await makeEvidenceRef(root, "evidence.txt", "E2", "unit:validator-fixture", testCommit, { reviewer: "unit-validator", inspection: "synthetic evidence fixture" });
  const allEvidence = [evidence, { ...evidence, kind: "E1" as const }, { ...evidence, kind: "E4-local" as const }, { ...evidence, kind: "VISUAL" as const }, { ...evidence, kind: "KEYBOARD" as const }];
  const commands = REQUIRED_ROOT_COMMANDS.map((command) => ({ command, startedAt: "2026-09-11T00:00:00.000Z", endedAt: "2026-09-11T00:00:01.000Z", exitCode: 0, logPath: "evidence.txt" }));
  const suites = ["integration", "e2e", "render", "smoke"].map((suite) => ({ suite, command: `pnpm test:${suite}`, run_id: "unit-run", implementation_commit: testCommit, started_at: "2026-09-11T00:00:00.000Z", ended_at: "2026-09-11T00:00:01.000Z", exit_code: 0, discovered: 2, executed: 2, passed: 2, failed: 0, skipped: 0, report_path: "evidence.txt", log_path: "evidence.txt" }));
  const artifactManifest = resolve(root, "artifact-manifest.json");
  await writeJson(artifactManifest, { implementation_commit: testCommit, files: [{ path: "evidence.txt", sha256: evidence.sha256 }] });
  const artifactRef = await makeEvidenceRef(root, "artifact-manifest.json", "E1", "unit:artifact-fixture", testCommit);
  const gates = EXPECTED_GATE_IDS.map((id) => ({ id, status: "PASS" as const, implementation_commit: testCommit, actual_evidence: allEvidence, reason: "synthetic valid fixture" }));
  const findings = Array.from({ length: 11 }, (_, index) => ({ id: `R${String(index + 1).padStart(2, "0")}`, status: "CLOSED", test_reference: "unit:validator", repair_or_disproof: "synthetic" }));
  return { root, evidence, report: { chapter: "CH-001R-r2", target_application_version: "0.1.0", report_kind: "synthetic", implementation_commit: testCommit, evidence_commit: null, generatedAt: "2026-09-11T00:00:01.000Z", commands, suites, gates, findings, artifact_manifest: artifactRef } };
}

describe("CH-001 fail-closed evidence validator", () => {
  it("accepts a complete, same-commit synthetic contract fixture", async () => {
    const { root, report } = await fixture();
    await expect(validateEvidencePackage({ root, report })).resolves.toEqual({ ok: true, errors: [] });
  });

  it.each([
    ["71 gates", (report: EvidencePackage) => { report.gates = report.gates.slice(0, 71); }],
    ["duplicate gate", (report: EvidencePackage) => { report.gates[1] = { ...report.gates[0], id: report.gates[0].id }; }],
    ["unknown gate", (report: EvidencePackage) => { report.gates[0] = { ...report.gates[0], id: "CH001-999" }; }],
    ["NOT_RUN gate", (report: EvidencePackage) => { report.gates[0] = { ...report.gates[0], status: "NOT_RUN", actual_evidence: [], reason: "not executed" }; }],
    ["zero-test suite", (report: EvidencePackage) => { report.suites[0] = { ...report.suites[0], discovered: 0, executed: 0 }; }],
    ["failing child command", (report: EvidencePackage) => { report.commands[0] = { ...report.commands[0], exitCode: 1 }; }],
    ["stale suite", (report: EvidencePackage) => { report.suites[0] = { ...report.suites[0], implementation_commit: "b".repeat(40) }; }],
    ["unclosed finding", (report: EvidencePackage) => { report.findings[0] = { ...report.findings[0], status: "OPEN" }; }],
    ["missing visual inspection", (report: EvidencePackage) => { report.gates[59] = { ...report.gates[59], actual_evidence: [report.gates[59].actual_evidence[0]] }; }],
    ["malformed report arrays", (report: EvidencePackage) => { report.commands = null as unknown as EvidencePackage["commands"]; report.suites = [null as unknown as EvidencePackage["suites"][number]]; report.gates = [null as unknown as EvidencePackage["gates"][number]]; report.findings = [null as unknown as EvidencePackage["findings"][number]]; }]
  ])("rejects %s", async (_name, mutate) => {
    const { root, report } = await fixture();
    mutate(report);
    const result = await validateEvidencePackage({ root, report });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects missing original contract, missing artifact bytes, and false checksums", async () => {
    const first = await fixture();
    await writeJson(resolve(first.root, "artifact-manifest.json"), { implementation_commit: testCommit, files: [{ path: "missing.jpg", sha256: "0".repeat(64) }] });
    first.report.artifact_manifest = await makeEvidenceRef(first.root, "artifact-manifest.json", "E1", "unit:false-artifact", testCommit);
    const missingArtifact = await validateEvidencePackage({ root: first.root, report: first.report });
    expect(missingArtifact.ok).toBe(false);
    expect(missingArtifact.errors.some((error) => /missing|checksum/i.test(error))).toBe(true);

    const missingContract = await fixture();
    await cp(resolve(missingContract.root, "architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md"), resolve(missingContract.root, "acceptance-copy.md"));
    // Removing the source is represented by a distinct empty root; the
    // validator must fail rather than treating an absent contract as zero gates.
    const emptyRoot = await mkdtemp(resolve(tmpdir(), "oss-ch001-no-contract-"));
    const result = await validateEvidencePackage({ root: emptyRoot, report: missingContract.report });
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/contract|gate template/i);
    void readFile;
  });
});
