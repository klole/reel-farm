/* global process */

import assert from "node:assert/strict";
import { chmod, mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import {
  SANDBOX_LAUNCH_OPTIONS,
  assertManagedBrowserIdentity,
  assertPolicyInstallPathAvailable,
  buildAppArmorProfile,
  checkHostedPolicyContext,
  classifyBrowserLaunchFailure,
  decideSandboxPolicy,
  makeProfileName,
  makeSandboxLaunchOptions,
  makePolicyOwnership,
  ownedCleanupDecision,
  policySpec,
  recordPolicyInstall,
  profilePathForName,
  resolveManagedBrowserExecutable,
  runExternal,
  runSandboxProbe,
  sha256File
} from "../../scripts/ch001-sandbox.mjs";

const implementation = "a".repeat(40);
const workflow = "b".repeat(40);

async function withTemporaryDirectory(operation) {
  const directory = await mkdtemp(resolve(tmpdir(), "ch001r6-sandbox-"));
  try {
    return await operation(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function managedFixture(directory) {
  const root = resolve(directory, "ms-playwright");
  const executable = resolve(root, "chromium-1243", "chrome-linux64", "chrome");
  await mkdir(dirname(executable), { recursive: true });
  await writeFile(executable, "#!/bin/sh\nexit 0\n");
  await chmod(executable, 0o755);
  const resolution = await resolveManagedBrowserExecutable({ playwrightExecutablePath: executable, selectedExecutablePath: executable, browsersPath: root });
  return { root, executable, resolution };
}

function hostedEnvironment(overrides = {}) {
  return {
    GITHUB_REPOSITORY: "klole/reel-farm",
    GITHUB_EVENT_NAME: "workflow_dispatch",
    RUNNER_ENVIRONMENT: "github-hosted",
    RUNNER_OS: "Linux",
    GITHUB_ACTIONS: "true",
    REPOSITORY_PRIVATE: "false",
    GITHUB_REF: "refs/heads/main",
    CH001_SANDBOX_OPT_IN: "true",
    REQUESTED_SHA: implementation,
    CH001_IMPLEMENTATION_COMMIT: implementation,
    ...overrides
  };
}

test("R6-T01 resolves the exact pinned Playwright executable and records measured identity", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { root, executable, resolution } = await managedFixture(directory);
    assert.equal(resolution.path, executable);
    assert.equal(resolution.browsers_root, root);
    assert.equal(resolution.revision, "chromium-1243");
    assert.equal(resolution.platform_directory, "chrome-linux64");
    assert.equal(resolution.filename, "chrome");
    assert.equal(resolution.sha256, await sha256File(executable));
    assert.equal(resolution.mode, "0755");
    assert.equal(resolution.uid, (await stat(executable)).uid);
    assert.equal(resolution.gid, (await stat(executable)).gid);
  });
});

test("R6-T02 rejects a same-name or external browser that is not Playwright's canonical executable", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { root, executable } = await managedFixture(directory);
    const external = resolve(directory, "usr", "bin", "chrome");
    await mkdir(dirname(external), { recursive: true });
    await writeFile(external, "external\n");
    await chmod(external, 0o755);
    await assert.rejects(() => resolveManagedBrowserExecutable({ playwrightExecutablePath: executable, selectedExecutablePath: external, browsersPath: root }), /does not match Playwright's pinned executable/);
    assert.throws(() => buildAppArmorProfile({ profileName: "ch001r6-test", executablePath: `${root}/*/chrome` }), /unsupported profile-language/);
    assert.throws(() => buildAppArmorProfile({ profileName: "ch001r6-test", executablePath: `${root}/chrome\nuserns,` }), /unsupported profile-language/);
    const spaced = buildAppArmorProfile({ profileName: "ch001r6-spaced", executablePath: `${root}/chrome with spaces`, managedRoot: directory });
    assert.match(spaced, /chrome with spaces/);
    const marker = resolve(directory, "command-injection-marker");
    const hostileArgument = `$(touch ${marker}); touch ${marker}`;
    const command = await runExternal("printf", ["%s", hostileArgument]);
    assert.equal(command.output, hostileArgument);
    await assert.rejects(() => stat(marker));
  });
});

test("R6-T03 rejects a managed-layout symlink that resolves outside the pinned browser root", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { root, executable } = await managedFixture(directory);
    const outside = resolve(directory, "outside-chrome");
    await writeFile(outside, "outside\n");
    await chmod(outside, 0o755);
    const escaped = resolve(root, "chromium-1243", "chrome-linux64", "escaped");
    await symlink(outside, escaped);
    await assert.rejects(() => resolveManagedBrowserExecutable({ playwrightExecutablePath: executable, selectedExecutablePath: escaped, browsersPath: root }), /does not match Playwright's pinned executable|managed browser revision/);
  });
});

