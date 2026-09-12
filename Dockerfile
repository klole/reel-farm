FROM node:20.19.2-bookworm AS build
WORKDIR /app
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PATH="/opt/pnpm/bin:${PATH}"
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc tsconfig.json tsconfig.base.json eslint.config.mjs vitest.config.ts ./
COPY scripts ./scripts
RUN node scripts/ci/pnpm-bootstrap.mjs --destination /opt/pnpm --no-github-path --print-bin-dir > /tmp/pnpm-bin-dir \
  && test "$(cat /tmp/pnpm-bin-dir)" = "/opt/pnpm/bin" \
  && test "$(command -v pnpm)" = "/opt/pnpm/bin/pnpm" \
  && test "$(pnpm --version)" = "12.3.4" \
  && rm -f /tmp/pnpm-bin-dir
COPY apps ./apps
COPY packages ./packages
COPY tests ./tests
COPY migrations ./migrations
RUN pnpm install --frozen-lockfile
RUN mkdir -p /ms-playwright
RUN pnpm exec playwright install chromium
RUN pnpm build

FROM node:20.19.2-bookworm AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PATH="/opt/pnpm/bin:${PATH}"
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libc6 libcairo2 libcups2 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0 \
    libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libx11-6 libx11-xcb1 \
    libxcb1 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 \
    libxshmfence1 libxss1 libxtst6 libfontconfig1 libxkbcommon0 libatspi2.0-0 \
  && rm -rf /var/lib/apt/lists/*
COPY --from=build --chown=node:node /opt/pnpm /opt/pnpm
COPY --from=build --chown=node:node /app /app
COPY --from=build --chown=node:node /ms-playwright /ms-playwright
RUN test -x /opt/pnpm/bin/pnpm \
  && test "$(command -v pnpm)" = "/opt/pnpm/bin/pnpm" \
  && test "$(pnpm --version)" = "12.3.4"
RUN mkdir -p /data/media && chown -R node:node /data/media /ms-playwright
USER node
RUN --network=none test "$(id -un)" = "node" \
  && test "$(command -v pnpm)" = "/opt/pnpm/bin/pnpm" \
  && test "$(pnpm --version)" = "12.3.4"
EXPOSE 3000
CMD ["pnpm", "--filter", "@oss/web", "start"]
