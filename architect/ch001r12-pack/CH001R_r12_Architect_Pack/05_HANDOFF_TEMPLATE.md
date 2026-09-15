# CH-001R-r12 Luna / router handoff

## Status and identities

- Disposition: `<IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION | SOURCE_AND_LOCAL_RUNTIME_VERIFIED_READY_FOR_REVIEW | BLOCKED>`
- Actual starting commit/tree, P12 if present, final T12/tree, E12 returned after commit.
- Workflow blob/SHA-256 and candidate lock SHA-256.
- `application_acceptance=false`; accepted version `none`; root `awaiting_review`.

## Finding disposition

| Finding | Exact change | Actual supporting tests | Runtime limitation |
|---|---|---|---|
| F12-01 two absent-table probes | | | |
| F12-02 inspection projection/process identity | | | |
| F12-03 effective import/terminal verdict | | | |

## Verification

For every required command: full command, source SHA, Node/pnpm/tool version, environment class, exit, counts, and raw evidence path. Separate source/no-node_modules controls, installed real import, fake adapter tests, real PostgreSQL tests, final-image migrations, and hosted outcome. Use the provided JSON ledger; all unexecuted rows remain NOT_RUN.

Do not describe mock SQL results as a successful SQL regression. Do not describe an expected `42P01` as observed without a server log/result. Mark every missing report accurately rather than inventing it.

## Database/image results

Describe catalog presence and count observations; whether COUNT was skipped; fresh/repeat CLI and container exits; table/marker/sentinel results; restricted-role error/SQLSTATE; selected image/user/process facts; cleanup and manifest identity. If unavailable, record nulls and NOT_RUN reasons.

## Evidence inventory

Every listed path must be retrievable from the evidence commit or attached artifact. Provide hashes of sanitized logs/receipts. No future self-referential commit hash or manifest/receipt hash cycle.

## Scope and external actions

Record frozen-surface comparison and exact source files changed. Record registry access, local disposable runtime creation/removal, policy changes (normally none on editing host), source/evidence pushes, agent messages, and hosted requests separately. A local document is not an external send.

## Router-only completion

Actual definition/input/checkout identities; request count; run/attempt/job/artifact; captured bootstrap/proof classification; migration vs downstream result; original 72-gate counts; final evidence commit returned externally. If no request, use nulls. Then stop.
