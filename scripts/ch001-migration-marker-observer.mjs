const MARKER_PRESENCE_QUERY = "SELECT (pg_catalog.to_regclass('public.schema_migrations') IS NOT NULL)::int";
const MARKER_COUNT_QUERY = "SELECT count(*)::text FROM public.schema_migrations";

const STATUS = Object.freeze({ PASS: "PASS", FAIL: "FAIL", NOT_RUN: "NOT_RUN" });

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function resultValue(result, camelCase, snakeCase, fallback = null) {
  if (!isRecord(result)) return fallback;
  return result[snakeCase] ?? result[camelCase] ?? fallback;
}

function queryEvidence(kind, sql, result, parsedValue = null, countAttempted = false) {
  const output = resultValue(result, "output", "output", "");
  return {
    kind,
    sql,
    exit_code: resultValue(result, "exitCode", "exit_code"),
    timed_out: resultValue(result, "timedOut", "timed_out", false) === true,
    output_truncated: resultValue(result, "outputTruncated", "output_truncated", false) === true,
    output_line_count: typeof output === "string" ? output.split(/\r?\n/).filter((line) => line.trim().length > 0).length : null,
    parsed_value: parsedValue,
    count_attempted: countAttempted,
    log_path: resultValue(result, "logPath", "log_path")
  };
}

function invalidResult(reason, queries, countAttempted = false) {
  return {
    status: STATUS.FAIL,
    observation_status: STATUS.FAIL,
    table_present: null,
    marker_count: null,
    marker_count_source: null,
    count_executed: countAttempted,
    no_completion_marker: null,
    queries,
    reason
  };
}

function parseSingleScalar(result, label) {
  if (!isRecord(result)) return { value: null, reason: `${label} query adapter returned no result.` };
  const exitCode = resultValue(result, "exitCode", "exit_code");
  const timedOut = resultValue(result, "timedOut", "timed_out", false) === true;
  const outputTruncated = resultValue(result, "outputTruncated", "output_truncated", false) === true;
  const output = resultValue(result, "output", "output");
  if (!Number.isInteger(exitCode) || exitCode !== 0) return { value: null, reason: `${label} query exited ${String(exitCode)}.` };
  if (timedOut) return { value: null, reason: `${label} query timed out.` };
  if (outputTruncated) return { value: null, reason: `${label} query output was truncated.` };
  if (typeof output !== "string") return { value: null, reason: `${label} query returned no textual output.` };
  const lines = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length !== 1) return { value: null, reason: `${label} query returned ${lines.length} non-empty output lines; exactly one is required.` };
  return { value: lines[0], reason: null };
}

function parsePresence(result) {
  const parsed = parseSingleScalar(result, "Marker-presence");
  if (parsed.reason) return parsed;
  if (parsed.value !== "0" && parsed.value !== "1") return { value: null, reason: "Marker-presence query did not return exactly 0 or 1." };
  return { value: parsed.value === "1", reason: null };
}

function parseCount(result) {
  const parsed = parseSingleScalar(result, "Marker-count");
  if (parsed.reason) return { value: null, reason: parsed.reason };
  if (!/^\d+$/.test(parsed.value)) return { value: null, reason: "Marker-count query did not return a nonnegative integer." };
  const value = Number(parsed.value);
  if (!Number.isSafeInteger(value)) return { value: null, reason: "Marker-count query exceeded the safe integer range." };
  return { value, reason: null };
}

/**
 * Read the fixed public.schema_migrations marker without statically referring
 * to the relation until the catalog-only presence query has proved it exists.
 * The adapter is deliberately query-shaped and receives only these fixed SQL
 * strings; callers cannot provide a table name or interpolate SQL through it.
 */
export async function observeSchemaMigrations(query) {
  if (typeof query !== "function") return invalidResult("A guarded marker query adapter is required.", []);

  let presenceResult;
  try {
    presenceResult = await query({ kind: "presence", sql: MARKER_PRESENCE_QUERY });
  } catch {
    return invalidResult("Marker-presence query adapter failed.", []);
  }
  const presence = parsePresence(presenceResult);
  const presenceEvidence = queryEvidence("presence", MARKER_PRESENCE_QUERY, presenceResult, presence.reason ? null : presence.value, false);
  if (presence.reason) return invalidResult(presence.reason, [presenceEvidence]);
  if (!presence.value) {
    return {
      status: STATUS.PASS,
      observation_status: STATUS.PASS,
      table_present: false,
      marker_count: 0,
      marker_count_source: "catalog_absence",
      count_executed: false,
      no_completion_marker: true,
      queries: [presenceEvidence],
      reason: "The catalog-only presence query proved that public.schema_migrations is absent; COUNT was not executed."
    };
  }

  let countResult;
  try {
    countResult = await query({ kind: "count", sql: MARKER_COUNT_QUERY });
  } catch {
    const countEvidence = { kind: "count", sql: MARKER_COUNT_QUERY, exit_code: null, timed_out: false, output_truncated: false, output_line_count: null, parsed_value: null, count_attempted: true, log_path: null };
    return invalidResult("Marker-count query adapter failed.", [presenceEvidence, countEvidence], true);
  }
  const count = parseCount(countResult);
  const countEvidence = queryEvidence("count", MARKER_COUNT_QUERY, countResult, count.reason ? null : count.value, true);
  if (count.reason) return invalidResult(count.reason, [presenceEvidence, countEvidence], true);
  const noCompletionMarker = count.value === 0;
  return {
    status: noCompletionMarker ? STATUS.PASS : STATUS.FAIL,
    observation_status: STATUS.PASS,
    table_present: true,
    marker_count: count.value,
    marker_count_source: "catalog_count",
    count_executed: true,
    no_completion_marker: noCompletionMarker,
    queries: [presenceEvidence, countEvidence],
    ...(noCompletionMarker ? {} : { reason: "public.schema_migrations contains one or more completion-marker rows." })
  };
}

export { MARKER_COUNT_QUERY, MARKER_PRESENCE_QUERY, STATUS as MARKER_OBSERVER_STATUS };
