# CH-001R-r12 — Pre-dispatch migration-proof repair

Packet revision: **r1**. Target application: **v0.1.0**, still unaccepted.
Architect review recorded: **2026-09-15T10:58:40Z**.

## Decision

**HOLD the unchanged T11 hosted dispatch. Execute a bounded Luna MAX repair first.**

The root `@oss/db` dependency correction is present and should be preserved. The new migration-first verification code has an unsafe absent-table SQL check and evidence/reporting defects. Spending a hosted request on known source defects is not authorized by this review.

This is a pre-dispatch source review, not a newly failed T11 run. The router reported no T11 dispatch; the API reads described in the review returned no matching manual runs. No application gate was newly executed by the architect.

## Baseline identities

| Item | Identity |
|---|---|
| P11 packet | `10db55ff1f942f3b1894699fea3180b69f4afe27` |
| T11 implementation | `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f` |
| T11 tree | `9b948f6247c1f7804e34bd22cf3c9ae623bde593` |
| E11 evidence | `323947cba4197689f40c9084f38629244d58792f` |
| E11 tree | `441bf4d74319d4a7da1313d0e7675747f0f3432c` |
| Observed `main` after router update | `a7c239c0164ff456448e11684c593153e6fa8240` |
| Workflow blob retained | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Workflow SHA-256 retained | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |

E11 is T11's direct child. The observed main head follows with router handoff documentation; the compare from T11 to that head returned only evidence, handoff, and state changes. Record new actual P12/T12/E12 identities when created; none are invented here.

## Bounded objective

Repair both occurrences of the absent-table SQL probe, select safe container facts before public logging, and ensure the final-image module-import receipt cannot say PASS when the CLI or inspected container evidence does not support it. Add tests at the actual adapter boundaries; retain the original dependency correction and migration-first architecture.

The migration script and application DDL are **not** the subjects of this repair. No redesign, provider, AI, publishing, scheduling, analytics, billing, video, deployment, or next feature chapter is authorized.

## Reading order

Read [the verdict](01_REVIEW_VERDICT.md), [Luna's assignment](02_LUNA_ASSIGNMENT.md), [the verification matrix](03_VERIFICATION_MATRIX.md), and [router authorization](04_ROUTER_HANDOFF.md). Use [the handoff template](05_HANDOFF_TEMPLATE.md) and [the starting prompt](LUNA_START_PROMPT.md). [References](06_REFERENCES.md) identify inspected source and PostgreSQL documentation.

## Execution ownership

Luna repairs and source-tests a new candidate. The router publishes after validating the actual candidate and evidence. After the stated prerequisites, the router may deliberately elect **at most one fresh T12 request**. This supersedes the unspent T11 permission; it is not permission for both T11 and T12. If a T11 request was submitted after the reviewed snapshot, stop and return its identity before electing anything else.

No hosted request, external agent invocation, repository write, database change, or policy change was made in this review. The pack is delivered in the current conversation only.

Throughout:

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
```
