# CH-001R-r3 evidence index

Target: `CH-001R-r3` / Open Slideshow Studio `v0.1.0`. Implementation T3: `0b79ed07a25a618ab4da2bf56a2fed6047398cb5`. Reviewed prior T/E: `b516dab843be1b8870d3516185b52905982aec1f` / `5a931feb01ed8da16eb9f0079a380c61f5459792`. Root state remains `awaiting_review`; accepted application version remains `none`.

## Coordinator result

Run ID: `r3-local-t3-preflight`. The clean T3 run of `pnpm proof:ch001` returned exit `2` and status `BLOCKED_ENVIRONMENT`. It stopped at preflight and did not create a database, shipped image, browser journey, worker render, ZIP, or lifecycle record.

Measured prerequisites:

- Loopback allocation was denied: `listen EPERM: operation not permitted 127.0.0.1`.
- Docker/Compose was unavailable: `spawn docker ENOENT` for version, daemon, and Compose probes.
- Managed Playwright Chromium was not executable at `/home/box/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`; the sandboxed launch probe could not complete.

The coordinator still ran the source-only checks against T3: `pnpm lint`, strict `pnpm typecheck`, `pnpm build`, `pnpm test:unit` (20 tests), and `pnpm test:security` (4 tests), all exit `0`. The unavailable integration, E2E, renderer, and Compose reports each record zero discovered and zero executed assertions. The exact generated public record is available in the shared workspace at `artifacts/ch001r3/r3-local-t3-preflight/public/` while this run remains local; no CI artifact is claimed.

## Partial parent ledger

The coordinator generated exactly the original 72 gate IDs: `4 PASS / 0 FAIL / 68 NOT_RUN`.

- `PASS`: `CH001-067`, `CH001-068`, `CH001-069`, `CH001-072`, source-only E1 inspection at T3.
- `FAIL`: none.
- `NOT_RUN`: `CH001-001` through `CH001-066`, `CH001-070`, and `CH001-071`, because the required live, artifact, lifecycle, visual, manual, or full handoff evidence was not produced.

This limited ledger does not replace the historical `docs/evidence/CH-001/gate-results.json`, which remains `0 PASS / 0 FAIL / 72 NOT_RUN`, and it does not represent v0.1 acceptance. The r2 evidence and handoff remain unchanged.

## Source evidence

The durable E1 source inspection is [source-review.md](source-review.md). It records the deferred provider boundary, loopback-only Compose publishing, non-root worker/capability restrictions, shipped browser dependencies, explicit Chromium sandbox setting, and unaccepted root state. It is source evidence only.

## Dispatch and artifact boundary

The prepared workflow is `.github/workflows/ch001-live-proof.yml`; its Git blob SHA is `4a1b045e4771901713a2ad00705a0a84c9ff1dab` and its file SHA-256 is `c94526b66f6f21f2d4228491854f8df1e2b666796816f3d3b18e7da6c8313f1d`. The attempted push of T3 was rejected by GitHub because the current OAuth connection lacks the `workflow` scope. No workflow run ID, job URL, or hosted artifact exists.

After T3 is published through an authorized repository path, run exactly:

```bash
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main -f implementation_sha=0b79ed07a25a618ab4da2bf56a2fed6047398cb5
gh run list --repo klole/reel-farm --workflow ch001-live-proof.yml --event workflow_dispatch --limit 5
```

The run must verify the input SHA before its sanitized artifact is treated as evidence. No credentials, cookies, auth state, provider keys, or private environment files are part of this index.

## Scope

No fal.ai, ScrapeCreators, Pinterest, TikTok, publishing, scheduling, analytics, billing, video, public deployment, release, or v0.2 work occurred. No provider calls or paid spend occurred. Stop at this checkpoint for architect review.
