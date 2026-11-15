// Browser smoke test for luliy.me, run by .github/workflows/check.yml after check_site.py.
// Serves the repository on a local port, opens each page in Chromium and fails on an uncaught
// script error (a broken home-fixes.js or work page shows up here). Failed network requests are
// not counted: the blog, Drive and GitHub content come from other sites and may be unreachable.
//
// Usage: node .github/scripts/smoke_test.mjs      (needs the playwright package and Chromium)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');

const PAGES = [
  '/?intro=0&loader=0',
  '/?intro=0&loader=0#/posts',
  '/?intro=0&loader=0#/projects',
  '/404.html',
  '/add/',
  '/study/',
  '/works/gpt-english-2-exams.html',
  '/works/hydraulic-pneumatic-review.html',
  '/works/kaoyan-dashboard/',
  '/works/math2/',
  '/works/math-handbook/',
  '/works/408/',
  '/works/jingzhong/',
  '/works/dianous/',
];

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) throw new Error('outside');
    let s = await stat(file).catch(() => null);
    if (s && s.isDirectory()) { file = join(file, 'index.html'); s = await stat(file).catch(() => null); }
    if (!s && !extname(file)) { file += '.html'; s = await stat(file).catch(() => null); }
    if (!s) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(400); res.end(); }
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let failed = 0;
for (const path of PAGES) {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e && e.message || e).split('\n')[0]));
    try {
      const response = await page.goto(base + path, { waitUntil: 'load', timeout: 45000 });
      if (!response || response.status() >= 400) errors.push(`HTTP ${response && response.status()}`);
      await page.waitForTimeout(2500); // let deferred and async scripts run
    } catch (e) {
      errors.push(`did not load: ${String(e.message).split('\n')[0]}`);
    }
    const label = `${path} @ ${viewport.width}px`;
    if (errors.length) {
      failed++;
      console.log(`FAIL ${label}`);
      for (const e of [...new Set(errors)]) console.log(`     ${e}`);
      if (process.env.GITHUB_ACTIONS) console.log(`::error::${label}: ${errors[0]}`);
    } else {
      console.log(`ok   ${label}`);
    }
    await context.close();
  }
}
await browser.close();
server.close();
if (failed) { console.log(`\n${failed} page view(s) with script errors`); process.exit(1); }
console.log('\nall pages loaded without script errors');
