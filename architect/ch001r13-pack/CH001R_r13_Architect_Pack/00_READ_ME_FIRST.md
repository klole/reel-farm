# CH-001R-r13 — Fixture database binding and invocation evidence

Packet revision: **r1**. Issued: **2026-09-15T13:20:45Z**.

## Decision

**HOLD unchanged T12. Source repair is required before hosted dispatch.**

Next executor: **Luna MAX**, followed by the existing router. This is a bounded continuation of the original Open Slideshow Studio v0.1.0 checkpoint, not a feature chapter, a release, or application acceptance.

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
architect_workflow_dispatch_count=0
```

T12 contains the intended three r12 repair mechanisms. Keep them. This review found a wrong-database call in the new runtime regression and a separate command-record identity mismatch on the intended repeated-query path. Neither finding is a new hosted result; no T12 hosted execution was observed in the read-only query described in the review.

## Canonical identities

| Identity | Value |
|---|---|
| P12 | `c7e63600fe7a3cacc6fe469763abbca92c1615b0` |
| T12 | `cc9da96079fc681ce162a99bd4e3df21f05cb382` |
| T12 tree, as recorded in the handoff | `ef10ce662f60c42f0c566c0d13cf0c698710ccd9` |
| E12 / main at review | `b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d` |
| E12 tree, returned by GitHub | `71ce94e0897a2c49edf1b9f7e372fcc85e68751c` |
| Workflow blob | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Recorded workflow SHA-256 | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Recorded preserved T11/T12 lock SHA-256 | `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576` |
| Last relevant hosted negative baseline | Run `34946892709`, artifact `10387768055`, T10/D1 |

**Identity correction:** the router message supplied the 39-character E12 prefix `b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2`. GitHub resolves it to the full 40-character E12 above, ending `ad2d`. Use the canonical value in machine receipts. This is not a different implementation.

E12 directly follows T12. The API comparison reports only evidence/handoff/state files between them. P12-to-T12 reports the 13 implementation files described in the handoff. These are read-only source observations, not runtime validation.

## Reading order

Read [the review](01_REVIEW_VERDICT.md), [Luna's assignment](02_LUNA_MAX_ASSIGNMENT.md), [verification matrix](03_VERIFICATION_MATRIX.md), and [router rules](04_ROUTER_HANDOFF.md). Use [the handoff template](05_HANDOFF_TEMPLATE.md) and `r13-results.template.json`. Sources are in [06_REFERENCES.md](06_REFERENCES.md).

## Scope boundary

Repair the fixture database target and preserve repeated command invocations correctly. Do not revert the root `@oss/db: workspace:*` fix, the presence/count observer, inspection projection, effective import verdict, strict container-terminal requirements, or migration-first ordering. Do not change migration SQL, runtime dependency pins, Docker/Compose, workflow, worker isolation, or the original 72-gate contract.

The unspent T12 request permission is held and superseded by this packet. After the source and publication conditions below pass, the router may deliberately elect **at most one fresh T13 request**. This is a replacement permission, not permission for T11 plus T12 plus T13. A concurrent or ambiguous existing request must be resolved before any request is made.
