# Luna MAX assignment — CH-001R-r6

## 1. Goal and stop boundary

Repair the hosted pinned-Chromium launch prerequisite without disabling its sandbox, and qualify the existing bounded application proof on a new committed implementation.

This is a continuation of CH-001, target v0.1.0. It is not v0.2. It is not a request to reconstruct the studio or rewrite the test coordinator.

Use the highest available effort setting. Implement, test, and document the bounded change; do not return another implementation plan in place of code. When the editing host cannot execute privileged policy/runtime checks, finish the deterministic regressions and handoff honestly for the router's one hosted dispatch. Do not repeatedly rerun known-unavailable local services.

## 2. Baseline and reads

Start from `6f600381c72bc68bc550e69ab0e86d522a81a389`, or its descendant containing only this approved packet. Record the exact P6 and its tree. A newer unrelated implementation needs reconciliation; do not overwrite it or quietly adopt its results.

Read:

- This packet's review, tests, and router rules.
- `handoffs/CH-001R-r5.md` and `docs/evidence/CH-001R-r5/`.
- `architect/ch001r5-live-proof-34671716094/ROUTER_RECEIPT.md` and preserved artifact reports.
- `state/PROJECT_STATE.md`, requirement status, and evidence index.
- The original CH-001 acceptance contract under `architect/Luna_CH001_v0.1.0_Pack/`.
- `.github/workflows/ch001-live-proof.yml`, `scripts/ch001-proof.ts`, `scripts/ch001-proof-boundary.mjs`, `scripts/ci/ci-result.mjs`, `scripts/ch001-compose.ts`, and `playwright.config.ts`.
- Every direct Chromium launch call used by the proof, its tests, and the worker. Enumerate the actual call sites rather than assuming the preflight path covers all of them.

