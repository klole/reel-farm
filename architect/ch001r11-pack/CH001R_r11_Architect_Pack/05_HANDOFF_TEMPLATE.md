# CH-001R-r11 — Luna handoff template

This is a template. Fill it from execution; do not copy example/expected results as passes.

## Disposition

Choose exactly one:

**IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION** — the dependency fix and runnable image/database proof path exist; all source-ready checks passed; Docker/database results remain honestly NOT_RUN for a measured environment limitation.

**MIGRATION_RUNTIME_VERIFIED_AWAITING_ARCHITECT_REVIEW** — real candidate final-image fresh/schema/repeat/controlled-failure assertions passed, with diagnostics/cleanup evidence. State the separate bounded proof outcome, including any later worker/app failure.

**BLOCKED** — a required source check fails, scope/identity is wrong, a distinct runtime defect requires new authority, or usable evidence is absent. Describe the specific blocker. Do not relabel an observed runtime test failure as unavailable environment.

Always retain:

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
```

## Identities and delta

Starting commit/tree; P11; actual final T11/tree; E11/tree returned after commit; workflow definition/blob/file SHA-256; candidate lock SHA-256 before/after frozen install; comparison against T10. Explain the exact root workspace addition, lock delta, pin-guard exception and migration-first wiring. List changed execution paths and prove untouched frozen surfaces.

## Actual command results

For every required command supply execution environment, exact command, start/end, exit, report/log paths, source SHA, and assertion counts where applicable. Keep file-level and nested counts distinct. State what was not executed and why. No unseen local file is sufficient evidence: commit sanitized logs/receipts or supply a retrievable artifact.

## Module import versus migration

Record the real post-build import result and resolved path, plus negative control. This is not SQL proof.

For actual image runs supply image/container identities and the four database records: fresh, schema, repeat, and controlled failure. Bind all to T11. Include both CLI/container exits and inspected same-database/marker/sentinel observations. Null fields stay null when unavailable.

## Downstream proof and safety

Describe the furthest reached stage. Keep migration qualification separate from worker/browser readiness and full slideshow journey. Include diagnostics before deletion, cleanup exit/post-inventories, timeout/truncation facts, sanitized logs and final manifest. Do not claim network/sibling checks absent from the evidence.

## Evidence and state

Complete `r11-results.json` using the supplied template and cross-reference the original application ledger only if one was produced for this candidate. Preserve old records. Update the existing evidence indexes and states to awaiting review; do not grant acceptance.

## External actions

Separate actual package/network access, local Docker resource creation, host-policy changes (not authorized outside existing hosted flow), source commits, evidence commits, publication, and hosted request count. Luna's hosted request count is zero under this assignment. Return the explicit disposition and stop; do not start the next feature chapter.
