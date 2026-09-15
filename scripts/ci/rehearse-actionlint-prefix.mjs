#!/usr/bin/env node
/* global process, console */

import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import {
  extractWorkflowJobEnvironment,
  extractWorkflowRunBody,
  materializeGithubExpressions,
  sha256Text
} from "./workflow-shell.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = process.cwd();
const workflowPath = ".github/workflows/ch001-live-proof.yml";
const expectedArchiveSha256 = "023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757";
const expectedExecutableSha256 = "9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c";
const expectedNode = "v20.19.2";
const workflowStepIds = ["identity", "actionlint_bootstrap", "workflow_validation", "ci_helper_tests"];

function usage() {
  return "Usage: node scripts/ci/rehearse-actionlint-prefix.mjs --mode clean|hosted-like [--archive PATH] --output PATH [--run-id ID] [--attempt N]";
}

function parseArguments(argumentsList) {
  const options = { mode: null, archive: null, output: null, runId: null, attempt: "1" };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    const next = argumentsList[index + 1];
    if (["--mode", "--archive", "--output", "--run-id", "--attempt"].includes(argument)) {
      if (!next || next.startsWith("--")) throw new Error(`${argument} requires a value.`);
      if (argument === "--mode") options.mode = next;
      if (argument === "--archive") options.archive = next;
      if (argument === "--output") options.output = next;
      if (argument === "--run-id") options.runId = next;
      if (argument === "--attempt") options.attempt = next;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      console.log(usage());
      return { help: true };
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!options.mode || !["clean", "hosted-like"].includes(options.mode)) throw new Error("--mode must be clean or hosted-like.");
  if (!options.output) throw new Error("--output is required so generated evidence has a durable location.");
  if (options.runId && !/^\d+$/.test(options.runId)) throw new Error("--run-id must be numeric.");
  if (!/^\d+$/.test(options.attempt) || Number(options.attempt) < 1) throw new Error("--attempt must be a positive numeric identifier.");
  return options;
}

function minimalPath() {
  const nodeDirectory = dirname(process.execPath);
  return [nodeDirectory, "/usr/local/sbin", "/usr/local/bin", "/usr/sbin", "/usr/bin", "/sbin", "/bin"].join(":");
}

function minimalEnvironment(home, temporary) {
  return {
    PATH: minimalPath(),
    HOME: home,
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    TMPDIR: temporary,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0"
  };
}

async function run(command, argumentsList, { cwd, environment }) {
  try {
    const result = await execFileAsync(command, argumentsList, {
      cwd,
      env: environment,
      maxBuffer: 20_000_000
    });
    return { command: [command, ...argumentsList], exit_code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      command: [command, ...argumentsList],
      exit_code: typeof error.code === "number" ? error.code : null,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
      error_message: error instanceof Error ? error.message : String(error)
    };
  }
}

async function sha256File(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function requireOfficialArchive(candidate) {
  if (!candidate) return null;
  const path = resolve(candidate);
  const info = await stat(path).catch(() => null);
  if (!info?.isFile()) throw new Error(`Actionlint archive override is not a regular file: ${path}`);
  const digest = await sha256File(path);
  if (digest !== expectedArchiveSha256) throw new Error(`Actionlint archive override digest mismatch: expected ${expectedArchiveSha256}, measured ${digest}.`);
  return { path, sha256: digest, source: "cached_offline_official_archive" };
}

function materializeJobEnvironment(raw, context) {
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, materializeGithubExpressions(value, context)]));
}

async function makeCheckout(temporary, implementationSha) {
  const checkout = resolve(temporary, "checkout");
  const environment = minimalEnvironment(resolve(temporary, "git-home"), resolve(temporary, "git-tmp"));
  await mkdir(environment.HOME, { recursive: true });
  await mkdir(environment.TMPDIR, { recursive: true });
  const cloned = await run("git", ["clone", "--quiet", "--no-local", repositoryRoot, checkout], { cwd: repositoryRoot, environment });
  if (cloned.exit_code !== 0) throw new Error(`Independent clone failed: ${cloned.stderr || cloned.stdout}`);
  const updated = await run("git", ["update-ref", "refs/remotes/origin/main", implementationSha], { cwd: checkout, environment });
  if (updated.exit_code !== 0) throw new Error(`Synthetic origin/main setup failed: ${updated.stderr || updated.stdout}`);
  const checkedOut = await run("git", ["checkout", "--quiet", "--detach", implementationSha], { cwd: checkout, environment });
  if (checkedOut.exit_code !== 0) throw new Error(`Detached T9 checkout failed: ${checkedOut.stderr || checkedOut.stdout}`);
  return { checkout, environment };
}

