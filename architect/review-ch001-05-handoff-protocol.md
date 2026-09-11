# Handoff and architect acceptance protocol

## 1. Preserve the submitted history

The reviewed original evidence remains at `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. Its 72 NOT_RUN results are historical facts. Do not edit them into supposed original passes.

Create a new repair handoff at `handoffs/CH-001R-r2.md` and, if preserving the existing mirrored convention, `state/handoffs/CH-001R-r2.md`. Store the fresh run index/ledger under `docs/evidence/CH-001R-r2/`. Update the old CH-001 evidence README to link to the repair run rather than erasing the old result. Root state should point unambiguously to the current repair evidence.

Do not change frozen files under `architect/.../reference/north-star/`. Product scope, licensing proposals, provider choices, and future roadmap acceptance are not rewritten to make a gate pass.

## 2. Exact commits without a self-reference loop

Use two identities:

- **T: implementation commit.** Includes application, tests, configuration, fixtures, and verifier changes. Run final verification against that identified tree. Record whether it was clean, and the tree/lock/browser/build hashes used.
- **E: evidence/handoff commit.** Adds reports and documentation referring to T, after the run. It must not silently add untested implementation changes.

A tracked file cannot practically contain the final SHA of the commit that will contain that exact file. Do not keep creating commits to chase that self-reference. In-file metadata may identify T, the evidence path/run ID, and that E is its containing commit. After committing, return the exact full E SHA and URL in Luna's final message. The next reviewer resolves E and checks T..E is evidence/documentation-only.

If code or tests change after the purported final run, create a new T and rerun affected coverage plus the aggregate as required. Preserve previous run records as history. An unchanged app source tree with changed tests still needs a clearly identified tested revision; do not use ambiguous HEAD labels.

## 3. State updates

Update `state/PROJECT_STATE.md`, `state/REQUIREMENT_STATUS.md`, and `state/EVIDENCE_INDEX.md` with the actual base, active continuation, target, North Star hash, tested commit, handoff, and evidence path. Preserve parent requirement subsets as partial where the mature scope is still deferred.

Root state remains `awaiting_review`, accepted version remains unset, and a successful delivery may state `ready_for_review` in its implementation handoff. A blocked delivery must explicitly say BLOCKED and identify the missing evidence; it is not a successful v0.1 release.

This packet does not grant Luna architect acceptance authority. Do not create a release/tag, change the project to accepted, merge a PR under this chapter, or start a next feature chapter.

## 4. Required handoff sections

### Control record

Record chapter `CH-001R-r2`, parent `CH-001-r1`, repo/branch, starting commit, T, exact tested tree, North Star hash `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`, run ID, execution host, status, and E in the final external response. Include the diff scope from the reviewed baseline and any intervening changes.

### Commands and actual counts

For install/setup and every required root check: command, UTC start/end, exit code, discovered/executed/passed/failed/skipped counts where meaningful, and actual log/report path. Distinguish typecheck/build commands from test suites. Never attach zero tests to a PASS test suite.

### Gates and findings

List all 72 IDs with PASS/FAIL/NOT_RUN and evidence links. Report totals calculated from the ledger. For R01–R11, identify the repair, reproducer/test, actual outcome, and any remaining limitation. A suspected consequence may be disproved by a precise regression; record that evidence rather than claiming an unnecessary fix.

### User journey and output

State whether the real seven-slide UI journey completed. Include project/revision identifiers from synthetic data, all required screenshots, the actual ZIP, post/manifest/image hashes, and final-preview body comparisons. Label screenshots with build/environment and what they demonstrate.

### Lifecycle and containment

Summarize migration reruns, owner setup race, process/container restarts, worker recovery/attempt limits, lease fencing, storage failures, sandbox and browser-env checks, runtime network observation, and auth/upload containment. Explain exactly which tests were real versus isolated or simulated.

### Limitations and actions

List remaining defects, unavailable environments, skipped evidence, and support-matrix limits. Declare provider calls, spend, social authorization, publishing, deployment, releases, Git writes, and CI activity accurately. Do not say “no network” if packages or CI were used; distinguish install/test infrastructure from forbidden provider runtime calls.

## 5. Acceptance checklist for the next architect review

A new implementation can be considered for acceptance only when the original 72 gates have their specified evidence, all mandatory executable checks pass, blocker findings are resolved, real artifacts are available, and the supplied commit identities match the tested code.

The next reviewer must still inspect the code changes and evidence. All-green counts are necessary here but not sufficient if tests are vacuous, artifacts are inaccessible, a serious source defect remains, or scope drift occurred. Do not derive a feature-completion percentage from the count.

Expected decision choices:

| Decision | Meaning |
|---|---|
| ACCEPTED | Architect has independently reviewed the candidate evidence and implementation sufficiently for this bounded checkpoint. Not a public security guarantee. |
| REPAIR_REQUIRED | In-scope defects, incomplete assertions, or misleading/missing evidence require another bounded pass. |
| BLOCKED | A necessary external capability or unresolved baseline issue prevents completing the required review evidence. |

Neither REPAIR_REQUIRED nor BLOCKED authorizes v0.2. READY_FOR_ARCHITECT_REVIEW is Luna's delivery status, not the architect's acceptance verdict.

## 6. Final Luna response template

```text
Status: READY_FOR_ARCHITECT_REVIEW | BLOCKED
Chapter: CH-001R-r2; target v0.1.0
Repository/branch:
Starting commit:
Implementation commit T (full SHA + link):
Evidence/handoff commit E (full SHA + link):
Tested tree/clean status:

Commands: each required command, exit code, actual test counts, evidence reference.
Gate totals: PASS / FAIL / NOT_RUN; total must be 72.
Finding disposition: R01–R11, each linked to repair/test or disproof.
Seven-slide UI journey: completed / not completed; reason.
Artifacts: actual screenshots, ZIP, manifest, hash comparison, logs, runtime records.
Remaining blockers/limitations:
External-action declaration:
Root state: awaiting_review; accepted version: unset.
Next action: architect review; no next feature work started.
```

Keep it factual and brief enough to navigate, with the detailed evidence in the repository. Never claim successful runtime work that was only planned or source-inspected.
