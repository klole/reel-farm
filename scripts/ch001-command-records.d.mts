export type SerializedCommandRecord = {
  invocationId: string;
  command: string;
  startedAt: string;
  endedAt: string;
  exitCode: number;
  logPath: string;
  reportPath?: string;
};

export type SerializedChildInvocation = {
  id: string;
  command: string;
  started_at: string;
  ended_at: string;
  log_path: string;
  run_id: string;
  implementation_commit: string;
  report_path?: string;
};

export declare const INVOCATION_COMMAND_RECORD_FORMAT: "invocation-v2";
export declare function serializeCommandEvidence(
  outputs: unknown[],
  toRepositoryPath: (value: string) => string,
  bindings: { runId: string; implementationCommit: string }
): {
  command_record_format: "invocation-v2";
  commands: SerializedCommandRecord[];
  child_invocations: SerializedChildInvocation[];
};
