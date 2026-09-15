# CH-001R-r12-r1 — Complete review and repair assignment

This transfer copy combines the documents in the ZIP. The ZIP additionally contains machine-readable scope, the blank checklist, and the source-review receipt. No runtime PASS is implied.

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


---

# Architect verdict — T11/E11 source review

**Disposition: SOURCE_REPAIR_REQUIRED_BEFORE_HOSTED_DISPATCH.**
**Next authorized assignment: CH-001R-r12-r1.**

## What was reviewed

The review read the actual r11 Luna and router handoffs, the P11-to-T11 and T11-to-publication comparisons, E11 commit metadata, the changed migration-first controller, its SQL/Compose adapter, DB import verifier, pin guard, and focused control-flow tests. Source identities are listed in [00_READ_ME_FIRST.md](00_READ_ME_FIRST.md); exact repository references are in [06_REFERENCES.md](06_REFERENCES.md).

The root manifest contains `"@oss/db": "workspace:*"`. The P11-to-T11 compare reports one manifest line and three lockfile lines added, with verification/helper/test changes. The existing pin-scope implementation admits only that root workspace relationship, preserving all other lockfile text against its recorded baseline. Retain this repair. There is no reason to roll back to the broken D1 dependency state. [S1, S2, S8]

Luna reports a real host import result, clean and hosted-like prefixes with 8 file-level / 74 nested cases, unit 20/20, security 4/4, and local proof `BLOCKED_ENVIRONMENT`. Its r11 checklist is 10 PASS / 0 FAIL / 8 NOT_RUN, separate from the original 4 source-only PASS / 0 FAIL / 68 NOT_RUN application ledger. These are **reported local results**, not architect reruns and not hosted migration evidence. [S1]

The E11-filtered manual-run query and the repository manual-run query for creation at or after `2026-09-15T10:39:29Z` both returned zero runs during this review. These are point-in-time observations, not an asynchronous watch or proof against a later concurrent dispatch. [S9]

## F12-01 — Absent-table guard refers to the absent table

**Blocking source defect; expected PostgreSQL failure, not a reproduced T11 hosted result.**

`confirmFreshMarkerAbsent` sends this statement before the first migration:

```sql
SELECT CASE
  WHEN to_regclass('public.schema_migrations') IS NULL THEN 0
  WHEN EXISTS (SELECT 1 FROM schema_migrations) THEN 1
  ELSE 0
END
```

The same statement is used for `migration-failure-control-marker`. [S3]

The `to_regclass` lookup itself is safe when the relation is missing. It does **not** make the separate `FROM schema_migrations` reference safe. PostgreSQL analyzes relation references before executing CASE branches. Consequently an actually fresh database, where this table does not exist, is expected to produce `undefined_table` (`42P01`) during analysis instead of returning zero. The controller then stops before invoking the real migration. The restricted-role negative control can encounter the same problem after its failed CREATE leaves no metadata table. [P1, P2, P3]

This is an observation-query defect, not a reason to pre-create application tables, loosen migration checks, or edit the migration SQL. Implement a catalog-only presence query followed, only when the table exists, by a separate schema-qualified row-count query. Preserve error and unknown-state handling. Both call sites must share the repaired behavior.

A live SQL execution was unavailable in the architect environment. The SQLSTATE above is the expected result from source/semantic analysis, not a captured server response. The packet requires a real PostgreSQL negative/positive regression in the authorized capable environment.

## F12-02 — Raw inspection is published before selecting safe fields

**Blocking evidence-boundary defect; no T11 credential leak is claimed.**

`inspectMigrationContainer` calls `dockerStep` with:

```text
docker container inspect <name> --format {json .}
```

`dockerStep` writes `redact(output.output)` to a public command log immediately. Only afterward does the inspection function select a smaller object. Thus field selection does not protect that public log from the full inspection document. The outer redactor replaces registered synthetic secrets and PostgreSQL URL patterns; it is not an allowlist for `Config.Env`, mounts, host configuration, labels, arbitrary future values, or unknown secrets. [S3, S4]

The prior r11 assignment specifically prohibited unrestricted inspect/config JSON in public evidence. This finding concerns the code path and contract, not proof that real private credentials have been exposed. No T11 hosted artifact was reviewed because none was observed.

The same function also reads `Path` and `Args` from `Config`. Container inspection places process `Path`/`Args` at the top level; `Config.Cmd` and `Config.Entrypoint` are separate configuration facts. The current extraction can record an empty command. Obtain selected execution facts explicitly and label them correctly. [S3, DK1]

