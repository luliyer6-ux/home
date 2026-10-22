#!/usr/bin/env python3
"""Add to Home Screen + offline reading (run by optimize-home.py after runtime-fixes.py; idempotent).

- copies site-publish/sw.js -> /sw.js (a service worker must sit at the root to cover the whole site)
- copies site-publish/pwa/manifest.webmanifest -> /manifest.webmanifest
- puts the manifest, the iOS home-screen icon and title into <head> of index.html (after the viewport tag)
home-fixes.js (block 8) registers /sw.js after the page has loaded.
"""
import pathlib, re, shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
SRC = ROOT / 'site-publish'
TAGS = ('<link rel="manifest" href="/manifest.webmanifest" data-pwa>'
        '<link rel="apple-touch-icon" href="/site-publish/pwa/apple-touch-icon.png" data-pwa>'
        '<meta name="apple-mobile-web-app-title" content="Luliy" data-pwa>')

def copy(src, dest):
    if not dest.exists() or dest.read_bytes() != src.read_bytes():
        shutil.copyfile(src, dest)
        print('pwa: wrote', dest.name)

def main():
    copy(SRC / 'sw.js', ROOT / 'sw.js')
    copy(SRC / 'pwa' / 'manifest.webmanifest', ROOT / 'manifest.webmanifest')
    s = HTML.read_text(encoding='utf-8')
    # Anchor right after the viewport tag, so optimize-home.py moving its own tags never reorders these.
    new = re.sub(r'<(?:link|meta)[^>]*\sdata-pwa>', '', s)
    new = re.sub(r'(<meta name="viewport"[^>]*>)', lambda m: m.group(1) + TAGS, new, count=1)
    if new != s:
        HTML.write_text(new, encoding='utf-8')
        print('pwa: index.html head updated')
    else:
        print('pwa already applied')

if __name__ == '__main__':
    main()
