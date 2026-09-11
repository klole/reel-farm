# 05 — Checkpoints, acceptance, and completion criteria

**Status:** outcome roadmap and verification specification. This is not the v0.1.0 Luna implementation assignment.  
**Parent:** [North Star](../NORTH_STAR.md)

## 1. Why the milestones are intentionally bounded

The aim is to prove progressively larger pieces of the creator workflow, not to accumulate screens that look finished. Each checkpoint should leave a useful working slice, a clear repository state, evidence, and an explicit review verdict. The next chapter is selected from actual gaps after review.

Use semantic version labels such as `0.1.0`, `0.2.0`, and `0.3.0`. Use a chapter identifier such as `CH-003` independently of the version. A repair chapter may keep the same target version. A patch release does not imply a new feature milestone. Numbers are coordination tools, not delivery dates.

No milestone below authorizes coding, purchasing, account connection, paid generation, or public publishing. Those permissions belong in a separately approved chapter. Kyle approves scope changes. The architect proposes and reviews. Luna implements the bounded assignment.

## 2. Evidence levels

| Level | Meaning | What it cannot prove |
|---|---|---|
| E0 — Proposed | Written requirement or design. | That code exists. |
| E1 — Inspected | Relevant implementation reviewed at an identified commit. | That it ran correctly. |
| E2 — Automated local | Unit/integration/UI checks executed with recorded commands/results. | That a live external provider behaves like its fixtures. |
| E3 — Live qualified | Authorized operation executed against the actual provider/account/route with sanitized evidence. | Reliability over time or across all account types. |
| E4 — Operationally exercised | Restart, delayed schedule, restore, or other time-dependent behavior observed under stated conditions. | An unlimited future service guarantee. |

A release advertises no higher evidence level than it has. A screenshot can prove a visible state, not that the underlying post is public. A job marked complete can still fail output validation. A mock provider is mandatory for safe development but insufficient for live capability claims.

## 3. Milestone outcomes

### Baseline approval — before implementation

Kyle approves the mission, original-UI boundary, fixed providers, proposed architecture, license direction, text-provider direction, publishing qualification order, and supervised automation scope. Record the approved specification revision and Git commit when a repository exists. Any exceptions become explicit decisions.

Required output: an accepted baseline record and current project state. Not required: code, containers, provider accounts, a purchased domain, or a finalized marketing name. The descriptive working title can remain until a separate naming decision.

### v0.1.0 — A real manual slideshow, saved and exported

Outcome: a clean private installation supports owner setup, a project, upload of owned images, manual text/layout edits, persisted draft state, final raster preview, and an ordered JPEG export. A user can close/reopen the browser and continue. No external provider key is needed.

The architecture should establish only the foundation needed for this vertical slice: validated documents, actual storage/database persistence, trusted rendering, a small original layout set, and basic automated checks. It should not include fake connected accounts, mocked analytics presented as live, billing scaffolding, a complex template marketplace, or an unattended scheduler.

Gate: clean-start evidence, manual workflow screenshots, storage/reload test, render/export inspection, basic authentication/secret hygiene, and a passing repository test baseline. The eventual chapter will specify the exact repository paths, commands, and scope; this section does not.

### Early provider qualification — before committing to publishing UX

A separately authorized, bounded investigation should validate the first publishing candidate's essential fit before the project invests heavily in provider-specific screens. It may use a small harness and owned test photos once appropriate infrastructure exists. It is not permission to build all bridge integrations or publish to a real account without approval.

Gate: current pricing/terms recorded, account connection path understood, native photo route demonstrated under authorization, required settings identified, retention/idempotency limits recorded, and remaining live tests clearly marked pending. Failure changes the provider decision, not the product's core purpose.

### v0.2.0 — Owned library plus the fixed visual providers

Outcome: the local library supports collections, provenance, controlled imports, duplicate awareness, and useful failure states. ScrapeCreators search works through a server-only key. A small tested fal.ai catalog supports image generation, accepted-output import, saved provider request IDs, bounded costs, and selective retry.

