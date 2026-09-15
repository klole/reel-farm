# Router — T11 hold, T12 publication, one-request policy

## Immediate action

**Do not dispatch unchanged T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f`.** Deliver this repair to Luna MAX. Publication of T11/E11 was a source publication, not an executed migration or acceptance result.

This packet supersedes the r11 packet's unspent T11 dispatch permission. It does not add a second allowance. If a T11 request was already submitted after the point-in-time review, return its ID and outcome for review instead of submitting another candidate request. Do not cancel a job or modify repository execution code under these router instructions.

## After Luna returns

Verify exact T12 implementation and E12 evidence identities, ancestry, allowed file delta, and source-ready evidence. E12 must be evidence/handoff/state-only. Preserve late documentation commits rather than force-pushing back to a historical head.

All SOURCE rows in the repair matrix must be supported by retrievable evidence. Missing local Docker can legitimately leave runtime rows NOT_RUN; it cannot excuse failed unit, workflow, parsing, pin, or import checks. The SQL regression must invoke the production marker observer, be isolated from the main migration DB, and be runnable in the installed hosted path.

Verify the T11 dependency/lock correction remains unchanged and that no SQL migration, image, workflow, or security surface changed. The workflow remains:

```text
blob=35fa339aac2fcb024cd476ff38d87d27eb6482af
sha256=733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d
```

Check the exact workflow bytes at T12, E12, and the actual definition head on `origin/main`. Run existing pinned actionlint on that complete file. Keep `implementation_sha` distinct from GitHub's definition `head_sha`.

Before electing a request, examine the request ledger and manual-run history across relevant definition heads, not only a filter for the implementation SHA. A workflow run's head normally identifies the definition, while its input and checkout identify the implementation. A null/ambiguous acknowledgment is not permission to retry.

## One deliberate fresh T12 request

Only after all source-ready/publication conditions pass, the router may elect at most **one** request for the new T12. The architect and Luna do not submit it. Record purpose in the receipt; do not invent a workflow input.

```bash
: "${T12:?Set the actual approved 40-character T12 implementation SHA}"
[[ "$T12" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha="$T12" \
  -f sandbox_qualification=true
```

Purpose in receipt only: `verify_migration_observation_and_evidence_repair`.

Do not use `gh run rerun`. No T11, T10/D1 `34946892709`, T9 `34937329430`, or earlier run is authorized for retry. This also covers historical records not listed by ID.

No automatic second request after failure, cancellation, rejection, or ambiguous submission. Capture the exact response, correlate history, and return for review. Do not spawn another Luna task to patch a newly observed downstream failure without a new architect instruction.

## Read the outcome rather than the green wrapper step

Preserve the actual captured proof exit and final classification. Distinguish bootstrap, final-image import, SQL-observer regression, fresh migration, schema, repeat, controlled failure, cleanup, and later worker/application stages.

If module import succeeds but fresh precondition fails, do not call the dependency fix a proven migration. If migration succeeds but worker readiness fails, retain completed migration evidence and keep the whole proof failed. A successful bounded proof returns ready for review; it does not set application acceptance true or erase incomplete original gates.

Download the exact fresh artifact; record run/attempt/job, requested SHA, actual checkout/tree, definition commit, workflow blob/SHA-256, artifact ID/name/size/API digest, local ZIP SHA-256, and payload integrity. Preserve raw downloaded ZIP unchanged; commit only sanitized selected evidence and receipts. No public environment dumps, cookies, auth state, raw secret-bearing inspection, or leaked command files.

## Receipt and stop

Return actual T12/E12/router-evidence SHAs, source checks, request count, run/artifact identity or null, stage results, first blocker, cleanup, original gate counts from that actual run, and delivery destination. Report evidence push, chat delivery, and workflow dispatch separately.

Keep `application_acceptance=false`, `accepted_application_version=none`, and root `awaiting_review` throughout. Then stop for architect review.
