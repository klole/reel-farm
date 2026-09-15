import { createHash } from "node:crypto";
import { access, mkdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

export const REQUIRED_GATED_COMMANDS = ["integration", "e2e", "render", "smoke"] as const;
export const REQUIRED_ROOT_COMMANDS = [
  "pnpm lint",
  "pnpm typecheck",
  "pnpm build",
  "pnpm test:unit",
  "pnpm test:security",
  "pnpm test:integration",
  "pnpm test:e2e",
  "pnpm test:render",
  "pnpm test:smoke"
] as const;
export const EXPECTED_GATE_IDS = Array.from({ length: 72 }, (_, index) => `CH001-${String(index + 1).padStart(3, "0")}`);
export const SOURCE_ONLY_GATE_IDS = new Set(["CH001-067", "CH001-068", "CH001-069", "CH001-070", "CH001-072"]);

export type EvidenceKind = "E1" | "E2" | "E4-local" | "VISUAL" | "KEYBOARD";

export type EvidenceRef = {
  path: string;
  sha256: string;
  kind: EvidenceKind;
  reference: string;
  implementation_commit: string;
  reviewer?: string;
  inspection?: string;
};

export type GateRecord = {
  id: string;
  status: "PASS" | "FAIL" | "NOT_RUN";
  actual_evidence: EvidenceRef[];
  reason: string;
  implementation_commit?: string;
};

export type SuiteReport = {
  suite: string;
  command: string;
  run_id: string;
  implementation_commit: string;
  started_at: string;
  ended_at: string;
  exit_code: number;
  discovered: number;
  executed: number;
  passed: number;
  failed: number;
  skipped: number;
  report_path: string;
  log_path?: string;
  evidence_paths?: string[];
  unavailable_reason?: string;
};

export type CommandRecordFormat = "legacy-v1" | "invocation-v2";

export type CommandRecord = {
  command: string;
  startedAt: string;
  endedAt: string;
  exitCode: number;
  logPath: string;
  invocationId?: string;
  reportPath?: string;
  discovered?: number;
  executed?: number;
  passed?: number;
  failed?: number;
  skipped?: number;
};

export type ChildInvocationRecord = {
  id: string;
  command: string;
  started_at: string;
  ended_at: string;
  log_path: string;
  run_id: string;
  implementation_commit: string;
  report_path?: string;
};

export type EvidencePackage = {
  chapter: string;
  command_record_format?: CommandRecordFormat;
  run_id?: string;
  child_invocations?: ChildInvocationRecord[];
  target_application_version: string;
  report_kind: string;
  implementation_commit: string;
  evidence_commit?: string | null;
  generatedAt: string;
  commands: CommandRecord[];
  suites: SuiteReport[];
  gates: GateRecord[];
  findings: Array<{ id: string; status: string; test_reference?: string | null; repair_or_disproof?: string | null }>;
  artifact_manifest?: EvidenceRef;
};

export type ValidationResult = { ok: boolean; errors: string[] };

export async function sha256File(path: string): Promise<string> {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

export async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  const target = resolve(path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(value, null, 2) + "\n", { mode: 0o640 });
}

export async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as unknown;
}

function errorList(errors: string[]): ValidationResult {
  return { ok: errors.length === 0, errors };
}