Fix projection **before any public logger sees the result**. Either request only selected fields from Docker or keep the raw response exclusively in a private capture path and feed only the sanitized projection to public logs. Preserve actual container/image identity, terminal state, exit, non-root user, working directory, timestamps, and selected executable/argument facts needed by the contract.

## F12-03 — Module-import PASS and terminal evidence can disagree

**Reporting defect in the inspected adapter, plus a related helper contract weakness.**

`finalImageModuleImport` writes the child's parsed report to `module-import-verification.json` before computing the effective status. Its return condition checks report PASS and an inspected container exit 0, but omits the Compose CLI exit and timeout result. The saved report can retain PASS even if container inspection later requires FAIL; a CLI failure can also be ignored by the returned status. [S3]

Compute one effective verdict from all required observations, then persist and return that same verdict. Record the actual CLI exit, timeout/truncation indicators, inspected container state and exit, image identity, parsed import result, and any inspection failure. No successful import declaration may override a failed/unknown terminal observation.

Relatedly, the exported `isSuccessfulMigrationTerminal` helper falls back to a CLI-only success when the container field is absent; expected-failure validation has a similar fallback. The current migration adapter normally supplies `assertion_ok=false` on inspection errors, so this review does **not** claim that every missing inspection currently becomes a production PASS. Still, container-required stages should encode that requirement themselves. Keep CLI-only validation for build/database-start commands separate from strict migration terminal validation. [S5]

## Why the current focused tests missed the SQL defect

The tests provide a fake `confirmFreshMarkerAbsent` that returns PASS and a fake controlled-failure marker result. They verify orchestration order and stopping behavior, but they do not execute the SQL in the real adapter. Those unit tests remain useful; they are not evidence of PostgreSQL statement validity. Add coverage of the actual observation helper and a real-server case, rather than replacing the tests or relabeling them. [S6]

## Accepted progress versus withheld acceptance

The dependency repair is preserved as the source change that addresses the D1 missing-package cause. R11's intended migration-first order is also preserved. Neither observation grants database correctness or application acceptance.

The T11 dispatch is held until the targeted harness repair is source-verified. No code is reverted and no application gate is marked FAIL solely because of this review. The latest hosted application observation remains the historical T10/D1 failure; r11 remains unexecuted in the hosted environment at the reviewed snapshot.

## Review limitations

No application dependency install, actionlint run, repository test suite, PostgreSQL statement, migration, Docker image, browser launch, or hosted proof was executed by the architect. The local runtime had Node `22.16.0` and no PostgreSQL server/client or Docker executable available. An attempt to retrieve PostgreSQL tooling failed; no server was started. This pack's checks are document/structure checks only.

No repository file was written, no external message sent, and no workflow dispatched. Source/evidence publication belongs to the router under the new bounded instructions.


---

# Luna MAX assignment — CH-001R-r12-r1

## Mission and stop condition

Fix the three documented migration-proof defects without undoing the r11 dependency repair or broadening application scope. Return a source-tested **T12/E12** candidate and executable runtime verification, not another plan. Stop for architect/router review. Do not publish or dispatch from Luna.

This chapter targets the existing unaccepted v0.1.0. It is not v0.2, a product redesign, or an acceptance decision. All original 72 application gate IDs and requirements remain unchanged.

## 1. Establish and preserve the baseline

Read the original CH-001/North Star, published r11 packet, `handoffs/CH-001R-r11.md`, `handoffs/luna-ch001r11-router-pro-update.md`, r11 evidence, and this entire packet. Record starting HEAD/tree and ancestry to T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f` and E11 `323947cba4197689f40c9084f38629244d58792f`. Preserve later router documentation. Do not overwrite unrelated execution changes.

Inspect at least:

```text
scripts/ch001-proof.ts
scripts/ch001-migration-verification.mjs
scripts/ch001-migration-verification.d.mts
scripts/verify-db-module-import.ts
scripts/ch001-compose.ts
scripts/ch001-compose-diagnostics.mjs
tests/ci/migration-first.test.mjs
tests/ci/workflow-validation.test.mjs
scripts/ci/pin-scope.mjs
package.json
pnpm-lock.yaml
migrations/0001_ch001.sql
```

The root dependency is already fixed. `package.json`, `pnpm-lock.yaml`, `scripts/migrate.ts`, application SQL, Dockerfile, Compose, the workflow, external dependency versions, and browser security settings are now frozen to T11 for this chapter. The r11-reported lock SHA-256 is `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576`; independently measure candidate bytes and compare with the exact T11 file. Prefer direct byte comparison over trusting this handoff value alone.

Do not change dependency resolution again. Do not add a package, global alias, hoisting setting, production failure flag, or extra workflow input.

## 2. Repair the SQL observation, not the application schema

Replace both unsafe CASE statements in `confirmFreshMarkerAbsent` and `runFailureControl` with one shared, read-only marker observation routine.

The intended protocol is:

```sql
-- First statement: catalog lookup only; safe when the relation is absent.
SELECT (pg_catalog.to_regclass('public.schema_migrations') IS NOT NULL)::int;

