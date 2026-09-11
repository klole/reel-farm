# 03 — Providers, TikTok connection, and publishing strategy

**Research date:** September 10, 2026.  
**Evidence level:** primary documentation and first-party pricing reviewed; no authenticated integration, purchase, account connection, or live post tested.  
**Decision status:** ScrapeCreators, fal.ai as the unified AI credential, and exclusion of TikTok's official Content Posting API are fixed by Kyle. Publishing-bridge selections below remain recommendations pending qualification.

## 1. Recommended provider arrangement

| Capability | Direction | Why it fits this project |
|---|---|---|
| Own images, manual text, editing, rendering, export | Local application; no external key required. | Makes the software useful independently of paid integrations. |
| Pinterest discovery | ScrapeCreators BYOK, fixed. | Implements Kyle's selected discovery service through one narrow adapter. |
| Image generation/editing | fal.ai BYOK, fixed. | Keeps model inference on the user's provider account and supports a curated image-model selector. |
| Automated writing | fal.ai BYOK through its LLM/OpenRouter route, fixed. | Reuses the same fal.ai key, minimizes setup, and supports a curated text-model selector with a cheap qualified default; manual writing remains available. |
| First TikTok bridge to qualify | Zernio, proposed. | Strong documented fit for a solo creator with one or two accounts, native photos, and account-aware publishing. |
| Researched bridge fallback | Upload-Post. | An API-focused alternative with direct file uploads and scheduling. |
| Existing-subscriber option | Post Bridge, later adapter. | Useful for users already paying for it; not the economical default on the evidence reviewed. |
| Official TikTok Content Posting API | Explicitly excluded. | Do not build developer-app approval, direct OAuth, or official posting-API support unless Kyle later reverses this decision. |

“First to qualify” is deliberate. We have enough evidence to pick the first integration experiment, not enough to promise a provider's uptime, approval status for every customer, long-term price, or successful photo AI labeling on every account route. The publishing conformance gate must run before the application advertises direct TikTok publishing as supported.

### INT-001 — No project-operated credential proxy

Each deployment communicates directly with the user's selected providers. Kyle does not need to collect everyone's API keys or operate a paid backend for ordinary use. There is no centralized project wallet, hidden inference markup, or universal social-platform secret.

When users choose a hosted publishing bridge, that bridge becomes another service they trust with social authorization and publication media. The app must disclose that boundary. An open-source local interface does not make the bridge's backend open source or eliminate its data-processing role.

### INT-002 — Credentials are separate capabilities

A ScrapeCreators key does not unlock fal.ai, but one fal.ai key intentionally unlocks both qualified copy generation and qualified image generation/editing. A publishing-service key is separate and is not a TikTok password. Settings show separate capability cards with purpose, selected model where relevant, setup instructions, last check, permissions/limits where known, usage notes, and remove/replace controls.

Only harmless checks run on “Test connection” by default. If the provider lacks a free validation endpoint, explain the limitation and use a separately approved bounded test. A configured key can be valid while a model or account is unavailable. Credential health and feature qualification are separate fields.

## 2. Pinterest discovery with ScrapeCreators

### INT-003 — The verified wire contract