This milestone may be split into separate library/search and image-generation chapters to remain manageable. Neither the roadmap nor a partly completed adapter authorizes a large batch of paid tests.

Gate: local/mock tests for failures and secret isolation, plus E3 qualification for each advertised external feature. The selected model's actual result must be durable and usable in a slide after the original provider URL is no longer the source of truth. Revoking keys leaves local editing functional.

### v0.3.0 — Reusable recipes and optional copy assistance

Outcome: versioned recipes, hooks, role-based visual pools, CTA controls, structured text generation, locked fields, selective regeneration, richer editor controls, and an original starter kit produce repeatable editable drafts. Manual copy remains first-class.

Do not use this checkpoint to build a general-purpose design suite. A few excellent layouts with clear narrative roles are more valuable than a large untested gallery. The first text adapter needs schema/usage/error tests and an explicitly approved paid test where required.

Gate: generated content validates, user edits survive, overflow is visible, supplied product facts are preserved, original templates have provenance, recipe import cannot execute code, and preview/export consistency passes the supported corpus.

### v0.4.0 — One qualified TikTok connection and honest delivery

Outcome: one selected bridge supports user-owned credentials, actual account selection, creator-aware review, an immutable approval event, native photo direct publishing when qualified, optional inbox handoff when qualified, status reconciliation, and meaningful failures. Export remains available throughout.

A connection badge and successful HTTP response are not completion. Do not label inbox handoff as public publication. Required privacy/disclosure support must work on the actual photo route. Unsupported account/media combinations remain explicitly disabled.

Gate: relevant PQ tests from [provider qualification](03_PROVIDERS_AND_PUBLISHING.md) pass at their required evidence level, including an authorized native-photo result and required controls. If live access is unavailable, the implementation can be accepted as a mock-tested adapter prototype, but this milestone's live-publishing claim remains blocked.

### v0.5.0 — Scheduling that survives realistic failures

Outcome: Planner list/calendar, local versus remote authority, exact time-zone handling, provider media-retention windows, approved future posts, cancellation/readback, missed-slot policy, reconnection holds, and crash-safe reconciliation.

Long-range local plans are clearly distinct from confirmed provider schedules. A stopped local worker cannot be presented as continuously available. Provider idempotency windows and response-loss recovery are tested explicitly rather than assuming a unique local job ID solves the problem.

Gate: E4 restart/scheduled-delivery evidence, cancellation evidence, retention-window tests, DST fixtures, past-time rejection, duplicate-prevention/uncertain-state tests, and no accidental catch-up burst. Tests requiring real elapsed time remain pending until actually observed.

### v0.6.0 — Recurring draft production and review queues

Outcome: a series creates a bounded lookahead of drafts using versioned briefs/recipes, curated visual pools, hook reuse policies, budgets, and deterministic slots. Batch review and individually approved delivery work together. Pause controls distinguish generation from existing remote schedules.

This is supervised automation. Future unseen content is not preapproved. Any proposal to introduce fully unattended publication requires an additional route-policy decision and separate acceptance gates, not a renamed toggle.

Gate: pool exhaustion, partial generation, budget races, repeated failures, missed slots, lock preservation, duplicate slot prevention, and pause/cancel differences pass. A full run can be explained from stored inputs through the review event.

### v0.7.0 — Useful results and a narrow automation API

Outcome: available post/account metrics, source freshness, sensible recipe/hook comparisons, exportable results, and a scoped public API for the supported draft/job workflow. Agents can prepare content without bypassing review or spending controls.

Do not fake metrics to fill a chart. Do not add an autonomous optimization loop that changes budgets or publishes experiments. An MCP layer may follow only if it reuses the same stable command contracts.

Gate: missing metrics are not zero, source timestamps are recorded, external-token scopes are enforced, idempotent app commands behave correctly, and the API cannot mint publication consent from an untrusted boolean.

### v0.8.0 — Portability and operational hardening

