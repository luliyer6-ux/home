#!/usr/bin/env python3
"""Post-process the generated homepage (index.html) for faster loading.

Run after every rebuild of index.html, before publishing:
    python3 site-publish/optimize-home.py

What it does (idempotent, safe to re-run):
  1. Applies small text/conversion fixes (see PATCHES).
  2. Injects site-publish/home-fixes.css / home-fixes.js (layout fixes).
  3. Moves large inline <body> scripts and the main <style> block into content-hashed files under
     assets/site/home/ so browsers can cache them for a year (see _headers).
     Execution order is preserved: inline blocks become synchronous
     <script src> / <link rel=stylesheet> at the same position.
  4. Runs site-publish/design-tokens.py (single source for theme colours and motion).
"""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
OUT = ROOT / 'assets' / 'site' / 'home'
MIN_SCRIPT = 4000      # inline scripts larger than this are externalised
MIN_STYLE = 20000      # inline styles larger than this are externalised

# (description, old, new) — applied once; skipped if old is absent.
PATCHES = [
    ('簡轉繁：钟 → 鐘（時鐘、靜鐘），鍾 僅用於鍾情等詞',
     '"钟":"鍾"', '"钟":"鐘"'),
    ('簡轉繁：補上 着 → 著（活著）',
     '"后":"後"', '"后":"後","着":"著"'),
    ('簡轉繁：常見詞組修正（詞彙、乾淨、鍾情）',
     "const convertTraditional=s=>Array.from(s,c=>map[c]||c).join('');",
     "const phraseFixes=[['詞匯','詞彙'],['字匯','字彙'],['語匯','語彙'],['幹淨','乾淨'],['幹燥','乾燥'],['餅幹','餅乾'],['鐘情','鍾情'],['鐘愛','鍾愛']];"
     "const convertTraditional=s=>{let v=Array.from(s,c=>map[c]||c).join('');for(const [a,b] of phraseFixes)if(v.includes(a))v=v.split(a).join(b);return v;};"),
]

def h(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()[:12]

def main():
    s = HTML.read_text(encoding='utf-8')
    before = len(s.encode('utf-8'))
    processed = '/assets/site/home/' in s
    for desc, old, new in PATCHES:
        if new in s:
            continue
        if old in s:
            s = s.replace(old, new, 1)
            print('patch:', desc)
        elif not processed:
            print('patch skipped (not found):', desc, file=sys.stderr)

    # Bust the cache of intro/intro.js whenever its content changes.
    intro = ROOT / 'intro' / 'intro.js'
    if intro.exists():
        s = re.sub(r'(src="intro/intro\.js)\?v=[^"]*"', lambda m: m.group(1) + '?v=' + h(intro.read_text(encoding='utf-8'))[:10] + '"', s, count=1)

    # Layout fixes: CSS right before </head>, JS (deferred) right before </body>.
    s = re.sub(r'<link[^>]*data-home-fixes[^>]*>|<script[^>]*data-home-fixes[^>]*></script>', '', s)
    for name, tag, anchor in [
        ('home-fixes.css', '<link rel="stylesheet" href="/site-publish/home-fixes.css?v={v}" data-home-fixes>', '</head>'),
        ('home-fixes.js', '<script src="/site-publish/home-fixes.js?v={v}" defer data-home-fixes></script>', '</body>'),
    ]:
        f = ROOT / 'site-publish' / name
        if f.exists():
            v = h(f.read_text(encoding='utf-8'))[:8]
            i = s.rfind(anchor)
            s = s[:i] + tag.format(v=v) + s[i:]

    OUT.mkdir(parents=True, exist_ok=True)
    used = set()

    def ext_script(m):
        attrs, body = m.group(1), m.group(2)
        if 'src=' in attrs or len(body) < MIN_SCRIPT or 'type=' in attrs:
            return m.group(0)
        name = f'{h(body)}.js'
        (OUT / name).write_text(body, encoding='utf-8'); used.add(name)
        return f'<script{attrs} src="/assets/site/home/{name}"></script>'

    def ext_style(m):
        attrs, body = m.group(1), m.group(2)
        if len(body) < MIN_STYLE or 'media=' in attrs:
            return m.group(0)
        # Relative url(assets/...) must become root-relative once the CSS moves.
        body = re.sub(r"url\(\s*(['\"]?)(?!['\"]|data:|https?:|/|#)", r"url(\1/", body)
        name = f'{h(body)}.css'
        (OUT / name).write_text(body, encoding='utf-8'); used.add(name)
        return f'<link rel="stylesheet"{attrs} href="/assets/site/home/{name}">'

    # Head scripts stay inline (small, and external ones would block first paint).
    b = s.find('<body')
    s = s[:b] + re.sub(r'<script([^>]*)>(.*?)</script>', ext_script, s[b:], flags=re.S)
    s = re.sub(r'<style([^>]*)>(.*?)</style>', ext_style, s, flags=re.S)

    # Remove stale generated files from previous runs (keep everything still referenced).
    used |= set(re.findall(r'/assets/site/home/([0-9a-f]+\.(?:js|css))', s))
    for f in OUT.iterdir():
        if f.name not in used:
            f.unlink()
    HTML.write_text(s, encoding='utf-8')
    after = len(s.encode('utf-8'))
    print(f'index.html: {before/1024:.0f} KB -> {after/1024:.0f} KB; {len(used)} cached files in assets/site/home/' + (' (already optimized)' if processed else ''))

if __name__ == '__main__':
    main()
    # Design tokens: rewrite retired colour/motion variables and inject site-publish/design-tokens.css.
    import importlib.util; sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location('design_tokens', ROOT / 'site-publish' / 'design-tokens.py')
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); mod.main()
