#!/usr/bin/env bash
# Formatting example only. Not the production workflow or final verdict evaluator.
set -euo pipefail
: "${GITHUB_STEP_SUMMARY:?Provide an owned output file}"
{
  printf '%s\n\n' '## CH-001R-r4 bounded CI proof'
  printf 'Implementation: `%s`\n' "${REQUESTED_SHA:-unknown}"
  printf 'Workflow definition: `%s`\n' "${CH001_WORKFLOW_SHA:-unknown}"
  printf 'Run: `%s`\n' "${CH001_RUN_ID:-unknown}"
  printf 'Proof invoked: `%s`\n' "${PROOF_INVOKED:-false}"
  printf 'Coordinator exit: `%s`\n' "${PROOF_EXIT_CODE:-not-run}"
  printf 'Application acceptance: `%s`\n' 'false'
} >> "$GITHUB_STEP_SUMMARY"
