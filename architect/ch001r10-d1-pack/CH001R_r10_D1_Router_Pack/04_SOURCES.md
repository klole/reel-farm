# Source references and review limits

All repository reads below are fixed to the reviewed commits except the explicitly identified branch/run-list observations. Remote observations were read during this review; no repository source was modified. Source links support the review, not future test results.

- **S1 — Publication identity.** GitHub `refs/heads/main` returned E10; Git commit metadata returned E10 tree and direct T10 parent. https://api.github.com/repos/klole/reel-farm/git/commits/f512c9c02620ea600404cd304782a37e6689a109
- **S2 — R10 handoff.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/handoffs/CH-001R-r10.md
- **S3 — Migration diagnosis.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/docs/evidence/CH-001R-r10/migration-diagnosis.json
- **S4 — R10 result ledger.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/docs/evidence/CH-001R-r10/r10-results.json
- **S5 — Existing router recipe, superseded operationally by D1.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/docs/evidence/CH-001R-r10/router-reproduction.md
- **S6 — Assignment actually published at P10.** https://github.com/klole/reel-farm/blob/df8ce7d938910949fef3840ac2c79ec9c388dc6a/architect/assignment-ch001r10-luna.md
- **S7 — Diagnostic helper at T10.** https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-compose-diagnostics.mjs
- **S8 — Coordinator and command runner at T10.** https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-proof.ts and https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-compose.ts
- **S9 — E10-only manual-run observation.** https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=f512c9c02620ea600404cd304782a37e6689a109&event=workflow_dispatch&per_page=100 — returned `total_count: 0`. Recheck before any router action; this is not a permanent dispatch lock.
- **S11 — Docker Compose ps.** https://docs.docker.com/reference/cli/docker/compose/ps/ — stopped-container selection, IDs output, and structured formatting. Current documentation describes JSON Lines; the procedure avoids string-emptiness assumptions for JSON.
- **S12 — Docker Compose up.** https://docs.docker.com/reference/cli/docker/compose/up/ — dependency startup, attached versus detached execution, service-exit selection, and readiness options.
- **S13 — Docker Compose run.** https://docs.docker.com/reference/cli/docker/compose/run/ — one-off service configuration, command overriding, no-deps, retained names, and optional removal.
- **S14 — Docker Compose down.** https://docs.docker.com/reference/cli/docker/compose/down/ — project teardown and explicit volume-removal behavior.
- **S15 — Docker Compose base command.** https://docs.docker.com/reference/cli/docker/compose/ — explicit project/config/env arguments and environment-variable precedence.
- **S16 — Docker container inspection.** https://docs.docker.com/reference/cli/docker/container/inspect/ — selected-field formatting for inspection rather than publishing unrestricted records.

## What the architect did not do

No Docker/Compose command, pnpm install, actionlint invocation, PostgreSQL migration, application test, browser qualification, GitHub write, artifact dispatch/download for a new T10 run, or external-agent send was performed during this D1 review. The reviewed handoff reports local results; they were not independently rerun here.

The packet contains a read-only review receipt and future instructions. It does not include new runtime evidence, a new application gate ledger, a historical ZIP revalidation claim, or a runnable application patch. Packet validation checks document structure and cross-file consistency only.
