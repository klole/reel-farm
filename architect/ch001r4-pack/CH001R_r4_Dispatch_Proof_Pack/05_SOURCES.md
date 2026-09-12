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
