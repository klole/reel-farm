# CH-001 — Build the first real local slideshow studio

**Assignment revision:** CH-001-r1  
**Target application checkpoint:** v0.1.0  
**Execution mode:** maximum available reasoning effort; bounded implementation, not maximum scope.  
**Read first:** [activation and baseline](ACTIVATION_AND_BASELINE.md).  
**Required gates:** [acceptance tests](ACCEPTANCE_TESTS.md).  
**Required return:** [handoff template](HANDOFF_TEMPLATE.md).

## 1. The one outcome

Build an original, runnable, private slideshow application in which a person can establish their owner login, create a project, upload their own images, compose a seven-slide deck, edit its text and image framing, save it durably, reopen it, render an authoritative preview, and download an ordered JPEG pack with its caption and manifest.

**This entire workflow must work without any external API key, paid service, internet image source, or social account.** Installation may download declared dependencies, container images, and properly licensed fonts. Once installed, the demonstrated manual workflow must not need third-party runtime requests.

At the checkpoint, Kyle should be able to follow the README, run the app, and use that workflow himself. A mocked interface, localStorage-only prototype, template gallery, static landing page, or codebase that merely compiles does not satisfy the assignment.

## 2. Scope fence

### Required now

- Reproducible local container setup; a web process, separate durable render worker, PostgreSQL, and persistent media volume.
- Secure first-owner setup, login/logout, server-side sessions, and ownership checks.
- Project listing/creation/rename; one editable slideshow draft per project for this checkpoint.
- Batch upload of owned JPEG/PNG/static WebP files, per-file results, safe decoding, retained provenance, and local thumbnails.
- A real slide editor with three original layouts, two canvas presets, manual title/body text, image replacement/framing, slide operations, autosave, session undo/redo, and explicit conflict handling.
- Immutable saved draft revisions, validated documents, render requests bound to a revision, authoritative final raster previews, and ordered JPEG ZIP export.
- Local job state, bounded rendering retries, worker-down visibility, restart recovery, tests, screenshots, sample exported output, installation documentation, and an honest handoff.

### Explicitly not now

No fal.ai calls or SDK, text generation, image generation/editing model integration, ScrapeCreators calls or SDK, Pinterest/remote-URL import, external credential storage/settings, posting bridge adapter, TikTok connection, direct TikTok integration, scheduling, recurring series, Autopilot, analytics, public automation API, MCP server, n8n integration, collaboration, billing, subscription gates, hosted proxy, public deployment, desktop wrapper, MP4/audio/FFmpeg export, template marketplace, general freeform canvas, arbitrary HTML/CSS templates, collage editor, full project portability/import, or full backup/restore system.

Do not build nonfunctional navigation for those features or represent them as connected/available. A small truthful note in project documentation about future integrations is enough. Leave clean seams through provider-neutral data and real module boundaries, not dozens of empty future packages.

### Deliberate simplifications

One owner and workspace. One draft per project. Multiple projects supported. Desktop-first editing with usable small-screen navigation, not a fully optimized mobile design suite. Three layouts, two fonts with a small weight set, and two raster sizes. Session undo/redo is required; a historical-revision browser and named restore points are deferred. JPEG is the required deliverable; PNG export is not needed. The ZIP is a publishing handoff, **not** a round-trip editable backup.

## 3. Repository preflight and execution discipline

Inspect the actual workspace before scaffolding. Read existing root instructions, package manifests/lockfiles, migrations, tests, CI, application entrypoints, state files, and license. Record actual `git status`, branch, HEAD, and remote with sensitive URL credentials removed. Reuse existing compatible work. Do not assume a directory is empty merely because no repository was visible to the architect.

Import the specification packet or record where its supplied files reside. Establish the chapter/spec/base mapping in `state/PROJECT_STATE.md` and record the preflight in `docs/chapters/CH-001/PREFLIGHT.md`. If using only the single-file brief, import that intact and record the original baseline hash from its appendix; do not claim the other historical files exist when they were not supplied.

For a new codebase, follow the stack below. For an existing compatible implementation, map the required outcomes onto its actual structure. File layout is not a reason for a wholesale refactor. An incompatible major stack or unexplained preexisting changes must be reported before destructive work; complete independent safe parts where feasible.

