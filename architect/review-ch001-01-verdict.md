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

Source keys resolve in [SOURCES.md](SOURCES.md).
