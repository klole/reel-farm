FROM node:20.19.2-bookworm AS build
WORKDIR /app
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc tsconfig.json tsconfig.base.json eslint.config.mjs vitest.config.ts ./
COPY apps ./apps
COPY packages ./packages
COPY scripts ./scripts
COPY migrations ./migrations
RUN pnpm install --frozen-lockfile
RUN mkdir -p /ms-playwright
RUN pnpm exec playwright install --with-deps chromium
RUN pnpm build

FROM node:20.19.2-bookworm AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN corepack enable && useradd --create-home --uid 1000 --shell /bin/bash oss
COPY --from=build --chown=oss:oss /app /app
COPY --from=build /ms-playwright /ms-playwright
RUN mkdir -p /data/media && chown -R oss:oss /data/media /ms-playwright
USER oss
EXPOSE 3000
CMD ["pnpm", "--filter", "@oss/web", "start"]
