#!/usr/bin/env python3
"""Apply the LULIY design tokens (site-publish/design-tokens.css) to the published homepage.

Run from the repo root (optimize-home.py also calls it at the end):
    python3 site-publish/design-tokens.py

Idempotent. It:
  1. Rewrites uses of retired colour / motion variables to the tokens (see RENAME).
  2. Deletes every other definition of those variables, so design-tokens.css is the only source.
  3. Motion: maps every cubic-bezier and the ease keywords to three curves, and snaps
     transition durations to 200 / 400 / 800 ms (delays and keyframe durations are kept;
     anything over 1100 ms is treated as choreography and kept). JS Web-Animation easings follow.
  4. Injects design-tokens.css into <head> as <style id="design-tokens">.
  5. Re-hashes changed files under assets/site/home/ (they are cached as immutable).
"""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
TOKENS = ROOT / 'site-publish' / 'design-tokens.css'
EXTRA = [ROOT / 'reading-timeline.css', ROOT / 'site-publish' / 'home-fixes.css']

CORE = ['bg', 'paper', 'raised', 'ink', 'text', 'muted', 'line', 'line-strong', 'accent', 'focus-ring']
RENAME = {
    'gold': 'accent', 'reading-accent': 'accent', 'rt-accent': 'accent',
    'surface-base': 'bg', 'surface-raised': 'paper', 'surface-overlay': 'raised',
    'text-primary': 'ink', 'text-body': 'text', 'text-muted': 'muted', 'reader-heading-color': 'ink',
    'border-subtle': 'line', 'border-active': 'line-strong', 'control-line': 'line-strong',
    'lr-paper': 'bg', 'lr-soft': 'paper', 'lr-ink': 'ink', 'lr-muted': 'muted', 'lr-line': 'line-strong', 'lr-accent': 'accent',
    'ld-bg': 'bg', 'ld-surface': 'paper', 'ld-raised': 'raised', 'ld-border': 'line',
    'ld-muted': 'muted', 'ld-ink': 'ink', 'ld-accent': 'accent', 'ld-focus': 'focus-ring',
    'sp-line': 'line', 'sp-accent': 'accent', 'sp-muted': 'muted',
    # motion
    'ease-out': 'ease', 'ease-settle': 'ease', 'ease-spring': 'ease', 'luliy-ui-ease': 'ease',
    'ui-ease': 'ease', 'ui-drawer': 'ease',
    'dur-instant': 'dur-fast', 'luliy-ui-time': 'dur-fast', 'ui-fast': 'dur-fast', 'ui-enter': 'dur-fast',
    'ui-exit': 'dur-fast', 't-ui': 'dur-fast', 'luliy-panel-time': 'dur-base',
}
MOTION = ['ease', 'ease-soft', 'ease-in-out', 'dur-fast', 'dur-base', 'dur-slow']
CURVES = {
    'ease': ['.19,1,.22,1', '.22,1,.36,1', '.22,.72,.2,1', '.2,.8,.2,1', '.2,.7,.3,1', '.16,1,.3,1',
             '.22,.75,.25,1', '.2,.7,.2,1', '.23,1,.32,1', '.32,.72,0,1', '.34,1.56,.64,1'],
    'ease-soft': ['.22,.61,.36,1'],
    'ease-in-out': ['.65,0,.35,1', '.4,0,.2,1', '.3,0,.2,1', '.4,0,1,1'],
}
CURVE_OF = {c: k for k, cs in CURVES.items() for c in cs}
LITERAL = {'ease': '.19,1,.22,1', 'ease-soft': '.22,.61,.36,1', 'ease-in-out': '.65,0,.35,1'}
# --reader-body-color stays: reader settings set it inline on <html>. Only its stylesheet defaults go.
DROP = set(CORE) | set(MOTION) | set(RENAME) | {'reader-body-color'}
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
    # Leftover terracotta UI accents (current record, article mode tabs, study panels) -> the one accent.
    (r'(\.lr-record\[aria-current=true\] \.lr-cover\{outline:1px solid )#c66d50', r'\1var(--accent)'),
    (r'(\.lr-record\[aria-current=true\] \.lr-record-name\{color:)#(?:e49a7e|9e4d32)', r'\1var(--accent)'),
    (r'(\.article-modes a\[aria-current\]:after\{[^}]*background:)#c77c55', r'\1var(--accent)'),
    (r'(\.article-modes a:focus-visible,\.chronicle-status button:focus-visible\{outline:1px solid )#c77c55', r'\1var(--focus-ring)'),
    (r'#c5755115', 'color-mix(in srgb,var(--accent) 8%,transparent)'),
    (r'#c5755117', 'color-mix(in srgb,var(--accent) 9%,transparent)'),
    (r'#98482b0d', 'color-mix(in srgb,var(--accent) 5%,transparent)'),
]

