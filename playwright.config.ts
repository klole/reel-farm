import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? "artifacts/ch001r3/local");
const playwrightOutputDir = resolve(process.env.CH001_PLAYWRIGHT_OUTPUT_DIR ?? resolve(evidenceDir, "playwright-output"));
const jsonReport = process.env.CH001_PLAYWRIGHT_REPORT;

export default defineConfig({
  testDir: "./tests",
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  outputDir: playwrightOutputDir,
  reporter: jsonReport ? [["line"], ["json", { outputFile: jsonReport }]] : [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    serviceWorkers: "block",
    launchOptions: {
      chromiumSandbox: true,
      ...(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {})
    }
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }]
});
