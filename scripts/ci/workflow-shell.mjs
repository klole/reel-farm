#!/usr/bin/env node
import { createHash } from "node:crypto";

export class WorkflowShellExtractionError extends Error {
  constructor(message) {
    super(message);
    this.name = "WorkflowShellExtractionError";
  }
}

function extractionError(message) {
  return new WorkflowShellExtractionError(message);
}

function indentation(line) {
  if (/\t/.test(line)) throw extractionError("Workflow shell extraction does not support tab indentation.");
  return line.length - line.trimStart().length;
}

function nonBlank(line) {
  return line.trim().length > 0;
}

export function sha256Text(value) {
  return createHash("sha256").update(String(value), "utf8").digest("hex");
}

function matchingStepId(lines, stepId) {
  const matches = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^( +)id:\s*([A-Za-z0-9_-]+)\s*$/);
    if (match?.[2] === stepId) matches.push({ index, indent: match[1].length });
  }
  if (matches.length !== 1) throw extractionError(`Expected exactly one workflow step id ${stepId}; found ${matches.length}.`);
  return matches[0];
}

function stepBoundary(lines, start, stepIndent) {
  for (let index = start + 1; index < lines.length; index += 1) {
    if (nonBlank(lines[index]) && indentation(lines[index]) <= stepIndent) return index;
  }
  return lines.length;
}

export function extractWorkflowRunBody(source, stepId) {
  const lines = String(source).split(/\r?\n/);
  const step = matchingStepId(lines, stepId);
  const stepIndent = step.indent - 2;
  if (stepIndent < 0) throw extractionError(`Unsupported indentation for workflow step ${stepId}.`);

  const preceding = lines.slice(0, step.index).findLast((line) => nonBlank(line));
  if (!preceding || indentation(preceding) !== stepIndent || !/^\s*-\s+name:\s*/.test(preceding)) {
    throw extractionError(`Workflow step ${stepId} is not a literal named step at the expected indentation.`);
  }

  const boundary = stepBoundary(lines, step.index, stepIndent);
  const runLines = [];
  for (let index = step.index + 1; index < boundary; index += 1) {
    const line = lines[index];
    const runMatch = line.match(new RegExp(`^ {${step.indent}}run:\\s*(.*)$`));
    if (!runMatch) continue;
    if (runMatch[1] !== "|") throw extractionError(`Workflow step ${stepId} must use a literal run: | block.`);
    runLines.push(index);
  }
  if (runLines.length !== 1) throw extractionError(`Expected exactly one literal run block for workflow step ${stepId}; found ${runLines.length}.`);

  const runIndex = runLines[0];
  const bodyIndent = step.indent + 2;
  const bodyLines = [];
  for (let index = runIndex + 1; index < boundary; index += 1) {
    const line = lines[index];
    if (!nonBlank(line)) {
      bodyLines.push("");
      continue;
    }
    const lineIndent = indentation(line);
    if (lineIndent < bodyIndent) throw extractionError(`Workflow step ${stepId} has unsupported literal-body indentation at line ${index + 1}.`);
    bodyLines.push(line.slice(bodyIndent));
  }
  while (bodyLines.length > 0 && bodyLines.at(-1) === "") bodyLines.pop();
  if (bodyLines.length === 0) throw extractionError(`Workflow step ${stepId} has an empty literal run block.`);

  const body = `${bodyLines.join("\n")}\n`;
  return {
    step_id: stepId,
    id_line: step.index + 1,
    run_line: runIndex + 1,
    body,
    body_sha256: sha256Text(body)
  };
}

export function extractWorkflowJobEnvironment(source) {
  const lines = String(source).split(/\r?\n/);
  const matches = lines.flatMap((line, index) => /^ {4}env:\s*$/.test(line) ? [index] : []);
  if (matches.length !== 1) throw extractionError(`Expected exactly one job-level env block; found ${matches.length}.`);

  const start = matches[0];
  const values = {};
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!nonBlank(line)) continue;
    const lineIndent = indentation(line);
    if (lineIndent <= 4) break;
    const match = line.match(/^ {6}([A-Za-z_][A-Za-z0-9_]*):(?:[ \t]*)(.*)$/);
    if (!match) throw extractionError(`Unsupported job-level env formatting at line ${index + 1}.`);
    values[match[1]] = match[2];
  }
  if (Object.keys(values).length === 0) throw extractionError("The job-level env block is empty.");
  return values;
}

export function materializeGithubExpressions(value, { runId, runAttempt, workspace, workflowSha, implementationSha = workflowSha, repositoryPrivate = false, sandboxOptIn = false }) {
  let result = String(value);
  result = result.replaceAll(/\$\{\{\s*github\.run_id\s*\}\}/g, String(runId));
  result = result.replaceAll(/\$\{\{\s*github\.run_attempt\s*\}\}/g, String(runAttempt));
  result = result.replaceAll(/\$\{\{\s*github\.workspace\s*\}\}/g, String(workspace));
  result = result.replaceAll(/\$\{\{\s*github\.workflow_sha\s*\}\}/g, String(workflowSha));
  result = result.replaceAll(/\$\{\{\s*github\.event\.repository\.private\s*\}\}/g, String(repositoryPrivate));
  result = result.replaceAll(/\$\{\{\s*inputs\.implementation_sha\s*\}\}/g, String(implementationSha));
  result = result.replaceAll(/\$\{\{\s*inputs\.sandbox_qualification\s*\}\}/g, String(sandboxOptIn));
  if (/\$\{\{/.test(result)) throw extractionError(`Unsupported unevaluated GitHub expression in workflow value: ${value}`);
  if ((result.startsWith('"') && result.endsWith('"')) || (result.startsWith("'") && result.endsWith("'"))) result = result.slice(1, -1);
  return result;
}
