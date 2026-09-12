# CH-001R-r8 — Complete architect review and Luna assignment

This is the standalone reading copy. The ZIP contains the original historical artifact, inspection record, reference diagnostic, and blank results template. It is not a claim of application acceptance.

---

# CH-001R-r8 — CI prerequisites and isolated test environments

**Authorized next work:** repair the two demonstrated CI-harness defects exposed by the accepted T7 dispatch. Continue the existing bounded proof; do not redesign the application or sandbox.

**Review verdict:** `REPAIR_REQUIRED`. Application acceptance is `false`; accepted application version is `none`; root state remains `awaiting_review`.

Read the review, assignment, required checks, router/handoff rules, and sources below.

This packet supersedes r7 only for the next repair authorization. It preserves the original North Star and CH-001 acceptance contract, the r5 evidence-directory fix, the r6 sandbox design, and the r7 workflow-context repair. No historical result is rewritten.

The small `reference/` program is an architect diagnostic, not a production patch or a replacement for repository tests. Its five observations show why passing an already-constructed environment back through an override merger changes test behavior on a hosted runner. The packet also carries the original T7 failure artifact and an independently generated inventory.

The implementation agent should use MAX effort, but stop at the bounded scope. No unsandboxed browser, root browser, global policy relaxation, dependency upgrades, paid providers, TikTok, publishing, scheduling, analytics, billing, video, deployment, release, or v0.2 work is authorized.

**Transfer:** give Luna the ZIP and `START_PROMPT.md`. Nothing in this packet claims that the architect sent an external message, pushed a commit, or started a workflow.


---

# Architect review — T7 hosted CI bootstrap failure

## Decision

CH-001 remains unaccepted. Authorize **CH-001R-r8** to address two CI-harness problems together: actionlint is not provisioned before the tests that use it, and a test helper reintroduces intentionally deleted environment variables. Repairing only the first would leave the second failure present.

The workflow-definition repair from r7 has made measurable progress: GitHub accepted a fresh manual dispatch, allocated a job, checked out the requested T7 source, and completed the identity/environment setup and Node setup. This is no longer the r6 pre-run workflow rejection. It is also not a new Chromium sandbox failure: no browser installation, sandbox qualification, or application proof was reached. [S1–S4]

## Bound identities

| Field | Observed value |
|---|---|
| Repository | `klole/reel-farm` |
| P7 | `9fb748ef6b22a21ed24a8a5fa66e4ec1463a049a` |
| T7 | `6b02857401a9b1e81e1bd36d5a4418f90903adcb` |
| T7 tree | `fdbe7da15964659d4e2514580f6606f5731790ce` |
| E7 / definition commit W7 | `6e4f9b3d288b7177ebfc8b49ff3c833610640060` |
| E7 tree | `b5a3861114bdde0b6c629d2fda424982226bcc67` |
| Workflow blob | `2070e80be5355537631a7b2cf833eeb0a6cf28cb` |
| Workflow SHA-256 | `98808688f0261296f6c0ddd0b3b34b04e67bc2d74735660512ab6c1852849c51` |
| Fresh manual run / attempt | `34678495442` / `1` |
| Job | `103512556268` |
| Artifact | `10293345418`, `ch001-live-proof-34678495442-1` |
| Artifact bytes / SHA-256 | `7505` / `c623cdbadeee57182434cc360c8a098bac56a1ad0db0cdc17219c837b3c7c37a` |

E7 was the observed remote `main` at review. The next agent must record its own actual base and verify any later router/packet-only descendants instead of resetting the repository to this record. T8/E8/W8 do not exist in this packet; report their actual identities when created. [S1, S4]

## Historical hosted result

The first failing job step was **Run dependency-free CI repair regressions**. Its `node --test tests/ci` invocation discovered 50 tests: 45 passed, 5 failed, and none were skipped. The failed cases were R7-T01, R7-T02, R7-T03, R7-T04, and R7-T07. These are CI-helper tests, not application acceptance gates. [S2, S3]

The outer report records `CI_BOOTSTRAP_FAILURE`, `primary_stage=ci-helper-regressions`, and bootstrap exit `1`. It records `proof_invoked=false` and `proof_exit_code=null`. There is no fresh hosted application gate ledger, no application ZIP, and no screenshot/preview evidence for this run. Do not replace the absent hosted gate counts with 4/0/68 from an earlier local proof, or with 45/5 from the CI test runner. [S3]

