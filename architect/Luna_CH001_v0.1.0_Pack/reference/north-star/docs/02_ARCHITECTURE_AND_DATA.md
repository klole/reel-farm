# 02 — Architecture, data, and reliability

**Status:** original proposed design, not recovered competitor internals and not implemented code.  
**Parent:** [North Star](../NORTH_STAR.md)  
**Design objective:** a maintainable private installation that can grow through checkpoints without becoming a distributed SaaS platform.

## 1. Architectural posture

### ARC-001 — One product, a few clear processes

Use a modular application with a web process, a worker process, PostgreSQL, and persistent media storage. Keep modules separate in code but do not turn every module into a network service. The worker handles slow, expensive, retried, or scheduled tasks; the web process handles authenticated interactions and short commands.

Proposed stack: TypeScript, React/Next.js, PostgreSQL, Drizzle for explicit database schema/migrations, pg-boss for PostgreSQL-backed jobs, Playwright/Chromium for deterministic slide rendering, and an optional local FFmpeg module for montage export. Choose and pin actual supported versions in the first approved implementation chapter; this document intentionally does not freeze today's version numbers indefinitely.

Next.js supports self-hosting, including a reverse-proxy deployment. Playwright exposes screenshot capture, and pg-boss provides a PostgreSQL-based job framework. Those capabilities support the proposal; they do not establish that this application's integration is already reliable. [S22](08_SOURCES.md#s22) [S23](08_SOURCES.md#s23) [S24](08_SOURCES.md#s24)

Why this design: it reduces language-switching for contributors, shares validation and render code, avoids a required separate queue server, and makes the common deployment understandable. Tradeoffs: a browser renderer consumes memory; PostgreSQL is heavier than a single SQLite file; container installation is not the same as a native desktop installer. These are acceptable proposed tradeoffs for durable publishing and future concurrency, subject to early measurement.

### ARC-002 — Clear module boundaries

| Module | Owns | Must not own |
|---|---|---|
| Identity and workspace | Sessions, owner setup, authorization, scoped tokens. | Provider-specific publication semantics. |
| Projects and briefs | Content context, versions, source facts, grouping. | Secret storage or model-specific JSON. |
| Library | Accepted assets, provenance, rights, collections, derivations. | Arbitrary URL fetching without the importer. |
| Recipes and drafts | Declarative structures, editable documents, revisions, locks. | External publication side effects. |
| Generation | Prompt assembly, schema validation, provider attempts, selected-scope regeneration. | Unreviewed automatic publishing. |
| Rendering | Trusted slide document to validated images/manifest. | Remote scraping, secret-bearing provider calls, arbitrary template code. |
| Delivery | Accounts, capabilities, approval, scheduling, status and reconciliation. | Mutating the content that was approved. |
| Usage and limits | Reservations, observed usage, budgets, unresolved costs. | Selling credits or acting as provider billing authority. |
| Operations | Jobs, event history, health, backup, cleanup. | Hiding failures behind a successful UI response. |

Domain modules call narrow interfaces. Adapters translate vendor data at the boundary. Provider SDKs do not leak into slide components, and React components do not construct TikTok request bodies.

### ARC-003 — Suggested repository shape

This is a target organization, not a mandate to create empty packages on day one:

```text
apps/
  web/                 # UI, authenticated HTTP endpoints, thin command handlers
  worker/              # durable task handlers and scheduler/reconciler loops
packages/
  domain/              # use cases, invariants, state transitions
  contracts/           # validated schemas and provider-neutral types
  db/                  # SQL schema, migrations, repositories, transactions
  providers/           # ScrapeCreators, fal.ai, text, and publishing adapters
  renderer/            # shared slide components, layout measurement, export
  storage/             # local and later S3-compatible implementations
  observability/       # redaction, structured events, support bundles
infra/                  # Compose, image build, deployment examples
scripts/                # setup, backup/restore, verification
spec/                   # accepted copy of this North Star and decisions
state/                  # actual project status and evidence index
```

Prefer a small number of packages with real boundaries over dozens of placeholder abstractions. A chapter can initially keep related modules in one package if their dependencies remain clear and the decision is recorded.

## 2. Storage, identity, and data ownership

### ARC-004 — Persistent state belongs in PostgreSQL and media storage