def tidy(css):
    for a, b in TIDY:
        css = re.sub(a, b, css)
    return css

def curve(m):
    k = CURVE_OF.get(re.sub(r'\s|(?<![\d])0(?=\.)', '', m.group(1)))
    return f'var(--{k})' if k else m.group(0)

def snap(ms):
    if ms <= 0 or ms > 1100:
        return None
    return 'var(--dur-fast)' if ms < 283 else 'var(--dur-base)' if ms < 566 else 'var(--dur-slow)'

TIME = r'(?<![\w.-])(\d*\.?\d+)(ms|s)(?![\w-])'

def split_top(v):
    out, depth, cur = [], 0, ''
    for ch in v:
        depth += ch == '('; depth -= ch == ')'
        if ch == ',' and depth == 0:
            out.append(cur); cur = ''
        else:
            cur += ch
    return out + [cur]

def split_ws(v):
    out, depth, cur = [], 0, ''
    for ch in v:
        depth += ch == '('; depth -= ch == ')'
        if ch.isspace() and depth == 0:
            if cur: out.append(cur)
            cur = ''
        else:
            cur += ch
    return out + ([cur] if cur else [])

def snap_item(it):
    """The first time value of a transition item is its duration; later ones are delays."""
    lead = it[:len(it) - len(it.lstrip())]
    toks = split_ws(it)
    for i, t in enumerate(toks):
        if re.fullmatch(r'var\(--[\w-]*(?:dur|duration|time|fast|slow)[\w-]*\)|calc\(.*\)', t):
            break
        m = re.fullmatch(TIME, t)
        if m:
            r = snap(float(m.group(1)) * (1 if m.group(2) == 'ms' else 1000))
            if r:
                toks[i] = r
            break
    return lead + ' '.join(toks)

def motion_value(prop, v):
    v = re.sub(r'cubic-bezier\(([^)]*)\)', curve, v)
    v = re.sub(r'(?<![\w-])(ease-in-out)(?![\w-])', 'var(--ease-in-out)', v)
    v = re.sub(r'(?<![\w(-])(ease|ease-out)(?![\w-])', 'var(--ease-soft)', v)
    if prop in ('transition', 'transition-duration'):
        imp = re.search(r'\s*!important\s*$', v)
        core = v[:imp.start()] if imp else v
        trail = core[len(core.rstrip()):]
        core = ','.join(snap_item(it) for it in split_top(core.rstrip()))
        v = core + trail + (imp.group(0) if imp else '')
    return v

def motion(css):
    css = re.sub(r'(?<![\w-])(transition|transition-duration|transition-timing-function|animation|animation-timing-function)(\s*:\s*)([^;{}]+)',
                 lambda m: m.group(1) + m.group(2) + motion_value(m.group(1), m.group(3)), css)
    return re.sub(r'cubic-bezier\(([^)]*)\)', curve, css)

def motion_js(js):
    """Web Animations API easings cannot use var(); write the token's literal curve."""
    def f(m):
        c = re.sub(r'\s', '', m.group(1))
        k = CURVE_OF.get(c[len('cubic-bezier('):-1]) if c.startswith('cubic-bezier(') else (
            'ease-soft' if c in ('ease', 'ease-out') else 'ease-in-out' if c == 'ease-in-out' else None)
        return f"easing:'cubic-bezier({LITERAL[k]})'" if k else m.group(0)
    return re.sub(r"easing:'([^']*)'", f, js)

def migrate(css):
    return motion(tidy(drop_defs(rename_uses(css))))

def main():
    s = HTML.read_text(encoding='utf-8')
    orig = s
    tokens = TOKENS.read_text(encoding='utf-8').strip()
    s = re.sub(r'<style id="(?:color|design)-tokens">.*?</style>\n?', '', s, flags=re.S)
    # Inline <style> blocks.
    s = re.sub(r'(<style[^>]*>)(.*?)(</style>)', lambda m: m.group(1) + migrate(m.group(2)) + m.group(3), s, flags=re.S)
    # var() inside inline style attributes / scripts.
    s = motion_js(tidy(rename_uses(s)))
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
    for name in sorted(set(re.findall(r'/assets/site/home/([0-9a-f]+\.js)', s))):
        f = out / name
        body = f.read_text(encoding='utf-8')
        new = motion_js(body)
        if new != body:
            nn = h(new) + '.js'
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
    tag = '<style id="design-tokens">' + tokens + '</style>\n'
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
        print('design tokens already applied')

if __name__ == '__main__':
    main()
