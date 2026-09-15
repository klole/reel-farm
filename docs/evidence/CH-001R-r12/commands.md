# CH-001R-r12 source and local command record

All results below are bound to implementation commit `cc9da96079fc681ce162a99bd4e3df21f05cb382` and tree `ef10ce662f60c42f0c566c0d13cf0c698710ccd9`. Node was `20.19.2`, pnpm was `12.3.4`, and the pinned actionlint was `1.7.7`.

## Source and installed checks

- `pnpm install --frozen-lockfile` passed after the sandboxed network attempt was retried with the already cached pinned packages under the approved elevated command. The lockfile remained SHA-256 `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576`.
- `ACTIONLINT_BIN=/tmp/r10d1-actionlint/runner-temp/ch001r8-actionlint-999001015-1-jnNCZ3/actionlint pnpm lint:workflow` passed. Workflow blob is `35fa339aac2fcb024cd476ff38d87d27eb6482af`; workflow SHA-256 is `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d`.
- `ACTIONLINT_BIN=... ACTIONLINT_BOOTSTRAP_ARCHIVE=/tmp/r10d1-actionlint/runner-temp/ch001r8-actionlint-999001015-1-jnNCZ3/actionlint_1.7.7_linux_amd64.tar.gz pnpm test:ci` passed: 9/9 file-level modules and 80/80 nested cases.
- Clean and hosted-like source-bound prefixes passed with the pinned actionlint archive. Their committed JSON and command records are [`prefix-clean-t12.json`](prefix-clean-t12.json) and [`prefix-hosted-like-t12.json`](prefix-hosted-like-t12.json). Each reports 9/9 file-level and 80/80 nested cases, no `node_modules` in the detached source checkout, workflow SHA-256 `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d`, archive SHA-256 `023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757`, and executable SHA-256 `9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c`. The existing rehearsal utility retains its historical `CH001R_R9_SOURCE_BOUND_PREFIX` record label; the identity fields above bind these records to T12.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit -- --reporter=verbose`, and `pnpm test:security` passed. Unit was 20/20 and security was 4/4. Relevant public command logs are under [`local-proof`](local-proof/artifacts/ch001r12/r12-local-20260915c/public/commands/).
- `node --check` passed for all changed `.mjs` files and `pnpm exec tsc --noEmit` was included in the typecheck result. `git diff --check` passed.
- `node --import tsx scripts/verify-db-module-import.ts --negative-control` passed after build. The real workspace `@oss/db` resolved to `packages/db/dist/index.js`, pool connect/end were present and closed, no database connection was made, and the isolated missing-link control exited nonzero with `ERR_MODULE_NOT_FOUND`. This remains module-import evidence only.

## Coordinator boundary run

`CH001_RUN_ID=r12-local-20260915c pnpm proof:ch001` exited `2` with `BLOCKED_ENVIRONMENT`. Its sanitized, committed public record is [`local-proof`](local-proof/artifacts/ch001r12/r12-local-20260915c/public/), including the command report, source review, module import report, migration verification, cleanup records, and unavailable-suite logs.

The local environment reported no Docker executable/daemon, loopback allocation `EPERM`, and no pinned Chromium executable. Build and import checks therefore remained CLI/source checks, while strict migration terminal stages—including the real PostgreSQL marker observer regression—were recorded `NOT_RUN`. The original application ledger was not used as r12 acceptance evidence; the coordinator recorded `application_acceptance=false` and accepted version `none`.

No push, workflow dispatch, provider/publishing action, credential use, agent spawn, or rerun of historical run `34946892709` occurred.