PostgreSQL stores domain records, job state, usage reservations, approvals, provider attempts, and event metadata. Media bytes live in a persistent filesystem volume initially. A storage abstraction later allows S3-compatible objects without changing draft schemas.

The browser is not the database. Local recovery caches may hold nonsecret unsaved editing data, but refresh, tab closure, or a different browser must not destroy saved projects. Worker restarts must not erase in-flight provider identifiers.

The initial single-workspace product still includes explicit workspace ownership on domain records. All application reads/writes enforce ownership. UUIDs are identifiers, not authorization. Do not claim production multi-tenant isolation merely because a `workspace_id` column exists.

### ARC-005 — Entity model

| Entity | Essential fields and responsibilities |
|---|---|
| `Workspace` | Owner, display name, locale/time-zone defaults, retention and budget settings. |
| `User`, `Session` | Owner login and session lifecycle; later scoped membership roles. |
| `Project` | Workspace, name, status, brief head, project-level preferences. |
| `BriefVersion` | Immutable facts, audience, tone, goals, restrictions, source notes. |
| `Recipe`, `RecipeVersion` | Identity, license/origin, versioned declarative narrative/layout schema. |
| `Hook`, `HookUsage` | Approved wording/pattern, tags, status, usage references. |
| `Asset` | Kind, storage key, content hash, dimensions, MIME, acceptance state, deletion state. |
| `AssetProvenance` | Source kind/URL, provider/model, parent assets, timestamps, retained prompt metadata. |
| `RightsAssertion` | Assertion category, actor, evidence reference, restrictions, review/revocation times. |
| `Collection`, `CollectionItem` | Membership, role tags, ordering, project references. |
| `Draft` | Mutable head pointer, title, project, lifecycle, last editor. |
| `DraftRevision` | Immutable validated slide document and narrative metadata. |
| `GenerationRun` | Scope, input versions, chosen providers, budget, progress, accepted outputs. |
| `ProviderAttempt` | Operation identity, sanitized request hash, status, external ID, retries, ambiguity. |
| `RenderArtifact` | Revision, renderer version, manifest, image storage keys, checks, output hashes. |
| `ProviderCredential` | Provider/type, ciphertext or secret reference, key version, last validation; never plaintext API responses. |
| `ConnectedAccount` | Provider account ID, verified platform identity, scopes/capabilities, health, connection generation. |
| `Approval` | Actor, exact artifact/content/settings fingerprint, target, time, mode, consent record, revocation. |
| `Publication` | Immutable intent, approval reference, schedule authority, external IDs, state, outcome source. |
| `Series`, `SeriesSlot` | Recurrence, versions/pools, budgets, next slots, generation and delivery linkage. |
| `UsageReservation`, `UsageEvent` | Estimated/observed/unknown use, units/currency, source, reconciliation. |
| `MetricSnapshot` | Platform/provider post identity, metric values or unavailable reasons, measured/collected times. |
| `AuditEvent`, `OutboxEvent` | Minimal actor/action history and committed work pending dispatch. |

Not every entity requires a separate table in the first chapter. For example, an immutable revision can be validated JSON with indexed ownership and version columns. Normalize fields that require constraints and independent lifecycle; avoid both a single unqueryable JSON blob and premature table proliferation.

### ARC-006 — Immutable documents and optimistic editing

A saved draft head points to a revision. Each meaningful committed change produces a new immutable revision or a clearly defined autosave snapshot; compaction cannot delete revisions referenced by render artifacts or approvals. Updates include the expected head revision. A stale client receives a conflict rather than overwriting newer work.

A scheduled or published artifact never changes in place. Editing the current draft creates a new revision. Replacing an already remotely scheduled publication requires an explicit cancellation/update workflow and fresh approval. The existence of a new draft revision does not prove the remote provider has stopped the old post.

Store hashes of canonicalized documents using a defined serialization. Never rely on arbitrary JSON key order or a browser's transient state for an approval fingerprint. Include the version of the canonicalization method so future migrations are explainable.

## 3. Data contracts

### ARC-007 — A provider-neutral slide document

Illustrative contract, to be refined and validated during implementation:

