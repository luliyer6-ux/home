#!/usr/bin/env python3
"""Small, idempotent runtime fixes for the generated homepage (performance + accessibility).

Run from the repo root (optimize-home.py calls it after design-tokens.py):
    python3 site-publish/runtime-fixes.py

Each fix is an exact text replacement searched in index.html and every cached script it
references. Already-applied fixes are skipped; a fix whose text is missing is reported
("fix skipped (not found)") so a changed source module is noticed. Changed cached files under
assets/site/ are re-hashed because they are served as immutable.
"""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'

LANG_OLD = "document.documentElement.lang=lang==='en'?'en':lang==='ja'?'ja':'zh-Hant';"
LANG_NEW = "{const v=lang==='en'?'en':lang==='ja'?'ja':'zh-Hant';if(document.documentElement.lang!==v)document.documentElement.lang=v;}"
RSS_OLD = "forEach(n=>{n.textContent=lang==='en'?'RSS Subscribe':lang==='ja'?'RSS 購読':'RSS 訂閱';});"
RSS_NEW = "forEach(n=>{const v=lang==='en'?'RSS Subscribe':lang==='ja'?'RSS 購読':'RSS 訂閱';if(n.textContent!==v)n.textContent=v;});"
MOON_OLD = ("canvas.dataset.scene=Object.keys(sceneIds).find(k=>sceneIds[k]===scene);canvas.dataset.transition=String(transition);"
            "canvas.dataset.morph=String(morph);canvas.dataset.journey=String(journey);")
MOON_NEW = ("{const ds=canvas.dataset,set=(k,v)=>{if(ds[k]!==v)ds[k]=v;};set('scene',Object.keys(sceneIds).find(k=>sceneIds[k]===scene));"
            "set('transition',String(transition));set('morph',String(morph));set('journey',String(journey));}")

# (why, old, new). Writing the same value still queues a DOM mutation record; several observers
# react to such records by writing again, which kept a page-wide update loop running every frame.
FIXES = [
    ('language sync: only write <html lang> when it changes', LANG_OLD, LANG_NEW),
    ('language sync: only write meta descriptions when they change', 'if(n)n.content=desc;', 'if(n&&n.content!==desc)n.content=desc;'),
    ('language sync: only write the RSS label when it changes', RSS_OLD, RSS_NEW),
    ('language sync: only hide #/uses links once', 'forEach(n=>{n.hidden=true;});', 'forEach(n=>{if(!n.hidden)n.hidden=true;});'),
    ('moon: only write canvas data-* state when it changes', MOON_OLD, MOON_NEW),
    ('moon: mark ready once', "drawn=now;canvas.dataset.moonReady='true';", "drawn=now;if(canvas.dataset.moonReady!=='true')canvas.dataset.moonReady='true';"),
    ('dust: only write data-dust-visible when it changes', 'canvas.dataset.dustVisible=String(fade>.005);',
     "{const v=String(fade>.005);if(canvas.dataset.dustVisible!==v)canvas.dataset.dustVisible=v;}"),
]

def h(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()[:12]

def apply(text, done):
    for i, (why, old, new) in enumerate(FIXES):
        if new in text:
            done.add(i)
        elif old in text:
            text = text.replace(old, new)
            done.add(i)
            print('fixed:', why)
    return text

def main():
    s = HTML.read_text(encoding='utf-8')
    orig, done = s, set()
    s = apply(s, done)
    for ref in sorted(set(re.findall(r'/assets/site/((?:home/[0-9a-f]+|home-cc-[0-9a-f]+)\.js)', s))):
        f = ROOT / 'assets' / 'site' / ref
        if not f.exists():
            continue
        body = f.read_text(encoding='utf-8')
        new = apply(body, done)
        if new != body:
            name = ref.split('/')[-1]
            nn = (h(new) + '.js') if ref.startswith('home/') else ('home-cc-' + h(new) + '.js')
            dest = f.with_name(nn)
            dest.write_text(new, encoding='utf-8')
            f.unlink()
            s = s.replace('/assets/site/' + ref, '/assets/site/' + str(dest.relative_to(ROOT / 'assets' / 'site')))
            print(f'{name} -> {nn}')
    for i, (why, _, _) in enumerate(FIXES):
        if i not in done:
            print('fix skipped (not found):', why, file=sys.stderr)
    if s != orig:
        HTML.write_text(s, encoding='utf-8')
        print('index.html updated')
    else:
        print('runtime fixes already applied')

if __name__ == '__main__':
    main()
