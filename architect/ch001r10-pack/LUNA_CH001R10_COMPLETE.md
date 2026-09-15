# CH-001R-r10 — Complete architect assignment

This is the combined reading copy of CH-001R-r10-r1. Companion evidence and the checklist template are in `CH001R_r10_Architect_Pack.zip`. No application acceptance or hosted dispatch is performed by this document.


---

<!-- Canonical packet file: README.md -->

# CH-001R-r10 — Migration startup diagnosis and repair

**Architect-issued continuation of CH-001, targeting v0.1.0.**

| Control | Value |
|---|---|
| Packet revision | CH-001R-r10 / r1 |
| Application acceptance | `false` |
| Accepted application version | `none` |
| Root project state | `awaiting_review` |
| Implementation scope | Migration startup boundary; failed-startup diagnostics and run-owned cleanup |
| Immediate external action | None: this packet does not dispatch a workflow |
| Conditional router authority | At most one fresh manual T10 dispatch after the checks in `04_ROUTER_HANDOFF.md` |

## Decision

T9 cleared the earlier bootstrap barriers. Its hosted run executed the actionlint stages, all 64 CI helper cases, native pnpm bootstrap, frozen installation, and the host Chromium qualification. The proof then built the application image, started a healthy database, and failed when the migration service exited 1. The web/worker application journey did not follow.

The migration exception itself was **not preserved**. Do not turn the label “compose migrate” into a guessed SQL or module-resolution diagnosis. R10 must obtain that exception, repair only the demonstrated cause, and close the confirmed diagnostic/cleanup gap that hid it.

## Reading and execution order

Read the verdict (packet file: `01_REVIEW_VERDICT.md`), then the Luna assignment (packet file: `02_LUNA_ASSIGNMENT.md`), the evidence contract (packet file: `03_TEST_EVIDENCE_CONTRACT.md`), and the router boundary (packet file: `04_ROUTER_HANDOFF.md`). Return the handoff (packet file: `05_HANDOFF_TEMPLATE.md`) and populate the separate repair checklist (packet file: `templates/r10-results.template.json`) with executed evidence. Sources (packet file: `06_SOURCES.md`) identify the reviewed revisions and primary technical references.

The original hosted ZIP (packet file: `evidence/ch001-live-proof-34937329430-1.zip`) is included unchanged. The independent inspection (packet file: `evidence/historical-run-inspection.json`) binds its digest, identities, file inventory, and the limitations of this review. Selected original reports are included for easy reading; they are historical evidence, not new results.

## Stop conditions

Do not add AI/providers, publishing, scheduling, billing, video, or v0.2 features. Do not change the sandbox policy, disable Chromium sandboxing, relax worker isolation, or replace the database because migration failed. Do not rerun any historical hosted run. A green bounded proof is still not full 72-gate acceptance.

When the editing environment cannot reproduce the migration in the shipped image, complete the diagnostic/cleanup work and return an honest **diagnostic-only** handoff. The router may use its Docker-capable environment, or the one conditionally authorized new T10 run, to obtain the missing evidence. Do not claim the migration is repaired before it has actually run successfully.


---

<!-- Canonical packet file: 01_REVIEW_VERDICT.md -->

# Architect review — T9/E9 and hosted run 34937329430

## Verdict

**CH-001 remains unaccepted. R9's report-path repair has supporting hosted evidence. The next bounded assignment is CH-001R-r10.**

The current failure is no longer `CI_BOOTSTRAP_FAILURE`. The outer result is `LIVE_PROOF_FAILED`; the inner coordinator result is `TEST_FAILURE`, exit 1, with no recorded prerequisite environment failures. This is progress to a different execution boundary, not evidence that the full application works.

## Reviewed identity

| Identity | Value |
|---|---|
| Repository | `klole/reel-farm` |
| P9 packet | `1f7a920e437d561fd40e8524cdb11453294a6124` |
| T9 implementation | `6014a247b124a186a1abfcb6d65a7ef024cf8cfc` |
| T9 tree | `6e590387c666ee3672210d022e51fc9283e07737` |
| E9 / observed `main` | `0f222800f1e91a18cc2f16824a87c9513cd29026` |
| E9 tree | `88cb7927e45605177318448115a28c177c6071a0` |
| Workflow blob | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Workflow SHA-256, matching handoff/artifact attestations | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Hosted run / attempt / job | `34937329430` / `1` / `104277995082` |
| Trigger | `workflow_dispatch`; requested and checked-out implementation are T9 |
| Artifact | `10383922146`, `ch001-live-proof-34937329430-1` |
| Original ZIP bytes | `52987` |
| Original ZIP SHA-256 | `4b64eb28f946bd74fd67fe14b10200b85886ed28eb42ea2847e71443ac1a96f0` |

E9 is a direct child of T9. The workflow definition came from E9 while the execution checkout was T9. The original ZIP's digest and size were independently checked. The full workflow file was not independently downloaded and rehashed in this review; its SHA-256 above is explicitly an attestation corroborated by the handoff and artifact.

## What the evidence establishes

The actionlint bootstrap and actual workflow-validation stages passed, as did all 64 hosted CI cases. Native pnpm, frozen project installation, managed Chromium installation, and Docker preflight passed. The coordinator also recorded successful host lint, typecheck, build, unit, and security commands. These are not application journey gates.

The host Chromium qualification has more than a green step icon: its report records a non-root launch, synthetic content, and a positive `chrome://sandbox` diagnostic after a temporary exact-executable AppArmor exception. The report records successful profile removal and unchanged measured global policy values after cleanup. Separate renderer-process namespace/seccomp enumeration was unavailable; do not claim it was measured. This is support for the **host** browser qualification only. The worker's containerized browser was not qualified by this run.

