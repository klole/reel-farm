# Architect decision — CH-001R-r3 dispatch gate

## 1. Verdict

**Accept the accuracy of the blocked handoff as a status report. Do not accept v0.1.0.**

The next step is operational: publish the frozen implementation using an appropriately authorized repository-write path, then execute and review the existing bounded live proof. There is no new feature assignment and no authorization to weaken the original 72-gate contract.

This review supersedes only the immediate next-action instructions from the prior follow-up. It does not rewrite CH-001, the North Star, historical results, or the r3 bounded proof's scope.

## 2. Independently inspected facts

The GitHub connector returned the following during this review. Pinned links and documentation are in [05_SOURCES.md](05_SOURCES.md).

| Observation | Evidence | Interpretation |
|---|---|---|
| Remote `main` pointed to B3, `a5afe2d8d1bc7741a0276513f3f1111d3ff587ae`. | R01 | Re-fetch before any write; this is a snapshot, not a permanent claim. |
| T3 was readable by SHA, with parent B3 and tree `2852c9a96595e9aca234aa30f449ec615a4b43bd`. | R02 | Exact source objects are observable. This does not show successful branch publication. |
| E3 was readable by SHA and its parent is T3. | R03 | E3 can retain T3 unchanged in history. |
| The T3→E3 comparison contains five documentation/state changes, no application or workflow changes. | R04 | Publishing E3 as a fast-forward can publish both original commits without changing T3. |
| The workflow file at B3 returned not found; the T3 workflow file was readable and its Git blob matched the recorded value. | R05 | Default-branch publication is still required at the observed snapshot. |
| The r3 handoff, evidence index, and project state were readable at E3. | R06–R08 | Their `main` links need not work yet; their SHA-pinned forms do. |
| Repository run listing filtered to `workflow_dispatch` returned `total_count: 0`. | R09 | No matching hosted dispatch run was available for this review. This is not a claim about deleted history or other event types. |
| The package has distinct `proof:ch001` and `verify:ch001` scripts. | R10 | Bounded proof and complete acceptance must remain separate. |

The five E3 changes are:

- `docs/chapters/CH-001/COMMANDS.md`
- `docs/evidence/CH-001R-r3/README.md`
- `docs/evidence/CH-001R-r3/source-review.md`
- `handoffs/CH-001R-r3.md`
- `state/PROJECT_STATE.md`

The GitHub connector rejected the workflow-collection read route as unsupported. The workflow's default-branch absence was instead checked by reading its exact file path at B3. Do not mislabel that connector limitation as a repository permission failure.

## 3. Reported, not independently rerun

E3 reports a clean T3 local run named `r3-local-t3-preflight`, coordinator exit 2 / `BLOCKED_ENVIRONMENT`, with lint/typecheck/build, 20 unit tests and 4 security tests passing. It reports denied loopback allocation, absent Docker/Compose, and unavailable managed Chromium. It reports 4 source-only PASS gates (`CH001-067`, `068`, `069`, `072`), zero FAIL gates, and 68 NOT_RUN gates. [R06–R08]

This review did not rerun those commands or retrieve their ignored local raw files. The remotely available evidence directory lists an index and source-review document, not the complete local result bundle. Do not upgrade those reported results to independently reproduced results.

No application export, screenshot, authenticated browser journey, database migration exercise, worker run, container lifecycle proof, or hosted artifact was independently observed. Original R01–R11 findings are not closed merely because r3 describes source fixes. Their runtime dispositions remain open where required.

## 4. Why the immediate fix is authorization, not more product code

The reported rejection concerns creating/updating a file beneath `.github/workflows`. The required writer authorization is distinct from the credentials allowed to dispatch a workflow, and both are distinct from the workflow job's runtime token permissions. [D01–D04]

Changing `permissions: contents: read` to broader runtime permissions would not repair the credential that failed the Git push. Removing the workflow, deleting historical commits, retrying the same unprivileged push, or replacing the real suites with local preflight output would not satisfy the intended proof.

An authorized owner can publish the original commits. This packet recommends a non-force fast-forward to E3 after verifying ancestry and the docs-only comparison. That leaves the test input pinned to T3 while retaining the E3 handoff on main. A sequential T3-then-E3 publication is equally valid. No default-branch force update, rebase, squash, or cherry-pick is needed for the observed history. [R02–R04]

## 5. Dispatch-readiness source review

The inspected workflow uses manual dispatch, a required SHA input, `ubuntu-24.04`, a 60-minute job limit, read-only contents permissions, pinned official action SHAs, a checkout of the requested implementation, an exact-HEAD check, and an ancestry check against `origin/main`. It invokes `pnpm proof:ch001`, uploads only its public evidence directory, and requests 14-day retention. These are inspected configuration facts, not proof that the runner or upload works. [R05]

The proof command intentionally preserves its exit code until after the upload step. The final step must be evaluated along with actual artifacts; the mere existence of an uploaded artifact or an exit-0 intermediate step proves neither a complete live run nor application acceptance.

### One small reporting defect: shell backticks in the workflow summary

The final summary block wraps Markdown backticks inside double-quoted shell `echo` arguments, for example:

```bash
echo "Implementation: `$REQUESTED_SHA`"
```

Bash treats this as command substitution, not literal Markdown. A safe isolated reproduction performed for this review produced blank identity/exit fields and `command not found` messages, with overall exit 0 when the supplied proof exit was 0. See [verification/summary_shell_reproduction.json](verification/summary_shell_reproduction.json). **That reproduction is not an application or CI test.** [R05]

Classify this as a known reporting defect, not a newly reproduced product failure. It does not require changing frozen T3 before the first diagnostic run. The earlier workflow step writes `dispatch.txt` with `printf`, and machine-readable proof reports must establish identity. Do not rely on the rendered summary's blank fields as the authoritative receipt.

A future reviewed workflow-only repair should use `printf '%s\n'` or single-quoted format strings with `%s` arguments. If the workflow is changed, record a new workflow-definition commit W; do not claim its blob is the original blob and do not relabel T3. There is no authorization in this packet to silently amend T3.

## 6. Decision boundaries

Authorized next activity when Kyle dispatches this packet: verify/preserve original commits; use an owner-approved publication path; issue or identify one exact-T3 bounded run; inspect/download/sanitize evidence; write an evidence-only follow-up handoff.

Do not change application code, dependencies, workflow triggers, runner class, security settings, provider integrations, billing, scheduling, publishing, or the acceptance contract under this operational assignment. A newly observed runtime failure returns for a bounded repair decision with its actual evidence.

Do not loop on dispatch failures. If a POST's response is lost or unclear, inspect existing runs before trying again. A subsequent run or attempt is a separate evidence identity and must never overwrite the first record.

## 7. State to carry forward

- Root state: `awaiting_review`.
- Accepted application version: `none`.
- Current handoff status: `NEEDS_WORKFLOW_DISPATCH` until actual publication/dispatch evidence changes it.
- Implementation under test: exact T3, not whichever branch HEAD happens to be current.
- Historical result: preserved, not overwritten by a newer partial ledger.
- Next successful result: `LIVE_PROOF_READY_FOR_REVIEW`, explicitly not acceptance.

This review performed repository reads, documentation research, an isolated shell reproduction, and packet creation. It did not push commits, alter authentication, dispatch Actions, launch the application, or spend provider credits.