async function fileSnapshot(path) {
  const bytes = await readFile(path);
  return { bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
}

async function applyEnvironmentRecords(environment, path, previousContent, stepId) {
  const currentContent = await readFile(path, "utf8");
  if (!currentContent.startsWith(previousContent)) throw new Error(`${stepId} rewrote GITHUB_ENV instead of appending records.`);
  const delta = currentContent.slice(previousContent.length);
  const next = { ...environment };
  const keys = [];
  for (const line of delta.split("\n").filter(Boolean)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*=[^\r\n]*$/.test(line)) throw new Error(`${stepId} wrote an unsupported multi-line environment record.`);
    const separator = line.indexOf("=");
    const key = line.slice(0, separator);
    next[key] = line.slice(separator + 1);
    keys.push(key);
  }
  return { environment: next, content: currentContent, appended_keys: keys };
}

function nodeTestCounts(output) {
  const metric = (name) => {
    const matches = [...String(output).matchAll(new RegExp(`^(?:ℹ|#) ${name} (\\d+)$`, "gm"))];
    if (matches.length === 0) throw new Error(`Complete CI output did not contain the final ${name} count.`);
    return Number(matches.at(-1)[1]);
  };
  return {
    discovered: metric("tests"),
    executed: metric("tests"),
    passed: metric("pass"),
    failed: metric("fail"),
    skipped: metric("skipped")
  };
}

function bodyContract(body) {
  const helperReportUses = (body.match(/--report "\$stage_report"/g) ?? []).length;
  const detailReportUses = (body.match(/--detail-file "\$stage_report"/g) ?? []).length;
  if (helperReportUses !== 1 || detailReportUses !== 1) throw new Error("The extracted actionlint step does not pass one stage_report to both helper and recorder.");
  if (!body.includes("path.resolve(path.dirname(base), \"actionlint-bootstrap.json\")")) throw new Error("The extracted actionlint step is missing the absolute report resolver.");
  return { helper_report_argument_uses: helperReportUses, recorder_detail_argument_uses: detailReportUses };
}

