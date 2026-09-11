# 07 — Decisions, tradeoffs, and unresolved risks

**Status:** planning register as of September 10, 2026.  
**No proposal below has been accepted by Kyle merely because it appears in this document.**

## 1. Decision register

| ID | Decision | Status | Rationale / change rule |
|---|---|---|---|
| DEC-001 | Free, genuinely open-source project with no project-imposed subscription or credit markup. | Fixed by Kyle. | Core purpose; change requires an explicit product redefinition by Kyle. |
| DEC-002 | Users supply their own provider credentials. | Fixed by Kyle. | Users pay providers directly; no central project-funded inference gateway. |
| DEC-003 | ScrapeCreators for Pinterest discovery. | Fixed by Kyle. | Build this integration, not a guessed alternative. |
| DEC-004 | fal.ai as the unified AI provider for both copy and image generation/editing. | Fixed by Kyle. | One fal.ai key minimizes setup; copy and image tasks each expose a small tested model selector. |
| DEC-005 | Original UI/branding/names/code with equivalent useful workflows. | Fixed by Kyle. | Functional goals, not a visual or proprietary clone. |
| DEC-006 | Checkpoint-based architect/Luna loop driven by Kyle. | Fixed by Kyle. | No one-shot whole-product implementation; review real repo changes. |
| DEC-007 | Approve North Star before issuing v0.1.0 implementation brief. | Fixed by Kyle. | This package is planning only. |
| DEC-008 | Single-operator-first self-hosted web application. | Proposed. | Best fit for private BYOK use and manageable security; public SaaS is a different product boundary. |
| DEC-009 | TypeScript/React/Next.js, Node worker, PostgreSQL, Drizzle, pg-boss. | Proposed. | Cohesive contributor stack and durable work without mandatory Redis or managed backend. |
| DEC-010 | Shared declarative slide model with pinned Playwright/Chromium rendering. | Proposed. | One layout implementation, local rendering costs, reproducible final preview. |
| DEC-011 | Persistent local media first; optional S3-compatible storage. | Proposed. | Low-friction installation without making cloud storage mandatory. |
| DEC-012 | Complete manual creation/export without provider keys. | Proposed baseline invariant. | Preserves usefulness, autonomy, and outage resilience. |
| DEC-013 | fal.ai LLM routing is the default automated-copy path; no separate LLM key. | Fixed by Kyle. | Fewer credentials and one billing surface for AI; preserve manual copy and bounded model selection. |
| DEC-014 | Zernio first publishing candidate; Upload-Post fallback; Post Bridge optional later. | Proposed, qualification required. | Documented solo-user fit, with serious retention/capacity caveats kept visible. |
| DEC-015 | Native photo carousel is primary; MP4 montage is distinct. | Proposed baseline invariant. | Preserves the desired swipeable TikTok workflow. |
| DEC-016 | Automated drafts plus individually approved scheduled content are the core automation mode. | Proposed, policy-sensitive. | Clear consent and truthful capability boundary. Future unseen-content publishing needs separate validation. |
| DEC-017 | AGPL-3.0-only source-code license. | Proposed, explicit approval needed. | Community reciprocity for modified network versions; still permits commercial use under its terms. |
| DEC-018 | No public multi-tenant promise at initial stable release. | Proposed. | Avoid claiming security/operations that have not been built and tested. |
| DEC-019 | UGC/video and additional platforms are explicit extension lanes. | Proposed. | Retains long-term direction without blocking a complete slideshow core. |
| DEC-020 | Evidence-driven acceptance and immutable approvals. | Proposed baseline invariant. | Prevents drift, fake completion, unauthorized posts, and ambiguous side-effect handling. |
| DEC-021 | Do not integrate TikTok's official Content Posting API. | Fixed by Kyle. | Avoid developer-app approval work that conflicts with the intended local/self-hosted onboarding; use bridge adapters or export. |

The first approval should accept this set or enumerate exceptions. After approval, changes become individual ADRs with a rationale, alternatives, migration consequences, affected requirements/tests, and Kyle's decision when required.

