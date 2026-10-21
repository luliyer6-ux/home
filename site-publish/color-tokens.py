#!/usr/bin/env python3
"""Apply the LULIY colour tokens (site-publish/color-tokens.css) to the published homepage.

Run from the repo root (optimize-home.py also calls it at the end):
    python3 site-publish/color-tokens.py

Idempotent. It:
  1. Rewrites uses of retired colour variables to the ten tokens (see RENAME).
  2. Deletes every other definition of those variables, so color-tokens.css is the only source.
  3. Injects color-tokens.css into <head> as <style id="color-tokens">.
  4. Re-hashes changed files under assets/site/home/ (they are cached as immutable).
"""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
TOKENS = ROOT / 'site-publish' / 'color-tokens.css'
EXTRA = [ROOT / 'reading-timeline.css', ROOT / 'site-publish' / 'home-fixes.css']

CORE = ['bg', 'paper', 'raised', 'ink', 'text', 'muted', 'line', 'line-strong', 'accent', 'focus-ring']
RENAME = {
    'gold': 'accent', 'reading-accent': 'accent', 'rt-accent': 'accent',
    'surface-base': 'bg', 'surface-raised': 'paper', 'surface-overlay': 'raised',
    'text-primary': 'ink', 'text-body': 'text', 'text-muted': 'muted', 'reader-heading-color': 'ink',
    'border-subtle': 'line', 'border-active': 'line-strong', 'control-line': 'line-strong',
    'lr-paper': 'bg', 'lr-soft': 'paper', 'lr-ink': 'ink', 'lr-muted': 'muted', 'lr-line': 'line', 'lr-accent': 'accent',
    'ld-bg': 'bg', 'ld-surface': 'paper', 'ld-raised': 'raised', 'ld-border': 'line',
    'ld-muted': 'muted', 'ld-ink': 'ink', 'ld-accent': 'accent', 'ld-focus': 'focus-ring',
    'sp-line': 'line', 'sp-accent': 'accent', 'sp-muted': 'muted',
}
# --reader-body-color stays: reader settings set it inline on <html>. Only its stylesheet defaults go.
DROP = set(CORE) | set(RENAME) | {'reader-body-color'}
NAME = r'(?![\w-])'

def h(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()[:12]

def rename_uses(css):
    for old, new in RENAME.items():
        css = re.sub(r'var\(\s*--' + re.escape(old) + NAME, 'var(--' + new, css)
    return re.sub(r'var\(\s*--reader-body-color\s*(?:,[^()]*)?\)', 'var(--reader-body-color,var(--text))', css)

def drop_defs(css):
    names = '|'.join(sorted(map(re.escape, DROP), key=len, reverse=True))
    css = re.sub(r'(?<![\w-])--(?:' + names + r')' + NAME + r'\s*:[^;{}]*(?:;|(?=\s*\}))', '', css)
    # Remove rules (and then @-blocks) left empty.
    for _ in range(3):
        css = re.sub(r'(^|[{};]|\*/)\s*[^{};@/]*[^{};@\s/]\s*\{\s*\}', r'\1', css)
        css = re.sub(r'@(?:media|supports)[^{};]*\{\s*\}', '', css)
    return re.sub(r'\n[ \t]+(?=\n)', '', css)

TIDY = [
    (r'var\(--([\w-]+),\s*var\(--\1\)\)', r'var(--\1)'),
    (r'linear-gradient\(90deg,var\(--accent\),var\(--accent\),var\(--accent\)\)', 'var(--accent)'),
]

def tidy(css):
    for a, b in TIDY:
        css = re.sub(a, b, css)
    return css

def migrate(css):
    return tidy(drop_defs(rename_uses(css)))

def main():
    s = HTML.read_text(encoding='utf-8')
    orig = s
    tokens = TOKENS.read_text(encoding='utf-8').strip()
    s = re.sub(r'<style id="color-tokens">.*?</style>\n?', '', s, flags=re.S)
    # Inline <style> blocks.
    s = re.sub(r'(<style[^>]*>)(.*?)(</style>)', lambda m: m.group(1) + migrate(m.group(2)) + m.group(3), s, flags=re.S)
    # var() inside inline style attributes / scripts.
    s = tidy(rename_uses(s))
    # External cached CSS: rewrite, re-hash, update references.
    out = ROOT / 'assets' / 'site' / 'home'
    for name in sorted(set(re.findall(r'/assets/site/home/([0-9a-f]+\.css)', s))):
        f = out / name
        body = f.read_text(encoding='utf-8')
        new = migrate(body)
        if new != body:
            nn = h(new) + '.css'
            (out / nn).write_text(new, encoding='utf-8')
            f.unlink()
            s = s.replace('/assets/site/home/' + name, '/assets/site/home/' + nn)
            print(f'{name} -> {nn}')
    for f in EXTRA:
        if f.exists():
            body = f.read_text(encoding='utf-8')
            new = migrate(body)
            if new != body:
                f.write_text(new, encoding='utf-8')
                print('migrated', f.relative_to(ROOT))
    # Inject tokens right after the main stylesheet (or before </head>).
    tag = '<style id="color-tokens">' + tokens + '</style>\n'
    m = re.search(r'<link[^>]*id="site-styles"[^>]*>\n?', s)
    i = m.end() if m else s.find('</head>')
    s = s[:i] + tag + s[i:]
    # Bust ?v= of the repo-owned stylesheets.
    for f in EXTRA:
        rel = str(f.relative_to(ROOT))
        if f.exists():
            s = re.sub(r'(/' + re.escape(rel) + r')\?v=[^"]*"', lambda m: m.group(1) + '?v=' + h(f.read_text(encoding='utf-8'))[:8] + '"', s)
    if s != orig:
        HTML.write_text(s, encoding='utf-8')
        print('index.html updated')
    else:
        print('colour tokens already applied')

if __name__ == '__main__':
    main()
