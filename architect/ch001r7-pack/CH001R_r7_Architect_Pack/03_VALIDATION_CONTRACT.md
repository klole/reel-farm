# r7 validation contract

This is a separate r7 repair checklist. It does not replace, delete, or automatically pass any of the original 72 CH001-* gates. A test can pass because it correctly rejects a negative fixture; record the subject command's nonzero status as expected, not as a real workflow PASS.

## Mandatory pre-publication cases

| ID | Assertion | Required evidence |
|---|---|---|
| R7-T01 | The full pinned T6 workflow fails Actions-aware validation at the unsupported `runner` context in job-level env. | Real validator output, exact T6 file hash, tool/version, diagnostic location. |
| R7-T02 | The complete repaired workflow passes the same validator with context/schema checks enabled. | Exact candidate/T7 hash, command and exit 0. |
| R7-T03 | The validator wrapper fails closed for missing tool, nonzero tool result, zero input workflows and invalid YAML. | Executed positive/negative wrapper tests; no success-by-skip. |
| R7-T04 | A negative nonexistent `steps` reference is rejected; the supported step-level/runtime positive fixture passes. | Actual semantic validator runs, not a regex assertion. |
| R7-T05 | Runtime initialization yields the same absolute state path in independent qualification and cleanup consumers. | Separate-process env-transfer test; expected full path. |
| R7-T06 | Spaces and shell-looking characters remain literal; no environment file is sourced/evaluated. | Temp fixtures, marker absence, exact value comparison. |
| R7-T07 | Missing/invalid runtime inputs fail before modifying the environment file; existing entries survive a successful append. | Missing temp/file, relative/multiline path, invalid IDs, file comparison. |
| R7-T08 | Environment setup creates no proof tree or policy state and cannot revive the r4 collision. | Before/after filesystem snapshots; r5 regression suite remains passing. |
| R7-T09 | Boolean opt-in default false, public/manual host guard, cleanup ordering, exact-browser constraint and non-root/sandbox defaults remain intact. | Focused workflow/helper wiring tests plus bounded diff review. No live policy claim. |
| R7-T10 | Existing r4/r5/r6 helper suites still pass with actual counts. | Test logs, discovered/executed/passed/failed/skipped counts. |
| R7-T11 | Node/pnpm/Playwright/dependency pins, native release manifest and lockfile are unchanged; package changes are scripts-only. | Hashes and parsed key/diff comparison against T6. |
| R7-T12 | Final workflow evidence is bound to actual T7/tree/workflow bytes; E7 does not alter execution-affecting content. | Source identities, commands, diff and clean-tree record. |

R7-T01 through T12 are required before dispatch, though the router may provide the missing real-validator evidence when the editing box cannot. These statuses start unrun in Luna's new ledger; do not copy the architect's reference-snippet results into them as full passes.

## Router/hosted cases

| ID | Assertion | Required evidence |
|---|---|---|
| R7-T13 | Router validates the actual publication tree and verifies T7/E7 reachability and the workflow definition used by `main`. | Fresh fetch, current W7 SHA/blob, actual semantic-validator output and hash match. |
| R7-T14 | At most one new dispatch is submitted with T7 and explicit sandbox opt-in; accepted versus rejected is recorded accurately. | Actual command/exit/response, attempt time, new run metadata if any. A rejection is not a PASS for successful dispatch. |
| R7-T15 | When a run exists, requested SHA, checkout, definition SHA, sandbox qualification, cleanup, worker and proof outcomes are separately reported. | Settled job/step reports and a real artifact if produced. Unreached work remains NOT_RUN. |
| R7-T16 | Historical artifacts/results are preserved; state remains unaccepted; receipt contains no secrets or invented identifiers. | Independent archive/hash check when applicable, sanitized handoff/state review. |

A successful grammar repair and a newly exposed runtime failure are different outcomes. R7 can be accepted as a bounded definition repair while application acceptance remains false and r6 qualification remains incomplete. A green bounded proof is also not automatic full acceptance.

## Commands

Record actual execution, not an aspirational list:

```text
pnpm lint:workflow
pnpm test:ci
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Also record direct negative validator runs and new helper syntax checks. A frozen install is needed only if the checkout/dependencies require it; use the existing pinned setup and verify the lockfile is unchanged. Do not claim an old install/build belongs to T7.

`pnpm verify:ch001` remains the strict application verifier. It need not become green to accept a syntax repair, and it must not be weakened to make r7 appear accepted. A local bounded proof may still exit 2 for unavailable runtime prerequisites; its counts are not hosted counts.

## Workflow validation evidence shape

A suitable `workflow-validation.json` includes:

```json
{
  "record_kind": "WORKFLOW_STATIC_VALIDATION",
  "implementation_commit": null,
  "implementation_tree": null,
  "workflow_path": ".github/workflows/ch001-live-proof.yml",
  "workflow_blob_sha": null,
  "workflow_sha256": null,
  "validator": {
    "name": "actionlint",
    "version": null,
    "executable_sha256": null,
    "distribution_reference": null
  },
  "command": null,
  "exit_code": null,
  "started_at": null,
  "ended_at": null,
  "diagnostics_path": null,
  "status": "NOT_RUN",
  "github_dispatch_performed": false,
  "application_acceptance": false
}
```

Fill fields only after execution. Include a separate entry for the negative T6 control and any reduced fixture. A validator PASS means static validation only; it does not certify runner policy, browser behavior, application security, or the complete GitHub service implementation.

## Evidence review discipline

Keep primary cause and downstream absence separate. For the r6 rejected dispatch, no host proof ran and no new application ledger was produced. Missing runtime artifacts are not evidence that the app exported incorrect images.

If a later dispatched run actually starts and a test asserts failure, preserve that failure; do not relabel it an environment block merely because an earlier run had a sandbox problem. If the runner fails before tests, preserve actual stage/exit and unreached statuses.