```ts
type SlideRole = "hook" | "body" | "product" | "cta";
type AssetRef = { assetId: string; contentHash: string };

type TextBlock = {
  id: string;
  kind: "text";
  text: string;
  styleToken: string;
  box: { x: number; y: number; width: number; height: number };
  alignment: "start" | "center" | "end";
  locked: boolean;
};

type ImageBlock = {
  id: string;
  kind: "image";
  asset: AssetRef;
  box: { x: number; y: number; width: number; height: number };
  fit: "cover" | "contain";
  focalPoint: { x: number; y: number }; // normalized 0..1
  locked: boolean;
};

type SlideDocument = {
  schemaVersion: string;
  canvas: { width: number; height: number; colorSpace: "srgb" };
  recipeVersionId?: string;
  language: string;
  slides: Array<{
    id: string;
    role: SlideRole;
    layoutId: string;
    blocks: Array<TextBlock | ImageBlock>;
    backgroundToken: string;
  }>;
};
```

Validate every coordinate, number, ID, enum, text length, supported font token, asset reference, and block count. Reject nonfinite numbers and unsupported schema versions. A layout reference points to trusted code/data in the installation, not a remote script. Text is plain text or a small validated rich-text structure, never raw HTML.

Slide count is constrained by the recipe, technical safeguards, and current target capability. Do not copy a competitor's API limit as a permanent product limitation. The local editor and exporter may support a different bound from one publishing destination, which is shown at preflight.

### ARC-008 — Assets are durable objects, not URLs

An asset record contains a storage key and verified metadata. Source URLs, provider URLs, and publication-upload URLs are separate provenance/transfer records with expiry and trust classification. They are not interchangeable.

An accepted asset has completed import, validation, checksum, and storage commit. Download into a staging file, enforce size limits while streaming, decode safely, then atomically promote to a content-addressed or generated storage key. Commit the database reference only when the blob is available, with compensating cleanup for orphaned files.

The same original can have thumbnail, normalized render derivative, and alternate crops. Derivatives retain parent references and rights restrictions. Never deduplicate across unrelated workspaces in a way that reveals another user's private media.

### ARC-009 — Provider interfaces describe capabilities, not wishful methods

Use narrow asynchronous contracts for `ImageDiscoveryProvider`, `ImageGenerationProvider`, `TextGenerationProvider`, `PublishingProvider`, and `StorageProvider`. Each reports a versioned capability document and typed error categories. Optional operations are explicitly supported, unsupported, or unverified.

A proposed publishing boundary:

```ts
type CapabilityStatus = "verified" | "documented_only" | "unsupported";
type DeliveryMode = "direct" | "inbox";
type ScheduleAuthority = "local" | "provider";

type PublishOutcome =
  | { kind: "accepted"; providerPostId: string }
  | { kind: "scheduled"; providerPostId: string; scheduledAt: string }
  | { kind: "inbox_delivered"; providerPostId: string }
  | { kind: "published"; providerPostId: string; platformPostId?: string; url?: string }
  | { kind: "rejected"; category: string; retryPolicy: string }
  | { kind: "unknown"; operationId: string; reconcileAfter: string };

interface PublishingProvider {
  listAccounts(credentialRef: string): Promise<unknown>; // replace with validated types
  getCapabilities(accountRef: string, mediaKind: "photo" | "video"): Promise<unknown>;
  uploadMedia(input: unknown): Promise<unknown>;
  submit(approvedIntent: unknown, operationId: string): Promise<PublishOutcome>;
  reconcile(operationId: string): Promise<PublishOutcome>;
  cancel(providerPostId: string): Promise<unknown>;
}
```

This is conceptual pseudocode, not production-ready TypeScript. `unknown` marks contracts the chapter must specify and validate; it is not permission to pass unchecked vendor JSON throughout the application. A supported method still checks current account eligibility and operation-specific limits.

## 4. Jobs and side effects

### ARC-010 — Durable jobs with atomic intent

Create a domain intent and an outbox record in the same database transaction. A dispatcher converts committed outbox records into durable jobs with a unique logical operation ID. If the chosen job library can participate in the same transaction through a supported API, that may simplify the implementation, but this must be verified rather than assumed.

Handlers claim work with leases, heartbeat long operations, and persist useful progress between external steps. A worker that dies loses its lease, not its history. Lease duration, cancellation checks, and retry windows are explicit configuration with tests.

