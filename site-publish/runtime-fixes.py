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

# Article-list covers: each row fetches its article page to find the first photo. Remember the answer
# per article so a return visit shows covers at once (still revalidated in the background), and let
# the browser revalidate the page (ETag) instead of always downloading it again.
COVER_OLD = ("const promise=fetch(entry.bodyUrl,{cache:'no-store',signal:AbortSignal.timeout(12000)})"
             ".then(response=>{if(!response.ok)throw Error('Article cover unavailable');return response.text();})"
             ".then(html=>{const text=summaryFromHtml(html);if(text){state.summaryCache.set(entry.id,text);"
             "try{localStorage.setItem('luliy-summary-v2:'+entry.id,text);}catch(e){}}return coverFromHtml(html,entry.url);})")
COVER_NEW = ("const coverKey='luliy-cover-v1:'+entry.bodyUrl;let stored=null;try{stored=JSON.parse(localStorage.getItem(coverKey)||'null');}catch(e){}"
             "const promise=fetch(entry.bodyUrl,{cache:'no-cache',signal:AbortSignal.timeout(12000)})"
             ".then(response=>{if(!response.ok)throw Error('Article cover unavailable');return response.text();})"
             ".then(html=>{const text=summaryFromHtml(html);if(text){state.summaryCache.set(entry.id,text);"
             "try{localStorage.setItem('luliy-summary-v2:'+entry.id,text);}catch(e){}}const src=coverFromHtml(html,entry.url);"
             "try{localStorage.setItem(coverKey,JSON.stringify({src,at:Date.now()}));}catch(e){}return src;})")
COVER_RET_OLD = "state.coverCache.set(entry.bodyUrl,{at:Date.now(),promise});return promise;"
COVER_RET_NEW = ("state.coverCache.set(entry.bodyUrl,{at:Date.now(),promise});"
                 "if(stored&&typeof stored.src==='string'&&Date.now()-stored.at<30*864e5)return Promise.resolve(stored.src);return promise;")
FIXES += [
    ('covers: revalidate article pages instead of re-downloading them', COVER_OLD, COVER_NEW),
    ('covers: show the remembered cover at once', COVER_RET_OLD, COVER_RET_NEW),
]

# Directory pictures: build them with data-src; home-fixes.js (block 6) sets src when the directory is
# about to open, so about 5 MB of PNG is no longer downloaded with every page.
FIXES += [
    ('directory: defer the shelf photo', 'shelf.src=data.collections.shelfPhotos[2];', 'shelf.dataset.src=data.collections.shelfPhotos[2];'),
    ('directory: defer the reading portraits', "reader.src='https://cloud.luliy.me/api/image?path=shared%2F'+", "reader.dataset.src='https://cloud.luliy.me/api/image?path=shared%2F'+"),
    ('directory: defer the project portrait', 'img.src=window.LULIY_DATA.scenes.sidePortrait||window.LULIY_DATA.scenes.portrait;',
     'img.dataset.src=window.LULIY_DATA.scenes.sidePortrait||window.LULIY_DATA.scenes.portrait;'),
    # Data saver: keep summaries, skip the full-size cover photos in the article list.
    ('covers: no cover photos with data saver', 'const src=await articleCover(entry);if(!live||!row.isConnected)return;',
     "const cover=await articleCover(entry),src=document.documentElement.classList.contains('luliy-save-data')?'':cover;if(!live||!row.isConnected)return;"),
]

# Study room: wait for the deferred Three.js file (phones, see split_three) before building the scene.
STUDY_THREE_OLD = "try{await pause();if(!current())return;T=window.LuliyThree||window.LuliyLoadThree();"
STUDY_THREE_NEW = ("try{await pause();if(!current())return;if(!window.LuliyLoadThree&&window.LuliyThreeReady){await window.LuliyThreeReady();"
                   "if(!current())return;}T=window.LuliyThree||window.LuliyLoadThree();")
