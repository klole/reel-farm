# CH-001R-r9 — Complete architect review and Luna MAX assignment

This is a bounded v0.1.0 bootstrap repair, not application acceptance. The ZIP contains the same assignment plus original historical evidence and runnable reference diagnostics. No new GitHub request is submitted by this file.

[Start](#start) · [Review](#review) · [Luna assignment](#assignment) · [Acceptance/evidence](#evidence-contract) · [Router control](#router) · [Sources](#sources) · [Reference appendix](#reference-appendix)

<a id="start"></a>

# CH-001R-r9 — Report-path boundary repair

**Status:** authorized bounded repair, not acceptance. **Target:** Open Slideshow Studio v0.1.0. **Agent:** Luna MAX. **Application acceptance:** false. **Root:** awaiting_review. **Accepted application version:** none.

This packet responds to the completed T8 hosted run `34928718810`, attempt 1. It supersedes r8 only for the next repair and dispatch decision; the North Star, original CH-001 72-gate contract, and historical evidence remain authoritative and unchanged.

## Decision

Repair the caller/helper report-path mismatch, reject invalid report paths before provisioning side effects, and add a regression/rehearsal at the actual workflow-shell boundary. Do not revisit the editor, sandbox design, dependency versions, providers, or publishing. Do not automatically dispatch anything.

Read [the review](#review), then [the Luna assignment](#assignment), [the test/evidence contract](#evidence-contract), and [router rules](#router). [Sources](#sources) identify the inspected revisions and primary technical documentation. The original hosted artifact and its independent inspection are under `evidence/`.

## Read this distinction before starting

The hosted job started and failed in `actionlint-bootstrap`. It did **not** run the application proof. There is no fresh hosted 72-gate ledger, sandbox success, worker result, or export. Local r8 checks remain historical local evidence, not hosted passes.

The source change should stay small. The significant test requirement is that the rehearsal execute the same source-controlled shell body and use the same raw environment-path forms as the workflow, not a separately assembled sequence that silently substitutes an absolute path.

## Baseline

- P8: `f2d6baa075af14fbe74e836240198a90ea5d4fd1`
- T8: `0144f6c41ae4c6143a2dc46fe22d59d453ce8763`
- E8 / reviewed main: `d04a0a70d890890132041061be87742396c1909e`
- T8 tree: `f16f32465b37439774369ddf002a22063c104088`
- E8 tree: `40b9bc095b139a19e1c42130bf5e43ca15c79cc6`

If the router commits this packet as P9, record its real SHA and verify that its delta from E8 is packet/evidence-only. Never manufacture P9/T9/E9 identifiers. Investigate unrecognized execution-affecting changes before applying this assignment.

## Execution boundaries

Luna implements and verifies locally, records T9 and E9, and stops for router review. The router owns publication and any subsequent manual GitHub request. The narrow conditional allowance for one fresh T9 dispatch is defined in `04_ROUTER_HANDOFF.md`; passing local checks does not itself trigger it. All historical run IDs remain read-only evidence.

The reference diagnostics in this package are **not** repository test passes. They exercised only a proposed path resolver and a focused inspected guard excerpt under Node v22.16.0. Full validation must use the project-pinned Node and actual bootstrap/reporter code.

---

<a id="review"></a>

# Architect review — T8 hosted bootstrap failure

## Verdict

**CH-001R-r8 is not accepted as a hosted CI repair. Authorize CH-001R-r9 only.** Application acceptance remains `false`, accepted version remains `none`, and root state remains `awaiting_review`. This failure is in the CI bootstrap integration, not an observed application assertion or another observed Chromium launch failure.

## Verified identities and outcome

The repository handoff and the revision comparison identify T8 as `0144f6c41ae4c6143a2dc46fe22d59d453ce8763` and E8 as its evidence child `d04a0a70d890890132041061be87742396c1909e`. The fetched main ref resolves to E8. The hosted artifact records requested and actual checkout as T8, with E8 as the workflow definition. [S1, S2, S3]

| Item | Observed value |
|---|---|
| Hosted run / attempt | `34928718810` / `1` |
| Job | `104252240220`, `live-proof` |
| Event / GitHub conclusion | `workflow_dispatch` / `failure` |
| W8 blob | `fb4d3e4ee58eff81e43395fa6df99c53b65de417` |
| W8 file SHA-256 recorded in source handoff | `0ca1701d63be141fccff778c03e199cd3a55c5502d186000adf0e4bd545eac6c` |
| Primary stage | `actionlint-bootstrap` |
| Outer classification | `CI_BOOTSTRAP_FAILURE` |
| Bootstrap exit | `1` |
| Proof invoked / proof exit | `false` / `null` |
| New hosted application gate counts | unavailable, not copied from any local ledger |
| Artifact ID from GitHub | `10380711446` |
| Artifact name | `ch001-live-proof-34928718810-1` |
| Archive bytes | `5558` |
| Archive SHA-256 | `3c3905e781479fb627481c6bbf5a0bbea03ae1ab93d323cfda5b1475415db92f` |
| GitHub-listed expiry | `2026-09-29T04:24:53Z` |

The router message supplied artifact ID `10380718846`. GitHub's actual artifact listing and successful download use **`10380711446`**; name, length, and digest match the supplied values. Preserve that discrepancy in the receipt rather than silently changing historical text. [S3]

GitHub reports run creation at `2026-09-15T04:24:40Z`, which is September 14 at 11:24:40 p.m. in America/Chicago. These are source timestamps; no artificial review timestamp has been assigned.

The independent inspection checked ZIP integrity, member safety, eight unique members, archive length/digest, identities, failure fields, proof absence, and nonacceptance. See `evidence/historical-run-inspection.json`. The original ZIP bytes are preserved unchanged.

## R9-F01 — Confirmed caller/helper contract mismatch

The job defines `CI_BOOTSTRAP_REPORT` as a repository-relative path:

```text
artifacts/ch001r4/r4-<run>-<attempt>/bootstrap/public/bootstrap-result.json
```

The `actionlint_bootstrap` step then derives:

```bash
stage_report="$(dirname "$CI_BOOTSTRAP_REPORT")/actionlint-bootstrap.json"
```

That is still relative. It is passed to `node scripts/ci/actionlint-bootstrap.mjs --report "$stage_report" --print-bin`. The helper's `writeReport` requires `assertAbsolutePath(path, "Actionlint report path")`. The actual hosted log is:

```text
actionlint bootstrap failed: Actionlint report path must be an absolute path.
```

These observations directly explain the reported stage failure. Correct the caller's argument; do not relax the helper into accepting arbitrary relative paths. Keep the outer report's existing relative form and archive layout. [S4, S5, S8]

## R9-F02 — The rehearsal did not cover this exact argument

E8 reports successful clean/hosted-like no-node_modules checks and 58/58 CI tests. Its command record describes a direct helper invocation with `--report <prefix-evidence>/actionlint-bootstrap.json`, followed by separate validator and test commands. It does not document execution of the actual workflow step's shell body, report derivation, and outer `record-stage` call. [S6]

Those successful local helper checks need not be false to miss this bug. They are insufficient evidence for the caller integration. R9 must bind rehearsal inputs and shell commands to actual committed workflow bytes. A valid YAML/Actions definition also does not validate the runtime meaning of a helper's string arguments.

## R9-F03 — Report validation happens late

In inspected T8 code, report-path validation occurs in `finally` through `writeReport`. Before that, the provisioning path may create temporary directories, download and verify the tool, append `ACTIONLINT_BIN` to `GITHUB_ENV`, and set success bookkeeping. A report-write exception may then become the observable CLI failure. [S5]

This is a source-confirmed ordering risk, **not** proof that all those steps happened in this particular hosted run. No `actionlint-bootstrap.json` exists in the artifact, so the review does not claim archive/executable verification succeeded or failed there. R9 may make the narrowly related early input-validation correction without redesigning the provisioner.

## Evidence interpretation

Workflow validation, CI regressions, pnpm bootstrap, project install, Chromium install, sandbox qualification, Docker preflight, and bounded proof are skipped after the failed stage. No new application test failures or successes can be inferred. [S3]

The archive contains `sandbox-qualification.json`, but its status is `NOT_RUN`, with cleanup `NOT_RUN_NO_OWNED_POLICY`, null executable identity, and no observed browser sandbox. Its presence is cleanup output, not executed qualification. The requested `sandbox=true` field is not runtime success. Likewise, null policy observations do not establish measured policy equivalence. [S8]

The archived outer report still says `artifact_delivery=PENDING`: it was captured before the workflow's post-upload recording. GitHub's artifact listing and the successful byte-checked download establish delivery independently; do not rewrite the archived report to make it look post-upload. [S3, S8]

The old `CH-001R-r4` phase/run-key naming is a legacy reporting convention, not the demonstrated cause. Cosmetic renaming is out of scope for this repair.

## Limits of this review

Read-only GitHub retrieval, archive inspection, and isolated reference diagnostics were performed. Ten reference path checks passed under Node v22.16.0; they did not execute the complete bootstrap, real actionlint, project tests, sandbox policy, Docker, or a hosted run. Container-side source downloads failed DNS resolution and connector text materialization was unavailable; no full source checkout or application-test execution is claimed.

The next assignment specifies the real checks required from Luna/router. No repository write, workflow dispatch, rerun, policy mutation, or external-agent send occurred in this review.

---

<a id="assignment"></a>

# Luna MAX assignment — CH-001R-r9

## Goal and stop point

Make the actual actionlint bootstrap workflow step produce an absolute report filename in the existing evidence directory, prove the repaired caller/helper boundary, and return T9/E9 for review. Do not finish by writing another plan. Implement the bounded correction and run all locally available required checks. Do not start the application feature chapter or dispatch GitHub Actions from the editing box.

The target remains v0.1.0, not a new application release. Preserve the original 72 acceptance requirements. R9's regression checklist is a repair checklist, not a replacement application gate ledger.

## First reads and source control

Record the real starting HEAD and tree. Read this packet, `handoffs/CH-001R-r8.md`, `docs/evidence/CH-001R-r8/commands.log`, the current project state, and the actual workflow/provisioner/reporter. Verify the reviewed T8/E8 ancestry and any packet-only P9 additions. Inspect the supplied original hosted artifact locally; do not trigger or rerun a workflow to reproduce the history.

Preserve historical reports as immutable observations. Local old successes, old failed runs, and current fresh tests must have separate identities. A documentation commit can follow T9, but execution-affecting edits after the tested T9 require a new final implementation commit and repeat verification.

## A. Correct the workflow caller

In `.github/workflows/ch001-live-proof.yml`, at `id: actionlint_bootstrap`, change only the report-path construction and any directly necessary caller-side checks. Keep the following invariants:

- The actual argument passed to `--report` is absolute and single-line.
- It denotes `actionlint-bootstrap.json` beside the same run's `CI_BOOTSTRAP_REPORT` file.
- The CLI and the subsequent `record-stage --detail-file` consume the same `stage_report` value.
- `CI_BOOTSTRAP_REPORT` itself may remain repository-relative; do not normalize every unrelated environment variable.
- Do not create the coordinator-owned `proof/` or `proof/public/` tree.
- Keep actionlint bootstrap before workflow validation and the complete CI regressions.
- Leave pinned version/digests, `ACTIONLINT_BIN` propagation, failure exit handling, and artifact collection intact.

Recommended minimal assignment, evaluated from the checkout working directory:

```bash
stage_report="$(node --input-type=commonjs -e '
  const path = require("node:path");
  const base = process.env.CI_BOOTSTRAP_REPORT;
  if (typeof base !== "string" || base.length === 0 || /[\0\r\n]/.test(base)) {
    throw new Error("CI_BOOTSTRAP_REPORT must be a non-empty single-line path.");
  }
  process.stdout.write(path.resolve(path.dirname(base), "actionlint-bootstrap.json"));
')"
```

This preserves an already-absolute base and resolves a relative one against the working directory. Check that the workflow and rehearsal use the checked-out repository as that working directory. Do not hard-code `/home/runner/...`; do not prefix the workspace twice; do not rely on undocumented shell expansion inside an environment value. [S7]

An equivalent smaller correction is acceptable if all tests below pass. The reference shell in `reference/` is explanatory only, not an instruction to add an unnecessary parallel production implementation.

## B. Validate an explicit report path before side effects

Make one narrowly scoped change in `scripts/ci/actionlint-bootstrap.mjs`: when an explicit report path is supplied through options or `ACTIONLINT_BOOTSTRAP_REPORT`, validate it before creating directories, downloading, executing the tool, or writing GitHub command files. Keep the existing no-report/null behavior if it is currently supported.

For example, derive the raw requested report path and pass it through the existing `assertAbsolutePath` at function entry, before the provisioning try/finally begins. Keep the existing writer's defensive validation too. An invalid explicit path must return nonzero without attempting to write a report to that invalid path or publishing a tool path. Do not change the guard to silently resolve a relative path inside the provisioner: the workflow caller must honor the established API contract.

This is input-shape validation, not a new storage subsystem. Do not add a generic path framework, broad reporting rewrite, new security policy, or multi-provider bootstrap abstraction. A writable-looking absolute path can still fail at actual I/O; preserve an explicit nonzero outcome in that case.

## C. Test the exact workflow boundary

Add a regression that runs the actionlint bootstrap shell body from the **actual workflow**, including its `stage_report` derivation, helper invocation, stdout capture, environment propagation checks, and `record-stage` invocation. Use the real production helper and reporter for the main regression.

The test must initialize the same outer CI report structure and use the raw relative `CI_BOOTSTRAP_REPORT` from the workflow. Do not quietly replace it with an absolute path before running the step. Capture the helper report and then inspect the outer reporter's persisted attestation and exit fields.

Use one of these bounded reuse mechanisms:

1. Extract the named literal `run: |` body from the validated current workflow, record its hash, and execute those bytes in a child Bash process; or
2. Factor that one shell body into a small source-controlled script invoked by both workflow and rehearsal, and verify the actual workflow invocation and unmodified raw job environment values.

Prefer the smaller change. If using a dependency-free block extractor, make it fail on ambiguous/missing IDs or unsupported formatting. It is an extraction utility, not a replacement for actionlint's workflow validation. Do not introduce a full CI emulator or new application dependencies just to parse YAML.

A unit test with a stubbed downloader is useful for failure branches, but cannot replace the principal real-tool caller/recorder regression. A predownloaded **official, digest-verified** actionlint archive is acceptable for repeatable local tests through the existing supported archive override. Record that it was cached/offline rather than claiming a fresh download. The hosted workflow keeps its pinned download route.

### Frozen negative control

Use T8's exact workflow source as a historical local regression fixture. Confirm its old relative-path argument is rejected by the unchanged contract. Distinguish a regression test that expects rejection from a failed application gate. This local fixture execution is not an authorization to rerun T8 on GitHub.

Do not require an expensive real download merely to prove an invalid report path. The early validation test should demonstrate rejection before provisioning. Retain the original hosted artifact as the actual historical full-step failure evidence.

### Corrected positive control

Run the complete repaired actionlint step with the real helper/reporter and a verified real validator. Require all of the following: actual step exit zero, inner report present and parseable, inner status PASS with matching version/digests, current-shell `ACTIONLINT_BIN` absolute, intended environment file updated only as expected, and the outer recorded actionlint stage PASS referencing the same report. This does not require overall CI success before later stages execute.

## D. Rehearse a source-bound pre-install prefix

Before publication, rehearse the actual sequence up through CI regressions in independent clean checkouts/worktrees of final T9 without any `node_modules`:

```text
record real source identity and initialize outer report
initialize the run-owned sandbox-state environment binding only
provision actionlint using the workflow step's exact report derivation
validate current tracked workflow(s) with that same real actionlint
run the complete node --test tests/ci suite
inspect generated reports and command-file sentinels
```

Use the same working directory, raw relative report paths, command arguments, and environment-file transfer behavior as the workflow. Extract or share the actual step commands rather than recreating this list as a similar-but-different script. Record workflow SHA-256 and hashes for each extracted/shared body used.

Run two modes: a clean parent and a hosted-like parent carrying synthetic `RUNNER_TEMP`, `GITHUB_ENV`, `GITHUB_PATH`, `GITHUB_OUTPUT`, `GITHUB_STEP_SUMMARY`, run/attempt identifiers, and inherited sandbox-state data. The prefix never calls sandbox qualification; its explicit opt-in must remain false for any guard-sensitive local context.

Only synthetic command files may be writable. Do not pass a real GitHub token, a developer's `.env`, account credentials, real runner command-file paths, or a real policy state directory into child tests. Complete child environments remain complete; do not restore deleted variables by re-merging `process.env`.

At each simulated step boundary, apply newly written single-line environment records as data, not with `source` or `eval`. Verify separate consumers receive the same verified tool path and run-owned state path. Compare parent sentinels before/after. Do not overwrite the real shell's GitHub command files to emulate a runner.

No Docker/Chromium is required for this pre-install prefix. If a local external tool cannot be obtained, return a specifically blocked verification result, not a green substitute. A capable router may perform the exact same source-bound preflight; do not dispatch first and use GitHub to discover an already-testable bootstrap argument mismatch.

## E. Scope boundary

Allowed execution-affecting surfaces are the workflow caller, the provisioner's early report input check, focused bootstrap/CI regression tests, and a small source-bound prefix rehearsal helper if needed. A scripts-only package entry to run the rehearsal is permissible; dependency tables and lockfile must not change. Update relevant handoff/evidence/current-state files.

Freeze `scripts/ch001-sandbox.mjs` and its policy behavior, the worker and renderer, application packages, Dockerfile/Compose security defaults, Node/pnpm/Playwright versions, actionlint version and provenance digests, native pnpm manifest, the strict verifier, and the original acceptance contract. Leave legacy r4 run paths/phase labels alone unless a directly proven functional issue requires architect review first.

No fal.ai, ScrapeCreators, Pinterest, text/image generation, direct official TikTok API, publishing bridges, scheduling, analytics, video, billing, deployment, release/tagging, or v0.2 work. No global policy changes, unsandboxed browser fallbacks, root browser, unconfined container, or credentials work.

## F. Verification and handoff

Use final committed T9 for reported acceptance evidence. Run syntax checks for changed modules/shell, real `pnpm lint:workflow`, `pnpm test:ci`, both source-bound no-node_modules prefixes, frozen install, lint, typecheck, build, unit, security, and `git diff --check`. Do not label tests from a different source commit as T9 passes. Do not repeat an unavailable full local proof merely to reproduce known Docker/Chromium limitations.

Preserve exact raw test output and discovered/executed/passed/failed/skipped counts. File-level Node runner counts and nested case counts are different; report both honestly. Existing tests must remain executed; do not fix this by skipping tests, suppressing failures, accepting the guard error, or removing actionlint.

Return `READY_FOR_ROUTER_PUBLISH` only when the required local/source-bound checks pass. Otherwise return `BLOCKED_VERIFICATION` with exact missing prerequisites. Keep application acceptance false and stop. The router's publication and hosted request are separate, gated actions.

---

<a id="evidence-contract"></a>

# R9 acceptance and evidence contract

## Three different acceptance levels

**Local repair readiness** means R9-T01 through R9-T12 are supported by actual evidence against T9. **Hosted repair outcome** is the result of a separately authorized fresh T9 run and artifact inspection. **Application acceptance** still requires the original CH-001 contract and an architect decision; neither of the first two levels grants it.

Do not require all 72 application gates to pass as a condition of handing off this small bootstrap repair. Equally, do not mark them PASS merely because the repair tests pass. A fresh proof ledger exists only if the coordinator actually produces one.

## Checklist (do not replace original gate IDs)

| ID | Required check and evidence |
|---|---|
| R9-T01 | Read-only historical receipt: correct T8/E8, hosted run/job, actual artifact ID, archive SHA-256/length, and no inherited hosted gate counts. |
| R9-T02 | Historical negative control: exact T8 caller yields a relative report path and the real contract rejects it; original hosted failure bytes remain unchanged. |
| R9-T03 | Real corrected caller step succeeds with the original relative job-level report root; real inner attestation and outer recorded stage agree. |
| R9-T04 | Quoted spaces and already-absolute report bases work; helper and recorder consume one identical target located beside the correct outer report. |
| R9-T05 | Missing, empty, multiline, and otherwise invalid explicit report inputs reject; no fallback to a guessed current/home directory. Preserve optional null/no-report semantics. |
| R9-T06 | Early rejection is side-effect-free: no download/tool execution, no tool directory creation, no command-file modification, no false PASS attestation. Use explicit spies/sentinels for failure-only tests. |
| R9-T07 | Failure propagation: helper nonzero cannot be erased by successful recording; report I/O failure remains nonzero; uninvoked proof is false/null. No stale prior attestation can satisfy success. |
| R9-T08 | Clean and hosted-like source-bound prefixes use exact final workflow bodies/raw environment forms, independent no-node_modules checkouts, real actionlint, outer reporter, and isolated command files. |
| R9-T09 | Complete prior r4–r8 regression suite plus new tests executes with nonzero counts, zero failures/skips; deleted fixture variables do not reappear and parent files are unchanged. |
| R9-T10 | Actual pinned actionlint accepts complete final workflow and still rejects the historical invalid T6/other semantic-negative controls for their intended reasons. No actionlint-regression suppression. |
| R9-T11 | Scoped final commands pass: frozen install, syntax, workflow lint, CI, lint, typecheck, build, unit, security, diff. Frozen source/pin surfaces are compared and unchanged. |
| R9-T12 | Final source identities, raw logs, prefix/body hashes, artifacts, and safe evidence are committed or durably attached; current state remains awaiting_review, not accepted. |
| R9-T13 | Router independently confirms T9/E9 publication ancestry, W9 exact bytes, source-bound preflight, and no execution-affecting post-test delta. |
| R9-T14 | Only if manually authorized: one fresh T9 request, selected by input/definition/actual checkout, settled actual stages, downloaded artifact integrity, and honest sandbox/proof/cleanup results. |

R9-T13/T14 may legitimately be NOT_RUN in Luna's pre-publication handoff. Hosted R6 sandbox checks and original CH001 gates remain separate. If a fresh run fails later, record that specific outcome and stop rather than widening r9.

## Prefix execution record

For each mode provide `prefix-clean.json` or `prefix-hosted-like.json` with: T9 and tree; workflow path and SHA-256; exact named step IDs and source-body hashes; actual cwd; pinned Node version; no-node_modules check; raw CI report/evidence path values; resolved absolute actionlint report target; same target passed to helper and recorder; actionlint expected/measured archive and executable digests and observed version; tool cache/download source; child command exit codes; real complete test counts; inner and outer report paths/hashes; command-file sentinel comparisons; proof/policy tree absence; and precise unavailable checks.

This record must be generated from execution, not hand-filled with optimistic values. Commit the runner/rehearsal script so another reviewer can repeat it. A source manifest is not itself evidence that commands ran.

## Minimum final commands

```text
syntax checks for changed Node and Bash files
pnpm install --frozen-lockfile
pnpm lint:workflow
pnpm test:ci
source-bound clean prefix at T9 without node_modules
source-bound hosted-like prefix at T9 without node_modules
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Use the actual reproducible prefix command chosen in implementation, not this descriptive text in the command-result record. Pin Node `20.19.2`, pnpm `12.3.4`, and existing tool versions. The architect's Node v22 reference diagnostic does not substitute for these results.

## Evidence location and preservation

Create `handoffs/CH-001R-r9.md` and `docs/evidence/CH-001R-r9/`, including the checklist, raw commands, source-bound prefix evidence, frozen-source comparison, and a historical hosted receipt. Update the top/current section of `state/PROJECT_STATE.md` and `state/EVIDENCE_INDEX.md`. Mark all older “next actions” historical; the current r9 router rules take precedence without rewriting earlier outcomes.

Use E9 for evidence/state-only changes after tested T9. Do not claim E9's full SHA inside the very file determining that SHA; return it after commit. Check `git check-ignore` for logs/artifacts and ensure promised evidence is actually present in the final committed or attached package, not just a transient `/tmp` path.

Retain the original T8 ZIP unchanged, with a separate inspection/receipt. Do not rename internal archive members or alter captured status fields. Never include credentials, environment dumps, auth storage, cookies, or real command-file contents. The historical artifact contains a cleanup-generated NOT_RUN sandbox report; do not promote it to a qualification result.

## Hosted result schema

After any authorized new run, distinguish `dispatch_submitted`, `request_accepted`, `run_started`, `bootstrap_status`, `failed_stage`, `sandbox_qualification_status`, `proof_invoked`, `proof_exit_code`, `gate_counts`, `worker_qualification_status`, `cleanup_status`, and `application_acceptance`.

For an accepted run that fails before proof: `proof_invoked=false`, `proof_exit_code=null`, and `gate_counts=null` if no ledger exists. For a rejected request: no invented run/job/artifact identifiers. Null is not zero; NOT_RUN is not PASS. If an artifact is present but the inner report is absent, record missing report evidence rather than reconstructing a report from expectations.

---

<a id="router"></a>

# Router handoff and dispatch control — r9

## Current state

No request is being sent by this packet. It is not permission for an automatic retry. T8's run `34928718810` is settled historical evidence and must not be rerun. No new run ID or artifact exists as a result of this review.

The router first receives Luna's final T9/E9 and source-bound preflight evidence. If local readiness is blocked, do not publish a “verified” label or dispatch as a substitute for missing checks. A capable router may perform the required local preflight itself against exact T9 bytes and document that execution separately.

## Publication checks

Record P9 if used, T9/tree, E9/tree, and current remote main. Verify the recognized ancestry from E8. Confirm E9 contains only documentation/evidence/current-state changes after T9. Run pinned actionlint against the actual publication workflow, not an earlier local file. Record W9 definition commit, workflow blob ID, and SHA-256; T9 and the chosen dispatch head must contain identical workflow bytes.

Check that both source-bound prefix modes ran the real current actionlint step with the raw relative `CI_BOOTSTRAP_REPORT`, real helper/reporter, and no node_modules. Do not accept the old direct helper rehearsal as the replacement. Confirm all promised logs/reports resolve and their recorded hashes match.

Luna does not modify workflow-scoped credentials or workaround a failed push. Use only the established workflow-capable publication path. Do not force-push history. Unrecognized code on main requires a scope/identity check before proceeding.

## Conditional allowance for one manual T9 dispatch

Only after the publication/preflight checks pass, and through a deliberate router dispatch action, this packet permits **at most one fresh manual request for T9** with `sandbox_qualification=true`. There is no trigger from committing, uploading this packet, passing tests, or the previous failure. The assistant has not submitted that request.

The command template is:

```bash
# Fill these with the actual newly verified identities, never T8 or a placeholder.
REPO=klole/reel-farm
T9=REPLACE_WITH_VERIFIED_40_CHARACTER_T9_SHA

gh workflow run ch001-live-proof.yml --repo "$REPO" --ref main \
  -f implementation_sha="$T9" -f sandbox_qualification=true
```

Do not execute a placeholder. Confirm main's intended W9 workflow bytes immediately before the request. Record the request's actual outcome. If it is rejected, stop and preserve the response; do not keep resubmitting. If it is accepted but the run cannot be uniquely identified, investigate by read-only retrieval rather than submitting again.

Select the new run using dispatch event, actor/time, requested implementation, definition SHA, and actual checkout—not just “latest run.” Preserve attempt/job IDs, every relevant stage outcome, original downloaded ZIP, actual API-listed artifact ID, byte length, SHA-256, and expiry. Confirm command results and proof fields from the actual payload. The cleanup report may exist even when qualification is NOT_RUN.

If bootstrap passes and a distinct sandbox/worker/application problem appears, preserve it and return for a new architect decision. Do not patch broadly in this chapter, automatically retry, or mark application acceptance. Even a green bounded proof returns for original-contract review.

## Never rerun these historical records

`34665615514` (T3), `34669975078` (T4), `34671716094` (T5), `34675672523` (E6 push validation), `34676862756` (P7 record), `34678495442` (T7), and `34928718810` (T8). Some identifiers are supplied by the router; they are a do-not-rerun list, not a claim that this review independently inspected every record.

## Luna final message

Return status `READY_FOR_ROUTER_PUBLISH` or `BLOCKED_VERIFICATION`; real base/T9/E9/tree/workflow identities; command results and complete counts; R9 checklist counts; both source-bound prefix report paths; exact report-path repair; any helper ordering change; remaining missing checks; and scope/external-action declaration. Hosted identifiers are null until a real router request/run exists. Then stop.

## Router return message

Report publication sent `yes/no/already` separately from workflow request submitted `yes/no`. Include the verified T9/E9/W9, request outcome, actual fresh run/job/artifact identifiers where present, bootstrap and failed stage, sandbox requested/actually qualified, proof invoked/actual exit, gate counts only when a ledger exists, cleanup, evidence location, and `application_acceptance=false`. Do not use “sent” alone to imply a test passed.

---

<a id="sources"></a>

# Sources and evidence map

GitHub reads were made through the connected GitHub tools. Public technical documentation was checked separately. Historical artifact bytes are included under `evidence/`. Source identifiers below are local document references, not claimed test results.

**S1 — Source state and handoff.**
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/handoffs/CH-001R-r8.md
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/state/PROJECT_STATE.md
- https://api.github.com/repos/klole/reel-farm/git/ref/heads/main (observed E8; this URL is mutable)

**S2 — T8/E8 comparison.**
https://api.github.com/repos/klole/reel-farm/compare/0144f6c41ae4c6143a2dc46fe22d59d453ce8763...d04a0a70d890890132041061be87742396c1909e

**S3 — Actual run, jobs, artifact listing.**
- https://github.com/klole/reel-farm/actions/runs/34928718810
- https://api.github.com/repos/klole/reel-farm/actions/runs/34928718810/attempts/1
- https://api.github.com/repos/klole/reel-farm/actions/runs/34928718810/jobs
- https://api.github.com/repos/klole/reel-farm/actions/runs/34928718810/artifacts
- Actual downloaded artifact ID: `10380711446`; archive SHA-256: `3c3905e781479fb627481c6bbf5a0bbea03ae1ab93d323cfda5b1475415db92f`.

**S4 — T8 caller.**
https://github.com/klole/reel-farm/blob/0144f6c41ae4c6143a2dc46fe22d59d453ce8763/.github/workflows/ch001-live-proof.yml

Inspected the job environment and `actionlint_bootstrap` step. Connector reports blob `fb4d3e4ee58eff81e43395fa6df99c53b65de417`.

**S5 — T8 helper.**
https://github.com/klole/reel-farm/blob/0144f6c41ae4c6143a2dc46fe22d59d453ce8763/scripts/ci/actionlint-bootstrap.mjs

Inspected `assertAbsolutePath`, `writeReport`, `contextFor`, `provisionActionlint`, CLI parsing, and finalization. Connector reports blob `b3fcb7e16796cbc5a39d330bdb763e92592ae5d9`.

**S6 — Recorded local rehearsal.**
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/docs/evidence/CH-001R-r8/commands.log
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/docs/evidence/CH-001R-r8/hosted-like-prefix.json

These records describe successful local helper/test sequences. They do not supply literal workflow-shell execution evidence for the failing report-path derivation.

**S7 — Primary technical documentation.**
- https://nodejs.org/api/path.html — `path.resolve`, `path.dirname`, and absolute versus relative paths. This is a live documentation page, not authority to upgrade project Node.
- https://docs.github.com/en/actions/reference/runners/github-hosted-runners — workspace filesystem and use of supplied path variables.
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — working directories and step execution.

**S8 — Downloaded historical payload and independent inspection.**
- `evidence/ch001-live-proof-34928718810-1.zip` — untouched downloaded archive.
- `evidence/historical-run-inspection.json` — member SHA-256 values, identities, interpretation limits, and 14 executed historical-artifact checks.
- `evidence/T8-ci-result.json`, `T8-bootstrap-result.json`, `T8-sandbox-qualification.json`, and `T8-actionlint-bootstrap.log` — unmodified selected members, copied for convenient reading.

**Reference-only checks.** `evidence/architect-path-diagnostic.json` and `reference/diagnose-report-path.py` describe 10 offline checks of a proposed resolver and an inspected guard excerpt. The complete repository bootstrap, actionlint, project suites, policy operations, and hosted proof were not run by the architect. These checks cannot satisfy R9's real-step/rehearsal requirements.

---

<a id="reference-appendix"></a>

# Reference appendix

These are offline diagnostic materials, not repository acceptance tests. Run the real source-bound checks specified above.

## reference/resolve-actionlint-report.reference.sh

```bash
#!/usr/bin/env bash
# Reference only: splice the stage_report assignment into the existing workflow
# stage after review. This file is not a replacement for the full CI stage.
set -euo pipefail
stage_report="$(node --input-type=commonjs -e '
  const path = require("node:path");
  const base = process.env.CI_BOOTSTRAP_REPORT;
  if (typeof base !== "string" || base.length === 0 || /[\0\r\n]/.test(base)) {
    throw new Error("CI_BOOTSTRAP_REPORT must be a non-empty single-line path.");
  }
  process.stdout.write(path.resolve(path.dirname(base), "actionlint-bootstrap.json"));
')"
printf '%s\n' "$stage_report"
```

## reference/T8-report-guard.excerpt.mjs

```javascript
import { isAbsolute, resolve } from "node:path";
class ActionlintBootstrapError extends Error {
  constructor(classification, message, details = {}) {
    super(message);
    this.name = "ActionlintBootstrapError";
    this.classification = classification;
    this.details = details;
    this.exitCode = 1;
  }
}
function bootstrapError(classification, message, details = {}) {
  return new ActionlintBootstrapError(classification, message, details);
}
function assertSingleLine(value, label) {
  if (typeof value !== "string" || value.length === 0 || /[\0\r\n]/.test(value)) {
    throw bootstrapError("INPUT_INVALID", `${label} must be a non-empty single-line value.`);
  }
  return value;
}
function assertAbsolutePath(value, label) {
  const text = assertSingleLine(value, label);
  if (!isAbsolute(text)) throw bootstrapError("INPUT_INVALID", `${label} must be an absolute path.`);
  return resolve(text);
}
try { process.stdout.write(assertAbsolutePath(process.argv[2], "Actionlint report path")); }
catch (e) { console.error(e.message); process.exitCode = 1; }
```

## reference/diagnose-report-path.py

```python
#!/usr/bin/env python3
"""Offline diagnostic of reference shell/path logic; not a full bootstrap test."""
from pathlib import Path
import os, subprocess, tempfile, json, hashlib, platform

root=Path(__file__).resolve().parent
results=[]
base_env={k:os.environ[k] for k in ('PATH','LANG','LC_ALL') if k in os.environ}

def run(args, cwd, env):
    return subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, timeout=10)

def check(name, value, detail):
    results.append({'name':name,'pass':bool(value),'detail':detail})
    if not value: raise AssertionError(name+': '+str(detail))

with tempfile.TemporaryDirectory(prefix='ch001r9-path-diagnostic-') as td:
    w=Path(td)/'workspace with spaces';w.mkdir()
    raw='artifacts/ch001r4/r4-34928718810-1/bootstrap/public/bootstrap-result.json'
    env={**base_env,'CI_BOOTSTRAP_REPORT':raw}
    old=run(['bash','--noprofile','--norc','-c', 'stage_report="$(dirname "$CI_BOOTSTRAP_REPORT")/actionlint-bootstrap.json"; printf "%s\\n" "$stage_report"'],w,env)
    oldpath=old.stdout.strip()
    rejection=run(['node',str(root/'T8-report-guard.excerpt.mjs'),oldpath],w,base_env)
    check('T8 relative caller value is rejected by the inspected guard excerpt',old.returncode==0 and rejection.returncode==1 and 'must be an absolute path' in rejection.stderr,{'path':oldpath,'guard_exit':rejection.returncode})
    fixed=run(['bash','--noprofile','--norc',str(root/'resolve-actionlint-report.reference.sh')],w,env)
    target=w/Path(raw).parent/'actionlint-bootstrap.json'
    accept=run(['node',str(root/'T8-report-guard.excerpt.mjs'),fixed.stdout.strip()],w,base_env)
    check('Relative report root resolves to the same workspace location',fixed.returncode==0 and fixed.stdout.strip()==str(target) and accept.returncode==0,{'guard_exit':accept.returncode,'expected_basename':target.name})
    check('Spaces in checkout path stay intact','workspace with spaces/' in fixed.stdout,{'space_preserved':True})
    absolute=w/'evidence absolute'/'bootstrap-result.json'
    absolute_result=run(['bash',str(root/'resolve-actionlint-report.reference.sh')],w,{**base_env,'CI_BOOTSTRAP_REPORT':str(absolute)})
    check('Already-absolute report root is not double-prefixed',absolute_result.returncode==0 and absolute_result.stdout.strip()==str(absolute.parent/'actionlint-bootstrap.json'),{'exit':absolute_result.returncode})
    for name,value in [('missing',None),('empty',''),('newline','artifacts/x\nINJECT=1'),('carriage-return','artifacts/x\rINJECT=1')]:
        e=dict(base_env)
        if value is not None:e['CI_BOOTSTRAP_REPORT']=value
        p=run(['bash',str(root/'resolve-actionlint-report.reference.sh')],w,e)
        check(name+' report root rejected',p.returncode!=0 and not p.stdout,{'exit':p.returncode})
    hostile='artifacts/$(touch INJECTION_MARKER)/bootstrap-result.json'
    p=run(['bash',str(root/'resolve-actionlint-report.reference.sh')],w,{**base_env,'CI_BOOTSTRAP_REPORT':hostile})
    check('Shell-looking text is not evaluated',p.returncode==0 and not (w/'INJECTION_MARKER').exists() and '$(touch INJECTION_MARKER)' in p.stdout,{'marker_created':False})
    check('Resolver creates no evidence, tool, or policy trees',list(w.iterdir())==[],{'files_created':[]})

report={'record_kind':'ARCHITECT_REFERENCE_PATH_DIAGNOSTIC','scope':'reference shell resolver plus inspected path-check excerpt only; NOT complete T8 bootstrap, NOT full workflow, NOT actionlint, NOT application proof','node':subprocess.check_output(['node','--version'],text=True).strip(),'python':platform.python_version(),'checks':results,'executed':len(results),'passed':sum(r['pass'] for r in results),'failed':sum(not r['pass'] for r in results),'reference_hashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (root/'resolve-actionlint-report.reference.sh',root/'T8-report-guard.excerpt.mjs')},'not_run':['full actionlint binary validation','full real bootstrap/reporter step','repository pnpm tests','Docker/Compose','Chromium/AppArmor','hosted proof'],'external_actions':{'network':False,'github_write':False,'dispatch':False,'sudo':False}}
(root.parent/'evidence/architect-path-diagnostic.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'checks':len(results),'passed':report['passed'],'failed':report['failed'],'node':report['node']}))
```

## evidence/architect-path-diagnostic.json

```json
{
  "record_kind": "ARCHITECT_REFERENCE_PATH_DIAGNOSTIC",
  "scope": "reference shell resolver plus inspected path-check excerpt only; NOT complete T8 bootstrap, NOT full workflow, NOT actionlint, NOT application proof",
  "node": "v22.16.0",
  "python": "3.13.5",
  "checks": [
    {
      "name": "T8 relative caller value is rejected by the inspected guard excerpt",
      "pass": true,
      "detail": {
        "path": "artifacts/ch001r4/r4-34928718810-1/bootstrap/public/actionlint-bootstrap.json",
        "guard_exit": 1
      }
    },
    {
      "name": "Relative report root resolves to the same workspace location",
      "pass": true,
      "detail": {
        "guard_exit": 0,
        "expected_basename": "actionlint-bootstrap.json"
      }
    },
    {
      "name": "Spaces in checkout path stay intact",
      "pass": true,
      "detail": {
        "space_preserved": true
      }
    },
    {
      "name": "Already-absolute report root is not double-prefixed",
      "pass": true,
      "detail": {
        "exit": 0
      }
    },
    {
      "name": "missing report root rejected",
      "pass": true,
      "detail": {
        "exit": 1
      }
    },
    {
      "name": "empty report root rejected",
      "pass": true,
      "detail": {
        "exit": 1
      }
    },
    {
      "name": "newline report root rejected",
      "pass": true,
      "detail": {
        "exit": 1
      }
    },
    {
      "name": "carriage-return report root rejected",
      "pass": true,
      "detail": {
        "exit": 1
      }
    },
    {
      "name": "Shell-looking text is not evaluated",
      "pass": true,
      "detail": {
        "marker_created": false
      }
    },
    {
      "name": "Resolver creates no evidence, tool, or policy trees",
      "pass": true,
      "detail": {
        "files_created": []
      }
    }
  ],
  "executed": 10,
  "passed": 10,
  "failed": 0,
  "reference_hashes": {
    "resolve-actionlint-report.reference.sh": "9498809245dbea198ed0e17085bcda219529a180cc8a318ddb612145583d16d4",
    "T8-report-guard.excerpt.mjs": "3f86089d7614d6426db1ece76ad982d3e6e52bd3d15ff86b259a67d9561f1b49"
  },
  "not_run": [
    "full actionlint binary validation",
    "full real bootstrap/reporter step",
    "repository pnpm tests",
    "Docker/Compose",
    "Chromium/AppArmor",
    "hosted proof"
  ],
  "external_actions": {
    "network": false,
    "github_write": false,
    "dispatch": false,
    "sudo": false
  }
}
```

## evidence/historical-run-inspection.json

```json
{
  "record_kind": "ARCHITECT_HISTORICAL_ARTIFACT_INSPECTION",
  "source_run_id": 34928718810,
  "source_attempt": 1,
  "job_id": 104252240220,
  "requested_implementation_sha": "0144f6c41ae4c6143a2dc46fe22d59d453ce8763",
  "actual_checkout_sha": "0144f6c41ae4c6143a2dc46fe22d59d453ce8763",
  "workflow_definition_sha": "d04a0a70d890890132041061be87742396c1909e",
  "workflow_blob_sha": "fb4d3e4ee58eff81e43395fa6df99c53b65de417",
  "artifact_id_github_verified": 10380711446,
  "artifact_id_in_router_message": 10380718846,
  "artifact_id_discrepancy": "Use the actual API-listed and downloaded ID. Router message ID is preserved as supplied, not treated as authoritative.",
  "artifact_name": "ch001-live-proof-34928718810-1",
  "archive_bytes": 5558,
  "archive_sha256": "3c3905e781479fb627481c6bbf5a0bbea03ae1ab93d323cfda5b1475415db92f",
  "github_expires_at": "2026-09-29T04:24:53Z",
  "result": {
    "classification": "CI_BOOTSTRAP_FAILURE",
    "failed_stage": "actionlint-bootstrap",
    "bootstrap_exit_code": 1,
    "proof_invoked": false,
    "proof_exit_code": null,
    "application_gate_counts": null,
    "application_acceptance": false,
    "accepted_application_version": "none"
  },
  "checks": [
    {
      "name": "ZIP integrity",
      "pass": true
    },
    {
      "name": "Archive length",
      "pass": true
    },
    {
      "name": "Archive SHA-256",
      "pass": true
    },
    {
      "name": "Archive path safety",
      "pass": true
    },
    {
      "name": "Unique member paths",
      "pass": true
    },
    {
      "name": "Requested and checked-out T8",
      "pass": true
    },
    {
      "name": "E8 workflow definition",
      "pass": true
    },
    {
      "name": "Workflow blob identity",
      "pass": true
    },
    {
      "name": "Primary failure and actual exit",
      "pass": true
    },
    {
      "name": "Proof absent",
      "pass": true
    },
    {
      "name": "No application gate ledger",
      "pass": true
    },
    {
      "name": "Sandbox not run",
      "pass": true
    },
    {
      "name": "Acceptance remains false",
      "pass": true
    },
    {
      "name": "Failure log matches",
      "pass": true
    }
  ],
  "members": [
    {
      "path": "reel-farm/reel-farm/artifacts/ch001r4/r4-34928718810-1/bootstrap/public/bootstrap-result.json",
      "bytes": 6010,
      "sha256": "5d34eb9f133f41e55a955ea74c6ba9c051797bd00f69e7c2a2b3bf5cd49e30e3"
    },
    {
      "path": "reel-farm/reel-farm/artifacts/ch001r4/r4-34928718810-1/bootstrap/public/ci-result.json",
      "bytes": 1342,
      "sha256": "daeff21cb2feedade8a3bea19a6f8ed8b2bf8917ffaf58c11f031e0475a18a4d"
    },
    {
      "path": "reel-farm/reel-farm/artifacts/ch001r4/r4-34928718810-1/bootstrap/public/commands/actionlint-bootstrap.log",
      "bytes": 79,
      "sha256": "fb034cc60766cc5c110b445b174b5d099eddda0999ae5ed7b609c28f2a3c2448"
    },
    {
      "path": "reel-farm/reel-farm/artifacts/ch001r4/r4-34928718810-1/bootstrap/public/commands/sandbox-cleanup.log",
      "bytes": 53,
      "sha256": "7a061ed3fbc0f807e57447d18c1b82d4fc9cbd49da0256717d14192ad7fe1b4e"
    },
    {
      "path": "reel-farm/reel-farm/artifacts/ch001r4/r4-34928718810-1/bootstrap/public/dispatch.txt",
      "bytes": 249,
      "sha256": "e1ab0dd659133e1f50d24e58f89dcb22b97af6c339e742d1a51f39f52a3a19ab"
    },
    {
      "path": "reel-farm/reel-farm/artifacts/ch001r4/r4-34928718810-1/bootstrap/public/sandbox-qualification.json",
      "bytes": 2697,
      "sha256": "c21c349af8964387606f5ba79f486d1eb63dcd85d15b4c9753c588aa9f970fce"
    },
    {
      "path": "_temp/ch001r4/r4-34928718810-1/bootstrap/public/bootstrap-result.json",
      "bytes": 689,
      "sha256": "328db266d426b32b92c5d095ebb1a5bcc4e94b657cf6151a0a9ca612685b5d67"
    },
    {
      "path": "_temp/ch001r4/r4-34928718810-1/bootstrap/public/dispatch.txt",
      "bytes": 193,
      "sha256": "2630d65b03adb70b049ad571b97b1b5b9a8ed2098351a72d6791ce0bcedd2798"
    }
  ],
  "caveats": [
    "This checks downloaded historical bytes, not a rerun.",
    "The archive captures artifact_delivery=PENDING before upload receipt was written. The successful archive download is independent evidence of delivery.",
    "sandbox-qualification.json was emitted by cleanup and is NOT_RUN, not a successful probe.",
    "Requested sandbox=true and null policy readings do not establish effective sandboxing.",
    "No actionlint-bootstrap.json exists; do not infer whether its download/verification partially completed.",
    "No new hosted application gate counts exist; historical local 4/0/68 is not this run."
  ]
}
```

## r9-results.TEMPLATE.json

```json
{
  "record_kind": "R9_REPAIR_CHECKLIST_TEMPLATE",
  "phase": "CH-001R-r9",
  "base_commit": "d04a0a70d890890132041061be87742396c1909e",
  "implementation_commit": null,
  "implementation_tree": null,
  "evidence_commit": null,
  "workflow_blob": null,
  "workflow_sha256": null,
  "target_application_version": "0.1.0",
  "application_acceptance": false,
  "accepted_application_version": "none",
  "root_state": "awaiting_review",
  "checks": [
    {
      "id": "R9-T01",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T02",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T03",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T04",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T05",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T06",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T07",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T08",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T09",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T10",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T11",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T12",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T13",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    },
    {
      "id": "R9-T14",
      "status": "NOT_RUN",
      "command_or_case": null,
      "evidence": [],
      "note": "Luna/router must fill from actual execution; not an application gate."
    }
  ],
  "hosted": {
    "dispatch_submitted": false,
    "run_id": null,
    "job_id": null,
    "artifact_id": null,
    "proof_invoked": false,
    "proof_exit_code": null,
    "application_gate_counts": null
  }
}
```

