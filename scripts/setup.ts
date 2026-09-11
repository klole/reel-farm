import { randomBytes } from "node:crypto";
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const envPath = resolve(root, ".env");
const mediaRoot = resolve(root, "data/media");

async function existingEnv(): Promise<string | null> {
  try { return await readFile(envPath, "utf8"); } catch { return null; }
}

const current = await existingEnv();
if (current === null) {
  const bootstrap = randomBytes(24).toString("base64url");
  const authSecret = randomBytes(48).toString("base64url");
  const content = [
    "NODE_ENV=development",
    "APP_ORIGIN=http://localhost:3000",
    "DATABASE_URL=postgres://oss:oss@localhost:5432/oss",
    `MEDIA_ROOT=${mediaRoot}`,
    `BOOTSTRAP_TOKEN=${bootstrap}`,
    `BETTER_AUTH_SECRET=${authSecret}`,
    "RENDERER_BUILD_ID=oss-renderer-0.1.0",
    "PLAYWRIGHT_BROWSERS_PATH=0",
    ""
  ].join("\n");
  await writeFile(envPath, content, { flag: "wx", mode: 0o600 });
  await mkdir(mediaRoot, { recursive: true, mode: 0o700 });
  console.log("Created .env and the private media directory.");
  console.log(`One-time owner setup token (store it privately): ${bootstrap}`);
} else {
  await chmod(envPath, 0o600);
  await mkdir(mediaRoot, { recursive: true, mode: 0o700 });
  console.log("Existing .env and local media were preserved; setup is idempotent.");
}
console.log("Next: pnpm db:migrate, then pnpm dev:web and pnpm dev:worker (or docker compose up --build after Docker is installed).");
