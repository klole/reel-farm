# Router authorization and handoff

## Publication gates

Luna commits execution-affecting work as **T8**, runs/reports checks against that commit, then commits documentation/evidence as **E8**. An evidence-only child cannot silently include another execution change. Report actual full SHAs, trees, parent relationships, and workflow blob/SHA-256; do not embed a guessed future commit.

The router uses the existing authorized workflow-capable publication path. If that path rejects the push, preserve local commits and report the permission blocker; do not request broad tokens in a file or weaken repository permissions.

After publication, verify T8 is an ancestor of E8 and E8 is on the intended `main`, and validate the exact T8 workflow and the actual definition tree **W8** used for dispatch. Record any divergence; do not execute mixed implementation/definition bytes silently. Re-run pinned semantic validation and the clean hosted-like prefix on the actual publication tree where the local environment could not do it. Confirm no unexplained execution changes occurred after T8.

## Dispatch budget

Authorize **at most one new manual dispatch** after the prerequisites above pass:

```bash
# Router only; T8 must contain the real verified 40-character implementation SHA.
: "${T8:?Set the verified full implementation SHA}"
[[ "$T8" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm --ref main \
  -f implementation_sha="$T8" \
  -f sandbox_qualification=true
```

This packet does not authorize a rerun of `34678495442` or any old T3/T4/T5/T6 record, including `34665615514`, `34669975078`, `34671716094`, and `34675672523`. Do not dispatch unchanged T7. Do not loop over attempts or automatically dispatch after any failure.

Record the request response before identifying the run. If the request is rejected before creation, run/job/artifact IDs and proof exit remain null. If the request's outcome is ambiguous, query the existing run list and reconcile the actor/time/input/definition/checkout identity before doing anything else; do not submit a duplicate request. A workflow metadata `head_sha` refers to its definition commit and is not by itself proof of the checkout input.

The fresh job's actionlint bootstrap, current-workflow validation, and complete CI suite must each produce a real result. If the workflow advances to sandbox qualification, consume the already-authorized r6 rules unchanged. Host launch, worker-container launch, and application journey remain distinct proofs.

## Outcome handling

| Outcome | Required action |
|---|---|
| Definition rejected | Save exact rejection and validation inputs; no fake run/artifact. Stop. |
| Tool provisioning or CI suite fails | Preserve first failure, actual helper counts, bootstrap report and artifact. No proof exit when uninvoked. Stop. |
| Sandbox/environment blocked | Preserve measured facts and qualification/cleanup outputs. Do not bypass policy. Stop. |
| Worker/application assertion fails | Preserve source, real execution and artifacts; do not expand r8 into app repair. Stop. |
| Bounded proof succeeds | Return success evidence for architect review; application acceptance remains false. |

No bounded result, even a green workflow, automatically closes all 72 original gates or the remaining original findings.

## Independent receipt

Retrieve the completed run's original artifact. Record name, ID, byte count, SHA-256, expiry, run/attempt/job, requested implementation and actual checkout, definition commit/blob/file hash, and separate bootstrap/sandbox/proof/cleanup outcomes. Verify referenced payload files and note whether their paths are repository-relative or archive-root-relative.

Do not rewrite the archive to replace an embedded pre-upload `PENDING` with a later delivery status. A separate router receipt binds the verified archive to GitHub's upload metadata. Keep fallback bootstrap records distinguished from the checked-out-source report.

Update the r8 evidence index and root project state with current observations, preserving the historical record. No role self-accepts the application. `application_acceptance=false`, accepted version `none`, root `awaiting_review` stay in force.

## Luna return template

```text
phase: CH-001R-r8
status: READY_FOR_ROUTER_PUBLISH | BLOCKED
base/P8: <actual>
T8/tree: <actual>
E8/tree: <actual; evidence-only child>
workflow blob/SHA-256: <actual>
validator version/archive/executable hashes: <actual>
pre-install clean prefix: <command, exit, counts, evidence>
pre-install hosted-like prefix: <command, exit, counts, sentinel results>
other commands: <actual exits and logs>
R8-T01..T12: <per-check actual outcomes>
R8-T13/T14: NOT_RUN (router-owned until executed)
R8-F01 disposition: <implemented and tested; evidence>
R8-F02 disposition: <implemented and tested; evidence>
unknowns/blockers: <factual>
publication/dispatch from Luna: <actual; do not imply router action>
application_acceptance: false
accepted_application_version: none
root_state: awaiting_review
external actions: <exact limited downloads/pushes, no invented actions>
```

The router appends actual W8/run/job/artifact and outcome data later; Luna does not manufacture them. “Sent” must state destination: packet delivered in this conversation, forwarded to Luna, repository published, and workflow submitted are different actions.