Compose build progress reports the final image identity `sha256:f7cee227d436baa5998abf5b5ca5f56051b2eefb1c4446bd88c1eb700b8177b2`. That is a value from build output, not a separately captured image-inspection attestation. The log then shows the database healthy, migration started, and:

```text
service "migrate" didn't complete successfully: exit 1
```

The command was the run-owned `docker compose ... up --build -d db migrate web worker`. The failed migration blocked the `service_completed_successfully` dependencies for web and worker. Successful image construction is not successful migration, database-schema validation, or a running application.

The outer proof wrapper step returns zero after recording the child result so it can upload evidence. Its green step icon does not override the captured proof exit 1 and final failed verdict.

## Findings

### R10-F01 — Migration fails; the inner cause is unresolved

**Evidence level: observed service exit; missing inner exception.**

The migration exception was not preserved. The archive contains detached Compose progress, but not the migration service's stdout/stderr, stack trace, or relevant database error. Missing final exports and previews are downstream of startup failure. Do not assume permissions, SQL syntax, authentication, package resolution, or a pnpm error solely from exit 1.

Closure requires a faithful run of the actual migration entrypoint inside the final application image against an isolated database, with the failure recorded before any proposed migration repair. If the historical exception cannot be reproduced, say so and retain the mismatch; do not fabricate a reproduction.

### R10-F02 — Failed startup loses the most useful diagnostics

**Evidence level: source-confirmed control flow, consistent with the missing artifact.**

In `scripts/ch001-proof.ts`, `composeStarted` becomes true only when the entire `compose up` command returns zero. Nonzero causes an immediate return from `composeJourney`. The only final service-log capture is guarded by `composeStarted || integrationDatabaseCreated` inside `cleanup`.

At this failure boundary, neither condition is true. The coordinator therefore skips the service logs even though the database and failed migration containers exist. Also, that log capture ordinarily writes only to a private file, after finalization has already built the public manifest. Merely removing the guard would not automatically deliver reviewable sanitized logs.

R10 must preserve bounded, sanitized service output and stopped-container state before deletion and before closing the public evidence package.

### R10-F03 — A partial startup also bypasses run-owned teardown

**Evidence level: source-confirmed guard; no teardown record in the artifact.**

The same guard excludes `docker compose down` when startup fails partway through. Full readiness and resource ownership are different states. An unsuccessful start command can still create a network, volumes, and containers, as this run's log shows.

This review does not claim resources survive GitHub's eventual VM disposal. It does identify that the coordinator itself never performs or proves its scoped cleanup in this branch. The fix must work on a reusable local Docker host too, without deleting an unrelated project.

### R10-H01 — Investigate root-script package resolution first

**Evidence level: source-backed hypothesis, not the hosted exception.**

`scripts/migrate.ts` imports `pool` from `@oss/db`, and the root `db:migrate` script invokes it through `node --import tsx`. The inspected root package manifest has no declared `@oss/db` workspace dependency; the inspected root `tsconfig.json` has project references but no inherited path mapping. A package manifest exists for `@oss/db`, with built exports.

That combination warrants checking whether the bare import resolves from `/app/scripts/migrate.ts` in the final image. Build tooling, a test alias, or a successful package-level compilation does not by itself establish root-script runtime resolution. A runtime link or resolver may still make it work; only the actual failing command can decide. Do not present `ERR_MODULE_NOT_FOUND` as a recovered log message.

If this is confirmed, prefer the smallest correct entrypoint/module-resolution repair over installing unpinned packages or changing SQL. If it is disproved, record the actual reason and fix that reason instead.

## Gate accounting and status

The archived 72-ID ledger is **4 PASS / 0 FAIL / 68 NOT_RUN**. The only passes are source-only IDs `CH001-067`, `CH001-068`, `CH001-069`, and `CH001-072`. The ledger's zero FAIL entries do not erase the separate executed migration/startup failure. Do not manually convert the other 68 gates to PASS or claim that no failure occurred.

No canonical ZIP, alternate ZIP, preview-byte equality, application lifecycle, or same-data restart was produced. Keep acceptance false, accepted version none, and root awaiting_review. Preserve all previous ledgers as historical records.

## Review limits

This review used connected repository reads, the hosted job output, and the original downloaded artifact. It checked 46 archive members and all 27 declared public payload hashes. It did not execute the migration, database, final image, or application locally. Docker, project-pinned Node 20, and the project dependency tree were unavailable in the review runtime; an attempted public clone failed DNS resolution.

The archive's `artifact_delivery: PENDING` is a pre-upload snapshot, not evidence that delivery failed. GitHub's artifact metadata and the independently downloaded ZIP establish delivery. Preserve this original snapshot rather than editing historical reports to make them look final.

The next repair is diagnosis-first. It is not permission to reset the project, rewrite its architecture, weaken sandboxing, or skip migration.


---

<!-- Canonical packet file: 02_LUNA_ASSIGNMENT.md -->

# Luna MAX assignment — CH-001R-r10

## Mission

Get the existing v0.1.0 runtime past its **demonstrated migration startup blocker**, and make unsuccessful Compose startup produce enough safe evidence and scoped cleanup to review the next outcome.

No AI/provider integration, account authorization, publishing, scheduling, analytics, billing, video, public deployment, release, or v0.2 feature work is authorized. The sandbox and worker security controls remain unchanged.

Use MAX effort. Implement and verify the bounded change; do not return only a fresh plan. Do not treat missing runtime prerequisites as successful tests. You are not authorized to accept v0.1 or begin the next feature chapter.

## 1. Establish the actual baseline

Inspect the repository before editing. Record `HEAD`, the tree, tracked changes, and ancestry to T9/E9. Read:

