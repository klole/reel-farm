# CH-001R-r3 — Runner bootstrap and first live proof

**For Kyle and Luna MAX.** Prepared September 11, 2026. This is the next bounded assignment, not an application acceptance or release.

| Control | Value |
|---|---|
| Project | Open Slideshow Studio, repository `klole/reel-farm` |
| Reviewed implementation T | `b516dab843be1b8870d3516185b52905982aec1f` |
| Reviewed evidence E | `5a931feb01ed8da16eb9f0079a380c61f5459792` |
| Prior repair starting commit | `c05ac9c8753fc4237188f9f8b5c5b7250a5fce78` |
| Submitted result | `BLOCKED`; 4 reported source-only PASS / 0 FAIL / 68 NOT_RUN |
| Parent application contract | CH-001-r1, target v0.1.0, 72 original gates |
| New assignment | CH-001R-r3: runner bootstrap + first live proof |
| Accepted application version | None |
| Review method | Connected GitHub reads at identified commits; no application execution by this packet's author |

## Read this first

Do not send Luna back to the same incapable host with another instruction to make all 72 gates green. Establish a capable execution route, fix the concrete bootstrap/test/reporting defects, and obtain the first real application-generated export. Return that evidence for review before another broad feature or hardening pass.

The narrower **next assignment** does not narrow the **v0.1 acceptance contract**. All 72 original gates remain mandatory for eventual acceptance. A successful live-proof job means only that this specified intermediate journey worked. It must not make the full acceptance command green while required evidence is missing.

## Packet navigation

- [Architect review](01_ARCHITECT_REVIEW.md): what the supplied evidence establishes and the new source findings.
- [Luna assignment](02_LUNA_ASSIGNMENT.md): bounded work, order of execution, and stop rules.
- [Runner and dispatch](03_RUNNER_AND_DISPATCH.md): recommended GitHub Actions route, local fallback, and operator instructions.
- [Evidence rules](04_EVIDENCE_PROTOCOL.md): identities, reports, partial gate results, artifacts, and verification semantics.
- [All 72 parent gates](05_PARENT_GATE_COVERAGE.md): unchanged requirements, prior reported status, and next-phase focus.
- [Handoff template](06_HANDOFF_TEMPLATE.md): exact result to return.
- [Sources](07_SOURCES.md): repository locations and official technical references.
- [Starting prompt](LUNA_START_PROMPT.md): paste into Luna with this packet.
- [Workflow blueprint](workflow/ch001-live-proof.yml.example): a design template; Luna must implement its new command and pin action references before activation.
- [Original gate template](reference/gate-results.template.json): unchanged, unexecuted reference, not new results.

## What should change for Kyle

The next useful result is a run link plus screenshots, seven real JPEGs inside a ZIP, and matching hashes. If Luna cannot trigger GitHub Actions, it should return a prepared workflow and one exact dispatch instruction—not claim that missing local Docker prevents all further work.

No changes were pushed, no workflow was dispatched, and no paid infrastructure was provisioned by this review. The included workflow has not been run against this application.
