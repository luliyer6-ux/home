/* Minimal study room and Gmeek-backed reading lists. */
(function(){
'use strict';
const FEED_URL='https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/postList.json';
const BLOG_ORIGIN='https://blog.luliy.me/';
const RAW_POST_BASE='https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/';
const FEED_CACHE_KEY='luliy-gmeek-feed-v1';
const PIN_CACHE_KEY='luliy-pinned-issues-v2';
const COVER_TTL=5*60*1000;
const states=new WeakMap();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RESERVED=new Set(['about','archive','book','gallery','favorites','chronicle','chronicle-data','timeline','stock','link']);
function getState(data){
 let state=states.get(data);
 if(!state){state={books:[],posts:[],loaded:false,error:false,loading:null,revision:0,signature:'',pins:Array.isArray(data.pinnedIssues)?data.pinnedIssues:[],searchCache:new Map(),coverCache:new Map(),summaryCache:new Map()};states.set(data,state);}
 return state;
}
function safePostUrl(raw){
 try{const url=new URL(String(raw||''),BLOG_ORIGIN);return url.origin===BLOG_ORIGIN.slice(0,-1)?url.href:null;}catch(e){return null;}
}
function normaliseFeed(json){
 const books=[],posts=[];
 Object.entries(json&&typeof json==='object'?json:{}).forEach(([key,item])=>{
  if(!/^P\d+$/.test(key)||!item||typeof item!=='object')return;
  const labels=Array.isArray(item.labels)?item.labels.map(x=>String(x).trim()):[];
  const lower=labels.map(x=>x.toLowerCase()),url=safePostUrl(item.postUrl);
  const path=url?new URL(url).pathname.replace(/^\//,''):'';
  const bodyUrl=/^post\/[^?#]+\.html$/i.test(path)?RAW_POST_BASE+path:null;
  const pinLevel=lower.reduce((level,label)=>{const match=/^pinned(?:-(\d+))?$/.exec(label);return match?Math.max(level,match[1]?Number(match[1]):1):level;},0);
  const readingState=lower.some(x=>['在读','reading','currently reading'].includes(x))?'reading':lower.some(x=>['读完','已读','finished','read'].includes(x))?'finished':lower.some(x=>['想读','待读','to read','want to read'].includes(x))?'want':'';
  const row={summary:String(item.postSummary||item.summary||'').replace(/\s+/g,' ').trim().slice(0,140),id:key,title:String(item.postTitle||'未命名'),date:String(item.createdDate||''),updated:String(item.updatedDate||''),labels,url,bodyUrl,pinLevel,reading:readingState==='reading',readingState};
  if(lower.includes('library')){
   row.tags=labels.filter(x=>!['library','在读','reading','currently reading','读完','已读','finished','read','想读','待读','to read','want to read'].includes(x.toLowerCase()));
   books.push(row);
  }else if(!labels.some(x=>RESERVED.has(x.toLowerCase())))posts.push(row);
 });
 const order=(a,b)=>(b.date||'').localeCompare(a.date||'')||b.id.localeCompare(a.id);
 books.sort(order);posts.sort(order);
 return {books,posts};
}
function create({data={},lang='zh',href}){
 const L=(a,b,c)=>lang==='en'?b:lang==='ja'?c:a;
 const state=getState(data);
 const categories=[...new Set(state.books.flatMap(book=>book.tags||[]))].map(tag=>({id:'tag-'+encodeURIComponent(tag),name:tag,en:tag}));
 const labelFor=b=>b.tags?.slice(0,2).join(' · ')||L('阅读笔记','Reading notes','読書ノート');
 const bookEntries=id=>state.books.filter(book=>!id||book.tags?.some(tag=>'tag-'+encodeURIComponent(tag)===id));
 // Number published entries by their current chronological position, not their
 // GitHub Issue ID. Gaps left by deleted Issues therefore never become gaps here.
 const sequence=id=>{
  const entries=[...state.books,...state.posts].sort((a,b)=>(a.date||'').localeCompare(b.date||'')||Number(a.id.slice(1))-Number(b.id.slice(1)));
  const index=entries.findIndex(entry=>entry.id===id);
  return index<0?null:index+1;
 };
 function refresh(force=false){
  if(state.loading)return state.loading;
  if(state.loaded&&!force)return Promise.resolve(state);
  const feed=fetch(FEED_URL,{cache:'no-store',signal:AbortSignal.timeout(12000)})
   .then(response=>{if(!response.ok)throw Error('Gmeek feed unavailable');return response.json();})
   .then(json=>({json,next:normaliseFeed(json)})).catch(()=>null);
  const pinFeed=fetch('https://api.github.com/repos/luliy6/luliy6.github.io/issues?labels=pinned&state=open&per_page=100',{cache:'no-store',signal:AbortSignal.timeout(8000)})
   .then(response=>{if(!response.ok)throw Error('Pinned issues unavailable');return response.json();})
   .then(issues=>{if(!Array.isArray(issues))throw Error('Invalid pinned issues');return issues.filter(issue=>!issue.pull_request).map(issue=>({id:'P'+issue.number,title:String(issue.title||''),url:issue.html_url,date:String(issue.created_at||'').slice(0,10),labels:(issue.labels||[]).map(label=>label.name),body:String(issue.body||''),pinLevel:1,issueApiUrl:issue.url}));}).catch(()=>null);
  state.loading=Promise.all([feed,pinFeed]).then(([result,pins])=>{
   if(result){state.books=result.next.books;state.posts=result.next.posts;state.error=false;try{localStorage.setItem(FEED_CACHE_KEY,JSON.stringify(result.json));}catch(e){}}
   else{if(!state.loaded)try{const cached=JSON.parse(localStorage.getItem(FEED_CACHE_KEY)||'null');if(cached){const next=normaliseFeed(cached);state.books=next.books;state.posts=next.posts;}}catch(e){}state.error=true;}
   if(pins){state.pins=pins;try{localStorage.setItem(PIN_CACHE_KEY,JSON.stringify(pins));}catch(e){}}
   else if(!state.pins.length)state.pins=state.posts.filter(post=>post.pinLevel);
   state.loaded=true;
   const signature=JSON.stringify({books:state.books,posts:state.posts,pins:state.pins});
   if(signature!==state.signature){state.signature=signature;state.revision++;state.searchCache.clear();}
   return state;
  }).finally(()=>{state.loading=null;});
  return state.loading;
 }
 const status=()=>!state.loaded?L('正在整理书房…','Opening the study room…','書斎を準備中…'):state.error?L('暂时无法更新，正在显示上次书目。','Showing the last available reading list.','前回の書目を表示中。'):L('书房正在等第一本书。','The first book is yet to arrive.','最初の一冊を待っています。');
 async function searchText(query){
  const needle=String(query||'').trim().toLocaleLowerCase();if(needle.length<2)return [];
  const entries=[...state.posts,...state.books].filter(entry=>entry.bodyUrl),results=[];
  let cursor=0;
  async function worker(){while(cursor<entries.length){const entry=entries[cursor++];let pending=state.searchCache.get(entry.bodyUrl);if(!pending){pending=fetch(entry.bodyUrl,{cache:'force-cache',signal:AbortSignal.timeout(12000)}).then(response=>{if(!response.ok)throw Error('Article search unavailable');return response.text();}).then(html=>new DOMParser().parseFromString(html,'text/html').querySelector('#postBody')?.textContent||'').catch(()=>{if(state.searchCache.get(entry.bodyUrl)===pending)state.searchCache.delete(entry.bodyUrl);return '';});state.searchCache.set(entry.bodyUrl,pending);}const text=await pending,index=text.toLocaleLowerCase().indexOf(needle);if(index>=0)results.push({entry,snippet:text.slice(Math.max(0,index-36),Math.min(text.length,index+needle.length+68)).replace(/\s+/g,' ').trim()});}}
  await Promise.all(Array.from({length:Math.min(4,entries.length)},worker));
  return results.sort((a,b)=>(b.entry.date||'').localeCompare(a.entry.date||''));
 }
 function coverFromHtml(html,base){
  const doc=new DOMParser().parseFromString(html,'text/html'),body=doc.querySelector('#postBody');
  if(!body)return '';
  const images=[...body.querySelectorAll('img')];
  const marked=images.find(img=>/封面|题图|\bcover\b|\bhero\b/i.test(img.getAttribute('alt')||''));
  // A leading photograph can act as a cover; diagrams later in the essay cannot.
  const opening=[...body.children].slice(0,4),first=opening.flatMap(node=>node.matches('img')?[node]:[...node.querySelectorAll('img')]).find(img=>!/(avatar|icon|logo|图标|头像|图表|示意|流程|diagram|chart)/i.test(img.alt||''));
  const img=marked||first;if(!img)return '';
  const raw=img.getAttribute('src')||img.getAttribute('data-src')||'';
  try{const url=new URL(raw,base||BLOG_ORIGIN);return url.protocol==='https:'?url.href:'';}catch(e){return '';}
 }
 function articleCover(entry){
  if(!entry?.bodyUrl)return Promise.resolve('');
  const cached=state.coverCache.get(entry.bodyUrl);
  if(cached&&Date.now()-cached.at<COVER_TTL)return cached.promise;
  const coverKey='luliy-cover-v1:'+entry.bodyUrl;let stored=null;try{stored=JSON.parse(localStorage.getItem(coverKey)||'null');}catch(e){}const promise=fetch(entry.bodyUrl,{cache:'no-cache',signal:AbortSignal.timeout(12000)}).then(response=>{if(!response.ok)throw Error('Article cover unavailable');return response.text();}).then(html=>{const text=summaryFromHtml(html);if(text){state.summaryCache.set(entry.id,text);try{localStorage.setItem('luliy-summary-v2:'+entry.id,text);}catch(e){}}const src=coverFromHtml(html,entry.url);try{localStorage.setItem(coverKey,JSON.stringify({src,at:Date.now()}));}catch(e){}return src;}).catch(()=>{if(state.coverCache.get(entry.bodyUrl)?.promise===promise)state.coverCache.delete(entry.bodyUrl);return '';});
  state.coverCache.set(entry.bodyUrl,{at:Date.now(),promise});if(stored&&typeof stored.src==='string'&&Date.now()-stored.at<30*864e5)return Promise.resolve(stored.src);return promise;
 }
 function hydrateCovers(root){
  const rows=[...(root||document).querySelectorAll('.article-list .study-entry[data-post-id]')];
  if(!rows.length)return ()=>{};
  let live=true;
  const load=async row=>{const entry=state.posts.find(post=>post.id===row.dataset.postId);if(!entry)return;const cover=await articleCover(entry),src=document.documentElement.classList.contains('luliy-save-data')?'':cover;if(!live||!row.isConnected)return;const summary=row.querySelector('[data-home-summary]');if(summary)summary.textContent=excerpt(entry)||L('摘要暂时无法读取，请点击阅读全文。','Summary unavailable. Open the article to read.','要約を読み込めません。記事をご覧ください。');const previous=row.querySelector('.study-entry-cover');if(!src){previous?.remove();row.classList.remove('has-cover');return;}if(previous?.querySelector('img')?.src===src)return;const img=new Image();img.decoding='async';img.alt='';img.onload=()=>{if(!live||!row.isConnected)return;const wrapper=document.createElement('span');wrapper.className='study-entry-cover';wrapper.setAttribute('aria-hidden','true');wrapper.append(img);previous?.remove();row.prepend(wrapper);row.classList.add('has-cover');};img.src=src;};
  if(!('IntersectionObserver' in window)){rows.forEach(load);return ()=>{live=false;};}
  const observer=new IntersectionObserver(entries=>entries.forEach(item=>{if(item.isIntersecting){observer.unobserve(item.target);load(item.target);}}),{rootMargin:'360px'});
  rows.forEach(row=>{if(row.querySelector('[data-home-summary]'))load(row);else observer.observe(row);});return ()=>{live=false;observer.disconnect();};
 }
 function row(entry,index,kind='book',showPin=true){
  const label=kind==='book'?labelFor(entry):entry.labels.filter(label=>showPin||!/^pinned(?:-\d+)?$/i.test(label)).slice(0,2).join(' · ');
  const readingBadge=kind==='book'&&entry.readingState?`<b class="study-reading-badge">${entry.readingState==='reading'?L('在读','Reading','読書中'):entry.readingState==='finished'?L('读完','Finished','読了'):L('想读','Want to read','読みたい')}</b> · `:'';
  return `<a class="study-entry" href="${href('/article/'+entry.id)}"${kind==='post'?` data-post-id="${esc(entry.id)}"`:''}><span class="study-index">${String(index+1).padStart(2,'0')}</span><span class="study-entry-copy"><small>${readingBadge}${showPin&&entry.pinLevel&&kind==='post'?`<b class="study-pin">${L('置顶','Pinned','固定')}</b> · `:''}${esc(label||L('文章','Article','記事'))}</small><strong>${esc(entry.title)}</strong></span><time>${esc(entry.date)}</time><span class="study-arrow" aria-hidden="true">→</span></a>`;
 }
 function studyLinks(){return `<div class="study-actions"><a href="https://blog.luliy.me/book.html" target="_blank" rel="noopener noreferrer">${L('打开现有书架','Open the existing bookshelf','今の本棚を開く')}</a><a href="${href('/posts')}">${L('看看最近的文章','Read recent writing','最近の記事へ')}</a></div>`;}
 function empty(full=false){return `<div class="study-empty-room${full?' is-full':''}"><span class="study-empty-mark" aria-hidden="true">※</span><div><p class="eyebrow">A ROOM IN PROGRESS</p><h3>${esc(status())}</h3><p>${L('以后在 Gmeek 发布带 Library 标签的读书 Issue，这里就会出现真实书目。先去看看已有的书架与文章。','Books published with the Library label in Gmeek will appear here. Meanwhile, browse the existing bookshelf and writing.','Gmeek で Library ラベルの読書 Issue を公開すると、ここに表示されます。')}</p>${studyLinks()}</div></div>`;}
 const orderedPosts=()=>[...state.posts].sort((a,b)=>b.pinLevel-a.pinLevel||(b.date||'').localeCompare(a.date||'')||b.id.localeCompare(a.id));
 function photoShelves(){
  const shelves=Array.isArray(data.personalShelves)?data.personalShelves:[];if(!shelves.length)return '';
  return `<section class="personal-shelves" aria-label="${L('我的实体书架','My physical bookshelves','私の本棚')}"><div class="personal-shelf-grid">${shelves.map((s,i)=>{const photo=data.shelfPhotos?.[(s.photo||1)-1]||'';return `<figure class="personal-shelf-card"><div class="personal-shelf-image">${photo?`<img src="${esc(photo)}" alt="${L('我的书架照片','Photograph of my bookshelf','本棚の写真')} ${i+1}" loading="lazy" decoding="async">`:''}<span>${String(i+1).padStart(2,'0')} / 03</span></div><figcaption><small>${L('照片中的书脊','BOOK SPINES IN VIEW','写真で見える背表紙')}</small><h3>${esc(lang==='en'?s.titleEn||s.title:s.title)}</h3><ul>${(s.books||[]).map(book=>`<li>${esc(book)}</li>`).join('')}</ul></figcaption></figure>`;}).join('')}</div></section>`;
 }
 function shortSummary(text){text=String(text||'').replace(/\s+/g,' ').trim();if(text.length<=70)return text;const cut=text.slice(0,69);return cut+'…';}
 function summaryFromHtml(html){const doc=new DOMParser().parseFromString(html,'text/html'),body=doc.querySelector('#postBody');if(!body)return '';body.querySelectorAll('script,style,pre,table,.reader-cache-notice').forEach(n=>n.remove());const paragraphs=[...body.querySelectorAll('p')].map(n=>n.textContent.replace(/\s+/g,' ').trim()).filter(t=>t.length>10);return shortSummary(paragraphs.join(' '));}
 function excerpt(entry){if(entry.summary)return shortSummary(entry.summary);if(state.summaryCache.has(entry.id))return state.summaryCache.get(entry.id);try{const saved=localStorage.getItem('luliy-summary-v2:'+entry.id);if(saved)return shortSummary(saved);const html=localStorage.getItem('luliy-article-v1:'+entry.bodyUrl);if(html)return summaryFromHtml(html);}catch(e){}return '';}
 function postsContent(limit,excludePinned=false){const items=(excludePinned?[...state.posts].sort((a,b)=>(b.date||'').localeCompare(a.date||'')||Number(b.id.slice(1))-Number(a.id.slice(1))):orderedPosts()).filter(post=>!excludePinned||!state.pins.some(pin=>pin.id===post.id)).slice(0,limit||state.posts.length);return items.length?`<div class="study-list article-list">${items.map((p,i)=>{const html=row(p,i,'post');if(!excludePinned||i>=3)return html;const summary=excerpt(p);return html.replace('</strong></span>','</strong><span class="home-article-summary" data-home-summary="'+esc(p.id)+'">'+esc(summary||L('正在读取文章摘要…','Loading article summary…','記事の要約を読み込み中…'))+'</span></span>');}).join('')}</div>`:`<div class="study-empty-room"><span class="study-empty-mark" aria-hidden="true">✦</span><div><h3>${L('文章正在整理。','Writing is being collected.','記事を整理しています。')}</h3><div class="study-actions"><a href="https://blog.luliy.me/" target="_blank" rel="noopener noreferrer">blog.luliy.me</a></div></div></div>`;}

 function pinnedContent(){return state.pins.length?`<span class="home-pinned-label">${L('置顶','Pinned','固定')}</span><div class="home-pinned-grid">${state.pins.map(pin=>`<a class="home-pinned-link" href="${href('/article/'+pin.id)}"><strong>${esc(pin.title)}</strong></a>`).join('')}</div>`:'';}
 function pinnedEntry(id){const pin=state.pins.find(item=>item.id===id);if(!pin)return null;return state.posts.find(item=>item.id===id)||state.books.find(item=>item.id===id)||{...pin,labels:pin.labels||[],issueApiUrl:pin.issueApiUrl||'https://api.github.com/repos/luliy6/luliy6.github.io/issues/'+id.slice(1)};}
 function postsPage(year='',tag='',view='archive',group='',compact=false){
  const topics=[...new Set(state.posts.flatMap(post=>post.labels.filter(label=>!/^pinned(?:-\d+)?$/i.test(label))))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  const years=[...new Set(state.posts.map(post=>post.date.slice(0,4)).filter(Boolean))].sort().reverse();
  const link=(nextYear,nextTag,nextGroup=group)=>href('/posts?'+new URLSearchParams({view,...nextYear?{year:nextYear}:{},...nextTag?{tag:nextTag}:{},...nextGroup?{group:nextGroup}:{}}));
  const shown=[...state.posts].sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.id.localeCompare(a.id)).filter(post=>(!year||post.date.startsWith(year))&&(!tag||post.labels.includes(tag))&&(!group||(post.labels.some(label=>['weekly','周记','周报','二十四节气'].includes(label.toLowerCase()))===(group==='weekly'))));
  const chips=`<nav class="post-filters" aria-label="${L('文章筛选','Article filters','記事の絞り込み')}"><a href="${link('','')}" ${!year&&!tag?'aria-current="page"':''}>${L('全部','All','すべて')}</a>${years.map(value=>`<a href="${link(value,tag)}" ${year===value?'aria-current="page"':''}>${esc(value)}</a>`).join('')}</nav><nav class="post-filters post-tags" aria-label="${L('文章标签','Article topics','記事のタグ')}">${topics.map(value=>`<a href="${link(year,value===tag?'':value)}" ${tag===value?'aria-current="page"':''}>${esc(value)}</a>`).join('')}</nav>`;
  const groups=years.filter(value=>shown.some(post=>post.date.startsWith(value))).map(value=>`<section class="post-year"><h2>${esc(value)}</h2><div class="study-list article-list">${shown.filter(post=>post.date.startsWith(value)).map((post,index)=>row(post,index,'post',false)).join('')}</div></section>`).join('');
  const categoryTabs=view==='archive'?`<nav class="post-filters" aria-label="归档类型">${[['','全部'],['weekly','周记'],['other','其他文章']].map(([key,name])=>`<a href="${link(year,tag,key)}" ${group===key?'aria-current="page"':''}>${esc(name)}</a>`).join('')}</nav>`:'';
  const latest=`<div class="study-list article-list">${shown.map((post,index)=>row(post,index,'post',false)).join('')}</div>`;
  if(compact){
   const type=group==='weekly'?L('周记','Weekly','週記'):group==='other'?L('其他文章','Other writing','その他の記事'):L('全部文章','All articles','すべての記事');
   const clear=(label,url)=>`<a class="article-filter-condition" href="${url}" aria-label="${esc(L('清除筛选：','Clear filter: ','絞り込みを解除：')+label)}">${esc(label)}<span aria-hidden="true">×</span></a>`;
   const summary=`<div class="article-filter-current">${group?clear(type,link(year,tag,'')):`<span>${type}</span>`}${year?clear(year,link('',tag)):''}${tag?clear(tag,link(year,'')):''}<small>${shown.length} ${L('篇','articles','件')}</small></div>`;
   const types=[['',L('全部文章','All articles','すべての記事')],['weekly',L('周记','Weekly','週記')],['other',L('其他文章','Other writing','その他の記事')]];
   const options=(items,selected,makeLink)=>items.map(([key,label])=>`<a href="${makeLink(key)}" ${selected===key?'aria-current="page"':''}>${esc(label)}</a>`).join('');
   const panel=`<details class="article-filter-drawer"><summary><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 6h18M6 12h12M9 18h6"/></svg>${L('筛选','Filter','絞り込み')}<span class="article-filter-chevron" aria-hidden="true">⌄</span></summary><div class="article-filter-panel"><div class="article-filter-heading"><span>${L('筛选文章','Filter articles','記事の絞り込み')}</span><a href="${link('','','')}">${L('重置','Reset','リセット')}</a></div><div class="article-filter-section"><h3>${L('类型','Type','種類')}</h3><nav>${options(types,group,key=>link(year,tag,key))}</nav></div><div class="article-filter-section"><h3>${L('年份','Year','年')}</h3><nav>${options([['',L('全部年份','All years','すべての年')],...years.map(y=>[y,y])],year,key=>link(key,tag))}</nav></div><div class="article-filter-section"><h3>${L('分类','Topic','カテゴリー')}</h3><nav>${options([['',L('全部分类','All topics','すべての分類')],...topics.map(t=>[t,t])],tag,key=>link(year,key))}</nav></div></div></details>`;
   return `<div class="article-filter-bar">${summary}${panel}</div>`+(groups||`<p class="study-empty">${L('这一组还没有文章。','No articles in this group yet.','このグループには記事がありません。')}</p>`);
  }
  return categoryTabs+(view==='latest'?(shown.length?latest:'<p class="study-empty">暂无文章</p>'):chips+(groups||`<p class="study-empty">${L('这一组还没有文章。','No articles in this group yet.','このグループには記事がありません。')}</p>`));
 }
 function roomPage(id){
  const category=categories.find(c=>c.id===id);
  if(id&&!category)return null;
  const shown=category?bookEntries(id):state.books;
  const tabs=categories.length?`<nav class="study-tabs" aria-label="${L('书房分类','Study room topics','書斎の分類')}"><a href="${href('/books')}" ${!id?'aria-current="page"':''}>${L('全部书目','All books','すべての本')}<span>${state.books.length}</span></a>${categories.map(c=>`<a href="${href('/books/'+c.id)}" ${id===c.id?'aria-current="page"':''}>${esc(c.name)}<span>${bookEntries(c.id).length}</span></a>`).join('')}</nav>`:'';
  const list=shown.length?`<div class="study-list">${shown.map((b,i)=>row(b,i)).join('')}</div>`:empty(true);
  const reading=shown.filter(book=>book.reading);
  const currently=reading.length?`<section class="study-currently"><p class="eyebrow">ON THE DESK · ${L('正在读','Reading now','読書中')}</p><div class="study-list">${reading.map((book,index)=>row(book,index)).join('')}</div></section>`:'';
  return `<div class="shell subpage study-page"><div class="study-room-heading"><div class="study-actions"><a href="https://blog.luliy.me/book.html" target="_blank" rel="noopener noreferrer">${L('现有书架','Existing bookshelf','今の本棚')}</a><a href="${href('/posts')}">${L('文章','Writing','記事')}</a></div></div>${photoShelves()}${currently}<div class="study-room-shelves"><div class="study-room-shelves-top"><button type="button" class="study-refresh" data-study-refresh>${L('刷新书目','Refresh books','書目を更新')}</button></div>${tabs}${list}</div><section class="study-writing"><div class="study-writing-head"><div><p class="eyebrow">NOTES FROM THE DESK</p><h2>${L('书房手记','Notes from the desk','書斎のノート')}</h2></div><a href="${href('/posts')}">${L('全部文章','All writing','すべての記事')}</a></div>${postsContent(3)}</section><p class="study-source">${L('书目来自','Books come from','書目の出典：')} <a href="https://blog.luliy.me/book.html" target="_blank" rel="noopener noreferrer">blog.luliy.me</a> · Gmeek Issues</p></div>`;
 }
 function art(){const photo=data.shelfPhotos?.[2]||'';return `<a class="study-room-scene" href="${href('/books')}" aria-label="${L('进入书房','Enter the study room','書斎へ')}">${photo?`<img class="study-scene-photo" src="${esc(photo)}" alt="" decoding="async">`:''}<span class="study-scene-label">LULIY / THE STUDY</span><span class="study-scene-door">${L('走进书房','Enter the study','書斎へ')}</span></a>`;}
 return {categories,books:()=>state.books,posts:()=>state.posts,pins:()=>state.pins.map(pin=>({...pinnedEntry(pin.id),pinned:true})),pinnedEntry,orderedPosts,postsPage,searchText,sequence,revision:()=>state.revision,loaded:()=>state.loaded,refresh,hydrateCovers,entries:bookEntries,art,postsContent,pinnedContent,booksPage:roomPage,count:id=>bookEntries(id).length};
}
window.LuliyCollections={create};
})();
