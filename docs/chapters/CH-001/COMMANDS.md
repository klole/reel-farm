# CH-001 / CH-001R-r2 commands and service lifecycle

All commands run from the repository root with Node.js 20.19.x and pnpm 12.3.4.

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
| `pnpm verify:ch001` | Runs all checks, writes raw logs and gate report | Exits nonzero if a required command fails or is `NOT_RUN`; this prevents false acceptance. |

Raw aggregate output is written to the gitignored `artifacts/ch001/local/` directory. The committed sanitized index is [docs/evidence/CH-001/README.md](../../evidence/CH-001/README.md), with the machine-readable gate file beside it.

## CH-001R-r2 execution notes

The follow-up implementation uses `node --import tsx` for the TypeScript runners because the host's `tsx` IPC launcher cannot open its Unix socket under the managed sandbox. `scripts/verify-ch001.ts` runs all nine required root commands, ingests the four suite reports, binds evidence to the implementation commit, checks the original 72 IDs, and exits 1 for any incomplete gate set. Its tracked blocked run is indexed at [docs/evidence/CH-001R-r2/README.md](../../evidence/CH-001R-r2/README.md).
