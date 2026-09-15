# Receipt and next review

Use `router-receipt.template.json` as a schema guide, not a completed result. Preserve nulls where nothing was executed or observed. Store evidence under a new D1 directory, for example `docs/evidence/CH-001R-r10-D1/`; an evidence-only receipt commit after execution is allowed. No application implementation commit is requested by this packet.

## Required distinctions

**Local diagnostic operation:** local run ID, exact T10 checkout/tree, actual Docker/Compose/image identity, migration CLI return, inspected container return, exception stage, cleanup outcome, and all public evidence hashes.

**Hosted operation:** separate dispatch-definition commit, requested and actual checkout, run/attempt/job, artifact ID/name/bytes/digest, bootstrap/proof classifications, measured cleanup, and any observed ledger counts. Hosted proof fields stay null/false under Route A; do not copy the historical 4/0/68 ledger into a new unexecuted hosted result.

**Luna-local history:** preserve its reported checks separately. Gitignored prefix/proof files need actual retrieval before crediting their bytes; a handoff path alone is not evidence access. A later reproduction has a new identity and timestamp.

## Allowed diagnostic outcomes

- `CONTAINER_FAILURE_CAPTURED`: a real final-image invocation failed; selected state and usable sanitized inner error were captured; scoped teardown is complete. This is not a migration PASS.
- `MIGRATION_SUCCEEDED_UNEXPECTEDLY`: the actual migration succeeded; report fresh/repeat/schema/sentinel separately. Pending repeat or schema checks prevent claiming that sub-boundary is verified.
- `ENVIRONMENT_UNAVAILABLE`: no capable selected environment; no migration result claimed.
- `DIAGNOSTICS_INCOMPLETE`: execution occurred but missing/failed/truncated records or incomplete cleanup prevent the intended diagnostic closure. Preserve useful facts and the primary error.
- `SCOPE_BLOCKED`: source, ownership, publication, or permissions do not match this authorization.

Under Route B also retain the workflow's real classification verbatim. The operator's diagnostic disposition must not replace a `LIVE_PROOF_FAILED` or `CI_BOOTSTRAP_FAILURE` result with PASS.

## D1 checklist, independent of the 72 application gates

| ID | Required observation |
|---|---|
| D1-01 | Exact T10/E10/current publication identities and chosen route are recorded. |
| D1-02 | Either a capable local Docker context is verified, or the single-request hosted prerequisites are checked. |
| D1-03 | No prior project/evidence is reused; private configuration is isolated from user data. |
| D1-04 | The image-local migration command and actual exit/error are observed, or explicitly remain unobserved with a reason. |
| D1-05 | Original migration failure and any diagnostic/cleanup failures retain separate precedence and exits. |
| D1-06 | Pre-deletion service/container facts and owned cleanup are recorded; incomplete cleanup is not called complete. |
| D1-07 | Public evidence is sanitized, hash-bound, and accessible; private material is excluded. |
| D1-08 | No application edits, acceptance promotion, old-run rerun, or excess hosted submission occurred. |

`NOT_RUN` or `FAIL` is allowed in this diagnostic receipt; it prevents overstating that observation. Do not coerce all rows to PASS merely to finish the task.

## Router's final message

Return:

```text
Assignment: CH-001R-r10-D1
Route: LOCAL_DOCKER / HOSTED_FALLBACK / NONE
Outcome: <actual diagnostic outcome>
T10: ec7cc08d6ed229af9780318858d8051202851746
Evidence/receipt commit: <actual SHA or null>
Migration command reached: <actual stage or unknown>
Migration CLI exit / inspected container exit: <actual values or null>
Inner exception: <short sanitized excerpt or unavailable>
Fresh / repeat / schema: <separate results>
Diagnostics / cleanup: <separate results>
Hosted request count for r10: <actual count>
Hosted run / artifact: <actual identifiers or null>
application_acceptance=false; accepted version=none; root=awaiting_review
sent=<yes/already/no>, destination=<exact destination or none>
```

For `sent`, distinguish an evidence push from a hosted dispatch and from delivery to a chat. Do not use a single “yes” to imply all three happened.

The architect reviews the receipt before authorizing any migration code change or a new Luna implementation chapter. Do not create T11, rerun a failure, or expand the scope on the router's own initiative.
