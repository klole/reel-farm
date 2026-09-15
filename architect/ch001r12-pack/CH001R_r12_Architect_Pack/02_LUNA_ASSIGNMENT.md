# Luna MAX assignment — CH-001R-r12-r1

## Mission and stop condition

Fix the three documented migration-proof defects without undoing the r11 dependency repair or broadening application scope. Return a source-tested **T12/E12** candidate and executable runtime verification, not another plan. Stop for architect/router review. Do not publish or dispatch from Luna.

This chapter targets the existing unaccepted v0.1.0. It is not v0.2, a product redesign, or an acceptance decision. All original 72 application gate IDs and requirements remain unchanged.

## 1. Establish and preserve the baseline

Read the original CH-001/North Star, published r11 packet, `handoffs/CH-001R-r11.md`, `handoffs/luna-ch001r11-router-pro-update.md`, r11 evidence, and this entire packet. Record starting HEAD/tree and ancestry to T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f` and E11 `323947cba4197689f40c9084f38629244d58792f`. Preserve later router documentation. Do not overwrite unrelated execution changes.

Inspect at least:

```text
scripts/ch001-proof.ts
scripts/ch001-migration-verification.mjs
scripts/ch001-migration-verification.d.mts
scripts/verify-db-module-import.ts
scripts/ch001-compose.ts
scripts/ch001-compose-diagnostics.mjs
tests/ci/migration-first.test.mjs
tests/ci/workflow-validation.test.mjs
scripts/ci/pin-scope.mjs
package.json
pnpm-lock.yaml
migrations/0001_ch001.sql
```

The root dependency is already fixed. `package.json`, `pnpm-lock.yaml`, `scripts/migrate.ts`, application SQL, Dockerfile, Compose, the workflow, external dependency versions, and browser security settings are now frozen to T11 for this chapter. The r11-reported lock SHA-256 is `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576`; independently measure candidate bytes and compare with the exact T11 file. Prefer direct byte comparison over trusting this handoff value alone.

Do not change dependency resolution again. Do not add a package, global alias, hoisting setting, production failure flag, or extra workflow input.

## 2. Repair the SQL observation, not the application schema

Replace both unsafe CASE statements in `confirmFreshMarkerAbsent` and `runFailureControl` with one shared, read-only marker observation routine.

The intended protocol is:

```sql
-- First statement: catalog lookup only; safe when the relation is absent.
SELECT (pg_catalog.to_regclass('public.schema_migrations') IS NOT NULL)::int;

