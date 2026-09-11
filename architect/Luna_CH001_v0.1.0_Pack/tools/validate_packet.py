#!/usr/bin/env python3
"""Validate planning artifacts only; never report application checks as executed."""
from __future__ import annotations
from pathlib import Path
from urllib.parse import unquote
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    'README.md', 'ACTIVATION_AND_BASELINE.md', 'CHAPTER_BRIEF.md',
    'ACCEPTANCE_TESTS.md', 'HANDOFF_TEMPLATE.md', 'SOURCE_NOTES.md',
    'LUNA_START_PROMPT.md', 'BASELINE_HASHES.json',
    'gate-results.template.json', 'LUNA_CH001_v0.1.0_COMPLETE.md',
    'reference/north-star/NORTH_STAR.md',
]
LINK_PATTERN = re.compile(r'(?<!!)\[[^\]\n]+\]\(([^)\n]+)\)')
GENERATED_REPORTS = {'PACKET_VALIDATION.md', 'PACKET_VALIDATION.json'}


def validate() -> dict:
    errors: list[str] = []
    checks: list[dict] = []
    for name in REQUIRED:
        if not (ROOT / name).is_file():
            errors.append(f'Missing required file: {name}')
    checks.append({'check': 'Required packet files', 'passed': not errors})
    if errors:
        return {'scope': 'DOCUMENT_PACKET_ONLY', 'application_tests_run': False,
                'checks': checks, 'errors': errors}

    original_errors = len(errors)
    baseline = json.loads((ROOT / 'BASELINE_HASHES.json').read_text())
    expected_root = '3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d'
    if baseline['files'].get('NORTH_STAR.md') != expected_root:
        errors.append('Unexpected North Star root hash in baseline register.')
    for name, expected in baseline['files'].items():
        source = ROOT / 'reference/north-star' / name
        if not source.is_file() or hashlib.sha256(source.read_bytes()).hexdigest() != expected:
            errors.append(f'Frozen baseline missing/changed: {name}')
    checks.append({'check': f"Frozen baseline SHA-256 verification ({len(baseline['files'])} source files)",
                   'passed': len(errors) == original_errors})

    original_errors = len(errors)
    matrix = (ROOT / 'ACCEPTANCE_TESTS.md').read_text()
    gate_ids = re.findall(r'^\| (CH001-\d{3}) \|', matrix, re.M)
    expected_ids = [f'CH001-{i:03}' for i in range(1, 73)]
    if gate_ids != expected_ids:
        errors.append('Gate matrix is not exactly CH001-001 through CH001-072, once each.')
    template = json.loads((ROOT / 'gate-results.template.json').read_text())
    if [gate['id'] for gate in template['gates']] != expected_ids:
        errors.append('Gate reporting template does not match matrix.')
    if any(gate['status'] != 'NOT_RUN' or gate['actual_evidence'] for gate in template['gates']):
        errors.append('Unexecuted reporting template contains a result/evidence claim.')
    if template.get('implementation_commit') or template.get('application_tests_executed_by_packet_author'):
        errors.append('Planning template contains an implementation/test claim.')
    checks.append({'check': '72 unique gates and honest unexecuted reporting template',
                   'passed': len(errors) == original_errors})

    original_errors = len(errors)
    markdown_files = [p for p in ROOT.rglob('*.md') if p.name not in GENERATED_REPORTS]
    for path in markdown_files:
        text = path.read_text()
        in_fence = False
        active = []
        for line in text.splitlines():
            if line.lstrip().startswith('```'):
                in_fence = not in_fence
            elif not in_fence:
                active.append(line)
        if in_fence:
            errors.append(f'Unclosed Markdown code fence: {path.relative_to(ROOT)}')
        for target in LINK_PATTERN.findall('\n'.join(active)):
            if target.startswith(('https://', 'http://', 'mailto:', '#')):
                continue
            dest = unquote(target.split('#', 1)[0])
            if dest in GENERATED_REPORTS:
                continue
            if dest and not (path.parent / dest).exists():
                errors.append(f'Broken relative link: {path.relative_to(ROOT)} -> {target}')
    checks.append({'check': f'Markdown code fences and relative file/directory links ({len(markdown_files)} files)',
                   'passed': len(errors) == original_errors})

    original_errors = len(errors)
    combined = (ROOT / 'LUNA_CH001_v0.1.0_COMPLETE.md').read_text()
    anchors = set(re.findall(r'<a id="([^"]+)"', combined))
    for fragment in re.findall(r'\]\(#([^)]+)\)', combined):
        if fragment not in anchors:
            errors.append(f'Combined reading-copy link has no explicit target: {fragment}')
    for phrase in ['v0.1.0', 'CH-001-r1', 'ScrapeCreators', 'fal.ai', 'TikTok', expected_root]:
        if phrase not in combined:
            errors.append(f'Missing key chapter/baseline identifier: {phrase}')
    checks.append({'check': 'Single-file navigation and key baseline identifiers',
                   'passed': len(errors) == original_errors})

    original_errors = len(errors)
    fonts = [str(p.relative_to(ROOT)) for p in ROOT.rglob('*')
             if p.is_file() and p.suffix.lower() in {'.ttf', '.otf', '.woff', '.woff2'}]
    if fonts:
        errors.append('Unexpected font binaries in packet: ' + ', '.join(fonts))
    checks.append({'check': 'No font binaries distributed', 'passed': len(errors) == original_errors})

    active_names = ['ACTIVATION_AND_BASELINE.md', 'CHAPTER_BRIEF.md', 'ACCEPTANCE_TESTS.md',
                    'HANDOFF_TEMPLATE.md', 'SOURCE_NOTES.md', 'LUNA_START_PROMPT.md']
    return {
        'scope': 'DOCUMENT_PACKET_ONLY', 'chapter': 'CH-001-r1',
        'target_application_version': '0.1.0', 'baseline_revision': 'NS-0.2-draft',
        'baseline_root_sha256': expected_root, 'application_tests_run': False,
        'application_repository_inspected': False, 'live_provider_calls': 0,
        'checks': checks, 'errors': errors,
        'counts': {'gates': len(gate_ids), 'baseline_files': len(baseline['files']),
                   'active_instruction_words': sum(len((ROOT/name).read_text().split()) for name in active_names),
                   'combined_words': len(combined.split())},
    }


