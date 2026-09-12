# Luna MAX assignment — CH-001R-r5

## Objective and stop rule

Repair the specific workflow/coordinator directory collision demonstrated by T4 run `34669975078`, add real focused regression coverage, and return a new committed implementation for the router to publish and exercise once. Protect rejected historical evidence as part of the same initialization boundary.

This is not another broad CH-001 rebuild. Do not redesign the app, CI bootstrap, package manager, original gate contract, or r3 proof profile. If the fresh proof reaches a new unrelated application defect, preserve its evidence and stop for architect review rather than expanding this repair without a new assignment.

Use MAX effort in the agent interface; the text does not itself configure the agent's effort setting.

## Starting authority and identities

Review baseline: `df008ff64d02ada64b8e91578143709ea7b98b89`. T4: `69b784526260e3e5acf133da8d1a2fb33447d20f`. E4: `2dd7737aedb60dcb2536ded77a2e64dc56545a9d`.

Before editing, inspect `git status`, `git rev-parse HEAD`, `git log`, and the diff from this baseline. Preserve user work and the committed T4 hosted evidence. If `main` has advanced with execution-affecting work, record the divergence and do not overwrite or retest T4 as though it includes those changes.

Read the existing `AGENTS.md` if present; the North Star and original CH-001 packet; the r3/r4 handoffs and current state; this review; the T4 hosted artifact; `.github/workflows/ch001-live-proof.yml`; `scripts/ch001-proof.ts`; `scripts/ci/ci-result.mjs`; and `tests/ci/`.

The router may first commit this packet as P5. Record the actual P5/base SHA when it exists. Do not invent P5, T5, E5, run IDs, or artifact references. T5 will be the new execution-affecting commit, and E5 a subsequent evidence/documentation-only commit.

## Authorized scope

Allowed: the workflow identity/evidence initialization block; narrowly related coordinator initialization and refusal reporting; a small filesystem-only helper if needed for genuine shared-code tests; targeted regression files and their test wiring; handoff/state/evidence documentation.

Keep unchanged unless a separately demonstrated necessity is recorded: Node `20.19.2`, pnpm `12.3.4`, pnpm release manifest/digests, lockfile, application dependencies, native bootstrap implementation, Dockerfile, app code, renderer code, the 72 gate IDs and definitions, strict verifier acceptance thresholds, r3 bounded-proof assertions, runtime security controls, and scope exclusions.

Do not add providers, AI, Pinterest, TikTok/direct official APIs/bridges, scheduling, analytics, billing, video, release/deployment, or v0.2 work. Do not rewrite historical handoffs or raw evidence. Use an addendum/new r5 record for new observations.

## Required repair

### 1. Give each component its own output directory

The intended existing layout remains:

```text
<run-parent>/
  bootstrap/public/     # outer workflow/helper-owned
  proof/                # coordinator-owned
    public/
    private/
```

Before the proof begins, the workflow may create its own bootstrap path and fallback path, but must not create anything within the proof root. The smallest observed fix is to remove the premature `"$CH001_EVIDENCE_ROOT/public"` operand from workflow setup. Audit other pre-proof steps for the same side effect.

Creating an empty proof root inside the coordinator is consistent with the current contract; creating its children before the freshness guard is not. Keep path quoting and the run-ID validation intact. Any r4-to-r5 output-prefix label change must be consistent across all environment/report/upload paths and must not be the actual fix.

### 2. Preserve refusal and historical evidence

Retain the nonempty-run refusal. Do not clear, rename away, silently resume, merge into, or whitelist a nonempty prior proof directory to obtain a green result. Do not change the guard to ignore `public/`.

Only write coordinator-owned reports after this invocation successfully establishes ownership of a fresh proof root. On refusal, leave all prior bytes intact, return a nonzero result, and report the error through the outer bootstrap recorder or stderr. Keep `proof_invoked=true` when the coordinator was actually called; a missing proof file must not imply that it was never invoked. Existing nullable absent-report semantics remain in force.

A focused ownership flag or shared directory initializer is allowed. Avoid generic storage abstractions, broad refactors, automatic resumption, and cleanup of non-owned data. Address errors in the same boundary without changing the substantive proof assertions.

### 3. Add executable regression coverage

The tests must exercise the real initialization code or the actual workflow setup fragment, not merely assert that a string is absent from YAML. Do not create an independent test-only implementation that can diverge from production.

