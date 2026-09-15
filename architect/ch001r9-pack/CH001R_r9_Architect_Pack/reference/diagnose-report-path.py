#!/usr/bin/env python3
"""Offline diagnostic of reference shell/path logic; not a full bootstrap test."""
from pathlib import Path
import os, subprocess, tempfile, json, hashlib, platform

root=Path(__file__).resolve().parent
results=[]
base_env={k:os.environ[k] for k in ('PATH','LANG','LC_ALL') if k in os.environ}

def run(args, cwd, env):
    return subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, timeout=10)

def check(name, value, detail):
    results.append({'name':name,'pass':bool(value),'detail':detail})
    if not value: raise AssertionError(name+': '+str(detail))

with tempfile.TemporaryDirectory(prefix='ch001r9-path-diagnostic-') as td:
    w=Path(td)/'workspace with spaces';w.mkdir()
    raw='artifacts/ch001r4/r4-34928718810-1/bootstrap/public/bootstrap-result.json'
    env={**base_env,'CI_BOOTSTRAP_REPORT':raw}
    old=run(['bash','--noprofile','--norc','-c', 'stage_report="$(dirname "$CI_BOOTSTRAP_REPORT")/actionlint-bootstrap.json"; printf "%s\\n" "$stage_report"'],w,env)
    oldpath=old.stdout.strip()
    rejection=run(['node',str(root/'T8-report-guard.excerpt.mjs'),oldpath],w,base_env)
    check('T8 relative caller value is rejected by the inspected guard excerpt',old.returncode==0 and rejection.returncode==1 and 'must be an absolute path' in rejection.stderr,{'path':oldpath,'guard_exit':rejection.returncode})
    fixed=run(['bash','--noprofile','--norc',str(root/'resolve-actionlint-report.reference.sh')],w,env)
    target=w/Path(raw).parent/'actionlint-bootstrap.json'
    accept=run(['node',str(root/'T8-report-guard.excerpt.mjs'),fixed.stdout.strip()],w,base_env)
    check('Relative report root resolves to the same workspace location',fixed.returncode==0 and fixed.stdout.strip()==str(target) and accept.returncode==0,{'guard_exit':accept.returncode,'expected_basename':target.name})
    check('Spaces in checkout path stay intact','workspace with spaces/' in fixed.stdout,{'space_preserved':True})
    absolute=w/'evidence absolute'/'bootstrap-result.json'
    absolute_result=run(['bash',str(root/'resolve-actionlint-report.reference.sh')],w,{**base_env,'CI_BOOTSTRAP_REPORT':str(absolute)})
    check('Already-absolute report root is not double-prefixed',absolute_result.returncode==0 and absolute_result.stdout.strip()==str(absolute.parent/'actionlint-bootstrap.json'),{'exit':absolute_result.returncode})
    for name,value in [('missing',None),('empty',''),('newline','artifacts/x\nINJECT=1'),('carriage-return','artifacts/x\rINJECT=1')]:
        e=dict(base_env)
        if value is not None:e['CI_BOOTSTRAP_REPORT']=value
        p=run(['bash',str(root/'resolve-actionlint-report.reference.sh')],w,e)
        check(name+' report root rejected',p.returncode!=0 and not p.stdout,{'exit':p.returncode})
    hostile='artifacts/$(touch INJECTION_MARKER)/bootstrap-result.json'
    p=run(['bash',str(root/'resolve-actionlint-report.reference.sh')],w,{**base_env,'CI_BOOTSTRAP_REPORT':hostile})
    check('Shell-looking text is not evaluated',p.returncode==0 and not (w/'INJECTION_MARKER').exists() and '$(touch INJECTION_MARKER)' in p.stdout,{'marker_created':False})
    check('Resolver creates no evidence, tool, or policy trees',list(w.iterdir())==[],{'files_created':[]})

report={'record_kind':'ARCHITECT_REFERENCE_PATH_DIAGNOSTIC','scope':'reference shell resolver plus inspected path-check excerpt only; NOT complete T8 bootstrap, NOT full workflow, NOT actionlint, NOT application proof','node':subprocess.check_output(['node','--version'],text=True).strip(),'python':platform.python_version(),'checks':results,'executed':len(results),'passed':sum(r['pass'] for r in results),'failed':sum(not r['pass'] for r in results),'reference_hashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (root/'resolve-actionlint-report.reference.sh',root/'T8-report-guard.excerpt.mjs')},'not_run':['full actionlint binary validation','full real bootstrap/reporter step','repository pnpm tests','Docker/Compose','Chromium/AppArmor','hosted proof'],'external_actions':{'network':False,'github_write':False,'dispatch':False,'sudo':False}}
(root.parent/'evidence/architect-path-diagnostic.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'checks':len(results),'passed':report['passed'],'failed':report['failed'],'node':report['node']}))
