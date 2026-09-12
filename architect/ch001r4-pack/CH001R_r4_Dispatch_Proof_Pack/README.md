# CH-001R-r4 — Publish the frozen implementation and obtain live proof

**For Kyle and Luna MAX. Target application: v0.1.0. Acceptance: false.**

This is an operational continuation of CH-001R-r3, not another application implementation chapter. Do not rebuild the editor, broaden the tests into a new product milestone, or start v0.2. The immediate task is to get the already-authored bounded proof onto an authorized GitHub runner and bring back reviewable results.

## Current decision

Retain the handoff status `NEEDS_WORKFLOW_DISPATCH`, with **workflow publication to the default branch** as its immediate prerequisite. Retain root state `awaiting_review` and accepted version `none`.

GitHub could read T3 and E3 by their exact SHAs during this review. However, the observed `main` remained at `a5afe2d8d1bc7741a0276513f3f1111d3ff587ae`; the workflow was absent at that branch snapshot. The repository's workflow-dispatch run query returned zero runs. Readability of a commit object does not establish that the branch was updated. See [the review](01_ARCHITECT_DECISION.md) and its pinned sources.

## Fixed identities

| Symbol | Meaning | Exact value |
|---|---|---|
| T3 | Implementation to exercise | `0b79ed07a25a618ab4da2bf56a2fed6047398cb5` |
| E3 | Existing evidence/handoff commit; direct child of T3 | `4cf020317cfc2e8755f35ee6da10f7397c8676f2` |
| B3 | Observed remote main / T3 parent | `a5afe2d8d1bc7741a0276513f3f1111d3ff587ae` |
| P3 | Earlier r3 packet commit | `04b85402c03404fc9f707983594cb796525f6563` |
| Workflow | Manually triggered proof | `.github/workflows/ch001-live-proof.yml` |
| Workflow blob | Expected unchanged Git blob at T3/E3 | `4a1b045e4771901713a2ad00705a0a84c9ff1dab` |
| Workflow SHA-256 | Recorded in E3; verify before dispatch | `c94526b66f6f21f2d4228491854f8df1e2b666796816f3d3b18e7da6c8313f1d` |
| T3 tree | Implementation tree | `2852c9a96595e9aca234aa30f449ec615a4b43bd` |

## Read and execute in this order

1. [Architect decision](01_ARCHITECT_DECISION.md): what was independently inspected, what was only reported, and the limited next action.
2. [Owner publication runbook](02_OWNER_PUBLISH_RUNBOOK.md): authorization, exact-object transfer if needed, non-destructive publication, and branch/workflow verification.
3. [Luna execution assignment](03_LUNA_EXECUTION.md): once publication is available, select or dispatch one exact-T3 run and collect its real result.
4. [Evidence and handoff contract](04_EVIDENCE_AND_HANDOFF.md): identify the tested implementation, workflow definition, run attempt, artifacts, and remaining parent gates.

The [starting prompt](LUNA_START_PROMPT.md) is ready to paste. [CONTROL_RECORD.json](CONTROL_RECORD.json) is a planning/snapshot record, not a generated test report. [Sources](05_SOURCES.md) provides pinned repository references and current official documentation.

**Read this attachment before committing it to main.** Publish the original T3/E3 history first. Adding a new packet commit to the old remote main first would create unnecessary branch divergence.

## Three separate outcomes

**Publication:** T3 is an ancestor of remote main; the reviewed workflow exists on the default branch; E3 is also retained.

**Bounded live proof:** the correct hosted run actually exercises its assigned browser/database/worker/export/lifecycle assertions and supplies retrievable evidence. `pnpm proof:ch001` is the bounded command.

**Application acceptance:** all original CH-001 requirements receive their prescribed evidence and an architect accepts them. `pnpm verify:ch001` remains the strict full-contract verifier. A successful bounded run is not automatically a successful full verifier.

The current r3 result is reported as **4 source-only PASS / 0 FAIL / 68 NOT_RUN**, not an independent live acceptance finding. Do not reset those reports, mark the unexecuted cases passed, or overwrite the historical 72-NOT_RUN ledger.

## Stop rule

The successful endpoint of this packet is **live proof ready for architect review**, not v0.1 acceptance. If authorization, workflow execution, identity, or artifacts remain blocked, report that specific blocker and stop. Do not consume another implementation cycle repeating the same unavailable local preflight.