## 2. Tradeoffs we are consciously making

### A publishing bridge is a dependency, not the business model

A bridge helps ordinary users connect TikTok without each becoming a platform-integration operator. It also introduces vendor availability, terms, pricing, account limits, retention, and data exposure. The app remains free; the bridge may not. The counterweight is a narrow adapter boundary and a complete export path.

We are not promising that an open-source app can reproduce a commercial product's centralized platform privileges with no external account setup. That would be misleading. We are choosing the least-friction documented route to test, while preserving a path to replace it.

### Local simplicity versus always-on automation

Local storage and containers keep setup simpler and user control stronger. They cannot make a sleeping computer run a scheduler. Provider handoff can reduce uptime dependence only after actual accepted scheduling and media-retention checks. Long-range planning and guaranteed remote delivery remain distinct.

An always-on private server is an available deployment mode, not a mandatory first-run infrastructure project. More advanced storage is justified when the user needs a capability it enables, not because every app should use a cloud bucket.

### A browser renderer versus copying Pillow

The earlier competitor research contained renderer clues, but they do not dictate our implementation. A shared browser-based slide component can reduce preview/export divergence for a TypeScript product. It costs memory and requires careful sandboxing/pinning. If early measurements show an unacceptable problem, compare alternatives through an ADR and preserve one authoritative renderer rather than maintaining two inconsistent ones.

### Open-source reciprocity versus maximum permissiveness

AGPL is proposed because Kyle wants a free community project and may value improvements remaining available in modified hosted versions. A permissive license could reduce adoption friction for some integrators. Kyle must decide the policy; neither choice should be smuggled in as a coding convenience. Adding a non-commercial restriction would change the nature of the open-source commitment.

### Polished narrow functionality versus broad placeholders

A real seven-slide workflow is better than a dozen menu items with fake data. The roadmap is broad, but each checkpoint is narrow. Explicit extension lanes protect future intent without requiring an agent to ship untested avatars, analytics, cloud deployment, and publishing all at once.

## 3. Risk register

| Risk | Impact | Mitigation / release gate |
|---|---|---|
| RISK-01: Publishing bridge's free tier changes or is capacity-gated. | Users cannot assume zero-cost public scheduling. | Dated pricing, visible capability state, provider adapter, fallback/export, early qualification. |
| RISK-02: Required AI/commercial photo disclosure is not carried by the actual route. | A post may be misleading or fail requirements. | Photo-specific live qualification; hold affected direct posts or use explicit manual completion. |
| RISK-03: Temporary media expires before a future schedule. | Scheduled post fails after local computer is off. | Track expiry, conservative handoff window, local-plan state, optional durable storage. |
| RISK-04: Idempotency window expires before recovery. | Duplicate posts or charges. | Persist attempts, reconcile, preserve uncertain state, never assume local UUID gives permanent dedup. |
| RISK-05: Provider “published” means inbox handoff. | False success claim. | Internal state normalization by operation/mode; separate public confirmation. |
| RISK-06: Pinterest results are treated as licensed assets. | Copyright complaints and unusable community examples. | Provenance, rights decisions, owned/authorized automation pools, no watermark removal. |
| RISK-07: API keys leak through client/logs/export. | Unauthorized charges and account access. | Server-only secrets, encryption/redaction, tests, least privilege, rotation. |
| RISK-08: Untrusted URLs or templates execute privileged behavior. | Host compromise or private-data exposure. | SSRF controls, safe decoders, declarative templates, renderer containment. |
| RISK-09: Model pricing/schema changes. | Failed generation or unexpected costs. | Tested model catalog, dated prices, bounded calls, capability invalidation. |
| RISK-10: Local host sleeps or stops. | Missed draft-generation/handoff slots. | Explicit mode/uptime UI, missed-slot policy, always-on deployment option. |
| RISK-11: Backup restore replays already executed actions. | Duplicate charges/public posts. | Restore paused, reconcile external state, operational restore gate. |
| RISK-12: Context drift across architect/Luna sessions. | Contradictory implementation and lost requirements. | Canonical spec/state/ADRs, commit-based reviews, bounded briefs, stable IDs. |
| RISK-13: Scope grows into a general AI/video platform. | Core workflow remains unfinished. | Non-goals, extension lanes, one outcome per chapter, review stop rule. |
| RISK-14: A vendor's documentation conflicts internally or with the platform. | Wrong request behavior or unsafe assumptions. | Current primary platform source takes precedence; record conflicts and qualify exact route. |
| RISK-15: Synthetic UGC implies a real customer endorsement. | Deceptive content and reputational harm. | Separate extension review, consent/provenance, explicit synthetic treatment, no fabricated testimony. |
| RISK-16: Clean installation requires undocumented infrastructure. | Community cannot use the product. | Fresh-user install test, packaged images, no mandatory provider setup for manual mode. |
| RISK-17: Provider cancellation races publication. | User believes a post was stopped when it was not. | Best-effort request versus confirmed result, no false retraction promise, reconciliation. |
| RISK-18: “Unlimited” provider marketing is treated as unlimited actual posting. | Rejections, spam-like behavior, retry loops. | Separate app, provider, platform, and account caps; bounded policy-aware scheduling. |

