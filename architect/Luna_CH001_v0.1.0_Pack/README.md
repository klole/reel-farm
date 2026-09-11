# Luna build packet — CH-001 / v0.1.0

This is the first bounded implementation assignment for Open Slideshow Studio. It converts the approved product direction into a working manual slideshow checkpoint. It is not the full v1.0 build and contains no completed application code.

## For Kyle

Use the complete ZIP with Luna when possible; it includes the North Star source snapshot so the agent does not have to reconstruct the goal from conversation memory. Select MAX/highest available effort in the agent interface and paste [LUNA_START_PROMPT.md](LUNA_START_PROMPT.md). The prompt requests implementation and verification—not another plan.

For a single-document transfer, use [LUNA_CH001_v0.1.0_COMPLETE.md](LUNA_CH001_v0.1.0_COMPLETE.md). It includes the active assignment, acceptance gates, handoff, source notes, and the baseline North Star root as a historical appendix. The ZIP additionally includes the specialist North Star documents and tracking/templates.

Attach the workspace/repository you intend Luna to work in. No repository was supplied to or inspected by the architect when this packet was written; Luna must bind the real starting commit before changing code. A clean workspace is permitted. No paid credentials are needed for this build.

## What the result should be

A private local app where you establish an owner login, create a project, upload images, build/edit a seven-slide carousel, save/reopen it, render the final JPEGs, and download an ordered image pack with its caption and manifest. Real persistence, crop/text fidelity, honest failure states, and preview/export integrity are part of that outcome.

The checkpoint deliberately does not build AI or publishing integrations. Future provider decisions remain ScrapeCreators plus a single fal.ai credential for text/images, with curated model selectors, and qualified publishing bridges rather than our own direct TikTok integration.

## Read order and source roles

1. [ACTIVATION_AND_BASELINE.md](ACTIVATION_AND_BASELINE.md): authority, exact spec hash, stale-state reconciliation, and safe repository preflight.
2. [CHAPTER_BRIEF.md](CHAPTER_BRIEF.md): finite implementation scope, UX, contracts, architecture, failures, and stopping point.
3. [ACCEPTANCE_TESTS.md](ACCEPTANCE_TESTS.md): 72 required behavior checks, fixtures, commands, evidence, and requirement mapping.
4. [HANDOFF_TEMPLATE.md](HANDOFF_TEMPLATE.md): the factual implementation return used for review.

[SOURCE_NOTES.md](SOURCE_NOTES.md) records current technical documentation. [reference/north-star/NORTH_STAR.md](reference/north-star/NORTH_STAR.md) is the frozen NS-0.2 root. [BASELINE_HASHES.json](BASELINE_HASHES.json) fingerprints all 19 baseline source files. [gate-results.template.json](gate-results.template.json) is an unexecuted reporting template, not a passing test report.

Importing under `docs/chapters/CH-001/` keeps links intact without overwriting the repository's root README or AGENTS. Maintain real current project state at the repository root; historical state inside the reference snapshot is not current work authorization. Preserve existing canonical spec paths where they already exist and record the mapping.

## Return for the checkpoint review

Bring back the repository/branch or PR, exact implementation commit, `state/handoffs/CH-001.md`, gate results, screenshots, and sample export evidence. An inaccessible CI attachment is not durable review evidence; use actual accessible paths/attachments and hashes. Luna must stop awaiting review rather than starting the next version.

## Packet validation

Run `python3 tools/validate_packet.py` from this folder. It checks the instruction packet, not an application. Results are written to [PACKET_VALIDATION.md](PACKET_VALIDATION.md) and [PACKET_VALIDATION.json](PACKET_VALIDATION.json). No implementation, application testing, provider qualification, or social publishing is implied by a passing packet validation.
