# Project state — initial planning record

**Last updated:** September 10, 2026  
**State:** `planning_only`  
**Product descriptor:** Open Slideshow Studio (working title)

## Authority

- Specification in this package: [NORTH_STAR.md](../NORTH_STAR.md)
- Specification revision: `NS-0.1-draft`
- Kyle's baseline approval: **not yet recorded**
- Accepted baseline commit/hash: **none**
- Repository URL: **not supplied**
- Repository contents reviewed: **none**
- Current approved implementation chapter: **none**
- Current accepted application version: **none**
- Implementation performed for this deliverable: **none**

## Fixed user decisions

The project is free/open source and original in UI/branding/code. Users bring their own provider keys. ScrapeCreators supplies Pinterest discovery; one fal.ai key supplies qualified copy generation plus image generation/editing through curated model selectors. TikTok's official Content Posting API is out of scope; use qualified publishing bridges or export/handoff. Kyle drives a checkpoint-based architect/Luna loop. The North Star is reviewed before the first implementation chapter is written.

## Proposals awaiting baseline review

Single-operator-first self-hosted web app; TypeScript/Next.js and a durable Node worker with PostgreSQL; shared browser-based rendering; fal.ai as the unified AI key with copy/image model selectors; Zernio as the first TikTok bridge to qualify with Upload-Post as fallback; no official TikTok Content Posting API integration; AGPL-3.0-only license; supervised draft generation and approved-post scheduling; explicit later extension lanes for UGC/video and broader collaboration/platforms.

See [decision register](../docs/07_DECISIONS_RISKS.md) for details and [provider strategy](../docs/03_PROVIDERS_AND_PUBLISHING.md) for evidence and limitations.

## Evidence

- Public primary-source provider/platform/software research: completed for this planning snapshot.
- Prior Reel.farm dossier: read as background from the supplied local file.
- Application code inspected: **none**.
- Application tests executed: **none**.
- Live provider API calls: **none**.
- Paid generations: **none**.
- TikTok accounts authorized or posts published: **none**.
- Provider qualifications passed: **none**.
- Documentation validation: see the generated package validation report; this does not validate an application.

## Known critical unknowns

The selected bridge has not been live-qualified. Photo-specific required AI/commercial disclosures need route verification. Media-retention and limited idempotency windows shape the scheduler. Local callback suitability, native-photo metrics, exact tested models, package versions, and measured deployment requirements remain implementation-stage questions.

## Next authorized activity

Kyle reviews and amends or approves the proposed North Star. No coding, paid call, external account creation, or publication is authorized by this state file. Once the baseline is approved, a separate bounded v0.1.0 chapter can be prepared against the supplied repository or explicitly approved new-repository baseline.

## Maintenance rule

After implementation begins, this file must point to the actual accepted specification location, last accepted commit, active chapter, latest review, requirement status, and evidence index. Mark a chapter accepted only after the architect's review and any required Kyle approval. Do not infer acceptance from Luna's completion claim.
