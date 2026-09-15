# CH-001R-r10-D1 — Router migration reproduction

**Assignment owner:** the existing workflow-capable router, not a new Luna implementation chapter.  
**Target:** Open Slideshow Studio v0.1.0.  
**Decision:** proceed to controlled evidence collection; no application or migration acceptance.  
**Reviewed T10:** `ec7cc08d6ed229af9780318858d8051202851746`.  
**Reviewed E10:** `f512c9c02620ea600404cd304782a37e6689a109`.

R10 delivered a diagnostic implementation and a host-only import failure. It did not repair or run the migration in the final Docker image. The next useful step is to obtain that runtime evidence, not send Luna back to the same Docker-less editing environment with another speculative application assignment.

## Read and execute

Read [the review](01_REVIEW.md), then [the router execution instructions](02_ROUTER_EXECUTION.md). Use [the receipt specification](03_RECEIPT_AND_STOP.md) and [the JSON template](router-receipt.template.json) to return actual results. [Source references](04_SOURCES.md) distinguish repository evidence from external command documentation.

Select one route:

- **Route A, preferred:** migration-only reproduction on an existing capable local Docker host. No browser launch, AppArmor change, workflow dispatch, or application UI journey.
- **Route B, conditional fallback:** one manually elected, fresh run of the existing T10 hosted workflow when Route A cannot supply a capable environment. This consumes the existing r10 one-request allowance; it is not an additional retry budget.

These routes are mutually exclusive for this assignment. Do not dispatch after Route A has produced useful failure/success evidence. Return that evidence for architect review. If neither route can run safely, return an environment-blocked receipt.

## Scope and authority

This packet clarifies router execution and supersedes the command recipe in `docs/evidence/CH-001R-r10/router-reproduction.md` where they differ. It does not authorize an application edit, a new dependency, a migration SQL change, a worker/security change, a new workflow, or a new product chapter.

The executable assignment committed at P10 is the historical authority for judging Luna's r10 work. Conversation-local variants of the older packet are not retroactive permission to change dependencies. This D1 continuation does not retrospectively fault Luna for choosing its explicitly allowed diagnostic-only mode.

Keep `application_acceptance=false`, accepted version `none`, and root `awaiting_review`. Do not replace the original 72-gate ledger with a diagnostic checklist. Historical hosted runs and artifacts remain immutable.

The architect performed read-only source/handoff review and created this packet. No Docker command, application test, migration, hosted dispatch, or sandbox change was executed by the architect in this review. Delivery here is not a send to an external router or Luna session.
