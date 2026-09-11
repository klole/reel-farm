# CH-001 review and follow-up — CH-001R-r2

**Product checkpoint:** v0.1.0, still unaccepted.  
**Architect verdict:** REPAIR_REQUIRED — implementation and verification continuation, not a new feature chapter.  
**Execution setting for Luna:** MAX / highest available reasoning effort. Set this in Luna's interface; prompt wording alone does not change a model setting.

This packet reviews the original CH-001 submission at implementation `bdd6540` and evidence `ad0dd5f`. Those are the same commits submitted previously, not a subsequent successful repair run. No live gate pass is inferred.

The next authorized work is to make the existing manual slideshow foundation demonstrably work: real test harnesses, a working reference environment, narrowly scoped code repairs, and reviewable evidence. Do not rebuild the product or proceed to v0.2.

## Dispatch

Attach this packet to Luna in the existing repository and paste [LUNA_START_PROMPT.md](LUNA_START_PROMPT.md). Read [01_REVIEW_VERDICT.md](01_REVIEW_VERDICT.md) for the decision; [02_LUNA_CH001R2_BRIEF.md](02_LUNA_CH001R2_BRIEF.md) is the actual assignment.

Supporting files:

- [03_GATE_COVERAGE_AND_EVIDENCE.md](03_GATE_COVERAGE_AND_EVIDENCE.md): evidence rules, suite coverage, and final acceptance semantics.
- [04_ENVIRONMENT_AND_CI.md](04_ENVIRONMENT_AND_CI.md): disposable execution strategy and what to do when the agent host cannot run Docker.
- [05_HANDOFF_AND_REVIEW_PROTOCOL.md](05_HANDOFF_AND_REVIEW_PROTOCOL.md): state updates, precise commits, artifact delivery, and stop conditions.
- [gate-coverage.plan.json](gate-coverage.plan.json): all 72 unchanged original gate requirements with planned coverage, not executed results.
- [reference/ORIGINAL_ACCEPTANCE_TESTS.md](reference/ORIGINAL_ACCEPTANCE_TESTS.md): byte-identical copy of the original acceptance contract, including the exact seven-slide demonstration.
- [SOURCES.md](SOURCES.md): pinned repository evidence and official technical references.

The repository's frozen CH-001 packet and North Star remain authoritative for product scope. This r2 follow-up supersedes the earlier `LUNA_CH001R_REPAIR_VERIFICATION.md` repair instructions where they differ. It corrects three important ambiguities: not every gate requires live evidence; a missing Docker host is not the only problem; and a license decision explicitly allowed to remain pending must not be silently finalized.

This is a documentation/review deliverable. Its validation report validates this packet, not the application. No code was pushed, workflow dispatched, provider called, or application test run by the architect in preparing it.