Use focused commits if Git configuration and session permissions permit. Never forge commit evidence or a Git identity. Never force-push, delete user branches, reset unrelated changes, create a remote repository, merge, tag, publish packages/images, or deploy publicly under this chapter. A permitted push/PR to Kyle's already attached development repository must follow that session's existing authorization; it is not a release approval.

Do not repeatedly ask for decisions already settled here. Resolve ordinary implementation details yourself. Do not spend the chapter searching for a new product concept, new provider, new framework, or a competitor's private implementation.

## 4. Architecture and dependency choices

For a fresh implementation, use TypeScript, React with Next.js App Router, PostgreSQL with Drizzle schema/migrations, pg-boss for durable render work, a separate Node worker, local persistent media storage, Playwright/Chromium, and a shared declarative React slide renderer. Use a small schema-validation library and a maintained image decoder/normalizer such as sharp. Use pnpm workspaces, a committed lockfile, and explicitly pinned runtime/package-manager versions.

Exact package versions are an implementation preflight decision, not invented constants in this brief. Verify compatibility against official sources, avoid canary/experimental versions unless unavoidable and approved, inspect relevant advisories, and record the chosen versions in `docs/chapters/CH-001/DEPENDENCIES.md`. Pin Playwright and its installed browser/container consistently. Do not solve a mismatch by fetching an arbitrary `latest` browser at runtime. [T1–T8 in SOURCE_NOTES.md]

A reasonable starting shape is:

```text
apps/web/                 authenticated UI and thin HTTP handlers
apps/worker/              durable render execution and health heartbeat
packages/contracts/       validated document/command schemas
packages/core/            projects, editing, authorization, render/export use cases
packages/db/              Drizzle schema, migrations, repositories
packages/renderer/        shared SlideScene, measurement, trusted layout code
packages/storage/         local staging, accepted blobs, protected reads
infra/                    container build/setup support as needed
scripts/                  setup, verification, safe disposable test orchestration
state/                    actual current state, evidence index, handoffs
```

This is a guide, not a demand for empty packages. Small modules can share a package where boundaries remain clear. Do not add Redis, Elasticsearch, a hosted database, S3 as a requirement, Kubernetes, a general plugin loader, an event-sourcing framework, or multiple render engines.

The browser is an editing client, not the source of persistent truth. The web layer authorizes and validates commands. PostgreSQL owns records and revisions. Media belongs to a persistent volume outside web public directories. The worker owns slow rendering. Shared trusted components determine composition in the interactive editor and worker.

Keep domain commands usable independently of an HTTP handler so future automation can call them. This is not permission to ship public API tokens or a documented external automation API now.

## 5. Installation, identity, and private-by-default operation

### Installation

Provide a root README, `.env.example` with placeholders only, a setup command/script, committed migrations, and `compose.yaml` with `web`, `worker`, `db`, plus a one-shot migration step if needed. Only the web port should be host-published by default, bound to loopback. Worker and database must not have public bindings. Use named persistent volumes or clearly documented local paths for database and media.

The normal flow should be: run the setup command, start Compose, open the displayed local address, complete owner setup, and create a project. Running containers must not require the operator to manually install Chromium or debug native image libraries. A source-build first checkpoint is acceptable; publishing prebuilt images is not authorized.

Setup must be idempotent: rerunning it does not rotate existing secrets, destroy volumes, reseed users, or silently invalidate data. Document intentional reset separately and make it explicit/destructive; never run it against Kyle's normal installation during testing.

Generate development/local secrets with secure randomness. Store them in ignored, permission-restricted local files or an equivalent documented mechanism. Do not ship a shared owner password, a working secret in `.env.example`, or a token in logs/URLs/screenshots. A deliberate local command that reveals the one-time setup token to the operator is acceptable; automatic routine logging is not.

Use readiness checks, not only process-start ordering. The UI must distinguish database/storage readiness from renderer readiness. Successful web health is not proof that the worker or its browser can render. Record the actual supported host/architecture tested; do not claim Windows/macOS/ARM support without evidence. [T1, T8]

### Identity

Use a maintained authentication/session implementation and established password hashing, not custom cryptography. Choose and record it during preflight. A library-provided signup endpoint must not bypass our single-owner bootstrap boundary.

Bootstrap requires a one-time secret, validates it server-side, and creates exactly one owner/workspace in a transaction. Concurrent bootstrap attempts cannot create two owners. Bootstrap is disabled after success even if its original token file still exists. Login/logout, session expiry, and revocation must operate against the actual server.

