# CH-001R-r10 Luna handoff — fill from actual execution

## Status

Completion mode: `REPAIR_READY_FOR_ROUTER_REVIEW` / `DIAGNOSTICS_READY_FOR_ROUTER_REPRODUCTION` / `BLOCKED`.

Application acceptance: `false`. Accepted application version: `none`. Root: `awaiting_review`. Target: `0.1.0`.

## Identities

Record baseline, P10 when present, final T10/tree, parent chain, and workflow blob/file hash. Return E10/tree after the evidence-only commit. State whether publication was performed; never infer publication from a local branch name.

## Observed migration cause

Baseline reproduction: executed or NOT_RUN, environment/image/command, actual exit and evidence path.

Inner exception/code: observed value or null. State explicitly whether `@oss/db` resolution was confirmed, disproved, or remains untested. Describe the minimal fix and why it addresses the observed cause. With no reproduction, state “no migration repair claimed.”

## Partial startup behavior

Explain attempt/ownership/readiness state separation; where failed-service logs and stopped-container state are captured; how redaction is tested; what exact resources cleanup may remove; how failure precedence and final manifest ordering work. Link real tests and runtime evidence, not just source files.

## Actual verification

Provide command, environment/evidence class, final implementation SHA, exit, discovered/executed/passed/failed/skipped counts, and evidence path. Keep the following separate:

- host syntax/static/CI checks;
- mocked/fixture coordinator tests;
- real final-image migration fresh/repeat/error checks;
- real partial-startup cleanup/sibling-preservation check;
- any router-owned hosted outcome (otherwise NOT_RUN).

Summarize R10 results without implying application gate completion. Preserve the historical T9 4/0/68 ledger and report any new 72-ID ledger only from that new execution.

## Artifacts

List sanitized migration logs, state snapshots, image facts, SQL/schema observations, cleanup receipts, manifest/digests, checklist, and retrievable artifact. Missing observations stay null/NOT_RUN with reasons.

## Remaining blockers and external actions

State exact runtime limits and the next allowed router action. Declare pushes, downloads, disposable database/container actions, policy mutations, and dispatches actually performed. Hosted request count must be factual. Do not claim nothing external occurred if pinned packages/images were downloaded.

## Scope

Confirm no provider, account authorization, publishing, scheduling, analytics, billing, video, deployment/release, global host-policy relaxation, sandbox bypass, or v0.2 work. Identify every allowed migration/packaging/helper change. Keep acceptance false and stop for router/architect review.
