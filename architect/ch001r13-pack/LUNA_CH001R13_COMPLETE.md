# CH-001R-r13 — complete Luna MAX repair and router packet

This file contains the whole assignment. The ZIP also includes the JSON checklist, review receipt and integrity manifest.

---

<a id="doc-1"></a>

<!-- Packet file: 00_READ_ME_FIRST.md -->

# CH-001R-r13 — Fixture database binding and invocation evidence

Packet revision: **r1**. Issued: **2026-09-15T13:20:45Z**.

## Decision

**HOLD unchanged T12. Source repair is required before hosted dispatch.**

Next executor: **Luna MAX**, followed by the existing router. This is a bounded continuation of the original Open Slideshow Studio v0.1.0 checkpoint, not a feature chapter, a release, or application acceptance.

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
architect_workflow_dispatch_count=0
```

T12 contains the intended three r12 repair mechanisms. Keep them. This review found a wrong-database call in the new runtime regression and a separate command-record identity mismatch on the intended repeated-query path. Neither finding is a new hosted result; no T12 hosted execution was observed in the read-only query described in the review.

## Canonical identities

| Identity | Value |
|---|---|
| P12 | `c7e63600fe7a3cacc6fe469763abbca92c1615b0` |
| T12 | `cc9da96079fc681ce162a99bd4e3df21f05cb382` |
| T12 tree, as recorded in the handoff | `ef10ce662f60c42f0c566c0d13cf0c698710ccd9` |
| E12 / main at review | `b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d` |
| E12 tree, returned by GitHub | `71ce94e0897a2c49edf1b9f7e372fcc85e68751c` |
| Workflow blob | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Recorded workflow SHA-256 | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Recorded preserved T11/T12 lock SHA-256 | `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576` |
| Last relevant hosted negative baseline | Run `34946892709`, artifact `10387768055`, T10/D1 |

**Identity correction:** the router message supplied the 39-character E12 prefix `b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2`. GitHub resolves it to the full 40-character E12 above, ending `ad2d`. Use the canonical value in machine receipts. This is not a different implementation.

E12 directly follows T12. The API comparison reports only evidence/handoff/state files between them. P12-to-T12 reports the 13 implementation files described in the handoff. These are read-only source observations, not runtime validation.

## Reading order

Read [the review](#doc-2), [Luna's assignment](#doc-3), [verification matrix](#doc-4), and [router rules](#doc-5). Use [the handoff template](#doc-6) and `r13-results.template.json`. Sources are in [06_REFERENCES.md](#doc-7).

## Scope boundary

Repair the fixture database target and preserve repeated command invocations correctly. Do not revert the root `@oss/db: workspace:*` fix, the presence/count observer, inspection projection, effective import verdict, strict container-terminal requirements, or migration-first ordering. Do not change migration SQL, runtime dependency pins, Docker/Compose, workflow, worker isolation, or the original 72-gate contract.

The unspent T12 request permission is held and superseded by this packet. After the source and publication conditions below pass, the router may deliberately elect **at most one fresh T13 request**. This is a replacement permission, not permission for T11 plus T12 plus T13. A concurrent or ambiguous existing request must be resolved before any request is made.

---

<a id="doc-2"></a>

<!-- Packet file: 01_REVIEW_VERDICT.md -->

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

---

<a id="doc-3"></a>

<!-- Packet file: 02_LUNA_MAX_ASSIGNMENT.md -->

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

---

<a id="doc-4"></a>

<!-- Packet file: 03_VERIFICATION_MATRIX.md -->

# R13 verification requirements

The checklist below is not the original 72-gate application ledger. Every template row starts NOT_RUN; populate only with executed evidence, environment, source SHA, actual command/case, and a retrievable report/log reference.

SOURCE rows must pass for source-ready handoff. RUNTIME rows may remain NOT_RUN locally only when capability is genuinely absent and the candidate implements those tests in the existing capable path. ROUTER rows are never marked PASS by Luna. Completing the routing task for a failed run does not make the application or migration pass.

| ID | Class | Requirement | Required evidence |
|---|---|---|---|
| R13-T01 | SOURCE | Canonical baseline and frozen scope | Resolve full E12; record real P13/T13; preserve dependency, lock, migration, runtime, workflow and 72-gate surfaces. |
| R13-T02 | SOURCE | Database-aware negative witness | Old omitted-target behavior selects oss and is rejected by the real adapter boundary test. No PostgreSQL runtime result is claimed by the fake. |
| R13-T03 | SOURCE | Explicit targets for every fixture operation | Assert the final psql -d and user values for maintenance, table/schema ACL, observer, and cleanup operations; no default leaks into table-local work. |
| R13-T04 | SOURCE | Main database and failure preservation | Empty-main and existing-main fixtures detect wrong-database writes; setup failure stops later stages; cleanup remains scoped and failures retained. |
| R13-T05 | SOURCE | Invocation record serialization | Two identical command texts retain two actual unique IDs, actual exits, timestamps and distinct logs; serializer agrees with child_invocations. |
| R13-T06 | SOURCE | Strict command-record validation | Legitimate repeats accepted; duplicated/missing/mixed IDs, reused captured records/logs, missing/stale evidence rejected; historical validation stays explicit. |
| R13-T07 | SOURCE | Failure cannot be hidden by repetition | Pass-then-fail and fail-then-pass required-command sequences both remain blocking; expected SQL negatives keep raw exits and checked expectations. |
| R13-T08 | SOURCE | Pinned complete source qualification | Frozen install, real actionlint, CI, clean/hosted-like no-node_modules prefixes, lint/typecheck/build/unit/security, real DB import, syntax and diff; actual logs. |
| R13-T09 | RUNTIME | Actual fixture regression in PostgreSQL | Correct database ACL, absent/legacy/empty/positive/denied observations; main marker absent; fixture cleanup; no fabricated SQLSTATE. |
| R13-T10 | RUNTIME | Final-image migration and repeat | Actual fresh/repeat CLI and container exits, schema/single marker/time/sentinel invariants, restricted-role failure/no marker, before worker readiness. |
| R13-T11 | RUNTIME | Real cleanup and evidence finalization | Safe projections and scoped cleanup; repeated commands do not cause bogus duplicate errors; identities/manifest/logs intact; actual downstream outcome retained. |
| R13-T12 | SOURCE | Handoff and evidence completeness | All rows retained; actual T13 identity and source outputs retrievable; no future E SHA, ignored-only evidence, synthetic live proof or acceptance claim. |
| R13-T13 | ROUTER | Publication and request ledger | Canonical T13/E13 ancestry/workflow bytes/source checks; old T12 permission closed; no outstanding or ambiguous conflicting request. |
| R13-T14 | ROUTER | One deliberate fresh T13 outcome | At most one fresh submission; actual run/job/artifact and migration/downstream result captured separately; no automatic acceptance or retry. |

## Required source test characteristics

Database-aware fakes are source-boundary tests, not PostgreSQL runtime tests.

Routing tests must observe database values at the actual builder/adapter boundary. A fake that ignores its database argument cannot satisfy R13-T02/T03. A string search alone cannot prove that the permission statement reaches the correct database.

Use the intended unchanged main database as a protected sentinel in source tests. Do not exercise that safety test by seeding the real fresh main database. Live permission setup remains confined to the disposable fixture database.

For evidence tests, build realistic repeated-query records with different invocation IDs, times and public log paths, and execute the real record validation path. A test that merely calls `new Set(ids)` without exercising the production validator/serializer is insufficient. Check that command text is not modified and earlier failure observations cannot be silently lost.

The full evidence validator may still correctly reject a synthetic package because application suites/gates are incomplete. Tests of the command-record portion must isolate that boundary explicitly, not label a mocked package a complete accepted application run.

## Runtime versus source accounting

Expected negative SQL errors are observations inside a successful regression only when the expected class, state, and fixture cleanup are verified. Unknown counts, missing terminal containers, truncated reports, or environmental launch failures cannot be treated as equivalent permission failures.

Keep the original application ledger unchanged in definition. Only an actual candidate run may generate its new observed counts. The r12 local 12/0/6 repair ledger and its local blocked application proof stay historical; no source review turns NOT_RUN gates into PASS.

---

<a id="doc-5"></a>

<!-- Packet file: 04_ROUTER_HANDOFF.md -->

# Router authorization and stop rules — r13

## Immediate action

**Do not dispatch unchanged T12 `cc9da96079fc681ce162a99bd4e3df21f05cb382`.** Deliver this repair to Luna MAX. Do not dispatch T11 or rerun T10/D1 `34946892709` or earlier records. Do not auto-cancel or retry a concurrently started job.

This packet replaces the unspent T12 permission. It does not allocate multiple attempts across unchanged and repaired candidates. If a T12 request has already been submitted by another actor, or the request history is ambiguous, return that identity/outcome to the architect before any additional request.

## Publication prerequisite

After Luna returns, independently verify the actual full T13 SHA/tree and E13 SHA/tree. T13 descends from the reviewed T12/E12 baseline and actual P13; E13 contains only evidence/state/handoff additions after final T13. Preserve unrelated later documentation and identify any execution drift. Do not amend a published implementation or overwrite historical evidence.

Verify both F13 repairs from source and their genuine negative/positive adapter/evidence tests. Required SOURCE rows must pass with retrievable logs and final-candidate binding. Runtime NOT_RUN due to a Docker-less editing box is permitted, provided the real PostgreSQL/final-image path remains executable. Do not require yet another plan-only phase to rediscover this known local limitation.

The workflow must remain exactly the reviewed blob `35fa339aac2fcb024cd476ff38d87d27eb6482af` with recorded SHA-256 `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` at T13, publication head, and dispatch definition. Verify current bytes with the pinned actionlint; keep the exact opt-in and permissions. A workflow change is outside this packet.

Do not infer workflow definition identity from the checked-out implementation. Record both separately. Do not assume the publication HEAD still equals E13 at dispatch time; record the actual definition SHA and check its execution-relevant diff.

## One fresh request, deliberately elected

Only after those checks pass may the router elect **one** fresh request for final T13. No architect request is sent by this packet's authoring. A router who does not dispatch must report that honestly.

The two supported workflow inputs remain the existing ones. Purpose is receipt metadata, not a new workflow input.

```bash
# Router-only example; T13 must be set to the verified actual full SHA.
[[ "${T13:-}" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm --ref main \
  -f implementation_sha="$T13" \
  -f sandbox_qualification=true
```

Receipt purpose: `verify_fixture_database_binding_and_invocation_evidence`.

Check all relevant manual requests since the source publication baseline and any router request ledger; a head-SHA-only search can miss a request whose definition is a later documentation commit. Record an intended-request receipt before submission. If submission returns an ambiguous network result, resolve it rather than resending. Failed/rejected submissions are recorded and returned; there is no automatic retry allowance.

## Inspect the actual outcome

Record request count, request response, run/attempt/job IDs or null, implementation checkout, definition and workflow blob/hash, image/container identities, bootstrap outcome, migration observer regression, fresh/schema/repeat/permission-control outcomes, fixture and project cleanup, finalization/manifest outcome, downstream readiness, and actual application gate counts if the run emitted them.

A green wrapper step does not prove the child's exit was zero. Preserve the captured proof exit and final classification. A repaired observer test does not itself prove the application migration works. A completed migration phase does not prove the worker browser works. A successful bounded proof still returns to architect review rather than granting v0.1 acceptance.

Check that the permission operation used the fixture database, not just that its SQL looks right. Check that repeated query commands have separate invocation IDs and intact logs rather than having disappeared from the evidence. Expected negative SQL/control exits must remain visible with their expected-outcome evaluation.

Download and preserve the actual artifact. Verify API-listed digest/size, ZIP integrity, manifest payload hashes, and public-only contents before evidence publication. Preserve the original archive unchanged. If no artifact exists, record its absence rather than creating substitute proof screenshots/exports.

Then stop. Do not patch a later worker/application failure, re-dispatch, release/tag, start provider work, or mark application acceptance true.

---

<a id="doc-6"></a>

<!-- Packet file: 05_HANDOFF_TEMPLATE.md -->

# CH-001R-r13 Luna / router handoff

## Disposition

```text
status=<actual completion mode>
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
Luna_hosted_request_count=0
```

## Identities

Record canonical baseline E12, actual P13 and final T13 SHA/tree, recorded workflow blob/SHA-256 and lock SHA-256, and exact execution diff. Return E13 externally after committing evidence; do not claim an evidence file contains its own future commit identity.

## Findings

| Finding | Actual repair | Negative and positive cases | Limitation |
|---|---|---|---|
| F13-01 fixture database routing | | | |
| F13-02 invocation record identity | | | |

Retain the historical r12 local checklist. Explain that F13-01 is an uncovered runtime adapter call, not a retroactive fabricated T12 hosted failure. State how R12's three prior repairs remain preserved.

## Source checks

List exact commands, Node/pnpm/actionlint identities, source SHA, clean/hosted-like environment class, exits, file-level/nested counts, and retrievable sanitized logs. Identify real module import separately from fake database-adapter tests and actual server execution.

## Runtime results

For each operation, report actual connection database/user and CLI result. For migrations also report retained inspected-container state/exit/image and command. Describe main marker absence, observer fixtures, schema/marker/sentinel invariants, restricted-role failure, fixture cleanup, and payload integrity. Unexecuted results stay NOT_RUN/null.

## Command evidence

Show two real or source-test identical command strings with distinct invocation identities and logs. Record the duplicate-ID/missing-ID rejection tests and the pass-then-fail required-command test. Demonstrate agreement between serialized records, child_invocations, and the validator without changing literal command strings or deleting earlier observations.

## Remaining blocker and external actions

Record no dispatch by Luna, no app/provider/publishing/security changes, and any source/runtime blocker. Do not claim a hosted result from a source-only run.

## Router receipt after independent action

Record actual publication head, workflow definition, input implementation, request count, run/job/artifact or null, first failure and secondary failures, bootstrap/migration/downstream outcomes, cleanup and manifest verification, and original application gate counts from that run only. Distinguish pack delivery, evidence push, external chat send, and workflow dispatch.

Return the complete r13 checklist and stop for architect review.

---

<a id="doc-7"></a>

<!-- Packet file: 06_REFERENCES.md -->

# Sources and provenance

Repository sources below were read through the connected GitHub tool on 2026-09-15. URLs are pinned to the inspected revisions except the explicitly identified point-in-time main/run queries. A Git blob SHA identifies the full source file returned by GitHub; this pack does not claim to have independently rehashed each complete remote file.

- **S1 — r12 handoff:** `https://github.com/klole/reel-farm/blob/b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d/handoffs/CH-001R-r12.md`; blob `5a5ee2258e947e42ff7112e01954c927c47d599e`. Reported local results and no runtime claim.
- **S2 — r12 checklist:** `https://github.com/klole/reel-farm/blob/b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d/docs/evidence/CH-001R-r12/r12-results.json`; blob `f7858c0057eb39e0106394fc40de56e1a44fd444`. Reported 12/0/6 and source/runtime distinction.
- **S3 — marker observer:** `https://github.com/klole/reel-farm/blob/cc9da96079fc681ce162a99bd4e3df21f05cb382/scripts/ch001-migration-marker-observer.mjs`; blob `f93f41a5f080a59d527eff2e1c3b1a5fa2359660`.
- **S4 — proof adapter and observer regression:** `https://github.com/klole/reel-farm/blob/cc9da96079fc681ce162a99bd4e3df21f05cb382/scripts/ch001-proof.ts`; blob `ce86de3d8ac6072cf3a38d2fc593bdde2a818203`. Read ranges 560–840, 704–820 and 866–994: migrationSql, runSetup, ACL target, marker cases, and migration adapter.
- **S5 — repeated schema/marker calls and migration order:** same proof file/revision; inspectMigrationSchema, inspectRepeatState, and migrationMarkerSql.
- **S6 — container projection:** `https://github.com/klole/reel-farm/blob/cc9da96079fc681ce162a99bd4e3df21f05cb382/scripts/ch001-container-facts.mjs`; blob `5a16b62354723bbbb9bd6b6ef3054ab3f7995421`; proof private/public captures at lines 180–330 and 560–690.
- **S7 — effective import verdict:** `https://github.com/klole/reel-farm/blob/cc9da96079fc681ce162a99bd4e3df21f05cb382/scripts/ch001-module-import-verdict.mjs`; blob `37119d2397387b633def1e143aa72a620caf7d39`; saved/returned result in proof adapter.
- **S8 — controller:** `https://github.com/klole/reel-farm/blob/cc9da96079fc681ce162a99bd4e3df21f05cb382/scripts/ch001-migration-verification.mjs`; blob `356b7f43bf87ccb1fac5df843c0fda25ca14886d`; read lines 1–200 including observer-before-fresh ordering.
- **S9 — focused tests:** `https://github.com/klole/reel-farm/blob/cc9da96079fc681ce162a99bd4e3df21f05cb382/tests/ci/migration-marker-observer.test.mjs`; blob `08b8bce2862a859d172c7db7f3151db4e3fc0a43`. Pure fake scalar/projector/verdict tests, not the database-routing adapter.
- **S10 — serializer and final outcome:** proof file at S4, lines 1280–1450; commands map drops invocationId, separate child_invocations, validation and livePass filter.
- **S11 — validator:** `https://github.com/klole/reel-farm/blob/cc9da96079fc681ce162a99bd4e3df21f05cb382/scripts/ch001-harness.ts`; blob `7e92f82e93bd03d39b341c546a76ae9642a69e9b`; read lines 135–390. Duplicate command-text rule and required-command lookup.
- **S12 — no-dispatch point-in-time query:** `https://api.github.com/repos/klole/reel-farm/actions/runs?event=workflow_dispatch&created=%3E%3D2026-09-15T10%3A39%3A29Z&per_page=100` returned `total_count:0` during this review. Router must recheck.
- **S13 — identities:** `https://api.github.com/repos/klole/reel-farm/git/ref/heads/main` and `https://api.github.com/repos/klole/reel-farm/git/commits/b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d` returned canonical E12 and direct parent T12. Compare P12→T12 reported 13 implementation paths; compare T12→E12 reported only evidence/handoff/state paths.
- **S14 — reported frozen hashes:** `https://github.com/klole/reel-farm/blob/b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d/docs/evidence/CH-001R-r12/scope-comparison.json`; blob `3d6cbaaae9883ade08571171244eec0e70d15d2e`. These full-file SHA-256 values are Luna's published measurements, not new architect recomputations.
- **P1 — PostgreSQL 16 database hierarchy and connection scope:** `https://www.postgresql.org/docs/16/manage-ag-overview.html`, checked via web during review. Supports distinction between cluster objects and database-local relations.
- **P2 — PostgreSQL 16 psql:** `https://www.postgresql.org/docs/16/app-psql.html`, checked via web during review; `-d/--dbname` selects the connection database.

No historical hosted run or artifact was newly executed by this review. The r12 source-ready evidence is not promoted to database or application acceptance. F13-01's expected database error and F13-02's finalizer consequence are source/semantic deductions, not recovered T12 hosted errors.

---

<a id="doc-8"></a>

<!-- Packet file: LUNA_START_PROMPT.md -->

Execute CH-001R-r13-r1 with MAX effort as the bounded continuation of Open Slideshow Studio v0.1.0. Read the complete packet, the original North Star/CH-001 contract, and the r12 source/evidence handoff first. Preserve T12 cc9da96079fc681ce162a99bd4e3df21f05cb382 and canonical E12 b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d.

Fix F13-01: the regression's table/schema ACL setup currently falls through runSetup to psql -d oss even though its table is in fixtureDatabase. Require explicit targets in the local fixture setup API and test the real command-builder/adapter boundary, including empty-main and existing-main negative witnesses. Do not seed or migrate the main DB early.

Fix F13-02: distinct fresh/repeat/observer invocations can have identical command text, but the serializer drops invocationId and the validator rejects repeated text. Carry existing invocation identities into new records; reject duplicate/missing IDs and stale/missing evidence while retaining all genuine repeated calls. Do not deduplicate history, change command text, suppress verifier errors, or let a later successful required command hide an earlier failure. Preserve legacy report behavior explicitly.

Keep CI dependency-free before install. Preserve the r11 workspace dependency/lock, all r12 observer/projection/verdict safeguards, shipped migration SQL/command, Docker/Compose/workflow, pins, worker sandbox, and original 72 gates. Run the pinned source matrix, real post-build import, and all available regressions. Runtime-only rows may remain NOT_RUN on a genuinely incapable host, but the real regression and migration proof must remain wired for the capable path.

Return real T13/E13 identities, complete checklist, durable sanitized evidence and scope diff. Keep application_acceptance=false, accepted version none, root awaiting_review. Do not push, dispatch, rerun T11/T12 or historical jobs, spawn agents, release or add features. Stop for router/architect review. The router may later elect at most one fresh T13 request under the packet; nothing authorizes unchanged T12.

---

## Appendix — r13 checklist template

```json
{
  "schema_version": 1,
  "record_kind": "CH001R_R13_REPAIR_CHECKLIST_NOT_APPLICATION_ACCEPTANCE",
  "chapter": "CH-001R-r13",
  "packet_revision": "r1",
  "implementation_commit": null,
  "implementation_tree": null,
  "evidence_commit": null,
  "application_acceptance": false,
  "accepted_application_version": "none",
  "root_state": "awaiting_review",
  "hosted_request_count": 0,
  "hosted_run_id": null,
  "runtime_migration_qualified": null,
  "rows": [
    {
      "id": "R13-T01",
      "class": "SOURCE",
      "title": "Canonical baseline and frozen scope",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Resolve full E12; record real P13/T13; preserve dependency, lock, migration, runtime, workflow and 72-gate surfaces."
    },
    {
      "id": "R13-T02",
      "class": "SOURCE",
      "title": "Database-aware negative witness",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Old omitted-target behavior selects oss and is rejected by the real adapter boundary test. No PostgreSQL runtime result is claimed by the fake."
    },
    {
      "id": "R13-T03",
      "class": "SOURCE",
      "title": "Explicit targets for every fixture operation",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Assert the final psql -d and user values for maintenance, table/schema ACL, observer, and cleanup operations; no default leaks into table-local work."
    },
    {
      "id": "R13-T04",
      "class": "SOURCE",
      "title": "Main database and failure preservation",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Empty-main and existing-main fixtures detect wrong-database writes; setup failure stops later stages; cleanup remains scoped and failures retained."
    },
    {
      "id": "R13-T05",
      "class": "SOURCE",
      "title": "Invocation record serialization",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Two identical command texts retain two actual unique IDs, actual exits, timestamps and distinct logs; serializer agrees with child_invocations."
    },
    {
      "id": "R13-T06",
      "class": "SOURCE",
      "title": "Strict command-record validation",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Legitimate repeats accepted; duplicated/missing/mixed IDs, reused captured records/logs, missing/stale evidence rejected; historical validation stays explicit."
    },
    {
      "id": "R13-T07",
      "class": "SOURCE",
      "title": "Failure cannot be hidden by repetition",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Pass-then-fail and fail-then-pass required-command sequences both remain blocking; expected SQL negatives keep raw exits and checked expectations."
    },
    {
      "id": "R13-T08",
      "class": "SOURCE",
      "title": "Pinned complete source qualification",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Frozen install, real actionlint, CI, clean/hosted-like no-node_modules prefixes, lint/typecheck/build/unit/security, real DB import, syntax and diff; actual logs."
    },
    {
      "id": "R13-T09",
      "class": "RUNTIME",
      "title": "Actual fixture regression in PostgreSQL",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Correct database ACL, absent/legacy/empty/positive/denied observations; main marker absent; fixture cleanup; no fabricated SQLSTATE."
    },
    {
      "id": "R13-T10",
      "class": "RUNTIME",
      "title": "Final-image migration and repeat",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Actual fresh/repeat CLI and container exits, schema/single marker/time/sentinel invariants, restricted-role failure/no marker, before worker readiness."
    },
    {
      "id": "R13-T11",
      "class": "RUNTIME",
      "title": "Real cleanup and evidence finalization",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Safe projections and scoped cleanup; repeated commands do not cause bogus duplicate errors; identities/manifest/logs intact; actual downstream outcome retained."
    },
    {
      "id": "R13-T12",
      "class": "SOURCE",
      "title": "Handoff and evidence completeness",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. All rows retained; actual T13 identity and source outputs retrievable; no future E SHA, ignored-only evidence, synthetic live proof or acceptance claim."
    },
    {
      "id": "R13-T13",
      "class": "ROUTER",
      "title": "Publication and request ledger",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. Canonical T13/E13 ancestry/workflow bytes/source checks; old T12 permission closed; no outstanding or ambiguous conflicting request."
    },
    {
      "id": "R13-T14",
      "class": "ROUTER",
      "title": "One deliberate fresh T13 outcome",
      "status": "NOT_RUN",
      "command_or_case": null,
      "environment": null,
      "implementation_commit": null,
      "actual_evidence": [],
      "reason": "Template: no execution is implied. At most one fresh submission; actual run/job/artifact and migration/downstream result captured separately; no automatic acceptance or retry."
    }
  ],
  "summary": {
    "PASS": 0,
    "FAIL": 0,
    "NOT_RUN": 14
  }
}
```

---

## Appendix — architect review receipt

```json
{
  "record_kind": "ARCHITECT_SOURCE_REVIEW_NOT_RUNTIME_PROOF",
  "assignment": "CH-001R-r13-r1",
  "issued_at_utc": "2026-09-15T13:20:45Z",
  "decision": "HOLD_T12_SOURCE_REPAIR_REQUIRED",
  "next_actor": "Luna MAX via router",
  "source": {
    "P12": "c7e63600fe7a3cacc6fe469763abbca92c1615b0",
    "T12": "cc9da96079fc681ce162a99bd4e3df21f05cb382",
    "T12_tree_reported": "ef10ce662f60c42f0c566c0d13cf0c698710ccd9",
    "E12_supplied_prefix": "b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2",
    "E12_canonical": "b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d",
    "E12_tree_api": "71ce94e0897a2c49edf1b9f7e372fcc85e68751c",
    "main_at_read": "b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d",
    "E12_direct_parent_api": "cc9da96079fc681ce162a99bd4e3df21f05cb382",
    "workflow_blob_recorded": "35fa339aac2fcb024cd476ff38d87d27eb6482af",
    "workflow_sha256_recorded_not_rehashed": "733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d",
    "P12_to_T12_changed_files_api": 13,
    "T12_to_E12_scope_api": "evidence/handoff/state only"
  },
  "observations": [
    {
      "id": "F13-01",
      "basis": "source call chain + PostgreSQL connection semantics",
      "observed_in_hosted_run": false,
      "finding": "marker regression table/schema ACL setup defaults to main oss instead of fixtureDatabase before the main migration"
    },
    {
      "id": "F13-02",
      "basis": "source serializer, repeated query construction and validation predicate",
      "observed_in_hosted_run": false,
      "finding": "distinct repeated queries lose invocationId in command records and are rejected as duplicate command text"
    }
  ],
  "reported_local_results_not_architect_reruns": {
    "repair_ledger": {
      "PASS": 12,
      "FAIL": 0,
      "NOT_RUN": 6
    },
    "ci_file_level": 9,
    "ci_nested": 80,
    "unit": 20,
    "security": 4,
    "module_import": "PASS_NOT_DATABASE_PROOF",
    "proof": "BLOCKED_ENVIRONMENT",
    "runtime_migration": "NOT_RUN"
  },
  "hosted_observation": {
    "query_created_at_or_after": "2026-09-15T10:39:29Z",
    "event": "workflow_dispatch",
    "total_count": 0,
    "point_in_time_only": true,
    "new_T12_run_id": null,
    "new_T12_artifact_id": null
  },
  "architect_execution": {
    "repository_tests_run": false,
    "actionlint_run": false,
    "postgresql_run": false,
    "docker_run": false,
    "hosted_dispatch_count": 0,
    "historical_rerun_count": 0,
    "repository_writes": false,
    "external_agent_forwarding": false,
    "local_node_observed": "22.16.0",
    "clone_attempt": "read-only clone failed: DNS could not resolve github.com; source read through connector"
  },
  "application_acceptance": false,
  "accepted_application_version": "none",
  "root_state": "awaiting_review"
}
```
