# CH-001R-r13 evidence

Disposition: `IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION`.

This is the bounded Open Slideshow Studio v0.1.0 source repair for F13-01 and F13-02. It is not v0.2, full application acceptance, or a replacement for the original CH001-001 through CH001-072 contract. `application_acceptance=false`, accepted application version is `none`, and the root remains `awaiting_review`.

The r13 architect pack is P13 `34be09f3a211aae01582270708b565b4a7cce539` (tree `634a57f4d33b83e8884abd71fe797a126dedb14b`), directly based on canonical E12 `b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d` (tree `71ce94e0897a2c49edf1b9f7e372fcc85e68751d`). The implementation candidate is T13 `6e04b5a5eefe2ef464572da35c88338fa342f525` (tree `405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8`), directly based on P13. E13 is returned externally after the evidence commit and is intentionally not embedded in its own files.

## Repairs

- F13-01 requires explicit database and user targets in the local fixture setup adapter. Production command construction now carries the selected target into every maintenance, fixture-table/ACL, observer, denied-observer, and cleanup call. The dependency-free boundary regression uses database-aware fakes and rejects the old omitted-target `oss` route in both empty-main and existing-main witnesses.
- F13-02 preserves captured invocation identities in new command records. Repeated command text is retained when IDs, timestamps, exits, and logs are distinct; duplicate/missing/mixed IDs, stale bindings, reused logs, and missing evidence are rejected. Required-command validation checks every matching invocation, so an earlier or later failure remains blocking. Legacy duplicate-text behavior remains explicit.

## Source result

The pinned source matrix passed on Node `20.19.2`, pnpm `12.3.4`, and actionlint `1.7.7`. Frozen install, workflow validation, complete CI, both detached no-`node_modules` prefixes, lint, typecheck, build, unit, security, syntax, diff, and the real post-build `@oss/db` import/negative control are recorded in [`commands.md`](commands.md). Each source-bound prefix reports 10/10 CI modules and 85/85 nested cases.

## Runtime boundary

The current local coordinator run `r13-local-20260915c` exited `2` as `BLOCKED_ENVIRONMENT`. Docker/Compose was unavailable, loopback allocation returned `EPERM`, and the pinned Chromium executable was unavailable. PostgreSQL fixture regression, final-image migration/repeat/permission checks, cleanup, worker, browser, and application stages remain `NOT_RUN`; no SQLSTATE, image, container, marker, schema, or migration success is claimed. The sanitized public reports and report-referenced logs are reproduced under [`local-proof/`](local-proof/).

## Evidence inventory

- [`source-identity.json`](source-identity.json) — canonical E12/P13/T13 identities, workflow/lock bytes, and external-action ledger.
- [`scope-comparison.json`](scope-comparison.json) — exact ten-file implementation delta and frozen-surface hashes.
- [`r13-results.json`](r13-results.json) — complete R13-T01 through R13-T14 checklist: 9 PASS, 0 FAIL, 5 NOT_RUN.
- [`commands.md`](commands.md) — pinned source commands, prefix counts, local coordinator result, and limitations.
- [`prefix-clean-t13.json`](prefix-clean-t13.json) and [`prefix-hosted-like-t13.json`](prefix-hosted-like-t13.json) — detached source-bound records and adjacent sanitized reports/logs.
- [`local-proof/`](local-proof/) — copied sanitized public coordinator reports and every report-referenced public log; private raw captures and excluded gate/proof manifests are not published.
- [`handoffs/CH-001R-r13.md`](../../../handoffs/CH-001R-r13.md) — Luna/router handoff and router stop state.

No hosted workflow was dispatched, no push was made, no provider/publishing action occurred, no credentials were used, and no historical T12/T11 job was rerun. Router/architect review is required.