Use HTTP-only cookies, an appropriate SameSite policy, and Secure cookies for HTTPS. A specifically documented loopback HTTP development/local profile may use a non-Secure cookie because otherwise it cannot function over plain HTTP; do not carry that exception into an exposed deployment. Apply canonical host/origin checks and CSRF protection to all relevant mutations, including uploads, login/logout, setup, and rendering. Test the selected library's behavior rather than assuming it covers every custom endpoint. [T9–T11]

Protect every project, revision, asset, thumbnail, render, export, and detailed status route server-side. A UUID or storage filename is never an authorization credential. Do not rely solely on hidden navigation, client-side redirects, or framework middleware. An unauthenticated minimal liveness endpoint may reveal only a coarse status. [T9]

No open registration, email-delivery requirement, password-reset email system, SSO, or team invites in this chapter. Document the scope and a deliberate local owner-recovery procedure if supported; do not add an unauthenticated reset shortcut.

## 6. Screens and interaction design

Use an independently designed, calm editorial workspace. The product is provisionally called Open Slideshow Studio. This is a working descriptor, not a branding-clearance claim. Do not reproduce Reel.farm screenshots, distinctive wording, templates, assets, or visual identity.

Establish a small coherent design system: spacing, type scale, neutral surfaces, one primary accent, focus states, readable contrast, and consistent controls. The chapter is not a marketing-site exercise. Use real application states instead of charts, fake activity, stock testimonials, or ornamental dashboards.

### First run and login

A concise setup screen identifies this as a private local installation. It accepts the one-time setup token and owner credentials, clearly reports failures, and directs a successful owner to Projects. Provider setup is absent; no “skip your required AI key” trap.

### Projects

List actual projects with name, last saved time, slide count, and a useful thumbnail where available. The empty state has one clear “Create project” action. A project can be created, renamed, reopened, and returned to the list. Hard deletion, trash recovery, and project duplication are not required.

Each new project starts with one valid text-capable slide and an editable draft. Adding an image must not be a prerequisite for trying the editor. Do not seed a sample project into an installation silently. An explicitly chosen original demo fixture is acceptable for tests/documentation.

### Editor

Use a slide strip, central canvas, and contextual inspector. The main actions are “Preview & export,” “Undo,” “Redo,” and return to Projects. Display project identity, canvas format, slide count, and the actual save state. Never display “Saved” before the server confirms persistence.

The slide strip shows sequence, selected slide, and role. Provide add, duplicate, remove, move earlier, and move later through labeled buttons/menu actions; drag-and-drop can supplement but cannot replace those controls. Deleting the only remaining slide is blocked with a useful explanation. Duplicating a slide creates fresh slide/block IDs while retaining media references and content.

Show selected text/image controls directly. A creator should not need to type coordinates or understand layer architecture. Selecting a layout should show immediate changes. Use a thumbnail/selectable local asset picker, not a raw asset-ID field. Cropping controls must have labels and a reset action.

The export action must flush pending edits, resolve save success/conflicts, and bind the render request to that exact saved revision. A project can remain editable while a render runs; a later edit makes the prior preview visibly stale rather than changing the in-flight job.

### Final preview and export

Show actual worker-produced JPEGs, not the live editor DOM. Provide previous/next navigation, slide count, readable caption/title, and optionally an all-slides overview. Label a historical/stale render with its revision and why it is not the current draft. The ordinary “Download current export” action is enabled only for a successful artifact of the current saved revision.

The final preview shows the exact bytes that enter the ZIP. Do not route them through an optimizing image component that re-encodes or crops them. Display scale can change; the underlying downloaded image must not. Historical files may be retained internally, but a stale export must never masquerade as current.

### Status and recovery

A minimal owner-visible status view shows web/database/storage/worker state and recent local render failures. This is not a general observability dashboard. Errors identify an actionable step, preserve content, and distinguish save failure, unsupported image, validation failure, renderer failure, worker stopped, and storage unavailable.

No infinite spinner. No false progress percentage. A job can honestly say “Queued—worker offline,” “Rendering slide 3 of 7,” “Validation failed on slide 4,” or “Ready.”

## 7. Exact editor scope

### Canvas and slide counts

