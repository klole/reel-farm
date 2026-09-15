# CH-001R-r13-V1 — Router authorization for one hosted verification

Revision: **r1**. Issued: **2026-09-15T15:06:31Z**.

## Decision

**AUTHORIZE ONE FRESH T13 HOSTED VERIFICATION, subject to the immediate pre-submission checks below.**

Next executor: **the existing router**. Do not spawn Luna for another implementation chapter. This is the execution follow-through of CH-001R-r13, not r14, v0.2, a release, or application acceptance.

The scoped source review found both F13 repair mechanisms present and correctly connected. No additional dispatch-blocking source defect was identified in that review. The relevant live PostgreSQL, image, migration, cleanup, and downstream application obligations remain unverified. [S1–S8]

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
next_actor=router
approved_implementation=6e04b5a5eefe2ef464572da35c88338fa342f525
authorization_scope=one_fresh_T13_workflow_dispatch
```

**This uses the original unspent T13 allowance; it does not create a second allowance.** T11/T12 permissions remain superseded. The T10/D1 request was already consumed and cannot be reused.

## Exact identities

| Item | Canonical value |
|---|---|
| P13 | `34be09f3a211aae01582270708b565b4a7cce539` |
| P13 tree | `634a57f4d33b83e8884abd71fe797a126dedb14b` |
| T13 implementation | `6e04b5a5eefe2ef464572da35c88338fa342f525` |
| T13 tree | `405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8` |
| E13 / main returned during review | `d1ab7226b71e93235a9761f1432b6fb7be198609` |
| E13 tree | `77250fc98f4f3c35c91dec6e418690ddb3451360` |
| Workflow file | `.github/workflows/ch001-live-proof.yml` |
| Workflow blob at T13 and E13 | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Workflow SHA-256, recorded in pinned source evidence | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Preserved lock SHA-256, recorded in source evidence | `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576` |

GitHub returned E13 as the direct child of T13 and T13 as the direct child of P13. P13 directly follows canonical E12 `b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d`. The P13→T13 comparison contains ten implementation files; the T13→E13 comparison contains evidence/handoff/state files only. [S9–S12]

## Read and execute

Read [the architect review](01_REVIEW_VERDICT.md), [router execution instructions](02_ROUTER_EXECUTION.md), and [outcome/receipt rules](03_OUTCOME_AND_RECEIPT.md). Use [the router prompt](ROUTER_START_PROMPT.md) and `router-receipt.template.json`. Source references are in [04_SOURCES.md](04_SOURCES.md).

The author has not submitted a workflow, sent an external message, changed repository files, or accepted the application. Pack delivery in this conversation is not workflow submission.
