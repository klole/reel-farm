# 01 — Product and user-experience specification

**Status:** proposed requirements, not implemented behavior.  
**Parent:** [North Star](../NORTH_STAR.md)  
**Purpose:** define what users should be able to accomplish, why each capability exists, and how the experience behaves when things go wrong.

Requirement identifiers in this chapter remain stable even if sections move. An implementation chapter selects a subset; it does not authorize the entire chapter. Unless explicitly marked “extension,” these are mature-core requirements. Detailed controls may arrive in successive checkpoints.

## A. The original experience

The application is a **studio with a production queue**, not a dashboard designed around a subscription. Its primary navigation is proposed as **Studio, Library, Recipes, Planner, Results, Settings**. These are functional working labels, not a finished brand identity.

The main creative path is **Brief → Story → Visuals → Polish → Review → Deliver**. Users may move backward without losing work. A returning user can start from a recipe or duplicate a past draft rather than repeat a wizard. Advanced users can edit directly in the studio. The stepped path and the direct editor manipulate the same project data; they are not separate implementations.

Use a calm, original visual language: clear hierarchy, large slide previews, readable form labels, useful empty states, and action buttons that describe consequences. Do not reproduce a competitor's sidebar proportions, signature gradients, illustrations, icons, template names, or promotional copy. A design-tokens file should define the project's own type scale, spacing, colors, radii, and focus treatment before extensive screen development.

A global status area shows whether work is saved, whether a job is running, and whether the installation can currently process scheduled local work. It must not imply that closing a laptop leaves the local worker running. A green connected-account badge is not a guarantee that the platform currently allows a post.

## B. Getting started and organizing work

### PRD-001 — First-run installation and owner setup

The released package must have a short, documented installation path with published container images, persistent volumes, a generated secret, and one owner-creation flow. The user should not need to create accounts with several infrastructure services before reaching the editor. Show storage location, local/server mode, and the implications of stopping the installation.

After login, offer “Create with my own images” and optional provider setup. Do not place all provider keys in a mandatory first-run form. If a key test would spend money, say so and obtain explicit permission; a harmless connection check must not secretly generate a sample image.

### PRD-002 — Useful operation with zero provider keys

A user can create a project, upload images, type and style text, rearrange slides, save, reopen, and export without any AI or publishing integration. Internet-dependent operations are clearly unavailable, not broken-looking blank panels. Existing local content remains usable when every external service is offline.

This is a resilience requirement as well as a cost requirement. Manual creation is not a demo mode and has no project-imposed watermark or reduced export quality.

### PRD-003 — Language, time zone, and preference setup

Store interface locale, content language, and scheduling time zone separately. A user may write Spanish content in an English interface and schedule for a different audience's zone. Detect a likely time zone but ask the user to confirm it before scheduling. Use an IANA identifier internally, not an ambiguous abbreviation.

Do not claim complete localization until interface strings, typography, generated-copy prompts, error messages, and export behavior have been tested for each supported locale. English is the initial interface target; content language support grows through explicit test coverage.

### PRD-004 — Projects and practical organization

A project groups a brand or content initiative, its brief, recipe choices, drafts, collections, series, and publication history. Projects have human-readable names, optional descriptions/tags, an archive action, and a last-edited view. Project deletion is distinct from archive and requires a clear inventory of affected local records and any outstanding remote actions.

Avoid forcing users to understand a complex agency hierarchy. One private installation starts with one workspace and an owner. Project boundaries still matter for search, cost reporting, content separation, and later permissions.

### PRD-005 — Versioned content brief

A brief captures audience, goal, tone, topic boundaries, language, brand facts, product facts, prohibited claims, visual preferences, CTA behavior, and source notes. Required inputs remain small; optional sections progressively expand.

Changes to a brief affect future generation, not previously approved posts. Each generation run records the brief version it used. A user can explain why an older draft sounds different without having to reconstruct a deleted prompt.

## C. Story and reusable creative structure

### PRD-006 — Narrative recipes

