# CH-001R-r2 evidence index

Target: `CH-001R-r2` / Open Slideshow Studio `v0.1.0`. Implementation commit T: `b516dab843be1b8870d3516185b52905982aec1f`. The evidence/handoff commit E is the containing commit of the handoff and this index; its exact SHA is returned with the handoff after commit creation. Root state remains `awaiting_review`; accepted application version remains unset.

## Fresh aggregate

Run ID: `r2-20260911-blocked`. The aggregate executed all nine required root commands and exited 1 because four live prerequisites were unavailable.

| Command group | Result |
|---|---|
| lint, strict typecheck, production build | 3 commands, exit 0 |
| unit and security | 2 commands, exit 0; 19 unit tests and 4 security tests passed |
| PostgreSQL integration | exit 2; `DATABASE_URL` was not configured; 0 discovered / 0 executed |
| authenticated browser E2E | exit 2; pinned Playwright Chromium was unavailable; 0 discovered / 0 executed |
| browser render corpus | exit 2; pinned Playwright Chromium was unavailable; 0 discovered / 0 executed |
| Compose smoke/restart | exit 2; Docker CLI was unavailable; 0 discovered / 0 executed |
| aggregate verifier | exit 1; 13 explicit validation issues, including the four unavailable suites and incomplete mandatory gates |

The exact timestamps, exit codes, and command logs are in [command-report.json](command-report.json) and `01-pnpm-lint.log` through `09-pnpm-test-smoke.log`. The measured capability record is [environment.json](environment.json); no credential or connection string is included.

## Gate ledger

[gate-results.json](gate-results.json) contains exactly the original 72 IDs and is bound to T. Fresh result: `4 PASS / 0 FAIL / 68 NOT_RUN`.

- `PASS`: `CH001-067`, `CH001-068`, `CH001-069`, `CH001-072`, each with the retrievable [source-review.md](source-review.md) E1 reference.
- `NOT_RUN`: `CH001-001` through `CH001-066`, plus `CH001-070` and `CH001-071`, because the required runtime, browser, lifecycle, visual/manual, artifact, or handoff proof was not produced on this host.
- `FAIL`: none. `NOT_RUN` is preserved as distinct from `FAIL`.

The historical [CH-001-r1 gate ledger](../CH-001/gate-results.json) is untouched at `0 PASS / 0 FAIL / 72 NOT_RUN`.

## Available evidence and limitations

- [artifact-manifest.json](artifact-manifest.json) hashes the fresh retrievable reports and logs.
- [verifier-result.json](verifier-result.json) records the fail-closed aggregate result and all 13 validation issues.
- [suite-integration.json](suite-integration.json), [suite-e2e.json](suite-e2e.json), [suite-render.json](suite-render.json), and [suite-smoke.json](suite-smoke.json) record explicit exit-2 prerequisite outcomes with zero discovered/executed assertions.
- No seven-slide application-exported ZIP, screenshots, final-preview JPEGs, preview/ZIP byte comparison, Compose lifecycle record, database run, worker render, or human visual/keyboard inspection is claimed. No placeholder artifact is promoted to a pass.
- Source/provenance inspection is [source-review.md](source-review.md). It records configuration and scope facts only; it is not runtime containment or export evidence.

All committed evidence uses repository source, generated/local fixtures, and synthetic names only. No provider, publishing, billing, social-account, public-deployment, release, or paid action occurred.