A queue's delivery guarantee does not make an external charge or post exactly once. A worker can crash after a vendor accepted a request but before our database recorded the response. The application must handle that ambiguity independently of the queue library.

### ARC-011 — The provider-attempt ledger precedes the network call

Before a billable or publishing call, persist an attempt with logical operation ID, provider, credential reference, account reference where applicable, sanitized payload hash, input revision references, attempt count, and intended side effect. Store actual secret-bearing payloads only if a clearly justified encrypted retention policy requires them; normally store normalized parameters and redacted context.

Then call the provider with the endpoint's documented idempotency mechanism when available. Persist the external request ID immediately after receiving it. A timeout or process death does not automatically become a retryable failure. Use `outcome_unknown` until reconciliation or a documented safe replay resolves it.

Logical retry and user-requested new generation are different operations. Clicking “Try another image” creates a new billable request; resuming the status of an accepted image does not. A paid model request with unknown acceptance must not be blindly duplicated because the UI needs something to show.

### ARC-012 — Separate state machines

Do not use one `status` enum for everything.

```text
GenerationRun:
  prepared -> reserved -> submitted -> provider_pending -> importing -> ready
  branches: partial_success | failed | cancel_requested | cancelled | outcome_unknown

RenderArtifact:
  requested -> validating -> rendering -> checking -> ready
  branches: failed | superseded

Approval:
  pending -> granted -> superseded | revoked | expired

Publication:
  needs_review -> approved -> planned_local -> submitting -> accepted
  accepted -> scheduled_remote | processing | inbox_delivered | published
  branches: blocked | failed | outcome_unknown | cancel_requested | cancelled
```

Transitions require preconditions. A generation run can be ready without publication approval. A render can be ready while an asset's rights status blocks publishing. A remote “published” event with an inbox marker maps to inbox delivery. A cancel request received after actual publication may leave publication as published with a failed cancellation record.

Terminal states for one phase need not be terminal for the whole user journey. Inbox delivery is terminal for our supported handoff unless a verified later source can establish publication. Do not create an infinite “waiting for public link” job for a route that never supplies that link.

### ARC-013 — Retry policy by error class

| Class | Default behavior |
|---|---|
| Invalid credentials | Stop related external work, show reconnect/update-key action. |
| Insufficient credits/billing gate | Stop paid submissions, preserve work, show provider action. |
| Invalid input or unsupported capability | Do not retry unchanged; surface specific correction. |
| Rate limit with safe-to-retry semantics | Backoff with jitter and respect `Retry-After`, bounded by policy and schedule validity. |
| Provider processing still running | Poll existing request, not resubmit. |
| Network timeout after possible acceptance | Mark uncertain; reconcile before any new side effect. |
| Platform rejection or moderation | Hold for review; never mutate content to evade the rejection. |
| Missing or expired media | Reconstruct transfer only when safe and preserve submission identity. |
| Internal deterministic render error | Fix input/code; repeated identical paid regeneration is not a remedy. |

Use bounded attempts, not an unbounded retry loop. A circuit breaker can pause a failing provider without taking down the editor. Record the eventual user action: resumed, replaced, abandoned, manually resolved, or confirmed duplicate.

## 5. Approval and publication transactions

### ARC-014 — Approval fingerprints

An approval fingerprint includes draft revision, ordered render hashes, normalized title/caption/hashtags, cover selection, target platform identity and connection generation, delivery mode, privacy/interaction/disclosure/music settings, scheduled instant/time zone, and the relevant policy/capability version.

The server constructs this fingerprint from validated records; the browser does not submit an authoritative `approved=true`. Store approver, approval time, reviewed artifact identifier, consent wording/version where needed, and later revocation. An API token without approval authority cannot mint one.

Immediately before local submission, the worker revalidates the fingerprint, account identity, asset availability/rights, budget where applicable, and current required capabilities. Use a database transaction and row lock or compare-and-set to claim the intent. This prevents two workers from submitting the same logical publication concurrently but still does not eliminate the remote-response-loss window.

### ARC-015 — Changes and race conditions are explicit

Editing an approved draft creates a new unapproved revision. Replacing a local planned publication cancels the old local intent before creating the new one. Replacing a remotely scheduled publication requires cancelling or updating the remote object through supported semantics, then confirming the new approved payload.

