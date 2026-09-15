# Luna MAX assignment — CH-001R-r13

## Mission

Implement the two proven source corrections in the review and return a source-tested T13/E13 candidate whose existing hosted path can reach real migration verification. Do not redesign the application, add a new workflow, or return another plan instead of making the bounded correction. Do not dispatch, publish, spawn another agent, or accept v0.1.

## 1. Establish the real baseline

Read the original North Star and CH-001 contract, the current project state, r11/r12 handoffs, this complete packet, the marker observer, the runtime adapter, the migration-first controller, the evidence serializer/validator, and their tests. Record actual HEAD/tree and tracked changes. Preserve T12/E12 and later documentation-only ancestry. Stop for review if unexpected execution changes overlap this repair.

Resolve E12 to its full canonical SHA from the packet. Do not propagate the truncated receipt prefix into a field requiring 40 characters. Record P13 only after the packet is actually committed; do not invent future P13/T13/E13 identities.

## 2. Correct fixture database routing

Inside the marker-regression setup path, make the target database explicit and required. A minimal approach is to change the regression-local helper from `runSetup(name, sql)` to `runSetup(name, sql, database)` and forward the argument to `migrationSql`. Give every call an explicit target. An equivalent small options-object helper is acceptable. Do not refactor all application SQL calls.

Required routing:

| Operation | Connection database |
|---|---|
| CREATE fixture role | existing maintenance database `oss` |
| CREATE fixture database | `oss`, never the not-yet-created fixture database |
| GRANT CONNECT ON DATABASE fixture | `oss`, targeting the named fixture database in SQL |
| Fixture presence / historical unsafe negative / fixture CREATE TABLE / INSERT / COUNT | `fixtureDatabase` |
| REVOKE fixture table privileges / GRANT fixture schema USAGE | `fixtureDatabase` |
| Denied-count observation | `fixtureDatabase`, as `fixtureRole` |
| DROP fixture database / DROP fixture role | `oss`, after fixture sessions finish |
| Main fresh-migration observation and actual migration | the existing main `oss` path, unchanged |

The table/schema-local restriction must use the same fixture database as the earlier table creation. Do not infer the connection from a statement's schema-qualified name or from an operation label. Reject absent/empty database arguments in the local required-target API before issuing a command. Use the existing generated names and quoting; do not accept arbitrary user-supplied connections or shell fragments.

Keep the fixture's positive-control marker only in its fixture database. Do not pre-create the main schema_migrations table, insert a main completion marker, skip the permission test, or reorder the main migration ahead of the regression.

Record the selected non-secret database and user for fixture operations so a reviewer can follow the actual routing. Existing command logs with `psql -d` remain useful; do not publish passwords or environment values. The row describing `isolated_from_main_database` must be supported by executed binding evidence, not just `fixtureDatabase !== "oss"`.

## 3. Test the actual runtime adapter, not another imitation

The pre-install Node CI suite must stay dependency-free. It cannot require pg, tsx, Docker, node_modules, or a running database.

Use a narrow production seam so those tests can exercise the same routing logic used by the real proof. A small extracted Node-builtins-only regression adapter/command-builder module is permitted, with a declaration file when necessary. Tests must import that production code. Do not make a second test-only implementation of runSetup or a fake regression that simply returns PASS. Do not import the top-level proof coordinator in a way that starts resources during test discovery.

Capture the final command arguments or the last shared builder input that directly produces them. Assert the actual `-d` value and user, not merely a function name or a claimed database field. Include a database-aware fake that distinguishes `oss` from the generated fixture database. Its empty-main scenario must reject the legacy omitted-target behavior; its main-table-present scenario must detect an attempted wrong-database ACL mutation instead of silently passing.

Keep one frozen T12 negative witness tied to T12 and the relevant original function/call site. It may be a bounded source-derived fixture or an injected old omission in the real adapter path, but label the test as a simulated boundary regression, not PostgreSQL proof. Show that the test would fail to authorize the old binding and succeeds for the corrected candidate.

Verify early stop, fixture cleanup order, unknown/error handling, and no continuation into migration/worker readiness after a failed fixture operation. Use the production observer in these tests so that its table-presence and count decisions remain exercised.

## 4. Preserve distinct command invocations in evidence

Reuse `output.result.invocationId` rather than generating a second identity at finalization. Add an invocation identity field to new serialized CommandRecord entries. The preferred field name is `invocationId`, matching the existing runtime value; retain exact command text and the original exit/timestamps/log fields.

A bounded shared record-construction/validation helper is allowed. For r13 reports:

* Every command record has one nonempty invocationId. IDs are unique within the run, correspond to the captured execution, and stay consistent with child_invocations.
* Repeated command text is allowed only as distinct complete invocation records; no earlier record is removed or merged away.
* Duplicate IDs, missing/mixed identities, duplicate copies of the same record, reused public log paths for purportedly distinct captured commands, stale bindings, and missing logs must be rejected by the applicable new-format checks.
* Required root-command validation examines all captured invocations matching that required command. Any failed required invocation remains blocking; later success does not erase it, and first success does not hide a later failure.
* The literal executed command is never changed merely to force uniqueness. Do not append synthetic comments or operation names to the command field.