A recipe is a versioned content structure combining slide roles, text constraints, visual-selection rules, layout choices, and optional generation instructions. It is not arbitrary executable code. Examples of independently authored story patterns include a practical checklist, a misconception followed by explanations, a process walkthrough, a comparison using user-provided facts, and a product use-case sequence.

A recipe specifies a minimum/default/maximum slide count, where a hook or CTA belongs, whether body slides repeat a pattern, and which slots are optional. Show a small visual storyboard before generation. Users can fork a recipe without changing the original or drafts already created from it.

### PRD-007 — Hook libraries and variants

Users can write, import from their own text, tag, favorite, and retire hooks. A hook can be static text or an original parameterized pattern. The library distinguishes “select from approved hooks” from “ask the model to invent one.” Store usage history and allow a reuse interval per project/series.

Generating three hook alternatives should not regenerate seven backgrounds. Selecting a hook must update the relevant text slot and create a new draft revision. A warning about recent reuse is informative; the app should not pretend it knows which hook will go viral.

### PRD-008 — CTA and product-slide control

A CTA can be disabled, written manually, selected from an approved library, or generated from verified product facts. Users control its position, frequency, and visual treatment. A recipe can use different assets for the hook, body, and product/CTA slide.

Product facts and product imagery can be locked against model rewriting. The app must not invent discounts, customer counts, testimonials, regulatory approvals, or measurable outcomes. A product slide is a useful marketing capability, not permission to create deceptive claims.

### PRD-009 — Reversible creative steps

Each step saves a clear intermediate artifact: brief, story outline, selected visual plan, editable slide document, reviewed render, and delivery intent. Going back to change a hook preserves other work unless the user explicitly chooses wider regeneration.

When a change affects downstream output, explain the scope: “This changes slides 2–4 and requires a new preview” is better than silently discarding a rendered deck. A step can be complete for manual content without calling a model.

## D. Asset discovery, ownership, and reuse

### PRD-010 — A real local media library

The Library offers upload date, dimensions, source type, tags, collection membership, project usage, rights status, and generation origin. Search and filters work over locally stored metadata without an external API charge. Thumbnails are derived from accepted local media, not permanently dependent on a provider's expiring CDN URL.

Selecting an item shows its original, allowed operations, provenance, and every draft that references it. Removing an item from a collection does not delete the asset. Deleting a shared asset requires dependency-aware handling.

### PRD-011 — Rights and provenance are visible

Represent at least: source unknown, user-owned, licensed, permission asserted, public-domain assertion, and generated with model terms recorded. These are recorded assertions, not automated legal determinations. The user can add license/source links and notes, plus restrictions such as attribution or limited campaign use.

