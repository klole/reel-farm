# CH-001R-r11 — Root workspace dependency repair and migration qualification

Packet revision: **r1**. Issued: **2026-09-15**. Project: Open Slideshow Studio, repository `klole/reel-farm`. Target application version: **0.1.0, not accepted**.

## Decision

**D1 obtained the missing final-image exception. Authorize a targeted Luna implementation, not another diagnostic-only loop.** The container cannot resolve `@oss/db` from `/app/scripts/migrate.ts`. The root manifest does not declare that local workspace package.

Add the existing `@oss/db` package to root runtime dependencies using `workspace:*`, generate only its local lockfile relationship with the pinned package manager, keep the existing import and SQL unchanged, and qualify real migration behavior. Update the existing pin-regression test narrowly so it permits this exact authorized relationship without permitting any dependency-version drift.

Also make migration qualification an early, independently reported part of the existing bounded proof. Fresh migration, schema inspection, and same-database repeat must run before worker/browser readiness can stop the journey. Keep the r10 ownership, diagnostic collection, redaction, and cleanup path intact.

## Dispatch this assignment

Give Luna MAX the entire packet and `LUNA_START_PROMPT.md`. Read `01_REVIEW_VERDICT.md`, implement `02_LUNA_ASSIGNMENT.md`, and execute `03_VERIFICATION_MATRIX.md`. The router then uses `04_ROUTER_HANDOFF.md`. Do not delegate execution to a nonexistent background session.

This packet replaces the D1 instruction to stop after gathering the exception **for new r11 candidate work only**. It does not reopen the consumed r10 dispatch allowance or authorize a replay of T10. Historical evidence remains immutable.

`05_HANDOFF_TEMPLATE.md` and `templates/r11-results.template.json` are handoff scaffolding, not actual test results. `evidence/` contains inspected historical observations only. The archive in that directory is the unchanged T10/D1 artifact, not a candidate result.

## Non-negotiable state

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
next_feature_chapter=NOT_AUTHORIZED
```

Do not run providers, AI, publishing, scheduling, analytics, billing, video, deployment, or release tasks. Do not relax host or worker sandboxing. Do not modify the original 72 acceptance gates. A successful migration or bounded proof is not full application acceptance.

No repository writes, application test execution, migrations, Docker commands, or workflow dispatches were performed by the architect while preparing this packet. Files generated here are review instructions and historical-artifact inspection records.
