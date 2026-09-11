# CH-001 — acceptance contract and evidence

**Applies to:** CH-001-r1 / target v0.1.0.  
**Status:** required tests to implement and execute; no application results exist in this planning packet.  
**Primary assignment:** [CHAPTER_BRIEF.md](CHAPTER_BRIEF.md).

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

The source documents are in [reference/north-star/docs](reference/north-star/docs/). Record actual results in root operational state, not in the frozen reference snapshot.

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
