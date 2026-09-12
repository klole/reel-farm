"""Isolated reference-snippet checks. Not actionlint or GitHub runner validation."""
from pathlib import Path
import json
import os
import subprocess
import tempfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'examples/initialize-sandbox-state.sh'
results = []

def run_case(name, override=None, omit=None, expected_success=True):
    with tempfile.TemporaryDirectory(prefix='r7-diagnostic-') as tmp:
        home = Path(tmp)
        runner_temp = home / 'runner temp'
        runner_temp.mkdir()
        evidence = home / 'proof'
        evidence.mkdir()
        sentinel = evidence / 'old-evidence.txt'
        sentinel.write_bytes(b'preserve-exactly\n')
        env_file = home / 'github-env'
        env_file.write_text('PREVIOUS=preserve\n', encoding='utf8')
        env = dict(os.environ)
        for key in ('RUNNER_TEMP', 'GITHUB_RUN_ID', 'GITHUB_RUN_ATTEMPT', 'GITHUB_ENV', 'CH001_SANDBOX_STATE_DIR'):
            env.pop(key, None)
        env.update(RUNNER_TEMP=str(runner_temp), GITHUB_RUN_ID='123456789', GITHUB_RUN_ATTEMPT='1', GITHUB_ENV=str(env_file))
        if override:
            env.update(override(home))
        if omit:
            env.pop(omit, None)
        process = subprocess.run(['bash', str(SCRIPT)], env=env, capture_output=True, text=True, timeout=10)
        assert (process.returncode == 0) == expected_success, (name, process.returncode, process.stderr)
        assert sentinel.read_bytes() == b'preserve-exactly\n'
        assert env_file.read_text().startswith('PREVIOUS=preserve\n')
        if expected_success:
            entries = [line for line in env_file.read_text().splitlines() if line.startswith('CH001_SANDBOX_STATE_DIR=')]
            assert len(entries) == 1
            actual = entries[0].split('=', 1)[1]
            expected = f"{env['RUNNER_TEMP']}/ch001r6/{env['GITHUB_RUN_ID']}-{env['GITHUB_RUN_ATTEMPT']}/sandbox"
            assert actual == expected, (actual, expected)
            assert not Path(actual).exists()
            # Simulate the runner's key/value transfer, NOT execution of the env file.
            for role in ('qualification', 'cleanup'):
                child_env = dict(env, CH001_SANDBOX_STATE_DIR=actual)
                child = subprocess.run(['bash', '-c', 'printf "%s" "$CH001_SANDBOX_STATE_DIR"'], env=child_env, capture_output=True, text=True, timeout=10)
                assert child.returncode == 0 and child.stdout == expected, role
            assert not (home/'marker').exists()
        else:
            assert env_file.read_text() == 'PREVIOUS=preserve\n'
        results.append({'name':name, 'status':'PASS', 'subject_exit_code':process.returncode,
                        'boundary':'isolated reference shell; not the repository workflow'})

run_case('absolute path with spaces transfers unchanged to both consumers')
run_case('different run attempt yields distinct path', lambda h: {'GITHUB_RUN_ATTEMPT':'2'})
run_case('shell-looking path is data, not executed', lambda h: {'RUNNER_TEMP':str(h / ('temp $(touch '+str(h/'marker')+')'))})
run_case('missing RUNNER_TEMP rejects before env write', omit='RUNNER_TEMP', expected_success=False)
run_case('missing GITHUB_ENV rejects', omit='GITHUB_ENV', expected_success=False)
run_case('relative temp path rejects', lambda h: {'RUNNER_TEMP':'relative'}, expected_success=False)
run_case('newline temp path rejects', lambda h: {'RUNNER_TEMP':str(h)+'\nOTHER=x'}, expected_success=False)
run_case('invalid run ID rejects', lambda h: {'GITHUB_RUN_ID':'not-a-run'}, expected_success=False)
run_case('attempt zero rejects', lambda h: {'GITHUB_RUN_ATTEMPT':'0'}, expected_success=False)
report={'report_kind':'ARCHITECT_REFERENCE_SNIPPET_DIAGNOSTICS', 'generated_at':datetime.now(timezone.utc).isoformat(),
        'tests':results, 'counts':{'PASS':len(results),'FAIL':0},
        'application_tests_executed':False, 'github_workflow_executed':False,
        'actionlint_executed':False, 'sandbox_policy_changes':False,
        'limitations':['Only the included reference shell snippet was executed.',
                       'No claim of GitHub workflow grammar validation or application acceptance.']}
(ROOT/'evidence/reference-snippet-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report['counts']))
