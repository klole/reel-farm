export type MarkerQueryRequest = {
  kind: "presence" | "count";
  sql: string;
};
export type MarkerQueryResult = {
  exit_code?: number | null;
  timed_out?: boolean;
  output_truncated?: boolean;
  output?: string;
  log_path?: string | null;
  [key: string]: unknown;
};
export type MarkerObservation = {
  status: "PASS" | "FAIL" | "NOT_RUN";
  observation_status: "PASS" | "FAIL" | "NOT_RUN";
  table_present: boolean | null;
  marker_count: number | null;
  marker_count_source: "catalog_absence" | "catalog_count" | null;
  count_executed: boolean;
  no_completion_marker: boolean | null;
  queries: Array<Record<string, unknown>>;
  reason?: string;
};
export declare function observeSchemaMigrations(query: (request: MarkerQueryRequest) => Promise<MarkerQueryResult>): Promise<MarkerObservation>;
export declare const MARKER_COUNT_QUERY: string;
export declare const MARKER_PRESENCE_QUERY: string;
export declare const MARKER_OBSERVER_STATUS: Readonly<{ PASS: "PASS"; FAIL: "FAIL"; NOT_RUN: "NOT_RUN" }>;
