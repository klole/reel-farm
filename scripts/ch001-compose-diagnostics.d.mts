export type DiagnosticCommand = {
  command: string;
  started_at: string | null;
  ended_at: string | null;
  exit_code: number;
  timed_out: boolean;
  output_truncated: boolean;
  output: string;
};

export type DiagnosticProject = {
  projectName: string;
  envPath: string;
  root: string;
  run(args: string[], options?: { timeoutMs?: number; maxOutputBytes?: number }): Promise<{ command: string; startedAt: string; endedAt: string; exitCode: number; output: string; timedOut?: boolean; outputTruncated?: boolean }>;
  dockerRun?(args: string[], options?: { timeoutMs?: number; maxOutputBytes?: number }): Promise<{ command: string; startedAt: string; endedAt: string; exitCode: number; output: string; timedOut?: boolean; outputTruncated?: boolean }>;
};

export type ComposeOwnershipResult = {
  owned: boolean;
  status: string;
  reason?: string;
  checks?: unknown[];
};

export type ComposeDiagnosticCollection = {
  statePath: string;
  serviceLogsPath: string | null;
  state: Record<string, unknown>;
  commandRecords: unknown[];
  secondaryFailures: string[];
};

export type ComposeCleanupResult = {
  receipt: Record<string, unknown>;
  cleanupPath?: string;
  secondaryFailures: string[];
};

export const COMPOSE_DIAGNOSTIC_SERVICES: readonly string[];
export const COMPOSE_DIAGNOSTIC_TIMEOUT_MS: number;
export const COMPOSE_DIAGNOSTIC_MAX_OUTPUT_BYTES: number;

export function sanitizeComposeDiagnostic(value: unknown, secrets?: string[]): string;
export function parseComposePsOutput(output: string): { status: string; records: Array<Record<string, unknown>>; error?: string };
export function verifyComposeProjectOwnership(input: { project: DiagnosticProject; repositoryRoot: string; runId: string; timeoutMs?: number }): Promise<ComposeOwnershipResult>;
export function collectComposeDiagnostics(input: {
  project: DiagnosticProject;
  repositoryRoot: string;
  publicDir: string;
  privateDir: string;
  runId: string;
  startupResult?: { command: string; startedAt?: string; endedAt?: string; exitCode: number; output: string; timedOut?: boolean; outputTruncated?: boolean } | null;
  ownership?: unknown;
  secrets?: string[];
  services?: readonly string[];
  includeServiceLogs?: boolean;
  timeoutMs?: number;
  maxOutputBytes?: number;
}): Promise<ComposeDiagnosticCollection>;
export function teardownComposeProject(input: {
  project: DiagnosticProject;
  repositoryRoot: string;
  publicDir: string;
  runId: string;
  ownershipVerified: boolean;
  startupAttempted: boolean;
  timeoutMs?: number;
  maxOutputBytes?: number;
}): Promise<ComposeCleanupResult>;
export function writeComposeNotRunEvidence(input: { publicDir: string; runId: string; projectName: string; reason: string }): Promise<{ statePath: string; cleanupPath: string }>;