-- Separate statement, sent ONLY after the first observation proves presence.
SELECT count(*)::text FROM public.schema_migrations;
```

The routine may return structured JSON instead of scalar text; keep its parser deterministic. It must be used by both real adapter call sites, not only by tests. Do not send both statements as one pre-parsed query batch. Do not hide the table reference in another CASE, COALESCE, UNION, CTE, or an allegedly unreachable subquery.

Required semantics:

- Presence query succeeds, returns exactly one valid false/zero observation: table is absent; no count query is issued. Record `table_present=false`, effective marker count 0, and that zero follows from absence rather than an executed COUNT.
- Presence query succeeds and proves presence: execute a second schema-qualified count. Record the actual nonnegative integral row count and evidence for both queries.
- Absent table or an existing empty table satisfies the existing **no completion marker** predicate. A positive row count fails that predicate. Keep the eventual post-migration requirement of exactly one `0001_ch001` record separate.
- Error, permission denial, timeout, malformed/empty/multiple output, unsafe numeric conversion, or truncated output yields FAIL/UNKNOWN with a null count—not a successful zero.
- A table disappearing between the two reads is an observation failure, not permission to ignore an SQL error. This is a disposable single-owner qualification; do not add a new transactional migration subsystem to solve the race.

Do not pre-create, truncate, drop, or insert into `public.schema_migrations` to make the probe pass. Do not execute application DDL outside the normal `pnpm db:migrate` process. Keep connection targets explicit and bind the failure-control probe to the failure-control database, not the main disposable application database.

Use a small adjacent helper when needed for actual-boundary testing. It must accept a guarded query adapter; never accept arbitrary end-user table names or untrusted interpolated SQL.

## 3. Project container facts before public logging

Repair `inspectMigrationContainer` and its logging boundary. A public log must never receive the full result of `{json .}`, even temporarily before a later sanitization pass.

Choose one of these narrow implementations:

1. Ask Docker for an explicitly selected object using a fixed template, with each value correctly JSON-encoded; or
2. Introduce a private-only inspection capture, parse/validate it, then pass an explicit selected object to the normal public logger.

Keep only fields actually needed: container ID/name, image ID, project identity needed for ownership, status, exit, selected error text, start/finish times, configured user and working directory, and actual process executable/arguments. Process `Path` and `Args` are top-level inspection fields. If recording `Config.Cmd`/`Config.Entrypoint`, label them as configuration rather than replacing the actual executed process facts. Redact allowed string fields using the run's secret set.

Do not publish `Config.Env`, full `Config`, full `HostConfig`, unrestricted labels, authentication configuration, or raw mount/source paths. If mount evidence is required to rule out a source/dependency bind mount, emit only necessary destination/type/readonly facts, not host paths. Avoid broad framework changes: this is a repair to the new migration-container inspection path and its public serialization.

The failure path needs the same discipline. Failed JSON parsing must not copy the raw body into a public exception. A diagnostic error can record type, exit, safe bounded message, and a private-log reference. Never set a missing exit to zero.

## 4. Make the import result and terminal result agree

In `finalImageModuleImport`, build an effective observation before writing `module-import-verification.json`. PASS requires:

- a successful actual Compose CLI result with exit 0;
- no timeout and no truncation that compromises the evidence;
- one valid parsed import report that actually reports successful real-module loading;
- an inspected, terminal `exited` container with exit 0 and required identity facts;
- no inspection or parsing failure.

The persisted report and returned stage must contain the same final status and classification. Preserve separate fields for the child's declared result and the effective verdict where useful. Include CLI and inspected-container observations explicitly. The classification must remain **module import only**, not successful database migration.

Tighten the migration terminal validators so an omitted or null container cannot satisfy container-required fresh/repeat/failure-control stages. Build and database-start commands legitimately have no finished migration container; give those a separate CLI-only validation path rather than accidentally breaking them. This is an additive contract correction, not a reason to accept all nonzero exits.

For the controlled failure, retain its exact purpose: the real entrypoint must produce the intended SQL/permission failure, a real nonzero CLI/container outcome, and a successfully observed zero completion-marker count. Setup failure, missing package, lost daemon, timeout, or an unreadable marker table must not be counted as a successful SQL failure control.

## 5. Test real boundaries and preserve pre-install bootstrapping

Keep `node --test tests/ci` dependency-free. Do not load `pg`, tsx, built workspace modules, or a database into the pre-install CI suite. Use pure tests there for observation parsing, exact query dispatch decisions, field selection, strict terminal evidence, and controller order. Import the production helpers in these tests instead of copying their implementation into tests.

Retain the existing migration-first controller tests. Add cases at its actual SQL/inspection adapters. A fake method returning `{status:'PASS'}` does not test the embedded SQL.

Add a small real PostgreSQL regression in the installed/capable runtime. It must use the production marker observer and cover:

- absent metadata table;
- existing empty metadata table;
- positive completion-marker count;
- inability to read the count, or a lost/invalid observation;
- the exact T11 query as a historical negative control on an absent-table fixture, recording actual `42P01` if obtained.

Any fixture metadata table or role belongs in a separate disposable test database under this run. It must not seed or mask the main fresh migration database. No production credentials, saved user `.env`, or unknown remote Docker context. Clean fixtures even after failure, preserve siblings, and persist their outcomes before sealing evidence.

Where a local authorized PostgreSQL/Docker runtime is unavailable, implement the real regression and wire it into the installed migration-first proof after DB readiness. Mark it NOT_RUN locally. The one future candidate hosted run can supply this live evidence; a prior local green database is not required for the explicit hosted fallback. Do not create another workflow, download an unrelated VM, or weaken sandboxing to obtain it.

## 6. Preserve the complete migration-first journey

Retain the order: image build → real final-image module import → DB start/readiness → read-only fresh precondition → normal fresh migration → schema/single marker → sentinel → same-database repeat/invariants → controlled permission failure/no false marker → fixture diagnostics/cleanup → durable migration receipt → later worker/web readiness.

The live SQL fixture regression may run after DB readiness, isolated from the main database, without changing the product migration. Ensure the final receipt records it; do not silently ignore its failure.

Keep the existing unmodified migration command and schema. A migration PASS still requires final-image execution and real SQL observations. A module-import PASS cannot satisfy it. A later worker failure leaves completed migration evidence intact and the overall proof failed.

Keep r10's run-owned cleanup and proof-directory protection. Collect selected, sanitized diagnostics before deleting the retained migration containers. Keep primary and secondary failures separate. Do not delete evidence, overwrite a rejected proof directory, or seal a manifest before the final diagnostics/cleanup results exist.

## 7. Required source checks and retrievable evidence

On final committed T12, run the existing frozen install, pinned workflow lint, complete CI suite, clean and hosted-like no-node_modules prefixes, lint, typecheck, build, unit, security, actual post-build DB module-import verifier with its negative control, changed-module syntax checks, and `git diff --check`. Use pinned actionlint from the verified provisioner rather than relying on an unconfigured global binary. Record file-level versus nested test counts separately.

Do not change root package scripts just to add this chapter's test command. A direct documented command for a new focused test is acceptable. Keep old regression tests active.

Local commands are evidence only when executed. Publish sanitized raw command outputs or retrievable archived equivalents, not just summary assertions. Check that every path in the handoff actually exists in committed/attached evidence. A gitignored `commands.log` with no delivered copy is not retrievable evidence. Whitelist specific sanitized files for evidence publication rather than globally removing log ignores or committing private output.

Use `docs/evidence/CH-001R-r12/` and `handoffs/CH-001R-r12.md`; update state and index only to awaiting review. Keep T12 execution and E12 evidence separate. Do not embed the future E12 SHA in the file bytes that determine E12. Preserve T11/E11 and historical D1 artifacts unchanged.

## 8. Authorized changed surfaces

Allowed: the SQL marker adapter/helper, migration-container inspection/public serialization, effective import verdict/strict migration terminal predicates, adjacent types, source-bound tests, installed runtime SQL regression, and small coordinator wiring needed to execute those checks and report them. Existing evidence chapter admission can be extended only where required, without touching gate semantics.

Frozen: root dependency and lock bytes at T11, external/runtime/tool pins, pin guard allowance, application source, `scripts/migrate.ts`, `migrations/`, Dockerfile, Compose, workflow bytes/permissions/inputs, sandbox implementation, worker isolation, renderer/editor, original 72 gate definitions and verifier acceptance rules.

Do not expand into general timeout management, CLI redesign, global logging refactors, unrelated helper defects, UI polish, or feature work. A distinct downstream problem returns to review with its evidence.

## 9. Completion modes

**IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION:** all available source/pre-install/import/contract checks pass; remaining database/container tests are honestly NOT_RUN locally and are runnable inside the existing authorized hosted path.

**SOURCE_AND_LOCAL_RUNTIME_VERIFIED_READY_FOR_REVIEW:** the same source checks plus actual authorized local SQL/final-image cases ran successfully; this still does not accept the application.

**BLOCKED:** required source checks fail, identity or ownership cannot be established, or frozen boundaries would have to change. Return useful in-scope work and the concrete blocker. Do not call it source-ready.

Then stop. Luna may not push or dispatch. The router's rules are in [04_ROUTER_HANDOFF.md](04_ROUTER_HANDOFF.md).


---

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


---

# Router — T11 hold, T12 publication, one-request policy

## Immediate action

**Do not dispatch unchanged T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f`.** Deliver this repair to Luna MAX. Publication of T11/E11 was a source publication, not an executed migration or acceptance result.

