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

This is a design recommendation, not a claim that the selected tools have been installed or benchmarked. The detailed rationale and tradeoffs are in [architecture](docs/02_ARCHITECTURE_AND_DATA.md). Primary technical references are recorded in the [source register](docs/08_SOURCES.md).

## 10. Provider direction

ScrapeCreators and fal.ai are fixed. The fal.ai credential is the normal AI credential for both copy and imagery: text generation routes through a qualified fal.ai LLM endpoint/model selector, while image generation routes through a qualified fal.ai image-model selector. Manual text and user-owned images remain first-class and require no AI key.

For TikTok, qualify **Zernio first**, retain **Upload-Post as the researched fallback**, and consider **Post Bridge as an optional integration for existing subscribers**. This is a documented-fit recommendation, not a hands-on reliability ranking. The official TikTok Content Posting API is intentionally outside project scope because its developer-app approval path conflicts with the low-friction local/self-hosted goal. The recommendation, pricing caveats, retention limits, and live tests are specified in [providers and publishing](docs/03_PROVIDERS_AND_PUBLISHING.md).

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

Recommend **AGPL-3.0-only** for the project's source code, pending Kyle's approval. The rationale is reciprocity for modified network-served versions, while keeping the software genuinely open source. It does not mean “non-commercial only”; commercial use is allowed under the license's conditions. It does not automatically make users' ordinary content or API keys open source. The precise license text governs, and third-party license compatibility must be checked. [S27](docs/08_SOURCES.md#s27)

No license is being applied to a code repository by this planning document. Before public release, record the selected SPDX identifier, copyright holders, notices, dependency licenses, contributor terms, and licenses of bundled original recipes/assets. Do not ship font files from this research environment. The implementation may obtain appropriately licensed fonts separately and preserve their notices.

Community contributions should be small, reviewable, documented, and tested. New providers must implement the common contract and pass conformance tests. New templates must be declarative and come with permission to redistribute them. A community recipe gallery is not an unreviewed remote-code execution mechanism.

## 14. How the project moves forward

Kyle reviews and approves or amends this baseline. The architect then creates a separate, bounded v0.1.0 chapter. Luna implements only that chapter against an identified Git commit and produces a structured handoff. Kyle returns with the repository/commit. The architect inspects actual changes and evidence, records a verdict, and only then proposes the next chapter.

Use conventional milestone identifiers such as `0.1.0`, `0.2.0`, and `0.3.0`; use patch releases for corrections. A chapter may be smaller than a release, and a failed checkpoint may require a repair chapter. Numbers are coordination labels, not promised dates or automatic authorization.

The durable context is the approved North Star, accepted decisions, actual repository, current project state, and checkpoint evidence—not the memories of either assistant. The detailed protocol is in [orchestration](docs/06_ORCHESTRATOR_LUNA_PROTOCOL.md).

## 15. Final decision test

Before accepting a feature or architectural change, ask:

1. Does this make the creator's real brief-to-post workflow easier or more reliable?
2. Can the user still control their keys, content, provider choice, and spending?
3. Is the capability original, appropriately licensed, and supported by the relevant route?
4. Is the external side effect authorized, observable, and recoverable without hiding uncertainty?
5. Is this the smallest sound implementation for the current approved chapter?
6. Can another contributor understand and verify it from the repository alone?

A proposal that fails one of these tests needs revision or an explicit approved exception. Feature similarity to a competitor is not, by itself, enough reason to ship it.
