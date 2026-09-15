export const INVOCATION_COMMAND_RECORD_FORMAT = "invocation-v2";

function requiredString(value, label) {
  if (typeof value !== "string" || value.length === 0) throw new Error(`Captured command is missing ${label}.`);
  return value;
}

/**
 * Serialize the already-captured process identity into both public command
 * records and their child-invocation projection. No command is rewritten or
 * merged: identical command text remains one record per captured invocation.
 */
export function serializeCommandEvidence(outputs, toRepositoryPath = (value) => value, bindings = {}) {
  if (!Array.isArray(outputs)) throw new Error("Captured command outputs must be an array.");
  const runId = requiredString(bindings.runId, "run ID");
  const implementationCommit = requiredString(bindings.implementationCommit, "implementation commit");
  const commands = outputs.map((output) => {
    const result = output?.result;
    const invocationId = requiredString(result?.invocationId, "invocation ID");
    const command = requiredString(result?.command, "command text");
    const logPath = requiredString(toRepositoryPath(requiredString(output?.publicLogPath, "public log path")), "repository log path");
    const child = {
      id: invocationId,
      command,
      started_at: requiredString(result?.startedAt, "start time"),
      ended_at: requiredString(result?.endedAt, "end time"),
      log_path: logPath,
      run_id: runId,
      implementation_commit: implementationCommit,
      ...(output?.reportPath ? { report_path: output.reportPath } : {})
    };
    return {
      invocationId,
      command,
      startedAt: child.started_at,
      endedAt: child.ended_at,
      exitCode: result.exitCode,
      logPath,
      ...(output?.reportPath ? { reportPath: output.reportPath } : {})
    };
  });
  const childInvocations = commands.map((command) => ({
    id: command.invocationId,
    command: command.command,
    started_at: command.startedAt,
    ended_at: command.endedAt,
    log_path: command.logPath,
    run_id: runId,
    implementation_commit: implementationCommit,
    ...(command.reportPath ? { report_path: command.reportPath } : {})
  }));
  return { command_record_format: INVOCATION_COMMAND_RECORD_FORMAT, commands, child_invocations: childInvocations };
}