Implement 1080×1920 (9:16; default) and 1080×1350 (4:5). These are application output presets, not statements of TikTok API requirements. All slides within a draft use one preset. Changing the preset updates trusted layout geometry without stretching image pixels or destroying text.

Support 1–20 slides as an initial local engineering bound. Show that limit before adding/duplicating the twenty-first. This is not a provider quota or a claim about TikTok's maximum. The reference demonstration uses seven slides; test both minimum and maximum boundaries.

Optional composition-safe guides are editor-only and conservative, not a promise that platform overlays are identical on every device. They must not appear in exported images.

### Three original layouts

1. **Photo caption:** one full-bleed image with a readable text panel, and top/middle/bottom text placement.
2. **Editorial card:** one image area plus a separate text area, with a headline and optional supporting body.
3. **Statement:** a solid background with a headline and optional body, and no required image.

These names and structures are original functional starting points, not assets borrowed from a competitor. A maximum of one image and two text blocks per slide is enough for this checkpoint. No freeform drawing, nested layers, multi-image collage, or drag-resize bounding-box system is required.

Layout changes preserve existing text and keep original images in the library. Never silently delete text to fit a new layout. If an image is hidden by Statement, explain that it remains available. Different layouts can be mixed in one deck. Hook/body/CTA roles may be assigned manually; they do not trigger AI or automated content generation.

### Text controls

Support manual headline/body text, a curated selector containing two properly licensed local font families, normal/bold weights, bounded font size, line height, alignment, text color, background/panel treatment appropriate to the layout, and preset text placement where relevant. Use a named local font catalog and a fixed font-set version/hash.

Use plain text, including deliberate line breaks. No arbitrary HTML, Markdown execution, CSS, scripts, uploaded fonts, or external font URLs. Color values must use a bounded parser/allowlist, not arbitrary CSS expressions. Validate input lengths, numbers, weights, and font IDs on the server.

Choose and document practical limits; use these starting bounds unless a measured incompatibility is recorded: font sizes 28–160 canvas pixels, line height 1.0–1.8, headline 300 Unicode characters, body 1,500, post title 150, caption 3,000, and 20 hashtag entries of at most 80 characters each. These are local safety/UX bounds, not current social-platform limits. Text within those limits can still overflow a particular box and must be measured.

Do not shrink text below the minimum or clip it silently to make export pass. Overflow is indicated in the editor and blocks a final ready artifact until corrected. Name the slide and text field involved. Support the selected fonts' tested Latin/Latin-extended corpus and common punctuation; unsupported scripts/glyphs should produce an explicit limitation, not a claim of complete multilingual support or silent replacement boxes.

### Image controls

Pick/replace an accepted local image; choose cover/contain; reposition a normalized focal point with usable controls; reset framing. Store nondestructive framing, not an overwritten original. Filling a portrait box from a landscape source may crop, but must not geometrically stretch the picture. Contain uses the declared background treatment.

### Undo, autosave, and conflicts

Keep at least 50 logical session undo operations. Coalesce adjacent text typing into practical operations; structural edits, image replacements, framing changes, and style changes should undo predictably. Ctrl/Cmd+Z must not double-apply browser text undo and app undo. Scope keyboard shortcuts to avoid stealing unrelated input behavior. Redo clears on a new divergent edit.

Autosave after approximately 750 ms of inactivity, with a clear explicit save action/shortcut and flush-before-preview behavior. Serialize or otherwise correctly reconcile save requests so out-of-order responses never replace newer local work. Display “Unsaved,” “Saving,” “Saved,” and “Save failed” or equivalent truthful states.

Every save includes the expected head revision. A stale revision returns a conflict; it never silently overwrites newer work. A two-tab conflict keeps the local edit buffer intact, shows a conflict explanation, and offers a safe reload path with an explicit warning. A nonsecret recovery-JSON download is an acceptable way to preserve the losing edit buffer before reload; it is not an advertised portable-project format. Automatic merge and force-overwrite are not required.

Unsaved edits must survive a recoverable save error while the editor remains open. Warn before intentional navigation that would discard them. Persisted content must survive closing/reopening the browser. Do not promise recovery of every keystroke after a crash before a successful server save.

## 8. Uploads, storage, and provenance

Accept batches of up to 20 files through per-file or equivalently bounded uploads, with low concurrency and individual success/failure results. Allow JPEG, PNG, and static WebP only. Reject GIF/animated WebP, SVG, HEIC, archives, HTML, and unsupported/malformed formats with a clear message. A failed item must not remove successful items.

