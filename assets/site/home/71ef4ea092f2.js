/* Read Gmeek's generated article body inside this page. */
/* Safe remote article loading and cache fallback. */
(function(){'use strict';
const cache=new Map();
const OFFLINE_PREFIX='luliy-article-v1:';
function cachedNotice(fragment){const p=document.createElement('p');p.className='reader-cache-notice';p.textContent=document.documentElement.lang==='en'?'Showing a saved copy. Use Refresh to check for updates.':document.documentElement.lang==='ja'?'保存済みの記事です。更新で最新版を確認できます。':'当前显示已保存的正文，可点击刷新检查更新。';fragment.prepend(p);return fragment;}
const OFFLINE_INDEX='luliy-article-cache-index';
const keep=new Set(['A','ABBR','B','BLOCKQUOTE','BR','CODE','DEL','DETAILS','DIV','EM','FIGCAPTION','FIGURE','H1','H2','H3','H4','H5','H6','HR','I','IMG','KBD','LI','OL','P','PRE','S','SMALL','SPAN','STRONG','SUB','SUMMARY','SUP','TABLE','TBODY','TD','TH','THEAD','TR','U','UL']);
const drop=new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','FORM','BUTTON','CANVAS','META','LINK','INPUT','SELECT','TEXTAREA']);
function resolved(value,base,allowMail=false){
 if(!value)return null;
 try{const url=new URL(value,base);return ['http:','https:'].includes(url.protocol)||(allowMail&&url.protocol==='mailto:')?url.href:null;}catch(e){return null;}
}
function copy(node,base){
 if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.nodeValue);
 if(node.nodeType!==Node.ELEMENT_NODE||drop.has(node.tagName))return document.createDocumentFragment();
 const fragment=document.createDocumentFragment();
 if(!keep.has(node.tagName)){node.childNodes.forEach(child=>fragment.append(copy(child,base)));return fragment;}
 const element=document.createElement(node.tagName.toLowerCase());
 if(node.tagName==='A'){
  const href=resolved(node.getAttribute('href'),base,true);
  if(href){element.href=href;if(!href.startsWith('mailto:')){element.target='_blank';element.rel='noopener noreferrer';}}
 }
 if(node.tagName==='IMG'){
  const src=resolved(node.getAttribute('src'),base);
  if(!src)return fragment;
  element.referrerPolicy='no-referrer';element.src=src;element.alt=node.getAttribute('alt')||'';element.loading='lazy';element.decoding='async';
 }
 if(node.tagName==='TH'&&node.getAttribute('scope'))element.scope=node.getAttribute('scope');
 if(node.tagName==='CODE'||node.tagName==='PRE'){
  const language=[...node.classList].find(name=>/^language-[a-z0-9_+.#-]+$/i.test(name));
  if(language)element.className=language;
 }
 node.childNodes.forEach(child=>element.append(copy(child,base)));
 return element;
}
function issueMarkdown(markdown){
 const fragment=document.createDocumentFragment();let list=null,code=null;
 const add=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;fragment.append(el);return el;};
 for(const line of String(markdown||'').replace(/\r/g,'').split('\n')){
  if(/^```/.test(line)){if(code){code=null;}else{const pre=document.createElement('pre');code=document.createElement('code');pre.append(code);fragment.append(pre);}list=null;continue;}
  if(code){code.textContent+=line+'\n';continue;}
  if(!line.trim()){list=null;continue;}
  const heading=line.match(/^(#{1,6})\s+(.+)$/);
  if(heading){add('h'+heading[1].length,heading[2]);list=null;continue;}
  if(/^\s*---+\s*$/.test(line)){fragment.append(document.createElement('hr'));list=null;continue;}
  const image=line.trim().match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
  if(image){const img=document.createElement('img');img.alt=image[1];img.src=image[2];img.loading='lazy';fragment.append(img);list=null;continue;}
  const quote=line.match(/^>\s?(.*)$/);if(quote){add('blockquote',quote[1].replace(/\*\*/g,''));list=null;continue;}
  const bullet=line.match(/^\s*([-*]|\d+[.)])\s+(.+)$/);
  if(bullet){const kind=/\d/.test(bullet[1])?'ol':'ul';if(!list||list.tagName.toLowerCase()!==kind){list=document.createElement(kind);fragment.append(list);}const li=document.createElement('li');li.textContent=bullet[2];list.append(li);continue;}
  list=null;add('p',line);
 }
 return fragment;
}
function saveOffline(key,html){try{if(html.length>300000)return;const index=JSON.parse(localStorage.getItem(OFFLINE_INDEX)||'[]').filter(item=>item!==key);index.unshift(key);index.slice(5).forEach(item=>localStorage.removeItem(OFFLINE_PREFIX+item));localStorage.setItem(OFFLINE_PREFIX+key,html);localStorage.setItem(OFFLINE_INDEX,JSON.stringify(index.slice(0,5)));}catch(e){}}

function failure(code,status=0){const e=new Error(code);e.code=code;e.status=status;return e}
function cachedFragment(html,base){const source=new DOMParser().parseFromString(html,'text/html').querySelector('#postBody');if(!source)throw failure('invalid');const f=document.createDocumentFragment();source.childNodes.forEach(n=>f.append(copy(n,base)));if(!f.textContent.trim()&&!f.querySelector('img,pre'))throw failure('empty');return f}
function notice(fragment){cachedNotice(fragment);const p=fragment.querySelector('.reader-cache-notice');p.textContent=window.LuliyInterfaceText?.(p.textContent)||p.textContent;p.setAttribute('role','status');const button=document.createElement('button');button.type='button';button.dataset.articleRetry='';button.textContent=document.documentElement.lang==='en'?'Retry':document.documentElement.lang==='ja'?'再試行':'重新连接';button.textContent=window.LuliyInterfaceText?.(button.textContent)||button.textContent;p.append(' ',button);return fragment}
async function load(entry,force=false){
 const key=entry?.bodyUrl||entry?.issueApiUrl;if(!key)throw failure('unavailable');const base=entry.url||key;let url;try{url=new URL(key);if(!['http:','https:'].includes(url.protocol))throw Error()}catch(e){throw failure('invalid-url')}
 if(!force&&cache.has(key))return (await cache.get(key)).cloneNode(true);
 const previous=cache.get(key);let stale=false;
 const pending=(async()=>{let saved;try{saved=localStorage.getItem(OFFLINE_PREFIX+key)}catch(e){}
 try{if(navigator.onLine===false)throw failure('offline');if(force)url.searchParams.set('_fresh',Date.now());let response;try{response=await fetch(url.href,{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(saved&&!force?4000:12000)})}catch(e){throw failure(e.name==='TimeoutError'||e.name==='AbortError'?'timeout':'network')}
 if(!response.ok)throw failure(response.status===403||response.status===429?'limited':response.status===404?'missing':'http',response.status);
 let fragment;if(entry.bodyUrl){const html=await response.text();if(html.length>3000000)throw failure('too-large');fragment=cachedFragment(html,base)}else{const issue=await response.json();if(typeof issue.body!=='string')throw failure('invalid');fragment=issueMarkdown(issue.body);if(!fragment.textContent.trim()&&!fragment.querySelector('img'))throw failure('empty')}
 const holder=document.createElement('div');holder.id='postBody';holder.append(fragment.cloneNode(true));saveOffline(key,holder.outerHTML);return fragment;
 }catch(error){if(force)throw error;if(saved){try{const fragment=cachedFragment(saved,base);stale=true;return notice(fragment)}catch(e){try{localStorage.removeItem(OFFLINE_PREFIX+key)}catch(e){}}}if(entry.body){stale=true;return notice(issueMarkdown(entry.body))}throw error}
 })();cache.set(key,pending);
 try{const result=await pending;if(stale&&cache.get(key)===pending)cache.delete(key);return result.cloneNode(true)}catch(error){if(cache.get(key)===pending){if(previous)cache.set(key,previous);else cache.delete(key)}throw error}
}
function describe(error){const lang=document.documentElement.lang;const key=error?.code||'network';const messages={offline:['当前处于离线状态，没有这篇文章的本地副本。','You are offline. No saved copy is available.','オフラインです。保存済みの記事がありません。'],timeout:['加载超时，请重试；当前正文会保留。','The request timed out. Retry; the current text is preserved.','読み込みがタイムアウトしました。現在の本文は保持されます。'],limited:['文章服务暂时限制访问，请稍后重试。','The article service is rate-limited. Please retry later.','記事サービスへのアクセスが制限されています。後で再試行してください。'],missing:['原文链接不存在或已被移除。','The original article was not found.','元の記事が見つかりません。'],invalid:['原文返回了异常页面，无法显示正文。','The source returned an invalid article page.','元の記事の形式が正しくありません。'],empty:['原文没有可显示的正文。','The source has no readable content.','表示できる本文がありません。'],network:['暂时无法连接文章服务，请重试；已有正文会保留。','Could not connect. Retry; any existing text is preserved.','接続できません。現在の本文は保持されます。']};const text=(messages[key]||messages.network)[lang==='en'?1:lang==='ja'?2:0];return window.LuliyInterfaceText?.(text)||text}
window.LuliyReader={load,describe};
})();