Preserve the North Star baseline SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d` and the original 72 gate definitions.

## 3. Fixed commitments

Do not change Node `20.19.2`, pnpm `12.3.4`, Playwright `1.63.0`, the frozen lockfile, application dependency versions, the checked native-release manifest, or the native bootstrap mechanism. Do not switch runner images merely to avoid learning what failed. Keep `ubuntu-24.04`, the approved standard-hosted public-repository path, pinned Actions, read-only repository permission, and manual dispatch.

Do not add a browser service, hosted rendering API, paid runner, new provider key, public deployment, or system browser substitution. The future ScrapeCreators and one-key fal.ai choices remain deferred; direct official TikTok Content Posting API work remains prohibited.

Do not use:

- `chromiumSandbox: false`, `--no-sandbox`, disabling seccomp filtering, or a permissive launch retry;
- global AppArmor shutdown, profile removal unrelated to this job, permissive global user-namespace sysctls, or permanent sysctl configuration;
- root browser execution, `--privileged`, `CAP_SYS_ADMIN`, `seccomp=unconfined`, or container `apparmor=unconfined`;
- external/unpinned Chrome, `CH001_ALLOW_EXTERNAL_BROWSER=1` as proof qualification, or an old successful report;
- blanket source-string checks as the only runtime security evidence.

Some upstream documentation describes these alternatives. They are not authorized here.

## 4. Small implementation surface

Expected changes are confined to the workflow, one small sandbox-policy/probe helper (plus typing if needed), focused tests, and limited proof/reporting integration. Add documentation/state/evidence separately.

`playwright.config.ts` or existing browser-launch helpers may change only to consistently use and record the qualified pinned executable/options. Do not alter application behavior, templates, renderer output, migrations, credentials, queue policy, or gate semantics.

The shipped Dockerfile and production Compose isolation defaults are not authorized for speculative changes. If a distinct worker namespace/seccomp failure appears, capture its exact context and stop for the next review. The researched container options in the source note are contingencies, not permission to weaken or replace the current worker configuration.

## 5. Collect host facts before changing policy

After frozen dependencies and the managed browser are installed, and before the coordinator starts, gather a small sanitized record containing:

- OS release, kernel, runner image identity where supplied, uid/gid, Node, Playwright, and actual requested/checked-out commits;
- canonical managed browser executable path, permissions, ownership, and SHA-256; record which launch sites use it;
- AppArmor enabled/disabled/unavailable status and parser/version availability;
- readable values of `kernel.apparmor_restrict_unprivileged_userns`, `kernel.unprivileged_userns_clone`, and `user.max_user_namespaces`; absent keys remain null/unavailable, not guessed zero;
- relevant profile attachment information and a bounded kernel-denial excerpt tied to the probe when accessible;
- default sandboxed-launch outcome, bounded timeout, exit/error, and selected executable.

Read-only probes may run in other environments. Privileged writes may not. Do not dump full host logs, credentials, environment variables, or unrelated profiles into a public artifact. A failed generic `unshare` shell probe is contextual evidence only: a policy attached to Chrome intentionally need not allow an unrelated shell binary.

If the pinned browser already launches with the required sandbox, do not install an unnecessary policy. Record `policy_change=none` and qualify that measured route. If it cannot launch for missing libraries, a corrupt executable, a dependency mismatch, or another cause, classify that cause rather than claiming AppArmor was proven.

## 6. Authorized AppArmor exception

### 6.1 Permission boundary

Apply a profile only in the manually authorized proof job for this public repository on the standard GitHub-hosted Linux runner, with an explicit r6 opt-in. Check repository/event/runner identities, exact requested-versus-checked-out commit, Linux/Ubuntu expectations, non-root browser uid, and the opt-in before any privileged write. Those checks prevent accidental local use; they are not an authentication mechanism against malicious code already running with CI permissions. No passwords or new credentials may be requested. Use existing noninteractive sudo only for the scoped host-policy operation.

Do not apply the policy on Kyle's Mac, the editing box, a self-hosted runner, a production server, or an ordinary user installation. Do not package it into application startup or `pnpm setup`.

### 6.2 Target selection

Resolve the executable through the installed pinned Playwright package, canonicalize the real path, verify it is a regular executable inside the expected managed-browser installation, and record its hash. Reject unsupported or ambiguous paths. Do not construct an AppArmor policy from arbitrary workflow text, a project upload, or a generic basename search.

The T5 failure used the full managed `.../chrome-linux64/chrome`. Some launch sites may choose a headless-shell binary instead. Either explicitly align proof/test call sites to the same qualified managed full executable, or enumerate and separately qualify each managed executable actually used. Do not grant permissions to an unused alternate binary preemptively. The worker's in-container binary is not a host executable to allowlist this way.

Reject profile-language metacharacters, newline injection, shell injection, globbing, and paths escaping the managed root. Handle normal spaces with valid quoting rather than interpolation into a shell command. Do not follow a symlink to an arbitrary outside executable. Recheck recorded executable identity before the measured launch.

### 6.3 Policy content and tradeoff

Chromium's documented targeted pattern uses an AppArmor profile attached to a browser path, with a `userns,` rule. A conceptual template is:

```text
abi <abi/4.0>,
include <tunables/global>
profile UNIQUE_RUN_PROFILE "EXACT_CANONICAL_MANAGED_BROWSER_PATH" flags=(unconfined) {
  userns,
}
```

This is a policy template, not a ready-to-run profile. The helper must produce escaped, validated exact values and check syntax with the available parser before loading. Use the supported syntax on the measured runner; do not add broad fallback rules to make a parse or launch error disappear.

Here `flags=(unconfined)` is the upstream exact-program exception pattern enabling user namespaces. It is **not** permission to launch the Docker worker with `apparmor=unconfined`, and it does not create a restrictive AppArmor sandbox of its own. Chromium's own process sandbox must still initialize and be observed.

Attaching by path also means software able to replace that executable could benefit from the exception. Restrict it to the trusted, manually dispatched ephemeral job; use no broad cache-directory glob, admit no untrusted PR code, record executable identity, and remove the owned profile afterward. Do not claim the exception has no security cost.

### 6.4 Installation and ownership

Use a unique run-specific profile name and root-owned profile file. Keep a small ownership record outside the coordinator's proof root containing the profile name, exact attachment, content hash, creation/load outcomes, and removal status. Create exclusively and refuse name/path collisions; never replace an existing unrelated system profile. Do not invoke a global AppArmor service restart as a shortcut.

Validate the actual generated profile and load only that profile using the parser. Preserve parse/load errors and actual exit codes. If permission is unavailable or a policy cannot be safely installed, return a measured environment block; never switch to an unsandboxed browser.

The privilege-bearing helper should do only validated profile install/load/remove work. Do not run the coordinator, package installation, browser, or arbitrary test commands as root.

## 7. Prove the selected browser route

After a successful scoped policy setup, launch the **same** pinned executable, as the ordinary runner user, with the same headless mode, narrow environment, and `chromiumSandbox: true` used by the coordinator. Use a disposable profile directory. Run an actual page/render operation on synthetic local content, then close the browser. Keep the probe network-free except for explicitly local content; it does not need any online page.

Evidence must distinguish:

- `sandbox_requested`: configuration says true;
- `launch_succeeded`: a real browser returned a version and performed the operation;
- `sandbox_observed`: runtime diagnostic evidence is present and interpreted;
- `policy_changed`: whether an owned AppArmor profile was installed;
- `selected_executable`: path and hash actually used.

Do not set `sandbox_observed=true` merely because the option is true or because the process did not crash. Collect supported Chromium sandbox diagnostics, a minimal `chrome://sandbox` result, and/or relevant browser/renderer process namespace/seccomp facts. Explain which facts support the result. Do not require the obsolete SUID sandbox specifically: a successful user-namespace sandbox is the intended route. Container seccomp alone is not proof of Chromium renderer sandboxing. Where a diagnostic surface is unavailable, retain null/unknown and disclose exactly what was demonstrated.

