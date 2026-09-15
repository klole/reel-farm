# CH-001R-r12 evidence

Disposition: `IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION`.

T12 is [`cc9da96079fc681ce162a99bd4e3df21f05cb382`](source-identity.json), tree `ef10ce662f60c42f0c566c0d13cf0c698710ccd9`. The evidence/state commit SHA is returned externally after commit and is intentionally not embedded in its own files. Application acceptance remains `false`; accepted application version is `none`; root state is `awaiting_review`.

The bounded repair fixes both absent-table probes through one shared read-only presence-then-count observer, projects container facts before public logging, uses actual top-level process identity, and computes one persisted/returned effective final-image import verdict. Build and database-start checks remain CLI-only; strict migration terminal checks require inspected exited containers. A real PostgreSQL observer regression is wired for the capable installed path but was not run on this host.

## Evidence index

- [`source-identity.json`](source-identity.json) — T12 identity, ancestry, workflow/lock bytes, and external-action ledger.
- [`scope-comparison.json`](scope-comparison.json) — exact T12 file delta and frozen-surface hashes.
- [`r12-results.json`](r12-results.json) — complete R12-T01 through R12-T18 checklist: 12 PASS, 0 FAIL, 6 NOT_RUN.
- [`commands.md`](commands.md) — full source/local command record and limitations.
- [`prefix-clean-t12.json`](prefix-clean-t12.json) and [`prefix-hosted-like-t12.json`](prefix-hosted-like-t12.json) — clean and hosted-like source-bound CI records, both 9/9 and 80/80.
- [`local-proof`](local-proof/artifacts/ch001r12/r12-local-20260915c/public/) — committed sanitized coordinator reports and every report-referenced public log from the blocked local run.
- [`handoffs/CH-001R-r12.md`](../../../handoffs/CH-001R-r12.md) — Luna/router handoff.

## Runtime boundary

The local proof was deliberately not converted into migration success. Docker/Compose was unavailable, loopback allocation returned `EPERM`, and pinned Chromium was unavailable. Consequently final-image import, PostgreSQL fixtures, migration exits, schema/marker/sentinel observations, permission failure, live cleanup, and worker/application proof are `NOT_RUN`. No hosted workflow was dispatched by Luna; router/architect review is required before any later single fresh T12 request.

The public coordinator evidence is sanitized. Private raw captures, environment files, credentials, cookies, auth storage, and excluded gate/proof manifests are not included. The report-relative paths remain retrievable below `local-proof/artifacts/...`.
