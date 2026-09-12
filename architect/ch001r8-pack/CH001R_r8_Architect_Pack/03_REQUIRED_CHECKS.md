# Required r8 checks — not replacement application gates

These IDs track only this repair. Preserve the 72 original CH001 IDs and historical outcomes. Do not treat a passing r8 helper checklist as passing application acceptance.

| ID | Required check | Evidence threshold |
|---|---|---|
| R8-T01 | Explain/reproduce the historical two-root-cause failure; keep T7 identities and result intact. | Source mapping plus hosted receipt; no invented app gate counts. |
| R8-T02 | Fresh Linux/amd64 install of pinned actionlint before any pnpm/application installation. | Real archive, expected/measured archive and executable hashes, exact version/path, nonzero commands actually run. |
| R8-T03 | Wrong archive digest, wrong executable/version, unsupported target, and bounded download failure. | Executable negative tests; no unverified binary runs, no green prerequisite, proof not invoked. |
| R8-T04 | Provisioning exports the same verified absolute tool path to subsequent consumers. | Separate process/step simulation; previous env entries preserved; no proof/sandbox tree creation. |
| R8-T05 | Real validator rejects complete frozen T6 and malformed/missing-step fixtures; accepts all current tracked workflows. | Same pinned tool; true semantic diagnostics; absent tool is not semantic rejection. |
| R8-T06 | Missing RUNNER_TEMP stays absent despite a valid hosted-like parent. | Actual child environment and nonzero initializer result; both env sentinels unchanged. |
| R8-T07 | Missing GITHUB_ENV stays absent despite a valid hosted-like parent. | Actual child result; synthetic parent file unchanged. This is independent of T06. |
| R8-T08 | Remaining required keys, inherited state values, invalid paths/newlines, IDs/attempts, and positive literal paths. | Existing coverage retained; exact-environment behavior and no policy/state creation. |
| R8-T09 | Restoring the old second-merge behavior is caught. | Negative/mutation regression demonstrating the precise causal defect, not a source-string assertion only. |
| R8-T10 | Full CI suite runs in clean and controlled hosted-like environments under Node 20.19.2, without node_modules. | Real actionlint; actual discovered/executed/passed/failed/skipped counts; zero unexpected skips/failures; parent sentinel preservation. |
| R8-T11 | Prerequisite/stage failures propagate through outer report, cleanup, upload and final verdict. | First failure retained; skipped/uninvoked proof keeps null exit and no fake report/ledger. |
| R8-T12 | Complete scoped commands and unchanged frozen surfaces. | lint/workflow lint/typecheck/build/unit/security/CI/diff checks; frozen install; hashes and scope diff. |
| R8-T13 | Publication tree revalidated before the one optional hosted dispatch. | Router confirms T8/E8/W8, exact workflow bytes, pinned validator and pre-install rehearsal. |
| R8-T14 | One fresh hosted T8 outcome and independently retrievable evidence. | Actual run/attempt/job/artifact receipt; bootstrap and proof distinguished; application remains unaccepted. |

R8-T13/T14 are router-owned and remain NOT_RUN in Luna's pre-publication handoff. Missing editing-host prerequisites must be completed by the authorized router before dispatch; a declared blocker is not a pass. For T14, distinguish “receipt complete” from “bounded proof successful”: a faithfully captured next failure does not become a successful proof.

## Final implementation commands

Run with pinned tools and save actual commands, timestamps, exits, and test output. Use the exact new provisioning command from the implementation; this packet does not pretend it already exists.

```text
node --check <new actionlint helper>
node --check scripts/ci/ci-result.mjs                 # when modified
bash -n <any new/changed shell helper>
<new verified actionlint provisioning command>
ACTIONLINT_BIN=<verified path> node scripts/ci/lint-workflow.mjs
ACTIONLINT_BIN=<verified path> node --test tests/ci   # before node_modules
<controlled hosted-like parent prefix rehearsal>   # before node_modules
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

Keep `ACTIONLINT_BIN` available in all positive validator-dependent commands. The actual shell/environment used is part of the evidence. `pnpm proof:ch001` or `pnpm verify:ch001` are not required repetitions on a known-ineligible editing machine for this r8 bootstrap repair. Do not claim they passed. The existing hosted bounded proof follows only after the router's single authorized dispatch.

## Evidence contents

Commit small sanitized records under `docs/evidence/CH-001R-r8/`: README, command table and usable logs, prerequisite report, workflow-validation report, clean-prefix and hosted-like-prefix reports, environment-isolation cases, pin/scope comparison, and `r8-results.json`. Keep raw private output in a run-owned ignored directory and never publish credentials or real GitHub command files.

Preserve the r7 archive as an original historical object. Its eight-member inventory and CRC/digest checks in this packet do not constitute a new T8 test run. Application JPEGs, previews, ZIPs, or gate results must come only from a real later proof.
