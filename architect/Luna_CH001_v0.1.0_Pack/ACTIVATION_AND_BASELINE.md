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
- Frozen source: [reference/north-star/NORTH_STAR.md](reference/north-star/NORTH_STAR.md).
- SHA-256 of that file: `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d`.
- Full source-file hashes: [BASELINE_HASHES.json](BASELINE_HASHES.json).
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
