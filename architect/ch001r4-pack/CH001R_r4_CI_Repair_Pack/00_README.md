# CH-001R-r4 — CI bootstrap repair and bounded live-proof redispatch

**Packet status: COMPLETE — ready for the router to save and launch Luna MAX.**

This is an architect-authored instruction packet, not an implementation, dispatch, test pass, or application acceptance. It responds to the failed first hosted run, not to the earlier resolved push restriction.

| Control | Value |
|---|---|
| Repository | `klole/reel-farm` |
| Target product version | `0.1.0` — still unaccepted |
| New bounded assignment | `CH-001R-r4` |
| Reviewed implementation T3 | `0b79ed07a25a618ab4da2bf56a2fed6047398cb5` |
| Reviewed evidence E3 / observed main | `4cf020317cfc2e8755f35ee6da10f7397c8676f2` |
| Failed hosted run / attempt | `34665615514` / `1` |
| Failed job | `103476773609` (`live-proof`) |
| Existing North Star | NS-0.2; SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d` |
| Current architect decision | `CI_BOOTSTRAP_REPAIR_REQUIRED` |
| Root state / accepted version | `awaiting_review` / `none` |
| Who implements | Luna, highest available / MAX effort |
| Who publishes workflow changes and dispatches | Kyle's authorized router/workflow-capable GitHub path |

## The objective

Replace the broken Corepack-mediated pnpm launch in the hosted runner **and** Docker build/runtime path; repair summary quoting and failure classification; generate useful sanitized evidence even before project installation succeeds; then run the existing bounded proof against the exact newly committed implementation.

Do not redesign the application. Do not reopen the earlier broad repair assignment. Do not require all 72 mature checkpoint gates to pass merely to report progress on this narrow CI repair. Equally, do not interpret a green bounded proof as v0.1 acceptance.

## Reading order

Read [the review](01_ARCHITECT_REVIEW.md), [the Luna assignment](02_LUNA_MAX_ASSIGNMENT.md), [the CI acceptance/evidence contract](04_ACCEPTANCE_AND_EVIDENCE.md), and [the handoff template](05_HANDOFF_TEMPLATE.md). The router uses [the dispatch runbook](03_ROUTER_DISPATCH_RUNBOOK.md). [Sources](06_SOURCES.md) distinguish inspected repository material, upstream documentation, and untested implementation proposals.

`reference/REVIEWED_RUN.json` is an architect record of the failed historical run. `reference/FAILED_RUN_DISPATCH.txt` is the exact text extracted from its artifact. Neither is new application proof. `reference/PNPM_NATIVE_RELEASE_PINS.json` provides researched release metadata; its native binaries have not been executed by the architect.

## What changed since the previous request

T3 and E3 are published. The workflow was dispatched with T3 and checked out T3 successfully. The blocking stage is now package-manager startup, not workflow authorization. Run metadata having E3 as its head while source checkout is T3 is expected here; both identities must remain explicit.

The editing box still lacks workflow-write scope. That is an execution-role constraint, not authorization to move a credential onto that box or to create a different publishing route. Preserve the working router boundary.

## Non-negotiable scope

No fal.ai, ScrapeCreators, Pinterest, TikTok, publishing, scheduling, analytics, billing, video, public deployment, releases, or v0.2 work. No new credentials. No insecure browser flags. No weakening the original 72-gate contract, strict verifier, or evidence requirements. No force push or history rewrite.

## Expected outputs

Luna supplies a small reviewed diff, actual local check results, a new implementation commit T4, and a subsequent evidence/documentation commit E4. The router publishes the preserved commits and performs one deliberate fresh workflow dispatch with T4. A run receipt and downloaded artifact are returned for architect review. If the live proof then exposes an application defect, capture it and stop at that boundary rather than growing this assignment into an application rewrite.