FIXES.append(('study room: wait for deferred Three.js', STUDY_THREE_OLD, STUDY_THREE_NEW))

# Record player: on phones, wait for the deferred Three.js file before mounting (falls back to the flat
# player if it cannot load, as before).
REC_A_OLD = ("placeholder();frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{if(!alive)return;"
             "try{if(!window.LuliyRecords)throw Error('Records unavailable');")
REC_A_NEW = ("placeholder();const go=()=>{frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{if(!alive)return;"
             "try{if(!window.LuliyRecords)throw Error('Records unavailable');")
REC_B_OLD = "finally{preparing=false;el.setAttribute('aria-busy','false');}});});}"
REC_B_NEW = ("finally{preparing=false;el.setAttribute('aria-busy','false');}});});};"
             "if(!window.LuliyLoadThree&&window.LuliyThreeReady)window.LuliyThreeReady().then(go,go);else go();}")
FIXES += [('records: wait for deferred Three.js (1/2)', REC_A_OLD, REC_A_NEW),
          ('records: wait for deferred Three.js (2/2)', REC_B_OLD, REC_B_NEW)]

# Three.js (190 KB compressed) shares a blocking script with the record player, but only runs when the
# study room or a record is opened. split_three moves it to its own file. Computers still load it in
# the same blocking position; phones fetch it when such a page is opened, or once the page is idle.
THREE_HEAD = '/* Three.js r185'
THREE_TAIL = 'PCFSoftShadowMap:2};};\n'
THREE_LOADER = ("<script data-three-loader>(()=>{const src='%s';"
    "const phone=matchMedia('(pointer: coarse)').matches&&Math.min(screen.width,screen.height)<600;"
    "if(!phone){document.write('<script src=\"'+src+'\"><\\/script>');return;}"
    "let pending=null;"
    "const load=window.LuliyThreeReady=()=>window.LuliyLoadThree?Promise.resolve():pending||(pending=new Promise((ok,fail)=>{"
    "const s=document.createElement('script');s.src=src;s.onload=()=>ok();"
    "s.onerror=()=>{pending=null;s.remove();fail(Error('Three.js unavailable'));};document.head.append(s);}));"
    "const quiet=()=>load().catch(()=>{});"
    "const soon=()=>{if(/^#\\/(study|records?)\\b/.test(location.hash))quiet();};addEventListener('hashchange',soon);soon();"
    "const c=navigator.connection;if(c&&(c.saveData||/2g/.test(c.effectiveType||'')))return;"
    "addEventListener('load',()=>setTimeout(()=>window.requestIdleCallback?requestIdleCallback(quiet,{timeout:4000}):quiet(),2500),{once:true});"
    "})();</script>")

def split_three(s):
    if 'data-three-loader' in s:
        return s
    for ref in re.findall(r'<script src="/assets/site/(home/[0-9a-f]+\.js)"></script>', s):
        f = ROOT / 'assets' / 'site' / ref
        if not f.exists():
            continue
        body = f.read_text(encoding='utf-8')
        if not body.startswith(THREE_HEAD) or THREE_TAIL not in body:
            continue
        cut = body.index(THREE_TAIL) + len(THREE_TAIL)
        three, rest = body[:cut], body[cut:]
        three_f = f.with_name(h(three) + '.js')
        rest_f = f.with_name(h(rest) + '.js')
        three_f.write_text(three, encoding='utf-8')
        rest_f.write_text(rest, encoding='utf-8')
        f.unlink()
        three_src = '/assets/site/home/' + three_f.name
        old_tag = '<script src="/assets/site/' + ref + '"></script>'
        new_tag = THREE_LOADER % three_src + '<script src="/assets/site/home/' + rest_f.name + '"></script>'
        print(f'three.js split: {f.name} -> {three_f.name} (deferred on phones) + {rest_f.name}')
        return s.replace(old_tag, new_tag)
    print('three.js split skipped (bundle not found)', file=sys.stderr)
    return s

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
    s = split_three(s)
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
