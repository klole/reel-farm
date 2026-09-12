# Observations from the actual hosted job log

Source: GitHub connector decoded job log for `103512556268`, run `34678495442`, attempt 1. These observations are an architect transcription, not a rerun. Full raw job output was read through the connector; the included original artifact carries only its uploaded sanitized log subset.

- Requested and actual checkout: T7 `6b02857401a9b1e81e1bd36d5a4418f90903adcb`.
- `CH001_SANDBOX_OPT_IN=true` was visible in the job environment.
- Runtime identity step completed and subsequent steps received `/home/runner/work/_temp/ch001r6/34678495442-1/sandbox` as their sandbox-state path.
- Node setup reported v20.19.2.
- `node --test tests/ci`: 50 tests; 45 pass; 5 fail; 0 skipped.
- R7-T01 failed on `2 !== 1` (tool-unavailable status instead of semantic-invalid status).
- R7-T02 reported: `workflow validation blocked: No usable actionlint executable found; install pinned v1.7.7 or set ACTIONLINT_BIN.` and `2 !== 0`.
- R7-T03 and R7-T04 failed when expected real validator diagnostics were not present.
- R7-T07 failed on `missing RUNNER_TEMP`; its `notStrictEqual` assertion saw actual helper exit 0.
- Native pnpm bootstrap, frozen install, Chromium install, sandbox qualification, Docker probe, and bounded proof were skipped.
- Cleanup reported: `CH-001R-r6 sandbox cleanup: no owned policy record.`
- Final enforcement reported: `CH-001R-r4 CI_BOOTSTRAP_FAILURE; proof_invoked=false; proof_exit=null.` The phase string is the retained reporter schema label, not proof that T4 was checked out.
- Artifact delivery produced ID `10293345418` and SHA-256 `c623cdbadeee57182434cc360c8a098bac56a1ad0db0cdc17219c837b3c7c37a`.

The four successful historical CI modules/partial counts and this 45/5 helper result are not application gate counts. No application gate ledger exists in this run's artifact.