The cleanup step returned successfully with “no owned policy record.” That is a safe no-policy cleanup observation, not proof that a policy was installed and later removed. The archived CI result still says artifact delivery `PENDING`, because that file was uploaded before the later delivery receipt was written. GitHub's artifact metadata and the independently verified archive establish delivery; neither the archive nor its JSON was modified to insert a later status. [S2, S3]

## R8-F01 — Missing actionlint prerequisite

**Confirmed by hosted output and source.** R7-T02 reports: “No usable actionlint executable found; install pinned v1.7.7 or set ACTIONLINT_BIN.” R7-T01 receives the wrapper's tooling-unavailable code 2 instead of the expected semantic-rejection code 1. R7-T03 and R7-T04 cannot obtain real validator diagnostics. [S2, S5, S6]

The published workflow runs the complete CI module before native pnpm bootstrap and project installation. R7's new module invokes the real actionlint binary, but the workflow does not provision that binary or set `ACTIONLINT_BIN` before the module runs. The local handoff used an explicit local `ACTIONLINT_BIN`; that path is not transferred to a fresh runner. The description “dependency-free” ceased to be accurate for the whole suite once it acquired this external-tool dependency. [S4–S8]

**Required disposition:** provision the existing pinned validator before the first consuming test, export its verified absolute path, and execute the normal semantic wrapper against the current workflow. Do not skip semantic tests, redefine exit 2 as an expected semantic failure, depend on an image's incidental PATH contents, or upgrade actionlint to solve provisioning.

## R8-F02 — Prepared fixture environment is merged twice

**Confirmed by source, hosted failure, and isolated local reproduction.** `makeRuntimeFixture()` creates an environment with `withEnvironment()`. For missing-input cases it deletes a key. The fixture passes that completed object to `run()`, which calls `withEnvironment()` again and starts from the real `process.env`. An absent key in the completed fixture has no deletion marker, so a hosted parent value returns. [S5]

In the hosted failure, R7-T07 labels a case “missing RUNNER_TEMP,” but the initializer receives the real parent's valid `RUNNER_TEMP` and exits 0. The assertion requiring a failure then fails. On a machine without that parent variable, the same flawed test can pass. This is a test-isolation bug, not proof that the production initializer fails to validate a genuinely absent variable. [S2, S5, S7]

There is an adjacent evidence-integrity risk: deleting `GITHUB_ENV` in a fixture and remerging the parent can direct an append into the real parent environment file. The hosted test stopped at its earlier failing case, so this review does not claim that happened in the actual Actions job. An isolated reproduction against the byte-verified T7 initializer did demonstrate the write to a **synthetic** parent file. [S10]

**Required disposition:** distinguish an override map from an already-complete environment. Construct fixture environments once and pass them to child processes exactly. Never repair this by weakening the initializer's missing-input validation, unsetting production runner variables globally, or changing the expected assertion to accept exit 0.

## Architect verification and limits

The downloaded archive matched GitHub's byte count and SHA-256. ZIP CRC checks passed. All eight members were inventoried, including the checked-out bootstrap report, cleanup record, sanitized helper log, and early fallback records. There was no proof report or application gate ledger. See `evidence/historical-run-inspection.json`.

Five isolated environment diagnostics ran under **Node v22.16.0**, not the project's pinned Node 20.19.2. The initializer bytes matched Git blob `0e4dd049b5a7d77382ae05cd0a3710812d184b87`. The reproduction used equivalent environment-merging logic, not an execution of the repository's full test suite. It confirmed both reintroduction scenarios, rejection with exact child environments, and a positive literal-path case. See `evidence/architect-environment-reproduction.json`.

This review did not install or run actionlint, execute pnpm/application suites, create a hosted job, modify host sandbox policy, push repository changes, or send anything to Luna/router. Container access to public GitHub via git was unavailable due to DNS resolution; source/artifact review used the connected GitHub tools. R8 must obtain its own pinned-tool and Node 20 evidence before publication.


---

# Luna MAX assignment — CH-001R-r8

## Objective and authority

