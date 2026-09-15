# CH-001R-r11-r1 — Complete architect review and Luna MAX assignment

The companion ZIP contains evidence and machine-readable templates. The operative instructions follow.

# CH-001R-r11 — Root workspace dependency repair and migration qualification

Packet revision: **r1**. Issued: **2026-09-15**. Project: Open Slideshow Studio, repository `klole/reel-farm`. Target application version: **0.1.0, not accepted**.

## Decision

**D1 obtained the missing final-image exception. Authorize a targeted Luna implementation, not another diagnostic-only loop.** The container cannot resolve `@oss/db` from `/app/scripts/migrate.ts`. The root manifest does not declare that local workspace package.

Add the existing `@oss/db` package to root runtime dependencies using `workspace:*`, generate only its local lockfile relationship with the pinned package manager, keep the existing import and SQL unchanged, and qualify real migration behavior. Update the existing pin-regression test narrowly so it permits this exact authorized relationship without permitting any dependency-version drift.

Also make migration qualification an early, independently reported part of the existing bounded proof. Fresh migration, schema inspection, and same-database repeat must run before worker/browser readiness can stop the journey. Keep the r10 ownership, diagnostic collection, redaction, and cleanup path intact.

## Dispatch this assignment

Give Luna MAX the entire packet and `LUNA_START_PROMPT.md`. Read `01_REVIEW_VERDICT.md`, implement `02_LUNA_ASSIGNMENT.md`, and execute `03_VERIFICATION_MATRIX.md`. The router then uses `04_ROUTER_HANDOFF.md`. Do not delegate execution to a nonexistent background session.

This packet replaces the D1 instruction to stop after gathering the exception **for new r11 candidate work only**. It does not reopen the consumed r10 dispatch allowance or authorize a replay of T10. Historical evidence remains immutable.

`05_HANDOFF_TEMPLATE.md` and `templates/r11-results.template.json` are handoff scaffolding, not actual test results. `evidence/` contains inspected historical observations only. The archive in that directory is the unchanged T10/D1 artifact, not a candidate result.

