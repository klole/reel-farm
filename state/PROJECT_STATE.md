# Project state — CH-001R-r10 checkpoint

**Last updated:** 2026-09-15 UTC
**State:** `awaiting_review`
**Product:** Open Slideshow Studio
**Target application version:** `0.1.0`

## Current CH-001R-r10 bounded migration diagnosis and startup cleanup repair

- P10 is `df8ce7d938910949fef3840ac2c79ec9c388dc6a` (tree `fe809452e322a858a2ec2dcdc634f712d51c714b`), based on E9 `0f222800f1e91a18cc2f16824a87c9513cd29026` (tree `88cb7927e45605177318448115a28c177c6071a0`); T9 remains `6014a247b124a186a1abfcb6d65a7ef024cf8cfc` (tree `6e590387c666ee3672210d022e51fc9283e07737`).
- T10 implementation is `ec7cc08d6ed229af9780318858d8051202851746` (tree `9e43ac5c00801f7d523405dbe5874d64264fa7cc`). It is limited to bounded Compose command execution, run-owned project validation, failed partial-startup diagnostics, sanitized/bounded service logs, cleanup ownership, focused regressions, and coordinator wiring.
- The historical failed hosted run `34937329430` and artifact `10383922146` remain read-only. Its migration stderr is absent from the archive; Luna did not rerun or dispatch it. Hosted request count for r10 is zero.
- The final-image migration reproduction is `NOT_RUN`: this host has no Docker CLI or Compose daemon. The host-only synthetic `pnpm db:migrate` probe exited `1` before database connection with `ERR_MODULE_NOT_FOUND` for `@oss/db` from `scripts/migrate.ts`. This supports, but does not confirm, the root-script resolution hypothesis in the shipped image. No migration SQL or migration code was changed, and no migration repair is claimed.
- The coordinator now separates startup attempted, project ownership, readiness, and teardown; collects stopped-service state, image IDs, and bounded/redacted logs before teardown; preserves the primary startup failure; records secondary diagnostic/cleanup failures; and writes diagnostics/cleanup before manifest hashing. Early no-startup paths write honest `NOT_RUN` records and issue no teardown.
- Focused diagnostics tests passed. The final host matrix passed lint, typecheck, build, unit (`20/20`), security (`4/4`), official actionlint `1.7.7`, `pnpm test:ci` (`7/7` file-level), and both source-bound prefixes (`7/7` file-level and `69/69` nested, no `node_modules`).
- The one local T10 proof run `r10-local-proof` exited `2` as `BLOCKED_ENVIRONMENT`; its original application ledger is `4 PASS / 0 FAIL / 68 NOT_RUN`. Its public startup and cleanup records report `startup_attempted=false`, `project_owned=false`, and no teardown command. No real partial-startup or final-image result is inferred.
- Completion mode is `DIAGNOSTICS_READY_FOR_ROUTER_REPRODUCTION`. Application acceptance remains `false`; accepted version remains `none`; root remains `awaiting_review`. Luna did not publish, push, dispatch, use providers/credentials, or begin v0.2 work. Router/architect review is required before any next action.
- Durable r10 evidence is [`docs/evidence/CH-001R-r10/README.md`](../docs/evidence/CH-001R-r10/README.md); the handoff is [`handoffs/CH-001R-r10.md`](../handoffs/CH-001R-r10.md).

# Project state — CH-001R-r9 checkpoint

**Last updated:** 2026-09-15 UTC
**State:** `awaiting_review`
**Product:** Open Slideshow Studio
**Target application version:** `0.1.0`

## Current CH-001R-r9 bounded repair