test("R6-T04 generates only the exact temporary AppArmor userns exception", () => {
  const content = buildAppArmorProfile({ profileName: "ch001r6-test-profile", executablePath: "/tmp/ms-playwright/chromium-1243/chrome-linux64/chrome", managedRoot: "/tmp/ms-playwright" });
  assert.match(content, /flags=\(unconfined\)/);
  assert.match(content, /\n {2}userns,\n/);
  assert.doesNotMatch(content, /\*|\b(?:network|capability|file|mount|ptrace|signal)\b/);
  assert.equal(content.split("\n").filter(Boolean).length, 5);
});

test("R6-T05 rejects profile and attachment injection before policy construction", () => {
  assert.throws(() => makeProfileName("R6 unsafe"), /short lowercase run-owned/);
  assert.throws(() => buildAppArmorProfile({ profileName: "ch001r6-test", executablePath: "/tmp/chrome; touch /tmp/pwned" }), /unsupported profile-language/);
  assert.throws(() => buildAppArmorProfile({ profileName: "ch001r6-test\nuserns", executablePath: "/tmp/chrome" }), /profile name is invalid/);
  assert.throws(() => profilePathForName("ch001r6-test", "relative-profile-directory"), /absolute/);
});

test("R6-T06 uses a run-owned profile path and does not overwrite an existing name", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { root, executable, resolution } = await managedFixture(directory);
    const profileDirectory = resolve(directory, "apparmor");
    const spec = policySpec({ runId: "r6-owned-run", profileName: "ch001r6-owned-profile", executablePath: executable, executableSha256: resolution.sha256, managedRoot: root, profileDirectory });
    assert.equal(spec.profile_path, resolve(profileDirectory, "ch001r6-owned-profile"));
    assert.equal(spec.managed_browsers_root, root);
    await mkdir(profileDirectory, { recursive: true });
    await writeFile(spec.profile_path, "historical\n");
    assert.equal(await readFile(spec.profile_path, "utf8"), "historical\n");
    assert.equal(profilePathForName(spec.profile_name, profileDirectory), spec.profile_path);
  });
});

test("R6-T06 distinguishes a working sandbox, a safe policy block, and an unsafe unknown cause", () => {
  const working = decideSandboxPolicy({ defaultProbe: { launch_succeeded: true, sandbox_observed: true }, context: { allowed: false }, apparmorEnabled: false, parserAvailable: false });
  const policyNeeded = decideSandboxPolicy({ defaultProbe: { launch_succeeded: false, error_classification: "APPARMOR_OR_USERNS_POLICY_BLOCK" }, context: { allowed: true }, apparmorEnabled: true, parserAvailable: true });
  const unavailable = decideSandboxPolicy({ defaultProbe: { launch_succeeded: false, error_classification: "BROWSER_EXECUTABLE_OR_DEPENDENCY_FAILURE" }, context: { allowed: true }, apparmorEnabled: true, parserAvailable: true });
  assert.equal(working.decision, "NOT_NEEDED_DEFAULT_SANDBOX_WORKED");
  assert.equal(policyNeeded.decision, "INSTALL_EXACT_MANAGED_EXECUTABLE");
  assert.equal(unavailable.decision, "NOT_INSTALLED_OTHER_LAUNCH_CAUSE");
});

test("R6-T07 permits policy setup only for the explicitly opted-in hosted dispatch context", () => {
  assert.equal(checkHostedPolicyContext(hostedEnvironment()).allowed, true);
  for (const overrides of [
    { CH001_SANDBOX_OPT_IN: "false" },
    { GITHUB_EVENT_NAME: "push" },
    { RUNNER_ENVIRONMENT: "self-hosted" },
    { GITHUB_REPOSITORY: "other/project" },
    { REQUESTED_SHA: "c".repeat(40) },
    { CH001_IMPLEMENTATION_COMMIT: "not-a-sha" }
  ]) assert.equal(checkHostedPolicyContext(hostedEnvironment(overrides)).allowed, false);
});

