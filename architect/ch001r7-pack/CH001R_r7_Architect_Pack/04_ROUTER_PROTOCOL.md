# Router protocol — publish T7/E7, then one new dispatch

## Authority

This packet authorizes at most one fresh manual dispatch of the repaired T7 implementation after the prerequisites below pass, carrying forward r6's explicit sandbox-qualification scope. It does not authorize reruns of old attempts, extra account permissions, a different runner policy, or a second speculative dispatch.

Do not rerun:

- historical T3 run `34665615514`;
- historical T4 run `34669975078`;
- historical T5 run `34671716094`;
- validation-only E6 record `34675672523`;
- unchanged T6 under a new dispatch merely to re-test the same unsupported expression.

Use the existing workflow-capable publication route. Do not copy credentials into the editing box, broaden OAuth/token scopes within this repair, force-push, reset history, or silently cherry-pick to a new implementation identity.

## Before publication

Obtain actual T7/E7 SHAs from Luna; no such commits were created by this architect packet. Verify the work is based on the reviewed E6 or an accounted-for descendant. Preserve P7 as the real packet commit if one exists.

Run `pnpm lint:workflow` against the exact final publication tree before pushing it, using a verified pinned actionlint. A PASS obtained for a different file/hash is stale. If the editing host lacked the tool, the router must run it here; lack of a local tool is not permission to submit unvalidated YAML.

Confirm the negative T6 control is rejected for the documented context rule, not merely because a tool/file is missing. Record version, hashes and diagnostics. The repaired complete workflow must pass with no suppressed context/schema errors.

Read the bounded diff. Preserve the original manual/public-only route, `sandbox_qualification` boolean default false, targeted AppArmor guard/cleanup, proof-directory ownership and application/security defaults. Do not remove the sandbox step to avoid validating it.

## After publication, before dispatch

Fetch the actual remote ref and record W7: the commit whose workflow definition will be used when dispatching `--ref main`. W7 may be E7, which is distinct from T7. Verify the live-proof workflow blob/bytes at W7 match the validated T7 workflow. If another commit changed the workflow, stop and validate the actual selected definition before proceeding.

Verify:

```bash
REPO=klole/reel-farm
# Set these to actual full SHAs returned by Luna, not labels or guessed values.
: "${T7:?Set T7}" "${E7:?Set E7}"

git fetch origin main
git cat-file -e "$T7^{commit}"
git cat-file -e "$E7^{commit}"
git merge-base --is-ancestor "$T7" "$E7"
git merge-base --is-ancestor "$E7" origin/main
W7="$(git rev-parse origin/main)"
test "$(git rev-parse "$T7:.github/workflows/ch001-live-proof.yml")" = \
     "$(git rev-parse "$W7:.github/workflows/ch001-live-proof.yml")"
```

Also inspect T7-to-E7 changes and the real workspace used for validation. A filename-only "documentation" label is not proof that runtime source was unchanged. Record full SHAs/tree/blob/digest, not only short names.

Confirm no other live proof is executing/queued for this route. Query existing runs to establish a before-dispatch baseline. Do not cancel others just to acquire a slot.

## Submit at most one request

After all checks pass, the router may run:

```bash
gh workflow run ch001-live-proof.yml --repo "$REPO" --ref main \
  -f implementation_sha="$T7" -f sandbox_qualification=true
```

Capture the command's real exit and response. The explicit boolean opt-in authorizes only the already bounded r6 policy behavior on the qualified hosted runner. It is not blanket permission to disable sandboxing or mutate an editing/developer host.

If rejected before run creation, stop. Preserve the actual error and leave live run/job/artifact IDs and proof exit null. Do not repeatedly resend the request. If a network timeout leaves request acceptance uncertain, read recent workflow-dispatch records to resolve it; do not assume nothing happened and submit a duplicate.

If accepted, identify the single new `workflow_dispatch` run by time, actor, workflow path/definition and the requested implementation. The Actions row may show W7/E7 as `head_sha` because it owns the workflow; the checkout step/artifact must independently confirm T7. Do not infer implementation identity from the head row alone.

## Observe without rerunning

Record the settled run/attempt/job and actual step results. Inspect at least:

- checkout and validated source identity;
- bootstrap and pinned browser installation;
- explicit sandbox qualification and effective host-sandbox evidence;
- worker/container qualification separately;
- bounded proof status and actual exit;
- run-owned policy cleanup;
- artifact upload and receipt outcome.

A successful artifact-upload step or a shell step intentionally returning zero for report collection is not a successful proof. Use the captured child exit and final classification.

If a new runtime problem is exposed, preserve it and stop for architect review. No application, container-policy or global sandbox workaround is authorized by this packet. Even a successful bounded proof leaves `application_acceptance=false`, accepted version `none`, and root `awaiting_review` pending the original full review contract.

## Preserve the real receipt

When an artifact exists, download that actual artifact; verify ID/name/run/attempt, length and digest; retain the original ZIP unchanged and inspect safe extracted payloads. Keep a separate receipt for post-upload outcome data rather than modifying the historical archive to add its own digest.

When no artifact exists, do not create a lookalike live-proof ZIP. A small committed router receipt with the rejected request/error and null live identifiers is appropriate.

Distinguish the E6 push-validation record from a new dispatched proof. Record a read/observation timestamp. If statuses are not settled, say so; do not invent a final outcome.

## Router response

Return actual publication SHAs, W7/workflow identity, static-validation evidence, request outcome, and—only if they exist—fresh run/job/artifact identities. Include `sent=yes/no` with a named destination so that "sent" cannot be mistaken for "dispatched". Include `workflow_dispatch_submitted=yes/no` separately, and keep acceptance false.
