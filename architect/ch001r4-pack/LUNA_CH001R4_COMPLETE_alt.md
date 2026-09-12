# CH-001R-r4 — Complete architect and Luna operational packet

Frozen T3 publication, one bounded live proof, and evidence retrieval. Not a feature chapter or application acceptance.

- [README.md](#part-1)
- [01_ARCHITECT_DECISION.md](#part-2)
- [02_OWNER_PUBLISH_RUNBOOK.md](#part-3)
- [03_LUNA_EXECUTION.md](#part-4)
- [04_EVIDENCE_AND_HANDOFF.md](#part-5)
- [LUNA_START_PROMPT.md](#part-6)
- [05_SOURCES.md](#part-7)
- [VALIDATION_REPORT.md](#part-8)


---

<a id="part-1"></a>

# CH-001R-r4 — Publish the frozen implementation and obtain live proof

**For Kyle and Luna MAX. Target application: v0.1.0. Acceptance: false.**

This is an operational continuation of CH-001R-r3, not another application implementation chapter. Do not rebuild the editor, broaden the tests into a new product milestone, or start v0.2. The immediate task is to get the already-authored bounded proof onto an authorized GitHub runner and bring back reviewable results.

## Current decision

Retain the handoff status `NEEDS_WORKFLOW_DISPATCH`, with **workflow publication to the default branch** as its immediate prerequisite. Retain root state `awaiting_review` and accepted version `none`.

GitHub could read T3 and E3 by their exact SHAs during this review. However, the observed `main` remained at `a5afe2d8d1bc7741a0276513f3f1111d3ff587ae`; the workflow was absent at that branch snapshot. The repository's workflow-dispatch run query returned zero runs. Readability of a commit object does not establish that the branch was updated. See [the review](#part-2) and its pinned sources.

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

1. [Architect decision](#part-2): what was independently inspected, what was only reported, and the limited next action.
2. [Owner publication runbook](#part-3): authorization, exact-object transfer if needed, non-destructive publication, and branch/workflow verification.
3. [Luna execution assignment](#part-4): once publication is available, select or dispatch one exact-T3 run and collect its real result.
4. [Evidence and handoff contract](#part-5): identify the tested implementation, workflow definition, run attempt, artifacts, and remaining parent gates.

The [starting prompt](#part-6) is ready to paste. [CONTROL_RECORD.json](#control-record) is a planning/snapshot record, not a generated test report. [Sources](#part-7) provides pinned repository references and current official documentation.

**Read this attachment before committing it to main.** Publish the original T3/E3 history first. Adding a new packet commit to the old remote main first would create unnecessary branch divergence.

## Three separate outcomes

**Publication:** T3 is an ancestor of remote main; the reviewed workflow exists on the default branch; E3 is also retained.

**Bounded live proof:** the correct hosted run actually exercises its assigned browser/database/worker/export/lifecycle assertions and supplies retrievable evidence. `pnpm proof:ch001` is the bounded command.

**Application acceptance:** all original CH-001 requirements receive their prescribed evidence and an architect accepts them. `pnpm verify:ch001` remains the strict full-contract verifier. A successful bounded run is not automatically a successful full verifier.

The current r3 result is reported as **4 source-only PASS / 0 FAIL / 68 NOT_RUN**, not an independent live acceptance finding. Do not reset those reports, mark the unexecuted cases passed, or overwrite the historical 72-NOT_RUN ledger.

## Stop rule

The successful endpoint of this packet is **live proof ready for architect review**, not v0.1 acceptance. If authorization, workflow execution, identity, or artifacts remain blocked, report that specific blocker and stop. Do not consume another implementation cycle repeating the same unavailable local preflight.


---

<a id="part-2"></a>

# Architect decision — CH-001R-r3 dispatch gate

## 1. Verdict

**Accept the accuracy of the blocked handoff as a status report. Do not accept v0.1.0.**

The next step is operational: publish the frozen implementation using an appropriately authorized repository-write path, then execute and review the existing bounded live proof. There is no new feature assignment and no authorization to weaken the original 72-gate contract.

This review supersedes only the immediate next-action instructions from the prior follow-up. It does not rewrite CH-001, the North Star, historical results, or the r3 bounded proof's scope.

## 2. Independently inspected facts

The GitHub connector returned the following during this review. Pinned links and documentation are in [05_SOURCES.md](#part-7).

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

Bash treats this as command substitution, not literal Markdown. A safe isolated reproduction performed for this review produced blank identity/exit fields and `command not found` messages, with overall exit 0 when the supplied proof exit was 0. See [verification/summary_shell_reproduction.json](#shell-reproduction). **That reproduction is not an application or CI test.** [R05]

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


---

<a id="part-3"></a>

# Owner runbook — publish exact T3/E3, then dispatch once

These commands are instructions for an authorized operator. They were **not executed against the repository** by the packet author. Use Bash/Git Bash from a clone containing the original commits. Stop on failed checks. Never paste tokens, private keys, cookies, or `.env` content into chat, a handoff, or a committed file.

## A. Choose an authorized credential path

The simplest route is an existing owner-controlled clone with an authenticated Git writer permitted to update workflows. This is an owner action, not a request for Luna to elevate its managed credentials.

For an owner-controlled GitHub CLI OAuth login, inspect the active account locally. If appropriate, request the additional workflow scope interactively:

```bash
gh auth status --hostname github.com
gh auth refresh --hostname github.com --scopes workflow
# Only if you intend this gh account to be the Git HTTPS credential helper:
gh auth setup-git --hostname github.com
```

`gh auth refresh` expands supported stored OAuth credentials. It is not a universal repair for an environment-injected token, a fine-grained PAT, or a managed connector's authorization. Make sure Git is using the intended writer; changing a gh login does not automatically replace every existing Git credential helper. Inspect account/scope information locally without printing actual tokens. [D01, D05, D11]

Alternatives are an already-authorized SSH Git writer or an owner-created, repository-restricted fine-grained token stored via a secure credential manager. For workflow-file writes, the fine-grained path needs the relevant **Contents: write and Workflows: write** permissions. Dispatch is a separate operation requiring **Actions: write** for fine-grained/API access. A classic/OAuth writer needs repository access and the additional workflow scope for workflow-file modification. The GitHub account itself must have the required repository permissions. [D02, D03]

Do not disable branch protections, change repository visibility, grant broad organization administration, expose a Docker socket remotely, or put a PAT in the workflow. An SSH push does not give gh API permission automatically; a signed-in owner can also dispatch using the Actions page once the workflow exists. [D04]

## B. Preserve exact objects before changing anything

```bash
set -euo pipefail
REPO='klole/reel-farm'
T3='0b79ed07a25a618ab4da2bf56a2fed6047398cb5'
E3='4cf020317cfc2e8755f35ee6da10f7397c8676f2'
B3='a5afe2d8d1bc7741a0276513f3f1111d3ff587ae'
WF='.github/workflows/ch001-live-proof.yml'
WF_BLOB='4a1b045e4771901713a2ad00705a0a84c9ff1dab'
WF_SHA256='c94526b66f6f21f2d4228491854f8df1e2b666796816f3d3b18e7da6c8313f1d'

git rev-parse --show-toplevel
git status --short
# Confirm origin is klole/reel-farm locally; do not publish credential-bearing URLs.
git remote get-url origin

git cat-file -e "$T3^{commit}"
git cat-file -e "$E3^{commit}"
test "$(git rev-parse "$T3^")" = "$B3"
test "$(git rev-parse "$E3^")" = "$T3"
test "$(git rev-parse "$T3^{tree}")" = '2852c9a96595e9aca234aa30f449ec615a4b43bd'
test "$(git rev-parse "$T3:$WF")" = "$WF_BLOB"
test "$(git rev-parse "$E3:$WF")" = "$WF_BLOB"
git diff --name-only "$T3" "$E3"
```

The last command must show only the five E3 documentation/state paths listed in the architect decision. Inspect the actual diff. Do not merge unreviewed local edits into the frozen proof commit. Preserve existing untracked user dispatch/log files; do not use `git clean`, hard-reset the workspace, or stage everything indiscriminately.

### When the owner clone lacks T3/E3

A normal clone of old main may not contain the unpublished commits. During this review the API could read both objects, but that is not a guarantee that Git will fetch an unadvertised SHA indefinitely. An exact-SHA fetch is permissible; verify it before proceeding:

```bash
git fetch origin 4cf020317cfc2e8755f35ee6da10f7397c8676f2
git cat-file -e 4cf020317cfc2e8755f35ee6da10f7397c8676f2^{commit}
git cat-file -e 0b79ed07a25a618ab4da2bf56a2fed6047398cb5^{commit}
```

If unavailable, transfer an exact Git bundle from Luna's original clone, not copied files or a newly recreated commit. A ZIP of working-tree files cannot preserve these original commit identities by itself.

One bundle pattern, run only in the original clone, is:

```bash
set -euo pipefail
B3='a5afe2d8d1bc7741a0276513f3f1111d3ff587ae'
E3='4cf020317cfc2e8755f35ee6da10f7397c8676f2'
TRANSFER='transfer/ch001r3-e3'
git cat-file -e "$E3^{commit}"
git merge-base --is-ancestor "$B3" "$E3"
if git show-ref --verify --quiet "refs/heads/$TRANSFER"; then
  test "$(git rev-parse "refs/heads/$TRANSFER")" = "$E3"
else
  git branch "$TRANSFER" "$E3"
fi
# Choose a new private destination outside the repository; do not overwrite a bundle.
DEST="${HOME}/ch001r3-transfer-$(date -u +%Y%m%dT%H%M%SZ).bundle"
test ! -e "$DEST"
git bundle create "$DEST" "refs/heads/$TRANSFER" "^$B3"
git bundle verify "$DEST"
printf 'Transfer this exact bundle securely: %s\n' "$DEST"
```

On the owner clone, first fetch main so the bundle prerequisite B3 exists; verify the bundle, then fetch its named ref. Use a new destination ref and do not force an existing one. Re-run every identity check above. The bundle contains only committed history from B3 to E3, not local ignored proof outputs; those outputs require a separate sanitized transfer if later needed. [D10]

## C. Publish without rewriting history

**Recommended: one fast-forward push to E3, which retains T3 unchanged as its parent.** This publishes the workflow and the handoff together. Testing will still explicitly check out T3.

Use the same shell variables from section B:

```bash
set -euo pipefail
git fetch origin refs/heads/main:refs/remotes/origin/main
REMOTE_BEFORE=$(git rev-parse refs/remotes/origin/main)
printf 'Remote main before publication: %s\n' "$REMOTE_BEFORE"

if git merge-base --is-ancestor "$E3" refs/remotes/origin/main; then
  printf '%s\n' 'E3 and its T3 parent are already retained on main; no push needed.'
else
  if ! git merge-base --is-ancestor refs/remotes/origin/main "$E3"; then
    printf '%s\n' 'STOP: main diverged. Preserve both histories; do not force, rebase, squash, or cherry-pick.' >&2
    exit 1
  fi
  git push origin "$E3:refs/heads/main"
fi

git fetch origin refs/heads/main:refs/remotes/origin/main
git merge-base --is-ancestor "$T3" refs/remotes/origin/main
git merge-base --is-ancestor "$E3" refs/remotes/origin/main
W=$(git rev-parse refs/remotes/origin/main)
printf 'Published main/workflow-definition candidate: %s\n' "$W"
test "$(git rev-parse "$W:$WF")" = "$WF_BLOB"
ACTUAL_WORKFLOW_HASH=$(git show "$W:$WF" | python3 -c 'import hashlib,sys; print(hashlib.sha256(sys.stdin.buffer.read()).hexdigest())')
test "$ACTUAL_WORKFLOW_HASH" = "$WF_SHA256"
```

Alternatively, when remote main is still an ancestor of T3, a non-force `git push origin "$T3:refs/heads/main"` followed by `git push origin "$E3:refs/heads/main"` preserves the same identities. Do not use an ambiguous `git push origin main` from an unchecked local branch.

If protections require a PR, respect them and preserve the original T3/E3 history through an approved non-squash merge. Do not change protections to avoid review. If another packet was committed first and histories diverged, stop with the actual graph and obtain a narrowly reviewed merge decision. After any approved merge, verify T3 ancestry and the workflow blob again.

If the push is rejected for missing workflow permissions, it has **not** completed. Do not substitute an API file-create call that makes a different commit and call it T3. An authorized Git-data ref update could preserve existing commits, but it still needs the correct write authorization, ancestry checks, and explicit non-force behavior. This runbook uses Git push to make the intended history clear.

## D. Verify default-branch registration before dispatch

```bash
gh api repos/klole/reel-farm --jq '{default_branch,private}'
gh api repos/klole/reel-farm/branches/main --jq '.commit.sha'
gh api 'repos/klole/reel-farm/contents/.github/workflows/ch001-live-proof.yml?ref=main' --jq '{path,sha}'
gh workflow view ch001-live-proof.yml --repo klole/reel-farm --ref main --yaml
```

Require default branch `main`, the approved public/standard-runner setup, and the reviewed workflow blob. Inspect changes if the branch moved since section C. GitHub manual dispatch requires the workflow to exist on the default branch; choosing `--ref` alone is not a substitute for publication. [D04, D06]

Do not add new triggers to sidestep registration. If the workflow is disabled or repository policy blocks Actions, return the policy observation to Kyle instead of altering settings automatically.

## E. Dispatch exactly once, or resume an existing matching run

First inspect current runs. A previous operator may already have submitted the exact task:

```bash
gh run list --repo klole/reel-farm --workflow ch001-live-proof.yml \
  --event workflow_dispatch --limit 20 \
  --json databaseId,headSha,createdAt,status,conclusion,event,url
```

If no existing matching run is present, record UTC submission time and W, then use the requested command:

```bash
date -u +%Y-%m-%dT%H:%M:%SZ
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main \
  -f implementation_sha=0b79ed07a25a618ab4da2bf56a2fed6047398cb5
```

Record the returned run URL/ID when the installed CLI supplies it. The current REST documentation also describes a dispatch response with the new run ID and URLs; older clients/API behaviors may require listing runs afterward. Do not assume that an empty response means failure, and do not automatically repeat a submission after a network interruption. [D03, D06]

List candidates again when necessary. A recent timestamp or a `headSha` match is not sufficient on its own. The workflow's branch-definition SHA may be E3, while its checkout/test input must be T3. Match actor/time/workflow/ref and verify the exact implementation in the checkout step and uploaded `dispatch.txt`/proof reports. Use one recorded run ID and attempt thereafter, not “the latest run.”

A GitHub Actions page dispatch is an equivalent owner route after publication: select this workflow, branch main, and the exact T3 input. Do not run both the UI and CLI paths for the same task. [D04]

## F. What the owner returns

Return the remote main/workflow-definition SHA, exact run URL or numeric run ID, run attempt, and whether the workflow actually started. If it did not, return the sanitized publication/dispatch error. Never return credentials.

Luna then follows [03_LUNA_EXECUTION.md](#part-4). A submitted or green run is not yet a full acceptance result.


---

<a id="part-4"></a>

# Luna MAX assignment — CH-001R-r4

## Goal and effort

Use the highest available effort setting for careful inspection, exact identity handling, and evidence review. **MAX effort does not authorize broader scope, new permissions, unlimited reruns, or a rebuild.**

Execute the existing CH-001R-r3 bounded proof against frozen T3 and return a complete operational handoff. This packet is the authority for the publication/dispatch/evidence step. The North Star, original CH-001 gates, and r3 bounded proof remain unchanged.

## Phase 0 — inspect, do not restart implementation

Read this packet, the pinned E3 handoff, its evidence index, project state, and the workflow at T3. In your workspace record the actual HEAD, tracked changes, and relevant branches without publishing secrets. Preserve pre-existing untracked user files.

The identities are:

```text
T3: 0b79ed07a25a618ab4da2bf56a2fed6047398cb5
E3: 4cf020317cfc2e8755f35ee6da10f7397c8676f2
B3: a5afe2d8d1bc7741a0276513f3f1111d3ff587ae
Workflow: .github/workflows/ch001-live-proof.yml
Workflow blob: 4a1b045e4771901713a2ad00705a0a84c9ff1dab
T3 tree: 2852c9a96595e9aca234aa30f449ec615a4b43bd
```

Do not replace T3 with local HEAD merely because E3 or this operational packet has been committed. `implementation_sha` stays T3. If code has already changed beyond it, report the graph and stop for an explicit new test-target decision.

## Phase 1 — publication gate

Read remote main and confirm T3 ancestry, E3 retention, and the workflow blob. Use [02_OWNER_PUBLISH_RUNBOOK.md](#part-3).

If the authorized connection can make the required non-force publication and Kyle has assigned this operational packet, use that existing permission. Do not claim that every connector shares the failed OAuth token's restrictions. Conversely, the fact that the connector can read T3 is not proof that it can publish workflow files.

If no suitably authorized write path is available, prepare the exact-object transfer/owner command and return `OWNER_ACTION_REQUIRED`. Do not repeatedly retry the same rejected push, request credentials in chat, modify authentication outside the owner's approval, or rewrite workflow content through a different commit as a workaround.

If an owner already published the correct history, skip the push. If a matching live run already exists, skip a new dispatch and proceed to evidence collection. Never force-update main or discard another agent's work.

## Phase 2 — choose and record one dispatch

Verify the workflow definition actually used by main still matches the reviewed blob and approved runner/security scope. Record the full main/workflow-definition commit W immediately before dispatch. Keep unreviewed concurrent branch changes out of the proof.

Allowed dispatch:

```bash
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main \
  -f implementation_sha=0b79ed07a25a618ab4da2bf56a2fed6047398cb5
```

Use a supported authenticated CLI/UI/API path; do not issue a POST through a read-only fetch tool. No change to workflow triggers, branch protections, repository visibility, runner class, paid services, or runtime token scope is authorized.

Record the actual run ID, attempt number, triggering actor, event, branch, and timestamps. A run list entry is a candidate until the requested input and checked-out HEAD are verified. If the submission response is ambiguous, look for the already-created run before issuing any other dispatch.

Authorization under this packet is one initial matching dispatch, or resumption of an existing one. A rerun requires an explicit reason and a new recorded attempt; do not start a blind retry loop or overwrite prior failure evidence.

## Phase 3 — inspect the hosted result

Use the actual run and job records. Observe whether checkout, frozen installation, Docker/Compose probes, proof invocation, evidence upload, and final exit-preservation steps occurred. A Docker probe marked `continue-on-error` is not evidence of Docker availability; inspect the later coordinator/environment result.

The following are reasons to stop with a specific non-pass result, not reasons to weaken a test:

- workflow registration/dispatch/policy failure;
- runner or container prerequisite unavailable;
- failed install/build/migration/browser/worker assertion;
- source identity mismatch;
- no live test discovery or execution;
- missing, expired, unsafe, or wrong-run artifact;
- incomplete proof or contradictory exit/report identity.

Do not interpret shell errors from the known Markdown-backtick summary defect as application test failures. Also do not conceal them. Preserve them as workflow reporting defects and verify identity from `dispatch.txt`, checkout output, and machine-readable reports instead.

If the run is still in progress when your execution must stop, return `DISPATCH_SUBMITTED_PENDING` with its exact ID/attempt and last observed step. Do not call it proof-ready and do not promise an unobserved future result.

## Phase 4 — collect evidence, not just a green check

Follow [04_EVIDENCE_AND_HANDOFF.md](#part-5). Download only the matching sanitized artifact, record metadata/expiry and hashes, inspect the seven-slide export and alternate format, and verify the proof's identity and actual assertion counts.

Expected artifact name for the inspected workflow:

```text
ch001-live-proof-<GitHub run ID>-<run attempt>
```

Expected coordinator run identity:

```text
r3-<GitHub run ID>-<run attempt>
```

The path/name uses `r3` because the code under test is the original r3 coordinator. Do not rename evidence fields to r4 merely to match this operational packet. Record that CH-001R-r4 collected an r3 implementation proof.

Do not edit downloaded machine reports or merge partial results from different runs into a synthetic all-green result. A small evidence-only index may reference the original artifact and separately explain findings.

## Phase 5 — stop with an auditable handoff

Write `handoffs/CH-001R-r4.md` and `docs/evidence/CH-001R-r4/README.md` after collecting actual results. Update root operational state to point to them while retaining `awaiting_review`, accepted version `none`, T3 as the tested implementation, and the unchanged historical evidence.

If committing these documents is authorized and available, make a separate evidence-only commit E4. Do not alter T3 or pretend that E4 was executed by the runner. Record E4's SHA externally after committing; do not try to embed a commit's own final SHA in that same commit's content.

If evidence cannot be pushed, return the local E4 SHA and transferable sanitized files, explicitly marked unpublished. Do not replace a real run URL with an imagined repository link.

## Allowed change surface

Only operational handoff/state/evidence-index documents and local transfer/evidence files are in scope. Application code, package manifests/lockfiles, test semantics, original acceptance files, and the workflow itself remain frozen. Newly observed failures become a precise follow-up finding, not an opportunity to begin v0.2 or silently create T4.

No fal.ai, ScrapeCreators, Pinterest, TikTok/direct official TikTok API, publishing bridge, automation, analytics, teams, billing, video, public deployment, release, or tag creation is authorized. No real social account or provider secret is needed.

## Completion status

Use one of the following task-level outcomes, with root state still awaiting review:

| Outcome | Meaning |
|---|---|
| `OWNER_ACTION_REQUIRED` | Publication/authentication/policy gate remains. Give the exact missing action. |
| `DISPATCH_SUBMITTED_PENDING` | An identified run exists but no completed result has been observed. |
| `BLOCKED_ENVIRONMENT` | The identified runner measured an unavailable prerequisite before assigned live assertions could complete. |
| `LIVE_PROOF_FAILED` | An assigned assertion or build/runtime step genuinely failed. Preserve the first failure and artifact. |
| `EVIDENCE_INVALID` | Run identity, artifact integrity, completeness, or retrievability is insufficient. |
| `LIVE_PROOF_READY_FOR_REVIEW` | The assigned bounded proof completed and its evidence is available for architect review. This is not v0.1 acceptance. |

Do not require every original CH-001 gate to pass to return a successful **bounded** proof. Equally, do not treat bounded success as passing all 72. List the remaining original gates honestly and stop for the next architect decision.


---

<a id="part-5"></a>

# Evidence collection and architect handoff

## 1. Identity comes before conclusions

Record these identities separately. Their values may legitimately differ.

| Field | Meaning |
|---|---|
| `implementation_sha` | T3 requested by the dispatch and actually checked out/tested. |
| `implementation_tree` | T3's source tree; expected `2852c9a96595e9aca234aa30f449ec615a4b43bd`. |
| `workflow_definition_sha` | Commit W from which GitHub loaded the workflow definition. This can be E3/main, not T3. |
| `workflow_blob_sha` | Exact workflow-file blob used; compare with reviewed `4a1b045e4771901713a2ad00705a0a84c9ff1dab`. |
| `github_run_id` / `run_attempt` | The exact hosted execution and attempt. |
| `coordinator_run_id` | Expected `r3-<run_id>-<attempt>` for this workflow. |
| `job_ids` | Actual jobs belonging to the selected attempt. |
| `artifact_ids` | Actual retained upload(s), matched by name and selected execution. |
| `evidence_commit` | E4, if a later docs-only handoff commit is created. |

A run's `headSha` is not automatically the tested implementation: this workflow explicitly checks out its `implementation_sha` input. If main is E3, that distinction is expected. The displayed summary also has a known quoting defect. Require agreement among the dispatch input/receipt, exact-HEAD checkout check, `dispatch.txt`, `proof-result.json`, and suite/report identities. Do not accept a user-entered SHA field alone as proof of checkout.

Re-fetch workflow bytes at the actual W if main moved during dispatch. If the bytes differ from the reviewed workflow or the runner/scope changed, hold the result for a new source review rather than silently accepting it.

## 2. Retrieve one recorded execution

The following commands are examples for a run that actually exists. Supply the real numeric run ID and attempt; no IDs have been assigned by this packet.

```bash
set -euo pipefail
REPO='klole/reel-farm'
: "${RUN_ID:?Set RUN_ID to the exact observed numeric GitHub run ID}"
: "${ATTEMPT:?Set ATTEMPT to the exact observed run attempt}"
[[ "$RUN_ID" =~ ^[0-9]+$ ]]
[[ "$ATTEMPT" =~ ^[1-9][0-9]*$ ]]
OUT=$(mktemp -d "${TMPDIR:-/tmp}/ch001r4-evidence.XXXXXXXX")
ARTIFACT_NAME="ch001-live-proof-${RUN_ID}-${ATTEMPT}"

# Treat API responses/logs as private until sanitized; do not blindly commit them.
gh api "repos/$REPO/actions/runs/$RUN_ID/attempts/$ATTEMPT" > "$OUT/run.json"
gh api --paginate "repos/$REPO/actions/runs/$RUN_ID/attempts/$ATTEMPT/jobs?per_page=100" \
  --jq '.jobs[] | {id,name,status,conclusion,started_at,completed_at,html_url,steps}' \
  > "$OUT/jobs.jsonl"
gh api --paginate "repos/$REPO/actions/runs/$RUN_ID/artifacts?per_page=100" \
  --jq '.artifacts[] | {id,name,size_in_bytes,expired,created_at,expires_at,digest,workflow_run}' \
  > "$OUT/artifacts.jsonl"

# Run only once logs/artifacts exist; a missing artifact remains a real finding.
gh run view "$RUN_ID" --repo "$REPO" --attempt "$ATTEMPT" --log > "$OUT/job-output.private.log"
gh run download "$RUN_ID" --repo "$REPO" --name "$ARTIFACT_NAME" --dir "$OUT/public-evidence"
printf 'Evidence downloaded to: %s\n' "$OUT"
```

These commands use real run/attempt metadata and a matching named artifact. See official references D07–D09 and D12–D13 in [05_SOURCES.md](#part-7). If an API/CLI capability differs on the operator's installed version, preserve the actual error and use an equivalent documented read. Do not guess an artifact URL or silently switch to another run.

Inspect artifact metadata before download: name, ID, timestamps, expiry and selected run association. On multiple attempts, do not use a prior attempt's similarly named upload. If raw archives are retained for transfer, also calculate their SHA-256. An artifact ZIP digest, a sample export ZIP digest, and each JPEG digest are different values; never substitute one for another.

## 3. Expected evidence, conditional on what actually executed

The r3 handoff describes public reports including `proof-result.json`, `environment.json`, `command-report.json`, `gate-results.json`, `verifier-result.json`, suite reports, `finding-dispositions.json`, `sanitization.json`, and `artifact-manifest.json`. The workflow additionally writes `dispatch.txt` before installing dependencies. Read their actual schema and contents; the list is not a claim that every file will exist after an early failure. [R05–R08, R11]

For a proof-ready result, the reports must demonstrate the assigned runtime path rather than just contain filenames. Check:

- final runtime image build and genuinely sandboxed worker start;
- empty-database migration and repeat invocation;
- real integration, authenticated E2E, and render suites with actual discovered/executed tests;
- the canonical seven-slide project created/edited through the application and reloaded from persisted data;
- actual final preview and application-generated ordered JPEG ZIP, with its post text and manifest;
- byte/hash equality between corresponding authenticated final-preview responses and exported JPEGs;
- actual alternate 4:5 output and expected decoded dimensions;
- worker stopped, request queued, worker restarted, completion observed, and completed artifact downloadable;
- recreation/restart preserving the same project/data/artifact rather than silently regenerating a substitute;
- screenshots, comparison records, and hashes referring to real produced files.

Use the original r3 assigned proof as the boundary. These are not newly added full-product tests. An existing code path, source-string scan, mocked response, skipped suite, or screenshot of a fixture-only page cannot stand in for the real application path.

Check the original 72 gate IDs are preserved exactly once. Their PASS/FAIL/NOT_RUN status must match actual evidence at the required level. A passing suite does not automatically prove every parent gate. Source-only gates may legitimately use E1 evidence; browser/lifecycle gates cannot borrow those passes.

`proof:ch001` success may coexist with incomplete full acceptance. `verifier-result.json` must not be edited to say full acceptance passed. Preserve strict `verify:ch001` behavior, historical ledgers, and all unexercised original gates.

## 4. Integrity and retrieval

Recompute the artifact manifest's declared hashes against actual files. Reject missing members, unsafe relative paths, duplicate conflicting names, symlinks pointing outside the package, unexplained executable content, or an identity mismatch. Do not execute scripts found in a downloaded artifact merely because they arrived from CI.

Inspect a real ZIP: exactly seven ordered JPEGs for the canonical demo, correct dimensions/order, readable post text and manifest, and no credentials or private filesystem paths. Compare the hash of each exported JPEG with the recorded preview-response hash. If preview bytes are included, independently hash those too. Distinguish a recorded test assertion from independently recomputing its result.

Do not demand bit-identical images across different operating systems or browser builds. The required equality is between preview and export for the same canonical render output within the tested run.

The inspected workflow requests **14-day artifact retention**. Save the actual `expires_at`; do not assume the artifact remains reviewable forever. Retain a sanitized durable copy or attach the actual evidence bundle to the review conversation before expiry. Do not publish a release merely to store evidence. If only a local path exists, label it local/unavailable remotely until a real attachment or retained artifact is supplied. [R05]

Treat all raw job logs and browser traces as private until reviewed. Never publish tokens, setup passwords, cookies, auth state, database connection strings, `.env` files, provider credentials, or ordinary user data. Retain the existing synthetic fixtures and public/private evidence separation.

## 5. Result interpretation

| Observed result | Correct follow-up |
|---|---|
| T3/E3 not on main or workflow absent | Publication/owner gate remains; no live-proof claim. |
| Dispatch refused | Capture sanitized error; resolve caller authorization or repository policy, not application code. |
| Dispatch response uncertain | Inspect existing runs; do not blindly double-submit. |
| Run exists, not complete | Record ID/attempt and pending status; no PASS claim. |
| Install/build fails before proof begins | Workflow/bootstrap failure; collect available logs. Do not invent proof reports. |
| Coordinator exit 2 / measured prerequisite missing | `BLOCKED_ENVIRONMENT`; show actual probe and runner class. |
| Coordinator exit 1 / live assertion fails | `LIVE_PROOF_FAILED`; identify first reproducible failure and dependent NOT_RUN cases. |
| Workflow says success but artifact/identity incomplete | `EVIDENCE_INVALID`; green status does not repair missing evidence. |
| Correct run, complete assigned proof, valid retrievable artifact | `LIVE_PROOF_READY_FOR_REVIEW`; root still awaiting review. |
| Bounded proof ready but some original gates incomplete | Return a precise remaining-gate list. Do not begin v0.2 or issue full acceptance. |

A tiny early `dispatch.txt` artifact is useful evidence of identity/entry into the job, not proof of a successful application journey. Conversely, an early failure before checkout may produce no artifact at all; job logs remain useful, but the result is not proof-ready.

## 6. Required final handoff template

Write this as an evidence-only result, replacing placeholders with actual observations. Do not prefill an unknown numeric identifier or command result.

```text
CH-001R-r4 — operational handoff
Task status: OWNER_ACTION_REQUIRED | DISPATCH_SUBMITTED_PENDING |
             BLOCKED_ENVIRONMENT | LIVE_PROOF_FAILED |
             EVIDENCE_INVALID | LIVE_PROOF_READY_FOR_REVIEW
Application acceptance: false
Root state: awaiting_review
Accepted version: none

Identity:
  T3 requested:
  T3 actually checked out:
  Implementation tree / tracked-tree cleanliness:
  Main before/after publication:
  E3 retained on main:
  Workflow-definition SHA W:
  Workflow blob / SHA-256:
  GitHub run URL / ID:
  Run attempt:
  Coordinator run ID:
  Job IDs / URLs:
  Artifact name / ID / expiry / actual retrieval reference:
  Evidence-only commit E4, if created:

Actual execution:
  Dispatch time UTC / actor / event / ref:
  Final workflow and proof-step conclusions:
  Coordinator command and exit:
  Install/build/migration/worker outcomes:
  Per-suite discovered/executed/passed/failed/skipped counts:
  Canonical UI / ZIP / preview-equality outcome:
  Alternate-format outcome:
  Worker/recreation lifecycle outcome:
  Known summary-quoting defect observed:

Evidence:
  Actual downloaded reports and screenshots:
  Sample ZIP, manifest and JPEG hashes:
  Artifact-integrity/sanitization checks actually performed:
  Missing/expired/unavailable files:
  Independent recomputations versus reporter assertions:

Original CH-001 ledger:
  PASS / FAIL / NOT_RUN totals and exact remaining IDs:
  No historical overwrites or inferred runtime passes:
  Full acceptance verifier result, or explicitly not run:

External actions:
  Actual repository pushes/ref updates:
  Actual dispatches/attempts:
  Credential changes performed by owner, without secret values:
  Actual cleanup limited to run-owned resources:
  No providers, social account authorization, billing,
  deployment, release/tagging, or v0.2 work:

Next decision requested:
  One specific owner action, or one narrowly evidenced repair,
  or review of the completed bounded proof. Then stop.
```

Unknown values remain `not observed`/`null`, not placeholders masquerading as completed evidence. If an E4 commit is created, return its SHA after commit creation rather than editing it into itself. Source-code fixes after this run require a newly identified test target and fresh applicable proof.


---

<a id="part-6"></a>

# Starting prompt — Luna MAX / CH-001R-r4

Use MAX effort. Execute the attached CH-001R-r4 publication/dispatch/evidence packet as an operational continuation of CH-001R-r3, not a new feature or implementation chapter.

Frozen implementation T3: `0b79ed07a25a618ab4da2bf56a2fed6047398cb5`.
Existing evidence E3: `4cf020317cfc2e8755f35ee6da10f7397c8676f2`.
Repository: `klole/reel-farm`.
Workflow: `.github/workflows/ch001-live-proof.yml`.

First inspect actual remote main, T3/E3 ancestry, the reviewed workflow blob, the pinned E3 handoff/state/evidence, and any matching existing workflow run. The architect could read both SHA objects, but observed main still at `a5afe2d8d1bc7741a0276513f3f1111d3ff587ae` and no workflow-dispatch runs. Do not treat object readability as completed publication.

Preserve the original commit identities. Use an already-authorized workflow-capable publication path; otherwise return the exact owner action/transfer instructions, without repeating blocked local preflight or requesting credentials in chat. Do not commit new packet material onto the old main before preserving/publishing the original T3/E3 history.

Once the correct workflow is on the default branch, resume an existing exact-T3 run or dispatch once with `implementation_sha=0b79ed07a25a618ab4da2bf56a2fed6047398cb5`. Record the actual workflow-definition SHA, run ID, attempt, job IDs, and artifact identities. A workflow main/head SHA is not automatically the tested checkout SHA. Use checkout evidence, dispatch.txt, and machine-readable reports; the workflow summary has a known shell-backtick reporting defect.

Download and inspect the matching sanitized artifact. Establish actual execution, canonical seven-slide export and preview equality, alternate format, and assigned lifecycle proof. Preserve zero-test/blocked/failed outcomes honestly. No green-check-only acceptance, stale evidence merge, invented artifact reference, or automatic retry loop is allowed.

Do not modify product code, the frozen workflow, test requirements, dependencies, or the original 72-gate contract. Do not add providers, publishing, scheduling, billing, video, deployment, releases, or v0.2 features. Newly exposed defects return as evidence-backed follow-up findings, not silent T3 rewrites.

Return the specified operational handoff and real IDs/artifacts, or the specific unresolved owner/environment/evidence blocker. `pnpm proof:ch001` is bounded proof; it is not `pnpm verify:ch001` and does not imply all 72 gates passed. Keep application acceptance false, root state awaiting_review, accepted version none, and stop for architect review.


---

<a id="part-7"></a>

# Sources and inspection boundaries

Repository content was read through the connected GitHub tool. Official GitHub/Git documentation was checked for command and permission semantics. These references support the factual observations; recommendations and task boundaries are architect decisions, not claims by those external sources.

## Repository evidence

| ID | Reference | What it supports |
|---|---|---|
| R01 | [Observed main branch API](https://api.github.com/repos/klole/reel-farm/branches/main) | At inspection, main was B3 `a5afe2d8d1bc7741a0276513f3f1111d3ff587ae`. This endpoint is mutable; the snapshot is recorded in CONTROL_RECORD.json. |
| R02 | [Exact T3](https://github.com/klole/reel-farm/commit/0b79ed07a25a618ab4da2bf56a2fed6047398cb5) | Implementation commit identity, parent B3, tree, changed source. |
| R03 | [Exact E3 commit object](https://api.github.com/repos/klole/reel-farm/git/commits/4cf020317cfc2e8755f35ee6da10f7397c8676f2) | E3 is a direct child of T3. |
| R04 | [T3 to E3 comparison](https://github.com/klole/reel-farm/compare/0b79ed07a25a618ab4da2bf56a2fed6047398cb5...4cf020317cfc2e8755f35ee6da10f7397c8676f2) | Exactly five docs/state files changed; no workflow/application changes. |
| R05 | [Workflow at T3](https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/.github/workflows/ch001-live-proof.yml) | Trigger, runner, pins, SHA input/checkout, artifact policy, known shell-summary bug. The same path was absent at B3. |
| R06 | [Handoff at E3](https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/handoffs/CH-001R-r3.md) | Reported local command/gate outcomes, permissions rejection, boundaries and next action. |
| R07 | [Evidence index at E3](https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/docs/evidence/CH-001R-r3/README.md) | Reported partial ledger, absent live artifacts, local-only reports and preservation of historical ledger. |
| R08 | [Project state at E3](https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/state/PROJECT_STATE.md) | awaiting_review, accepted none, T3 identity and deferred scope. |
| R09 | [Workflow-dispatch runs API](https://api.github.com/repos/klole/reel-farm/actions/runs?event=workflow_dispatch&per_page=100) | Returned zero runs at inspection; mutable, not a permanent claim. |
| R10 | [Package scripts at T3](https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/package.json) | Distinct proof:ch001 and verify:ch001 commands. |
| R11 | [Coordinator at T3](https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/scripts/ch001-proof.ts) | Inspected initialization through line 110: actual HEAD reading, run ownership, evidence directory and workflow identity fields. Not a full code audit. |

The evidence directory listing at E3 showed README.md and source-review.md. The full ignored local runtime reports were not retrieved. The five E3 changed-file paths are enumerated in the review. The source-only PASS counts are reported by E3 and are not relabeled independently rerun tests here.

## Official technical references

| ID | Reference | Relevant use |
|---|---|---|
| D01 | [gh auth refresh](https://cli.github.com/manual/gh_auth_refresh) | Expanding supported stored OAuth credentials, active-account handling. |
| D02 | [GitHub repository contents REST API](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents) | Additional workflow scope for classic/OAuth workflow-file writes; Contents/Workflows fine-grained permission sets. |
| D03 | [GitHub workflow dispatch REST API](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) | Dispatch permissions, ref/inputs, current returned run identifiers. |
| D04 | [Manually running a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) | Default-branch workflow requirement and owner UI/CLI dispatch. |
| D05 | [gh auth setup-git](https://cli.github.com/manual/gh_auth_setup-git) | Selecting gh as a Git credential helper. |
| D06 | [gh workflow run](https://cli.github.com/manual/gh_workflow_run) | --ref selects workflow branch/tag; raw input flags; run URL when available. |
| D07 | [gh run list](https://cli.github.com/manual/gh_run_list) | Event/workflow filtering and run discovery fields. |
| D08 | [gh run download](https://cli.github.com/manual/gh_run_download) | Downloading a named artifact for a specific run. |
| D09 | [gh run view](https://cli.github.com/manual/gh_run_view) | Attempt-specific logs and results. |
| D10 | [git bundle](https://git-scm.com/docs/git-bundle) | Exact-object transfer with prerequisite history and bundle verification. |
| D11 | [GitHub CLI environment](https://cli.github.com/manual/gh_help_environment) | Environment-injected credential precedence; distinction from stored login. |
| D12 | [Workflow runs REST API](https://docs.github.com/en/rest/actions/workflow-runs) | Specific execution/attempt metadata. |
| D13 | [Workflow jobs REST API](https://docs.github.com/en/rest/actions/workflow-jobs) and [artifacts REST API](https://docs.github.com/en/rest/actions/artifacts) | Attempt-specific jobs and artifact identities/expiry. |

## What was actually executed for this packet

A small Bash snippet reproducing the workflow summary's backtick behavior was run in isolation using a synthetic run identifier. Its stdout, stderr, and exit code are preserved in verification/summary_shell_reproduction.json. No repository script, app service, GitHub workflow, or provider call was executed by that check.

The packet's own validation covers document integrity, local references, identity consistency, JSON parseability, and shell syntax. It is not v0.1 runtime evidence. No branch update, credential refresh, push, dispatch, publication, or application test was performed during preparation of this packet.

---

<a id="part-8"></a>

# Packet validation

These are document and command-syntax checks, **not application acceptance tests**.

12 checks passed; 0 failed. No repository write, credential change, workflow dispatch, or application test was executed.

| Check | Result | Detail |
|---|---|---|
| Required packet files exist | PASS | 9 required files |
| Local document links resolve | PASS | Every local linked file exists |
| Markdown fences are balanced | PASS | All Markdown documents |
| Embedded Bash snippets pass syntax checks | PASS | 11 snippets; syntax only, no commands executed |
| Frozen identity formats are valid | PASS | Six Git identities and one recorded SHA-256 |
| T3/E3 constants present in execution documents | PASS | Exact full SHAs, not abbreviated test targets |
| No fabricated new run identity | PASS | New run/job/artifact identifiers intentionally unset |
| Acceptance is explicitly false | PASS | No application acceptance assigned |
| Reported historical gate counts reconcile | PASS | Reported 4 / 0 / 68; not independently executed |
| Isolated shell reproduction accurately labeled | PASS | Observed blank summary fields and shell diagnostics; not a CI execution |
| All packet JSON parses | PASS | Planning, shell-reproduction and syntax-report JSON |
| No font or application-export files included | PASS | Document packet only; no sample export claimed |

The isolated shell reproduction is the only behavioral check in this packet. It exercises a safe workflow-summary excerpt, not the slideshow application. The attached Bash instructions were syntax-checked, not run against GitHub or a user clone.

---

<a id="control-record"></a>

# Control record — not test evidence

```json
{
  "record_kind": "ARCHITECT_OPERATIONAL_PACKET_NOT_TEST_EVIDENCE",
  "packet": "CH-001R-r4",
  "target_application_version": "0.1.0",
  "application_accepted": false,
  "root_state": "awaiting_review",
  "accepted_version": null,
  "input_handoff_status": "NEEDS_WORKFLOW_DISPATCH",
  "immediate_prerequisite": "PUBLISH_REVIEWED_WORKFLOW_ON_DEFAULT_BRANCH",
  "repository": "klole/reel-farm",
  "snapshot": {
    "main_sha": "a5afe2d8d1bc7741a0276513f3f1111d3ff587ae",
    "t3_readable_by_sha": true,
    "e3_readable_by_sha": true,
    "workflow_present_at_observed_main": false,
    "workflow_dispatch_run_count_returned": 0,
    "snapshot_not_permanent": true
  },
  "identities": {
    "implementation_sha": "0b79ed07a25a618ab4da2bf56a2fed6047398cb5",
    "evidence_sha": "4cf020317cfc2e8755f35ee6da10f7397c8676f2",
    "implementation_parent": "a5afe2d8d1bc7741a0276513f3f1111d3ff587ae",
    "packet_base": "04b85402c03404fc9f707983594cb796525f6563",
    "implementation_tree": "2852c9a96595e9aca234aa30f449ec615a4b43bd",
    "workflow_path": ".github/workflows/ch001-live-proof.yml",
    "workflow_git_blob": "4a1b045e4771901713a2ad00705a0a84c9ff1dab",
    "workflow_recorded_sha256": "c94526b66f6f21f2d4228491854f8df1e2b666796816f3d3b18e7da6c8313f1d"
  },
  "reported_local_results": {
    "source": "E3 handoff; not independently rerun",
    "run_id": "r3-local-t3-preflight",
    "status": "BLOCKED_ENVIRONMENT",
    "exit_code": 2,
    "unit_tests_passed": 20,
    "security_tests_passed": 4,
    "gates": {
      "PASS": 4,
      "FAIL": 0,
      "NOT_RUN": 68
    },
    "pass_ids": [
      "CH001-067",
      "CH001-068",
      "CH001-069",
      "CH001-072"
    ]
  },
  "new_hosted_evidence": {
    "workflow_definition_sha": null,
    "github_run_id": null,
    "run_attempt": null,
    "job_ids": [],
    "artifact_ids": [],
    "coordinator_exit_code": null,
    "application_tests_executed_by_packet_author": false
  },
  "authority": {
    "frozen_implementation": true,
    "product_code_changes_allowed": false,
    "workflow_changes_allowed": false,
    "initial_dispatch_limit": 1,
    "reuse_existing_matching_run_first": true,
    "force_push_allowed": false,
    "credential_escalation_by_agent_allowed": false,
    "provider_calls_allowed": false,
    "public_deployment_allowed": false,
    "v0_2_work_allowed": false,
    "bounded_proof_is_full_acceptance": false
  },
  "known_reporting_defect": {
    "description": "Unescaped shell backticks in workflow summary echo arguments",
    "isolated_reproduction": "verification/summary_shell_reproduction.json",
    "application_runtime_reproduced": false,
    "block_first_diagnostic_dispatch": false
  }
}
```

<a id="shell-reproduction"></a>

# Isolated shell reproduction — not an application test

```json
{
  "kind": "ISOLATED_SHELL_REPRODUCTION_NOT_APPLICATION_TEST",
  "source": "T3 workflow summary excerpt; synthetic run identifier; no workflow dispatched",
  "exit_code": 0,
  "stdout": "Implementation: \nRun: \nCoordinator exit: \nApplication acceptance: \n",
  "stderr": "bash: line 5: 0b79ed07a25a618ab4da2bf56a2fed6047398cb5: command not found\nbash: line 6: r3-example-1: command not found\nbash: line 7: 0: command not found\n"
}
```