Outcome: versioned project/recipe import-export, credential-free portable packages, tested backup/restore, upgrade instructions, safe restored-state reconciliation, and an optional durable-storage adapter only if justified by actual schedule needs. A second publishing adapter is optional, not a prerequisite for calling the first one reliable.

Trusted team roles may be proposed after the single-operator core is sound, but public multi-tenant hosting is not implied. Keep the support boundary explicit.

Gate: restore into a fresh isolated installation, asset-integrity validation, no automatic publication on import/restore, migration tests, secret-free support bundles, and documented recovery from lost/revoked keys.

### v0.9.0 — Community beta with a truthful support matrix

Outcome: clean installation tested by someone other than the implementer, accessible main journeys, coherent original design, example content with redistribution rights, contribution/security docs, release packaging, and an honest provider/host compatibility matrix.

Measure usability and resource consumption on named environments. Fix confusing setup and misleading statuses rather than adding more features. Clearly mark experimental extensions and known provider restrictions.

Gate: no unresolved release-blocking security/publication bugs, critical test suite passes, documentation matches the release, and qualified capabilities can be reproduced. Any live provider regression is visible in release notes and feature availability.

### v1.0.0 — Stable original slideshow product

Outcome: the mature single-operator core described in the North Star is complete, documented, portable, and supported at the declared level. Users can create manually, add their own visual/copy providers, review exact outputs, publish through at least one qualified route, run supervised recurring production, understand costs, and recover their content.

Version 1.0 does not claim unrestricted TikTok access, guaranteed virality, every provider/model, public multi-tenancy, or the adjacent UGC/video lane. Those remain explicitly scoped extensions. A reduction in mature core scope requires Kyle's approval, not a quiet edit to the checklist.

### Extension chapters after the core proves itself

Possible extensions include richer fal.ai video/UGC production, licensed audio and narration, trusted-team collaboration, a second publishing adapter, additional social platforms, advanced storage/deployment modes, content-language expansion, and a desktop wrapper. Each needs its own rationale, rights/policy analysis, cost model, acceptance tests, and bounded implementation brief.

## 4. Acceptance test catalog

The following cases are proposed tests, not test results. Implementers may group related cases, but IDs and outcomes remain traceable. References point to requirements in the product, architecture, provider, and security chapters. Test fixtures must be original or appropriately licensed.

### Foundation, manual workflow, and original UX

| Test | Requirement references | Expected evidence/outcome |
|---|---|---|
| AT-001 | PRD-001, OPS-002 | Fresh installation creates an owner without a default public password. |
| AT-002 | PRD-002 | A seven-slide manual deck exports with every provider disabled. |
| AT-003 | PRD-004, ARC-004 | Project/draft persist across browser refresh and process restart. |
| AT-004 | PRD-003, ARC-017 | Content locale, interface locale, and schedule zone remain separate. |
| AT-005 | PRD-005, ARC-006 | Updating a brief does not rewrite an existing immutable draft. |
| AT-006 | PRD-009 | Returning to an earlier creative step preserves unrelated work. |
| AT-007 | PRD-028 | Starter recipes and demo assets have original/redistributable provenance. |
| AT-008 | PRD-029, PRD-052 | Add/reorder/delete slides works without drag-only interaction. |
| AT-009 | PRD-034 | Two tabs editing the same draft trigger a conflict, not silent overwrite. |
| AT-010 | PRD-053 | Empty/loading/error states provide a useful next action and preserve input. |

### Library, search, and importing

