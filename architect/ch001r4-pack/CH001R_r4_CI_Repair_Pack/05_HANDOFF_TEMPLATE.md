# Luna/router handoff — CH-001R-r4

Fill every field from actual observation. Use null or NOT_RUN where appropriate; never invent SHAs, counts, reports or URLs.

## Status

Operational status: `READY_FOR_ROUTER_PUBLISH` / `NEEDS_WORKFLOW_CAPABLE_PUSH` / `NEEDS_WORKFLOW_DISPATCH` / `CI_BOOTSTRAP_FAILURE` / `CI_REPORTING_FAILURE` / `BLOCKED_DEPENDENCY_COMPATIBILITY` / `BLOCKED_ENVIRONMENT` / `BOOTSTRAP_FIXED_LIVE_PROOF_FAILED` / `EVIDENCE_INVALID` / `LIVE_PROOF_READY_FOR_REVIEW`.

Application acceptance: **false**. Root: `awaiting_review`. Accepted version: `none`. Target: `0.1.0`.

## Identities

| Field | Actual value |
|---|---|
| Starting source / packet P4 | |
| T4 implementation SHA / tree | |
| E4 evidence commit, returned externally | |
| Remote publication verified | yes/no; method and observation |
| Workflow-definition SHA / blob / SHA-256 | |
| Requested and actual checkout SHA | |
| Run ID / attempt / job ID | null until run exists |
| Artifact ID / name / bytes / SHA-256 / expiry | null until retrieved |

The T4 implementation includes the workflow, installer, native release pins, Docker wiring and test changes. E4 contains only documentation/evidence after T4. State whether any later execution-affecting change invalidated the earlier test identity.

## Changes made

Explain the selected native bootstrap, checksum and target checks, PATH handling, final-image non-root/offline package-manager invocation, summary quoting correction, absent-proof classification, and dependency-free failure diagnostics. List any deviation from the specified pins or scope; unresolved deviations are blockers, not silent approvals.

## Executed commands

| Command | Host/time | Exit | Discovered/executed/passed/failed/skipped where relevant | Evidence |
|---|---|---|---|---|
| CI helper tests without project dependencies | | | | |
| Clean native bootstrap + frozen install | | | | |
| lint / typecheck / build | | | | |
| unit / security | | | | |
| shipped-image build and runtime pnpm probe | | | | |
| bounded `pnpm proof:ch001` | | | | |

Do not replace unavailable entries with inherited T3 results. Separate unit fixtures from actual native downloads and hosted runtime execution.

## CI outcome

- Primary stage and actual exit:
- Bootstrap repaired/demonstrated:
- Proof invoked:
- Proof exit (null when not invoked):
- Report validation:
- Summary outcome:
- Artifact transport and independent inspection:
- CI4 checks: PASS / FAIL / NOT_RUN counts:
- Fresh parent CH001 ledger counts, or `none generated`:
- Remaining original gates/findings:

A bootstrap failure is not a coordinator exit 2. A coordinator exit 0 is not application acceptance. A completed upload is not a completed app export.

## Artifact inventory

List actual file paths, hashes, download/retention locations, and the failed-step excerpt. Confirm that public archive paths resolve the referenced manifest entries. State explicitly whether canonical ZIPs, preview bytes, screenshots and lifecycle reports exist.

## Scope, credentials and external actions

Record network downloads, workflow-capable publication actor/path, manual dispatch count, and cleanup restricted to run-owned test resources. Confirm no workflow token was moved to Luna, no provider/account credentials were used, and no excluded feature/release/v0.2 work occurred.

## Next action and stop

Name the exact next router or architect action. If publication or dispatch remains outstanding, provide T4 and the ready command, not an assertion that CI passed. If a live application failure is newly exposed, include its test identity and first useful reproduction; do not implement unapproved application changes.

Keep historical r3 records intact. Add the r4 handoff/index and update current operational state to point to it while keeping root `awaiting_review` and accepted version `none`. Stop.
