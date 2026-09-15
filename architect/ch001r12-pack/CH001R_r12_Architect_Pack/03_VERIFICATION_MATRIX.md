# R12 verification matrix

This checklist is **not** the 72-gate application contract. All template rows start NOT_RUN. Each result needs the exact executed command/case, environment, source identity, raw evidence location, and a factual note. Source review does not satisfy a runtime row.

SOURCE rows must pass before source-ready handoff. RUNTIME rows may remain NOT_RUN on a genuinely incapable editing host, but the implemented candidate must actually execute them on the authorized capable path. ROUTER rows are never marked passed by Luna. R12-T18 may record a correctly captured failed run as a completed routing task; it must separately record the proof's actual failure and never imply migration/application PASS.

| ID | Check | Class | Required evidence |
|---|---|---|---|
| R12-T01 | Identity and frozen scope | SOURCE | Confirm P11/T11/E11 ancestry; baseline/current workflow identity; preserved dependency, lock, migration SQL and security surfaces. |
| R12-T02 | One shared marker observer | SOURCE | Both real call sites invoke the repaired read-only observer; no CASE branch references a potentially absent table. |
| R12-T03 | Presence/count boundary cases | SOURCE | Absent skips COUNT; present empty gives 0; positive rows remain positive; separate statements and correct database bindings. |
| R12-T04 | Unknown observations fail closed | SOURCE | Nonzero exit, timeout, truncation, malformed/empty/multiple output, denied access, and relation disappearance do not become zero/PASS. |
| R12-T05 | Real PostgreSQL semantics | RUNTIME | Use production observer on absent/empty/nonempty/error fixtures; exact T11 negative statement produces captured expected failure; no main-db seeding. |
| R12-T06 | Inspection public allowlist | SOURCE | Synthetic unknown Env secret, HostConfig/Mounts/labels/command-file markers never reach any public file; projection occurs before logging. |
| R12-T07 | Accurate selected container facts | SOURCE | Top-level Path/Args and selected user/working-directory/state/image fields are correct; malformed/missing data stays unknown. |
| R12-T08 | Import verdict consistency | SOURCE | Persisted and returned verdicts match for CLI failure, timeout, truncated/malformed report, inspection failure, conflicting exits, and positive import. |
| R12-T09 | Strict migration terminal predicates | SOURCE | Missing/null/running/unknown containers cannot pass migrations; CLI-only build/start checks remain valid; permission control rejects setup/infrastructure failures. |
| R12-T10 | Controller and evidence ordering | SOURCE | Receipt precedes worker readiness; failed probes stop later stages; cleanup and primary failure preservation remain; actual adapters used in tests. |
| R12-T11 | Pinned full source matrix | SOURCE | Frozen install, actionlint, CI, clean+hosted-like prefixes, lint, typecheck, build, unit, security, syntax, diff checks with actual outputs. |
| R12-T12 | Real post-build workspace import | SOURCE | Unaliased actual built @oss/db import and isolated missing-link control run after frozen install/build; not a DB migration pass. |
| R12-T13 | Final-image fresh/schema proof | RUNTIME | Real final-image import and shipped fresh migration produce verified exits and expected schema/single marker in fresh isolated DB. |
| R12-T14 | Repeat and permission-failure proof | RUNTIME | Same image/database repeat preserves schema/marker time/sentinel; genuine restricted-role failure returns nonzero with measured no marker. |
| R12-T15 | Live cleanup and artifact integrity | RUNTIME | Selected retained-container facts captured before scoped teardown; fixtures removed; sibling data preserved; complete sanitized manifest hashes match. |
| R12-T16 | Evidence/handoff completeness | SOURCE | All reported source evidence retrievable, every checklist ID retained; no future SHA or acceptance claim; local/hosted observations separated. |
| R12-T17 | Publication and request ledger | ROUTER | T12/E12/source hashes and workflow checked; no T11 request or ambiguous outstanding request; unspent T11 authorization superseded. |
| R12-T18 | One deliberate fresh candidate outcome | ROUTER | At most one fresh T12 request; actual outcome/artifact preserved and reviewed; no reruns or automatic application acceptance. |

## Boundary assertions that must not be lost

A false/zero presence result from a valid catalog query is different from missing, unreadable, or malformed output. Both absent-table call sites need this distinction. Record whether COUNT was actually executed.

Import output saying PASS is only one input. CLI exit, timeout/truncation, container state/exit, and inspection identity must all support the effective result, and the file must match the returned result.

Fake orchestration tests need truthful labels. They do not demonstrate PostgreSQL parsing, migrations, Docker isolation, cleanup, or browser operation. Preserve them as unit evidence and obtain real runtime evidence separately.

Do not treat the historical 4/0/68 application ledger or the r11 local 10/0/8 checklist as candidate results. Do not replace the original gate requirements with these 18 repair checks.
