# CH-001R-r13 source and local command record

All source results below bind to T13 `6e04b5a5eefe2ef464572da35c88338fa342f525`, tree `405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8`. The host used Node `20.19.2`, pnpm `12.3.4`, and actionlint `1.7.7`. The recorded workflow blob is `35fa339aac2fcb024cd476ff38d87d27eb6482af` with SHA-256 `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d`; the lockfile SHA-256 is `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576`.

## Source matrix

- `pnpm install --frozen-lockfile` passed with the pinned pnpm. The first sandboxed attempt could not resolve registry DNS; the same exact command was retried through the approved network path, reused 460 locked packages, downloaded zero packages, and left the lockfile bytes unchanged.
- `ACTIONLINT_BIN=/tmp/actionlint-r7.3YgGWu/actionlint pnpm lint:workflow` passed. The executable SHA-256 is `9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c`; the official archive SHA-256 is `023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757`.
- `ACTIONLINT_BIN=/tmp/actionlint-r7.3YgGWu/actionlint ACTIONLINT_BOOTSTRAP_ARCHIVE=/tmp/actionlint-r7.3YgGWu/actionlint_1.7.7_linux_amd64.tar.gz pnpm test:ci` passed: 10/10 file-level modules, 0 failed, 0 skipped. The same suite inside both prefixes passed 10/10 modules and 85/85 nested cases.
- Clean prefix: `node scripts/ci/rehearse-actionlint-prefix.mjs --mode clean --archive /tmp/actionlint-r7.3YgGWu/actionlint_1.7.7_linux_amd64.tar.gz --output docs/evidence/CH-001R-r13/prefix-clean-t13.json --run-id 130000001 --attempt 1` exited 0. The detached checkout had no `node_modules` before the prefix.
- Hosted-like prefix: the same command with `--mode hosted-like`, output `prefix-hosted-like-t13.json`, and run ID `130000002` exited 0. Its inherited sandbox-state path and command-file sentinels were checked without enabling sandbox qualification.
- `pnpm lint` passed; `pnpm typecheck` passed; `pnpm build` passed; `pnpm test:unit -- --reporter=verbose` passed 3 files / 24 tests; `pnpm test:security` passed 1 file / 4 tests.
- `node --check scripts/ch001-migration-command.mjs`, `node --check scripts/ch001-command-records.mjs`, `node --check scripts/ch001-migration-marker-observer.mjs`, and `git diff --check` passed.
- `node --import tsx scripts/verify-db-module-import.ts --negative-control` passed after build. The real workspace import resolved to `packages/db/dist/index.js`, exposed and closed the pool API without a database connection, and the isolated missing-link control exited nonzero with `ERR_MODULE_NOT_FOUND`. This is module-import evidence only, not database proof.

## Focused source regressions

- `node --test tests/ci/migration-regression-boundary.test.mjs` passed 5/5. It imports the production migration command adapter/builder and observer, asserts actual `-d` and `-U` arguments, rejects omitted/legacy wrong-database routing in empty-main and existing-main witnesses, checks cleanup/early-stop behavior, and keeps a frozen T12 source witness.
- `node --test tests/ci/migration-marker-observer.test.mjs` passed 5/5 and `node --test tests/ci/migration-first.test.mjs` passed 5/5.
- The unit verifier cases passed through the real serializer and validator: repeated identical command text with distinct invocation identities is accepted; duplicate/missing IDs, stale bindings, reused logs, missing evidence, and legacy duplicate-text cases are rejected; pass-then-fail and fail-then-pass required invocations remain blocking.

The retrievable nested source-bound command records are [`prefix-clean-t13.commands.log`](prefix-clean-t13.commands.log) and [`prefix-hosted-like-t13.commands.log`](prefix-hosted-like-t13.commands.log). The local coordinator's sanitized host command logs are under [`local-proof/artifacts/ch001r13/r13-local-20260915c/public/commands/`](local-proof/artifacts/ch001r13/r13-local-20260915c/public/commands/).

## Local coordinator

`CH001_RUN_ID=r13-local-20260915c CH001_EVIDENCE_ROOT=artifacts/ch001r13/r13-local-20260915c CH001_SANDBOX_OPT_IN=false pnpm proof:ch001` exited `2` with `BLOCKED_ENVIRONMENT`. Host lint, typecheck, build, post-build import, unit, and security commands passed. Docker version/info/Compose probes could not provide a usable daemon; loopback allocation returned `EPERM`; pinned Chromium was not executable. The coordinator recorded `4 PASS / 0 FAIL / 68 NOT_RUN`, with PostgreSQL observer, final-image migration, repeat, permission, worker, browser, application, and runtime cleanup stages `NOT_RUN`.

The command report uses `command_record_format=invocation-v2` and preserves distinct `invocationId` values, exact command text, actual exits/times, public log paths, and matching `child_invocations`. Private raw logs, environment files, credentials, cookies, auth storage, and excluded gate/proof/verifier manifests are not copied into the durable evidence tree.

## External-action boundary

No push, workflow dispatch, provider/publishing action, credential use, agent spawn, or historical T11/T12 job rerun occurred. No hosted run, job, artifact, migration result, or application acceptance identity exists for r13.
