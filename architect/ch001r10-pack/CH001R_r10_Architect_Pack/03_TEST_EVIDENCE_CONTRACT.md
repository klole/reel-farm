# R10 test and evidence contract

This is a repair checklist, not a substitute for the original 72 application gates. A source review, mocked subprocess, host database run, and shipped-image run are different evidence classes. Label them accurately. The template starts with every new R10 result NOT_RUN.

## Required cases

| ID | Requirement | Minimum evidence |
|---|---|---|
| R10-T01 | Bind the reviewed T9/E9 run and retain the unchanged original ZIP, gate ledger, and archive digest. | Historical inspection plus exact baseline identities. |
| R10-T02 | Execute the T9 migration entrypoint in its final image and capture its real error or an explicitly different outcome. | Image/command/DB identity, actual exit, sanitized service stderr/stdout. Runtime; not source inference. |
| R10-T03 | Tie any migration repair to the reproduced cause; distinguish and disposition the `@oss/db` hypothesis. | Before/after error evidence and minimal diff rationale; or explicit “unresolved/no migration edit.” |
| R10-T04 | Exercise the candidate through its shipped-image command without source/dependency mounts substituting host files. | Effective command/user/workdir/image identity and mount facts with secrets excluded. |
| R10-T05 | Fresh candidate migration succeeds and expected schema plus one migration record are inspected. | Actual exit 0 and query results from disposable PostgreSQL; no manual completion row. |
| R10-T06 | Repeat the same migration against the same database without duplication or loss of a deterministic sentinel. | Second actual exit 0, same volume/database identity, metadata count and sentinel comparison. |
| R10-T07 | Controlled migration failure stays nonzero and cannot claim completion; transaction/lock semantics remain intact. | Executed isolated failure case and metadata observation; explicitly distinguish fixture from real SQL evidence. |
| R10-T08 | Startup-attempt ownership triggers diagnostics/cleanup even when `compose up` returns nonzero after allocation. | Direct tests of the coordinator's actual helper/control flow; not a reimplemented model. |
| R10-T09 | Logs include failed/stopped migration state and are bounded, sanitized, and captured before deletion. | Subprocess arguments, ordered events, sanitized artifacts, secret-sentinel tests. |
| R10-T10 | Teardown is confined to the run-owned project; no preexisting/default/sibling project can be removed. | Refusal tests and scoped command assertions, plus runtime sibling preservation when Docker is available. |
| R10-T11 | Primary failure survives diagnostics, timeout, and cleanup failures; cleanup-only failure prevents success. | Actual helper tests for primary/secondary failure combinations and exits. |
| R10-T12 | Final public manifest binds startup diagnostics and cleanup evidence without post-hash mutation. | Recomputed file digests, report references, malformed/missing-report negative cases. |
| R10-T13 | All existing scoped host/static commands and CI regressions pass with real pinned tools. | Command logs and discovered/executed/passed counts. No test skips promoted to pass. |
| R10-T14 | Bootstrap, sandbox, worker isolation, dependency/lock pins, original gates, and future-scope exclusions are preserved. | Focused diff/hash comparison; identify any allowed narrow runtime-entrypoint edit separately. |
| R10-T15 | A real disposable partial-startup failure produces reviewable service diagnostics and verified owned teardown. | Actual Docker fixture run, nonzero service exit, before/after state, sibling sentinel. |
| R10-T16 | Documentation and ledger accurately separate host sandbox success, unqualified worker, migration status, and application acceptance. | Handoff/state review; acceptance false and accepted version none. |
| R10-T17 | Router verifies publication, ancestry, execution/evidence separation, and workflow identity. | Router-owned receipt; NOT_RUN in Luna's local handoff until actually performed. |
| R10-T18 | At most one fresh candidate T10 dispatch is observed and its settled result/artifact independently inspected. | Router-owned run/attempt/job/input/artifact receipt; can record a failed outcome without calling it application success. |

