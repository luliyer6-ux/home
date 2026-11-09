/* 豆瓣 book lookup (2026-11-09): luliy.me/douban/<subject id>       → JSON { id, title, author, translator, publisher, year, isbn, brief, cover }
                                  luliy.me/douban/<subject id>/cover → the cover picture
   Why here: 豆瓣 neither lets other sites read its pages from the browser nor shows its covers on them (hot-link
   protection), so the reading notes ask this function instead. Order: NeoDB (a public catalogue that mirrors 豆瓣
   entries, no account needed), then the 豆瓣 page itself (its og: / book: meta tags). Answers stay in Cloudflare's
   edge cache for 30 days (a miss for 10 minutes), covers for a year. Only digits are accepted as the id. */
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const DAY = 86400;
const SAFE = { 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex' };

const json = (data, status, maxAge) => new Response(JSON.stringify(data), {
  status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': maxAge ? 'public, max-age=' + maxAge : 'no-store' }, SAFE),
});
const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
const names = v => (Array.isArray(v) ? v : v ? [v] : []).map(x => clean(typeof x === 'string' ? x : x && (x.name || x.title))).filter(Boolean);
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, '&');

async function viaNeoDB(id) {
  const target = 'https://book.douban.com/subject/' + id + '/';
  for (let i = 0; i < 3; i++) { // a book NeoDB has not seen yet answers 202 while it fetches it
    const r = await fetch('https://neodb.social/api/catalog/fetch?url=' + encodeURIComponent(target), { headers: { Accept: 'application/json', 'User-Agent': 'luliy.me (+https://luliy.me)' }, signal: AbortSignal.timeout(8000) });
    if (r.status === 202) { await new Promise(ok => setTimeout(ok, 1500)); continue; }
    if (!r.ok) return null;
    const j = await r.json();
    const title = clean(j.title || j.display_title);
    if (!title) return null;
    return {
      title, subtitle: clean(j.subtitle), author: names(j.author).join(' / '), translator: names(j.translator).join(' / '),
      publisher: clean(Array.isArray(j.pub_house) ? j.pub_house[0] : j.pub_house), year: clean(j.pub_year), isbn: clean(j.isbn),
      brief: clean(j.brief),
      coverUrl: /missing|default/i.test(j.cover_image_url || '') ? '' : new URL(j.cover_image_url || '', 'https://neodb.social/').href.replace(/^https:\/\/neodb\.social\/$/, ''), source: 'neodb',
    };
  }
  return null;
}

async function viaDouban(id) {
  const r = await fetch('https://book.douban.com/subject/' + id + '/', { headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'zh-CN,zh;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(8000) });
  if (!r.ok) return null;
  const html = await r.text();
  const meta = p => [...html.matchAll(new RegExp('<meta\\s+property="' + p + '"\\s+content="([^"]*)"', 'g'))].map(m => decode(m[1]));
  const title = clean((meta('og:title')[0] || ''));
  if (!title) return null;
  const info = (html.match(/<div id="info"[\s\S]*?<\/div>/) || [''])[0].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '');
  const field = k => clean(decode(((new RegExp(k + '\\s*[:：]\\s*([^\\n]+)')).exec(info) || [])[1] || ''));
  return {
    title, subtitle: field('副标题'), author: meta('book:author').map(clean).filter(Boolean).join(' / ') || field('作者'), translator: field('译者'),
    brief: clean(decode(((html.match(/<div class="intro">([\s\S]*?)<\/div>/) || [])[1] || '').replace(/<[^>]+>/g, ' '))) || clean(meta('og:description')[0] || ''),
    publisher: field('出版社'), year: (field('出版年').match(/\d{4}/) || [''])[0], isbn: meta('book:isbn')[0] || field('ISBN'),
    coverUrl: (meta('og:image')[0] || '').replace(/\/view\/subject\/[sm]\//, '/view/subject/l/'), source: 'douban',
  };
}

async function lookup(id, cache, origin, waitUntil) {
  const key = new Request(origin + '/douban/.cache/v2/' + id); // v2: answers carry brief
  if (cache) { const hit = await cache.match(key); if (hit) return hit.json(); }
  let book = null;
  for (const way of [viaNeoDB, viaDouban]) { try { book = await way(id); } catch (e) { book = null; } if (book) break; }
  if (book && book.brief && book.brief.length > 600) book.brief = book.brief.slice(0, 600) + '…';
  if (book && !book.coverUrl && book.source === 'neodb') { try { const d = await viaDouban(id); if (d && d.coverUrl) book.coverUrl = d.coverUrl; } catch (e) {} } // NeoDB without a cover: take 豆瓣's
  const data = book ? Object.assign({ id }, book) : { id, missing: true };
  if (cache) waitUntil(cache.put(key, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=' + (book ? 30 * DAY : 600) } })));
  return data;
}

export async function onRequest({ request, waitUntil }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return json({ error: 'GET only' }, 405);
  const url = new URL(request.url);
  const m = /^\/douban\/(\d{1,12})(\/cover)?\/?$/.exec(url.pathname);
  if (!m) return json({ error: 'Not found' }, 404);
  const id = m[1], cache = typeof caches !== 'undefined' ? caches.default : null;
  const data = await lookup(id, cache, url.origin, waitUntil);

  if (!m[2]) {
    if (data.missing) return json({ id, missing: true }, 404);
    const out = Object.assign({}, data, { cover: data.coverUrl ? '/douban/' + id + '/cover' : '' }); delete out.coverUrl;
    return json(out, 200, DAY);
  }

  // the cover
  const ckey = new Request(url.origin + '/douban/.cache/' + id + '/cover');
  if (cache) { const hit = await cache.match(ckey); if (hit) return hit; }
  if (!data.coverUrl) return json({ id, cover: false }, 404);
  try {
    const r = await fetch(data.coverUrl, { headers: { 'User-Agent': UA, Referer: 'https://book.douban.com/' }, signal: AbortSignal.timeout(10000) });
    const type = r.headers.get('Content-Type') || '';
    if (!r.ok || !/^image\//.test(type)) return json({ id, cover: false }, 502);
    const res = new Response(r.body, { headers: Object.assign({ 'Content-Type': type, 'Cache-Control': 'public, max-age=' + 365 * DAY }, SAFE) });
    if (cache) waitUntil(cache.put(ckey, res.clone()));
    return res;
  } catch (e) { return json({ id, cover: false }, 502); }
}
