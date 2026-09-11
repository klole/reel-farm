# Requirement status — initial tracking scaffold

**Generated from the proposed specification; no implementation has been evaluated.**

User-fixed intent is distinguished from proposed requirements. Every implementation status is currently `not_evaluated`, and no acceptance commit or runtime evidence exists. After baseline approval, maintain this file from actual reviews; do not regenerate it over recorded progress.

Implementation statuses to use later: `not_started`, `in_progress`, `partial`, `blocked`, `accepted`, `deferred_by_approved_decision`. Add commit/evidence references when status changes. A test or requirement in an extension lane is not automatically a stable-core release blocker.

| ID | Requirement | Intent authority | Implementation | Evidence |
|---|---|---|---|---|
| ARC-001 | [One product, a few clear processes](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-002 | [Clear module boundaries](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-003 | [Suggested repository shape](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-004 | [Persistent state belongs in PostgreSQL and media storage](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-005 | [Entity model](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-006 | [Immutable documents and optimistic editing](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-007 | [A provider-neutral slide document](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-008 | [Assets are durable objects, not URLs](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-009 | [Provider interfaces describe capabilities, not wishful methods](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-010 | [Durable jobs with atomic intent](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-011 | [The provider-attempt ledger precedes the network call](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-012 | [Separate state machines](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-013 | [Retry policy by error class](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-014 | [Approval fingerprints](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-015 | [Changes and race conditions are explicit](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-016 | [One scheduling authority and two kinds of future date](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-017 | [Time and recurrence](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-018 | [One authoritative rendering implementation](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-019 | [Render pipeline and manifest](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-020 | [Reservations, observed use, and unknown use](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-021 | [Series create deterministic, reviewable work](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-022 | [One command layer for UI and external automation](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-023 | [Observable without leaking content](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| ARC-024 | [Migrations and compatibility](../docs/02_ARCHITECTURE_AND_DATA.md) | proposed | not_evaluated | None |
| INT-001 | [No project-operated credential proxy](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-002 | [Credentials are separate capabilities](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-003 | [The verified wire contract](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-004 | [Discovery, selection, and import are different actions](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-005 | [Key scope, model schemas, and queue use](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-006 | [Durable outputs and explicit privacy](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-007 | [Image quality and cost qualification](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-008 | [First text adapter proposal](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-009 | [Qualify Zernio first, do not couple the product to it](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-010 | [Dashboard-first fallback, integrated connection when verified](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-011 | [Exact account capabilities drive the composer](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-012 | [Local files can be transferred without a public app bucket](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-013 | [Time fields cannot be allowed to trigger accidental immediate posting](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-014 | [Persisted idempotency with known limits](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-015 | [Parse outcomes, not merely HTTP success](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-016 | [Analytics are an optional capability of the connected route](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-017 | [A separate adapter, not copied Zernio semantics](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-018 | [Existing subscribers can benefit from an optional connector](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-019 | [Direct access is an advanced deployment path](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| INT-020 | [Supervised automation is the supported baseline](../docs/03_PROVIDERS_AND_PUBLISHING.md) | proposed | not_evaluated | None |
| NS-F01 | [The project itself is free and open source.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F02 | [Users bring their own provider credentials.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F03 | [Pinterest search uses ScrapeCreators.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F04 | [AI generation uses fal.ai wherever practical.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F05 | [Workflow capability and ease matter; direct copying does not.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F06 | [Development proceeds through checkpoints.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F07 | [Kyle drives the orchestration loop.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F08 | [The North Star precedes the first implementation brief.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-F09 | [Do not build against TikTok's official Content Posting API.](../NORTH_STAR.md) | fixed_by_Kyle | not_evaluated | None |
| NS-I01 | [Content remains editable and portable.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I02 | [Secrets never become browser configuration.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I03 | [A publication points to an immutable approved revision.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I04 | [External uncertainty is represented honestly.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I05 | [One publication has one scheduling authority.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I06 | [Consent is an event, not a hardcoded boolean.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I07 | [Money is a side effect.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I08 | [Asset use preserves provenance.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I09 | [Failure is local whenever possible.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I10 | [Evidence determines progress.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I11 | [Originality is intentional.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| NS-I12 | [Every chapter is bounded.](../NORTH_STAR.md) | proposed | not_evaluated | None |
| OPS-001 | [Two explicit deployment profiles](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| OPS-002 | [Reproducible installation](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| OPS-003 | [Health, maintenance, and user-visible readiness](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| OPS-004 | [Backup is a tested workflow](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| OPS-005 | [Restore and restart cannot replay old side effects](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| OPS-006 | [Upgrades and rollback](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| OPS-007 | [Licensing, provenance, and notices](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| OPS-008 | [Contribution and release hygiene](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| PRD-001 | [First-run installation and owner setup](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-002 | [Useful operation with zero provider keys](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-003 | [Language, time zone, and preference setup](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-004 | [Projects and practical organization](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-005 | [Versioned content brief](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-006 | [Narrative recipes](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-007 | [Hook libraries and variants](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-008 | [CTA and product-slide control](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-009 | [Reversible creative steps](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-010 | [A real local media library](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-011 | [Rights and provenance are visible](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-012 | [ScrapeCreators Pinterest discovery](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-013 | [Predictable pagination and search costs](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-014 | [Collections and role-based visual pools](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-015 | [Safe, observable media import](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-016 | [Exact and near-duplicate awareness](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-017 | [Straightforward upload and import of owned material](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-018 | [Small, tested fal.ai model catalog](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-019 | [Prompts and reference images stay understandable](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-020 | [Selective paid regeneration](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-021 | [Long-running work survives navigation](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-022 | [Generated-media provenance](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-023 | [Optional structured text assistance](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-024 | [Rewriting does not override user locks](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-025 | [Factual review and claim discipline](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-026 | [Language-aware copy and layout](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-027 | [Declarative, portable recipes](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-028 | [Original starter kit](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-029 | [A practical slide editor](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-030 | [Canvas presets and safe composition](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-031 | [Typography that survives export](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-032 | [Crops and focal points are nondestructive](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-033 | [Simple collage and mixed slide treatment](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-034 | [Autosave, undo, and concurrent edits](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-035 | [Export is a first-class delivery path](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-036 | [The reviewed render is the delivered render](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-037 | [Connect the actual TikTok account](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-038 | [Account-aware publishing controls](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-039 | [Disclosure and approval are explicit](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-040 | [Honest delivery states](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-041 | [Scheduling with visible responsibility](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-042 | [Pausing and cancellation are not the same](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-043 | [Reconnection and multiple accounts](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-044 | [Series generate bounded drafts](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-045 | [Batch review without blind approval](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-046 | [Understandable direct costs](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-047 | [Metrics with provenance](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-048 | [Comparison without fake certainty](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-049 | [A narrow documented automation API](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-050 | [Portable projects and a genuine exit path](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-051 | [Community recipes and extensions](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-052 | [Accessibility and responsive use](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-053 | [Empty, loading, error, and recovery states](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-054 | [Video/UGC extension boundary](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-055 | [Music and audio are capability-specific](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-056 | [Trusted collaboration is a later explicit mode](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-057 | [Rights revocation and referenced-asset deletion](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| PRD-058 | [Deliberate reuse rules](../docs/01_PRODUCT_AND_UX.md) | proposed | not_evaluated | None |
| SEC-001 | [Private by default](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-002 | [Bootstrap and session security](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-003 | [Resource authorization is server-enforced](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-004 | [BYOK secret storage](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-005 | [Rotation, removal, and incomplete work](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-006 | [Minimize external disclosure](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-007 | [Controlled outbound URL fetching](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-008 | [Safe file acceptance](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-009 | [Renderer containment](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-010 | [Prompt injection and generated-output limits](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-011 | [Authorized side effects](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-012 | [Spending controls that do not overpromise](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
| SEC-013 | [Webhook and polling safety](../docs/04_SECURITY_PRIVACY_OPERATIONS.md) | proposed | not_evaluated | None |
