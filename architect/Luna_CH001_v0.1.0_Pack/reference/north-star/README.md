# Open Slideshow Studio — North Star package

**Prepared for Kyle · September 10, 2026 · Specification revision NS-0.1-draft**

**Status: proposed project baseline for Kyle's review. This is not an instruction to start implementation.**

“Open Slideshow Studio” is a descriptive working title, not a cleared product name. No repository was supplied or reviewed for this deliverable. No application code, live integration, paid generation, OAuth authorization, or social post was executed. The included implementation stages describe future acceptance outcomes, not completed functionality.

## What this package is

This is the long-lived reference for an original, free, self-hostable, bring-your-own-key slideshow creation and publishing application. It preserves the useful end-to-end job of a service such as Reel.farm while deliberately avoiding its visual identity, proprietary implementation, private prompts, paid assets, and distinctive template wording.

The central promise is simple: **a creator can turn a brief into an editable, well-designed TikTok photo carousel, build a repeatable production workflow, and deliver it using their own provider accounts—without paying a license subscription to this project.**

The project is not a free hosted rendering business. External providers may charge, and self-hosting has operating costs. There is no promise that third-party free tiers remain free, that every account can publish through every route, or that a specific percentage of money will be saved.

## Read order

Start with [NORTH_STAR.md](NORTH_STAR.md). It states the mission, fixed decisions, scope boundary, proposed stack, and approval model. Then read [provider and publishing decisions](docs/03_PROVIDERS_AND_PUBLISHING.md), because TikTok constraints materially shape the product. The other chapters turn that mission into testable product and engineering requirements.

| File | Purpose |
|---|---|
| [NORTH_STAR.md](NORTH_STAR.md) | Canonical product constitution and end-state definition. |
| [Product and UX](docs/01_PRODUCT_AND_UX.md) | Detailed workflows, screen behavior, feature requirements, and worked user journey. |
| [Architecture and data](docs/02_ARCHITECTURE_AND_DATA.md) | Components, data ownership, schemas, state transitions, jobs, rendering, and API boundaries. |
| [Providers and publishing](docs/03_PROVIDERS_AND_PUBLISHING.md) | ScrapeCreators, fal.ai, text generation, TikTok provider recommendation, constraints, and live qualification gates. |
| [Security, privacy, operations](docs/04_SECURITY_PRIVACY_OPERATIONS.md) | Keys, authorization, asset safety, cost controls, installation, backup, recovery, and community distribution. |
| [Checkpoints and acceptance](docs/05_CHECKPOINTS_AND_ACCEPTANCE.md) | Outcome-based milestones and evidence-driven release gates. Not a coding assignment. |
| [Orchestrator–Luna protocol](docs/06_ORCHESTRATOR_LUNA_PROTOCOL.md) | How Kyle, the architect, GitHub, and Luna work together without drift. |
| [Decisions and risks](docs/07_DECISIONS_RISKS.md) | Fixed decisions, proposals, external blockers, tradeoffs, and decisions requiring approval. |
| [Source register](docs/08_SOURCES.md) | Dated primary-source evidence and limits of the research. |
| [AGENTS.md](AGENTS.md) | Proposed standing agent instructions; requires a separately approved chapter before coding. |
| [Project state](state/PROJECT_STATE.md) | Honest initial state: planning only, no approved implementation baseline. |
| [Requirement status](state/REQUIREMENT_STATUS.md) | Requirement-by-requirement tracking; initially unimplemented and unverified. |
| [Evidence index](state/EVIDENCE_INDEX.md) | Where future commit-linked tests, artifacts, qualifications, and review decisions are recorded. |
| [Chapter template](templates/CHAPTER_BRIEF_TEMPLATE.md) | Blank structure for a future bounded Luna assignment. |
| [Luna handoff template](templates/LUNA_HANDOFF_TEMPLATE.md) | Exact implementation evidence Luna must return. |
| [Review verdict template](templates/REVIEW_VERDICT_TEMPLATE.md) | How the architect accepts, rejects, or blocks a checkpoint. |
| [ADR template](templates/ADR_TEMPLATE.md) | How consequential decisions are proposed and approved. |
| [Provider qualification template](templates/PROVIDER_QUALIFICATION_TEMPLATE.md) | Record of actual provider/account/route test results, including failures. |

A separate `Open_Slideshow_Studio_North_Star_Complete.md` is a generated reading copy of these files. The individual source files remain authoritative. Do not edit both versions independently. The ZIP contains the same canonical package plus the combined reading copy and document-validation results.

## How future agents should use this

Read the North Star, the actual project state, accepted architecture decisions, and the current approved chapter. Read the relevant specialist chapters for that task. Inspect the repository and base commit. Work only on that chapter's accepted outcomes. Update evidence and stop at the checkpoint. A long roadmap is not permission to implement everything in it.

A missing, contradictory, or stale state file is a reason to reconcile with repository evidence, not to invent progress. A checkbox in a handoff is not proof that a test ran. A passing mock is not a successful TikTok integration. A documentation statement is not a live account capability.

## Authority and change control

Kyle's explicit project decisions and approved North Star amendments govern product intent. Applicable platform requirements and the project's safety boundaries constrain the implementation. Accepted architecture decisions refine the specification. An approved chapter scopes the current work; it cannot silently overrule the constitution. Implementation convenience, generated summaries, and an agent's memory are lower-authority inputs.

All recommendations in this first package are **proposed**, unless labeled **fixed by Kyle**. Approval of this baseline should record a Git commit, specification revision, date, and any exceptions. That approval does not automatically authorize paid API calls, public publishing, external account creation, or the first coding chapter.

## Relationship to the earlier research

The earlier `ReelFarm_Deep_Dive.md` is background investigation, not the product specification or a statement that every advertised competitor behavior must be copied. This package supersedes its reconstruction suggestions for this new project. In particular, a provider's photo AI-disclosure field must not be assumed to exist identically in TikTok's direct photo API; local queue persistence must not be confused with external exactly-once publishing; and third-party upload retention must be accounted for before promising long-range remote scheduling.

## Initial approval topics

The provider choices fixed by Kyle are ScrapeCreators for Pinterest discovery and fal.ai as the unified AI provider for both copy and imagery, using curated model selectors. TikTok's official Content Posting API is explicitly out of scope; publishing is through qualified bridge adapters or export/handoff. The recommendations awaiting baseline approval are: a single-operator-first self-hosted architecture; AGPL-3.0-only as the source-code license; Zernio as the first publishing provider to qualify; and supervised automation that schedules reviewed content rather than silently approving future unseen content.

The first v0.1.0 Luna assignment will be a separate deliverable after this baseline is reviewed. This package intentionally does not contain that assignment.
