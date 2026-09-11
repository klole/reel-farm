# 08 — Source register and evidence boundaries

**Research snapshot: September 10, 2026.** Sources below are first-party product/platform documentation, primary software documentation, or the license text. They were used to distinguish documented capability from proposed architecture. Prices, schemas, limits, terms, and routes can change; revalidate before implementation and release.

No provider account was purchased, key submitted, model invoked, TikTok account authorized, or post published during this research. No GitHub repository belonging to Kyle was supplied or reviewed. Public vendor repositories are documentation sources, not evidence of the new project's implementation.

The earlier Reel.farm dossier is background supplied in the conversation. Its reconstruction proposals are not binding architecture for this project. This North Star specifies original desired outcomes, not a claim to know or reproduce a competitor's private implementation.

## Evidence vocabulary

**Documented** means the provider describes the capability. **Advertised** means a first-party marketing/pricing page presents an offer. **Proposed** means an original product/engineering decision in this package. **Qualified** requires actual authorized testing recorded against a provider/account/route. **Unknown** means the reviewed evidence does not settle the point. Do not promote one category into another without new evidence.

<a id="s01"></a>
### S01 — ScrapeCreators Pinterest search

https://docs.scrapecreators.com/v1/pinterest/search/

Primary API reference for route, authentication header, query/cursor parameters, response fields, and credit metadata. Used as a documented contract, not a tested response or reuse license.

<a id="s02"></a>
### S02 — ScrapeCreators documentation

https://docs.scrapecreators.com/

General API-key setup and error/credit context. A particular key's available credits and account status were not tested.

<a id="s03"></a>
### S03 — fal.ai authentication

https://fal.ai/docs/documentation/setting-up/authentication

Primary key-authentication and credential guidance. Supports server-side key handling; it does not certify our unimplemented storage design.

<a id="s04"></a>
### S04 — fal.ai queue inference

https://fal.ai/docs/documentation/model-apis/inference/queue

Submission, status, result, and cancellation behavior. Model-specific schemas still require separate qualification.

<a id="s05"></a>
### S05 — fal.ai retention and media expiration

https://fal.ai/docs/documentation/model-apis/media-expiration

Request/media retention and lifecycle controls. Settings need validation for the chosen model and recovery workflow.

<a id="s06"></a>
### S06 — fal.ai file access controls

https://fal.ai/docs/documentation/model-apis/file-access-controls

Public/private media-access options and supported CDN conditions. Not evidence that all model/reference paths are private by default.

<a id="s07"></a>
### S07 — Zernio pricing

https://docs.zernio.com/pricing

Current first-party account-based pricing and included API features. The Late documentation root redirected to Zernio during research; no exact rebrand date is asserted. Future pricing and every legacy-plan entitlement remain outside this snapshot.

<a id="s08"></a>
### S08 — Zernio TikTok platform guide

https://docs.zernio.com/platforms/tiktok

Native photo, inbox, capacity, controls, and state caveats. Especially important for not equating free-account eligibility with guaranteed available direct-post capacity or inbox handoff with public publication.

<a id="s09"></a>
### S09 — Zernio media uploads

https://docs.zernio.com/guides/media-uploads

Presigned upload flow, storage authorization distinction, and temporary-media retention. The upload-signature lifetime and stored-media lifetime are different.

<a id="s10"></a>
### S10 — Zernio idempotency

https://docs.zernio.com/guides/idempotency

Endpoint-specific replay header, short replay window, content deduplication, and response-shape differences. Does not justify an exactly-once guarantee.

<a id="s11"></a>
### S11 — Zernio account connection

https://docs.zernio.com/guides/connecting-accounts

Provider-mediated account connection and account discovery. Local callback suitability remains a hands-on qualification question.

<a id="s12"></a>
### S12 — Upload-Post pricing and product page

https://www.upload-post.com/

First-party free/paid offer snapshot and profile counting. The captured Basic amount was explicitly billed annually. Marketing assertions about approval/privacy are not treated as independent certification.

<a id="s13"></a>
### S13 — Upload-Post photo API

https://docs.upload-post.com/api/upload-photo/

Photo upload, authentication, scheduling/mode fields, idempotency versus correlation, and fallback controls. Account-route variations need live testing.

<a id="s14"></a>
### S14 — Upload-Post schedule management

https://docs.upload-post.com/api/schedule-posts/

Management of scheduled operations. A scheduling horizon alone does not establish durable media retention for every upload path.

<a id="s15"></a>
### S15 — Post Bridge product and pricing

https://www.post-bridge.com/

API add-on and subscription pricing. The correct service domain is the hyphenated `post-bridge.com`; similarly named unrelated businesses were excluded.

<a id="s16"></a>
### S16 — Post Bridge first-party agent integration

https://github.com/post-bridge-hq/agent-mode

