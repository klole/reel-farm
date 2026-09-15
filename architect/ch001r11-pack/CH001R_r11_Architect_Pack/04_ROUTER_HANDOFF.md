# Router publication and one-request policy — CH-001R-r11

## 1. What is and is not authorized

The r10 hosted allowance has been consumed by run **34946892709**. Do not retry it. This packet authorizes Luna to produce **new T11/E11** code/evidence for the now-confirmed missing dependency and migration-first verification.

After the conditions below are met, the router may deliberately elect **at most one fresh T11 `workflow_dispatch` request**. The architect has not sent that request, and creating this packet does not start an external agent. Luna must not dispatch. No background auto-redispatch, old-run rerun, or automatic code patch is authorized.

The earlier records remain read-only: T3 34665615514; T4 34669975078; T5 34671716094; E6 34675672523; P7 34676862756; T7 34678495442; T8 34928718810; T9 34937329430; T10/D1 34946892709. The ban also covers any other historical attempt not enumerated here.

## 2. Accept the source handoff, not an acceptance claim

Read the actual r11 handoff, scope report, source-ready test logs and checklist. Reject unrun source checks, a skipped pin guard, a test that relies on preexisting node_modules, or a migration script that is never invoked by the coordinator.

Local Docker verification is preferred where a capable authorized environment exists. Where Docker is genuinely unavailable, `IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION` is acceptable for publication/request consideration after all source-ready checks pass. Do not require a prior successful local migration as a condition of the explicit hosted fallback; obtaining that runtime evidence is the reason for the fallback.

No VM repair, remote Docker target guessing, new service purchase, provider credential, or user environment is needed. If source checks cannot be met, return the specific blocker and do not spend the hosted request.

## 3. Publication preflight

Verify actual starting/P11/T11/E11 ancestry, preserving D1 evidence. Check the T11 execution delta against the allowed surfaces in this packet. E11 must change evidence/state only. Preserve late documentation-only receipt commits; do not use a force push to return to T10.

Verify the dependency and lock exception yourself: root runtime @oss/db=workspace:*, root importer link:packages/db, everything else frozen. Re-run pinned actionlint against the exact publication workflow. Required workflow blob and SHA-256 are unchanged:

```text
35fa339aac2fcb024cd476ff38d87d27eb6482af
733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d
```

Check these bytes at T11, E11, and the actual definition head on origin/main. A workflow change is outside this packet's scope and requires a separate review instead of opportunistic dispatch.

The implementation SHA is T11; the workflow definition head may be E11 or a subsequent evidence-only publication commit. Record them separately. Confirm origin/main contains the exact candidate and the local workspace used for publication is clean. Record actual tree IDs; do not invent them before commit.

Before requesting a run, examine prior manual requests/runs and the local dispatch receipt for this candidate. GitHub's head_sha is the definition commit, not necessarily the input implementation. Do not assume filtering by implementation SHA alone rules out an existing request. Account for request time, definition ref, input receipt, and checked-out source observation.

## 4. Deliberate fresh request

Only after choosing to use the one allowance, record intended source/definition/workflow hashes and purpose in a local receipt, then submit:

```bash
: "${T11:?Set T11 to the actual approved 40-character implementation commit}"
[[ "$T11" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha="$T11" \
  -f sandbox_qualification=true
```

`purpose=verify_root_db_dependency_and_migration` belongs in the router receipt, **not** as an invented workflow input. The workflow accepts the existing two inputs; do not add `dispatch_purpose` to the CLI request.

If submission errors or its acknowledgment is ambiguous, preserve the response and inspect history. Do not blindly repeat the command. A rejected or uncertain request returns for review rather than an automatic second request under this packet.

Observe the accepted run to completion within the router's actual authorized execution. Preserve the run ID, attempt, job, head/definition/input/actual checkout SHAs, artifact ID/name/size/API digest, and downloaded ZIP hash. Download the artifact from that fresh run, not an old similarly named archive. No reuse/resume of old proof directories.

## 5. Interpret the result accurately

A successful capture/upload step is not necessarily proof success. Report the captured child code and final classification verbatim. Distinguish:

- Bootstrap failed or proof not invoked: migration runtime remains untested; capture exact new prerequisite error.
- Migration package loading/fresh/schema/repeat/controlled-failure check failed: retain inner error and terminal exits; later app stages NOT_RUN.
- Migration qualified but worker/app proof failed: preserve migration PASS evidence and the distinct later failure; whole proof remains failed.
- Bounded proof succeeded: mark ready for architect review only. Do not set application_acceptance=true or accepted version.

Do not make a second hosted request for another stage. The single candidate run already contains the migration-first path and, if it succeeds, the existing bounded journey. Stop at its actual outcome and return it for review. Source/image assertions that never ran keep NOT_RUN.

The strict 72-gate ledger remains independent. Do not transfer old source-only PASS results to the candidate without its own bound evidence. Do not invent a green `verify:ch001`; a green bounded proof does not erase uncovered gates.

## 6. Evidence publication and return

Preserve the downloaded archive unchanged. Store sanitized selected logs, migration-verification receipt, original manifest and independent inspection, cleanup result, first new failure, and command/count summary. Commit only evidence/state to the router's evidence commit; no application patch. Keep source and evidence identities separate.

Avoid circular hash sealing. A receipt can refer to a manifest that excludes that receipt, or an outer manifest can bind the receipt; do not have both claim to hash each other. Return the final evidence commit SHA in the external message after commit. Record separately whether evidence was pushed and whether a chat/agent message was actually sent.

Suggested return:

```text
Assignment: CH-001R-r11
T11 / E11 / router evidence commit: <actual identities>
Workflow definition / blob / SHA-256: <actual identities>
Hosted request count for r11: <0 or 1>
Hosted run / attempt / artifact: <actual or null>
Bootstrap / proof invoked / proof exit / classification: <actual>
Module import / fresh / schema / repeat / negative control: <actual statuses>
Migration command and inspected container exits: <actual>
First distinct blocker: <actual, or none observed>
Diagnostics / cleanup / artifact hash verification: <actual>
Application acceptance: false; accepted version: none; root: awaiting_review
sent=<yes/no>; destination=<actual>; no rerun performed
```
