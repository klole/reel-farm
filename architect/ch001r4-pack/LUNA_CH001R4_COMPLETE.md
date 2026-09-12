# CH-001R-r4 — Complete architect review and Luna MAX CI repair packet

**PACKET COMPLETE — ready for router save and Luna MAX launch.**

Application acceptance remains false. This is a reviewed assignment, not a new CI result.

## Navigation
- [00_README.md](#document-00-readme)
- [01_ARCHITECT_REVIEW.md](#document-01-architect-review)
- [02_LUNA_MAX_ASSIGNMENT.md](#document-02-luna-max-assignment)
- [03_ROUTER_DISPATCH_RUNBOOK.md](#document-03-router-dispatch-runbook)
- [04_ACCEPTANCE_AND_EVIDENCE.md](#document-04-acceptance-and-evidence)
- [05_HANDOFF_TEMPLATE.md](#document-05-handoff-template)
- [06_SOURCES.md](#document-06-sources)
- [LUNA_START_PROMPT.md](#document-luna-start-prompt)

---

<a id="document-00-readme"></a>

# CH-001R-r4 — CI bootstrap repair and bounded live-proof redispatch

**Packet status: COMPLETE — ready for the router to save and launch Luna MAX.**

This is an architect-authored instruction packet, not an implementation, dispatch, test pass, or application acceptance. It responds to the failed first hosted run, not to the earlier resolved push restriction.

| Control | Value |
|---|---|
| Repository | `klole/reel-farm` |
| Target product version | `0.1.0` — still unaccepted |
| New bounded assignment | `CH-001R-r4` |
| Reviewed implementation T3 | `0b79ed07a25a618ab4da2bf56a2fed6047398cb5` |
| Reviewed evidence E3 / observed main | `4cf020317cfc2e8755f35ee6da10f7397c8676f2` |
| Failed hosted run / attempt | `34665615514` / `1` |
| Failed job | `103476773609` (`live-proof`) |
| Existing North Star | NS-0.2; SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d` |
| Current architect decision | `CI_BOOTSTRAP_REPAIR_REQUIRED` |
| Root state / accepted version | `awaiting_review` / `none` |
| Who implements | Luna, highest available / MAX effort |
| Who publishes workflow changes and dispatches | Kyle's authorized router/workflow-capable GitHub path |

## The objective

Replace the broken Corepack-mediated pnpm launch in the hosted runner **and** Docker build/runtime path; repair summary quoting and failure classification; generate useful sanitized evidence even before project installation succeeds; then run the existing bounded proof against the exact newly committed implementation.

Do not redesign the application. Do not reopen the earlier broad repair assignment. Do not require all 72 mature checkpoint gates to pass merely to report progress on this narrow CI repair. Equally, do not interpret a green bounded proof as v0.1 acceptance.

## Reading order

Read [the review](#document-01-architect-review), [the Luna assignment](#document-02-luna-max-assignment), [the CI acceptance/evidence contract](#document-04-acceptance-and-evidence), and [the handoff template](#document-05-handoff-template). The router uses [the dispatch runbook](#document-03-router-dispatch-runbook). [Sources](#document-06-sources) distinguish inspected repository material, upstream documentation, and untested implementation proposals.

`reference/REVIEWED_RUN.json` is an architect record of the failed historical run. `reference/FAILED_RUN_DISPATCH.txt` is the exact text extracted from its artifact. Neither is new application proof. `reference/PNPM_NATIVE_RELEASE_PINS.json` provides researched release metadata; its native binaries have not been executed by the architect.

## What changed since the previous request

T3 and E3 are published. The workflow was dispatched with T3 and checked out T3 successfully. The blocking stage is now package-manager startup, not workflow authorization. Run metadata having E3 as its head while source checkout is T3 is expected here; both identities must remain explicit.

The editing box still lacks workflow-write scope. That is an execution-role constraint, not authorization to move a credential onto that box or to create a different publishing route. Preserve the working router boundary.

## Non-negotiable scope

No fal.ai, ScrapeCreators, Pinterest, TikTok, publishing, scheduling, analytics, billing, video, public deployment, releases, or v0.2 work. No new credentials. No insecure browser flags. No weakening the original 72-gate contract, strict verifier, or evidence requirements. No force push or history rewrite.

## Expected outputs

Luna supplies a small reviewed diff, actual local check results, a new implementation commit T4, and a subsequent evidence/documentation commit E4. The router publishes the preserved commits and performs one deliberate fresh workflow dispatch with T4. A run receipt and downloaded artifact are returned for architect review. If the live proof then exposes an application defect, capture it and stop at that boundary rather than growing this assignment into an application rewrite.


---

<a id="document-01-architect-review"></a>

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


---

<a id="document-02-luna-max-assignment"></a>

# Luna MAX assignment — CH-001R-r4

## 1. Mission and role

Implement the narrow CI/bootstrap/reporting repair described here. Do not return another plan or merely modify the workflow's error message. Leave the existing bounded r3 proof callable and its proof/acceptance distinction intact.

The router owns workflow-capable publication and Actions dispatch. Work in the supplied repository, create auditable commits, and return a dispatch-ready handoff. Do not acquire, copy, request, or persist Kyle's workflow-scoped credential. Do not attempt to work around the editing box's OAuth scope by recreating the repository or removing the workflow from the commit.

The product target stays `0.1.0`; `application_acceptance=false`, accepted version `none`, root state `awaiting_review` throughout.

## 2. Preflight and authority

Read the repository's standing agent instructions, r3 handoff/index/state, this packet, `.github/workflows/ch001-live-proof.yml`, `package.json`, `.nvmrc`, `.tool-versions`, `.npmrc`, `Dockerfile`, and the current r3 coordinator/harness. The frozen original CH-001 acceptance specification and North Star remain authoritative for product requirements.

Record real HEAD, branch, relevant dirty/untracked paths, and the baseline. This review's observed remote base is E3 `4cf020317cfc2e8755f35ee6da10f7397c8676f2`. The router may add this packet in a docs-only commit P4. Preserve P4 and start from it; record the full SHA rather than pretending E3 is still HEAD. Verify that any intervening differences are only authorized material. Do not reset, stash, delete, or overwrite unrelated user work.

T3 is `0b79ed07a25a618ab4da2bf56a2fed6047398cb5`. Prior r3 packet/companion commits are `04b85402c03404fc9f707983594cb796525f6563` and `a5afe2d8d1bc7741a0276513f3f1111d3ff587ae`; they are history, not the new dispatch target.

Do not repeatedly attempt Docker or loopback setup on the known restricted editing host. Record a fresh factual preflight as necessary, run checks that are possible, and prepare the exact hosted route for the router.

## 3. Allowed diff

Primary allowed files are the existing workflow, Dockerfile, dedicated bootstrap/summary/evidence helpers under `scripts/ci/` or an equally narrow location, their focused tests, and r4 handoff/state/evidence documentation.

A small checked-in native-pnpm release manifest is allowed. A dedicated package script for CI helper tests is allowed. Preserve application package versions, Node pin, pnpm version, lockfile, workspace resolutions, and the original test cases by default. Any necessary change to a previously required evidence path must be documented and tested without changing what a PASS means.

Do not change `apps/web`, business-domain packages, authentication semantics, renderer policy, database schema, or existing application tests merely to obtain a green hosted result. If execution exposes a defect there, stop with a precise failure receipt for the next architect review. A narrowly necessary Docker bootstrap or helper wiring fix is within scope; an application repair is not automatically authorized.

## 4. Package-manager decision

### 4.1 Preserve the existing qualified intent

Retain `pnpm@12.3.4`, Node `20.19.2`, the project lockfile, and pinned Playwright package. Replace Corepack as the required launcher in this proof/deployment path. There is no authorization for `latest`, an automatic downgrade to pnpm 10/11, an application Node-major upgrade, switching to npm/yarn, regenerating the dependency graph, or disabling integrity/engine checks.

The default implementation is a shared native-release bootstrap used by Actions and Docker. It downloads a fixed official archive, verifies its checked-in digest **before extraction/execution**, installs only into an explicitly owned tool directory, and verifies the installed version. Upstream metadata inputs are in `reference/PNPM_NATIVE_RELEASE_PINS.json`.

For the required Ubuntu/bookworm Linux x64 glibc target:

```text
version: 12.3.4
asset: pnpm-linux-x64.tar.gz
asset_id: 544431952
url: https://github.com/pnpm/pnpm/releases/download/v12.3.4/pnpm-linux-x64.tar.gz
sha256: 9705e5704b4679fb503c963a18d1ac4f105e39aafafca8a2ed346facdf820cd0
```

The Linux arm64 glibc metadata is supplied to avoid hardcoding the wrong binary for an arm64 build. It is not a claim of an executed arm64 qualification. Preserve supported target behavior or explicitly document the tested platform boundary. Never execute an x64 asset on an unrecognized architecture and call the resulting failure an unavailable database.

The architect inspected release metadata, not the native archive contents. Inspect the verified tar member layout yourself before choosing an extraction path. Do not assume the old uncompressed asset filename or guess the binary's member path.

### 4.2 Required installer behavior

The helper must operate without any project dependency or working pnpm installation. Shell and the pinned Node runtime's standard library are acceptable. It must:

- Read and validate the project package-manager pin and compare it with the checked-in native-release manifest; reject drift rather than silently selecting another release.
- Select a supported OS/architecture/libc target explicitly. The required hosted target is Linux x64 glibc. Reject an unsupported target before execution with an actionable error.
- Use HTTPS downloads with bounded retries/timeouts and validate the downloaded archive's SHA-256 against the checked-in pin. A digest fetched dynamically beside the same untrusted download is not a substitute for the pin.
- Extract only into a new run-owned temporary directory after rejecting unsafe archive members, absolute paths, traversal, and unexpected special files/symlinks. Copy/install the verified regular executable into the owned destination. Do not extract over repository or system directories.
- Be idempotent for the same verified version, clean up only its own temporary files, and avoid deleting global caches or preexisting developer tool installations.
- Put the native executable ahead of Corepack shims on PATH. Refresh shell command lookup where needed. Verify `command -v pnpm`, the resolved executable, `pnpm --version`, and `node --version` from the same shell that will install the project.
- Write the PATH update to `GITHUB_PATH` for subsequent workflow steps, and explicitly export it for the current shell. Do not assume writing an environment file changes the running shell.
- Never invoke an arbitrary pnpm already on PATH as part of the initial validation. Bootstrap first, then use the verified absolute path.

If the actual official archive does not match the researched pin, stop with an integrity error and evidence. Do not replace the pin with the downloaded hash merely to proceed. If native pnpm exposes a genuine incompatible lockfile or package-engine issue, report the failing package/version/constraint and stop as `BLOCKED_DEPENDENCY_COMPATIBILITY`; do not broadly upgrade dependencies.

The newer upstream pnpm setup action is an alternative for a separately justified implementation, but adding it is not necessary here. The selected shared native helper keeps Actions and Docker on the same path and avoids an unqualified second installer.

### 4.3 Actions installation sequence

Use the existing pinned Node setup to select `.nvmrc`; do not enable package-manager caching that invokes pnpm before bootstrap. Then:

1. Bootstrap and attest the native pnpm executable.
2. Run `pnpm install --frozen-lockfile` from a clean workspace. Fail on tracked package/lockfile mutations; preserve the lockfile hash in the report.
3. Install the project-pinned managed Chromium through the locally installed Playwright CLI; do not replace it with system Chrome to bypass a failure.
4. Record non-secret version/path facts and installation exit codes separately.
5. Run Docker/Compose preflight and the existing bounded coordinator only after installation prerequisites succeed.

Separate package-manager startup, project install, and browser install into identifiable stages so a failure is not ambiguously attributed to the whole block. Preserve the existing standard runner, manual trigger, timeout bound, concurrency policy, read-only repository token, `persist-credentials: false`, and exact-SHA validation. No insecure Node-action override is permitted.

### 4.4 Docker build and runtime

Remove dependence on `corepack enable` from both stages of the shipped image. Install the native pnpm into a stable image-owned location, such as `/opt/pnpm/bin`, and keep it on the final image PATH. Copy the verified executable and any necessary runtime resources into the runtime stage; do not rely on a root user's package-manager cache surviving a multi-stage build.

Retain r3's browser operating-system dependencies, managed browser installation, non-root runtime, sandbox protections, and worker command. Verify the native binary can run as the same user used by web/worker. The final image must be able to execute `pnpm --version` with networking disabled; it must not bootstrap a package manager on first application startup.

Use the same release manifest as CI, copied into the build context before its installer runs. Check the Docker build context and `.dockerignore`; do not accidentally omit the helper or manifest. Never add tokens, private registry credentials, or a developer cache to the image.

The required shipped-image build is part of the hosted bounded proof. A successful version print is necessary but is not proof that migrations, the worker, or rendering work.

## 5. Summary and exit semantics

Replace dynamic backticks in double-quoted strings with literal formatting and quoted values. For example:

```bash
{
  printf '%s\n\n' '## CH-001R-r4 bounded CI proof'
  printf 'Implementation: `%s`\n' "${REQUESTED_SHA:-unknown}"
  printf 'Workflow definition: `%s`\n' "${CH001_WORKFLOW_SHA:-unknown}"
  printf 'Run: `%s`\n' "${CH001_RUN_ID:-unknown}"
  printf 'Proof invoked: `%s`\n' "${PROOF_INVOKED:-false}"
  printf 'Coordinator exit: `%s`\n' "${PROOF_EXIT_CODE:-not-run}"
  printf 'Application acceptance: `%s`\n' 'false'
} >> "$GITHUB_STEP_SUMMARY"
```

This is a formatting illustration, not the complete workflow or verdict evaluator. Feed Actions expressions through explicit `env` fields instead of inserting arbitrary values into shell program text. Do not use `eval`, interpolate data into a `printf` format string, or construct shell commands from summary data.

The final verdict must distinguish:

| Situation | Required record | Final workflow behavior |
|---|---|---|
| Installer/project install/browser setup fails | Actual failing stage and exit; `proof_invoked=false`; proof exit `null`; `CI_BOOTSTRAP_FAILURE` | Nonzero; preserve the bootstrap failure as primary |
| Docker prerequisite is genuinely unavailable before assertions | Measured probe and blocked classification; whether the coordinator actually ran | Nonzero; do not claim application failure or PASS |
| Coordinator invoked and exits 2 | `proof_invoked=true`, actual exit 2, `BLOCKED_ENVIRONMENT` if supported by its report | Nonzero |
| Coordinator invoked and exits 1 | `proof_invoked=true`, actual exit 1, failed assertions/stage | Nonzero; `LIVE_PROOF_FAILED` |
| Coordinator exits 0 but report is missing/malformed/wrong identity | `EVIDENCE_INVALID`; actual exit remains 0, validation fails separately | Nonzero |
| Coordinator exits 0 with validated bounded results/artifacts | `LIVE_PROOF_READY_FOR_REVIEW`; application acceptance false | May be green for this bounded job only |
| Artifact delivery fails | Preserve proof outcome; record transport failure separately | Not successful proof delivery; nonzero final job |

Never coerce absent output to coordinator exit 2. Never make a summary-formatting failure overwrite the earlier cause. Never use an unconditional `exit 0` at the end of the job. It is acceptable to capture a coordinator exit temporarily so always-run evidence steps can execute, provided a separate final verdict enforces the captured result and evidence validity.

## 6. Dependency-free early evidence

Introduce an outer bootstrap report writer using tools available before `pnpm install`. It may not import tsx, Playwright, Zod, or another npm dependency. It must run after an install failure; handle unavailable Node setup/checkout gracefully using an inline runner-standard-library fallback or a minimal safe record. If the runner is forcibly terminated before finalization, do not promise an artifact that did not upload.

Keep a small, separate `bootstrap-result.json` / `ci-result.json` schema. Do not forge the coordinator's `proof-result.json`, suite counts, or gate ledger when the coordinator was never invoked. The report must include run/attempt, requested source, actual checkout when known, workflow definition, stage outcomes/exit codes, proof invocation boolean, nullable proof exit, acceptance false, and sanitized error classification.

Suggested location structure:

```text
artifacts/ch001r4/<unique-run-id>/
  bootstrap/public/   # dependency-free records, sanitized diagnostics
  proof/public/       # produced only by the existing proof coordinator
  proof/private/      # NEVER uploaded
```

Use the coordinator's existing `CH001_EVIDENCE_ROOT` override for `proof/` and a valid short lowercase `CH001_RUN_ID`, for example `r4-<run-id>-<attempt>`. Its internal r3 profile may remain named r3; the outer assignment is r4. Do not rename every coordinator file or rewrite hundreds of lines merely for chapter branding.

Only upload the two explicit public subtrees, not their parent or a broad artifact glob. Verify the downloaded archive's actual paths. If package records contain repository-relative evidence references, retain enough path mapping/manifest metadata to resolve them after download without altering previously hashed files. Keep outer packaging metadata separate from the existing inner proof manifest to avoid circular hashes.

The upload must happen after early records have been finalized and on ordinary success/failure paths. Missing mandatory outer records must not produce a green job. A bootstrap-only artifact is useful diagnostics, never a substitute for a canonical ZIP or proof report.

## 7. Test the repair itself

Implement the cases in `04_ACCEPTANCE_AND_EVIDENCE.md`. Include executable dependency-free tests for the summary/result writer and bootstrap failure paths. These tests must be runnable even when pnpm is broken. Test behavior, not only source-string presence.

On the editing host, run the available CI-helper tests, lint, typecheck, build, and existing unit/security tests. Preserve discovered/executed/skipped counts. Report unavailable clean-download, Docker, browser, or network checks honestly. Twenty unit tests and four security tests are the historical baseline, not a substitute for new test execution or a fixed required maximum.

Do not change the strict full verifier to pass a partial ledger. `pnpm proof:ch001` remains the bounded run; `pnpm verify:ch001` remains the full acceptance check. A nonzero full-verifier result caused by pending parent gates is not permission to weaken it.

## 8. Commit, handoff, and stop

Create implementation commit T4 containing all execution-affecting changes: workflow, installer, manifest, Docker wiring, summary/diagnostics helpers, and tests. Record its real SHA and tree. Run feasible final checks against that committed source; if checks lead to code changes, create a new final implementation commit and rerun affected checks.

Create a later E4 for r4 handoff/evidence/state only. It must reference T4 without requiring an impossible self-referential E4 hash inside itself. Return E4 externally. Record packet P4 separately. Preserve r3 reports and old gate files unchanged.

Return `READY_FOR_ROUTER_PUBLISH` when code/local checks are prepared and a workflow-capable push is still required. Return `NEEDS_WORKFLOW_DISPATCH` only when publication has actually been verified but no matching new run exists. Do not falsely say either status is a live proof pass.

Once the router supplies hosted results, add their actual IDs and outcomes to the evidence receipt. If the bounded proof passes, return it for architect review. If a bootstrap repair still fails, report the exact stage. If an application suite fails after bootstrap, preserve the evidence and stop for the next bounded assignment.

No autonomous reauthorization, no endless redispatch loop, no change to accepted version, and no next feature chapter.


---

<a id="document-03-router-dispatch-runbook"></a>

# Router runbook — save packet, launch Luna, publish preserved commits, dispatch T4

## Authority boundary

The router saves the architect packet and launches Luna MAX. Luna edits and tests the bounded scope. Kyle's already-authorized workflow-capable path handles the push and manual dispatch. This packet does not authorize moving tokens between machines, changing OAuth scope on the editing box, using a personal token in CI, enabling new paid runners, or bypassing branch protection.

The architect has not pushed, dispatched, or started Luna. All T4/E4 values below must come from Luna's actual next handoff.

## 1. Save the packet and start the correct assignment

Save the directory under a discoverable repository location such as `architect/CH001R_r4_CI_Repair_Pack/`. A single combined Markdown reading copy is also supplied. Preserve the packet's hashes and record the real packet commit P4. Do not overwrite the original frozen CH-001 or North Star references.

Use `LUNA_START_PROMPT.md`, highest available effort/MAX, and the existing repo workspace. Tell Luna that the T3 push restriction was already resolved and run `34665615514` is the failed bootstrap baseline. It should not spend its next run repeating the old authorization diagnosis.

## 2. Review Luna's local handoff before publication

Require actual T4 and E4, an allowed-scope diff, feasible local regression results, any remaining unavailable checks, and a workflow blob/hash. Verify that T4 includes both the Docker and Actions bootstrap repairs. The source/workflow fixes cannot exist only in E4 docs or an uncommitted worktree.

Do not publish changes outside this packet merely because the branch is named `main`. No history rewriting, force pushing, squashing, or cherry-picking after T4 is recorded without assigning and reporting a new target SHA. If existing transport preserves the exact commits, retain that route. Do not copy only the YAML and then try to dispatch a T4 that is absent from GitHub.

## 3. Publish through the authorized path

On Kyle's workflow-capable route, transfer and publish the preserved commits using the existing authorized mechanism. The editing box's scope limitation may still prevent it from pushing the workflow commit; that is expected.

In a local clone that contains the commits, replace the placeholders below only with values returned by Luna:

```bash
set -euo pipefail
REPO='klole/reel-farm'
T4='REPLACE_WITH_LUNA_FULL_IMPLEMENTATION_SHA'
E4='REPLACE_WITH_LUNA_FULL_EVIDENCE_SHA'
[[ "$T4" =~ ^[0-9a-f]{40}$ ]] || { echo 'Missing real T4' >&2; exit 1; }
[[ "$E4" =~ ^[0-9a-f]{40}$ ]] || { echo 'Missing real E4' >&2; exit 1; }
git fetch origin main
git cat-file -e "$T4^{commit}"
git cat-file -e "$E4^{commit}"
git merge-base --is-ancestor "$T4" "$E4"
git merge-base --is-ancestor "$E4" origin/main

gh api "repos/$REPO/commits/$T4" --jq .sha
gh api "repos/$REPO/commits/$E4" --jq .sha
gh api "repos/$REPO/contents/.github/workflows/ch001-live-proof.yml?ref=main" --jq .sha

git rev-parse "$T4:.github/workflows/ch001-live-proof.yml"
git rev-parse "origin/main:.github/workflows/ch001-live-proof.yml"
```

The two workflow blob identities should match unless the router has explicitly reviewed a separate workflow-only controller change. Default policy: keep them equal. A docs-only E4 may be the current branch head. If main moved with code/workflow changes, stop and reconcile rather than silently testing a mixed version.

These commands confirm publication; they do not perform a push. Use the already-authorized preserved-commit push path before these checks. They deliberately contain no credential extraction or account-switch commands.

## 4. Dispatch a new run, not the old failed run

Do not use `gh run rerun 34665615514` for the repaired source. Do not keep `implementation_sha` set to T3. GitHub reruns use the original run's ref/SHA. A fresh dispatch selects the new repaired workflow and explicitly checks out T4. [U5–U6]

After the publication checks:

```bash
set -euo pipefail
REPO='klole/reel-farm'
: "${T4:?Set the verified full T4 SHA first}"
[[ "$T4" =~ ^[0-9a-f]{40}$ ]] || exit 1
DISPATCHED_AFTER_UTC="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
printf 'Dispatch not before: %s\nImplementation: %s\n' "$DISPATCHED_AFTER_UTC" "$T4"
gh workflow run ch001-live-proof.yml --repo "$REPO" --ref main \
  -f implementation_sha="$T4"
gh run list --repo "$REPO" --workflow ch001-live-proof.yml \
  --event workflow_dispatch --limit 10 \
  --json databaseId,headSha,createdAt,status,conclusion,url
```

Record the dispatch receipt/time. Do not select a run solely because it is the newest entry. Match the creation window, actor/event, workflow, requested implementation in the dispatch/bootstrap record, and actual checkout. If two matching runs exist, identify the authorized one and do not claim results from an ambiguous run.

Only one deliberate new dispatch is authorized at this handoff. A transient retry or further implementation change needs a recorded router decision; no uncontrolled agent loop or broader runner spending is authorized.

## 5. Inspect the selected run and retain artifacts

Use the actual run ID, not a guessed future ID:

```bash
set -euo pipefail
REPO='klole/reel-farm'
RUN_ID='REPLACE_WITH_VERIFIED_NEW_RUN_ID'
[[ "$RUN_ID" =~ ^[0-9]+$ ]] || exit 1

gh run view "$RUN_ID" --repo "$REPO" \
  --json databaseId,event,headSha,status,conclusion,url,jobs
gh api "repos/$REPO/actions/runs/$RUN_ID/jobs" \
  --jq '.jobs[] | {id,name,status,conclusion,steps}'
gh api "repos/$REPO/actions/runs/$RUN_ID/artifacts" \
  --jq '.artifacts[] | {id,name,size_in_bytes,digest,expired,expires_at}'
```

Once that run completes, download its exact named artifact into a new run-owned directory. Record the run attempt and artifact ID; a name alone is insufficient. Compare downloaded ZIP SHA-256 with GitHub's artifact digest when retrieving the original archive bytes, and separately validate the inner payload manifest. Extracting via `gh run download` does not itself retain the original archive hash; do not claim it does.

Record jobs/steps and relevant failure log excerpts, then verify bootstrap report, workflow/source identities, coordinator report when present, suite counts, canonical exports, hashes, and lifecycle files. Check that the uploaded archive's paths actually resolve its evidence references. Retain a sanitized durable copy or accessible attachment before the configured retention deadline; do not invent permanent URLs.

Never upload `.env`, cookies, private authentication state, raw credentials, or the private proof directory. Never paste a full runner environment into the handoff.

## 6. Route based on the result

| Result | Router action |
|---|---|
| T4 not published | Use the existing authorized publishing route; no dispatch yet. |
| Native installer or frozen install fails | Return exact failure stage, logs and bootstrap artifact. Not a runtime-gate FAIL unless an assertion actually ran. |
| Summary/report packaging fails | Return `CI_REPORTING_FAILURE`; preserve earlier outcome. |
| Bootstrap succeeds; application proof fails | Return `BOOTSTRAP_FIXED_LIVE_PROOF_FAILED` with the first reproducible live failure; no feature work. |
| Coordinator exits 2 with measured missing prerequisite | Return `BLOCKED_ENVIRONMENT` with report and stage. Do not rerun blindly. |
| Coordinator exits 0; reports/artifacts invalid | Return `EVIDENCE_INVALID`, never a proof pass. |
| Bounded proof and artifact inspection succeed | Return `LIVE_PROOF_READY_FOR_REVIEW`, still application acceptance false. |

Include T4, E4, workflow-definition SHA, workflow blob identity, actual checkout, run/attempt/job/artifact IDs, bootstrap outcome, proof exit or null, fresh gate counts if generated, archive/payload hashes, and remaining original gates.

The next architect review decides whether the narrow repair is accepted and what application verification remains. The router must not mark v0.1 accepted or dispatch v0.2 based on a green Actions badge.


---

<a id="document-04-acceptance-and-evidence"></a>

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


---

<a id="document-05-handoff-template"></a>

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


---

<a id="document-06-sources"></a>

# Source and verification register

Repository reads were made through the connected GitHub tool. Upstream behavior was checked against primary pnpm and GitHub documentation. URLs below are source identifiers, not claims that the packet executed the referenced software.

## Repository and run records

- **R1 — main identity.** `https://api.github.com/repos/klole/reel-farm/branches/main` returned E3 `4cf020317cfc2e8755f35ee6da10f7397c8676f2`, parent T3. A mutable branch must be rechecked before the next dispatch.
- **R2 — failed run, job and logs.** `https://github.com/klole/reel-farm/actions/runs/34665615514`; run metadata, jobs endpoint, and decoded log for job `103476773609` were read. Recorded failure stages and source identities come from these observations. Timestamps are kept verbatim from GitHub, including `2026-09-12T01:42:40Z` creation.
- **R3 — workflow at E3.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/.github/workflows/ch001-live-proof.yml`. Blob `4a1b045e4771901713a2ad00705a0a84c9ff1dab`.
- **R4 — r3 handoff at E3.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/handoffs/CH-001R-r3.md`. Source of the historical local preflight report; not independently rerun here.
- **R5 — r3 evidence index at E3.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/docs/evidence/CH-001R-r3/README.md`.
- **R6 — retrieved historical artifact.** `https://api.github.com/repos/klole/reel-farm/actions/artifacts/10289206189`. Exact downloaded ZIP: 295 bytes, SHA-256 `6286efa33c131379a7855b87890a9450ad11f9a704ec4ee68b50128b5f9188a2`, only `dispatch.txt`. Bytes and content were independently checked locally. GitHub reported expiry `2026-09-26T01:42:53Z`. Do not distribute signed download URLs.
- **R7 — T3 package manifest.** `https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/package.json`.
- **R8 — T3 Dockerfile.** `https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/Dockerfile`.
- **R9 — T3 proof coordinator.** `https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/scripts/ch001-proof.ts`. Entry and finalization portions were inspected, including npm-dependency imports, `CH001_EVIDENCE_ROOT`, `CH001_RUN_ID`, required artifacts and bounded/nonacceptance result semantics. This was not a complete new code audit of every coordinator line.
- **R10 — E3 root state.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/state/PROJECT_STATE.md`.

## Upstream primary references

- **U1 — pnpm 12 installation and compatibility.** `https://pnpm.io/installation`. Documents native pnpm 12 and distinguishes npm-install requirements from standalone runtime behavior. Do not interpret its mutable current examples as permission to use `latest` in this project.
- **U2 — pnpm CI.** `https://pnpm.io/continuous-integration`. Documents native CI installation and explicit PATH handling; reviewed as supporting context, not copied as an unqualified workflow.
- **U3 — official pnpm v12.3.4 release and asset metadata.** `https://github.com/pnpm/pnpm/releases/tag/v12.3.4` and `https://api.github.com/repos/pnpm/pnpm/releases/tags/v12.3.4`. Release ID `382779697`. Linux x64 archive asset `544431952` and arm64 asset `544431953` metadata supply the pins in this packet. Native archive bytes were not downloaded/executed by the packet author; Luna must verify before execution.
- **U4 — GitHub workflow environment/output/summary commands.** `https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands`. Supports `GITHUB_PATH`, `GITHUB_ENV`, `GITHUB_OUTPUT` and `GITHUB_STEP_SUMMARY` semantics.
- **U5 — GitHub workflow reruns.** `https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs`. Reruns retain original SHA/ref; a fresh repaired-source dispatch is required here.
- **U6 — CLI manual dispatch.** `https://cli.github.com/manual/gh_workflow_run`. Supports the runbook's manual workflow selection, ref, and input mechanism.
- **U7 — workflow contexts.** `https://docs.github.com/en/actions/reference/workflows-and-actions/contexts`. Supports recording workflow-definition and run/source identities distinctly.

## Findings versus proposals

Corepack missing-module failure, shell command-substitution errors, skipped proof, the existing pins, Docker's Corepack calls and artifact contents are observed facts. The legacy-launcher/native-layout incompatibility is a strongly supported diagnosis, not a personally reproduced upstream bug investigation.

The checksummed native installer, split outer failure report, new CI4 regression cases and router runbook are architect implementation decisions. No claim is made that Luna has already implemented them. The safe summary fragment is illustrative and independently testable; it is not a complete workflow patch.

No primary-source quotation is necessary to apply this packet. Source details are summarized; command examples and testing/architecture instructions are original proposed work.


---

<a id="document-luna-start-prompt"></a>

# Start prompt — Luna MAX / CH-001R-r4

Execute the attached **CH-001R-r4 CI bootstrap repair** at MAX effort in `klole/reel-farm`.

T3 `0b79ed07a25a618ab4da2bf56a2fed6047398cb5` and E3 `4cf020317cfc2e8755f35ee6da10f7397c8676f2` are published. The old workflow-push blocker was resolved by Kyle's router. Hosted run `34665615514` failed before proof startup: Corepack attempted to load pnpm 12.3.4's missing `bin/pnpm.cjs`; the summary also evaluated backticks as shell commands. Its artifact contains only `dispatch.txt`, not live proof.

Read this packet and repository instructions. Implement the shared pinned/checksummed native-pnpm bootstrap for Actions and Docker build/runtime, retaining the existing Node/pnpm/dependency pins. Repair literal summary formatting, nullable absent-proof exit semantics, and dependency-free early failure evidence. Add executable positive/negative regression tests. Keep the r3 bounded coordinator and original strict 72-gate acceptance contract intact.

Do not return another plan, broadly upgrade the toolchain, disable security, or implement application features. No fal.ai, ScrapeCreators, Pinterest, TikTok, publishing, scheduling, analytics, billing, video, releases, or v0.2 work.

Run feasible local checks, commit the actual implementation as T4, and create E4 handoff/evidence afterward. Return the full SHAs, scope diff, actual results, unavailable checks, and ready dispatch instructions. The router alone uses the workflow-capable publishing route and manually dispatches a fresh run with T4; do not copy/request credentials or dispatch autonomously. Do not rerun the old run or keep T3 as the repaired-source target.

Keep `application_acceptance=false`, root `awaiting_review`, accepted version `none`. A green bounded proof is not v0.1 acceptance. If hosted execution reveals an application failure beyond this CI repair, preserve the evidence and stop for architect review.


---

## Embedded file: `reference/REVIEWED_RUN.json`

```json
{
  "record_kind": "ARCHITECT_REVIEW_OF_EXISTING_RUN_NOT_NEW_PROOF",
  "repository": "klole/reel-farm",
  "phase": "CH-001R-r4",
  "application_acceptance": false,
  "accepted_application_version": "none",
  "root_state": "awaiting_review",
  "reviewed_implementation_sha": "0b79ed07a25a618ab4da2bf56a2fed6047398cb5",
  "reviewed_evidence_sha": "4cf020317cfc2e8755f35ee6da10f7397c8676f2",
  "observed_main_sha": "4cf020317cfc2e8755f35ee6da10f7397c8676f2",
  "failed_ci": {
    "run_id": 34665615514,
    "attempt": 1,
    "job_id": 103476773609,
    "event": "workflow_dispatch",
    "status": "completed",
    "conclusion": "failure",
    "head_sha": "4cf020317cfc2e8755f35ee6da10f7397c8676f2",
    "workflow_definition_sha": "4cf020317cfc2e8755f35ee6da10f7397c8676f2",
    "requested_implementation_sha": "0b79ed07a25a618ab4da2bf56a2fed6047398cb5",
    "checked_out_sha": "0b79ed07a25a618ab4da2bf56a2fed6047398cb5",
    "created_at_utc_from_github": "2026-09-12T01:42:40Z",
    "url": "https://github.com/klole/reel-farm/actions/runs/34665615514",
    "failed_step": "Install frozen project and pinned browser dependencies",
    "failed_command": "pnpm --version invoked through Corepack",
    "bootstrap_exit_code": 1,
    "proof_invoked": false,
    "proof_exit_code": null,
    "summary_step_exit_code": 2,
    "summary_note": "Backticks caused shell command substitution; the step also defaulted an absent proof exit to 2. This is not a coordinator result.",
    "docker_steps": "SKIPPED",
    "application_suites": "NOT_RUN"
  },
  "artifact": {
    "id": 10289206189,
    "name": "ch001-live-proof-34665615514-1",
    "bytes": 295,
    "sha256": "6286efa33c131379a7855b87890a9450ad11f9a704ec4ee68b50128b5f9188a2",
    "digest_verified_against_github_metadata": true,
    "members": [
      "dispatch.txt"
    ],
    "independently_downloaded_and_inspected": true,
    "contains_application_export": false,
    "contains_proof_result": false
  },
  "historical_local_preflight": {
    "run_id": "r3-local-t3-preflight",
    "implementation_sha": "0b79ed07a25a618ab4da2bf56a2fed6047398cb5",
    "status": "BLOCKED_ENVIRONMENT",
    "exit_code": 2,
    "gate_counts": {
      "PASS": 4,
      "FAIL": 0,
      "NOT_RUN": 68
    },
    "passing_gate_ids": [
      "CH001-067",
      "CH001-068",
      "CH001-069",
      "CH001-072"
    ],
    "evidence_basis": "E3 committed handoff and evidence index; local raw suite files not independently rerun by this architect",
    "reported_unit_count": 20,
    "reported_security_count": 4
  },
  "architect_actions": {
    "repository_modified": false,
    "workflow_dispatched": false,
    "application_started": false,
    "application_tests_run": false,
    "provider_calls": false,
    "artifact_inspected": true
  },
  "observed_time_note": "GitHub timestamps are preserved verbatim; no claim that this review generated the run."
}
```

---

## Embedded file: `reference/PNPM_NATIVE_RELEASE_PINS.json`

```json
{
  "kind": "RESEARCHED_PIN_INPUT_NOT_EXECUTED_BOOTSTRAP",
  "version": "12.3.4",
  "release_tag": "v12.3.4",
  "release_id": 382779697,
  "source": "https://api.github.com/repos/pnpm/pnpm/releases/tags/v12.3.4",
  "digest_basis": "GitHub release asset metadata; Luna must verify downloaded archive bytes before extraction or execution.",
  "default_runtime_node": "20.19.2",
  "required_runner_target": "linux-x64-glibc",
  "assets": [
    {
      "target": "linux-x64-glibc",
      "asset_id": 544431952,
      "name": "pnpm-linux-x64.tar.gz",
      "bytes": 19865651,
      "url": "https://github.com/pnpm/pnpm/releases/download/v12.3.4/pnpm-linux-x64.tar.gz",
      "sha256": "9705e5704b4679fb503c963a18d1ac4f105e39aafafca8a2ed346facdf820cd0"
    },
    {
      "target": "linux-arm64-glibc",
      "asset_id": 544431953,
      "name": "pnpm-linux-arm64.tar.gz",
      "bytes": 18014315,
      "url": "https://github.com/pnpm/pnpm/releases/download/v12.3.4/pnpm-linux-arm64.tar.gz",
      "sha256": "95e71a2a30bbc0b77511f95cf096779068dcad6ffcbbfdf0cd4dde9de2b2b97c",
      "qualification": "metadata-only; runtime support is not claimed"
    }
  ],
  "binary_downloaded_or_executed_by_packet_author": false,
  "policy": "No latest tag, Corepack signature bypass, unreviewed mirror, or implicit alternate version. Unsupported targets fail explicitly."
}
```

---

## Embedded file: `reference/FAILED_RUN_DISPATCH.txt`

```text
Bounded CH-001R-r3 live proof; not v0.1 acceptance.
Implementation: 0b79ed07a25a618ab4da2bf56a2fed6047398cb5
Workflow definition: 4cf020317cfc2e8755f35ee6da10f7397c8676f2
Run: r3-34665615514-1
```

---

## Embedded file: `reference/SUMMARY_PRINTF_EXAMPLE.sh`

```bash
#!/usr/bin/env bash
# Formatting example only. Not the production workflow or final verdict evaluator.
set -euo pipefail
: "${GITHUB_STEP_SUMMARY:?Provide an owned output file}"
{
  printf '%s\n\n' '## CH-001R-r4 bounded CI proof'
  printf 'Implementation: `%s`\n' "${REQUESTED_SHA:-unknown}"
  printf 'Workflow definition: `%s`\n' "${CH001_WORKFLOW_SHA:-unknown}"
  printf 'Run: `%s`\n' "${CH001_RUN_ID:-unknown}"
  printf 'Proof invoked: `%s`\n' "${PROOF_INVOKED:-false}"
  printf 'Coordinator exit: `%s`\n' "${PROOF_EXIT_CODE:-not-run}"
  printf 'Application acceptance: `%s`\n' 'false'
} >> "$GITHUB_STEP_SUMMARY"
```

---

## Embedded file: `templates/CI4_RESULTS.template.json`

```json
{
  "record_kind": "TEMPLATE_NOT_EXECUTION",
  "phase": "CH-001R-r4",
  "application_acceptance": false,
  "implementation_sha": null,
  "run_id": null,
  "checks": [
    {
      "id": "CI4-001",
      "requirement": "Correct base, original acceptance contract preserved, allowed-scope diff",
      "required_evidence": "Actual base/T4/tree; diff and original reference hash",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-002",
      "requirement": "Pnpm pin and official platform artifact are bound to the project pin",
      "required_evidence": "Manifest, upstream provenance, pin-drift rejection test",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-003",
      "requirement": "Wrong digest / unsafe archive / unsupported target rejected before execution",
      "required_evidence": "Executable negative helper tests; no execution side effect",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-004",
      "requirement": "Bootstrap works without project dependencies or usable Corepack and is idempotent",
      "required_evidence": "Fresh owned-directory install log and repeat-install check",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-005",
      "requirement": "Current and subsequent shells use the verified native executable",
      "required_evidence": "Resolved path, version, executable metadata, PATH test",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-006",
      "requirement": "Node/pnpm/dependency intent unchanged; no insecure flags or hidden fallback",
      "required_evidence": "Node/pnpm output; package/lockfile diff; policy assertions",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-007",
      "requirement": "Hosted frozen project installation succeeds with no tracked dependency mutation",
      "required_evidence": "Real hosted step log/exit and before/after lock hash",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-008",
      "requirement": "Project-pinned managed Playwright browser installation and qualification run",
      "required_evidence": "Real version/path/launch report, not system-Chrome substitution",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-009",
      "requirement": "Final Docker image builds and native pnpm works non-root without network bootstrap",
      "required_evidence": "Actual image identity, user, network-disabled version probe; shipped-image result",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-010",
      "requirement": "Successful summary prints exact literal identities without evaluating them",
      "required_evidence": "Executed writer test with stdout/stderr/result assertions",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-011",
      "requirement": "Bootstrap failure before proof yields actual failure, invocation false, proof exit null",
      "required_evidence": "Dependency-free fixture test and hosted evidence on real failure when applicable",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-012",
      "requirement": "Invoked proof exit 1 is retained and final verdict fails",
      "required_evidence": "Executed result-classifier test",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-013",
      "requirement": "Invoked proof exit 2 is distinguished from proof never invoked",
      "required_evidence": "Executed classifier test; actual prerequisite detail if used live",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-014",
      "requirement": "Exit 0 plus missing/malformed/stale/wrong-identity proof report is rejected",
      "required_evidence": "Negative report-validation tests; nonzero terminal verdict",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-015",
      "requirement": "Summary treats backticks, dollar substitutions, percent signs and spaces as data",
      "required_evidence": "Executed hostile-value fixture with no command/marker side effect",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-016",
      "requirement": "Early diagnostics need no npm-installed dependency and survive bootstrap failure",
      "required_evidence": "Run with project modules absent; valid explicit outer JSON record",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-017",
      "requirement": "Only sanitized public evidence is selected; private paths/credentials excluded",
      "required_evidence": "Artifact allowlist/path tests and actual downloaded archive inspection",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-018",
      "requirement": "Uploaded evidence is retrievable and its archive/payload hashes are checked",
      "required_evidence": "Actual run/attempt/job/artifact IDs, download record and digest comparison",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-019",
      "requirement": "New run explicitly requests and checks out T4; workflow identity is also recorded",
      "required_evidence": "Actual dispatch/bootstrap/proof identity chain and workflow blob/hash",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-020",
      "requirement": "Existing bounded proof executes its real suites and produces its required runtime artifacts, or returns an explicit failure",
      "required_evidence": "Actual discovered/executed/skipped counts, exits, ZIPs/images/hashes/lifecycle data; do not mark PASS on a failure",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-021",
      "requirement": "New gate records derive only from fresh evidence; historical local and hosted records stay separate",
      "required_evidence": "Fresh ledger with exactly 72 original IDs when coordinator produced it; unchanged historical files",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-022",
      "requirement": "Workflow-capable publication and manual dispatch remain router-only",
      "required_evidence": "Handoff/action declaration; no credentials transferred or embedded",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-023",
      "requirement": "No providers, publishing, billing, feature expansion, release, or v0.2 changes",
      "required_evidence": "Diff and external-action record",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    },
    {
      "id": "CI4-024",
      "requirement": "Handoff identifies actual commits/results and keeps awaiting_review / none",
      "required_evidence": "Handoff/state/index consistency; no invented CI identities",
      "status": "NOT_RUN",
      "actual_evidence": [],
      "reason": "Template only; no Luna r4 implementation executed by packet author."
    }
  ]
}
```

---

## Embedded file: `ROUTER_READY.json`

```json
{
  "packet_id": "CH-001R-r4",
  "packet_status": "COMPLETE",
  "next_action": "SAVE_PACKET_AND_START_LUNA_MAX",
  "repository": "klole/reel-farm",
  "reviewed_main_sha": "4cf020317cfc2e8755f35ee6da10f7397c8676f2",
  "effort": "MAX",
  "entrypoint": "LUNA_START_PROMPT.md",
  "application_acceptance": false,
  "root_state": "awaiting_review",
  "accepted_application_version": "none",
  "router_only_actions": [
    "workflow-capable publication",
    "manual fresh T4 dispatch"
  ],
  "implementation_commit": null,
  "evidence_commit": null,
  "new_run_id": null
}
```
