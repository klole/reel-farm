#!/usr/bin/env bash
# Reference runtime-step body; not an application or sandbox-policy operation.
set -euo pipefail
: "${RUNNER_TEMP:?RUNNER_TEMP is required}" "${GITHUB_RUN_ID:?GITHUB_RUN_ID is required}" \
  "${GITHUB_RUN_ATTEMPT:?GITHUB_RUN_ATTEMPT is required}" "${GITHUB_ENV:?GITHUB_ENV is required}"
[[ "$RUNNER_TEMP" == /* && "$RUNNER_TEMP" != *$'\n'* && "$RUNNER_TEMP" != *$'\r'* ]] || {
  printf '%s\n' 'RUNNER_TEMP must be a single-line absolute path.' >&2
  exit 1
}
[[ "$GITHUB_RUN_ID" =~ ^[0-9]+$ && "$GITHUB_RUN_ATTEMPT" =~ ^[1-9][0-9]*$ ]] || {
  printf '%s\n' 'Run ID and attempt must be valid numeric identifiers.' >&2
  exit 1
}
sandbox_state_dir="${RUNNER_TEMP}/ch001r6/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}/sandbox"
printf 'CH001_SANDBOX_STATE_DIR=%s\n' "$sandbox_state_dir" >> "$GITHUB_ENV"
# GITHUB_ENV is consumed by later steps. Do not source/eval it as a shell script.
# This step must not create proof/public or run a sandbox-policy command.