PASS for R10-T03 can mean that the hypothesis was honestly left unresolved and no unsupported migration edit occurred. It does not grant PASS to T02/T04/T05/T06. A diagnostic-only handoff must leave missing runtime cases NOT_RUN; it cannot claim “18/18 passed.”

R10-T18 concerns faithful execution and reporting of the authorized request, not a requirement to falsify a green run. Its receipt must include the actual proof result separately. Full application acceptance is never granted by the count of R10 tests.

## Minimum durable files

Use `docs/evidence/CH-001R-r10/` for the evidence index, command results, root-cause record, scope comparison, and R10 checklist. Keep large/raw or confidential material out of public git. Deliver a reproducible artifact when binary evidence is not committed, and bind it with a digest and concrete retrievable location.

For each new runtime run, collect the following logical records; exact filenames may follow existing conventions but must be mapped in the index:

```text
source-identity.json
migration-diagnosis.json
migration-baseline.log            # sanitized T9 reproduction, if executed
migration-fresh.log               # sanitized candidate execution, if executed
migration-repeat.log
migration-schema-check.json
compose-startup-state.json
compose-service-logs.log          # bounded and sanitized, includes migrate
compose-cleanup.json
command-report.json
r10-results.json
artifact-manifest.json
```

Each record identifies whether it is historical review, local fixture, local shipped-image runtime, or fresh hosted runtime. Include implementation SHA/tree, run ID, command, image IDs when available, start/end timestamps and exit. Missing observations are null or NOT_RUN with reasons—not empty PASS objects.

## Migration diagnosis record

Capture the actual exception/code/SQLSTATE when available, its producing service and command, whether the process reached SQL, and the evidence path. List investigated hypotheses and the evidence supporting or rejecting them. Do not copy a guessed error into an “observed” field. Retain the first failure before the fix.

Database assertions should query only the disposable test database. Record table names and migration metadata, not auth tokens, real user data, or connection credentials. The schema check should cover the application tables expected by the existing SQL, including `workspace`, `project`, `draft`, `draft_revision`, `asset`, render tables, `worker_heartbeat`, `save_mutation`, and `schema_migrations`.

## Cleanup record

Record `startup_attempted`, `startup_exit`, `project_owned`, `diagnostics_attempted`, selected service states, teardown command/exit, timeout status, and post-cleanup resource check. Keep primary and secondary failures separate. An unavailable inspection result is unknown, not “zero resources.” Keep snapshots of the synthetic sibling sentinel before and after the real cleanup test.

A mocked Docker response must be labeled as such. It proves handling and command scope, not that a real container or volume was removed. Successful GitHub VM disposal also does not substitute for this scoped record.

## Command and manifest requirements

The full scoped set remains:

```bash
pnpm install --frozen-lockfile
pnpm lint:workflow
pnpm test:ci
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Add actual new migration/cleanup harness commands, syntax checks, and any source-bound CI rehearsal used. Preserve raw exits and explain unavailable commands. Do not require `verify:ch001` to pass for this bounded diagnostic chapter: it must continue rejecting incomplete full acceptance. Do not run `proof:ch001` twice merely to get a desired status.

Before hashing final public payloads, complete diagnostics/owned teardown and sanitize logs. Include the sanitized service log and cleanup receipt in the manifest. Verify payload lengths and SHA-256 values and verify that none changed afterward. Metadata exclusions needed to avoid circular hashing must remain explicit. A report's “no evidence” field cannot be replaced by a pass based on source presence alone.

## Environment limits

Luna's previous host lacked Docker/Compose, loopback access, and managed Chromium. Do not repeat that as an assumed current fact: probe only the relevant prerequisites and record the result. Migration reproduction needs Docker/PostgreSQL but not a local host browser or privileged AppArmor changes. Use a capable router environment when available.

When runtime checks remain impossible, deliver the diagnostic-only mode and commands. Do not manufacture image IDs, SQL errors, screenshots, migration passes, or cleanup receipts. The next authorized hosted run can gather the missing evidence without pretending a speculative fix has been validated.
