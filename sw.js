/* LULIY service worker: offline reading, nothing else. Source: site-publish/sw.js (copied to /sw.js by pwa.py).
   - The home page: network first, the last good copy when offline.
   - /assets/site/* (content-hashed, immutable): cache first.
   - Article list and article pages from the blog repository: network first, cached copy when offline.
   - Everything else (Drive, sign-in, GitHub API, images from other sites, video, any non-GET) is not touched.
   To retire it, replace this file with one that calls self.registration.unregister(). */
const VERSION = 'v1';
const SHELL = 'luliy-shell-' + VERSION, ASSETS = 'luliy-assets-' + VERSION, ARTICLES = 'luliy-articles-' + VERSION;
const LIMITS = { [ASSETS]: 400, [ARTICLES]: 80 };
const ARTICLE_SOURCE = 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL, ASSETS, ARTICLES]);
    for (const key of await caches.keys()) if (key.startsWith('luliy-') && !keep.has(key)) await caches.delete(key);
    await self.clients.claim();
  })());
});

const trim = async name => {
  const limit = LIMITS[name];
  if (!limit) return;
  const cache = await caches.open(name), keys = await cache.keys();
  for (let i = 0; i < keys.length - limit; i++) await cache.delete(keys[i]);
};
const store = (name, key, response) => {
  if (!response || !response.ok || response.type === 'opaque') return;
  const copy = response.clone();
  caches.open(name).then(cache => cache.put(key, copy)).then(() => trim(name)).catch(() => {});
};
const networkFirst = async (request, name, key = request) => {
  try {
    const response = await fetch(request);
    store(name, key, response);
    return response;
  } catch (error) {
    const cached = await caches.match(key, { cacheName: name, ignoreSearch: name === SHELL });
    if (cached) return cached;
    throw error;
  }
};
const cacheFirst = async (request, name) => {
  const cached = await caches.match(request, { cacheName: name });
  if (cached) return cached;
  const response = await fetch(request);
  store(name, request, response);
  return response;
};

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate' && (url.pathname === '/' || url.pathname === '/index.html')) {
      event.respondWith(networkFirst(request, SHELL, '/'));
    } else if (url.pathname.startsWith('/assets/site/') && !['video', 'audio'].includes(request.destination)) {
      event.respondWith(cacheFirst(request, ASSETS));
    } else if (url.pathname.startsWith('/site-publish/') || url.pathname === '/intro/intro.js') {
      event.respondWith(networkFirst(request, SHELL));
    }
    return;
  }
  if (url.href.startsWith(ARTICLE_SOURCE) && (url.pathname.endsWith('/postList.json') || url.pathname.endsWith('.html'))) {
    event.respondWith(networkFirst(request, ARTICLES));
  }
});
