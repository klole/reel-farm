#!/usr/bin/env bash

# Resolve the run/attempt-owned r6 sandbox state path for later GitHub steps.
# This step only appends an environment assignment; it does not create state.
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

# GITHUB_ENV is consumed by later steps. Do not source or eval it as a shell
# script. This helper must not create proof/public or policy state.