function stringValue(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function evidenceKindsForGate(requiredEvidence: string): EvidenceKind[] {
  const kinds: EvidenceKind[] = [];
  for (const kind of ["E1", "E2", "E4-local", "VISUAL", "KEYBOARD"] as const) if (requiredEvidence.includes(kind)) kinds.push(kind);
  if (/visual/i.test(requiredEvidence) && !kinds.includes("VISUAL")) kinds.push("VISUAL");
  if (/keyboard/i.test(requiredEvidence) && !kinds.includes("KEYBOARD")) kinds.push("KEYBOARD");
  return kinds;
}

async function loadOriginalContract(root: string): Promise<{ ids: string[]; requiredEvidence: Map<string, string> }> {
  const acceptancePath = resolve(root, "architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md");
  const templatePath = resolve(root, "architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json");
  const acceptance = await readFile(acceptancePath, "utf8");
  const acceptanceIds = Array.from(new Set(acceptance.match(/CH001-\d{3}/g) ?? []));
  if (acceptanceIds.length !== 72) throw new Error(`Original acceptance contract contains ${acceptanceIds.length} unique gate IDs.`);
  const template = JSON.parse(await readFile(templatePath, "utf8")) as { gates?: Array<{ id?: unknown; required_evidence?: unknown }> };
  if (!Array.isArray(template.gates) || template.gates.length !== 72) throw new Error("Original gate template is missing or incomplete.");
  const requiredEvidence = new Map<string, string>();
  for (const gate of template.gates) {
    if (!stringValue(gate.id) || !stringValue(gate.required_evidence)) throw new Error("Original gate template contains an invalid gate record.");
    if (requiredEvidence.has(gate.id)) throw new Error(`Original gate template repeats ${gate.id}.`);
    requiredEvidence.set(gate.id, gate.required_evidence);
  }
  const expected = new Set(EXPECTED_GATE_IDS);
  if (acceptanceIds.some((id) => !expected.has(id)) || requiredEvidence.size !== expected.size || EXPECTED_GATE_IDS.some((id) => !requiredEvidence.has(id))) throw new Error("Original acceptance IDs do not match CH001-001 through CH001-072.");
  return { ids: EXPECTED_GATE_IDS, requiredEvidence };
}

async function validateEvidenceRef(root: string, ref: EvidenceRef, expectedCommit: string, errors: string[], label: string): Promise<void> {
  if (!ref || typeof ref !== "object") { errors.push(`${label} is not an evidence object.`); return; }
  const repositoryRoot = await realpath(resolve(root)).catch(() => resolve(root));
  const path = stringValue(ref.path) ? resolve(repositoryRoot, ref.path) : repositoryRoot;
  const pathRelativeToRoot = relative(repositoryRoot, path);
  if (!stringValue(ref.path) || isAbsolute(ref.path) || pathRelativeToRoot.startsWith("..") || isAbsolute(pathRelativeToRoot)) errors.push(`${label} has an invalid repository-relative path.`);
  if (!stringValue(ref.sha256) || !/^[0-9a-f]{64}$/.test(ref.sha256)) errors.push(`${label} has no valid SHA-256.`);
  if (!stringValue(ref.reference)) errors.push(`${label} has no run/test/review reference.`);
  if (ref.implementation_commit !== expectedCommit) errors.push(`${label} is bound to ${ref.implementation_commit ?? "no commit"}, expected ${expectedCommit}.`);
  if (!(await fileExists(path))) errors.push(`${label} points to missing evidence ${ref.path}.`);
  else {
    try {
      const actualPath = await realpath(path);
      const actualRelative = relative(repositoryRoot, actualPath);
      if (!actualRelative || actualRelative.startsWith("..") || isAbsolute(actualRelative)) errors.push(`${label} escapes the repository through a symlink.`);
      else if (ref.sha256 !== await sha256File(actualPath)) errors.push(`${label} checksum does not match ${ref.path}.`);
    } catch { errors.push(`${label} could not be resolved safely.`); }
  }
}

function numeric(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function recordObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function commandMatches(value: unknown, command: string): boolean {
  const record = recordObject(value);
  return typeof record?.command === "string" && (record.command === command || record.command.startsWith(`${command} `));
}

async function validateRepositoryFile(root: string, value: unknown, label: string, errors: string[]): Promise<boolean> {
  if (!stringValue(value) || isAbsolute(value)) { errors.push(`${label} has no safe repository-relative path.`); return false; }
  const repositoryRoot = await realpath(resolve(root)).catch(() => resolve(root));
  const candidate = resolve(repositoryRoot, value);
  const relativePath = relative(repositoryRoot, candidate);
  if (!relativePath || relativePath.startsWith("..") || isAbsolute(relativePath)) { errors.push(`${label} escapes the repository.`); return false; }
  const details = await stat(candidate).catch(() => null);
  if (!details?.isFile()) { errors.push(`${label} is not a retrievable file.`); return false; }
  try {
    const actual = await realpath(candidate);
    const actualRelative = relative(repositoryRoot, actual);
    if (!actualRelative || actualRelative.startsWith("..") || isAbsolute(actualRelative)) { errors.push(`${label} escapes the repository through a symlink.`); return false; }
  } catch { errors.push(`${label} could not be resolved safely.`); return false; }
  return true;
}

/**
 * Validate the command-record boundary independently of the full 72-gate
 * package. Legacy reports retain their historical duplicate-text rule; r13
 * reports use invocation identities and a child-invocation projection.
 */
export async function validateCommandRecords(input: {
  root: string;
  commands: unknown;
  format: CommandRecordFormat;
  childInvocations?: unknown;
  expectedCommit?: string;
  runId?: string;
  requiredCommands?: readonly string[];
  allowMissingRequired?: boolean;
}): Promise<string[]> {
  const errors: string[] = [];
  const commands = Array.isArray(input.commands) ? input.commands : [];
  if (!Array.isArray(input.commands)) { errors.push("Command report must contain a commands array."); return errors; }

  if (input.format === "legacy-v1") {
    const commandNames = commands.map((command) => {
      const record = recordObject(command);
      return typeof record?.command === "string" ? record.command : "";
    });
    if (commandNames.some((command) => !command)) errors.push("Command report contains a malformed command record.");
    if (new Set(commandNames).size !== commands.length) errors.push("Command report contains duplicate command records.");
    if (commands.some((command) => Object.prototype.hasOwnProperty.call(recordObject(command) ?? {}, "invocationId"))) errors.push("Legacy command records cannot contain invocation IDs without the r13 format.");
    for (const required of input.requiredCommands ?? []) {
      const command = commands.find((record) => commandMatches(record, required));
      if (!command) { if (!input.allowMissingRequired) errors.push(`Missing required command ${required}.`); continue; }
      const record = recordObject(command);
      if (!numeric(record?.exitCode) || record.exitCode !== 0) errors.push(`${required} did not pass (exit ${String(record?.exitCode)}).`);
      if (!(await validateRepositoryFile(input.root, record?.logPath, required, errors))) errors.push(`${required} has no retrievable command log.`);
    }
    return errors;
  }

  if (input.format !== "invocation-v2") { errors.push(`Unsupported command-record format ${String(input.format)}.`); return errors; }
  const invocationIds = new Set<string>();
  const publicLogPaths = new Set<string>();
  for (const [index, value] of commands.entries()) {
    const label = `Command record ${index + 1}`;
    const record = recordObject(value);
    if (!record) { errors.push(`${label} is not an object.`); continue; }
    if (!stringValue(record.invocationId)) errors.push(`${label} has no invocationId.`);
    else if (invocationIds.has(record.invocationId)) errors.push(`Duplicate invocationId ${record.invocationId}.`);
    else invocationIds.add(record.invocationId);
    if (!stringValue(record.command)) errors.push(`${label} has no command text.`);
    if (!stringValue(record.startedAt) || !stringValue(record.endedAt)) errors.push(`${label} has incomplete timestamps.`);
    if (!numeric(record.exitCode)) errors.push(`${label} has an invalid exit code.`);
    if (stringValue(record.logPath)) {
      if (publicLogPaths.has(record.logPath)) errors.push(`Command report reuses public log path ${record.logPath}.`);
      publicLogPaths.add(record.logPath);
    }
    await validateRepositoryFile(input.root, record.logPath, `${label} log`, errors);
    if (record.reportPath !== undefined) await validateRepositoryFile(input.root, record.reportPath, `${label} report`, errors);
  }

  const childValues = input.childInvocations;
  if (!Array.isArray(childValues)) {
    errors.push("Invocation-v2 command reports must contain child_invocations.");
  } else {
    if (childValues.length !== commands.length) errors.push("child_invocations does not contain one record for every command.");
    const childIds = new Set<string>();
    const childById = new Map<string, Record<string, unknown>>();
    const childLogPaths = new Set<string>();
    for (const [index, value] of childValues.entries()) {
      const label = `Child invocation ${index + 1}`;
      const child = recordObject(value);
      if (!child) { errors.push(`${label} is not an object.`); continue; }
      if (!stringValue(child.id)) errors.push(`${label} has no id.`);
      else if (childIds.has(child.id)) errors.push(`Duplicate child invocation id ${child.id}.`);
      else { childIds.add(child.id); childById.set(child.id, child); }
      if (!stringValue(child.command) || !stringValue(child.started_at) || !stringValue(child.ended_at)) errors.push(`${label} has incomplete captured command fields.`);
      if (input.runId !== undefined && child.run_id !== input.runId) errors.push(`${label} has a stale run binding.`);
      if (input.expectedCommit !== undefined && child.implementation_commit !== input.expectedCommit) errors.push(`${label} has a stale implementation binding.`);
      if (stringValue(child.log_path)) {
        if (childLogPaths.has(child.log_path)) errors.push(`Child invocations reuse public log path ${child.log_path}.`);
        childLogPaths.add(child.log_path);
      }
      await validateRepositoryFile(input.root, child.log_path, `${label} log`, errors);
      if (child.report_path !== undefined) await validateRepositoryFile(input.root, child.report_path, `${label} report`, errors);
    }
    for (const [index, value] of commands.entries()) {
      const record = recordObject(value);
      if (!record) { errors.push(`Command record ${index + 1} has no matching child invocation.`); continue; }
      const id = record?.invocationId;
      const child = typeof id === "string" ? childById.get(id) : undefined;
      if (!child) { errors.push(`Command record ${index + 1} has no matching child invocation.`); continue; }
      if (child.command !== record.command || child.started_at !== record.startedAt || child.ended_at !== record.endedAt || child.log_path !== record.logPath || child.report_path !== record.reportPath) errors.push(`Invocation ${id} disagrees with its serialized command record.`);
    }
    for (const id of childIds) if (!invocationIds.has(id)) errors.push(`Child invocation ${id} has no serialized command record.`);
  }

  for (const required of input.requiredCommands ?? []) {
    const matches = commands.filter((record) => commandMatches(record, required));
    if (matches.length === 0) { if (!input.allowMissingRequired) errors.push(`Missing required command ${required}.`); continue; }
    for (const [index, value] of matches.entries()) {
      const record = recordObject(value);
      if (!numeric(record?.exitCode) || record.exitCode !== 0) errors.push(`${required} invocation ${index + 1} did not pass (exit ${String(record?.exitCode)}).`);
      if (!(await validateRepositoryFile(input.root, record?.logPath, `${required} invocation ${index + 1}`, errors))) errors.push(`${required} invocation ${index + 1} has no retrievable command log.`);
    }
  }
  return errors;
}

export async function validateEvidencePackage(input: { root: string; report: EvidencePackage; reportPath?: string; requireCompleted?: boolean }): Promise<ValidationResult> {
  const errors: string[] = [];
  const reportValue: unknown = input?.report;
  const report = reportValue && typeof reportValue === "object" ? reportValue as Partial<EvidencePackage> : {};
  const commands = Array.isArray(report.commands) ? report.commands : [];
  const suites = Array.isArray(report.suites) ? report.suites : [];
  const gatesInput = Array.isArray(report.gates) ? report.gates : [];
  const findings = Array.isArray(report.findings) ? report.findings : [];
  if (!Array.isArray(report.commands)) errors.push("Command report must contain a commands array.");
  if (!Array.isArray(report.suites)) errors.push("Command report must contain a suites array.");
  if (!Array.isArray(report.gates)) errors.push("Gate report must contain a gates array.");
  if (!Array.isArray(report.findings)) errors.push("Finding disposition report must contain a findings array.");
  let contract: { ids: string[]; requiredEvidence: Map<string, string> };
  try { contract = await loadOriginalContract(input.root); } catch (error) { return { ok: false, errors: [error instanceof Error ? error.message : "Original acceptance contract could not be loaded."] }; }

  const r13Report = report.chapter === "CH-001R-r13";
  if (!(report.chapter === "CH-001R-r2" || report.chapter === "CH-001R-r3" || report.chapter === "CH-001R-r11" || report.chapter === "CH-001R-r12" || r13Report) || report.target_application_version !== "0.1.0") errors.push("Report is not for CH-001R-r2, CH-001R-r3, CH-001R-r11, CH-001R-r12, or CH-001R-r13 / v0.1.0.");
  if (!stringValue(report.implementation_commit) || !/^[0-9a-f]{40}$/.test(report.implementation_commit)) errors.push("Report has no full implementation commit.");
  const expectedCommit = stringValue(report.implementation_commit) ? report.implementation_commit : "";
  const boundedProof = report.report_kind === "BOUNDED_LIVE_PROOF_NOT_FULL_ACCEPTANCE";
  if (r13Report && report.command_record_format !== "invocation-v2") errors.push("CH-001R-r13 must declare command_record_format invocation-v2.");
  if (!r13Report && report.command_record_format === "invocation-v2") errors.push("Invocation-v2 command records are admitted only for CH-001R-r13.");
  if (!r13Report && Array.isArray(report.child_invocations)) errors.push("Legacy reports cannot carry child_invocations without the r13 format.");
  if (r13Report && !stringValue(report.run_id)) errors.push("CH-001R-r13 must contain a run_id for invocation binding.");
  const commandValidationInput = { root: input.root, commands, format: r13Report ? "invocation-v2" as const : "legacy-v1" as const, expectedCommit, requiredCommands: REQUIRED_ROOT_COMMANDS, allowMissingRequired: boundedProof, ...(report.child_invocations !== undefined ? { childInvocations: report.child_invocations } : {}), ...(report.run_id !== undefined ? { runId: report.run_id } : {}) };
  errors.push(...await validateCommandRecords(commandValidationInput));
  for (const suiteName of REQUIRED_GATED_COMMANDS) {
    const suite = suites.find((candidate) => candidate && typeof candidate === "object" && candidate.suite === suiteName);
    if (!suite) { errors.push(`Missing ${suiteName} suite report.`); continue; }
    if (suite.implementation_commit !== expectedCommit) errors.push(`${suiteName} report is stale.`);
    if (suite.exit_code !== 0) errors.push(`${suiteName} suite did not pass (exit ${suite.exit_code}).`);
    if (!numeric(suite.discovered) || suite.discovered < 1 || !numeric(suite.executed) || suite.executed < 1) errors.push(`${suiteName} did not discover and execute assertions.`);
    if (!numeric(suite.failed) || suite.failed > 0 || !numeric(suite.skipped) || suite.skipped > 0) errors.push(`${suiteName} has failed or skipped tests.`);
    if (!stringValue(suite.report_path) || !(await fileExists(resolve(input.root, suite.report_path)))) errors.push(`${suiteName} report is missing.`);
    if (!stringValue(suite.log_path) || !(await fileExists(resolve(input.root, suite.log_path)))) errors.push(`${suiteName} log is not retrievable.`);
  }

  if (gatesInput.length !== contract.ids.length) errors.push(`Gate report must contain exactly ${contract.ids.length} records.`);
  const gateMap = new Map<string, GateRecord>();
  for (const gateValue of gatesInput) {
    if (!gateValue || typeof gateValue !== "object") { errors.push("Gate record is not an object."); continue; }
    const gate = gateValue as GateRecord;
    if (!stringValue(gate.id)) { errors.push("Gate record has no ID."); continue; }
    if (gateMap.has(gate.id)) errors.push(`Duplicate gate ${gate.id}.`);
    gateMap.set(gate.id, gate);
    if (!contract.requiredEvidence.has(gate.id)) errors.push(`Unknown gate ${gate.id}.`);
    if (!["PASS", "FAIL", "NOT_RUN"].includes(gate.status)) errors.push(`Gate ${gate.id} has invalid status.`);
    if (gate.status === "PASS") {
      if (gate.implementation_commit !== expectedCommit) errors.push(`Gate ${gate.id} is bound to the wrong implementation.`);
      const evidenceRefs = Array.isArray(gate.actual_evidence) ? gate.actual_evidence : [];
      if (!Array.isArray(gate.actual_evidence)) errors.push(`Gate ${gate.id} has no actual_evidence array.`);
      const requiredKinds = evidenceKindsForGate(contract.requiredEvidence.get(gate.id) ?? "");
      for (const requiredKind of requiredKinds) if (!evidenceRefs.some((ref) => ref && typeof ref === "object" && ref.kind === requiredKind)) errors.push(`Gate ${gate.id} is missing ${requiredKind} evidence.`);
      for (const [index, ref] of evidenceRefs.entries()) await validateEvidenceRef(input.root, ref, expectedCommit, errors, `Gate ${gate.id} evidence ${index + 1}`);
      const requiredEvidence = contract.requiredEvidence.get(gate.id) ?? "";
      if ((requiredKinds.includes("VISUAL") || requiredKinds.includes("KEYBOARD") || /manual|review/i.test(requiredEvidence)) && evidenceRefs.every((ref) => !ref || !ref.reviewer || !ref.inspection)) errors.push(`Gate ${gate.id} has no named manual inspection.`);
    }
    if (gate.status === "NOT_RUN" && !stringValue(gate.reason)) errors.push(`Gate ${gate.id} has no NOT_RUN reason.`);
  }
  for (const id of contract.ids) if (!gateMap.has(id)) errors.push(`Missing gate ${id}.`);

  const artifactManifest = report.artifact_manifest;
  if (!artifactManifest || typeof artifactManifest !== "object") errors.push("Artifact manifest is missing.");
  else {
    await validateEvidenceRef(input.root, artifactManifest, expectedCommit, errors, "Artifact manifest");
    try {
      if (!stringValue(artifactManifest.path)) throw new Error("Artifact manifest has no path.");
      const manifest = await readJson(resolve(input.root, artifactManifest.path)) as { files?: unknown };
      if (!Array.isArray(manifest.files) || manifest.files.length === 0) errors.push("Artifact manifest has no retrievable files.");
      else for (const [index, file] of manifest.files.entries()) {
        const candidate = file && typeof file === "object" ? file as { path?: unknown; sha256?: unknown } : {};
        if (!stringValue(candidate.path) || !stringValue(candidate.sha256) || !/^[0-9a-f]{64}$/.test(candidate.sha256)) { errors.push(`Artifact manifest file ${index + 1} is malformed.`); continue; }
        const path = resolve(input.root, candidate.path);
        const pathRelativeToRoot = relative(resolve(input.root), path);
        if (isAbsolute(candidate.path) || pathRelativeToRoot.startsWith("..") || isAbsolute(pathRelativeToRoot)) { errors.push(`Artifact manifest file ${candidate.path} escapes the repository.`); continue; }
        if (!(await fileExists(path))) errors.push(`Artifact manifest file is missing: ${candidate.path}.`);
        else if (candidate.sha256 !== await sha256File(path)) errors.push(`Artifact manifest checksum does not match ${candidate.path}.`);
      }
    } catch { errors.push("Artifact manifest could not be read as JSON."); }
  }
  if (findings.length !== 11) errors.push("Finding disposition report must contain R01-R11.");
  const findingIds = new Set(findings.map((finding) => finding && typeof finding === "object" ? finding.id : ""));
  for (const id of Array.from({ length: 11 }, (_, index) => `R${String(index + 1).padStart(2, "0")}`)) {
    const finding = findings.find((candidate) => candidate && typeof candidate === "object" && candidate.id === id);
    if (!finding) errors.push(`Missing finding ${id}.`);
    else if (input.requireCompleted !== false && !["CLOSED", "DISPROVED"].includes(finding.status)) errors.push(`Finding ${id} is not closed.`);
  }
  if (findingIds.size !== findings.length) errors.push("Finding disposition report contains duplicate IDs.");

  const allGatesPass = contract.ids.every((id) => gateMap.get(id)?.status === "PASS");
  if (!allGatesPass) errors.push("Every mandatory gate must be PASS before the aggregate can pass.");
  if (input.requireCompleted !== false && errors.length > 0) return errorList(errors);
  return errorList(errors);
}

export async function makeEvidenceRef(root: string, path: string, kind: EvidenceKind, reference: string, implementationCommit: string, extras: Partial<Pick<EvidenceRef, "reviewer" | "inspection">> = {}): Promise<EvidenceRef> {
  const repositoryRoot = await realpath(resolve(root)).catch(() => resolve(root));
  // Callers may naturally have an absolute path (for example, a Playwright
  // screenshot target). Normalize it here, once, after resolving symlinks, so
  // every persisted reference still obeys the repository-relative contract.
  const absolute = isAbsolute(path) ? resolve(path) : resolve(repositoryRoot, path);
  const details = await stat(absolute).catch(() => { throw new Error(`Evidence path does not exist: ${path}`); });
  if (!details.isFile()) throw new Error(`Evidence path is not a file: ${path}`);
  const actual = await realpath(absolute);
  const pathRelativeToRoot = relative(repositoryRoot, actual);
  if (!pathRelativeToRoot || pathRelativeToRoot.startsWith("..") || isAbsolute(pathRelativeToRoot)) throw new Error(`Evidence path escaped the repository: ${path}`);
  return { path: pathRelativeToRoot, sha256: await sha256File(actual), kind, reference, implementation_commit: implementationCommit, ...extras };
}
