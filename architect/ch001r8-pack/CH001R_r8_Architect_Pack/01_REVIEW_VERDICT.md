# Architect review — T7 hosted CI bootstrap failure

## Decision

CH-001 remains unaccepted. Authorize **CH-001R-r8** to address two CI-harness problems together: actionlint is not provisioned before the tests that use it, and a test helper reintroduces intentionally deleted environment variables. Repairing only the first would leave the second failure present.

The workflow-definition repair from r7 has made measurable progress: GitHub accepted a fresh manual dispatch, allocated a job, checked out the requested T7 source, and completed the identity/environment setup and Node setup. This is no longer the r6 pre-run workflow rejection. It is also not a new Chromium sandbox failure: no browser installation, sandbox qualification, or application proof was reached. [S1–S4]

## Bound identities

| Field | Observed value |
|---|---|
| Repository | `klole/reel-farm` |
| P7 | `9fb748ef6b22a21ed24a8a5fa66e4ec1463a049a` |
| T7 | `6b02857401a9b1e81e1bd36d5a4418f90903adcb` |
| T7 tree | `fdbe7da15964659d4e2514580f6606f5731790ce` |
| E7 / definition commit W7 | `6e4f9b3d288b7177ebfc8b49ff3c833610640060` |
| E7 tree | `b5a3861114bdde0b6c629d2fda424982226bcc67` |
| Workflow blob | `2070e80be5355537631a7b2cf833eeb0a6cf28cb` |
| Workflow SHA-256 | `98808688f0261296f6c0ddd0b3b34b04e67bc2d74735660512ab6c1852849c51` |
| Fresh manual run / attempt | `34678495442` / `1` |
| Job | `103512556268` |
| Artifact | `10293345418`, `ch001-live-proof-34678495442-1` |
| Artifact bytes / SHA-256 | `7505` / `c623cdbadeee57182434cc360c8a098bac56a1ad0db0cdc17219c837b3c7c37a` |

E7 was the observed remote `main` at review. The next agent must record its own actual base and verify any later router/packet-only descendants instead of resetting the repository to this record. T8/E8/W8 do not exist in this packet; report their actual identities when created. [S1, S4]

## Historical hosted result

The first failing job step was **Run dependency-free CI repair regressions**. Its `node --test tests/ci` invocation discovered 50 tests: 45 passed, 5 failed, and none were skipped. The failed cases were R7-T01, R7-T02, R7-T03, R7-T04, and R7-T07. These are CI-helper tests, not application acceptance gates. [S2, S3]

The outer report records `CI_BOOTSTRAP_FAILURE`, `primary_stage=ci-helper-regressions`, and bootstrap exit `1`. It records `proof_invoked=false` and `proof_exit_code=null`. There is no fresh hosted application gate ledger, no application ZIP, and no screenshot/preview evidence for this run. Do not replace the absent hosted gate counts with 4/0/68 from an earlier local proof, or with 45/5 from the CI test runner. [S3]

The cleanup step returned successfully with “no owned policy record.” That is a safe no-policy cleanup observation, not proof that a policy was installed and later removed. The archived CI result still says artifact delivery `PENDING`, because that file was uploaded before the later delivery receipt was written. GitHub's artifact metadata and the independently verified archive establish delivery; neither the archive nor its JSON was modified to insert a later status. [S2, S3]

## R8-F01 — Missing actionlint prerequisite

**Confirmed by hosted output and source.** R7-T02 reports: “No usable actionlint executable found; install pinned v1.7.7 or set ACTIONLINT_BIN.” R7-T01 receives the wrapper's tooling-unavailable code 2 instead of the expected semantic-rejection code 1. R7-T03 and R7-T04 cannot obtain real validator diagnostics. [S2, S5, S6]

The published workflow runs the complete CI module before native pnpm bootstrap and project installation. R7's new module invokes the real actionlint binary, but the workflow does not provision that binary or set `ACTIONLINT_BIN` before the module runs. The local handoff used an explicit local `ACTIONLINT_BIN`; that path is not transferred to a fresh runner. The description “dependency-free” ceased to be accurate for the whole suite once it acquired this external-tool dependency. [S4–S8]

**Required disposition:** provision the existing pinned validator before the first consuming test, export its verified absolute path, and execute the normal semantic wrapper against the current workflow. Do not skip semantic tests, redefine exit 2 as an expected semantic failure, depend on an image's incidental PATH contents, or upgrade actionlint to solve provisioning.

## R8-F02 — Prepared fixture environment is merged twice

**Confirmed by source, hosted failure, and isolated local reproduction.** `makeRuntimeFixture()` creates an environment with `withEnvironment()`. For missing-input cases it deletes a key. The fixture passes that completed object to `run()`, which calls `withEnvironment()` again and starts from the real `process.env`. An absent key in the completed fixture has no deletion marker, so a hosted parent value returns. [S5]

In the hosted failure, R7-T07 labels a case “missing RUNNER_TEMP,” but the initializer receives the real parent's valid `RUNNER_TEMP` and exits 0. The assertion requiring a failure then fails. On a machine without that parent variable, the same flawed test can pass. This is a test-isolation bug, not proof that the production initializer fails to validate a genuinely absent variable. [S2, S5, S7]

There is an adjacent evidence-integrity risk: deleting `GITHUB_ENV` in a fixture and remerging the parent can direct an append into the real parent environment file. The hosted test stopped at its earlier failing case, so this review does not claim that happened in the actual Actions job. An isolated reproduction against the byte-verified T7 initializer did demonstrate the write to a **synthetic** parent file. [S10]

**Required disposition:** distinguish an override map from an already-complete environment. Construct fixture environments once and pass them to child processes exactly. Never repair this by weakening the initializer's missing-input validation, unsetting production runner variables globally, or changing the expected assertion to accept exit 0.

## Architect verification and limits

The downloaded archive matched GitHub's byte count and SHA-256. ZIP CRC checks passed. All eight members were inventoried, including the checked-out bootstrap report, cleanup record, sanitized helper log, and early fallback records. There was no proof report or application gate ledger. See `evidence/historical-run-inspection.json`.

Five isolated environment diagnostics ran under **Node v22.16.0**, not the project's pinned Node 20.19.2. The initializer bytes matched Git blob `0e4dd049b5a7d77382ae05cd0a3710812d184b87`. The reproduction used equivalent environment-merging logic, not an execution of the repository's full test suite. It confirmed both reintroduction scenarios, rejection with exact child environments, and a positive literal-path case. See `evidence/architect-environment-reproduction.json`.

This review did not install or run actionlint, execute pnpm/application suites, create a hosted job, modify host sandbox policy, push repository changes, or send anything to Luna/router. Container access to public GitHub via git was unavailable due to DNS resolution; source/artifact review used the connected GitHub tools. R8 must obtain its own pinned-tool and Node 20 evidence before publication.
