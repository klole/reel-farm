# R4 acceptance and evidence contract

## 1. Three different meanings of completion

**Luna implementation ready:** the bounded code changes and feasible regression tests are committed; unavailable hosted checks are identified; T4/E4 are ready for the router. This can be `READY_FOR_ROUTER_PUBLISH`, not a live pass.

**CI repair demonstrated:** the new exact-SHA hosted run passes the actual bootstrap, summary, and evidence delivery checks. If the existing application proof then fails, report that new boundary. Do not hide it, but also do not incorrectly say the package-manager fix never worked.

**Application acceptance:** still false until a separate architect decision against the original CH-001 contract. The r3 coordinator explicitly implements a bounded profile and can return 0 with parent gates outstanding. This packet does not change that behavior or authorize calling a partial ledger fully accepted.

The 24 `CI4-*` checks below are a separate repair checklist. They do not add to, renumber, replace, or inflate the 72 `CH001-*` gates. Initial statuses in `templates/CI4_RESULTS.template.json` are NOT_RUN because the packet author has not run Luna's implementation.

## 2. Repair checks

| ID | Check | Required evidence |
|---|---|---|
| CI4-001 | Correct base, original acceptance contract preserved, allowed-scope diff | Actual base/T4/tree; diff and original reference hash |
| CI4-002 | Pnpm pin and official platform artifact are bound to the project pin | Manifest, upstream provenance, pin-drift rejection test |
| CI4-003 | Wrong digest / unsafe archive / unsupported target rejected before execution | Executable negative helper tests; no execution side effect |
| CI4-004 | Bootstrap works without project dependencies or usable Corepack and is idempotent | Fresh owned-directory install log and repeat-install check |
| CI4-005 | Current and subsequent shells use the verified native executable | Resolved path, version, executable metadata, PATH test |
| CI4-006 | Node/pnpm/dependency intent unchanged; no insecure flags or hidden fallback | Node/pnpm output; package/lockfile diff; policy assertions |
| CI4-007 | Hosted frozen project installation succeeds with no tracked dependency mutation | Real hosted step log/exit and before/after lock hash |
| CI4-008 | Project-pinned managed Playwright browser installation and qualification run | Real version/path/launch report, not system-Chrome substitution |
| CI4-009 | Final Docker image builds and native pnpm works non-root without network bootstrap | Actual image identity, user, network-disabled version probe; shipped-image result |
| CI4-010 | Successful summary prints exact literal identities without evaluating them | Executed writer test with stdout/stderr/result assertions |
| CI4-011 | Bootstrap failure before proof yields actual failure, invocation false, proof exit null | Dependency-free fixture test and hosted evidence on real failure when applicable |
| CI4-012 | Invoked proof exit 1 is retained and final verdict fails | Executed result-classifier test |
| CI4-013 | Invoked proof exit 2 is distinguished from proof never invoked | Executed classifier test; actual prerequisite detail if used live |
| CI4-014 | Exit 0 plus missing/malformed/stale/wrong-identity proof report is rejected | Negative report-validation tests; nonzero terminal verdict |
| CI4-015 | Summary treats backticks, dollar substitutions, percent signs and spaces as data | Executed hostile-value fixture with no command/marker side effect |
| CI4-016 | Early diagnostics need no npm-installed dependency and survive bootstrap failure | Run with project modules absent; valid explicit outer JSON record |
| CI4-017 | Only sanitized public evidence is selected; private paths/credentials excluded | Artifact allowlist/path tests and actual downloaded archive inspection |
| CI4-018 | Uploaded evidence is retrievable and its archive/payload hashes are checked | Actual run/attempt/job/artifact IDs, download record and digest comparison |
| CI4-019 | New run explicitly requests and checks out T4; workflow identity is also recorded | Actual dispatch/bootstrap/proof identity chain and workflow blob/hash |
| CI4-020 | Existing bounded proof executes its real suites and produces its required runtime artifacts, or returns an explicit failure | Actual discovered/executed/skipped counts, exits, ZIPs/images/hashes/lifecycle data; do not mark PASS on a failure |
| CI4-021 | New gate records derive only from fresh evidence; historical local and hosted records stay separate | Fresh ledger with exactly 72 original IDs when coordinator produced it; unchanged historical files |
| CI4-022 | Workflow-capable publication and manual dispatch remain router-only | Handoff/action declaration; no credentials transferred or embedded |
| CI4-023 | No providers, publishing, billing, feature expansion, release, or v0.2 changes | Diff and external-action record |
| CI4-024 | Handoff identifies actual commits/results and keeps awaiting_review / none | Handoff/state/index consistency; no invented CI identities |

A CI4 check can be NOT_RUN when its required host is unavailable; that is not a pass. It can be FAIL when an assertion actually fails. Some checks are local helper behaviors and can pass before hosted dispatch. Live image, browser and artifact cases cannot be closed by source inspection. Missing evidence must not be relabeled a runtime defect without an executed failing assertion.

## 3. Regressions for the two observed bugs

### Native bootstrap

Test package-manager startup from a clean PATH or with a deliberately unusable Corepack shim earlier on the inherited PATH. The helper must not call that shim. Test a wrong expected checksum and confirm the archive is not executed. Test a mismatched project packageManager field. Test repeated setup into the same owned destination. Test a new shell resolves the same native version.

