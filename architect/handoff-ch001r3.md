# Luna handoff — CH-001R-r3

Complete factual fields only. This is a template, not existing results.

## Result

`LIVE_PROOF_READY_FOR_REVIEW` / `NEEDS_WORKFLOW_DISPATCH` / `BLOCKED_ENVIRONMENT` / `TEST_FAILURE`

Application acceptance: **false**. Target remains v0.1.0; root state `awaiting_review`.

## Identity

- Starting repository/branch/commit:
- Reviewed prior T: `b516dab843be1b8870d3516185b52905982aec1f`
- Reviewed prior E: `5a931feb01ed8da16eb9f0079a380c61f5459792`
- New implementation T3 (full SHA):
- Exact checkout SHA and relevant clean-tree/diff check:
- Workflow-definition SHA:
- Evidence E3 (resolve after committing; return externally if not self-embeddable):
- Run ID, child run IDs, actual UTC times:
- Execution host / CI run/job link / actual artifact identity and expiry:

## Assigned proof outcomes

| Step | PASS / FAIL / NOT_RUN | Evidence/case reference | Actual gap or observation |
|---|---|---|---|
| Final image builds and sandboxed worker starts | | | |
| Empty migration + repeat invocation | | | |
| Unit/security/test-source checks | | | |
| Real integration suite executes | | | |
| Owner setup/login and seven-slide UI journey | | | |
| Real renderer suite executes | | | |
| Canonical ZIP and preview-byte equality | | | |
| Alternate 4:5 output dimensions | | | |
| Worker stop/queued request/restart/download | | | |
| Same data/artifact after container recreation | | | |
| Evidence sanitization/retrievability | | | |

## Commands

List actual commands, timestamps, exit codes, discovered/executed/skipped counts and logs. Distinguish proof profile from full acceptance. State whether an expected nonzero full verifier reflects uncovered gates or broken evidence. Do not say all suites passed unless they ran on this code.

## Artifacts

Provide real locations for populated-editor and preview screenshots, alternate output, worker-down state, canonical ZIP, manifest/post text, image/ZIP hashes, lifecycle comparison, reports, sanitization record and manifest. Do not include credentials or auth-state files. Note expiry of hosted artifacts.

## Parent gate ledger

Exactly 72 original IDs. Report counts and specific uncompleted categories. State that partial evidence within a gate is not a full PASS. Preserve historical r1/r2 records. Do not substitute the limited proof verdict for full acceptance.

## Findings

| Finding | Fixed / disproved / still open | Specific source change | Executed regression or remaining requirement |
|---|---|---|---|
| U01 migration bootstrap | | | |
| U02 integration import/discovery | | | |
| U03 E2E UI/identity/fixture | | | |
| U04 evidence paths/merge | | | |
| U05 runner ownership/pinned browser | | | |
| U06 verifier/failure/identity semantics | | | |
| U07 actual lifecycle assertions | | | |
| U08 remaining parent coverage | | | |

Also provide dispositions for original R01–R11. Do not mark all closed merely because source changes were committed.

## Exact external action, only when needed

For `NEEDS_WORKFLOW_DISPATCH`, state approved workflow branch/name, new full SHA and one exact command/run-button instruction. State which connection permission prevented dispatch. Do not repeat missing local Docker as the only explanation.

For `BLOCKED_ENVIRONMENT`, supply the designated runner's actual failed prerequisite command/log and the smallest required operator action. For `TEST_FAILURE`, supply the actual failing test and defect instead.

## Boundaries and stop

List provider calls/spend (expected none), CI usage, repository writes, cleanup targets and whether any external services were used. Confirm no providers/publishing/scheduling/billing/video/v0.2/release work began. Update state, return T3/E3 and stop for review.