- P9 is `1f7a920e437d561fd40e8524cdb11453294a6124` (tree `b98145e3bed876d880beb9c09306715ff7e02f3d`); E8 remains `d04a0a70d890890132041061be87742396c1909e` (tree `40b9bc095b139a19e1c42130bf5e43ca15c79cc6`).
- Final T9 implementation is `6014a247b124a186a1abfcb6d65a7ef024cf8cfc` (tree `6e590387c666ee3672210d022e51fc9283e07737`). It contains only the bounded report-path/workflow-shell repair, focused regressions, source-bound rehearsal, and a non-semantic lint declaration for the architect-only reference excerpt.
- The workflow blob is `35fa339aac2fcb024cd476ff38d87d27eb6482af`; its SHA-256 is `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d`. The raw relative `CI_BOOTSTRAP_REPORT` is resolved to an absolute sibling `actionlint-bootstrap.json` before passing one target to both helper and reporter.
- Final local checks passed on Node `20.19.2`, pnpm `12.3.4`, and official actionlint `1.7.7`: syntax, frozen install, workflow lint, `pnpm test:ci`, clean/hosted-like source-bound no-node_modules prefixes, lint, typecheck, build, unit (`20/20`), security (`4/4`), and diff checks. The aggregate CI runner is `6/6` file-level subtests; the source-bound nested total is `64/64` cases, with zero failures/skips.
- Source-bound clean run `900000601` and hosted-like run `900000602` both used independent detached T9 checkouts, the actual extracted workflow bodies, raw relative job environment forms, real actionlint, and isolated synthetic command files. The hosted-like mode carried inherited synthetic sandbox state with explicit opt-in false. Proof, policy, and sandbox-state trees remained absent.
- The settled T8 hosted failure `34928718810` is preserved read-only: job `104252240220`, actual API-listed artifact `10380711446`, 5558 bytes, SHA-256 `3c3905e781479fb627481c6bbf5a0bbea03ae1ab93d323cfda5b1475415db92f`, failed at `actionlint-bootstrap`, `proof_invoked=false`, `proof_exit_code=null`, and no application gate counts. It was not rerun; the original ZIP is unchanged.
- R9-T01 through R9-T12 are PASS in `docs/evidence/CH-001R-r9/r9-results.json`. R9-T13/T14 are router-owned `NOT_RUN`. Luna did not dispatch, rerun, publish, use providers/credentials, qualify sandbox, run proof, or begin v0.2 work.
- Application acceptance remains `false`; accepted application version remains `none`. E9 is the evidence/state-only commit containing the r9 handoff and records; its actual SHA is returned externally after commit and is not embedded self-referentially here. The older r8 section below is historical.

# Project state — CH-001R-r8 checkpoint

**Last updated:** 2026-09-12 UTC
**State:** `awaiting_review`
**Product:** Open Slideshow Studio
**Target application version:** `0.1.0`

## Authority and traceability