First-party API/agent setup and operation documentation. The repository's open-source status is not a claim that the hosted scheduling service is open source.

<a id="s17"></a>
### S17 — Post Bridge API reference

https://api.post-bridge.com/reference

The linked interactive reference loaded without a fully extractable schema in the research environment. This is an explicitly limited source: exact endpoint/payload details were not independently recovered and must be obtained before an adapter is written.

<a id="s18"></a>
### S18 — TikTok content-sharing guidelines

https://developers.tiktok.com/docs/en/content-sharing-guidelines

Primary platform guidance for sharing UX, creator controls, consent, intended use, and audit-related restrictions. The page reviewed identified an August 4, 2026 update. A bridge does not justify ignoring platform requirements.

<a id="s19"></a>
### S19 — TikTok photo-post reference

https://developers.tiktok.com/docs/en/content-posting-api-reference-photo-post

Primary direct photo API schema, modes, media-transfer requirements, and constraints. The reviewed page did not list an `is_aigc` request field; provider-specific photo disclosure remains a qualification issue rather than a guessed direct-API field.

<a id="s20"></a>
### S20 — Postiz self-hosted TikTok provider setup

https://docs.postiz.com/self-host/providers/tiktok

Primary project documentation showing developer-app configuration requirements. When scheduler documentation and TikTok's current platform documentation conflict, the latter governs platform requirements.

<a id="s21"></a>
### S21 — fal.ai LLM/OpenRouter routing

https://fal.ai/models/openrouter/router/api

Primary fal.ai model documentation showing that a single `FAL_KEY` can access an OpenRouter-backed LLM router and select the model by ID. Used to support the unified-key copy-generation direction; individual model quality, schema behavior, and current prices still require qualification.

<a id="s22"></a>
### S22 — pg-boss

https://github.com/timgit/pg-boss

Primary project source/documentation for PostgreSQL-backed Node jobs. Queue claims do not establish exactly-once external side effects.

<a id="s23"></a>
### S23 — Next.js self-hosting

https://nextjs.org/docs/app/guides/self-hosting

Primary deployment guidance. The page reviewed was updated August 25, 2026. Exact package versions and runtime behavior must be pinned and tested in the implementation chapter.

<a id="s24"></a>
### S24 — Playwright screenshot capture

https://playwright.dev/docs/screenshots

Primary screenshot API documentation supporting the proposed rendering approach. Reproducibility and resource use of our renderer remain unmeasured.

<a id="s25"></a>
### S25 — Pinterest copyright help

https://help.pinterest.com/en/article/copyright

Primary explanation of rights/permission considerations. Search availability and source attribution do not themselves supply permission to reuse an image.

<a id="s26"></a>
### S26 — OWASP SSRF prevention

https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

Security guidance for controlled server-side URL fetching. Inclusion in a plan is not a security audit or evidence that controls are implemented.

<a id="s27"></a>
### S27 — AGPL version 3 license text

https://opensource.org/license/agpl-3.0

OSI-hosted license text, including source/network provisions. AGPL-3.0-only is a proposal requiring Kyle's decision. The exact license governs; this package does not offer a comprehensive legal analysis or apply a license to an unseen repository.

<a id="s28"></a>
### S28 — Zernio creator information endpoint

https://docs.zernio.com/accounts/get-tiktok-creator-info

Photo/video-specific creator settings and supported account information. Used for the account-aware review contract.

<a id="s29"></a>
### S29 — Zernio create-post reference

https://docs.zernio.com/posts/create-post

Submission/scheduling mode behavior, body fields, and past-time behavior. API examples in this package are not executed requests.

<a id="s30"></a>
### S30 — Zernio time-zone handling

https://docs.zernio.com/guides/timezones

Interpretation of explicit instants, time-zone fields, and schedule representation. Our recurrence/DST policies are original application proposals that need separate tests.

<a id="s31"></a>
### S31 — Zernio error handling

https://docs.zernio.com/guides/error-handling

Error categories, uncertain writes, and interpretation of platform-level failure. HTTP success alone is not sufficient publication evidence.

<a id="s32"></a>
### S32 — Zernio post lifecycle

https://docs.zernio.com/guides/post-lifecycle

Remote lifecycle and status transitions. The application deliberately retains its own mode-aware state model.

<a id="s33"></a>
### S33 — Zernio analytics reference

https://docs.zernio.com/analytics/get-analytics

Available analytics interface. Specific native-photo metrics and refresh behavior must be qualified on the actual account/route before being advertised.

## Revalidation rule

Before a provider chapter, check the relevant primary pages and record the date. Before a public release, recheck the selected providers' pricing, terms, schemas, retention, idempotency, account capabilities, and platform requirements. Keep prior qualification results with their original date rather than silently replacing history.

Do not spend weeks re-researching unrelated competitors before every chapter. Revalidate the assumptions that could materially affect the current implementation, cost, security, or user promise.
