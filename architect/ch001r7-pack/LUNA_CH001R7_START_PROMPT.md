# Starting prompt — Luna MAX / CH-001R-r7

Execute CH-001R-r7 using MAX effort as a bounded continuation of CH-001, targeting v0.1.0. Read the packet and the actual repository before editing. Do not return only another plan.

Reviewed baseline: E6 `a4d6e7a0149d6852bf348d6277c4200720320f9c`, parent T6 `e0ea57665d00a643a8c392dfb9f6a84a723729af`. The manual T6 dispatch was rejected before execution. In the published workflow, `CH001_SANDBOX_STATE_DIR` uses `${{ runner.temp }}` in job-level `env`, where GitHub disallows the runner context. GitHub also has a separate E6 push-validation failure record `34675672523` with zero jobs; do not treat it as a live-proof run.

Remove the unsupported job-level binding. Resolve the same run/attempt-specific sandbox state path in the existing runtime identity step, pass it to later consumers via GITHUB_ENV, and preserve r6 sandbox policy, explicit opt-in and owned cleanup. Preserve r5 proof-directory ownership. Do not merely put a literal `$RUNNER_TEMP` into job-level env.

Add a real pre-publication GitHub Actions-aware validation command (actionlint, pinned with recorded provenance), test the complete historical T6 workflow as an expected context failure, and validate the complete repaired workflow. Add executable runtime-path/wiring and validator failure-control regressions. Keep tooling absence and unexecuted checks honest. Run the required existing checks and bind all evidence to actual T7/tree/workflow bytes.

No redesign, application features, dependency upgrades, global policy relaxation, no-sandbox fallback, root browser, privileged/unconfined containers, provider/publishing work, original-gate edits, strict-verifier weakening, or v0.2 work. Do not claim runtime qualification from syntax validation.

Return actual T7/E7 and workflow identities, local command/test evidence, and the r7 handoff. If a real validator is unavailable on the editing host, return READY_FOR_ROUTER_VALIDATION without claiming PASS; the router must validate before publication/dispatch. Otherwise return READY_FOR_ROUTER_PUBLISH. The router may publish via its existing authorized route and submit at most one fresh T7 dispatch with sandbox_qualification=true after the packet prerequisites pass. Do not rerun old T3/T4/T5/T6 records.

Keep application_acceptance=false, accepted version none and root awaiting_review. Hosted fields remain null/NOT_RUN until a real authorized run exists. Stop for router/architect review.
