# Router protocol — T6 publication and one fresh proof

## 1. Roles

The architect issues this scoped assignment. Luna implements/tests and returns T6/E6. The router uses its existing workflow-capable publication path, verifies exact identities, dispatches at most one new hosted run, retrieves evidence, and returns the result. Application acceptance remains reserved for architect review.

The packet author has not sent this assignment to an external agent, pushed a commit, changed settings, or dispatched a workflow.

## 2. Publication checks

P6 is the actual commit that imports this approved packet after the recorded T5 artifact baseline. T6 is the new execution-affecting implementation; E6 is documentation/evidence only. Record all three full SHAs and trees. Do not invent them in advance or require an evidence commit to contain its own self-referential SHA.

Verify that the preserved baseline `6f600381c72bc68bc550e69ab0e86d522a81a389` is an ancestor and that unrelated work was not overwritten. Do not amend, force-push, or reuse T5 as if it contained the new policy repair.

Before dispatch, establish:

- T6 and E6 exist on `origin/main`, and T6 is an ancestor of E6.
- T6→E6 changes only docs/state/evidence, not workflow/helpers/config/tests.
- The workflow definition on the dispatch ref contains the authorized policy and cleanup behavior.
- Its execution-affecting workflow content matches the intended T6 version, or any difference is explicitly reviewed before execution.
- Pin and lockfile hashes remain unchanged.
- The new helper tests and all R5 regressions were really executed against T6.
- No new execution-affecting changes happened after the tested T6.

A workflow-capability error is a publication blocker, not a reason to strip checks or request broad tokens. Use the already authorized router path. Never expose credentials in the handoff.

## 3. Exact one-dispatch rule

Dispatch exactly one new workflow for the newly published T6, using full SHAs and the existing workflow name. The following is a router template, not a command already run:

```bash
set -euo pipefail
REPO=klole/reel-farm
T6=REPLACE_WITH_ACTUAL_FULL_T6_SHA
E6=REPLACE_WITH_ACTUAL_FULL_E6_SHA

[[ "$T6" =~ ^[0-9a-f]{40}$ && "$E6" =~ ^[0-9a-f]{40}$ ]]
git fetch origin main
git cat-file -e "$T6^{commit}"
git cat-file -e "$E6^{commit}"
git merge-base --is-ancestor "$T6" "$E6"
git merge-base --is-ancestor "$E6" origin/main

# Inspect the T6..E6 diff and capture the workflow identity before proceeding.
git diff --name-status "$T6" "$E6"
gh api "repos/$REPO/contents/.github/workflows/ch001-live-proof.yml?ref=main" --jq .sha

gh workflow run ch001-live-proof.yml \
  --repo "$REPO" --ref main -f implementation_sha="$T6"
```

Do not run the template twice because the CLI does not immediately print a run URL. Find the new run using dispatch time, actor, event, workflow, input and checkout identities. Confirm the requested SHA in the actual reports/logs, not merely the workflow's head SHA; those are different identities by design.

Do not rerun T3, T4 run `34669975078`, T5 run `34671716094`, or the older failure `34665615514`. A new arbitrary run ID without code repair would not address the sandbox policy.

## 4. Observe the actual result

Record the new run ID, attempt, job, head/workflow-definition commit, workflow blob/hash, requested implementation, actual checkout, and tree. A completed Actions failure can represent a measured environment block; read the coordinator and outer reports rather than inferring from the icon.

Inspect the host policy record, before/after sandbox evidence, cleanup receipt, bootstrap report, coordinator result, command/suite reports, gate ledger, and actual payload files. Record whether the shipped worker browser ran and whether the application journey really started.

Outcome decisions:

| Observed outcome | Router disposition |
|---|---|
| Setup/refusal/configuration error before proof | Preserve real stage/exit and null absent-proof fields; return for review. |
| Host sandbox still unavailable | Preserve targeted policy/launch diagnostics and unchanged global settings; stop. |
| Host sandbox passes; worker sandbox or image fails | Report separate worker/image context and evidence; stop. Do not weaken container isolation. |
| Browser prerequisites pass; application assertion fails | Preserve actual assertion and source identity; stop. No unrelated fix/redispatch loop. |
| Bounded proof succeeds with valid artifacts | Return `LIVE_PROOF_READY_FOR_REVIEW`; keep application acceptance false. |
| Artifact delivery, evidence integrity, cleanup, or identity is incomplete | Record the secondary blocker; do not promote to acceptance. |

## 5. Preserve the artifact and post-delivery receipt

Download the actual Actions archive, record its byte length and SHA-256, compare with Actions' digest, and verify payload references and hashes. Retain the archived bytes unchanged. Never create a download link or receipt for an artifact that does not exist.

Preserve under a new run-specific `architect/` evidence path or the established durable artifact mechanism. If a small public ZIP is committed, include only sanitized synthetic proof data. Do not overwrite the T5 archive or `architect/ch001r5-live-proof-34671716094/`.

Append a router receipt binding archive digest, run/attempt/job IDs, final outcome, actual source/workflow identities, cleanup outcome, and explicit artifact expiry. A metadata-only E6 receipt may be followed by a router artifact commit; give it a separate real SHA.

Do not copy the old 4/0/68 counts into the new run. Count the newly produced ledger. If no new ledger exists because the coordinator did not reach it, record the current run's gate counts as unavailable and cite historical counts separately.

## 6. Return message

Use a compact update containing:

```text
CH-001R-r6 router outcome
P6 / T6 / E6 / router artifact commit: actual full identities
Run / attempt / job / workflow definition: actual identities
Bootstrap: actual result
Host sandbox: actual default + qualified launch/observation
Owned policy cleanup: actual result
Worker sandbox: actual result or NOT_RUN
Proof invoked / actual proof exit / classification: actual values
Current run gate counts: actual ledger or unavailable
Artifact ID / name / bytes / digest / expiry: actual values
Canonical export/preview/lifecycle: actual files or NOT_RUN with cause
Primary blocker: exact observed error or none
application_acceptance=false; root awaiting_review; accepted version none
Dispatch count: 1 (or 0 if publication blocked)
```

Do not begin the next chapter. Successful host qualification is progress, not application acceptance. Successful bounded application proof is reviewable evidence, not automatic satisfaction of the strict checkpoint.
