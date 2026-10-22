/* GitHub relay: luliy.me/gh/* serves the blog's GitHub-hosted content from luliy.me itself.
   Why: raw.githubusercontent.com (article list, article bodies, about page, photos) and GitHub's image
   hosts are often unreachable from mainland China, while luliy.me (Cloudflare) is reachable.
   The pages ask for /gh/... first (home-early.js rewrites the fetches); if this relay fails they try
   the original address. See README 9.4.

     /gh/raw/<docs|static>/...   raw.githubusercontent.com/luliy6/luliy6.github.io/main/...
                                 docs/* falls back to blog.luliy.me (GitHub Pages), then to /mirror/
                                 (copies written daily by site-publish/generate.py)
     /gh/ua/<uuid>               github.com/user-attachments/assets/<uuid> (images in posts)
     /gh/camo/<...>              camo.githubusercontent.com/<...> (GitHub's image proxy)
     /gh/api/issues...           api.github.com/repos/luliy6/luliy6.github.io/issues... (pinned posts,
                                 chronicle); optional secret GITHUB_TOKEN raises GitHub's hourly limit

   Text answers (post HTML, JSON) have these addresses rewritten to /gh/ on the same site, so photos
   inside articles come through the relay too. Every answer is kept in Cloudflare's edge cache; when
   GitHub cannot be reached, the last good copy (up to 30 days old) is served instead. */
const REPO = 'luliy6/luliy6.github.io';
const RAW = 'https://raw.githubusercontent.com/' + REPO + '/main/';
const DAY = 86400;
const STALE = 30 * DAY;

// kind -> how to read it upstream. ttl: edge freshness (s); browser: max-age for the visitor.
const KINDS = {
  raw: {
    ok: p => /^(docs|static)\/[^?#]+$/.test(p) && !p.split('/').includes('..'),
    upstreams: p => [RAW + p].concat(p.startsWith('docs/') ? ['https://blog.luliy.me/' + p.slice(5)] : []),
    // generate.py stores the copies as .txt with % written as ~ (so they are never served as pages of this site).
    mirror: p => (p.startsWith('docs/') ? '/mirror/' + p.slice(5).replace(/%/g, '~') + (/\.json$/i.test(p) ? '' : '.txt') : null),
    text: p => /\.(html?|json|xml|txt|md)$/i.test(p),
    ttl: p => (/\.(html?|json|xml|txt|md)$/i.test(p) ? 120 : 7 * DAY),
    browser: p => (/\.(html?|json|xml|txt|md)$/i.test(p) ? 0 : DAY),
    timeout: 5000,
  },
  ua: {
    ok: p => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p),
    upstreams: p => ['https://github.com/user-attachments/assets/' + p],
    text: () => false, ttl: () => STALE, browser: () => 7 * DAY, timeout: 15000,
  },
  camo: {
    ok: p => /^[0-9a-f]{20,64}(\/[0-9a-f]+)?$/i.test(p),
    upstreams: p => ['https://camo.githubusercontent.com/' + p],
    text: () => false, ttl: () => STALE, browser: () => 7 * DAY, timeout: 15000,
  },
  api: {
    ok: p => /^issues(\/\d{1,7}(\/comments)?)?$/.test(p),
    upstreams: (p, q) => ['https://api.github.com/repos/' + REPO + '/' + p + q],
    text: () => true, ttl: () => 300, browser: () => 60, timeout: 6000, query: true,
  },
};

const rewrite = (body, origin) => body
  .replace(/https:\/\/raw\.githubusercontent\.com\/luliy6\/luliy6\.github\.io\/(?:refs\/heads\/)?main\/(?=(?:docs|static)\/)/g, origin + '/gh/raw/')
  .replace(/https:\/\/github\.com\/user-attachments\/assets\/(?=[0-9a-f]{8}-)/gi, origin + '/gh/ua/')
  .replace(/https:\/\/camo\.githubusercontent\.com\/(?=[0-9a-f]{20})/gi, origin + '/gh/camo/');

// Served from luliy.me, so a relayed page or SVG must never run as part of the site if opened directly.
const SAFE = {
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; sandbox",
  'X-Robots-Tag': 'noindex',
  'X-Luliy-Relay': '1',
};

const answer = (status, message) => new Response(message, {
  status, headers: Object.assign({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }, SAFE),
});

