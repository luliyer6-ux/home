#!/usr/bin/env python3
"""Brand mark: the L of LULIY (run by optimize-home.py after runtime-fixes.py; idempotent).

- puts site-publish/brand/mark.svg into the header link (.brand-mark); the directory copies it at runtime
- puts the shared gradients, glow filter and sheen clip (site-publish/brand/defs.svg) right after <body>,
  so the header and the directory copy can both use them without duplicate ids
- removes the old thinker gradient script and the old rule that kept the mark still
- versions the favicon links by their content
The motion (drifting leaves, sparkles, breathing light, sheen) is in home-fixes.css, block "Brand mark".
site-publish/brand/luliy-l.svg is the self-contained master (same artwork, animated) for previews and edits.
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
BRAND = ROOT / 'site-publish' / 'brand'
OLD_RULE = re.compile(r'/\* The thinker remains still; only its warm metallic fill changes\. \*/\n?'
                      r'|#header \.brand-mark svg path,#header \.brand-mark svg ellipse,\s*#directory \.directory-brand-mark svg path,'
                      r'#directory \.directory-brand-mark svg ellipse\{\s*transition:none!important;animation:none!important;filter:none!important\s*\}\n?')

def main():
    s = HTML.read_text(encoding='utf-8')
    mark = (BRAND / 'mark.svg').read_text(encoding='utf-8').strip()
    defs = (BRAND / 'defs.svg').read_text(encoding='utf-8').strip()
    new = re.sub(r'(<a class="brand-mark"[^>]*>)<svg\b.*?</svg>(</a>)', lambda m: m.group(1) + mark + m.group(2), s, count=1, flags=re.S)
    new = re.sub(r'<svg id="luliy-brand-defs".*?</svg>\n?', '', new, flags=re.S)
    new = re.sub(r'(<body[^>]*>)\n?', lambda m: m.group(1) + '\n' + defs + '\n', new, count=1)
    new = re.sub(r'<script id="thinker-brand-gradient">.*?</script>\n?', '', new, flags=re.S)
    new = OLD_RULE.sub('', new)
    v = hashlib.sha256((ROOT / 'favicon.svg').read_bytes() + (ROOT / 'favicon.ico').read_bytes()).hexdigest()[:10]
    new = re.sub(r'(/favicon\.(?:svg|ico))\?v=[^"]*', lambda m: m.group(1) + '?v=' + v, new)
    if new != s:
        HTML.write_text(new, encoding='utf-8')
        print('brand: index.html updated')
    else:
        print('brand mark already applied')

if __name__ == '__main__':
    main()