Pinterest results start as discovery records with unknown reuse rights. Importing is an explicit action with source visibility and an appropriate rights acknowledgment. Acknowledgment does not magically supply rights; the design makes the user confront and record the decision. Pinterest itself directs users to obtain permission when needed. [S25](08_SOURCES.md#s25)

The application does not remove watermarks or propose that changing an image's crop makes it safe to reuse. Public community examples must use redistributable assets, not the contents of a search-results page.

### PRD-012 — ScrapeCreators Pinterest discovery

The Visuals step and Library expose a Pinterest search tab backed by the user's ScrapeCreators key. The UI provides a query field, an explicit Search action, a result grid, source links, dimensions when available, and selection into a draft or collection.

A user must understand that this is third-party discovery, not signing into Pinterest or receiving image licenses from Pinterest. The app should not require an unrelated Pinterest developer credential for this route. API details are centralized in [provider contracts](03_PROVIDERS_AND_PUBLISHING.md).

### PRD-013 — Predictable pagination and search costs

Search is not triggered on every keystroke. Explicit pagination or “Load more” makes further requests visible. Show source-credit consumption when supplied; otherwise show an honest estimate or “usage unavailable.” Cache identical recent query-page requests within an operator-configured policy and explain when results are cached.

A failed later page keeps already loaded results. An exhausted key offers “Use my library,” not a dead-end modal. The application may impose configurable request/page safety limits, but it must not describe those as a vendor limit without evidence.

### PRD-014 — Collections and role-based visual pools

Collections can be assigned to hook, body, product, or background roles. Membership can be manual; tags can assist filtering. A series can exclude recently used assets and choose between random-without-replacement, ordered, or explicit selections.

Require a curated, rights-reviewed pool before enabling unattended draft generation from external discovered images. When a pool is exhausted, stop or use an explicitly approved reuse policy; do not silently search the wider web and import whatever appears.

### PRD-015 — Safe, observable media import

Import is a job with progress and per-item outcomes. Fetch through the controlled server-side importer, verify the actual content type, limit bytes and decoded dimensions, normalize orientation, and save the accepted original plus thumbnails. A remote URL is not sufficient proof that an asset is durable.

Show failures such as inaccessible source, unsupported format, too-large image, suspicious URL, or corrupt file in plain language. Retry only the failed import when safe. A selection that has not finished importing cannot be quietly used in a final render.

### PRD-016 — Exact and near-duplicate awareness

Exact byte/content hashes prevent storing unnecessary copies within the supported privacy boundary. A perceptual similarity signal may suggest near duplicates, but does not prove the same license or origin. Preserve multiple provenance records when sources differ.

Users can see previous uses of an image or closely related crop. The purpose is creative variety and storage efficiency, not bypassing a platform's duplicate-content checks. Do not mutate media automatically to evade platform detection.

### PRD-017 — Straightforward upload and import of owned material

Support drag-and-drop and file-picker uploads, individual and small batch images, appropriate image validation, meaningful filenames, and collection assignment. Original filenames are metadata, not trusted filesystem paths. The system allocates its own storage names.

A user's product images, logo, and reference images can be private within the installation. Before transmitting them to an image model or publishing provider, show which external service will receive them. A local upload is not blanket permission to distribute the file to every integration.

## E. Image generation and copy assistance

### PRD-018 — Small, tested fal.ai model catalogs and selectors

Expose curated fal.ai selectors rather than a single hard-coded model. The image selector includes task-oriented presets such as economical draft imagery, higher-quality imagery, and supported image editing. The copy selector exposes a small qualified set of inexpensive and higher-quality LLMs available through fal.ai. Each option maps to a specific tested endpoint/model ID and schema revision. Show capabilities, price basis/date when known, output dimensions or text capability, and relevant limitations.

Do not create an advanced-looking universal model browser before the common workflow works. New models may differ in reference-image support, seeds, image counts, formats, licensing, and duration. Unrecognized fields must not be guessed from another model's schema.

### PRD-019 — Prompts and reference images stay understandable

The user can edit a visual brief, inspect the actual generation prompt, select an appropriate reference image, and decide how many variations to request. Defaults should produce useful compositions with room for overlay text rather than relying on the image model to render every caption perfectly.

A reference-image feature is shown only for models that support it. Users can lock an existing product image and use generated backgrounds around it through supported editing, rather than having a model invent a different product. The interface never promises exact identity preservation without tested model evidence.

### PRD-020 — Selective paid regeneration

Users can regenerate one image, one text block, one slide's writing, or a deliberately selected subset. The confirmation explains what remains untouched and the expected additional usage. Batch requests have a visible count and budget limit.

Partial success is retained. If five of six images succeed, the five do not disappear and are not regenerated automatically. Re-running a button after navigation should resume the existing operation when appropriate, not charge for an invisible duplicate.

### PRD-021 — Long-running work survives navigation

Generation status remains visible after refresh or a browser close/reopen while the server is running. Store the provider request identifier as soon as it is known. A job moves through meaningful states such as preparing, queued with provider, processing, importing, ready, failed, cancelled, or outcome uncertain.

Cancellation is honest: a provider may already be executing work. The app distinguishes a local cancellation request from a confirmed remote cancellation and does not promise a refund. A lost browser connection does not mean the provider stopped.

### PRD-022 — Generated-media provenance

An accepted generated asset records provider, model identifier, prompt version, parameters, references, seed when available, request identifier, creation time, parent assets, and known usage/cost metadata. Sensitive prompt retention follows the installation's policy.

A generated asset may still need disclosure and model-term review. “AI-generated” is not a blanket guarantee of exclusive ownership, copyright protection, factual accuracy, or permission to depict a real person in a commercial endorsement.

### PRD-023 — Optional structured text assistance

Manual text is always available. Automated copy uses the same user-supplied fal.ai key as image generation, routed through fal.ai's LLM/OpenRouter integration. The copy UI exposes a small qualified model selector with an inexpensive default and optional stronger models; no separate Anthropic/OpenAI/Google credential is required for the normal workflow.

Generate into a versioned schema containing title candidates, slide roles, text blocks, caption, CTA, warnings, and optional source references from supplied brief material. Validate the structure before writing a draft. Structured output helps shape data but is not evidence that the content is true. [S21](08_SOURCES.md#s21)

### PRD-024 — Rewriting does not override user locks

Support shorter, clearer, alternate tone, alternate hook, and selected-slide rewriting. Lock individual text blocks or slides against generation. Preserve manual edits unless the user explicitly includes them in a regeneration selection.

Show an inspectable before/after change. A model cannot add slides beyond the requested validated structure, remove mandatory disclosures, or substitute a fabricated product claim because that made the story sound stronger.

### PRD-025 — Factual review and claim discipline

Distinguish user-provided factual claims from generated connective language. Flag unsupported statistics, comparative claims, quotations, and medical/legal/financial assertions for review rather than supplying fabricated citations. The product is not an automated fact-checking authority.

Original starter recipes should avoid relying on fabricated urgency, fake personal experience, or invented customer testimonials. In sensitive or regulated use cases, the operator remains responsible for appropriate review. The app can make the needed review visible without pretending to certify compliance.

### PRD-026 — Language-aware copy and layout

Specify content language in generation and store it on the draft. Validate overflow with the selected font and renderer, not English character counts alone. Test long words, punctuation, accented characters, emojis supported by the chosen font stack, and line breaks.

Right-to-left and complex-script support are explicit support-matrix entries. Do not silently label a locale supported because a model can output its text. A chapter adding a locale must include rendering and editing fixtures.

## F. Recipes, layouts, and the editor

### PRD-027 — Declarative, portable recipes

Recipe JSON defines slide roles, allowed blocks, palette/style tokens, visual placement, copy constraints, and generator options. It can be exported and imported after schema validation. It cannot contain scripts, arbitrary remote stylesheets, secret references, shell commands, or unbounded template expressions.

Import provides a compatibility report and safe preview. Versioned migrations preserve meaning or explain unsupported fields. An untrusted community recipe must not trigger provider calls merely by being opened.

### PRD-028 — Original starter kit

Ship a small, high-quality collection of independently authored recipes and layouts, each with license metadata and a clear purpose. The first set should cover common narrative needs rather than a huge number of cosmetically identical options.

Examples can include “Everyday checklist,” “Explain it simply,” “Small process, clear steps,” and “One product, several uses.” These names are illustrative working text, not a clearance claim. Demonstration images should be owned, procedurally created, or licensed for redistribution.

### PRD-029 — A practical slide editor

The editor contains a slide strip, a large canvas, and a context-aware inspector. Selecting a text block reveals text controls; selecting an image reveals crop/replacement controls. Add, delete, duplicate, and reorder are accessible without drag-only interaction.

A new user should not need to understand layers, coordinates, or rendering internals. Advanced placement can be offered without replacing simple layout presets. A slide's role remains visible so the user can see the story, not just isolated graphics.

### PRD-030 — Canvas presets and safe composition

Provide original presets for vertical 9:16 and portrait 4:5 output, with square as a later tested preset if useful. Proposed default raster targets are 1080×1920 and 1080×1350; these are product presets, not a claim that TikTok mandates one size. The adapter validates actual platform requirements separately.

Show optional conservative text-safe guides with a warning that in-app overlays vary by device and platform UI. Keep all slides in a post consistent unless an explicit supported workflow permits otherwise. Do not silently stretch imagery or convert a native photo carousel into a video to handle an unsupported ratio.

### PRD-031 — Typography that survives export

Support multiple text blocks, alignment, font family from a curated licensed set, weight, size, color, line height, spacing, emphasis, background panels, shadow or outline where supported, and position within a layout. Text wrapping and overflow indicators come from measured layout.

Never shrink text indefinitely to make an overlong paragraph fit. Offer a readable minimum, overflow warning, manual editing, or a bounded rewrite. Product defaults should prioritize readable output on a phone. Fonts are pinned and loaded before final rendering; missing fonts produce an explicit error rather than an unnoticed substitution.

### PRD-032 — Crops and focal points are nondestructive

Store the original asset and a crop/focal-point transform, not just a destructively cropped replacement. Users can choose fill/fit, reposition, reset, and replace an asset while retaining appropriate layout settings.

A crop should be reproducible in preview and export. Replacing a portrait with a landscape image should surface a composition warning instead of silently cutting off a face or product label.

### PRD-033 — Simple collage and mixed slide treatment

Allow a small set of declarative grid/split-image layouts and per-slide style overrides. Recipes can mix a hook treatment, explanatory body layout, and product ending while preserving a coherent design system.

Collages remain bounded in complexity. There is no requirement to build a general-purpose design suite with arbitrary vector tools, nested timelines, and unlimited plugin code. The goal is the slideshow workflow.

### PRD-034 — Autosave, undo, and concurrent edits

Save automatically with visible saving/saved/error status. Preserve editing history sufficiently for meaningful undo/redo and restoring previous revisions. The UI should distinguish transient undo history from durable named or generated revisions.

Two open tabs must not silently overwrite one another. Use revision preconditions and a conflict interface. Browser-local recovery may supplement server persistence, but is not the sole copy of a project and must never store provider secrets.

### PRD-035 — Export is a first-class delivery path

Export an ordered JPEG pack for native photo upload, optionally PNG originals, a caption/title text file, and a compact manifest containing order, dimensions, hashes, and source revision. A ZIP uses deterministic human-readable ordering such as `01-cover.jpg`, not an arbitrary filesystem order.

A portability export includes editable project/recipe data and accepted local assets without credentials. A publishing export should not expose private prompts or license documents by default. An optional montage export must be labeled MP4/video, with separate audio and motion settings.

### PRD-036 — The reviewed render is the delivered render

Final preview displays the exact rendered images and normalized publishing text that will be submitted, not an approximation of a future export. Record the render manifest and artifact hashes. Any change to a material element creates a new revision and requires a new review before posting.

Before rendering, wait for fonts and images, validate all required assets, and fail on overflow or missing content according to the recipe's policy. A placeholder visible in an editor is not acceptable in an approved post.

## G. Connection, review, and delivery

### PRD-037 — Connect the actual TikTok account

The user adds the selected publishing provider's key, connects TikTok through the provider's supported authorization flow, and sees the verified account identity returned by the server. Where an embedded connect flow is unsuitable for a local installation, a documented provider-dashboard connection followed by “Refresh accounts” is an acceptable first implementation.

The app must distinguish the publishing-service API key from the TikTok account authorization. It never asks for a TikTok password or session cookie. An account is selected explicitly; a provider returning multiple accounts is not permission to post to all of them.

### PRD-038 — Account-aware publishing controls

At review, show the target account, media type, title, caption, cover, privacy options, interaction controls relevant to the media type, schedule/mode, and current capability warnings. Privacy has no silently selected public default. Unsupported controls are disabled with a reason, not accepted and silently ignored.

Refresh account capability data at the relevant review/submission points. A setting becoming unavailable blocks the old intent and asks for review; the app does not broaden visibility automatically. Official platform guidance requires an account-aware, consent-based sharing experience. [S18](08_SOURCES.md#s18)

### PRD-039 — Disclosure and approval are explicit

The interface provides appropriate original-content, commercial-content, synthetic-media, and music confirmations for the actual route. The exact required copy and controls must be checked against current platform requirements during publishing qualification. Do not invent a “compliant” badge.

The final action records a real approval event for that rendered revision, target, text, settings, and scheduled instant. Checkboxes are not prefilled simply because an automation recipe exists. Changing the recipient account, privacy, media, caption, mode, or schedule invalidates or supersedes the applicable approval.

### PRD-040 — Honest delivery states

Use distinct user-facing states: local draft, needs review, approved, planned locally, scheduled with provider, submitting, processing, delivered to TikTok inbox, published, failed, outcome uncertain, cancellation requested, and cancellation confirmed. Group them sensibly without collapsing their meanings.

The API adapter must inspect response bodies, media mode, and platform results. “Delivered to inbox” cannot become “Published” merely because a vendor uses a success/published field for a handoff. A missing public URL can be pending even after verified publication; missing a URL is not always failure.

### PRD-041 — Scheduling with visible responsibility

The Planner has list and calendar views, an account filter, the displayed time zone, a clear approval status, and an indicator for local versus provider responsibility. Moving a post to another time requires explicit confirmation and any needed new approval.

A date far in the future may be a local plan rather than a remotely secured publication. The UI must say whether the installation must be running again before delivery. The selected media's expiry, the provider's accepted schedule, and the worker's availability determine what can be promised.

### PRD-042 — Pausing and cancellation are not the same

“Pause series” stops new generation. “Pause local delivery” stops unsubmitted local publications. “Cancel scheduled post” requests cancellation at the responsible provider. “Disconnect account” blocks new submissions and explains existing remote schedules. These actions cannot be represented by one misleading toggle.

Show when cancellation is still pending or too late. Never claim to retract an already-public post unless the exact delete/unpublish action is supported, authorized, executed, and verified. Cancellation requests must be retryable/reconcilable without accidentally submitting a new post.

### PRD-043 — Reconnection and multiple accounts

Support several authorized TikTok accounts without a project-imposed monetization quota. Respect provider/account/platform limits and protect users from selecting the wrong target. Account lists show identity, provider, health, last check, supported operations, and pending publications.

A reconnection may return a new vendor account identifier. Do not remap queued posts by display name alone. Require verification of the underlying identity and re-review where needed. Disconnecting or deleting credentials must not erase publication history or local content.

## H. Recurring production and costs

### PRD-044 — Series generate bounded drafts

A series combines a recipe version, brief version policy, curated assets, hook policy, target project, language, cadence, lookahead, and budget. Its default output is draft content awaiting review. The user sees the next proposed slots and how many paid operations could occur.

Do not generate an unbounded year of content. A series stops for empty pools, budget exhaustion, missing credentials, schema failures, or repeated quality failures. It records why a slot was skipped. It never turns a failed morning slot into an automatic burst of posts that evening.

### PRD-045 — Batch review without blind approval

A batch view shows individual full previews, issues, usage, and intended accounts/times. Users can approve selected reviewed posts, reject or revise individual items, and apply safe metadata changes. Any bulk approval interaction must still satisfy the exact platform/provider review rules; otherwise use per-post approval.

“Approve this recipe forever” is not a substitute for reviewing future content. A faster review workflow is desirable, but neither a hidden checkbox nor a generic initial consent is acceptable evidence for unseen posts.

### PRD-046 — Understandable direct costs

Show requested operation count, estimated cost or credit use, estimate date/source, actual usage when returned, and unresolved usage separately. Let the operator configure limits per operation, series, day, and month. A cost warning should explain whether a provider may still bill after a timeout or cancellation.

Display savings only as a user-configured comparison or clearly hypothetical calculation. Do not present a fabricated “you saved $X” number. The app is free; its external operations are not assumed free.

## I. Results, openness, and polish

### PRD-047 — Metrics with provenance

Results link each published item to its draft/recipe, target account, provider identifiers, available metrics, and last refresh. A missing metric displays “Unavailable” or “Not yet received,” not zero. A TikTok inbox handoff without a confirmed later publication is not given invented engagement.

Refresh frequency respects quotas and user configuration. Source/provider timestamps, collection time, and normalization versions make changing historical values explainable. Manual metric entry/import, if added, is labeled separately from API data.

### PRD-048 — Comparison without fake certainty

Offer simple comparisons by recipe, hook tag, account, and date range, using comparable post ages and available metrics. Show sample sizes and unavailable fields. A high-performing post can be saved as inspiration or duplicated without automatically changing a production recipe.

No automatic optimizer may increase budgets, switch models, alter factual claims, or publish experimental content without approval. Observed association is not proof that a template caused growth. Experiment assistance is a planning tool, not a virality guarantee.

### PRD-049 — A narrow documented automation API

A later core checkpoint exposes stable operations for project/draft creation, accepted-asset listing/import, generation jobs, render/export, and publication intent/status. API tokens have appropriate scopes; default tokens do not grant publish authority. Requests use schema validation, idempotency where appropriate, and the same cost/approval checks as the UI.

External agents may prepare drafts and ask for review. They cannot bypass immutable approvals or mint consent by sending a boolean. An MCP interface is optional after the underlying API is stable, not a separate parallel business-logic layer.

### PRD-050 — Portable projects and a genuine exit path

Users can export their editable project, original recipes, accepted assets, and relevant metadata. Imports run in a paused state, validate versions and paths, omit secrets, and require reconnecting accounts. Imported schedules do not start posting automatically.

A migration between providers preserves local posts and media. Vendor-specific metrics or identifiers can remain as historical metadata without making the project unreadable. Backups and project exports have different security and completeness guarantees and must be labeled accordingly.

### PRD-051 — Community recipes and extensions

The project accepts contributed recipes, layouts, translations, documentation, and provider adapters through review. Each distributed asset declares provenance and redistribution terms. A starter gallery can be bundled locally; a remote gallery, if later added, is optional and does not auto-update executable code.

A new adapter should not require a fork of the editor. A new recipe should not require a redeploy. Plugins that execute server code are a separate security decision, not part of ordinary recipe import.

### PRD-052 — Accessibility and responsive use

The main creation and review journeys support keyboard navigation, visible focus, form labels, non-color status indicators, understandable errors, and zoom. Reordering slides has button/keyboard alternatives. Paid or irreversible actions are not available only through ambiguous icons.

Desktop is the initial full-editing target. Smaller screens should at least support useful review, status, and handoff without inaccessible overflow. Do not advertise a complete mobile editor until tested. Accessibility acceptance includes human inspection, not only an automated score.

### PRD-053 — Empty, loading, error, and recovery states

Each major screen has a useful empty state: upload images, write a first hook, create a recipe, connect a provider, or open an example. Loading states distinguish local work from external processing. Errors retain the user's work and offer a concrete action.

Use messages such as “Your image is still generating; the request is saved,” “This post reached the TikTok inbox and still needs your final action,” or “The result is uncertain; check the provider before retrying.” Avoid “Something went wrong” as the only explanation and avoid presenting secret-bearing raw vendor payloads.

### PRD-054 — Video/UGC extension boundary

**Extension lane, not a stable-slideshow blocker:** support selected fal.ai video/UGC workflows only after the core is reliable. Possible capabilities include user-authorized reference footage, generated motion, narration, avatars, and lip sync where supported and appropriately licensed.

This is not accomplished by adding an “AI video” button that returns an untracked URL. Each extension needs a separate brief, model/licensing review, identity-consent design, output validation, cost controls, durable storage, renderer/timeline decisions, and platform-specific disclosures. Synthetic demonstrations must not impersonate real customer endorsements.

### PRD-055 — Music and audio are capability-specific

Photo carousels may offer an actual provider-supported “let TikTok add music” option. Manual inbox/export handoff can let the user complete sound selection inside TikTok. Neither path is presented as unlimited API access to every trending song.

Video exports may use user-supplied or licensed audio after a separate rights confirmation. Audio inclusion changes the publication/render approval. Muting audio, adding a soundtrack, and switching delivery mode are not harmless background edits.

### PRD-056 — Trusted collaboration is a later explicit mode

**Extension to the single-operator core:** add editor/reviewer/owner roles only with real authorization enforcement. An editor can prepare drafts without reading provider keys; a reviewer can approve within assigned projects; only authorized owners can manage integrations and budgets.

A polished role selector is not sufficient. Tests must cover project/media/job/approval boundaries and avoid leaking data through URLs, thumbnails, exports, or logs. Public sign-up and public multi-tenant hosting remain a separate threat model.

### PRD-057 — Rights revocation and referenced-asset deletion

An operator can mark an asset restricted or no longer authorized. The app identifies drafts, approved revisions, and pending publications that depend on it. New use is blocked; affected approvals are invalidated. Existing remote schedules require a cancellation/replacement workflow with truthful results.

Do not delete the asset's audit history and pretend already published use never happened. Retain only appropriate minimal provenance under the configured retention policy. A user-requested erasure and an operational need for history must be handled transparently rather than hidden in a cascade delete.

### PRD-058 — Deliberate reuse rules

Series and recipes can control how recently used hooks, photos, and layouts are reused. Proposed options are per-series recency windows, manually approved repeats, and pool exhaustion behavior. Rules are creative preferences, not a means to evade moderation.

Selection is deterministic enough to explain: a run records the pool version, eligible items, chosen IDs, seed when applicable, and exclusions. Users can reproduce a draft's choices without depending on whichever images a search engine returns today.

## J. A complete worked journey

The following is an original design example, not a benchmark or a copy of a competitor's campaign.

A creator runs a small stationery business. They install the application locally, create an owner login, and make a project called “Desk habits.” They upload their own notebook and desk photographs. Without connecting any service, they choose an original checklist recipe and write a seven-slide story about preparing a workspace for the next morning.

The brief contains only supplied facts: the notebook has numbered pages; the cover has a particular material; the creator wants a gentle “save this checklist” ending. The system does not invent sales figures or health claims. The creator puts a broad desk image in the hook pool, detail shots in the body pool, and the actual notebook photo in the optional product pool.

Later, the creator adds a ScrapeCreators key to explore visual references. A search returns ideas, but the app does not automatically convert every result into publishable media. The creator saves source links as inspiration and uses their owned images for the actual deck. This demonstrates that discovery and reuse are separate decisions.

They add a fal.ai key and generate two background alternatives using an explicit cost preview. One result succeeds, the other fails. The successful image is imported and retained. The app offers retry of only the failed request and preserves its uncertain billing status when the provider does not supply a definitive charge record.

In Polish, the creator shortens an overflowing text block, adjusts the crop of slide three, and changes only the ending's layout. They inspect the final raster preview and export a ZIP. That entire path is useful even before TikTok publishing is available.

They then connect a qualified publishing provider. The review screen displays their verified TikTok identity, available privacy options, final title/caption, media preview, commercial-content settings, and the relevant AI/music choices. The user chooses a date three days ahead, confirms the final post, and receives “Scheduled with provider” only after a remote schedule ID and media-retention check are recorded.

Next they create a series that drafts three new checklists per week from the same curated pools. Those are future drafts, not preapproved public posts. The Planner shows review work and delivery work separately. If the laptop is off during a generation slot, a missed-slot message appears on restart instead of silently generating and posting a backlog.

A month later, the creator can export the whole project, compare available post metrics, change publishing providers, and keep using the editor. The project itself has not imposed a subscription or held content hostage. That coherent journey—not a screenshot resembling Reel.farm—is the product being built.

## K. Cross-cutting UX acceptance examples

A first-time user reaches a local export without entering a key. Replacing one photo leaves five unrelated slides unchanged. A long translated sentence triggers readable overflow handling. Search-credit exhaustion keeps existing results visible. A temporary provider upload cannot make a thirty-day schedule look secured. An inbox handoff is visibly different from a public post. A user can identify the target account before the final action. A second tab cannot silently overwrite an approved revision. An error screen never includes an API key. A disabled integration leaves the manual workflow intact.

These examples become executable or inspectable acceptance evidence in [checkpoints and tests](05_CHECKPOINTS_AND_ACCEPTANCE.md).
