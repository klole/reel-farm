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

Add a read-only, manually dispatched workflow following [the runner contract](03_RUNNER_AND_DISPATCH.md). It must accept a full implementation SHA, install pinned project tools/browser dependencies, build the actual final image, run the new bounded coordinator, and upload sanitized artifacts even when assertions fail.

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
