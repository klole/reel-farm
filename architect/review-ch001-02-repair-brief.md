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

Inspect Docker, PostgreSQL, the actual Playwright browser, container policy, storage paths, and available CI execution before spending the chapter changing the editor. Record probes and errors without credentials. Read [04_ENVIRONMENT_AND_CI.md](04_ENVIRONMENT_AND_CI.md).

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

Capture reports, screenshots, sample export, manifest and byte hashes, lifecycle tests, source/provenance checks, and actual command logs. Prepare a separate evidence/handoff commit E without later code changes. Follow the commit protocol in [05_HANDOFF_AND_REVIEW_PROTOCOL.md](05_HANDOFF_AND_REVIEW_PROTOCOL.md).

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