This packet supersedes the r11 packet's unspent T11 dispatch permission. It does not add a second allowance. If a T11 request was already submitted after the point-in-time review, return its ID and outcome for review instead of submitting another candidate request. Do not cancel a job or modify repository execution code under these router instructions.

## After Luna returns

Verify exact T12 implementation and E12 evidence identities, ancestry, allowed file delta, and source-ready evidence. E12 must be evidence/handoff/state-only. Preserve late documentation commits rather than force-pushing back to a historical head.

All SOURCE rows in the repair matrix must be supported by retrievable evidence. Missing local Docker can legitimately leave runtime rows NOT_RUN; it cannot excuse failed unit, workflow, parsing, pin, or import checks. The SQL regression must invoke the production marker observer, be isolated from the main migration DB, and be runnable in the installed hosted path.

Verify the T11 dependency/lock correction remains unchanged and that no SQL migration, image, workflow, or security surface changed. The workflow remains:

```text
blob=35fa339aac2fcb024cd476ff38d87d27eb6482af
sha256=733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d
```

Check the exact workflow bytes at T12, E12, and the actual definition head on `origin/main`. Run existing pinned actionlint on that complete file. Keep `implementation_sha` distinct from GitHub's definition `head_sha`.

Before electing a request, examine the request ledger and manual-run history across relevant definition heads, not only a filter for the implementation SHA. A workflow run's head normally identifies the definition, while its input and checkout identify the implementation. A null/ambiguous acknowledgment is not permission to retry.

