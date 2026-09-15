# Sanitized local coordinator evidence

Run: `r13-local-20260915c`.

The coordinator exited `2` as `BLOCKED_ENVIRONMENT`. Docker/Compose was unavailable, loopback allocation returned `EPERM`, and the pinned Chromium executable was unavailable. The real source checks and host module import completed, while PostgreSQL, final-image migration, observer, worker, browser, application, and runtime cleanup stages remained `NOT_RUN`.

The copied tree under [`artifacts/ch001r13/r13-local-20260915c/public/`](artifacts/ch001r13/r13-local-20260915c/public/) contains the public command report, report-referenced command logs, suite/unavailable reports, migration/module-import records, source review, cleanup state, and sanitization record. The command report is r13 `invocation-v2` evidence and retains repeated command invocations rather than deduplicating them.

Private raw captures, environment files, credentials, cookies, auth storage, and the coordinator's excluded gate/proof/verifier manifests are not published here. This evidence is not application acceptance and does not claim live migration success.