test("R6-T07 refuses an existing profile and records failed partial ownership without claiming it loaded", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { root, executable, resolution } = await managedFixture(directory);
    const spec = policySpec({ runId: "r6-collision-run", profileName: "ch001r6-collision-profile", executablePath: executable, executableSha256: resolution.sha256, managedRoot: root, profileDirectory: resolve(directory, "apparmor") });
    assert.throws(() => assertPolicyInstallPathAvailable({ isFile: () => true }), /Refusing to replace/);
    const ownership = makePolicyOwnership({ runId: "r6-collision-run", spec, requestingUid: 1000, requestedImplementationSha: implementation, implementationCommit: implementation, workflowSha: workflow });
    const failed = recordPolicyInstall(ownership, { exit_code: 2, parsed: { status: "FAILED", loaded: false, error: "parser denied" } });
    assert.equal(failed.resource_may_exist, true);
    assert.equal(failed.loaded, false);
    assert.equal(failed.install_exit_code, 2);
  });
});

test("R6-T08 cleanup decision removes only owned unchanged files and is idempotent", () => {
  const ownership = { profile_sha256: "a".repeat(64), resource_created: true };
  const unchanged = { isFile: () => true };
  assert.deepEqual(ownedCleanupDecision({ ownership, current: unchanged, currentSha256: ownership.profile_sha256 }).decision, "REMOVE_OWNED_UNCHANGED");
  assert.deepEqual(ownedCleanupDecision({ ownership, current: unchanged, currentSha256: "b".repeat(64) }).decision, "REFUSE_MODIFIED_OR_UNOWNED");
  assert.deepEqual(ownedCleanupDecision({ ownership: { ...ownership, resource_created: false }, current: unchanged, currentSha256: ownership.profile_sha256 }).decision, "REFUSE_MODIFIED_OR_UNOWNED");
  assert.deepEqual(ownedCleanupDecision({ ownership, current: null, currentSha256: null }), { decision: "ALREADY_REMOVED", status: "ALREADY_REMOVED", owned_resources_removed: true });
});

test("R6-T08 launch options preserve Chromium sandboxing and use a narrow environment", () => {
  assert.deepEqual(SANDBOX_LAUNCH_OPTIONS, { headless: true, chromiumSandbox: true });
  const options = makeSandboxLaunchOptions({ executablePath: "/tmp/ms-playwright/chromium-1243/chrome-linux64/chrome", environment: { PATH: "/usr/bin", HOME: "/home/runner", BROWSER_EXECUTABLE_PATH: "attacker" } });
  assert.equal(options.chromiumSandbox, true);
  assert.equal(options.headless, true);
  assert.equal(options.executablePath, "/tmp/ms-playwright/chromium-1243/chrome-linux64/chrome");
  assert.equal(options.env.HOME, "/tmp");
  assert.equal(options.env.BROWSER_EXECUTABLE_PATH, undefined);
  assert.equal(options.env.PATH, "/usr/bin");
});

test("R6-T09 records a positive effective sandbox observation only when launch evidence supports it", async () => {
  const calls = [];
  const result = await runSandboxProbe({
    executablePath: "/tmp/ms-playwright/chromium-1243/chrome-linux64/chrome",
    environment: { TMPDIR: "/tmp", PATH: "/usr/bin" },
    launchPersistentContext: async (profileDirectory, options) => {
      calls.push({ profileDirectory, options });
      let pageNumber = 0;
      return {
        browser: () => ({ version: () => "124.0.6367.0" }),
        newPage: async () => {
          pageNumber += 1;
          const diagnostic = pageNumber === 2;
          return {
            setContent: async () => undefined,
            goto: async () => undefined,
            locator: (selector) => selector === "#probe"
              ? { textContent: async () => "CH001-R6-SANDBOX-PROBE" }
              : { innerText: async () => diagnostic ? "Seccomp-BPF sandbox: active; user namespace sandbox" : "" },
            close: async () => undefined
          };
        },
        close: async () => undefined
      };
    },
    processFacts: async () => ({ available: true, processes: [{ pid: 123, is_renderer: true, forbidden_switches: [], namespaces: { user: "user:[4026531837]" }, seccomp: { mode: 2, filters: 1 }, apparmor_profile: null }] })
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.chromiumSandbox, true);
  assert.equal(result.sandbox_requested, true);
  assert.equal(result.launch_succeeded, true);
  assert.equal(result.sandbox_observed, true);
  assert.equal(result.synthetic_render.content_observed, true);
  assert.deepEqual(result.diagnostic_evidence[2].forbidden_switches, []);
});

test("R6-T10 classifies sandbox launch failures without authorizing a bypass", () => {
  assert.equal(classifyBrowserLaunchFailure("No usable sandbox! Update your kernel or see chromium sandbox documentation."), "APPARMOR_OR_USERNS_POLICY_BLOCK");
  assert.equal(classifyBrowserLaunchFailure("error while loading shared libraries: libX.so: cannot open shared object file"), "BROWSER_EXECUTABLE_OR_DEPENDENCY_FAILURE");
  assert.equal(classifyBrowserLaunchFailure("unexpected browser exit"), "UNKNOWN_BROWSER_LAUNCH_FAILURE");
  const options = makeSandboxLaunchOptions({ executablePath: "/tmp/pinned/chrome" });
  assert.equal(options.chromiumSandbox, true);
});

test("R6-T10 rejects a full-Chrome launch path paired with a separately installed headless-shell executable", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { root, executable } = await managedFixture(directory);
    const headless = resolve(root, "chromium_headless_shell-1243", "chrome-headless-shell-linux64", "headless_shell");
    await mkdir(dirname(headless), { recursive: true });
    await writeFile(headless, "#!/bin/sh\nexit 0\n");
    await chmod(headless, 0o755);
    await assert.rejects(() => resolveManagedBrowserExecutable({ playwrightExecutablePath: executable, selectedExecutablePath: headless, browsersPath: root }), /does not match Playwright's pinned executable/);
  });
});

