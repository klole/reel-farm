# Router handoff and dispatch control — r9

## Current state

No request is being sent by this packet. It is not permission for an automatic retry. T8's run `34928718810` is settled historical evidence and must not be rerun. No new run ID or artifact exists as a result of this review.

The router first receives Luna's final T9/E9 and source-bound preflight evidence. If local readiness is blocked, do not publish a “verified” label or dispatch as a substitute for missing checks. A capable router may perform the required local preflight itself against exact T9 bytes and document that execution separately.

## Publication checks

Record P9 if used, T9/tree, E9/tree, and current remote main. Verify the recognized ancestry from E8. Confirm E9 contains only documentation/evidence/current-state changes after T9. Run pinned actionlint against the actual publication workflow, not an earlier local file. Record W9 definition commit, workflow blob ID, and SHA-256; T9 and the chosen dispatch head must contain identical workflow bytes.

Check that both source-bound prefix modes ran the real current actionlint step with the raw relative `CI_BOOTSTRAP_REPORT`, real helper/reporter, and no node_modules. Do not accept the old direct helper rehearsal as the replacement. Confirm all promised logs/reports resolve and their recorded hashes match.

Luna does not modify workflow-scoped credentials or workaround a failed push. Use only the established workflow-capable publication path. Do not force-push history. Unrecognized code on main requires a scope/identity check before proceeding.

## Conditional allowance for one manual T9 dispatch

Only after the publication/preflight checks pass, and through a deliberate router dispatch action, this packet permits **at most one fresh manual request for T9** with `sandbox_qualification=true`. There is no trigger from committing, uploading this packet, passing tests, or the previous failure. The assistant has not submitted that request.

The command template is:

```bash
# Fill these with the actual newly verified identities, never T8 or a placeholder.
REPO=klole/reel-farm
T9=REPLACE_WITH_VERIFIED_40_CHARACTER_T9_SHA

gh workflow run ch001-live-proof.yml --repo "$REPO" --ref main \
  -f implementation_sha="$T9" -f sandbox_qualification=true
```

Do not execute a placeholder. Confirm main's intended W9 workflow bytes immediately before the request. Record the request's actual outcome. If it is rejected, stop and preserve the response; do not keep resubmitting. If it is accepted but the run cannot be uniquely identified, investigate by read-only retrieval rather than submitting again.

Select the new run using dispatch event, actor/time, requested implementation, definition SHA, and actual checkout—not just “latest run.” Preserve attempt/job IDs, every relevant stage outcome, original downloaded ZIP, actual API-listed artifact ID, byte length, SHA-256, and expiry. Confirm command results and proof fields from the actual payload. The cleanup report may exist even when qualification is NOT_RUN.

If bootstrap passes and a distinct sandbox/worker/application problem appears, preserve it and return for a new architect decision. Do not patch broadly in this chapter, automatically retry, or mark application acceptance. Even a green bounded proof returns for original-contract review.

## Never rerun these historical records

`34665615514` (T3), `34669975078` (T4), `34671716094` (T5), `34675672523` (E6 push validation), `34676862756` (P7 record), `34678495442` (T7), and `34928718810` (T8). Some identifiers are supplied by the router; they are a do-not-rerun list, not a claim that this review independently inspected every record.

## Luna final message

Return status `READY_FOR_ROUTER_PUBLISH` or `BLOCKED_VERIFICATION`; real base/T9/E9/tree/workflow identities; command results and complete counts; R9 checklist counts; both source-bound prefix report paths; exact report-path repair; any helper ordering change; remaining missing checks; and scope/external-action declaration. Hosted identifiers are null until a real router request/run exists. Then stop.

## Router return message

Report publication sent `yes/no/already` separately from workflow request submitted `yes/no`. Include the verified T9/E9/W9, request outcome, actual fresh run/job/artifact identifiers where present, bootstrap and failed stage, sandbox requested/actually qualified, proof invoked/actual exit, gate counts only when a ledger exists, cleanup, evidence location, and `application_acceptance=false`. Do not use “sent” alone to imply a test passed.
