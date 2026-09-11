# CH-001 evidence index

Checkpoint: CH-001-r1 / target v0.1.0. Implementation code was tested at `bbe370998016153cdfdee404022bf7007710e9df`; the final documentation/evidence commit is the commit containing this file and the handoff files. Repository state remains `awaiting_review`.

## Available evidence

- [Preflight/environment](../../chapters/CH-001/PREFLIGHT.md)
- [Commands and lifecycle](../../chapters/CH-001/COMMANDS.md)
- [Dependency and provenance record](../../chapters/CH-001/DEPENDENCIES.md)
- [Machine-readable gate results](gate-results.json)
- Raw aggregate logs, command exit records, and the verify summary: `artifacts/ch001/local/` when generated locally. This directory is intentionally gitignored because it can contain environment-specific paths.
- Static/unit/security evidence is represented by the actual `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, and `pnpm test:security` command records in the handoff/aggregate logs.

## Not produced in this host

No database-backed integration log, authenticated browser trace, worker render screenshot, seven-slide ZIP, final-preview/ZIP hash comparison, restart log, or Compose smoke screenshot is claimed. Docker, PostgreSQL, and a Playwright-managed Chromium executable were unavailable. These are `NOT_RUN` rather than mocked passes. No synthetic artifact is labeled as the requested real app export.

## Sanitization and external activity

No password, setup token, cookie, database URL, API key, private user content, or provider response is committed. The only network activity during implementation was package/dependency retrieval and package metadata/license inspection. No provider, publishing, social-account, billing, or public-deployment action occurred.
