# Project state — CH-001R-r3 checkpoint

**Last updated:** 2026-09-12 UTC
**State:** `awaiting_review`
**Product:** Open Slideshow Studio
**Target application version:** `0.1.0`

## Authority and traceability

- Active chapter: `CH-001R-r3` continuation of `CH-001-r1` against NS-0.2.
- North Star baseline: `architect/Luna_CH001_v0.1.0_Pack/reference/north-star/NORTH_STAR.md` SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`.
- Starting base commit: `ce17fdf5cade9b91b46da86af943a8be651289f5`.
- Reviewed implementation/evidence: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a` / `ad0dd5fdd6764e4f3a40a6028720bff272130d42`.
- CH-001R-r2 implementation/evidence commits: `b516dab843be1b8870d3516185b52905982aec1f` / `5a931feb01ed8da16eb9f0079a380c61f5459792`.
- CH-001R-r3 implementation commit T3: `0b79ed07a25a618ab4da2bf56a2fed6047398cb5`.
- Handoff: [`handoffs/CH-001R-r3.md`](../handoffs/CH-001R-r3.md); historical r2 handoffs remain [`handoffs/CH-001R.md`](../handoffs/CH-001R.md) and [`handoffs/CH-001R-r2.md`](handoffs/CH-001R-r2.md).
- Evidence index: [`docs/evidence/CH-001R-r3/README.md`](../docs/evidence/CH-001R-r3/README.md); historical r2 evidence remains [`docs/evidence/CH-001R-r2/README.md`](../docs/evidence/CH-001R-r2/README.md).
- Accepted application version: none. This checkpoint is not architect-accepted.

## Implemented checkpoint

The repository contains the private manual path: one-owner Better Auth sessions, PostgreSQL/Drizzle migrations, project/draft/revision persistence, validated local image staging and derivatives, three layouts, two canvas presets, manual text/framing controls, autosave/undo/conflict handling, an outbox plus pg-boss worker, shared Playwright rendering, exact JPEG preview bytes, and ordered ZIP packaging. CH-001R-r3 adds the bounded `pnpm proof:ch001` coordinator, a manually dispatched standard-runner workflow, fresh-run ownership, source/test identity checks, migration bootstrap repair, test-source typing, canonical UI/export assertions, lifecycle helpers, and sanitized partial evidence. It does not claim that the live proof executed on this host.

## Evidence state

- Passed in this host against T3 `0b79ed07a25a618ab4da2bf56a2fed6047398cb5`: `pnpm lint`, strict `pnpm typecheck`, `pnpm build`, 20 isolated unit tests, and 4 focused security/scope tests.
- The clean r3 coordinator run `r3-local-t3-preflight` exited `2` as `BLOCKED_ENVIRONMENT`: loopback port allocation was denied (`listen EPERM`), Docker/Compose was absent (`spawn docker ENOENT`), and the pinned Playwright Chromium executable/launch probe was unavailable. Integration, authenticated browser, renderer, Compose, image, migration, lifecycle, ZIP, screenshot, and hash assertions therefore discovered/executed zero live cases.
- Fresh r3 partial ledger: `4 PASS / 0 FAIL / 68 NOT_RUN`. The four source-only PASS IDs are not runtime acceptance. No CI run or hosted artifact exists yet; the local sanitized reports are in the ignored run directory `artifacts/ch001r3/r3-local-t3-preflight/public/`.
- Historical CH-001 ledger is preserved unchanged at `docs/evidence/CH-001/gate-results.json` with 0 PASS / 0 FAIL / 72 NOT_RUN.
- External provider calls, paid calls, account authorization, publishing, deployment, release/tagging, and public posts: none.

## Fixed boundaries and next action

The future ScrapeCreators Pinterest boundary, one-key fal.ai model boundary, and no-direct-official-TikTok-Content-Posting-API decision are preserved as deferred design commitments; no provider implementation began. Billing, scheduling, MP4/video, public deployment, and v0.2.0 work did not begin.

The prepared workflow is `.github/workflows/ch001-live-proof.yml`, but the attempted push was rejected because the current OAuth connection lacks GitHub's `workflow` scope. The next authorized action is to publish T3 through an already-authorized repository path, manually dispatch that workflow with T3, and inspect its actual artifact; architect review remains required afterward. Do not mark this state accepted without that review.
