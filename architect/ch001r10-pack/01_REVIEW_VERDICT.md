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
