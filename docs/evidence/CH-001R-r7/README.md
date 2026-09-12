# CH-001R-r7 evidence — workflow validation and dispatch repair

This is the bounded v0.1.0 continuation for Open Slideshow Studio. It repairs the GitHub Actions definition boundary and adds pre-publication semantic validation. It is not v0.2, full acceptance, browser qualification, worker proof, or a hosted run.

State remains `awaiting_review`; `application_acceptance=false`; accepted application version is `none`.

## Identities

| Item | Value |
|---|---|
| Reviewed E6 | `a4d6e7a0149d6852bf348d6277c4200720320f9c` |
| Reviewed T6 | `e0ea57665d00a643a8c392dfb9f6a84a723729af` |
| Packet P7 | `9fb748ef6b22a21ed24a8a5fa66e4ec1463a049a` / tree `ea70e7e6b11cc2c44c7e4213fe06c369d2fea9dc` |
| T7 implementation | `6b02857401a9b1e81e1bd36d5a4418f90903adcb` / tree `fdbe7da15964659d4e2514580f6606f5731790ce` |
| T7 parent chain | `d3f6b2680d2257c41df82faa5ae686559cf80a46` → T7; both descend from P7/E6/T6 |
| Workflow blob at T7 | `2070e80be5355537631a7b2cf833eeb0a6cf28cb` |
| Workflow SHA-256 at T7 | `98808688f0261296f6c0ddd0b3b34b04e67bc2d74735660512ab6c1852849c51` |
| Evidence commit | Returned externally after the evidence-only commit; not embedded self-referentially |

See [source-identities.json](source-identities.json) for machine-readable hashes and [commands.log](commands.log) for the final command record.

## Repair disposition

R7-F01 is repaired by removing `CH001_SANDBOX_STATE_DIR` from `jobs.live-proof.env`. The existing `identity` step now calls [initialize-sandbox-state.sh](../../../scripts/ci/initialize-sandbox-state.sh), which validates `RUNNER_TEMP`, run ID, attempt, and `GITHUB_ENV`, then appends the exact unchanged r6 path suffix:

`$RUNNER_TEMP/ch001r6/$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT/sandbox`

The runner consumes that environment assignment for later qualification and cleanup steps. The helper does not create the state directory, proof tree, policy file, or evidence root, and it never sources/evaluates `GITHUB_ENV`. Existing environment entries remain intact. The r5 proof-directory owner remains the coordinator; the r6 `chromiumSandbox=true`, explicit boolean opt-in, public/manual hosted guard, exact executable policy, non-root worker, and `always()` cleanup remain unchanged.

R7-F02 is addressed by [lint-workflow.mjs](../../../scripts/ci/lint-workflow.mjs) and the root `pnpm lint:workflow` script. It enumerates tracked `.github/workflows/*.yml` and `*.yaml` files, uses actionlint with workflow/expression checks enabled and external ShellCheck/Pyflakes integrations explicitly disabled, validates version `1.7.7`, records executable SHA-256, and fails closed for missing, unusable, wrong-version, nonzero, zero-input, malformed, and semantic-invalid cases. Provenance is recorded in [actionlint-provenance.json](../../../scripts/ci/actionlint-provenance.json).

## Actual static validation

The complete historical T6 workflow was materialized from its Git object and hashed as `e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85`. actionlint 1.7.7 rejected it at line 39 with `context "runner" is not allowed here`, as required by R7-T01. The complete T7 workflow passed the same validator with exit 0 and hash `988086...`. The negative nonexistent-step fixture and malformed YAML fixture were also rejected by real actionlint; the supported runtime-context fixture passed.

The local validator was the official Linux/amd64 v1.7.7 release archive:

- archive SHA-256: `023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757`
- observed executable SHA-256: `9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c`
- release: <https://github.com/rhysd/actionlint/releases/tag/v1.7.7>

This is static workflow evidence only. It does not certify GitHub dispatch acceptance, runner policy, Chromium, Docker, worker behavior, application functionality, or v0.1 acceptance.

## Local checks

The final T7 command set passed:

- `node --check scripts/ci/lint-workflow.mjs` and `bash -n scripts/ci/initialize-sandbox-state.sh` — exit 0.
- `pnpm lint:workflow` — exit 0 with actionlint 1.7.7.
- `pnpm test:ci` — exit 0; 4/4 file-level CI files. Direct individual suite counts were r4 helper 10/10, r5 boundary 12/12, r6 sandbox 18/18, and r7 validation 10/10.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit` (20/20), `pnpm test:security` (4/4), and `git diff --check` — exit 0.

The known-unavailable local bounded `pnpm proof:ch001` was not repeated. No hosted sandbox, Docker/Compose worker, application journey, artifact, or policy operation was run. The original 72-gate contract was not edited.

## Router boundary

The editing box did not push, publish, or dispatch. `origin/main` remained P7 while T7 and this evidence commit were local. The router must independently validate the actual publication tree, confirm T7 workflow bytes, publish through its authorized workflow-capable route, and submit at most one fresh `workflow_dispatch` with `implementation_sha=T7` and `sandbox_qualification=true` only after those checks pass. R7-T13 through R7-T15 are therefore `NOT_RUN` here. R7-T16 is satisfied locally by preserving the historical records and keeping all fresh hosted identifiers null.

Historical T6 remains a rejected-before-run HTTP 422 dispatch, with no run/job/artifact/proof IDs. E6 validation-only record `34675672523` remains separate (`push`, failure, zero jobs) and is not a live-proof run. See [dispatch-rejection-history.json](dispatch-rejection-history.json).

## Scope

Changed execution surface: the workflow’s job-level env removal and identity-step call, the scripts-only `package.json` entry, the pinned actionlint provenance record, the runtime/validator helpers, and the workflow-validation fixtures/tests. The lockfile, native pnpm manifest, dependency versions, Node/Playwright pins, application, Dockerfile, Compose security controls, strict verifier, original gates, and r6 sandbox policy semantics are unchanged. No providers, publishing, account authorization, external browser, privileged host mutation, global policy relaxation, or v0.2 work occurred.