## 4. Unresolved questions, with owners and decision points

| Question | Proposed owner / when to resolve | Current position |
|---|---|---|
| Final public name and visual identity? | Kyle with a future branding chapter. | Working descriptor only; no clearance claim. |
| Final license? | Kyle at baseline approval, before public code release. | AGPL-3.0-only recommended. |
| Exact package/runtime versions and auth library? | Architect/Luna in the first bounded foundation chapter. | Use supported maintained versions with recorded rationale; no legacy version assumed. |
| Default fal.ai model presets and price configuration? | Visual-provider qualification chapter. | Small tested catalog; no unsupported “best model” claim. |
| Default fal.ai copy model and allowlist? | Copy-provider qualification chapter. | One fal.ai key is fixed; qualify an inexpensive default plus a small optional model list. |
| Zernio terms and photo-route behavior fit this integration? | Early authorized publishing qualification. | Documented fit, not live verified. |
| Does required AI labeling work on the actual chosen photo route? | Publishing qualification, before affected direct posts. | Unverified; mandatory gate. |
| What retention window is actually safe for long-range schedules? | Media/scheduling qualification. | Conservative short remote window based on current docs; longer dates stay local unless durable hosting is qualified. |
| Which metrics are available for native photos? | Metrics qualification. | Show only measured/returned data; no invented retention metrics. |
| Is fully unattended unseen-content publishing permissible for a specific supported route? | Separate policy/UX decision, not default implementation. | Not enabled or promised. |
| Which desktop/server architectures are officially supported? | Packaging/beta validation. | Publish only measured/tested support. |
| Is trusted-team collaboration needed before stable core? | Kyle after the core review journey works. | Extension unless explicitly promoted through a scope amendment. |

Questions that do not block the current chapter remain recorded rather than repeatedly asked in chat. Questions that affect cost, irreversible actions, legal/policy boundaries, or major architecture must be resolved before those actions occur.

## 5. Change proposals must include consequences

A useful ADR states the problem, current evidence, realistic alternatives, proposed choice, effects on users/install/cost/security, affected requirements/tests, migration or rollback plan, and approval authority. “This library is easier” is not enough when it adds a required cloud account or changes the whole stack.

When a provider changes, preserve the old qualification record with its date and route. When a feature becomes unsupported, disable it honestly and keep the manual path. When a requirement is deferred, state which release claim changes. Do not erase the history that explains why the current design exists.

## 6. Approval record to create later

The accepted baseline record should contain Kyle's decision date, approved specification revision/hash, repository commit, accepted proposed decisions, exceptions, and the fact that live-action authorization remains separate. It must not be filled in by an agent on Kyle's behalf.

At the time of this package, that record does not exist. The project is ready for baseline review, not claimed approved or implemented.