Preserve historical compatibility explicitly. The shared type may make invocationId optional for old report formats; that does not make it optional for r13. Keep the old duplicate-text rule for historical records without invocation identities. Select the new behavior by an explicit, narrowly supported report version/chapter contract; reject ambiguous mixtures. Do not retroactively edit old evidence.

Keep the existing implementation/run identity bindings, evidence hashes, suite execution requirements, manual evidence rules, finding closures, and all CH001-001..072 requirements unchanged. Admitting the r13 chapter and its invocation record shape is allowed; disabling the strict verifier or filtering its errors is not.

Exercise the actual serializer and validator together with repeated presence, COUNT, and schema/marker queries. Test record duplication separately from legitimate command repetition. Keep expected negative SQL/control observations as real nonzero exits with explicitly checked expected outcomes; never rewrite a raw child exit to zero. A stage-specific expected negative is not permission to tolerate a failed required lint/build/test command.

## 5. Carry forward the full migration-first contract

Do not add new acceptance features. Preserve the existing order:

```text
build / final-image import / DB readiness
  -> isolated observer regression and its cleanup
  -> main marker-absence precondition
  -> fresh shipped migration
  -> schema and single marker
  -> same-database sentinel and repeat invariants
  -> restricted-role genuine failure and no false marker
  -> fixture/container diagnostics and cleanup
  -> migration receipt before worker readiness
  -> existing worker/web/application proof
```

In a capable authorized runtime, the real observer regression must show absent, exact historical unsafe-statement failure, empty, positive, and denied-count cases with correct database targets. Record the expected server error when it is actually observed; do not paste an expected SQLSTATE into an observation field.

For the main DB, preserve absence before the shipped migration, actual final-image import/terminal facts, fresh/repeat schema/marker/sentinel evidence, and genuine permission failure. No host source or node_modules mount may mask missing final-image contents. If the next blocker is a distinct worker/browser/application problem, retain the migration results, preserve cleanup, and return it for review rather than widening the chapter.

Do not weaken r12's private-inspection/public-projection path or its effective import verdict. Continue writing one consistent persisted/returned result. All sanitized payloads must be finalized before the final manifest is sealed. No duplicate-command error may be ignored to obtain a passing artifact.

## 6. Permitted surfaces and frozen surfaces

Primary edits: `scripts/ch001-proof.ts`, focused dependency-free production helper(s) and declarations required to test the two boundaries, and focused tests. `scripts/ch001-harness.ts`/shared command record types and tests may change only for invocation identity, all-required-invocation checking, compatible report-shape admission, and required chapter admission. Controller wiring may change only as necessary to invoke the same extracted adapter; preserve stage ordering and predicates.

Do not change package.json, pnpm-lock.yaml, external or native/tool pins, scripts/migrate.ts, migrations/0001_ch001.sql, Dockerfile, compose.yaml, the Actions workflow, worker/renderer/application features, provider integrations, sandbox policy, gate definitions, or release state. Keep legacy path/fixture prefixes when harmless; cosmetic phase renaming is not required.

No general SQL framework, orchestration rewrite, new service, new CLI provisioner, dependency upgrade, or virtual-machine installation belongs in this chapter. Limit any helper extraction to the already-existing marker-regression/evidence code, not unrelated application operations.

## 7. Source checks and completion modes

Run the pinned frozen install, actionlint, full pre-install CI, clean and hosted-like source-bound prefixes, lint, typecheck, production build, unit/security, relevant syntax/diff checks, and real post-build unaliased DB-module import/negative control. Preserve the pinned Node 20.19.2, pnpm 12.3.4, actionlint 1.7.7, and existing Playwright/runtime versions. The source-bound prefixes must use actual current source and no node_modules; archive/tool provisioning already works and must not be redesigned.

Test the final T13 commit, not only an earlier working tree. Publish retrievable sanitized commands, results, and raw public test output. Record file-level and nested counts separately. Do not claim an aggregate tool run passed when it lacked actionlint; use the actual validated pinned prefix path and describe what ran.

**IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION:** source/adapter/evidence regressions and required local checks pass, with Docker-only tests honestly NOT_RUN on an incapable editing host. The corrected runtime path is present and executable; no local database success prerequisite is imposed merely to recreate the earlier environment deadlock.

**REPAIR_RUNTIME_VERIFIED_AWAITING_REVIEW:** the same source requirements plus genuine capable-runtime database/image/cleanup results. Still not application acceptance, and not permission to dispatch or release from Luna.

**BLOCKED:** source tests fail, baseline drift overlaps scope, identities/evidence are invalid, or a required safety boundary cannot be preserved. Return the specific blocker and useful work. Do not disguise it as source-ready.

Luna returns actual T13/E13 SHAs/trees, the complete r13 checklist, scope comparison, durable evidence, and handoff; then stops. E13 is evidence/state-only. Update project/requirement/evidence indexes without accepting v0.1. The router independently applies the next section's single-request policy.
