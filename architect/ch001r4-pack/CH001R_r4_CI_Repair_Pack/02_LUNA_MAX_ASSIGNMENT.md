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
