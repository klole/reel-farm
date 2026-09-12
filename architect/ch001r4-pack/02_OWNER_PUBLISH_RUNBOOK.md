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

Luna then follows [03_LUNA_EXECUTION.md](03_LUNA_EXECUTION.md). A submitted or green run is not yet a full acceptance result.

