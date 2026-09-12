# Luna/router handoff — CH-001R-r6

> TEMPLATE ONLY. Replace every placeholder with an actual value or null plus reason. Do not claim template rows were executed.

## State

Operational status: `REPLACE_WITH_ACTUAL_STATUS`.

Application acceptance: **false**. Root: `awaiting_review`. Accepted version: `none`. Target: `0.1.0`.

## Source identities

- Baseline: `6f600381c72bc68bc550e69ab0e86d522a81a389`.
- P6 / tree: `ACTUAL`.
- T6 implementation / tree / parent: `ACTUAL`.
- E6 evidence-only commit: returned externally as the commit containing this handoff.
- Workflow definition / blob / SHA-256: `ACTUAL_OR_NOT_YET_DISPATCHED`.
- Native/Node/pnpm/Playwright/lock hashes compared: `ACTUAL`.
- Working tree / preserved unrelated files: `ACTUAL`.

## Scoped changes

List exact execution-affecting files and why each is necessary for host sandbox qualification. Explicitly state whether application code, Dockerfile, Compose defaults, or original gates changed; explain any deviation instead of concealing it.

## Host qualification

- Context and opt-in guard: `ACTUAL`.
- Managed executable / hash / launch-site coverage: `ACTUAL`.
- Default probe: `ACTUAL_OR_NOT_RUN`.
- AppArmor enabled / restrictions / relevant denial: `ACTUAL_OR_NULL_WITH_REASON`.
- Profile installed / exact attachment / profile hash: `ACTUAL_OR_NONE`.
- Qualified probe requested/launched/observed: `ACTUAL`.
- Runtime diagnostic evidence: `ACTUAL_PATHS_OR_NONE`.
- Global policy before/after: `ACTUAL_OR_NOT_RUN`.
- Owned cleanup: `ACTUAL_OR_NOT_RUN`.
- Remaining uncertainty: `ACTUAL`.

## Commands and tests

| Command | Source commit/tree | Environment | Start/end UTC | Exit | Discovered/executed/passed/failed/skipped | Evidence |
|---|---|---|---|---:|---|---|
| ACTUAL | ACTUAL | ACTUAL | ACTUAL | ACTUAL | ACTUAL | ACTUAL |

Include old CI regressions, all R5 boundary cases, new r6 tests, lint, typecheck, build, unit, and security. Distinguish fixture/mock policy tests from actual privileged hosted policy work.

## Hosted outcome — router appends after dispatch

- Run / attempt / job: `null until real dispatch`.
- Requested implementation / actual checkout: `null until observed`.
- Bootstrap / provisioning / worker / proof / cleanup: `ACTUAL_OR_NOT_RUN`.
- Proof invoked: `ACTUAL_BOOLEAN`; proof exit: `null when not invoked`.
- Primary versus downstream errors: `ACTUAL`.
- Fresh 72-gate counts: `ACTUAL_OR_UNAVAILABLE`.
- Artifact ID / name / bytes / digest / expiry: `ACTUAL_OR_NULL`.
- Archive independently downloaded and verified: `ACTUAL`.
- Canonical ZIP, alternate ZIP, preview hashes, screenshots, lifecycle: `ACTUAL_FILES_OR_NOT_RUN`.
- Router artifact/receipt commit: `ACTUAL_OR_NULL`.

## Checklist and evidence

Link the actual `r6-results.json`, command logs, sandbox records, policy cleanup receipt, and evidence index. Preserve T5 records unchanged. Do not attach current-run claims to a historical artifact.

## External actions and stop

Record actual publication path and hosted dispatch count. State whether privileged policy work occurred and on which allowed host. Declare provider/account/publication/deployment/release activity; expected none.

Keep application acceptance false. Return to architect review with the exact outcome and stop.
