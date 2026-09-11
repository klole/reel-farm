import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync, spawn } from "node:child_process";

type CommandResult = { command: string; startedAt: string; endedAt: string; exitCode: number; output: string };
const started = new Date();
const artifactDir = resolve(process.cwd(), "artifacts/ch001/local");
await mkdir(artifactDir, { recursive: true });

function implementationCommit(): string {
  try { return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(); } catch { return "working-tree-at-run"; }
}

function run(command: string, args: string[]): Promise<CommandResult> {
  const startedAt = new Date().toISOString();
  return new Promise((resolveResult) => {
    const child = spawn(command, args, { cwd: process.cwd(), env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", (error) => resolveResult({ command: `${command} ${args.join(" ")}`, startedAt, endedAt: new Date().toISOString(), exitCode: 1, output: `${output}${error.message}` }));
    child.on("close", (code) => resolveResult({ command: `${command} ${args.join(" ")}`, startedAt, endedAt: new Date().toISOString(), exitCode: code ?? 1, output }));
  });
}

const commands = [
  ["pnpm", ["lint"]], ["pnpm", ["typecheck"]], ["pnpm", ["build"]], ["pnpm", ["test:unit"]],
  ["pnpm", ["test:security"]], ["pnpm", ["test:integration"]], ["pnpm", ["test:e2e"]], ["pnpm", ["test:render"]], ["pnpm", ["test:smoke"]]
] as const;
const results: CommandResult[] = [];
for (const [command, args] of commands) {
  const result = await run(command, [...args]);
  results.push(result);
  const index = results.length.toString().padStart(2, "0");
  await writeFile(resolve(artifactDir, `${index}-${args[0]}.log`), result.output, { mode: 0o640 });
  console.log(`${result.command}: exit ${result.exitCode}`);
}

let template: { gates: Array<{ id: string; description: string; required_evidence: string }> };
try { template = JSON.parse(await readFile(resolve(process.cwd(), "architect/Luna_CH001_v0.1.0_Pack/gate-results.template.json"), "utf8")) as typeof template; } catch { template = { gates: [] }; }
const gates = template.gates.map((gate) => ({ ...gate, status: "NOT_RUN", actual_evidence: [], reason: "This aggregate run was not connected to a live disposable Postgres/Compose/browser environment; see command logs." }));
const report = { chapter: "CH-001-r1", target_application_version: "0.1.0", report_kind: "EXECUTED_LOCAL_WITH_UNAVAILABLE_SERVICES", implementation_commit: implementationCommit(), evidence_commit: null, reference_environment: { node: process.version, platform: process.platform, arch: process.arch, chrome: "Google Chrome 151.0.7922.169 (system; managed Playwright Chromium unavailable)" }, application_tests_executed_by_packet_author: false, generatedAt: new Date().toISOString(), commands: results.map((result) => ({ command: result.command, startedAt: result.startedAt, endedAt: result.endedAt, exitCode: result.exitCode })), gates };
await writeFile(resolve(artifactDir, "gate-results.json"), JSON.stringify(report, null, 2) + "\n", { mode: 0o640 });
await writeFile(resolve(artifactDir, "verify-summary.json"), JSON.stringify({ startedAt: started.toISOString(), endedAt: new Date().toISOString(), failedCommands: results.filter((result) => result.exitCode !== 0).map((result) => result.command), report: "gate-results.json" }, null, 2) + "\n", { mode: 0o640 });
process.exit(results.every((result) => result.exitCode === 0) ? 0 : 1);