async function runPrefix(options) {
  const implementationSha = (await run("git", ["rev-parse", "HEAD"], { cwd: repositoryRoot, environment: process.env })).stdout.trim();
  const implementationTree = (await run("git", ["rev-parse", "HEAD^{tree}"], { cwd: repositoryRoot, environment: process.env })).stdout.trim();
  const trackedStatus = await run("git", ["status", "--porcelain", "--untracked-files=no"], { cwd: repositoryRoot, environment: process.env });
  if (trackedStatus.exit_code !== 0 || trackedStatus.stdout.trim()) throw new Error("Source-bound prefix requires a clean tracked T9 checkout; commit execution-affecting changes first.");
  const requestedArchive = await requireOfficialArchive(options.archive ?? process.env.ACTIONLINT_BOOTSTRAP_ARCHIVE);
  const workflowSource = await readFile(resolve(repositoryRoot, workflowPath), "utf8");
  const workflowSha256 = sha256Text(workflowSource);
  const temporary = await mkdtemp(resolve(tmpdir(), `ch001r9-prefix-${options.mode}-`));
  try {
    const { checkout } = await makeCheckout(temporary, implementationSha);
    const checkoutWorkflow = await readFile(resolve(checkout, workflowPath), "utf8");
    if (sha256Text(checkoutWorkflow) !== workflowSha256) throw new Error("Independent checkout workflow bytes differ from the source-bound T9 workflow.");
    const bodies = Object.fromEntries(workflowStepIds.map((stepId) => [stepId, extractWorkflowRunBody(checkoutWorkflow, stepId)]));
    const reportContract = bodyContract(bodies.actionlint_bootstrap.body);
    const runId = options.runId ?? (options.mode === "clean" ? "900000001" : "900000002");
    const attempt = options.attempt;
    const runnerTemp = resolve(temporary, "synthetic runner temp");
    const commandFiles = {
      github_env: resolve(temporary, "synthetic github env"),
      github_path: resolve(temporary, "synthetic github path"),
      github_output: resolve(temporary, "synthetic github output"),
      github_step_summary: resolve(temporary, "synthetic github step summary")
    };
    await mkdir(runnerTemp, { recursive: true });
    await writeFile(commandFiles.github_env, "PARENT_ENV_SENTINEL=preserve\n", "utf8");
    await writeFile(commandFiles.github_path, "PARENT_PATH_SENTINEL=preserve\n", "utf8");
    await writeFile(commandFiles.github_output, "PARENT_OUTPUT_SENTINEL=preserve\n", "utf8");
    await writeFile(commandFiles.github_step_summary, "PARENT_SUMMARY_SENTINEL=preserve\n", "utf8");
    const commandBefore = Object.fromEntries(await Promise.all(Object.entries(commandFiles).map(async ([key, path]) => [key, await fileSnapshot(path)])));
    const jobEnvironmentRaw = extractWorkflowJobEnvironment(checkoutWorkflow);
    const materialized = materializeJobEnvironment(jobEnvironmentRaw, {
      runId,
      runAttempt: attempt,
      workspace: checkout,
      workflowSha: implementationSha,
      implementationSha,
      repositoryPrivate: false,
      sandboxOptIn: false
    });
    if (isAbsolute(materialized.CI_BOOTSTRAP_REPORT)) throw new Error("The prefix must retain the workflow's relative CI_BOOTSTRAP_REPORT value.");
    if (!materialized.CI_BOOTSTRAP_REPORT || /[\0\r\n]/.test(materialized.CI_BOOTSTRAP_REPORT)) throw new Error("The materialized CI_BOOTSTRAP_REPORT is invalid.");

    let environment = {
      ...minimalEnvironment(resolve(temporary, "home"), resolve(temporary, "tmp")),
      REQUESTED_SHA: implementationSha,
      REPOSITORY_PRIVATE: "false",
      CH001_SANDBOX_OPT_IN: "false",
      CI: "true",
      CH001_RUN_ID: materialized.CH001_RUN_ID,
      CH001_WORKFLOW_SHA: implementationSha,
      CH001_EVIDENCE_ROOT: materialized.CH001_EVIDENCE_ROOT,
      CI_BOOTSTRAP_REPORT: materialized.CI_BOOTSTRAP_REPORT,
      CI_RESULT_REPORT: materialized.CI_RESULT_REPORT,
      CI_PROOF_REPORT: materialized.CI_PROOF_REPORT,
      CH001_SANDBOX_REPORT: materialized.CH001_SANDBOX_REPORT,
      GITHUB_REPOSITORY: "klole/reel-farm",
      GITHUB_RUN_ID: runId,
      GITHUB_RUN_ATTEMPT: attempt,
      GITHUB_WORKFLOW_SHA: implementationSha,
      GITHUB_WORKSPACE: checkout,
      RUNNER_TEMP: runnerTemp,
      GITHUB_ENV: commandFiles.github_env,
      GITHUB_PATH: commandFiles.github_path,
      GITHUB_OUTPUT: commandFiles.github_output,
      GITHUB_STEP_SUMMARY: commandFiles.github_step_summary
    };
    if (options.mode === "hosted-like") environment.CH001_SANDBOX_STATE_DIR = resolve(temporary, "inherited sandbox state");
    if (requestedArchive) environment.ACTIONLINT_BOOTSTRAP_ARCHIVE = requestedArchive.path;
    await mkdir(environment.HOME, { recursive: true });
    await mkdir(environment.TMPDIR, { recursive: true });

    const initialEnvironmentFile = await readFile(commandFiles.github_env, "utf8");
    const stepResults = [];
    const environmentRecords = [];
    const executeStep = async (stepId, currentEnvironment, previousContent) => {
      const step = bodies[stepId];
      const result = await run("bash", ["--noprofile", "--norc", "-euo", "pipefail", "-c", step.body], { cwd: checkout, environment: currentEnvironment });
      stepResults.push({ step_id: stepId, ...result, body_sha256: step.body_sha256 });
      if (result.exit_code !== 0) throw new Error(`Source-bound ${stepId} failed with exit ${result.exit_code}: ${result.stderr || result.stdout}`);
      const applied = await applyEnvironmentRecords(currentEnvironment, commandFiles.github_env, previousContent, stepId);
      environmentRecords.push({ step_id: stepId, appended_keys: applied.appended_keys });
      return applied;
    };

    let applied = await executeStep("identity", environment, initialEnvironmentFile);
    environment = applied.environment;
    applied = await executeStep("actionlint_bootstrap", environment, applied.content);
    environment = applied.environment;
    const actionlintEnvironment = { ...environment };
    applied = await executeStep("workflow_validation", environment, applied.content);
    environment = applied.environment;
    const workflowValidationEnvironment = { ...environment };
    applied = await executeStep("ci_helper_tests", environment, applied.content);
    environment = applied.environment;
    const ciEnvironment = { ...environment };

    const outerReportPath = resolve(checkout, materialized.CI_BOOTSTRAP_REPORT);
    const innerReportPath = resolve(checkout, dirname(materialized.CI_BOOTSTRAP_REPORT), "actionlint-bootstrap.json");
    const outerCiResultPath = resolve(dirname(outerReportPath), "ci-result.json");
    const outerReport = await readJson(outerReportPath);
    const innerReport = await readJson(innerReportPath);
    const outerCiResult = await readJson(outerCiResultPath);
    const actionlintStage = outerReport.stages.find((stage) => stage.name === "actionlint-bootstrap");
    const validationStage = outerReport.stages.find((stage) => stage.name === "workflow-validation");
    const ciStage = outerReport.stages.find((stage) => stage.name === "ci-helper-regressions");
    if (innerReport.status !== "PASS" || innerReport.actual_exit !== 0) throw new Error("The real actionlint bootstrap did not produce a PASS attestation.");
    if (innerReport.archive.measured_sha256 !== expectedArchiveSha256 || innerReport.executable.measured_sha256 !== expectedExecutableSha256 || innerReport.executable.observed_version !== "1.7.7") throw new Error("The actionlint attestation does not match the pinned version/digests.");
    if (actionlintStage?.status !== "PASS" || actionlintStage.exit_code !== 0 || actionlintStage.metadata?.bootstrap_attestation?.status !== "PASS") throw new Error("The outer reporter did not record actionlint-bootstrap PASS with its inner attestation.");
    if (validationStage?.status !== "PASS" || ciStage?.status !== "PASS") throw new Error("The source-bound workflow validation or CI regression stage failed.");
    if (outerCiResult.classification !== "CI_BOOTSTRAP_FAILURE" || outerCiResult.bootstrap_status !== "PASS") throw new Error("The outer CI result has an unexpected bootstrap classification.");
    if (environment.ACTIONLINT_BIN !== innerReport.executable.path || !isAbsolute(environment.ACTIONLINT_BIN)) throw new Error("The verified ACTIONLINT_BIN did not reach later child steps unchanged.");
    if (actionlintEnvironment.ACTIONLINT_BIN !== workflowValidationEnvironment.ACTIONLINT_BIN || workflowValidationEnvironment.ACTIONLINT_BIN !== ciEnvironment.ACTIONLINT_BIN) throw new Error("The verified ACTIONLINT_BIN differed between consumers.");
    const statePath = environment.CH001_SANDBOX_STATE_DIR;
    if (!statePath || !isAbsolute(statePath) || actionlintEnvironment.CH001_SANDBOX_STATE_DIR !== statePath || workflowValidationEnvironment.CH001_SANDBOX_STATE_DIR !== statePath || ciEnvironment.CH001_SANDBOX_STATE_DIR !== statePath) throw new Error("The run-owned sandbox state path was not transferred identically.");
    if (materialized.CH001_SANDBOX_OPT_IN !== "false") throw new Error("The source-bound prefix unexpectedly enabled sandbox qualification.");
    const ciOutput = stepResults.find((step) => step.step_id === "ci_helper_tests");
    const fileLevelCounts = nodeTestCounts(ciOutput.stdout + ciOutput.stderr);
    if (fileLevelCounts.failed !== 0 || fileLevelCounts.skipped !== 0 || fileLevelCounts.passed === 0) throw new Error("The complete CI regression suite did not pass without skips.");
    const testFilesResult = await run("git", ["ls-files", "-z", "--", "tests/ci"], { cwd: checkout, environment });
    if (testFilesResult.exit_code !== 0) throw new Error(`Unable to enumerate tracked CI test modules: ${testFilesResult.stderr || testFilesResult.stdout}`);
    const testFiles = testFilesResult.stdout.split("\0").filter((path) => /\.test\.mjs$/.test(path));
    if (testFiles.length !== fileLevelCounts.passed) throw new Error(`CI file-level count ${fileLevelCounts.passed} does not match tracked test modules ${testFiles.length}.`);
    const nestedTestResults = [];
    const nestedTestOutputs = [];
    const nestedTestCommandBody = [
      "set -o pipefail",
      "\"$1\" --test \"$2\" 2>&1 | tee",
      "nested_exit=${PIPESTATUS[0]}",
      "exit \"$nested_exit\""
    ].join("\n");
    for (const testFile of testFiles) {
      const nestedResult = await run("bash", ["--noprofile", "--norc", "-c", nestedTestCommandBody, "ch001r9-nested", process.execPath, testFile], { cwd: checkout, environment });
      let nestedCounts;
      try {
        nestedCounts = nodeTestCounts(nestedResult.stdout + nestedResult.stderr);
      } catch (error) {
        throw new Error(`Unable to parse nested CI output for ${testFile}: ${error.message}\nchild_exit=${nestedResult.exit_code}\nchild_error=${nestedResult.error_message ?? "none"}\ncommand=${JSON.stringify(nestedResult.command)}\n${nestedResult.stdout}\n${nestedResult.stderr}`, { cause: error });
      }
      nestedTestResults.push({ file: testFile, ...nestedCounts, exit_code: nestedResult.exit_code });
      nestedTestOutputs.push({ file: testFile, stdout: nestedResult.stdout, stderr: nestedResult.stderr });
      if (nestedResult.exit_code !== 0 || nestedCounts.failed !== 0 || nestedCounts.skipped !== 0) throw new Error(`Nested CI test module failed: ${testFile}`);
    }
    const nestedCounts = nestedTestResults.reduce((totals, current) => Object.fromEntries(Object.keys(totals).map((key) => [key, totals[key] + current[key]])), { discovered: 0, executed: 0, passed: 0, failed: 0, skipped: 0 });
    if (nestedCounts.passed === 0 || nestedCounts.failed !== 0 || nestedCounts.skipped !== 0) throw new Error("Nested CI test modules did not pass without skips.");
    const commandAfter = Object.fromEntries(await Promise.all(Object.entries(commandFiles).map(async ([key, path]) => [key, await fileSnapshot(path)])));
    for (const key of ["github_path", "github_output", "github_step_summary"]) {
      if (commandBefore[key].sha256 !== commandAfter[key].sha256 || commandBefore[key].bytes !== commandAfter[key].bytes) throw new Error(`${key} changed during the source-bound prefix.`);
    }
    const finalEnvironmentLines = (await readFile(commandFiles.github_env, "utf8")).trimEnd().split("\n");
    const appendedKeys = finalEnvironmentLines.slice(initialEnvironmentFile.trimEnd().split("\n").length).map((line) => line.slice(0, line.indexOf("=")));
    if (appendedKeys.filter((key) => key === "ACTIONLINT_BIN").length !== 1) throw new Error("GITHUB_ENV did not receive exactly one ACTIONLINT_BIN record.");
    const proofTree = resolve(checkout, materialized.CH001_EVIDENCE_ROOT);
    const proofPublicTree = resolve(proofTree, "public");
    const policyTree = resolve(checkout, "policy");
    const sandboxTree = resolve(statePath);
    const absentPaths = Object.fromEntries(await Promise.all([["proof", proofTree], ["proof_public", proofPublicTree], ["policy", policyTree], ["sandbox_state", sandboxTree]].map(async ([key, path]) => [key, !(await stat(path).catch(() => null))])));
    if (Object.values(absentPaths).some((absent) => !absent)) throw new Error("The source-bound prefix created a proof, policy, or sandbox-state tree.");

    const outputPath = resolve(repositoryRoot, options.output);
    const outputDirectory = dirname(outputPath);
    await mkdir(outputDirectory, { recursive: true });
    const outputBase = basename(outputPath, ".json");
    const evidencePaths = {
      inner_report: resolve(outputDirectory, `${outputBase}-inner.json`),
      outer_report: resolve(outputDirectory, `${outputBase}-outer.json`),
      outer_ci_result: resolve(outputDirectory, `${outputBase}-ci-result.json`),
      actionlint_log: resolve(outputDirectory, `${outputBase}-actionlint.log`),
      commands_log: resolve(outputDirectory, `${outputBase}.commands.log`)
    };
    await copyFile(innerReportPath, evidencePaths.inner_report);
    await copyFile(outerReportPath, evidencePaths.outer_report);
    await copyFile(outerCiResultPath, evidencePaths.outer_ci_result);
    const actionlintResult = stepResults.find((step) => step.step_id === "actionlint_bootstrap");
    await writeFile(evidencePaths.actionlint_log, `${actionlintResult.stdout}${actionlintResult.stderr}`, "utf8");
    const commandLog = [
      `CH-001R-r9 source-bound ${options.mode} prefix`,
      `implementation=${implementationSha}`,
      `tree=${implementationTree}`,
      `workflow=${workflowPath}`,
      `workflow_sha256=${workflowSha256}`,
      `cwd=${checkout}`,
      `node=${process.version}`,
      `node_modules_present=${await stat(resolve(checkout, "node_modules")).then(() => true).catch(() => false)}`,
      ...Object.values(bodies).map((body) => `step=${body.step_id} body_sha256=${body.body_sha256}\n${body.body}`),
      ...stepResults.map((step) => [`--- ${step.step_id} exit=${step.exit_code} ---`, step.stdout, step.stderr].join("\n")),
      ...nestedTestOutputs.map((result) => [`--- nested ${result.file} ---`, result.stdout, result.stderr].join("\n"))
    ].join("\n");
    await writeFile(evidencePaths.commands_log, commandLog, "utf8");
    const copiedRelative = (path) => relative(repositoryRoot, path);
    const summary = {
      record_kind: "CH001R_R9_SOURCE_BOUND_PREFIX",
      phase: "CH-001R-r9",
      mode: options.mode,
      status: "PASS",
      implementation_sha: implementationSha,
      implementation_tree: implementationTree,
      workflow_path: workflowPath,
      workflow_sha256: workflowSha256,
      checkout_method: "independent no-local clone with detached T9 checkout",
      checkout: checkout,
      cwd: checkout,
      node: process.version,
      expected_node: expectedNode,
      node_matches_project_pin: process.version === expectedNode,
      node_modules_present_before_prefix: await stat(resolve(checkout, "node_modules")).then(() => true).catch(() => false),
      synthetic_run_id: runId,
      synthetic_run_attempt: attempt,
      raw_job_environment: {
        CI_BOOTSTRAP_REPORT: jobEnvironmentRaw.CI_BOOTSTRAP_REPORT,
        CI_RESULT_REPORT: jobEnvironmentRaw.CI_RESULT_REPORT,
        CI_EVIDENCE_ROOT: jobEnvironmentRaw.CI_EVIDENCE_ROOT,
        CH001_SANDBOX_OPT_IN: jobEnvironmentRaw.CH001_SANDBOX_OPT_IN
      },
      materialized_environment: {
        CI_BOOTSTRAP_REPORT: materialized.CI_BOOTSTRAP_REPORT,
        CI_RESULT_REPORT: materialized.CI_RESULT_REPORT,
        CI_EVIDENCE_ROOT: materialized.CI_EVIDENCE_ROOT,
        CH001_SANDBOX_OPT_IN: materialized.CH001_SANDBOX_OPT_IN
      },
      steps: Object.fromEntries(workflowStepIds.map((stepId) => [stepId, { id: stepId, body_sha256: bodies[stepId].body_sha256, exit_code: stepResults.find((step) => step.step_id === stepId)?.exit_code ?? null }])),
      actionlint_step_contract: reportContract,
      report_paths: {
        resolved_stage_report: copiedRelative(evidencePaths.inner_report),
        helper_report_argument: copiedRelative(evidencePaths.inner_report),
        recorder_detail_file: copiedRelative(evidencePaths.inner_report),
        outer_bootstrap_report: copiedRelative(evidencePaths.outer_report),
        outer_ci_result: copiedRelative(evidencePaths.outer_ci_result),
        actionlint_log: copiedRelative(evidencePaths.actionlint_log),
        same_target_for_helper_and_recorder: true,
        raw_workflow_report_was_relative: !isAbsolute(materialized.CI_BOOTSTRAP_REPORT)
      },
      actionlint: {
        version: innerReport.executable.observed_version,
        archive_source: innerReport.archive.source,
        archive_cache: requestedArchive,
        archive_expected_sha256: innerReport.archive.expected_sha256,
        archive_measured_sha256: innerReport.archive.measured_sha256,
        executable_expected_sha256: innerReport.executable.expected_sha256,
        executable_measured_sha256: innerReport.executable.measured_sha256,
        executable: innerReport.executable.path,
        download_attempts: innerReport.archive.download_attempts,
        report_sha256: await sha256File(evidencePaths.inner_report)
      },
      workflow_validation: {
        status: validationStage.status,
        exit_code: validationStage.exit_code,
        outer_report_sha256: await sha256File(evidencePaths.outer_report)
      },
      ci_suite: {
        command: "node --test tests/ci",
        file_level: fileLevelCounts,
        nested_cases: nestedCounts,
        exit_code: ciOutput.exit_code,
        tracked_test_modules: testFiles,
        nested_module_results: nestedTestResults
      },
      command_files: {
        github_env: { before: commandBefore.github_env, after: commandAfter.github_env, appended_keys: appendedKeys },
        github_path: { before: commandBefore.github_path, after: commandAfter.github_path, unchanged: true },
        github_output: { before: commandBefore.github_output, after: commandAfter.github_output, unchanged: true },
        github_step_summary: { before: commandBefore.github_step_summary, after: commandAfter.github_step_summary, unchanged: true }
      },
      environment_records: environmentRecords,
      environment_transfer: {
        applied_as_data_without_source_or_eval: true,
        actionlint_bin: environment.ACTIONLINT_BIN,
        actionlint_bin_consumers_match: true,
        run_owned_state_path: statePath,
        state_path_consumers_match: true,
        inherited_sandbox_state: options.mode === "hosted-like" ? resolve(temporary, "inherited sandbox state") : null
      },
      absent_trees: absentPaths,
      generated_evidence: Object.fromEntries(Object.entries(evidencePaths).map(([key, path]) => [key, { path: copiedRelative(path), sha256: null }])),
      child_commands: stepResults.map(({ command, step_id, body_sha256, exit_code }) => ({ step_id, command, body_sha256, exit_code })),
      nested_test_commands: testFiles.map((testFile, index) => ({ file: testFile, command: ["bash", "--noprofile", "--norc", "-c", nestedTestCommandBody, "ch001r9-nested", process.execPath, testFile], test_command: [process.execPath, "--test", testFile], ...nestedTestResults[index] })),
      unavailable_checks: ["sandbox qualification", "Docker/Compose", "Chromium", "bounded application proof"],
      external_actions: { github_write: false, workflow_dispatch: false, hosted_run: null, providers: false, credentials: false }
    };
    for (const [key, path] of Object.entries(evidencePaths)) summary.generated_evidence[key].sha256 = await sha256File(path);
    await writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`, { mode: 0o640 });
    return summary;
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) return 0;
  const result = await runPrefix(options);
  console.log(JSON.stringify(result, null, 2));
  return 0;
}

main().then((exitCode) => { process.exitCode = exitCode; }).catch((error) => {
  console.error(`source-bound prefix failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  process.exitCode = 1;
});
