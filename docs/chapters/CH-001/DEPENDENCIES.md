# CH-001 dependency, source, and license record

Versions are exact direct dependency pins from `package.json`/`pnpm-lock.yaml`. The implementation uses only local/manual capabilities; no provider SDK or publishing dependency was added.

| Component | Version | License/source note |
|---|---:|---|
| Node.js runtime/base image | 20.19.2 | Node.js license; official runtime/image source at <https://nodejs.org/>. |
| Next.js | 16.3.4 | MIT; <https://github.com/vercel/next.js>. |
| React / React DOM | 19.3.0 | MIT; <https://github.com/facebook/react>. |
| Better Auth | 1.7.4 | MIT; <https://github.com/better-auth/better-auth>. |
| Drizzle ORM | 0.45.2 | MIT; <https://github.com/drizzle-team/drizzle-orm>. |
| node-postgres (`pg`) | 8.16.3 | MIT; <https://github.com/brianc/node-postgres>. |
| pg-boss | 12.31.0 | MIT; <https://github.com/timgit/pg-boss>. |
| Playwright | 1.63.0 | Apache-2.0; <https://github.com/microsoft/playwright>. |
| Sharp | 0.35.4 | Apache-2.0; <https://github.com/lovell/sharp>. Its prebuilt libvips package is LGPL-3.0-or-later and remains a required notice/compliance item. |
| Archiver | 8.0.0 | MIT; <https://github.com/archiverjs/node-archiver>. |
| Zod | 4.6.2 | MIT; <https://github.com/colinhacks/zod>. |
| dotenv | 17.4.2 | BSD-2-Clause; <https://github.com/motdotla/dotenv>. |
| Inter font package | 5.3.0 | SIL Open Font License 1.1; <https://fontsource.org/fonts/inter>. |
| Source Serif 4 font package | 5.3.0 | SIL Open Font License 1.1; <https://fontsource.org/fonts/source-serif-4>. |
| TypeScript | 5.9.3 | Apache-2.0; <https://github.com/microsoft/TypeScript>. |
| ESLint / Next config | 10.10.0 / 16.3.4 | MIT/Next MIT; <https://github.com/eslint/eslint>, <https://github.com/vercel/next.js>. |
| Vitest | 5.0.0 | MIT; <https://github.com/vitest-dev/vitest>. |
| pnpm | 12.3.4 | MIT; <https://github.com/pnpm/pnpm>. |
| PostgreSQL Compose image | 16.8-alpine | PostgreSQL License for PostgreSQL; Alpine package/image notices remain those of the selected image. Source: <https://hub.docker.com/_/postgres>. |

The transitive install was also inspected with `pnpm licenses list --json`. In addition to the direct notices, the current install includes MPL-2.0 `lightningcss`, CC-BY-4.0 `caniuse-lite`, and other standard transitive notices. The full lockfile, rather than a hand-copied transitive inventory, is the dependency resolution record.

## Originality and fixture provenance

The UI wording, layout names/structures, CSS treatment, demo copy, and renderer scene are authored for this repository. No Pinterest, competitor, or provider image was downloaded. CH-001 does not commit a binary fixture corpus; future real-pipeline tests must generate or use redistributable local fixtures and record their source/license.
