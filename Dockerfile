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
RUN pnpm exec playwright install chromium
RUN pnpm build

FROM node:20.19.2-bookworm AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libc6 libcairo2 libcups2 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0 \
    libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libx11-6 libx11-xcb1 \
    libxcb1 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 \
    libxshmfence1 libxss1 libxtst6 libfontconfig1 libxkbcommon0 libatspi2.0-0 \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable
COPY --from=build --chown=node:node /app /app
COPY --from=build --chown=node:node /ms-playwright /ms-playwright
RUN mkdir -p /data/media && chown -R node:node /data/media /ms-playwright
USER node
EXPOSE 3000
CMD ["pnpm", "--filter", "@oss/web", "start"]