Repair **R8-F01 and R8-F02 together** and demonstrate the pre-install CI sequence from a clean checkout with controlled hosted-like environment variables. Then return new implementation/evidence commits for one router-controlled hosted dispatch. This is a continuation of CH-001, target v0.1.0, not full acceptance or a new feature chapter.

Read the r7 handoff, its source/evidence, the original CH-001 contract, the r6 sandbox authorization, this review, and the fresh T7 artifact. Preserve all historical evidence. Do not overwrite untracked user/router files. Record `git rev-parse HEAD`, `HEAD^{tree}`, branch, and tracked status before editing. Any new base after E7 must be inspected and explained. Do not reset, force-push, or rewrite T7/E7.

## Frozen boundaries

Keep Node `20.19.2`, pnpm `12.3.4`, actionlint `1.7.7`, Playwright `1.63.0`, application dependencies, lockfile, and the native pnpm manifest unchanged. Preserve the working runtime sandbox-state initialization, r5 proof-directory ownership, r6 exact-browser AppArmor policy rules, explicit hosted opt-in, non-root browser/worker, default container restrictions, and cleanup. No changes to the strict 72-gate definitions or evidence standards are authorized.

Do not add providers, accounts, billing, scheduling, publishing, direct TikTok APIs, image generation, remote images, video, release artifacts, public deployment, or v0.2 work. Do not introduce a permissive sandbox mode. Do not reclassify absent proof as application success.

## Workstream A — Make the validator an explicit CI prerequisite

### A1. Provision before use, without a package-manager dependency

The full `tests/ci` suite runs before `pnpm install`. Provision actionlint with Node built-ins and/or standard shell utilities before that step. A short single-purpose helper is appropriate; do not build a general tool manager, a service, or another package-manager framework.

Use the checked-in `scripts/ci/actionlint-provenance.json` as the pinned source of truth:

```text
version:            1.7.7
archive:            actionlint_1.7.7_linux_amd64.tar.gz
archive SHA-256:    023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757
executable SHA-256: 9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c
```

The official archive URL is already recorded there. Fetch only that pinned release for the approved Linux/amd64 runner. Do not use `latest`, a mutable installer piped to a shell, an unverified preexisting executable, or an alternate version. Broader OS support is not needed for this repair; the existing router may continue using its separately verified platform-specific validator.

Create a fresh tool directory under runner temporary storage, separated from `CH001_EVIDENCE_ROOT` and sandbox-policy state. Validate the run/attempt and absolute paths. Do not populate the coordinator-owned `proof/` directory. No `sudo`, privileged install location, or global PATH changes are needed.

Verify the archive SHA-256 **before extracting or executing anything**. Extract only the intended regular executable, or inspect archive members and reject traversal/symlink/hardlink/special-file ambiguity before extraction. Verify the executable SHA-256 and then its `-version` output. Bound download attempts and timeouts; TLS validation stays enabled. A digest, version, download, platform, or extraction failure must terminate this prerequisite with a truthful nonzero result.

Publish the verified absolute `ACTIONLINT_BIN` through `GITHUB_ENV` for subsequent steps. Export it in the current shell as well when that same shell consumes it. Do not assume writing `GITHUB_ENV` changes the current process environment. Keep the existing lint wrapper's real semantic checks and its negative-tool fixtures compatible; the hosted provisioning path, not a fake test executable, must carry the trusted digest evidence.

### A2. Workflow order and reports

The relevant order must become:

```text
checkout/identity + sandbox-state binding
→ pinned Node setup
→ provision and verify pinned actionlint
→ semantic validation of current tracked workflows
→ complete CI regression suite
→ existing native pnpm bootstrap
→ frozen project install
→ existing browser installation / qualification / bounded proof
→ existing cleanup and evidence delivery
```

Retain pre-publication validation on the editing/router host too. An in-workflow check supplements it; it cannot rescue a workflow GitHub refuses to parse.

Name the new provisioning and workflow-validation steps/stages clearly. A narrow update to `scripts/ci/ci-result.mjs` is allowed to register their outcomes as blocking bootstrap prerequisites, preserve the first failure, and keep downstream proof `false/null` when blocked. Do not rewrite the reporter architecture. Missing prerequisite outcomes, skipped checks, or an upload success must not create a green result. The final job must enforce captured failures after evidence collection.