## Non-negotiable state

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
next_feature_chapter=NOT_AUTHORIZED
```

Do not run providers, AI, publishing, scheduling, analytics, billing, video, deployment, or release tasks. Do not relax host or worker sandboxing. Do not modify the original 72 acceptance gates. A successful migration or bounded proof is not full application acceptance.

No repository writes, application test execution, migrations, Docker commands, or workflow dispatches were performed by the architect while preparing this packet. Files generated here are review instructions and historical-artifact inspection records.


---

# Architect review — CH-001R-r10-D1

## Verdict

**Diagnostic objective achieved; application acceptance denied/pending.** The final-image failure is now established as a package-loading failure. R11 may repair the confirmed root dependency relationship immediately. It need not consume another hosted request to reproduce the same missing-package error before editing.

### Reviewed identities

| Item | Observed identity |
|---|---|
| T10 implementation | `ec7cc08d6ed229af9780318858d8051202851746` |
| T10 tree | `9e43ac5c00801f7d523405dbe5874d64264fa7cc` |
| E10 | `f512c9c02620ea600404cd304782a37e6689a109` |
| D1 receipt commit supplied by router | `ad2aab759391c070808024ff98977f72c8cb8ec5` |
| Additional main head observed in this review | `3d1bb3c8b544b295236aa92aaee1e406e26f68aa` |
| Workflow definition used by D1 | `c53f29861640831c4dbd588bef5ec9aa6fef5157` |
| Workflow blob | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Workflow file SHA-256 | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Hosted run / job | `34946892709` / `104308321648` |
| Hosted attempt | `1`, as bound by artifact and receipt |
| Artifact ID / name | `10387768055` / `ch001-live-proof-34946892709-1` |
| Artifact bytes / SHA-256 | `65347` / `4c6dae545e0f778ff90bebf9216bd90258ceb41fde228a9fdff50f460a34e685` |

The later main commit updates receipt identity and associated metadata, not application code in that commit's diff. Do not reset the repository to T10 and discard those records. Recheck the complete starting ancestry and execution-surface comparison before editing.

## F1 — Confirmed missing root runtime dependency

The archived service log records:

```text
$ node --import tsx scripts/migrate.ts
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@oss/db' imported from /app/scripts/migrate.ts
Node.js v20.19.2
```

The actual migration container exited **1**. The database was healthy; web and worker containers were only created and had not started. The script imports `pool` from `@oss/db`, but root `package.json` has no `@oss/db` dependency. `packages/db/package.json` exists, is named `@oss/db`, and exports `./dist/index.js` for ESM imports. The Dockerfile performs the frozen workspace install and build, then copies `/app` into the final image.

**Conclusion:** the shipped migration entrypoint is missing a declared root-to-workspace runtime dependency. The authorized correction is the normal package relationship, not an SQL rewrite, registry substitute, custom resolver, broad hoisting change, or hand-created symlink.

The pnpm workspace protocol is explicitly local-only. Node resolves a bare package specifier through its package-resolution rules, not by scanning arbitrary sibling package directories. See primary references in `06_REFERENCES.md`.

A fixed import does not prove that subsequent database connection, DDL, transactions, or repeat migration will work. Those are candidate runtime tests, not historical passes.

## F2 — R10 diagnostics and scoped cleanup worked on this failure path

The artifact includes the stopped migration state, useful service stderr, and a cleanup receipt. Teardown returned **0**; post-cleanup container and labeled-volume inventories were empty. Its teardown output also records removal of the project's default network. No independent network inventory is present in the archived cleanup receipt, so do not describe a separately measured network count as verified here.

The startup record and cleanup receipt are both covered by the original proof payload manifest. Preserve this path. This observation does not close every r10 safety test, prove every timeout/error path, or qualify sibling-resource isolation generally.

## F3 — Existing pin regression would reject the authorized fix

`tests/ci/workflow-validation.test.mjs`, test `R7-T11`, compares the package manifest to T6 after removing only `lint:workflow` and compares the lockfile byte-for-byte to T6. Adding the needed root dependency without addressing that guard would turn the next run into another preventable CI bootstrap failure.

Keep the original test's purpose. Allow exactly `dependencies['@oss/db'] === 'workspace:*'` and its corresponding root importer link. Continue rejecting changed registry package versions, native-package-manager metadata, other workspace relationships, toolchain pins, runtime inputs, and security configuration. Add negative cases so the exception cannot grow into a blanket skip.

This is an explicit r11 exception to earlier package/lock immutability instructions. It is not a retrospective claim that Luna was authorized to do it under the published P10 assignment.

## F4 — Migration proof must precede worker readiness

In T10 the coordinator starts the complete stack, waits for worker/browser/database/storage readiness, and only then tests migration repeat/metadata. A distinct worker failure could therefore prevent any positive migration evidence even after the dependency fix.

R11 may introduce a small migration-first prefix within the existing coordinator, using the same final image, private environment, run-owned project, and shipped migration command. Persist its result before attempting worker/browser readiness; retain it on later failure. This is a verification-order correction, not a change to the shipped Compose dependency graph.

## Actual hosted outcome remains unchanged

```text
bootstrap_status=PASS
classification=LIVE_PROOF_FAILED
proof_invoked=true
proof_exit_code=1
proof_status=TEST_FAILURE
historical_application_gates=4 PASS / 0 FAIL / 68 NOT_RUN
application_acceptance=false
accepted_application_version=none
```

The four passes are source-only. The zero FAIL count in that ledger does not negate the executed startup failure. Missing slideshow/preview/export artifacts are downstream consequences. Successful fresh application, successful repeat, schema qualification, worker rendering, and application acceptance were not established.

The GitHub step that captures the bounded proof returns successfully to let finalization run; the final enforcement step fails. Do not interpret the green capture step as a green proof. The artifact's pre-upload `artifact_delivery=PENDING` is a snapshot before upload; the independently listed/downloaded artifact establishes delivery, not an edited historical report.

## Architect verification actually performed

The downloaded archive matches the API's **65,347 bytes** and SHA-256. ZIP CRC validation passed. All **53 file members** were read and all **34 original manifest-listed payload hashes and byte counts** matched. The archived migration log also matches the Git blob identity of the committed copy. The proof binds the manifest hash correctly.

These are historical-artifact and source-inspection checks, not new runtime/application tests. See `evidence/historical-run-inspection.json` for the precise boundaries. The architect did not patch the repository, install project dependencies, run Docker, execute a migration, launch Chromium, or dispatch a workflow.

## Authorized next owner

**Luna MAX: CH-001R-r11.** Implement the narrow dependency fix and executable verification path. **Router:** publication validation and, if elected under this packet, one fresh T11 hosted request. **Architect:** review its actual result. Full application acceptance remains exclusively pending the original contract.


---

# Luna MAX assignment — CH-001R-r11

## 1. Mission and authority

Repair the confirmed final-image `@oss/db` package-resolution failure and return evidence showing what the real migration can do after repair. Build the verification path so fresh migration, schema checks, and same-database repeat execute before worker readiness.

This is implementation work, not another plan. Do not spend this chapter repeating a known historical failure simply to authorize the already-evidenced dependency fix. The D1 artifact is the negative runtime baseline. Use MAX effort, make the bounded correction, verify it with the strongest available environment, and stop for review.

Application acceptance remains false. No next feature chapter is authorized. The architect has **not** claimed that the candidate migration succeeds.

## 2. Establish the real starting tree

Record the starting commit, tree, clean/dirty status, and ancestry. Read the original North Star/CH-001 contract, the published r10 assignment, r10 handoff, D1 receipt and error, and this entire packet. Relevant repository paths:

```text
handoffs/CH-001R-r10.md
docs/evidence/CH-001R-r10/
docs/evidence/CH-001R-r10-D1/router-receipt.json
docs/evidence/CH-001R-r10-D1/public/migrate.log
state/PROJECT_STATE.md
state/REQUIREMENT_STATUS.md
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
.npmrc
scripts/migrate.ts
packages/db/package.json
packages/db/src/client.ts
Dockerfile
compose.yaml
scripts/ch001-proof.ts
scripts/ch001-compose.ts
scripts/ch001-compose-diagnostics.mjs
tests/ci/workflow-validation.test.mjs
```

The runtime baseline is T10 `ec7cc08d6ed229af9780318858d8051202851746`. The D1 receipt commit is `ad2aab759391c070808024ff98977f72c8cb8ec5`; a later receipt-sealing commit `3d1bb3c8b544b295236aa92aaee1e406e26f68aa` was also observed. Preserve documentation/evidence progress after T10. Verify that no unrelated execution changes have appeared; do not overwrite them.

Use actual P11/T11/E11 identities after their commits exist. No self-referential evidence SHA, force push, history rewrite, release, or tag is required.

## 3. Make the one dependency correction

Add exactly this entry to **root runtime `dependencies`**:

```json
"@oss/db": "workspace:*"
```

Leave all other existing root fields and scripts unchanged. Do not put it only in devDependencies, use a registry semver range, or add it merely to another workspace. The root script is the consumer that failed.

Use the pinned pnpm `12.3.4` to generate the matching application root importer entry in `pnpm-lock.yaml`. Expected semantics:

```yaml
importers:
  .:
    dependencies:
      '@oss/db':
        specifier: workspace:*
        version: link:packages/db
