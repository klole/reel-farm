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
