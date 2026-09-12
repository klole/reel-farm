#!/usr/bin/env node
/* global process, console */

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { delimiter, isAbsolute, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";

const EXPECTED_VERSION = "1.7.7";
const scriptDirectory = resolve(fileURLToPath(new URL(".", import.meta.url)));
const provenancePath = resolve(scriptDirectory, "actionlint-provenance.json");

function usage() {
  return [
    "Usage: node scripts/ci/lint-workflow.mjs [--root PATH] [--file PATH ...]",
    "",
    "Without --file, only tracked .github/workflows/*.yml and *.yaml files are checked.",
    "ACTIONLINT_BIN may select a verified actionlint executable."
  ].join("\n");
}

function parseArguments(argumentsList) {
  let root = process.cwd();
  const files = [];
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--help" || argument === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (argument === "--root") {
      const value = argumentsList[index + 1];
      if (!value) throw new Error("--root requires a path.");
      root = resolve(value);
      index += 1;
      continue;
    }
    if (argument === "--file") {
      const value = argumentsList[index + 1];
      if (!value) throw new Error("--file requires a path.");
      files.push(value);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return { root, files };
}

function readProvenance() {
  let provenance;
  try {
    provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read pinned actionlint provenance: ${error.message}`, { cause: error });
  }
  if (provenance.name !== "actionlint" || provenance.version !== EXPECTED_VERSION) {
    throw new Error("Pinned actionlint provenance is missing or has the wrong version.");
  }
  if (provenance.distribution?.archive_sha256 !== "023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757") {
    throw new Error("Pinned actionlint archive provenance does not match v1.7.7.");
  }
  return provenance;
}

function executableFromPath(name, searchPath) {
  for (const entry of (searchPath ?? "").split(delimiter)) {
    const candidate = resolve(entry || process.cwd(), name);
    if (!existsSync(candidate)) continue;
    try {
      const stats = lstatSync(candidate);
      if (stats.isFile() && (stats.mode & 0o111) !== 0) return candidate;
    } catch {
      // An unreadable PATH entry is not a usable validator.
    }
  }
  return null;
}

function resolveActionlint(root) {
  const configured = process.env.ACTIONLINT_BIN;
  const candidate = configured
    ? resolve(process.cwd(), configured)
    : executableFromPath("actionlint", process.env.PATH);
  if (!candidate) {
    throw new Error("No usable actionlint executable found; install pinned v1.7.7 or set ACTIONLINT_BIN.");
  }
  try {
    const stats = lstatSync(candidate);
    if (!stats.isFile() || (stats.mode & 0o111) === 0) throw new Error("not a regular executable file");
  } catch (error) {
    throw new Error(`Configured actionlint executable is unusable: ${candidate} (${error.message}).`, { cause: error });
  }

  let versionOutput;
  try {
    versionOutput = execFileSync(candidate, ["-version"], { cwd: root, encoding: "utf8", maxBuffer: 1_000_000 });
  } catch (error) {
    if (error.status === 0 && typeof error.stdout === "string") {
      versionOutput = error.stdout;
    } else {
      throw new Error(`Unable to execute actionlint -version: ${error.message}`, { cause: error });
    }
  }
  const versionMatch = versionOutput.match(/(?:^|\n)\s*(\d+\.\d+\.\d+)(?:\s|$)/);
  if (versionMatch?.[1] !== EXPECTED_VERSION) {
    throw new Error(`Expected actionlint ${EXPECTED_VERSION}, observed ${versionMatch?.[1] ?? "unknown"}.`);
  }
  const executableSha256 = createHash("sha256").update(readFileSync(candidate)).digest("hex");
  return { path: candidate, version: EXPECTED_VERSION, executableSha256 };
}

function listTrackedWorkflows(root) {
  let output;
  try {
    output = execFileSync("git", ["-C", root, "ls-files", "-z", "--", ".github/workflows"], { encoding: "utf8", maxBuffer: 1_000_000 });
  } catch (error) {
    if (error.status === 0 && typeof error.stdout === "string") {
      output = error.stdout;
    } else {
      throw new Error(`Unable to enumerate tracked workflows with git: ${error.stderr?.trim() || error.message || `exit ${error.status}`}`, { cause: error });
    }
  }
  return (output ?? "").split("\0").filter((path) => /\.(?:yml|yaml)$/.test(path));
}

function resolveInputs(root, explicitFiles) {
  const files = explicitFiles.length > 0 ? explicitFiles : listTrackedWorkflows(root);
  if (files.length === 0) {
    throw new Error("No tracked .github/workflows/*.yml or *.yaml input workflows were discovered.");
  }
  return files.map((file) => {
    const absolutePath = isAbsolute(file) ? file : resolve(root, file);
    if (!existsSync(absolutePath) || !lstatSync(absolutePath).isFile()) {
      throw new Error(`Workflow input is not a regular file: ${file}`);
    }
    return {
      argument: file,
      absolutePath,
      displayPath: isAbsolute(file) ? file : relative(root, absolutePath) || "."
    };
  });
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function main() {
  const { root, files: explicitFiles } = parseArguments(process.argv.slice(2));
  const provenance = readProvenance();
  const actionlint = resolveActionlint(root);
  const inputs = resolveInputs(root, explicitFiles);
  const argumentsList = ["-shellcheck=", "-pyflakes=", ...inputs.map((input) => input.argument)];

  console.log(JSON.stringify({
    record_kind: "WORKFLOW_STATIC_VALIDATION_INVOCATION",
    root,
    validator: {
      name: "actionlint",
      version: actionlint.version,
      executable: actionlint.path,
      executable_sha256: actionlint.executableSha256,
      distribution_reference: provenance.release_url,
      archive_reference: provenance.distribution.archive_url,
      archive_sha256: provenance.distribution.archive_sha256
    },
    command: [actionlint.path, ...argumentsList],
    inputs: inputs.map((input) => ({ path: input.displayPath, sha256: sha256File(input.absolutePath) }))
  }, null, 2));

  try {
    const output = execFileSync(actionlint.path, argumentsList, { cwd: root, encoding: "utf8", maxBuffer: 10_000_000 });
    if (output) process.stdout.write(output);
    return 0;
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout);
    if (error.stderr) process.stderr.write(error.stderr);
    if (error.status === 0) return 0;
    if (typeof error.status === "number") return error.status;
    console.error(`actionlint execution failed: ${error.message}`);
    return 2;
  }
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`workflow validation blocked: ${error.message}`);
  process.exitCode = 2;
}
