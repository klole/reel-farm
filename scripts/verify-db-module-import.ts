import { copyFile, cp, mkdtemp, mkdir, realpath, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

type ChildResult = {
  exit_code: number | null;
  output: string;
  timed_out: boolean;
};

export type ModuleImportReport = {
  schema_version: 1;
  record_kind: "CH001_DB_MODULE_IMPORT";
  classification: "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF" | "MODULE_IMPORT_FAIL";
  status: "PASS" | "FAIL";
  implementation_context: string;
  database_connection_attempted: false;
  dotenv_suppressed: boolean;
  node_path_present: false;
  resolved_path?: string;
  expected_path?: string;
  pool_api?: { connect: boolean; end: boolean };
  pool_closed?: boolean;
  negative_control?: {
    status: "PASS" | "FAIL";
    control_kind: "RECORDED_FROZEN_BASELINE_EQUIVALENT";
    exit_code: number | null;
    timed_out: boolean;
    missing_package_error: boolean;
    output_excerpt: string;
  };
  error?: string;
};

const root = resolve(process.cwd());
const syntheticDatabaseUrl = "postgresql://r11-import-check:r11-import-check@127.0.0.1:1/r11_import_check";

function sanitize(value: unknown): string {
  return String(value ?? "")
    .replace(/(?:postgres(?:ql)?:\/\/)[^\s"'`]+/gi, "postgres://<redacted>")
    .slice(-4_000);
}

function runChild(command: string, args: string[], cwd: string, environment: NodeJS.ProcessEnv, timeoutMs = 20_000): Promise<ChildResult> {
  return new Promise((resolveResult) => {
    const child = spawn(command, args, { cwd, env: environment, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    let settled = false;
    let killTimer: NodeJS.Timeout | undefined;
    const finish = (exitCode: number | null, timedOut: boolean): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (killTimer) clearTimeout(killTimer);
      resolveResult({ exit_code: exitCode, output: sanitize(output), timed_out: timedOut });
    };
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", (error) => { output += `${error.message}\n`; finish(1, false); });
    child.on("close", (code) => finish(code ?? 1, false));
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      killTimer = setTimeout(() => child.kill("SIGKILL"), 1_000);
      finish(124, true);
    }, timeoutMs);
  });
}

async function negativeControl(loaderPath: string): Promise<NonNullable<ModuleImportReport["negative_control"]>> {
  const temporary = await mkdtemp(resolve(tmpdir(), "oss-r11-db-import-negative-"));
  try {
    const scriptDirectory = resolve(temporary, "scripts");
    await mkdir(scriptDirectory, { recursive: true });
    await mkdir(resolve(temporary, "node_modules"), { recursive: true });
    await copyFile(resolve(root, "package.json"), resolve(temporary, "package.json"));
    await cp(await realpath(resolve(root, "node_modules/dotenv")), resolve(temporary, "node_modules/dotenv"), { recursive: true });
    await copyFile(resolve(root, "scripts/migrate.ts"), resolve(scriptDirectory, "migrate.ts"));
    const environment: NodeJS.ProcessEnv = {
      ...process.env,
      DATABASE_URL: syntheticDatabaseUrl,
      DOTENV_CONFIG_PATH: "/dev/null",
      DB_POOL_MAX: "1"
    };
    delete environment.NODE_PATH;
    const result = await runChild(process.execPath, ["--import", loaderPath, resolve(scriptDirectory, "migrate.ts")], temporary, environment);
    const missingPackageError = /ERR_MODULE_NOT_FOUND[\s\S]*(?:Cannot find package ['"]@oss\/db|@oss\/db)/i.test(result.output);
    const status = result.exit_code !== 0 && !result.timed_out && missingPackageError ? "PASS" : "FAIL";
    return {
      status,
      control_kind: "RECORDED_FROZEN_BASELINE_EQUIVALENT",
      exit_code: result.exit_code,
      timed_out: result.timed_out,
      missing_package_error: missingPackageError,
      output_excerpt: result.output.slice(-2_000)
    };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

export async function runDbModuleImportVerification(options: { negativeControl?: boolean } = {}): Promise<ModuleImportReport> {
  const loaderPath = resolve(root, "node_modules/tsx/dist/loader.mjs");
  if (!(await stat(loaderPath).then(() => true).catch(() => false))) throw new Error(`Pinned tsx loader is missing at ${loaderPath}.`);
  const expectedPath = await realpath(resolve(root, "packages/db/dist/index.js"));
  process.env.DATABASE_URL = syntheticDatabaseUrl;
  process.env.DOTENV_CONFIG_PATH = "/dev/null";
  process.env.DB_POOL_MAX = "1";
  delete process.env.NODE_PATH;

  let poolClosed = false;
  try {
    const resolvedPath = await realpath(fileURLToPath(import.meta.resolve("@oss/db")));
    if (resolvedPath !== expectedPath) throw new Error(`@oss/db resolved to ${resolvedPath}, expected built repository module ${expectedPath}.`);
    const database = await import("@oss/db");
    const poolApi = { connect: typeof database.pool?.connect === "function", end: typeof database.pool?.end === "function" };
    if (!poolApi.connect || !poolApi.end) throw new Error("The real @oss/db import did not expose the expected pool connect/end API.");
    await database.pool.end();
    poolClosed = true;
    const report: ModuleImportReport = {
      schema_version: 1,
      record_kind: "CH001_DB_MODULE_IMPORT",
      classification: "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF",
      status: "PASS",
      implementation_context: "root/scripts context after frozen install and build",
      database_connection_attempted: false,
      dotenv_suppressed: true,
      node_path_present: false,
      resolved_path: resolvedPath,
      expected_path: expectedPath,
      pool_api: poolApi,
      pool_closed: true
    };
    if (options.negativeControl) report.negative_control = await negativeControl(loaderPath);
    if (report.negative_control?.status !== "PASS") {
      report.status = "FAIL";
      report.classification = "MODULE_IMPORT_FAIL";
      report.error = "The isolated frozen-baseline negative control did not demonstrate the expected missing @oss/db error.";
    }
    return report;
  } catch (error) {
    return {
      schema_version: 1,
      record_kind: "CH001_DB_MODULE_IMPORT",
      classification: "MODULE_IMPORT_FAIL",
      status: "FAIL",
      implementation_context: "root/scripts context after frozen install and build",
      database_connection_attempted: false,
      dotenv_suppressed: true,
      node_path_present: false,
      pool_closed: poolClosed,
      error: sanitize(error instanceof Error ? error.message : error)
    };
  }
}

const invokedAsScript = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedAsScript) {
  const report = await runDbModuleImportVerification({ negativeControl: process.argv.includes("--negative-control") });
  console.log(JSON.stringify(report));
  process.exitCode = report.status === "PASS" ? 0 : 1;
}
