# r6 tests, runtime qualification, and evidence

## Evidence classes and ownership

This checklist is for the r6 repair, not a replacement for `CH001-001` through `CH001-072`. Record real results in `docs/evidence/CH-001R-r6/r6-results.json` and preserve the old gate ledgers. Local deterministic tests may substantiate helper behavior; hosted cases require actual hosted evidence.

Use the blank [checklist template](templates/r6-checklist.template.json). Every new row begins `NOT_RUN`. Do not copy this packet's artifact-integrity passes into Luna's runtime checklist.

## Deterministic local regressions

| ID | Required behavior | Evidence |
|---|---|---|
| R6-T01 | Resolver selects the installed pinned managed browser and records its canonical path/hash. A same-name system binary is not accepted. | Real temporary filesystem fixtures plus resolver tests. |
| R6-T02 | Reject outside-root targets, escaping symlinks, globs, newlines, profile-language injection, and command injection. Correctly quote supported space-containing paths. | Positive and negative fixtures; no privileged writes. |
| R6-T03 | Identity/pin drift and executable changes between resolution and launch fail closed rather than using stale authorization. | Deliberate drift/mutation fixtures. |
| R6-T04 | Generated profile has a unique name, exact attachment and intended userns rule, with no directory wildcard or arbitrary appended policy. | Structured output assertions; hosted parser validation is separate. |
| R6-T05 | Privileged provisioning is refused outside explicitly opted-in, identity-checked, manually dispatched standard-hosted Linux context. Probe-only mode stays unprivileged. | Injected environment/executor tests including editing-box/self-hosted refusal. |
| R6-T06 | Already-working sandbox requests no unnecessary policy. A confirmed unavailable prerequisite is distinguished from a malformed-helper/configuration error. | Deterministic decision tests with explicit outcomes. |
| R6-T07 | Existing profile/file collision is refused without replacement or deletion; partial installs track what this invocation actually owns. | Temporary fixtures and recorded executor calls. |
| R6-T08 | Cleanup removes only owned, unchanged resources; unknown/mutated resources are preserved; repeated cleanup is harmless and reported. | Hash preservation and positive/negative cleanup tests. |
| R6-T09 | All qualified launch paths retain sandbox=true and report requested, launched, and observed states separately; a config boolean alone never proves runtime isolation. | Launch-option/observation tests including null/unknown cases. |
| R6-T10 | Coordinator, host E2E/render tests, and direct launch helpers select the qualified executable or explicitly enumerate a separately qualified managed binary. | Call-site mapping plus tests for full-Chrome/headless-shell mismatch. |
| R6-T11 | Pre-coordinator provisioning does not create/write the proof root; all twelve prior boundary cases remain passing. | Execute the existing boundary suite and workflow-boundary integration regression. |
| R6-T12 | Not-invoked proof has null exit; real child exits 1 and 2 stay distinct; reporting/cleanup problems cannot erase the primary failure. | Execute the previous CI suite plus new prerequisite/cleanup propagation tests. |
| R6-T13 | Node/pnpm/Playwright/lock/native manifest and application pins remain unchanged. No new provider, bypass flag, broad host policy, or container security relaxation appears. | Exact hashes and scoped diff review, not only dependency names. |
| R6-T14 | The code awaiting publication passes syntax checks, lint, typecheck, build, unit, security, existing CI tests, and new focused regressions, with nonzero real test counts. | Timestamped command logs and native reporter counts. |

## Hosted and router cases

| ID | Required behavior | Evidence |
|---|---|---|
| R6-T15 | On the approved hosted runner, measure the default failure or default success, apply only the permitted policy when needed, then run the pinned browser sandboxed as non-root with usable runtime diagnostics. | OS/policy before-after record, profile hash, executable hash, launch args/outcome, synthetic render, observed sandbox facts. |
| R6-T16 | Owned policy cleanup actually occurs after browser shutdown; global restrictions and unrelated profiles are not altered. | Owned-resource receipt, before-after values, parser removal result; note unobserved cancellation cases. |
| R6-T17 | The shipped worker's own browser completes a sandboxed launch under its actual non-root container configuration. | Image/container identity, effective security options, selected browser, launch/runtime evidence. Never infer from R6-T15. |
| R6-T18 | Existing bounded application proof produces the real canonical seven-slide ZIP, alternate-format ZIP, preview byte comparisons, screenshots, and restart/lifecycle evidence. | Fresh matching coordinator/command/suite reports and actual artifacts. |
| R6-T19 | Router retrieves the new artifact independently, confirms length/digest/identities, validates referenced payloads, and appends a post-delivery receipt without rewriting the archive. | Run/attempt/job/artifact IDs, digest, expiry, payload checks, receipt commit. |
| R6-T20 | Final handoff/state preserves historical evidence, no feature/scope drift, `application_acceptance=false`, accepted version none, and awaiting review. | T6/E6 diffs, state, action declaration, strict versus bounded distinction. |

