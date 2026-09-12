// Architect diagnostic only: no repository implementation or hosted acceptance.
// Uses a byte-verified T7 shell initializer and equivalent T7 environment-merging
// logic. Every environment file is synthetic and created in a temporary folder.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const helper = join(here, 'initialize-sandbox-state.T7.sh');
const bytes = readFileSync(helper);
const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
assert.equal(blob, '0e4dd049b5a7d77382ae05cd0a3710812d184b87');
const work = mkdtempSync(join(tmpdir(), 'r8-env-diagnostic-'));
const results = [];
const report = {kind:'ARCHITECT_ISOLATED_ENVIRONMENT_DIAGNOSTIC', node:process.version,
  platform:process.platform, initializer_git_blob:blob, repository_tests_executed:false,
  hosted_proof_executed:false, application_acceptance:false, results};
function withEnvironment(parent, overrides = {}) {
  const environment = { ...parent };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete environment[key]; else environment[key] = value;
  }
  return environment;
}
function child(env) {
  return spawnSync('/bin/bash', [helper], {env, encoding:'utf8', timeout:5000});
}
try {
  const parentEnvFile = join(work, 'parent-github-env');
  const fixtureEnvFile = join(work, 'fixture-github-env');
  const syntheticParent = {PATH:'/usr/bin:/bin', HOME:work, RUNNER_TEMP:join(work,'parent temp'),
    GITHUB_ENV:parentEnvFile, GITHUB_RUN_ID:'99999', GITHUB_RUN_ATTEMPT:'1'};
  for (const missing of ['RUNNER_TEMP','GITHUB_ENV']) {
    for (const mode of ['t7-remerge','exact-environment']) {
      writeFileSync(parentEnvFile, 'PARENT=preserve\n');
      writeFileSync(fixtureEnvFile, 'FIXTURE=preserve\n');
      const prepared = withEnvironment(syntheticParent, {RUNNER_TEMP:join(work,'fixture temp'),
        GITHUB_ENV:fixtureEnvFile, GITHUB_RUN_ID:'123456789', GITHUB_RUN_ATTEMPT:'1', [missing]:undefined});
      assert.equal(Object.hasOwn(prepared, missing), false);
      const actualEnv = mode === 't7-remerge' ? withEnvironment(syntheticParent, prepared) : prepared;
      const result = child(actualEnv);
      assert.equal(result.error, undefined);
      const parentChanged = readFileSync(parentEnvFile,'utf8') !== 'PARENT=preserve\n';
      const fixtureChanged = readFileSync(fixtureEnvFile,'utf8') !== 'FIXTURE=preserve\n';
      if (mode === 't7-remerge') {
        assert.equal(result.status, 0);
        assert.equal(Object.hasOwn(actualEnv, missing), true);
        assert.equal(missing === 'GITHUB_ENV' ? parentChanged : fixtureChanged, true);
      } else {
        assert.notEqual(result.status, 0);
        assert.equal(parentChanged, false);
        assert.equal(fixtureChanged, false);
      }
      results.push({case:`${missing}/${mode}`,diagnostic_assertions:'PASS',
        helper_exit:result.status, deleted_key_reintroduced:Object.hasOwn(actualEnv,missing),
        synthetic_parent_env_modified:parentChanged, synthetic_fixture_env_modified:fixtureChanged});
    }
  }
  writeFileSync(fixtureEnvFile, 'FIXTURE=preserve\n');
  const positive = {...syntheticParent, RUNNER_TEMP:join(work,'literal space $(not executed)'), GITHUB_ENV:fixtureEnvFile};
  const positiveResult = child(positive);
  assert.equal(positiveResult.status, 0);
  const expected = `${positive.RUNNER_TEMP}/ch001r6/99999-1/sandbox`;
  assert.equal(readFileSync(fixtureEnvFile,'utf8'), `FIXTURE=preserve\nCH001_SANDBOX_STATE_DIR=${expected}\n`);
  assert.equal(existsSync(expected), false);
  results.push({case:'exact-environment/positive-literal-path',diagnostic_assertions:'PASS',helper_exit:0,created_state_directory:false});
  report.passed = results.length;
  report.failed = 0;
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
} finally { rmSync(work,{recursive:true,force:true}); }
