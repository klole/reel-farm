# Sources and evidence map

GitHub reads were made through the connected GitHub tools. Public technical documentation was checked separately. Historical artifact bytes are included under `evidence/`. Source identifiers below are local document references, not claimed test results.

**S1 — Source state and handoff.**
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/handoffs/CH-001R-r8.md
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/state/PROJECT_STATE.md
- https://api.github.com/repos/klole/reel-farm/git/ref/heads/main (observed E8; this URL is mutable)

**S2 — T8/E8 comparison.**
https://api.github.com/repos/klole/reel-farm/compare/0144f6c41ae4c6143a2dc46fe22d59d453ce8763...d04a0a70d890890132041061be87742396c1909e

**S3 — Actual run, jobs, artifact listing.**
- https://github.com/klole/reel-farm/actions/runs/34928718810
- https://api.github.com/repos/klole/reel-farm/actions/runs/34928718810/attempts/1
- https://api.github.com/repos/klole/reel-farm/actions/runs/34928718810/jobs
- https://api.github.com/repos/klole/reel-farm/actions/runs/34928718810/artifacts
- Actual downloaded artifact ID: `10380711446`; archive SHA-256: `3c3905e781479fb627481c6bbf5a0bbea03ae1ab93d323cfda5b1475415db92f`.

**S4 — T8 caller.**
https://github.com/klole/reel-farm/blob/0144f6c41ae4c6143a2dc46fe22d59d453ce8763/.github/workflows/ch001-live-proof.yml

Inspected the job environment and `actionlint_bootstrap` step. Connector reports blob `fb4d3e4ee58eff81e43395fa6df99c53b65de417`.

**S5 — T8 helper.**
https://github.com/klole/reel-farm/blob/0144f6c41ae4c6143a2dc46fe22d59d453ce8763/scripts/ci/actionlint-bootstrap.mjs

Inspected `assertAbsolutePath`, `writeReport`, `contextFor`, `provisionActionlint`, CLI parsing, and finalization. Connector reports blob `b3fcb7e16796cbc5a39d330bdb763e92592ae5d9`.

**S6 — Recorded local rehearsal.**
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/docs/evidence/CH-001R-r8/commands.log
- https://github.com/klole/reel-farm/blob/d04a0a70d890890132041061be87742396c1909e/docs/evidence/CH-001R-r8/hosted-like-prefix.json

These records describe successful local helper/test sequences. They do not supply literal workflow-shell execution evidence for the failing report-path derivation.

**S7 — Primary technical documentation.**
- https://nodejs.org/api/path.html — `path.resolve`, `path.dirname`, and absolute versus relative paths. This is a live documentation page, not authority to upgrade project Node.
- https://docs.github.com/en/actions/reference/runners/github-hosted-runners — workspace filesystem and use of supplied path variables.
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — working directories and step execution.

**S8 — Downloaded historical payload and independent inspection.**
- `evidence/ch001-live-proof-34928718810-1.zip` — untouched downloaded archive.
- `evidence/historical-run-inspection.json` — member SHA-256 values, identities, interpretation limits, and 14 executed historical-artifact checks.
- `evidence/T8-ci-result.json`, `T8-bootstrap-result.json`, `T8-sandbox-qualification.json`, and `T8-actionlint-bootstrap.log` — unmodified selected members, copied for convenient reading.

**Reference-only checks.** `evidence/architect-path-diagnostic.json` and `reference/diagnose-report-path.py` describe 10 offline checks of a proposed resolver and an inspected guard excerpt. The complete repository bootstrap, actionlint, project suites, policy operations, and hosted proof were not run by the architect. These checks cannot satisfy R9's real-step/rehearsal requirements.