```text
handoffs/CH-001R-r9.md
state/PROJECT_STATE.md
state/REQUIREMENT_STATUS.md
docs/evidence/CH-001R-r9/
scripts/migrate.ts
scripts/ch001-proof.ts
scripts/ch001-compose.ts
compose.yaml
Dockerfile
package.json
packages/db/package.json
packages/db/src/client.ts
tsconfig.json
```

Read the original CH-001 contract and the active North Star reference in the repository. This pack continues that contract; it does not replace the 72 original gates. The last reviewed execution is T9 `6014a247b124a186a1abfcb6d65a7ef024cf8cfc`; E9 is `0f222800f1e91a18cc2f16824a87c9513cd29026`. The router may have added this packet or preserved receipts afterward. Accept documentation-only progress in the baseline; do not silently overwrite unrelated execution changes.

Record a real P10 when one exists; do not invent a packet commit. Preserve the original T9 archive and earlier evidence. Keep the existing legacy `r4` path prefixes unless a specific correctness defect requires otherwise; cosmetic phase renaming is not part of this repair.

## 2. Obtain the migration exception before repairing it

The failed T9 archive does not contain the migration stderr. A root cause is therefore not yet established. Reproduce in a separate disposable checkout/project using the **T9 final image and migration command**, not a rewritten SQL runner and not your host's already-installed modules.

Use a uniquely named, run-owned Compose project and disposable database/media volumes. Confirm the target project does not preexist. Use generated synthetic bootstrap/auth values; do not load a real user's `.env`. No browser-policy change is needed for a database/migration-only reproduction.

Build the final image from the exact revision. Record the effective migration command, working directory, user, image ID, and selected non-secret runtime facts. Run the normal migration entrypoint against the healthy disposable database. On either result, collect stdout/stderr and stopped-container state before cleanup. Keep the direct child exit and Compose exit separately where they differ. Report whether the baseline failed in the same way.

Investigate the `@oss/db` root-script import early, but do not substitute that hypothesis for the captured exception. Determine whether execution reaches package loading, SQL-file loading, connection, transaction, or DDL. Capture an error class/code and relevant stack or SQLSTATE without exporting credentials or raw environment values.

**Authorized local historical reproduction is not authorization to rerun the old hosted T9 run.** It must use independent disposable resources and new local evidence paths. Never resume or mutate `r4-34937329430-1`.

When Docker is unavailable on the editing box, prepare the exact reproducible diagnostic command/harness and return that limitation. The existing router may run the same checkout on its Docker-capable machine. Do not spend the chapter on installing an unrelated virtual-machine platform or rebuilding the entire CI system.

## 3. Repair only the proven startup cause

Once the failure is reproduced, make the smallest durable correction to the migration entrypoint, its resolution, or demonstrably missing image input. Preserve the migration ID, schema design, transactional execution, advisory lock, and completion-record semantics.

A relative import or a script-specific runtime configuration may be appropriate if bare-package resolution is the demonstrated cause. Evaluate it with the same final-image command, including after a clean rebuild. Do not introduce a new dependency or global TypeScript alias merely to silence one test. Do not require a different host setup to make the shipped image work.

Root causes involving missing image inputs or entrypoint working directories may justify a narrow packaging correction, with before/after file evidence. Changes to dependency versions, the lockfile, database engine, schema contents, or worker security require another architect decision rather than speculative edits under this packet.

Do not swallow migration errors, hand-insert a completion row, execute the DDL outside the normal migration process as a workaround, weaken a database constraint, or replace `service_completed_successfully` with a looser dependency. Success is an actual migration exit 0 followed by inspected expected schema and metadata.

## 4. Repair the confirmed partial-startup diagnostic/cleanup boundary

Track **startup attempted under a validated, run-owned project** separately from **startup returned success** and **application ready**. Set the attempt state before invoking a command that may allocate resources. Do not make cleanup depend on full startup success.

After a failed startup, and also on later proof failure, collect bounded diagnostics from the exact project before deletion. Include:

- `ps --all` state for stopped as well as running services, including service, container identity, state, and exit code;
- bounded no-color, timestamped logs for `db`, `migrate`, `web`, and `worker` when each exists;
- the original startup command/exit, and image identities when retrievable;
- a structured record that distinguishes absent containers, failed diagnostic reads, and a service's actual nonzero exit.

Use the existing scoped Compose helper or a small shared adjacent helper. Do not introduce a general-purpose orchestration framework. Treat observed JSON-array or JSON-lines output formats explicitly if the supported Compose versions require both; malformed output is a diagnostic failure, not an empty successful inventory. Do not concatenate arbitrary shell fragments from container metadata.

Next, attempt teardown of **only this invocation's verified disposable project and volumes**. Keep project name, config/root, and env-file identity consistent across start, inspect, logs, and down. Validate ownership and refuse a preexisting or unrelated project before allocating resources. Check removal using scoped resource facts; a command that returned zero is not by itself evidence that unrelated resources were never touched.

Never use global prune, broad container deletion, default project teardown, or volume deletion outside the generated test project. Do not erase user data to achieve a passing migration.

Diagnostic collection and teardown must have finite command timeouts, bounded output, and an honest result for failed or timed-out commands. A missing daemon must not hang finalization. Test that early setup refusal, before owned resources exist, does not issue teardown against an unknown/default project.

## 5. Preserve failure precedence and useful public evidence

The original migration/startup error remains primary when log capture or cleanup also fails. Append secondary failures with their actual exits; do not replace the primary message with “artifact missing,” a cleanup exception, or generic timeout. A cleanup-only failure also prevents reporting a fully successful bounded result.