Initial guards: at most 20 MiB compressed bytes per file, at most 40 million decoded pixels, at most 16,384 pixels on either edge, one frame, bounded decode time, and a streaming/request body limit. Reject before uncontrolled allocation where possible; do not merely trust the filename, MIME header, or declared content length. The parser and decoder limits are complementary. Do not enable a decoder's unlimited mode to make a test pass. [T4, T5]

Use a generated storage key, never a user filename as a filesystem path. Resolve authenticated IDs to server-owned storage records. Files are not served from a publicly browsable `/uploads` directory. Staging, accepted originals, normalized derivatives, thumbnails, and final artifacts have distinct roles.

Normalize orientation and rendering color treatment; retain original bytes privately and create safe local derivatives. Exported/preview derivatives must omit private EXIF/GPS/device metadata. Record original and derivative hashes and the derivation relationship. Rendering must use a validated accepted derivative rather than re-fetching an upload or referencing a temporary browser object URL.

Minimal asset metadata: workspace, original filename as display-only data, source kind `upload`, uploader/time, original hash, accepted derivative hash, MIME, dimensions, byte sizes, storage keys, acceptance state, and a rights assertion. Prompt the operator to confirm ownership or permission when importing; record it as a **user assertion**, not a verified legal license.

Write into staging, validate/decode/hash, promote atomically or with a documented crash-safe protocol, then expose the accepted database record. Compensate for failed commits and track orphan staging. Do not acknowledge a usable asset before its bytes exist. A missing/corrupt referenced blob blocks rendering without erasing the draft.

Content-addressed deduplication within one workspace is allowed as an implementation detail. Do not deduplicate across workspaces or discard distinct source/rights records. A full duplicate-detection product, collections, remote import, and delete/revocation workflows are deferred. Because deletion is deferred, do not add an unsafe “remove file” button that breaks saved revisions.

## 9. Persistence and document contracts

Establish only entities that this slice uses: User/Session, Workspace, Project, Draft, DraftRevision, Asset (including compact provenance/rights metadata), RenderRequest, and RenderArtifact. A tiny operational heartbeat/event record is appropriate. You do not need every eventual North Star entity, provider credential table, publication ledger, or series table now.

Use foreign keys/constraints, explicit ownership, durable timestamps, immutable revision rows, and a mutable draft head. Project display-name edits may be organizational metadata. Rendered/exported content—post title, caption, hashtags, slide order/content/styles—must be revisioned so the final preview and ZIP cannot quietly refer to different editorial states.

### Required document contract

Implement a schema with a fixed version such as `oss.slide/1`, independent from the application's release number. Exact TypeScript identifiers may differ; the following semantics may not:

| Part | Required semantics |
|---|---|
| Document | Schema version, canvas preset/width/height/sRGB, language, revisioned post title/caption/hashtags, ordered slides. |
| Slide | Stable ID, manual role, trusted layout ID/version, bounded background treatment, ordered typed blocks. |
| Text block | Stable ID, headline/body slot, plain text, bounded box/placement, supported font/style values, alignment. |
| Image block | Stable ID, accepted asset ID and expected render-derivative hash, box, cover/contain, normalized focal point. |
| Box | Finite coordinates and positive dimensions in a declared coordinate system; within supported layout bounds. |
| Catalog references | Local trusted layout/font IDs; never executable paths, remote URLs, or model/vendor response blobs. |

Use canvas-pixel box coordinates for this checkpoint and normalize focal points to `[0,1]`. Coordinates must be derived/validated consistently for both canvas presets. Preserve stable slide/block IDs through reorder and ordinary edits; mint new IDs on duplication. Validate uniqueness inside a document.

Reject unknown schema versions, malformed/unknown fields where unsafe, nonfinite or out-of-range numbers, unsupported fonts/layouts, invalid slide counts, forbidden URLs, missing assets, and cross-workspace asset references. The JSON parser rejecting NaN is not enough: domain constructors and internal calls also need finite-number validation.

Canonicalize documents using a defined deterministic method, hash them with SHA-256, and store the canonicalization version. Do not include changing timestamps inside content hashes or rely on incidental JSON key insertion order. Identical no-op saves need not create a new revision. Never mutate a revision after a render references it.

