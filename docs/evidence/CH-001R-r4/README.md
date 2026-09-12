# CH-001R-r4 evidence index

Target: `CH-001R-r4` / Open Slideshow Studio `v0.1.0`. Packet P4: `a86c3ace9ad8bf1ec941565ce7dbc4e4d734b4e2`. Implementation T4: `69b784526260e3e5acf133da8d1a2fb33447d20f`. Root state remains `awaiting_review`; application acceptance remains `false`; accepted application version remains `none`.

## Implementation evidence

- The T4 scope is limited to `.github/workflows/ch001-live-proof.yml`, `Dockerfile`, the dependency-free `scripts/ci/` bootstrap/result helpers, the pinned native release manifest, the `test:ci` command, and focused `tests/ci/` regressions.
- The existing Node pin remains `20.19.2`; the project package-manager pin remains `pnpm@12.3.4`; the lockfile and application dependency versions are unchanged.
- The official Linux x64 archive was downloaded locally, matched SHA-256 `9705e5704b4679fb503c963a18d1ac4f105e39aafafca8a2ed346facdf820cd0`, and its actual `pnpm` plus `dist/` member layout was inspected and executed. The local installation repeated successfully from its attestation.
- The helper regression suite is dependency-free and runs directly with Node. It covers summary data handling, nullable absent-proof classification, exit 1/2 distinction, stale/malformed proof rejection, pinned target drift, unsafe archive metadata, and wrong digest rejection before extraction.

## Local T4 result

Run ID: `r4-local-t4-preflight`. The bounded existing `pnpm proof:ch001` coordinator ran against T4 and returned exit `2`, status `BLOCKED_ENVIRONMENT`. This is local evidence only and is not a hosted run or an application acceptance result.

Measured unavailable prerequisites:

- Loopback allocation was denied: `listen EPERM: operation not permitted 127.0.0.1`.
- Docker CLI/daemon/Compose were unavailable: `spawn docker ENOENT`.
- The managed Playwright Chromium executable was absent at `/home/box/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`, so its sandboxed launch could not complete.

The fresh T4 parent ledger contains exactly `4 PASS / 0 FAIL / 68 NOT_RUN`, with the same four source-only IDs as the bounded r3 profile. No live database, browser journey, renderer run, shipped image, worker lifecycle, canonical ZIP, alternate ZIP, screenshot set, or preview/hash package was produced. The ignored local public reports are under `artifacts/ch001r4/r4-local-t4-preflight/proof/public/`; the local artifact manifest records 25 public files and status `LIVE_PROOF_INCOMPLETE`.

The CI4 repair checklist is recorded in [ci4-results.json](ci4-results.json): 17 local/source/helper checks pass, 0 fail, and 7 hosted/artifact checks remain `NOT_RUN`. The durable source review is [source-review.md](source-review.md).

## Hosted boundary

No hosted T4 run, job, artifact ID, artifact digest, or remote publication is claimed here. The router must publish the preserved T4 and later E4 commits through the authorized workflow-capable path, then perform one fresh manual dispatch with `implementation_sha=69b784526260e3e5acf133da8d1a2fb33447d20f`. Do not rerun historical run `34665615514` or dispatch T3.

Historical r3 records and the original `0 PASS / 0 FAIL / 72 NOT_RUN` CH-001 ledger remain unchanged. This repair packet does not close the original application findings, alter the strict verifier, or authorize providers, publishing, releases, or v0.2 work.
