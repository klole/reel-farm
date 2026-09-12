# Architect review — CH-001R-r2 submission

**Decision: continue blocked for v0.1 acceptance; authorize the bounded CH-001R-r3 assignment in this packet.**

## 1. Evidence and identity

Reviewed code: `b516dab843be1b8870d3516185b52905982aec1f`. Reviewed handoff/evidence: `5a931feb01ed8da16eb9f0079a380c61f5459792`. GitHub resolves the supplied abbreviated evidence commit to that full SHA and reports T as its parent. The supplied prior range begins at `c05ac9c8753fc4237188f9f8b5c5b7250a5fce78`. References are in [Sources](07_SOURCES.md).

The primary handoff, evidence README, command report, verifier report, and gate-ledger tail agree on the submitted condition: 19 reported unit tests and 4 reported security tests passed; lint, typecheck, and build report exit 0; integration, E2E, render, and smoke report exit 2 without discovered/executed tests; the aggregate reports exit 1. The ledger records four E1/source-only passes—CH001-067, 068, 069, 072—and 68 NOT_RUN entries. [S01–S05]

These are **reported executed results from Luna**, not tests rerun by this architect. The four source-only labels are preserved as historical results, not independently expanded into runtime assurance or blanket acceptance of provenance/security. Specific source claims still need matching inspections before eventual acceptance.

No seven-slide export or screenshots are claimed. No application version is accepted. The original CH-001 result of 0/0/72 and this r2 result of 4/0/68 must remain in their historical locations.

## 2. Real progress worth keeping

This is no longer the earlier placeholder-only implementation. The suite runner invokes Vitest and Playwright and writes explicit reports. The Dockerfile now installs browser operating-system libraries in the final stage and uses the existing non-root `node` account. The editor's upload callback refreshes assets instead of reloading the entire draft. The verification utilities now validate gate IDs, evidence paths, and hashes. [S06–S10]

Keep those improvements. Do not restart the application or replace the stack. Also do not interpret source changes as proof of their live behavior. This review is focused on bootstrap, testing, and evidence flow; it is not an exhaustive security or application audit.

## 3. Why a capable machine is necessary but not sufficient

The next runner needs a reachable disposable PostgreSQL database, the pinned Playwright browser, and a working Docker daemon with Compose. However, source inspection finds defects that are independent of those missing tools. A plain rerun on a better host would still encounter avoidable failures.

### U01 — Fresh migration queries a table before creating it

**Classification:** source-confirmed bootstrap ordering defect; runtime reproduction still required.

`scripts/migrate.ts` performs `SELECT id FROM schema_migrations` before executing the SQL migration. The `CREATE TABLE IF NOT EXISTS schema_migrations` statement is at the end of that migration. The inspected database client does not initialize the table, and Compose runs the migration command against a fresh PostgreSQL volume. [S11–S14]

**Consequence:** on the documented empty-database route, the metadata table does not yet exist when queried. An already-initialized developer database would hide the problem.

**Required repair:** initialize migration metadata before reading it, serialize migration startup, and make schema application plus its recorded completion atomic where supported. Preserve existing databases. Add a real empty-database run followed by a second invocation; do not fix this by manually creating the table outside the documented installer or by resetting user volumes.

**Original gates:** CH001-001, 002, 063.

### U02 — Integration suite uses an unimported lifecycle hook

**Classification:** source-confirmed test-collection defect.

`tests/integration/database.test.ts` imports `describe`, `expect`, and `it` from Vitest but calls `afterAll(...)`. `vitest.config.ts` sets `globals: false`. [S15–S16]

**Required repair:** explicitly import the lifecycle hook and ensure test files are included in an appropriate strict test-typecheck. Keep globals disabled unless a separately justified existing convention requires otherwise. Run real discovery/collection and execution with the database available. A prerequisite guard returning before test loading does not verify the test source.

**Original gates:** CH001-062, 063; affects the integration command generally.

### U03 — Primary E2E test disagrees with the rendered UI

**Classification:** source-confirmed test/UI contract mismatches; observed browser results remain outstanding.

`fillSelectedSlide()` leaves the body block selected. The test then tries to access `#asset-upload`, `.asset-choice`, and the `Headline` field. In the editor, upload/asset controls are conditional on an image block being selected; the one text field is labeled according to the selected text block. [S17–S18]

The test also extracts the request identity from the visible preview label. The editor displays only `requestId.slice(0, 8)`. Using that short label as the full API identifier cannot establish the intended preview-byte comparison. [S17–S18]

The test's layout array uses Statement for slide 3, while the original canonical demonstration specifies Photo caption; the test does not explicitly set the final CTA role. These mismatches should not be called the exact canonical fixture. [S17, S24]

**Required repair:** use the actual user-visible block-selection flow; make the unsaved-edit/upload regression deterministic with controlled response timing; read the full request ID from the real creation response, final image/export URL, or a stable semantic attribute. Do not alter the UI to keep every inactive control mounted merely to satisfy incorrect tests. Use the original seven slide layouts/roles/copy. Verify crop persistence and output dimensions rather than only recording them.

**Original gates:** CH001-017, 031–038 as actually exercised, 051–054, 059.

### U04 — Evidence writers supply paths their validator rejects

**Classification:** source-confirmed helper incompatibility.

The E2E uses paths built with `resolve(...)`. `recordGateEvidence()` forwards them unchanged into `makeEvidenceRef()`, while `makeEvidenceRef()` rejects absolute paths. A successful journey can therefore fail while recording its results. [S17, S19–S20]

