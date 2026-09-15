# Architect review — T13/E13 source publication

## Disposition

**SOURCE REVIEW SUFFICIENT FOR ONE CONTROLLED HOSTED VERIFICATION.**

This is not full acceptance of CH-001, not a claim that all r13 runtime requirements passed, and not certification that the application has no defects. The decision is narrowly that the two previously identified source blockers have been corrected sufficiently to use the already reserved hosted verification request. The first actual hosted outcome must return to the architect. [S1–S8]

## F13-01 — Explicit fixture database routing

The new Node-builtins-only command builder requires a nonempty database and user and puts them into separate `psql -d` and `-U` arguments. Its adapter requires the database argument. The existing main-path wrapper retains its `oss` default, while the marker-regression-local `runSetup` now requires both target strings explicitly. This distinction is intentional; the review did not mistake the main wrapper's preserved default for the fixture-local requirement. [S2, S3]

The actual table/schema privilege call now passes `fixtureDatabase, "oss"`. Role creation, database creation, connection grants, and cleanup run against the maintenance database. Fixture table creation, positive-row insertion, observer reads, and the denied-user check use the fixture database. This removes the reviewed accidental main-database ACL target without moving the main migration earlier or pre-creating its metadata. [S3]

The focused test source imports the real builder/adapter, observes `-d`/`-U`, tests omitted targets, demonstrates the wrong-database witness under both absent and existing main-table conditions, and retains a frozen T12 call-site witness. These are source-boundary tests with fakes; no successful PostgreSQL fixture is inferred from them. [S4]

**Disposition:** source correction supported; real fixture behavior and cleanup still require the fresh hosted run.

## F13-02 — Invocation-preserving evidence

The serializer retains the captured `invocationId`, exact command text, exits, timestamps, and distinct public log paths. It produces corresponding child-invocation records with run and implementation bindings. Finalization uses this serializer for both `command-report.json` and the evidence package supplied to validation. It does not deduplicate repeated SQL or alter the command text to make it appear unique. [S5, S6]

For r13, the validator requires the explicit `invocation-v2` format and checks invocation uniqueness, retrievable in-repository evidence, matching child records, run/implementation bindings, and duplicate log paths. Required-command validation evaluates every matching invocation, so an earlier or later successful invocation cannot conceal a failed one. Older report formats retain explicit legacy duplicate-text handling. The original application gate contract remains separate and strict. [S7]

The unit-test source exercises a complete synthetic evidence package with legitimate repeated command text, malformed identity/evidence cases, and both pass-then-fail and fail-then-pass required-command sequences. Source review supports the implementation; full execution of that repository suite was not repeated by the architect. [S8]

**Disposition:** source correction supported; repeated real database-query evidence and the final hosted manifest still require runtime inspection.

## Reported checks versus independently observed checks

Luna reports pinned Node 20.19.2 / pnpm 12.3.4 source qualification, actionlint 1.7.7, clean and hosted-like prefixes with 10 file-level modules and 85 nested cases, unit 24/24, security 4/4, and the real post-build DB-package import. The repair ledger is 9 PASS / 0 FAIL / 5 NOT_RUN. Local proof remains environment-blocked, with original application counts 4 PASS / 0 FAIL / 68 NOT_RUN. These remain Luna's reported local results, not fresh architect test results. [S1, S13, S14]

The architect independently inspected the two source fixes and their wiring/tests, commit parentage, changed-file comparisons, matching workflow blobs at T13/E13, and manual-run history. The query for manual runs created at or after 2026-09-15T10:39:29Z returned zero records during review. This is point-in-time evidence, not a lock on other actors and not proof that an unknown network request cannot be in flight. [S9–S12, S15, S16]

Additionally, two dependency-free T13 modules were copied into the review sandbox and independently matched to their Git blob identities before execution. Six isolated checks ran on **Node 22.16.0**, covering argument routing and serialization. All six passed. They used no database, Docker, application, or network, and they did not run the full TypeScript validator. They are supplemental checks, not the pinned repository suite or acceptance gates. See `evidence/source-copy-integrity.json`, `evidence/isolated-boundaries.tap`, and the included test-source text.

## Evidence precision note — not a dispatch blocker

The handoff says its local report retains actual repeated command text. The inspected local command array has nine entries with distinct command strings. It establishes the new record format and captured identities; repeat acceptance is currently demonstrated by the synthetic unit cases, not by a live local repeated-query journey. Preserve the historical handoff and carry this clarification into the router receipt rather than fabricating duplicate executions or starting another implementation chapter. [S1, S8, S17]

## Preserved boundaries

The implementation comparison does not modify package/lock, migration entrypoint/SQL, Dockerfile, Compose configuration, workflow, worker, or sandbox source. Retain all earlier package-resolution, observer, projection, verdict, and cleanup repairs. There is no authorization for AI/provider integrations, publishing, scheduling, analytics, billing, video, release/deployment, or v0.2 work. [S10, S12, S18]

No local PostgreSQL, migration, Docker stack, Chromium, full application test suite, or hosted job was run by the architect. A read-only local clone attempt failed on DNS; connected GitHub reads supplied the repository evidence. No repository write or workflow submission was made.