| Test | Requirement references | Expected evidence/outcome |
|---|---|---|
| AT-011 | PRD-010, ARC-008 | Accepted assets load from owned storage after source URL failure. |
| AT-012 | PRD-011, PRD-012 | A Pinterest result begins with unknown reuse rights and visible source. |
| AT-013 | PRD-012, INT-003 | Search sends `query` and preserves the returned opaque cursor. |
| AT-014 | PRD-013 | Typing does not trigger one paid request per keystroke. |
| AT-015 | PRD-013, INT-004 | Failed later pagination preserves prior results and reports usage honestly. |
| AT-016 | PRD-014, PRD-058 | Role pools select eligible assets and explain exhaustion/reuse. |
| AT-017 | PRD-015, SEC-008 | MIME-spoofed or corrupt input is rejected before acceptance. |
| AT-018 | PRD-015, SEC-007 | Private/loopback/metadata URL and unsafe redirect imports are blocked. |
| AT-019 | SEC-007 | DNS/IPv6/redirect edge cases do not bypass URL safety controls. |
| AT-020 | PRD-016 | Exact duplicates do not erase distinct provenance records. |
| AT-021 | PRD-017 | Batch owned-image uploads report per-file failures without losing successes. |
| AT-022 | PRD-057 | Rights revocation blocks pending local use and identifies remote schedules. |
| AT-023 | ARC-008, OPS-003 | Orphan staging cleanup does not delete referenced accepted assets. |
| AT-024 | PRD-010, SEC-003 | Unauthorized asset/thumbnail IDs do not reveal media. |

### fal.ai, writing, recipes, and costs

| Test | Requirement references | Expected evidence/outcome |
|---|---|---|
| AT-025 | PRD-018, INT-005 | Each exposed fal.ai preset has a tested schema/capability record. |
| AT-026 | PRD-019 | Unsupported reference-image controls are not exposed as functional. |
| AT-027 | PRD-020 | Regenerating one image leaves unrelated images and text unchanged. |
| AT-028 | PRD-021, ARC-011 | Restart resumes a saved provider request rather than submitting again. |
| AT-029 | PRD-021, ARC-012 | Queue completion with an error result is not marked image success. |
| AT-030 | PRD-021 | Cancellation requested is distinct from remote cancellation confirmed. |
| AT-031 | PRD-022, INT-006 | Output is imported before configured expiry and records provenance. |
| AT-032 | INT-006, SEC-006 | Private media behavior is qualified for the actual model/CDN path. |
| AT-033 | PRD-023, INT-008 | Malformed structured copy is rejected or boundedly repaired. |
| AT-034 | PRD-024 | Locked manual copy is unchanged by a partial rewrite. |
| AT-035 | PRD-025 | Unsupported claims are flagged; no fabricated source citation is invented. |
| AT-036 | PRD-026 | Supported non-English text renders without unreported overflow. |
| AT-037 | PRD-027, SEC-009 | Imported recipe cannot execute script or load arbitrary remote code. |
| AT-038 | PRD-007, PRD-008 | Hook/CTA choice does not regenerate unrelated paid imagery. |
| AT-039 | PRD-046, ARC-020 | Concurrent jobs cannot each spend the same reserved budget. |
| AT-040 | ARC-020, SEC-012 | Unknown provider cost stays unknown/reserved rather than becoming zero. |
| AT-041 | ARC-011, ARC-013 | Ambiguous image submission is held/reconciled, not blindly duplicated. |
| AT-042 | SEC-010 | Malicious source text cannot request secrets, tools, or approval actions. |

### Editing, rendering, and export

| Test | Requirement references | Expected evidence/outcome |
|---|---|---|
| AT-043 | PRD-030 | Presets produce declared dimensions without image stretching. |
| AT-044 | PRD-031 | Overflow warns instead of silently shrinking below readable limits. |
| AT-045 | PRD-031, ARC-018 | Missing fonts fail explicitly; final capture waits for fonts/images. |
| AT-046 | PRD-032 | Crop/focal point is nondestructive and matches final output. |
| AT-047 | PRD-033 | Mixed hook/body/CTA and simple collages remain valid and editable. |
| AT-048 | PRD-034 | Autosave failure remains visible and allows recovery of edits. |
| AT-049 | PRD-035 | ZIP contains ordered media, title/caption, and the correct manifest. |
| AT-050 | PRD-036, ARC-019 | Approved preview hashes match delivered/exported media hashes. |
| AT-051 | ARC-018, SEC-009 | Renderer has no arbitrary network/template execution or secret access. |
| AT-052 | PRD-055, ARC-019 | MP4 montage is labeled video and has a distinct artifact/approval. |
| AT-053 | PRD-052 | Main editor/review actions have keyboard focus and labels. |
| AT-054 | ARC-007 | Invalid coordinates, nonfinite numbers, and unknown versions are rejected. |

