# Sources and review boundaries

Reviewed September 11, 2026. Repository sources below are commit-pinned. Symbols/operations in the review identify the relevant source locations; no fabricated runtime evidence is implied.

## Repository sources

- **S01 — Primary r2 handoff:** [`handoffs/CH-001R.md`](https://github.com/klole/reel-farm/blob/5a931feb01ed8da16eb9f0079a380c61f5459792/handoffs/CH-001R.md)
- **S02 — r2 evidence index:** [`docs/evidence/CH-001R-r2/README.md`](https://github.com/klole/reel-farm/blob/5a931feb01ed8da16eb9f0079a380c61f5459792/docs/evidence/CH-001R-r2/README.md)
- **S03 — Executed command and suite summaries:** [`docs/evidence/CH-001R-r2/command-report.json`](https://github.com/klole/reel-farm/blob/5a931feb01ed8da16eb9f0079a380c61f5459792/docs/evidence/CH-001R-r2/command-report.json)
- **S04 — Aggregate result:** [`docs/evidence/CH-001R-r2/verifier-result.json`](https://github.com/klole/reel-farm/blob/5a931feb01ed8da16eb9f0079a380c61f5459792/docs/evidence/CH-001R-r2/verifier-result.json)
- **S05 — Gate ledger, source PASS labels and open findings:** [`docs/evidence/CH-001R-r2/gate-results.json`](https://github.com/klole/reel-farm/blob/5a931feb01ed8da16eb9f0079a380c61f5459792/docs/evidence/CH-001R-r2/gate-results.json)
- **S06 — Real suite dispatch and prerequisite guards:** [`scripts/run-gated-check.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/scripts/run-gated-check.ts)
- **S07 — Compose smoke, nested E2E and lifecycle assertions:** [`scripts/ch001-compose-smoke.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/scripts/ch001-compose-smoke.ts)
- **S08 — Runtime Docker stage:** [`Dockerfile`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/Dockerfile)
- **S09 — Editor state and asset refresh:** [`apps/web/src/components/EditorView.tsx`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/apps/web/src/components/EditorView.tsx)
- **S10 — Evidence validation utilities:** [`scripts/ch001-harness.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/scripts/ch001-harness.ts)
- **S11 — Migration command ordering:** [`scripts/migrate.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/scripts/migrate.ts)
- **S12 — SQL including metadata-table creation:** [`migrations/0001_ch001.sql`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/migrations/0001_ch001.sql)
- **S13 — Database initialization client:** [`packages/db/src/client.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/packages/db/src/client.ts)
- **S14 — Compose service configuration:** [`compose.yaml`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/compose.yaml)
- **S15 — Real integration suite:** [`tests/integration/database.test.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/tests/integration/database.test.ts)
- **S16 — Vitest globals disabled:** [`vitest.config.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/vitest.config.ts)
- **S17 — Primary E2E journey and recording calls:** [`tests/e2e/primary-journey.spec.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/tests/e2e/primary-journey.spec.ts)
- **S18 — Conditional UI and shortened preview ID:** [`apps/web/src/components/EditorView.tsx`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/apps/web/src/components/EditorView.tsx)
- **S19 — Gate writer / path forwarding / record replacement:** [`tests/helpers/gates.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/tests/helpers/gates.ts)
- **S20 — EvidenceRef validation and completion mode:** [`scripts/ch001-harness.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/scripts/ch001-harness.ts)
- **S21 — Aggregate orchestration and gate ingestion:** [`scripts/verify-ch001.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/scripts/verify-ch001.ts)
- **S22 — Aggregate finding construction and validation call:** [`scripts/verify-ch001.ts`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/scripts/verify-ch001.ts)
- **S23 — Original gate template (blob identity verified):** [`architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json)
- **S24 — Original acceptance contract and canonical fixture:** [`architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md`](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md)

- **S25 — Repository metadata:** [GitHub repository API](https://api.github.com/repos/klole/reel-farm), read at review; reported public, default branch `main`. This metadata is time-dependent, unlike the code links.
- **S26 — Evidence commit identity:** [commit E](https://github.com/klole/reel-farm/commit/5a931feb01ed8da16eb9f0079a380c61f5459792), resolved from `5a931fe`, with parent `b516dab843be1b8870d3516185b52905982aec1f`.

## Official technical references

- **W01 — Standard hosted runners:** [GitHub-hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners). Supports the standard public-repository runner recommendation and VM label choice. Recheck costs/policies before switching repository visibility or runner class.
- **W02 — Browser installation and CI:** [Playwright CI](https://playwright.dev/docs/ci). Supports explicit browser/system-dependency installation and serial execution as a stable baseline.
- **W03 — Non-root browser/container setup:** [Playwright Docker](https://playwright.dev/docs/docker). Supports deliberate sandbox/security configuration; not proof of this repository's effective runtime.
- **W04 — Database/test network topology:** [GitHub PostgreSQL service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers). Distinguishes host versus container networking.
- **W05 — Workflow activation/dispatch:** [Manually running a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow). Supports `workflow_dispatch`, default-branch availability, and manual invocation.

## What was and was not verified

This review used connected GitHub reads of the named handoff/evidence and relevant bootstrap/test/coordinator/editor files. The local original gate-template bytes were recovered from the already-provided CH-001 packet; their Git blob hash matched S23 (`ff0f5df2888779d7226b3f79f1fd8c8bef8ce3a2`). That establishes the included gate reference, not application execution.

No full repository checkout or application execution was established in the review container: an attempted public clone failed DNS resolution. Repository access through the connected reader did work. No Docker/database/browser job or actual application regression was run by this architect; source-confirmed findings and runtime inferences are identified separately. No GitHub writes, Actions dispatch, paid resource creation, or provider call was performed.

The workflow blueprint is author-created guidance. Action major tags shown there are examples supported by current official CI documentation, not immutable pins or an executed workflow. Luna must resolve and record pinned revisions before activation. No framework/runtime version upgrade or license decision is silently authorized.
