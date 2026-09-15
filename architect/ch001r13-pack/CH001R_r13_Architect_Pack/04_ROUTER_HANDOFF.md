# Router authorization and stop rules — r13

## Immediate action

**Do not dispatch unchanged T12 `cc9da96079fc681ce162a99bd4e3df21f05cb382`.** Deliver this repair to Luna MAX. Do not dispatch T11 or rerun T10/D1 `34946892709` or earlier records. Do not auto-cancel or retry a concurrently started job.

This packet replaces the unspent T12 permission. It does not allocate multiple attempts across unchanged and repaired candidates. If a T12 request has already been submitted by another actor, or the request history is ambiguous, return that identity/outcome to the architect before any additional request.

## Publication prerequisite

After Luna returns, independently verify the actual full T13 SHA/tree and E13 SHA/tree. T13 descends from the reviewed T12/E12 baseline and actual P13; E13 contains only evidence/state/handoff additions after final T13. Preserve unrelated later documentation and identify any execution drift. Do not amend a published implementation or overwrite historical evidence.

Verify both F13 repairs from source and their genuine negative/positive adapter/evidence tests. Required SOURCE rows must pass with retrievable logs and final-candidate binding. Runtime NOT_RUN due to a Docker-less editing box is permitted, provided the real PostgreSQL/final-image path remains executable. Do not require yet another plan-only phase to rediscover this known local limitation.

The workflow must remain exactly the reviewed blob `35fa339aac2fcb024cd476ff38d87d27eb6482af` with recorded SHA-256 `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` at T13, publication head, and dispatch definition. Verify current bytes with the pinned actionlint; keep the exact opt-in and permissions. A workflow change is outside this packet.

Do not infer workflow definition identity from the checked-out implementation. Record both separately. Do not assume the publication HEAD still equals E13 at dispatch time; record the actual definition SHA and check its execution-relevant diff.

## One fresh request, deliberately elected

Only after those checks pass may the router elect **one** fresh request for final T13. No architect request is sent by this packet's authoring. A router who does not dispatch must report that honestly.

The two supported workflow inputs remain the existing ones. Purpose is receipt metadata, not a new workflow input.

```bash
# Router-only example; T13 must be set to the verified actual full SHA.
[[ "${T13:-}" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm --ref main \
  -f implementation_sha="$T13" \
  -f sandbox_qualification=true
```

Receipt purpose: `verify_fixture_database_binding_and_invocation_evidence`.

Check all relevant manual requests since the source publication baseline and any router request ledger; a head-SHA-only search can miss a request whose definition is a later documentation commit. Record an intended-request receipt before submission. If submission returns an ambiguous network result, resolve it rather than resending. Failed/rejected submissions are recorded and returned; there is no automatic retry allowance.

## Inspect the actual outcome

Record request count, request response, run/attempt/job IDs or null, implementation checkout, definition and workflow blob/hash, image/container identities, bootstrap outcome, migration observer regression, fresh/schema/repeat/permission-control outcomes, fixture and project cleanup, finalization/manifest outcome, downstream readiness, and actual application gate counts if the run emitted them.

A green wrapper step does not prove the child's exit was zero. Preserve the captured proof exit and final classification. A repaired observer test does not itself prove the application migration works. A completed migration phase does not prove the worker browser works. A successful bounded proof still returns to architect review rather than granting v0.1 acceptance.

Check that the permission operation used the fixture database, not just that its SQL looks right. Check that repeated query commands have separate invocation IDs and intact logs rather than having disappeared from the evidence. Expected negative SQL/control exits must remain visible with their expected-outcome evaluation.

Download and preserve the actual artifact. Verify API-listed digest/size, ZIP integrity, manifest payload hashes, and public-only contents before evidence publication. Preserve the original archive unchanged. If no artifact exists, record its absence rather than creating substitute proof screenshots/exports.

Then stop. Do not patch a later worker/application failure, re-dispatch, release/tag, start provider work, or mark application acceptance true.
