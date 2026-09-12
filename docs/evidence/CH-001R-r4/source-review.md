# CH-001R-r4 source and local repair review

Evidence type: T4 implementation and local helper/preflight evidence. No hosted workflow execution or application acceptance claim.

## Source identity

- Packet P4: `a86c3ace9ad8bf1ec941565ce7dbc4e4d734b4e2`, parent of T4.
- T4: `69b784526260e3e5acf133da8d1a2fb33447d20f`; tree `55fdf4fc16f1d07498f6fb447cddc64e5261be2c`.
- T4 workflow blob: `65f1ae428e925b4747fea03f6c228a8af4acf15b`; workflow file SHA-256 `e41c6ce267c8dacfe759f83c873c0f53ebca90e2c56f19e6d17202267b06b896`.
- T4 has no application source, schema, package-version, lockfile, or provider changes. The source diff from P4 is limited to the seven files listed in the handoff.

## Repair observations

- Actions no longer enables Corepack or calls an unqualified pnpm. It invokes the dependency-free native bootstrap, prepends the verified bin directory for the current shell, writes the same directory to `GITHUB_PATH`, refreshes command lookup, and verifies `command -v pnpm`, the absolute resolved path, pnpm `12.3.4`, and Node.
- Docker build and runtime use the same helper and checked-in manifest. The final image copies the owned `/opt/pnpm` installation, keeps it on PATH, retains the non-root `node` user, and executes the version probe with `RUN --network=none`.
- Archive digest verification precedes tar listing, extraction, and native execution. The inspected archive's regular `pnpm` member, `dist/` runtime directory, and safe hardlinks are supported; traversal, absolute/empty/non-normalized names, symlinks, special files, unexpected members, and unpinned digests fail closed.
- The outer CI result is separate from the r3 `proof-result.json`. It records stage exits, identities, nullable proof exit, artifact transport, sanitized logs, and final classification. A missing proof is never coerced to exit 2, and summary formatting cannot overwrite an earlier primary failure.
- Workflow publication and manual dispatch remain router-only. No credentials, provider operations, publishing, scheduling, releases, or v0.2 changes occurred.

## Local checks

The focused Node test suite, lint, strict typecheck, build, 20 unit tests, and 4 security/scope tests exited `0`. A real native archive bootstrap, GITHUB_PATH/path-order/version check, idempotent repeat, and native `pnpm install --frozen-lockfile` also exited `0` with an unchanged lockfile and clean tracked tree. Docker build/runtime, managed browser installation, and hosted artifact retrieval were unavailable on this host.
