# CH-001R-r9 — Complete architect review and Luna assignment

This is the standalone reading copy. The ZIP contains the original historical artifact, inspection record, reference diagnostic, and blank results template. It is not a claim of application acceptance.

---

# CH-001R-r9 — Report-path boundary repair

**Status:** authorized bounded repair, not acceptance. **Target:** Open Slideshow Studio v0.1.0. **Agent:** Luna MAX. **Application acceptance:** false. **Root:** awaiting_review. **Accepted application version:** none.

This packet responds to the completed T8 hosted run `34928718810`, attempt 1. It supersedes r8 only for the next repair and dispatch decision; the North Star, original CH-001 72-gate contract, and historical evidence remain authoritative and unchanged.

## Decision

Repair the caller/helper report-path mismatch, reject invalid report paths before provisioning side effects, and add a regression/rehearsal at the actual workflow-shell boundary. Do not revisit the editor, sandbox design, dependency versions, providers, or publishing. Do not automatically dispatch anything.

Read [the review](01_REVIEW_VERDICT.md), then [the Luna assignment](02_LUNA_ASSIGNMENT.md), [the test/evidence contract](03_ACCEPTANCE_AND_EVIDENCE.md), and [router rules](04_ROUTER_HANDOFF.md). [Sources](05_SOURCES.md) identify the inspected revisions and primary technical documentation. The original hosted artifact and its independent inspection are under `evidence/`.

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

# Starting prompt — Luna MAX / CH-001R-r9

Execute the attached CH-001R-r9 packet against the reviewed E8 baseline, targeting v0.1.0 only.

Fix the workflow's relative `--report` argument to the actionlint bootstrap while preserving the helper's absolute-path contract and all existing pins. Validate an explicit report path before provisioning side effects. Add tests at the actual workflow-shell/helper/reporter boundary, and rehearse the source-controlled prefix with the real validator in clean and hosted-like no-node_modules environments. Use the raw relative report paths from the workflow; do not substitute a separate working command sequence.

Preserve the actual T8 hosted artifact and its failure: run 34928718810, bootstrap failure at actionlint-bootstrap, proof not invoked, proof exit null. The actual API-listed artifact ID is 10380711446, not 10380718846 from the router message. Do not carry local gate counts into hosted evidence.

Run all required final checks, repair only in-scope issues, and return the actual T9/E9 identities, source-bound prefix evidence, complete test counts, and handoff. Do not skip tests or weaken validation. Keep application_acceptance=false, accepted version none, and root awaiting_review.

Do not dispatch, rerun, publish an application release, modify sandbox policy, or start provider/application/v0.2 work. Stop READY_FOR_ROUTER_PUBLISH only after the packet's local requirements pass; otherwise return BLOCKED_VERIFICATION with precise missing checks. Router publication and any later one manual T9 request remain separate actions.