## One deliberate fresh T12 request

Only after all source-ready/publication conditions pass, the router may elect at most **one** request for the new T12. The architect and Luna do not submit it. Record purpose in the receipt; do not invent a workflow input.

```bash
: "${T12:?Set the actual approved 40-character T12 implementation SHA}"
[[ "$T12" =~ ^[0-9a-f]{40}$ ]] || exit 1
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha="$T12" \
  -f sandbox_qualification=true
```

Purpose in receipt only: `verify_migration_observation_and_evidence_repair`.

Do not use `gh run rerun`. No T11, T10/D1 `34946892709`, T9 `34937329430`, or earlier run is authorized for retry. This also covers historical records not listed by ID.

No automatic second request after failure, cancellation, rejection, or ambiguous submission. Capture the exact response, correlate history, and return for review. Do not spawn another Luna task to patch a newly observed downstream failure without a new architect instruction.

## Read the outcome rather than the green wrapper step

Preserve the actual captured proof exit and final classification. Distinguish bootstrap, final-image import, SQL-observer regression, fresh migration, schema, repeat, controlled failure, cleanup, and later worker/application stages.

If module import succeeds but fresh precondition fails, do not call the dependency fix a proven migration. If migration succeeds but worker readiness fails, retain completed migration evidence and keep the whole proof failed. A successful bounded proof returns ready for review; it does not set application acceptance true or erase incomplete original gates.

