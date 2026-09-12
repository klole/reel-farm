# Router runbook — save packet, launch Luna, publish preserved commits, dispatch T4

## Authority boundary

The router saves the architect packet and launches Luna MAX. Luna edits and tests the bounded scope. Kyle's already-authorized workflow-capable path handles the push and manual dispatch. This packet does not authorize moving tokens between machines, changing OAuth scope on the editing box, using a personal token in CI, enabling new paid runners, or bypassing branch protection.

The architect has not pushed, dispatched, or started Luna. All T4/E4 values below must come from Luna's actual next handoff.

## 1. Save the packet and start the correct assignment

Save the directory under a discoverable repository location such as `architect/CH001R_r4_CI_Repair_Pack/`. A single combined Markdown reading copy is also supplied. Preserve the packet's hashes and record the real packet commit P4. Do not overwrite the original frozen CH-001 or North Star references.

Use `LUNA_START_PROMPT.md`, highest available effort/MAX, and the existing repo workspace. Tell Luna that the T3 push restriction was already resolved and run `34665615514` is the failed bootstrap baseline. It should not spend its next run repeating the old authorization diagnosis.

## 2. Review Luna's local handoff before publication

Require actual T4 and E4, an allowed-scope diff, feasible local regression results, any remaining unavailable checks, and a workflow blob/hash. Verify that T4 includes both the Docker and Actions bootstrap repairs. The source/workflow fixes cannot exist only in E4 docs or an uncommitted worktree.

Do not publish changes outside this packet merely because the branch is named `main`. No history rewriting, force pushing, squashing, or cherry-picking after T4 is recorded without assigning and reporting a new target SHA. If existing transport preserves the exact commits, retain that route. Do not copy only the YAML and then try to dispatch a T4 that is absent from GitHub.

## 3. Publish through the authorized path

On Kyle's workflow-capable route, transfer and publish the preserved commits using the existing authorized mechanism. The editing box's scope limitation may still prevent it from pushing the workflow commit; that is expected.

In a local clone that contains the commits, replace the placeholders below only with values returned by Luna:

```bash
set -euo pipefail
REPO='klole/reel-farm'
T4='REPLACE_WITH_LUNA_FULL_IMPLEMENTATION_SHA'
E4='REPLACE_WITH_LUNA_FULL_EVIDENCE_SHA'
[[ "$T4" =~ ^[0-9a-f]{40}$ ]] || { echo 'Missing real T4' >&2; exit 1; }
[[ "$E4" =~ ^[0-9a-f]{40}$ ]] || { echo 'Missing real E4' >&2; exit 1; }
git fetch origin main
git cat-file -e "$T4^{commit}"
git cat-file -e "$E4^{commit}"
git merge-base --is-ancestor "$T4" "$E4"
git merge-base --is-ancestor "$E4" origin/main

gh api "repos/$REPO/commits/$T4" --jq .sha
gh api "repos/$REPO/commits/$E4" --jq .sha
gh api "repos/$REPO/contents/.github/workflows/ch001-live-proof.yml?ref=main" --jq .sha

git rev-parse "$T4:.github/workflows/ch001-live-proof.yml"
git rev-parse "origin/main:.github/workflows/ch001-live-proof.yml"
```

The two workflow blob identities should match unless the router has explicitly reviewed a separate workflow-only controller change. Default policy: keep them equal. A docs-only E4 may be the current branch head. If main moved with code/workflow changes, stop and reconcile rather than silently testing a mixed version.

These commands confirm publication; they do not perform a push. Use the already-authorized preserved-commit push path before these checks. They deliberately contain no credential extraction or account-switch commands.

## 4. Dispatch a new run, not the old failed run

Do not use `gh run rerun 34665615514` for the repaired source. Do not keep `implementation_sha` set to T3. GitHub reruns use the original run's ref/SHA. A fresh dispatch selects the new repaired workflow and explicitly checks out T4. [U5–U6]

After the publication checks:

