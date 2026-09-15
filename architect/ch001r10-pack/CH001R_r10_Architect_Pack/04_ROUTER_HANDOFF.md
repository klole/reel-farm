# Router publication, reproduction, and single-dispatch boundary

## No action has been submitted by this pack

This document conditionally authorizes one new T10 request; it does not submit it. Do not automatically redispatch on receipt, on push, or after a failure. No existing T9 run or earlier run is authorized for rerun.

## Before publication or dispatch

Read Luna's actual completion mode and unresolved items. Verify its base commit against E9 and the packet commit, the complete implementation diff, and the final T10 checks. Confirm E10 changes only evidence/state/handoff material. Do not introduce execution changes after the tested T10 and still label the evidence as T10.

Run the real pinned workflow validator against the actual candidate workflow bytes, including when the workflow was intentionally unchanged. Keep the now-working native/bootstrap report handling, actionlint provisioning, exact-environment tests, and source-bound prefix intact. Check that diagnostic capture precedes deletion and manifest finalization and that teardown cannot target a preexisting/default project.

Record T10/E10 full SHAs/trees and W10 definition SHA, blob, and file hash. W10 may be byte-identical to W9; no cosmetic workflow edit is required. At dispatch, the branch definition and the implementation checkout must be accounted for independently.

## Preferred route: reproduce locally with Docker first

When the router has a capable Docker environment, execute Luna's scoped migration reproduction against a uniquely named disposable project. First observe the baseline T9 exception, then run the candidate image checks if a cause-backed repair exists. Do not change the frozen image inputs by mounting host `node_modules` or bypassing the normal migration command.

This local reproduction is distinct from rerunning an old GitHub Actions record. Keep independent run IDs and evidence. No real accounts, provider keys, public endpoint, sandbox-policy mutation, or user database is involved. Delete only the newly allocated test resources after collecting their diagnostics.

If local evidence establishes a different unresolved cause, return it to the architect. The router must not make an unreviewed app/security repair and dispatch it as though it were the tested T10.

## Conditional diagnostic route

If no suitable local Docker environment is available, a diagnostics-only T10 may be published after its control-flow, isolation, redaction, pinned-tool, and evidence checks pass. It must contain no speculative migration repair. The one new hosted request may then be used to obtain the migration stderr and partial-startup teardown evidence.

Record `dispatch_purpose=diagnose_migration` rather than `verify_migration_repair`. Unexecuted migration checks remain NOT_RUN. This permission exists to obtain evidence, not to loop through guesses. A further code change requires another review and a new tested implementation identity.

## One manual request, then stop

After the above conditions are met, a deliberate router action may submit **at most one** request with the actual new T10 SHA:

```bash
# Set T10 to the real, verified 40-character implementation SHA. Do not paste T9.
test "${#T10}" -eq 40 || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm --ref main \
  -f implementation_sha="$T10" \
  -f sandbox_qualification=true
```

The explicit sandbox opt-in retains the already-authorized r6 policy constraints; it does not grant new privileges. Do not rerun `34937329430` or any historical record (`34928718810`, `34678495442`, `34676862756`, `34675672523`, `34671716094`, `34669975078`, `34665615514`).

Match the fresh run using the dispatch event, actor/time, requested input, workflow definition and actual checkout—not just the most recent red/green icon. A wrapper step that captures a nonzero child and exits zero is not proof success.

## Receipt

Return publication identity, dispatch-purpose, request count, new run/attempt/job, actual checkout, workflow blob/hash, each relevant stage outcome, captured proof exit, migration exception or success evidence, diagnostics and cleanup status, and artifact ID/name/bytes/SHA-256. Preserve and independently download the original ZIP; do not rewrite its reports. Check manifest payloads and keep pre-upload delivery snapshots separate from the actual API delivery receipt.

If a new worker sandbox or application failure appears, preserve it and return for review. Do not broaden isolation or perform an automatic second request. Even a successful bounded proof leaves `application_acceptance=false`, accepted version `none`, and root `awaiting_review` until the architect evaluates the unchanged full acceptance contract.