-- Separate statement, sent ONLY after the first observation proves presence.
SELECT count(*)::text FROM public.schema_migrations;
```

The routine may return structured JSON instead of scalar text; keep its parser deterministic. It must be used by both real adapter call sites, not only by tests. Do not send both statements as one pre-parsed query batch. Do not hide the table reference in another CASE, COALESCE, UNION, CTE, or an allegedly unreachable subquery.

Required semantics:

- Presence query succeeds, returns exactly one valid false/zero observation: table is absent; no count query is issued. Record `table_present=false`, effective marker count 0, and that zero follows from absence rather than an executed COUNT.
- Presence query succeeds and proves presence: execute a second schema-qualified count. Record the actual nonnegative integral row count and evidence for both queries.
- Absent table or an existing empty table satisfies the existing **no completion marker** predicate. A positive row count fails that predicate. Keep the eventual post-migration requirement of exactly one `0001_ch001` record separate.
- Error, permission denial, timeout, malformed/empty/multiple output, unsafe numeric conversion, or truncated output yields FAIL/UNKNOWN with a null count—not a successful zero.
- A table disappearing between the two reads is an observation failure, not permission to ignore an SQL error. This is a disposable single-owner qualification; do not add a new transactional migration subsystem to solve the race.

Do not pre-create, truncate, drop, or insert into `public.schema_migrations` to make the probe pass. Do not execute application DDL outside the normal `pnpm db:migrate` process. Keep connection targets explicit and bind the failure-control probe to the failure-control database, not the main disposable application database.

Use a small adjacent helper when needed for actual-boundary testing. It must accept a guarded query adapter; never accept arbitrary end-user table names or untrusted interpolated SQL.

## 3. Project container facts before public logging

Repair `inspectMigrationContainer` and its logging boundary. A public log must never receive the full result of `{json .}`, even temporarily before a later sanitization pass.

Choose one of these narrow implementations:

1. Ask Docker for an explicitly selected object using a fixed template, with each value correctly JSON-encoded; or
2. Introduce a private-only inspection capture, parse/validate it, then pass an explicit selected object to the normal public logger.

Keep only fields actually needed: container ID/name, image ID, project identity needed for ownership, status, exit, selected error text, start/finish times, configured user and working directory, and actual process executable/arguments. Process `Path` and `Args` are top-level inspection fields. If recording `Config.Cmd`/`Config.Entrypoint`, label them as configuration rather than replacing the actual executed process facts. Redact allowed string fields using the run's secret set.

Do not publish `Config.Env`, full `Config`, full `HostConfig`, unrestricted labels, authentication configuration, or raw mount/source paths. If mount evidence is required to rule out a source/dependency bind mount, emit only necessary destination/type/readonly facts, not host paths. Avoid broad framework changes: this is a repair to the new migration-container inspection path and its public serialization.

The failure path needs the same discipline. Failed JSON parsing must not copy the raw body into a public exception. A diagnostic error can record type, exit, safe bounded message, and a private-log reference. Never set a missing exit to zero.

## 4. Make the import result and terminal result agree

In `finalImageModuleImport`, build an effective observation before writing `module-import-verification.json`. PASS requires:

- a successful actual Compose CLI result with exit 0;
- no timeout and no truncation that compromises the evidence;
- one valid parsed import report that actually reports successful real-module loading;
- an inspected, terminal `exited` container with exit 0 and required identity facts;
- no inspection or parsing failure.

The persisted report and returned stage must contain the same final status and classification. Preserve separate fields for the child's declared result and the effective verdict where useful. Include CLI and inspected-container observations explicitly. The classification must remain **module import only**, not successful database migration.

Tighten the migration terminal validators so an omitted or null container cannot satisfy container-required fresh/repeat/failure-control stages. Build and database-start commands legitimately have no finished migration container; give those a separate CLI-only validation path rather than accidentally breaking them. This is an additive contract correction, not a reason to accept all nonzero exits.

For the controlled failure, retain its exact purpose: the real entrypoint must produce the intended SQL/permission failure, a real nonzero CLI/container outcome, and a successfully observed zero completion-marker count. Setup failure, missing package, lost daemon, timeout, or an unreadable marker table must not be counted as a successful SQL failure control.

## 5. Test real boundaries and preserve pre-install bootstrapping

Keep `node --test tests/ci` dependency-free. Do not load `pg`, tsx, built workspace modules, or a database into the pre-install CI suite. Use pure tests there for observation parsing, exact query dispatch decisions, field selection, strict terminal evidence, and controller order. Import the production helpers in these tests instead of copying their implementation into tests.

Retain the existing migration-first controller tests. Add cases at its actual SQL/inspection adapters. A fake method returning `{status:'PASS'}` does not test the embedded SQL.

Add a small real PostgreSQL regression in the installed/capable runtime. It must use the production marker observer and cover:

- absent metadata table;
- existing empty metadata table;
- positive completion-marker count;
- inability to read the count, or a lost/invalid observation;
- the exact T11 query as a historical negative control on an absent-table fixture, recording actual `42P01` if obtained.

Any fixture metadata table or role belongs in a separate disposable test database under this run. It must not seed or mask the main fresh migration database. No production credentials, saved user `.env`, or unknown remote Docker context. Clean fixtures even after failure, preserve siblings, and persist their outcomes before sealing evidence.

Where a local authorized PostgreSQL/Docker runtime is unavailable, implement the real regression and wire it into the installed migration-first proof after DB readiness. Mark it NOT_RUN locally. The one future candidate hosted run can supply this live evidence; a prior local green database is not required for the explicit hosted fallback. Do not create another workflow, download an unrelated VM, or weaken sandboxing to obtain it.

## 6. Preserve the complete migration-first journey

Retain the order: image build → real final-image module import → DB start/readiness → read-only fresh precondition → normal fresh migration → schema/single marker → sentinel → same-database repeat/invariants → controlled permission failure/no false marker → fixture diagnostics/cleanup → durable migration receipt → later worker/web readiness.

The live SQL fixture regression may run after DB readiness, isolated from the main database, without changing the product migration. Ensure the final receipt records it; do not silently ignore its failure.

Keep the existing unmodified migration command and schema. A migration PASS still requires final-image execution and real SQL observations. A module-import PASS cannot satisfy it. A later worker failure leaves completed migration evidence intact and the overall proof failed.

Keep r10's run-owned cleanup and proof-directory protection. Collect selected, sanitized diagnostics before deleting the retained migration containers. Keep primary and secondary failures separate. Do not delete evidence, overwrite a rejected proof directory, or seal a manifest before the final diagnostics/cleanup results exist.

## 7. Required source checks and retrievable evidence

On final committed T12, run the existing frozen install, pinned workflow lint, complete CI suite, clean and hosted-like no-node_modules prefixes, lint, typecheck, build, unit, security, actual post-build DB module-import verifier with its negative control, changed-module syntax checks, and `git diff --check`. Use pinned actionlint from the verified provisioner rather than relying on an unconfigured global binary. Record file-level versus nested test counts separately.

Do not change root package scripts just to add this chapter's test command. A direct documented command for a new focused test is acceptable. Keep old regression tests active.

Local commands are evidence only when executed. Publish sanitized raw command outputs or retrievable archived equivalents, not just summary assertions. Check that every path in the handoff actually exists in committed/attached evidence. A gitignored `commands.log` with no delivered copy is not retrievable evidence. Whitelist specific sanitized files for evidence publication rather than globally removing log ignores or committing private output.

Use `docs/evidence/CH-001R-r12/` and `handoffs/CH-001R-r12.md`; update state and index only to awaiting review. Keep T12 execution and E12 evidence separate. Do not embed the future E12 SHA in the file bytes that determine E12. Preserve T11/E11 and historical D1 artifacts unchanged.

## 8. Authorized changed surfaces

Allowed: the SQL marker adapter/helper, migration-container inspection/public serialization, effective import verdict/strict migration terminal predicates, adjacent types, source-bound tests, installed runtime SQL regression, and small coordinator wiring needed to execute those checks and report them. Existing evidence chapter admission can be extended only where required, without touching gate semantics.

Frozen: root dependency and lock bytes at T11, external/runtime/tool pins, pin guard allowance, application source, `scripts/migrate.ts`, `migrations/`, Dockerfile, Compose, workflow bytes/permissions/inputs, sandbox implementation, worker isolation, renderer/editor, original 72 gate definitions and verifier acceptance rules.

Do not expand into general timeout management, CLI redesign, global logging refactors, unrelated helper defects, UI polish, or feature work. A distinct downstream problem returns to review with its evidence.

## 9. Completion modes

**IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION:** all available source/pre-install/import/contract checks pass; remaining database/container tests are honestly NOT_RUN locally and are runnable inside the existing authorized hosted path.

**SOURCE_AND_LOCAL_RUNTIME_VERIFIED_READY_FOR_REVIEW:** the same source checks plus actual authorized local SQL/final-image cases ran successfully; this still does not accept the application.

**BLOCKED:** required source checks fail, identity or ownership cannot be established, or frozen boundaries would have to change. Return useful in-scope work and the concrete blocker. Do not call it source-ready.

Then stop. Luna may not push or dispatch. The router's rules are in [04_ROUTER_HANDOFF.md](04_ROUTER_HANDOFF.md).