Download the exact fresh artifact; record run/attempt/job, requested SHA, actual checkout/tree, definition commit, workflow blob/SHA-256, artifact ID/name/size/API digest, local ZIP SHA-256, and payload integrity. Preserve raw downloaded ZIP unchanged; commit only sanitized selected evidence and receipts. No public environment dumps, cookies, auth state, raw secret-bearing inspection, or leaked command files.

## Receipt and stop

Return actual T12/E12/router-evidence SHAs, source checks, request count, run/artifact identity or null, stage results, first blocker, cleanup, original gate counts from that actual run, and delivery destination. Report evidence push, chat delivery, and workflow dispatch separately.

Keep `application_acceptance=false`, `accepted_application_version=none`, and root `awaiting_review` throughout. Then stop for architect review.


---

# CH-001R-r12 Luna / router handoff

## Status and identities

- Disposition: `<IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION | SOURCE_AND_LOCAL_RUNTIME_VERIFIED_READY_FOR_REVIEW | BLOCKED>`
- Actual starting commit/tree, P12 if present, final T12/tree, E12 returned after commit.
- Workflow blob/SHA-256 and candidate lock SHA-256.
- `application_acceptance=false`; accepted version `none`; root `awaiting_review`.

## Finding disposition

| Finding | Exact change | Actual supporting tests | Runtime limitation |
|---|---|---|---|
| F12-01 two absent-table probes | | | |
| F12-02 inspection projection/process identity | | | |
| F12-03 effective import/terminal verdict | | | |

## Verification

For every required command: full command, source SHA, Node/pnpm/tool version, environment class, exit, counts, and raw evidence path. Separate source/no-node_modules controls, installed real import, fake adapter tests, real PostgreSQL tests, final-image migrations, and hosted outcome. Use the provided JSON ledger; all unexecuted rows remain NOT_RUN.

Do not describe mock SQL results as a successful SQL regression. Do not describe an expected `42P01` as observed without a server log/result. Mark every missing report accurately rather than inventing it.

## Database/image results

Describe catalog presence and count observations; whether COUNT was skipped; fresh/repeat CLI and container exits; table/marker/sentinel results; restricted-role error/SQLSTATE; selected image/user/process facts; cleanup and manifest identity. If unavailable, record nulls and NOT_RUN reasons.

## Evidence inventory

Every listed path must be retrievable from the evidence commit or attached artifact. Provide hashes of sanitized logs/receipts. No future self-referential commit hash or manifest/receipt hash cycle.

## Scope and external actions

Record frozen-surface comparison and exact source files changed. Record registry access, local disposable runtime creation/removal, policy changes (normally none on editing host), source/evidence pushes, agent messages, and hosted requests separately. A local document is not an external send.

## Router-only completion

Actual definition/input/checkout identities; request count; run/attempt/job/artifact; captured bootstrap/proof classification; migration vs downstream result; original 72-gate counts; final evidence commit returned externally. If no request, use nulls. Then stop.


---

# Source references and evidence boundaries

