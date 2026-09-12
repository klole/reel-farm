# Primary sources and review references

Repository observations are pinned to the cited commits. Online documentation was consulted during this review. No general web search was substituted for the connected repository reads.

| ID | Primary source | Use |
|---|---|---|
| S1 | [T6 workflow](https://github.com/klole/reel-farm/blob/e0ea57665d00a643a8c392dfb9f6a84a723729af/.github/workflows/ch001-live-proof.yml#L23-L40) and [E6 same file](https://github.com/klole/reel-farm/blob/a4d6e7a0149d6852bf348d6277c4200720320f9c/.github/workflows/ch001-live-proof.yml#L23-L40) | Job-env expression and matching Git blob; qualifier/cleanup wiring. |
| S2 | [GitHub context availability](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability) | Job-level env excludes runner; running step contexts differ. |
| S3 | [E6 handoff](https://github.com/klole/reel-farm/blob/a4d6e7a0149d6852bf348d6277c4200720320f9c/handoffs/CH-001R-r6.md) | Historical local results, identities, unchanged pins, qualification not executed. |
| S4 | [T6 package scripts](https://github.com/klole/reel-farm/blob/e0ea57665d00a643a8c392dfb9f6a84a723729af/package.json#L8-L26) | ESLint and Node CI scripts are not a workflow semantic-validator entry point. |
| S5 | [actionlint v1.7.7 checks](https://github.com/rhysd/actionlint/blob/v1.7.7/docs/checks.md) | Validator capabilities: expression contexts, workflow structure, references; no claim it ran here. |
| S6 | [E6 validation-only record](https://github.com/klole/reel-farm/actions/runs/34675672523) and [API records filtered to E6](https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=a4d6e7a0149d6852bf348d6277c4200720320f9c&per_page=20) | Push-triggered failure, distinct from a manual live-proof run. |
| S7 | [Jobs endpoint for that record](https://api.github.com/repos/klole/reel-farm/actions/runs/34675672523/jobs) | Observed zero jobs. |
| S8 | [GitHub environment-file behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-environment-variable) | GITHUB_ENV transfers data to subsequent steps. |
| S9 | [Official actionlint v1.7.7 release](https://github.com/rhysd/actionlint/releases/tag/v1.7.7) | Concrete validator release reference. Version is not advertised as latest. |
| S10 | [E6 Git commit metadata](https://api.github.com/repos/klole/reel-farm/git/commits/a4d6e7a0149d6852bf348d6277c4200720320f9c) | E6 parent T6 and E6 tree identity. |
| S11 | [GitHub main ref](https://api.github.com/repos/klole/reel-farm/git/ref/heads/main) | At review the connected response was E6; mutable, must be rechecked. |

## Verification boundaries

The workflow blob equality at T6/E6 was checked through connected file responses. The SHA-256 in the user/handoff is recorded as reported, not independently recomputed from a complete local copy. The E6 relationship to T6 was confirmed through Git metadata.

The exact HTTP body of the router's failed manual dispatch was not supplied or retrieved; this packet does not invent it. GitHub's separate push-validation record and zero jobs were independently observed. Source placement and the official availability rule explain the reported rejection.

The architect runtime did not have actionlint installed, and attempted retrieval was unavailable (network/download restrictions). This is a review-tool limitation, not a finding about the editing box or router. It is not permission to omit Luna/router workflow validation.

The isolated reference-shell diagnostic uses the included shell fixture and temporary synthetic paths only. It does not execute repository application code, GitHub jobs, Chromium, Docker, or a policy change. Its generated report is included with the exact boundary declaration.