### Account connection and publication

| Test | Requirement references | Expected evidence/outcome |
|---|---|---|
| AT-055 | PRD-037, INT-010 | Connected account identity comes from verified server-side data. |
| AT-056 | PRD-043 | Multiple accounts require explicit selection; no publish-to-all default. |
| AT-057 | PRD-038, INT-011 | Photo composer uses fresh photo-specific capability results. |
| AT-058 | PRD-038 | Privacy is not silently preselected as public. |
| AT-059 | PRD-039, ARC-014 | Real approval creates a fingerprint covering exact content and settings. |
| AT-060 | PRD-039, INT-020 | Required AI/commercial disclosure is verified on the actual photo route. |
| AT-061 | PRD-040, INT-015 | Inbox delivery cannot be reported as public publication. |
| AT-062 | INT-015 | HTTP 207/2xx platform failures are normalized as failures, not success. |
| AT-063 | ARC-014 | Unapproved or stale-fingerprint publication is blocked server-side. |
| AT-064 | ARC-015 | Editing a remote-scheduled deck does not silently mutate or duplicate it. |
| AT-065 | INT-014 | Safe replay uses the persisted original ID/payload and handles existing-post shape. |
| AT-066 | INT-014 | Retry outside provider replay window reconciles or stays uncertain. |
| AT-067 | ARC-011 | Crash after external acceptance does not cause an automatic second post. |
| AT-068 | PRD-040 | Delayed public URL does not create a false failure or fake link. |
| AT-069 | PRD-043 | Reconnection with changed account ID does not remap by username alone. |
| AT-070 | INT-017 | An alternative adapter does not confuse correlation IDs with idempotency. |
| AT-071 | INT-017 | Direct-post intent does not silently fall back to inbox. |
| AT-072 | INT-019, NS-F09 | No official TikTok developer-app or Content Posting API path is exposed; publishing uses a qualified bridge or export/handoff. |

### Scheduling and recurring production

| Test | Requirement references | Expected evidence/outcome |
|---|---|---|
| AT-073 | PRD-041, ARC-016 | Local plan and confirmed provider schedule show distinct responsibility. |
| AT-074 | INT-012 | Media expiry and safety buffer constrain remote scheduling. |
| AT-075 | INT-013, ARC-017 | Past scheduled time is blocked instead of accidentally posting immediately. |
| AT-076 | ARC-017 | DST missing/repeated times follow the displayed policy. |
| AT-077 | ARC-016 | Lost remote handoff response is reconciled before local dispatch. |
| AT-078 | PRD-042 | Pausing generation does not claim to cancel remote schedules. |
| AT-079 | PRD-042, ARC-015 | Too-late cancellation is reported honestly, with no assumed retraction. |
| AT-080 | PRD-044, ARC-021 | Series lookahead is bounded and slots are unique after restart. |
| AT-081 | PRD-044 | Exhausted assets, keys, or budget stop/hold the series visibly. |
| AT-082 | PRD-045, INT-020 | Unseen future drafts cannot inherit an old blanket publication approval. |
| AT-083 | PRD-058 | Stored inputs reproduce the selected recipe/pool/hook choices. |
| AT-084 | ARC-017 | Restart after missed slots does not publish a catch-up burst. |
| AT-085 | SEC-013 | Duplicate/out-of-order callbacks cannot regress state or duplicate work. |
| AT-086 | OPS-001, INT-012 | Remote-owned scheduled delivery is exercised with local worker stopped. |

### Metrics, API, portability, and operations

