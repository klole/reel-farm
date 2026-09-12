# Project state — CH-001R-r4 checkpoint

**Last updated:** 2026-09-12 UTC
**State:** `awaiting_review`
**Product:** Open Slideshow Studio
**Target application version:** `0.1.0`

## Authority and traceability

- Active chapter: `CH-001R-r4` CI bootstrap repair and bounded live-proof redispatch preparation; continuation of `CH-001R-r3` against the unchanged v0.1.0 contract.
- North Star baseline: `architect/Luna_CH001_v0.1.0_Pack/reference/north-star/NORTH_STAR.md` SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`.
- Starting source / packet P4: `a86c3ace9ad8bf1ec941565ce7dbc4e4d734b4e2` (P4 is based on prior E3 `4cf020317cfc2e8755f35ee6da10f7397c8676f2`).
- T4 implementation: `69b784526260e3e5acf133da8d1a2fb33447d20f`; tree `55fdf4fc16f1d07498f6fb447cddc64e5261be2c`.
- E4 handoff/evidence: [`handoffs/CH-001R-r4.md`](../handoffs/CH-001R-r4.md) and [`docs/evidence/CH-001R-r4/README.md`](../docs/evidence/CH-001R-r4/README.md); full E4 SHA is returned with the handoff.
- Historical T3/E3: `0b79ed07a25a618ab4da2bf56a2fed6047398cb5` / `4cf020317cfc2e8755f35ee6da10f7397c8676f2`; historical r3 handoff remains [`handoffs/CH-001R-r3.md`](../handoffs/CH-001R-r3.md).
- Historical r2 implementation/evidence commits remain `b516dab843be1b8870d3516185b52905982aec1f` / `5a931feb01ed8da16eb9f0079a380c61f5459792`; older records remain available.
- Workflow at T4: blob `65f1ae428e925b4747fea03f6c228a8af4acf15b`, file SHA-256 `e41c6ce267c8dacfe759f83c873c0f53ebca90e2c56f19e6d17202267b06b896`.
- Accepted application version: none. This checkpoint is not architect-accepted.

## Implemented checkpoint

The application implementation and strict 72-gate acceptance contract remain as recorded through r3. T4 is limited to CI repair: a shared pinned/checksummed native pnpm bootstrap for Actions and Docker, dependency-free outer CI/bootstrap reports, literal summary formatting, nullable absent-proof classification, early failure evidence, and focused positive/negative regressions. Node `20.19.2`, pnpm `12.3.4`, the lockfile, application dependency pins, existing bounded coordinator, and original acceptance references remain unchanged.

## Evidence state

- Passed in this host against T4 `69b784526260e3e5acf133da8d1a2fb33447d20f`: dependency-free `pnpm test:ci`, `pnpm lint`, strict `pnpm typecheck`, `pnpm build`, 20 isolated unit tests, and 4 focused security/scope tests.
- A real official Linux x64 native pnpm archive bootstrap, digest/layout inspection, idempotent repeat, current/subsequent PATH and version checks, and native `pnpm install --frozen-lockfile` passed. The lock hash remained `9c49bf356bdd523623b79cf6096df83de51f06b358bffa88391700a4c5719d70` and tracked files remained clean.
- The fresh bounded T4 coordinator run `r4-local-t4-preflight` exited `2` as `BLOCKED_ENVIRONMENT`: loopback port allocation was denied (`listen EPERM`), Docker/Compose was absent (`spawn docker ENOENT`), and the pinned Playwright Chromium executable/launch probe was unavailable. Integration, authenticated browser, renderer, Compose, image, migration, lifecycle, ZIP, screenshot, and hash assertions therefore discovered/executed zero live cases.
- Fresh T4 partial ledger: `4 PASS / 0 FAIL / 68 NOT_RUN`. The four source-only PASS IDs are not runtime acceptance. No hosted T4 run or artifact exists; local sanitized reports are in the ignored run directory `artifacts/ch001r4/r4-local-t4-preflight/proof/public/`. CI4 source/helper checklist: `17 PASS / 0 FAIL / 7 NOT_RUN`.
- Historical CH-001 ledger is preserved unchanged at `docs/evidence/CH-001/gate-results.json` with 0 PASS / 0 FAIL / 72 NOT_RUN.
- External provider calls, paid calls, account authorization, publishing, deployment, release/tagging, and public posts: none.

## Fixed boundaries and next action

The future ScrapeCreators Pinterest boundary, one-key fal.ai model boundary, and no-direct-official-TikTok-Content-Posting-API decision are preserved as deferred design commitments; no provider implementation began. Billing, scheduling, MP4/video, public deployment, and v0.2.0 work did not begin.

The prepared workflow is `.github/workflows/ch001-live-proof.yml` at T4. Luna did not push or dispatch; local `main` is one commit ahead of `origin/main`, which remains P4. The next authorized action is for the router to publish the preserved T4 and E4 through an already-authorized workflow-capable repository path, verify the workflow identity, manually dispatch one fresh run with T4, and inspect its actual artifact. Do not rerun failed hosted run `34665615514`, dispatch T3, or mark this state accepted without architect review.