Raw logs and environment files remain private. Publish sanitized diagnostic copies with tested redaction of synthetic auth/bootstrap secrets, database credentials/connection strings, bearer tokens, cookies, and command-file contents. Do not upload unrestricted `docker inspect` output or `docker compose config` with resolved credentials. Select non-secret fields and keep a useful error/stack after redaction.

The sanitized migration log, startup state, and cleanup receipt must be inside the run's public evidence and bound by the final manifest. Capture them **before finalizing** the payload hashes. Do not append files to an already-closed manifest and assume they are verified. Retain the repository's rules that avoid circular manifest/report hashes. A bounded additive receipt is acceptable only when the final report explicitly binds it and a reviewer can verify it.

Keep evidence-directory ownership from r5 intact. Do not write failure reports or diagnostics into a rejected, preexisting proof directory. No cleanup or evidence failure can turn an unexecuted suite into PASS. The existing strict `verify:ch001` remains strict and separate from `proof:ch001`.

## 6. Qualify migration in the actual final image

For an implementation that claims the migration is repaired, run these against a clean candidate image and isolated PostgreSQL, with no host source/dependency bind mount masking image contents:

**Fresh database:** normal `pnpm db:migrate` entrypoint exits 0; the expected application tables exist; `schema_migrations` contains exactly one `0001_ch001` row. Record the actual image ID and revision.

**Same database second run:** the same entrypoint exits 0 and reports already-applied behavior. Verify the migration record is not duplicated and a safe deterministic sentinel in the test database is preserved. Do not recreate volumes between these two runs.

**Controlled failure:** exercise an isolated error before completion and demonstrate nonzero exit with no false completion mark. An existing supported fault hook or a test-only fixture is acceptable for transaction-control testing; identify fixture evidence separately from the real SQL migration. Do not add a production bypass or destructive fault flag.

**Partial startup:** reproduce a failing migration service in a disposable Compose test fixture and prove that logs/state are captured before scoped cleanup; include a separate sibling-project sentinel or resource to show it is not touched. Fixture control-flow tests are useful but cannot replace the final-image migration runs.

After these focused checks, run the existing bounded application proof only in a capable, authorized environment. Stop at a distinct worker, browser, or application defect outside the repaired migration boundary. Preserve its diagnostics; do not make broad downstream fixes or disable sandboxing to force a green run.

## 7. Preserve the now-working prerequisites

Actionlint `1.7.7`, Node `20.19.2`, pnpm `12.3.4`, Playwright `1.63.0`, the native bootstrap manifest, dependency versions, and frozen lockfile remain pinned. The r8 environment-isolation and r9 source-bound workflow-prefix tests must still pass. Add tests; do not remove or skip inconvenient existing tests.

The host AppArmor qualification, its explicit manual opt-in, exact managed executable checks, cleanup, and non-root/sandboxed browser policy are unchanged. The worker remains on its image-local browser, non-root with its existing isolation. Host success in the T9 artifact does not authorize silently treating worker qualification as complete.

Prefer no workflow-file change. If a narrowly necessary evidence delivery change touches it, run the existing real actionlint command on the complete candidate workflow, preserve the manual-only/opt-in permissions, and record its new hash. No automatic push-triggered proof, auto-redispatch loop, additional privileges, or new hosted service is allowed.

## 8. Execute the scoped checks and create the handoff

Run the existing syntax checks and relevant new regression cases, then the repository's frozen install, workflow lint, full CI tests, lint, typecheck, build, unit, security, and diff checks. Record exact commands, exits, tools, and both file-level and nested case counts where the runners differ. Record final-image tests separately from host tests and mocks.

Test against the final committed candidate T10, not an earlier working tree. E10 must be evidence/state-only. Record T10/E10 full SHAs and trees externally after commit; do not fabricate a self-referential evidence SHA. Update the handoff, evidence index, requirement status, and project state with the bounded review status only. Add `handoffs/CH-001R-r10.md` and `docs/evidence/CH-001R-r10/`.

Do not overwrite T9 history to close its gates. Populate the R10 checklist with PASS/FAIL/NOT_RUN and concrete evidence. The 72-gate application ledger remains an independent artifact and must not be replaced with the R10 checklist.

## 9. Honest completion modes

**REPAIR_READY_FOR_ROUTER_REVIEW:** actual baseline diagnosis and candidate final-image migration checks were executed; scoped regressions pass; no claim of overall application acceptance. The router decides on the one fresh T10 dispatch after its publication checks.

**DIAGNOSTICS_READY_FOR_ROUTER_REPRODUCTION:** control-flow diagnostics/cleanup repair and local tests are complete, but a capable image/database execution has not been obtained. No speculative migration fix and no migration success claim. Provide executable reproduction instructions and explain precisely which tests remain NOT_RUN. This mode can advance evidence collection without masquerading as a complete migration repair.

**BLOCKED:** source validation, ownership safety, required evidence, or unrelated baseline changes prevent safe progress. Preserve useful in-scope work and explain the blocker; do not silently broaden scope.

The router may use the one new T10 hosted request in diagnostic mode when no suitable local Docker environment is available, but only under `04_ROUTER_HANDOFF.md`. The application remains `awaiting_review` in all modes. Then stop.


---

<!-- Canonical packet file: 03_TEST_EVIDENCE_CONTRACT.md -->

# R10 test and evidence contract

This is a repair checklist, not a substitute for the original 72 application gates. A source review, mocked subprocess, host database run, and shipped-image run are different evidence classes. Label them accurately. The template starts with every new R10 result NOT_RUN.

## Required cases