Required cases:

| ID | Case | Required observation |
|---|---|---|
| R5-T01 | Reproduce the old boundary in an isolated fixture | Creating `proof/public` before preparation triggers the current nonempty-root failure. |
| R5-T02 | Corrected workflow setup | Bootstrap reports/directories can be initialized without populating the proof root. |
| R5-T03 | Corrected handoff | Real coordinator preparation accepts that fresh root and creates its owned children. This is a boundary assertion, not a live-app pass. |
| R5-T04 | Preexisting empty `public` child | The root is still refused; the guard has not been weakened. |
| R5-T05 | Prior evidence payload | Refusal preserves existing report and sentinel hashes, with no overwritten or deleted files. |
| R5-T06 | Repeat same run | A second initialization is rejected; implicit resumption is not introduced. |
| R5-T07 | Separate run | A different fresh run works without touching its sibling run's evidence. |
| R5-T08 | Quoted paths | A temporary repository/run-parent path containing spaces is handled correctly. |
| R5-T09 | Invalid run/path | Existing invalid run-ID and outside-repository protections still reject unsafe input. |
| R5-T10 | Refusal result propagation | Outer CI remains nonzero, retains the actual child exit, and never claims app tests ran. |
| R5-T11 | Failure after successful initialization | Owned failure-report writing still works and stays in the correct run. |
| R5-T12 | Existing CI regressions | Native bootstrap, digest/pin, literal summary, absent proof, and exit-classification regressions remain passing. Report actual counts. |

Use temporary run-owned directories and deterministic assertions. No Docker, credentials, network download, or real app launch should be necessary merely to test directory ownership. If shared preparation currently mixes those concerns, extract only the filesystem boundary needed for these tests; keep test stubs out of the deployed proof outcome.

## Verification on the editing host

Execute the focused tests, the existing CI regression command, lint, typecheck, build, unit, and security checks. Retain exact commands, exits, discovered/executed/passed/failed/skipped counts, and new logs. Check lockfile and pinned configuration hashes before and after. Do not describe old local results as a new run.

Where setup is required, use the already-approved native bootstrap and frozen install. Do not return to Corepack. The new regression must fail for the historical boundary and pass for the corrected boundary, with both outcomes clearly labeled as a focused regression rather than application acceptance.

A local `pnpm proof:ch001` run is useful when the environment permits it; use a fresh ID and preserve its actual result. If the host still denies Docker, loopback, or Chromium, report the exact limitation and return the tested boundary repair for router publication. Do not demand that the restricted editing host magically pass all 72 gates before publication; the authorized hosted proof is the next capability check. Do not mark unexecuted runtime gates PASS.

Commit all execution-affecting changes as T5 before authoritative proof. Any later execution change invalidates that tested identity and requires a new implementation SHA. E5 must be documentation/evidence only. Record file lists and actual trees/workflow hashes. Do not rewrite a commit to make its own hash appear inside its contents.

## Handoff and state

Create `handoffs/CH-001R-r5.md` and `docs/evidence/CH-001R-r5/` with the base, T5, E5 convention; changed files; actual test evidence; the T4 root-cause reference; exact scope declaration; and remaining environment/hosted gaps. Update root state and evidence index additively, following existing repository conventions.

Maintain:

```text
root state: awaiting_review
application_acceptance: false
accepted application version: none
```

Use `READY_FOR_ROUTER_PUBLISH / NEEDS_WORKFLOW_DISPATCH` only after the focused repair and runnable regressions are committed. It means ready to publish/test, not app acceptance. If those local checks fail, use a blocked status and explain the failure rather than dispatching broken code.

Do not dispatch from the editing box or seek broader credentials. Hand the new identities to the existing workflow-capable router. No retry of old run `34665615514`, no T3 dispatch, and no re-run of the unchanged T4 failure `34669975078`.

## Completion criteria for this continuation

The local implementation deliverable is complete when the specific boundary regression is fixed, protection tests pass, existing scoped checks have actual results, pins/contract are preserved, and T5/E5 are recorded. Hosted completion additionally requires the router to publish, dispatch once at T5, retrieve the settled outcome, and show whether the coordinator passed initialization and reached its real preflight/proof steps.

A new downstream failure is valuable evidence, not permission to expand scope. Return it intact for the next architect decision. A bounded success still does not close all 72 parent gates or authorize v0.2.
