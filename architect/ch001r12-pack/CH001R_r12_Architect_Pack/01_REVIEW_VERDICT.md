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
