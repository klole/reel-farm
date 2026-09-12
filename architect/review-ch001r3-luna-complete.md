# CH-001R-r3 — Complete architect follow-up and Luna assignment

This is a reading copy of the repository-ready packet. No application tests were run by the packet author. The standalone workflow blueprint and machine-readable original gate template are in the ZIP.

---

<a id="document-1"></a>

## Document 1: `README.md`

# CH-001R-r3 — Runner bootstrap and first live proof

**For Kyle and Luna MAX.** Prepared September 11, 2026. This is the next bounded assignment, not an application acceptance or release.

| Control | Value |
|---|---|
| Project | Open Slideshow Studio, repository `klole/reel-farm` |
| Reviewed implementation T | `b516dab843be1b8870d3516185b52905982aec1f` |
| Reviewed evidence E | `5a931feb01ed8da16eb9f0079a380c61f5459792` |
| Prior repair starting commit | `c05ac9c8753fc4237188f9f8b5c5b7250a5fce78` |
| Submitted result | `BLOCKED`; 4 reported source-only PASS / 0 FAIL / 68 NOT_RUN |
| Parent application contract | CH-001-r1, target v0.1.0, 72 original gates |
| New assignment | CH-001R-r3: runner bootstrap + first live proof |
| Accepted application version | None |
| Review method | Connected GitHub reads at identified commits; no application execution by this packet's author |

## Read this first

Do not send Luna back to the same incapable host with another instruction to make all 72 gates green. Establish a capable execution route, fix the concrete bootstrap/test/reporting defects, and obtain the first real application-generated export. Return that evidence for review before another broad feature or hardening pass.

The narrower **next assignment** does not narrow the **v0.1 acceptance contract**. All 72 original gates remain mandatory for eventual acceptance. A successful live-proof job means only that this specified intermediate journey worked. It must not make the full acceptance command green while required evidence is missing.

## Packet navigation