The actionlint prerequisite report must include observed tool path/version, archive URL and expected/measured digest, executable expected/measured digest, platform, run/attempt, checkout identity, actual exit, and error reason. Workflow validation must record input hashes and actual validator output. Preserve full useful sanitized logs; a historical truncated diagnostic is not a template for hiding the new first failure.

If download or validation fails, collect the outer bootstrap evidence without creating a fake proof report. Do not alter historical artifacts to make delivery or test status look newer than the bytes they contain.

### A3. No dependency-order shortcuts

Do not move these tests after project installation merely to hide an undeclared prerequisite. Actionlint does not come from the application dependencies. Do not skip R7-T01–T04 on Actions or mark tooling-unavailable as a passing negative validator case. The four tests must execute using the same verified validator that accepts the current workflow and rejects the frozen invalid workflows.

## Workstream B — Make fixture environments exact

### B1. Separate overrides from complete environments

At present, `withEnvironment()` is used once to construct a fixture and again to launch it. Fix the boundary rather than individual variable names.

A small explicit API is sufficient:

```js
// Illustrative contract, not a required function name.
runExact(command, args, completeEnvironment); // passes this object as child env
runWithOverrides(command, args, overrides);  // merges once at construction
```

A fixture created for a missing-input case must retain the missing key through the actual `execFile`/`spawn` boundary. Passing an object without a key to a function that remerges `process.env` is not exact-environment semantics. Audit all call sites in the workflow-validation module, including direct validator invocations and negative tooling cases, so each uses the intended API.

Build synthetic runtime environments from a minimal deliberate base. Provide real PATH/Node/Git access where required, but do not accidentally inherit real `GITHUB_ENV`, `GITHUB_PATH`, summary/output files, sandbox readiness/state/report variables, credentials, or workflow evidence destinations. Use temporary files exclusively. Preserve a deliberate verified `ACTIONLINT_BIN` for validator-consuming positive cases; missing-tool cases must explicitly use controlled missing paths.

Do not mutate global `process.env` in a concurrently running test module to simulate cases. A separate child driver with an explicit synthetic parent environment is suitable for hosted-like contamination tests. No test may invoke real AppArmor qualification or touch a real workflow environment file.

### B2. Test a contaminated parent, not just a clean laptop

Construct a parent that already has valid-looking `RUNNER_TEMP`, `GITHUB_ENV`, `GITHUB_RUN_ID`, `GITHUB_RUN_ATTEMPT`, and an inherited sandbox-state value. Each path must point only to synthetic temporary sentinels. Then execute fixtures that omit required keys.

Require actual child-observed absence, nonzero initializer exit, and byte-for-byte preservation of both the fixture's environment file and the synthetic parent's file. Test missing `RUNNER_TEMP` and missing `GITHUB_ENV` independently; do not allow the first assertion failure to hide all later cases. Keep the existing malformed path, newline, invalid run-ID, zero attempt, positive path, and no-state-directory cases.

Add a deliberate old-behavior mutation/reproduction that proves reintroducing the second merge is detected. The provided architect diagnostic demonstrates the causal mechanism but cannot count as the repository's regression implementation.

Do not repair by globally deleting GitHub variables from the production workflow, weakening `initialize-sandbox-state.sh`, accepting exit 0 for missing inputs, or substituting empty strings for every missing-key case.

## Workstream C — Prove the complete pre-install boundary before publication

Run the same entry point the workflow runs: `node --test tests/ci`, under the pinned Node version, with the real pinned actionlint installed by the new helper. Exercise both a clean environment and a hosted-like parent containing the controlled variables. Record discovered/executed/passed/failed/skipped counts, not just file-level summaries. The baseline suite has 50 cases; preserve its meaningful coverage, but report actual new counts rather than hard-coding 50 as a target.

Perform the prefix rehearsal in a disposable checkout/worktree without `node_modules`, with no reliance on a preinstalled actionlint, before running `pnpm install`. Include identity binding, actionlint provisioning, actual workflow validation, and the full test module. Use the real release for one successful install; negative integrity/download cases may use deterministic local fixtures and injection that cannot run in the production path accidentally.