| ID | Requirement | Minimum evidence |
|---|---|---|
| R10-T01 | Bind the reviewed T9/E9 run and retain the unchanged original ZIP, gate ledger, and archive digest. | Historical inspection plus exact baseline identities. |
| R10-T02 | Execute the T9 migration entrypoint in its final image and capture its real error or an explicitly different outcome. | Image/command/DB identity, actual exit, sanitized service stderr/stdout. Runtime; not source inference. |
| R10-T03 | Tie any migration repair to the reproduced cause; distinguish and disposition the `@oss/db` hypothesis. | Before/after error evidence and minimal diff rationale; or explicit “unresolved/no migration edit.” |
| R10-T04 | Exercise the candidate through its shipped-image command without source/dependency mounts substituting host files. | Effective command/user/workdir/image identity and mount facts with secrets excluded. |
| R10-T05 | Fresh candidate migration succeeds and expected schema plus one migration record are inspected. | Actual exit 0 and query results from disposable PostgreSQL; no manual completion row. |
| R10-T06 | Repeat the same migration against the same database without duplication or loss of a deterministic sentinel. | Second actual exit 0, same volume/database identity, metadata count and sentinel comparison. |
| R10-T07 | Controlled migration failure stays nonzero and cannot claim completion; transaction/lock semantics remain intact. | Executed isolated failure case and metadata observation; explicitly distinguish fixture from real SQL evidence. |
| R10-T08 | Startup-attempt ownership triggers diagnostics/cleanup even when `compose up` returns nonzero after allocation. | Direct tests of the coordinator's actual helper/control flow; not a reimplemented model. |
| R10-T09 | Logs include failed/stopped migration state and are bounded, sanitized, and captured before deletion. | Subprocess arguments, ordered events, sanitized artifacts, secret-sentinel tests. |
| R10-T10 | Teardown is confined to the run-owned project; no preexisting/default/sibling project can be removed. | Refusal tests and scoped command assertions, plus runtime sibling preservation when Docker is available. |
| R10-T11 | Primary failure survives diagnostics, timeout, and cleanup failures; cleanup-only failure prevents success. | Actual helper tests for primary/secondary failure combinations and exits. |
| R10-T12 | Final public manifest binds startup diagnostics and cleanup evidence without post-hash mutation. | Recomputed file digests, report references, malformed/missing-report negative cases. |
| R10-T13 | All existing scoped host/static commands and CI regressions pass with real pinned tools. | Command logs and discovered/executed/passed counts. No test skips promoted to pass. |
| R10-T14 | Bootstrap, sandbox, worker isolation, dependency/lock pins, original gates, and future-scope exclusions are preserved. | Focused diff/hash comparison; identify any allowed narrow runtime-entrypoint edit separately. |
| R10-T15 | A real disposable partial-startup failure produces reviewable service diagnostics and verified owned teardown. | Actual Docker fixture run, nonzero service exit, before/after state, sibling sentinel. |
| R10-T16 | Documentation and ledger accurately separate host sandbox success, unqualified worker, migration status, and application acceptance. | Handoff/state review; acceptance false and accepted version none. |
| R10-T17 | Router verifies publication, ancestry, execution/evidence separation, and workflow identity. | Router-owned receipt; NOT_RUN in Luna's local handoff until actually performed. |
| R10-T18 | At most one fresh candidate T10 dispatch is observed and its settled result/artifact independently inspected. | Router-owned run/attempt/job/input/artifact receipt; can record a failed outcome without calling it application success. |

PASS for R10-T03 can mean that the hypothesis was honestly left unresolved and no unsupported migration edit occurred. It does not grant PASS to T02/T04/T05/T06. A diagnostic-only handoff must leave missing runtime cases NOT_RUN; it cannot claim “18/18 passed.”

R10-T18 concerns faithful execution and reporting of the authorized request, not a requirement to falsify a green run. Its receipt must include the actual proof result separately. Full application acceptance is never granted by the count of R10 tests.

## Minimum durable files

Use `docs/evidence/CH-001R-r10/` for the evidence index, command results, root-cause record, scope comparison, and R10 checklist. Keep large/raw or confidential material out of public git. Deliver a reproducible artifact when binary evidence is not committed, and bind it with a digest and concrete retrievable location.

For each new runtime run, collect the following logical records; exact filenames may follow existing conventions but must be mapped in the index:

```text
source-identity.json
migration-diagnosis.json
migration-baseline.log            # sanitized T9 reproduction, if executed
migration-fresh.log               # sanitized candidate execution, if executed
migration-repeat.log
migration-schema-check.json
compose-startup-state.json
compose-service-logs.log          # bounded and sanitized, includes migrate
compose-cleanup.json
command-report.json
r10-results.json
artifact-manifest.json
```

Each record identifies whether it is historical review, local fixture, local shipped-image runtime, or fresh hosted runtime. Include implementation SHA/tree, run ID, command, image IDs when available, start/end timestamps and exit. Missing observations are null or NOT_RUN with reasons—not empty PASS objects.

## Migration diagnosis record

Capture the actual exception/code/SQLSTATE when available, its producing service and command, whether the process reached SQL, and the evidence path. List investigated hypotheses and the evidence supporting or rejecting them. Do not copy a guessed error into an “observed” field. Retain the first failure before the fix.

Database assertions should query only the disposable test database. Record table names and migration metadata, not auth tokens, real user data, or connection credentials. The schema check should cover the application tables expected by the existing SQL, including `workspace`, `project`, `draft`, `draft_revision`, `asset`, render tables, `worker_heartbeat`, `save_mutation`, and `schema_migrations`.

## Cleanup record

Record `startup_attempted`, `startup_exit`, `project_owned`, `diagnostics_attempted`, selected service states, teardown command/exit, timeout status, and post-cleanup resource check. Keep primary and secondary failures separate. An unavailable inspection result is unknown, not “zero resources.” Keep snapshots of the synthetic sibling sentinel before and after the real cleanup test.

