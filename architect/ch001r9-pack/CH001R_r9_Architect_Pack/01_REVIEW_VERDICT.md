# Architect review — T8 hosted bootstrap failure

## Verdict

**CH-001R-r8 is not accepted as a hosted CI repair. Authorize CH-001R-r9 only.** Application acceptance remains `false`, accepted version remains `none`, and root state remains `awaiting_review`. This failure is in the CI bootstrap integration, not an observed application assertion or another observed Chromium launch failure.

## Verified identities and outcome

The repository handoff and the revision comparison identify T8 as `0144f6c41ae4c6143a2dc46fe22d59d453ce8763` and E8 as its evidence child `d04a0a70d890890132041061be87742396c1909e`. The fetched main ref resolves to E8. The hosted artifact records requested and actual checkout as T8, with E8 as the workflow definition. [S1, S2, S3]

| Item | Observed value |
|---|---|
| Hosted run / attempt | `34928718810` / `1` |
| Job | `104252240220`, `live-proof` |
| Event / GitHub conclusion | `workflow_dispatch` / `failure` |
| W8 blob | `fb4d3e4ee58eff81e43395fa6df99c53b65de417` |
| W8 file SHA-256 recorded in source handoff | `0ca1701d63be141fccff778c03e199cd3a55c5502d186000adf0e4bd545eac6c` |
| Primary stage | `actionlint-bootstrap` |
| Outer classification | `CI_BOOTSTRAP_FAILURE` |
| Bootstrap exit | `1` |
| Proof invoked / proof exit | `false` / `null` |
| New hosted application gate counts | unavailable, not copied from any local ledger |
| Artifact ID from GitHub | `10380711446` |
| Artifact name | `ch001-live-proof-34928718810-1` |
| Archive bytes | `5558` |
| Archive SHA-256 | `3c3905e781479fb627481c6bbf5a0bbea03ae1ab93d323cfda5b1475415db92f` |
| GitHub-listed expiry | `2026-09-29T04:24:53Z` |

The router message supplied artifact ID `10380718846`. GitHub's actual artifact listing and successful download use **`10380711446`**; name, length, and digest match the supplied values. Preserve that discrepancy in the receipt rather than silently changing historical text. [S3]

GitHub reports run creation at `2026-09-15T04:24:40Z`, which is September 14 at 11:24:40 p.m. in America/Chicago. These are source timestamps; no artificial review timestamp has been assigned.

The independent inspection checked ZIP integrity, member safety, eight unique members, archive length/digest, identities, failure fields, proof absence, and nonacceptance. See `evidence/historical-run-inspection.json`. The original ZIP bytes are preserved unchanged.

## R9-F01 — Confirmed caller/helper contract mismatch

The job defines `CI_BOOTSTRAP_REPORT` as a repository-relative path:

```text
artifacts/ch001r4/r4-<run>-<attempt>/bootstrap/public/bootstrap-result.json
```

The `actionlint_bootstrap` step then derives:

```bash
stage_report="$(dirname "$CI_BOOTSTRAP_REPORT")/actionlint-bootstrap.json"
```

That is still relative. It is passed to `node scripts/ci/actionlint-bootstrap.mjs --report "$stage_report" --print-bin`. The helper's `writeReport` requires `assertAbsolutePath(path, "Actionlint report path")`. The actual hosted log is:

```text
actionlint bootstrap failed: Actionlint report path must be an absolute path.
```

These observations directly explain the reported stage failure. Correct the caller's argument; do not relax the helper into accepting arbitrary relative paths. Keep the outer report's existing relative form and archive layout. [S4, S5, S8]

## R9-F02 — The rehearsal did not cover this exact argument

E8 reports successful clean/hosted-like no-node_modules checks and 58/58 CI tests. Its command record describes a direct helper invocation with `--report <prefix-evidence>/actionlint-bootstrap.json`, followed by separate validator and test commands. It does not document execution of the actual workflow step's shell body, report derivation, and outer `record-stage` call. [S6]

Those successful local helper checks need not be false to miss this bug. They are insufficient evidence for the caller integration. R9 must bind rehearsal inputs and shell commands to actual committed workflow bytes. A valid YAML/Actions definition also does not validate the runtime meaning of a helper's string arguments.

## R9-F03 — Report validation happens late

In inspected T8 code, report-path validation occurs in `finally` through `writeReport`. Before that, the provisioning path may create temporary directories, download and verify the tool, append `ACTIONLINT_BIN` to `GITHUB_ENV`, and set success bookkeeping. A report-write exception may then become the observable CLI failure. [S5]

This is a source-confirmed ordering risk, **not** proof that all those steps happened in this particular hosted run. No `actionlint-bootstrap.json` exists in the artifact, so the review does not claim archive/executable verification succeeded or failed there. R9 may make the narrowly related early input-validation correction without redesigning the provisioner.

## Evidence interpretation

Workflow validation, CI regressions, pnpm bootstrap, project install, Chromium install, sandbox qualification, Docker preflight, and bounded proof are skipped after the failed stage. No new application test failures or successes can be inferred. [S3]

The archive contains `sandbox-qualification.json`, but its status is `NOT_RUN`, with cleanup `NOT_RUN_NO_OWNED_POLICY`, null executable identity, and no observed browser sandbox. Its presence is cleanup output, not executed qualification. The requested `sandbox=true` field is not runtime success. Likewise, null policy observations do not establish measured policy equivalence. [S8]

The archived outer report still says `artifact_delivery=PENDING`: it was captured before the workflow's post-upload recording. GitHub's artifact listing and the successful byte-checked download establish delivery independently; do not rewrite the archived report to make it look post-upload. [S3, S8]

The old `CH-001R-r4` phase/run-key naming is a legacy reporting convention, not the demonstrated cause. Cosmetic renaming is out of scope for this repair.

## Limits of this review

Read-only GitHub retrieval, archive inspection, and isolated reference diagnostics were performed. Ten reference path checks passed under Node v22.16.0; they did not execute the complete bootstrap, real actionlint, project tests, sandbox policy, Docker, or a hosted run. Container-side source downloads failed DNS resolution and connector text materialization was unavailable; no full source checkout or application-test execution is claimed.

The next assignment specifies the real checks required from Luna/router. No repository write, workflow dispatch, rerun, policy mutation, or external-agent send occurred in this review.