test("R6-T11 all host launch helpers use the qualified path or the image-local managed browser", async () => {
  const [proof, lifecycle, gated, worker, config] = await Promise.all([
    readFile(resolve(process.cwd(), "scripts/ch001-proof.ts"), "utf8"),
    readFile(resolve(process.cwd(), "scripts/ch001-lifecycle.ts"), "utf8"),
    readFile(resolve(process.cwd(), "scripts/run-gated-check.ts"), "utf8"),
    readFile(resolve(process.cwd(), "apps/worker/src/index.ts"), "utf8"),
    readFile(resolve(process.cwd(), "playwright.config.ts"), "utf8")
  ]);
  assert.match(proof, /resolveManagedBrowserExecutable/);
  assert.match(proof, /chromiumSandbox:\s*true/);
  assert.match(lifecycle, /resolveManagedBrowserExecutable/);
  assert.match(lifecycle, /chromiumSandbox:\s*true/);
  assert.match(gated, /resolveManagedBrowserExecutable/);
  assert.match(config, /chromiumSandbox:\s*true/);
  assert.match(worker, /chromiumSandbox:\s*true/);
  assert.doesNotMatch(worker, /BROWSER_EXECUTABLE_PATH/);
});

test("R6-T12 workflow keeps proof ownership separate from sandbox diagnostics and cleanup", async () => {
  const workflow = await readFile(resolve(process.cwd(), ".github/workflows/ch001-live-proof.yml"), "utf8");
  assert.match(workflow, /sandbox_qualification/);
  assert.match(workflow, /CH001_SANDBOX_OPT_IN/);
  assert.match(workflow, /node scripts\/ch001-sandbox\.mjs qualify/);
  assert.match(workflow, /node scripts\/ch001-sandbox\.mjs cleanup/);
  assert.doesNotMatch(workflow, /mkdir[^\n]*\$CH001_EVIDENCE_ROOT/);
  assert.doesNotMatch(workflow, /--no-sandbox/);
});

test("R6-T13 policy records bind the executable digest and both full commit identities", async () => {
  await withTemporaryDirectory(async (directory) => {
    const { root, executable, resolution } = await managedFixture(directory);
    const spec = policySpec({ runId: "r6-identity-run", profileName: "ch001r6-identity-profile", executablePath: executable, executableSha256: resolution.sha256, managedRoot: root });
    assert.equal(spec.executable_sha256, resolution.sha256);
    assert.match(implementation, /^[0-9a-f]{40}$/);
    assert.match(workflow, /^[0-9a-f]{40}$/);
    await assert.doesNotReject(() => assertManagedBrowserIdentity({ resolution, playwrightExecutablePath: executable, selectedExecutablePath: executable, browsersPath: root }));
    await writeFile(executable, "changed\n");
    await assert.rejects(() => assertManagedBrowserIdentity({ resolution, playwrightExecutablePath: executable, selectedExecutablePath: executable, browsersPath: root }), /identity changed/);
  });
});

test("R6-T14 a failed fake launch remains a blocked sandbox result", async () => {
  const result = await runSandboxProbe({
    executablePath: "/tmp/pinned/chrome",
    launchPersistentContext: async () => { throw new Error("No usable sandbox! Chromium cannot launch"); },
    processFacts: async () => ({ available: false, processes: [], reason: "launch failed" })
  });
  assert.equal(result.sandbox_requested, true);
  assert.equal(result.launch_succeeded, false);
  assert.equal(result.sandbox_observed, null);
  assert.equal(result.error_classification, "APPARMOR_OR_USERNS_POLICY_BLOCK");
});
