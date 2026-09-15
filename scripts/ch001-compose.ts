import { createServer } from "node:net";
import { spawn } from "node:child_process";

export type CommandResult = {
  command: string;
  startedAt: string;
  endedAt: string;
  exitCode: number;
  output: string;
  timedOut?: boolean;
  outputTruncated?: boolean;
};

export type CommandOptions = {
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
  maxOutputBytes?: number;
};

export type ComposeProject = {
  projectName: string;
  envPath: string;
  root: string;
  run(args: string[], options?: CommandOptions): Promise<CommandResult>;
  dockerRun(args: string[], options?: CommandOptions): Promise<CommandResult>;
};

export async function runCommand(command: string, args: string[], options: { cwd: string } & CommandOptions ): Promise<CommandResult> {
  const startedAt = new Date().toISOString();
  return new Promise((resolveResult) => {
    const child = spawn(command, args, { cwd: options.cwd, env: options.env ?? process.env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    const maxOutputBytes = options.maxOutputBytes ?? Number.MAX_SAFE_INTEGER;
    let outputTruncated = false;
    let timedOut = false;
    let settled = false;
    let timeoutHandle: NodeJS.Timeout | undefined;
    let killHandle: NodeJS.Timeout | undefined;
    const appendOutput = (chunk: Buffer): void => {
      const remaining = maxOutputBytes - Buffer.byteLength(output);
      if (remaining <= 0) { outputTruncated = true; return; }
      if (chunk.byteLength <= remaining) output += chunk.toString();
      else {
        output += chunk.subarray(0, remaining).toString();
        outputTruncated = true;
      }
    };
    const finish = (exitCode: number, suffix = ""): void => {
      if (settled) return;
      settled = true;
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (killHandle) clearTimeout(killHandle);
      if (suffix) appendOutput(Buffer.from(suffix));
      resolveResult({
        command: [command, ...args].join(" "),
        startedAt,
        endedAt: new Date().toISOString(),
        exitCode,
        output,
        ...(timedOut ? { timedOut: true } : {}),
        ...(outputTruncated ? { outputTruncated: true } : {})
      });
    };
    child.stdout.on("data", (chunk: Buffer) => appendOutput(chunk));
    child.stderr.on("data", (chunk: Buffer) => appendOutput(chunk));
    child.on("error", (error) => finish(1, `${error.message}\n`));
    child.on("close", (code) => finish(timedOut ? 124 : code ?? 1));
    if (options.timeoutMs !== undefined) {
      const timeoutMs = Math.max(1, Math.floor(options.timeoutMs));
      timeoutHandle = setTimeout(() => {
        timedOut = true;
        appendOutput(Buffer.from(`\n[command timed out after ${timeoutMs}ms]\n`));
        child.kill("SIGTERM");
        killHandle = setTimeout(() => child.kill("SIGKILL"), 1_000);
      }, timeoutMs);
    }
  });
}

export function makeComposeProject(root: string, projectName: string, envPath: string): ComposeProject {
  return {
    projectName,
    envPath,
    root,
    run(args, options = {}) {
      return runCommand("docker", ["compose", "-p", projectName, "--env-file", envPath, ...args], { cwd: root, env: options.env ?? process.env, timeoutMs: options.timeoutMs, maxOutputBytes: options.maxOutputBytes });
    },
    dockerRun(args, options = {}) {
      return runCommand("docker", args, { cwd: root, env: options.env ?? process.env, timeoutMs: options.timeoutMs, maxOutputBytes: options.maxOutputBytes });
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
