# R11 verification matrix

This is an **18-case repair checklist**, not a replacement for the 72 original CH-001 application gates. These cases are definitions; no candidate result has been run by the architect.

## Source-ready versus runtime-qualified

Source-ready handoff requires PASS for R11-T01 through T08, T15, and T16, with concrete evidence. Runtime checks T09–T14 may be NOT_RUN only under the explicitly documented Docker-unavailable fallback. Router checks T17/T18 remain router-owned. Failing source-ready requirements cannot be bypassed by requesting a hosted run.

Migration runtime qualification requires actual T09–T13 results; T14 supplies safe diagnostics/cleanup. A fixture expected to fail passes its *negative-control test* only when the actual nonzero exit/error/no-false-marker assertions pass. Its migration operation remains a deliberate failure, not a successful fresh migration.

A successful migration is not a successful bounded proof, and neither independently accepts v0.1. Never replace an unavailable result with source inspection.

## Cases

### R11-T01 — Historical baseline and source identity

Evidence class/owner: **source**.

Match D1 archive digest, exact T10 exception and final-image identity, actual starting ancestry, and unaccepted state. No historical rerun is required.

### R11-T02 — Exact root runtime dependency

Evidence class/owner: **source**.

Root dependencies includes exactly @oss/db=workspace:*; other manifest fields/scripts and workspace package definitions are unchanged.

### R11-T03 — Narrow lockfile delta and frozen install

Evidence class/owner: **source**.

Only the application root importer local link changes; all other YAML documents, registry entries, snapshots and native pnpm metadata remain identical. The candidate frozen install leaves its new lock hash unchanged.

### R11-T04 — Pin guard positive and negative cases

Evidence class/owner: **source**.

Existing R7-T11 recognizes the exact allowance; wrong/missing/new relationships and unrelated dependency, integrity, native metadata and runtime-pin edits fail. Original T6 workflow-context negative test remains.

### R11-T05 — Real post-build dependency import and negative control

Evidence class/owner: **source**.

Pinned Node/tsx, real built @oss/db, clean installed tree, correct scripts/root resolution, bounded import with pool closure; missing-root-link control fails. No database or Vitest alias used; record MODULE_IMPORT_PASS_NOT_DATABASE_PROOF.

### R11-T06 — Clean and hosted-like pre-install rehearsals

Evidence class/owner: **source**.

Actual current bootstrap/workflow CI prefix passes in both no-node_modules source trees; exact child environments; parent command-file sentinels unchanged; all file and nested cases accounted for.

### R11-T07 — Existing project and workflow checks

Evidence class/owner: **source**.

Pinned actionlint, full CI tests, lint, typecheck, build, unit, security, syntax and diff checks pass against final T11. Report all commands and counts.

### R11-T08 — Migration-first control-flow regressions

Evidence class/owner: **source**.

Actual extracted helper/coordinator boundary is tested for order, worker unavailable after migration pass, first/repeat/schema failure, unknown exit, log failure and teardown failure. Fakes are labeled control-flow evidence only; tests use no live DB before install.

### R11-T09 — Shipped-image identity and invocation

Evidence class/owner: **runtime**.

Actual final Docker image from T11; effective non-root user, /app directory, unmodified migration command, no source/node_modules masking mount, and image-bound container observations.

### R11-T10 — Fresh migration terminal success

Evidence class/owner: **runtime**.

Proven fresh owned database; normal shipped entrypoint finishes; both CLI and container terminal exit are 0 with no timeout. No manually applied app DDL.

### R11-T11 — Real schema and completion marker

Evidence class/owner: **runtime**.

Expected tables/keys/constraints from unchanged SQL, exactly one 0001_ch001 marker and its time, measured schema facts, same source/image/database bindings.

### R11-T12 — Same-database repeat preserves state

Evidence class/owner: **runtime**.

Same image and volume/database, second invocation exits 0, already-applied response, one unchanged marker, schema invariants and synthetic sentinel preserved. No database reset between invocations.

### R11-T13 — Real controlled failure stays a failure

Evidence class/owner: **runtime**.

Separate disposable restricted-role/database fixture runs the unmodified entrypoint; actual SQL/permission failure is captured with nonzero terminal exit and no false completion mark. Fixture setup/cleanup is identified.

### R11-T14 — Scoped runtime diagnostics and teardown

Evidence class/owner: **runtime**.

Useful pre-deletion logs/state include any retained one-offs; run-owned cleanup exits and post-inventories are recorded; no global cleanup. Completed migration evidence survives any downstream worker failure.

### R11-T15 — Evidence/report regression checks

Evidence class/owner: **source**.

Reports reject zero/missing assertions, fake PASS on unavailable runtime, stale identity, corrupted hash and unknown exits. Migration receipt persists before worker readiness; public payload sealing follows diagnostics/cleanup without circular hashes.

### R11-T16 — Scope/state and durable handoff

Evidence class/owner: **source**.

Allowlisted source changes only; working workflow/sandbox/runtime pins and original gates unchanged; durable logs/results/source comparisons; acceptance false, version none, awaiting review. All unrun runtime cases explicitly remain NOT_RUN.

### R11-T17 — Router publication identity checks

Evidence class/owner: **router**.

Actual P11/T11/E11 ancestry, E11 evidence-only delta, clean publication tree, exact workflow bytes and actionlint result, unique input SHA and request-history review.

### R11-T18 — One fresh hosted observation or explicit no-request receipt

Evidence class/owner: **router**.

At most one newly elected T11 request; capture the actual result/artifact/inner failures and runtime cases. Zero requests is recorded honestly when not elected; it is not a hosted PASS.

## Minimum report fields

Every result includes case ID, PASS/FAIL/NOT_RUN, evidence class (source, actual host import, control-flow fixture, actual image/database, or router), exact command/test name, exit where available, T11 SHA/tree, and at least one retrievable evidence reference. Missing tests have null exit and a reason, not an invented zero.

Each actual migration record carries source/image/container/database identity, start/end times, command, working directory/user, CLI exit, inspected terminal container exit, timeout/truncation facts, error class/SQLSTATE when applicable, and redacted log references. Schema/repeat assertions carry actual query observations. Never publish credentials or generic full environment dumps.

Prefer extending existing assertion/reporting helpers. `migration-verification.json` is a small additive receipt, not another framework. The existing proof must consume its measured result and remain nonzero if a required migration assertion or cleanup fails.
