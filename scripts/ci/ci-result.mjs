#!/usr/bin/env node
/* global process, console */

import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PHASE = "CH-001R-r4";
const REPOSITORY = "klole/reel-farm";
const BOOTSTRAP_STAGES = new Set(["ci-helper-regressions", "native-pnpm-bootstrap", "project-install", "browser-install"]);
const EXPECTED_STAGES = [
  ["source-checkout", true],
  ["source-identity", true],
  ["node-setup", true],
  ["ci-helper-regressions", true],
  ["native-pnpm-bootstrap", true],
  ["project-install", true],
  ["browser-install", true],
  ["sandbox-qualification", false],
  ["docker-preflight", false],
  ["bounded-proof", false],
  ["sandbox-cleanup", false]
];

function now() { return new Date().toISOString(); }

function safeText(value, fallback = null) {
  if (value === null || value === undefined) return fallback;
  const text = String(value);
  return text.length > 0 ? text : fallback;
}

function safeSha(value) {
  return typeof value === "string" && /^[0-9a-f]{40}$/.test(value) ? value : null;
}

function safeInteger(value) {
  const parsed = typeof value === "number" ? value : typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function exitCode(value) {
  if (value === null || value === undefined || value === "" || value === "null") return null;
  const parsed = typeof value === "number" ? value : /^\d+$/.test(String(value)) ? Number(value) : NaN;
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

export function sanitizeDiagnostic(value) {
  const text = [...String(value)].filter((character) => {
    const code = character.charCodeAt(0);
    return !(code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127);
  }).join("");
  return text
    .replace(/(?:postgres(?:ql)?:\/\/)[^\s"'`]+/gi, "postgres://<redacted>")
    .replace(/\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_-]+/g, "<redacted-token>")
    .replace(/(authorization\s*[:=]\s*bearer\s+)[^\s]+/gi, "$1<redacted>")
    .replace(/((?:password|passwd|secret|token|cookie)\s*[:=]\s*)[^\s,;]+/gi, "$1<redacted>")
    .slice(-6_000);
}

function display(value, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function markdownCode(value, fallback = "unknown") {
  return display(value, fallback).replaceAll("\\", "\\\\").replaceAll("`", "\\`");
}

export function formatSummary(values = {}) {
  const report = values.report ?? values;
  const result = values.result ?? {};
  const proofExit = report.proof_exit_code === null || report.proof_exit_code === undefined ? "not-run" : report.proof_exit_code;
  const lines = [
    "## CH-001R-r4 bounded CI proof",
    "",
    `Implementation: \`${markdownCode(report.requested_implementation_sha)}\``,
    `Actual checkout: \`${markdownCode(report.actual_checkout_sha)}\``,
    `Workflow definition: \`${markdownCode(report.workflow_definition_sha)}\``,
    `Workflow blob: \`${markdownCode(report.workflow_blob_sha)}\``,
    `Run: \`${markdownCode(report.run_id)}\` attempt \`${markdownCode(report.run_attempt)}\``,
    `Bootstrap status: \`${markdownCode(report.bootstrap_status)}\``,
    `Sandbox qualification: \`${markdownCode(report.stages?.find((stage) => stage.name === "sandbox-qualification")?.status, "not-run")}\``,
    `Sandbox cleanup: \`${markdownCode(report.stages?.find((stage) => stage.name === "sandbox-cleanup")?.status, "not-run")}\``,
    `Proof invoked: \`${markdownCode(report.proof_invoked, "false")}\``,
    `Coordinator exit: \`${markdownCode(proofExit)}\``,
    `Final classification: \`${markdownCode(result.classification ?? report.classification)}\``,
    "Application acceptance: `false`",
    "Scope excludes providers, publishing, release, and v0.2."
  ];
  return `${lines.join("\n")}\n`;
}

function stageClassification(name, detailClassification = null) {
  if (detailClassification === "BLOCKED_DEPENDENCY_COMPATIBILITY") return detailClassification;
  if (name === "sandbox-qualification") return "BLOCKED_ENVIRONMENT";
  if (name === "sandbox-cleanup") return "SANDBOX_CLEANUP_FAILURE";
  if (name === "docker-preflight") return "DOCKER_PREREQUISITE_UNAVAILABLE";
  if (name === "bounded-proof") return "LIVE_PROOF_FAILED";
  return "CI_BOOTSTRAP_FAILURE";
}

function logClassification(log) {
  if (/ERR_PNPM_(?:BAD_PM_VERSION|LOCKFILE|OUTDATED_LOCKFILE|FROZEN_LOCKFILE|UNSUPPORTED_ENGINE)|unsupported engine|requires a different node(?:\.js)? version|lockfile[^\n]*(?:outdated|missing|incompatible)/i.test(log)) return "BLOCKED_DEPENDENCY_COMPATIBILITY";
  return null;
}

function stageStatus(value, code) {
  if (value === "PASS" || value === "FAIL" || value === "NOT_RUN") return value;
  if (value === "success" || code === 0) return "PASS";
  if (value === "skipped" || value === "cancelled") return "NOT_RUN";
  return "FAIL";
}

function repositoryName() {
  const value = process.env.GITHUB_REPOSITORY ?? REPOSITORY;
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value) ? value : REPOSITORY;
}

export function makeInitialReport(environment = process.env) {
  const runId = safeInteger(environment.GITHUB_RUN_ID);
  const attempt = safeInteger(environment.GITHUB_RUN_ATTEMPT) ?? 1;
  const workflowSha = safeSha(environment.CH001_WORKFLOW_SHA ?? environment.GITHUB_WORKFLOW_SHA);
  return {
    schema_version: 1,
    record_kind: "CI_BOOTSTRAP_OBSERVATION",
    phase: PHASE,
    repository: repositoryName(),
    run_id: runId,
    run_attempt: attempt,
    run_key: safeText(environment.CH001_RUN_ID),
    requested_implementation_sha: safeSha(environment.REQUESTED_SHA),
    actual_checkout_sha: safeSha(environment.CH001_IMPLEMENTATION_COMMIT),
    workflow_definition_sha: workflowSha,
    workflow_blob_sha: safeSha(environment.CH001_WORKFLOW_BLOB_SHA),
    workflow_file_sha256: typeof environment.CH001_WORKFLOW_FILE_SHA256 === "string" && /^[0-9a-f]{64}$/.test(environment.CH001_WORKFLOW_FILE_SHA256) ? environment.CH001_WORKFLOW_FILE_SHA256 : null,
    bootstrap_status: "NOT_RUN",
    failed_stage: null,
    bootstrap_exit_code: null,
    proof_invoked: false,
    proof_exit_code: null,
    proof_report_path: safeText(environment.CI_PROOF_REPORT),
    proof_report_validation: null,
    application_acceptance: false,
    accepted_application_version: "none",
    error_classification: null,
    error: null,
    runtime: {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      pnpm_path: null,
      pnpm_version: null,
      lockfile_sha256_before: null,
      lockfile_sha256_after: null
    },
    stages: [],
    artifact_delivery: {
      status: "PENDING",
      artifact_id: null,
      artifact_name: null,
      artifact_digest: null,
      artifact_url: null,
      recorded_at: null
    },
    summary_exit_code: null,
    started_at: now(),
    ended_at: null
  };
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  const output = resolve(path);
  await mkdir(dirname(output), { recursive: true });
  const temporary = resolve(dirname(output), `.${basename(output)}.${process.pid}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o640 });
  await rename(temporary, output);
}

function reportPathFromArgs(options) {
  const path = options.report ?? process.env.CI_BOOTSTRAP_REPORT;
  if (!path) throw new Error("A bootstrap report path is required.");
  return resolve(path);
}

function currentStage(report, name) {
  return report.stages.find((stage) => stage.name === name);
}

function updateBootstrapState(report) {
  const failed = report.stages.find((stage) => stage.blocking !== false && stage.status === "FAIL");
  const bootstrapStages = report.stages.filter((stage) => BOOTSTRAP_STAGES.has(stage.name));
  report.bootstrap_status = failed ? "FAIL" : bootstrapStages.some((stage) => stage.status === "PASS") ? "PASS" : "NOT_RUN";
  report.failed_stage = failed?.name ?? null;
  report.bootstrap_exit_code = failed ? failed.exit_code : null;
  report.error_classification = failed ? failed.error_classification : null;
  report.error = failed ? failed.error : null;
  return report;
}

function safeDetail(detail) {
  if (!detail || typeof detail !== "object" || Array.isArray(detail)) return null;
  const value = detail;
  return {
    status: safeText(value.status),
    error_classification: safeText(value.error_classification),
    error: value.error ? sanitizeDiagnostic(value.error) : null,
    target: safeText(value.target),
    version: safeText(value.version),
    archive: safeText(value.archive),
    archive_sha256: /^[0-9a-f]{64}$/.test(String(value.archive_sha256 ?? "")) ? value.archive_sha256 : null,
    executable: safeText(value.executable),
    executable_version: safeText(value.executable_version),
    bin_dir: safeText(value.bin_dir),
    path_updated: typeof value.path_updated === "boolean" ? value.path_updated : null,
    selected_executable: value.selected_executable && typeof value.selected_executable === "object" ? {
      path: safeText(value.selected_executable.path),
      sha256: /^[0-9a-f]{64}$/.test(String(value.selected_executable.sha256 ?? "")) ? value.selected_executable.sha256 : null,
      revision: safeText(value.selected_executable.revision),
      mode: safeText(value.selected_executable.mode),
      uid: safeInteger(value.selected_executable.uid),
      gid: safeInteger(value.selected_executable.gid)
    } : null,
    policy_decision: safeText(value.policy?.decision),
    policy_loaded: typeof value.policy?.loaded === "boolean" ? value.policy.loaded : null,
    sandbox_requested: typeof value.default_probe?.sandbox_requested === "boolean" ? value.default_probe.sandbox_requested : null,
    sandbox_observed: typeof value.qualified_probe?.sandbox_observed === "boolean" ? value.qualified_probe.sandbox_observed : null,
    cleanup_status: safeText(value.cleanup?.status),
    owned_resources_removed: typeof value.cleanup?.owned_resources_removed === "boolean" ? value.cleanup.owned_resources_removed : null
  };
}

function parseMetadata(values) {
  const metadata = {};
  for (const value of values) {
    const separator = value.indexOf("=");
    if (separator <= 0) continue;
    const key = value.slice(0, separator);
    if (!/^[a-z][a-z0-9_]{0,63}$/.test(key)) continue;
    metadata[key] = sanitizeDiagnostic(value.slice(separator + 1));
  }
  return metadata;
}

function logPath(reportPath, name) {
  const slug = name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "stage";
  return resolve(dirname(reportPath), "commands", `${slug}.log`);
}

async function detailForStage(options) {
  let detail = null;
  if (options.detailFile) {
    try { detail = safeDetail(await readJson(resolve(options.detailFile))); }
    catch { detail = null; }
  }
  let log = null;
  if (options.logFile) {
    try { log = sanitizeDiagnostic(await readFile(resolve(options.logFile), "utf8")); }
    catch { log = null; }
  }
  return { detail, log };
}

async function recordStage(options) {
  const reportPath = reportPathFromArgs(options);
  const report = await readJson(reportPath);
  const code = exitCode(options.exit_code);
  const status = stageStatus(options.status, code);
  const { detail, log } = await detailForStage({ detailFile: options.detail_file, logFile: options.log_file });
  const classification = status === "FAIL" ? stageClassification(options.name, detail?.error_classification ?? logClassification(log ?? "")) : null;
  const stage = {
    name: options.name,
    status,
    blocking: options.blocking !== "false",
    started_at: safeText(options.started_at, now()),
    ended_at: now(),
    exit_code: status === "NOT_RUN" ? null : code ?? (status === "PASS" ? 0 : 1),
    error_classification: classification,
    error: status === "FAIL" ? detail?.error ?? (log ? log.slice(-2_000) : `Stage ${options.name} failed.`) : null,
    log_path: log ? relative(process.cwd(), logPath(reportPath, options.name)) : null,
    metadata: { ...parseMetadata(options.metadata ?? []), ...(detail ? { bootstrap_attestation: detail } : {}) }
  };
  const existingIndex = report.stages.findIndex((entry) => entry.name === options.name);
  if (existingIndex >= 0) report.stages[existingIndex] = stage;
  else report.stages.push(stage);
  if (log) await writeFile(logPath(reportPath, options.name), `${log}\n`, { mode: 0o640 }).then(undefined, async () => { await mkdir(dirname(logPath(reportPath, options.name)), { recursive: true }); await writeFile(logPath(reportPath, options.name), `${log}\n`, { mode: 0o640 }); });
  if (options.name === "bounded-proof") {
    report.proof_invoked = options.proof_invoked === "true" || report.proof_invoked;
    report.proof_exit_code = report.proof_invoked ? code : null;
    report.proof_report_path = safeText(options.proof_report, report.proof_report_path);
  }
  const metadata = parseMetadata(options.metadata ?? []);
  if (metadata.pnpm_path) report.runtime.pnpm_path = metadata.pnpm_path;
  if (metadata.pnpm_version) report.runtime.pnpm_version = metadata.pnpm_version;
  if (metadata.node_version) report.runtime.node_version = metadata.node_version;
  if (metadata.lockfile_sha_before) report.runtime.lockfile_sha256_before = /^[0-9a-f]{64}$/.test(metadata.lockfile_sha_before) ? metadata.lockfile_sha_before : null;
  if (metadata.lockfile_sha_after) report.runtime.lockfile_sha256_after = /^[0-9a-f]{64}$/.test(metadata.lockfile_sha_after) ? metadata.lockfile_sha_after : null;
  updateBootstrapState(report);
  await writeJson(reportPath, report);
  await writeCiResult(reportPath, report);
}

function outcomeStatus(value) {
  if (value === "success") return "PASS";
  if (value === "skipped") return "NOT_RUN";
  if (value === "failure" || value === "cancelled") return "FAIL";
  return null;
}

async function captureRunnerOutcomes(options) {
  const reportPath = reportPathFromArgs(options);
  const report = await readJson(reportPath);
  const mappings = [
    ["CI_CHECKOUT_OUTCOME", "source-checkout", true],
    ["CI_IDENTITY_OUTCOME", "source-identity", true],
    ["CI_NODE_SETUP_OUTCOME", "node-setup", true],
    ["CI_HELPER_TESTS_OUTCOME", "ci-helper-regressions", true],
    ["CI_NATIVE_BOOTSTRAP_OUTCOME", "native-pnpm-bootstrap", true],
    ["CI_PROJECT_INSTALL_OUTCOME", "project-install", true],
    ["CI_BROWSER_INSTALL_OUTCOME", "browser-install", true],
    ["CI_SANDBOX_QUALIFICATION_OUTCOME", "sandbox-qualification", false],
    ["CI_DOCKER_PROBE_OUTCOME", "docker-preflight", false],
    ["CI_PROOF_OUTCOME", "bounded-proof", false],
    ["CI_SANDBOX_CLEANUP_OUTCOME", "sandbox-cleanup", false]
  ];
  for (const [environmentKey, name, blocking] of mappings) {
    const status = outcomeStatus(process.env[environmentKey]);
    if (!status || currentStage(report, name)) continue;
    report.stages.push({ name, status, blocking, started_at: report.started_at, ended_at: now(), exit_code: status === "PASS" ? 0 : status === "FAIL" ? 1 : null, error_classification: status === "FAIL" ? stageClassification(name) : null, error: status === "FAIL" ? `${name} action ended with ${process.env[environmentKey]}.` : null, log_path: null, metadata: {} });
  }
  updateBootstrapState(report);
  await writeJson(reportPath, report);
  await writeCiResult(reportPath, report);
}

function expectedIdentity(report) {
  return { runKey: report.run_key, implementation: report.actual_checkout_sha ?? report.requested_implementation_sha };
}

export function validateProofReport(proofReport, identity) {
  const errors = [];
  if (!proofReport || typeof proofReport !== "object" || Array.isArray(proofReport)) return { ok: false, errors: ["proof-result.json is missing or not an object."] };
  if (proofReport.run_id !== identity.runKey) errors.push(`proof run_id ${display(proofReport.run_id)} does not match ${display(identity.runKey)}.`);
  if (proofReport.implementation_commit !== identity.implementation) errors.push("proof implementation_commit does not match the checked-out implementation.");
  if (proofReport.application_acceptance !== false) errors.push("proof report must keep application_acceptance=false.");
  if (proofReport.accepted_application_version !== "none") errors.push("proof report must keep accepted_application_version=none.");
  if (proofReport.exit_code !== 0) errors.push("proof report is not an exit-0 bounded result.");
  if (typeof proofReport.status !== "string" || proofReport.status !== "LIVE_PROOF_READY_FOR_REVIEW") errors.push("proof report status is not LIVE_PROOF_READY_FOR_REVIEW.");
  if (!Array.isArray(proofReport.required_live_artifacts)) errors.push("proof report is missing required_live_artifacts.");
  if (typeof proofReport.evidence_root !== "string" || proofReport.evidence_root.length === 0) errors.push("proof report is missing evidence_root.");
  return { ok: errors.length === 0, errors };
}

function failedBlockingStage(report) {
  return report.stages.find((stage) => stage.blocking !== false && stage.status === "FAIL") ?? null;
}

export function classifyResult({ report, proofReport = null } = {}) {
  const failedStage = failedBlockingStage(report);
  const secondaryFailures = [];
  let classification;
  let primaryStage = failedStage?.name ?? null;
  let finalExit = failedStage?.exit_code && failedStage.exit_code > 0 ? failedStage.exit_code : failedStage ? 1 : 0;
  let proofValidation = null;
  const sandboxQualification = currentStage(report, "sandbox-qualification");
  const sandboxCleanup = currentStage(report, "sandbox-cleanup");

  if (failedStage) {
    classification = failedStage.error_classification === "BLOCKED_DEPENDENCY_COMPATIBILITY" ? "BLOCKED_DEPENDENCY_COMPATIBILITY" : "CI_BOOTSTRAP_FAILURE";
  } else if (sandboxQualification?.status === "FAIL") {
    classification = "BLOCKED_ENVIRONMENT";
    primaryStage = "sandbox-qualification";
    finalExit = 2;
  } else if (!report.proof_invoked) {
    classification = "CI_BOOTSTRAP_FAILURE";
    primaryStage = "bounded-proof";
    finalExit = 1;
  } else if (report.proof_exit_code === 2) {
    classification = "BLOCKED_ENVIRONMENT";
    primaryStage = "bounded-proof";
    finalExit = 2;
  } else if (report.proof_exit_code === 1) {
    classification = "LIVE_PROOF_FAILED";
    primaryStage = "bounded-proof";
    finalExit = 1;
  } else if (report.proof_exit_code !== 0) {
    classification = "EVIDENCE_INVALID";
    primaryStage = "bounded-proof";
    finalExit = 1;
  } else {
    proofValidation = validateProofReport(proofReport, expectedIdentity(report));
    const dockerStage = currentStage(report, "docker-preflight");
    if (dockerStage?.status === "FAIL") {
      classification = "BLOCKED_ENVIRONMENT";
      primaryStage = "docker-preflight";
      finalExit = 2;
    } else if (!proofValidation.ok) {
      classification = "EVIDENCE_INVALID";
      primaryStage = "bounded-proof";
      finalExit = 1;
    } else if (report.artifact_delivery?.status !== "PASS") {
      classification = "ARTIFACT_DELIVERY_FAILURE";
      primaryStage = "artifact-delivery";
      finalExit = 1;
    } else {
      classification = "LIVE_PROOF_READY_FOR_REVIEW";
      finalExit = 0;
    }
  }

  if (report.artifact_delivery?.status === "FAIL" && classification !== "ARTIFACT_DELIVERY_FAILURE") secondaryFailures.push("ARTIFACT_DELIVERY_FAILURE");
  if (sandboxCleanup?.status === "FAIL") {
    if (classification === "LIVE_PROOF_READY_FOR_REVIEW") {
      classification = "SANDBOX_CLEANUP_FAILURE";
      primaryStage = "sandbox-cleanup";
      finalExit = 1;
    } else secondaryFailures.push("SANDBOX_CLEANUP_FAILURE");
  }
  if (report.summary_exit_code !== null && report.summary_exit_code !== undefined && report.summary_exit_code !== 0) {
    secondaryFailures.push("CI_REPORTING_FAILURE");
    if (classification === "LIVE_PROOF_READY_FOR_REVIEW") {
      classification = "CI_REPORTING_FAILURE";
      primaryStage = "summary";
      finalExit = 1;
    }
  }
  return { classification, final_exit_code: finalExit, primary_stage: primaryStage, proof_validation: proofValidation, secondary_failures: secondaryFailures, application_acceptance: false, accepted_application_version: "none" };
}

async function loadProofReport(report) {
  if (!report.proof_report_path) return null;
  try { return await readJson(resolve(report.proof_report_path)); }
  catch { return null; }
}

async function writeCiResult(reportPath, report) {
  const proofReport = await loadProofReport(report);
  const classification = classifyResult({ report, proofReport });
  report.proof_report_validation = classification.proof_validation;
  await writeJson(reportPath, report);
  const outputPath = resolve(dirname(reportPath), "ci-result.json");
  const result = {
    schema_version: 1,
    record_kind: "CI_RESULT",
    phase: PHASE,
    repository: report.repository,
    run_id: report.run_id,
    run_attempt: report.run_attempt,
    run_key: report.run_key,
    requested_implementation_sha: report.requested_implementation_sha,
    actual_checkout_sha: report.actual_checkout_sha,
    workflow_definition_sha: report.workflow_definition_sha,
    workflow_blob_sha: report.workflow_blob_sha,
    classification: classification.classification,
    final_exit_code: classification.final_exit_code,
    primary_stage: classification.primary_stage,
    secondary_failures: classification.secondary_failures,
    bootstrap_status: report.bootstrap_status,
    failed_stage: report.failed_stage,
    bootstrap_exit_code: report.bootstrap_exit_code,
    proof_invoked: report.proof_invoked,
    proof_exit_code: report.proof_exit_code,
    proof_report_path: report.proof_report_path,
    proof_report_validation: classification.proof_validation,
    artifact_delivery: report.artifact_delivery,
    summary_exit_code: report.summary_exit_code,
    application_acceptance: false,
    accepted_application_version: "none",
    bootstrap_report_path: relative(process.cwd(), reportPath),
    generated_at: now()
  };
  await writeJson(outputPath, result);
  return result;
}

async function finalize(options) {
  const reportPath = reportPathFromArgs(options);
  const report = await readJson(reportPath);
  for (const [name, blocking] of EXPECTED_STAGES) {
    if (!currentStage(report, name)) report.stages.push({ name, status: "NOT_RUN", blocking, started_at: report.started_at, ended_at: now(), exit_code: null, error_classification: null, error: null, log_path: null, metadata: {} });
  }
  report.ended_at = now();
  updateBootstrapState(report);
  await writeJson(reportPath, report);
  await writeCiResult(reportPath, report);
}

async function recordArtifact(options) {
  const reportPath = reportPathFromArgs(options);
  const report = await readJson(reportPath);
  const uploadOutcome = process.env.ARTIFACT_UPLOAD_OUTCOME;
  const artifactId = safeInteger(process.env.ARTIFACT_ID);
  const digest = typeof process.env.ARTIFACT_DIGEST === "string" && /^sha256:[0-9a-f]{64}$/.test(process.env.ARTIFACT_DIGEST) ? process.env.ARTIFACT_DIGEST : null;
  const success = uploadOutcome === "success" && artifactId !== null;
  report.artifact_delivery = {
    status: success ? "PASS" : "FAIL",
    artifact_id: artifactId,
    artifact_name: safeText(process.env.ARTIFACT_NAME),
    artifact_digest: digest,
    artifact_url: safeText(process.env.ARTIFACT_URL),
    recorded_at: now(),
    upload_outcome: safeText(uploadOutcome)
  };
  await writeJson(reportPath, report);
  await writeCiResult(reportPath, report);
}

async function recordSummary(options) {
  const reportPath = reportPathFromArgs(options);
  const report = await readJson(reportPath);
  report.summary_exit_code = exitCode(options.exit_code);
  await writeJson(reportPath, report);
  await writeCiResult(reportPath, report);
}

async function publishSummary(options) {
  const reportPath = reportPathFromArgs(options);
  const outputPath = options.output ?? process.env.GITHUB_STEP_SUMMARY;
  if (!outputPath) throw new Error("GITHUB_STEP_SUMMARY or --output is required.");
  const report = await readJson(reportPath);
  const result = await readJson(resolve(dirname(reportPath), "ci-result.json"));
  await appendFile(resolve(outputPath), formatSummary({ report, result }));
}

async function verdict(options) {
  const reportPath = reportPathFromArgs(options);
  const result = await readJson(resolve(dirname(reportPath), "ci-result.json"));
  console.log(`CH-001R-r4 ${result.classification}; proof_invoked=${result.proof_invoked}; proof_exit=${result.proof_exit_code ?? "null"}.`);
  if (result.classification !== "LIVE_PROOF_READY_FOR_REVIEW") process.exitCode = result.final_exit_code > 0 ? Math.min(result.final_exit_code, 125) : 1;
}

function parseOptions(args) {
  const options = { metadata: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (["--report", "--status", "--exit-code", "--name", "--detail-file", "--log-file", "--started-at", "--proof-report", "--output"].includes(arg)) {
      if (!next || next.startsWith("--")) throw new Error(`${arg} requires a value`);
      options[arg.slice(2).replaceAll("-", "_")] = next;
      index += 1;
    } else if (arg === "--blocking" || arg === "--proof-invoked") {
      if (!next || next.startsWith("--")) throw new Error(`${arg} requires a value`);
      options[arg.slice(2).replaceAll("-", "_")] = next;
      index += 1;
    } else if (arg === "--meta") {
      if (!next) throw new Error("--meta requires key=value");
      options.metadata.push(next);
      index += 1;
    } else if (arg === "--help") options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function help() {
  return [
    "Usage: node scripts/ci/ci-result.mjs <init|record-stage|capture-outcomes|finalize|record-artifact|record-summary|summary|verdict>",
    "All commands are dependency-free and use CI_BOOTSTRAP_REPORT when --report is omitted."
  ].join("\n");
}

async function main() {
  const command = process.argv[2];
  const options = parseOptions(process.argv.slice(3));
  if (options.help || !command) {
    console.log(help());
    return;
  }
  if (command === "init") {
    const reportPath = reportPathFromArgs(options);
    const report = makeInitialReport();
    await writeJson(reportPath, report);
    await writeCiResult(reportPath, report);
  } else if (command === "record-stage") await recordStage(options);
  else if (command === "capture-outcomes") await captureRunnerOutcomes(options);
  else if (command === "finalize") await finalize(options);
  else if (command === "record-artifact") await recordArtifact(options);
  else if (command === "record-summary") await recordSummary(options);
  else if (command === "summary") await publishSummary(options);
  else if (command === "verdict") await verdict(options);
  else throw new Error(`Unknown command: ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await main(); }
  catch (error) {
    console.error(`CI result helper failed: ${sanitizeDiagnostic(error instanceof Error ? error.message : String(error))}`);
    process.exitCode = 1;
  }
}