A newly observed worker/application failure may leave R6-T17 or R6-T18 incomplete. That is a truthful phase result requiring architect review, not permission to mark the repair or application fully qualified. A passing R6-T15 with a blocked R6-T17 establishes a host-only fix.

## Commands to execute and record

Keep the project's existing pinned/native bootstrap. Record actual commands, UTC start/end, exit codes, test counts, source commit/tree, and logs:

```text
node --check <new or changed .mjs helpers>
pnpm test:ci
<explicit new sandbox-regression entry point, if not included above>
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Where dependencies need installation, use the existing verified native pnpm and `pnpm install --frozen-lockfile`, with lock hash before/after. No install is needed merely to make an already verified working tree look active.

A restricted editing host may run one fresh diagnostic bounded proof when useful and permitted, reporting its real environment limitation. Do not repeatedly run Docker/loopback probes known unavailable, or generate an old result into a reused directory. Do not rerun the full strict verifier expecting acceptance on that host.

The router's fresh hosted run executes the existing `pnpm proof:ch001` route with the new T6. The strict `pnpm verify:ch001` remains a separate acceptance contract; it is not changed to equate a bounded proof with all 72 gates passed.

## Minimum new sandbox report

A new sanitized report must bind the following concepts. Field names may fit the existing schema; do not invent measurements to fill them:

```json
{
  "phase": "CH-001R-r6",
  "run_id": "actual-run-key",
  "implementation_commit": "actual-full-T6-sha",
  "workflow_definition_commit": "actual-workflow-commit",
  "context": "host-proof-browser",
  "selected_executable": {"path": "measured", "sha256": "measured"},
  "uid": null,
  "apparmor_enabled": null,
  "restriction_before": null,
  "restriction_after": null,
  "default_probe": {"launch_succeeded": false, "error": "actual-or-null"},
  "policy": {"changed": false, "profile_name": null, "sha256": null, "loaded": false},
  "qualified_probe": {
    "sandbox_requested": true,
    "launch_succeeded": false,
    "sandbox_observed": null,
    "browser_version": null,
    "diagnostic_evidence": []
  },
  "cleanup": {"status": "NOT_RUN", "owned_resources_removed": null},
  "application_acceptance": false
}
```

This is illustrative, not an executed report. Separate the worker context into its own record. Missing/unavailable measurements are null with a reason, not false successes. A profile load is not a browser launch; a browser launch is not a seven-slide journey.

## Failure and downstream-artifact semantics

For a prerequisite block before a producing stage runs, retain that producer's NOT_RUN state and name the blocker. Do not generate placeholder ZIPs, synthetic success screenshots, or zero-case suite passes. Existing missing-artifact diagnostics may remain, but make their dependency clear.

For a producer that actually runs and claims success but fails to create required output, fail the proof. A successful exit with missing canonical output, zero discovered tests, mismatched identity, stale reports, or invalid hashes is not a usable success.

Keep the primary error readable. Missing expected exports after the host browser never launched must not obscure the sandbox diagnosis. Conversely, an unrelated assertion failure after the browser succeeds must not be relabeled as that earlier environment problem.

## Evidence delivery

Use only synthetic/local data. Keep private env files, authentication storage, cookies, credentials, raw host/process dumps, and unredacted logs out of public upload paths. The new preflight record belongs outside `proof` before coordinator ownership.

The public archive may be a pre-upload snapshot of delivery fields. Preserve it byte-for-byte and add an independent router receipt with actual upload and retrieval metadata. Do not solve receipt self-reference by modifying the archived JSON and reusing the original digest. Cleanup evidence created after an initial upload must be included in a separate explicitly named receipt artifact or preserved by the router from actual job output; do not claim it was in the earlier archive.

Retain all 72 original gate IDs and their actual evidence. The new 20-row r6 checklist does not waive their requirements, replace their statuses, or close original review findings.