### Save transaction

Authorize the actor/workspace, validate the document and assets, compare the expected head, insert an immutable revision if changed, and update the draft head in one database transaction. Return the new/current revision ID and hash. On conflict, return the current head identifier without silently accepting stale content.

A lost success response must be recoverable without overwriting later edits. Use a client mutation ID or an equivalent documented idempotent save strategy. Treat idempotency as scoped to the actor/draft and payload, not as an excuse to accept a different payload under the same key.

### Render intent

A render request accepts an authenticated draft ID, exact saved revision ID, and client request ID. It returns a persisted request ID/status. It does not take arbitrary browser-generated HTML, arbitrary paths, or a “render latest at execution time” instruction.

Insert the application intent and enqueue the job atomically using the supported pg-boss/Drizzle transaction integration, or implement a small documented outbox/intent reconciler if the selected versions cannot share a transaction. A comment saying “transactional” around two unrelated connections does not count. Test crash/retry boundaries. [T6, T7]

At minimum, bind the artifact to revision ID/content hash, renderer build ID, font-set hash, layout version, accepted asset hashes, output format/settings, and canvas size. The same client request ID plus same payload returns the same logical request. Reusing it for a different payload fails with a conflict.

## 10. Authoritative rendering and immutable export

### Shared composition, not a screenshot hack

Create one trusted `SlideScene` or equivalent component tree and layout/typography implementation. Reuse it in the interactive editor and the worker. Interactive overlays/selection handles live outside the exported scene. Do not implement a second layout algorithm in Pillow, canvas, or server-side text measurement just for export. An image library can decode/normalize/encode; it must not become a competing slide-composition engine.

A useful containment approach is trusted React static markup plus trusted bundled CSS, local font bytes, and validated image bytes assembled in the worker. Feed those into an isolated browser context. Never interpolate user text as HTML. Do not send an owner's web-session cookie into Chromium or expose an unauthenticated render endpoint as a shortcut.

The render browser gets only the job's nonsecret document and necessary assets. Deny external HTTP(S), arbitrary local files, remote fonts, navigation, downloads, and user-supplied scripts. Use a narrow subprocess environment; do not pass database passwords or future provider keys into the browser process. If a private transient asset server is used instead of data assets, it must be worker-local, short-lived, narrowly scoped, and not host-published.

Use a non-root runtime and the supported Chromium sandbox configuration for the tested container environment. Verify effective launch configuration, not just an environment-variable name. Do not add `--no-sandbox`, privileged mode, a Docker socket mount, or broad host mounts to get green checks. If the agent environment cannot exercise a sandboxed renderer, report the gate unverified/blocked rather than secretly changing the shipped security model. The official Playwright container guidance discusses version matching and sandbox implications; blindly copying its development examples is not a production security design. [T2]

### Render pipeline

1. Claim the persisted request and immutable revision; authorize/validate all referenced assets again.
2. Resolve the exact accepted local derivative bytes and verify their expected hashes.
3. Load the trusted shared renderer, fixed canvas dimensions, pinned fonts, and fixed browser settings, with device scale 1 and deterministic animation settings.
4. Wait for required named fonts and actual image decoding. `document.fonts.ready` alone is not proof a missing requested font loaded; validate the specific catalog font faces and assets.
5. Measure supported text/layout bounds. Reject overflow, missing images/fonts, unsupported glyph conditions, or invalid geometry with per-slide diagnostics.
6. Capture/encode final sRGB JPEG bytes at a pinned quality setting; 95 is an appropriate starting setting. If an intermediate PNG is used, it is internal, not the promised final-preview format.
7. Decode/check final dimensions and image validity, compute SHA-256 for each final JPEG, and write into attempt-scoped staging.
8. Promote all files and a manifest as one logical successful artifact. Only after complete durable validation may the artifact/request become ready.
9. Serve those protected immutable bytes to the final preview and package those same bytes in the ZIP. Do not re-render or re-encode during download.

No `networkidle`-only readiness heuristic, silent font fallback, editor spinner baked into a slide, placeholder image in a successful artifact, or partially finished deck labeled ready. Final capture is local browser rasterization of our trusted component code—not web scraping. [T3]

### Jobs, failures, and restart behavior

Use a separate worker and a persisted state model equivalent to `queued → rendering → ready | failed`, with retry information and structured failure reasons. Keep UI terminology understandable. A disconnected browser does not cancel an accepted render.