```

The repository lockfile has more than one YAML document. The first package-manager metadata document is not the application dependency importer. Preserve all documents and the native pnpm metadata. Do not load a single document, regenerate from scratch, or hand-trim the lockfile to make a check pass.

The authorized lock delta is only this local root relationship. Existing registry resolutions/integrities/snapshots, versions, peer metadata, other importers, and pnpm management data must remain unchanged. A package-manager formatting change with no semantic effect must be isolated and explained; avoid gratuitous rewrite. Unexpected resolution/version changes are a blocker, not authorization to refresh dependencies.

Keep these bytes unchanged unless a distinct architect decision is obtained:

```text
scripts/migrate.ts
migrations/0001_ch001.sql
packages/db/package.json
packages/db/src/
Dockerfile
compose.yaml
.nvmrc
.tool-versions
.npmrc
pnpm-workspace.yaml
playwright.config.ts
scripts/ci/pnpm-native-release.json
scripts/ch001-sandbox.mjs
.github/workflows/ch001-live-proof.yml
```

Also preserve other application/worker/renderer code and the strict acceptance contract. The built `@oss/db` exports already exist; do not bypass them by switching the migration to an implementation-file import. Keep the transaction, advisory lock, completion row, script command, and schema untouched.

## 4. Repair the pin guard without relaxing it

The current `R7-T11` test will reject both the new dependency and lockfile. Update only its allowed-change logic and add focused tests.

Require the new root value to equal `workspace:*` exactly, then compare all remaining root manifest fields against the frozen baseline (retaining the historical `lint:workflow` exception). Do not ignore the entire dependencies object, scripts object, or root manifest.

For the lockfile, compare the exact frozen baseline to the candidate while permitting only the one root importer link. The pre-install suite must remain dependency-free apart from the already provisioned actionlint executable. Do not introduce a YAML library or application import into that stage. A strict, unambiguous recognition of the single expected local-link block is acceptable for this frozen lock format; fail on ambiguous placement, duplicate blocks, additional changes, or an unexpected document layout. Do not use a broad string deletion that could hide edits in other importers.

Regression cases must reject: wrong workspace specifier; registry fallback; omitted edge; unexpected second root dependency; changed `pg`/other external version; modified integrity/snapshot/native-pnpm metadata; changed unrelated runtime/security pin. They must also preserve the complete old-T6 workflow rejection test and all r5–r10 regression coverage.

Run the actual complete pre-install sequence in clean and hosted-like disposable source trees with no `node_modules`. Keep synthetic parent command-file sentinels intact and sandbox opt-in false. Preserve separate file-level and nested case counts. Do not invoke real DB imports from `node --test tests/ci` before installation/build.

## 5. Prove real module resolution after installation/build

Add a small post-build import smoke check using the pinned Node `20.19.2`, real tsx `4.23.13`, and actual built `@oss/db` module. It must not rely on Vitest aliases, custom loaders beyond the existing tsx usage, fake modules, manually created workspace links, global packages, `NODE_PATH`, or a dirty existing `node_modules`.

Execute in a disposable clean source checkout after pinned frozen install and the existing build. Resolve/import from the root/scripts context that matches the failing entrypoint. Record the resolved real path and prove it is the built repository `packages/db/dist/index.js`, not a registry package or an unrelated directory. Import its real exports, verify the expected pool API is present, and close the pool without connecting to a database.

Use a synthetic database URL and explicitly suppress normal dotenv loading. Classify this as **MODULE_IMPORT_PASS_NOT_DATABASE_PROOF**. Do not call the migrating module itself just to inspect its imports: that executes SQL if a live database is reachable. Test the real dependency import separately and run the actual migration only against the guarded disposable database below.

Include an isolated negative control that removes only the root workspace link from a disposable test tree after installation/build, or uses the recorded frozen baseline, and demonstrates the missing-package failure. Restore only that test tree. Never unlink modules in the user's working checkout. This negative test is diagnostic evidence, not a new hosted T10 run.

If real post-build loading finds another missing transitive package, preserve the error and stop at that specific blocker. Do not broaden the dependency allowance to arbitrary packages. The current assignment authorizes only root → `@oss/db`.

## 6. Qualify migration before worker startup/readiness

Use a small adjacent harness integrated into the **existing `pnpm proof:ch001` path**, not a new CI system or workflow. Prefer reuse of r10 process/Compose/ownership/diagnostic helpers. Do not alter `.github/workflows/ch001-live-proof.yml`; W11 should equal the working W10 bytes.

The required execution order is:

```text
existing CI/bootstrap/sandbox preflight
→ existing host/static checks
→ validate and own a fresh disposable Compose project
→ build the actual final image(s) from committed T11
→ start the isolated db and wait for real database health
→ shipped migration, fresh database
→ schema and single-marker assertions
→ shipped migration, same database repeat + sentinel checks
→ controlled migration failure on a separate disposable database
→ preserve migration result
→ existing full web/worker/application journey, only if migration qualification passed
→ r10 diagnostics / scoped cleanup
→ sanitization / manifest / final result
```

Do not gate the first four database assertions on worker heartbeat, renderer readiness, owner login, or a browser journey. Host qualification may still precede the coordinator as in the existing workflow; no host-policy change is authorized.

### 6.1 Image and resource identity

Validate absence/ownership before allocation, keep the evidence-directory ownership guard, and mark startup attempted before any container/network/volume allocation. Use the run's private synthetic environment and exact reviewed Compose configuration. Refuse a preexisting/default/unrelated project.

Build from the clean committed tree using the shipped Dockerfile, with no host source or `node_modules` mount. Record source SHA/tree, image ID, effective user/working directory/command, and mount destinations needed to establish that the image is not being masked. Do not dump environment values, secrets, or unrestricted inspect/config JSON into public evidence.

Only a disposable local/test database is permitted. Use no saved user `.env`, cloud DB, production credentials, or remote Docker target of unknown ownership. Confirm the Docker context before local execution. Generate synthetic secrets for this run; do not place them in shell tracing or committed commands.

### 6.2 Fresh migration

Confirm the test database lacks the migration marker before the initial invocation. Run the normal service command, `pnpm db:migrate`, whose script remains `node --import tsx scripts/migrate.ts` from `/app` under the shipped non-root image user.

A one-off `docker compose run --no-deps -T --name <run-owned-name> migrate` after database readiness is suitable. Do not append `exec vitest` or another command: arguments after the service replace its configured command. Retain the container until its terminal state/exit/image facts are collected. Do not use `--rm` for runs whose container exit must subsequently be inspected. Build beforehand; `compose run` is not granted imaginary flags such as `--no-build`.

Alternatively, use the real migrate service plus a bounded wait/inspect that obtains its terminal exit. A detached `compose up` return alone is insufficient. Record Compose/CLI exit and actual container exit separately, and reject timeouts/unknown states.

A migration PASS requires both normal exit **0** and successful SQL observations. Verify the expected application tables/keys/constraints against the unchanged SQL; there must be exactly one `schema_migrations` row with `id='0001_ch001'`. Record marker time and a schema fingerprint or equivalent deterministic facts. Do not use manually executed application DDL as a substitute.

### 6.3 Repeat on the same database

Create a small synthetic sentinel in a test-only schema/table of this isolated database. Run the same unmodified migration entrypoint again against the same volumes/database and same candidate image; collect the direct and inspected exits. Require exit **0** and already-applied behavior. Verify the single marker, unchanged marker timestamp, schema invariants, and sentinel bytes. Do not delete/recreate volumes, truncate the app tables, or reconnect to a different database between fresh and repeat.

Delete only the test-owned sentinel/schema when needed before the application journey; do not reset the application schema. Record this fixture cleanup separately from migration behavior.

### 6.4 Controlled failure

Use a separate disposable database/role under the owned test project to demonstrate that the real entrypoint still returns nonzero and does not falsely record completion on an SQL/permission failure. A restricted synthetic role lacking schema-create permission is a suitable control. Record the actual error class/SQLSTATE and inspect the failed database afterward using the test administrator.

No edits to migration SQL, production failure flags, fake completion rows, patched application modules, or bypass credentials are permitted. A process-fixture regression can additionally verify failure propagation, but cannot be labeled a real SQL rollback test. If the chosen permission fixture fails to trigger the expected condition, report a failed test rather than claim it validates rollback.

### 6.5 Preserve progress and genuine failure status

Write a dedicated `migration-verification.json` with individual import/fresh/schema/repeat/failure-control statuses and references to real logs. Persist it before worker readiness is attempted. A later worker error must preserve completed migration results and keep the whole bounded proof failed.

When migration itself fails, stop the live journey, retain its inner error as primary, mark later checks NOT_RUN, and run r10 diagnostics/cleanup before finalizing. Missing export artifacts are secondary, not a reason to replace the migration error. Never produce placeholder exports to satisfy finalization.

The full shipped stack can invoke its configured migration again when its normal dependency chain starts. That is expected and must remain idempotent; do not weaken `service_completed_successfully` or forge a service exit to avoid it. Keep the same tested image/source and identify any such extra invocation honestly.

## 7. Keep cleanup and evidence sound

Retain the r10 distinction between ownership, allocation/startup attempt, success, and readiness. Reuse the same project identity/root/env across all commands. Track retained one-off containers and any temporary database/role/sentinel explicitly so normal teardown removes only resources created by this run.

Every diagnostic/inspect/wait/teardown needs a finite timeout and bounded output. Suggested initial caps are 15 minutes for a clean image build, 120 seconds for database readiness, 60 seconds per migration, and the existing 20-second/128-KiB diagnostic limits. A timeout is not a pass; changing limits to hide deterministic failures is forbidden. Terminating a Docker CLI does not prove its container stopped: inspect and clean up the run-owned container.

Capture service logs and selected state before deletion. Record actual cleanup exits and post-cleanup inventories. Include retained one-off containers in verification, not only long-running Compose services. Do not use global prune or destroy sibling resources. Keep evidence even when teardown fails and report the failure separately.

Sanitize logs, state previews, and error fields with the run's secret set before public writing, including early error paths. Evidence files and final manifest must be complete and immutable before reporting. Do not create a hash cycle between manifest, receipt, and evidence commit; identity of a future evidence commit is returned externally after commit rather than written into itself.

Do not call every mocked helper test a runtime pass. Publish raw observed runtime output only after redaction, with runtime/test class and full T11 identity attached.

## 8. Environment strategy — no circular prerequisite

The missing dependency is confirmed in the final image already. **Implement the allowed fix on the editing host even when Docker is unavailable.** Do not return only another diagnostic-only explanation of the old error.

On the editing host, execute the real frozen install/build/import checks, dependency-scope regressions, CI tests, and clean/hosted-like pre-install rehearsals. Implement the actual image/database verification path so the router can execute it without inventing commands or writing code.

Where a capable authorized local Docker runtime exists, run the same candidate harness there and inspect all results. Where it does not, report those runtime items NOT_RUN and return `IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION`, provided all available non-Docker requirements passed. This mode is not a verified migration repair; it is a source-tested candidate with a working runnable verification path.

Do not install/repair a VM platform, start an unrelated remote daemon, remove sandbox controls, or add a new workflow merely because the editing host lacks Docker. The router may deliberately elect one new T11 hosted run under `04_ROUTER_HANDOFF.md`. A prior local green database test is not required for that specific fallback; it is what the hosted run must establish.

## 9. Scope and stopping rule

Allowed execution-file changes: root dependency plus its lock relationship; the narrow existing pin-test allowance; small post-build import and migration-proof helpers/tests; the migration-first wiring/accurate stage metadata in the existing proof coordinator. Reuse existing safe helpers. No broad Compose/framework rewrite.

Changes to the r10 helper implementation itself should be unnecessary. If the new harness discovers a safety defect preventing use, stop with its specific reproduction rather than broadly weakening ownership. Local in-scope harness bugs may be fixed and retested; no automatic hosted code-fix/redispatch loop is authorized.

Stop at a distinct transitive import, SQL/schema, worker, browser, or app defect outside the exact dependency allowance. Record all completed migration assertions even when a later defect appears. Do not advance v0.2 on any outcome.

## 10. Final checks and handoff

Run against final committed T11, recording exact commands, versions, timestamps, exits, counts, and paths:

```text
pnpm install --frozen-lockfile
pnpm lint:workflow
pnpm test:ci
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
<real post-build migration import smoke command>
<clean no-node_modules pre-install prefix>
<hosted-like no-node_modules pre-install prefix>
<candidate migration harness and bounded proof, only in a capable authorized runtime>
```

Regenerate the small lock change before these final frozen-install checks; record the new candidate lock hash and prove the frozen install does not modify it. New host/image checks must be invoked by the documented coordinator/tests; an orphan script that CI never calls is insufficient.

Use `03_VERIFICATION_MATRIX.md` and complete its template with evidence. Update `handoffs/CH-001R-r11.md`, `docs/evidence/CH-001R-r11/`, and existing state/evidence indexes. Keep application acceptance false and root awaiting review. Do not overwrite r10/D1 history or confuse r11 repair checks with the original 72 gates.

E11 is evidence/state-only after T11. Return actual base/P11/T11/E11 SHAs/trees, frozen-surface comparison, working workflow blob/hash, local/runtime status separation, and remaining blockers. Do not publish or dispatch from Luna. Stop for router/architect review.


---

# R11 verification matrix

This is an **18-case repair checklist**, not a replacement for the 72 original CH-001 application gates. These cases are definitions; no candidate result has been run by the architect.

## Source-ready versus runtime-qualified

Source-ready handoff requires PASS for R11-T01 through T08, T15, and T16, with concrete evidence. Runtime checks T09–T14 may be NOT_RUN only under the explicitly documented Docker-unavailable fallback. Router checks T17/T18 remain router-owned. Failing source-ready requirements cannot be bypassed by requesting a hosted run.

Migration runtime qualification requires actual T09–T13 results; T14 supplies safe diagnostics/cleanup. A fixture expected to fail passes its *negative-control test* only when the actual nonzero exit/error/no-false-marker assertions pass. Its migration operation remains a deliberate failure, not a successful fresh migration.

A successful migration is not a successful bounded proof, and neither independently accepts v0.1. Never replace an unavailable result with source inspection.

## Cases

### R11-T01 — Historical baseline and source identity

Evidence class/owner: **source**.

Match D1 archive digest, exact T10 exception and final-image identity, actual starting ancestry, and unaccepted state. No historical rerun is required.

### R11-T02 — Exact root runtime dependency

Evidence class/owner: **source**.

Root dependencies includes exactly @oss/db=workspace:*; other manifest fields/scripts and workspace package definitions are unchanged.

### R11-T03 — Narrow lockfile delta and frozen install

Evidence class/owner: **source**.

Only the application root importer local link changes; all other YAML documents, registry entries, snapshots and native pnpm metadata remain identical. The candidate frozen install leaves its new lock hash unchanged.

### R11-T04 — Pin guard positive and negative cases

Evidence class/owner: **source**.

Existing R7-T11 recognizes the exact allowance; wrong/missing/new relationships and unrelated dependency, integrity, native metadata and runtime-pin edits fail. Original T6 workflow-context negative test remains.

### R11-T05 — Real post-build dependency import and negative control

Evidence class/owner: **source**.

Pinned Node/tsx, real built @oss/db, clean installed tree, correct scripts/root resolution, bounded import with pool closure; missing-root-link control fails. No database or Vitest alias used; record MODULE_IMPORT_PASS_NOT_DATABASE_PROOF.

### R11-T06 — Clean and hosted-like pre-install rehearsals

Evidence class/owner: **source**.

Actual current bootstrap/workflow CI prefix passes in both no-node_modules source trees; exact child environments; parent command-file sentinels unchanged; all file and nested cases accounted for.

### R11-T07 — Existing project and workflow checks

Evidence class/owner: **source**.

Pinned actionlint, full CI tests, lint, typecheck, build, unit, security, syntax and diff checks pass against final T11. Report all commands and counts.

### R11-T08 — Migration-first control-flow regressions

Evidence class/owner: **source**.

Actual extracted helper/coordinator boundary is tested for order, worker unavailable after migration pass, first/repeat/schema failure, unknown exit, log failure and teardown failure. Fakes are labeled control-flow evidence only; tests use no live DB before install.

### R11-T09 — Shipped-image identity and invocation

Evidence class/owner: **runtime**.

Actual final Docker image from T11; effective non-root user, /app directory, unmodified migration command, no source/node_modules masking mount, and image-bound container observations.

### R11-T10 — Fresh migration terminal success

Evidence class/owner: **runtime**.

Proven fresh owned database; normal shipped entrypoint finishes; both CLI and container terminal exit are 0 with no timeout. No manually applied app DDL.

### R11-T11 — Real schema and completion marker

Evidence class/owner: **runtime**.

Expected tables/keys/constraints from unchanged SQL, exactly one 0001_ch001 marker and its time, measured schema facts, same source/image/database bindings.

### R11-T12 — Same-database repeat preserves state

Evidence class/owner: **runtime**.

Same image and volume/database, second invocation exits 0, already-applied response, one unchanged marker, schema invariants and synthetic sentinel preserved. No database reset between invocations.

### R11-T13 — Real controlled failure stays a failure

Evidence class/owner: **runtime**.

Separate disposable restricted-role/database fixture runs the unmodified entrypoint; actual SQL/permission failure is captured with nonzero terminal exit and no false completion mark. Fixture setup/cleanup is identified.

### R11-T14 — Scoped runtime diagnostics and teardown

Evidence class/owner: **runtime**.

Useful pre-deletion logs/state include any retained one-offs; run-owned cleanup exits and post-inventories are recorded; no global cleanup. Completed migration evidence survives any downstream worker failure.

### R11-T15 — Evidence/report regression checks

Evidence class/owner: **source**.

Reports reject zero/missing assertions, fake PASS on unavailable runtime, stale identity, corrupted hash and unknown exits. Migration receipt persists before worker readiness; public payload sealing follows diagnostics/cleanup without circular hashes.

### R11-T16 — Scope/state and durable handoff

Evidence class/owner: **source**.

Allowlisted source changes only; working workflow/sandbox/runtime pins and original gates unchanged; durable logs/results/source comparisons; acceptance false, version none, awaiting review. All unrun runtime cases explicitly remain NOT_RUN.

### R11-T17 — Router publication identity checks

Evidence class/owner: **router**.

Actual P11/T11/E11 ancestry, E11 evidence-only delta, clean publication tree, exact workflow bytes and actionlint result, unique input SHA and request-history review.

### R11-T18 — One fresh hosted observation or explicit no-request receipt

Evidence class/owner: **router**.

At most one newly elected T11 request; capture the actual result/artifact/inner failures and runtime cases. Zero requests is recorded honestly when not elected; it is not a hosted PASS.

## Minimum report fields

Every result includes case ID, PASS/FAIL/NOT_RUN, evidence class (source, actual host import, control-flow fixture, actual image/database, or router), exact command/test name, exit where available, T11 SHA/tree, and at least one retrievable evidence reference. Missing tests have null exit and a reason, not an invented zero.

Each actual migration record carries source/image/container/database identity, start/end times, command, working directory/user, CLI exit, inspected terminal container exit, timeout/truncation facts, error class/SQLSTATE when applicable, and redacted log references. Schema/repeat assertions carry actual query observations. Never publish credentials or generic full environment dumps.

Prefer extending existing assertion/reporting helpers. `migration-verification.json` is a small additive receipt, not another framework. The existing proof must consume its measured result and remain nonzero if a required migration assertion or cleanup fails.


---

# Router publication and one-request policy — CH-001R-r11

## 1. What is and is not authorized

The r10 hosted allowance has been consumed by run **34946892709**. Do not retry it. This packet authorizes Luna to produce **new T11/E11** code/evidence for the now-confirmed missing dependency and migration-first verification.

After the conditions below are met, the router may deliberately elect **at most one fresh T11 `workflow_dispatch` request**. The architect has not sent that request, and creating this packet does not start an external agent. Luna must not dispatch. No background auto-redispatch, old-run rerun, or automatic code patch is authorized.

The earlier records remain read-only: T3 34665615514; T4 34669975078; T5 34671716094; E6 34675672523; P7 34676862756; T7 34678495442; T8 34928718810; T9 34937329430; T10/D1 34946892709. The ban also covers any other historical attempt not enumerated here.

## 2. Accept the source handoff, not an acceptance claim

Read the actual r11 handoff, scope report, source-ready test logs and checklist. Reject unrun source checks, a skipped pin guard, a test that relies on preexisting node_modules, or a migration script that is never invoked by the coordinator.

Local Docker verification is preferred where a capable authorized environment exists. Where Docker is genuinely unavailable, `IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION` is acceptable for publication/request consideration after all source-ready checks pass. Do not require a prior successful local migration as a condition of the explicit hosted fallback; obtaining that runtime evidence is the reason for the fallback.

No VM repair, remote Docker target guessing, new service purchase, provider credential, or user environment is needed. If source checks cannot be met, return the specific blocker and do not spend the hosted request.

## 3. Publication preflight

Verify actual starting/P11/T11/E11 ancestry, preserving D1 evidence. Check the T11 execution delta against the allowed surfaces in this packet. E11 must change evidence/state only. Preserve late documentation-only receipt commits; do not use a force push to return to T10.

Verify the dependency and lock exception yourself: root runtime @oss/db=workspace:*, root importer link:packages/db, everything else frozen. Re-run pinned actionlint against the exact publication workflow. Required workflow blob and SHA-256 are unchanged:

```text
35fa339aac2fcb024cd476ff38d87d27eb6482af
733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d
```

Check these bytes at T11, E11, and the actual definition head on origin/main. A workflow change is outside this packet's scope and requires a separate review instead of opportunistic dispatch.

The implementation SHA is T11; the workflow definition head may be E11 or a subsequent evidence-only publication commit. Record them separately. Confirm origin/main contains the exact candidate and the local workspace used for publication is clean. Record actual tree IDs; do not invent them before commit.

Before requesting a run, examine prior manual requests/runs and the local dispatch receipt for this candidate. GitHub's head_sha is the definition commit, not necessarily the input implementation. Do not assume filtering by implementation SHA alone rules out an existing request. Account for request time, definition ref, input receipt, and checked-out source observation.

## 4. Deliberate fresh request

Only after choosing to use the one allowance, record intended source/definition/workflow hashes and purpose in a local receipt, then submit:

```bash
: "${T11:?Set T11 to the actual approved 40-character implementation commit}"
[[ "$T11" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha="$T11" \
  -f sandbox_qualification=true
```

`purpose=verify_root_db_dependency_and_migration` belongs in the router receipt, **not** as an invented workflow input. The workflow accepts the existing two inputs; do not add `dispatch_purpose` to the CLI request.

If submission errors or its acknowledgment is ambiguous, preserve the response and inspect history. Do not blindly repeat the command. A rejected or uncertain request returns for review rather than an automatic second request under this packet.

Observe the accepted run to completion within the router's actual authorized execution. Preserve the run ID, attempt, job, head/definition/input/actual checkout SHAs, artifact ID/name/size/API digest, and downloaded ZIP hash. Download the artifact from that fresh run, not an old similarly named archive. No reuse/resume of old proof directories.

## 5. Interpret the result accurately

A successful capture/upload step is not necessarily proof success. Report the captured child code and final classification verbatim. Distinguish:

- Bootstrap failed or proof not invoked: migration runtime remains untested; capture exact new prerequisite error.
- Migration package loading/fresh/schema/repeat/controlled-failure check failed: retain inner error and terminal exits; later app stages NOT_RUN.
- Migration qualified but worker/app proof failed: preserve migration PASS evidence and the distinct later failure; whole proof remains failed.
- Bounded proof succeeded: mark ready for architect review only. Do not set application_acceptance=true or accepted version.

Do not make a second hosted request for another stage. The single candidate run already contains the migration-first path and, if it succeeds, the existing bounded journey. Stop at its actual outcome and return it for review. Source/image assertions that never ran keep NOT_RUN.

The strict 72-gate ledger remains independent. Do not transfer old source-only PASS results to the candidate without its own bound evidence. Do not invent a green `verify:ch001`; a green bounded proof does not erase uncovered gates.

## 6. Evidence publication and return

Preserve the downloaded archive unchanged. Store sanitized selected logs, migration-verification receipt, original manifest and independent inspection, cleanup result, first new failure, and command/count summary. Commit only evidence/state to the router's evidence commit; no application patch. Keep source and evidence identities separate.

Avoid circular hash sealing. A receipt can refer to a manifest that excludes that receipt, or an outer manifest can bind the receipt; do not have both claim to hash each other. Return the final evidence commit SHA in the external message after commit. Record separately whether evidence was pushed and whether a chat/agent message was actually sent.

Suggested return:

```text
Assignment: CH-001R-r11
T11 / E11 / router evidence commit: <actual identities>
Workflow definition / blob / SHA-256: <actual identities>
Hosted request count for r11: <0 or 1>
Hosted run / attempt / artifact: <actual or null>
Bootstrap / proof invoked / proof exit / classification: <actual>
Module import / fresh / schema / repeat / negative control: <actual statuses>
Migration command and inspected container exits: <actual>
First distinct blocker: <actual, or none observed>
Diagnostics / cleanup / artifact hash verification: <actual>
Application acceptance: false; accepted version: none; root: awaiting_review
sent=<yes/no>; destination=<actual>; no rerun performed
```


---

# CH-001R-r11 — Luna handoff template

This is a template. Fill it from execution; do not copy example/expected results as passes.

## Disposition

Choose exactly one:

**IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION** — the dependency fix and runnable image/database proof path exist; all source-ready checks passed; Docker/database results remain honestly NOT_RUN for a measured environment limitation.

**MIGRATION_RUNTIME_VERIFIED_AWAITING_ARCHITECT_REVIEW** — real candidate final-image fresh/schema/repeat/controlled-failure assertions passed, with diagnostics/cleanup evidence. State the separate bounded proof outcome, including any later worker/app failure.

**BLOCKED** — a required source check fails, scope/identity is wrong, a distinct runtime defect requires new authority, or usable evidence is absent. Describe the specific blocker. Do not relabel an observed runtime test failure as unavailable environment.

Always retain:

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
```

## Identities and delta

Starting commit/tree; P11; actual final T11/tree; E11/tree returned after commit; workflow definition/blob/file SHA-256; candidate lock SHA-256 before/after frozen install; comparison against T10. Explain the exact root workspace addition, lock delta, pin-guard exception and migration-first wiring. List changed execution paths and prove untouched frozen surfaces.

## Actual command results

For every required command supply execution environment, exact command, start/end, exit, report/log paths, source SHA, and assertion counts where applicable. Keep file-level and nested counts distinct. State what was not executed and why. No unseen local file is sufficient evidence: commit sanitized logs/receipts or supply a retrievable artifact.

## Module import versus migration

Record the real post-build import result and resolved path, plus negative control. This is not SQL proof.

For actual image runs supply image/container identities and the four database records: fresh, schema, repeat, and controlled failure. Bind all to T11. Include both CLI/container exits and inspected same-database/marker/sentinel observations. Null fields stay null when unavailable.

## Downstream proof and safety

Describe the furthest reached stage. Keep migration qualification separate from worker/browser readiness and full slideshow journey. Include diagnostics before deletion, cleanup exit/post-inventories, timeout/truncation facts, sanitized logs and final manifest. Do not claim network/sibling checks absent from the evidence.

## Evidence and state

Complete `r11-results.json` using the supplied template and cross-reference the original application ledger only if one was produced for this candidate. Preserve old records. Update the existing evidence indexes and states to awaiting review; do not grant acceptance.

## External actions

Separate actual package/network access, local Docker resource creation, host-policy changes (not authorized outside existing hosted flow), source commits, evidence commits, publication, and hosted request count. Luna's hosted request count is zero under this assignment. Return the explicit disposition and stop; do not start the next feature chapter.


---

# References and reading boundaries

Reviewed on 2026-09-15. Repository links use immutable refs. Canonical URLs are included for a portable offline handoff; they do not imply a write or dispatch.

## Repository primary evidence

**D1 migration log:** actual exception in the final image; blob `dcdf6d53c20f9501d8e9c71330221fdc7ca3bd78`, full file read. The archived bytes were independently hashed and matched to this blob identity.

```text
https://github.com/klole/reel-farm/blob/ad2aab759391c070808024ff98977f72c8cb8ec5/docs/evidence/CH-001R-r10-D1/public/migrate.log
```

**D1 receipt:** supplied run/source bindings and diagnostic scope; full file read. Its summaries do not supersede the downloaded original archive.

```text
https://github.com/klole/reel-farm/blob/ad2aab759391c070808024ff98977f72c8cb8ec5/docs/evidence/CH-001R-r10-D1/router-receipt.json
https://github.com/klole/reel-farm/actions/runs/34946892709
https://api.github.com/repos/klole/reel-farm/actions/runs/34946892709/artifacts
```

**Root manifest:** blob `f237e403132a7103d3622e9405fff28e9152c963`, full file read; no root `@oss/db` dependency.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/package.json
```

**DB package:** blob `1944b8041171f4f7e860855dc58fcc2ccf11bac6`, full file read; built ESM export.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/packages/db/package.json
```

**Migration:** blob `468dd8c82cc2db53da81f50fc65b8548ede706ae`, full file read; bare `@oss/db` import plus existing transaction/lock/marker behavior.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/migrate.ts
```

**Image packaging:** blob `23cad19d631b5d3048e8b3a899f51d0a63b6de52`, full file read; pinned install/build and final `/app` copy under non-root execution.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/Dockerfile
```

**Pin regression:** blob `ae849214bf29c9cd2f116da607e7ddf3ae9bcf92`; lines 300–440 requested/read, including `R7-T11` at the end. The unchanged remainder was not re-read in this review.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/tests/ci/workflow-validation.test.mjs
```

**Coordinator:** previously inspected immutable T10 excerpts establish the migration checks after worker readiness and diagnostics before finalization. Re-read the complete candidate when implementing.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-proof.ts
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-compose-diagnostics.mjs
```

**Receipt-sealing commit:** later main head observed during this review; diff limited to receipt/manifest metadata in that commit.

```text
https://github.com/klole/reel-farm/commit/3d1bb3c8b544b295236aa92aaee1e406e26f68aa
```

## External primary documentation

**pnpm workspace protocol (12.x):** `workspace:` restricts a declared dependency to local workspace resolution. It provides the intended relationship without a registry substitute. The declaration does not itself prove the candidate image succeeds.

```text
https://pnpm.io/workspaces#workspace-protocol-workspace
```

**Node 20.19.2 ESM:** bare package imports and package exports follow Node's package-resolution algorithm; explicit resolution and real module evaluation are distinct checks. Match the pinned runtime in tests rather than relying on a different global Node.

```text
https://nodejs.org/download/release/v20.19.2/docs/api/esm.html
```

**Docker Compose run:** one-off service execution uses the service configuration; a command following the service overrides its configured command. `--no-deps` prevents implicit dependent-service startup; omission of `--rm` permits later inspection. Confirm terminal container state as well as CLI exit.

```text
https://docs.docker.com/reference/cli/docker/compose/run/
```

**Docker Compose up:** starting detached services is distinct from proving that a one-shot migration completed; use explicit terminal-state/exit observations. Maintain the shipped successful-completion dependency graph.

```text
https://docs.docker.com/reference/cli/docker/compose/up/
```

The docs support implementation choices, not a claim that Luna has executed them. All candidate test results remain to be obtained.


---

Execute **CH-001R-r11-r1** with MAX effort for Open Slideshow Studio v0.1.0. Inspect the repository and read the attached packet plus the original North Star/CH-001 contract before editing.

D1 now captured the actual T10 final-image exception: `ERR_MODULE_NOT_FOUND` for `@oss/db` from `/app/scripts/migrate.ts`. The historical run is 34946892709, artifact 10387768055. Do not repeat the old diagnostic-only loop or rerun that hosted job. Use it as the negative baseline.

Implement the explicit narrow fix: add root runtime `@oss/db: workspace:*`, generate only its application-root importer local link with pinned pnpm 12.3.4, and preserve the migration script/SQL, external versions, Docker/Compose, sandbox, workflow and original 72 gates. Update `R7-T11`'s pin guard only for this exact authorized dependency/lock delta; keep and test all other protections.

Add actual post-build module-import verification and a runnable migration-first prefix to the existing proof coordinator. It must execute the shipped candidate migration in the final image, inspect real fresh/schema/repeat/failure-control outcomes before worker readiness, and retain those results plus r10 diagnostics/cleanup on later failure. Do not substitute fake modules, host SQL, broad aliases, manual symlinks, or placeholder artifacts.

Run the required source-ready checks and both clean/hosted-like no-node_modules CI rehearsals. If Docker is unavailable, still implement the confirmed fix and executable runtime verification; report runtime cases NOT_RUN and return IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION. Do not require an unavailable local Docker pass before returning that specifically authorized fallback. A real image/database run, when available, must be recorded separately.

Return actual P11/T11/E11 identities, evidence-backed checklist, scope/pin comparison, commands/results, and remaining blockers. Do not publish, dispatch, auto-retry, accept v0.1, or start provider/publishing/v0.2 work. Keep application_acceptance=false, accepted version none, root awaiting_review, and stop for router/architect review.
