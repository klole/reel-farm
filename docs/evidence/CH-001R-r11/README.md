# CH-001R-r11 evidence

Disposition: `IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION`.

This is the narrow Open Slideshow Studio `v0.1.0` root `@oss/db` workspace-dependency repair and migration-first qualification implementation. It is not v0.2, full acceptance, a hosted result, or a provider/publishing change. `application_acceptance=false`, accepted application version is `none`, and root state is `awaiting_review`.

## Identities

| Item | Identity |
|---|---|
| P11 architect packet / starting source | `10db55ff1f942f3b1894699fea3180b69f4afe27`; tree `f1c342eef70e7f1d22818b1cbc364a687d34c985` |
| Prior T10 / E10 | `ec7cc08d6ed229af9780318858d8051202851746` / `f512c9c02620ea600404cd304782a37e6689a109`; T10 tree `9e43ac5c00801f7d523405dbe5874d64264fa7cc` |
| T11 implementation | `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f`; tree `9b948f6247c1f7804e34bd22cf3c9ae623bde593` |
| E11 evidence commit | Returned after the evidence-only commit; not embedded self-referentially |
| Workflow | blob `35fa339aac2fcb024cd476ff38d87d27eb6482af`; file SHA-256 `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| D1 receipt | `ad2aab759391c070808024ff98977f72c8cb8ec5` |

The failed hosted negative baseline remains read-only: run `34946892709`, artifact `10387768055`, digest `sha256:4c6dae545e0f778ff90bebf9216bd90258ceb41fde228a9fdff50f460a34e685`, with `ERR_MODULE_NOT_FOUND` for `@oss/db` from `/app/scripts/migrate.ts`. It was not rerun, retried, or used as a new candidate result.

## Narrow repair

- The application root now declares exactly `"@oss/db": "workspace:*"`. The lockfile adds only the root importer block `specifier: workspace:*` / `version: link:packages/db`; the frozen candidate lock hash stayed `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576` after install.
- `scripts/ci/pin-scope.mjs` allows only that manifest/lock delta. R7-T11 remains active, and R11-T04 adds negative controls for wrong/missing/extra root edges, registry links, external dependency changes, metadata changes, and runtime-pin changes.
- `scripts/verify-db-module-import.ts` imports the real built package, checks the resolved path and pool API without connecting to a database, closes the pool, and records an isolated missing-root-link control. The coordinator performs this actual verifier after build; the final image invokes the same shipped script.
- `scripts/ch001-migration-verification.mjs` and the existing proof coordinator now qualify, in order, final-image import, build/container exits, fresh migration, schema facts, a separate sentinel, same-database repeat, controlled permission failure, and fixture cleanup before worker readiness. Results are persisted before the worker readiness attempt and survive downstream failure.
- Existing run-owned Compose diagnostics, bounded/redacted logs, stopped-container inspection, and scoped cleanup remain in the proof path. No fake module, host SQL, broad alias, manual symlink, source/node_modules masking mount, or placeholder runtime artifact was added.

Unchanged frozen surfaces include `scripts/migrate.ts`, `migrations/0001_ch001.sql`, `Dockerfile`, `compose.yaml`, sandbox qualification files, the workflow bytes, external dependency versions, pnpm `12.3.4`, and the original `CH001-001` through `CH001-072` gate contract. See [scope-comparison.json](scope-comparison.json).

## Source-ready results

The checklist is [r11-results.json](r11-results.json): `10 PASS / 0 FAIL / 8 NOT_RUN`. R11-T01–T08, T15, and T16 passed. T09–T14 are explicitly runtime `NOT_RUN` under the measured Docker/Compose/Chromium limitation. T17–T18 remain router-owned and were not performed.

The final source-bound clean and hosted-like rehearsals each passed `8/8` file-level modules and `74/74` nested cases, with no `node_modules` before the prefix. They used the actual current workflow bodies, pinned Node `20.19.2`, pnpm `12.3.4`, and official cached actionlint `1.7.7` (archive SHA-256 `023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757`; executable SHA-256 `9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c`). See [prefix-clean.json](prefix-clean.json) and [prefix-hosted-like.json](prefix-hosted-like.json).

Host static results were successful: frozen install, lint, strict typecheck, production build, unit `20/20`, security `4/4`, standalone module-import verification, and the migration-first/control-flow tests. The exact command record is [commands.log](commands.log).

## Runtime boundary

The fresh local coordinator run `r11-local-003` exited `2` as `BLOCKED_ENVIRONMENT`. It produced the original bounded ledger of `4 PASS / 0 FAIL / 68 NOT_RUN`; host post-build module import is PASS, while final-image migration and all database/browser/worker stages are NOT_RUN. Docker CLI/Compose was absent or denied, loopback allocation returned `EPERM`, and the pinned Playwright Chromium executable was unavailable. No Docker project, database, image, worker, browser, ZIP, screenshot, or runtime fixture was allocated. Diagnostics, no-startup cleanup, migration status, and module-import results were retained before manifest sealing; see [proof-fallback.json](proof-fallback.json), [module-import.json](module-import.json), [migration-verification.json](migration-verification.json), and [local-proof-manifest.json](local-proof-manifest.json).

The required next runtime observation is router-owned: publish the committed T11 source through the authorized path and, only after source-ready review, request at most one fresh hosted migration-first run. A real image/database result must be recorded separately; this evidence does not infer one.

## External actions and stop condition

Luna's hosted request count is `0`. The only package-network activity was the approved frozen-install retry after the offline cache lacked one tarball; no provider, credential, Docker resource, publication, workflow dispatch, auto-retry, host-policy mutation, release, or v0.2 work occurred. Stop for router/architect review with `application_acceptance=false`, accepted version `none`, and root `awaiting_review`.
