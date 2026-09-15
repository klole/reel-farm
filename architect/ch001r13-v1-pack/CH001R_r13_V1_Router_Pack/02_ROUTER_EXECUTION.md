# Router execution — CH-001R-r13-V1

## 1. Scope of authorization

Use the existing published **T13 `6e04b5a5eefe2ef464572da35c88338fa342f525`**. Do not create a T14, edit the app or harness, respawn Luna, repair Colima, or install a new Docker platform merely to repeat the known editing-host limitation. This packet authorizes the existing standard hosted route after the checks below.

Run only the existing manual `ch001-live-proof.yml`, with explicit `sandbox_qualification=true`. Existing non-root execution, exact-managed-browser qualification, run-owned policy cleanup, permissions, timeouts, evidence ownership, and isolated Compose resources remain unchanged. [S15]

This V1 packet is the router execution instruction for the **same one-request r13 budget**. It is not a new attempt, retry, or second permission on top of the r13 implementation packet.

## 2. Recheck publication without changing implementation

Resolve the live remote branch and record its full SHA. Verify the actual Git objects, not a copied abbreviated handoff:

```text
P13 = 34be09f3a211aae01582270708b565b4a7cce539
T13 = 6e04b5a5eefe2ef464572da35c88338fa342f525
T13 tree = 405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8
E13 = d1ab7226b71e93235a9761f1432b6fb7be198609
E13 tree = 77250fc98f4f3c35c91dec6e418690ddb3451360
workflow blob = 35fa339aac2fcb024cd476ff38d87d27eb6482af
workflow SHA-256 = 733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d
```

Verify T13's parent is P13 and E13's parent is T13. Verify T13 is an ancestor of the current `origin/main`. The checked-out implementation for proof must be **T13**, not E13 and not a later packet commit.

Compare T13→E13: evidence/state/handoff only. If main has advanced after E13, allow only clearly identified documentation/receipt/packet progress with no executable change. Do not erase that progress. Unexpected app, test, workflow, package, or runtime changes require a return to review, not a reset or an opportunistic dispatch.

Check the workflow blob at T13, E13, and the current dispatch definition candidate. Independently compute the SHA-256 of the exact workflow bytes using the approved existing toolchain. All must match the values above. Validate the complete publication workflow with the already approved pinned actionlint 1.7.7 route. Preserve the validator result and input hash; do not rely on generic YAML parsing or copy another candidate's PASS.

Inspect the source-bound T13 clean/hosted-like prefix evidence and source checks in E13. Confirm final implementation/tree binding and retrievable logs. Runtime NOT_RUN caused by the known Docker-less editing host is explicitly allowed here. Do not demand an already successful local migration before using the hosted environment intended to verify it.

The implementation delta and local findings are described in the review. The existing package/lock, migrations, Docker/Compose, sandbox, and workflow are frozen. For proof context, the recorded lock SHA-256 is `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576`; no installation may silently rewrite it.

## 3. Establish the request has not already been spent

Check the router's durable request ledger and all relevant manual runs since the r11/r12/r13 publication period. Do **not** filter exclusively by E13 as a run head: workflow definition and implementation checkout are separate identities, and a later documentation commit can be the definition head. The read-only architect query returned zero runs, but the router must recheck immediately before its own action.

If any T13 submission is queued, running, completed, failed, cancelled, or ambiguous, do not submit another. Inspect and report the existing outcome. If an unauthorized superseded T11/T12 run has appeared, return that fact for review rather than adding a concurrent request.

The following historical records are read-only: `34665615514`, `34669975078`, `34671716094`, `34675672523`, `34676862756`, `34678495442`, `34928718810`, `34937329430`, and `34946892709`. Do not rerun, resume, delete, or rewrite them. Do not dispatch old implementation SHAs.

Coordinate a single router owner. Persist an intended-request receipt with UTC time, exact T13 input, current definition head, workflow hash, request-history evidence, and `submission_started=false`. When submission begins, mark that fact. An uncertain network response is **not** permission to resend. Resolve it by read-only inspection and return the ambiguity if necessary.

## 4. Submit exactly once after successful checks

The router may now deliberately execute this command once. It has not been executed by the architect:

```bash
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha=6e04b5a5eefe2ef464572da35c88338fa342f525 \
  -f sandbox_qualification=true
```

Only these two workflow inputs are supported. Record purpose `verify_fixture_database_binding_and_invocation_evidence` in the receipt, **not** as a new workflow input. `--ref main` selects the workflow definition; `implementation_sha` selects the source that the workflow checks out. [P1, P2, S15]

A submission rejection is recorded and returned. No automatic reattempt, amended workflow, or replacement candidate is authorized. A CLI success only establishes request submission, not migration or proof success.

## 5. Observe the one outcome

Monitor only the identified fresh run. Record run ID, attempt, job ID, event, actual definition SHA, actual checkout SHA/tree, workflow blob/hash, runner class, and existing bootstrap/sandbox outcomes. Bind the result to actual checkout T13, not just to a command-line intention.

Allow the existing bounded coordinator to execute and finalize its own diagnostics and cleanup. The router must not patch code inside the runner or alter the outcome to turn a red result green. No second dispatch follows either success or failure.

When the coordinator stops, inspect the layers in order:

1. **Bootstrap and sandbox:** actual captured statuses; no borrowing a prior run's PASS.
2. **Image import:** effective CLI/child/retained-container verdict, with real image/process identity; import PASS is not SQL PASS.
3. **PostgreSQL marker regression:** fixture database target, absent/legacy/empty/positive/denied observations, actual expected error class, and fixture cleanup. Confirm the ACL command connects to the fixture database, not `oss`.
4. **Application migration:** fresh precondition, shipped fresh migration, expected schema and single completion row, same-data sentinel, repeat, and restricted-role failure/no false marker. Check inspected CLI/container exits rather than a green wrapper step.
5. **Evidence and cleanup:** repeated commands with distinct captured invocation IDs and retrievable logs, matching child records, useful pre-deletion state, run-owned cleanup, and final manifest integrity.
6. **Downstream only if reached:** worker/browser readiness, integration/E2E/render, slideshow/ZIP/preview hashes, and lifecycle. A later failure does not erase earlier measured migration results.

A raw nonzero expected-negative command can be correct test evidence only when its enclosing assertion verifies the expected failure and state. Preserve it; do not relabel all nonzero commands as infrastructure failures, and do not hide unexpected nonzero exits.

Use the result matrix in `03_OUTCOME_AND_RECEIPT.md` and stop for architect review. Even a successful bounded proof leaves application acceptance false.
