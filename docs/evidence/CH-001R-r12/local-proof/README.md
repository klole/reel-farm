# Sanitized local coordinator evidence

Run: `r12-local-20260915c`.

The public reports from the local coordinator are reproduced under [`artifacts/ch001r12/r12-local-20260915c/public/`](artifacts/ch001r12/r12-local-20260915c/public/). The copied tree includes every report-referenced public command log, unavailable-suite log, migration record, module-import record, source review, cleanup record, and sanitization record.

The run exited `2` as `BLOCKED_ENVIRONMENT`: Docker/Compose was unavailable, loopback allocation returned `EPERM`, and pinned Chromium was unavailable. Migration and application runtime stages are therefore `NOT_RUN`. Private raw captures, environment files, credentials, cookies, auth storage, and excluded gate/proof manifests were not published.
