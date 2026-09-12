# CH-001R-r6 evidence — hosted Chromium sandbox qualification

This is a narrow continuation of CH-001 for Open Slideshow Studio `0.1.0`. It is not v0.2 work, full acceptance, or a replacement for the original 72-gate contract. Application acceptance remains `false`, the accepted application version remains `none`, and the root state remains `awaiting_review`.

## Source identity

- P6 parent: `8fa06ddae978eb6ca8f946e77459810a7bc68cb3`, tree `c444fe48b83f6aee962c7fccb8a16562a2a3cf56`.
- T6 implementation: `e0ea57665d00a643a8c392dfb9f6a84a723729af`, tree `7a5ada37e8ee88a1617ff19039fa116ced44e9c5`.
- T6 parent: `8fa06ddae978eb6ca8f946e77459810a7bc68cb3`.
- Workflow blob at T6: `f1ddbbfc0cbaa4602663428d569b61dbf12bd068`.
- Workflow file SHA-256 at T6: `e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85`.

## What T6 implements

The new helper resolves the exact Playwright-managed Chromium executable after `realpath`, verifies its recognized revision/layout, regular-file/executable state, ownership/mode, and SHA-256, and rechecks that identity before browser launch and policy installation. It records OS/kernel, uid/gid, user-namespace sysctls, AppArmor/parser/status facts, bounded kernel-denial reads, live browser arguments, namespace/seccomp facts, a synthetic render, and `chrome://sandbox` evidence.

The only privileged route is a manually dispatched, explicitly opted-in, public `klole/reel-farm` `workflow_dispatch` job on the declared standard Ubuntu 24.04 GitHub-hosted runner. It validates the requested/checked-out full SHA, writes one unique root-owned profile attached to the exact managed executable, parses/loads only that profile, and removes only a profile created by this run whose content hash is unchanged. Chromium launch options remain `headless: true` and `chromiumSandbox: true` throughout.

Execution-affecting files are limited to:

- `.github/workflows/ch001-live-proof.yml` — opt-in qualification and post-proof cleanup stages; no proof directory is provisioned by the workflow.
- `scripts/ch001-sandbox.mjs` and `scripts/ch001-sandbox.d.mts` — measured resolver/probe and narrowly guarded policy helper.
- `scripts/ch001-proof.ts` — consumes the qualified host executable and blocks hosted application gates unless qualification is ready.
- `scripts/run-gated-check.ts` and `scripts/ch001-lifecycle.ts` — reject non-managed browser overrides at their direct host launch boundaries.
- `apps/worker/src/index.ts` — keeps the shipped container worker on its image-local managed Playwright browser and removes the host-path override; its non-root/container security defaults are unchanged.
- `scripts/ci/ci-result.mjs` — records qualification/cleanup stages without erasing a primary proof failure.
- `tests/ci/sandbox.test.mjs` and `tests/ci/ci-repair.test.mjs` — deterministic r6 and reporting regressions.

No business/application feature, provider, publishing path, Dockerfile, Compose security default, dependency pin, lockfile, native pnpm manifest, or original gate was changed.

## Local evidence

The committed T6 checks passed. `tests/ci/sandbox.test.mjs` contains 18 focused cases; the aggregate command passed all three CI test files, including all twelve R5 boundary cases. Unit testing passed 20/20 tests and security testing passed 4/4 tests. See [commands.log](commands.log), [r6-results.json](r6-results.json), and [source-review.md](source-review.md).

The one permitted fresh local bounded proof was `r6-local-001`. It exited `2` as `BLOCKED_ENVIRONMENT` with `4 PASS / 0 FAIL / 68 NOT_RUN`. The editing host had no Docker executable, loopback allocation returned `EPERM`, and the pinned Chromium executable was absent at `/home/box/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`. No hosted policy install, `sudo`, browser launch, worker launch, or application journey occurred locally. The exact local proof summary is in [local-proof-summary.json](local-proof-summary.json); its generated raw reports remain under the gitignored `artifacts/ch001r6/r6-local-001/proof/` directory.

The direct read-only host snapshot is [sandbox-local-host-snapshot.json](sandbox-local-host-snapshot.json). It reports the editing host as Debian 13, not the approved Ubuntu runner; AppArmor/parser and two requested sysctls were unavailable and therefore remain `null`, while `user.max_user_namespaces` measured `2147483647`. No denial was tied to the absent browser, and absence is not interpreted as proof of no denial.

## Hosted/router state

R6-T15 through R6-T19 are `NOT_RUN`: this editing box cannot provide the approved hosted runner, privileged AppArmor measurement, shipped worker container, fresh application artifact, or router retrieval receipt. The router must publish T6 and E6, verify the exact identities, and manually dispatch at most one fresh run with `implementation_sha=e0ea57665d00a643a8c392dfb9f6a84a723729af` and `sandbox_qualification=true`. The router—not this editing box—must append actual hosted cleanup/artifact evidence.

No workflow was dispatched from this workspace, no credentials were copied, and no external browser or global host-policy change was attempted. Preserve all historical T5 and original CH-001 evidence unchanged.