Start with one concurrent render per worker. Bound per-slide/deck execution time and resource use. Use at most three total attempts per logical render request for eligible transient local failures, with bounded backoff. Invalid documents, missing fonts, unsupported assets, and text overflow are not transient; do not automatically rerun them unchanged.

Use attempt-scoped staging and a transaction/lease/fencing check so a reclaimed or duplicate job cannot overwrite a newer success. At most one artifact is finalized for a logical request. If the worker dies after writing files but before success commit, recovery either validates/finalizes the existing valid attempt or safely regenerates into a new attempt directory. Filesystem and database commits are not magically a single transaction.

The original intent remains discoverable after a crash. A restarted worker must not leave it stuck forever or create an uncontrolled retry loop. Clean only abandoned staging that is provably unreferenced; never delete accepted originals or finalized artifacts as a broad startup cleanup.

A worker-down heartbeat causes a degraded rendering state, not a broken editor. Accepting a render into a durable queue while the worker is offline is allowed if the UI clearly says it is waiting. Editing, saving, and downloading already-ready artifacts must still work.

### Manifest and ZIP

Produce a ZIP with predictable entries:

```text
01.jpg
02.jpg
...
07.jpg
post.txt
manifest.json
```

`post.txt` contains the exact revisioned title, caption, and hashtags displayed in the final preview. Use UTF-8 and clear field labels. Hashtag formatting is handoff formatting, not platform validation.

The manifest records export schema version, revision ID/hash, renderer and font-set identifiers, canvas/color-space, ordered slide IDs, filenames, MIME, dimensions, sizes, final JPEG SHA-256 values, relevant accepted-asset hashes, validation summary, and creation timestamp. Include the `post.txt` hash or equivalent editorial-content hash so its integrity is testable too.

Do not include originals, passwords, setup/session tokens, database credentials, API keys, absolute storage paths, private source prompts, or raw rights documents. Compact hashes/IDs are enough for this export. Use a safe generated download filename, not raw user-controlled paths or headers.

Export packaging must read the artifact's explicit order rather than filesystem enumeration. Stream/bound ZIP construction. A partial failed ZIP must not be presented as a successful ready export. Repeated downloads reuse the same ready JPEG bytes; ZIP-level timestamps may differ if documented.

## 11. Application commands and API boundaries

Implement authenticated internal endpoints or server commands for these operations. Route spelling is delegated; semantics are not:

| Command/query | Required behavior |
|---|---|
| Bootstrap owner | One-time guarded transaction; no second owner. |
| Session create/revoke | Real login/logout with finite session lifetime and safe cookies. |
| List/create/rename project | Workspace-scoped persisted records. |
| Read draft | Current immutable revision plus head/version metadata. |
| Save draft | Schema/asset validation, expected revision, mutation identity, transactional conflict handling. |
| Upload asset | Bounded input, real decode/normalization, durable acceptance, provenance and per-file errors. |
| List/read asset/thumbnail | Protected same-workspace media; no arbitrary path access. |
| Request render | Exact revision/client request identity; durable atomic intent/queue handoff. |
| Read render/status | Honest queued/running/failed/ready state, per-slide diagnostics where relevant. |
| Read final image/download ZIP | Protected immutable artifact; current-draft UI gating; bytes match manifest. |
| Read detailed health | Owner-only actionable database/storage/worker readiness. |

Return consistent machine-readable error codes and useful user messages without stack traces, secrets, or unnecessary internal paths. Distinguish unauthorized, invalid data, conflict, unavailable storage, and failed rendering. Preserve correlation/request IDs in safe logs. Do not log uploaded image bytes, owner passwords, session tokens, full private drafts, or whole environment objects.

Authenticated internal endpoints are part of this implementation; an external token-authenticated automation API is a later product feature and must not be advertised now.

## 12. Verification and definition of done

Implement the checks in [ACCEPTANCE_TESTS.md](ACCEPTANCE_TESTS.md), map them to real test files, and execute them. Use real PostgreSQL, local storage, and the pinned browser renderer for integration/E2E gates. Unit mocks can supplement these; they cannot replace the functioning local pipeline.