| Test | Requirement references | Expected evidence/outcome |
|---|---|---|
| AT-087 | PRD-047, INT-016 | Unavailable metrics are distinguished from measured zeroes. |
| AT-088 | PRD-047 | Metric collection/source timestamps and identity remain traceable. |
| AT-089 | PRD-048 | Comparisons disclose sample sizes and do not alter production automatically. |
| AT-090 | PRD-049, ARC-022 | Read-only API token cannot spend credits or publish. |
| AT-091 | PRD-049 | Draft-writing token cannot manufacture a review approval. |
| AT-092 | PRD-050 | Editable project round-trip preserves assets/order/styles without keys. |
| AT-093 | PRD-050, SEC-008 | Malicious ZIP paths and oversized expansion are rejected. |
| AT-094 | PRD-050, OPS-005 | Imported/restored schedules remain paused pending reconciliation. |
| AT-095 | SEC-004 | Browser bundle/network/error/log/export scans find no provider secret. |
| AT-096 | SEC-005 | Key rotation/removal preserves local content and accepted external IDs. |
| AT-097 | SEC-001, SEC-002 | Owner setup, sessions, origin checks, and default binding are safe. |
| AT-098 | OPS-004 | Fresh restore validates database records and media hashes. |
| AT-099 | OPS-005 | Older-backup restore does not replay post-backup external side effects. |
| AT-100 | OPS-006, ARC-024 | Upgrade/rollback or forward repair is documented and exercised. |
| AT-101 | OPS-003, ARC-023 | Web-up/worker-down and low-disk cases are visible and actionable. |
| AT-102 | OPS-008 | Support bundle and public issue fixtures are sanitized. |
| AT-103 | OPS-007, PRD-051 | Release assets/dependencies have license/provenance records. |
| AT-104 | PRD-056, SEC-003 | Any shipped collaboration roles enforce access at server boundaries. |
| AT-105 | PRD-054 | Video/UGC extension is not advertised as shipped from a placeholder button. |
| AT-106 | PRD-002, INT-001 | Provider outage or subscription loss leaves local editor/export useful. |
| AT-107 | OPS-002 | A new tester follows release install docs without hidden infrastructure steps. |
| AT-108 | ARC-013, SEC-012 | Repeated errors stop within retry/cost limits and show a recovery action. |

## 5. Acceptance is stricter than “tests green”

Every checkpoint handoff records the base and head commit, changed files, requirement IDs, commands and exit codes, test environment, exact evidence paths, mock/live distinctions, known defects, skipped checks, schema/dependency changes, and scope deviations. Unrun checks remain unrun. Failing tests must not be deleted or weakened simply to obtain a green result.

The architect reviews implementation and evidence together. A visually polished UI can still fail because it stores keys in the browser. Correct backend behavior can still fail because users cannot tell a local plan from a provider schedule. Both are product defects.

Acceptance can be `accepted`, `changes_required`, `blocked`, or `accepted_with_nonblocking_notes`. Notes cannot hide a security, consent, data-loss, unauthorized-spend, or publication-state blocker. An accepted partial adapter must be labeled with its actual scope rather than quietly counted as full live integration.

## 6. Definition of done for any chapter

The approved outcome works in its declared environment. Requirements are traceable to implementation and evidence. Existing supported workflows still pass. Secrets and private data are absent from committed artifacts. New persistence has a migration strategy. New external actions have bounded retries, budgets, and authorization. Documentation and state files match reality. Any unresolved limitation is explicit. Luna stops and provides the handoff rather than starting the next milestone.

For a user-facing chapter, include screenshots or a recording of the actual implemented workflow with sensitive information removed, plus representative output files where safe. For a provider chapter, include sanitized request/response shapes and actual route/account evidence at the authorized level. For an operational chapter, include restore/restart results, not only unit tests.

## 7. Blocking defects

Block the relevant release for credential leakage, unauthorized publication, false public-post status, duplicate-prone blind retry, silent privacy/disclosure degradation, unbounded spend, arbitrary template execution, unsafe URL import, unexplained data loss, broken backup restoration, or evidence fabricated from mocks. Also block an advertised capability whose live prerequisite is still unverified.

A blocked checkpoint is useful information. It tells us what the next bounded repair or qualification chapter must solve. It is not a reason to conceal uncertainty or declare the entire project impossible.
