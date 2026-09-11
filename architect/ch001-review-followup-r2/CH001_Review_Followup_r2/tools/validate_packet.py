#!/usr/bin/env python3
"""Validate this review packet only. Does not install, launch, or test the application."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = [f'CH001-{i:03d}' for i in range(1,73)]

def main() -> int:
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--write-report', action='store_true')
    args=ap.parse_args()
    checks=[]
    def check(name, ok, detail):
        checks.append({'check':name, 'passed':bool(ok), 'detail':detail})
    json_errors=[]
    for path in ROOT.rglob('*.json'):
        if path.name=='VALIDATION_REPORT.json': continue
        try: json.loads(path.read_text(encoding='utf-8'))
        except (OSError,ValueError) as exc: json_errors.append(f'{path.relative_to(ROOT)}: {exc}')
    check('JSON syntax',not json_errors,json_errors or 'All JSON documents parse.')
    plan=json.loads((ROOT/'gate-coverage.plan.json').read_text())
    result=json.loads((ROOT/'templates/repair-results.template.json').read_text())
    control=json.loads((ROOT/'review-control.json').read_text())
    findings=json.loads((ROOT/'templates/finding-dispositions.template.json').read_text())
    gates=plan['gates']
    check('Exact 72 original gate IDs',[g['id'] for g in gates]==EXPECTED,'No added, removed, reordered, or duplicate IDs.')
    check('No invented execution results',plan['record_kind']=='PLAN_NOT_EXECUTED' and all(g['initial_status']=='NOT_RUN' and not g['actual_evidence'] for g in gates),'Coverage plan is not application test evidence.')
    check('Template is unexecuted',result['record_kind']=='TEMPLATE_NOT_EXECUTED' and not result['overall_checkpoint_complete'] and [g['id'] for g in result['gates']]==EXPECTED and all(g['status']=='NOT_RUN' and not g['actual_evidence'] for g in result['gates']),'All template statuses remain NOT_RUN.')
    check('Review does not claim app acceptance',control['verdict']=='REPAIR_REQUIRED' and control['accepted_application_version'] is None and not control['reviewer_reexecuted_application_commands'] and not control['reviewer_mutated_repository'],'No app tests, acceptance, or repo writes claimed.')
    check('Reviewed SHAs match',control['reviewed_implementation_commit']=='bdd6540b90f2d59b7ef11215cd0ceb631fc6336a' and control['reviewed_evidence_commit']=='ad0dd5fdd6764e4f3a40a6028720bff272130d42','Explicit original implementation/evidence pair.')
    check('Original reported gate counts',control['reported_original_gates']=={'PASS':0,'FAIL':0,'NOT_RUN':72},'Historical report is preserved.')
    original=(ROOT/'reference/ORIGINAL_ACCEPTANCE_TESTS.md').read_bytes()
    blob=hashlib.sha1(b'blob '+str(len(original)).encode()+b'\0'+original).hexdigest()
    check('Original acceptance identity',blob=='ae3de51811b3e740952352ce6272402a6d23c5da',blob)
    original_rows={}
    for line in original.decode().splitlines():
        if line.startswith('| CH001-'):
            row=[part.strip() for part in line.strip().strip('|').split('|')]
            original_rows[row[0]]=row[1:]
    check('Gate requirements unchanged',all(original_rows[g['id']]==[g['original_procedure'],g['original_required_evidence']] for g in gates),'Procedures and evidence requirements match the original text exactly.')
    allowed={'UNIT','DB','HTTP','UI','RENDER','LIFECYCLE','SECURITY','VISUAL','DOC'}
    check('Every gate has planned coverage',all(g['planned_suites'] and set(g['planned_suites'])<=allowed for g in gates),'All 72 gates mapped; mappings are plans only.')
    expected_findings=[f'R{i:02d}' for i in range(1,12)]
    check('Findings traceability',[f['id'] for f in findings['findings']]==expected_findings and all(f['status']=='OPEN' and all(x in EXPECTED for x in f['related_gate_ids']) for f in findings['findings']),'R01–R11 have valid gate references and no invented closure.')
    bad_links=[]; bad_fences=[]
    for path in ROOT.rglob('*.md'):
        if path.name=='VALIDATION_REPORT.md': continue
        text=path.read_text(encoding='utf-8')
        if sum(1 for line in text.splitlines() if line.startswith('```'))%2: bad_fences.append(str(path.relative_to(ROOT)))
        for match in re.finditer(r'\]\(([^)]+)\)',text):
            target=match.group(1)
            if target.startswith(('http://','https://','mailto:','#')):continue
            local=unquote(target.split('#',1)[0])
            if local and not (path.parent/local).resolve().exists():bad_links.append(f'{path.relative_to(ROOT)} -> {target}')
    check('Local Markdown links resolve',not bad_links,bad_links or 'All linked local files/directories exist.')
    check('Fenced code blocks balanced',not bad_fences,bad_fences or 'All Markdown code fences are paired.')
    forbidden=[str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file() and p.suffix.lower() in {'.ttf','.otf','.woff','.woff2','.env','.png','.jpg','.jpeg','.zip'}]
    check('No font or application-output binaries bundled',not forbidden,forbidden or 'Packet contains documentation, templates, and the packet validator only.')
    report={'validation_kind':'REVIEW_PACKET_STRUCTURAL_CHECKS_ONLY','application_tests_executed':False,
            'application_accepted':False,'checks':checks,'passed':sum(c['passed'] for c in checks),
            'failed':sum(not c['passed'] for c in checks)}
    if args.write_report:
        (ROOT/'VALIDATION_REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
        text='# Packet validation report\n\n'
        text+=f"**{report['passed']} structural checks passed; {report['failed']} failed.**\n\n"
        text+='These checks validate the review documents, JSON templates, baseline identity, gate mapping, and local links. They do not run the application, validate Docker/browser behavior, or establish any CH-001 gate pass. v0.1.0 remains unaccepted.\n\n'
        for c in checks:text+=f"- {'PASS' if c['passed'] else 'FAIL'} — {c['check']}.\n"
        text+='\nReproduce with `python tools/validate_packet.py` from this packet directory. File checksums are listed separately in `SHA256SUMS.txt`.\n'
        (ROOT/'VALIDATION_REPORT.md').write_text(text)
    print(json.dumps(report,indent=2))
    return 0 if report['failed']==0 else 1
if __name__=='__main__':sys.exit(main())
