#!/usr/bin/env python3
"""Build the transfer copy from the modular chapter; does not build the application."""
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
PARTS = [
    ('ACTIVATION_AND_BASELINE.md', 'part-activation', 'Activation and exact baseline'),
    ('CHAPTER_BRIEF.md', 'part-brief', 'Implementation assignment'),
    ('ACCEPTANCE_TESTS.md', 'part-acceptance', 'Acceptance gates and evidence'),
    ('HANDOFF_TEMPLATE.md', 'part-handoff', 'Required Luna handoff'),
    ('SOURCE_NOTES.md', 'part-sources', 'Technical references'),
    ('LUNA_START_PROMPT.md', 'part-prompt', 'Dispatch prompt'),
    ('reference/north-star/NORTH_STAR.md', 'part-baseline', 'Historical North Star root'),
]
LINKS = {path: anchor for path, anchor, _ in PARTS}
LINKS['NORTH_STAR.md'] = 'part-baseline'
LINK_PATTERN = re.compile(r'(?<!!)\[([^\]\n]+)\]\(([^)\n]+)\)')


def adapt_links(text: str, source: str) -> str:
    def replace(match: re.Match[str]) -> str:
        label, target = match.groups()
        if target.startswith(('https://', 'http://', 'mailto:', '#')):
            return match.group(0)
        path = target.split('#', 1)[0]
        anchor = LINKS.get(path) or LINKS.get(Path(path).name)
        if anchor:
            return f'[{label}](#{anchor})'
        full_path = f'reference/north-star/{path}' if source.startswith('reference/') else path
        return f'{label} (`{full_path}`, in the full ZIP packet)'
    return LINK_PATTERN.sub(replace, text)


def main() -> None:
    baseline = ROOT / 'reference/north-star/NORTH_STAR.md'
    sha = hashlib.sha256(baseline.read_bytes()).hexdigest()
    lines = [
        '# Luna implementation assignment — CH-001 / v0.1.0', '',
        '**Prepared:** September 10, 2026  ',
        '**Target:** the first working manual-slideshow checkpoint, not the full v1.0 product.  ',
        '**Effort:** select MAX / the highest available setting in the Luna interface.  ',
        '**Application implementation/tests in this deliverable:** none; this is the assignment to execute.', '',
        'This single file contains the operative chapter, finite acceptance contract, handoff, technical references, and baseline North Star root. The companion ZIP adds the full specialist North Star documents, hashes, and reporting templates. The current chapter is executable from the detailed contracts here; do not invent missing repository files or pretend the full historical snapshot was imported when only this file was provided.', '',
        'Relative links have been adapted for single-file reading. The baseline fingerprint below identifies the original frozen file in the ZIP, not this generated edition or its adapted links.', '',
        f'**Original NS-0.2 root SHA-256:** `{sha}`', '',
        '## Contents', '',
    ]
    lines += [f'{index}. [{title}](#{anchor})' for index, (_, anchor, title) in enumerate(PARTS, 1)]
    for source, anchor, title in PARTS:
        lines += ['', '---', '', f'<a id="{anchor}"></a>', '']
        if source.startswith('reference/'):
            lines += [
                '> Historical baseline appendix. Its pending/planning labels describe the earlier snapshot. Part 1 records the subsequent CH-001 dispatch authority; Part 2 selects the manual v0.1.0 subset. This appendix is not permission to implement the rest of the roadmap.', '',
            ]
        lines.append(adapt_links((ROOT / source).read_text(), source))
    (ROOT / 'LUNA_CH001_v0.1.0_COMPLETE.md').write_text('\n'.join(lines).rstrip() + '\n')

if __name__ == '__main__':
    main()
