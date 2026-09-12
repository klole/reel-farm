# Handoff — CH-001R-r7

> Template only. Replace unknown fields with actual values or explicit null/NOT_RUN. This file does not represent completed Luna work.

## State

- Operational status: `READY_FOR_ROUTER_PUBLISH` / `READY_FOR_ROUTER_VALIDATION` / `BLOCKED`.
- Target application version: `0.1.0`.
- Root state: `awaiting_review`.
- Application acceptance: `false`.
- Accepted application version: `none`.

## Identities

| Field | Actual value |
|---|---|
| Base/P7 and tree | null |
| T7 implementation and tree | null |
| E7 evidence commit (returned externally) | null |
| Workflow blob and SHA-256 at T7 | null |
| Publication verified on origin/main | NOT_RUN |
| W7 definition commit, if dispatched | null |
| Validator version/executable/archive identity | null |

## Root-cause disposition

- R7-F01, unsupported job-level `runner.temp`: repair description and full-file validation result.
- R7-F02, missing pre-publication semantic validation: command/wrapper added, actual negative/positive evidence.
- Any other definition errors: exact location and bounded repair, or none observed. Do not claim full application review.

## Actual command results

Include start/end timestamps, tested source identity, command, exit code, counts, skipped checks and retrievable evidence for `lint:workflow`, full T6 negative control, new regression cases, existing CI modules, lint/typecheck/build/unit/security and diff checking. Distinguish file-level test counts from subtest counts.

List R7-T01 through R7-T16 individually with PASS/FAIL/NOT_RUN and evidence. Hosted/router cases are NOT_RUN at Luna handoff unless actually executed by the authorized router. Do not set all to PASS because a shell reference worked.

## Historical r6 dispatch boundary

```json
{
  "record_kind": "HISTORICAL_ROUTER_DISPATCH_REJECTION",
  "implementation_sha": "e0ea57665d00a643a8c392dfb9f6a84a723729af",
  "workflow_definition_sha": "a4d6e7a0149d6852bf348d6277c4200720320f9c",
  "request_outcome": "REJECTED_BEFORE_RUN",
  "request_outcome_basis": "router report; preserve original response if available",
  "http_status": null,
  "raw_error_reference": null,
  "live_proof_run_id": null,
  "live_proof_job_id": null,
  "proof_invoked": false,
  "proof_exit_code": null,
  "artifact_id": null,
  "hosted_gate_counts": null,
  "separate_validation_record": {
    "run_id": 34675672523,
    "event": "push",
    "conclusion": "failure",
    "job_count": 0
  },
  "application_acceptance": false
}
```

Do not copy the local r6 exit 2 into this hosted proof field. If new primary evidence corrects the historical receipt, append the correction with its source rather than rewriting unrelated archives.

## New T7 router outcome (fill only after router action)

- Publication verified: NOT_RUN.
- Pre-publication semantic validation: NOT_RUN.
- Dispatch request submitted: false.
- Request accepted/rejected/uncertain: null.
- New run/attempt/job: null.
- Sandbox requested / measured qualified: null / null.
- Worker qualified: NOT_RUN.
- Proof invoked / actual exit: false / null.
- Policy cleanup status: NOT_RUN.
- Artifact ID/name/bytes/SHA-256: null.
- Artifact independently inspected: false.
- Gate counts from new report: null.
- Primary blocker and downstream missing work: null.
- Application acceptance: false.

## Scope declaration and stop

List all changed paths. Confirm lockfile/native manifest and dependency pins unchanged; explain any scripts-only package change. State that sandbox policy semantics, worker/Compose controls, original gates and strict verifier were not weakened. Declare external actions, paid/provider requests, privileged policy activity and dispatch count accurately.

No providers, account authorization, publishing, scheduling, billing, analytics, video, release, public deployment or v0.2 work is authorized. Return the actual handoff and stop for router/architect review.
