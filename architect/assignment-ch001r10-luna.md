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