A mocked Docker response must be labeled as such. It proves handling and command scope, not that a real container or volume was removed. Successful GitHub VM disposal also does not substitute for this scoped record.

## Command and manifest requirements

The full scoped set remains:

```bash
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

Add actual new migration/cleanup harness commands, syntax checks, and any source-bound CI rehearsal used. Preserve raw exits and explain unavailable commands. Do not require `verify:ch001` to pass for this bounded diagnostic chapter: it must continue rejecting incomplete full acceptance. Do not run `proof:ch001` twice merely to get a desired status.

Before hashing final public payloads, complete diagnostics/owned teardown and sanitize logs. Include the sanitized service log and cleanup receipt in the manifest. Verify payload lengths and SHA-256 values and verify that none changed afterward. Metadata exclusions needed to avoid circular hashing must remain explicit. A report's “no evidence” field cannot be replaced by a pass based on source presence alone.

## Environment limits

Luna's previous host lacked Docker/Compose, loopback access, and managed Chromium. Do not repeat that as an assumed current fact: probe only the relevant prerequisites and record the result. Migration reproduction needs Docker/PostgreSQL but not a local host browser or privileged AppArmor changes. Use a capable router environment when available.

When runtime checks remain impossible, deliver the diagnostic-only mode and commands. Do not manufacture image IDs, SQL errors, screenshots, migration passes, or cleanup receipts. The next authorized hosted run can gather the missing evidence without pretending a speculative fix has been validated.


---

<!-- Canonical packet file: 04_ROUTER_HANDOFF.md -->

# Router publication, reproduction, and single-dispatch boundary

## No action has been submitted by this pack

This document conditionally authorizes one new T10 request; it does not submit it. Do not automatically redispatch on receipt, on push, or after a failure. No existing T9 run or earlier run is authorized for rerun.

## Before publication or dispatch

Read Luna's actual completion mode and unresolved items. Verify its base commit against E9 and the packet commit, the complete implementation diff, and the final T10 checks. Confirm E10 changes only evidence/state/handoff material. Do not introduce execution changes after the tested T10 and still label the evidence as T10.

Run the real pinned workflow validator against the actual candidate workflow bytes, including when the workflow was intentionally unchanged. Keep the now-working native/bootstrap report handling, actionlint provisioning, exact-environment tests, and source-bound prefix intact. Check that diagnostic capture precedes deletion and manifest finalization and that teardown cannot target a preexisting/default project.

Record T10/E10 full SHAs/trees and W10 definition SHA, blob, and file hash. W10 may be byte-identical to W9; no cosmetic workflow edit is required. At dispatch, the branch definition and the implementation checkout must be accounted for independently.

## Preferred route: reproduce locally with Docker first

When the router has a capable Docker environment, execute Luna's scoped migration reproduction against a uniquely named disposable project. First observe the baseline T9 exception, then run the candidate image checks if a cause-backed repair exists. Do not change the frozen image inputs by mounting host `node_modules` or bypassing the normal migration command.

This local reproduction is distinct from rerunning an old GitHub Actions record. Keep independent run IDs and evidence. No real accounts, provider keys, public endpoint, sandbox-policy mutation, or user database is involved. Delete only the newly allocated test resources after collecting their diagnostics.

If local evidence establishes a different unresolved cause, return it to the architect. The router must not make an unreviewed app/security repair and dispatch it as though it were the tested T10.

## Conditional diagnostic route

If no suitable local Docker environment is available, a diagnostics-only T10 may be published after its control-flow, isolation, redaction, pinned-tool, and evidence checks pass. It must contain no speculative migration repair. The one new hosted request may then be used to obtain the migration stderr and partial-startup teardown evidence.

Record `dispatch_purpose=diagnose_migration` rather than `verify_migration_repair`. Unexecuted migration checks remain NOT_RUN. This permission exists to obtain evidence, not to loop through guesses. A further code change requires another review and a new tested implementation identity.

## One manual request, then stop

After the above conditions are met, a deliberate router action may submit **at most one** request with the actual new T10 SHA:

```bash
# Set T10 to the real, verified 40-character implementation SHA. Do not paste T9.
test "${#T10}" -eq 40 || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm --ref main \
  -f implementation_sha="$T10" \
  -f sandbox_qualification=true
