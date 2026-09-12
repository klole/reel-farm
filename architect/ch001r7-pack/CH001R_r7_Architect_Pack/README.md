# CH-001R-r7 — Workflow validation and dispatch repair

**Authority:** architect continuation of CH-001. **Target:** v0.1.0, not a new feature chapter.

**Decision:** repair required at the workflow-definition boundary. Keep `application_acceptance=false`, accepted application version `none`, and root state `awaiting_review`.

This packet follows the published T6/E6 submission. The router reports rejection of a manual dispatch before a runner started. Inspection found `runner.temp` in job-level `env`, where GitHub does not allow the `runner` context. The next repair is small: move that path resolution to a supported runtime location and add real pre-publication workflow validation. Do not redesign the sandbox solution or restart the application build.

## Reading order

1. [Review and evidence boundaries](01_REVIEW_VERDICT.md).
2. [Luna MAX implementation assignment](02_LUNA_IMPLEMENTATION.md).
3. [Required validation and regression cases](03_VALIDATION_CONTRACT.md).
4. [Router publication and one-dispatch protocol](04_ROUTER_PROTOCOL.md).
5. [Handoff template](05_HANDOFF_TEMPLATE.md).
6. [Primary sources and exact references](06_SOURCE_INDEX.md).

The [starting prompt](LUNA_START_PROMPT.md) is ready to transfer. The examples are reference fixtures, not an implementation of the application or a replacement for the full workflow. The [reference diagnostic report](evidence/reference-snippet-results.json) records only isolated shell checks executed by the architect.

## Outcomes that remain distinct

| Outcome | Meaning |
|---|---|
| Workflow static validation passes | The selected validator accepts the inspected file; this is not GitHub dispatch or browser evidence. |
| Dispatch accepted | GitHub accepts a new request; execution must still be identified and observed. |
| Host sandbox qualifies | The exact pinned host browser completes the required effective-sandbox checks. |
| Worker/application bounded proof succeeds | The existing bounded journey produced actual evidence. |
| v0.1 architect acceptance | A later separate decision against the original acceptance contract. |

A later stage cannot inherit a PASS from an earlier one. This packet authorizes preparation of T7/E7 and, after the router prerequisites pass, at most one fresh T7 manual dispatch with explicit sandbox opt-in. It does not authorize rerunning T3, T4, T5, unchanged T6, or the invalid-workflow record.

## Packet limits

No repository write, publication, dispatch, privileged policy change, or application test was performed by the architect for this packet. GitHub reads and source/reference inspection were performed. Nine included reference-shell checks ran successfully. The `actionlint` binary could not be obtained in the architect runtime, so neither the full T6 workflow nor a full patched workflow was executed through actionlint here. Luna/router must perform that check rather than inheriting a fabricated validation result.
