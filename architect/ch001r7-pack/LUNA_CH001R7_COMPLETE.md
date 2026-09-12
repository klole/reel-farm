# CH-001R-r7 — Complete architect review and Luna MAX assignment

The first sections define the assignment. Appendices contain reference fixtures and architect-only diagnostic results, not a completed application implementation.

[Overview](#overview) | [Review](#review) | [Implementation](#implementation) | [Validation](#validation) | [Router](#router) | [Handoff](#handoff) | [Sources](#sources) | [Start-Prompt](#start-prompt)


---

<a id="overview"></a>

# CH-001R-r7 — Workflow validation and dispatch repair

**Authority:** architect continuation of CH-001. **Target:** v0.1.0, not a new feature chapter.

**Decision:** repair required at the workflow-definition boundary. Keep `application_acceptance=false`, accepted application version `none`, and root state `awaiting_review`.

This packet follows the published T6/E6 submission. The router reports rejection of a manual dispatch before a runner started. Inspection found `runner.temp` in job-level `env`, where GitHub does not allow the `runner` context. The next repair is small: move that path resolution to a supported runtime location and add real pre-publication workflow validation. Do not redesign the sandbox solution or restart the application build.

## Reading order

1. [Review and evidence boundaries](#review).
2. [Luna MAX implementation assignment](#implementation).
3. [Required validation and regression cases](#validation).
4. [Router publication and one-dispatch protocol](#router).
5. [Handoff template](#handoff).
6. [Primary sources and exact references](#sources).

The [starting prompt](#start-prompt) is ready to transfer. The examples are reference fixtures, not an implementation of the application or a replacement for the full workflow. The [reference diagnostic report](#reference-diagnostic-results) records only isolated shell checks executed by the architect.

## Outcomes that remain distinct

| Outcome | Meaning |
|---|---|
| Workflow static validation passes | The selected validator accepts the inspected file; this is not GitHub dispatch or browser evidence. |
| Dispatch accepted | GitHub accepts a new request; execution must still be identified and observed. |
| Host sandbox qualifies | The exact pinned host browser completes the required effective-sandbox checks. |
| Worker/application bounded proof succeeds | The existing bounded journey produced actual evidence. |
| v0.1 architect acceptance | A later separate decision against the original acceptance contract. |

A later stage cannot inherit a PASS from an earlier one. This packet authorizes preparation of T7/E7 and, after the router prerequisites pass, at most one fresh T7 manual dispatch with explicit sandbox opt-in. It does not authorize rerunning T3, T4, T5, unchanged T6, or the invalid-workflow record.

## Packet limits

No repository write, publication, dispatch, privileged policy change, or application test was performed by the architect for this packet. GitHub reads and source/reference inspection were performed. Nine included reference-shell checks ran successfully. The `actionlint` binary could not be obtained in the architect runtime, so neither the full T6 workflow nor a full patched workflow was executed through actionlint here. Luna/router must perform that check rather than inheriting a fabricated validation result.


---

<a id="review"></a>

# Architect review — CH-001R-r6 → r7

## 1. Decision

**CH-001 remains unaccepted. Authorize only CH-001R-r7: workflow-context repair and pre-publication validation.** The r6 sandbox implementation is carried forward, not declared qualified and not replaced.

The reported manual dispatch failed before start. This is not a fresh hosted `BLOCKED_ENVIRONMENT` proof result: the proof process was never invoked. Its exit code, live-proof run/job IDs, and artifact IDs must remain null. The earlier local r6 exit 2 and its 4/0/68 gate ledger remain local evidence only.

## 2. Inspected identities

| Identity | Value | Basis |
|---|---|---|
| Repository | `klole/reel-farm` | Connected GitHub reads |
| P6 | `8fa06ddae978eb6ca8f946e77459810a7bc68cb3` | Published handoff |
| T6 | `e0ea57665d00a643a8c392dfb9f6a84a723729af` | Published workflow and handoff |
| T6 tree | `7a5ada37e8ee88a1617ff19039fa116ced44e9c5` | Published handoff; not independently rehashed |
| E6 | `a4d6e7a0149d6852bf348d6277c4200720320f9c` | GitHub main ref and commit metadata |
| E6 parent | T6 | GitHub Git commit metadata |
| E6 tree | `ff094c15669f90b32335d8bde4f809356b18caf2` | GitHub Git commit metadata |
| Workflow blob at T6 and E6 | `f1ddbbfc0cbaa4602663428d569b61dbf12bd068` | Both pinned file responses |
| Workflow SHA-256 | `e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85` | Handoff/router reported; full file bytes not independently rehashed here |

At inspection, `origin/main` as exposed by the connected GitHub ref was E6. Recheck it before work; a later packet-only commit is possible. Never overwrite intervening work to force this historical baseline.

## 3. Confirmed source defect: R7-F01

**Location:** `.github/workflows/ch001-live-proof.yml`, T6/E6, original file line 39 under `jobs.live-proof.env`.

```yaml
CH001_SANDBOX_STATE_DIR: ${{ runner.temp }}/ch001r6/${{ github.run_id }}-${{ github.run_attempt }}/sandbox
```

GitHub's context-availability table permits `github, needs, strategy, matrix, vars, secrets, inputs` at job-level `env`; it does not permit `runner` there. `runner` is available in a step's environment or running-step context. [S1, S2]

This is a GitHub Actions expression/context-validation defect. The file need not be malformed YAML. A YAML parser, JavaScript syntax check, TypeScript build, or unit suite can pass while this placement is still invalid. No change to pnpm, Chromium, AppArmor, or application code can correct this particular definition error.

**Disposition:** source-confirmed blocker consistent with the router's reported parse rejection. This review does not invent the original dispatch HTTP status, response body, or GitHub annotation text; the router should preserve its actual command output if available.

## 4. Confirmed validation gap: R7-F02

The r6 handoff reports successful `node --check`, CI helper tests, lint, typecheck, build, unit and security checks. The inspected package script `lint` calls ESLint, and `test:ci` calls Node's test runner. No GitHub Actions-aware workflow-validation command appears in the inspected root scripts. [S3, S4]

This is not a reason to discard those checks. They cover different subjects. Add a separate mandatory local/router command that understands workflow structure and expression contexts. Running such a check only inside the workflow being validated is insufficient: an invalid definition may never start that step. [S2, S5]

**Disposition:** require a real validator, negative controls, and evidence tied to the exact workflow bytes before publication and dispatch.

## 5. GitHub's validation-only record

The connected API returned a record at E6:

- Run-record ID: `34675672523`.
- Event: `push`.
- Name: `.github/workflows/ch001-live-proof.yml`.
- Status/conclusion: `completed` / `failure`.
- Creation/update shown: `2026-09-12T05:28:32Z`.
- Jobs endpoint: `total_count=0`, empty `jobs` array. [S6, S7]

This is a validation-only failure record, not a successful manual dispatch and not a live-proof execution. Preserve it separately from the router's rejected dispatch attempt. Do not describe it as a browser test run or count it against application gates. Do not rerun it.

No new live-proof artifact is reported by the router. This review did not download a new T6 hosted artifact. No application assertions or sandbox qualification were observed for T6 on a hosted runner.

## 6. Historical evidence retained, not promoted

The r6 handoff reports local checks passing, local bounded proof exit 2, and local gate counts of 4 PASS / 0 FAIL / 68 NOT_RUN. Its host-policy qualification is explicitly unexecuted. Preserve these as historical reported local results, not independently rerun results. [S3]

The last actual bounded hosted result provided before T6 is T5 run `34671716094`, with the sandbox launch blocker documented in the r6 packet. Neither its counts nor its artifact may be relabeled as T6 or T7 evidence.

## 7. Approved repair direction

Remove only the unsupported job-level binding. Resolve `RUNNER_TEMP` within an existing running step, preferably the existing source-identity/evidence-initialization step, and append the resolved `CH001_SANDBOX_STATE_DIR` to `GITHUB_ENV` for later steps. Preserve the exact `/ch001r6/<run-id>-<attempt>/sandbox` suffix. This is r7 repair work on r6 behavior, not a reason to rename every historic path. [S8]

Do not replace the expression with a literal `$RUNNER_TEMP` in job-level `env`: environment values do not acquire a second shell-expansion pass merely by being read later. Do not hard-code a runner filesystem path. Do not make qualification and cleanup compute different paths.

The included reference shell checks demonstrate literal path transfer across simulated steps, including spaces and shell-looking text. They do not emulate GitHub's expression evaluator or validate the complete workflow.

## 8. Not newly authorized

No application or provider features; no new browser model; no dependency upgrades; no global AppArmor or user-namespace relaxation; no unsandboxed fallback; no root browser; no privileged/unconfined container workaround; no altered original acceptance gates; no strict-verifier weakening.

If a full Actions-aware validator exposes another genuine definition error, repair only that definition/wiring defect and add a regression. If a new runtime sandbox, worker, or application failure appears in a fresh authorized run, preserve the evidence and return it for the next decision.

All sources are resolved in [the source index](#sources).


---

<a id="implementation"></a>

# Luna MAX assignment — CH-001R-r7

## Objective and stopping point

Repair the published workflow so it passes a real Actions-aware static validator and can be submitted for one fresh router-controlled hosted qualification/proof run. Preserve the r6 sandbox policy and the r5 directory-ownership repair.

This is a repair of CH-001, targeting v0.1.0. It is not permission to implement the next chapter, redesign the CI system, or mark the application accepted.

## Step A — inspect the actual workspace

Read `handoffs/CH-001R-r6.md`, `docs/evidence/CH-001R-r6/`, root operational state, the original CH-001 contract, and this packet. Record `git rev-parse HEAD`, tree, branch, tracked/untracked state, and the exact base used. Preserve unrelated files.

E6 `a4d6e7a0149d6852bf348d6277c4200720320f9c` is the reviewed remote baseline. A new P7 packet commit may be its descendant; record that actual commit instead of inventing a P7 SHA. If execution-affecting changes exist beyond the reviewed baseline, inspect them and report the overlap; do not reset or overwrite them.

Verify T6/E6 workflow blob equality and inspect the unsupported expression at job-level `env`. The r6 handoff is historical: its statement that publication had not yet occurred must not be used to overwrite the router's later publication facts.

## Step B — make the bounded workflow edit

Delete this binding from `jobs.live-proof.env`:

```yaml
CH001_SANDBOX_STATE_DIR: ${{ runner.temp }}/ch001r6/${{ github.run_id }}-${{ github.run_attempt }}/sandbox
```

Resolve the same path in the existing `identity` run step before later qualification/proof/cleanup consumers execute. The essential logic is:

```bash
: "${RUNNER_TEMP:?}" "${GITHUB_RUN_ID:?}" "${GITHUB_RUN_ATTEMPT:?}" "${GITHUB_ENV:?}"
sandbox_state_dir="${RUNNER_TEMP}/ch001r6/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}/sandbox"
printf 'CH001_SANDBOX_STATE_DIR=%s\n' "$sandbox_state_dir" >> "$GITHUB_ENV"
```

The fuller [reference snippet](#reference-shell) adds inexpensive single-line/absolute-path and numeric-run guards. Integrate the logic into the existing step rather than replacing the entire workflow with the reduced example.

`GITHUB_ENV` makes the assignment available to subsequent steps, not retroactively to the step writing it. If an actual same-step consumer is added, explicitly export the value in that step as well. Do not `source` or `eval` the environment file. [S8]

Required behavior:

- Qualification, coordinator/lifecycle consumers, and cleanup receive the same resolved absolute path.
- Job/attempt namespace and the r6 state suffix remain unchanged.
- The initialization writes only the environment assignment; it does not create `proof/public`, sandbox state, policy files, or any evidence in a rejected proof root.
- Existing `GITHUB_ENV` entries are preserved.
- Failure does not fall back to an arbitrary hard-coded directory.
- Existing `always()` cleanup and r6 authorization checks remain intact.
- The explicit `sandbox_qualification` input remains boolean, required, and default false. It must not become silently true.

Do not use a literal `$RUNNER_TEMP` as an unevaluated job-level `env` value. A legal step-level `env` expression is another valid GitHub placement, but this assignment prefers one runtime initialization so the qualifier and cleanup cannot drift apart.

## Step C — add pre-publication workflow validation

Add a root command such as:

```text
pnpm lint:workflow
```

It must run a real GitHub Actions-aware validator against the tracked workflow files. Use `actionlint` as the initial validator. Version `1.7.7` is a concrete official release inspected during this review, not a claim about the newest version. Record the exact selected version, executable path, executable hash, and release/archive provenance. Pin the tool for reproducibility. [S5, S9]

Keep it outside application/runtime dependencies. Using an already installed, pinned validator or the project's official release distribution is sufficient; do not build another package-manager/bootstrap framework. A small wrapper may accept `ACTIONLINT_BIN`, validate the tool/version, enumerate explicit tracked `.github/workflows/*.yml` and `.yaml` inputs, and propagate diagnostics and exit codes.

For the minimum context/schema check, explicitly disabling the optional external ShellCheck/Pyflakes integrations is acceptable:

```bash
actionlint -shellcheck="" -pyflakes="" .github/workflows/ch001-live-proof.yml
```

That does not disable actionlint's workflow/expression checks. Do not suppress the expression rule, add blanket ignore patterns, or treat the absence of the validator as success. Optional shell lint can be recorded separately; it must not turn into unrelated refactoring.

Requirements:

- A missing, unusable, or wrong-version validator is a nonzero, explicitly recorded tooling block, not PASS.
- Zero discovered target workflows is a failure.
- Malformed YAML, unsupported contexts and broken step references are rejected.
- The full frozen T6 workflow is rejected for the unsupported context; a reduced negative fixture can supplement, not replace, that test.
- The full repaired workflow is accepted by the selected validator.
- Known invalid fixtures stay outside `.github/workflows` and are tested as expected failures.
- Evidence binds each result to input file SHA-256, tool identity, command, time and exit status.
- Run validation locally and on the router's actual publication tree. It cannot exist only as a step in the same potentially invalid workflow.

Adding a developer script to `package.json` is allowed. Dependencies, devDependency versions, package-manager and Node pins, native pnpm manifest, and lockfile must remain unchanged. Record the intentional scripts-only package diff; the full package file hash will naturally change.

If the editing host cannot obtain or run the validator, implement the bounded code and tests and return `READY_FOR_ROUTER_VALIDATION` with that check explicitly unrun. The router may provide the missing independent pre-publication validation. No one may promote that state to dispatch readiness until the actual check passes.

## Step D — regressions and existing checks

Implement the cases in [the validation contract](#validation) using executable tests. Prefer dependency-free Node tests for path and wiring logic, plus real actionlint invocations for semantic validation. Do not replace semantic validation with string searches.

Run the existing r4 CI-result, r5 boundary and r6 sandbox tests. Keep their discovered/executed counts honest: file-level Node test counts and individual subtest counts are not interchangeable. Run lint, typecheck, build, unit and security suites. Retain r6's effective sandbox checks unchanged.

A local bounded `pnpm proof:ch001` run can be attempted once with a fresh run-owned directory when appropriate, but a known unavailable browser/Docker host is not a reason to consume repeated runs. Report it as unrun or blocked accurately. Do not require a deliberately restricted editing environment to become a hosted runner, and do not mutate its AppArmor policy.

## Step E — implementation/evidence separation

Create T7 only after execution-affecting changes and the test harness are final. Run final checks on that exact clean commit/tree. If a fix is needed afterward, create a new implementation commit and rerun relevant checks; do not retain stale test identity.

Then create E7 containing handoff/state/evidence records only. Record its SHA outside self-referential committed content. Keep historic r6 local results and the rejected-dispatch receipt unchanged; add new r7 records rather than rewriting history.

Suggested outputs:

```text
handoffs/CH-001R-r7.md
docs/evidence/CH-001R-r7/README.md
docs/evidence/CH-001R-r7/r7-results.json
docs/evidence/CH-001R-r7/workflow-validation.json
docs/evidence/CH-001R-r7/workflow-validation.log
docs/evidence/CH-001R-r7/dispatch-rejection-history.json
state/PROJECT_STATE.md
state/EVIDENCE_INDEX.md
```

Update existing requirement state only where truthful and necessary. Root remains `awaiting_review`. Do not change original CH001-* acceptance statuses based on workflow grammar tests.

## Authorized change surface

The workflow; narrowly scoped workflow-validation/runtime-env helpers; relevant CI tests/fixtures; one scripts-only package entry; validator provenance metadata if needed; handoff/evidence/state documentation.

By default do not modify `scripts/ch001-sandbox.mjs`, worker/application code, the Dockerfile, Compose security settings, Playwright launch settings, bootstrap/native release behavior, the original 72-gate contract, or strict verifier logic. A direct integration issue strictly necessary for environment propagation may be proposed with a concrete test, but no policy relaxation is authorized.

## Completion states

- `READY_FOR_ROUTER_PUBLISH`: bounded changes and required pre-publication checks pass on T7; E7 is ready.
- `READY_FOR_ROUTER_VALIDATION`: a real validator is unavailable on the editing box; this is not permission to dispatch.
- `BLOCKED`: a code, identity, scope, or tooling problem prevents even the bounded handoff; state exactly what happened.

Luna does not need to claim a hosted outcome before router dispatch. Return actual T7/E7/tree/workflow identities and stop. The router protocol controls publication and the one new dispatch.


---

<a id="validation"></a>

# r7 validation contract

This is a separate r7 repair checklist. It does not replace, delete, or automatically pass any of the original 72 CH001-* gates. A test can pass because it correctly rejects a negative fixture; record the subject command's nonzero status as expected, not as a real workflow PASS.

## Mandatory pre-publication cases

| ID | Assertion | Required evidence |
|---|---|---|
| R7-T01 | The full pinned T6 workflow fails Actions-aware validation at the unsupported `runner` context in job-level env. | Real validator output, exact T6 file hash, tool/version, diagnostic location. |
| R7-T02 | The complete repaired workflow passes the same validator with context/schema checks enabled. | Exact candidate/T7 hash, command and exit 0. |
| R7-T03 | The validator wrapper fails closed for missing tool, nonzero tool result, zero input workflows and invalid YAML. | Executed positive/negative wrapper tests; no success-by-skip. |
| R7-T04 | A negative nonexistent `steps` reference is rejected; the supported step-level/runtime positive fixture passes. | Actual semantic validator runs, not a regex assertion. |
| R7-T05 | Runtime initialization yields the same absolute state path in independent qualification and cleanup consumers. | Separate-process env-transfer test; expected full path. |
| R7-T06 | Spaces and shell-looking characters remain literal; no environment file is sourced/evaluated. | Temp fixtures, marker absence, exact value comparison. |
| R7-T07 | Missing/invalid runtime inputs fail before modifying the environment file; existing entries survive a successful append. | Missing temp/file, relative/multiline path, invalid IDs, file comparison. |
| R7-T08 | Environment setup creates no proof tree or policy state and cannot revive the r4 collision. | Before/after filesystem snapshots; r5 regression suite remains passing. |
| R7-T09 | Boolean opt-in default false, public/manual host guard, cleanup ordering, exact-browser constraint and non-root/sandbox defaults remain intact. | Focused workflow/helper wiring tests plus bounded diff review. No live policy claim. |
| R7-T10 | Existing r4/r5/r6 helper suites still pass with actual counts. | Test logs, discovered/executed/passed/failed/skipped counts. |
| R7-T11 | Node/pnpm/Playwright/dependency pins, native release manifest and lockfile are unchanged; package changes are scripts-only. | Hashes and parsed key/diff comparison against T6. |
| R7-T12 | Final workflow evidence is bound to actual T7/tree/workflow bytes; E7 does not alter execution-affecting content. | Source identities, commands, diff and clean-tree record. |

R7-T01 through T12 are required before dispatch, though the router may provide the missing real-validator evidence when the editing box cannot. These statuses start unrun in Luna's new ledger; do not copy the architect's reference-snippet results into them as full passes.

## Router/hosted cases

| ID | Assertion | Required evidence |
|---|---|---|
| R7-T13 | Router validates the actual publication tree and verifies T7/E7 reachability and the workflow definition used by `main`. | Fresh fetch, current W7 SHA/blob, actual semantic-validator output and hash match. |
| R7-T14 | At most one new dispatch is submitted with T7 and explicit sandbox opt-in; accepted versus rejected is recorded accurately. | Actual command/exit/response, attempt time, new run metadata if any. A rejection is not a PASS for successful dispatch. |
| R7-T15 | When a run exists, requested SHA, checkout, definition SHA, sandbox qualification, cleanup, worker and proof outcomes are separately reported. | Settled job/step reports and a real artifact if produced. Unreached work remains NOT_RUN. |
| R7-T16 | Historical artifacts/results are preserved; state remains unaccepted; receipt contains no secrets or invented identifiers. | Independent archive/hash check when applicable, sanitized handoff/state review. |

A successful grammar repair and a newly exposed runtime failure are different outcomes. R7 can be accepted as a bounded definition repair while application acceptance remains false and r6 qualification remains incomplete. A green bounded proof is also not automatic full acceptance.

## Commands

Record actual execution, not an aspirational list:

```text
pnpm lint:workflow
pnpm test:ci
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Also record direct negative validator runs and new helper syntax checks. A frozen install is needed only if the checkout/dependencies require it; use the existing pinned setup and verify the lockfile is unchanged. Do not claim an old install/build belongs to T7.

`pnpm verify:ch001` remains the strict application verifier. It need not become green to accept a syntax repair, and it must not be weakened to make r7 appear accepted. A local bounded proof may still exit 2 for unavailable runtime prerequisites; its counts are not hosted counts.

## Workflow validation evidence shape

A suitable `workflow-validation.json` includes:

```json
{
  "record_kind": "WORKFLOW_STATIC_VALIDATION",
  "implementation_commit": null,
  "implementation_tree": null,
  "workflow_path": ".github/workflows/ch001-live-proof.yml",
  "workflow_blob_sha": null,
  "workflow_sha256": null,
  "validator": {
    "name": "actionlint",
    "version": null,
    "executable_sha256": null,
    "distribution_reference": null
  },
  "command": null,
  "exit_code": null,
  "started_at": null,
  "ended_at": null,
  "diagnostics_path": null,
  "status": "NOT_RUN",
  "github_dispatch_performed": false,
  "application_acceptance": false
}
```

Fill fields only after execution. Include a separate entry for the negative T6 control and any reduced fixture. A validator PASS means static validation only; it does not certify runner policy, browser behavior, application security, or the complete GitHub service implementation.

## Evidence review discipline

Keep primary cause and downstream absence separate. For the r6 rejected dispatch, no host proof ran and no new application ledger was produced. Missing runtime artifacts are not evidence that the app exported incorrect images.

If a later dispatched run actually starts and a test asserts failure, preserve that failure; do not relabel it an environment block merely because an earlier run had a sandbox problem. If the runner fails before tests, preserve actual stage/exit and unreached statuses.


---

<a id="router"></a>

# Router protocol — publish T7/E7, then one new dispatch

## Authority

This packet authorizes at most one fresh manual dispatch of the repaired T7 implementation after the prerequisites below pass, carrying forward r6's explicit sandbox-qualification scope. It does not authorize reruns of old attempts, extra account permissions, a different runner policy, or a second speculative dispatch.

Do not rerun:

- historical T3 run `34665615514`;
- historical T4 run `34669975078`;
- historical T5 run `34671716094`;
- validation-only E6 record `34675672523`;
- unchanged T6 under a new dispatch merely to re-test the same unsupported expression.

Use the existing workflow-capable publication route. Do not copy credentials into the editing box, broaden OAuth/token scopes within this repair, force-push, reset history, or silently cherry-pick to a new implementation identity.

## Before publication

Obtain actual T7/E7 SHAs from Luna; no such commits were created by this architect packet. Verify the work is based on the reviewed E6 or an accounted-for descendant. Preserve P7 as the real packet commit if one exists.

Run `pnpm lint:workflow` against the exact final publication tree before pushing it, using a verified pinned actionlint. A PASS obtained for a different file/hash is stale. If the editing host lacked the tool, the router must run it here; lack of a local tool is not permission to submit unvalidated YAML.

Confirm the negative T6 control is rejected for the documented context rule, not merely because a tool/file is missing. Record version, hashes and diagnostics. The repaired complete workflow must pass with no suppressed context/schema errors.

Read the bounded diff. Preserve the original manual/public-only route, `sandbox_qualification` boolean default false, targeted AppArmor guard/cleanup, proof-directory ownership and application/security defaults. Do not remove the sandbox step to avoid validating it.

## After publication, before dispatch

Fetch the actual remote ref and record W7: the commit whose workflow definition will be used when dispatching `--ref main`. W7 may be E7, which is distinct from T7. Verify the live-proof workflow blob/bytes at W7 match the validated T7 workflow. If another commit changed the workflow, stop and validate the actual selected definition before proceeding.

Verify:

```bash
REPO=klole/reel-farm
# Set these to actual full SHAs returned by Luna, not labels or guessed values.
: "${T7:?Set T7}" "${E7:?Set E7}"

git fetch origin main
git cat-file -e "$T7^{commit}"
git cat-file -e "$E7^{commit}"
git merge-base --is-ancestor "$T7" "$E7"
git merge-base --is-ancestor "$E7" origin/main
W7="$(git rev-parse origin/main)"
test "$(git rev-parse "$T7:.github/workflows/ch001-live-proof.yml")" = \
     "$(git rev-parse "$W7:.github/workflows/ch001-live-proof.yml")"
```

Also inspect T7-to-E7 changes and the real workspace used for validation. A filename-only "documentation" label is not proof that runtime source was unchanged. Record full SHAs/tree/blob/digest, not only short names.

Confirm no other live proof is executing/queued for this route. Query existing runs to establish a before-dispatch baseline. Do not cancel others just to acquire a slot.

## Submit at most one request

After all checks pass, the router may run:

```bash
gh workflow run ch001-live-proof.yml --repo "$REPO" --ref main \
  -f implementation_sha="$T7" -f sandbox_qualification=true
```

Capture the command's real exit and response. The explicit boolean opt-in authorizes only the already bounded r6 policy behavior on the qualified hosted runner. It is not blanket permission to disable sandboxing or mutate an editing/developer host.

If rejected before run creation, stop. Preserve the actual error and leave live run/job/artifact IDs and proof exit null. Do not repeatedly resend the request. If a network timeout leaves request acceptance uncertain, read recent workflow-dispatch records to resolve it; do not assume nothing happened and submit a duplicate.

If accepted, identify the single new `workflow_dispatch` run by time, actor, workflow path/definition and the requested implementation. The Actions row may show W7/E7 as `head_sha` because it owns the workflow; the checkout step/artifact must independently confirm T7. Do not infer implementation identity from the head row alone.

## Observe without rerunning

Record the settled run/attempt/job and actual step results. Inspect at least:

- checkout and validated source identity;
- bootstrap and pinned browser installation;
- explicit sandbox qualification and effective host-sandbox evidence;
- worker/container qualification separately;
- bounded proof status and actual exit;
- run-owned policy cleanup;
- artifact upload and receipt outcome.

A successful artifact-upload step or a shell step intentionally returning zero for report collection is not a successful proof. Use the captured child exit and final classification.

If a new runtime problem is exposed, preserve it and stop for architect review. No application, container-policy or global sandbox workaround is authorized by this packet. Even a successful bounded proof leaves `application_acceptance=false`, accepted version `none`, and root `awaiting_review` pending the original full review contract.

## Preserve the real receipt

When an artifact exists, download that actual artifact; verify ID/name/run/attempt, length and digest; retain the original ZIP unchanged and inspect safe extracted payloads. Keep a separate receipt for post-upload outcome data rather than modifying the historical archive to add its own digest.

When no artifact exists, do not create a lookalike live-proof ZIP. A small committed router receipt with the rejected request/error and null live identifiers is appropriate.

Distinguish the E6 push-validation record from a new dispatched proof. Record a read/observation timestamp. If statuses are not settled, say so; do not invent a final outcome.

## Router response

Return actual publication SHAs, W7/workflow identity, static-validation evidence, request outcome, and—only if they exist—fresh run/job/artifact identities. Include `sent=yes/no` with a named destination so that "sent" cannot be mistaken for "dispatched". Include `workflow_dispatch_submitted=yes/no` separately, and keep acceptance false.


---

<a id="handoff"></a>

# Handoff — CH-001R-r7

> Template only. Replace unknown fields with actual values or explicit null/NOT_RUN. This file does not represent completed Luna work.

## State

- Operational status: `READY_FOR_ROUTER_PUBLISH` / `READY_FOR_ROUTER_VALIDATION` / `BLOCKED`.
- Target application version: `0.1.0`.
- Root state: `awaiting_review`.
- Application acceptance: `false`.
- Accepted application version: `none`.

## Identities

| Field | Actual value |
|---|---|
| Base/P7 and tree | null |
| T7 implementation and tree | null |
| E7 evidence commit (returned externally) | null |
| Workflow blob and SHA-256 at T7 | null |
| Publication verified on origin/main | NOT_RUN |
| W7 definition commit, if dispatched | null |
| Validator version/executable/archive identity | null |

## Root-cause disposition

- R7-F01, unsupported job-level `runner.temp`: repair description and full-file validation result.
- R7-F02, missing pre-publication semantic validation: command/wrapper added, actual negative/positive evidence.
- Any other definition errors: exact location and bounded repair, or none observed. Do not claim full application review.

## Actual command results

Include start/end timestamps, tested source identity, command, exit code, counts, skipped checks and retrievable evidence for `lint:workflow`, full T6 negative control, new regression cases, existing CI modules, lint/typecheck/build/unit/security and diff checking. Distinguish file-level test counts from subtest counts.

List R7-T01 through R7-T16 individually with PASS/FAIL/NOT_RUN and evidence. Hosted/router cases are NOT_RUN at Luna handoff unless actually executed by the authorized router. Do not set all to PASS because a shell reference worked.

## Historical r6 dispatch boundary

```json
{
  "record_kind": "HISTORICAL_ROUTER_DISPATCH_REJECTION",
  "implementation_sha": "e0ea57665d00a643a8c392dfb9f6a84a723729af",
  "workflow_definition_sha": "a4d6e7a0149d6852bf348d6277c4200720320f9c",
  "request_outcome": "REJECTED_BEFORE_RUN",
  "request_outcome_basis": "router report; preserve original response if available",
  "http_status": null,
  "raw_error_reference": null,
  "live_proof_run_id": null,
  "live_proof_job_id": null,
  "proof_invoked": false,
  "proof_exit_code": null,
  "artifact_id": null,
  "hosted_gate_counts": null,
  "separate_validation_record": {
    "run_id": 34675672523,
    "event": "push",
    "conclusion": "failure",
    "job_count": 0
  },
  "application_acceptance": false
}
```

Do not copy the local r6 exit 2 into this hosted proof field. If new primary evidence corrects the historical receipt, append the correction with its source rather than rewriting unrelated archives.

## New T7 router outcome (fill only after router action)

- Publication verified: NOT_RUN.
- Pre-publication semantic validation: NOT_RUN.
- Dispatch request submitted: false.
- Request accepted/rejected/uncertain: null.
- New run/attempt/job: null.
- Sandbox requested / measured qualified: null / null.
- Worker qualified: NOT_RUN.
- Proof invoked / actual exit: false / null.
- Policy cleanup status: NOT_RUN.
- Artifact ID/name/bytes/SHA-256: null.
- Artifact independently inspected: false.
- Gate counts from new report: null.
- Primary blocker and downstream missing work: null.
- Application acceptance: false.

## Scope declaration and stop

List all changed paths. Confirm lockfile/native manifest and dependency pins unchanged; explain any scripts-only package change. State that sandbox policy semantics, worker/Compose controls, original gates and strict verifier were not weakened. Declare external actions, paid/provider requests, privileged policy activity and dispatch count accurately.

No providers, account authorization, publishing, scheduling, billing, analytics, video, release, public deployment or v0.2 work is authorized. Return the actual handoff and stop for router/architect review.


---

<a id="sources"></a>

# Primary sources and review references

Repository observations are pinned to the cited commits. Online documentation was consulted during this review. No general web search was substituted for the connected repository reads.

| ID | Primary source | Use |
|---|---|---|
| S1 | [T6 workflow](https://github.com/klole/reel-farm/blob/e0ea57665d00a643a8c392dfb9f6a84a723729af/.github/workflows/ch001-live-proof.yml#L23-L40) and [E6 same file](https://github.com/klole/reel-farm/blob/a4d6e7a0149d6852bf348d6277c4200720320f9c/.github/workflows/ch001-live-proof.yml#L23-L40) | Job-env expression and matching Git blob; qualifier/cleanup wiring. |
| S2 | [GitHub context availability](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability) | Job-level env excludes runner; running step contexts differ. |
| S3 | [E6 handoff](https://github.com/klole/reel-farm/blob/a4d6e7a0149d6852bf348d6277c4200720320f9c/handoffs/CH-001R-r6.md) | Historical local results, identities, unchanged pins, qualification not executed. |
| S4 | [T6 package scripts](https://github.com/klole/reel-farm/blob/e0ea57665d00a643a8c392dfb9f6a84a723729af/package.json#L8-L26) | ESLint and Node CI scripts are not a workflow semantic-validator entry point. |
| S5 | [actionlint v1.7.7 checks](https://github.com/rhysd/actionlint/blob/v1.7.7/docs/checks.md) | Validator capabilities: expression contexts, workflow structure, references; no claim it ran here. |
| S6 | [E6 validation-only record](https://github.com/klole/reel-farm/actions/runs/34675672523) and [API records filtered to E6](https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=a4d6e7a0149d6852bf348d6277c4200720320f9c&per_page=20) | Push-triggered failure, distinct from a manual live-proof run. |
| S7 | [Jobs endpoint for that record](https://api.github.com/repos/klole/reel-farm/actions/runs/34675672523/jobs) | Observed zero jobs. |
| S8 | [GitHub environment-file behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-environment-variable) | GITHUB_ENV transfers data to subsequent steps. |
| S9 | [Official actionlint v1.7.7 release](https://github.com/rhysd/actionlint/releases/tag/v1.7.7) | Concrete validator release reference. Version is not advertised as latest. |
| S10 | [E6 Git commit metadata](https://api.github.com/repos/klole/reel-farm/git/commits/a4d6e7a0149d6852bf348d6277c4200720320f9c) | E6 parent T6 and E6 tree identity. |
| S11 | [GitHub main ref](https://api.github.com/repos/klole/reel-farm/git/ref/heads/main) | At review the connected response was E6; mutable, must be rechecked. |

## Verification boundaries

The workflow blob equality at T6/E6 was checked through connected file responses. The SHA-256 in the user/handoff is recorded as reported, not independently recomputed from a complete local copy. The E6 relationship to T6 was confirmed through Git metadata.

The exact HTTP body of the router's failed manual dispatch was not supplied or retrieved; this packet does not invent it. GitHub's separate push-validation record and zero jobs were independently observed. Source placement and the official availability rule explain the reported rejection.

The architect runtime did not have actionlint installed, and attempted retrieval was unavailable (network/download restrictions). This is a review-tool limitation, not a finding about the editing box or router. It is not permission to omit Luna/router workflow validation.

The isolated reference-shell diagnostic uses the included shell fixture and temporary synthetic paths only. It does not execute repository application code, GitHub jobs, Chromium, Docker, or a policy change. Its generated report is included with the exact boundary declaration.


---

<a id="start-prompt"></a>

# Starting prompt — Luna MAX / CH-001R-r7

Execute CH-001R-r7 using MAX effort as a bounded continuation of CH-001, targeting v0.1.0. Read the packet and the actual repository before editing. Do not return only another plan.

Reviewed baseline: E6 `a4d6e7a0149d6852bf348d6277c4200720320f9c`, parent T6 `e0ea57665d00a643a8c392dfb9f6a84a723729af`. The manual T6 dispatch was rejected before execution. In the published workflow, `CH001_SANDBOX_STATE_DIR` uses `${{ runner.temp }}` in job-level `env`, where GitHub disallows the runner context. GitHub also has a separate E6 push-validation failure record `34675672523` with zero jobs; do not treat it as a live-proof run.

Remove the unsupported job-level binding. Resolve the same run/attempt-specific sandbox state path in the existing runtime identity step, pass it to later consumers via GITHUB_ENV, and preserve r6 sandbox policy, explicit opt-in and owned cleanup. Preserve r5 proof-directory ownership. Do not merely put a literal `$RUNNER_TEMP` into job-level env.

Add a real pre-publication GitHub Actions-aware validation command (actionlint, pinned with recorded provenance), test the complete historical T6 workflow as an expected context failure, and validate the complete repaired workflow. Add executable runtime-path/wiring and validator failure-control regressions. Keep tooling absence and unexecuted checks honest. Run the required existing checks and bind all evidence to actual T7/tree/workflow bytes.

No redesign, application features, dependency upgrades, global policy relaxation, no-sandbox fallback, root browser, privileged/unconfined containers, provider/publishing work, original-gate edits, strict-verifier weakening, or v0.2 work. Do not claim runtime qualification from syntax validation.

Return actual T7/E7 and workflow identities, local command/test evidence, and the r7 handoff. If a real validator is unavailable on the editing host, return READY_FOR_ROUTER_VALIDATION without claiming PASS; the router must validate before publication/dispatch. Otherwise return READY_FOR_ROUTER_PUBLISH. The router may publish via its existing authorized route and submit at most one fresh T7 dispatch with sandbox_qualification=true after the packet prerequisites pass. Do not rerun old T3/T4/T5/T6 records.

Keep application_acceptance=false, accepted version none and root awaiting_review. Hosted fields remain null/NOT_RUN until a real authorized run exists. Stop for router/architect review.


---

<a id="reference-shell"></a>

# Reference runtime-step body

```bash
#!/usr/bin/env bash
# Reference runtime-step body; not an application or sandbox-policy operation.
set -euo pipefail
: "${RUNNER_TEMP:?RUNNER_TEMP is required}" "${GITHUB_RUN_ID:?GITHUB_RUN_ID is required}" \
  "${GITHUB_RUN_ATTEMPT:?GITHUB_RUN_ATTEMPT is required}" "${GITHUB_ENV:?GITHUB_ENV is required}"
[[ "$RUNNER_TEMP" == /* && "$RUNNER_TEMP" != *$'\n'* && "$RUNNER_TEMP" != *$'\r'* ]] || {
  printf '%s\n' 'RUNNER_TEMP must be a single-line absolute path.' >&2
  exit 1
}
[[ "$GITHUB_RUN_ID" =~ ^[0-9]+$ && "$GITHUB_RUN_ATTEMPT" =~ ^[1-9][0-9]*$ ]] || {
  printf '%s\n' 'Run ID and attempt must be valid numeric identifiers.' >&2
  exit 1
}
sandbox_state_dir="${RUNNER_TEMP}/ch001r6/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}/sandbox"
printf 'CH001_SANDBOX_STATE_DIR=%s\n' "$sandbox_state_dir" >> "$GITHUB_ENV"
# GITHUB_ENV is consumed by later steps. Do not source/eval it as a shell script.
# This step must not create proof/public or run a sandbox-policy command.
```


---

<a id="reference-workflow"></a>

# Reduced positive workflow reference

```yaml
# Illustrative reduced workflow only; do not replace the real workflow with this.
name: R7 runtime environment reference
on:
  workflow_dispatch:
jobs:
  probe:
    runs-on: ubuntu-24.04
    steps:
      - name: Set path for later steps
        run: |
          set -euo pipefail
          : "${RUNNER_TEMP:?}" "${GITHUB_RUN_ID:?}" "${GITHUB_RUN_ATTEMPT:?}" "${GITHUB_ENV:?}"
          sandbox_state_dir="${RUNNER_TEMP}/ch001r6/${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}/sandbox"
          printf 'CH001_SANDBOX_STATE_DIR=%s\n' "$sandbox_state_dir" >> "$GITHUB_ENV"
      - name: Consume literal resolved path
        run: |
          set -euo pipefail
          test -n "$CH001_SANDBOX_STATE_DIR"
          printf '%s\n' "$CH001_SANDBOX_STATE_DIR"
```


---

<a id="negative-workflow"></a>

# Intentionally invalid context fixture

```yaml
# Intentionally invalid GitHub Actions context placement; negative fixture only.
name: R7 negative context fixture
on:
  workflow_dispatch:
jobs:
  probe:
    runs-on: ubuntu-24.04
    env:
      CH001_SANDBOX_STATE_DIR: ${{ runner.temp }}/ch001r6/${{ github.run_id }}-${{ github.run_attempt }}/sandbox
    steps:
      - run: printf '%s\n' 'This workflow should be rejected before execution.'
```


---

<a id="reference-diagnostic-code"></a>

# Isolated diagnostic program

```python
"""Isolated reference-snippet checks. Not actionlint or GitHub runner validation."""
from pathlib import Path
import json
import os
import subprocess
import tempfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'examples/initialize-sandbox-state.sh'
results = []

def run_case(name, override=None, omit=None, expected_success=True):
    with tempfile.TemporaryDirectory(prefix='r7-diagnostic-') as tmp:
        home = Path(tmp)
        runner_temp = home / 'runner temp'
        runner_temp.mkdir()
        evidence = home / 'proof'
        evidence.mkdir()
        sentinel = evidence / 'old-evidence.txt'
        sentinel.write_bytes(b'preserve-exactly\n')
        env_file = home / 'github-env'
        env_file.write_text('PREVIOUS=preserve\n', encoding='utf8')
        env = dict(os.environ)
        for key in ('RUNNER_TEMP', 'GITHUB_RUN_ID', 'GITHUB_RUN_ATTEMPT', 'GITHUB_ENV', 'CH001_SANDBOX_STATE_DIR'):
            env.pop(key, None)
        env.update(RUNNER_TEMP=str(runner_temp), GITHUB_RUN_ID='123456789', GITHUB_RUN_ATTEMPT='1', GITHUB_ENV=str(env_file))
        if override:
            env.update(override(home))
        if omit:
            env.pop(omit, None)
        process = subprocess.run(['bash', str(SCRIPT)], env=env, capture_output=True, text=True, timeout=10)
        assert (process.returncode == 0) == expected_success, (name, process.returncode, process.stderr)
        assert sentinel.read_bytes() == b'preserve-exactly\n'
        assert env_file.read_text().startswith('PREVIOUS=preserve\n')
        if expected_success:
            entries = [line for line in env_file.read_text().splitlines() if line.startswith('CH001_SANDBOX_STATE_DIR=')]
            assert len(entries) == 1
            actual = entries[0].split('=', 1)[1]
            expected = f"{env['RUNNER_TEMP']}/ch001r6/{env['GITHUB_RUN_ID']}-{env['GITHUB_RUN_ATTEMPT']}/sandbox"
            assert actual == expected, (actual, expected)
            assert not Path(actual).exists()
            # Simulate the runner's key/value transfer, NOT execution of the env file.
            for role in ('qualification', 'cleanup'):
                child_env = dict(env, CH001_SANDBOX_STATE_DIR=actual)
                child = subprocess.run(['bash', '-c', 'printf "%s" "$CH001_SANDBOX_STATE_DIR"'], env=child_env, capture_output=True, text=True, timeout=10)
                assert child.returncode == 0 and child.stdout == expected, role
            assert not (home/'marker').exists()
        else:
            assert env_file.read_text() == 'PREVIOUS=preserve\n'
        results.append({'name':name, 'status':'PASS', 'subject_exit_code':process.returncode,
                        'boundary':'isolated reference shell; not the repository workflow'})

run_case('absolute path with spaces transfers unchanged to both consumers')
run_case('different run attempt yields distinct path', lambda h: {'GITHUB_RUN_ATTEMPT':'2'})
run_case('shell-looking path is data, not executed', lambda h: {'RUNNER_TEMP':str(h / ('temp $(touch '+str(h/'marker')+')'))})
run_case('missing RUNNER_TEMP rejects before env write', omit='RUNNER_TEMP', expected_success=False)
run_case('missing GITHUB_ENV rejects', omit='GITHUB_ENV', expected_success=False)
run_case('relative temp path rejects', lambda h: {'RUNNER_TEMP':'relative'}, expected_success=False)
run_case('newline temp path rejects', lambda h: {'RUNNER_TEMP':str(h)+'\nOTHER=x'}, expected_success=False)
run_case('invalid run ID rejects', lambda h: {'GITHUB_RUN_ID':'not-a-run'}, expected_success=False)
run_case('attempt zero rejects', lambda h: {'GITHUB_RUN_ATTEMPT':'0'}, expected_success=False)
report={'report_kind':'ARCHITECT_REFERENCE_SNIPPET_DIAGNOSTICS', 'generated_at':datetime.now(timezone.utc).isoformat(),
        'tests':results, 'counts':{'PASS':len(results),'FAIL':0},
        'application_tests_executed':False, 'github_workflow_executed':False,
        'actionlint_executed':False, 'sandbox_policy_changes':False,
        'limitations':['Only the included reference shell snippet was executed.',
                       'No claim of GitHub workflow grammar validation or application acceptance.']}
(ROOT/'evidence/reference-snippet-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report['counts']))
```


---

<a id="reference-diagnostic-results"></a>

# Actual isolated reference-shell results

```json
{
  "report_kind": "ARCHITECT_REFERENCE_SNIPPET_DIAGNOSTICS",
  "generated_at": "2026-09-12T05:42:37.432826+00:00",
  "tests": [
    {
      "name": "absolute path with spaces transfers unchanged to both consumers",
      "status": "PASS",
      "subject_exit_code": 0,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "different run attempt yields distinct path",
      "status": "PASS",
      "subject_exit_code": 0,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "shell-looking path is data, not executed",
      "status": "PASS",
      "subject_exit_code": 0,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "missing RUNNER_TEMP rejects before env write",
      "status": "PASS",
      "subject_exit_code": 1,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "missing GITHUB_ENV rejects",
      "status": "PASS",
      "subject_exit_code": 1,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "relative temp path rejects",
      "status": "PASS",
      "subject_exit_code": 1,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "newline temp path rejects",
      "status": "PASS",
      "subject_exit_code": 1,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "invalid run ID rejects",
      "status": "PASS",
      "subject_exit_code": 1,
      "boundary": "isolated reference shell; not the repository workflow"
    },
    {
      "name": "attempt zero rejects",
      "status": "PASS",
      "subject_exit_code": 1,
      "boundary": "isolated reference shell; not the repository workflow"
    }
  ],
  "counts": {
    "PASS": 9,
    "FAIL": 0
  },
  "application_tests_executed": false,
  "github_workflow_executed": false,
  "actionlint_executed": false,
  "sandbox_policy_changes": false,
  "limitations": [
    "Only the included reference shell snippet was executed.",
    "No claim of GitHub workflow grammar validation or application acceptance."
  ]
}
```


---

<a id="review-facts"></a>

# Source-review facts

```json
{
  "record_kind": "ARCHITECT_R7_SOURCE_REVIEW",
  "reviewed_implementation": "e0ea57665d00a643a8c392dfb9f6a84a723729af",
  "reviewed_evidence": "a4d6e7a0149d6852bf348d6277c4200720320f9c",
  "main_at_read": "a4d6e7a0149d6852bf348d6277c4200720320f9c",
  "e6_parent": "e0ea57665d00a643a8c392dfb9f6a84a723729af",
  "workflow_blob_t6": "f1ddbbfc0cbaa4602663428d569b61dbf12bd068",
  "workflow_blob_e6": "f1ddbbfc0cbaa4602663428d569b61dbf12bd068",
  "workflow_sha256_reported": "e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85",
  "workflow_sha256_independently_recomputed": false,
  "confirmed_source_defect": {
    "path": ".github/workflows/ch001-live-proof.yml",
    "line": 39,
    "context": "jobs.live-proof.env",
    "invalid_reference": "runner.temp"
  },
  "router_reported_manual_dispatch": {
    "outcome": "REJECTED_BEFORE_RUN",
    "raw_http_status": null,
    "live_proof_run_id": null,
    "proof_invoked": false,
    "proof_exit_code": null,
    "artifact_id": null
  },
  "independently_observed_validation_record": {
    "id": 34675672523,
    "event": "push",
    "head_sha": "a4d6e7a0149d6852bf348d6277c4200720320f9c",
    "status": "completed",
    "conclusion": "failure",
    "jobs": 0
  },
  "application_acceptance": false,
  "accepted_application_version": "none",
  "root_state": "awaiting_review",
  "executed_by_architect": {
    "repository_writes": false,
    "workflow_dispatch": false,
    "workflow_reruns": false,
    "sandbox_changes": false,
    "application_tests": false,
    "actionlint": false,
    "reference_shell_checks": 9
  },
  "next_authorized_scope": "CH-001R-r7 definition/validation repair; conditional one fresh T7 router dispatch"
}
```


---

<a id="repair-checklist-template"></a>

# Unexecuted r7 checklist template

```json
{
  "record_kind": "R7_REPAIR_CHECKLIST_TEMPLATE",
  "implementation_commit": null,
  "evidence_commit": null,
  "application_acceptance": false,
  "accepted_application_version": "none",
  "checks": [
    {
      "id": "R7-T01",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T02",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T03",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T04",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T05",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T06",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T07",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T08",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T09",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T10",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T11",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T12",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "luna_or_router"
    },
    {
      "id": "R7-T13",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "router"
    },
    {
      "id": "R7-T14",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "router"
    },
    {
      "id": "R7-T15",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "router"
    },
    {
      "id": "R7-T16",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "execution_owner": "router"
    }
  ],
  "warning": "Template only; not executed gate results and not the original CH001 ledger."
}
```
