# Provider qualification — TEMPLATE

Provider and operation: NOT PROVIDED  
Account/plan/route/media type: NOT PROVIDED  
Provider documentation checked on: NOT PROVIDED  
Adapter commit/version: NOT PROVIDED  
Authorization record: NONE  
Live calls permitted: NO  
Public posts permitted: NO  
Maximum spend/calls: ZERO UNLESS SEPARATELY APPROVED

## Scope

Identify exact capabilities under test: connection, native photo generation/upload, direct publication, inbox handoff, scheduling, cancellation, disclosure, metrics, or recovery. Do not treat one successful operation as qualification of the whole provider.

## Preconditions and constraints

Record current pricing/entitlement, owned/synthetic test media, secret source reference, account identity verification, scopes, retention, idempotency window, policy/terms assumptions, and any required user approval. Never include keys or signed URLs.

## Results

| PQ/test ID | Procedure | Evidence level | Result | Sanitized evidence | Limitation |
|---|---|---|---|---|---|
| TO BE FILLED | TO BE FILLED | E0 until executed | NOT RUN | NONE | TO BE FILLED |

Allowed result labels: `not_run`, `passed`, `failed`, `inconclusive`, `unsupported`. Record simulated/fixture failures separately from live observations. Time-dependent behavior is not passed before it has actually been observed.

## Provider semantics learned

Document field mappings, output states, account-route differences, required disclosures, media limits/retention, replay behavior, cancellation races, costs, and unavailable metrics. Link exact primary docs and sanitized response fixtures. State disagreements with documentation rather than quietly choosing a convenient interpretation.

## Side effects and cleanup

List accepted external request/post IDs in a suitably protected evidence location, number of calls, actual/estimated/unknown costs, whether anything became public, whether scheduled work remains, and what cleanup was actually confirmed. A cancellation request alone is not confirmed cleanup.

## Support recommendation

Specify the exact capability/account/route that may be advertised, what stays experimental or disabled, and what requires a new qualification. Recommend accept, repair, alternate provider, or continued hold. Architect/Kyle acceptance is recorded separately.