Do not use a prewarmed developer cache as the only positive bootstrap evidence. Do not turn off package-manager pin checking to get past the reproduction. Do not call a fake test executable a successful real native installation; mocks belong only to installer failure-path tests and must be labeled.

### Summary and classification

Test the corrected writer with actual T3/E3 strings from the failed run. Then use controlled malicious-looking string fixtures as data, for example text containing a backtick command, `$(...)`, and `%s`. No such command may execute and no marker file may appear. This is a local test; the production workflow must independently reject an invalid SHA before checkout.

For the absent-proof fixture, set installation outcome failure/exit 1 and no coordinator output. Assert `proof_invoked=false`, `proof_exit_code=null`, final failure, and a primary install error. This fixture specifically prevents the old bug of defaulting missing output to 2.

Test proof exits 0, 1, 2, and unexpected codes; exit 0 with malformed/missing/wrong-source reports; artifact delivery failure; summary formatter failure; and a normal success. The final result must never become green simply because the summary printed successfully.

## 4. Required outer evidence

`bootstrap-result.json` is an outer record; it is not a renamed application proof report. The exact schema may be implemented narrowly, but it must preserve these meanings:

```json
{
  "schema_version": 1,
  "record_kind": "CI_BOOTSTRAP_OBSERVATION",
  "phase": "CH-001R-r4",
  "repository": "klole/reel-farm",
  "run_id": "ACTUAL_RUN_ID",
  "run_attempt": 1,
  "requested_implementation_sha": "ACTUAL_T4",
  "actual_checkout_sha": "ACTUAL_CHECKED_OUT_SHA_OR_NULL",
  "workflow_definition_sha": "ACTUAL_WORKFLOW_SHA",
  "bootstrap_status": "PASS_OR_FAIL_OR_NOT_RUN",
  "failed_stage": null,
  "bootstrap_exit_code": null,
  "proof_invoked": false,
  "proof_exit_code": null,
  "application_acceptance": false,
  "accepted_application_version": "none",
  "stages": []
}
```

This is a field illustration, not a populated run result. Use JSON `null`, not the string `null`, where an identity or exit is unknown. Include real UTC start/end timestamps, actual node/pnpm paths and versions, archive/version/digest provenance, and command outcomes in the implemented schema. Keep bootstrap stage success separate from a subsequent proof failure.

On a failure before source verification or Node setup, make unknown fields null and state why. Avoid treating unvalidated input as the actual checked-out SHA. Outer diagnostics can be written even when no coordinator report exists. They must not invent a `4 PASS` ledger from the earlier local run.

`ci-result.json` or equivalent records the aggregate pre-upload outcome. Artifact upload IDs/digests are only known after upload; preserve those in step outputs/summary and the router's later receipt. Do not try to place an archive's own final checksum inside that same archive or change hashed proof files afterward.

## 5. Required bounded-proof evidence when the coordinator actually runs

Reuse the r3 public evidence schema and files, including `proof-result.json`, `environment.json`, command/suite reports, fresh 72-ID gate ledger, verifier record, sanitization record and artifact manifest. The existing live profile names these required runtime artifacts:

```text
a-little-room-to-focus.zip
alternate-4x5.zip
journey-hashes.json
lifecycle.json
same-data-restart.json
```

Retain the actual screenshots/image outputs required by the existing journey. A small bootstrap artifact cannot substitute for them. Validate seven-slide order, output dimensions, preview/export equality and actual lifecycle assertions through the existing tests; do not manufacture these artifacts separately outside the app to satisfy a filename check.

Preserve discovered/executed/passed/failed/skipped counts and test identities. A zero-test suite is not a live PASS. A passing isolated renderer fixture is not an authenticated application export. Retain source identity on every report or its unambiguous enclosing manifest.

## 6. Gate-history policy

The original CH-001 record remains `0 PASS / 0 FAIL / 72 NOT_RUN`. The r3 local preflight remains `4 PASS / 0 FAIL / 68 NOT_RUN`, specifically its four source-only IDs. The first hosted attempt has **no generated coordinator gate ledger**; it failed before coordinator startup. These three observations are not interchangeable.

After T4, regenerate whatever source checks and live gates actually execute. Do not inherit PASS simply because a file resembles T3. Do not merge a T3 local ledger into a T4 hosted ledger. The new source-level CI4 check results and the 72 parent-gate results must use separate keys/counts.

No runtime or manual gate may become PASS from a build log alone. No unexecuted original R/U finding is closed by a successful installer. A green bounded coordinator may still leave manual/visual/security/recovery/full-acceptance requirements outstanding; keep those open.

## 7. Evidence retention and security

Download and inspect the hosted archive before returning its receipt. Record its actual ID, name, byte size, hash, run attempt, created/expiry time, and member inventory. Validate inner evidence paths and hashes, not just outer upload success. Retain a durable sanitized copy through the project's approved handoff process before expiry where needed.

No credentials, cookie jars, auth storage state, database URLs, private fixtures, raw full environments, or private proof subtrees may be published. Use synthetic/local demo data only. A failed sanitization or packaging assertion must remain visible as an evidence failure, not disappear into a successful upload step.

The author-provided pin manifest and prior-run record are inputs to the repair, not its execution evidence. The packet's own validation report is a document check, never an application or CI test report.
