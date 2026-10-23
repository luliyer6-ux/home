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
FIXES += [
    ('footer: portrait waits until the reader nears the footer on touch screens', 'footerImage.src=next;}',
     "(window.LuliyFooterSrc||function(i,s){i.src=s})(footerImage,next);}"),
    ('footer: left art waits too', '<img class="footer-left-art" src="', '<img class="footer-left-art" data-src="'),
]
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
# The study room lives at #/books and the record player at #/music (the old #/study and #/records names are kept).
THREE_ROUTES_OLD = "/^#\\/(study|records?)\\b/"
THREE_ROUTES_NEW = "/^#\\/(books|music|study|records?)\\b/"
FIXES.append(('three.js: start loading on the real study and record routes',
              "const soon=()=>{if(" + THREE_ROUTES_OLD + ".test(location.hash))", "const soon=()=>{if(" + THREE_ROUTES_NEW + ".test(location.hash))"))
# CC on touch screens: a fixed sky layer clipped to the page (home-fixes.css), since iOS ignores background-attachment: fixed.
# The directory's preview and arrow-key code count only the five scene links (earlier extra links in #directoryLinks were skipped this way).
FIXES.append(('directory: preview only the scene links', "links=$$('#directoryLinks a');", "links=$$('#directoryLinks a[data-scene]');"))
FIXES.append(('cc: sky layer for touch screens', '<div class="page-above"><main id="main"',
              '<div class="page-above"><div class="luliy-sky" aria-hidden="true"><i></i></div><main id="main"'))

# CC opening (moon -> study): the timeline ran over 7.2 screens, and the moon never faded (see home-fixes.css), so the
# middle 1.5 screens showed nothing new. home-fixes.css shortens the section; these new stops keep every step but close
# the gaps: the signature fades, the moon gives way while the study fades in, then 書房 and its story arrive.
CC_STEPS = [
    ('signature', "const intro=1-smooth(.20,.38,p);", "const intro=1-smooth(.06,.26,p);"),
    ('moon', "String(1-smooth(.48,.68,p))", "String(1-smooth(.22,.48,p))"),
    ('study', "const room=smooth(.60,.90,p),mobile=innerWidth<=700;", "const room=smooth(.30,.66,p),mobile=innerWidth<=700;"),
    ('study prepare', "if(p>.35&&rect.top<innerHeight&&rect.bottom>0)homeStudy.prepare();",
     "if(p>.12&&rect.top<innerHeight&&rect.bottom>0)homeStudy.prepare();"),
    ('story', "const end=smooth(.88,1,p);", "const end=smooth(.62,.84,p);"),
    ('header', "shelfBackdrop.style.opacity=end*.24;\n  const header=document.querySelector('#header');header.classList.toggle('is-scrolled',p>.8);",
     "shelfBackdrop.style.opacity=end*.24;\n  const header=document.querySelector('#header');header.classList.toggle('is-scrolled',p>.6);"),
]
FIXES += [('cc opening: tighter timeline (' + k + ')', a, b) for k, a, b in CC_STEPS]

# Theme picker (home-fixes.js block 14): the directory's theme button opens it instead of cycling dark -> light -> cc,
# and the page's own switch (which also re-themes the moon, study and footer scenes) can be asked for one appearance.
THEME_OLD = ("function changeTheme(){const r=document.documentElement,choices=['dark','light','cc'],"
             "next=choices[(choices.indexOf(r.dataset.appearance||'dark')+1)%choices.length];")
THEME_NEW = ("window.LuliySetAppearance=a=>changeTheme(a);function changeTheme(to){const r=document.documentElement,choices=['dark','light','cc'],"
             "next=choices.includes(to)?to:choices[(choices.indexOf(r.dataset.appearance||'dark')+1)%choices.length];")
FIXES += [
    ('theme: the page switch can set one appearance', THEME_OLD, THEME_NEW),
    ('theme: the theme button opens the picker',
     "if(e.target.closest('button[data-theme]')){changeTheme();return;}",
     "if(e.target.closest('button[data-theme]')){if(window.LuliyThemePicker)window.LuliyThemePicker(e.target.closest('button[data-theme]'));else changeTheme();return;}"),
]

# Mainland China: the footer and directory portraits live on raw.githubusercontent.com, which is often blocked there.
# They load through this site's GitHub relay instead (functions/gh/, README 9.4); home-early.js falls back to GitHub
# if the relay cannot deliver one.
FIXES.append(('china: portraits through the GitHub relay', 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/static/img/',
              '/gh/raw/static/img/'))

# CC wrote text in letter by letter (dim -> bright) as it scrolled into view. Text now stays fully lit on every
# page. CC_WORDS_V1 is the earlier writing-section-only version, upgraded in place in already-patched files.
CC_WORDS_OLD = "function words(){if(!cc()||reduce.matches)return;"
CC_WORDS_V1 = "function words(){if(!cc()||reduce.matches||/^#\\/(posts?|article)(\\/|\\?|$)/.test(location.hash))return;"
CC_WORDS_NEW = "function words(){return;if(!cc()||reduce.matches)return;"
FIXES += [
    ('cc: text stays lit (no letter-by-letter reveal)', CC_WORDS_OLD, CC_WORDS_NEW),
    ('cc: text stays lit everywhere (was: writing section only)', CC_WORDS_V1, CC_WORDS_NEW),
]

# Directory: the About portrait is a cut-out of the same photo (transparent background, grey, 710x960), so each
# appearance shows its own colour behind it instead of a black box. The old black-backed PNG stays for the intro.
FIXES.append(('directory: transparent About portrait', "$('#directoryPortrait').src='assets/site/51d8aa192fa1e25ebfc8.png'",
              "$('#directoryPortrait').src='assets/site/813c3f14546d3ff6cdb6.webp'"))

# Directory: the Works preview lists only the four newest works (the list grew upward over the WORKS title).
# New works are appended to the end of the list, so the newest come first here.
FIXES.append(('directory: Works preview shows the four newest', "$('.preview-project-list').innerHTML=projects.map(p=>esc(p[0])).join('<br>')",
              "$('.preview-project-list').innerHTML=projects.slice(-4).reverse().map(p=>esc(p[0])).join('<br>')"))

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
    "const soon=()=>{if(" + THREE_ROUTES_NEW + ".test(location.hash))quiet();};addEventListener('hashchange',soon);soon();"
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
    s = apply(split_three(s), done)
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
