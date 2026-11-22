const CACHE='kaoyan-v17-math-framework-20261122-1';
const CORE=['./','./index.html','./考研决策台.html','./考研实验台.html','./manifest.webmanifest','./english-words.js','./english-corpus.js','./writing-library.html','./writing-dictionary.js','./writing-guide.js','./translation-library.html','./translation-style.css','./translation-app.js','./translation-data.js','./framework-library.html','./framework-katex.min.js','./framework-marked.min.js','./cs-library.js','./math-library.js','./math-library.css','./politics-library.html','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>/^kaoyan-v(?:[3456789]|10|11|12|13|14|15|16|17)-/.test(k)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return; const req=e.request;
 if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c));}return r}).catch(async()=>await caches.match(req)||await caches.match('./考研决策台.html')));return;}
 e.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(req); const fresh=fetch(req).then(r=>{if(r.ok||r.type==='opaque')cache.put(req,r.clone());return r;}).catch(()=>null); if(cached){e.waitUntil(fresh);return cached;} return await fresh||new Response('Offline',{status:503});}));
});
