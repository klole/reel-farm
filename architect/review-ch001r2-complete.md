# CH-001R-r2 — Complete architect review and Luna MAX follow-up

**Target: v0.1.0. Verdict: REPAIR_REQUIRED. No live application passes are claimed.**

This is the consolidated reading/dispatch copy of the follow-up packet. It reviews the same original `bdd6540` implementation / `ad0dd5f` evidence submission, not a newly completed repair. It supersedes the earlier loose CH-001R repair instructions, while preserving the original North Star and all 72 acceptance requirements.

This single file includes the review, bounded assignment, evidence and environment rules, handoff protocol, and original acceptance contract. Companion JSON coverage/templates are in the ZIP; they are not necessary to understand the requirements here. When using only this file, refer to its sections and the existing repository packet rather than assuming every companion file was attached.

Set Luna's effort to MAX in its interface. The next work is implementation repair and verification, not v0.2 or provider integration.

## Contents

- [Starting prompt — CH-001R-r2 / Luna MAX](#start-prompt)
- [Architect review — original CH-001 submission](#review-verdict)
- [Luna MAX assignment — CH-001R-r2](#luna-assignment)
- [Acceptance coverage and evidence rules](#gate-evidence-rules)
- [Execution environment and CI escape route](#environment-ci)
- [Handoff and architect acceptance protocol](#handoff-review)
- [CH-001 — acceptance contract and evidence](#original-acceptance-tests)
- [Sources and review traceability](#sources)
- [Packet validation report](#packet-validation)


---

<a id="start-prompt"></a>

# Starting prompt — CH-001R-r2 / Luna MAX

Set Luna to MAX or the highest available effort setting, attach this packet, and run it in the existing `klole/reel-farm` workspace.

---

Execute **CH-001R-r2** as a bounded repair and verification continuation of CH-001, targeting **v0.1.0**. This is not a v0.2 assignment.

Read `01_REVIEW_VERDICT.md`, `02_LUNA_CH001R2_BRIEF.md`, the supporting evidence/environment/handoff rules, root agent instructions, and the original CH-001 packet before modifying code.

The reviewed implementation is `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`; the original evidence/handoff is `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. These are the same original submission, with **0 PASS, 0 FAIL, 72 NOT_RUN gates**. Preserve that history. Inspect any newer repository work; do not reset or overwrite it.

Implement the missing real test harnesses and a fail-closed aggregate verifier. Establish a disposable environment that can actually run PostgreSQL, the shipped Compose image, and the sandboxed worker/browser. Reproduce and repair the scoped findings R01–R11, especially container launch, sandboxing, save/upload preservation, truthful readiness, bounded recovery, and upload limits.

Run the real seven-slide UI journey and original 72-gate contract. Use the original evidence types: E1 for source-only gates, actual executed tests/lifecycle evidence where required, and real visual/keyboard inspection for those gates. Do not turn source scans into runtime passes. A recorded pending license decision is permitted where the original contract permits it.

Produce actual screenshots, the application-exported seven-slide JPEG ZIP, manifest/post/image hashes, preview-versus-ZIP byte equality, command reports, and fresh gate evidence. Do not merely return another plan or another set of guard scripts.

No fal.ai, ScrapeCreators, Pinterest, TikTok, publishing bridges, direct official TikTok API, scheduling, analytics, billing, MP4, public deployment, release/tagging, or v0.2 work. No provider spend or new paid infrastructure.

Return READY_FOR_ARCHITECT_REVIEW only when the mandatory original gates and required commands genuinely pass with retrievable evidence. Otherwise return BLOCKED with implemented harness progress and the exact remaining environment/implementation limitation. Keep root state `awaiting_review` and the accepted version unset.

Return the full implementation commit T and evidence/handoff commit E, actual command/gate counts, finding dispositions, artifact references, and scope declaration. Do not invent a file's containing commit SHA before committing it. Stop for architect review.


---

<a id="review-verdict"></a>

# Architect review — original CH-001 submission

## 1. Decision and reviewed identity

**Decision: REPAIR_REQUIRED. v0.1.0 is NOT_ACCEPTED. No v0.2 chapter is authorized.**

| Record | Exact value |
|---|---|
| Repository | `https://github.com/klole/reel-farm` |
| Original chapter | `CH-001-r1` |
| Original starting commit | `ce17fdf5cade9b91b46da86af943a8be651289f5` |
| Reviewed implementation | `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a` |
| Reviewed evidence/handoff | `ad0dd5fdd6764e4f3a40a6028720bff272130d42` |
| North Star reference | `NS-0.2` |
| North Star SHA-256 | `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d` |
| Authorized continuation | `CH-001R-r2` |
| Accepted application version | None |

The implementation-to-evidence comparison contains one commit and changes six documentation/evidence files, not application code. The evidence ledger names the supplied implementation SHA. The original acceptance file available in this conversation was checked against its repository Git blob SHA: `ae3de51811b3e740952352ce6272402a6d23c5da`. The bundled North Star root also matches the recorded SHA-256. These establish document identity, not runtime correctness. [S01–S05, S16]

The four specifically requested files were read at the evidence commit: `handoffs/CH-001.md`, `docs/evidence/CH-001/gate-results.json`, `docs/evidence/CH-001/README.md`, and `state/PROJECT_STATE.md`. Targeted source review also covered the verifier, guard scripts, editor/save commands, upload route, worker, Docker/Compose configuration, and focused security tests. This is not a complete security audit or an independently executed application acceptance run.

## 2. What the supplied evidence establishes

| Check | Luna's recorded result | Architect treatment |
|---|---|---|
| lint | Exit 0 | Reported execution, not independently rerun |
| typecheck | Exit 0 | Reported execution, not independently rerun |
| build | Exit 0 | Reported execution; not a Docker build or proof of runnable containers |
| unit tests | 6 passed | Reported isolated tests, not full user-journey evidence |
| security tests | 4 passed | Reported source-oriented checks; not runtime containment proof |
| integration | Exit 2 / NOT_RUN | Required harness missing and environment unavailable |
| browser E2E | Exit 2 / NOT_RUN | Required harness missing and environment unavailable |
| renderer tests | Exit 2 / NOT_RUN | Required harness missing and environment unavailable |
| Compose smoke | Exit 2 / NOT_RUN | Required harness missing and environment unavailable |
| aggregate verifier | Exit 1 | Checkpoint did not meet acceptance |
| Gate ledger | 0 PASS / 0 FAIL / 72 NOT_RUN | Preserve this historical result exactly |
| Seven-slide export/screenshots | Not produced | No artifact-based output or visual assessment possible |

Sources: [S01–S04, S06–S07, S13]. The repository's Actions query for the tested SHA returned zero runs; that query is not evidence about other SHAs or unrecorded local activity. [S17]

The evidence README points to ignored local logs rather than making those logs available through the reviewed commit. A file path written in an index does not establish that the reviewer can retrieve the file. The recorded successful commands are useful but do not close their broader parent gates. [S03]

**NOT_RUN is not FAIL.** There are not 72 demonstrated application defects. There are 72 gates without accepted evidence in this ledger. Separately, the source review identifies concrete implementation gaps and risks that require repair or reproduction below.

## 3. Positive architectural direction

The inspected source is consistent with the intended foundation: separate web and worker processes, database-backed projects and revisions, local accepted media, render requests linked to immutable revisions, an outbox, attempt-scoped render paths, and protected output endpoints described in the handoff. The server save command has row locking and a mutation record, and the worker has finalization checks. Those are appropriate starting mechanisms, not proof that their edge cases work. [S01, S08–S12]

The handoff is candid about missing execution. The repair must preserve that honesty while replacing the missing implementation and evidence. A public launch, feature-completion percentage, or assertion of production security is not justified.

## 4. Findings and required disposition

Severity labels prioritize work within CH-001. “Source-confirmed” means the code fact was inspected. “Expected consequence” means a reasoned consequence to reproduce, not a live failure witnessed by the architect. Every finding must be closed with a narrowly scoped repair and appropriate evidence, or a documented reproduction that disproves the suspected consequence.

### R01 — Required test commands are placeholder guards

**Priority: P1. Classification: source-confirmed missing implementation.**

`scripts/run-gated-check.ts` always exits 2 for integration, E2E, render, and smoke. Even a successful `SELECT 1`, configured base URL, present Playwright binary, or available Docker command ends in NOT_RUN rather than assertions. Merely moving the same code to a capable host cannot complete this checkpoint. [S06]

Replace those paths with real suites. Prerequisite checks may remain, but successful prerequisites must lead to discovered and executed tests. An absent test harness is a product/test implementation failure, not an external environment exception. Close with real reports plus a negative case proving that a missing suite cannot return success. Related gate: CH001-062 and all dependent behavioral gates.

### R02 — The aggregate does not evaluate the acceptance contract

**Priority: P1. Classification: source-confirmed verifier defect.**

`scripts/verify-ch001.ts` assigns every gate NOT_RUN, substitutes an empty gate array when its template cannot be read, embeds a fixed browser/environment statement, and calculates its final exit solely from command exit codes. The current guards prevent success, but replacing only those guards could produce exit 0 while the ledger still contains NOT_RUN or even no gates. [S07]

Require exactly the original 72 unique IDs, real result ingestion, gate-specific evidence, measured environment metadata, and fail-closed behavior. A suite exit 0 with zero tests, missing reports, stale reports, missing artifacts, failed review checks, or missing gate coverage must not yield verifier success. Test the verifier itself with deliberately invalid reports. Do not solve this by globally replacing NOT_RUN with PASS.

### R03 — The delivered container image is not yet proven buildable/runnable

**Priority: P1. Classification: source-confirmed construction risks; runtime outcome untested.**

The Dockerfile installs browser system dependencies in its build stage, then starts a separate runtime stage and copies `/app` and browser binaries. That does not transfer the build stage's installed operating-system libraries. It also attempts to create an `oss` user at UID 1000 on a Node base image. The official Node-image guidance documents an existing `node` user at that UID; inspect the exact pinned base and resolve any collision. [S12, W02, W04]

Use a deliberate final-image dependency and non-root-user strategy. Reuse or correctly rename an existing user, or choose an available UID with correct media-volume ownership. Do not enable root runtime or duplicate UIDs as an expedient fix. Build the final target from a clean checkout and launch a real renderer inside that final image under its shipped restrictions. A successful host `pnpm build` does not close this issue. Related gates: CH001-001, 003, 040, 044, 063.

### R04 — Chromium sandboxing is not explicitly enabled

**Priority: P1. Classification: source-confirmed configuration gap plus documented dependency behavior.**

The worker calls `chromium.launch` without `chromiumSandbox: true`. The security test only checks that worker source lacks the literal `--no-sandbox`. Playwright documents `chromiumSandbox` as defaulting to false. Source-text absence of that flag is therefore not evidence of an enabled browser sandbox. [S11, S13, W01]

Inspect the locked Playwright behavior, explicitly enable sandboxing, and prove the effective browser/container configuration on the reference environment. No permissive fallback after launch failure. Retain the small browser environment, non-root execution, and restricted mounts. Adjust only the necessary documented runtime settings; do not use privileged mode, broad capabilities, a Docker socket mount, or an unconfined security profile to get green tests. Related gates: CH001-044, 065.

### R05 — Upload refresh can replace unsaved editor content

**Priority: P1. Classification: source-confirmed overwrite path; lost-edit scenario to reproduce.**

The editor's `upload()` calls `load()` after an upload. `load()` replaces the document with the server revision, resets selection, and marks it saved. A successful upload is not proof that the current local edit buffer has been acknowledged. With a delayed save, a failed save, or a conflict, refreshing assets this way can restore an older server document over local work. [S08]

Create a regression that holds a save response, edits text, completes an upload, and checks text, selection, undo history, save status, and server head. Refresh assets independently of the edit buffer or establish an equally safe reconciliation flow. Do not hide the bug by disabling uploads whenever the user types. Related gates: CH001-017–019, 021, 034, 059.

### R06 — Queued saves capture stale heads and retries receive fresh identities

**Priority: P1. Classification: source-confirmed client logic; concurrency outcomes to reproduce.**

`saveLatest()` captures the expected revision before its queued task runs and creates a new mutation ID inside each outgoing call. The server already supports idempotent mutation replay, but this client path does not preserve a pending mutation identity across an uncertain response. A same-tab second save queued behind an unacknowledged first save can carry the old head; a dropped successful response followed by retry can look like a foreign conflict. [S08–S09]

Serialize using an acknowledged-head reference resolved at dispatch, preserve immutable payload plus mutation ID until the attempt is resolved, and keep newer local edits separate from an in-flight snapshot. Add delayed, lost, and reordered-response tests, a true two-tab conflict, and flush-before-preview coverage. Never fix a conflict by blindly overwriting the database head. Related gates: CH001-017–020, 055.

### R07 — Readiness can report capabilities that were not checked

**Priority: P1. Classification: source-confirmed status logic gap.**

`workerStatus()` returns storage ready without a storage probe and derives renderer readiness from heartbeat freshness rather than a proven browser capability. The worker publishes ready before its first browser launch and writes ready periodically even after degradation. The editor reads a worker status from the loaded bundle, without a continuously refreshed liveness calculation in the inspected path. [S08–S09, S11]

Separate process liveness, storage usability, and render capability. Use bounded probes or last-successful capability checks with explicit invalidation; do not render an expensive deck every heartbeat. Refresh the editor's status independently of its draft. Test missing browser dependencies, stale heartbeat, stopped worker, and storage failure. Saving should remain usable when only rendering is down. Related gates: CH001-005, 036, 064.

### R08 — Crash reclamation can bypass attempt limits

**Priority: P1. Classification: source-confirmed unguarded recovery path; lifecycle outcomes to reproduce.**

`markFailure()` checks `maxAttempts`, but stale-request reset requeues expired rendering work without that check, and claim increments attempts without refusing an exhausted request. Repeated crashes can avoid the normal failure handler. The two-minute deadline is checked before slides, not enforced as cancellation across every asset read, browser action, archive write, and finalization step. [S10–S11]

Enforce the chapter's maximum of three total attempts across normal failure, crash recovery, and duplicate delivery. Fence stale attempts and bound the whole attempt, including finalization. Test worker death repeatedly, a hang, a stale attempt finishing after a newer one, and crash-after-files/before-ready. Distinguish at-least-once delivery from exactly one accepted artifact. Related gates: CH001-045–049.

### R09 — Upload size checks happen after multipart parsing

**Priority: P1. Classification: source-confirmed order of operations; resource-bound consequence to test.**

The upload route calls `request.formData()` before it enforces file and aggregate byte limits. The inspected route does not establish the required streaming/request-body bound before full parsing. A post-parse File.size check is not evidence that an oversized or misleading-length incoming request was bounded during receipt. [S14]

Implement a bounded input path appropriate to the framework or prove an explicit, shipped upstream limit with actual tests. Keep it effective when Content-Length is missing or untrustworthy. Retain per-file validation and mixed-batch behavior. Use safely bounded adversarial fixtures rather than exhausting the test host. Related gates: CH001-022–024, 064.

### R10 — Resource readiness needs an actual wait-and-fail test

**Priority: P2. Classification: source-confirmed check style; flaky/permanent-failure risk to reproduce.**

The worker waits for document fonts and then samples each image's complete/natural-size state. There is no explicit awaited image-decode barrier in the inspected render path. A slow valid resource can therefore be classified as missing instead of being awaited within a bounded deadline. Missing-resource errors are then treated as permanent. [S11]

Use a real bounded readiness barrier and test delayed versus genuinely missing/corrupt inputs. Also exercise the original unsupported-glyph and overflow requirements rather than treating loaded font faces as proof every input glyph can be rendered. Do not turn every resource failure into a retryable error. Related gates: CH001-035, 041–042, 049–050.

### R11 — Evidence availability and state summaries need repair

**Priority: P2. Classification: source-confirmed documentation/evidence gap.**

Raw logs are referenced under an ignored local directory, the requested output artifacts do not exist in the handoff, and root project state says three focused security tests while the handoff and test source identify four. The gate reasons also apply one environment explanation to all gates, including source-review-only gates. [S01–S04, S13, S16]

Make compact sanitized evidence actually retrievable, record real artifact hashes, reconcile command counts, and evaluate each gate using its specified evidence type. Preserve the original submission as historical evidence. Do not treat a local path, future CI URL, or generated green badge as an artifact. Related gates: CH001-060–062, 066–072.

## 5. Corrections to the earlier repair framing

The original contract explicitly permits E1 source/provenance evidence for CH001-067, 068, 069, 070, and 072. Those gates do not need Docker merely to be evaluated. Visual and keyboard gates need real inspected output and an identified reviewer; do not pretend an independent human inspection happened when an agent performed it. Runtime gates still require runtime evidence. [S16]

CH001-067 says to preserve the existing license and record pending decisions without silently finalizing them. Therefore, a still-pending license decision is not automatically a CH-001 failure when properly recorded. Final distribution/legal qualification remains deferred. This packet grants no new licensing decision and makes no legal determination. [S16]

Do not rewrite the historical gate ledger to retroactively claim passes. Create a fresh repair-run ledger and let a subsequent architect review decide acceptance.

## 6. Authorized next step and acceptance boundary

Carry out CH-001R-r2 as specified in this packet. Produce real suites and a reproducible execution path first, then repair and verify the existing application. When the original 72 gates have appropriate evidence, required commands pass, the seven-slide output is retrievable, and findings are closed, return READY_FOR_ARCHITECT_REVIEW. Keep root state `awaiting_review` and accepted version unset.

If the permitted environments cannot execute the required stack, return BLOCKED with the actual harness improvements and an executable runbook. This is useful partial progress, but not application acceptance. No next feature chapter is authorized in either case.

## 7. Review limitations

No install, build, unit suite, PostgreSQL service, browser, Compose stack, render, or app export was executed by this architect during this review. The cited code consequences are static findings or hypotheses to reproduce, not claimed runtime failures. No screenshots or app outputs were available to visually inspect. This review did not mutate the GitHub repository or dispatch CI. Packet checks reported separately are documentation checks only.

Source keys resolve in [SOURCES.md](#sources).


---

<a id="luna-assignment"></a>

# Luna MAX assignment — CH-001R-r2

## 1. Mission

Finish the original v0.1.0 checkpoint by repairing and proving the existing implementation. The end result remains:

**Clean local install → owner setup/login → project → owned image uploads → seven editable slides → durable save/reopen → worker-produced preview → ordered JPEG ZIP.**

Use maximum available reasoning effort to implement, run tests, diagnose failures, and deliver evidence. Do not return another general plan, stop at scaffolding, or expand the feature set. Maximum effort does not authorize maximum scope.

Read the verdict before starting. It contains eleven specific findings, R01–R11. They are not eleven assertions of witnessed runtime failure: distinguish source facts from reproduction targets and document the outcome of each.

## 2. Authority and scope

Parent chapter: `CH-001-r1`. Follow-up: `CH-001R-r2`. Target: `v0.1.0`. North Star: `NS-0.2`, hash `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`.

The original 72 gate IDs and their required outcomes are unchanged. The original chapter and North Star under `architect/Luna_CH001_v0.1.0_Pack/` remain the scope authority. This packet refines the repair/evidence process and supersedes the earlier loose CH-001R dispatch, not the original product requirements.

Preserve the existing stack and useful implementation. Keep TypeScript/Next.js, PostgreSQL/Drizzle, pg-boss/outbox, local storage, a separate worker, and a shared browser renderer. Correct local architecture as needed to make those existing responsibilities testable, but no framework migration or whole-app rewrite without a concrete incompatibility.

Fixed future choices remain ScrapeCreators for Pinterest and one fal.ai key for selectable text and image models. They are NOT implemented here. Direct official TikTok Content Posting API integration remains explicitly forbidden, including developer registration, direct OAuth, approval work, and endpoint integration.

Also excluded: publishing bridges, any external AI/image/Pinterest call, provider key forms or SDKs, scheduling, Autopilot, analytics, billing, collaboration, public automation API, MCP, video/MP4, desktop wrapper, marketplace, deployment, release/tagging, and v0.2 work. No fake navigation or connection states for deferred features.

## 3. Initial repository check

Read root agent instructions, the original packet, this follow-up, and the requested handoff/evidence/state files. Record current branch, full HEAD, sanitized origin, tracked/untracked status, runtime/lockfile versions, and whether the reviewed implementation and evidence commits are ancestors of your starting point.

Reviewed implementation: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Reviewed evidence: `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. These identify the reviewed submission; they are not instructions to reset current main.

If HEAD equals the evidence commit, continue from it. If HEAD has advanced, inspect the intervening diff and preserve it. Documentation additions or clearly related CH-001 repair work may be incorporated after recording their exact scope. Do not discard newer work or claim this review covered it. An unrelated or incompatible changed baseline is BLOCKED_BASELINE for affected work, not permission to reset or force-push. Complete independent safe preparation where possible.

The prior handoff names two user-owned untracked files: `handoffs/luna-ch001-dispatch.md` and `logs/luna-ch001.jsonl`. Preserve them if present; do not assume they still exist and do not add them merely because the old handoff mentions them.

Use a focused branch/PR if supported by the session's existing repository authorization. Do not merge your own work, force-push, change repository permissions, or manufacture commit identities. This packet authorizes development work, not new remote infrastructure.

## 4. Work order

### Phase A — Establish a genuinely runnable verification path

Inspect Docker, PostgreSQL, the actual Playwright browser, container policy, storage paths, and available CI execution before spending the chapter changing the editor. Record probes and errors without credentials. Read [04_ENVIRONMENT_AND_CI.md](#environment-ci).

Implement the missing suites and a fail-closed aggregate. Repair R01 and R02 first. A valid configured environment must result in real assertions; it must not fall through to an intentional NOT_RUN message.

Build the final runtime image early. Address R03/R04 together: final-stage dependencies, UID and media ownership, actual sandbox-enabled browser launch, and safe runtime restrictions. Prove a minimal one-slide render through the real application/worker before investing in the full browser corpus. This small smoke is a diagnostic milestone, not checkpoint acceptance.

If the agent host cannot provide Docker, prepare the same tests for a permitted disposable host or existing repository CI. Do not spend the chapter repeatedly invoking the same environment guard. A workflow file alone is not execution evidence; retrieve an actual permitted run when available.

### Phase B — Repair the manual workflow and its invariants

Work through the findings, adding focused regressions alongside each repair.

For editor state, separate asset-list refresh from document replacement, preserve local buffers across failed or uncertain saves, and keep a stable identity for each retryable save operation. Resolve acknowledged head state at the appropriate dispatch point. A response for older text must never mark newer text saved. A real foreign-tab conflict must remain visible, with safe recovery rather than last-write-wins.

For status, distinguish an alive process from working storage and a usable renderer. A stale or degraded worker cannot be displayed as ready merely because the process recently wrote a heartbeat. Update status without reloading the draft.

For worker execution, enforce the maximum of three total attempts across crash reclamation as well as caught errors. A repeated delivery must not create competing accepted artifacts. A stale worker must not publish after losing its lease. Bound the whole operation and clean up only attempt-owned staging; preserve accepted originals and prior ready artifacts.

For uploads, bound bytes during receipt and parsing, not only after FormData has been materialized. Keep decoder limits, safe generated storage keys, correct EXIF behavior, user rights assertions, per-file batch results, and explicit failure cleanup. An upload failure cannot silently destroy the current draft.

For rendering, wait for actual required resources within a deadline, retain measured overflow failures, and demonstrate the original unsupported-glyph policy. The editor and worker must continue using the shared trusted layout implementation. Do not “repair” rendering with a second unrelated renderer or screenshots of the interactive editor.

Use minimal refactors that improve correctness and testability. Do not substitute cosmetic polish for the missing persistence/render/export behavior.

### Phase C — Execute the full original acceptance contract

Complete the original seven-slide `A little room to focus` fixture through the UI, including real owner login, local uploads, text changes, duplicate/reorder, save/reopen, preview, and export. Do not seed a completed project directly into PostgreSQL and call that the primary UI journey.

Exercise all three layouts and both 1080×1920 and 1080×1350 output presets in the renderer corpus. Use the exact original demo copy in the acceptance reference. Fixture setup for security/concurrency tests may use controlled DB utilities; that does not replace UI evidence for the primary journey.

Demonstrate revision immutability, two-tab conflicts, delayed/lost responses, repeated setup/migrations, retained media and exports after container recreation, worker-down editing, restart/reclaim, attempt ceilings, partial-finalization crashes, malformed uploads, missing/corrupt assets, and a controlled storage failure.

Prove every final-preview JPEG response body equals the corresponding JPEG entry and hash in the exported ZIP. Verify `post.txt` against the exact same immutable revision. A static renderer unit fixture is not the requested app-generated export.

Inspect actual screenshots and final images for readability, clipping, crop placement, usable errors, and both canvas formats. Record who or what performed the inspection. Use real keyboard interaction and an accessibility checker for the tested main screens. Do not mark visual/manual gates based only on the existence of PNG files.

### Phase D — Freeze, run, package, and stop

Commit the repaired implementation and tests as an identified implementation commit T. Run final verification against a clean T checkout or record an exact tree fingerprint when a strict clean checkout is genuinely unavailable. Evidence for an earlier changed implementation is not sufficient.

Capture reports, screenshots, sample export, manifest and byte hashes, lifecycle tests, source/provenance checks, and actual command logs. Prepare a separate evidence/handoff commit E without later code changes. Follow the commit protocol in [05_HANDOFF_AND_REVIEW_PROTOCOL.md](#handoff-review).

Return READY_FOR_ARCHITECT_REVIEW only when the original 72 gates have valid evidence, mandatory commands pass, all blocker findings are closed, and the artifacts can be retrieved. The architect still decides acceptance. Otherwise return BLOCKED with useful completed work and precise remaining causes. In either case, stop before the next chapter.

## 5. Required executable interfaces

Retain these root command names, or preserve compatibility aliases with an explicit mapping:

```text
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
pnpm test:integration
pnpm test:e2e
pnpm test:render
pnpm test:smoke
pnpm verify:ch001
```

Record `pnpm install --frozen-lockfile` and environment setup separately too. The aggregate may orchestrate child suites once rather than redundantly rerunning expensive cases. Every required interface must be callable independently under its documented prerequisites. If the aggregate reuses reports, their exact code/tree, environment, run identity, and checksums must be validated; stale reports must fail closed.

Use exit 0 only for completed passing checks, exit 1 for assertions/harness/report failures, and exit 2 only for genuinely unavailable external prerequisites with explicit reasons. The aggregate should use exit 1 for any incomplete checkpoint, including a child exit 2. Preserve actual child codes in its report.

No silent skips, zero-test success, `continue-on-error` acceptance, or replacement of browser/database tests with source-string scans. Existing source tests can remain as supplementary checks, not runtime proof.

## 6. Regression requirements for findings

| Finding | Minimum new proof |
|---|---|
| R01 | Each required live command discovers tests and executes assertions on a capable environment; no all-success prerequisite path intentionally returns NOT_RUN. |
| R02 | Verifier rejects missing/duplicate/unknown IDs, empty suites, stale reports, missing evidence, hash mismatch, command failure, NOT_RUN, and unreadable original contract. |
| R03 | Final image builds; non-root user/volume permissions work; sandboxed browser launches inside the shipped image, not just on the host. |
| R04 | Effective launch configuration and environment are checked; no disabling sandbox argument or permissive fallback; production confinement still holds. |
| R05 | Upload during delayed/failed/conflicted saves preserves text, selection, undo history, and honest save state. |
| R06 | Two same-tab queued saves, a dropped successful response, true two-tab conflict, and flush-before-preview all preserve content and exact revision identity. |
| R07 | Stop/restart, stale/degraded heartbeat, missing browser, and unavailable storage produce truthful distinct readiness states. |
| R08 | Repeated crashes stop at three total attempts; stale completion cannot win; timeout and partial-finalization recovery remain bounded. |
| R09 | Oversized or misleading-length input is bounded before full parsing while valid/mixed batches still work. |
| R10 | Delayed valid resources are awaited, missing resources fail, unsupported glyphs/overflow follow the original contract. |
| R11 | Reports and actual artifacts are available, counts agree, checksums verify, source-review gates use correct evidence rather than a blanket environment reason. |

These are grouped regression scenarios, not a requirement to create eleven test frameworks. Use small shared fixtures and helpers. Preserve the original gate mapping and connect each finding to its relevant tests.

## 7. Practical execution constraints

Do not weaken strict types, delete inconvenient tests, alter expected results to accept broken behavior, publish private media, skip real authentication, or expose unauthenticated production test hooks. Prefer injected test dependencies and runner-controlled fixtures. A failpoint must be unavailable in ordinary production operation.

Do not exhaust host memory to test resource bounds. Use synthetic capped inputs and isolated limits. Do not weaken kernel/container security globally to make Chromium launch. No paid provider activity, hosted database purchase, paid runner purchase, or new cloud machine under this packet.

Check lockfile/runtime compatibility against official sources when necessary. Use the existing pins initially; make only justified compatibility/security updates and record them. Do not silently move to `latest`, canary, or an unrelated major stack.

Never ask Kyle again which image/search/publishing providers were selected. Those are already fixed and outside this chapter.

## 8. Stop criteria

Successful implementation delivery: all mandatory original gates PASS with their prescribed evidence; all required commands, including the aggregate, pass; a real seven-slide export and screenshots are reviewable; findings are resolved; state remains awaiting review and no release occurred.

Blocked delivery: exact environment or implementation blocker recorded; completed code/harness work committed when authorized; all remaining gates honestly FAIL or NOT_RUN; an executable remaining runbook supplied; state unaccepted. Do not turn a blocked outcome into v0.2 authorization or create another generic planning packet instead of implementing the bounded work.


---

<a id="gate-evidence-rules"></a>

# Acceptance coverage and evidence rules

## 1. Preserve the original contract

There are exactly 72 mandatory CH-001 IDs, CH001-001 through CH001-072. The original procedures and evidence types are preserved verbatim in [reference/ORIGINAL_ACCEPTANCE_TESTS.md](#original-acceptance-tests) and copied into [gate-coverage.plan.json](CH001_Review_Followup_r2/gate-coverage.plan.json). The JSON is a coverage plan; every initial status is NOT_RUN. It is not a fresh execution report.

Do not delete, renumber, weaken, or silently defer these gates. Do not treat all mature North Star requirements as due now. One gate may have multiple assertions and one parameterized test may support multiple gates, but each assertion needs an explicit coverage link.

## 2. Evidence is gate-specific

E1 is identified source/configuration/provenance inspection. E2 is actually executed automated tests. E4-local is actually exercised process/storage/restart behavior in a named environment, which may be a permitted CI host running the local stack. “Local” describes the tested self-hosted application pipeline, not a requirement to use Kyle's personal laptop.

The source-only gates are CH001-067, 068, 069, 070, and 072. Assess them with the documented inspection, not a Docker prerequisite. Other gates explicitly mix source, tests, lifecycle, visual, or keyboard evidence. Preserve those combinations. CH001-060 requires actual visual/keyboard review; CH001-061 combines executed checks with manual/keyboard observations. The original CH001-066 needs documentation review and a clean run, not a fabricated independent-reader study.

A source check saying `chromiumSandbox: true` exists does not prove the effective sandbox. A screenshot of “Saved” does not prove the DB commit. A JPEG hash match proves byte identity, not typography or composition quality. These evidence types complement one another.

PASS means every required part of that gate was checked and passed. FAIL means an executed assertion or inspection found a violation. NOT_RUN means required evidence was not obtained; include which portion is missing and why. A partly checked gate remains NOT_RUN unless a demonstrated violation makes it FAIL. Keep partial observations without upgrading the whole gate.

## 3. Suite organization

The following logical suites are a proposed organization, not existing commands or results. File names may vary if the mapping is documented.

| Logical suite | Coverage purpose |
|---|---|
| UNIT | Canonical hashing, schema boundaries, error classification, editor transitions, stable IDs, result-validator negative cases. |
| DB | Disposable real PostgreSQL, ownership, revision immutability, save replay/conflict, outbox transaction, migrations, artifact finalization. |
| HTTP | Real login/session/CSRF/authorization matrix, protected media/export routes, actual uploads and failure boundaries. |
| UI | Primary user journey, uploads during edits, save states, navigation, undo/redo, two tabs, network response faults, stale preview. |
| RENDER | Pinned worker/browser corpus, all layouts/ratios, decode/font readiness, glyphs/overflow, containment, exact export bytes. |
| LIFECYCLE | Clean Compose setup, rerun preservation, container recreation, worker death/reclaim, crash boundaries and bounded retries. |
| SECURITY | Runtime canaries, origin/auth checks, private paths, upload limits, network observation, effective renderer containment. |
| VISUAL | Actual output inspection, both canvas presets, desktop/narrow usability, keyboard path, accessibility report. |
| DOC | Provenance/scope, state and commit traceability, handoff consistency, sanitized evidence accessibility. |

Root integration/security/browser/render/smoke commands may share these helpers. Do not mock PostgreSQL in the real DB suite, replace the worker with a fake render completion in the primary journey, or seed an authentication bypass into the app.

The coverage plan maps every gate to one or more suites. It deliberately does not mandate 72 test files, an enterprise test platform, or a rewritten architecture.

## 4. Canonical output and fixtures

Use the original `A little room to focus` demonstration, its seven slide texts/layout roles, post title, caption, and hashtags from the reference. Generate fixture images locally from reproducible code; use obvious off-center crop markers. No provider keys, external image source, stock subscription, or scraped content.

Retain the original fixture families: portrait/landscape/square, transparent PNG, EXIF-rotated JPEG, static WebP, identical bytes under a second filename, safely generated corrupt/misleading/animated/limit fixtures; newline/accented/long/unsupported text; two tabs, foreign workspace, missing/corrupt media, pending render, dropped save response, worker stop, and finalization crash.

The canonical primary journey must use the UI. Additional API/DB fixtures may make adversarial cases precise. The required download contains exactly `01.jpg` through `07.jpg`, `post.txt`, and `manifest.json`, in the original structure. Do not substitute PNG or a video.

For every slide, record the final-preview response-body SHA-256, ZIP-entry SHA-256, manifest SHA-256 value, dimensions, bytes, and slide ID. Assert all three hashes agree and IDs/order match the saved revision. Hash `post.txt` and compare its exact content to that revision. Do not compare only URLs, filenames, or visual similarity.

## 5. Artifact availability

Keep full sensitive raw outputs in an ignored run-specific directory. Publish or commit only sanitized evidence from synthetic data. For GitHub review, provide actual small evidence files or an actually created downloadable artifact with an exact run/artifact reference. A future URL, ignored directory name, or nonexistent screenshot path is not acceptable evidence.

Required review artifacts include: Projects/editor/alternate-format/final-preview screenshots; overflow or save-conflict and worker-down screenshots; a successful download/result view; the real seven-slide ZIP; image/post/manifest hashes; browser/renderer/font environment; layout corpus comparisons; migration/concurrency/recovery assertions; security/network/accessibility summaries; command reports with executed/skipped counts; and the gate ledger.

Do not attach font binaries from this conversation or the architect environment. The implementation must obtain fonts through its declared sources. Do not include user databases, real uploads, live credentials, cookies, traces containing secret request bodies, or unredacted setup-token output. Inspect traces before making them public; synthetic data alone does not make auth headers safe.

## 6. Aggregate verifier contract

The implementation must validate these conditions before reporting an accepted-evidence candidate:

1. The original gate source was successfully loaded and has exactly the expected IDs, each once. Missing source is a failure, not an empty pass.
2. Each required suite discovered and executed tests, with legitimate nonzero counts. Commands retain their real exit status; skips affecting mandatory coverage fail the checkpoint.
3. Each gate has its required evidence type, a run/test/review reference, the exact tested implementation commit or tree, and an actual evidence path/hash. Do not infer individual assertions from a suite's exit code alone.
4. All evidence is from the same identified implementation, or an explicitly compatible unchanged tree checked by the verifier. Missing/stale files, mismatched hashes, and unbound records fail.
5. Manual/source/visual reviews identify the inspecting agent or person and what was inspected. No blanket automated PASS for a human/visual requirement.
6. Every mandatory gate is PASS. Any FAIL or NOT_RUN yields an overall nonzero result. No removed gate, silent waiver, or empty denominator.
7. The artifact manifest and command reports are present and retrievable in the final evidence package. The final output hash comparison actually passed.

At the suite level, code 2 may mean unavailable external prerequisites. A missing test implementation, malformed report, or discovered regression is code 1. The aggregate returns 1 for any incomplete chapter, preserving child outcomes.

Suggested negative validator tests: missing contract; 71 gates; duplicate ID; unknown ID; all commands green but one NOT_RUN gate; zero discovered tests; absent visual review; missing JPEG; false checksum; prior-SHA report; unclosed P1 finding; and a failing child process hidden behind a successful shell pipeline. Valid fixtures for validator unit tests are test-only report examples, not application gate passes.

## 7. Avoid a paperwork deadlock

Do not require live evidence where E1 is the contract. Do not require a finalized new license where CH001-067 explicitly allows a recorded pending decision. Do not require a file to contain the SHA of the commit that will contain it; use the two-commit handoff protocol.

Conversely, source inspections and honest declarations do not waive real browser, database, render, or lifecycle requirements. A test harness that has only been written is progress but does not complete those gates. Keep blocked reasons precise enough to distinguish missing infrastructure, missing harness, actual application failure, and unavailable review evidence.


---

<a id="environment-ci"></a>

# Execution environment and CI escape route

## 1. Objective

Provide one reproducible, disposable environment that can run the shipped web, PostgreSQL, media volume, separate worker, and locked browser. Missing Docker on the previous agent host is an observed limitation of that run, not a permanent product assumption.

The repair should yield both real tests and instructions a reviewer can execute. A Dockerfile, workflow YAML, or `SELECT 1` alone is not a successful environment test.

## 2. Choose a permitted execution route

Preferred: a Docker/Compose-capable disposable host running the repository's final runtime image. This covers the shipped installation path and container lifecycle.

Alternative diagnostic route: directly run disposable PostgreSQL, the built web/worker, and the matching managed Chromium on a permitted host. It can establish DB/browser behavior, but it does not prove the Compose clean-install/recreation gates. Those remain open until actually exercised.

CI route: add a bounded verification workflow in the existing repository, using available, authorized execution only. Follow the official Playwright CI pattern—install pinned dependencies and browser requirements, run tests, retain reports—but adapt it to this repo's exact lockfile and safety constraints rather than copying `latest` or wildcard versions. [W03]

A prior query returned no Actions run for the reviewed implementation SHA. No CI execution is assumed available or successful. Do not buy a runner, provision a cloud VM, enable billing, change repository settings, or add external account secrets. If existing permissions or runner availability prevent execution, commit the runnable harness/workflow under the session's authorization and return BLOCKED with the exact remaining command. Do not keep repeating the old unsupported-host command.

## 3. Preflight capabilities

Record actual Node/pnpm versions, lockfile hash, OS/architecture, Docker client and daemon reachability, Compose version, browser executable/version, final image identity, media path ownership, PostgreSQL availability, and security policy limitations. A Docker client binary without a reachable daemon is not Docker availability.

Do not hardcode the previous Debian/Chrome environment into a new report. The old host's system Chrome can be diagnostic information, but arbitrary browser substitution must not become the validated renderer baseline. Use the pinned managed browser or an explicitly documented compatible test profile, and keep output baselines environment-specific. [W01–W02]

Reuse locked package/runtime versions initially. If a pin or image fails to resolve or is incompatible, record the exact observed failure, use official sources to select a minimal fix, and update the lock/provenance deliberately. Do not invent a dependency version or silently upgrade the entire stack.

## 4. Disposable resource contract

Every test run needs a unique run ID, isolated database/media storage, synthetic owner credentials, and a dedicated Compose project name such as `oss-ch001-test-<run-id>`. Pass the explicit project name on every orchestration command and inspect effective configuration. Docker documents `-p` as taking precedence over the Compose file's top-level name. [W05]

Never test against Kyle's ordinary database, `.env`, media folder, or default production-like Compose project. The test utility must refuse destructive setup without a run-owned marker and an allowlisted disposable resource identity. Do not accept an arbitrary DATABASE_URL as permission to reset it.

Use a test env file generated outside committed config. Do not overwrite the user's env file. Bind web only to loopback on an available test port, matching APP_ORIGIN and browser requests. Any test-only database access must stay within the isolated network or an explicitly loopback-only test binding, not alter shipped defaults.

Container recreation tests must preserve the test volumes so persistence is actually tested. Volume deletion is allowed only for final cleanup of verified run-owned resources. Compose's volume-removal flag is destructive; never invoke it against the user's default project. [W06]

Record IDs and before/after hashes for the test project/revision/media/export, without copying secrets. Do not report only that containers restarted.

## 5. Final-image and sandbox checks

Fix the final image, not merely the build container. Browser binaries and their operating-system dependencies must be available in the runtime stage. Verify the selected non-root identity and writable media/cache paths. Inspect the base image's existing UID assignments before creating another user. [S12, W02, W04]

The worker's actual browser launch must enable sandboxing. Test the effective launch and process configuration under the shipped restrictions; record sanitized evidence. No fallback to `--no-sandbox`, privileged containers, broad added capabilities, host Docker socket, or unconfined policy. A documented narrow security-profile adjustment may be necessary; qualify it rather than disabling isolation. [S11, W01–W02]

Keep the renderer's environment allowlist and test that synthetic authentication/database canaries do not enter the browser subprocess. Process environment redaction is not the entire sandbox proof, and a container boundary is not automatically evidence of browser sandboxing.

Use a final-image browser startup self-check as part of readiness. Avoid repeatedly launching full browsers just to update a status badge. Distinguish cached successful capability checks from untested startup assumptions.

## 6. Harness structure and orchestration

Luna may introduce helpers such as `tests/helpers/environment.ts`, `tests/helpers/fixtures.ts`, `tests/helpers/faults.ts`, and a safe `scripts/ch001-test-env.ts`. Those are proposed paths, not files this review claims exist.

Keep service startup/teardown separate from assertions. Use bounded readiness polling and failure diagnostics, not guessed fixed sleeps. Test-specific synchronization may control a lost response, queue claim, or finalization boundary deterministically. Inject faults in isolated test code or guarded internal interfaces, never a public unauthenticated endpoint.

Install dependencies and browser packages before the runtime network-observation window. Then deny or monitor external runtime traffic while allowing the local web/database communication needed by the app. Record the observation boundary and components monitored. A page-level network hook alone must not be called full-process network isolation.

On failure, preserve sanitized diagnostics before cleanup. Terminate run-owned child processes and containers, not arbitrary processes on the host. Keep raw sensitive traces private unless actually scrubbed.

## 7. CI requirements

An allowed workflow should use a fixed supported Linux runner profile and exact application/runtime pins, a locked install, bounded execution, isolated Compose resources, and the same root commands as local verification. Default repository token permissions should be read-only (`contents: read`); no deployment job or provider credentials belong here.

Do not execute untrusted PR code using privileged triggers or publish reports to a new public website. Retain sanitized artifacts through the repository's existing artifact mechanism. Record the real run ID, head SHA, jobs, artifact ID/name, and retention/access limitations. Redact tokens/cookies/connection strings; no environment dump.

Do not hide failed tests with `continue-on-error`. An upload-artifact step can run after a failed test so diagnostics survive, but uploading reports is not test success. Confirm the command/test ledger, not just a green workflow label.

The CI path is a way to run the same tests on capable infrastructure, not a waiver for the reference environment. A directly hosted DB test does not replace testing the app's actual Compose image.

## 8. Honest blocked outcome

When execution is genuinely impossible after bounded permitted attempts, return the completed harnesses, exact environment probes, unexecuted commands, and the needed capability. Keep runtime gates NOT_RUN and any demonstrated defects FAIL. Explain whether failure is missing Docker daemon, sandbox restrictions, unavailable browser dependencies, missing permission, or an application problem.

A missing implementation is not an environment limitation. Finish the real harness code even when its live execution cannot be completed on the present host. Do not start providers or the next chapter while waiting for a capable environment.


---

<a id="handoff-review"></a>

# Handoff and architect acceptance protocol

## 1. Preserve the submitted history

The reviewed original evidence remains at `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. Its 72 NOT_RUN results are historical facts. Do not edit them into supposed original passes.

Create a new repair handoff at `handoffs/CH-001R-r2.md` and, if preserving the existing mirrored convention, `state/handoffs/CH-001R-r2.md`. Store the fresh run index/ledger under `docs/evidence/CH-001R-r2/`. Update the old CH-001 evidence README to link to the repair run rather than erasing the old result. Root state should point unambiguously to the current repair evidence.

Do not change frozen files under `architect/.../reference/north-star/`. Product scope, licensing proposals, provider choices, and future roadmap acceptance are not rewritten to make a gate pass.

## 2. Exact commits without a self-reference loop

Use two identities:

- **T: implementation commit.** Includes application, tests, configuration, fixtures, and verifier changes. Run final verification against that identified tree. Record whether it was clean, and the tree/lock/browser/build hashes used.
- **E: evidence/handoff commit.** Adds reports and documentation referring to T, after the run. It must not silently add untested implementation changes.

A tracked file cannot practically contain the final SHA of the commit that will contain that exact file. Do not keep creating commits to chase that self-reference. In-file metadata may identify T, the evidence path/run ID, and that E is its containing commit. After committing, return the exact full E SHA and URL in Luna's final message. The next reviewer resolves E and checks T..E is evidence/documentation-only.

If code or tests change after the purported final run, create a new T and rerun affected coverage plus the aggregate as required. Preserve previous run records as history. An unchanged app source tree with changed tests still needs a clearly identified tested revision; do not use ambiguous HEAD labels.

## 3. State updates

Update `state/PROJECT_STATE.md`, `state/REQUIREMENT_STATUS.md`, and `state/EVIDENCE_INDEX.md` with the actual base, active continuation, target, North Star hash, tested commit, handoff, and evidence path. Preserve parent requirement subsets as partial where the mature scope is still deferred.

Root state remains `awaiting_review`, accepted version remains unset, and a successful delivery may state `ready_for_review` in its implementation handoff. A blocked delivery must explicitly say BLOCKED and identify the missing evidence; it is not a successful v0.1 release.

This packet does not grant Luna architect acceptance authority. Do not create a release/tag, change the project to accepted, merge a PR under this chapter, or start a next feature chapter.

## 4. Required handoff sections

### Control record

Record chapter `CH-001R-r2`, parent `CH-001-r1`, repo/branch, starting commit, T, exact tested tree, North Star hash `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`, run ID, execution host, status, and E in the final external response. Include the diff scope from the reviewed baseline and any intervening changes.

### Commands and actual counts

For install/setup and every required root check: command, UTC start/end, exit code, discovered/executed/passed/failed/skipped counts where meaningful, and actual log/report path. Distinguish typecheck/build commands from test suites. Never attach zero tests to a PASS test suite.

### Gates and findings

List all 72 IDs with PASS/FAIL/NOT_RUN and evidence links. Report totals calculated from the ledger. For R01–R11, identify the repair, reproducer/test, actual outcome, and any remaining limitation. A suspected consequence may be disproved by a precise regression; record that evidence rather than claiming an unnecessary fix.

### User journey and output

State whether the real seven-slide UI journey completed. Include project/revision identifiers from synthetic data, all required screenshots, the actual ZIP, post/manifest/image hashes, and final-preview body comparisons. Label screenshots with build/environment and what they demonstrate.

### Lifecycle and containment

Summarize migration reruns, owner setup race, process/container restarts, worker recovery/attempt limits, lease fencing, storage failures, sandbox and browser-env checks, runtime network observation, and auth/upload containment. Explain exactly which tests were real versus isolated or simulated.

### Limitations and actions

List remaining defects, unavailable environments, skipped evidence, and support-matrix limits. Declare provider calls, spend, social authorization, publishing, deployment, releases, Git writes, and CI activity accurately. Do not say “no network” if packages or CI were used; distinguish install/test infrastructure from forbidden provider runtime calls.

## 5. Acceptance checklist for the next architect review

A new implementation can be considered for acceptance only when the original 72 gates have their specified evidence, all mandatory executable checks pass, blocker findings are resolved, real artifacts are available, and the supplied commit identities match the tested code.

The next reviewer must still inspect the code changes and evidence. All-green counts are necessary here but not sufficient if tests are vacuous, artifacts are inaccessible, a serious source defect remains, or scope drift occurred. Do not derive a feature-completion percentage from the count.

Expected decision choices:

| Decision | Meaning |
|---|---|
| ACCEPTED | Architect has independently reviewed the candidate evidence and implementation sufficiently for this bounded checkpoint. Not a public security guarantee. |
| REPAIR_REQUIRED | In-scope defects, incomplete assertions, or misleading/missing evidence require another bounded pass. |
| BLOCKED | A necessary external capability or unresolved baseline issue prevents completing the required review evidence. |

Neither REPAIR_REQUIRED nor BLOCKED authorizes v0.2. READY_FOR_ARCHITECT_REVIEW is Luna's delivery status, not the architect's acceptance verdict.

## 6. Final Luna response template

```text
Status: READY_FOR_ARCHITECT_REVIEW | BLOCKED
Chapter: CH-001R-r2; target v0.1.0
Repository/branch:
Starting commit:
Implementation commit T (full SHA + link):
Evidence/handoff commit E (full SHA + link):
Tested tree/clean status:

Commands: each required command, exit code, actual test counts, evidence reference.
Gate totals: PASS / FAIL / NOT_RUN; total must be 72.
Finding disposition: R01–R11, each linked to repair/test or disproof.
Seven-slide UI journey: completed / not completed; reason.
Artifacts: actual screenshots, ZIP, manifest, hash comparison, logs, runtime records.
Remaining blockers/limitations:
External-action declaration:
Root state: awaiting_review; accepted version: unset.
Next action: architect review; no next feature work started.
```

Keep it factual and brief enough to navigate, with the detailed evidence in the repository. Never claim successful runtime work that was only planned or source-inspected.


---

<a id="original-acceptance-tests"></a>

# CH-001 — acceptance contract and evidence

**Applies to:** CH-001-r1 / target v0.1.0.  
**Status:** required tests to implement and execute; no application results exist in this planning packet.  
**Primary assignment:** [CHAPTER_BRIEF.md](https://github.com/klole/reel-farm/blob/ad0dd5fdd6764e4f3a40a6028720bff272130d42/architect/Luna_CH001_v0.1.0_Pack/CHAPTER_BRIEF.md).

## 1. What counts as completion

All 72 behaviors below are required gates within this checkpoint's stated scope. They can be covered by grouped/parameterized tests; this is not a requirement for 72 test files or 72 separate test frameworks. A gate can require both an automated assertion and visual/manual evidence.

Use these evidence labels consistently: `E1` means inspected code at an identified commit; `E2` means executed automated local tests; `E4-local` means actually exercised process/storage/restart behavior in a named environment. No `E3` external-provider qualification is expected or authorized here.

An unrun mandatory gate is `NOT_RUN`, not `PASS`. A framework reporting zero discovered tests is not a passing suite. A mocked queue/browser/storage result cannot substitute for the real local pipeline. Do not mark a whole parent requirement complete merely because its CH-001 subset passes.

## 2. Required command contract

Create the following scripts or explicitly map existing equivalent commands in `COMMANDS.md`. These names are proposed interfaces to establish, not commands the architect claims already exist.

| Command | Substantive work it must do |
|---|---|
| `pnpm lint` | Run configured lint rules over relevant app/worker/shared/test code. |
| `pnpm typecheck` | Strict TypeScript checking across all actual workspaces. |
| `pnpm build` | Build the deployable web and worker artifacts, including the shared renderer. |
| `pnpm test:unit` | Document validation, edit transitions, hashing, formatting, error policy, and other isolated logic. |
| `pnpm test:integration` | Real PostgreSQL/storage command tests, transactions, authorization, revision conflicts, queue handoff. |
| `pnpm test:e2e` | Real authenticated browser journey against the running app and worker. |
| `pnpm test:render` | Pinned-browser layout, overflow, missing-resource, image validity, and preview/export checks. |
| `pnpm test:security` | Focused auth/CSRF/ownership/upload/render containment/secret-canary regressions. |
| `pnpm test:smoke` | Disposable clean Compose installation, main workflow, stop/restart preservation, and health checks. |
| `pnpm verify:ch001` | Run or orchestrate the complete required set, preserve exit codes, produce a gate/result summary. |

Document setup prerequisites, command order, service lifecycle, output locations, and cleanup guards. Commands may share helpers; avoid running expensive cases repeatedly just to inflate counts. Record each actual invocation, timestamp, exit code, tested commit/tree, and result path. CI may run the same scripts with isolated resources and read-only repository permissions. No deployment/publishing steps or provider secrets belong in this workflow.

A shell pipeline must preserve the actual failing command's exit status. A log uploaded from an earlier code commit is not evidence for a later changed implementation. Do not hide skipped/failing checks behind the aggregate command.

## 3. Fixture corpus

Use generated or legitimately redistributable local fixtures. Commit the fixture-generation code and source/license notes; do not use images scraped from a competitor or Pinterest for these tests. Do not share font binaries from the architect's environment. Tests use fonts obtained through the implementation's documented dependency/source process.

Required image fixtures: a portrait image with a clearly off-center subject marker; a landscape image; a square image; a transparent PNG; an EXIF-rotated JPEG; a static WebP; an identical-byte duplicate under a different filename; a corrupt/truncated file; an HTML/SVG file disguised as an image; an animated image; a compressed/declared-dimension limit fixture; and malicious display filenames. Limit fixtures should be generated safely rather than allocating an enormous image in the test runner.

Required text fixtures: a short headline; deliberate newlines; accented Latin text such as `Café, résumé, mañana`; common quotation marks/em dash; a long unbroken token; maximum-length valid input; overflowing-but-schema-valid content; unsupported font ID; unsupported glyph/script behavior; literal HTML/script-like text; and invalid/nonfinite/internal numeric values.

Required state fixtures: two tabs on one saved revision; a second workspace/owner created only by controlled test setup; a missing accepted asset; a corrupted accepted derivative; a pending render; a renderer timeout; a paused/stopped worker; a simulated lost save response; and a crash during render finalization. Test-only injection must not be exposed as an unauthenticated production endpoint.

### Original seven-slide demonstration

Use the working project title `A little room to focus`. This is a synthetic demonstration, not a testimonial or a claim of improved productivity. Use simple original fixture images with clear crop markers.

| Slide | Layout / role | Headline | Supporting text |
|---|---|---|---|
| 1 | Photo caption / hook | Make room for one thing | An original demo about arranging a small workspace. |
| 2 | Editorial card / body | Start with the surface | Move the items you are not using into a tray. |
| 3 | Photo caption / body | Keep the next tool nearby | This example uses a notebook, a pen, and a glass of water. |
| 4 | Editorial card / body | Give small items a place | A single container is enough for this example. |
| 5 | Statement / body | Leave some space open | Let the main subject have room in the composition. |
| 6 | Photo caption / body | Choose your next step | Write one small task before adding more. |
| 7 | Statement / cta | Make it your own | Replace these slides with your own images and words. |

Post title: `A little room to focus`.
Caption: `A seven-slide example created entirely with local images and manual text.`
Hashtags: `#workspace`, `#slideshow`.

The text is original fixture material. Luna may adjust line breaks or choose appropriate starting font sizes for readable output without weakening maximum-input/overflow tests.

## 4. Gate matrix

### A. Installation and local operation

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-001 | From a clean checkout/disposable environment, follow the written setup and Compose instructions. Reach first-owner setup without undeclared manual fixes. | E2 + E4-local; setup log and environment record. |
| CH001-002 | Repeat setup/start. Existing generated secrets, owner, database records, and media remain intact; no silent reseed or reset. | E2 + E4-local; before/after record/hash checks. |
| CH001-003 | Inspect and exercise network binding. Only the web surface is host-published on loopback; database and worker are not publicly bound. | E1 + E2; sanitized Compose config/assertions. |
| CH001-004 | With provider credentials absent and external runtime requests denied/monitored, complete the manual workflow. Dependency/image pulls are outside this runtime observation window. | E2; network assertions/log summary and export. |
| CH001-005 | Stop the worker. The editor/save/local media remain usable; status becomes degraded and a requested render honestly waits. Restart restores readiness. | E2 + E4-local; state transitions/screenshots. |
| CH001-006 | Stop and recreate the app/worker/database containers without deleting volumes. Login, projects, revision IDs, accepted media hashes, and ready exports remain valid. | E4-local; before/after verification. |

### B. Owner, sessions, and authorization

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-007 | Missing/invalid setup token cannot create an owner. Two simultaneous valid setup attempts create exactly one owner/workspace; reused bootstrap is closed. | E2; database assertions. |
| CH001-008 | Correct login works; wrong credentials fail; basic rate limiting operates; logout and finite expiry invalidate protected access. | E2; real session requests/browser test. |
| CH001-009 | Inspect cookie flags and execute cross-origin state-changing attempts, including multipart upload. Unsafe host/origin/CSRF requests fail. The loopback HTTP exception is explicit. | E1 + E2; sanitized header assertions. |
| CH001-010 | Unauthenticated requests cannot read/mutate projects, drafts, assets, thumbnails, render details, final images, exports, or owner-only status. | E2; route matrix. |
| CH001-011 | Controlled second-workspace fixtures cannot access another workspace's resources by guessing IDs or supplying foreign asset references. | E2; command and HTTP authorization checks. |
| CH001-012 | Passwords/setup tokens/session secrets are absent from ordinary logs, URLs, committed config, browser bundles, output manifests, screenshots, and export files. Auth bypass/signup shortcuts are absent. | E1 + E2; scoped scan/report. |

### C. Projects, documents, and saving

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-013 | Create, list, rename, reopen, and switch between two projects with independent persisted drafts. | E2; browser journey/database reads. |
| CH001-014 | Save a valid document, inspect its immutable revision/hash, save an edit, and prove the earlier revision was not mutated. | E2; database invariants. |
| CH001-015 | Reject unsupported schema versions/layout/font IDs, bad slide/block IDs, duplicate IDs, illegal counts/boxes, foreign assets, arbitrary URLs, and invalid numeric values. | E2; parameterized contract/command tests. |
| CH001-016 | Semantically identical documents with different object-key insertion order hash consistently under the declared canonicalizer; array order/content changes alter the hash. | E2; deterministic unit tests. |
| CH001-017 | Autosave reports unsaved/saving/saved correctly, flush-before-preview waits for acknowledgment, and browser close/reopen retrieves the saved deck. | E2; browser test with controlled responses. |
| CH001-018 | Two tabs edit the same base revision. The second stale save is rejected; its local buffer survives; explicit safe reload does not silently discard unacknowledged work. | E2; two independent browser pages. |
| CH001-019 | Delay/drop/reorder save responses and temporarily fail a save. A late response cannot clobber newer text or show false saved state; retry/reconciliation does not overwrite a later revision. | E2; network fault tests and head assertions. |
| CH001-020 | Title, caption, hashtags, slide content and order are bound to one saved revision. Concurrent later editing cannot change a render/export already requested for that revision. | E2; immutable snapshot test. |

### D. Uploads and owned assets

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-021 | Upload valid JPEG, PNG, and static WebP in a batch. Each has a durable accepted record, image dimensions/hash, thumbnail, and selectable local asset. | E2; real decoder/storage/browser. |
| CH001-022 | Mix valid and invalid files in a batch. Per-file errors are useful; accepted files remain available and are not rolled back unnecessarily. | E2; batch test. |
| CH001-023 | Reject disguised HTML/SVG, corrupt/truncated data, animation, unsupported formats, and mismatched content. Do not trust extension/MIME alone. | E2; signature/decode tests. |
| CH001-024 | Enforce byte, decoded-pixel, edge, frame, batch, and execution limits. Oversized inputs cannot bypass streaming limits by lying about content length. | E2; safely bounded adversarial fixtures. |
| CH001-025 | EXIF orientation displays/exports correctly. Transparent-image handling is intentional. Public/render/export derivatives omit private EXIF/GPS metadata. | E2 + visual; decoded metadata/output checks. |
| CH001-026 | Traversal-like and header-injection filenames cannot escape storage or alter download headers. Media is not anonymously exposed through static paths. | E2; storage and HTTP tests. |
| CH001-027 | Retain source/upload time/user assertion and original/derivative hashes. Identical bytes do not erase distinct source records; no cross-workspace deduplication leak. | E2; record assertions. |
| CH001-028 | Inject decode/storage/DB commit failure. No accepted asset points to missing bytes; failed staging is safely tracked/cleaned. Missing/corrupt referenced media later blocks render without deleting the draft. | E2; failure boundaries and hash checks. |

### E. Editor behavior and usability

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-029 | Add, duplicate, remove, and reorder slides using non-drag controls. IDs remain stable on reorder and are fresh on duplication. Minimum/maximum slide bounds are enforced. | E2; interaction/state tests. |
| CH001-030 | All three layouts work, can be mixed, and preserve text through switching. Hiding/replacing an image does not delete its accepted local original. | E2 + visual; editor and output. |
| CH001-031 | Changing 9:16/4:5 updates every slide's trusted geometry and resulting dimensions without stretching the source or losing text. | E2 + visual; both-ratio corpus. |
| CH001-032 | Every exposed text/font/weight/size/line-height/alignment/color/panel/placement control changes stored data and final rendering as intended. No decorative controls. | E2; focused control tests. |
| CH001-033 | Cover/contain, focal reposition, reset, and replacement are nondestructive and match final output. Use off-center and landscape fixtures. | E2 + visual; crop-marker assertions. |
| CH001-034 | At least 50 logical session edits support sensible undo/redo. New edits clear redo; text editing does not double-apply app/browser keyboard undo. | E2; grouped edit and shortcut tests. |
| CH001-035 | Long text/newlines/unbroken tokens produce measured wrapping or an explicit overflow error. No silent clipping or minimum-font-size violation. | E2 + visual; text corpus. |
| CH001-036 | Empty/loading/error/saved/conflict states are understandable; main actions have labels/focus and keyboard access. Desktop and narrow layouts do not hide essential actions. | E2 accessibility checks + visual/keyboard review. |

### F. Rendering, containment, and recovery

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-037 | A render request references an exact immutable saved revision. A queued job renders that snapshot even after the live draft changes. | E2; real worker/database test. |
| CH001-038 | Application intent and pg-boss enqueue share a tested transaction, or an exercised outbox/reconciliation mechanism prevents lost work. Simulated handoff failure cannot lose acknowledged intent. | E2; failure/transaction assertions. |
| CH001-039 | Replay the same render command with the same client request ID/payload: one logical request. Same key/different payload: conflict. | E2; command concurrency tests. |
| CH001-040 | Render all layouts at both canvas presets using the pinned browser and local assets. Output JPEG dimensions/count/decode validity match the document. | E2; real corpus render. |
| CH001-041 | Delay required fonts/images. Capture waits for actual font faces/image decode. Missing resources fail with actionable diagnostics; no silent fallback success. | E2; controlled missing/delayed resource fixtures. |
| CH001-042 | Editor and worker use the shared trusted scene/layout implementation. Overflow, missing media, and unsupported glyph conditions prevent a ready artifact. | E1 + E2; architecture inspection and validation failures. |
| CH001-043 | User script-like strings render as text. Rejected URLs/CSS/HTML cannot execute, read local files, or make outbound requests. | E2; containment tests with network/file sentinels. |
| CH001-044 | Shipped renderer runs non-root with verified sandbox configuration and a minimal browser subprocess environment. No auth cookies, DB secrets, privileged container, broad host mounts, or Docker socket access. | E1 + E2; launch/config assertions and canary tests. |
| CH001-045 | Render execution timeout terminates the affected attempt, leaves an honest failure/retry state, and does not hang the entire worker indefinitely. | E2; deterministic hang/failure fixture. |
| CH001-046 | Kill/restart a worker during a render. The accepted request becomes recoverable, retains revision identity, respects attempt limits, and eventually succeeds or explicitly fails. | E4-local; process lifecycle log and DB checks. |
| CH001-047 | Duplicate/reclaimed job deliveries cannot finalize competing outputs for one request. A stale attempt cannot overwrite the accepted newer success. | E2; fencing/unique-finalization test. |
| CH001-048 | Crash after writing some/all staged files but before DB ready commit. Recovery does not expose partial success, delete accepted media, or strand the request forever. | E2 + E4-local; failpoint/recovery checks. |
| CH001-049 | Invalid/overflow/missing-font failures do not automatically retry; eligible transient failures stop at the documented maximum of three total attempts. No infinite loop. | E2; error-policy/state tests. |
| CH001-050 | Repeat a fixed fixture in the same pinned render environment; compare outputs and record the visual tolerance/results. Inspect geometry/crop/text differences instead of blindly updating goldens. | E2 + visual; diff images/report. |

### G. Preview and export integrity

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-051 | Final preview requests the exact immutable final JPEGs, not editor screenshots, optimized/re-encoded alternatives, or raw provider/source images. | E1 + E2; network/body-hash check. |
| CH001-052 | Extract the ZIP and SHA-256 its images. Each equals both the manifest's hash and the final-preview response body for that slide. | E2; machine-readable hash comparison. |
| CH001-053 | Seven-slide export has exactly `01.jpg`–`07.jpg`, `post.txt`, and `manifest.json` in the agreed structure. Ordered slide IDs and visible content match the draft revision. | E2 + visual; ZIP structure and sequence assertions. |
| CH001-054 | `post.txt` exactly matches the reviewed revision's title/caption/hashtags, including Unicode; manifest covers its hash/editorial identity. | E2; text and checksum assertions. |
| CH001-055 | Editing after render visibly invalidates current-preview/export readiness. A queued or historical render never silently becomes the new draft's current export. | E2; stale-state browser test. |
| CH001-056 | No originals/private metadata/secrets/raw rights files/absolute paths leak into the ZIP. Entries/download filename cannot contain unsafe paths or injected headers. | E2; content and path scan. |
| CH001-057 | Repeated download reuses ready JPEGs and does not launch a new render. A packaging/storage failure produces a useful error, not a corrupt success download. | E2; call-count and failure tests. |
| CH001-058 | Anonymous/foreign access cannot read final images or ZIPs even with a known artifact ID. A logged-in owner can still download a ready artifact while the worker is stopped. | E2; route and worker-down tests. |

### H. End-to-end quality, documentation, and evidence

| Gate | Procedure and required result | Evidence |
|---|---|---|
| CH001-059 | Execute the complete original seven-slide journey through the UI, including edits, one duplicate/reorder operation, final preview, and export, with no provider credential. | E2; full browser test and representative ZIP. |
| CH001-060 | Inspect real app screenshots and final output for readable typography, correct crop/composition, sensible spacing, and helpful error states. Include both canvas presets. | Visual/keyboard review at recorded build. |
| CH001-061 | Test at a normal desktop viewport and a narrow viewport; record sizes. Main journey is keyboard-operable; no critical automated accessibility violations remain on those tested screens. | E2 + manual; screenshots and report. |
| CH001-062 | Lint, strict types, deployable build, and all established required test commands run with actual results. A zero-test/discovery failure cannot be reported as success. | E2; command log/exit codes. |
| CH001-063 | Initial migrations run on an empty database and are safe on a second invocation. Web/worker do not race uncontrolled schema changes. | E2; migration/checksum assertions. |
| CH001-064 | Simulate storage unavailable/permission failure or bounded low-space behavior. Saving/rendering failures are visible; existing accepted content is not silently deleted or corrupted. | E2; failure injection and UI/state evidence. |
| CH001-065 | Secrets/canaries are absent from client bundles, normal logs, generated artifacts, Git diff, and browser-renderer environment. Runtime third-party telemetry/CDN requests are absent in the measured manual journey. | E1 + E2; scoped scanning/network report. |
| CH001-066 | A new reader can follow README installation/operation/troubleshooting. Document persistent volumes, stopping vs deleting data, running tests, limitations, and worker/host availability. | E1 + clean-run evidence; do not claim an independent human test unless one occurred. |
| CH001-067 | UI wording/layouts/demo assets are original or properly attributed. Runtime/dependency/font sources/licenses are recorded; existing license is preserved and pending decisions are not silently finalized. | E1; provenance/dependency records. |
| CH001-068 | No unscoped providers, key forms, direct TikTok integration, fake connections/analytics, billing, scheduling, MP4, or marketplace functionality slipped into the patch. | E1; diff/dependency/navigation inspection. |
| CH001-069 | Root state points to the real spec hash, active chapter, base/tested commit, handoff, and evidence. Parent requirement subsets remain partial/unreviewed as appropriate. | E1; state/traceability check. |
| CH001-070 | Handoff lists all mandatory gates with PASS/FAIL/NOT_RUN, actual implementation/evidence commits, skipped checks, deficiencies, and real artifact locations. | E1; handoff/result-file consistency. |
| CH001-071 | All public/committed screenshots, traces, logs, and exports use synthetic/local demo data and are sanitized. Artifact hashes correspond to files that actually exist. | E1 + E2; artifact manifest/scan. |
| CH001-072 | No work on the next chapter, public release/tag/deployment, paid API request, account authorization, or public post occurs. Final implementation status is awaiting review, never self-accepted. | E1; diff, action declaration, state. |

## 5. Primary requirement traceability

The source documents are in [reference/north-star/docs](https://github.com/klole/reel-farm/tree/ad0dd5fdd6764e4f3a40a6028720bff272130d42/architect/Luna_CH001_v0.1.0_Pack/reference/north-star/docs). Record actual results in root operational state, not in the frozen reference snapshot.

| Parent requirements | CH-001 subset implemented | Deliberately still deferred |
|---|---|---|
| PRD-001, PRD-002, PRD-004 | Private first owner, zero-key manual operation, project CRUD subset. | Rich onboarding preferences, archive/search breadth, full project lifecycle. |
| PRD-010, PRD-011, PRD-017 | Local asset selection/upload, durable accepted bytes, user rights assertion/provenance. | Broad library search/collections, remote imports, rights revocation. |
| PRD-028, PRD-029, PRD-030 | Three original layouts, usable editor, two canvas presets. | Full recipe/starter gallery and advanced editing. |
| PRD-031, PRD-032 | Supported text controls, real overflow, two local fonts, nondestructive cover/contain/focal point. | Broad multilingual catalog, all advanced typography/effects. |
| PRD-034 | Autosave, session undo, immutable saved revisions, conflict handling. | Full durable revision-history UI and named recovery points. |
| PRD-035, PRD-036 | Ordered JPEG/text/manifest handoff and exact final-preview bytes. | Editable portability/import, publication approval/delivery. |
| PRD-052, PRD-053 | Main-journey accessibility, narrow-layout usability, failure/recovery states. | Complete mobile editing/product-wide accessibility audit. |
| ARC-001, ARC-002, ARC-004, ARC-006, ARC-007, ARC-008 | Real module/process/storage boundaries, validated revisions/assets. | Eventual full entity model and provider integrations. |
| ARC-010, ARC-012, ARC-013 | Durable local render intent, local job state and bounded retries. | Paid/provider attempt and publication state machines. |
| ARC-018, ARC-019 | Shared trusted browser renderer, immutable raster manifest/export. | Montage/video and publication approval integration. |
| ARC-023, ARC-024 | Minimal health/logging and initial migration discipline. | Broad operational diagnostics and upgrade/restore qualification. |
| SEC-001, SEC-002, SEC-003, SEC-008, SEC-009 | Private binding/session/ownership, bounded raster upload, render isolation. | Public-server hardening claims, remote importer, credential encryption. |
| OPS-001, OPS-002, OPS-003, OPS-007 | Exercised local setup/readiness and dependency/asset provenance. | Public release images, full backup/restore, finalized distribution/legal decisions. |
| NS-F01–NS-F09, NS-I01, NS-I02, NS-I08–NS-I12 | Preserve fixed choices, data ownership, honest evidence, originality and chapter bounds. | Provider calls are not implemented simply because their boundaries are respected. |

Existing roadmap acceptance IDs such as AT-043 through AT-051 and AT-053/AT-054 inform this slice, but CH001-* is the finite chapter acceptance ledger. Do not claim the entire mature acceptance table passed.

## 6. Evidence deliverables

Keep full raw outputs in a gitignored `artifacts/ch001/<tested-commit-or-tree-id>/` or an equally explicit directory. Commit a small sanitized index at `docs/evidence/CH-001/README.md` and the handoff at `state/handoffs/CH-001.md`. Where GitHub review would otherwise lose artifact access, include small synthetic screenshots/sample ZIP or a durable attached artifact with its exact reference. Do not invent future CI/artifact links.

Required evidence set:

- Preflight and version/environment record; sanitized base/branch/status information.
- Command log with timestamps and exit codes, plus test-reporter output and discovered/executed/skipped counts.
- Machine-readable gate results for all 72 IDs: `PASS`, `FAIL`, or `NOT_RUN`, with evidence paths and reasons.
- Screenshots of Projects, populated editor, alternate layout/preset, authoritative preview, overflow/save conflict, and worker-down state.
- Actual seven-slide sample ZIP and its validated manifest; actual final-preview response hashes compared against its entries.
- Render-corpus/visual-diff report with named browser/font/renderer versions and explicit tolerance.
- Restart/crash/concurrency checks, database/storage integrity results, and migration checks.
- Security/secret-canary/network/accessibility reports, redacted appropriately.
- Source/license records for dependencies, layouts, fixtures, and implementation fonts.
- Updated root project/requirement/evidence state and completed handoff.

These are evidence categories, not a demand to commit large browser traces or private database dumps. Prefer compact factual summaries with hashes and real artifact locations. A picture showing a green badge does not prove the database or export hash is correct.

## 7. Review rubric and blocking defects

This checkpoint is **ready for review** only when the required outcomes and evidence are present. The architect will then inspect the actual diff and checks; Luna cannot self-approve.

Block acceptance for insecure public defaults, auth bypasses, private media exposure, lost/overwritten edits, fake persistence, missing upload validation, unsandboxed/unbounded render shortcuts, misleading job success, mismatched preview/export media or text, unsafe retries, missing required installation evidence, falsely reported tests, or scope drift into providers/publishing/billing.

Minor cosmetic imperfections can be recorded, but unreadable exports, inaccessible primary controls, invisible save failure, and broken navigation are functional defects. Missing platform support is an explicit support-matrix limitation; missing evidence for the one claimed reference environment is a checkpoint gap.

Do not calculate a feature-completion percentage from the number of green tests. A single export integrity or authorization failure can invalidate the primary outcome.


---

<a id="sources"></a>

# Sources and review traceability

Repository sources were read through the connected GitHub tools at the explicit submitted commits. Source code facts are not runtime test results. External documentation was consulted for specific library/container behavior, not to infer application success.

## Pinned repository sources

### S01 — Original handoff

[handoffs/CH-001.md](https://github.com/klole/reel-farm/blob/ad0dd5fdd6764e4f3a40a6028720bff272130d42/handoffs/CH-001.md)  
Commit: `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. Git content blob: `af22413ddda25e9671376b8c7ef6c670594e0fdc`.

### S02 — Original gate ledger

[docs/evidence/CH-001/gate-results.json](https://github.com/klole/reel-farm/blob/ad0dd5fdd6764e4f3a40a6028720bff272130d42/docs/evidence/CH-001/gate-results.json)  
Commit: `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. Git content blob: `c3e06844dfae25e605d51e0bf1c8d196d0c188cb`.

### S03 — Original evidence index

[docs/evidence/CH-001/README.md](https://github.com/klole/reel-farm/blob/ad0dd5fdd6764e4f3a40a6028720bff272130d42/docs/evidence/CH-001/README.md)  
Commit: `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. Git content blob: `f0b66f1c5e0acd151df9f79c4ca85e7811b2cbfa`.

### S04 — Original root state

[state/PROJECT_STATE.md](https://github.com/klole/reel-farm/blob/ad0dd5fdd6764e4f3a40a6028720bff272130d42/state/PROJECT_STATE.md)  
Commit: `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. Git content blob: `82c114490a6517d9b9a1cabf82fc07cb22e45857`.

### S06 — Guard-only test commands

[scripts/run-gated-check.ts](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/scripts/run-gated-check.ts)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `e34e03bed9dad3dd875628031ad8e4d79d7a0ec4`.

### S07 — Aggregate verifier

[scripts/verify-ch001.ts](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/scripts/verify-ch001.ts)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `717a7a4b1e0655967e1d4347e06dd30f00aba796`.

### S08 — Editor state, saving, uploads and preview

[apps/web/src/components/EditorView.tsx](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/apps/web/src/components/EditorView.tsx)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `7da398e862f637d86e260fe756d1810ebfad4d84`.

### S09 — Server draft/render commands and status

[apps/web/src/lib/domain.ts](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/apps/web/src/lib/domain.ts)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `4b3f3a2e713f1611b10683d2d2ec4e7a13ed0fac`.

### S10 — Worker claim, outbox, retry and recovery functions

[apps/worker/src/index.ts](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/apps/worker/src/index.ts)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `66318b1cd18c65d82e0363c7eba8a1af62a1cd8e`.

### S11 — Worker browser/render/finalization/startup functions

[apps/worker/src/index.ts](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/apps/worker/src/index.ts)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `66318b1cd18c65d82e0363c7eba8a1af62a1cd8e`.

### S12 — Container build stages

[Dockerfile](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/Dockerfile)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `3e647315b50ddfb6e2c59ab819800e86cfefed19`.

### S13 — Four source-oriented security tests

[tests/security/scope.test.ts](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/tests/security/scope.test.ts)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `3b7cfc0a200beb2cc5f41e48c7a733fb10f1e5df`.

### S14 — Upload request parsing and processing

[apps/web/app/api/assets/route.ts](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/apps/web/app/api/assets/route.ts)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `f5d9a0c407fbfd79d8c1729a1151c0bd67b1ba0a`.

### S15 — Shipped Compose topology

[compose.yaml](https://github.com/klole/reel-farm/blob/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a/compose.yaml)  
Commit: `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`. Git content blob: `1b2af8e23fbf15e8e28f45deb479b734d90365d5`.

### S16 — Original acceptance contract

[architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md](https://github.com/klole/reel-farm/blob/ad0dd5fdd6764e4f3a40a6028720bff272130d42/architect/Luna_CH001_v0.1.0_Pack/ACCEPTANCE_TESTS.md)  
Commit: `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. Git content blob: `ae3de51811b3e740952352ce6272402a6d23c5da`.

### S05 — Implementation to evidence comparison

[Compare bdd6540 to ad0dd5f](https://github.com/klole/reel-farm/compare/bdd6540b90f2d59b7ef11215cd0ceb631fc6336a...ad0dd5fdd6764e4f3a40a6028720bff272130d42). Returned one commit and six changed documentation/evidence files; no application source changes in that comparison.

### S17 — Actions lookup for the tested implementation

[Commit-scoped Actions query](https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=bdd6540b90f2d59b7ef11215cd0ceb631fc6336a&per_page=20). Returned `total_count: 0`. This observation is restricted to that SHA at the time of the read, not a claim that no CI exists anywhere in the repository.

## Official technical references

### W01 — Playwright BrowserType launch options

[Playwright BrowserType launch options](https://playwright.dev/docs/api/class-browsertype). Confirms chromiumSandbox defaults to false; browser-version compatibility guidance. Verify effective behavior for the locked package as well.

### W02 — Playwright Docker guidance

[Playwright Docker guidance](https://playwright.dev/docs/docker). Browser binaries versus OS dependencies; non-root/sandbox constraints; matching browser and package versions. Not permission to relax this chapter’s security requirements.

### W03 — Playwright CI guide

[Playwright CI guide](https://playwright.dev/docs/ci-intro). Primary example of installing prerequisites, running actual browser tests, and retaining reports on GitHub Actions. Adapt to locked pins and permitted existing infrastructure.

### W04 — Official Node Docker image best practices

[Official Node Docker image best practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md). Documents the supplied node user at UID 1000; inspect the exact base image before creating another user.

### W05 — Docker Compose project-name precedence

[Docker Compose project-name precedence](https://docs.docker.com/compose/how-tos/project-name/). Explicit -p overrides other project-name sources; isolate run-owned test resources.

### W06 — Docker Compose down reference

[Docker Compose down reference](https://docs.docker.com/reference/cli/docker/compose/down/). Named-volume deletion is requested by --volumes; distinguish restart/persistence tests from destructive cleanup.

## Local reference identity

The original acceptance file bundled with this packet is byte-identical to Git blob `ae3de51811b3e740952352ce6272402a6d23c5da` read from S16. The North Star root in the original CH-001 attachment hashes to `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`, matching the handoff.

No font files, application secrets, private user artifacts, or fabricated screenshots are included. The packet intentionally contains no claimed new app test results.


---

<a id="packet-validation"></a>

# Packet validation report

**14 structural checks passed; 0 failed.**

These checks validate the review documents, JSON templates, baseline identity, gate mapping, and local links. They do not run the application, validate Docker/browser behavior, or establish any CH-001 gate pass. v0.1.0 remains unaccepted.

- PASS — JSON syntax.
- PASS — Exact 72 original gate IDs.
- PASS — No invented execution results.
- PASS — Template is unexecuted.
- PASS — Review does not claim app acceptance.
- PASS — Reviewed SHAs match.
- PASS — Original reported gate counts.
- PASS — Original acceptance identity.
- PASS — Gate requirements unchanged.
- PASS — Every gate has planned coverage.
- PASS — Findings traceability.
- PASS — Local Markdown links resolve.
- PASS — Fenced code blocks balanced.
- PASS — No font or application-output binaries bundled.

Reproduce with `python tools/validate_packet.py` from this packet directory. File checksums are listed separately in `SHA256SUMS.txt`.
