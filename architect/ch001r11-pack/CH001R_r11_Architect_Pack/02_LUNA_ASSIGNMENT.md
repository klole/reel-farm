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
