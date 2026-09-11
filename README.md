# Open Slideshow Studio

Open Slideshow Studio is a private, local-first manual slideshow studio. CH-001-r1 targets v0.1.0: one owner, persisted projects, local image uploads, three manual layouts, 9:16 and 4:5 canvases, local font rendering, immutable revisions, and an ordered JPEG/text/manifest export.

This checkpoint is awaiting review. It is not a complete v1.0 product and it does not call providers, generate content, connect social accounts, publish, schedule, render video, or charge money.

## Quick start with Compose

Prerequisites: Node.js 20.19.x, Corepack/pnpm 12.3.4, and Docker Compose with permission to pull the pinned Postgres and Playwright runtime images.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm setup
docker compose up --build
```

Open <http://localhost:3000/setup>. `pnpm setup` prints a one-time owner-setup token. Enter it with an owner name, email, and password of at least 12 characters. The setup route is closed after the first owner/workspace is created.

Only the web service is host-published, and it binds to loopback. Postgres and the worker remain on the Compose network. The renderer runs in the separate `worker` service; if it is stopped, editing and saving remain available while new renders stay queued or show an offline status.

## Host development profile

The host profile expects a reachable PostgreSQL database in `DATABASE_URL`; the Compose database intentionally has no host port. After `pnpm setup` and a local Postgres is available:

```bash
pnpm db:migrate
pnpm dev:web       # http://localhost:3000
pnpm dev:worker    # separate terminal
```

The local media root defaults to `data/media` and is private. Compose uses named volumes `oss_db_data` and `oss_media_data`. `docker compose down` stops services without deleting those volumes; `docker compose down -v` deletes the disposable database and media volumes and must only be used when that data is intentionally disposable.

## Verification commands

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:render
pnpm test:security
pnpm test:smoke
pnpm verify:ch001
```

The integration, browser, render, and Compose smoke commands require the services described in [docs/chapters/CH-001/COMMANDS.md](docs/chapters/CH-001/COMMANDS.md). They return `NOT_RUN`/exit 2 when their required environment is unavailable; that result must not be reported as a passing substitute.

## What is deliberately out of scope

CH-001 has no Pinterest or other provider SDK, ScrapeCreators call, fal.ai call, AI generation, social connection, publishing bridge, direct official TikTok Content Posting API integration, scheduling, billing, MP4/video output, public deployment, or marketplace. Those future boundaries are preserved in the chapter packet and are not implemented here.

The current checkpoint uses two bundled local font families, generated/local image fixtures only, protected owner routes, PostgreSQL revisions, local media storage, an outbox reconciler, pg-boss delivery, and a shared React/Playwright renderer. See [docs/chapters/CH-001/DEPENDENCIES.md](docs/chapters/CH-001/DEPENDENCIES.md) for versions and license/source notes.

## Repository workflow

`architect/` contains the supplied chapter and North Star packets. `handoffs/` contains orchestrator handoffs. The implementation lives at the repository root as this checkpoint is built. Evidence indexes and durable state are under `docs/evidence/CH-001/` and `state/`.
