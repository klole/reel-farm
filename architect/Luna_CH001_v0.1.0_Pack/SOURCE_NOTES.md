# CH-001 — technical references and verification boundary

**Checked for this assignment:** September 10, 2026. These are primary documentation references, not evidence that an application has been built. Recheck the selected dependency versions and security advisories during implementation. Do not freeze a version number copied from a documentation example without resolving compatibility.

| ID | Primary reference | What it supports / how to use it |
|---|---|---|
| T1 | Next.js, Self-hosting — `https://nextjs.org/docs/app/guides/self-hosting` | Self-hosted deployment/configuration and the distinction between server-only and publicly bundled environment variables. Our private default and lack of hosted dependencies are project decisions. |
| T2 | Playwright, Docker — `https://playwright.dev/docs/docker` | Browser/package compatibility, container setup, and the relationship between root execution and Chromium sandboxing. The documented development image/examples are not themselves an audit of our runtime isolation. |
| T3 | Playwright, Screenshots — `https://playwright.dev/docs/screenshots` | Capturing pages/elements to raster output. Our shared-scene, readiness, hashing, and immutable-preview/export rules are application contracts. |
| T4 | sharp, Constructor — `https://sharp.pixelplumbing.com/api-constructor/` | Decoder options for input-pixel limits, frame handling, orientation, and failure behavior. Bounds in this chapter are chosen project safeguards, not guarantees supplied by one constructor option. |
| T5 | OWASP, File Upload Cheat Sheet — `https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html` | Defense-in-depth for uploaded files, validation, safe naming/storage, authorization, and size restrictions. Implement and test the relevant controls, rather than treating an extension check as validation. |
| T6 | pg-boss official documentation — `https://pgboss.io/` | PostgreSQL-backed jobs and documented transaction/ORM integration, including Drizzle. Verify the adapter API for the pinned version. Queue guarantees do not by themselves atomically commit our filesystem artifacts or guarantee external side effects. |
| T7 | Drizzle, Migrations — `https://orm.drizzle.team/docs/migrations` | Explicit schema/migration workflows. Choose and document one reproducible method; do not silently mutate production schema from every process startup. |
| T8 | Docker, Compose startup/shutdown order — `https://docs.docker.com/compose/how-tos/startup-order/` | Dependency ordering and readiness conditions. A running container does not establish application/browser readiness. |
| T9 | Next.js, Authentication — `https://nextjs.org/docs/app/guides/authentication` | Authentication/session/authorization guidance and library-oriented implementation. Verify custom routes and data access, not only navigation redirects. |
| T10 | OWASP, Session Management Cheat Sheet — `https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html` | Session lifecycle and cookie-security considerations. The finite single-owner local deployment described here is an application scope decision. |
| T11 | OWASP, CSRF Prevention Cheat Sheet — `https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html` | CSRF defenses and origin-related protections. SameSite alone is not a reason to omit protection on custom mutation/upload endpoints. |

## No provider research required for this build

ScrapeCreators for Pinterest and a single fal.ai key for text plus image workflows are owner decisions. Later model selectors, model IDs, price displays, call budgets, and publishing bridges require their own current documentation and separately authorized qualification. None is implemented or live-tested in CH-001.

Do not copy illustrative model names/prices from earlier conversation summaries into product code as verified current defaults. Do not install an Anthropic/OpenAI/OpenRouter SDK or ask for another text key. Do not investigate or implement our own official TikTok developer-app/Content Posting API path.

## Baseline evidence

The frozen 19-file North Star source snapshot is supplied under `reference/north-star/`, with hashes in `BASELINE_HASHES.json`. It contains historical proposed/pending state and the mature roadmap. The chapter activation document explains the operative checkpoint without rewriting that history. `CHAPTER_BRIEF.md` is the bounded current assignment; `ACCEPTANCE_TESTS.md` is its finite gate ledger.

This packet's validation checks document structure, references, source hashes, and gate consistency only. They do not execute pnpm, compile an app, create an owner, generate media, run a browser worker, qualify a provider, or post content.