```bash
set -euo pipefail
REPO='klole/reel-farm'
: "${T4:?Set the verified full T4 SHA first}"
[[ "$T4" =~ ^[0-9a-f]{40}$ ]] || exit 1
DISPATCHED_AFTER_UTC="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
printf 'Dispatch not before: %s\nImplementation: %s\n' "$DISPATCHED_AFTER_UTC" "$T4"
gh workflow run ch001-live-proof.yml --repo "$REPO" --ref main \
  -f implementation_sha="$T4"
gh run list --repo "$REPO" --workflow ch001-live-proof.yml \
  --event workflow_dispatch --limit 10 \
  --json databaseId,headSha,createdAt,status,conclusion,url
```

Record the dispatch receipt/time. Do not select a run solely because it is the newest entry. Match the creation window, actor/event, workflow, requested implementation in the dispatch/bootstrap record, and actual checkout. If two matching runs exist, identify the authorized one and do not claim results from an ambiguous run.

Only one deliberate new dispatch is authorized at this handoff. A transient retry or further implementation change needs a recorded router decision; no uncontrolled agent loop or broader runner spending is authorized.

## 5. Inspect the selected run and retain artifacts

Use the actual run ID, not a guessed future ID:

```bash
set -euo pipefail
REPO='klole/reel-farm'
RUN_ID='REPLACE_WITH_VERIFIED_NEW_RUN_ID'
[[ "$RUN_ID" =~ ^[0-9]+$ ]] || exit 1

gh run view "$RUN_ID" --repo "$REPO" \
  --json databaseId,event,headSha,status,conclusion,url,jobs
gh api "repos/$REPO/actions/runs/$RUN_ID/jobs" \
  --jq '.jobs[] | {id,name,status,conclusion,steps}'
gh api "repos/$REPO/actions/runs/$RUN_ID/artifacts" \
  --jq '.artifacts[] | {id,name,size_in_bytes,digest,expired,expires_at}'
```

Once that run completes, download its exact named artifact into a new run-owned directory. Record the run attempt and artifact ID; a name alone is insufficient. Compare downloaded ZIP SHA-256 with GitHub's artifact digest when retrieving the original archive bytes, and separately validate the inner payload manifest. Extracting via `gh run download` does not itself retain the original archive hash; do not claim it does.

Record jobs/steps and relevant failure log excerpts, then verify bootstrap report, workflow/source identities, coordinator report when present, suite counts, canonical exports, hashes, and lifecycle files. Check that the uploaded archive's paths actually resolve its evidence references. Retain a sanitized durable copy or accessible attachment before the configured retention deadline; do not invent permanent URLs.

Never upload `.env`, cookies, private authentication state, raw credentials, or the private proof directory. Never paste a full runner environment into the handoff.

## 6. Route based on the result

| Result | Router action |
|---|---|
| T4 not published | Use the existing authorized publishing route; no dispatch yet. |
| Native installer or frozen install fails | Return exact failure stage, logs and bootstrap artifact. Not a runtime-gate FAIL unless an assertion actually ran. |
| Summary/report packaging fails | Return `CI_REPORTING_FAILURE`; preserve earlier outcome. |
| Bootstrap succeeds; application proof fails | Return `BOOTSTRAP_FIXED_LIVE_PROOF_FAILED` with the first reproducible live failure; no feature work. |
| Coordinator exits 2 with measured missing prerequisite | Return `BLOCKED_ENVIRONMENT` with report and stage. Do not rerun blindly. |
| Coordinator exits 0; reports/artifacts invalid | Return `EVIDENCE_INVALID`, never a proof pass. |
| Bounded proof and artifact inspection succeed | Return `LIVE_PROOF_READY_FOR_REVIEW`, still application acceptance false. |

Include T4, E4, workflow-definition SHA, workflow blob identity, actual checkout, run/attempt/job/artifact IDs, bootstrap outcome, proof exit or null, fresh gate counts if generated, archive/payload hashes, and remaining original gates.

The next architect review decides whether the narrow repair is accepted and what application verification remains. The router must not mark v0.1 accepted or dispatch v0.2 based on a green Actions badge.
