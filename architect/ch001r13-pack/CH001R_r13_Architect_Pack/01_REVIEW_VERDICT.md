# Architect review — T12/E12

**Disposition: SOURCE_REPAIR_REQUIRED_BEFORE_HOSTED_DISPATCH.**
**Next assignment: CH-001R-r13-r1.**

## What is supported

The published handoff is explicitly source-ready, not database-ready. Luna reports CI 9/9 file-level and 80/80 nested cases, unit 20/20, security 4/4, post-build real DB-package import success, and a local environment-blocked proof. The repair ledger is 12 PASS / 0 FAIL / 6 NOT_RUN. Those remain Luna's recorded local results; this architect review did not execute them. [S1, S2]

The three r12 mechanisms are present in inspected source:

* F12-01: one observer issues a catalog-only presence statement, then a separate qualified COUNT only when the table exists. Both real marker call sites use it.
* F12-02: container inspection uses private capture followed by selected public projection, with top-level process Path/Args distinct from configured Entrypoint/Cmd.
* F12-03: the final-image import computes an effective CLI/child/container verdict before writing and returning the same report; migration terminals require inspected exited-container evidence.

These are **source repair observations**, not live closure of the PostgreSQL/container obligations. Preserve all three mechanisms. The new defects below do not imply that those changes should be reverted. [S3–S7]

## F13-01 — Regression ACL setup connects to the wrong database

**Blocking source defect in the runtime regression, not in the application migration.**

In `scripts/ch001-proof.ts`, `migrationSql` defaults its third parameter to `"oss"` and uses that parameter for `psql -d`. The local `runSetup(name, sql)` helper inside `runMarkerObserverRegression` calls `migrationSql(name, sql)` with no database argument. [S4]

The regression creates its `public.schema_migrations` table in `fixtureDatabase`, inserts its positive-control row there, and reads it there. It then performs this table/schema-local operation through that default-bound setup helper:

```ts
runSetup(
  "migration-marker-regression-restrict-role",
  `REVOKE ALL ON TABLE public.schema_migrations FROM PUBLIC;
   GRANT USAGE ON SCHEMA public TO ${identifier(fixtureRole)}`
)
```

That resolves to `psql -d oss`, **not** `psql -d <fixtureDatabase>`. A schema-qualified table name does not select a different database. PostgreSQL distinguishes cluster-wide objects such as roles/databases from the tables and schemas inside a particular database; psql's `-d` selects the connection database. [S4, P1, P2]

The controller runs this regression after database readiness but **before the fresh main-database migration**. On the intended clean path, `oss.public.schema_migrations` is absent, so the permission setup is expected to fail on that missing relation and the controller stops before fresh migration. That expected server failure was not reproduced here. The wrong destination is directly established by the source call chain. [S4, S8]

A nonfresh main database would not make this safe: it could let the ACL statement execute against the wrong existing table, masking the binding mistake. Do not use a seeded main database to get past it.

Correct only the operation's connection binding, and make all setup operations within this regression name their database explicitly. Keep CREATE/DROP DATABASE and role administration on the existing maintenance connection; route all fixture table/schema statements to the fixture database. Do not change the global migrationSql default or migrate the main database early as a workaround.

### Why the current tests do not establish this boundary

The focused observer tests supply scalar results to the pure observer. They do not build the actual `psql` argument list for `runMarkerObserverRegression`. Thus they can prove presence/count decisions while missing a wrong `-d` in the production adapter. Keep them and add tests at the actual adapter/command-building boundary. [S9]

The r12 ledger's database-binding and adapter-coverage claims in R12-T03/R12-T10 cannot be treated as closing this newly discovered call site. Preserve the historical report; add this finding and its disposition in r13 rather than rewriting r12's test history. [S2]

## F13-02 — Repeated queries are rejected as duplicate command records

**Blocking source-level evidence mismatch on the intended completed migration path.**

Fresh and repeat schema/marker inspection intentionally execute the same SQL through the same database/user. The operation labels differ, but those labels are not part of the actual command string. The new observer likewise performs identical presence/count commands repeatedly within its fixture database. These are distinct, legitimate invocations. [S4, S5]

The process wrappers already assign a unique `invocationId`, and `command-report.json` has a `child_invocations` list. However, `finalize` drops the invocation ID when constructing the `CommandRecord[]` passed to `validateEvidencePackage`. The validator rejects duplicate **command strings**:

```ts
if (new Set(commandNames).size !== commands.length)
  errors.push("Command report contains duplicate command records.");
```

Consequently the completed repeated-query path produces an error even when the executions themselves are valid. `livePass` does not exclude this validation error. This is a source-derived consequence, not a claimed T12 hosted failure. [S10, S11]

Distinguish a duplicated record from two executions of the same command. Carry the already-generated invocation identity into new command records and validate uniqueness at that level. Preserve every invocation, exact command text, actual exit, time range, log, and implementation/run binding. Do not deduplicate the history, invent unique command strings, drop duplicate detection, or ignore this verifier error.

The narrowly authorized compatibility change must retain historical validation behavior for old records lacking invocation IDs. New r13 records must use the new explicit form consistently. Evaluating required commands must consider every matching required-command invocation, not allow a first/last successful invocation to conceal a failure.

## Dispatch decision

Hold unchanged T12. Repair F13-01 and F13-02 before consuming a hosted request. These defects are observable in the source paths available to Luna even on its Docker-less host. The capable hosted path still supplies the real PostgreSQL/final-image results after source repair.

The read-only manual-run query for creation at or after 2026-09-15T10:39:29Z returned zero records at review. That is a point-in-time observation, not a promise that another actor cannot dispatch later. The router must recheck before submission. [S12]

## Review limitations

No repository application test, frozen install, actionlint invocation, PostgreSQL query, migration, Docker command, Chromium launch, or hosted job was executed during this review. A local read-only clone attempt failed on DNS; GitHub connector reads supplied the source evidence. Local Node is 22.16.0, not the pinned application runtime. No claim of a pinned-runtime reproduction is made.

The artifact checks in this packet validate the generated documents and their integrity only. No original 72-gate result is newly promoted, and the historical T10/D1 run is not rerun or reclassified. Application acceptance remains false; accepted version remains none.
