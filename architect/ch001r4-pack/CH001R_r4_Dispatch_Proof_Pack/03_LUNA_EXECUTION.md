# Luna MAX assignment — CH-001R-r4

## Goal and effort

Use the highest available effort setting for careful inspection, exact identity handling, and evidence review. **MAX effort does not authorize broader scope, new permissions, unlimited reruns, or a rebuild.**

Execute the existing CH-001R-r3 bounded proof against frozen T3 and return a complete operational handoff. This packet is the authority for the publication/dispatch/evidence step. The North Star, original CH-001 gates, and r3 bounded proof remain unchanged.

## Phase 0 — inspect, do not restart implementation

Read this packet, the pinned E3 handoff, its evidence index, project state, and the workflow at T3. In your workspace record the actual HEAD, tracked changes, and relevant branches without publishing secrets. Preserve pre-existing untracked user files.

The identities are:

```text
T3: 0b79ed07a25a618ab4da2bf56a2fed6047398cb5
E3: 4cf020317cfc2e8755f35ee6da10f7397c8676f2
B3: a5afe2d8d1bc7741a0276513f3f1111d3ff587ae
Workflow: .github/workflows/ch001-live-proof.yml
Workflow blob: 4a1b045e4771901713a2ad00705a0a84c9ff1dab
T3 tree: 2852c9a96595e9aca234aa30f449ec615a4b43bd
```

Do not replace T3 with local HEAD merely because E3 or this operational packet has been committed. `implementation_sha` stays T3. If code has already changed beyond it, report the graph and stop for an explicit new test-target decision.

## Phase 1 — publication gate

Read remote main and confirm T3 ancestry, E3 retention, and the workflow blob. Use [02_OWNER_PUBLISH_RUNBOOK.md](02_OWNER_PUBLISH_RUNBOOK.md).

If the authorized connection can make the required non-force publication and Kyle has assigned this operational packet, use that existing permission. Do not claim that every connector shares the failed OAuth token's restrictions. Conversely, the fact that the connector can read T3 is not proof that it can publish workflow files.

If no suitably authorized write path is available, prepare the exact-object transfer/owner command and return `OWNER_ACTION_REQUIRED`. Do not repeatedly retry the same rejected push, request credentials in chat, modify authentication outside the owner's approval, or rewrite workflow content through a different commit as a workaround.

If an owner already published the correct history, skip the push. If a matching live run already exists, skip a new dispatch and proceed to evidence collection. Never force-update main or discard another agent's work.

## Phase 2 — choose and record one dispatch

Verify the workflow definition actually used by main still matches the reviewed blob and approved runner/security scope. Record the full main/workflow-definition commit W immediately before dispatch. Keep unreviewed concurrent branch changes out of the proof.

Allowed dispatch:

```bash
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main \
  -f implementation_sha=0b79ed07a25a618ab4da2bf56a2fed6047398cb5
```

Use a supported authenticated CLI/UI/API path; do not issue a POST through a read-only fetch tool. No change to workflow triggers, branch protections, repository visibility, runner class, paid services, or runtime token scope is authorized.

Record the actual run ID, attempt number, triggering actor, event, branch, and timestamps. A run list entry is a candidate until the requested input and checked-out HEAD are verified. If the submission response is ambiguous, look for the already-created run before issuing any other dispatch.

Authorization under this packet is one initial matching dispatch, or resumption of an existing one. A rerun requires an explicit reason and a new recorded attempt; do not start a blind retry loop or overwrite prior failure evidence.

## Phase 3 — inspect the hosted result

Use the actual run and job records. Observe whether checkout, frozen installation, Docker/Compose probes, proof invocation, evidence upload, and final exit-preservation steps occurred. A Docker probe marked `continue-on-error` is not evidence of Docker availability; inspect the later coordinator/environment result.

The following are reasons to stop with a specific non-pass result, not reasons to weaken a test:

- workflow registration/dispatch/policy failure;
- runner or container prerequisite unavailable;
- failed install/build/migration/browser/worker assertion;
- source identity mismatch;
- no live test discovery or execution;
- missing, expired, unsafe, or wrong-run artifact;
- incomplete proof or contradictory exit/report identity.

Do not interpret shell errors from the known Markdown-backtick summary defect as application test failures. Also do not conceal them. Preserve them as workflow reporting defects and verify identity from `dispatch.txt`, checkout output, and machine-readable reports instead.

If the run is still in progress when your execution must stop, return `DISPATCH_SUBMITTED_PENDING` with its exact ID/attempt and last observed step. Do not call it proof-ready and do not promise an unobserved future result.

## Phase 4 — collect evidence, not just a green check

Follow [04_EVIDENCE_AND_HANDOFF.md](04_EVIDENCE_AND_HANDOFF.md). Download only the matching sanitized artifact, record metadata/expiry and hashes, inspect the seven-slide export and alternate format, and verify the proof's identity and actual assertion counts.

Expected artifact name for the inspected workflow:

```text
ch001-live-proof-<GitHub run ID>-<run attempt>
```

Expected coordinator run identity:

```text
r3-<GitHub run ID>-<run attempt>
```

The path/name uses `r3` because the code under test is the original r3 coordinator. Do not rename evidence fields to r4 merely to match this operational packet. Record that CH-001R-r4 collected an r3 implementation proof.

Do not edit downloaded machine reports or merge partial results from different runs into a synthetic all-green result. A small evidence-only index may reference the original artifact and separately explain findings.

## Phase 5 — stop with an auditable handoff

Write `handoffs/CH-001R-r4.md` and `docs/evidence/CH-001R-r4/README.md` after collecting actual results. Update root operational state to point to them while retaining `awaiting_review`, accepted version `none`, T3 as the tested implementation, and the unchanged historical evidence.

If committing these documents is authorized and available, make a separate evidence-only commit E4. Do not alter T3 or pretend that E4 was executed by the runner. Record E4's SHA externally after committing; do not try to embed a commit's own final SHA in that same commit's content.

If evidence cannot be pushed, return the local E4 SHA and transferable sanitized files, explicitly marked unpublished. Do not replace a real run URL with an imagined repository link.

## Allowed change surface

Only operational handoff/state/evidence-index documents and local transfer/evidence files are in scope. Application code, package manifests/lockfiles, test semantics, original acceptance files, and the workflow itself remain frozen. Newly observed failures become a precise follow-up finding, not an opportunity to begin v0.2 or silently create T4.

No fal.ai, ScrapeCreators, Pinterest, TikTok/direct official TikTok API, publishing bridge, automation, analytics, teams, billing, video, public deployment, release, or tag creation is authorized. No real social account or provider secret is needed.

## Completion status

Use one of the following task-level outcomes, with root state still awaiting review:

| Outcome | Meaning |
|---|---|
| `OWNER_ACTION_REQUIRED` | Publication/authentication/policy gate remains. Give the exact missing action. |
| `DISPATCH_SUBMITTED_PENDING` | An identified run exists but no completed result has been observed. |
| `BLOCKED_ENVIRONMENT` | The identified runner measured an unavailable prerequisite before assigned live assertions could complete. |
| `LIVE_PROOF_FAILED` | An assigned assertion or build/runtime step genuinely failed. Preserve the first failure and artifact. |
| `EVIDENCE_INVALID` | Run identity, artifact integrity, completeness, or retrievability is insufficient. |
| `LIVE_PROOF_READY_FOR_REVIEW` | The assigned bounded proof completed and its evidence is available for architect review. This is not v0.1 acceptance. |

Do not require every original CH-001 gate to pass to return a successful **bounded** proof. Equally, do not treat bounded success as passing all 72. List the remaining original gates honestly and stop for the next architect decision.