The documented search route is `GET https://api.scrapecreators.com/v1/pinterest/search`. Authentication uses the `x-api-key` header. The required search parameter is **`query`**, not `q`; `cursor` is an opaque pagination value, and `trim` requests a smaller response. The sample response includes Pins, image metadata, source links, a next cursor, and credit fields. These are documented shapes, not live-tested responses. [S01](08_SOURCES.md#s01)

Our normalized search result should contain only what the creator needs: provider result ID, Pin/source links, title or description where useful, candidate image URL/dimensions, a thumbnail reference, query/session identity, and provenance. Do not persist unrelated pinner profile data just because it appears in a full response.

The adapter stores cursors without decoding or manufacturing them. Query normalization, locale parameters if actually supported, and a cache key are explicit. An unsupported parameter must not be invented to make an interface look complete.

### INT-004 — Discovery, selection, and import are different actions

Search retrieves metadata and previews under an explicit user action. Selection identifies candidate visuals. Import is a separate controlled server job that downloads a chosen image into the owned library after the appropriate rights decision. A selected URL is not yet a durable asset.

The app records the source location, retrieval time, source provider, and rights assertion. It does not claim that using ScrapeCreators grants a Pinterest image license. Source descriptions and metadata are untrusted text; they cannot instruct the app to reveal keys, call tools, change a prompt's policy, or download arbitrary unrelated destinations.

Use explicit pagination, bounded concurrency, cached recent results where appropriate, and per-operation credit reporting when returned. The service's general documentation describes API-key usage and errors including credit exhaustion; our UI should map these to recoverable actions rather than endlessly retry. [S02](08_SOURCES.md#s02)

Do not implement a Pinterest password login, browser-cookie importer, or a substitute official Pinterest app behind Kyle's back. A future alternative search provider would require a new approved decision, while the rest of the library remains independent of ScrapeCreators.

## 3. Image generation with fal.ai

### INT-005 — Key scope, model schemas, and queue use

Keep the fal.ai credential on the server and use the appropriate API key scope rather than unnecessary administrative privileges. fal.ai documents key-based authentication; no provider secret belongs in a public browser bundle. [S03](08_SOURCES.md#s03)

Use a small catalog of tested model endpoints and input/output validators. The queue API supports submission with a retained request ID, status polling, and result retrieval. A completed queue status still requires checking the result for success or error. Client timeout or cancellation is not proof that inference stopped. [S04](08_SOURCES.md#s04)

The model catalog stores task type, endpoint, supported dimensions, reference-image behavior, output count, seed support, model-specific pricing source/date, and license/usage notes. Avoid permanently assigning a “best model” before testing real output quality and current prices. Candidate selection is a chapter outcome, not something an agent guesses from a familiar endpoint name.

### INT-006 — Durable outputs and explicit privacy

Import accepted outputs into local storage promptly. fal.ai's documentation distinguishes request JSON retention from media retention and describes lifecycle controls; these are not a substitute for our own accepted-asset store. The default media-link behavior and private-access controls must be reviewed for the chosen route. Private file controls have specific CDN support requirements, so “private” must not be advertised without testing the exact workflow. [S05](08_SOURCES.md#s05) [S06](08_SOURCES.md#s06)

The original design requirement is to keep sensitive input images local until the operator explicitly initiates a provider operation, minimize stored prompts, and choose a tested retention configuration. Inputs uploaded before inference may have their own ACL/lifecycle settings. A header on one inference request is not assumed to retroactively change all earlier uploads.

Do not set a very short output expiry that makes recovery impossible after a sleeping laptop. Record the configured deadline and import before it with a safety margin. If private authorized downloads are supported, the importer—not the user's browser—retrieves those bytes with the required credentials, then stores them locally.

### INT-007 — Image quality and cost qualification

Before an image preset is called supported, test its prompt schema, dimensions, output decoding, reference handling, partial failures, cancellation behavior, accepted request recovery, and usage metadata. Use owned or synthetic test references. Set a small explicit paid-test budget; do not run an open-ended aesthetic benchmark.

Evaluate usefulness for text-over-image slides: composition, negative space, readable product placement, consistency where requested, and fit to common crop presets. Do not promise that a seed guarantees the same image across changed model versions. Do not silently switch to a more expensive model on failure.

## 4. Copy generation uses the fal.ai key

### INT-008 — Unified fal.ai text route and curated selector

Use the same user-supplied fal.ai key for structured copy generation. fal.ai currently exposes LLM access through its OpenRouter-backed router, allowing model selection without asking the user for another provider credential. [S21](08_SOURCES.md#s21)

The UI exposes a small qualified copy-model selector rather than hundreds of raw models. Start with an inexpensive default that passes our slideshow-copy schema/quality tests, plus a few optional stronger choices. Model IDs and prices are configuration data with qualification dates, not permanent product assumptions. Never silently upgrade a failed request to a more expensive model.

The domain contract accepts brief/recipe versions, selected content scope, locked fields, the selected fal model ID, and an explicit generation budget. It returns validated slide copy, caption/title candidates, warnings, and provider usage where available. Retry malformed output only through a bounded policy that accounts for additional cost. Manual writing remains fully available when no fal.ai key is configured.

## 5. TikTok option comparison

### 5.1 What the pricing evidence actually says

| Option | Pricing snapshot from first-party pages | Interpretation for our product |
|---|---|---|
| Zernio | First two connected accounts free without a card; accounts 3–10 are $6 each monthly on graduated pricing. Current plans include full API and posts subject to publishing limits. [S07](08_SOURCES.md#s07) | Best documented low-cost starting point for one or two TikTok accounts, not a permanent-free guarantee. |
| Upload-Post | Free tier advertises 10 uploads/month and two profiles. The captured paid Basic offer is $192 billed annually, shown as $16/month equivalent, with five profiles. [S12](08_SOURCES.md#s12) | Useful fallback or low-volume trial; do not mislabel the annual equivalent as a no-commitment $16 monthly plan. |
| Post Bridge | API access is a $5/month or $50/year add-on requiring an active subscription. The $39/month Creator plan explicitly lists API add-on availability. [S15](08_SOURCES.md#s15) | The clearly documented monthly combination is $44; Starter/API eligibility remains unverified. Sensible for existing subscribers rather than a required default. |
| Official TikTok Content Posting API | Excluded by product decision. | Its developer-app approval flow is outside this project's low-friction self-hosted scope; do not implement or qualify it. |
| Self-hosted schedulers requiring TikTok developer-app credentials | Excluded from the default route. | They do not solve the approval problem we are intentionally avoiding; prefer bridge adapters with user-owned accounts. |

Account and profile counting differ. In Zernio, the free allowance is across the provider team, not separately renewed for every platform or profile. In Upload-Post, the documented profile can hold an account per platform. Compare a user's real account mix and posting volume before suggesting payment. No paid account was purchased during this research.

The recommendation is based on fit to this application's narrow initial job: native TikTok photos, reasonable solo cost, user-owned provider credentials, safe account connection, local-file upload, scheduling, and inspectable status. It is not an exhaustive claim that no other provider could be better or that we measured reliability across the market.

### INT-009 — Qualify Zernio first, do not couple the product to it

Build a provider-neutral publishing contract first, then qualify and implement one adapter. A passed connection test alone is insufficient. Support should be recorded by provider, credential plan, account type/route, media kind, delivery mode, and operation.

The current Zernio TikTok guide documents native photo carousels and draft handoff. It also describes shared Direct Post capacity; under pressure, accounts without a payment method can be gated earlier. Thus “two accounts free” must not become “guaranteed public auto-posting without a card.” Inbox handoff remains a different outcome, not an equivalent public-posting fallback. [S08](08_SOURCES.md#s08)

If its live qualification fails on a must-have capability, use the same contract to evaluate Upload-Post before adding workarounds. Record the failed evidence and change the default through a decision. Do not integrate three vendors simultaneously just to avoid choosing.

## 6. Proposed Zernio user connection flow

### INT-010 — Dashboard-first fallback, integrated connection when verified

The first supported onboarding can be: create/use the user's Zernio account, connect TikTok through its own dashboard, create an appropriately scoped API key, paste that key into the local app, and refresh authorized accounts. This avoids inventing a callback/tunnel requirement for localhost.

For the more integrated flow, the documentation provides a connect URL operation with a profile reference. Use the provider's supported account-connection process and then re-fetch the authorized account list server-side. Redirect/callback support, allowed origins, and account-selection behavior must be tested for local and server deployments. [S11](08_SOURCES.md#s11)

Our app maintains a short-lived connection session bound to the authenticated owner and intended provider profile. It validates any return URL, state/nonce mechanisms that the integration supports, and final account identity. A query string saying `connected=true` is not authoritative. If the provider callback cannot support a local installation, retain dashboard-first setup instead of improvising insecure OAuth handling.

Never ask users to send API keys to Kyle. Never connect all accounts returned by a broad credential automatically. Show a selected account's avatar/display name where authorized, stable platform identity, provider identity, and available operations; the user confirms the actual target.

### INT-011 — Exact account capabilities drive the composer

The documented creator-info route is `GET /v1/accounts/{accountId}/tiktok/creator-info` with `mediaType=photo` for photo-specific settings. It returns creator details, available privacy levels, and capability information. Our API origin/prefix must be configured consistently: for example, origin plus `/api`, then documented `/v1/...` paths—not `/api/v1/v1/...`. [S28](08_SOURCES.md#s28)

The adapter maps these results to internal typed controls. Refresh before final review and use a validity policy before submission. Do not populate missing privacy choices from a memorized universal enum. Capability unavailability is a blocking validation result when it affects required privacy, consent, disclosure, or the chosen operation.

The project should initially submit one target account per logical publication. Multi-account batches create separate intents and approvals. That design reduces cross-account settings leakage and makes partial success easier to explain.

## 7. Media upload and scheduling windows

### INT-012 — Local files can be transferred without a public app bucket

Zernio documents a three-step media path: request `POST /v1/media/presign`, PUT the bytes to the returned upload URL, then reference the returned public media URL in a post. The storage PUT must not carry the provider API authorization header. The upload URL lasts about one hour, while uploaded media is temporary for seven days and is copied to permanent storage when its post publishes. [S09](08_SOURCES.md#s09)

That distinction changes the product. The simple local install can publish without exposing its own media server publicly, but it cannot safely upload a file today and promise provider-only delivery thirty days later using that temporary URL.

Proposed default policy: hand off provider-scheduled posts only when their scheduled publication fits within a **six-day operational window** after the actual media upload, leaving a one-day safety buffer relative to the currently documented retention. This six-day value is our conservative proposal, not a provider limit. Compute the deadline from the earliest relevant uploaded asset, not from the time the draft was first created.

For later dates, offer a visible local plan and just-in-time handoff, which requires the installation to run again. Alternatively, an advanced operator can configure tested durable HTTPS media storage with an appropriate privacy/access policy. Do not silently force every user to buy a storage service, and do not silently schedule beyond the tested retention window.

### INT-013 — Time fields cannot be allowed to trigger accidental immediate posting

The create-post reference distinguishes immediate, scheduled, queue, and provider-draft actions; it also states that a past scheduled time can publish immediately. The adapter must send exactly the intended mode and reject stale scheduled instants locally. [S29](08_SOURCES.md#s29)

Our own scheduler chooses an explicit UTC instant, preserves the user's time-zone context, and reads back the provider's accepted schedule. We should not mix a provider “next available queue slot” feature with a locally reserved slot for the same post. Time-zone conversion rules are validated against the provider's documented interpretation. [S30](08_SOURCES.md#s30)

Long-range approval and later capability changes require special care: if the target or necessary settings have changed, hold the post for review rather than altering it automatically. Once the provider owns the schedule, the app can monitor/reconcile it, but a paused local worker is no longer the delivery authority.

## 8. Submission, statuses, and duplicate prevention

### INT-014 — Persisted idempotency with known limits

For Zernio post creation, the documented replay header is **`x-request-id`**. Its replay protection lasts roughly five minutes after completion; a separate content/media-URL deduplication rule covers about 24 hours. A retry can return HTTP 200 with `existingPost`, rather than the original 201 shape. [S10](08_SOURCES.md#s10)

Our app must persist the logical request ID and original payload before submission. It must reuse media-transfer references for safe replay, rather than generating new URLs that alter a deduplication fingerprint. Beyond the documented replay window, reconcile the original post ID, supported metadata/correlation, and provider history before taking another side effect. An inconclusive lookup means “unknown,” not permission to post again.

A stable local UUID is valuable, but it cannot extend a vendor's retention window. Do not advertise exactly-once publication. Prefer a visible unresolved item over knowingly risking duplicate content or an extra bill.

### INT-015 — Parse outcomes, not merely HTTP success

The provider's error guide distinguishes transport errors, platform failures, and uncertain writes; immediate publication can return a 207 response with failure details. Our adapter examines both HTTP status and typed body/platform results, preserving useful sanitized diagnostics. [S31](08_SOURCES.md#s31)

Normalize provider states into the application's own publication state machine. A queued or accepted operation is not necessarily published. A remote schedule ID is not proof that the eventual TikTok post succeeded. A cancellation request is not a confirmed cancellation. Status reconciliation uses the documented post lifecycle and readback, and can run by polling so a local install does not require a public webhook. [S32](08_SOURCES.md#s32)

For inbox delivery, inspect media/mode markers rather than trusting a vendor's broad “published” label. The Zernio guide explicitly describes an inbox success that it cannot later track to a public post. Our UI must end that route at “Delivered to TikTok inbox” unless another verified source later establishes publication. [S08](08_SOURCES.md#s08)

### INT-016 — Analytics are an optional capability of the connected route

Read only metrics that the provider actually returns for the relevant account and media. Store collection time and measurement/source context. The provider exposes an analytics API, but that does not prove every TikTok photo post supplies every desired metric. [S33](08_SOURCES.md#s33)

Our desired fields may include views, likes, comments, shares, and account-level changes where available. Completion rate, per-slide retention, saves, or link conversions must not be invented. A chapter can ship a useful Results screen with a documented reduced metric set, provided the release does not advertise unavailable measurements.

## 9. Upload-Post fallback details

### INT-017 — A separate adapter, not copied Zernio semantics

Upload-Post documents native photo submission at `POST https://api.upload-post.com/api/upload_photos` with `Authorization: Apikey ...` and multipart photo data. Its `Idempotency-Key` is the deduplication mechanism; `request_id` and external labels are not equivalent. The photo route also documents direct versus inbox modes and a `disable_inbox_fallback` control. [S13](08_SOURCES.md#s13)

Our adapter would explicitly disable silent inbox fallback for a direct-publication intent. It would require user-selected privacy rather than relying on the provider's public default, inspect account-route capabilities, and treat ignored unsupported fields as errors when those fields are necessary for consent/privacy/disclosure. These are application requirements, not an assertion that we tested every route.

Use its scheduling-management interface for schedule readback/cancellation rather than assuming that deleting a local row cancels the vendor job. Verify remote media retention for the exact scheduled-upload path before promising long-range offline delivery; an advertised scheduling horizon is not by itself proof of media durability. [S14](08_SOURCES.md#s14)

The service offers different connection/route capabilities over time. Claims about bypassing a shared app capacity limit or universal photo labeling must be validated on the actual connected account. Do not present a vendor's marketing assertion as our independent compliance certification.

## 10. Post Bridge: useful, but not the initial cost default

### INT-018 — Existing subscribers can benefit from an optional connector

Post Bridge does have an API, not just a user-facing scheduling app. Its first-party agent integration documents API-key setup, media upload, posting/scheduling, analytics, and TikTok draft mode. The agent repository being open source does not mean the hosted scheduling service is open source. [S16](08_SOURCES.md#s16)

The public API reference loaded as an interactive shell during this research, so its full endpoint and response schemas were not independently extracted. Do not guess those paths from another service. Before implementing a Post Bridge adapter, obtain the accessible current schema and run the same publishing qualification suite. [S17](08_SOURCES.md#s17)

For a user who already pays for an eligible plan, its incremental API add-on may be reasonable. For a newcomer whose goal is to avoid another substantial subscription, it is not the first default supported by the reviewed pricing. This is a cost/fit judgment, not a negative reliability claim.

## 11. TikTok publishing boundary

### INT-019 — Official TikTok posting integration is out of scope

Do not implement, prototype, qualify, document setup for, or spend chapter budget on TikTok's official Content Posting API or developer-app approval flow. The intended self-hosted experience uses a qualified third-party publishing bridge such as Zernio, Upload-Post, or another later-approved adapter, with manual export/handoff as the permanent fallback.

This is a product-scope decision, not a claim that the official API is technically impossible. It exists to keep installation practical for ordinary local/self-hosted users and to avoid spending implementation effort on an approval path Kyle has explicitly rejected. A future reversal requires an explicit North Star amendment before implementation work begins.

### INT-020 — Supervised automation is the supported baseline

There are three different features: generating drafts automatically, scheduling already reviewed posts, and publishing future unseen content without individual review. The first two are the intended core. The third remains a conditional extension requiring route-specific policy/UX validation and explicit approval.

Photo AI disclosure is a qualification gate: a bridge may expose an AI field with a different name or on a different backend route than the public direct API. Verify that a required disclosure actually appears correctly for the chosen photo route. When it cannot be reliably carried, offer an honest manual TikTok handoff/export process or hold the operation; never suppress the disclosure just to make automation succeed.

Likewise, a music option is not blanket rights to any soundtrack. A commercial-content setting is not a substitute for truthful content. Platform rules, provider contracts, rights to imagery, and the application's consent record all matter independently.

## 12. Mandatory publishing qualification

Complete a record using [the qualification template](../templates/PROVIDER_QUALIFICATION_TEMPLATE.md). Use operator-authorized test accounts and owned/synthetic assets. Any public test needs explicit authorization; no public post is authorized by this North Star. Some tests require time-separated observations, and those remain pending until actually observed rather than being simulated and marked passed.

| ID | Qualification outcome required | Failure consequence |
|---|---|---|
| PQ-01 | Confirm current plan pricing, account limits, API entitlement, and terms suitable for user-owned self-hosted integration. | Do not recommend purchase or call the plan supported. |
| PQ-02 | Connect one authorized TikTok account and verify identity server-side. | No publishing support. |
| PQ-03 | Verify local-dashboard setup and, separately, any integrated callback flow. | Ship only the verified connection path. |
| PQ-04 | Disconnect/reconnect without targeting a different account or resuming stale work. | Block queued work on reconnection. |
| PQ-05 | Upload local photo bytes without a public app server; validate the final media. | Keep export-only or require a documented alternate storage path. |
| PQ-06 | Publish a true ordered multi-photo carousel, not a montage video. | Do not claim native photo support. |
| PQ-07 | Verify photo-specific title/caption, cover, privacy, and interaction controls. | Disable unsupported combinations; fail closed on required controls. |
| PQ-08 | Verify commercial-content and required synthetic-media disclosure on the actual photo route. | Manual handoff or blocked direct publication for affected content. |
| PQ-09 | Record an actual preview/approval event and show it produces the required provider settings. | No unattended submission. |
| PQ-10 | Schedule an approved post and read back the exact intended instant. | Immediate/manual modes only until fixed. |
| PQ-11 | Confirm media-retention behavior and a safe handoff window. | No long-range provider-only schedule promise. |
| PQ-12 | Stop the local worker after remote acceptance and verify scheduled outcome later. | Do not claim offline-after-handoff delivery. |
| PQ-13 | Cancel a remote schedule and verify the outcome; test a too-late cancellation separately. | Show cancellation as unsupported/pending rather than successful. |
| PQ-14 | Simulate a lost submission response and reconcile without an extra post. | Publishing reliability gate fails. |
| PQ-15 | Test replay inside and outside documented idempotency windows. | Unknown state must hold; no blind delayed retry. |
| PQ-16 | Verify 2xx/207 mixed or failed outcomes normalize correctly. | Status accuracy gate fails. |
| PQ-17 | Distinguish inbox delivery from public publication and explain final user action. | Do not offer inbox mode. |
| PQ-18 | Observe delayed/absent public URLs without false failures or false publication. | Restrict status claims. |
| PQ-19 | Exercise rate/capacity/credit/permission failures through authorized fixtures or safe observed failures. | No automatic retry behavior until classification is sound. |
| PQ-20 | Check available metrics for photo posts and their refresh/availability semantics. | Label unverified/unavailable fields; do not fabricate metrics. |
| PQ-21 | Verify key redaction in browser, logs, exports, errors, and support bundle. | Release blocked. |
| PQ-22 | Verify provider account/media references cannot cross workspace or user boundaries. | Release blocked. |
| PQ-23 | Validate past-due schedules, time zones, and missed-slot behavior. | Scheduling release blocked. |
| PQ-24 | Confirm safe degradation when the provider is unavailable, changes plan, or revokes access. | Manual/export path must remain available. |

A test can be mocked for application error handling while its live provider behavior remains unverified. Record those separately. Provider claims may be rechecked through public documentation, but a genuine live result requires authorized execution and evidence. Kyle's approval of an architecture is not permission to spend credits or publish publicly.

## 13. Provider-switch decision rule

Change the recommended bridge when a required capability fails qualification, material pricing changes undermine the solo-user case, retention prevents the desired deployment promise, the provider disallows the intended integration, or observed reliability fails an agreed threshold. Preserve the failing evidence, record an ADR, and qualify the alternative against the same outcomes.

Do not solve such a failure by hiding limitations, silently changing native photos into video, falsely marking inbox delivery as publication, forcing a paid plan without explanation, or weakening approval/rights requirements. The adapter boundary exists precisely so the product can survive a provider change without compromising its purpose.
