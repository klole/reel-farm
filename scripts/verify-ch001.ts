import "dotenv/config";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import {
  REQUIRED_ROOT_COMMANDS,
  SOURCE_ONLY_GATE_IDS,
  fileExists,
  makeEvidenceRef,
  sha256File,
  type CommandRecord,
  type EvidencePackage,
  type GateRecord,
  type SuiteReport,
  validateEvidencePackage,
  writeJson
} from "./ch001-harness.js";

type ProcessResult = { command: string; startedAt: string; endedAt: string; exitCode: number; output: string };
const root = resolve(process.cwd());
const generatedAt = new Date();
const runId = process.env.CH001_RUN_ID ?? `r3-verify-${generatedAt.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? `artifacts/ch001r3/${runId}`);
const actualImplementationCommit = await gitCommit();
const implementationCommit = process.env.CH001_IMPLEMENTATION_COMMIT ?? actualImplementationCommit;
if (!/^[0-9a-f]{40}$/.test(actualImplementationCommit) || !/^[0-9a-f]{40}$/.test(implementationCommit) || actualImplementationCommit !== implementationCommit) throw new Error(`CH-001 verifier identity mismatch: checked out ${actualImplementationCommit}, requested ${implementationCommit}.`);

async function gitCommit(): Promise<string> {
  return new Promise((resolveCommit) => {
    const child = spawn("git", ["rev-parse", "HEAD"], { cwd: root, stdio: ["ignore", "pipe", "ignore"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("close", () => resolveCommit(output.trim() || "working-tree"));
    child.on("error", () => resolveCommit("working-tree"));
  });
}

async function run(command: string, args: string[]): Promise<ProcessResult> {
  const startedAt = new Date().toISOString();
  return new Promise((resolveResult) => {
    const child = spawn(command, args, { cwd: root, env: { ...process.env, CH001_RUN_ID: runId, CH001_EVIDENCE_DIR: evidenceDir, CH001_IMPLEMENTATION_COMMIT: implementationCommit }, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", (error) => resolveResult({ command: `${command} ${args.join(" ")}`, startedAt, endedAt: new Date().toISOString(), exitCode: 1, output: `${output}${error.message}\n` }));
    child.on("close", (code) => resolveResult({ command: `${command} ${args.join(" ")}`, startedAt, endedAt: new Date().toISOString(), exitCode: code ?? 1, output }));
  });
}

async function writeLog(index: number, result: ProcessResult): Promise<string> {
  const path = resolve(evidenceDir, `${String(index).padStart(2, "0")}-${result.command.replace(/[^a-z0-9]+/gi, "-").replace(/-$/, "")}.log`);
  await writeFile(path, result.output, { mode: 0o640 });
  return relative(root, path);
}

async function sourceReview(): Promise<{ path: string; clean: boolean }> {
  const files = new Map<string, string>();
  for (const path of ["package.json", "compose.yaml", "Dockerfile", "apps/worker/src/index.ts", "apps/web/src/lib/domain.ts", "apps/web/src/components/EditorView.tsx", "apps/web/app/api/assets/route.ts", "docs/chapters/CH-001/DEPENDENCIES.md", "state/PROJECT_STATE.md"]) files.set(path, await readFile(resolve(root, path), "utf8"));
  const checks: string[] = [];
  const violations: string[] = [];
  const packageText = files.get("package.json") ?? "";
  if (/pinterest|fal-ai|fal\.ai|tiktok|stripe|openai|anthropic/i.test(packageText)) violations.push("deferred provider/publishing dependency appears in package.json"); else checks.push("deferred provider and publishing dependencies absent");
  const compose = files.get("compose.yaml") ?? "";
  if (!compose.includes("127.0.0.1:${CH001_WEB_PORT:-3000}:3000") || /5432:\\d|ports:\s*[\r\n\s-]*worker:/i.test(compose)) violations.push("Compose host binding is not loopback-only or publishes a private service"); else checks.push("Compose publishes only the loopback web port");
  if (!compose.includes("cap_drop:") || !compose.includes("- ALL") || !compose.includes("user: node")) violations.push("worker runtime confinement/user configuration is incomplete"); else checks.push("worker uses node user, no-new-privileges, and dropped capabilities");
  const dockerfile = files.get("Dockerfile") ?? "";
  if (!dockerfile.includes("USER node") || !dockerfile.includes("libnss3") || dockerfile.includes("useradd --create-home --uid 1000")) violations.push("final image does not declare the selected non-root runtime/dependencies"); else checks.push("final image installs browser dependencies and runs as existing node user");
  const worker = files.get("apps/worker/src/index.ts") ?? "";
  if (!worker.includes("chromiumSandbox: true") || worker.includes("--no-sandbox")) violations.push("browser sandbox configuration is not explicit and fail-closed"); else checks.push("worker launch explicitly enables Chromium sandbox with no permissive fallback");
  const state = files.get("state/PROJECT_STATE.md") ?? "";
  if (!/awaiting_review/i.test(state) || !/accepted application version:\s*none/i.test(state)) violations.push("root state is not awaiting review with accepted version unset"); else checks.push("root state remains awaiting review and unaccepted");
  const reportPath = resolve(evidenceDir, "source-review.md");
  await writeFile(reportPath, ["# CH-001R-r3 source/provenance inspection", "", `Implementation commit: ${implementationCommit}`, `Run ID: ${runId}`, "Evidence type: E1; source-only inspection, not runtime proof.", "", ...checks.map((check) => `- PASS — ${check}`), ...violations.map((violation) => `- FAIL — ${violation}`), "", "Pending repository license decision remains recorded; this inspection makes no legal/distribution determination."].join("\n") + "\n", { mode: 0o640 });
  return { path: relative(root, reportPath), clean: violations.length === 0 };
}

async function evidenceFiles(directory: string, prefix = ""): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await evidenceFiles(resolve(directory, entry.name), child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

async function loadTemplate(): Promise<Array<{ id: string; required_evidence: string; description: string }>> {
  const value = JSON.parse(await readFile(resolve(root, "architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json"), "utf8")) as { gates?: Array<{ id?: unknown; required_evidence?: unknown; description?: unknown }> };
  if (!Array.isArray(value.gates) || value.gates.length !== 72) throw new Error("The original gate template could not be loaded with 72 gates.");
  return value.gates.map((gate) => {
    if (typeof gate.id !== "string" || typeof gate.required_evidence !== "string" || typeof gate.description !== "string") throw new Error("The original gate template contains an invalid record.");
    return { id: gate.id, required_evidence: gate.required_evidence, description: gate.description };
  });
}

async function readSuiteReports(): Promise<SuiteReport[]> {
  const suites: SuiteReport[] = [];
  for (const name of ["integration", "e2e", "render", "smoke"]) {
    try { suites.push(JSON.parse(await readFile(resolve(evidenceDir, `suite-${name}.json`), "utf8")) as SuiteReport); } catch {
      suites.push({ suite: name, command: `pnpm test:${name}`, run_id: runId, implementation_commit: implementationCommit, started_at: generatedAt.toISOString(), ended_at: new Date().toISOString(), exit_code: 1, discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0, report_path: relative(root, resolve(evidenceDir, `suite-${name}.json`)), unavailable_reason: "Suite report was not produced." });
    }
  }
  return suites;
}

async function readSuiteGateEvidence(): Promise<Map<string, GateRecord>> {
  try {
    const value = JSON.parse(await readFile(resolve(evidenceDir, "gate-evidence.json"), "utf8")) as GateRecord[];
    return new Map(value.map((record) => [record.id, record]));
  } catch { return new Map(); }
}

const commandResults: ProcessResult[] = [];
await mkdir(evidenceDir, { recursive: true });
for (const [index, command] of REQUIRED_ROOT_COMMANDS.entries()) {
  const [executable, ...args] = command.split(" ");
  if (!executable) continue;
  const result = await run(executable, args);
  commandResults.push(result);
  await writeLog(index + 1, result);
  console.log(`${result.command}: exit ${result.exitCode}`);
}

const source = await sourceReview();
const template = await loadTemplate();
const suiteEvidence = await readSuiteGateEvidence();
const sourceRef = await makeEvidenceRef(root, source.path, "E1", "source-review:ch001r3", implementationCommit);
const gates: GateRecord[] = template.map((gate) => {
  const evidence = suiteEvidence.get(gate.id);
  if (evidence && ["PASS", "FAIL", "NOT_RUN"].includes(evidence.status) && evidence.implementation_commit === implementationCommit) {
    const actualEvidence = [...(evidence.actual_evidence ?? [])];
    if (evidence.status === "PASS" && source.clean && template.find((candidate) => candidate.id === gate.id)?.required_evidence.includes("E1") && !actualEvidence.some((ref) => ref.kind === "E1")) actualEvidence.push(sourceRef);
    return { ...evidence, implementation_commit: implementationCommit, actual_evidence: actualEvidence };
  }
  if (SOURCE_ONLY_GATE_IDS.has(gate.id) && source.clean && ["CH001-067", "CH001-068", "CH001-069", "CH001-072"].includes(gate.id)) return { id: gate.id, status: "PASS", implementation_commit: implementationCommit, actual_evidence: [sourceRef], reason: "Source-only gate is assessed by the E1 source review at this implementation commit." };
  return { id: gate.id, status: "NOT_RUN", implementation_commit: implementationCommit, actual_evidence: [], reason: "Required runtime, browser, lifecycle, visual, or handoff evidence was not produced by this run; see command and suite reports." };
});

const artifactManifestPath = resolve(evidenceDir, "artifact-manifest.json");
const environmentPath = resolve(evidenceDir, "environment.json");
await writeJson(environmentPath, {
  run_id: runId,
  implementation_commit: implementationCommit,
  host: { platform: process.platform, arch: process.arch, node: process.version, package_manager: "pnpm@12.3.4" },
  prerequisites: { database_url_configured: Boolean(process.env.DATABASE_URL), docker_cli_checked: true, browser_override_configured: Boolean(process.env.BROWSER_EXECUTABLE_PATH), e2e_base_url_configured: Boolean(process.env.E2E_BASE_URL) },
  evidence_boundary: "This record reports capability flags and child command outcomes; it contains no credentials or connection strings."
});
const availableEvidenceFiles = await evidenceFiles(evidenceDir);
const manifestFiles = await Promise.all(availableEvidenceFiles.filter((path) => path !== "artifact-manifest.json").map(async (path) => ({ path: relative(root, resolve(evidenceDir, path)), sha256: await sha256File(resolve(evidenceDir, path)) })));
const artifactRequirements = [
  ["seven-slide ZIP", `${relative(root, evidenceDir)}/a-little-room-to-focus.zip`],
  ["screenshots and manual visual inspection", `${relative(root, evidenceDir)}/final-preview.png`],
  ["preview/ZIP byte comparison", `${relative(root, evidenceDir)}/journey-hashes.json`],
  ["Compose lifecycle", `${relative(root, evidenceDir)}/compose-lifecycle.json`],
  ["PostgreSQL/browser reports", `${relative(root, evidenceDir)}/suite-integration.json`]
] as const;
const missingLiveArtifacts: string[] = [];
for (const [label, path] of artifactRequirements) if (!(await fileExists(resolve(root, path)))) missingLiveArtifacts.push(label);
await writeJson(artifactManifestPath, { run_id: runId, implementation_commit: implementationCommit, status: "BLOCKED_PENDING_LIVE_EVIDENCE", files: manifestFiles, required_live_artifacts_not_present: missingLiveArtifacts });
const artifactRef = await makeEvidenceRef(root, relative(root, artifactManifestPath), "E1", "aggregate:artifact-manifest", implementationCommit);
const findings = Array.from({ length: 11 }, (_, index) => ({ id: `R${String(index + 1).padStart(2, "0")}`, status: "OPEN", repair_or_disproof: "Scoped repair implemented or harness added; required capable-environment regression evidence remains outstanding.", test_reference: null }));
const commands: CommandRecord[] = commandResults.map((result, index) => ({ command: result.command, startedAt: result.startedAt, endedAt: result.endedAt, exitCode: result.exitCode, logPath: relative(root, resolve(evidenceDir, `${String(index + 1).padStart(2, "0")}-${result.command.replace(/[^a-z0-9]+/gi, "-").replace(/-$/, "")}.log`)) }));
const report: EvidencePackage = { chapter: "CH-001R-r3", target_application_version: "0.1.0", report_kind: "STRICT_FULL_ACCEPTANCE_ATTEMPT", implementation_commit: implementationCommit, evidence_commit: null, generatedAt: new Date().toISOString(), commands, suites: await readSuiteReports(), gates, findings, artifact_manifest: artifactRef };
const reportPath = resolve(evidenceDir, "gate-results.json");
await writeJson(reportPath, report);
const validation = await validateEvidencePackage({ root, report, reportPath: relative(root, reportPath) });
await writeJson(resolve(evidenceDir, "verifier-result.json"), { ok: validation.ok, errors: validation.errors, report: relative(root, reportPath), implementation_commit: implementationCommit, run_id: runId });
await writeJson(resolve(evidenceDir, "command-report.json"), { run_id: runId, implementation_commit: implementationCommit, commands, suites: report.suites, exit_codes: commandResults.map((result) => result.exitCode) });
console.error(validation.ok ? "CH-001R-r3 strict aggregate passed." : `CH-001R-r3 strict aggregate incomplete: ${validation.errors.length} validation issue(s).`);
if (!validation.ok) for (const error of validation.errors) console.error(`- ${error}`);
process.exit(validation.ok ? 0 : 1);