The gate writer also replaces each existing gate record rather than merging separate evidence contributions. Multiple kinds—automated, source, and visual review—can overwrite one another. Shared read/modify/write JSON also needs a single writer or safe serialization. [S19]

**Required repair:** convert verified in-repository file paths to repository-relative paths at one well-defined boundary; reject escape/symlink targets. Collect append-only, per-suite evidence and merge centrally, or serialize a single writer. Preserve all applicable evidence kinds, case identities, statuses, and failure information. Regression-test inside/outside-root paths, duplicate contributions, and independent suite writes.

**Original gates:** CH001-051–054, 062, 069–071; all reported gates depend on trustworthy evidence handling.

### U05 — Suites do not share one owned execution lifecycle

**Classification:** source-confirmed orchestration gap.

The aggregate runs integration and E2E before smoke. They require an externally configured database and base URL. Smoke later creates its own Compose stack and synthetic owner, runs nested E2E, then destroys that stack. Those child environment variables do not configure earlier aggregate commands. Smoke also silently defaults `BROWSER_EXECUTABLE_PATH` to `/usr/bin/google-chrome`, which is inconsistent with the intended pinned-browser route. Shared report paths can let nested E2E replace a prior report. [S06–S07, S21]

**Required repair:** one coordinator owns setup, environment, suite order, reports, and teardown. Expose integration access through a test-only runner on the internal network, or a separately named disposable test database; do not publish the normal product database. Remove the implicit system-Chrome fallback. Use unique per-suite/per-invocation report paths. Match host and worker browser provenance deliberately.

**Original gates:** CH001-001–006, 050, 062–063.

### U06 — Partial evidence is not yet a sound full-acceptance result

**Classification:** source-confirmed verifier limitations.

The aggregate only preserves incoming gate records when their status is PASS; other statuses become generic NOT_RUN. It constructs R01–R11 as OPEN and validates with `requireCompleted: false`. The validator compares asserted implementation SHA strings but does not itself establish that the executed checkout/tree or every suite run identity matches. Required live-artifact absence is reported but should be enforced by the appropriate acceptance mode. [S20–S22]

**Required repair now:** preserve genuine FAIL results and distinguish incomplete from malformed evidence. Bind the run to actual Git HEAD, a clean application/test tree, unique run ID, and exact report/artifact hashes. Separate a **limited live-proof result** from the **unchanged full 72-gate acceptance result**. Open findings and missing evidence must prevent full acceptance. Do not fabricate closure or derive gate passes from overall suite success.

**Further closure:** before full acceptance, add adversarial reporter/verifier cases for stale same-commit runs, mismatched suite identities/counts, missing required outputs, incomplete manual evidence, and unknown/duplicate gate input.

**Original gates:** CH001-062, 069–072.

### U07 — Health after restart is not persistence or recovery proof

**Classification:** source-confirmed coverage limitation.

Smoke stops/starts the worker and recreates containers, but its post-action assertions poll `/api/health/live`. It does not compare the same saved project, revision IDs, accepted-image hashes, or ready ZIP across those operations. The integration transaction test uses direct SQL inserts, which verify a constructed database transaction, not the production `requestRender` behavior. [S07, S15]

**Required next proof:** preserve an identity/hash snapshot from the real UI-created project; verify the same data and ready download after worker stop and container recreation. For the worker-down part, check authenticated readiness and that a newly requested render waits then progresses when the worker returns. Do not credit crash fencing, stale leases, authorization, or application-level transaction behavior from these simpler checks.

**Original gates:** CH001-005–006, 058, 063. Full recovery/transaction closure remains later in CH-001.

### U08 — Broad acceptance coverage is still unfinished

**Classification:** documented coverage gap, not a new product requirement.

The inspected E2E is one main journey. The integration file contains three tests (schema presence, constructed SQL transaction/uniqueness, and local storage); the smoke script covers a limited lifecycle. These are useful starts, not evidence for every original security, save-race, timeout, crash, and recovery scenario. Some gate recording is also narrower than the assertions needed by the original gate. [S07, S15, S17, S24]

**Required next proof:** produce an honest gate-to-test map and stop after the bounded live milestone. Mark a gate PASS only when its entire original requirement and required evidence types are covered. Keep unsupported requirements NOT_RUN with specific gaps. Do not write dozens of ceremonial test labels or make one passing test stand in for the entire contract.

## 4. Architect adjustment to the execution sequence

The earlier repair combined three large tasks: repairing application code, inventing the full test harness, and qualifying an unavailable runtime. That made it too easy to return another blocked report without ever booting the product.

CH-001R-r3 now focuses on a smaller observable target:

**Capable runner → clean migration → owner login → seven-slide UI journey → real worker render → ZIP/hash proof → basic same-data restart → evidence export.**

This is a sequencing correction, not a reduction in eventual quality. Broader fault-injection/security/visual closure remains mandatory under CH-001 and will be assigned after this live proof is reviewed. No next-feature chapter is authorized.

## 5. Current verdict and limitations

- v0.1 acceptance: **not granted**.
- r2 handoff status: **BLOCKED remains accurate**.
- Environment-only explanation: **insufficient**, because U01–U06 include source-level blockers/gaps.
- Permitted next action: **CH-001R-r3 only**, as defined in this packet.
- Reviewer execution: **no app tests, browser renders, database operations, or Compose lifecycle executed**.
- Repository writes, CI dispatch, provider calls, public deployment: **none**.

The findings are source review, not newly executed FAIL entries in Luna's historical ledger. Preserve that distinction.
