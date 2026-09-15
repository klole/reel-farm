# CH-001R-r9 — Report-path boundary repair

**Status:** authorized bounded repair, not acceptance. **Target:** Open Slideshow Studio v0.1.0. **Agent:** Luna MAX. **Application acceptance:** false. **Root:** awaiting_review. **Accepted application version:** none.

This packet responds to the completed T8 hosted run `34928718810`, attempt 1. It supersedes r8 only for the next repair and dispatch decision; the North Star, original CH-001 72-gate contract, and historical evidence remain authoritative and unchanged.

## Decision

Repair the caller/helper report-path mismatch, reject invalid report paths before provisioning side effects, and add a regression/rehearsal at the actual workflow-shell boundary. Do not revisit the editor, sandbox design, dependency versions, providers, or publishing. Do not automatically dispatch anything.

Read [the review](01_REVIEW_VERDICT.md), then [the Luna assignment](02_LUNA_ASSIGNMENT.md), [the test/evidence contract](03_ACCEPTANCE_AND_EVIDENCE.md), and [router rules](04_ROUTER_HANDOFF.md). [Sources](05_SOURCES.md) identify the inspected revisions and primary technical documentation. The original hosted artifact and its independent inspection are under `evidence/`.

## Read this distinction before starting

The hosted job started and failed in `actionlint-bootstrap`. It did **not** run the application proof. There is no fresh hosted 72-gate ledger, sandbox success, worker result, or export. Local r8 checks remain historical local evidence, not hosted passes.

The source change should stay small. The significant test requirement is that the rehearsal execute the same source-controlled shell body and use the same raw environment-path forms as the workflow, not a separately assembled sequence that silently substitutes an absolute path.

## Baseline

- P8: `f2d6baa075af14fbe74e836240198a90ea5d4fd1`
- T8: `0144f6c41ae4c6143a2dc46fe22d59d453ce8763`
- E8 / reviewed main: `d04a0a70d890890132041061be87742396c1909e`
- T8 tree: `f16f32465b37439774369ddf002a22063c104088`
- E8 tree: `40b9bc095b139a19e1c42130bf5e43ca15c79cc6`

If the router commits this packet as P9, record its real SHA and verify that its delta from E8 is packet/evidence-only. Never manufacture P9/T9/E9 identifiers. Investigate unrecognized execution-affecting changes before applying this assignment.

## Execution boundaries

Luna implements and verifies locally, records T9 and E9, and stops for router review. The router owns publication and any subsequent manual GitHub request. The narrow conditional allowance for one fresh T9 dispatch is defined in `04_ROUTER_HANDOFF.md`; passing local checks does not itself trigger it. All historical run IDs remain read-only evidence.

The reference diagnostics in this package are **not** repository test passes. They exercised only a proposed path resolver and a focused inspected guard excerpt under Node v22.16.0. Full validation must use the project-pinned Node and actual bootstrap/reporter code.
