# Architect review — first hosted CH-001 live-proof attempt

## Verdict

**CI bootstrap repair is required. Application acceptance remains false.**

The earlier `NEEDS_WORKFLOW_DISPATCH` situation was resolved by the router. The subsequent dispatched run failed before the proof coordinator ran. There is no new hosted application-gate result to accept or reject. The former local `4 PASS / 0 FAIL / 68 NOT_RUN` ledger remains historical T3 evidence, not a result of this hosted run. [R1–R5]

The architect read the failed run metadata, complete job log, E3 workflow, T3 package manifest and Dockerfile, r3 handoff/evidence/state, and the relevant coordinator entry/finalization code. The failed artifact was downloaded, its SHA-256 was verified against GitHub metadata, and its member list and text were inspected. No application command, new workflow, repository write, or provider operation was executed in this review.

## Reconstructed sequence

| Observation | Evidence and interpretation |
|---|---|
| `main` points to E3 | GitHub branch metadata; E3's parent is T3. [R1] |
| Manual run exists | Run `34665615514`, attempt `1`, event `workflow_dispatch`, completed with `failure`. [R2] |
| Correct source selected | Log has `REQUESTED_SHA` and `CH001_IMPLEMENTATION_COMMIT` equal to T3; checkout's actual HEAD is T3. Workflow definition/head is E3. [R2–R3] |
| Project Node setup succeeded | Log reports Node `v20.19.2` and npm `10.8.2`. Do not confuse this with the separate Node runtime executing GitHub actions. [R2] |
| Package-manager startup failed | After `corepack enable`, `pnpm --version` tries to load a nonexistent cached `pnpm/12.3.4/bin/pnpm.cjs`; step exit is `1`. Frozen installation and Playwright installation were not reached. [R2–R3] |
| Docker and proof skipped | Both Docker probing and `pnpm proof:ch001` were skipped after the failed install step. No application-suite execution occurred. [R2] |
| Artifact upload succeeded | Artifact `10289206189`, name `ch001-live-proof-34665615514-1`, ZIP size 295 bytes. Its only member is `dispatch.txt`. [R2, R6] |
| Summary failed separately | Backticks inside double-quoted shell strings attempted to execute the SHA, run ID, and `2` as commands. An absent proof output was also defaulted to `2`, which became the summary step's final exit. That exit is not a coordinator result. [R2–R3] |

Artifact SHA-256:

```text
6286efa33c131379a7855b87890a9450ad11f9a704ec4ee68b50128b5f9188a2
```

The uploaded dispatch record establishes identity and that upload ran. It establishes no database, rendering, export, lifecycle, or browser behavior. Do not count the upload's successful step as a successful proof.

## Findings and authorized response

### CI-R4-01 — pnpm bootstrap is incompatible with the observed launch path

Confirmed: T3 pins `pnpm@12.3.4`; the workflow enables the Node-distributed Corepack and immediately invokes pnpm. The log then looks for a JavaScript `pnpm.cjs` file. Current pnpm 12 documentation describes a native executable, not that legacy entry point, and distinguishes installation requirements from runtime requirements. [R2–R3, R7, U1]

**Diagnosis:** the observed failure is strongly consistent with Corepack expecting the former JavaScript package layout while bootstrapping native pnpm 12. The precise bundled Corepack version, complete downloaded tarball contents, and implementation-level compatibility matrix were not independently reproduced in this review. Do not claim a verified cache corruption, registry compromise, unavailable pnpm release, or exact upstream Corepack fix.

**Decision:** retain the existing pins and use the official native release archive through a checksummed, run-owned bootstrap. This bypasses the failed entry-point assumption without changing the package manager or application runtime. The native release and asset digests were retrieved from official metadata. [U2–U3]

A naive `npm install -g pnpm@12.3.4` under the existing Node 20 environment is not the selected fix: pnpm's current documented npm installer requires Node 22.13 or newer. This does not imply that the standalone pnpm executable needs that Node version. [U1]

### CI-R4-02 — Docker repeats the same fragile bootstrap

Both T3 Docker stages enable Corepack; the build uses pnpm for installation/build, and the final container command also calls pnpm. Fixing only the Actions shell would leave those paths unqualified. [R8]

Use a consistent pinned native installation in build and runtime, ensure it is executable by the runtime's non-root user, and prove that invoking it does not trigger a first-start network download. Do not reintroduce the earlier missing browser-library or root-user issues.

### CI-R4-03 — summary values are being executed rather than printed

The current `echo "Implementation: \`$REQUESTED_SHA\`"` pattern performs command substitution. Replace it with literal format strings plus quoted data arguments, or a dependency-free structured summary writer. Test the actual writer, not a source-string search. [R3]

Separate formatting from the terminal workflow verdict. An empty proof output means the proof was not invoked; it does not mean the coordinator measured an unavailable environment and returned 2.

### CI-R4-04 — dependency-bootstrap failures have almost no downloadable diagnostics

The only retrieved member is `dispatch.txt`. The r3 coordinator cannot create its detailed reports before its npm dependencies exist because it imports Playwright and other project modules at startup. [R6, R9]

Add an outer, dependency-free bootstrap record, distinct from the coordinator's `proof-result.json`. It must record stage, outcome, actual exit, identities, and whether proof was invoked. Preserve useful failure details without fabricating suite reports or an export. This is a bounded diagnostics repair, not a second proof engine.

### CI-R4-05 — publish and dispatch must move to the new exact implementation

The CI and Docker changes are implementation changes. They require a new T4 commit. Dispatch a newly created run with `implementation_sha=T4`; do not redispatch T3 and assume the checkout somehow contains T4's Dockerfile or scripts. GitHub documents that reruns retain the original run's SHA/ref. [U5]

Record workflow-definition SHA, requested SHA, actual checkout SHA, workflow blob identity, and any later evidence commit separately. E3 being the original workflow head is not itself a defect.

### CI-R4-06 — current operational state must acknowledge the completed attempt

The E3 handoff/index/state are truthful records of the moment before publication, but their next-action prose now says no run exists and publish/dispatch is pending. Preserve those historical records and add the failed hosted-run receipt to r4 state/evidence. The next action is repair, not another attempt to resolve the already-resolved T3 push. [R4–R5, R10]

## Limits of this review

The original R01–R11 and r3 U01–U08 are not closed here. This review has not validated their runtime fixes. A successful package install proves package installation; a successful bounded proof proves its executed slice. Neither independently satisfies all 72 parent gates.

The new instructions deliberately avoid runtime or dependency upgrades, broader UI repairs, new provider connections, new deployment routes, or modifications to the original acceptance contract. If an actual dependency-engine or archive-integrity problem remains after the selected bootstrap, return its measured details instead of silently changing the plan.
