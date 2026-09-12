# CH-001R-r6 — Hosted Chromium sandbox qualification

**Authority:** architect follow-up to the actual T5 hosted outcome, not a new product chapter.

**Current decision:** the r5 directory-initialization repair is substantiated for its bounded scope. The live application proof is still blocked. `application_acceptance=false`; root `awaiting_review`; accepted application version `none`; target `0.1.0`.

## The assignment in one paragraph

Keep the T5 evidence-directory fix and the working native pnpm bootstrap. On the existing manually dispatched GitHub-hosted Ubuntu runner, qualify the pinned Playwright browser with its sandbox enabled. Prefer a narrowly attached, temporary AppArmor user-namespace exception for the exact managed browser executable, after collecting the relevant host facts. Do not disable Chromium's sandbox, disable AppArmor globally, loosen Docker isolation, replace the browser with a system channel, or alter application dependencies. Run the existing bounded proof once on a new implementation commit. Preserve the actual outcome and return for review, even when that outcome is a new downstream blocker.

## Read order

1. [Review decision and evidence](01_REVIEW_VERDICT.md).
2. [Luna MAX implementation assignment](02_LUNA_ASSIGNMENT.md).
3. [Regression, runtime, and evidence requirements](03_TESTS_AND_EVIDENCE.md).
4. [Router publication and dispatch rules](04_ROUTER_HANDOFF.md).
5. [Pinned identities and primary sources](05_SOURCES_AND_IDENTITIES.md).

Use [START_PROMPT.md](START_PROMPT.md) as the dispatch prompt. The [handoff template](templates/CH-001R-r6_HANDOFF.md) and [r6 checklist](templates/r6-checklist.template.json) are blank templates, not test results. The original 72 CH001 gate definitions remain authoritative and unchanged.

## What this packet is not

It is not proof of a repaired sandbox, a runnable application, a passing export, or v0.1 acceptance. No new workflow was dispatched by the packet author. No repository content was changed by the packet author. The attached historical archive is evidence from T5, not T6.

The public artifact's internal labels still use `r4-34671716094-1` and a legacy r3 coordinator profile. Those labels are inherited names. Its actual checkout is T5 and its Actions run is 34671716094; do not confuse it with the earlier T4 run.

## Required return

Luna returns a tested implementation commit T6 and an evidence-only commit E6, plus actual commands, report hashes, and remaining limitations. The router verifies publication and initiates at most one new approved hosted dispatch with T6. The next architect review judges the result; neither Luna nor the router self-accepts the application.

A green bounded proof remains a prerequisite for a later acceptance review. It does not replace the strict 72-gate contract or close the original R01–R11 findings automatically.

## Packet validation

[PACK_VALIDATION.json](PACK_VALIDATION.json) records document and historical-artifact checks only. Reproduce them with `python scripts/validate_pack.py`. No application test, sandbox-policy execution, or workflow dispatch is implied.
