import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd());
const read = (relativePath: string) => readFile(resolve(root, relativePath), "utf8");

describe("CH-001 security and scope assertions", () => {
  it("keeps the host surface loopback-only and does not publish the database or worker", async () => {
    const compose = await read("compose.yaml");
    expect(compose).toMatch(/127\.0\.0\.1:\$\{CH001_WEB_PORT:-3000\}:3000/);
    expect(compose).not.toMatch(/5432:\\d/);
    expect(compose).not.toMatch(/worker:\\s*[\\r\\n\\s-]*ports:/);
    expect(compose).toContain('command: ["pnpm", "--filter", "@oss/worker", "start"]');
    expect(compose).toContain("cap_drop:");
    expect(compose).toContain("- ALL");
    expect(compose).toContain("user: node");
  });

  it("keeps signup behind the private bootstrap path and avoids provider/publishing scope", async () => {
    const authRoute = await read("apps/web/app/api/auth/[...all]/route.ts");
    const auth = await read("apps/web/src/lib/auth.ts");
    const packageJson = await read("package.json");
    expect(authRoute).toContain("sign-up/email");
    expect(auth).toContain("x-oss-bootstrap");
    expect(packageJson).not.toMatch(/pinterest|fal-ai|fal\.ai|tiktok|stripe|openai|anthropic/i);
  });

  it("does not expose the media root as a public static directory", async () => {
    const storage = await read("packages/storage/src/index.ts");
    const nextConfig = await read("apps/web/next.config.ts");
    expect(storage).toContain("safeStorageKey");
    expect(nextConfig).not.toContain("data/media");
    expect(nextConfig).not.toContain("public");
  });

  it("does not pass application secrets into the browser subprocess", async () => {
    const worker = await read("apps/worker/src/index.ts");
    expect(worker).toContain("env: browserEnvironment");
    expect(worker).toContain("chromiumSandbox: true");
    expect(worker).toContain("RENDER_IMAGE_HASH_MISMATCH");
    expect(worker).not.toContain("--no-sandbox");
    expect(worker).not.toContain("DATABASE_URL: process.env.DATABASE_URL");
  });
});
