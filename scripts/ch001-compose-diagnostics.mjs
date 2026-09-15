/* global Buffer */

import { mkdir, stat, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

export const COMPOSE_DIAGNOSTIC_SERVICES = Object.freeze(["db", "migrate", "web", "worker"]);
export const COMPOSE_DIAGNOSTIC_TIMEOUT_MS = 20_000;
export const COMPOSE_DIAGNOSTIC_MAX_OUTPUT_BYTES = 128 * 1024;

const PROJECT_NAME_PATTERN = /^oss-ch001-[a-z0-9-]{3,64}$/;
const RESOURCE_ID_PATTERN = /^[0-9a-f]{12,64}$/i;

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function boundedText(value, maxBytes = COMPOSE_DIAGNOSTIC_MAX_OUTPUT_BYTES) {
  const text = String(value ?? "");
  const bytes = Buffer.from(text);
  if (bytes.byteLength <= maxBytes) return { text, truncated: false };
  return { text: `${bytes.subarray(0, maxBytes).toString()}\n[output truncated at ${maxBytes} bytes]\n`, truncated: true };
}

export function sanitizeComposeDiagnostic(value, secrets = []) {
  let result = String(value ?? "");
  for (const secret of [...secrets].filter(Boolean).sort((left, right) => right.length - left.length)) result = result.split(secret).join("<redacted>");
  result = result.replace(/(?:postgres(?:ql)?:\/\/)[^\s"'`]+/gi, "postgres://<redacted>");
  result = result.replace(/(\b(?:DATABASE_URL|BOOTSTRAP_TOKEN|BETTER_AUTH_SECRET|CH001_OWNER_PASSWORD|SESSION_SECRET)\b\s*[=:]\s*)([^\s"']+)/gi, "$1<redacted>");
  result = result.replace(/(\bAuthorization\s*:\s*Bearer\s+)([^\s]+)/gi, "$1<redacted>");
  result = result.replace(/(\b(?:Cookie|Set-Cookie)\s*:\s*)([^\r\n]+)/gi, "$1<redacted>");
  return boundedText(result).text;
}

function parseInteger(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function normalizePsRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const service = typeof record.Service === "string" ? record.Service : typeof record.service === "string" ? record.service : null;
  const containerName = typeof record.Name === "string" ? record.Name : typeof record.name === "string" ? record.name : null;
  const containerId = typeof record.ID === "string" ? record.ID : typeof record.Id === "string" ? record.Id : typeof record.id === "string" ? record.id : null;
  const state = typeof record.State === "string" ? record.State : typeof record.state === "string" ? record.state : null;
  const health = typeof record.Health === "string" ? record.Health : typeof record.health === "string" ? record.health : null;
  const project = typeof record.Project === "string" ? record.Project : typeof record.project === "string" ? record.project : null;
  const exitCode = parseInteger(record.ExitCode ?? record.exitCode ?? record.Exit);
  if (!service && !containerName && !containerId) return null;
  return {
    service,
    container_name: containerName,
    container_id: containerId,
    state,
    health,
    exit_code: exitCode,
    ...(project ? { project } : {})
  };
}

function parseJsonValues(output) {
  const text = String(output ?? "").trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) return parsed.items;
    return [parsed];
  } catch {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const values = [];
    for (const line of lines) {
      try { values.push(JSON.parse(line)); }
      catch { return null; }
    }
    return values;
  }
}

export function parseComposePsOutput(output) {
  const values = parseJsonValues(output);
  if (values === null) return { status: "MALFORMED", records: [], error: "Compose ps output was neither a JSON array nor valid JSON lines." };
  const records = values.map(normalizePsRecord);
  if (records.some((record) => record === null)) return { status: "MALFORMED", records: [], error: "Compose ps output contained an unrecognized record." };
  return { status: "OK", records };
}

function parseVolumeOutput(output) {
  const values = parseJsonValues(output);
  if (values === null) return { status: "MALFORMED", records: [], error: "Docker volume output was neither a JSON array nor valid JSON lines." };
  const records = values.map((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const record = value;
    const name = typeof record.Name === "string" ? record.Name : typeof record.name === "string" ? record.name : null;
    const driver = typeof record.Driver === "string" ? record.Driver : typeof record.driver === "string" ? record.driver : null;
    return name ? { name, ...(driver ? { driver } : {}) } : null;
  });
  if (records.some((record) => record === null)) return { status: "MALFORMED", records: [], error: "Docker volume output contained an unrecognized record." };
  return { status: "OK", records };
}

function resultShape(result, args) {
  const value = result && typeof result === "object" ? result : {};
  const bounded = boundedText(value.output ?? "");
  return {
    command: typeof value.command === "string" ? value.command : `docker compose ${args.join(" ")}`,
    started_at: typeof value.startedAt === "string" ? value.startedAt : null,
    ended_at: typeof value.endedAt === "string" ? value.endedAt : null,
    exit_code: Number.isInteger(value.exitCode) ? value.exitCode : 1,
    timed_out: value.timedOut === true,
    output_truncated: value.outputTruncated === true || bounded.truncated,
    output: bounded.text
  };
}

async function runBounded(project, args, options = {}) {
  const timeoutMs = options.timeoutMs ?? COMPOSE_DIAGNOSTIC_TIMEOUT_MS;
  const maxOutputBytes = options.maxOutputBytes ?? COMPOSE_DIAGNOSTIC_MAX_OUTPUT_BYTES;
  try {
    return resultShape(await project.run(args, { timeoutMs, maxOutputBytes }), args);
  } catch (error) {
    return {
      command: `docker compose ${args.join(" ")}`,
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      exit_code: 1,
      timed_out: false,
      output_truncated: false,
      output: `${errorMessage(error)}\n`
    };
  }
}

async function runDockerBounded(project, args, options = {}) {
  const timeoutMs = options.timeoutMs ?? COMPOSE_DIAGNOSTIC_TIMEOUT_MS;
  const maxOutputBytes = options.maxOutputBytes ?? COMPOSE_DIAGNOSTIC_MAX_OUTPUT_BYTES;
  if (typeof project.dockerRun !== "function") {
    return {
      command: `docker ${args.join(" ")}`,
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      exit_code: 1,
      timed_out: false,
      output_truncated: false,
      output: "Compose project does not expose a scoped Docker command runner.\n"
    };
  }
  try {
    return resultShape(await project.dockerRun(args, { timeoutMs, maxOutputBytes }), args);
  } catch (error) {
    return {
      command: `docker ${args.join(" ")}`,
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      exit_code: 1,
      timed_out: false,
      output_truncated: false,
      output: `${errorMessage(error)}\n`
    };
  }
}

function publicPath(repositoryRoot, path) {
  const relativePath = relative(resolve(repositoryRoot), resolve(path));
  return relativePath && !relativePath.startsWith("..") && !isAbsolute(relativePath) ? relativePath : resolve(path);
}

async function writeDiagnosticFile(path, value, mode) {
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, value, { mode });
}

function publicCommandRecord(result, secrets) {
  return {
    command: sanitizeComposeDiagnostic(result.command, secrets),
    started_at: result.started_at,
    ended_at: result.ended_at,
    exit_code: result.exit_code,
    timed_out: result.timed_out,
    output_truncated: result.output_truncated,
    output_preview: sanitizeComposeDiagnostic(result.output, secrets).slice(-4_000)
  };
}

function hasProjectName(projectName) {
  return typeof projectName === "string" && PROJECT_NAME_PATTERN.test(projectName);
}

export async function verifyComposeProjectOwnership({ project, repositoryRoot, runId, timeoutMs = COMPOSE_DIAGNOSTIC_TIMEOUT_MS }) {
  const checks = [];
  const refusal = (reason) => ({ owned: false, status: "REFUSED", reason, checks });
  if (!hasProjectName(project?.projectName)) return refusal("Generated Compose project name is invalid or not run-owned.");
  if (typeof runId !== "string" || !project.projectName.endsWith(`-${runId}`)) return refusal("Compose project name is not bound to the current run ID.");
  if (resolve(project.root) !== resolve(repositoryRoot)) return refusal("Compose project root does not match the reviewed repository root.");
  if (!isAbsolute(project.envPath)) return refusal("Compose environment path is not absolute.");
  if (!(await stat(project.envPath).then(() => true).catch(() => false))) return refusal("Compose environment file is missing.");

  const ps = await runBounded(project, ["ps", "--all", "--format", "json"], { timeoutMs });
  const parsedPs = ps.exit_code === 0 && !ps.timed_out ? parseComposePsOutput(ps.output) : { status: "FAILED", records: [], error: "Compose ps failed or timed out." };
  checks.push({ name: "project_containers_absent", command: publicCommandRecord(ps, []), parse_status: parsedPs.status, records: parsedPs.records ?? [], error: parsedPs.error ?? null });
  if (ps.exit_code !== 0 || ps.timed_out || parsedPs.status !== "OK") return refusal("Run-owned project container state could not be proven absent before allocation.");
  if (parsedPs.records.length > 0) return refusal("Run-owned Compose project already has containers; refusing to reuse it.");

  const volumes = await runDockerBounded(project, ["volume", "ls", "--filter", `label=com.docker.compose.project=${project.projectName}`, "--format", "{{json .}}"], { timeoutMs });
  const parsedVolumes = volumes.exit_code === 0 && !volumes.timed_out ? parseVolumeOutput(volumes.output) : { status: "FAILED", records: [], error: "Docker volume inspection failed or timed out." };
  checks.push({ name: "project_volumes_absent", command: publicCommandRecord(volumes, []), parse_status: parsedVolumes.status, records: parsedVolumes.records ?? [], error: parsedVolumes.error ?? null });
  if (volumes.exit_code !== 0 || volumes.timed_out || parsedVolumes.status !== "OK") return refusal("Run-owned project volumes could not be proven absent before allocation.");
  if (parsedVolumes.records.length > 0) return refusal("Run-owned Compose project already has volumes; refusing to reuse it.");
  return { owned: true, status: "VERIFIED_ABSENT", checks };
}

export async function collectComposeDiagnostics({
  project,
  repositoryRoot,
  publicDir,
  privateDir,
  runId,
  startupResult,
  ownership,
  secrets = [],
  services = COMPOSE_DIAGNOSTIC_SERVICES,
  includeServiceLogs = true,
  timeoutMs = COMPOSE_DIAGNOSTIC_TIMEOUT_MS,
  maxOutputBytes = COMPOSE_DIAGNOSTIC_MAX_OUTPUT_BYTES
}) {
  const secondaryFailures = [];
  const commandRecords = [];
  const captureOrder = ["startup"];
  const publicLogsDir = resolve(publicDir, "compose-service-logs");
  const privateLogsDir = resolve(privateDir, "compose-service-logs");
  await mkdir(publicLogsDir, { recursive: true, mode: 0o750 });
  await mkdir(privateLogsDir, { recursive: true, mode: 0o700 });

  const ps = await runBounded(project, ["ps", "--all", "--format", "json"], { timeoutMs, maxOutputBytes });
  commandRecords.push({ name: "compose-ps-all", ...publicCommandRecord(ps, secrets) });
  captureOrder.push("ps --all");
  const parsedPs = ps.exit_code === 0 && !ps.timed_out ? parseComposePsOutput(ps.output) : { status: "FAILED", records: [], error: "Compose ps failed or timed out." };
  if (ps.exit_code !== 0 || ps.timed_out || parsedPs.status !== "OK") secondaryFailures.push(`compose diagnostics ps --all failed (exit ${ps.exit_code}${ps.timed_out ? ", timed out" : ""}).`);

  const images = await runBounded(project, ["images", "--quiet", ...services], { timeoutMs, maxOutputBytes });
  commandRecords.push({ name: "compose-images", ...publicCommandRecord(images, secrets) });
  captureOrder.push("images");
  const imageIds = images.output.split(/\s+/).map((value) => value.trim()).filter((value) => RESOURCE_ID_PATTERN.test(value));
  if (images.exit_code !== 0 || images.timed_out) secondaryFailures.push(`compose diagnostics images failed (exit ${images.exit_code}${images.timed_out ? ", timed out" : ""}).`);

  const stateRecords = parsedPs.status === "OK" ? parsedPs.records : [];
  const serviceLogs = [];
  const aggregatePublic = [];
  const aggregatePrivate = [];
  for (const service of services) {
    const matching = stateRecords.filter((record) => record.service === service);
    const base = {
      service,
      presence: parsedPs.status === "OK" ? matching.length > 0 ? "PRESENT" : "ABSENT" : "UNKNOWN",
      containers: matching
    };
    if (!includeServiceLogs) {
      serviceLogs.push({ ...base, log_status: "NOT_REQUESTED" });
      continue;
    }
    if (parsedPs.status === "OK" && matching.length === 0) {
      serviceLogs.push({ ...base, log_status: "ABSENT" });
      continue;
    }
    const logs = await runBounded(project, ["logs", "--no-color", "--timestamps", "--tail", "500", service], { timeoutMs, maxOutputBytes });
    commandRecords.push({ name: `compose-logs-${service}`, ...publicCommandRecord(logs, secrets) });
    captureOrder.push(`logs ${service}`);
    const privateContent = logs.output;
    const publicContent = sanitizeComposeDiagnostic(logs.output, secrets);
    const publicLogPath = resolve(publicLogsDir, `${service}.log`);
    const privateLogPath = resolve(privateLogsDir, `${service}.log`);
    await writeDiagnosticFile(privateLogPath, privateContent, 0o600);
    await writeDiagnosticFile(publicLogPath, publicContent, 0o640);
    aggregatePrivate.push(`===== ${service} =====\n${privateContent}`);
    aggregatePublic.push(`===== ${service} =====\n${publicContent}`);
    const logStatus = logs.exit_code === 0 && !logs.timed_out ? "CAPTURED" : "FAILED";
    if (logStatus === "FAILED") secondaryFailures.push(`compose diagnostics logs ${service} failed (exit ${logs.exit_code}${logs.timed_out ? ", timed out" : ""}).`);
    serviceLogs.push({ ...base, log_status: logStatus, log_command: publicCommandRecord(logs, secrets), public_log_path: publicPath(repositoryRoot, publicLogPath) });
  }
  if (includeServiceLogs) {
    await writeDiagnosticFile(resolve(privateDir, "compose-service-logs.log"), aggregatePrivate.join("\n"), 0o600);
    await writeDiagnosticFile(resolve(publicDir, "compose-service-logs.log"), aggregatePublic.join("\n"), 0o640);
  }

  const startup = startupResult ? {
    command: sanitizeComposeDiagnostic(startupResult.command, secrets),
    started_at: startupResult.startedAt ?? null,
    ended_at: startupResult.endedAt ?? null,
    exit_code: startupResult.exitCode,
    timed_out: startupResult.timedOut === true,
    output_truncated: startupResult.outputTruncated === true,
    output_preview: sanitizeComposeDiagnostic(startupResult.output, secrets).slice(-4_000)
  } : null;
  const state = {
    record_kind: "CH001_COMPOSE_STARTUP_STATE",
    run_id: runId,
    project_name: project.projectName,
    ownership: ownership ?? null,
    startup_attempted: true,
    startup,
    ps: {
      ...publicCommandRecord(ps, secrets),
      parse_status: parsedPs.status,
      parse_error: parsedPs.error ?? null,
      services: stateRecords
    },
    images: {
      ...publicCommandRecord(images, secrets),
      ids: [...new Set(imageIds)]
    },
    services: serviceLogs,
    diagnostics: {
      bounded_timeout_ms: timeoutMs,
      max_output_bytes: maxOutputBytes,
      capture_order: captureOrder,
      raw_logs_private: true,
      public_logs_sanitized: true
    },
    command_records: commandRecords
  };
  const statePath = resolve(publicDir, "compose-startup-state.json");
  await writeDiagnosticFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 0o640);
  return { statePath, serviceLogsPath: includeServiceLogs ? resolve(publicDir, "compose-service-logs.log") : null, state, commandRecords, secondaryFailures };
}

export async function teardownComposeProject({
  project,
  repositoryRoot,
  publicDir,
  runId,
  ownershipVerified,
  startupAttempted,
  timeoutMs = COMPOSE_DIAGNOSTIC_TIMEOUT_MS,
  maxOutputBytes = COMPOSE_DIAGNOSTIC_MAX_OUTPUT_BYTES
}) {
  const secondaryFailures = [];
  const receipt = {
    record_kind: "CH001_COMPOSE_CLEANUP",
    run_id: runId,
    project_name: project.projectName,
    startup_attempted: startupAttempted === true,
    project_owned: ownershipVerified === true,
    teardown: null,
    post_cleanup: null,
    bounded_timeout_ms: timeoutMs,
    max_output_bytes: maxOutputBytes
  };
  if (!ownershipVerified || !startupAttempted) {
    receipt.status = "NOT_RUN";
    receipt.reason = !ownershipVerified ? "Project ownership was not verified; no teardown command was issued." : "Startup was not attempted; no teardown command was issued.";
    return { receipt, secondaryFailures };
  }
  if (resolve(project.root) !== resolve(repositoryRoot)) {
    receipt.status = "REFUSED";
    receipt.reason = "Compose project root changed before teardown; no command was issued.";
    secondaryFailures.push("compose cleanup refused because the project root changed before teardown.");
    return { receipt, secondaryFailures };
  }
  const down = await runBounded(project, ["down", "-v", "--remove-orphans"], { timeoutMs, maxOutputBytes });
  receipt.teardown = publicCommandRecord(down, []);
  if (down.exit_code !== 0 || down.timed_out) secondaryFailures.push(`compose cleanup down failed (exit ${down.exit_code}${down.timed_out ? ", timed out" : ""}).`);

  const ps = await runBounded(project, ["ps", "--all", "--format", "json"], { timeoutMs, maxOutputBytes });
  const parsedPs = ps.exit_code === 0 && !ps.timed_out ? parseComposePsOutput(ps.output) : { status: "FAILED", records: [], error: "Compose post-cleanup ps failed or timed out." };
  const volumes = await runDockerBounded(project, ["volume", "ls", "--filter", `label=com.docker.compose.project=${project.projectName}`, "--format", "{{json .}}"], { timeoutMs, maxOutputBytes });
  const parsedVolumes = volumes.exit_code === 0 && !volumes.timed_out ? parseVolumeOutput(volumes.output) : { status: "FAILED", records: [], error: "Docker post-cleanup volume inspection failed or timed out." };
  if (ps.exit_code !== 0 || ps.timed_out || parsedPs.status !== "OK") secondaryFailures.push(`compose cleanup post-check containers unavailable (exit ${ps.exit_code}${ps.timed_out ? ", timed out" : ""}).`);
  if (volumes.exit_code !== 0 || volumes.timed_out || parsedVolumes.status !== "OK") secondaryFailures.push(`compose cleanup post-check volumes unavailable (exit ${volumes.exit_code}${volumes.timed_out ? ", timed out" : ""}).`);
  const containers = parsedPs.status === "OK" ? parsedPs.records : null;
  const remainingVolumes = parsedVolumes.status === "OK" ? parsedVolumes.records : null;
  const status = containers && remainingVolumes ? containers.length === 0 && remainingVolumes.length === 0 ? "REMOVED" : "REMAINING_RESOURCES" : "UNKNOWN";
  if (status !== "REMOVED") secondaryFailures.push(`compose cleanup could not prove all run-owned resources were removed (${status}).`);
  receipt.post_cleanup = {
    status,
    containers: containers ?? [],
    volumes: remainingVolumes ?? [],
    container_check: publicCommandRecord(ps, []),
    container_parse_status: parsedPs.status,
    container_parse_error: parsedPs.error ?? null,
    volume_check: publicCommandRecord(volumes, []),
    volume_parse_status: parsedVolumes.status,
    volume_parse_error: parsedVolumes.error ?? null
  };
  receipt.status = secondaryFailures.length === 0 ? "PASS" : "FAIL";
  const cleanupPath = resolve(publicDir, "compose-cleanup.json");
  await writeDiagnosticFile(cleanupPath, `${JSON.stringify(receipt, null, 2)}\n`, 0o640);
  return { receipt, cleanupPath, secondaryFailures };
}

export async function writeComposeNotRunEvidence({ publicDir, runId, projectName, reason }) {
  const state = {
    record_kind: "CH001_COMPOSE_STARTUP_STATE",
    run_id: runId,
    project_name: projectName,
    startup_attempted: false,
    status: "NOT_RUN",
    reason,
    diagnostics: { capture_order: [], raw_logs_private: true, public_logs_sanitized: true }
  };
  const cleanup = {
    record_kind: "CH001_COMPOSE_CLEANUP",
    run_id: runId,
    project_name: projectName,
    startup_attempted: false,
    project_owned: false,
    status: "NOT_RUN",
    reason: "No validated, run-owned Compose startup was attempted; no teardown command was issued."
  };
  const statePath = resolve(publicDir, "compose-startup-state.json");
  const cleanupPath = resolve(publicDir, "compose-cleanup.json");
  await writeDiagnosticFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 0o640);
  await writeDiagnosticFile(cleanupPath, `${JSON.stringify(cleanup, null, 2)}\n`, 0o640);
  return { statePath, cleanupPath };
}