A clean-host rehearsal must verify that tests do not alter synthetic parent `GITHUB_ENV`/`GITHUB_PATH`/summary/output sentinels. Only the actual authorized provisioning/initialization steps may append their specified values to their own test environment files. Make the before/after phases explicit so legitimate initialization writes are not confused with forbidden fixture writes.

Then run frozen installation and scoped regression commands. Inspect the complete workflow with the pinned validator after the final implementation change. Preserve existing sandbox, boundary, reporter, unit, security, lint, typecheck, and build behavior. Check source/pin diffs. No local AppArmor qualification is authorized on the editing machine.

If the editing environment lacks the verified tool or pinned Node, implement and test what is available, mark the remaining check unavailable, and assign exact reproduction to the existing authorized router **before hosted dispatch**. Do not claim that a green source scan substitutes for the prefix rehearsal. A failure of an executed assertion is not merely an environmental NOT_RUN.

## Allowed implementation surface

Expected paths: the live-proof workflow; one small actionlint provisioning helper under `scripts/ci/`; `tests/ci/workflow-validation.test.mjs`; focused prerequisite/isolation tests; and narrowly necessary stage registration in `scripts/ci/ci-result.mjs` and its tests. Add r8 evidence/state/handoff documentation.

Prefer no `package.json` change: `node` can run pre-install helpers directly and `pnpm lint:workflow` already exists. If a scripts-only alias is genuinely useful, explain it and update the narrowly scoped scripts-only expectation in R7-T11 without weakening dependency/pin comparisons. Application source, initializer validation semantics, Dockerfile, Compose security, sandbox policy/helper behavior, and the strict acceptance verifier remain frozen.

Do not modify old manifests/results, delete failed tests, suppress actionlint contexts, or create a wildcard ignore rule. Do not touch an unrelated defect encountered after hosted execution; preserve its evidence and stop for review.

## Stopping point

Finish the bounded code/tests and produce T8/E8 with the evidence described in the following files. Keep `application_acceptance=false`, root `awaiting_review`, and accepted version `none`. Return `READY_FOR_ROUTER_PUBLISH` only when local/prefix requirements genuinely passed; otherwise return `BLOCKED` with an exact missing prerequisite. Do not self-accept CH-001 or initiate the next feature chapter.


---

# Required r8 checks — not replacement application gates

These IDs track only this repair. Preserve the 72 original CH001 IDs and historical outcomes. Do not treat a passing r8 helper checklist as passing application acceptance.

| ID | Required check | Evidence threshold |
|---|---|---|
| R8-T01 | Explain/reproduce the historical two-root-cause failure; keep T7 identities and result intact. | Source mapping plus hosted receipt; no invented app gate counts. |
| R8-T02 | Fresh Linux/amd64 install of pinned actionlint before any pnpm/application installation. | Real archive, expected/measured archive and executable hashes, exact version/path, nonzero commands actually run. |
| R8-T03 | Wrong archive digest, wrong executable/version, unsupported target, and bounded download failure. | Executable negative tests; no unverified binary runs, no green prerequisite, proof not invoked. |
| R8-T04 | Provisioning exports the same verified absolute tool path to subsequent consumers. | Separate process/step simulation; previous env entries preserved; no proof/sandbox tree creation. |
| R8-T05 | Real validator rejects complete frozen T6 and malformed/missing-step fixtures; accepts all current tracked workflows. | Same pinned tool; true semantic diagnostics; absent tool is not semantic rejection. |
| R8-T06 | Missing RUNNER_TEMP stays absent despite a valid hosted-like parent. | Actual child environment and nonzero initializer result; both env sentinels unchanged. |
| R8-T07 | Missing GITHUB_ENV stays absent despite a valid hosted-like parent. | Actual child result; synthetic parent file unchanged. This is independent of T06. |
| R8-T08 | Remaining required keys, inherited state values, invalid paths/newlines, IDs/attempts, and positive literal paths. | Existing coverage retained; exact-environment behavior and no policy/state creation. |
| R8-T09 | Restoring the old second-merge behavior is caught. | Negative/mutation regression demonstrating the precise causal defect, not a source-string assertion only. |
| R8-T10 | Full CI suite runs in clean and controlled hosted-like environments under Node 20.19.2, without node_modules. | Real actionlint; actual discovered/executed/passed/failed/skipped counts; zero unexpected skips/failures; parent sentinel preservation. |
| R8-T11 | Prerequisite/stage failures propagate through outer report, cleanup, upload and final verdict. | First failure retained; skipped/uninvoked proof keeps null exit and no fake report/ledger. |
| R8-T12 | Complete scoped commands and unchanged frozen surfaces. | lint/workflow lint/typecheck/build/unit/security/CI/diff checks; frozen install; hashes and scope diff. |
| R8-T13 | Publication tree revalidated before the one optional hosted dispatch. | Router confirms T8/E8/W8, exact workflow bytes, pinned validator and pre-install rehearsal. |
| R8-T14 | One fresh hosted T8 outcome and independently retrievable evidence. | Actual run/attempt/job/artifact receipt; bootstrap and proof distinguished; application remains unaccepted. |

