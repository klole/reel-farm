import { cp, mkdir, readFile, symlink, writeFile } from "node:fs/promises";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { EXPECTED_GATE_IDS, REQUIRED_ROOT_COMMANDS, makeEvidenceRef, type EvidencePackage, type EvidenceRef, validateCommandRecords, validateEvidencePackage, writeJson } from "../../scripts/ch001-harness.ts";
import { serializeCommandEvidence } from "../../scripts/ch001-command-records.mjs";

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

  it("accepts r13 repeated command text when serializer and child invocations carry distinct identities", async () => {
    const { root, report } = await fixture();
    const outputs = report.commands.map((command, index) => {
      const logPath = `command-${index}.log`;
      return {
        result: {
          invocationId: `r13-invocation-${index}`,
          command: command.command,
          startedAt: `2026-09-11T00:00:${String(index).padStart(2, "0")}.000Z`,
          endedAt: `2026-09-11T00:00:${String(index).padStart(2, "0")}.500Z`,
          exitCode: 0
        },
        publicLogPath: logPath
      };
    });
    outputs.push(
      { result: { invocationId: "r13-invocation-repeat-0", command: "psql -U oss -d fixture -Atc SELECT 1", startedAt: "2026-09-11T00:01:00.000Z", endedAt: "2026-09-11T00:01:00.500Z", exitCode: 0 }, publicLogPath: "command-repeat-0.log" },
      { result: { invocationId: "r13-invocation-repeat-1", command: "psql -U oss -d fixture -Atc SELECT 1", startedAt: "2026-09-11T00:01:01.000Z", endedAt: "2026-09-11T00:01:01.500Z", exitCode: 0 }, publicLogPath: "command-repeat-1.log" }
    );
    for (const output of outputs) await writeFile(resolve(root, output.publicLogPath), `${output.result.command}\n`);
    const serialized = serializeCommandEvidence(outputs, (value) => value, { runId: "r13-unit-run", implementationCommit: testCommit });
    report.chapter = "CH-001R-r13";
    report.command_record_format = serialized.command_record_format;
    report.run_id = "r13-unit-run";
    report.commands = serialized.commands;
    report.child_invocations = serialized.child_invocations;
    const result = await validateEvidencePackage({ root, report });
    expect(result).toEqual({ ok: true, errors: [] });
  });

  it("rejects r13 duplicate/missing IDs, stale bindings, reused logs, and missing evidence", async () => {
    const { root } = await fixture();
    const outputs = [0, 1].map((index) => ({
      result: { invocationId: `r13-boundary-${index}`, command: "psql -U oss -d fixture -Atc SELECT 1", startedAt: `2026-09-11T00:00:0${index}.000Z`, endedAt: `2026-09-11T00:00:0${index}.500Z`, exitCode: 0 },
      publicLogPath: `repeat-${index}.log`
    }));
    await writeFile(resolve(root, "repeat-0.log"), "first\n");
    await writeFile(resolve(root, "repeat-1.log"), "second\n");
    const serialized = serializeCommandEvidence(outputs, (value) => value, { runId: "r13-unit-run", implementationCommit: testCommit });
    const firstCommand = serialized.commands[0];
    const secondCommand = serialized.commands[1];
    const firstChild = serialized.child_invocations[0];
    const secondChild = serialized.child_invocations[1];
    if (!firstCommand || !secondCommand || !firstChild || !secondChild) throw new Error("The repeated-command fixture was not serialized.");
    const valid = { commands: serialized.commands, childInvocations: serialized.child_invocations };
    await expect(validateCommandRecords({ root, format: "invocation-v2", ...valid, expectedCommit: testCommit, runId: "r13-unit-run" })).resolves.toEqual([]);

    const cases = [
      { name: "duplicate ID", commands: [{ ...firstCommand }, { ...secondCommand, invocationId: firstCommand.invocationId }], childInvocations: serialized.child_invocations },
      { name: "missing ID", commands: [{ ...firstCommand, invocationId: "" }, secondCommand], childInvocations: serialized.child_invocations },
      { name: "stale child binding", commands: serialized.commands, childInvocations: [{ ...firstChild, run_id: "stale-run" }, secondChild] },
      { name: "reused log", commands: [firstCommand, { ...secondCommand, logPath: firstCommand.logPath }], childInvocations: [firstChild, { ...secondChild, log_path: firstChild.log_path }] },
      { name: "missing log", commands: [{ ...firstCommand, logPath: "missing.log" }, secondCommand], childInvocations: [{ ...firstChild, log_path: "missing.log" }, secondChild] }
    ];
    for (const testCase of cases) {
      const errors = await validateCommandRecords({ root, format: "invocation-v2", commands: testCase.commands, childInvocations: testCase.childInvocations, expectedCommit: testCommit, runId: "r13-unit-run" });
      expect(errors.length, testCase.name).toBeGreaterThan(0);
    }
  });

  it("checks every matching required invocation so pass-then-fail and fail-then-pass remain blocking", async () => {
    const { root } = await fixture();
    const makeRecords = async (exits: number[]) => {
      const outputs = exits.map((exitCode, index) => ({
        result: { invocationId: `required-${index}`, command: "pnpm lint", startedAt: `2026-09-11T00:00:1${index}.000Z`, endedAt: `2026-09-11T00:00:1${index}.500Z`, exitCode },
        publicLogPath: `required-${index}.log`
      }));
      for (const output of outputs) await writeFile(resolve(root, output.publicLogPath), `${output.result.exitCode}\n`);
      return serializeCommandEvidence(outputs, (value) => value, { runId: "r13-required-run", implementationCommit: testCommit });
    };
    for (const exits of [[0, 1], [1, 0]]) {
      const serialized = await makeRecords(exits);
      const errors = await validateCommandRecords({ root, format: "invocation-v2", commands: serialized.commands, childInvocations: serialized.child_invocations, expectedCommit: testCommit, runId: "r13-required-run", requiredCommands: ["pnpm lint"] });
      expect(errors.some((error) => /pnpm lint invocation 1|pnpm lint invocation 2/.test(error) && /did not pass/.test(error))).toBe(true);
    }
  });

  it("keeps legacy duplicate-text validation explicit", async () => {
    const { root } = await fixture();
    const errors = await validateCommandRecords({
      root,
      format: "legacy-v1",
      commands: [
        { command: "same command", startedAt: "2026-09-11T00:00:00.000Z", endedAt: "2026-09-11T00:00:01.000Z", exitCode: 0, logPath: "evidence.txt" },
        { command: "same command", startedAt: "2026-09-11T00:00:02.000Z", endedAt: "2026-09-11T00:00:03.000Z", exitCode: 0, logPath: "evidence.txt" }
      ]
    });
    expect(errors).toContain("Command report contains duplicate command records.");
  });

  it("accepts an absolute inside-root writer path but rejects a symlink escape", async () => {
    const { root } = await fixture();
    const absolute = await makeEvidenceRef(root, resolve(root, "evidence.txt"), "E2", "unit:absolute-writer-path", testCommit);
    expect(absolute.path).toBe("evidence.txt");
    const outside = await mkdtemp(resolve(tmpdir(), "oss-ch001-evidence-outside-"));
    await writeFile(resolve(outside, "outside.txt"), "outside evidence\n");
    await symlink(resolve(outside, "outside.txt"), resolve(root, "escape.txt"));
    await expect(makeEvidenceRef(root, "escape.txt", "E2", "unit:symlink-escape", testCommit)).rejects.toThrow(/escaped/i);
  });

  it.each([
    ["71 gates", (report: EvidencePackage) => { report.gates = report.gates.slice(0, 71); }],
    ["duplicate gate", (report: EvidencePackage) => { const first = report.gates[0]; if (!first) throw new Error("missing gate"); report.gates[1] = { ...first, id: first.id }; }],
    ["unknown gate", (report: EvidencePackage) => { const first = report.gates[0]; if (!first) throw new Error("missing gate"); report.gates[0] = { ...first, id: "CH001-999" }; }],
    ["NOT_RUN gate", (report: EvidencePackage) => { const first = report.gates[0]; if (!first) throw new Error("missing gate"); report.gates[0] = { ...first, status: "NOT_RUN", actual_evidence: [], reason: "not executed" }; }],
    ["zero-test suite", (report: EvidencePackage) => { const first = report.suites[0]; if (!first) throw new Error("missing suite"); report.suites[0] = { ...first, discovered: 0, executed: 0 }; }],
    ["failing child command", (report: EvidencePackage) => { const first = report.commands[0]; if (!first) throw new Error("missing command"); report.commands[0] = { ...first, exitCode: 1 }; }],
    ["stale suite", (report: EvidencePackage) => { const first = report.suites[0]; if (!first) throw new Error("missing suite"); report.suites[0] = { ...first, implementation_commit: "b".repeat(40) }; }],
    ["unclosed finding", (report: EvidencePackage) => { const first = report.findings[0]; if (!first) throw new Error("missing finding"); report.findings[0] = { ...first, status: "OPEN" }; }],
    ["missing visual inspection", (report: EvidencePackage) => { const gate = report.gates[59]; if (!gate) throw new Error("missing gate"); const evidence = gate.actual_evidence[0]; if (!evidence) throw new Error("missing evidence"); report.gates[59] = { ...gate, actual_evidence: [evidence] }; }],
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