def main() -> int:
    report = validate()
    report['result'] = 'PASS' if not report['errors'] else 'FAIL'
    (ROOT / 'PACKET_VALIDATION.json').write_text(json.dumps(report, indent=2) + '\n')
    lines = ['# CH-001 packet validation', '', f"**Result:** {report['result']}", '',
             '**Scope:** document structure, baseline integrity, and reporting-template consistency only.', '',
             '**Application repository inspected:** no. **Application tests executed:** no. '
             '**Live/paid provider calls:** none. This is not a v0.1.0 implementation test report.', '']
    lines += [f"- {'PASS' if check['passed'] else 'FAIL'} — {check['check']}" for check in report['checks']]
    if report['errors']:
        lines += ['', '## Errors', ''] + [f'- {error}' for error in report['errors']]
    if 'counts' in report:
        lines += ['', '## Counts', '', f"Acceptance gates: {report['counts']['gates']}. "
                  f"Frozen baseline source files: {report['counts']['baseline_files']}. "
                  f"Active instruction words: {report['counts']['active_instruction_words']:,}. "
                  f"Combined reading-copy words: {report['counts']['combined_words']:,}."]
    (ROOT / 'PACKET_VALIDATION.md').write_text('\n'.join(lines) + '\n')
    print(json.dumps(report, indent=2))
    return 0 if not report['errors'] else 1

if __name__ == '__main__':
    sys.exit(main())