There is no atomic transaction spanning our database and TikTok. If a user revokes consent while a submission is already in flight, block further local work, request cancellation if possible, and show uncertainty until the external outcome is known. Do not claim that flipping a database flag guarantees a remote post will not appear.

For the initial implementation, prefer immutable remote submissions and explicit cancel-and-replace rather than complex in-place remote editing. If cancellation cannot be confirmed, do not create a replacement that risks double posting without a clear user decision and documented reconciliation.

### ARC-016 — One scheduling authority and two kinds of future date

`local` means our worker is responsible for submitting at or before a planned time. `provider` means a verified remote schedule has been accepted. They are different states and responsibilities, not simply two booleans on the same job.

Store `planned_at`, `remote_scheduled_at`, `schedule_authority`, `handoff_required_at`, media expiry, retention buffer, and the remote schedule ID where applicable. Do not mark `provider` until the remote readback confirms the intended instant and content reference.

A local publication can be handed to the provider ahead of time, then atomically transition responsibility after confirmation. A worker crash during handoff is reconciled using the recorded attempt; it must not cause both an immediate local post and a remote scheduled post.

A provider media-retention limit constrains how far ahead a local file can safely be uploaded. For the proposed first bridge, keep long-range items as local plans until inside the verified upload window, or require appropriately durable external storage. The UI states the resulting uptime requirement. See [publishing](03_PROVIDERS_AND_PUBLISHING.md).

### ARC-017 — Time and recurrence

Represent scheduled delivery as a UTC instant plus the chosen IANA time zone and original wall-clock request. Recurrences preserve their wall-clock intent. Define policy for nonexistent and repeated daylight-saving times; proposed defaults are “skip and flag” for nonexistent times and the earlier occurrence for repeated times, with a visible preview before approval.

A series slot has a unique key such as `(series_id, recurrence_revision, intended_instant, target_account)`. This prevents duplicate slot creation after scheduler restarts. A recipe change does not retroactively mutate already reviewed slots.

Missed slots are governed by a grace policy. Default to skip/needs-review rather than catch-up publishing. Never let a past timestamp reach a provider that interprets it as “publish immediately” without an intentional immediate-post approval. Store clock observations and alert on significant clock drift in a server deployment.

## 6. Rendering and export

### ARC-018 — One authoritative rendering implementation

The editor and worker share a trusted slide component library and layout schema. For authoritative preview/export, use a pinned Chromium build with fixed canvas size, device scale, font files obtained through the project's legitimate distribution process, locale, and rendering settings. Wait for font readiness and decoded image completion.

The rendering process receives only the asset bytes and nonsecret data required for that job. Prefer preloaded local/data assets and deny arbitrary outbound network access. No user-provided HTML, script, remote font stylesheet, or CSS URL can execute inside the renderer. The worker's browser subprocess should not inherit provider secrets unnecessarily.

Browser UI preview can be fast and approximate during editing, but final approval must use actual worker-rendered files. Pixel-identical output across arbitrary browser versions, operating systems, and GPU stacks is not promised; reproducibility is defined within a pinned tested render environment, with controlled visual tolerances where appropriate.

### ARC-019 — Render pipeline and manifest

1. Resolve the immutable draft revision and all referenced accepted assets.
2. Validate schema, supported layouts/fonts, rights blocks relevant to export/publication, dimensions, and text constraints.
3. Normalize asset orientation/color where required without destroying source provenance.
4. Assemble each trusted slide component using local media and escaped text.
5. Measure text and object bounds; reject or visibly flag overflow according to the explicit policy.
6. Capture the slide, encode to the configured raster format, and verify dimensions/size/readability fixtures.
7. Store artifact hashes and manifest; only then mark the render ready.
8. Produce ordered export packages from the manifest, not by guessing directory order.

The manifest contains schema version, draft revision, recipe/renderer/font-set versions, canvas, ordered slide IDs and hashes, source asset hashes, validation results, and creation time. Hashes identify bytes; render reproducibility tests should account for intentionally variable metadata such as timestamps by keeping them outside image content where possible.