- [Architect review](#document-2): what the supplied evidence establishes and the new source findings.
- [Luna assignment](#document-3): bounded work, order of execution, and stop rules.
- [Runner and dispatch](#document-4): recommended GitHub Actions route, local fallback, and operator instructions.
- [Evidence rules](#document-5): identities, reports, partial gate results, artifacts, and verification semantics.
- [All 72 parent gates](#document-9): unchanged requirements, prior reported status, and next-phase focus.
- [Handoff template](#document-6): exact result to return.
- [Sources](#document-7): repository locations and official technical references.
- [Starting prompt](#document-8): paste into Luna with this packet.
- [Workflow blueprint](#workflow-blueprint): a design template; Luna must implement its new command and pin action references before activation.
- [Original gate template](https://github.com/klole/reel-farm/blob/b516dab843be1b8870d3516185b52905982aec1f/architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json): unchanged, unexecuted reference, not new results.

## What should change for Kyle

The next useful result is a run link plus screenshots, seven real JPEGs inside a ZIP, and matching hashes. If Luna cannot trigger GitHub Actions, it should return a prepared workflow and one exact dispatch instruction—not claim that missing local Docker prevents all further work.

No changes were pushed, no workflow was dispatched, and no paid infrastructure was provisioned by this review. The included workflow has not been run against this application.

---

<a id="document-2"></a>

## Document 2: `01_ARCHITECT_REVIEW.md`

# Architect review — CH-001R-r2 submission

**Decision: continue blocked for v0.1 acceptance; authorize the bounded CH-001R-r3 assignment in this packet.**

## 1. Evidence and identity

Reviewed code: `b516dab843be1b8870d3516185b52905982aec1f`. Reviewed handoff/evidence: `5a931feb01ed8da16eb9f0079a380c61f5459792`. GitHub resolves the supplied abbreviated evidence commit to that full SHA and reports T as its parent. The supplied prior range begins at `c05ac9c8753fc4237188f9f8b5c5b7250a5fce78`. References are in [Sources](#document-7).

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

---

<a id="document-3"></a>

## Document 3: `02_LUNA_ASSIGNMENT.md`

# Luna MAX assignment — CH-001R-r3

## Mission and authority

Execute a bounded continuation of CH-001 for **Open Slideshow Studio v0.1.0**. Deliver the first reproducible live application proof on a capable runner. Do not rebuild the app and do not start v0.2.

This file authorizes implementation work when Kyle dispatches it to Luna. It does not grant permission to change account security, repository rules, billing, production data, or cloud accounts. Use the repository's existing authorized write/branch workflow. Do not force-push, silently merge unrelated work, or erase user files.

The next checkpoint is intentionally smaller than full v0.1 acceptance. The 72-gate acceptance contract is unchanged. Stop once this assigned proof is ready, or once a precise external dispatch/access block remains. Do not self-accept the product.

## 1. Read and pin the starting state

Read this packet, the primary r2 handoff, r2 evidence, root state, and the original CH-001 contract. Record:

- actual branch, HEAD, working-tree status, and repository;
- reviewed T `b516dab843be1b8870d3516185b52905982aec1f` and E `5a931feb01ed8da16eb9f0079a380c61f5459792`;
- actual starting commit if main has advanced;
- North Star SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`;
- original gate-template blob `ff0f5df2888779d7226b3f79f1fd8c8bef8ce3a2`.

Inspect any commits after E; preserve unrelated changes. Do not execute an unreviewed branch merely because a workflow input accepts a SHA. Do not edit the frozen North Star or original gate requirements. Prefer a short branch using the established repo process if no main-write authorization exists.

## 2. Establish the execution route before a large repair cycle

Preferred route: a manually dispatched, standard GitHub-hosted Ubuntu VM running this repository's disposable Compose stack. Local fallback: an explicitly authorized disposable Linux/Docker machine with the same commands. Do not use a paid VPS or larger runner by default.

Add a read-only, manually dispatched workflow following [the runner contract](#document-4). It must accept a full implementation SHA, install pinned project tools/browser dependencies, build the actual final image, run the new bounded coordinator, and upload sanitized artifacts even when assertions fail.

Do not add providers or actual account credentials to make tests work. Synthetic owner credentials are generated for each run. The only app credentials used are those disposable local-test credentials; they are not provider keys or real user accounts.

If Luna's workspace lacks Docker, it is a code-editing environment—not the designated runtime. Do not repeatedly execute the same missing-prerequisite guards. Prepare the hosted workflow and give Kyle an exact dispatch action if Luna lacks permission to trigger it.

## 3. Fix the immediate launch and harness blockers

Implement U01–U06 from the architect review, narrowly. In particular:

1. Empty-database migration must work without a hidden manual bootstrap. Record first and second invocation and ensure no duplicate/reset behavior.
2. Import missing test lifecycle symbols and typecheck test sources. Do not hide missing types by enabling broad globals or excluding tests.
3. Fix E2E selectors by following the real UI. Read the full render identity from its real response/URL, not a shortened label. Restore original canonical layouts/roles.
4. Fix evidence-path normalization and safe merging. A passed test must not fail when writing a valid evidence path. A failed test must not be recorded as NOT_RUN or PASS.
5. Eliminate the implicit `/usr/bin/google-chrome` substitution from the qualification path. The host test browser and worker browser must have recorded, qualified provenance.
6. Make run ownership and finalization explicit. Do not overwrite a preceding suite report or preserve an old PASS in a fresh run that did not execute that case.

Add focused regression tests for each repair. Fix additional defects encountered on this assigned path only when needed to make that path genuinely work. Record them rather than expanding features.

## 4. Implement one coordinator, not a second application

Create a root command **`pnpm proof:ch001`** (new interface to implement; it does not exist in the reviewed code). It is a limited intermediate proof, not an alias that weakens `pnpm verify:ch001`.

The coordinator must:

- verify the actual committed application/test source identity and run-owned paths;
- refuse an existing evidence directory unless an explicit resume protocol validates its manifest; default to a fresh unique directory;
- probe Docker daemon and Compose, not just CLI presence;
- create a unique Compose project and private synthetic environment without reading the operator's normal `.env` for test targets;
- build the shipped web/worker image, initialize a brand-new database, and keep the stack alive for the sequence;
- establish real schema and worker/browser readiness, with bounded waits and useful logs;
- run actual integration, E2E, renderer, and limited lifecycle work against deliberately configured resources;
- collect run/case/suite results without duplicate expensive execution or conflicting nested E2E runs;
- produce the sample export, screenshots, manifest, hashes, and sanitized reports;
- collect a fresh partial 72-gate ledger and retain the full acceptance verdict as incomplete when applicable;
- run safe cleanup after evidence capture, never touching normal application volumes;
- return the exit code defined in the evidence protocol.

Prefer extracting lifecycle helpers from existing smoke code rather than maintaining unrelated smoke implementations. Existing suite commands must remain meaningful individually and under the full verifier. The coordinator may explicitly orchestrate existing commands once and collect their outputs; it must not call `test:smoke` and `test:e2e` in a recursive loop.

For integration tests, use an isolated disposable database separate from the UI journey when direct SQL fixture mutations could affect the running worker. A test-only service on the Compose network may run the integration suite; do not expose the product database to public or ordinary host ports. Do not mount the Docker socket into web or worker.

## 5. Required observable proof

### A. Fresh install and migration

Build and run the actual final Docker image. From an empty run-owned database, apply the real migration command. Run it again and prove it is safe. Record image identity and database metadata. Do not seed a pre-migrated volume to avoid U01.

Use the intended non-root account and effective Chromium sandbox. Capture a browser launch/capture probe under the same worker constraints; source strings alone do not establish it. If a narrowly scoped seccomp/user-namespace configuration is required, document it and test it. Do not use `--no-sandbox`, privileged containers, root browser execution, a globally disabled host policy, or unconfined blanket security settings.

### B. Canonical seven-slide UI journey

Use the exact original title, copy, layouts and roles from the original acceptance document. It must be created through owner-authenticated UI actions, not inserted directly into the database and labeled a UI test.

Perform owner setup/login; create project; upload original local generated images; write text; select layouts and roles; adjust at least one off-center crop; exercise undo/redo and one duplicate/reorder/remove sequence; save; leave and reopen the project; request preview; wait for the real worker; download the application ZIP.

Cover both 9:16 and 4:5 in actual saved/output evidence. The primary canonical ZIP remains 9:16. A separate alternate-format render/export must prove 1080×1350 and provide a screenshot; do not call a resized editor screenshot a rendered alternate export. Retain the 9:16 original's immutable artifact identity.

For the upload-during-unsaved-edit regression, control/delay the relevant save response and select the image controls explicitly. Confirm selection, text, undo history, and eventual persisted content. Do not simply rely on the upload finishing before the autosave timer by luck.

### C. Export and download integrity

The canonical ZIP must contain exactly seven ordered JPEGs (`01.jpg` through `07.jpg`), `post.txt`, and `manifest.json`. Verify that each JPEG decodes and has the expected dimensions; slide IDs/order correspond to the saved revision; text bytes match the original fixture; manifest hashes match actual bytes; and every authenticated final-preview response equals the corresponding ZIP image byte for byte.

Capture full render/revision IDs via the application, not abbreviated UI text. Inspect HTTP success and content type before hashing response bodies. Repeated ready downloads must not trigger a render. Inspect output filenames/entries for unsafe paths and obvious secret/private-path leakage.

### D. A small, real lifecycle exercise

Record project ID, head revision, accepted media hashes, ready render ID, image hashes, and ZIP hash from the canonical journey.

Stop the worker. Prove the editor and save still work, authenticated readiness becomes degraded, and a ready export remains downloadable. Request a new render and confirm it remains honestly queued. Restart the worker and await its actual readiness and that queued request's completion.

Then recreate the app/worker/database containers without deleting the named volumes. Log back in as needed. Retrieve the same existing project/revision/assets/ready artifact and compare the recorded identities/hashes. HTTP health alone is not sufficient.

This is not a claim to cover crash-mid-render fencing, duplicate delivery, timeouts, or every fault path. Those remain specific open gates until their own tests exist and execute.

### E. Reviewable evidence

Produce screenshots from the real app, actual exported files, decoded/parsed manifests, raw reporter outputs with counts, sanitized logs, and the environment/image/browser identity. Commit a small index or attach a retrievable artifact, not only local filesystem paths.

Do not sign a visual inspection as Kyle, a human, or this architect. An agent that actually sees images can record an explicitly agent-performed inspection with artifact hashes and precise observations. Otherwise leave the visual/manual portion pending for Kyle/architect review.

## 6. Stopping criteria for this assignment

Return **`LIVE_PROOF_READY_FOR_REVIEW`** only when the clean stack, real suites in this proof profile, seven-slide ZIP/hash comparison, alternate-format output, basic lifecycle assertions, and retrievable evidence exist for the same final implementation. This is not `v0.1 accepted` and not full CH-001 readiness.

Return **`NEEDS_WORKFLOW_DISPATCH`** when the workflow/coordinator/repairs are committed but Luna cannot dispatch the capable runner. Include the exact branch/workflow/full SHA and one operator command. Do not call this live proof.

Return **`BLOCKED_ENVIRONMENT`** only for an evidenced limitation of the designated runner (daemon permissions, unavailable registry/browser download, unavoidable sandbox incompatibility, denied job execution), with attempted command, actual error and next external action.

Return **`TEST_FAILURE`** when prerequisites work and an assigned behavior/test fails. Preserve the failure. Fix within scope where feasible; otherwise return the precise failing case and artifacts. Do not relabel an assertion failure as unavailable infrastructure.

In every case, application version remains unaccepted and root state remains `awaiting_review`. Return the new T and E identities and stop. No autonomous next chapter.

## 7. Explicit exclusions

No fal.ai, ScrapeCreators, Pinterest, text/image provider keys, publishing bridge, direct official TikTok Content Posting API, TikTok account authorization, scheduling, unattended publishing, analytics, billing, MP4/video, teams, template marketplace, public deployment, release/tag, or paid compute provisioning.

Preserve the product decisions for future chapters: one fal key for selectable text and image models, ScrapeCreators for Pinterest, and no direct official TikTok posting integration. These do not justify adding integrations now.

Do not turn this pass into a dependency-platform rewrite. Record unsupported/deprecated runtime or security-support concerns for release qualification; any pin update needed to execute the bounded proof must be explicit, justified, tested, and tied to a new T. Never silently float to latest.

---

<a id="document-4"></a>

## Document 4: `03_RUNNER_AND_DISPATCH.md`

# Runner setup and exact unblock path

## Recommendation

Use a **standard GitHub-hosted Ubuntu VM** with the repository's Compose stack, not Luna's restricted editing host and not a new paid VPS. The repository metadata was public at review. GitHub documents standard hosted-runner usage as free for public repositories; that statement does not remove artifact-retention limits, account policies, or larger-runner charges. Use a standard label, short artifact retention, and no paid fallback without approval. [S25, W01]

An ephemeral CI runner is a test environment, not a hosted production deployment of the app. It does not require fal/ScrapeCreators keys or a TikTok app.

## What exists and what is proposed

The inspected repository has suite/coordinator pieces but no qualified end-to-end runner result. This packet proposes a workflow file named `.github/workflows/ch001-live-proof.yml` and a new root command `pnpm proof:ch001`. Neither is claimed to be operational merely because this packet includes a blueprint. Luna must implement and validate them.

The GitHub connector did not support the workflow-collection endpoint attempted during review; this is not evidence that Actions is disabled. No workflow was dispatched. Do not confuse connector API coverage with the repository owner's Actions permissions.

## Runner topology

Recommended job host: `ubuntu-24.04` standard VM. Run the workflow on the VM rather than inside a job container that would itself require Docker-in-Docker. Choose a currently supported standard VM label if this label is no longer available at execution, and record the change. Do not use `ubuntu-slim` for this Compose/browser workload. [W01]

Inside the job:

1. Check out the full supplied implementation SHA, with read-only repository permissions and no persisted Git credentials.
2. Install the repository's pinned Node/pnpm and frozen lockfile.
3. Install the browser revision matched to the pinned Playwright package and its required OS dependencies.
4. Verify Docker daemon access and Compose.
5. Let `proof:ch001` own an isolated Compose project with db, migrate, web and worker plus an optional test-only integration runner.
6. Keep those services alive through the journey and same-data lifecycle checks.
7. Upload only sanitized proof files, including failure evidence when available; clean up only the run-owned resources.

Playwright's official CI guidance separates browser installation from npm dependencies; downloading the npm package alone does not install every browser/system dependency. Its container guidance also addresses non-root Chromium sandboxing and a suitable seccomp profile. Use those as implementation references, not as proof that the shipped image already works. [W02–W03]

## Avoid the reviewed orchestration trap

Do not run the old command sequence as though smoke had already configured it. At T, integration runs before the smoke stack exists; nested smoke E2E sets child-only credentials/base URL; the stack is then removed. The new coordinator must resolve this ownership explicitly.

A workable design is to refactor `ch001-compose-smoke.ts` into setup/assert/teardown helpers and have `proof:ch001` call them. The standalone smoke command can reuse the same helpers. The full verifier later invokes a consistent orchestration mode rather than recursively nesting full tests.

For integration tests that need database access, prefer a dedicated test service on the Compose network or a separate ephemeral integration database. A host process cannot use the service hostname `db` by assumption. Any test-only host binding must be explicit, loopback-only and separate from the product configuration; the preferred route avoids it entirely. [W04]

## Workflow security and reproducibility contract

The included [blueprint](#workflow-blueprint) is deliberately manual-dispatch only. Before activating it, Luna must resolve official action tags to immutable commit SHAs, review their provenance, and record those pins. Do not substitute random third-party setup actions.

The workflow must retain:

- `permissions: contents: read`; no provider or production secrets;
- same-repository full-SHA checkout, confirmed by `git rev-parse HEAD`;
- a job timeout and one bounded run, not an automatic retry loop;
- a standard VM, not a larger/billable runner;
- generated per-run synthetic app credentials;
- explicit browser/runtime/image versions in the proof record;
- no normal user `.env` inheritance, database wipe, Docker socket inside the app, or privileged containers;
- `always()` evidence publication with a safe allowlist, not an upload of the whole workspace;
- a distinct name such as **CH-001 live proof — NOT release acceptance**.

The workflow's own configuration SHA and the checked-out implementation SHA may differ because manual dispatch loads a workflow definition from a branch. Record both. Do not pretend `github.sha` alone necessarily identifies the tested code.

## Activation and dispatch

GitHub requires a manual-dispatch workflow to be present on the default branch before it is available for that event. Follow the repository's authorized review/merge process; do not bypass it. [W05]

After Luna implements the command and workflow, the operator can use the repository's **Actions → CH-001 live proof — NOT release acceptance → Run workflow** control. Choose the approved workflow branch and enter Luna's new full implementation SHA, not the old T in this review.

Equivalent CLI, after the workflow actually exists and is approved:

```bash
# Replace the assignment value with the NEW full SHA returned by Luna.
export T3='REPLACE_WITH_NEW_40_CHARACTER_IMPLEMENTATION_SHA'
# Do not execute with the placeholder.
[[ "$T3" =~ ^[0-9a-f]{40}$ ]] || { echo 'Set the real implementation SHA first.' >&2; exit 1; }

gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha="$T3"

gh run list --repo klole/reel-farm \
  --workflow ch001-live-proof.yml --event workflow_dispatch --limit 5
```

Select the run corresponding to the dispatch, verify the input SHA in its summary, then obtain logs/artifacts from that run. Do not automatically pick an unrelated "latest" run. A user-triggered standard public-runner job does not authorize new cloud billing or account changes.

If Luna can trigger the approved workflow using its already-authorized GitHub connection, it may do so within Kyle's dispatched assignment and environment permissions. If it cannot, return `NEEDS_WORKFLOW_DISPATCH` with the exact new SHA and the prepared instruction above. Do not ask Kyle for an API key/PAT in chat or claim the code is verified before the run.

## Local fallback

Use an authorized disposable Linux host with a real Docker daemon, Compose and pinned project tools. Execute the same `proof:ch001` command after installation/browser setup. Do not install a privileged daemon inside a managed sandbox to evade its restrictions. An alternate system Chrome run is diagnostic only unless explicitly qualified; it is not a replacement for the shipped/pinned-browser evidence.

Record which capability failed: CLI missing, daemon denied, pull/DNS failure, database unhealthy, migration failure, Chromium library failure, or sandbox denial. A present Docker binary alone is not a ready environment. An application error once services start is a TEST_FAILURE, not an environment excuse.

---

<a id="document-5"></a>

## Document 5: `04_EVIDENCE_PROTOCOL.md`

# Evidence protocol and exit semantics

## 1. Two different questions

**Live proof:** did the bounded CH-001R-r3 workflow actually run and produce the required artifacts and lifecycle observations?

**v0.1 acceptance:** are all 72 original gates fully supported, required manual/visual reviews complete, and blocking findings closed or disproved?

A PASS for the first question must not be represented as a PASS for the second. This distinction fixes the planning sequence; it does not create a waiver for any parent requirement.

## 2. Run identities

Record a full implementation SHA T3 after application, test, coordinator, dependency and workflow changes are committed. Run against that committed source. If a failing live test requires another code change, commit a new T and rerun affected proof; do not relabel old output as evidence for the new code.

A new evidence/handoff commit E3 may then add documentation and sanitized proof references. Preserve historical r1/r2 reports. Since a commit cannot conveniently contain its own final hash, record T3 inside the reports; resolve and return E3 after commit creation. The handoff or external response supplies E3. Do not repeatedly amend E3 merely to insert its own hash.

When docs-only changes separate the checked-out SHA and the application T, record both and verify the actual diff/tree identity. Never trust `CH001_IMPLEMENTATION_COMMIT` simply because an environment variable contains a 40-character string.

Record a unique run ID, every child invocation ID, checkout SHA, workflow-definition SHA, relevant source-tree digest/clean status, UTC timestamps, OS/arch, image IDs/digests, Node/pnpm, Playwright and actual browser versions. No report from a different invocation can replace an earlier failure with the same filename.

## 3. Proposed outputs

Use `artifacts/ch001r3/<run-id>/private/` for raw execution files and `artifacts/ch001r3/<run-id>/public/` for reviewed/sanitized deliverables. The CI artifact uploads only the latter. Raw `.env`, auth storage state, cookies and setup requests must never be uploaded by wildcard.

The public packet should contain:

- `proof-result.json`: profile, scope, actual verdict/exit, T3, run identity, and required-step outcomes;
- `command-report.json`: command, argv without secrets, timestamps, exit, suite report path and hash;
- real Vitest/Playwright suite reports and sanitized logs with discovered/executed/pass/fail/skip counts;
- `environment.json`: measured non-secret runtime/container/browser facts;
- `lifecycle.json`: before/after identities, same-data/hash assertions, worker-down and restart transitions;
- `a-little-room-to-focus.zip` plus extracted `manifest.json`/`post.txt` for easy inspection;
- the alternate 4:5 output and actual dimension checks;
- `journey-hashes.json`: full project/revision/render/slide identities and preview-versus-ZIP equality, dimensions and hashes;
- real screenshots: populated editor, final preview, alternate-format output, and worker-down/queued state;
- a fresh `gate-results.json` covering exactly the original 72 IDs with evidence-specific PASS/FAIL/NOT_RUN;
- `finding-dispositions.json`: original R01–R11 and new U01–U08, with actual tests or remaining gaps;
- a sanitization record and `artifact-manifest.json` listing existing public files with SHA-256 hashes;
- optional actual visual/keyboard review records, explicitly identifying who/what performed the inspection.

No original font binaries are included in this architect packet or its reference files. Application fixture fonts should follow the repository's dependency/license process; do not obtain or redistribute font files from the architect's environment.

## 4. Reporter rules

A test result is not a gate result until it covers that gate's full text and all required evidence kinds. A SQL fixture transaction does not prove the production transaction function. A live web heartbeat does not prove data survives a restart. Saving an image hash in JSON does not prove it matches a valid authenticated JPEG response unless that equality was asserted.

Preserve all three statuses. Do not turn FAIL into NOT_RUN when loading the ledger. Do not retain a previous PASS for a newly unexecuted run. Use per-case identities and a merge that preserves multiple evidence contributions. A source review must identify the actual relevant files/checks; one generic string scan cannot sign every E1 gate.

Paths must be relative to a defined evidence/repository root after validation. Resolve real paths to prevent symlink escape. Normalize inside-root absolute paths at the writer boundary if accepted by its contract; retain rejection of outside-root paths. Missing, malformed, contradictory or stale evidence must fail validation, not be treated as an optional file.

Read raw reporter results and compare their counts/statuses with the summary. Validate suite run IDs, child invocation IDs, source identities and timestamps. A zero-test run, test import error, or skipped required case cannot produce a proof PASS.

## 5. Separate commands

### `pnpm proof:ch001` — new, bounded execution profile

- Exit `0`: all **assigned live-proof** steps and artifact checks passed, with a real app ZIP and basic lifecycle evidence.
- Exit `1`: an assertion, setup implementation, report, sanitization or artifact failure occurred.
- Exit `2`: a measured external prerequisite or execution permission is genuinely unavailable.

A proof exit 0 is explicitly labeled `LIVE_PROOF_READY_FOR_REVIEW`, with `application_acceptance: false`. It need not imply the 72-gate verifier is green.

### `pnpm verify:ch001` — original complete acceptance command

Keep it strict: it must remain nonzero whenever a mandatory gate is FAIL/NOT_RUN, required inspection is absent, a blocking finding is open, or evidence is invalid. Never alias this name to the smaller proof profile. Never use `requireCompleted: false` to obtain a full-acceptance success.

It may reuse immutable, validated per-run suite results rather than repeating expensive tests solely to generate manual-evidence loops. Such collection must verify T/run/artifact identity and freshness. Support a clearly named report-collection mode if needed. It must not invent command executions or silently skip required commands.

**Expected r3 outcome:** limited proof may succeed while full CH-001 remains incomplete because later security/concurrency/recovery/manual gates are open. Report that plainly. Do not use `|| true` or `continue-on-error` to paint full acceptance green.

## 6. Finalization order and non-circular hashes

Execute tests and write stable raw results. Sanitize copies to final public paths. Generate inspections referencing those exact artifacts. Assemble the ledger and command/finding summaries from those stable records. Build a manifest over an explicit payload allowlist; exclude the manifest itself and its verifier output. Validate the payload and manifest. Finally write the verifier result referencing the manifest hash. Do not mutate files after hashing them.

Avoid the reviewed behavior of scanning an existing directory that may contain previous results and then overwriting those results after hashing. Use fresh run directories and deterministic finalization. Keep manual reviews bound to the same artifact bytes; do not rerender after inspection and reuse the old signoff.

For CI, record actual run/job/artifact IDs, artifact name, download link/reference, artifact hash and expiry/retention. Artifacts are not permanent archival storage. Before expiry, preserve the approved small synthetic evidence set or a durable retrievable copy in accordance with repo policy. Never invent a future Actions URL.

## 7. Review and acceptance

No agent signs as Kyle or a human reviewer. Report automated checks as automated and an actual agent image inspection as agent-performed. A screenshot existing is not a visual review. This architect can review supplied images in a subsequent turn; that future possibility is not current evidence.

The historical submitted r2 ledger remains 4 source-only PASS / 0 FAIL / 68 NOT_RUN, as reported. New source findings are not retroactively fabricated runtime FAIL entries. In the new run, a measured failure must be recorded as FAIL and retain its exact failed step.

Root state: `awaiting_review`. Accepted application version: `none`. Only a separate architect decision can accept v0.1 after the unchanged contract is met.

---

<a id="document-6"></a>

## Document 6: `06_HANDOFF_TEMPLATE.md`

# Luna handoff — CH-001R-r3

Complete factual fields only. This is a template, not existing results.

## Result

`LIVE_PROOF_READY_FOR_REVIEW` / `NEEDS_WORKFLOW_DISPATCH` / `BLOCKED_ENVIRONMENT` / `TEST_FAILURE`

Application acceptance: **false**. Target remains v0.1.0; root state `awaiting_review`.

## Identity

- Starting repository/branch/commit:
- Reviewed prior T: `b516dab843be1b8870d3516185b52905982aec1f`
- Reviewed prior E: `5a931feb01ed8da16eb9f0079a380c61f5459792`
- New implementation T3 (full SHA):
- Exact checkout SHA and relevant clean-tree/diff check:
- Workflow-definition SHA:
- Evidence E3 (resolve after committing; return externally if not self-embeddable):
- Run ID, child run IDs, actual UTC times:
- Execution host / CI run/job link / actual artifact identity and expiry:

## Assigned proof outcomes

| Step | PASS / FAIL / NOT_RUN | Evidence/case reference | Actual gap or observation |
|---|---|---|---|
| Final image builds and sandboxed worker starts | | | |
| Empty migration + repeat invocation | | | |
| Unit/security/test-source checks | | | |
| Real integration suite executes | | | |
| Owner setup/login and seven-slide UI journey | | | |
| Real renderer suite executes | | | |
| Canonical ZIP and preview-byte equality | | | |
| Alternate 4:5 output dimensions | | | |
| Worker stop/queued request/restart/download | | | |
| Same data/artifact after container recreation | | | |
| Evidence sanitization/retrievability | | | |

## Commands

List actual commands, timestamps, exit codes, discovered/executed/skipped counts and logs. Distinguish proof profile from full acceptance. State whether an expected nonzero full verifier reflects uncovered gates or broken evidence. Do not say all suites passed unless they ran on this code.

## Artifacts

Provide real locations for populated-editor and preview screenshots, alternate output, worker-down state, canonical ZIP, manifest/post text, image/ZIP hashes, lifecycle comparison, reports, sanitization record and manifest. Do not include credentials or auth-state files. Note expiry of hosted artifacts.

## Parent gate ledger

Exactly 72 original IDs. Report counts and specific uncompleted categories. State that partial evidence within a gate is not a full PASS. Preserve historical r1/r2 records. Do not substitute the limited proof verdict for full acceptance.

## Findings

| Finding | Fixed / disproved / still open | Specific source change | Executed regression or remaining requirement |
|---|---|---|---|
| U01 migration bootstrap | | | |
| U02 integration import/discovery | | | |
| U03 E2E UI/identity/fixture | | | |
| U04 evidence paths/merge | | | |
| U05 runner ownership/pinned browser | | | |
| U06 verifier/failure/identity semantics | | | |
| U07 actual lifecycle assertions | | | |
| U08 remaining parent coverage | | | |

Also provide dispositions for original R01–R11. Do not mark all closed merely because source changes were committed.

## Exact external action, only when needed

For `NEEDS_WORKFLOW_DISPATCH`, state approved workflow branch/name, new full SHA and one exact command/run-button instruction. State which connection permission prevented dispatch. Do not repeat missing local Docker as the only explanation.

For `BLOCKED_ENVIRONMENT`, supply the designated runner's actual failed prerequisite command/log and the smallest required operator action. For `TEST_FAILURE`, supply the actual failing test and defect instead.

## Boundaries and stop

List provider calls/spend (expected none), CI usage, repository writes, cleanup targets and whether any external services were used. Confirm no providers/publishing/scheduling/billing/video/v0.2/release work began. Update state, return T3/E3 and stop for review.

---

<a id="document-7"></a>

## Document 7: `07_SOURCES.md`

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

---

<a id="document-8"></a>

## Document 8: `LUNA_START_PROMPT.md`

# Starting prompt — Luna MAX / CH-001R-r3

Execute **CH-001R-r3: Runner bootstrap and first live proof** for `klole/reel-farm`, using MAX effort.

Read this packet, the r2 handoff/evidence at `5a931feb01ed8da16eb9f0079a380c61f5459792`, and the original CH-001 acceptance contract before editing. Preserve the existing application and historical evidence. v0.1 is NOT accepted.

Do not repeat another broad all-72-gates repair pass on an incapable host. Establish the manually dispatched standard GitHub Actions runner route (or an authorized equivalent), fix the documented migration/import/UI-test/evidence/orchestration blockers, and implement the bounded `pnpm proof:ch001` coordinator. Build the actual shipped image, run the real database/browser/worker journey, and produce the canonical seven-slide ZIP, preview-byte equality, alternate-format output and basic same-data restart evidence.

Keep `pnpm verify:ch001` as the strict full-acceptance check; the smaller proof's success is not v0.1 acceptance. Preserve real FAIL/NOT_RUN outcomes and all 72 unchanged gate IDs. Do not fake manual review or artifacts.

When the assigned live proof is ready, return `LIVE_PROOF_READY_FOR_REVIEW` with actual T3/E3, CI run/artifact references and the partial parent ledger. If the prepared workflow requires Kyle to trigger it, return `NEEDS_WORKFLOW_DISPATCH` with the exact new SHA/workflow/command. A designated-runner prerequisite failure is `BLOCKED_ENVIRONMENT`; an executed assertion failure is `TEST_FAILURE`. Do not call a blocked run complete.

No fal.ai, ScrapeCreators, TikTok, publishing bridges, direct official TikTok API, scheduling, analytics, billing, video, public deployment, release or v0.2 work. Root state remains `awaiting_review`, accepted application version remains none. Stop at this checkpoint for architect review.

---

<a id="document-9"></a>

## Document 9: `05_PARENT_GATE_COVERAGE.md`

# Original 72-gate coverage map — planning, not executed results

The descriptions and required-evidence text below are copied unchanged from the verified original gate template. This table records r2 **reported** status and r3 focus; it creates no new PASS/FAIL claims. A focus marker is not a waiver for any other gate. Partial coverage inside a gate stays NOT_RUN with a precise reason until its full contract is met.

The limited `proof:ch001` result and the parent `verify:ch001` result are separate. All parent gates remain mandatory before v0.1 acceptance.

## CH001-001

**Original requirement:** From a clean checkout/disposable environment, follow the written setup and Compose instructions. Reach first-owner setup without undeclared manual fixes.

**Required evidence:** E2 + E4-local; setup log and environment record.

**r2 reported result:** NOT_RUN. **Next treatment:** Core r3 proof: genuinely empty database and shipped image.

## CH001-002

**Original requirement:** Repeat setup/start. Existing generated secrets, owner, database records, and media remain intact; no silent reseed or reset.

**Required evidence:** E2 + E4-local; before/after record/hash checks.

**r2 reported result:** NOT_RUN. **Next treatment:** Core r3 proof: repeat migration/start with before/after checks; full setup idempotency must also be demonstrated before PASS.

## CH001-003

**Original requirement:** Inspect and exercise network binding. Only the web surface is host-published on loopback; database and worker are not publicly bound.

**Required evidence:** E1 + E2; sanitized Compose config/assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Retain source checks; runtime binding inspection still required.

## CH001-004

**Original requirement:** With provider credentials absent and external runtime requests denied/monitored, complete the manual workflow. Dependency/image pulls are outside this runtime observation window.

**Required evidence:** E2; network assertions/log summary and export.

**r2 reported result:** NOT_RUN. **Next treatment:** Provider-free design is preserved; runtime network observation must be explicit before PASS.

## CH001-005

**Original requirement:** Stop the worker. The editor/save/local media remain usable; status becomes degraded and a requested render honestly waits. Restart restores readiness.

**Required evidence:** E2 + E4-local; state transitions/screenshots.

**r2 reported result:** NOT_RUN. **Next treatment:** Core r3 proof: worker-down editing, queue, restart/readiness.

## CH001-006

**Original requirement:** Stop and recreate the app/worker/database containers without deleting volumes. Login, projects, revision IDs, accepted media hashes, and ready exports remain valid.

**Required evidence:** E4-local; before/after verification.

**r2 reported result:** NOT_RUN. **Next treatment:** Core r3 proof: compare same project/revisions/media/ready export after recreate.

## CH001-007

**Original requirement:** Missing/invalid setup token cannot create an owner. Two simultaneous valid setup attempts create exactly one owner/workspace; reused bootstrap is closed.

**Required evidence:** E2; database assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Owner happy-path setup alone does not cover bootstrap races/reuse.

## CH001-008

**Original requirement:** Correct login works; wrong credentials fail; basic rate limiting operates; logout and finite expiry invalidate protected access.

**Required evidence:** E2; real session requests/browser test.

**r2 reported result:** NOT_RUN. **Next treatment:** Happy-path login is partial; expiry/logout/rate-limit negative cases remain.

## CH001-009

**Original requirement:** Inspect cookie flags and execute cross-origin state-changing attempts, including multipart upload. Unsafe host/origin/CSRF requests fail. The loopback HTTP exception is explicit.

**Required evidence:** E1 + E2; sanitized header assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Explicit CSRF/origin/header matrix still required.

## CH001-010

**Original requirement:** Unauthenticated requests cannot read/mutate projects, drafts, assets, thumbnails, render details, final images, exports, or owner-only status.

**Required evidence:** E2; route matrix.

**r2 reported result:** NOT_RUN. **Next treatment:** Full unauthenticated route matrix still required.

## CH001-011

**Original requirement:** Controlled second-workspace fixtures cannot access another workspace's resources by guessing IDs or supplying foreign asset references.

**Required evidence:** E2; command and HTTP authorization checks.

**r2 reported result:** NOT_RUN. **Next treatment:** Second-workspace command/HTTP checks still required.

## CH001-012

**Original requirement:** Passwords/setup tokens/session secrets are absent from ordinary logs, URLs, committed config, browser bundles, output manifests, screenshots, and export files. Auth bypass/signup shortcuts are absent.

**Required evidence:** E1 + E2; scoped scan/report.

**r2 reported result:** NOT_RUN. **Next treatment:** Sanitized proof is useful; full relevant secret/bundle/log scan remains required.

## CH001-013

**Original requirement:** Create, list, rename, reopen, and switch between two projects with independent persisted drafts.

**Required evidence:** E2; browser journey/database reads.

**r2 reported result:** NOT_RUN. **Next treatment:** One project is partial; independently persisted two-project lifecycle still required.

## CH001-014

**Original requirement:** Save a valid document, inspect its immutable revision/hash, save an edit, and prove the earlier revision was not mutated.

**Required evidence:** E2; database invariants.

**r2 reported result:** NOT_RUN. **Next treatment:** Inspect actual application-created immutable revisions; custom SQL rows are not production save proof.

## CH001-015

**Original requirement:** Reject unsupported schema versions/layout/font IDs, bad slide/block IDs, duplicate IDs, illegal counts/boxes, foreign assets, arbitrary URLs, and invalid numeric values.

**Required evidence:** E2; parameterized contract/command tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Map actual schema/command validation tests, not only field existence.

## CH001-016

**Original requirement:** Semantically identical documents with different object-key insertion order hash consistently under the declared canonicalizer; array order/content changes alter the hash.

**Required evidence:** E2; deterministic unit tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Existing isolated tests may support this only after actual current-run execution and matching assertions.

## CH001-017

**Original requirement:** Autosave reports unsaved/saving/saved correctly, flush-before-preview waits for acknowledgment, and browser close/reopen retrieves the saved deck.

**Required evidence:** E2; browser test with controlled responses.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof includes save/reopen; controlled-response behavior must be covered before full PASS.

## CH001-018

**Original requirement:** Two tabs edit the same base revision. The second stale save is rejected; its local buffer survives; explicit safe reload does not silently discard unacknowledged work.

**Required evidence:** E2; two independent browser pages.

**r2 reported result:** NOT_RUN. **Next treatment:** Still requires two independent browser pages and stale-save recovery.

## CH001-019

**Original requirement:** Delay/drop/reorder save responses and temporarily fail a save. A late response cannot clobber newer text or show false saved state; retry/reconciliation does not overwrite a later revision.

**Required evidence:** E2; network fault tests and head assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Still requires delayed/dropped/reordered responses and head assertions.

## CH001-020

**Original requirement:** Title, caption, hashtags, slide content and order are bound to one saved revision. Concurrent later editing cannot change a render/export already requested for that revision.

**Required evidence:** E2; immutable snapshot test.

**r2 reported result:** NOT_RUN. **Next treatment:** Immutable render-after-later-edit test still required.

## CH001-021

**Original requirement:** Upload valid JPEG, PNG, and static WebP in a batch. Each has a durable accepted record, image dimensions/hash, thumbnail, and selectable local asset.

**Required evidence:** E2; real decoder/storage/browser.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof uploads are partial unless all required supported formats and normalization cases are executed.

## CH001-022

**Original requirement:** Mix valid and invalid files in a batch. Per-file errors are useful; accepted files remain available and are not rolled back unnecessarily.

**Required evidence:** E2; batch test.

**r2 reported result:** NOT_RUN. **Next treatment:** Mixed batch acceptance/error behavior still required.

## CH001-023

**Original requirement:** Reject disguised HTML/SVG, corrupt/truncated data, animation, unsupported formats, and mismatched content. Do not trust extension/MIME alone.

**Required evidence:** E2; signature/decode tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Decoder/limits/security cases remain; successful uploads alone are insufficient.

## CH001-024

**Original requirement:** Enforce byte, decoded-pixel, edge, frame, batch, and execution limits. Oversized inputs cannot bypass streaming limits by lying about content length.

**Required evidence:** E2; safely bounded adversarial fixtures.

**r2 reported result:** NOT_RUN. **Next treatment:** Use original condition verbatim; add the particular provenance/metadata/asset check before PASS.

## CH001-025

**Original requirement:** EXIF orientation displays/exports correctly. Transparent-image handling is intentional. Public/render/export derivatives omit private EXIF/GPS metadata.

**Required evidence:** E2 + visual; decoded metadata/output checks.

**r2 reported result:** NOT_RUN. **Next treatment:** Use original condition verbatim; no blanket upload-category PASS.

## CH001-026

**Original requirement:** Traversal-like and header-injection filenames cannot escape storage or alter download headers. Media is not anonymously exposed through static paths.

**Required evidence:** E2; storage and HTTP tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Use original condition verbatim; collect specific failure/security evidence.

## CH001-027

**Original requirement:** Retain source/upload time/user assertion and original/derivative hashes. Identical bytes do not erase distinct source records; no cross-workspace deduplication leak.

**Required evidence:** E2; record assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Use original condition verbatim; collect explicit private-media route evidence.

## CH001-028

**Original requirement:** Inject decode/storage/DB commit failure. No accepted asset points to missing bytes; failed staging is safely tracked/cleaned. Missing/corrupt referenced media later blocks render without deleting the draft.

**Required evidence:** E2; failure boundaries and hash checks.

**r2 reported result:** NOT_RUN. **Next treatment:** Use original condition verbatim; lifecycle/asset consistency evidence must match the entire requirement.

## CH001-029

**Original requirement:** Add, duplicate, remove, and reorder slides using non-drag controls. IDs remain stable on reorder and are fresh on duplication. Minimum/maximum slide bounds are enforced.

**Required evidence:** E2; interaction/state tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Use original condition verbatim; rejected content must be actually exercised.

## CH001-030

**Original requirement:** All three layouts work, can be mixed, and preserve text through switching. Hiding/replacing an image does not delete its accepted local original.

**Required evidence:** E2 + visual; editor and output.

**r2 reported result:** NOT_RUN. **Next treatment:** Use original condition verbatim; no automatic credit from shared upload fixture.

## CH001-031

**Original requirement:** Changing 9:16/4:5 updates every slide's trusted geometry and resulting dimensions without stretching the source or losing text.

**Required evidence:** E2 + visual; both-ratio corpus.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof exercises structural edits; ensure the entire original gate is asserted.

## CH001-032

**Original requirement:** Every exposed text/font/weight/size/line-height/alignment/color/panel/placement control changes stored data and final rendering as intended. No decorative controls.

**Required evidence:** E2; focused control tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof uses layouts/formats; required preservation checks must be explicit.

## CH001-033

**Original requirement:** Cover/contain, focal reposition, reset, and replacement are nondestructive and match final output. Use off-center and landscape fixtures.

**Required evidence:** E2 + visual; crop-marker assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof text controls are partial unless all original cases are tested.

## CH001-034

**Original requirement:** At least 50 logical session edits support sensible undo/redo. New edits clear redo; text editing does not double-apply app/browser keyboard undo.

**Required evidence:** E2; grouped edit and shortcut tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof includes real crops; match the full original font/image/edit condition.

## CH001-035

**Original requirement:** Long text/newlines/unbroken tokens produce measured wrapping or an explicit overflow error. No silent clipping or minimum-font-size violation.

**Required evidence:** E2 + visual; text corpus.

**r2 reported result:** NOT_RUN. **Next treatment:** Rendering evidence is partial; match the complete original condition.

## CH001-036

**Original requirement:** Empty/loading/error/saved/conflict states are understandable; main actions have labels/focus and keyboard access. Desktop and narrow layouts do not hide essential actions.

**Required evidence:** E2 accessibility checks + visual/keyboard review.

**r2 reported result:** NOT_RUN. **Next treatment:** Required content preservation/reflow behavior must be explicitly compared.

## CH001-037

**Original requirement:** A render request references an exact immutable saved revision. A queued job renders that snapshot even after the live draft changes.

**Required evidence:** E2; real worker/database test.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof undo/redo is partial unless the complete original transition condition is verified.

## CH001-038

**Original requirement:** Application intent and pg-boss enqueue share a tested transaction, or an exercised outbox/reconciliation mechanism prevents lost work. Simulated handoff failure cannot lose acknowledged intent.

**Required evidence:** E2; failure/transaction assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof manual workflow is partial unless the original bound/validation condition is verified.

## CH001-039

**Original requirement:** Replay the same render command with the same client request ID/payload: one logical request. Same key/different payload: conflict.

**Required evidence:** E2; command concurrency tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Read and test exact original job-intent condition; constructed SQL transactions do not qualify automatically.

## CH001-040

**Original requirement:** Render all layouts at both canvas presets using the pinned browser and local assets. Output JPEG dimensions/count/decode validity match the document.

**Required evidence:** E2; real corpus render.

**r2 reported result:** NOT_RUN. **Next treatment:** Real worker progress helps; original request identity and immutable-input checks remain explicit.

## CH001-041

**Original requirement:** Delay required fonts/images. Capture waits for actual font faces/image decode. Missing resources fail with actionable diagnostics; no silent fallback success.

**Required evidence:** E2; controlled missing/delayed resource fixtures.

**r2 reported result:** NOT_RUN. **Next treatment:** Assert real render bytes/geometry and full original condition, not just screenshot existence.

## CH001-042

**Original requirement:** Editor and worker use the shared trusted scene/layout implementation. Overflow, missing media, and unsupported glyph conditions prevent a ready artifact.

**Required evidence:** E1 + E2; architecture inspection and validation failures.

**r2 reported result:** NOT_RUN. **Next treatment:** Architecture/readiness is partial; validation failures remain required.

## CH001-043

**Original requirement:** User script-like strings render as text. Rejected URLs/CSS/HTML cannot execute, read local files, or make outbound requests.

**Required evidence:** E2; containment tests with network/file sentinels.

**r2 reported result:** NOT_RUN. **Next treatment:** Network/file/script containment sentinels still required.

## CH001-044

**Original requirement:** Shipped renderer runs non-root with verified sandbox configuration and a minimal browser subprocess environment. No auth cookies, DB secrets, privileged container, broad host mounts, or Docker socket access.

**Required evidence:** E1 + E2; launch/config assertions and canary tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Read the original sandbox/process condition; source configuration is not runtime proof.

## CH001-045

**Original requirement:** Render execution timeout terminates the affected attempt, leaves an honest failure/retry state, and does not hang the entire worker indefinitely.

**Required evidence:** E2; deterministic hang/failure fixture.

**r2 reported result:** NOT_RUN. **Next treatment:** Deterministic timeout/hang behavior still required.

## CH001-046

**Original requirement:** Kill/restart a worker during a render. The accepted request becomes recoverable, retains revision identity, respects attempt limits, and eventually succeeds or explicitly fails.

**Required evidence:** E4-local; process lifecycle log and DB checks.

**r2 reported result:** NOT_RUN. **Next treatment:** Basic stop/restart does not cover kill mid-render and lease/attempt recovery.

## CH001-047

**Original requirement:** Duplicate/reclaimed job deliveries cannot finalize competing outputs for one request. A stale attempt cannot overwrite the accepted newer success.

**Required evidence:** E2; fencing/unique-finalization test.

**r2 reported result:** NOT_RUN. **Next treatment:** Competing/duplicate/reclaimed finalization test still required.

## CH001-048

**Original requirement:** Crash after writing some/all staged files but before DB ready commit. Recovery does not expose partial success, delete accepted media, or strand the request forever.

**Required evidence:** E2 + E4-local; failpoint/recovery checks.

**r2 reported result:** NOT_RUN. **Next treatment:** Crash-after-files/before-ready failpoint remains required.

## CH001-049

**Original requirement:** Invalid/overflow/missing-font failures do not automatically retry; eligible transient failures stop at the documented maximum of three total attempts. No infinite loop.

**Required evidence:** E2; error-policy/state tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Permanent/transient retry policy and maximum attempts still required.

## CH001-050

**Original requirement:** Repeat a fixed fixture in the same pinned render environment; compare outputs and record the visual tolerance/results. Inspect geometry/crop/text differences instead of blindly updating goldens.

**Required evidence:** E2 + visual; diff images/report.

**r2 reported result:** NOT_RUN. **Next treatment:** Fixed-environment repeated rendering plus visual difference inspection remains required.

## CH001-051

**Original requirement:** Final preview requests the exact immutable final JPEGs, not editor screenshots, optimized/re-encoded alternatives, or raw provider/source images.

**Required evidence:** E1 + E2; network/body-hash check.

**r2 reported result:** NOT_RUN. **Next treatment:** Core proof: exact worker-preview bytes plus the required E1 architecture inspection.

## CH001-052

**Original requirement:** Extract the ZIP and SHA-256 its images. Each equals both the manifest's hash and the final-preview response body for that slide.

**Required evidence:** E2; machine-readable hash comparison.

**r2 reported result:** NOT_RUN. **Next treatment:** Core proof: compare actual manifest/ZIP/preview hashes.

## CH001-053

**Original requirement:** Seven-slide export has exactly `01.jpg`–`07.jpg`, `post.txt`, and `manifest.json` in the agreed structure. Ordered slide IDs and visible content match the draft revision.

**Required evidence:** E2 + visual; ZIP structure and sequence assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Core proof: canonical structure/order; visible order also requires actual inspection.

## CH001-054

**Original requirement:** `post.txt` exactly matches the reviewed revision's title/caption/hashtags, including Unicode; manifest covers its hash/editorial identity.

**Required evidence:** E2; text and checksum assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Core proof: exact post bytes/hash; required Unicode cases must be covered before full PASS.

## CH001-055

**Original requirement:** Editing after render visibly invalidates current-preview/export readiness. A queued or historical render never silently becomes the new draft's current export.

**Required evidence:** E2; stale-state browser test.

**r2 reported result:** NOT_RUN. **Next treatment:** Edit-after-render stale-UI behavior still required.

## CH001-056

**Original requirement:** No originals/private metadata/secrets/raw rights files/absolute paths leak into the ZIP. Entries/download filename cannot contain unsafe paths or injected headers.

**Required evidence:** E2; content and path scan.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof export scan helps; cover full unsafe-entry/header/private-content cases.

## CH001-057

**Original requirement:** Repeated download reuses ready JPEGs and does not launch a new render. A packaging/storage failure produces a useful error, not a corrupt success download.

**Required evidence:** E2; call-count and failure tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Core proof covers ready-download reuse; packaging/storage failure remains required.

## CH001-058

**Original requirement:** Anonymous/foreign access cannot read final images or ZIPs even with a known artifact ID. A logged-in owner can still download a ready artifact while the worker is stopped.

**Required evidence:** E2; route and worker-down tests.

**r2 reported result:** NOT_RUN. **Next treatment:** Core proof covers worker-down owner download; anonymous/foreign route cases still required.

## CH001-059

**Original requirement:** Execute the complete original seven-slide journey through the UI, including edits, one duplicate/reorder operation, final preview, and export, with no provider credential.

**Required evidence:** E2; full browser test and representative ZIP.

**r2 reported result:** NOT_RUN. **Next treatment:** Core r3 proof: exact original seven-slide UI journey and real ZIP.

## CH001-060

**Original requirement:** Inspect real app screenshots and final output for readable typography, correct crop/composition, sensible spacing, and helpful error states. Include both canvas presets.

**Required evidence:** Visual/keyboard review at recorded build.

**r2 reported result:** NOT_RUN. **Next treatment:** Artifacts supplied for actual review; no automatic or invented visual/keyboard signoff.

## CH001-061

**Original requirement:** Test at a normal desktop viewport and a narrow viewport; record sizes. Main journey is keyboard-operable; no critical automated accessibility violations remain on those tested screens.

**Required evidence:** E2 + manual; screenshots and report.

**r2 reported result:** NOT_RUN. **Next treatment:** A label scan or two Enter presses alone is not complete accessibility/keyboard evidence.

## CH001-062

**Original requirement:** Lint, strict types, deployable build, and all established required test commands run with actual results. A zero-test/discovery failure cannot be reported as success.

**Required evidence:** E2; command log/exit codes.

**r2 reported result:** NOT_RUN. **Next treatment:** Record every actual command and count; small proof success is not full acceptance.

## CH001-063

**Original requirement:** Initial migrations run on an empty database and are safe on a second invocation. Web/worker do not race uncontrolled schema changes.

**Required evidence:** E2; migration/checksum assertions.

**r2 reported result:** NOT_RUN. **Next treatment:** Core proof: fresh migration and repeat invocation with actual DB assertions.

## CH001-064

**Original requirement:** Simulate storage unavailable/permission failure or bounded low-space behavior. Saving/rendering failures are visible; existing accepted content is not silently deleted or corrupted.

**Required evidence:** E2; failure injection and UI/state evidence.

**r2 reported result:** NOT_RUN. **Next treatment:** Controlled storage failure and visible safety behavior remain required.

## CH001-065

**Original requirement:** Secrets/canaries are absent from client bundles, normal logs, generated artifacts, Git diff, and browser-renderer environment. Runtime third-party telemetry/CDN requests are absent in the measured manual journey.

**Required evidence:** E1 + E2; scoped scanning/network report.

**r2 reported result:** NOT_RUN. **Next treatment:** Runtime network/secret-canary/bundle checks still required.

## CH001-066

**Original requirement:** A new reader can follow README installation/operation/troubleshooting. Document persistent volumes, stopping vs deleting data, running tests, limitations, and worker/host availability.

**Required evidence:** E1 + clean-run evidence; do not claim an independent human test unless one occurred.

**r2 reported result:** NOT_RUN. **Next treatment:** Proof run contributes clean-install evidence; honest docs review still required.

## CH001-067

**Original requirement:** UI wording/layouts/demo assets are original or properly attributed. Runtime/dependency/font sources/licenses are recorded; existing license is preserved and pending decisions are not silently finalized.

**Required evidence:** E1; provenance/dependency records.

**r2 reported result:** PASS (E1/source-only; historical). **Next treatment:** Prior reported E1 PASS; re-inspect actual provenance/license files at new code, do not finalize pending decisions.

## CH001-068

**Original requirement:** No unscoped providers, key forms, direct TikTok integration, fake connections/analytics, billing, scheduling, MP4, or marketplace functionality slipped into the patch.

**Required evidence:** E1; diff/dependency/navigation inspection.

**r2 reported result:** PASS (E1/source-only; historical). **Next treatment:** Prior reported E1 PASS; inspect new diff/dependencies/navigation, not only package keyword absence.

## CH001-069

**Original requirement:** Root state points to the real spec hash, active chapter, base/tested commit, handoff, and evidence. Parent requirement subsets remain partial/unreviewed as appropriate.

**Required evidence:** E1; state/traceability check.

**r2 reported result:** PASS (E1/source-only; historical). **Next treatment:** Update actual identities and partial state; no implied acceptance.

## CH001-070

**Original requirement:** Handoff lists all mandatory gates with PASS/FAIL/NOT_RUN, actual implementation/evidence commits, skipped checks, deficiencies, and real artifact locations.

**Required evidence:** E1; handoff/result-file consistency.

**r2 reported result:** NOT_RUN. **Next treatment:** Specific handoff/result/artifact consistency check required.

## CH001-071

**Original requirement:** All public/committed screenshots, traces, logs, and exports use synthetic/local demo data and are sanitized. Artifact hashes correspond to files that actually exist.

**Required evidence:** E1 + E2; artifact manifest/scan.

**r2 reported result:** NOT_RUN. **Next treatment:** Hash existing public artifacts after sanitization; no stale/circular manifests.

## CH001-072

**Original requirement:** No work on the next chapter, public release/tag/deployment, paid API request, account authorization, or public post occurs. Final implementation status is awaiting review, never self-accepted.

**Required evidence:** E1; diff, action declaration, state.

**r2 reported result:** PASS (E1/source-only; historical). **Next treatment:** Preserve scope and no self-acceptance; actual actions must be declared.

---

<a id="workflow-blueprint"></a>

## Workflow blueprint (unexecuted)

Resolve action tags to immutable SHAs before activation. Implement the new command first.

```yaml
# DESIGN BLUEPRINT, NOT A VERIFIED WORKFLOW.
# Luna must implement proof:ch001 and resolve official action tags to immutable
# commit SHAs before activating this file. Do not paste it in as a claim that
# the reviewed application already passes. No provider/repository secrets needed.
name: CH-001 live proof — NOT release acceptance

on:
  workflow_dispatch:
    inputs:
      implementation_sha:
        description: Approved new full implementation SHA to exercise
        required: true
        type: string

permissions:
  contents: read

concurrency:
  group: ch001-live-proof-${{ github.ref }}
  cancel-in-progress: false

jobs:
  live-proof:
    runs-on: ubuntu-24.04
    timeout-minutes: 45
    env:
      REQUESTED_SHA: ${{ inputs.implementation_sha }}
      CI: "true"
      CH001_RUN_ID: r3-${{ github.run_id }}-${{ github.run_attempt }}
    steps:
      - name: Validate dispatch and runner class assumptions
        env:
          REPOSITORY_PRIVATE: ${{ github.event.repository.private }}
        run: |
          set -euo pipefail
          [[ "$REQUESTED_SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "A full approved SHA is required." >&2; exit 1; }
          [[ "$REPOSITORY_PRIVATE" == "false" ]] || { echo "Review runner budget/policy before executing on a private repository." >&2; exit 1; }
      - name: Checkout approved implementation
        uses: actions/checkout@v6 # Resolve to reviewed immutable SHA before activation.
        with:
          ref: ${{ inputs.implementation_sha }}
          fetch-depth: 0
          persist-credentials: false
      - name: Record real checkout
        run: |
          set -euo pipefail
          [[ "$(git rev-parse HEAD)" == "$REQUESTED_SHA" ]]
          test -z "$(git status --porcelain --untracked-files=no)"
          echo "CH001_IMPLEMENTATION_COMMIT=$(git rev-parse HEAD)" >> "$GITHUB_ENV"
          echo "CH001_EVIDENCE_DIR=$GITHUB_WORKSPACE/artifacts/ch001r3/$CH001_RUN_ID" >> "$GITHUB_ENV"
          mkdir -p "artifacts/ch001r3/$CH001_RUN_ID/public"
          printf 'Limited CH-001R-r3 proof; not v0.1 acceptance.\nImplementation: %s\nWorkflow: %s\n' "$REQUESTED_SHA" "$GITHUB_WORKFLOW_SHA" > "artifacts/ch001r3/$CH001_RUN_ID/public/dispatch.txt"
      - name: Set up project-pinned Node
        uses: actions/setup-node@v6 # Resolve to reviewed immutable SHA before activation.
        with:
          node-version-file: .nvmrc
      - name: Install frozen project and browser dependencies
        run: |
          set -euo pipefail
          corepack enable
          pnpm --version
          pnpm install --frozen-lockfile
          pnpm exec playwright install --with-deps chromium
      - name: Probe Docker capability
        run: |
          set -euo pipefail
          docker version
          docker info >/dev/null
          docker compose version
      - name: Execute bounded live proof
        run: |
          set -euo pipefail
          node -e 'const p=require("./package.json"); if(!p.scripts?.["proof:ch001"]) { console.error("Luna must implement proof:ch001 before this workflow can run."); process.exit(1); }'
          pnpm proof:ch001
      - name: Upload sanitized evidence on success or failure
        if: ${{ always() }}
        uses: actions/upload-artifact@v5 # Resolve to reviewed immutable SHA before activation.
        with:
          name: ch001-live-proof-${{ github.run_id }}-${{ github.run_attempt }}
          path: artifacts/ch001r3/r3-${{ github.run_id }}-${{ github.run_attempt }}/public/
          if-no-files-found: warn
          retention-days: 14
      - name: State limited scope
        if: ${{ always() }}
        run: |
          echo "This job tests CH-001R-r3 live proof only. No release/v0.1 acceptance is granted by a green job." >> "$GITHUB_STEP_SUMMARY"
```
