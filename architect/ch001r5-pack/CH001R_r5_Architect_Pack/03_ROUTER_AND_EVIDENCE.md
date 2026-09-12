# Router — publish the r5 repair and return its actual outcome

## Baseline and no-repeat rules

The reviewed T4 run is `https://github.com/klole/reel-farm/actions/runs/34669975078` (attempt 1). It failed with a coordinator-directory collision. Do not rerun it unchanged. Do not rerun old T3 run `34665615514` or dispatch T3.

The reviewed remote artifact baseline is `df008ff64d02ada64b8e91578143709ea7b98b89`, directly after E4. Preserve that evidence. Review later changes before advancing. The architect has created this packet locally; no repository publication or dispatch was performed by this review.

## Publication gate

Receive actual T5/E5 identities from Luna. Inspect their ancestry and diff. Ensure T5 includes the narrow fix and tests, E5 contains no execution-affecting change, and there is no app/provider/scope drift. Publish through the already authorized workflow-capable route; do not force-push, squash away provenance, or ask the editing box to expose credentials.

Fetch `origin/main`, verify T5 and E5 are reachable, and record their tree hashes. Verify the published workflow blob and SHA-256, the actual workflow-definition commit that a `--ref main` dispatch will use, and that its workflow content matches the reviewed repair. Record `main` immediately before dispatch; refuse an intervening unreviewed execution change.

Only after those checks, use **one fresh manual dispatch** with the real new full T5 SHA:

```sh
# T5 must already contain the actual reviewed 40-character repair commit.
test "${#T5}" -eq 40 || exit 1
git cat-file -e "$T5^{commit}" || exit 1
git merge-base --is-ancestor "$T5" origin/main || exit 1
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main \
  -f implementation_sha="$T5"
```

This is an instruction for the router, not a record that this command has run. Do not substitute T4 because T5 has not yet been assigned. Select the resulting run by actor, time, event, requested input and actual checkout, not simply the first item in a run list.

## Evidence returned after settlement

Record run ID, attempt, job, final status/conclusion, actual requested/checked-out T5, workflow-definition commit/blob/hash, each relevant bootstrap step, the proof command's captured exit, and whether preparation proceeded to real proof steps. Separate a green wrapper step from its captured child result.

Download the actual new artifact. Record ID/name, archive bytes, SHA-256 from GitHub and from the downloaded bytes, creation/expiry, and exact source paths. Inspect the authoritative checked-out bootstrap report and proof report rather than a fallback snapshot. Record whether a gate ledger exists. When absent, use null/unavailable counts; when present, count its actual IDs/statuses and validate references without importing local gate results.

Use a separate small `publication-receipt.json` after artifact upload/summary to record delivery and terminal verdict. An archive generated before upload cannot contain a trustworthy receipt for its own completed upload. Do not mutate the original archive or require circular self-hashes. Preserve the API/log observations used for the receipt.

Return any screenshots, canonical/alternate ZIPs, hash comparisons, runtime/lifecycle evidence only if produced by the actual new proof. Preserve a failed report as failed. Do not manufacture a 72-gate report after an early crash or claim that installed browser binaries prove a live browser journey.

## Outcome routing

| Actual new outcome | Required router action |
|---|---|
| Bootstrap fails | Capture the first failed stage and reports; stop. No unrelated redesign. |
| Same directory refusal | Repair not demonstrated; return exact workflow and preparation evidence. No automatic rerun. |
| Directory preparation passes; environment blocks | Capture the measured blocker and any work that ran. Keep acceptance false. |
| Preparation passes; new build/runtime/application assertion fails | Preserve artifacts/logs and stop for an architect-defined follow-up. |
| Bounded proof passes | Verify downloadable artifacts and identity; return `READY_FOR_ARCHITECT_REVIEW`, never release acceptance. |
| Run/transport outcome unknown | Return a precise blocker. Do not infer success or dispatch another run blindly. |

## Receipt fields

At minimum: phase, repository, starting baseline, P5 when used, T5, E5, actual trees, remote main before dispatch, workflow commit/blob/SHA-256, dispatch count, run ID/attempt/job, timestamps, terminal conclusion, bootstrap status, proof invoked/exit, coordinator status/steps, artifact ID/bytes/digest/expiry, downloaded digest verification, proof-report and gate-ledger paths, actual gate counts or null, remaining blockers, and `application_acceptance=false` / accepted version `none`.

Preserve the r4 artifact facts in a historical section. Do not replace its missing hosted gate counts with local `4/0/68`, its nine hosted CI cases with the handoff's ten local cases, or its pre-upload `PENDING` snapshot with edited payloads.

The user-facing status should state whether the new packet/update was actually sent to Luna/router and the current blocker. Never label a locally created file as an external send.
