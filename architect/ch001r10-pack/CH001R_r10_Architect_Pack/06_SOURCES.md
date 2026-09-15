# Sources and interpretation boundaries

## Repository and hosted evidence

Every repository reference below is pinned to the reviewed revision rather than current mutable `main`. These are primary implementation sources, not claims of runtime success.

| ID | Source | Supports |
|---|---|---|
| S01 | https://github.com/klole/reel-farm/blob/0f222800f1e91a18cc2f16824a87c9513cd29026/handoffs/CH-001R-r9.md | T9 scope, local results as reported by Luna, identity, pending router work at handoff time. |
| S02 | https://github.com/klole/reel-farm/actions/runs/34937329430 | Settled manual hosted run, not a rerun of an older failure. |
| S03 | https://api.github.com/repos/klole/reel-farm/actions/runs/34937329430/artifacts | API artifact identity/size/digest. The independently downloaded unchanged ZIP is included. |
| S04 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/scripts/ch001-proof.ts | `composeJourney` success flag and early return; `cleanup` guard/private log; finalize-before-cleanup ordering. |
| S05 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/scripts/ch001-compose.ts | Scoped command construction and existing command helper. |
| S06 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/compose.yaml | Database health dependency, migration command, web/worker successful-migration dependencies, worker isolation. |
| S07 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/scripts/migrate.ts | Bare `@oss/db` import, SQL-file load, transaction/advisory lock, metadata recording. Not the missing hosted stack trace. |
| S08 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/package.json | Root migration invocation and declared dependencies/tool pins. |
| S09 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/packages/db/package.json | Existing workspace package and built exports. |
| S10 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/tsconfig.json | Root references; no path mappings or extends in the inspected file. |
| S11 | https://github.com/klole/reel-farm/blob/6014a247b124a186a1abfcb6d65a7ef024cf8cfc/migrations/0001_ch001.sql | Existing schema and constraints; preserve rather than speculate about a SQL defect. |
| S12 | https://api.github.com/repos/klole/reel-farm/git/commits/0f222800f1e91a18cc2f16824a87c9513cd29026 | E9 tree and direct T9 parent. |

## Primary technical references

**D01 — Compose startup dependency semantics**
https://docs.docker.com/compose/how-tos/startup-order/

`service_healthy` waits for the dependency health check; `service_completed_successfully` requires successful completion before dependent services start. This supports preserving, not weakening, the migration gate.

**D02 — Stopped-container diagnostics**
https://docs.docker.com/reference/cli/docker/compose/ps/

Include `--all` when diagnosing an exited service. Default output excludes stopped containers. Record the actual supported JSON shape rather than assuming a parser result from a different Compose version.

**D03 — Bounded service logs**
https://docs.docker.com/reference/cli/docker/compose/logs/

Use service selection, `--no-color`, `--timestamps`, and a bounded `--tail`; do not use an indefinite follow stream in failure finalization.

**D04 — Teardown scope**
https://docs.docker.com/reference/cli/docker/compose/down/

Volume removal is destructive. The proposed test teardown uses only explicitly verified disposable resources belonging to the unique proof project. Never substitute host-wide pruning.

**D05 — Pinned Node ESM resolution reference**
https://r2.nodejs.org/docs/v20.19.2/api/esm.html

Bare package resolution and explicit relative imports are different mechanisms. This provides context for investigating `@oss/db`; it does not prove the actual container exception or all behavior of the repository's TypeScript loader.

## Independent inspection vs application testing

The attached inspection verified archive bytes and the reports they contain. It did not reproduce migration, run Docker, rerun actionlint or the application suites, or dispatch a workflow. Host sandbox observations are interpreted from the real T9 report; renderer-process-specific enumeration was unavailable and worker qualification was not reached. The remaining missing migration stderr is a material evidence gap.
