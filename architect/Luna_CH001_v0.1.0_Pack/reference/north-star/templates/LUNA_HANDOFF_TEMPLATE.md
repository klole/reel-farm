# Luna handoff — TEMPLATE

## Identity

Chapter ID: UNASSIGNED  
Repository/branch: NOT PROVIDED  
Base commit: NOT PROVIDED  
Head commit: NOT PROVIDED  
North Star revision/hash used: NOT PROVIDED  
Completion claim: NOT PROVIDED  
Architect acceptance: NOT YET REVIEWED

## Implemented outcome

Explain what a user can now do and what remains unavailable. Reference requirement IDs. Distinguish real code from placeholders, mocks, and unsupported features.

## Change inventory

| Path / module | Change and reason | Requirement IDs |
|---|---|---|
| TO BE FILLED | TO BE FILLED | TO BE FILLED |

Record new dependencies, versions, licenses, database/schema migrations, storage changes, configuration, and external-service dependencies. State whether any change deviated from the approved scope.

## Verification actually executed

| Command / procedure | Environment and commit | Exit/result | Evidence path | Mock/live/static |
|---|---|---|---|---|
| TO BE FILLED | TO BE FILLED | TO BE FILLED | TO BE FILLED | TO BE FILLED |

Include failures and skipped checks. Do not rewrite “not run” as “passed.” CI results must identify the exact commit/run. Manual visual checks state what was inspected, not merely that a screenshot exists.

## External side effects and cost

Were any provider requests made? Were they authorized? List operation IDs, count, estimated/observed/unknown usage, target account and visibility where relevant, and cleanup status. Never include credentials, signed URLs, private media, or unredacted raw provider payloads.

## Security and reliability review

Explain secret boundaries, safe import/render handling, approval checks, retry/idempotency behavior, schedule responsibility, data persistence, and partial failures relevant to this chapter. Mark nonapplicable areas rather than claiming a full security audit.

## Evidence for the user journey

Link sanitized screenshots, exported sample files, fixtures, logs, or recordings. State which output came from the submitted build and whether an external result was actually observed. An inbox handoff is not a public post.

## Known defects and limitations

For each issue, give severity, reproduction, affected requirement, user consequence, workaround if safe, and proposed next action. Identify live qualification still pending. Do not hide a blocker in a general “future improvements” paragraph.

## State and handoff completion

List state/evidence/decision files updated. Record proposals separately from accepted decisions. Confirm that no next chapter was started and that no acceptance verdict was self-assigned. End with the exact checks the architect should review first.
