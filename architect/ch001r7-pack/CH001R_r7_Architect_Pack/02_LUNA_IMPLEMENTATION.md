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

The fuller [reference snippet](examples/initialize-sandbox-state.sh) adds inexpensive single-line/absolute-path and numeric-run guards. Integrate the logic into the existing step rather than replacing the entire workflow with the reduced example.

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

Implement the cases in [the validation contract](03_VALIDATION_CONTRACT.md) using executable tests. Prefer dependency-free Node tests for path and wiring logic, plus real actionlint invocations for semantic validation. Do not replace semantic validation with string searches.

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