When checking runtime arguments, inspect actual launch/process data and known bypass switches, not a naive substring check against all log text: the historical error messages themselves mention forbidden switches. Do not add bypass switches to make diagnostic collection work.

Keep the host policy active through all host-side test-browser lifetimes. A probe using one executable while E2E silently launches another does not qualify the pipeline.

## 8. Workflow integration without another directory collision

The workflow owns bootstrap/provisioning records. The coordinator owns its fresh `proof` root. Put pre-coordinator sandbox records under the outer bootstrap public/private siblings or the existing runner-temp fallback, never under `CH001_EVIDENCE_ROOT` before ownership is acquired.

Preserve all twelve R5 boundary regressions, refusal behavior, failure-report ownership checks, and fresh run-ID rules. A new sandbox helper must not pre-create `proof/public`, consume an old proof directory, delete historical evidence, or implicitly resume a run.

The workflow must capture actual provisioning, coordinator, reporting, upload, and cleanup outcomes separately. It may allow the coordinator to run after a failed policy prerequisite so that the existing coordinator produces its own honest blocked report; record that choice and preserve the provisioning failure. Do not silently treat a helper/configuration bug as a benign environment failure.

If the coordinator was never invoked, retain `proof_invoked=false` and `proof_exit_code=null`. An outer prerequisite exit 2 is not a fictional coordinator exit 2. If it ran, capture its actual exit, including 1 versus 2. A summary/upload step must not overwrite the primary failure with apparent success.

A policy cleanup failure is a real secondary problem and must be visible even if the bounded proof passed. Do not turn an incomplete cleanup record into an acceptance claim.

## 9. Cleanup and isolation

Implement an always-run cleanup path that removes only profiles/files created and loaded by this run, after the relevant browsers are stopped. Validate ownership and expected hashes before removal. Refuse to remove unknown or modified files/profiles and report the refusal. Cleanup must be idempotent and safe after partial setup or failure.

Record before/after host restriction values and confirm they were not globally altered. No `/etc/sysctl.d` changes, global service disabling, unrelated profile edits, root browser processes, or persistent user-installation changes are authorized.

The ephemeral hosted VM's eventual destruction is a fallback property, not a substitute for a cleanup implementation and receipt. Cancellation may prevent final evidence; such a run stays incomplete, never silently successful.

## 10. Existing bounded proof, once

After the new implementation is committed and locally checked, the router publishes T6/E6, verifies exact source/workflow identities, and dispatches at most one new workflow using T6. Follow `04_ROUTER_HANDOFF.md`.

Exercise the existing proof profile: host preflight/static checks, shipped Compose setup, worker browser/readiness, authenticated seven-slide journey, alternate ratio, JPEG-preview/export byte equality, and same-data restart/lifecycle checks. Do not reduce the required artifacts or convert the bounded proof into full acceptance.

Explicitly distinguish host browser qualification from the in-container worker. Keep the worker's non-root user, no-new-privileges, dropped capabilities, existing AppArmor/seccomp posture, and sandboxed launch. If its sandbox fails under the unchanged shipped settings, capture the container/image/security-option identity and the exact error. A host AppArmor fix is not evidence of a worker fix.

The next distinct application/container failure stops this phase for architect review. Do not continue modifying code and repeatedly dispatching under the same authorization. This packet authorizes fixing the known host prerequisite and recording the next real outcome, not an unlimited repair campaign.

## 11. Reports and delivery

Create `handoffs/CH-001R-r6.md` and `docs/evidence/CH-001R-r6/`. Update root operational state and evidence indexes without altering historical r1–r5 reports. Keep original finding dispositions honest and application acceptance false.

T6 contains execution-affecting changes, including workflow/helpers/config/tests. E6 contains evidence/docs/state only. Any execution-affecting edit after T6 produces a new tested implementation identity; never attach T6 results to different code.

Local fixtures for policy generation, report propagation, and cleanup may use fake executors. Mark them as local/helper evidence. They are not hosted AppArmor, browser, worker, or application proof.

Return `READY_FOR_ROUTER_PUBLISH / NEEDS_WORKFLOW_DISPATCH` only when the scoped implementation and local regressions are complete. Return `BLOCKED` with the exact remaining cause otherwise. After the router's result, do not mark v0.1 accepted; stop for architect review.
