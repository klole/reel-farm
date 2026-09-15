# Source references and evidence boundaries

Reviewed repository: `klole/reel-farm`. T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f`; E11 `323947cba4197689f40c9084f38629244d58792f`; observed router-documentation head `a7c239c0164ff456448e11684c593153e6fa8240`. These references identify source, not executed application results.

- **S1** Luna handoff: `https://github.com/klole/reel-farm/blob/a7c239c0164ff456448e11684c593153e6fa8240/handoffs/CH-001R-r11.md`; router update: `https://github.com/klole/reel-farm/blob/a7c239c0164ff456448e11684c593153e6fa8240/handoffs/luna-ch001r11-router-pro-update.md`.
- **S2** Root manifest: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/package.json` (blob `a6bf145f4e0b8a8c496b23cfe24a5447ce3780be`).
- **S3** Real adapter: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/ch001-proof.ts` (blob `2e0e533d367bcd685a52ee25d3ddb24f41332df7`). Inspect `confirmFreshMarkerAbsent`, `runFailureControl`, `inspectMigrationContainer`, and `finalImageModuleImport`.
- **S4** Same source, `dockerStep`, `composeStep`, `redact`, and public log writing before inspection field selection.
- **S5** Controller and terminal predicates: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/ch001-migration-verification.mjs` (blob `51155d31ee88e03a9cb5dd0f510d6f270a96b473`).
- **S6** Existing fake-adapter tests: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/tests/ci/migration-first.test.mjs` (blob `7d66d975062e1dabedaaf9e018bc032c88729132`).
- **S7** Import verifier: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/verify-db-module-import.ts` (blob `e4c34feb1e78b3b17e1068ed9760613a87e3c43d`).
- **S8** Pin guard: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/ci/pin-scope.mjs` (blob `b9e23c39d3348bca0009b4c78c4b40fc14a36459`).
- **S9** Read-only API queries: `https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=323947cba4197689f40c9084f38629244d58792f&event=workflow_dispatch&per_page=100` and `https://api.github.com/repos/klole/reel-farm/actions/runs?event=workflow_dispatch&created=%3E%3D2026-09-15T10%3A39%3A29Z&per_page=100`. Both returned zero during review.
- **S10** E11 commit metadata: `https://api.github.com/repos/klole/reel-farm/git/commits/323947cba4197689f40c9084f38629244d58792f`. Comparison reads: `10db55ff1f942f3b1894699fea3180b69f4afe27...7d2a128432dd6922bee50fde94c9bd2b1bf5e49f` and `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f...a7c239c0164ff456448e11684c593153e6fa8240` under the repository compare API.

Primary PostgreSQL references checked during review:

- **P1** PostgreSQL 16 parser/transformation stages: `https://www.postgresql.org/docs/16/parser-stage.html`. Semantic analysis resolves referenced tables before statement execution.
- **P2** PostgreSQL 16 `to_regclass`: `https://www.postgresql.org/docs/16/functions-info.html`. A missing name returns null; that behavior applies to the lookup function, not to a different static table reference elsewhere in the query.
- **P3** PostgreSQL conditional expressions: `https://www.postgresql.org/docs/current/functions-conditional.html`. CASE runtime branch evaluation is not a general shield against earlier analysis/planning failures. The cited planning example is supporting context, not a substitute for the exact relation-resolution reasoning.

**DK1** Docker Engine container-inspection response schema: `https://docs.docker.com/reference/api/engine/version/v1.52/`. The official response sample places `Path` and `Args` at the top level, separately from `Config`. Container process fields must also be checked against the actual Docker inspection schema in the candidate test. The T11 code currently reads `Config.Path/Args`; the repair must distinguish top-level process fields from `Config.Cmd/Entrypoint` and retain selected non-secret facts only. This packet does not claim an actual T11 container inspection was executed.

Prior r11 packet: the attached `CH001R_r11_Architect_Pack.zip` / published P11 assignment. Its selected-inspection and dual-terminal-exit requirements remain in force. Historical T10/D1 run `34946892709` is contextual evidence only; it was not rerun or reclassified here.
