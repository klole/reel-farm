# Chapter brief — TEMPLATE, not an authorized task

> Do not execute this blank template. The architect completes it for a specific chapter, and Kyle authorizes the work.

## 1. Control block

| Field | Value |
|---|---|
| Chapter ID | UNASSIGNED |
| Target application version | UNASSIGNED |
| Approval status | NOT APPROVED |
| Repository / branch | NOT PROVIDED |
| Exact base commit | NOT PROVIDED |
| Accepted North Star path / revision / hash | NOT PROVIDED |
| Previous review | NOT PROVIDED |
| Paid external calls authorized | NO |
| Account authorization / public publishing authorized | NO |
| Destructive migration / deployment authorized | NO |

## 2. One concrete goal

State the observable user outcome or technical qualification gate. Do not paste the entire roadmap. State what will be demonstrably different at the end of this chapter.

## 3. Starting reality

Record what exists at the base commit, what was actually inspected/tested, relevant known defects, and external prerequisites. Do not assume the repository is empty. Distinguish accepted functionality from a prototype or mock.

## 4. Read before changing code

List actual repository instructions, project state, precise specification sections/requirement IDs, accepted ADRs, and relevant existing modules. Use repository-relative paths that exist at the baseline. Include provider primary sources with revalidation dates when the chapter depends on them.

## 5. In scope

Specify the finite behaviors, interfaces, screens, data changes, and supported failure states for this chapter. Keep one primary outcome. Define what “working” means, including whether external behavior must be live-qualified.

## 6. Out of scope

Explicitly prohibit adjacent milestones, additional providers, unrelated refactors, billing, copying competitor assets/UI, public deployment, or other tempting expansions. Restate any chapter-specific prohibition on paid/live actions.

## 7. Technical constraints and contracts

Identify allowed/expected areas of change, interfaces, schema versions, migration requirements, provider capability assumptions, security boundaries, and error/retry/cost handling. Describe any delegated local decisions and any decisions that require an ADR before proceeding.

## 8. Verification matrix

| Requirement / test ID | Verification command or manual procedure | Required evidence level | Evidence output |
|---|---|---|---|
| TO BE FILLED | TO BE FILLED | TO BE FILLED | TO BE FILLED |

Record expected regression checks. Commands must exist or be deliberately introduced and run. No fabricated results. A mock fixture is labeled E2; a live provider operation requires separate authorization and evidence.

## 9. Live-action authorization, only when explicitly granted

State provider, exact operation, key source/reference (never the key), authorized account identity, allowed assets/content, privacy/mode, maximum calls/spend, external cleanup actions, and who approved it. Default remains none. A public post must not be inferred from a generic “test integration” instruction.

## 10. Acceptance outcomes

State the exact visible/technical result, output artifacts, security/reliability requirements, and acceptable known limitations. Define what blocks acceptance. Do not substitute “production-ready” for measurable outcomes.

## 11. Stop conditions

Stop and return evidence if baseline mismatch, missing required access, unsafe/unknown provider behavior, a major architecture/license decision, unexpected paid action, unauthorized public publication, destructive migration, or an unresolvable scope conflict is encountered. Complete safe in-scope work where possible and state remaining limits.

## 12. Handoff

Use the Luna handoff template. Provide base/head commits, changed files, commands and exit codes, screenshots/output examples where relevant, mock/live distinctions, migrations/dependencies, skipped checks, defects, and actual status updates. Do not declare the chapter architect-accepted. Stop after the handoff; do not start the next chapter.
