# CH-001R-r10 — Migration startup diagnosis and repair

**Architect-issued continuation of CH-001, targeting v0.1.0.**

| Control | Value |
|---|---|
| Packet revision | CH-001R-r10 / r1 |
| Application acceptance | `false` |
| Accepted application version | `none` |
| Root project state | `awaiting_review` |
| Implementation scope | Migration startup boundary; failed-startup diagnostics and run-owned cleanup |
| Immediate external action | None: this packet does not dispatch a workflow |
| Conditional router authority | At most one fresh manual T10 dispatch after the checks in `04_ROUTER_HANDOFF.md` |

## Decision

T9 cleared the earlier bootstrap barriers. Its hosted run executed the actionlint stages, all 64 CI helper cases, native pnpm bootstrap, frozen installation, and the host Chromium qualification. The proof then built the application image, started a healthy database, and failed when the migration service exited 1. The web/worker application journey did not follow.

The migration exception itself was **not preserved**. Do not turn the label “compose migrate” into a guessed SQL or module-resolution diagnosis. R10 must obtain that exception, repair only the demonstrated cause, and close the confirmed diagnostic/cleanup gap that hid it.

## Reading and execution order

Read [the verdict](01_REVIEW_VERDICT.md), then [the Luna assignment](02_LUNA_ASSIGNMENT.md), [the evidence contract](03_TEST_EVIDENCE_CONTRACT.md), and [the router boundary](04_ROUTER_HANDOFF.md). Return [the handoff](05_HANDOFF_TEMPLATE.md) and populate [the separate repair checklist](templates/r10-results.template.json) with executed evidence. [Sources](06_SOURCES.md) identify the reviewed revisions and primary technical references.

The original [hosted ZIP](evidence/ch001-live-proof-34937329430-1.zip) is included unchanged. [The independent inspection](evidence/historical-run-inspection.json) binds its digest, identities, file inventory, and the limitations of this review. Selected original reports are included for easy reading; they are historical evidence, not new results.

## Stop conditions

Do not add AI/providers, publishing, scheduling, billing, video, or v0.2 features. Do not change the sandbox policy, disable Chromium sandboxing, relax worker isolation, or replace the database because migration failed. Do not rerun any historical hosted run. A green bounded proof is still not full 72-gate acceptance.

When the editing environment cannot reproduce the migration in the shipped image, complete the diagnostic/cleanup work and return an honest **diagnostic-only** handoff. The router may use its Docker-capable environment, or the one conditionally authorized new T10 run, to obtain the missing evidence. Do not claim the migration is repaired before it has actually run successfully.
