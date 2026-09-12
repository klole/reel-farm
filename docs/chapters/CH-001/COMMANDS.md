# CH-001 / CH-001R-r3 commands and service lifecycle

All commands run from the repository root with Node.js 20.19.x and pnpm 12.3.4.

## Bounded r3 proof profile

`pnpm proof:ch001` is the new, smaller CH-001R-r3 coordinator. It owns a fresh run directory, synthetic credentials, the disposable Compose project, the shipped image, migration/restart lifecycle, real integration/browser/render commands, artifact checks, sanitized reports, and a partial 72-gate ledger. It never reads the normal operator `.env` for proof targets and never touches ordinary application volumes.

```bash
CH001_RUN_ID=r3-$(date -u +%Y%m%dT%H%M%SZ) pnpm proof:ch001
```

Exit `0` means `LIVE_PROOF_READY_FOR_REVIEW`; exit `1` means an executed assertion or evidence failure; exit `2` means a measured environment/permission prerequisite is unavailable. A successful bounded proof is not v0.1 acceptance. Raw files are under `artifacts/ch001r3/<run-id>/private/`; sanitized files are under `artifacts/ch001r3/<run-id>/public/`.

The prepared standard GitHub-hosted runner is manually dispatched only after `.github/workflows/ch001-live-proof.yml` is present on the default branch. With implementation T3 `0b79ed07a25a618ab4da2bf56a2fed6047398cb5`, the exact dispatch command is:

```bash
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main -f implementation_sha=0b79ed07a25a618ab4da2bf56a2fed6047398cb5
gh run list --repo klole/reel-farm --workflow ch001-live-proof.yml --event workflow_dispatch --limit 5
```

Select the run whose input SHA is exactly T3. The workflow uploads only the coordinator's sanitized public directory and keeps the full acceptance verifier separate.

## Install and initialize

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm setup
```

`pnpm setup` creates `.env` mode `0600` only when absent, creates `data/media`, and prints the one-time owner token once. It never replaces existing secrets. `pnpm db:migrate` applies `migrations/0001_ch001.sql` once through the `schema_migrations` guard.

## Compose profile

```bash
docker compose up --build
docker compose ps
docker compose logs --no-color web worker migrate
docker compose down
```

The web service is the only host binding (`127.0.0.1:3000:3000`). The database and worker have no host ports. `oss_db_data` and `oss_media_data` persist across `down`; `down -v` is destructive and is only for an explicitly disposable test installation. The migration service must complete before web/worker start.

## Host profile

With a reachable PostgreSQL server and a matching `.env`:

```bash
pnpm db:migrate
pnpm dev:web
pnpm dev:worker
```

Run the web and worker in separate terminals. The worker owns browser rendering and polls the durable outbox/pg-boss queue. Stopping it does not disable project reads, editing, autosave, or already-ready downloads; new render requests remain queued and the owner-facing status is degraded/offline.

## Required checks

| Command | Work performed | Unavailable-environment behavior |
|---|---|---|
| `pnpm lint` | ESLint over repository source/tests | Fails on lint errors. |
| `pnpm typecheck` | Strict TypeScript project references | Fails on type errors. |
| `pnpm build` | Shared packages, Next web, worker | Fails on build errors. |
| `pnpm test:unit` | Contract/hash/storage unit tests | Must discover and execute tests. |
| `pnpm test:integration` | Real disposable PostgreSQL transaction, schema, mutation, and local-storage checks | `NOT_RUN`, exit 2 without an explicitly marked `DATABASE_URL`. |
| `pnpm test:e2e` | Real authenticated Playwright seven-slide journey and export/hash checks | `NOT_RUN`, exit 2 without a pinned/explicit compatible browser and `E2E_BASE_URL`. |
| `pnpm test:render` | Real Chromium shared-scene corpus and delayed/missing-resource checks | `NOT_RUN`, exit 2 without a pinned/explicit compatible browser. |
| `pnpm test:security` | Focused static boundary/security regressions | Must discover and execute tests. |
| `pnpm test:smoke` | Disposable Compose build, migration rerun, worker stop/start, and volume-recreate checks | `NOT_RUN`, exit 2 without Docker. |
| `pnpm proof:ch001` | Bounded r3 shipped-image, DB, browser, worker, export, alternate-format, and restart proof | Exit 2 for measured runner prerequisites; exit 1 for an executed proof/evidence failure. |
| `pnpm verify:ch001` | Runs all checks, writes raw logs and gate report | Exits nonzero if a required command fails or is `NOT_RUN`; this prevents false acceptance. |

Raw aggregate output is written to the gitignored `artifacts/ch001/local/` directory. The committed sanitized index is [docs/evidence/CH-001/README.md](../../evidence/CH-001/README.md), with the machine-readable gate file beside it.

## CH-001R-r3 execution notes

The r3 coordinator uses `node --import tsx` for its TypeScript runner and a unique Compose project. It verifies the actual checked-out commit and clean tracked tree, probes Docker/Compose and the managed Playwright Chromium path, and records every child invocation. The local T3 preflight was blocked before any live stack was created; its exact run ID and measured errors are indexed in [docs/evidence/CH-001R-r3/README.md](../../evidence/CH-001R-r3/README.md). The full verifier remains strict and is not an alias for this proof profile.

## CH-001R-r2 historical execution notes

The follow-up implementation uses `node --import tsx` for the TypeScript runners because the host's `tsx` IPC launcher cannot open its Unix socket under the managed sandbox. `scripts/verify-ch001.ts` runs all nine required root commands, ingests the four suite reports, binds evidence to the implementation commit, checks the original 72 IDs, and exits 1 for any incomplete gate set. Its tracked blocked run is indexed at [docs/evidence/CH-001R-r2/README.md](../../evidence/CH-001R-r2/README.md).