```

The explicit sandbox opt-in retains the already-authorized r6 policy constraints; it does not grant new privileges. Do not rerun `34937329430` or any historical record (`34928718810`, `34678495442`, `34676862756`, `34675672523`, `34671716094`, `34669975078`, `34665615514`).

Match the fresh run using the dispatch event, actor/time, requested input, workflow definition and actual checkout—not just the most recent red/green icon. A wrapper step that captures a nonzero child and exits zero is not proof success.

## Receipt

Return publication identity, dispatch-purpose, request count, new run/attempt/job, actual checkout, workflow blob/hash, each relevant stage outcome, captured proof exit, migration exception or success evidence, diagnostics and cleanup status, and artifact ID/name/bytes/SHA-256. Preserve and independently download the original ZIP; do not rewrite its reports. Check manifest payloads and keep pre-upload delivery snapshots separate from the actual API delivery receipt.

If a new worker sandbox or application failure appears, preserve it and return for review. Do not broaden isolation or perform an automatic second request. Even a successful bounded proof leaves `application_acceptance=false`, accepted version `none`, and root `awaiting_review` until the architect evaluates the unchanged full acceptance contract.


---

<!-- Canonical packet file: 05_HANDOFF_TEMPLATE.md -->

# CH-001R-r10 Luna handoff — fill from actual execution

## Status

Completion mode: `REPAIR_READY_FOR_ROUTER_REVIEW` / `DIAGNOSTICS_READY_FOR_ROUTER_REPRODUCTION` / `BLOCKED`.

Application acceptance: `false`. Accepted application version: `none`. Root: `awaiting_review`. Target: `0.1.0`.

## Identities

Record baseline, P10 when present, final T10/tree, parent chain, and workflow blob/file hash. Return E10/tree after the evidence-only commit. State whether publication was performed; never infer publication from a local branch name.

## Observed migration cause

Baseline reproduction: executed or NOT_RUN, environment/image/command, actual exit and evidence path.

Inner exception/code: observed value or null. State explicitly whether `@oss/db` resolution was confirmed, disproved, or remains untested. Describe the minimal fix and why it addresses the observed cause. With no reproduction, state “no migration repair claimed.”

## Partial startup behavior

Explain attempt/ownership/readiness state separation; where failed-service logs and stopped-container state are captured; how redaction is tested; what exact resources cleanup may remove; how failure precedence and final manifest ordering work. Link real tests and runtime evidence, not just source files.

## Actual verification

Provide command, environment/evidence class, final implementation SHA, exit, discovered/executed/passed/failed/skipped counts, and evidence path. Keep the following separate:

- host syntax/static/CI checks;
- mocked/fixture coordinator tests;
- real final-image migration fresh/repeat/error checks;
- real partial-startup cleanup/sibling-preservation check;
- any router-owned hosted outcome (otherwise NOT_RUN).

Summarize R10 results without implying application gate completion. Preserve the historical T9 4/0/68 ledger and report any new 72-ID ledger only from that new execution.

## Artifacts

List sanitized migration logs, state snapshots, image facts, SQL/schema observations, cleanup receipts, manifest/digests, checklist, and retrievable artifact. Missing observations stay null/NOT_RUN with reasons.

## Remaining blockers and external actions

State exact runtime limits and the next allowed router action. Declare pushes, downloads, disposable database/container actions, policy mutations, and dispatches actually performed. Hosted request count must be factual. Do not claim nothing external occurred if pinned packages/images were downloaded.

## Scope

Confirm no provider, account authorization, publishing, scheduling, analytics, billing, video, deployment/release, global host-policy relaxation, sandbox bypass, or v0.2 work. Identify every allowed migration/packaging/helper change. Keep acceptance false and stop for router/architect review.


---

<!-- Canonical packet file: 06_SOURCES.md -->

# Sources and interpretation boundaries

## Repository and hosted evidence

Every repository reference below is pinned to the reviewed revision rather than current mutable `main`. These are primary implementation sources, not claims of runtime success.

| ID | Source | Supports |
|---|---|---|
| S01 | https://github.com/klole/reel-farm/blob/0f222800f1e91a18cc2f16824a87c9513cd29026/handoffs/CH-001R-r9.md | T9 scope, local results as reported by Luna, identity, pending router work at handoff time. |
| S02 | https://github.com/klole/reel-farm/actions/runs/34937329430 | Settled manual hosted run, not a rerun of an older failure. |
| S03 | https://api.github.com/repos/klole/reel-farm/actions/runs/34937329430/artifacts | API artifact identity/size/digest. The independently downloaded unchanged ZIP is included. |
| S04 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/scripts/ch001-proof.ts | `composeJourney` success flag and early return; `cleanup` guard/private log; finalize-before-cleanup ordering. |
| S05 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/scripts/ch001-compose.ts | Scoped command construction and existing command helper. |
| S06 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/compose.yaml | Database health dependency, migration command, web/worker successful-migration dependencies, worker isolation. |
| S07 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/scripts/migrate.ts | Bare `@oss/db` import, SQL-file load, transaction/advisory lock, metadata recording. Not the missing hosted stack trace. |
| S08 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/package.json | Root migration invocation and declared dependencies/tool pins. |
| S09 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/packages/db/package.json | Existing workspace package and built exports. |
| S10 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/tsconfig.json | Root references; no path mappings or extends in the inspected file. |
| S11 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/migrations/0001_ch001.sql | Existing schema and constraints; preserve rather than speculate about a SQL defect. |
| S12 | https://api.github.com/repos/klole/reel-farm/git/commits/0f222800f1e91a18cc2f16824a87c9513cd29026 | E9 tree and direct T9 parent. |

## Primary technical references

**D01 — Compose startup dependency semantics**
https://docs.docker.com/compose/how-tos/startup-order/

`service_healthy` waits for the dependency health check; `service_completed_successfully` requires successful completion before dependent services start. This supports preserving, not weakening, the migration gate.

**D02 — Stopped-container diagnostics**
https://docs.docker.com/reference/cli/docker/compose/ps/

Include `--all` when diagnosing an exited service. Default output excludes stopped containers. Record the actual supported JSON shape rather than assuming a parser result from a different Compose version.

**D03 — Bounded service logs**
https://docs.docker.com/reference/cli/docker/compose/logs/

Use service selection, `--no-color`, `--timestamps`, and a bounded `--tail`; do not use an indefinite follow stream in failure finalization.

**D04 — Teardown scope**
https://docs.docker.com/reference/cli/docker/compose/down/

Volume removal is destructive. The proposed test teardown uses only explicitly verified disposable resources belonging to the unique proof project. Never substitute host-wide pruning.

**D05 — Pinned Node ESM resolution reference**
https://r2.nodejs.org/docs/v20.19.2/api/esm.html

Bare package resolution and explicit relative imports are different mechanisms. This provides context for investigating `@oss/db`; it does not prove the actual container exception or all behavior of the repository's TypeScript loader.

## Independent inspection vs application testing

The attached inspection verified archive bytes and the reports they contain. It did not reproduce migration, run Docker, rerun actionlint or the application suites, or dispatch a workflow. Host sandbox observations are interpreted from the real T9 report; renderer-process-specific enumeration was unavailable and worker qualification was not reached. The remaining missing migration stderr is a material evidence gap.


---

<!-- Canonical packet file: LUNA_START_PROMPT.md -->

# Starting prompt — Luna MAX / CH-001R-r10

Execute **CH-001R-r10-r1** as a bounded continuation of CH-001 for Open Slideshow Studio v0.1.0. Use MAX effort. Read the attached architect packet and the repository's current handoff, state, and original acceptance contract before editing.

T9 `6014a247b124a186a1abfcb6d65a7ef024cf8cfc` and E9 `0f222800f1e91a18cc2f16824a87c9513cd29026` reached hosted run `34937329430`. Bootstrap, all 64 CI cases, and host Chromium qualification passed. The actual proof then built the image and reached a healthy database, but the migration service exited 1. The proof result is `LIVE_PROOF_FAILED` / `TEST_FAILURE`, child exit 1; acceptance remains false. The archive does not contain the migration stderr, so its inner cause is not established.

Obtain the real migration exception from the exact final-image entrypoint against an isolated database, then make only the minimal evidence-backed correction. Investigate root-script `@oss/db` resolution as a hypothesis, not a confirmed error. Do not guess at SQL or weaken migration requirements.

Repair the confirmed coordinator gap: failed partial startup must collect sanitized stopped-service state and migration logs before run-owned teardown, even when `compose up` returns nonzero. Keep primary errors, bounded commands, sibling-project safety, and a final manifest that includes diagnostics and cleanup. Preserve r5 directory ownership and the working r6–r9 prerequisites.

Run the actual final-image migration fresh/repeat checks and partial-startup tests in a capable environment, plus the scoped pinned-tool/static/CI checks. When runtime prerequisites are unavailable, deliver diagnostic-only work with executable router reproduction instructions and honest NOT_RUN results; do not claim a migration repair was verified. The router owns publication and at most one conditional fresh T10 request; do not dispatch, rerun any old workflow, or create an automatic retry loop.

Keep application acceptance false, accepted version none, and root awaiting_review. No AI/providers, publishing, scheduling, billing, video, deployment/release, sandbox bypass, worker-isolation redesign, dependency upgrade, or v0.2 feature work. Return actual T10/E10 identities, cause disposition, command/case results, sanitized diagnostics, cleanup evidence, manifest, and completed handoff. Then stop for architect review.


---

## Unexecuted checklist template

```json
{
  "schema_version": 1,
  "record_kind": "UNEXECUTED_CH001R_R10_CHECKLIST_TEMPLATE",
  "chapter": "CH-001R-r10",
  "packet_revision": "r1",
  "target_application_version": "0.1.0",
  "application_acceptance": false,
  "accepted_application_version": "none",
  "root_state": "awaiting_review",
  "completion_mode": null,
  "base_commit": null,
  "packet_commit": null,
  "implementation_commit": null,
  "implementation_tree": null,
  "evidence_commit": null,
  "workflow_definition_commit": null,
  "workflow_blob": null,
  "workflow_sha256": null,
  "migration_exception": null,
  "migration_cause_confirmed": false,
  "migration_repair_runtime_verified": false,
  "hosted_run_id": null,
  "hosted_dispatch_count": 0,
  "proof_invoked": false,
  "proof_exit_code": null,
  "original_application_gate_counts": null,
  "checks": [
    {
      "id": "R10-T01",
      "evidence_class": "historical_artifact",
      "requirement": "Historical T9 identities and original evidence preserved",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T02",
      "evidence_class": "final_image_runtime",
      "requirement": "Actual T9 migration reproduction and stderr",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T03",
      "evidence_class": "diagnosis_and_source",
      "requirement": "Cause-backed repair or honest unresolved diagnosis",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T04",
      "evidence_class": "final_image_runtime",
      "requirement": "Candidate final-image entrypoint and runtime identity",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T05",
      "evidence_class": "final_image_runtime",
      "requirement": "Fresh migration and expected schema/metadata",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T06",
      "evidence_class": "final_image_runtime",
      "requirement": "Same-database repeat and sentinel preservation",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T07",
      "evidence_class": "runtime_or_labeled_fixture",
      "requirement": "Controlled failure cannot record false completion",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T08",
      "evidence_class": "executed_control_flow",
      "requirement": "Partial startup diagnostic and cleanup path",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T09",
      "evidence_class": "executed_control_flow",
      "requirement": "Bounded stopped-service logs and safe redaction",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T10",
      "evidence_class": "control_flow_and_runtime",
      "requirement": "Owned teardown and sibling/default refusal",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T11",
      "evidence_class": "executed_control_flow",
      "requirement": "Primary/secondary failure and timeout precedence",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T12",
      "evidence_class": "artifact_validation",
      "requirement": "Final payload manifest binds diagnostics and cleanup",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T13",
      "evidence_class": "executed_host_commands",
      "requirement": "Scoped command and CI regressions with actual pinned tools",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T14",
      "evidence_class": "source_and_hash_review",
      "requirement": "Frozen security/toolchain/contract and scope comparison",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T15",
      "evidence_class": "real_docker_fixture",
      "requirement": "Real partial-startup diagnostics and safe teardown",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T16",
      "evidence_class": "documentation_review",
      "requirement": "Truthful status and separation of evidence classes",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T17",
      "evidence_class": "router_receipt",
      "requirement": "Publication and workflow identity verified",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    },
    {
      "id": "R10-T18",
      "evidence_class": "router_receipt",
      "requirement": "Single fresh dispatch and actual outcome preserved",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template: no new R10 result has been executed or asserted."
    }
  ]
}
```
