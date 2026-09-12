import { createServer } from "node:net";
import { spawn } from "node:child_process";

export type CommandResult = {
  command: string;
  startedAt: string;
  endedAt: string;
  exitCode: number;
  output: string;
};

export type ComposeProject = {
  projectName: string;
  envPath: string;
  root: string;
  run(args: string[], options?: { env?: NodeJS.ProcessEnv }): Promise<CommandResult>;
};

export async function runCommand(command: string, args: string[], options: { cwd: string; env?: NodeJS.ProcessEnv } ): Promise<CommandResult> {
  const startedAt = new Date().toISOString();
  return new Promise((resolveResult) => {
    const child = spawn(command, args, { cwd: options.cwd, env: options.env ?? process.env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", (error) => resolveResult({ command: [command, ...args].join(" "), startedAt, endedAt: new Date().toISOString(), exitCode: 1, output: `${output}${error.message}\n` }));
    child.on("close", (code) => resolveResult({ command: [command, ...args].join(" "), startedAt, endedAt: new Date().toISOString(), exitCode: code ?? 1, output }));
  });
}

export function makeComposeProject(root: string, projectName: string, envPath: string): ComposeProject {
  return {
    projectName,
    envPath,
    root,
    run(args, options = {}) {
      return runCommand("docker", ["compose", "-p", projectName, "--env-file", envPath, ...args], { cwd: root, env: options.env ?? process.env });
    }
  };
}

export async function freeLoopbackPort(): Promise<number> {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not allocate a loopback port."));
        return;
      }
      const port = address.port;
      server.close((error) => error ? reject(error) : resolvePort(port));
    });
  });
}

export async function waitForHttp(url: string, predicate: (response: Response) => boolean = (response) => response.ok, timeoutMs = 180_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = "not attempted";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(4_000), cache: "no-store" });
      if (predicate(response)) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "connection failed";
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 2_000));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

export async function waitForCondition(label: string, check: () => Promise<boolean>, timeoutMs = 180_000, intervalMs = 2_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = "condition was false";
  while (Date.now() < deadline) {
    try {
      if (await check()) return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "condition check failed";
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, intervalMs));
  }
  throw new Error(`Timed out waiting for ${label}: ${lastError}`);
}
