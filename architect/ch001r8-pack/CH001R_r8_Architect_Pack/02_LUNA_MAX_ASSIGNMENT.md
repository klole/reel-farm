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
