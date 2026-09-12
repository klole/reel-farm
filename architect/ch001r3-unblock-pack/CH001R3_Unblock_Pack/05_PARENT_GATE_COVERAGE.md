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