A montage renderer consumes the accepted raster sequence and separately approved timing/audio settings. It produces a video artifact with a different media kind and approval fingerprint. It cannot silently replace a native photo artifact in a publication intent.

## 7. Cost accounting and series orchestration

### ARC-020 — Reservations, observed use, and unknown use

Before launching a bounded generation run, calculate an estimate from a dated model/pricing configuration and reserve the relevant amount or call units in a transaction. Concurrent jobs must not each read the same remaining budget and overspend it independently.

Represent currency amounts using integer minor units where practical or exact decimal representations; model prices may require finer-than-cent precision. Store currency and billing unit, not a floating-point number with an implied dollar symbol. Scrape credits, image counts, tokens, and dollar estimates are different units.

When actual provider usage is available, reconcile the reservation. If the provider does not return cost, label it estimated or unknown and retain a conservative unresolved reservation until an explicit policy resolves it. Never release all reserved cost merely because our HTTP request timed out.

An application-side budget is not a guaranteed provider billing ceiling if prices are unknown or the provider charges outside visible requests. Enforce hard operation-count/model-parameter limits alongside estimated budgets and recommend provider-side limits where available. A live-test chapter must specify its own authorized spend ceiling.

### ARC-021 — Series create deterministic, reviewable work

A series scheduler materializes a limited lookahead of unique slots. Each slot resolves a brief/recipe version, curated pool snapshot, selected hooks/assets, and budget policy. A generation run records those resolved inputs, so future edits to a pool do not make history unexplainable.

Run content generation, validation, image requests, and rendering as separately resumable steps. Generate drafts first. A review event, not the recurrence timer, authorizes publishing. Series pause halts new slots; stopping already scheduled delivery is a different command with separate status.

If automation later learns from metrics, it may propose recipe changes. It does not silently change approved claims, expand spending, or generate public content under a new model without an accepted policy. Deterministic selection and provenance are more important than a mysterious “viral optimizer.”

## 8. API, observability, and evolution

### ARC-022 — One command layer for UI and external automation

UI endpoints and later external APIs invoke the same domain commands. Proposed app endpoints may include project/draft CRUD, asset import jobs, generation runs, render requests, account discovery, review/approval actions, and publication status. These are original route proposals, not vendor endpoints.

Use validated request/response contracts, explicit scopes, resource ownership checks, revision preconditions, pagination, and stable error categories. Read-only integrations cannot trigger charges. Draft-creation integrations cannot publish. Approval authority is separately permissioned and cannot be simulated by filling provider consent flags.

A public API's initial scope can be intentionally narrow. Do not promise compatibility with Reel.farm's private or public API, nor create a second undocumented internal API that bypasses the normal invariants.

### ARC-023 — Observable without leaking content

Structured logs include correlation IDs, operation category, state transition, duration, sanitized error category, and relevant nonsecret resource IDs. They do not include raw keys, OAuth tokens, signed upload URLs, full prompt histories, or private images by default.

A support bundle is an explicit export that redacts secrets and gives the operator a preview. Health endpoints distinguish database availability, worker heartbeat, storage readiness, provider credential validity, and provider quota/capability issues. “Web server is up” is not equivalent to “scheduled jobs will run.”

### ARC-024 — Migrations and compatibility

Every persisted schema and portable format has a version. Migrations are reviewed, tested on representative fixtures, and accompanied by backup/rollback or forward-repair instructions. A data-destructive migration is never hidden inside a routine agent refactor.

Separate provider capability versions from app schema versions. A provider can change without requiring a database redesign. Keep adapters conservative with unknown fields/statuses; unsupported new values should produce a safe hold, not an incorrectly successful outcome.

Avoid automatic dependency upgrades across the entire stack during unrelated chapters. Pin a supported baseline, track security updates, and change consequential dependencies through a bounded maintenance chapter with regression evidence.

## 9. Architecture review questions

Can the manual workflow operate without every provider? Can the worker restart after accepting an external request? Can one publication be traced from draft to approval to the actual external result? Can a user revoke or replace a schedule without the UI lying? Are upload expiry and idempotency windows represented as data? Can the render run without access to a provider key? Can an exported project be imported safely without posting? Can a new contributor find the one place where vendor JSON becomes domain state?

A design that cannot answer these questions should not be accepted merely because its happy-path demo looks polished.
