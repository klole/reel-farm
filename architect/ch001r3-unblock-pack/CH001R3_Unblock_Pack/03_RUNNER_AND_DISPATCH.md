# Runner setup and exact unblock path

## Recommendation

Use a **standard GitHub-hosted Ubuntu VM** with the repository's Compose stack, not Luna's restricted editing host and not a new paid VPS. The repository metadata was public at review. GitHub documents standard hosted-runner usage as free for public repositories; that statement does not remove artifact-retention limits, account policies, or larger-runner charges. Use a standard label, short artifact retention, and no paid fallback without approval. [S25, W01]

An ephemeral CI runner is a test environment, not a hosted production deployment of the app. It does not require fal/ScrapeCreators keys or a TikTok app.

## What exists and what is proposed

The inspected repository has suite/coordinator pieces but no qualified end-to-end runner result. This packet proposes a workflow file named `.github/workflows/ch001-live-proof.yml` and a new root command `pnpm proof:ch001`. Neither is claimed to be operational merely because this packet includes a blueprint. Luna must implement and validate them.

The GitHub connector did not support the workflow-collection endpoint attempted during review; this is not evidence that Actions is disabled. No workflow was dispatched. Do not confuse connector API coverage with the repository owner's Actions permissions.

## Runner topology

Recommended job host: `ubuntu-24.04` standard VM. Run the workflow on the VM rather than inside a job container that would itself require Docker-in-Docker. Choose a currently supported standard VM label if this label is no longer available at execution, and record the change. Do not use `ubuntu-slim` for this Compose/browser workload. [W01]

Inside the job:

1. Check out the full supplied implementation SHA, with read-only repository permissions and no persisted Git credentials.
2. Install the repository's pinned Node/pnpm and frozen lockfile.
3. Install the browser revision matched to the pinned Playwright package and its required OS dependencies.
4. Verify Docker daemon access and Compose.
5. Let `proof:ch001` own an isolated Compose project with db, migrate, web and worker plus an optional test-only integration runner.
6. Keep those services alive through the journey and same-data lifecycle checks.
7. Upload only sanitized proof files, including failure evidence when available; clean up only the run-owned resources.

Playwright's official CI guidance separates browser installation from npm dependencies; downloading the npm package alone does not install every browser/system dependency. Its container guidance also addresses non-root Chromium sandboxing and a suitable seccomp profile. Use those as implementation references, not as proof that the shipped image already works. [W02–W03]

## Avoid the reviewed orchestration trap

Do not run the old command sequence as though smoke had already configured it. At T, integration runs before the smoke stack exists; nested smoke E2E sets child-only credentials/base URL; the stack is then removed. The new coordinator must resolve this ownership explicitly.

A workable design is to refactor `ch001-compose-smoke.ts` into setup/assert/teardown helpers and have `proof:ch001` call them. The standalone smoke command can reuse the same helpers. The full verifier later invokes a consistent orchestration mode rather than recursively nesting full tests.

For integration tests that need database access, prefer a dedicated test service on the Compose network or a separate ephemeral integration database. A host process cannot use the service hostname `db` by assumption. Any test-only host binding must be explicit, loopback-only and separate from the product configuration; the preferred route avoids it entirely. [W04]

## Workflow security and reproducibility contract

The included [blueprint](workflow/ch001-live-proof.yml.example) is deliberately manual-dispatch only. Before activating it, Luna must resolve official action tags to immutable commit SHAs, review their provenance, and record those pins. Do not substitute random third-party setup actions.

The workflow must retain:

- `permissions: contents: read`; no provider or production secrets;
- same-repository full-SHA checkout, confirmed by `git rev-parse HEAD`;
- a job timeout and one bounded run, not an automatic retry loop;
- a standard VM, not a larger/billable runner;
- generated per-run synthetic app credentials;
- explicit browser/runtime/image versions in the proof record;
- no normal user `.env` inheritance, database wipe, Docker socket inside the app, or privileged containers;
- `always()` evidence publication with a safe allowlist, not an upload of the whole workspace;
- a distinct name such as **CH-001 live proof — NOT release acceptance**.

The workflow's own configuration SHA and the checked-out implementation SHA may differ because manual dispatch loads a workflow definition from a branch. Record both. Do not pretend `github.sha` alone necessarily identifies the tested code.

## Activation and dispatch

GitHub requires a manual-dispatch workflow to be present on the default branch before it is available for that event. Follow the repository's authorized review/merge process; do not bypass it. [W05]

After Luna implements the command and workflow, the operator can use the repository's **Actions → CH-001 live proof — NOT release acceptance → Run workflow** control. Choose the approved workflow branch and enter Luna's new full implementation SHA, not the old T in this review.

Equivalent CLI, after the workflow actually exists and is approved:

```bash
# Replace the assignment value with the NEW full SHA returned by Luna.
export T3='REPLACE_WITH_NEW_40_CHARACTER_IMPLEMENTATION_SHA'
# Do not execute with the placeholder.
[[ "$T3" =~ ^[0-9a-f]{40}$ ]] || { echo 'Set the real implementation SHA first.' >&2; exit 1; }

gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha="$T3"

gh run list --repo klole/reel-farm \
  --workflow ch001-live-proof.yml --event workflow_dispatch --limit 5
```

Select the run corresponding to the dispatch, verify the input SHA in its summary, then obtain logs/artifacts from that run. Do not automatically pick an unrelated "latest" run. A user-triggered standard public-runner job does not authorize new cloud billing or account changes.

If Luna can trigger the approved workflow using its already-authorized GitHub connection, it may do so within Kyle's dispatched assignment and environment permissions. If it cannot, return `NEEDS_WORKFLOW_DISPATCH` with the exact new SHA and the prepared instruction above. Do not ask Kyle for an API key/PAT in chat or claim the code is verified before the run.

## Local fallback

Use an authorized disposable Linux host with a real Docker daemon, Compose and pinned project tools. Execute the same `proof:ch001` command after installation/browser setup. Do not install a privileged daemon inside a managed sandbox to evade its restrictions. An alternate system Chrome run is diagnostic only unless explicitly qualified; it is not a replacement for the shipped/pinned-browser evidence.

Record which capability failed: CLI missing, daemon denied, pull/DNS failure, database unhealthy, migration failure, Chromium library failure, or sandbox denial. A present Docker binary alone is not a ready environment. An application error once services start is a TEST_FAILURE, not an environment excuse.
