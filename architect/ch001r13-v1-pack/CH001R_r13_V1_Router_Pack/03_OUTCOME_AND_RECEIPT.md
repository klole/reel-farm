# Outcome capture and stop rules

## Separate the conclusions

| Actual outcome | Router interpretation | Next action |
|---|---|---|
| No submission because a precheck failed or prior request was found | Not a new hosted result; record the exact blocker or existing request | Return evidence; do not submit another request |
| Request rejected or response ambiguous | Submission result only; run/job/proof fields remain null unless verified | Resolve by read-only inspection; no automatic resend |
| Bootstrap or sandbox stops before proof | Record actual classification and `proof_invoked=false` when supported | Preserve available artifact; return, no application verdict |
| Proof runs but marker fixture/import/migration fails | Preserve first relevant stage and measured child/container evidence | Return the specific failure; no generic redesign or retry |
| Migration verifies but worker or application later fails | Migration outcome and downstream failure are separate | Retain migration receipt; return first downstream blocker |
| Bounded proof succeeds | Candidate runtime evidence is ready for architect review | Preserve full artifacts; do not accept v0.1 or start v0.2 |
| Cleanup or evidence validation fails | Record alongside, not instead of, the primary outcome | No successful-complete claim; preserve useful diagnostics |

Do not assume that the “Execute bounded live proof” Actions step being green means the child proof passed. The existing workflow captures the child result and enforces it later. Use `ci-result.json`, `proof-result.json`, the actual child exit, and the job conclusion together.

## Required evidence, when produced

Preserve the run's actual files, including `bootstrap/public/ci-result.json`, sandbox qualification/cleanup records, `module-import-verification.json`, `migration-marker-regression.json`, `migration-verification.json`, `command-report.json`, `gate-results.json`, `verifier-result.json`, `compose-startup-state.json`, `compose-cleanup.json`, `migration-container-cleanup.json`, `proof-result.json`, `artifact-manifest.json`, and associated public logs.

If reached, preserve the application-generated ZIPs, screenshots, preview/export hash evidence, and lifecycle records. Do not generate substitute application evidence merely to fill missing filenames after an earlier stop. A missing report has a null observation, not the preceding local report's values.

Keep the workflow's existing legacy `r4` path prefix and other historic internal stage labels. Run/commit identities determine provenance; cosmetic renaming is not this assignment.

## Archive verification and durable receipt

Download the actual Actions artifact through the existing authorized account. Record API-listed ID, name, size, digest, expiry if returned, and the measured ZIP SHA-256 and size. Preserve the original ZIP bytes unchanged. Confirm archive integrity and reject unsafe member paths or ambiguous duplicate members before extracting a review copy.

Map the artifact's actual common root to the report's repository-relative paths explicitly. Verify every manifest-listed payload hash/size and the referenced public logs. Do not silently choose a same-named suffix from a different run. Records intentionally excluded to avoid circular hashes must remain identified as such; do not claim they are payload-bound when they are not.

Verify that the public publication contains no private raw inspection, environment files, credentials, cookies, or auth storage. If an unsafe payload is discovered, hold public publication, retain the original securely for its owner, and report the issue without posting the secret. Do not mutate the original ZIP and call the altered bytes the GitHub artifact.

Publish only evidence/receipt/handoff changes under the established repository process, preferably `docs/evidence/CH-001R-r13-V1/` and a corresponding router handoff. Do not rewrite E13's historical local ledger or old artifacts. Preserve unrelated concurrent documentation. Bind the new receipt to actual T13, the actual workflow definition, and the actual run.

Keep local source results, supplemental architect checks, hosted results, and the original application-gate ledger separate. In particular, the reviewed local array has nine distinct command strings: real repeated-query evidence must come from the new runtime, not from relabeling that local array.

Avoid self-referential commit/hash claims: a receipt cannot contain its own as-yet-uncreated commit SHA or form a circular manifest digest. Return the evidence commit externally after committing, or bind it with a separate subsequent receipt without claiming self-hash closure.

## Final router message

Return the assignment, `sent` scope, request count, verified T13 and definition identities, UTC submission/settlement times, run/attempt/job, actual bootstrap/proof/migration/downstream classifications, first failure and secondary failures, cleanup outcome, artifact identity and integrity, and evidence commit. Include the new run's application-gate counts only if that run emitted them.

Use separate fields for packet delivery, evidence push, external message send, Luna spawn, and workflow submission. A Git push is not a chat send. A received update is not an agent spawn.

In every outcome:

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
next_action=architect_review_of_actual_T13_outcome
```

Then stop. No code repair, provider work, release/tag, automatic acceptance, second dispatch, or historical rerun is authorized by this verification packet.