Establish documented root scripts for lint, typecheck, build, unit/integration/E2E/render/security checks, clean-install smoke, and an aggregate `verify:ch001`. These are **required commands to create or map**, not assertions that commands already exist. Every script must execute substantive checks and return a nonzero status on failure. No echo-only tests, `|| true`, test deletion, skipped default suites, fabricated screenshots, or golden updates without reviewing the visual difference.

Use disposable isolated test databases/volumes with names and guards preventing a reset of the normal app instance. A destructive test cleanup is authorized only for explicitly created disposable test resources. Avoid consuming arbitrary port 3000 services or deleting another Compose project's volumes.

An environment without Docker/browser support does not justify claiming the corresponding tests passed. Run what can legitimately run, produce evidence, and list the unrun gates as blocking local-verification gaps. Do not solve unavailable tooling by changing to SQLite, localStorage, a second renderer, or a paid service.

The checkpoint requires: a clean-start manual journey; persisted edits across browser and full container restart; working authentication/ownership/CSRF; safe uploads; readable rendering in both sizes; exact preview/ZIP-byte parity; conflict/retry/worker failure tests; original UI screenshots; representative export; and documentation that another person can follow.

Record measured render duration and peak/observed memory where tooling permits, plus hardware/OS/browser versions. These are measurements, not a promise of a universal performance minimum. Do not invent a “runs on 2 GB” claim from a successful build on a larger machine.

## 13. Suggested execution order inside CH-001

These are internal steps, not separate new milestones and not permission to stop at a scaffold.

**A. Establish reality and contracts.** Inspect the repository, bind the base/spec, select compatible versions, create the local state, write the draft/asset/revision schemas and initial validation tests.

**B. Make infrastructure real.** Build Compose, migrations, media storage, worker bootstrap/health, and the owner/session boundary. Verify a clean private startup.

**C. Prove one small end-to-end slice.** Create one project, accept one image, persist one slide, render it through the real worker, view the final JPEG, and export it. Do this before polishing many screens.

**D. Complete the bounded editor.** Add the three layouts, both canvas presets, slide operations, typography/framing, session undo, autosave/conflicts, and revisioned editorial text.

**E. Make export trustworthy.** Finish immutable manifests, hash checks, exact final preview, ready/stale UI, ordered ZIPs, and recoverable render state.

**F. Exercise failures.** Simulate missing/corrupt media, save response loss, stale tabs, malformed uploads, overflow, worker crash, duplicate delivery, queue failure, and storage failure. Fix defects instead of broadening scope.

**G. Review the actual visuals.** Inspect generated JPEGs and real screenshots at the supported viewports. Fix clipping, illegible text, confusing controls, tab order, and error-state layout. A screenshot test alone does not establish good design.

**H. Freeze evidence and hand off.** Run the verification set against an identified implementation commit/tree, collect sanitized artifacts, update state honestly, and return the handoff. Stop. Do not start v0.2.0, install provider SDKs, connect accounts, or publish a release.

## 14. Stop conditions and escalation

Stop only the affected risky change, preserve work, and report a blocker when you encounter conflicting major repository instructions, destructive migration needs, unavailable required access/tooling, a main-stack change, an unapproved license/public-distribution decision, unexpected paid calls, public exposure, provider/account authorization, a need to disable core security, or an unresolvable data-loss/security defect.

Ordinary bugs, incomplete tests, and small design choices are work to complete, not reasons to ask for a new plan. Continue through safe in-scope repairs. A partial handoff with concrete unrun checks is better than fabricated completion, but “built the scaffold” is not the intended stopping point.

## 15. Handoff and review boundary

Write `state/handoffs/CH-001.md` using the supplied template. Include actual repository/branch/base/implementation/evidence commits, changed modules, mapped requirements, commands/exit codes, test and environment details, screenshot/export paths and hashes, migrations/dependencies, unmet gates, deviations, and an explicit declaration of external calls/actions actually taken.

Keep the distinction between the commit tested and a later documentation-only evidence commit; otherwise a self-referential handoff can claim tests on a commit that did not exist yet. If code changes after verification, rerun affected checks and update the tested commit/tree. If no commit can be created, report the actual dirty-tree state and patch/hash rather than inventing a SHA.

Set chapter status to `ready_for_review`, `changes_required`, or `blocked` as supported by evidence—not `accepted`. Parent requirements remain partial where this chapter implements only their initial slice. The architect's next task is to review the actual repository and evidence when Kyle supplies them.