Reviewed repository: `klole/reel-farm`. T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f`; E11 `323947cba4197689f40c9084f38629244d58792f`; observed router-documentation head `a7c239c0164ff456448e11684c593153e6fa8240`. These references identify source, not executed application results.

- **S1** Luna handoff: `https://github.com/klole/reel-farm/blob/a7c239c0164ff456448e11684c593153e6fa8240/handoffs/CH-001R-r11.md`; router update: `https://github.com/klole/reel-farm/blob/a7c239c0164ff456448e11684c593153e6fa8240/handoffs/luna-ch001r11-router-pro-update.md`.
- **S2** Root manifest: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/package.json` (blob `a6bf145f4e0b8a8c496b23cfe24a5447ce3780be`).
- **S3** Real adapter: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/ch001-proof.ts` (blob `2e0e533d367bcd685a52ee25d3ddb24f41332df7`). Inspect `confirmFreshMarkerAbsent`, `runFailureControl`, `inspectMigrationContainer`, and `finalImageModuleImport`.
- **S4** Same source, `dockerStep`, `composeStep`, `redact`, and public log writing before inspection field selection.
- **S5** Controller and terminal predicates: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/ch001-migration-verification.mjs` (blob `51155d31ee88e03a9cb5dd0f510d6f270a96b473`).
- **S6** Existing fake-adapter tests: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/tests/ci/migration-first.test.mjs` (blob `7d66d975062e1dabedaaf9e018bc032c88729132`).
- **S7** Import verifier: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/verify-db-module-import.ts` (blob `e4c34feb1e78b3b17e1068ed9760613a87e3c43d`).
- **S8** Pin guard: `https://github.com/klole/reel-farm/blob/7d2a128432dd6922bee50fde94c9bd2b1bf5e49f/scripts/ci/pin-scope.mjs` (blob `b9e23c39d3348bca0009b4c78c4b40fc14a36459`).
- **S9** Read-only API queries: `https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=323947cba4197689f40c9084f38629244d58792f&event=workflow_dispatch&per_page=100` and `https://api.github.com/repos/klole/reel-farm/actions/runs?event=workflow_dispatch&created=%3E%3D2026-09-15T10%3A39%3A29Z&per_page=100`. Both returned zero during review.
- **S10** E11 commit metadata: `https://api.github.com/repos/klole/reel-farm/git/commits/323947cba4197689f40c9084f38629244d58792f`. Comparison reads: `10db55ff1f942f3b1894699fea3180b69f4afe27...7d2a128432dd6922bee50fde94c9bd2b1bf5e49f` and `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f...a7c239c0164ff456448e11684c593153e6fa8240` under the repository compare API.

Primary PostgreSQL references checked during review:

- **P1** PostgreSQL 16 parser/transformation stages: `https://www.postgresql.org/docs/16/parser-stage.html`. Semantic analysis resolves referenced tables before statement execution.
- **P2** PostgreSQL 16 `to_regclass`: `https://www.postgresql.org/docs/16/functions-info.html`. A missing name returns null; that behavior applies to the lookup function, not to a different static table reference elsewhere in the query.
- **P3** PostgreSQL conditional expressions: `https://www.postgresql.org/docs/current/functions-conditional.html`. CASE runtime branch evaluation is not a general shield against earlier analysis/planning failures. The cited planning example is supporting context, not a substitute for the exact relation-resolution reasoning.

**DK1** Docker Engine container-inspection response schema: `https://docs.docker.com/reference/api/engine/version/v1.52/`. The official response sample places `Path` and `Args` at the top level, separately from `Config`. Container process fields must also be checked against the actual Docker inspection schema in the candidate test. The T11 code currently reads `Config.Path/Args`; the repair must distinguish top-level process fields from `Config.Cmd/Entrypoint` and retain selected non-secret facts only. This packet does not claim an actual T11 container inspection was executed.

Prior r11 packet: the attached `CH001R_r11_Architect_Pack.zip` / published P11 assignment. Its selected-inspection and dual-terminal-exit requirements remain in force. Historical T10/D1 run `34946892709` is contextual evidence only; it was not rerun or reclassified here.


---

# Luna MAX starting prompt — CH-001R-r12-r1

Execute the attached CH-001R-r12-r1 packet as a bounded pre-dispatch repair of T11. Inspect the repository, original CH-001/North Star, r11 handoff, and the whole packet before changing code. Preserve T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f`, E11 `323947cba4197689f40c9084f38629244d58792f`, and later router documentation in history.

Keep the existing root `@oss/db: workspace:*` fix and T11 lockfile bytes. Do not change application code, migration SQL/entrypoint, Docker/Compose, workflow, dependency/tool pins, or sandbox/worker security.

Repair BOTH absent-table SQL probes using a shared read-only presence-then-count routine. PostgreSQL resolves static relation references before CASE execution; do not pre-create metadata to hide that failure. Project container facts before any public logging and obtain process identity from the correct fields. Compute and persist one effective final-image import verdict requiring valid CLI and inspected-container evidence; keep CLI-only build checks separate from strict migration terminal checks.

Test the production boundaries, preserve existing regressions, and add a real PostgreSQL observer regression to the installed/capable path. Keep pre-install CI dependency-free. Run all available pinned source checks and the real post-build workspace import. Publish retrievable sanitized evidence, not dead links to ignored logs. Missing local Docker may leave runtime tests NOT_RUN; it does not permit skipping source tests or claiming migration success.

Return actual T12/E12 identities, the complete r12 checklist, scope diff, source results, runtime limitations, and a handoff. Keep application_acceptance=false, accepted version none, root awaiting_review. Do not push, spawn agents, dispatch, rerun T11 or historical jobs, or start features. Stop for router/architect review.
