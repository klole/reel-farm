# R13 verification requirements

The checklist below is not the original 72-gate application ledger. Every template row starts NOT_RUN; populate only with executed evidence, environment, source SHA, actual command/case, and a retrievable report/log reference.

SOURCE rows must pass for source-ready handoff. RUNTIME rows may remain NOT_RUN locally only when capability is genuinely absent and the candidate implements those tests in the existing capable path. ROUTER rows are never marked PASS by Luna. Completing the routing task for a failed run does not make the application or migration pass.

| ID | Class | Requirement | Required evidence |
|---|---|---|---|
| R13-T01 | SOURCE | Canonical baseline and frozen scope | Resolve full E12; record real P13/T13; preserve dependency, lock, migration, runtime, workflow and 72-gate surfaces. |
| R13-T02 | SOURCE | Database-aware negative witness | Old omitted-target behavior selects oss and is rejected by the real adapter boundary test. No PostgreSQL runtime result is claimed by the fake. |
| R13-T03 | SOURCE | Explicit targets for every fixture operation | Assert the final psql -d and user values for maintenance, table/schema ACL, observer, and cleanup operations; no default leaks into table-local work. |
| R13-T04 | SOURCE | Main database and failure preservation | Empty-main and existing-main fixtures detect wrong-database writes; setup failure stops later stages; cleanup remains scoped and failures retained. |
| R13-T05 | SOURCE | Invocation record serialization | Two identical command texts retain two actual unique IDs, actual exits, timestamps and distinct logs; serializer agrees with child_invocations. |
| R13-T06 | SOURCE | Strict command-record validation | Legitimate repeats accepted; duplicated/missing/mixed IDs, reused captured records/logs, missing/stale evidence rejected; historical validation stays explicit. |
| R13-T07 | SOURCE | Failure cannot be hidden by repetition | Pass-then-fail and fail-then-pass required-command sequences both remain blocking; expected SQL negatives keep raw exits and checked expectations. |
| R13-T08 | SOURCE | Pinned complete source qualification | Frozen install, real actionlint, CI, clean/hosted-like no-node_modules prefixes, lint/typecheck/build/unit/security, real DB import, syntax and diff; actual logs. |
| R13-T09 | RUNTIME | Actual fixture regression in PostgreSQL | Correct database ACL, absent/legacy/empty/positive/denied observations; main marker absent; fixture cleanup; no fabricated SQLSTATE. |
| R13-T10 | RUNTIME | Final-image migration and repeat | Actual fresh/repeat CLI and container exits, schema/single marker/time/sentinel invariants, restricted-role failure/no marker, before worker readiness. |
| R13-T11 | RUNTIME | Real cleanup and evidence finalization | Safe projections and scoped cleanup; repeated commands do not cause bogus duplicate errors; identities/manifest/logs intact; actual downstream outcome retained. |
| R13-T12 | SOURCE | Handoff and evidence completeness | All rows retained; actual T13 identity and source outputs retrievable; no future E SHA, ignored-only evidence, synthetic live proof or acceptance claim. |
| R13-T13 | ROUTER | Publication and request ledger | Canonical T13/E13 ancestry/workflow bytes/source checks; old T12 permission closed; no outstanding or ambiguous conflicting request. |
| R13-T14 | ROUTER | One deliberate fresh T13 outcome | At most one fresh submission; actual run/job/artifact and migration/downstream result captured separately; no automatic acceptance or retry. |

## Required source test characteristics

Database-aware fakes are source-boundary tests, not PostgreSQL runtime tests.

Routing tests must observe database values at the actual builder/adapter boundary. A fake that ignores its database argument cannot satisfy R13-T02/T03. A string search alone cannot prove that the permission statement reaches the correct database.

Use the intended unchanged main database as a protected sentinel in source tests. Do not exercise that safety test by seeding the real fresh main database. Live permission setup remains confined to the disposable fixture database.

For evidence tests, build realistic repeated-query records with different invocation IDs, times and public log paths, and execute the real record validation path. A test that merely calls `new Set(ids)` without exercising the production validator/serializer is insufficient. Check that command text is not modified and earlier failure observations cannot be silently lost.

The full evidence validator may still correctly reject a synthetic package because application suites/gates are incomplete. Tests of the command-record portion must isolate that boundary explicitly, not label a mocked package a complete accepted application run.

## Runtime versus source accounting

Expected negative SQL errors are observations inside a successful regression only when the expected class, state, and fixture cleanup are verified. Unknown counts, missing terminal containers, truncated reports, or environmental launch failures cannot be treated as equivalent permission failures.

Keep the original application ledger unchanged in definition. Only an actual candidate run may generate its new observed counts. The r12 local 12/0/6 repair ledger and its local blocked application proof stay historical; no source review turns NOT_RUN gates into PASS.
