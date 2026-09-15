# CH-001R-r10 evidence

Status: `DIAGNOSTICS_READY_FOR_ROUTER_REPRODUCTION`. This is a bounded v0.1.0 migration-startup diagnostic and partial-startup cleanup repair. It is not a migration-success result, application acceptance, or v0.2 work. `application_acceptance=false`, accepted version `none`, and root state `awaiting_review` remain in force.

## Identities

| Item | Identity |
|---|---|
| E9 baseline | `0f222800f1e91a18cc2f16824a87c9513cd29026`, tree `88cb7927e45605177318448115a28c177c6071a0` |
| P10 packet | `df8ce7d938910949fef3840ac2c79ec9c388dc6a`, tree `fe809452e322a858a2ec2dcdc634f712d51c714b` |
| T10 implementation | `ec7cc08d6ed229af9780318858d8051202851746`, tree `9e43ac5c00801f7d523405dbe5874d64264fa7cc` |
| W10 workflow blob | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| W10 workflow SHA-256 | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| E10 evidence commit | Returned after the evidence-only commit; not embedded self-referentially |

The original T9 hosted ZIP and the historical `4 PASS / 0 FAIL / 68 NOT_RUN` ledger remain unchanged in the architect packet. Luna did not publish, dispatch, rerun a hosted workflow, or use providers/credentials.

## Migration disposition

The required final-image/PostgreSQL reproduction was **NOT_RUN** because this host has no Docker CLI or Compose daemon. No final-image migration exception, image ID, SQLSTATE, schema result, fresh migration exit, repeat exit, controlled-failure result, or real cleanup receipt is claimed.

An exact host invocation of the root `pnpm db:migrate` script was run with a synthetic loopback PostgreSQL URL and exited `1` before any connection attempt:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@oss/db' imported from /workspace/projects/reel-farm/scripts/migrate.ts
```

This confirms the root-script resolution hypothesis on the host only. It does not establish that the T9 final image fails identically, so no migration edit is included and `migration_cause_confirmed=false` / `migration_repair_runtime_verified=false` remain true. See [migration-diagnosis.json](migration-diagnosis.json), [migration-baseline.log](migration-baseline.log), and [router-reproduction.md](router-reproduction.md).

## Coordinator repair delivered

The committed T10 change is limited to the existing Compose/proof boundary:

- `scripts/ch001-compose-diagnostics.mjs` validates the generated project/root/env identity before allocation, parses both Compose JSON-array and JSON-lines state, captures selected stopped/running service facts, image IDs, and bounded `--no-color --timestamps --tail 500` service logs, and records malformed/failed reads as unknown or failed rather than empty.
- Diagnostic subprocesses have finite 20-second timeouts and 128 KiB output bounds; timeout and truncation are explicit. Public records redact synthetic secrets, PostgreSQL URLs, bearer tokens, and cookies while raw logs remain private.
- `scripts/ch001-proof.ts` tracks ownership, startup attempted, startup returned, and readiness independently. It captures diagnostics before `down -v --remove-orphans`, preserves the startup failure as primary, appends diagnostic/cleanup failures as secondary, and runs scoped post-cleanup container/volume checks.
- Diagnostics and cleanup are finalized before public sanitization and `artifact-manifest.json` hashing. The no-startup path writes honest `NOT_RUN` state/cleanup records and issues no teardown.
- `tests/ci/compose-diagnostics.test.mjs` exercises the same helper used by the proof coordinator, including stopped `migrate` state, redaction, bounded command arguments, preexisting-project refusal, scoped cleanup, and early no-startup evidence.

No SQL, migration ID, transaction, advisory-lock, completion-record, dependency pin, Dockerfile, Compose dependency, worker sandbox, workflow, provider, publishing, or v0.2 surface was changed.

## Verification

| Check | Result | Evidence class |
|---|---|---|
| `pnpm install --frozen-lockfile` in restricted sandbox | FAIL: registry DNS | Environment limitation; preserved in command report |
| Same pinned frozen install with approved network retry | PASS; pnpm `12.3.4`, lockfile unchanged | Host toolchain |
| Changed-module syntax and `git diff --check` | PASS | Host static |
| `pnpm lint:workflow` with official actionlint `1.7.7` | PASS | Pinned host static |
| `pnpm test:ci` | PASS; 7/7 file-level | Pinned host CI |
| Source-bound clean prefix | PASS; 7/7 file-level, 69/69 nested, no `node_modules` | Detached source-bound CI |
| Source-bound hosted-like prefix | PASS; 7/7 file-level, 69/69 nested, no `node_modules`, opt-in false | Detached source-bound CI |
| `pnpm lint`, `pnpm typecheck`, `pnpm build` | PASS | Host static |
| `pnpm test:unit` / `pnpm test:security` | PASS; 20/20 / 4/4 | Host tests |
| `pnpm proof:ch001` on T10 | Exit 2 `BLOCKED_ENVIRONMENT`; gate ledger 4/0/68 | Local coordinator run |
| Final-image migration, same-DB repeat, controlled failure, real Docker partial startup | NOT_RUN | Docker unavailable |
| Hosted publication/dispatch | NOT_RUN; 0 requests | Router-owned |

The local proof wrote `compose-startup-state.json` and `compose-cleanup.json` with `startup_attempted=false` and no teardown command, and its manifest included both records before hashing. The retrievable ignored run root is `artifacts/ch001r10/r10-local-proof/proof/public/` in this workspace; the durable summaries are included here.

## Scope and next action

The router may run [router-reproduction.md](router-reproduction.md) in a Docker-capable environment to obtain the missing final-image exception and real partial-startup evidence. If it remains diagnostic-only, the one conditional manual T10 request may be used solely with `dispatch_purpose=diagnose_migration` after publication checks. Luna does not dispatch it. Acceptance remains false and the project stops for architect review.