- Active chapter: `CH-001R-r8` bounded actionlint provisioning and exact-environment repair; target remains the unchanged v0.1.0 bounded-proof contract, not full acceptance.
- Current packet P8: `f2d6baa075af14fbe74e836240198a90ea5d4fd1`; tree `a832532aad3956687c169c57c3c6e5c8adff51a1`.
- Current T8 implementation: `0144f6c41ae4c6143a2dc46fe22d59d453ce8763`; tree `f16f32465b37439774369ddf002a22063c104088`; direct child of P8.
- Prior T7 implementation: `6b02857401a9b1e81e1bd36d5a4418f90903adcb`; tree `fdbe7da15964659d4e2514580f6606f5731790ce`.
- Prior E7 is the evidence/state-only commit `6e4f9b3d288b7177ebfc8b49ff3c833610640060`; it remains preserved unchanged.
- Current T8 workflow: blob `fb4d3e4ee58eff81e43395fa6df99c53b65de417`; file SHA-256 `0ca1701d63be141fccff778c03e199cd3a55c5502d186000adf0e4bd545eac6c`.
- E8 is the evidence/state-only commit containing this r8 handoff and records; its full SHA is returned externally after commit and is not embedded self-referentially.
- North Star baseline: `architect/Luna_CH001_v0.1.0_Pack/reference/north-star/NORTH_STAR.md` SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`.
- Starting source / packet P4: `a86c3ace9ad8bf1ec941565ce7dbc4e4d734b4e2` (P4 is based on prior E3 `4cf020317cfc2e8755f35ee6da10f7397c8676f2`).
- T4 implementation: `69b784526260e3e5acf133da8d1a2fb33447d20f`; tree `55fdf4fc16f1d07498f6fb447cddc64e5261be2c`.
- E4 handoff/evidence: [`handoffs/CH-001R-r4.md`](../handoffs/CH-001R-r4.md) and [`docs/evidence/CH-001R-r4/README.md`](../docs/evidence/CH-001R-r4/README.md); full E4 SHA is returned with the handoff.
- Historical T3/E3: `0b79ed07a25a618ab4da2bf56a2fed6047398cb5` / `4cf020317cfc2e8755f35ee6da10f7397c8676f2`; historical r3 handoff remains [`handoffs/CH-001R-r3.md`](../handoffs/CH-001R-r3.md).
- Historical r2 implementation/evidence commits remain `b516dab843be1b8870d3516185b52905982aec1f` / `5a931feb01ed8da16eb9f0079a380c61f5459792`; older records remain available.
- Workflow at T4: blob `65f1ae428e925b4747fea03f6c228a8af4acf15b`, file SHA-256 `e41c6ce267c8dacfe759f83c873c0f53ebca90e2c56f19e6d17202267b06b896`.
- Accepted application version: none. This checkpoint is not architect-accepted.

## CH-001R-r8 bounded CI helper and environment repair

- The failed hosted run `34678495442` was read from the P8 packet and not rerun. Its T7 helper result was `50` tests / `45` pass / `5` fail / `0` skipped, `CI_BOOTSTRAP_FAILURE`, `proof_invoked=false`; no application gate count was inferred.
- T8 provisions and verifies the checked-in official actionlint `1.7.7` Linux/amd64 archive before semantic workflow validation and before the complete CI suite. The archive SHA-256 is `023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757`; the executable SHA-256 is `9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c`.
- T8 separates complete child environments from override maps. Independent missing-`RUNNER_TEMP` and missing-`GITHUB_ENV` hosted-like cases keep the key absent, return a nonzero initializer result, and preserve both synthetic environment files. The legacy second-merge reproduction is retained and demonstrates the contamination.
- Final clean and hosted-like no-`node_modules` prefixes checked out T8 under Node `20.19.2`; each ran the real validator and `node --test tests/ci` with `58` pass / `0` fail / `0` skipped. Frozen install, workflow lint, lint, typecheck, build, unit (`20/20`), security (`4/4`), syntax, and diff checks passed.
- `origin/main` remains at P8 in this workspace; T8 and E8 are local and unpublished. Luna did not dispatch a hosted workflow. R8-T13/T14 remain router-owned `NOT_RUN`.
- Application acceptance remains `false`; accepted application version remains `none`; providers, publishing, release, deployment, and v0.2 work remain out of scope.

## CH-001R-r7 workflow validation and dispatch repair

- R7-F01 is repaired at the workflow-definition boundary: the unsupported `runner.temp` job-level environment binding was removed. The existing `identity` step now resolves the unchanged run/attempt-specific `ch001r6` state path with `RUNNER_TEMP` and appends it to `GITHUB_ENV` for later qualification and owned cleanup consumers.
- R7-F02 is addressed by the pinned `pnpm lint:workflow` command. Official actionlint `1.7.7` rejected the complete frozen T6 workflow at the unsupported `runner` context and accepted the complete T7 workflow. Failure-control and runtime-transfer regressions are committed and passed.
- Final T7 local checks passed: workflow static validation, `pnpm test:ci` (4/4 file-level CI files; direct r4/r5/r6/r7 counts 10/12/18/10), lint, typecheck, build, unit (20/20), security (4/4), syntax checks, and `git diff --check`.
- `origin/main` remains at P7 in this workspace; T7 and E7 were not pushed. The router owns publication and may submit at most one fresh manual T7 dispatch after independently validating the publication tree. Hosted workflow/run/job/artifact/sandbox/worker/proof fields remain `NOT_RUN`/null.
- The historical T6 dispatch remains `REJECTED_BEFORE_RUN` (HTTP 422 as reported) with no live-proof IDs. Push-validation record `34675672523` remains separate with zero jobs. Application acceptance remains `false`, accepted version remains `none`, and root remains `awaiting_review`.

## CH-001R-r5 continuation

- Review baseline / packet P5: `df008ff64d02ada64b8e91578143709ea7b98b89` / `53f7786fdd728140c94bd82e3855cd7e97c96cf5`.
- T5 workflow/coordinator boundary repair: `6849b39f4e3c7a03b5f132418b1d33cc84c98d51`; tree `85ea5ab159c6f6bd5babf63246cd16c8c50b8655`.
- T5 changes are limited to workflow bootstrap-output ownership, the shared proof-directory initializer/refusal writer, and focused boundary regressions. Node `20.19.2`, pnpm `12.3.4`, lockfile, app, renderer, Dockerfile, native bootstrap, strict gate contract, and r3 bounded assertions remain unchanged.
- Published state: `origin/main` was observed at T5 after a successful push. E5 is the documentation/evidence-only commit containing the r5 handoff and records.

## Implemented checkpoint

The current r6 implementation adds measured host Chromium sandbox qualification around the existing bounded proof. It uses the exact installed managed executable and digest, keeps `chromiumSandbox=true`, collects AppArmor/user-namespace/process/denial facts, allows only the packet's explicit temporary exact-path AppArmor `userns` exception on the opted-in hosted job, and removes only this run's owned unchanged profile. The worker remains separately containerized and non-root; no application feature or original gate changed.

## Historical implementation checkpoints (retained)

The application implementation and strict 72-gate acceptance contract remain as recorded through r3. T4 is limited to CI repair: a shared pinned/checksummed native pnpm bootstrap for Actions and Docker, dependency-free outer CI/bootstrap reports, literal summary formatting, nullable absent-proof classification, early failure evidence, and focused positive/negative regressions. Node `20.19.2`, pnpm `12.3.4`, the lockfile, application dependency pins, existing bounded coordinator, and original acceptance references remain unchanged.

## Evidence state

- Passed in this host against T4 `69b784526260e3e5acf133da8d1a2fb33447d20f`: dependency-free `pnpm test:ci`, `pnpm lint`, strict `pnpm typecheck`, `pnpm build`, 20 isolated unit tests, and 4 focused security/scope tests.
- A real official Linux x64 native pnpm archive bootstrap, digest/layout inspection, idempotent repeat, current/subsequent PATH and version checks, and native `pnpm install --frozen-lockfile` passed. The lock hash remained `9c49bf356bdd523623b79cf6096df83de51f06b358bffa88391700a4c5719d70` and tracked files remained clean.
- The fresh bounded T4 coordinator run `r4-local-t4-preflight` exited `2` as `BLOCKED_ENVIRONMENT`: loopback port allocation was denied (`listen EPERM`), Docker/Compose was absent (`spawn docker ENOENT`), and the pinned Playwright Chromium executable/launch probe was unavailable. Integration, authenticated browser, renderer, Compose, image, migration, lifecycle, ZIP, screenshot, and hash assertions therefore discovered/executed zero live cases.
- Fresh T4 partial ledger: `4 PASS / 0 FAIL / 68 NOT_RUN`. The four source-only PASS IDs are not runtime acceptance. No hosted T4 run or artifact exists; local sanitized reports are in the ignored run directory `artifacts/ch001r4/r4-local-t4-preflight/proof/public/`. CI4 source/helper checklist: `17 PASS / 0 FAIL / 7 NOT_RUN`.
- Historical CH-001 ledger is preserved unchanged at `docs/evidence/CH-001/gate-results.json` with 0 PASS / 0 FAIL / 72 NOT_RUN.
- External provider calls, paid calls, account authorization, publishing, deployment, release/tagging, and public posts: none.

- Fresh T5 boundary regressions: R5-T01 through R5-T12 passed; existing CI helper cases passed 9/9. The aggregate `pnpm test:ci` command returned 0 and reported 2/2 file-level tests on Node `20.19.2`.
- Fresh T5 bounded proof `r5-local-t5-boundary` prepared the coordinator-owned root and returned `2` / `BLOCKED_ENVIRONMENT`; loopback `EPERM`, Docker/Compose `ENOENT`, and unavailable pinned Chromium prevented live application checks. Its ledger is `4 PASS / 0 FAIL / 68 NOT_RUN`, source-only evidence only.

## Historical fixed boundaries and next actions (retained)

The future ScrapeCreators Pinterest boundary, one-key fal.ai model boundary, and no-direct-official-TikTok-Content-Posting-API decision are preserved as deferred design commitments; no provider implementation began. Billing, scheduling, MP4/video, public deployment, and v0.2.0 work did not begin.

The prepared workflow is `.github/workflows/ch001-live-proof.yml` at T4. Luna did not push or dispatch; local `main` is one commit ahead of `origin/main`, which remains P4. The next authorized action is for the router to publish the preserved T4 and E4 through an already-authorized workflow-capable repository path, verify the workflow identity, manually dispatch one fresh run with T4, and inspect its actual artifact. Do not rerun failed hosted run `34665615514`, dispatch T3, or mark this state accepted without architect review.

The r5 execution commit is now published at T5. The next authorized action is the existing workflow-capable router’s single fresh dispatch with `implementation_sha=6849b39f4e3c7a03b5f132418b1d33cc84c98d51`, followed by settled artifact inspection. No dispatch occurred from the editing box; root state remains `awaiting_review`, application acceptance remains `false`, and accepted version remains `none`.

## CH-001R-r6 current status

- T6 local implementation checks passed: both changed `.mjs` syntax checks, `pnpm test:ci`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, `pnpm test:security`, and `git diff --check`. The CI suite includes all twelve R5 boundary cases and 18 focused r6 sandbox cases; unit/security counts were 20/20 and 4/4.
- One fresh local bounded proof `r6-local-001` was run against T6 and exited `2` as `BLOCKED_ENVIRONMENT`: loopback listen `EPERM`, Docker/Compose `ENOENT`, and the pinned Playwright Chromium executable was absent. Its ledger is `4 PASS / 0 FAIL / 68 NOT_RUN`; no application, worker, ZIP, screenshot, or lifecycle claim was made.
- A direct read-only local sandbox host snapshot measured Debian 13, unavailable AppArmor/parser and two requested sysctls (`null` with reasons), `user.max_user_namespaces=2147483647`, and no denial tied to the absent browser. This is editing-host evidence, not hosted qualification.
- Hosted R6-T15/T16/T17/T18/T19 and the router artifact receipt remain `NOT_RUN` until publication and one fresh manually dispatched standard GitHub-hosted Ubuntu job with the explicit `sandbox_qualification=true` input. No workflow was dispatched from the editing box.
- Application acceptance remains `false`; accepted application version remains `none`; root remains `awaiting_review`. Providers, publishing, deployment, release, video, and v0.2 work remain out of scope.
