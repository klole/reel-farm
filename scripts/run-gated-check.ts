import { access } from "node:fs/promises";
import { spawn } from "node:child_process";
import { Pool } from "pg";

const check = process.argv[2] ?? "unknown";
const exists = async (command: string): Promise<boolean> => {
  try { await access(command); return true; } catch { return false; }
};

async function hasCommand(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn("sh", ["-c", `command -v ${command}`], { stdio: "ignore" });
    child.on("close", (code) => resolve(code === 0));
    child.on("error", () => resolve(false));
  });
}

if (check === "integration") {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("NOT_RUN: DATABASE_URL is not configured."); process.exit(2); }
  const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 1500 });
  try { await pool.query("SELECT 1"); } catch (error) { console.error(`NOT_RUN: PostgreSQL is unavailable (${error instanceof Error ? error.message : "unknown error"}).`); await pool.end(); process.exit(2); }
  await pool.end();
  console.error("NOT_RUN: integration harness is intentionally gated until the disposable database fixture runner is configured.");
  process.exit(2);
}

if (check === "smoke") {
  if (!(await hasCommand("docker"))) { console.error("NOT_RUN: Docker/Compose is unavailable in this environment."); process.exit(2); }
  console.error("NOT_RUN: Docker smoke orchestration requires a disposable daemon and was not run by this command.");
  process.exit(2);
}

if (check === "e2e" || check === "render") {
  const baseUrl = process.env.E2E_BASE_URL;
  if (!baseUrl) { console.error(`NOT_RUN: E2E_BASE_URL is not configured for ${check}.`); process.exit(2); }
  if (!(await exists("node_modules/.bin/playwright"))) { console.error(`NOT_RUN: Playwright binary is unavailable for ${check}.`); process.exit(2); }
  console.error(`NOT_RUN: ${check} harness requires the running Compose web/worker stack and was not run automatically.`);
  process.exit(2);
}

console.error(`NOT_RUN: unknown gated check ${check}.`);
process.exit(2);
