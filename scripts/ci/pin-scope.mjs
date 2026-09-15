/* global structuredClone */

import assert from "node:assert/strict";

const EXPECTED_DB_DEPENDENCY = "@oss/db";
const EXPECTED_DB_SPECIFIER = "workspace:*";
const EXPECTED_DB_LINK = "link:packages/db";
const ROOT_IMPORTER = "  .:";

function clone(value) {
  return structuredClone(value);
}

function comparableRootManifest(candidate) {
  const value = clone(candidate);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Root package manifest must be an object.");
  if (!value.dependencies || typeof value.dependencies !== "object" || Array.isArray(value.dependencies)) throw new Error("Root package manifest dependencies must be an object.");
  if (value.dependencies[EXPECTED_DB_DEPENDENCY] !== EXPECTED_DB_SPECIFIER) throw new Error("Root @oss/db dependency must be exactly workspace:*.");
  if (!value.scripts || typeof value.scripts !== "object" || Array.isArray(value.scripts)) throw new Error("Root package manifest scripts must be an object.");
  delete value.scripts["lint:workflow"];
  return value;
}

export function assertAllowedRootManifestDelta(candidate, baseline) {
  const expected = clone(baseline);
  if (!expected || typeof expected !== "object" || Array.isArray(expected)) throw new Error("Frozen root package manifest must be an object.");
  if (!expected.dependencies || typeof expected.dependencies !== "object" || Array.isArray(expected.dependencies)) throw new Error("Frozen root package manifest dependencies must be an object.");
  if (Object.hasOwn(expected.dependencies, EXPECTED_DB_DEPENDENCY)) throw new Error("Frozen root package manifest unexpectedly already contains @oss/db.");
  expected.dependencies[EXPECTED_DB_DEPENDENCY] = EXPECTED_DB_SPECIFIER;
  assert.deepStrictEqual(comparableRootManifest(candidate), expected, "Root manifest contains an unapproved change.");
  return true;
}

function lineIndex(lines, predicate, start = 0, message = "Required lockfile structure was not found.") {
  const index = lines.findIndex((line, offset) => offset >= start && predicate(line, offset));
  if (index < 0) throw new Error(message);
  return index;
}

function rootImporterRange(text) {
  if (typeof text !== "string" || !text.endsWith("\n")) throw new Error("Lockfile must use a final newline.");
  const lines = text.slice(0, -1).split("\n");
  const separators = lines.flatMap((line, index) => line === "---" ? [index] : []);
  if (separators.length !== 2) throw new Error(`Expected exactly two lockfile documents; found ${separators.length}.`);
  const secondDocumentStart = separators[1] + 1;
  const importers = lineIndex(lines, (line) => line === "importers:", secondDocumentStart, "Application lockfile importer document is missing.");
  const rootStart = lineIndex(lines, (line, index) => index > importers && line === ROOT_IMPORTER, importers + 1, "Application root importer is missing.");
  const rootEnd = lines.findIndex((line, index) => index > rootStart && /^ {2}\S.*:$/.test(line));
  if (rootEnd < 0) throw new Error("Application root importer has no bounded end.");
  const dependencies = lineIndex(lines, (line, index) => index > rootStart && index < rootEnd && line === "    dependencies:", rootStart + 1, "Application root runtime dependencies are missing.");
  const devDependencies = lineIndex(lines, (line, index) => index > dependencies && index < rootEnd && line === "    devDependencies:", dependencies + 1, "Application root devDependencies boundary is missing.");
  return { lines, rootStart, rootEnd, dependencies, devDependencies };
}

function rootDbBlock(text) {
  const range = rootImporterRange(text);
  const matches = [];
  for (let index = range.dependencies + 1; index < range.devDependencies; index += 1) {
    if (range.lines[index] !== "      '@oss/db':") continue;
    matches.push(index);
  }
  return { ...range, matches };
}

export function assertAllowedLockfileDelta(candidateText, baselineText) {
  const baseline = rootDbBlock(baselineText);
  const candidate = rootDbBlock(candidateText);
  if (baseline.matches.length !== 0) throw new Error("Frozen lockfile already contains an application-root @oss/db relationship.");
  if (candidate.matches.length !== 1) throw new Error(`Expected exactly one application-root @oss/db relationship; found ${candidate.matches.length}.`);
  const match = candidate.matches[0];
  const expectedBlock = [
    "      '@oss/db':",
    "        specifier: workspace:*",
    "        version: link:packages/db"
  ];
  assert.deepStrictEqual(candidate.lines.slice(match, match + expectedBlock.length), expectedBlock, "The application-root @oss/db lock relationship is not the authorized local link.");
  const withoutAuthorizedBlock = [...candidate.lines];
  withoutAuthorizedBlock.splice(match, expectedBlock.length);
  assert.equal(withoutAuthorizedBlock.join("\n") + "\n", baseline.lines.join("\n") + "\n", "Lockfile contains a change outside the authorized application-root local link.");
  return true;
}

export const R11_PIN_ALLOWANCE = Object.freeze({ dependency: EXPECTED_DB_DEPENDENCY, specifier: EXPECTED_DB_SPECIFIER, link: EXPECTED_DB_LINK });
