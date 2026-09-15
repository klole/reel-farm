function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function boolean(value) {
  return value === true;
}

function integer(value) {
  return Number.isInteger(value) ? value : null;
}

function observedCli(cli) {
  if (!isRecord(cli)) return { exit_code: null, timed_out: false, output_truncated: false, valid: false };
  const exitCode = integer(cli.exit_code ?? cli.exitCode);
  const timedOut = boolean(cli.timed_out ?? cli.timedOut);
  const outputTruncated = boolean(cli.output_truncated ?? cli.outputTruncated);
  return { exit_code: exitCode, timed_out: timedOut, output_truncated: outputTruncated, valid: exitCode !== null && !timedOut && !outputTruncated };
}

function observedContainer(container) {
  if (!isRecord(container)) return { state: null, exit_code: null, valid: false };
  const exitCode = integer(container.exit_code ?? container.exitCode);
  const state = typeof container.state === "string" ? container.state : null;
  const identity = typeof container.id === "string" && container.id.length > 0 && typeof container.image_id === "string" && container.image_id.length > 0;
  return { state, exit_code: exitCode, valid: state === "exited" && exitCode === 0 && identity };
}

function parsedImportReport(parsed) {
  if (!isRecord(parsed)) return { valid: false, reason: "The final-image child report was not a JSON object." };
  if (parsed.status !== "PASS") return { valid: false, reason: "The final-image child report did not declare PASS." };
  if (parsed.classification !== "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF") return { valid: false, reason: "The final-image child report has the wrong classification." };
  if (parsed.database_connection_attempted !== false) return { valid: false, reason: "The final-image child report did not prove that no database connection was attempted." };
  const poolApi = parsed.pool_api;
  if (!isRecord(poolApi) || poolApi.connect !== true || poolApi.end !== true || parsed.pool_closed !== true) return { valid: false, reason: "The final-image child report did not prove the real pool API was loaded and closed." };
  if (parsed.negative_control !== undefined && (!isRecord(parsed.negative_control) || parsed.negative_control.status !== "PASS")) return { valid: false, reason: "The final-image child report's isolated missing-link control did not pass." };
  return { valid: true, reason: null };
}

/**
 * Compute the only effective final-image module-import verdict. The child's
 * declaration is one input; it cannot override failed or missing CLI and
 * inspected-container evidence.
 */
export function evaluateFinalImageModuleImport({ cli, parsed, container, inspectionError = null }) {
  const cliObservation = observedCli(cli);
  const containerObservation = observedContainer(container);
  const parsedObservation = parsedImportReport(parsed);
  const reasons = [];
  if (!cliObservation.valid || cliObservation.exit_code !== 0) reasons.push("Compose CLI did not terminate successfully with exit 0.");
  if (!parsedObservation.valid) reasons.push(parsedObservation.reason);
  if (inspectionError) reasons.push("Container inspection failed before an effective verdict could be established.");
  if (!containerObservation.valid) reasons.push("Inspected final-image container was not a terminal exited container with exit 0 and identity facts.");
  const status = reasons.length === 0 ? "PASS" : "FAIL";
  return {
    status,
    classification: status === "PASS" ? "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF" : "MODULE_IMPORT_FAIL",
    effective_verdict: status,
    cli: {
      exit_code: cliObservation.exit_code,
      timed_out: cliObservation.timed_out,
      output_truncated: cliObservation.output_truncated
    },
    child_report: {
      status: isRecord(parsed) && typeof parsed.status === "string" ? parsed.status : null,
      classification: isRecord(parsed) && typeof parsed.classification === "string" ? parsed.classification : null,
      valid: parsedObservation.valid
    },
    container: {
      state: containerObservation.state,
      exit_code: containerObservation.exit_code,
      identity_present: containerObservation.valid
    },
    inspection_error: inspectionError ? "inspection_failed" : null,
    reasons
  };
}

export { parsedImportReport };
