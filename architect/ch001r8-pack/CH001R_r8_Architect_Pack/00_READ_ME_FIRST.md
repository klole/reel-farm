# CH-001R-r8 — CI prerequisites and isolated test environments

**Authorized next work:** repair the two demonstrated CI-harness defects exposed by the accepted T7 dispatch. Continue the existing bounded proof; do not redesign the application or sandbox.

**Review verdict:** `REPAIR_REQUIRED`. Application acceptance is `false`; accepted application version is `none`; root state remains `awaiting_review`.

Read [the review](01_REVIEW_VERDICT.md), then [the Luna assignment](02_LUNA_MAX_ASSIGNMENT.md), [the checks](03_REQUIRED_CHECKS.md), and [the router/handoff rules](04_ROUTER_AND_HANDOFF.md). [Sources](05_SOURCES.md) bind the findings to the inspected commit and hosted outcome.

This packet supersedes r7 only for the next repair authorization. It preserves the original North Star and CH-001 acceptance contract, the r5 evidence-directory fix, the r6 sandbox design, and the r7 workflow-context repair. No historical result is rewritten.

The small `reference/` program is an architect diagnostic, not a production patch or a replacement for repository tests. Its five observations show why passing an already-constructed environment back through an override merger changes test behavior on a hosted runner. The packet also carries the original T7 failure artifact and an independently generated inventory.

The implementation agent should use MAX effort, but stop at the bounded scope. No unsandboxed browser, root browser, global policy relaxation, dependency upgrades, paid providers, TikTok, publishing, scheduling, analytics, billing, video, deployment, release, or v0.2 work is authorized.

**Transfer:** give Luna the ZIP and `START_PROMPT.md`. Nothing in this packet claims that the architect sent an external message, pushed a commit, or started a workflow.