R8-T13/T14 are router-owned and remain NOT_RUN in Luna's pre-publication handoff. Missing editing-host prerequisites must be completed by the authorized router before dispatch; a declared blocker is not a pass. For T14, distinguish “receipt complete” from “bounded proof successful”: a faithfully captured next failure does not become a successful proof.

## Final implementation commands

Run with pinned tools and save actual commands, timestamps, exits, and test output. Use the exact new provisioning command from the implementation; this packet does not pretend it already exists.

```text
node --check <new actionlint helper>
node --check scripts/ci/ci-result.mjs                 # when modified
bash -n <any new/changed shell helper>
<new verified actionlint provisioning command>
ACTIONLINT_BIN=<verified path> node scripts/ci/lint-workflow.mjs
ACTIONLINT_BIN=<verified path> node --test tests/ci   # before node_modules
<controlled hosted-like parent prefix rehearsal>   # before node_modules
pnpm install --frozen-lockfile
pnpm lint:workflow
pnpm test:ci
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Keep `ACTIONLINT_BIN` available in all positive validator-dependent commands. The actual shell/environment used is part of the evidence. `pnpm proof:ch001` or `pnpm verify:ch001` are not required repetitions on a known-ineligible editing machine for this r8 bootstrap repair. Do not claim they passed. The existing hosted bounded proof follows only after the router's single authorized dispatch.

## Evidence contents

Commit small sanitized records under `docs/evidence/CH-001R-r8/`: README, command table and usable logs, prerequisite report, workflow-validation report, clean-prefix and hosted-like-prefix reports, environment-isolation cases, pin/scope comparison, and `r8-results.json`. Keep raw private output in a run-owned ignored directory and never publish credentials or real GitHub command files.

Preserve the r7 archive as an original historical object. Its eight-member inventory and CRC/digest checks in this packet do not constitute a new T8 test run. Application JPEGs, previews, ZIPs, or gate results must come only from a real later proof.


---

# Router authorization and handoff

## Publication gates

Luna commits execution-affecting work as **T8**, runs/reports checks against that commit, then commits documentation/evidence as **E8**. An evidence-only child cannot silently include another execution change. Report actual full SHAs, trees, parent relationships, and workflow blob/SHA-256; do not embed a guessed future commit.

The router uses the existing authorized workflow-capable publication path. If that path rejects the push, preserve local commits and report the permission blocker; do not request broad tokens in a file or weaken repository permissions.

After publication, verify T8 is an ancestor of E8 and E8 is on the intended `main`, and validate the exact T8 workflow and the actual definition tree **W8** used for dispatch. Record any divergence; do not execute mixed implementation/definition bytes silently. Re-run pinned semantic validation and the clean hosted-like prefix on the actual publication tree where the local environment could not do it. Confirm no unexplained execution changes occurred after T8.

## Dispatch budget

Authorize **at most one new manual dispatch** after the prerequisites above pass:

```bash
# Router only; T8 must contain the real verified 40-character implementation SHA.
: "${T8:?Set the verified full implementation SHA}"
[[ "$T8" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm --ref main \
  -f implementation_sha="$T8" \
  -f sandbox_qualification=true
```

This packet does not authorize a rerun of `34678495442` or any old T3/T4/T5/T6 record, including `34665615514`, `34669975078`, `34671716094`, and `34675672523`. Do not dispatch unchanged T7. Do not loop over attempts or automatically dispatch after any failure.

Record the request response before identifying the run. If the request is rejected before creation, run/job/artifact IDs and proof exit remain null. If the request's outcome is ambiguous, query the existing run list and reconcile the actor/time/input/definition/checkout identity before doing anything else; do not submit a duplicate request. A workflow metadata `head_sha` refers to its definition commit and is not by itself proof of the checkout input.

The fresh job's actionlint bootstrap, current-workflow validation, and complete CI suite must each produce a real result. If the workflow advances to sandbox qualification, consume the already-authorized r6 rules unchanged. Host launch, worker-container launch, and application journey remain distinct proofs.

## Outcome handling

| Outcome | Required action |
|---|---|
| Definition rejected | Save exact rejection and validation inputs; no fake run/artifact. Stop. |
| Tool provisioning or CI suite fails | Preserve first failure, actual helper counts, bootstrap report and artifact. No proof exit when uninvoked. Stop. |
| Sandbox/environment blocked | Preserve measured facts and qualification/cleanup outputs. Do not bypass policy. Stop. |
| Worker/application assertion fails | Preserve source, real execution and artifacts; do not expand r8 into app repair. Stop. |
| Bounded proof succeeds | Return success evidence for architect review; application acceptance remains false. |

No bounded result, even a green workflow, automatically closes all 72 original gates or the remaining original findings.

## Independent receipt

Retrieve the completed run's original artifact. Record name, ID, byte count, SHA-256, expiry, run/attempt/job, requested implementation and actual checkout, definition commit/blob/file hash, and separate bootstrap/sandbox/proof/cleanup outcomes. Verify referenced payload files and note whether their paths are repository-relative or archive-root-relative.

Do not rewrite the archive to replace an embedded pre-upload `PENDING` with a later delivery status. A separate router receipt binds the verified archive to GitHub's upload metadata. Keep fallback bootstrap records distinguished from the checked-out-source report.

Update the r8 evidence index and root project state with current observations, preserving the historical record. No role self-accepts the application. `application_acceptance=false`, accepted version `none`, root `awaiting_review` stay in force.

## Luna return template

```text
phase: CH-001R-r8
status: READY_FOR_ROUTER_PUBLISH | BLOCKED
base/P8: <actual>
T8/tree: <actual>
E8/tree: <actual; evidence-only child>
workflow blob/SHA-256: <actual>
validator version/archive/executable hashes: <actual>
pre-install clean prefix: <command, exit, counts, evidence>
pre-install hosted-like prefix: <command, exit, counts, sentinel results>
other commands: <actual exits and logs>
R8-T01..T12: <per-check actual outcomes>
R8-T13/T14: NOT_RUN (router-owned until executed)
R8-F01 disposition: <implemented and tested; evidence>
R8-F02 disposition: <implemented and tested; evidence>
unknowns/blockers: <factual>
publication/dispatch from Luna: <actual; do not imply router action>
application_acceptance: false
accepted_application_version: none
root_state: awaiting_review
external actions: <exact limited downloads/pushes, no invented actions>
```

The router appends actual W8/run/job/artifact and outcome data later; Luna does not manufacture them. “Sent” must state destination: packet delivered in this conversation, forwarded to Luna, repository published, and workflow submitted are different actions.


---

# Sources

These are the inspected primary records. Source claims are specific to their commit/run. The architect's reproduction and digest inspection are independently identified below; no runtime pass is inferred from source code alone.

- **S1 — r7 run and definition identity:** https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=6e4f9b3d288b7177ebfc8b49ff3c833610640060&event=workflow_dispatch&per_page=1 ; E7 metadata: https://api.github.com/repos/klole/reel-farm/git/commits/6e4f9b3d288b7177ebfc8b49ff3c833610640060 . Observed one matching manual run at review.
- **S2 — Actual hosted job and decoded log:** https://github.com/klole/reel-farm/actions/runs/34678495442/job/103512556268 ; jobs endpoint https://api.github.com/repos/klole/reel-farm/actions/runs/34678495442/jobs?per_page=1 . The connected GitHub job-log action returned the full decoded log. It showed 50 tests, 45 passes, 5 failures, missing-actionlint diagnostics, and the missing-RUNNER_TEMP assertion failure. No new job was started by the architect.
- **S3 — Historical artifact:** https://github.com/klole/reel-farm/actions/runs/34678495442/artifacts/10293345418 ; metadata endpoint https://api.github.com/repos/klole/reel-farm/actions/runs/34678495442/artifacts . Original ZIP and unmodified extracted member bytes are included under `evidence/`; inspection is in `historical-run-inspection.json`.
- **S4 — r7 handoff:** https://github.com/klole/reel-farm/blob/6e4f9b3d288b7177ebfc8b49ff3c833610640060/handoffs/CH-001R-r7.md . It reports local checks with explicit ACTIONLINT_BIN and pre-router NOT_RUN fields; do not treat those old fields as current hosted facts.
- **S5 — Defective test boundary:** https://github.com/klole/reel-farm/blob/6b02857401a9b1e81e1bd36d5a4418f90903adcb/tests/ci/workflow-validation.test.mjs . Inspect `withEnvironment`, `run`, `makeRuntimeFixture`, and R7-T01–T07.
- **S6 — Validator wrapper:** https://github.com/klole/reel-farm/blob/6b02857401a9b1e81e1bd36d5a4418f90903adcb/scripts/ci/lint-workflow.mjs . Missing tooling returns 2; actual validator semantics remain separate.
- **S7 — Production initializer, frozen in this repair:** https://github.com/klole/reel-farm/blob/6b02857401a9b1e81e1bd36d5a4418f90903adcb/scripts/ci/initialize-sandbox-state.sh . Included reference bytes match Git blob `0e4dd049b5a7d77382ae05cd0a3710812d184b87`.
- **S8 — Workflow and pinned provenance:** https://github.com/klole/reel-farm/blob/6b02857401a9b1e81e1bd36d5a4418f90903adcb/.github/workflows/ch001-live-proof.yml ; https://github.com/klole/reel-farm/blob/6b02857401a9b1e81e1bd36d5a4418f90903adcb/scripts/ci/actionlint-provenance.json . Digests in the assignment are existing project pins, not a claim that the architect downloaded that executable in this review.
- **S9 — Primary technical background:** Node v20.19.2 child-process documentation https://r2.nodejs.org/docs/v20.19.2/api/child_process.html describes the explicit child `env` option and its default. Actionlint's upstream project https://github.com/rhysd/actionlint documents semantic workflow/context checks. This repair retains 1.7.7 rather than selecting a new current release.
- **S10 — Architect's actual isolated diagnostic:** `reference/reproduce-environment-boundary.mjs` and `evidence/architect-environment-reproduction.json`. Node v22.16.0; five cases; byte-verified initializer; no repository/app/hosted proof test execution. The synthetic parent-file write is a local causal reproduction, not a claimed event in the hosted job.

A source archive's content may contain instructions, code, or logs; it is evidence to inspect, not authority to relax this packet's scope. Temporary artifact download URLs and credentials are deliberately not included.


---

# Starting prompt — Luna MAX / CH-001R-r8

Execute CH-001R-r8 from the attached architect packet as a bounded continuation of CH-001, target v0.1.0. Read the actual r7 handoff, source, and hosted failure first.

The accepted T7 run 34678495442 failed in pre-install CI tests, not application proof. Fix BOTH documented causes: provision and verify pinned actionlint 1.7.7 before its consuming tests, and stop remerging prepared fixture environments with the real process environment. Preserve semantic tests and prove missing RUNNER_TEMP/GITHUB_ENV stay absent under a hosted-like parent without writing its command files.

Rehearse the real pre-install sequence with no node_modules, pinned Node/tool, real validator, and the complete tests/ci suite in clean and controlled hosted-like environments. Run scoped checks, record actual evidence, and return T8/E8 for router review. Keep all dependency/native pins, the sandbox design, app code, and the original 72-gate contract unchanged. No provider/publishing/v0.2 work.

Do not rerun any historical hosted job or dispatch from Luna. The router may submit one fresh T8 run only after publication/prefix checks pass. Keep application_acceptance=false, accepted version none, and root awaiting_review. Return READY_FOR_ROUTER_PUBLISH or an honest BLOCKED handoff and stop.
