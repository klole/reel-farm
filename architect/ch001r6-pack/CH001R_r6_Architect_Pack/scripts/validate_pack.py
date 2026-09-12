#!/usr/bin/env python3
"""Validate this document packet and its historical T5 archive; not application tests."""
from pathlib import Path, PurePosixPath
import argparse, collections, hashlib, json, re, sys, zipfile

def main() -> int:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output',type=Path)
    args=parser.parse_args(); root=args.root.resolve(); checks=[]
    def check(name, condition, detail=''):
        checks.append({'name':name,'status':'PASS' if condition else 'FAIL','detail':detail})
    expected=['README.md','01_REVIEW_VERDICT.md','02_LUNA_ASSIGNMENT.md','03_TESTS_AND_EVIDENCE.md',
              '04_ROUTER_HANDOFF.md','05_SOURCES_AND_IDENTITIES.md','START_PROMPT.md',
              'templates/CH-001R-r6_HANDOFF.md','templates/r6-checklist.template.json',
              'review/T5_ARTIFACT_INSPECTION.json','review/T5_ARCHIVE_FILES.json','review/T5_HOSTED_ARTIFACT.zip']
    check('required_files_exist',all((root/p).is_file() for p in expected))
    md={p.relative_to(root).as_posix():p.read_text(encoding='utf-8') for p in root.rglob('*.md')}
    check('markdown_utf8_and_nonempty',all(v.strip() for v in md.values()))
    broken=[]
    for name,text in md.items():
        for target in re.findall(r'\]\(([^)]+)\)',text):
            if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:',target) or target.startswith('#'):continue
            base=target.split('#',1)[0]
            if base and not (root/name).parent.joinpath(base).resolve().exists():broken.append(f'{name}: {target}')
    check('internal_links_resolve',not broken,'; '.join(broken))
    inspection=json.loads((root/'review/T5_ARTIFACT_INSPECTION.json').read_text())
    template=json.loads((root/'templates/r6-checklist.template.json').read_text())
    checks_list=template['checks']; expected_ids=[f'R6-T{i:02d}' for i in range(1,21)]
    check('twenty_unique_r6_checklist_ids',[x['id'] for x in checks_list]==expected_ids)
    table_ids=re.findall(r'\| (R6-T\d+) \|',md['03_TESTS_AND_EVIDENCE.md'])
    check('test_table_matches_template',table_ids==expected_ids)
    check('template_not_claiming_execution',template['record_kind']=='UNEXECUTED_TEMPLATE' and all(x['status']=='NOT_RUN' and not x['actual_evidence'] for x in checks_list))
    check('template_preserves_nonacceptance',template['application_acceptance'] is False and template['accepted_application_version']=='none' and template['gates_replaced'] is False)
    raw=(root/'review/T5_HOSTED_ARTIFACT.zip').read_bytes()
    digest=hashlib.sha256(raw).hexdigest()
    check('historical_archive_size_and_hash',len(raw)==50693 and digest=='89d18eebcbd629c7a504151c85a558610039052447baf21d82d00595227f96bb')
    with zipfile.ZipFile(root/'review/T5_HOSTED_ARTIFACT.zip') as z:
        names=z.namelist()
        check('archive_paths_unique_and_safe',len(names)==len(set(names)) and all(not n.startswith('/') and '..' not in PurePosixPath(n).parts for n in names))
        check('historical_archive_has_39_file_entries',len(names)==39)
        prefix='reel-farm/reel-farm/artifacts/ch001r4/r4-34671716094-1/'
        report=json.loads(z.read(prefix+'proof/public/proof-result.json'))
        ledger=json.loads(z.read(prefix+'proof/public/gate-results.json'))
        manifest=json.loads(z.read(prefix+'proof/public/artifact-manifest.json'))
        ci=json.loads(z.read(prefix+'bootstrap/public/ci-result.json'))
        check('artifact_identities_match_review',report['implementation_commit']==inspection['implementation_commit']=='6849b39f4e3c7a03b5f132418b1d33cc84c98d51' and report['workflow_sha']=='a27bb4bbae78cd618e2ccf6c14a6593df7f83554' and report['run_id']=='r4-34671716094-1')
        check('actual_blocked_result_retained',report['status']=='BLOCKED_ENVIRONMENT' and report['exit_code']==2 and report['application_acceptance'] is False and ci['bootstrap_status']=='PASS')
        ids=[x['id'] for x in ledger['gates']]
        check('all_72_historical_gate_ids_preserved',ids==[f'CH001-{i:03d}' for i in range(1,73)])
        counts=dict(collections.Counter(x['status'] for x in ledger['gates']))
        check('historical_gate_counts_match',counts.get('PASS',0)==4 and counts.get('FAIL',0)==0 and counts.get('NOT_RUN',0)==68)
        passed=[x['id'] for x in ledger['gates'] if x['status']=='PASS']
        check('four_source_only_passes_identified',passed==['CH001-067','CH001-068','CH001-069','CH001-072'])
        payload_ok=True
        for ent in manifest['files']:
            b=z.read('reel-farm/reel-farm/'+ent['path'])
            payload_ok &= len(b)==ent['bytes'] and hashlib.sha256(b).hexdigest()==ent['sha256']
        check('all_25_manifest_payload_hashes_match',len(manifest['files'])==25 and payload_ok)
        blob_ok=True
        for entry in inspection['committed_blob_checks']:
            b=z.read(prefix+entry['path'])
            blob=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
            blob_ok &= blob==entry['expected_git_blob']
        check('archived_reports_match_pinned_git_blob_ids',blob_ok)
    check('review_declares_no_app_execution',inspection['application_tests_executed_by_architect'] is False and inspection['workflow_dispatched_by_architect'] is False and inspection['repository_modified_by_architect'] is False)
    src=md['05_SOURCES_AND_IDENTITIES.md']
    check('primary_source_register_present',re.findall(r'^### (S\d+)',src,re.M)==[f'S{i:02d}' for i in range(1,19)])
    check('dispatch_uses_new_unassigned_T6', 'implementation_sha="$T6"' in md['04_ROUTER_HANDOFF.md'] and 'REPLACE_WITH_ACTUAL_FULL_T6_SHA' in md['04_ROUTER_HANDOFF.md'])
    failures=[c for c in checks if c['status']=='FAIL']
    result={'validation_kind':'DOCUMENT_AND_HISTORICAL_ARTIFACT_INTEGRITY_ONLY','application_tests_executed':False,
            'new_sandbox_policy_executed':False,'new_workflow_dispatched':False,'check_count':len(checks),
            'pass_count':len(checks)-len(failures),'failure_count':len(failures),'checks':checks}
    output=args.output or root/'PACK_VALIDATION.json'
    output.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['validation_kind','check_count','pass_count','failure_count']},indent=2))
    return 1 if failures else 0
if __name__=='__main__':sys.exit(main())
