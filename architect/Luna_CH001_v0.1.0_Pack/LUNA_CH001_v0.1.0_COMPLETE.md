# Luna implementation assignment — CH-001 / v0.1.0

**Prepared:** September 10, 2026  
**Target:** the first working manual-slideshow checkpoint, not the full v1.0 product.  
**Effort:** select MAX / the highest available setting in the Luna interface.  
**Application implementation/tests in this deliverable:** none; this is the assignment to execute.

This single file contains the operative chapter, finite acceptance contract, handoff, technical references, and baseline North Star root. The companion ZIP adds the full specialist North Star documents, hashes, and reporting templates. The current chapter is executable from the detailed contracts here; do not invent missing repository files or pretend the full historical snapshot was imported when only this file was provided.

Relative links have been adapted for single-file reading. The baseline fingerprint below identifies the original frozen file in the ZIP, not this generated edition or its adapted links.

**Original NS-0.2 root SHA-256:** `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`

## Contents

1. [Activation and exact baseline](#part-activation)
2. [Implementation assignment](#part-brief)
3. [Acceptance gates and evidence](#part-acceptance)
4. [Required Luna handoff](#part-handoff)
5. [Technical references](#part-sources)
6. [Dispatch prompt](#part-prompt)
7. [Historical North Star root](#part-baseline)

---

<a id="part-activation"></a>

# CH-001 — activation, authority, and baseline

**Prepared:** September 10, 2026 (America/Phoenix)  
**Chapter:** CH-001-r1  
**Target:** v0.1.0, the first working implementation checkpoint—not the mature v1.0 product.  
**Owner/orchestrator:** Kyle / architect assistant  
**Implementer:** Luna, using the highest reasoning/effort setting available in Kyle's agent interface.

## What authorizes this work

Kyle requested the first implementation instructions after reviewing the amended North Star. Delivering this packet to Luna with the instruction to execute CH-001 authorizes the bounded local implementation described here. It does not authorize the entire roadmap, paid calls, connecting social accounts, publishing, public deployment, creating a remote repository, or a release.

The packet is an implementation assignment, not another request to write a plan. Luna should inspect, build, run the permitted checks, fix in-scope failures, and produce a review handoff. It must not stop after scaffolding or after explaining what it intends to do.

The North Star is the product baseline; this chapter selects and refines its expressly described v0.1.0 manual-workflow subset. Do not interpret a requirement for the eventual stable product as a requirement to finish it now.

## Exact product baseline

- Source revision: `NS-0.2-draft`.
- Frozen source: [reference/north-star/NORTH_STAR.md](#part-baseline).
- SHA-256 of that file: `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`.
- Full source-file hashes: BASELINE_HASHES.json (`BASELINE_HASHES.json`, in the full ZIP packet).
- Source ZIP used: the supplied `Open_Slideshow_Studio_North_Star_Pack.zip`.
- Source root matched the separately mounted current `NORTH_STAR.md` byte for byte when this packet was prepared.
- No application repository or code commit was supplied or inspected for this assignment. There is no fabricated starting SHA, passing application test, or existing implementation claim.

A chapter-specific activation record is necessary because the historical package still says “approval pending,” “no chapter included,” and, in its historical project state, `NS-0.1-draft`. Those are facts about the earlier planning snapshot, not instructions to refuse this subsequently dispatched assignment. Keep the historical snapshot unchanged; create an accurate operational state for the actual repository. This does not retroactively claim that the old files had already been approved or implemented.

## Nonnegotiable decisions carried forward

The application is free/open source in product intent, self-hosted, original in design and code, and usable manually without external credentials. Pinterest discovery will use ScrapeCreators. One fal.ai credential will supply both qualified text generation and image generation/editing; later UI will offer separate curated text and image model selectors, including a qualified inexpensive text default. Do not introduce a separate Anthropic, OpenAI, OpenRouter, or Gemini key requirement.

There will be **no direct official TikTok Content Posting API integration**: no project-owned TikTok developer app, approval flow, or direct posting/OAuth adapter. Future posting uses separately qualified bridges or manual export. A publishing bridge may internally use platform APIs; the prohibition is on building our own direct integration, not pretending bridges are exempt from platform rules.

No external provider is implemented or called in CH-001. Preserve the future provider decisions without building speculative SDK wrappers, settings forms, model catalogs, or fake connections now.

The conditional unattended-publication discussion remains outside this chapter. This assignment does not promote an earlier recommendation about Autopilot into an implemented feature or a blanket consent decision. No generation, scheduling, or publishing automation ships here.

## Decisions delegated for this chapter

Use the proposed TypeScript/React/Next.js, PostgreSQL/Drizzle, separate Node worker, pg-boss, local persistent storage, and shared Playwright/Chromium-rendering direction for a new repository. Select mutually compatible maintained versions, verify the relevant official documentation, and lock the actual versions. Existing compatible code should be reused instead of replaced.

Luna may choose small maintained supporting packages for authentication, schema validation, accessible controls, file handling, testing, and ZIP creation. Record consequential choices and their licenses. Do not change the main stack, add a hosted dependency, or redesign the product as a general-purpose graphics suite.

Preserve an existing repository license. The North Star's AGPL-3.0-only recommendation is not a license text already applied to a repository. If there is no explicit repository-level license decision, record the pending choice without inventing approval. Local implementation can proceed; a public release remains gated. Do not copy font files from the supplied research environment. Obtain any implementation fonts from a legitimate redistributable source and retain notices.

## Binding the unknown repository baseline

When Kyle dispatches this packet, Luna uses the workspace/repository attached to that session. Before editing, record its remote if available, branch, exact HEAD, dirty state, existing instructions, existing license, and relevant code. A supplied commit overrides a guessed branch tip.

An empty workspace is an authorized starting condition. Record `EMPTY_WORKSPACE` or `EMPTY_REPOSITORY` accurately; initialize local Git only where the session permits it. Do not create a GitHub repository, choose a new public destination, invent an author identity, force-push, or overwrite unrelated work. If the repository is already populated, inventory it and implement the compatible missing slice. A major stack/product conflict is a blocker to the conflicting change, not permission to rewrite the repository.

Do not ask Kyle for minor naming or styling choices. Make reasonable, documented decisions within the chapter. Complete safe in-scope work when an environmental limitation blocks another check, and report exactly what remains unverified.

## Importing the packet and maintaining authority

Recommended import location: `docs/chapters/CH-001/`, preserving the packet's relative paths. The frozen North Star under `reference/north-star/` is the baseline referenced by this chapter. Existing canonical specifications can remain at their established paths; record a path/hash mapping rather than creating a competing editable constitution.

Create or reconcile the repository's root `state/PROJECT_STATE.md`, `state/REQUIREMENT_STATUS.md`, and `state/EVIDENCE_INDEX.md`. Do not copy the historical `reference/north-star/state/PROJECT_STATE.md` over live project state. Merge relevant standing guidance into the actual root `AGENTS.md` without removing higher-priority repository instructions.

Operational state must identify CH-001, the exact spec hash, actual implementation base, and `implementation_in_progress` or `ready_for_review`. The last accepted application version remains `none` until review. Luna may not mark its own chapter `accepted` or mark the entire parent requirements complete from a partial v0.1.0 implementation.

The single-file edition of this assignment is a generated reading/transfer copy. When the modular packet is present, its source files are authoritative. Do not edit both independently.


---

<a id="part-brief"></a>

# CH-001 — Build the first real local slideshow studio

**Assignment revision:** CH-001-r1  
**Target application checkpoint:** v0.1.0  
**Execution mode:** maximum available reasoning effort; bounded implementation, not maximum scope.  
**Read first:** [activation and baseline](#part-activation).  
**Required gates:** [acceptance tests](#part-acceptance).  
**Required return:** [handoff template](#part-handoff).

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

Implement the checks in [ACCEPTANCE_TESTS.md](#part-acceptance), map them to real test files, and execute them. Use real PostgreSQL, local storage, and the pinned browser renderer for integration/E2E gates. Unit mocks can supplement these; they cannot replace the functioning local pipeline.

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


---

<a id="part-acceptance"></a>

# CH-001 — acceptance contract and evidence

**Applies to:** CH-001-r1 / target v0.1.0.  
**Status:** required tests to implement and execute; no application results exist in this planning packet.  
**Primary assignment:** [CHAPTER_BRIEF.md](#part-brief).

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

The source documents are in reference/north-star/docs (`reference/north-star/docs/`, in the full ZIP packet). Record actual results in root operational state, not in the frozen reference snapshot.

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

<a id="part-handoff"></a>

# Luna handoff — CH-001 / target v0.1.0

> TEMPLATE: Luna completes this after implementation. This file is not evidence that any work or test has occurred.

## 1. Control record

| Field | Actual value |
|---|---|
| Chapter/spec | CH-001-r1 / NS-0.2-draft, plus baseline SHA-256 |
| Repository / branch | Fill from actual workspace; redact credential-bearing remote URLs. |
| Starting base commit / empty condition | Exact value; never invent a SHA. |
| Implementation commit tested | Exact commit, or clearly identified uncommitted tree/patch hash. |
| Evidence/documentation commit | Exact value if separate; explain any post-test code changes. |
| Working tree at handoff | Actual status, including uncommitted and unrelated changes. |
| Status | `ready_for_review`, `changes_required`, or `blocked`; never architect-accepted. |
| Reference environment | OS, architecture, runtime, package manager, DB, browser, renderer/font versions. |
| Artifact index | Real repository path or accessible attachment/run reference. |

## 2. User-visible result

State what Kyle can do at this commit in concrete terms. Distinguish fully working manual flows, partial behavior, and missing behavior. Do not use “production-ready” as a substitute for an explanation.

Provide the exact clean-install commands and local URL from the implemented README, expected owner-setup steps, and any environment-specific prerequisites. Include no real credentials. Explain what stops when the worker/host is stopped and where persistent data lives.

## 3. Scope and architecture

Summarize changed modules and why. List new dependencies and versions, schema/migrations, render approach, authentication/session choice, upload/storage scheme, and queue transaction/reconciliation approach. State whether existing repository code was preserved/reused.

Identify consequential implementation decisions and any deviations from the brief. Link decision records. No approval should be inferred from merely writing an ADR.

## 4. Verification actually executed

| Command/procedure | Timestamp | Tested commit/tree | Exit/result | Counts | Evidence path |
|---|---|---|---|---|---|
| Replace with actual invocation | Actual time | Actual ID | Actual result | Executed/passed/failed/skipped | Real file/reference |

Record actual commands, not just desired script names. Explain retries of flaky or failed checks and whether the underlying problem was fixed. Explicitly label code inspection, unit mocks, real database tests, real browser rendering, CI-observed results, manual visual inspection, and restart exercises.

Summarize all 72 CH001 gates: passed, failed, and not run. Attach the filled gate-results file. A test that could not run because Docker/Chromium was unavailable belongs in NOT_RUN with the reason; it is not a passing mocked substitute.

## 5. Content and export evidence

Link the actual seven-slide sample, editor/final-preview screenshots, alternate-ratio output, and failure-state screenshots. Provide the sample ZIP hash, selected image hashes, the manifest, and the comparison showing final-preview response bytes equal extracted ZIP bytes. Explain any visual-diff tolerance and provide the actual diff report.

Record that fixtures were original/generated/licensed. State how screenshots/logs/exports were sanitized. Do not include provider keys, passwords, setup tokens, cookies, or private user content.

## 6. Persistence and recovery evidence

Summarize the browser-reopen and full container-restart checks, two-tab conflict behavior, lost-save-response behavior, worker crash/reclaim behavior, duplicate-finalization prevention, storage failure, and migration idempotence. Link evidence rather than asserting that “persistence works.”

## 7. Security and boundaries

State the effective host bindings, auth/ownership checks, CSRF/origin controls, upload limits, renderer sandbox/non-root configuration, browser environment isolation, and runtime network observations. Link the focused security and canary checks.

Disclose any skipped security gate or workaround. Do not hide an unsandboxed renderer, insecure auth bypass, or private-media leak under a nonblocking note.

## 8. External-action declaration

Report actual actions, not merely intended limits:

- Paid provider API requests/spend: expected `0 / none`; disclose any deviation immediately.
- ScrapeCreators/fal/LLM/publishing-bridge calls: expected `none`.
- TikTok authorization/public posts/direct official integration: expected `none`.
- Public deployment, release/tag/package/image publication, new remote repository: expected `none`.
- Network used for dependency/container/font/documentation retrieval: identify categories/sources as relevant, without secrets.
- Push/PR actions to an already authorized repository: state exactly what occurred and under which session authorization.
- Destructive cleanup: name only disposable test resources actually created/removed; normal app data should be untouched.

Do not fabricate a zero if an unexpected action occurred.

## 9. Remaining issues and gates

For every open issue, state the symptom, reproduction, impact, affected gate, evidence, and suggested bounded repair. Separate true blockers from minor nonblocking polish. Record unavailable environments and unverified support claims. Do not silently shrink the chapter to obtain completion.

## 10. Durable state and stop

Link updated root project/requirement/evidence state. Confirm parent requirements are marked partial or awaiting review as appropriate, the accepted version remains unchanged, and no next-chapter work began.

Optionally suggest one smallest next review/repair focus. Do not implement it. End with the repository/commit and artifact pointers Kyle needs for the architect's review.


---

<a id="part-sources"></a>

# CH-001 — technical references and verification boundary

**Checked for this assignment:** September 10, 2026. These are primary documentation references, not evidence that an application has been built. Recheck the selected dependency versions and security advisories during implementation. Do not freeze a version number copied from a documentation example without resolving compatibility.

| ID | Primary reference | What it supports / how to use it |
|---|---|---|
| T1 | Next.js, Self-hosting — `https://nextjs.org/docs/app/guides/self-hosting` | Self-hosted deployment/configuration and the distinction between server-only and publicly bundled environment variables. Our private default and lack of hosted dependencies are project decisions. |
| T2 | Playwright, Docker — `https://playwright.dev/docs/docker` | Browser/package compatibility, container setup, and the relationship between root execution and Chromium sandboxing. The documented development image/examples are not themselves an audit of our runtime isolation. |
| T3 | Playwright, Screenshots — `https://playwright.dev/docs/screenshots` | Capturing pages/elements to raster output. Our shared-scene, readiness, hashing, and immutable-preview/export rules are application contracts. |
| T4 | sharp, Constructor — `https://sharp.pixelplumbing.com/api-constructor/` | Decoder options for input-pixel limits, frame handling, orientation, and failure behavior. Bounds in this chapter are chosen project safeguards, not guarantees supplied by one constructor option. |
| T5 | OWASP, File Upload Cheat Sheet — `https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html` | Defense-in-depth for uploaded files, validation, safe naming/storage, authorization, and size restrictions. Implement and test the relevant controls, rather than treating an extension check as validation. |
| T6 | pg-boss official documentation — `https://pgboss.io/` | PostgreSQL-backed jobs and documented transaction/ORM integration, including Drizzle. Verify the adapter API for the pinned version. Queue guarantees do not by themselves atomically commit our filesystem artifacts or guarantee external side effects. |
| T7 | Drizzle, Migrations — `https://orm.drizzle.team/docs/migrations` | Explicit schema/migration workflows. Choose and document one reproducible method; do not silently mutate production schema from every process startup. |
| T8 | Docker, Compose startup/shutdown order — `https://docs.docker.com/compose/how-tos/startup-order/` | Dependency ordering and readiness conditions. A running container does not establish application/browser readiness. |
| T9 | Next.js, Authentication — `https://nextjs.org/docs/app/guides/authentication` | Authentication/session/authorization guidance and library-oriented implementation. Verify custom routes and data access, not only navigation redirects. |
| T10 | OWASP, Session Management Cheat Sheet — `https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html` | Session lifecycle and cookie-security considerations. The finite single-owner local deployment described here is an application scope decision. |
| T11 | OWASP, CSRF Prevention Cheat Sheet — `https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html` | CSRF defenses and origin-related protections. SameSite alone is not a reason to omit protection on custom mutation/upload endpoints. |

## No provider research required for this build

ScrapeCreators for Pinterest and a single fal.ai key for text plus image workflows are owner decisions. Later model selectors, model IDs, price displays, call budgets, and publishing bridges require their own current documentation and separately authorized qualification. None is implemented or live-tested in CH-001.

Do not copy illustrative model names/prices from earlier conversation summaries into product code as verified current defaults. Do not install an Anthropic/OpenAI/OpenRouter SDK or ask for another text key. Do not investigate or implement our own official TikTok developer-app/Content Posting API path.

## Baseline evidence

The frozen 19-file North Star source snapshot is supplied under `reference/north-star/`, with hashes in `BASELINE_HASHES.json`. It contains historical proposed/pending state and the mature roadmap. The chapter activation document explains the operative checkpoint without rewriting that history. `CHAPTER_BRIEF.md` is the bounded current assignment; `ACCEPTANCE_TESTS.md` is its finite gate ledger.

This packet's validation checks document structure, references, source hashes, and gate consistency only. They do not execute pnpm, compile an app, create an owner, generate media, run a browser worker, qualify a provider, or post content.


---

<a id="part-prompt"></a>

# Prompt to paste into Luna

Set the agent interface to **MAX / highest available reasoning effort** before starting. The wording below requests careful work; an uploaded Markdown file does not itself change a runtime effort setting.

---

Execute CH-001-r1 for Open Slideshow Studio, targeting **v0.1.0**, our first working checkpoint—not the complete v1.0 product. Use your highest available reasoning effort and treat the attached chapter packet as the assignment. Build and verify the implementation; do not return only another plan or stop at a scaffold.

Read ACTIVATION_AND_BASELINE.md, CHAPTER_BRIEF.md, ACCEPTANCE_TESTS.md, HANDOFF_TEMPLATE.md, and the referenced NS-0.2 baseline. The combined LUNA_CH001_v0.1.0_COMPLETE.md contains the operative assignment and baseline root when supplied as one file. Inspect your attached repository/workspace and its existing instructions first. Record the real base commit and preserve existing work. If the workspace is empty, establish the new local project as the chapter permits.

The outcome is a real private manual slideshow studio: owner login, persisted projects, safe local image uploads, a usable three-layout/two-format editor, manual text and framing controls, autosave/undo/conflict protection, a durable separate render worker, exact final JPEG previews, and an ordered JPEG/text/manifest ZIP export. Use the approved TypeScript/Next.js/PostgreSQL/Drizzle/pg-boss/shared Playwright-renderer direction. Verify and pin compatible dependency versions.

Implement **only CH-001**. No provider calls/SDKs, API-key setup, AI generation, Pinterest integration, social connection, publishing, scheduling, MP4, billing, public deployment, or work on the next checkpoint. Preserve the future commitments: ScrapeCreators for Pinterest; one fal.ai key for selectable text and image models; no direct official TikTok Content Posting API integration.

Run the real required checks and exercise the actual app/database/storage/browser worker. Fix in-scope failures. Never substitute mocks for a working local pipeline, fabricate test results, weaken tests, erase unrelated files, or disable security to claim success. Record unavailable environment checks as NOT_RUN/blocking instead of pretending they passed.

Return the completed state/handoffs/CH-001.md, the actual repository/branch/implementation commit, all gate results, command outputs, screenshots, a sample seven-slide export, and honest remaining issues. Update root state to awaiting review, not accepted. **Stop after this checkpoint.** Do not begin v0.2.0 or publish a release.


---

<a id="part-baseline"></a>

> Historical baseline appendix. Its pending/planning labels describe the earlier snapshot. Part 1 records the subsequent CH-001 dispatch authority; Part 2 selects the manual v0.1.0 subset. This appendix is not permission to implement the rest of the roadmap.

# North Star — an original open slideshow creation system

**Revision:** NS-0.2-draft  
**Prepared:** September 10, 2026  
**Owner:** Kyle  
**Approval:** pending  
**Implementation status:** not started in this package  
**Working descriptor:** Open Slideshow Studio

## 1. The mission

Build a free, genuinely open-source, self-hostable application that makes it straightforward to create, organize, improve, and publish TikTok photo slideshows using the operator's own accounts and API keys.

The product should feel like a coherent creator application, not a folder of scripts. A person should be able to supply a topic or brief, choose a reusable story structure, find or generate appropriate visuals, edit the exact slides, review the result, and export or publish it. A returning creator should be able to repeat that process efficiently through curated image collections, saved hooks, reusable recipes, batch generation, review queues, scheduling, and performance feedback.

We are preserving the **job to be done**, not another company's presentation. We will develop our own design system, information architecture, language, recipes, implementation, and community identity. We are not asserting that we can reproduce a competitor's private algorithms, integrations, or conversion outcomes.

The finished product is successful when its users retain control over their content, credentials, production workflow, and costs, and when the community can inspect, run, modify, and contribute to the software without buying a license subscription from this project.

## 2. Fixed commitments from Kyle

| ID | Fixed commitment | Practical consequence |
|---|---|---|
| NS-F01 | The project itself is free and open source. | No paid app tier, credit resale, subscription gate, artificial watermark, or license server. |
| NS-F02 | Users bring their own provider credentials. | External invoices belong to users; keys remain in their deployment, not a project-operated proxy. |
| NS-F03 | Pinterest search uses ScrapeCreators. | Build its adapter first; do not substitute another scraper because it is easier for the agent. |
| NS-F04 | AI generation uses fal.ai wherever practical. | One user-supplied fal.ai key powers both supported text generation (through fal's LLM routing) and image generation/editing; expose curated model selectors instead of requiring a separate LLM key. |
| NS-F05 | Workflow capability and ease matter; direct copying does not. | Recreate useful functional outcomes with original UI, names, assets, recipes, and code. |
| NS-F06 | Development proceeds through checkpoints. | No single giant instruction to implement the entire vision. |
| NS-F07 | Kyle drives the orchestration loop. | The architect reviews when prompted; Luna implements separately; no background oversight is implied. |
| NS-F08 | The North Star precedes the first implementation brief. | Approval and a separate chapter are required before v0.1.0 work begins. |
| NS-F09 | Do not build against TikTok's official Content Posting API. | TikTok publishing uses qualified third-party bridge adapters or manual export/handoff unless Kyle explicitly reverses this decision. Do not spend implementation effort on TikTok developer-app approval flows. |

These are not suggestions for Luna to reconsider. A requested change must be surfaced to Kyle explicitly.

## 3. The product promise, in concrete terms

A first-time user can install the released package, create an owner login, skip all provider setup, upload their own images, type slide text, choose an original layout, and export an ordered image pack. There is no requirement to buy AI credits to use the editor.

A user who adds a ScrapeCreators key gains Pinterest discovery. A user who adds a fal.ai key gains both supported text-generation assistance and supported image-generation/editing tools, with separate curated model selectors for copy and imagery. No second LLM credential is required for the normal AI workflow. A user who connects a qualified publishing service gains TikTok connection, account-aware review, supported direct publishing, inbox handoff, and scheduling. Each capability can fail independently without destroying the rest of the workflow.

A frequent creator can build a reusable recipe around an audience, story pattern, hook library, visual pools, typography, product/CTA treatment, and a schedule. The system can create a bounded set of future drafts. The creator reviews actual content and approves specific immutable posts. The scheduler delivers those approved posts within the selected route's real capabilities.

A technically skilled operator can run the same application continuously on their own server, configure durable storage, integrate through a documented API, and contribute new adapters. They should not need to fork core business logic just to replace a provider.

## 4. What “free” means here

The software license and ordinary application features carry no project-imposed fee. Users may still incur inference charges, Pinterest discovery credits, a publishing-service bill, storage costs, bandwidth, electricity, or server costs. Those dependencies are disclosed at setup and before costly operations.

The application must not advertise that the complete workflow is always free, that a bridge's free tier is permanent, or that the user will save a guaranteed percentage. Savings depend on volume, provider choices, failed generations, hardware, and the value of maintenance time.

Local manual creation and export must remain a genuinely useful fallback. Losing a provider account must not lock users out of their existing library or drafts. A free open-source client is not a commitment by Kyle to operate free cloud infrastructure for everyone.

## 5. Primary users and supported deployment boundary

**Primary user:** one creator or small-business operator using a private installation and one or several social accounts they are authorized to manage. They want a polished workflow with direct costs and no software subscription.

**Secondary user:** a developer or technically comfortable creator running a private server for continuous processing and contributing improvements.

**Later user:** a small trusted team collaborating inside one deployment. The architecture preserves workspace ownership and authorization boundaries, but public multi-tenant hosting for arbitrary strangers is not a launch claim. Supporting trusted collaborators still requires real permissions and credential isolation; “trusted” is not a reason to expose secrets.

The initial distribution target is a self-hosted web application with a tested container installation. A desktop wrapper, fully browser-only application, mobile-native editor, hosted account service, and cloud marketplace are separate proposals, not hidden requirements.

## 6. Definition of the mature core

The mature slideshow product includes the following connected capabilities. A release may stage them, but the scope cannot quietly shrink to “generate a few images.”

### 6.1 Brief and narrative

Projects, audience and brand briefs, reusable narrative recipes, original starter layouts, hook libraries, CTA policies, optional structured copy generation, language selection, alternate hooks, manual overrides, and explicit factual-review warnings. Product claims originate from user-provided facts, not a model inventing testimonials or outcomes.

### 6.2 Visual discovery and production

Own-image upload, searchable local library, ScrapeCreators Pinterest discovery, import with provenance and rights status, collections, slide-role pools, usage history, duplicate awareness, fal.ai image generation and supported editing/reference workflows, selective regeneration, and persistent local copies of accepted media.

### 6.3 Editing and rendering

An original, approachable slide editor with slide order, add/remove/duplicate, separate text blocks, type styles, alignment, background treatment, crop/focal point, simple collage layouts, cover selection, consistent dimensions, undo/redo, autosave, revision history, and a reliable final preview. Native photo output is the primary deliverable. MP4 montage export is a separately labeled convenience, not a replacement for a swipeable photo post.

### 6.4 Delivery and operations

Ordered image-pack export, project portability, caption/title/hashtag handoff, connected account identity, capability-aware review, explicit consent, applicable disclosures, supported direct publication, TikTok inbox handoff, scheduling, account reconnection, delayed status reconciliation, cancellation semantics, retries that do not knowingly duplicate side effects, and a useful activity history.

### 6.5 Repeatable production

Recurring draft series, bounded batch generation, per-run budgets, curated asset selection, reuse rules, pause controls, review queues, individually approved scheduled content, missing-slot warnings, and operator-visible failures. A failed provider operation must not become an infinite loop or an unexplained charge.

### 6.6 Learning and interoperability

Available provider-supplied metrics, clearly marked unavailable metrics, content/recipe comparisons without false causal claims, source timestamps, basic exports, versioned data formats, a narrow documented automation API, and community-contributed original recipes and adapters under appropriate licenses.

## 7. Scope lanes and honest parity

| Lane | Included outcomes | Release interpretation |
|---|---|---|
| Core slideshow system | Sections 6.1–6.6, at the supported single-operator level. | The stable slideshow release cannot claim completion without these acceptance outcomes or an explicit approved scope amendment. |
| Qualified publishing | A selected bridge and specific account/media/operation capabilities. | A documented capability is provisional until tested; unsupported combinations remain disabled and explained. |
| Conditional unattended publishing | Publication of future content that no person has individually reviewed. | Not enabled by default, not promised as compliant, and not counted as shipped until the exact route and consent workflow are validated and Kyle approves a separate decision. |
| Extension lane | Advanced UGC video, avatars, voiceover, lip sync, longer motion/video workflows, more social platforms, trusted team workflows beyond initial roles. | Tracked as real future scope, not silently forgotten, but not a prerequisite for the first stable slideshow product. |

Calling the initial product a full one-to-one replacement for every video, account, or platform feature would be inaccurate. The goal is a complete original slideshow workflow first, with deliberate extensibility. The adjacent-video lane exists because it is useful, not because the agent should build every available fal.ai model interface now.

## 8. Non-goals and prohibited shortcuts

Do not reproduce Reel.farm's logo, trade dress, named proprietary formats, paid template text, private prompts, source code, pricing model, or scraped paid library. Generic capabilities such as collections and schedules are not a mandate to copy the competitor's screens.

Do not build billing, Stripe integration, a virtual credit wallet, SaaS subscriptions, a project-operated credential broker, a mandatory analytics service, or an account marketplace. Do not add arbitrary quotas to induce payment. Technical safety limits are allowed and must be explained as such.

Do not use session-cookie theft, undocumented mobile endpoints, CAPTCHA evasion, account farming, or anti-spam bypasses as a TikTok publishing strategy. Do not ship a universal TikTok client secret inside public source code. Do not assume a scheduler service makes every marketing or copyright use permissible.

Do not treat Pinterest discovery as a license to republish any found image. Do not remove watermarks to make an asset usable. Do not fabricate real-user endorsements or disguise synthetic spokespeople as genuine customers. Do not make a private beta look production-ready by filling unsupported analytics with zeroes.

Do not solve a small private-app problem with an unnecessary distributed platform. A new dependency must earn its installation, security, maintenance, and contributor costs.

## 9. Proposed architecture in one view

Use a TypeScript application with a React/Next.js web interface and server API, a separate durable Node worker, PostgreSQL for persistent domain state, and a PostgreSQL-backed job system such as pg-boss. Store media on a persistent local volume by default, behind a storage interface that can later support S3-compatible storage.

Use one shared declarative slide representation and a pinned browser renderer for both composition and final output. A Playwright/Chromium render worker captures trusted, locally assembled slide components; it does not execute arbitrary user templates. Local rendering avoids per-slide rendering-service fees. A separate FFmpeg-based extension can create an explicitly labeled MP4 montage.

Provider integrations live behind narrow interfaces. The rest of the app should reason about image search, image generation, text generation, publishing, media storage, and account capabilities—not vendor JSON scattered through UI components.

This is a design recommendation, not a claim that the selected tools have been installed or benchmarked. The detailed rationale and tradeoffs are in architecture (`reference/north-star/docs/02_ARCHITECTURE_AND_DATA.md`, in the full ZIP packet). Primary technical references are recorded in the source register (`reference/north-star/docs/08_SOURCES.md`, in the full ZIP packet).

## 10. Provider direction

ScrapeCreators and fal.ai are fixed. The fal.ai credential is the normal AI credential for both copy and imagery: text generation routes through a qualified fal.ai LLM endpoint/model selector, while image generation routes through a qualified fal.ai image-model selector. Manual text and user-owned images remain first-class and require no AI key.

For TikTok, qualify **Zernio first**, retain **Upload-Post as the researched fallback**, and consider **Post Bridge as an optional integration for existing subscribers**. This is a documented-fit recommendation, not a hands-on reliability ranking. The official TikTok Content Posting API is intentionally outside project scope because its developer-app approval path conflicts with the low-friction local/self-hosted goal. The recommendation, pricing caveats, retention limits, and live tests are specified in providers and publishing (`reference/north-star/docs/03_PROVIDERS_AND_PUBLISHING.md`, in the full ZIP packet).

The first chosen bridge is replaceable. A policy, price, reliability, or retention change must not force a rewrite of the editor or asset library. Nor should the team implement three publishing integrations before completing one real end-to-end path.

## 11. Invariants that outweigh convenience

**NS-I01 — Content remains editable and portable.** Provider-specific output is normalized into owned project data. Existing content remains available when a key is revoked.

**NS-I02 — Secrets never become browser configuration.** Provider calls originate server-side. Keys are not stored in localStorage, public environment variables, client bundles, exported projects, screenshots, or diagnostics.

**NS-I03 — A publication points to an immutable approved revision.** Approval covers media, text, account, mode, disclosures, privacy, and timing. A material edit invalidates the corresponding approval before a new side effect can occur.

**NS-I04 — External uncertainty is represented honestly.** A timeout may mean “outcome unknown,” not “nothing happened.” A delivered TikTok inbox draft is not a publicly published post. A success HTTP code may still contain a platform failure.

**NS-I05 — One publication has one scheduling authority.** Local scheduling and provider scheduling may coexist across different publications, but they must not compete to submit the same one.

**NS-I06 — Consent is an event, not a hardcoded boolean.** Automated generation does not imply consent to publish unseen content. Required provider flags must be derived from real review and authorization.

**NS-I07 — Money is a side effect.** Estimates, reservations, call limits, reconciliation, and explicit retry policy apply to paid operations. Unknown pricing is displayed as unknown, not zero.

**NS-I08 — Asset use preserves provenance.** Imported and generated assets retain origin, derivation, rights assertions, and applicable restrictions. Changing a crop does not erase that history.

**NS-I09 — Failure is local whenever possible.** A dead publishing key does not break editing. A text-generation failure does not erase selected images. One failed slide does not automatically regenerate every paid asset.

**NS-I10 — Evidence determines progress.** Acceptance requires actual artifacts and checks tied to a commit. Documentation-only, mock-only, and live-tested are distinct states.

**NS-I11 — Originality is intentional.** Product language, design tokens, layouts, demonstrations, and community assets are independently produced or appropriately licensed.

**NS-I12 — Every chapter is bounded.** Neither the North Star nor an agent's enthusiasm authorizes the next milestone. The current chapter ends with a handoff and review.

## 12. Quality bar and success measures

Success means a reliable useful workflow, not a feature count. Track the share of clean installations that reach a first local export, the number of irreversible mistakes prevented, draft-to-review completion, render defects, unattended job recoveries, unexpected billable retries, publication-state accuracy, and successful project/backup restores.

Set measured targets in implementation chapters after an explicit reference environment exists. Initial engineering targets may include a seven-slide manual export with no external credentials, no clipped text in the supported test corpus, consistent preview/export layout in the pinned renderer, and recovery after a worker restart without losing accepted provider request IDs. These are acceptance objectives, not benchmark results.

Never use engagement growth as the only quality metric. The application cannot guarantee virality or sales. A polished post with truthful content and an accurately reported failure is preferable to a duplicate or unauthorized post hidden behind a green checkmark.

The stable release must include user documentation, clean-install testing, backup/restore evidence, accessibility checks for its main journey, credential redaction checks, real provider qualification for advertised integrations, and a truthful support matrix. A mocked demo is useful for development but cannot satisfy live publishing acceptance.

## 13. Licensing and community posture

Recommend **AGPL-3.0-only** for the project's source code, pending Kyle's approval. The rationale is reciprocity for modified network-served versions, while keeping the software genuinely open source. It does not mean “non-commercial only”; commercial use is allowed under the license's conditions. It does not automatically make users' ordinary content or API keys open source. The precise license text governs, and third-party license compatibility must be checked. S27 (`reference/north-star/docs/08_SOURCES.md`, in the full ZIP packet)

No license is being applied to a code repository by this planning document. Before public release, record the selected SPDX identifier, copyright holders, notices, dependency licenses, contributor terms, and licenses of bundled original recipes/assets. Do not ship font files from this research environment. The implementation may obtain appropriately licensed fonts separately and preserve their notices.

Community contributions should be small, reviewable, documented, and tested. New providers must implement the common contract and pass conformance tests. New templates must be declarative and come with permission to redistribute them. A community recipe gallery is not an unreviewed remote-code execution mechanism.

## 14. How the project moves forward

Kyle reviews and approves or amends this baseline. The architect then creates a separate, bounded v0.1.0 chapter. Luna implements only that chapter against an identified Git commit and produces a structured handoff. Kyle returns with the repository/commit. The architect inspects actual changes and evidence, records a verdict, and only then proposes the next chapter.

Use conventional milestone identifiers such as `0.1.0`, `0.2.0`, and `0.3.0`; use patch releases for corrections. A chapter may be smaller than a release, and a failed checkpoint may require a repair chapter. Numbers are coordination labels, not promised dates or automatic authorization.

The durable context is the approved North Star, accepted decisions, actual repository, current project state, and checkpoint evidence—not the memories of either assistant. The detailed protocol is in orchestration (`reference/north-star/docs/06_ORCHESTRATOR_LUNA_PROTOCOL.md`, in the full ZIP packet).

## 15. Final decision test

Before accepting a feature or architectural change, ask:

1. Does this make the creator's real brief-to-post workflow easier or more reliable?
2. Can the user still control their keys, content, provider choice, and spending?
3. Is the capability original, appropriately licensed, and supported by the relevant route?
4. Is the external side effect authorized, observable, and recoverable without hiding uncertainty?
5. Is this the smallest sound implementation for the current approved chapter?
6. Can another contributor understand and verify it from the repository alone?

A proposal that fails one of these tests needs revision or an explicit approved exception. Feature similarity to a competitor is not, by itself, enough reason to ship it.