async function upstream(url, kind, path, env, request) {
  const headers = { 'User-Agent': 'luliy.me-relay (+https://luliy.me)' };
  if (kind === KINDS.api) {
    headers.Accept = request.headers.get('Accept') || 'application/vnd.github+json';
    if (env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + env.GITHUB_TOKEN;
  }
  // Ranges only for pictures and media: text is rewritten, so a byte range of the original would not fit.
  const range = request.headers.get('Range');
  if (range && !kind.text(path)) headers.Range = range;
  const response = await fetch(url, { headers, redirect: 'follow', signal: AbortSignal.timeout(kind.timeout) });
  if (!response.ok && response.status !== 206) {
    const error = new Error('upstream ' + response.status);
    error.status = response.status;
    throw error;
  }
  return response;
}

async function build(response, kind, path, origin, fromMirror) {
  const headers = new Headers(SAFE);
  const type = response.headers.get('Content-Type') || 'application/octet-stream';
  let body = response.body;
  if (kind.text(path)) {
    body = rewrite(await response.text(), origin);
    // Like raw.githubusercontent.com: text is text, whatever it is (callers read it with fetch()).
    headers.set('Content-Type', /json/i.test(type) || /\.json$/i.test(path) ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8');
  } else {
    headers.set('Content-Type', /^(image|video|audio)\//i.test(type) ? type : 'application/octet-stream');
    const length = response.headers.get('Content-Length');
    if (length) headers.set('Content-Length', length);
  }
  for (const name of kind.text(path) ? ['ETag', 'Last-Modified'] : ['ETag', 'Last-Modified', 'Content-Range', 'Accept-Ranges']) {
    const value = response.headers.get(name);
    if (value) headers.set(name, name === 'ETag' && kind.text(path) && !value.startsWith('W/') ? 'W/' + value : value);
  }
  headers.set('Cache-Control', 'public, max-age=' + kind.browser(path) + (kind.browser(path) ? '' : ', must-revalidate'));
  if (fromMirror) headers.set('X-Luliy-Relay-Source', 'mirror');
  return new Response(body, { status: response.status, headers });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') return answer(405, 'GET only');
  const url = new URL(request.url);
  const rest = url.pathname.replace(/^\/gh\//, '');
  const slash = rest.indexOf('/');
  const kind = KINDS[rest.slice(0, slash)];
  const path = rest.slice(slash + 1);
  if (slash < 0 || !kind || !kind.ok(path)) return answer(404, 'Not relayed');
  const query = kind.query ? url.search : '';

  // Cache keys live on this site's own host; the query is ignored except for the API
  // (callers add ?refresh=… only to get past browser caches).
  const fresh = new Request(url.origin + '/gh/.cache/fresh/' + rest + query + (kind === KINDS.api ? '#' + (request.headers.get('Accept') || '') : ''));
  const stale = new Request(fresh.url.replace('/gh/.cache/fresh/', '/gh/.cache/stale/'));
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const ranged = request.headers.has('Range') && !kind.text(path);

  const finish = response => {
    const tag = response.headers.get('ETag'), wanted = request.headers.get('If-None-Match');
    if (tag && wanted && wanted.split(/\s*,\s*/).some(v => v.replace(/^W\//, '') === tag.replace(/^W\//, ''))) {
      return new Response(null, { status: 304, headers: response.headers });
    }
    return request.method === 'HEAD' ? new Response(null, { status: response.status, headers: response.headers }) : response;
  };

  if (cache && !ranged) {
    const hit = await cache.match(fresh);
    if (hit) return finish(hit);
  }

  let failure = null;
  for (const target of kind.upstreams(path, query)) {
    try {
      const response = await build(await upstream(target, kind, path, env, request), kind, path, url.origin, false);
      if (cache && !ranged && response.status === 200) {
        const keep = (key, seconds) => {
          const copy = response.clone();
          const headers = new Headers(copy.headers);
          headers.set('Cache-Control', 'public, max-age=' + seconds);
          return cache.put(key, new Response(copy.body, { status: 200, headers }));
        };
        // The stored copies carry the edge lifetime; the visitor still gets kind.browser().
        const visitor = response.headers.get('Cache-Control');
        const forVisitor = new Headers(response.headers);
        forVisitor.set('Cache-Control', visitor);
        context.waitUntil(Promise.all([keep(fresh, kind.ttl(path)), keep(stale, STALE)]).catch(() => {}));
        return finish(new Response(response.body, { status: 200, headers: forVisitor }));
      }
      return finish(response);
    } catch (error) {
      failure = error;
      if (error.status === 404 && kind !== KINDS.raw) break;
    }
  }

  if (cache && !ranged) {
    const old = await cache.match(stale);
    if (old) {
      const headers = new Headers(old.headers);
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      headers.set('X-Luliy-Relay-Source', 'stale');
      return finish(new Response(old.body, { status: 200, headers }));
    }
  }

  const mirror = kind.mirror && kind.mirror(path);
  if (mirror && env.ASSETS) {
    try {
      const copy = await env.ASSETS.fetch(new Request(new URL(mirror, url.origin)));
      if (copy.ok) return finish(await build(copy, kind, path, url.origin, true));
    } catch (error) {}
  }

  const status = failure && failure.status;
  if (status === 404) return answer(404, 'Not found upstream');
  if (status === 403 || status === 429) return answer(503, 'GitHub limit reached; try the original address');
  return answer(502, 'GitHub unreachable');
}
