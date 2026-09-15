import { isAbsolute, resolve } from "node:path";
class ActionlintBootstrapError extends Error {
  constructor(classification, message, details = {}) {
    super(message);
    this.name = "ActionlintBootstrapError";
    this.classification = classification;
    this.details = details;
    this.exitCode = 1;
  }
}
function bootstrapError(classification, message, details = {}) {
  return new ActionlintBootstrapError(classification, message, details);
}
function assertSingleLine(value, label) {
  if (typeof value !== "string" || value.length === 0 || /[\0\r\n]/.test(value)) {
    throw bootstrapError("INPUT_INVALID", `${label} must be a non-empty single-line value.`);
  }
  return value;
}
function assertAbsolutePath(value, label) {
  const text = assertSingleLine(value, label);
  if (!isAbsolute(text)) throw bootstrapError("INPUT_INVALID", `${label} must be an absolute path.`);
  return resolve(text);
}
try { process.stdout.write(assertAbsolutePath(process.argv[2], "Actionlint report path")); }
catch (e) { console.error(e.message); process.exitCode = 1; }
