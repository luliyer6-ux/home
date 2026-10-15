(()=>{'use strict';
const C=window.KaoyanCore,S=window.KAOYAN_SYLLABUS,P=window.KAOYAN_PLAN;if(!C||!S||!P)return;
const $=s=>document.querySelector(s),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const API='https://tg-s3.luliyer6.workers.dev',TOKEN='luliy-drive-session',ids=['politics','english2','math2','408'];
const demo=new URLSearchParams(location.search).get('demo')==='1'&&(location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname));
const key=demo?'luliy-dashboard-demo-v2':C.STATE_KEY,nodeById=new Map(),parentById=new Map(),leafMap=new Map(),roots=new Map(S.subjects.map(n=>[n.subject,n]));
function index(n,parent=null){nodeById.set(n.id,n);if(parent)parentById.set(n.id,parent.id);const leaves=n.children.length?n.children.flatMap(c=>index(c,n)):[n];leafMap.set(n.id,leaves);return leaves;}
const allLeaves=S.subjects.flatMap(n=>index(n));
let data=C.emptyState(),loaded=demo,editable=demo,token='',revision=0,pending=false,busy=false,timer=0,popup=null,publicBusy=false,stats=[],lastUpdated='',undo=null,undoTimer=0,publicTimer=0;
const storedExpansion=read('luliy-dashboard-expanded-v2',null);
let expanded=new Set(storedExpansion||[]),mapPositions={},route=null,publicError='',activeRequest=0;
if(!storedExpansion)for(const root of S.subjects){expanded.add(root.id);root.children.forEach(n=>expanded.add(n.id));}
const now=()=>new Date().toISOString(),today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const writable=()=>editable&&(demo||token.startsWith('ld_'));
function status(s){$('#syncStatus').textContent=s;translate($('#syncStatus'));}
function notice(s='',retry=false){const el=$('#notice');el.hidden=!s;el.innerHTML=esc(s)+(retry?' <button data-retry>重新读取</button>':'');if(s)translate(el);}
const originalText=new WeakMap(),originalAttributes=new WeakMap();
function translate(root=document.body){
 const traditional=localStorageSafe('luliy-chinese-script')==='traditional';document.documentElement.lang=traditional?'zh-Hant':'zh-Hans';
 const convert=s=>traditional&&window.KaoyanScript?window.KaoyanScript(s):s;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement?.closest('[data-original],script,style,textarea,input')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});let n;while(n=walker.nextNode()){if(!originalText.has(n))originalText.set(n,n.nodeValue);n.nodeValue=convert(originalText.get(n));}
 for(const el of root.querySelectorAll?.('[aria-label],[placeholder],[title]')||[])if(!el.closest('[data-original]'))for(const k of ['aria-label','placeholder','title'])if(el.hasAttribute(k)){let attrs=originalAttributes.get(el);if(!attrs){attrs={};originalAttributes.set(el,attrs);}if(!(k in attrs))attrs[k]=el.getAttribute(k);el.setAttribute(k,convert(attrs[k]));}
}
function localStorageSafe(k){try{return localStorage.getItem(k)||''}catch{return ''}}
function parseRoute(){const [path,query='']=location.hash.slice(1).split('?'),parts=path.split('/').filter(Boolean),q=new URLSearchParams(query);return {page:['subject','records','settings'].includes(parts[0])?parts[0]:'overview',subject:ids.includes(parts[1])?parts[1]:'math2',tab:['daily','mocks','reviews','practice','legacy'].includes(parts[1])?parts[1]:'practice',view:q.get('view')==='map'?'map':'tree',node:q.get('node')||'',q:q.get('q')||'',unfinished:q.get('unfinished')==='1',day:q.get('day')||today()};}
function subjectURL(subject,options={}){const r={view:route?.view||'tree',node:'',q:route?.q||'',unfinished:route?.unfinished||false,...options},q=new URLSearchParams();if(r.view==='map')q.set('view','map');if(r.node)q.set('node',r.node);if(r.q)q.set('q',r.q);if(r.unfinished)q.set('unfinished','1');return '#/subject/'+subject+(q.size?'?'+q:'');}
function go(url,replace=false){if(replace){history.replaceState(null,'',url);render();}else if(location.hash===url)render();else location.hash=url;}
const pct=n=>{const ls=leafMap.get(n.id),done=ls.filter(x=>data.topics[x.id]?.done).length;return {done,total:ls.length,percent:ls.length?Math.round(done/ls.length*100):0};};
const liquidHistory=new Map();
const bar=p=>`<div class="bar" role="progressbar" ${loaded?'aria-valuenow="'+p+'"':'aria-valuetext="进度尚未读取"'} aria-valuemin="0" aria-valuemax="100" aria-label="知识点完成比例"><span style="width:${p}%"></span></div>`;
const heading=(en,title,desc,action='')=>`<div class="page-heading"><div><p class="eyebrow">${en}</p><h1>${title}</h1><p>${desc}</p></div>${action}</div>`;
const examLinks=[
 ['english','英语二真题','阅读、完形与整套模拟','https://luliy.me/works/gpt-english-2-exams.html','M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4z M20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3z'],
 ['math','数学二真题','历年真题与逐题解析','https://luliy.me/works/math2/','M5 5h14 M8 5l8 7-8 7h11 M5 19h2'],
 ['cs','408 真题','计算机真题与模拟练习','https://luliy.me/works/408/','M7 7h10v10H7z M10 10h4v4h-4z M9 3v4 M15 3v4 M9 17v4 M15 17v4 M3 9h4 M3 15h4 M17 9h4 M17 15h4'],
 ['formula','数学公式','数学一公式卡与复习工具','https://luliy.me/works/math-handbook/index.html','M4 13l4 6 4-14h8 M15 11l5 6 M20 11l-5 6'],
 ['all','22408 复习站','四科复习与练习工具','https://408.luliy.me/','M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z']
];
function frame(){
 $('#navigation').innerHTML=[['#/overview','总览',route.page==='overview'],...ids.map(id=>['#/subject/'+id,roots.get(id).title,route.page==='subject'&&route.subject===id]),['#/records/practice','学习记录',route.page==='records'],['#/settings','设置与资料',route.page==='settings']].map(([url,label,on])=>`<a href="${url}" ${on?'aria-current="page"':''}>${label}</a>`).join('');
 $('#todayLabel').textContent=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(new Date());
 $('#lastUpdated').textContent=lastUpdated?'最近更新 '+new Date(lastUpdated).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}):demo?'本地演示记录':'尚未取得更新时间';
 $('#loginButton').textContent=demo?'本地演示':writable()?'立即同步':'管理员登录';
 if(!$('#examLinks')){
  const section=document.createElement('section');section.className='exam-shortcuts';section.innerHTML='<h2>真题与工具</h2><nav id="examLinks" aria-label="真题与复习工具">'+examLinks.map(([color,title,description,url,path])=>`<a class="exam-link exam-${color}" href="${url}" target="_blank" rel="noopener" title="${description}（新标签页打开）" aria-label="${title}：${description}，新标签页打开"><span class="exam-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg></span><span>${title}</span><span class="exam-external" aria-hidden="true">↗</span></a>`).join('')+'</nav>';$('.sidebar-foot').before(section);
 }
}
function overview(){
 const day=data.settings.examDate||'2026-12-19',left=Math.round((Date.parse(day+'T00:00:00+08:00')-Date.parse(today()+'T00:00:00+08:00'))/86400000);
 const count=left>0?`${left}<small>天</small>`:left===0?'初试第一天':left===-1?'初试第二天':'本轮已结束';
 const vocab=stats.find(x=>x.subject==='english2')?.vocabulary;
 return heading('22408 · YOUR PROGRESS','考研进度','从全局到考点，一步一步确认自己的进展。')+`<section class="countdown" aria-label="考研倒计时"><div><p class="eyebrow">距离目标初试日</p><strong>${count}</strong></div><div class="date"><p>${esc(day)}</p><p>${Number(day.slice(0,4))+1} 考研 · 目标日期可调整</p></div></section><section class="subject-grid" aria-label="四科进度">${S.subjects.map(n=>{const p=pct(n);return `<a class="subject-card" data-subject="${n.subject}" data-progress="${loaded?p.done/p.total*100:0}" data-loaded="${loaded}" href="${subjectURL(n.subject,{view:'tree',q:'',unfinished:false})}"><div class="liquid-fill" aria-hidden="true" style="height:${loaded?p.done/p.total*100:0}%"><svg class="liquid-wave" viewBox="0 0 600 12" preserveAspectRatio="none"><path d="M0 6 Q75 0 150 6 T300 6 T450 6 T600 6 V12 H0Z"/></svg></div><div class="liquid-scrim" aria-hidden="true"></div><div class="card-head"><h2>${esc(n.title)}</h2><span aria-hidden="true">↗</span></div><p class="number">${loaded?p.percent+'%':'—'}<small>${loaded?p.done:'—'} / ${p.total} 个考点已完成</small></p><p class="card-note">${loaded?n.children.length+' 个模块 · 目录树与导图':'正在读取学习进度…'}</p>${n.subject==='english2'?`<div class="vocab-line"><span>词汇已学 ${vocab?.available?vocab.learned:'—'} / 5530</span><span>${vocab?.available?'已掌握 '+vocab.mastered:'等待词汇同步记录'}</span></div>`:''}</a>`}).join('')}</section><div class="section-row"><p>进度按末级考点计算，学习记录不自动勾选完成。</p><a href="#/records/practice">查看学习记录 →</a></div>`;
}
function matches(n){if(!n.children.length)return (!route.unfinished||!data.topics[n.id]?.done)&&(!route.q||[n.title,n.requirement,...ancestorNames(n)].join(' ').toLowerCase().includes(route.q.toLowerCase()));return n.children.some(matches);}
function ancestorNames(n){const out=[];let p=parentById.get(n.id);while(p){out.unshift(nodeById.get(p).title);p=parentById.get(p);}return out;}
function check(n){return `<label class="point-check"><input type="checkbox" data-point="${n.id}" aria-label="标记${esc(n.title)}已完成" ${data.topics[n.id]?.done?'checked':''} ${writable()?'':'disabled'}></label>`;}
function tree(n){
 if(!matches(n))return '';
 if(!n.children.length)return `<div class="point-row ${data.topics[n.id]?.done?'done':''} ${route.node===n.id?'selected':''}">${check(n)}<a href="${esc(subjectURL(route.subject,{node:n.id}))}" data-original>${esc(n.title)}</a><small>${!loaded?'未读取':data.topics[n.id]?.done?'✓ 已完成':'未完成'}</small></div>`;
 const p=pct(n),open=route.q||route.unfinished||expanded.has(n.id);
 return `<details data-branch="${n.id}" data-expected-open="${open?1:0}" ${open?'open':''}><summary><span class="branch-name" data-original>${esc(n.title)}</span><span class="branch-count">${loaded?p.done:'—'}/${p.total}</span><a class="branch-detail" href="${esc(subjectURL(route.subject,{node:n.id}))}" aria-label="查看${esc(n.title)}详情" onclick="event.stopPropagation()">↗</a></summary><div data-children="${n.id}">${open?n.children.map(tree).join(''):''}</div></details>`;
}
function details(n){
 if(!n)return '<aside class="detail"><div class="panel"><p class="eyebrow">KNOWLEDGE</p><h2>选择一个考点</h2><p class="muted">查看大纲要求、来源与完成记录。你可以逐项完成，也可以在章节详情中批量标记。</p></div></aside>';
 const leaf=!n.children.length,p=pct(n),r=data.topics[n.id],source=S.sources[n.source.document],supplement=n.source.origin==='supplement';
 return `<aside class="detail"><a class="detail-back" href="${esc(subjectURL(route.subject,{node:''}))}">← 返回知识树</a><div class="panel"><p class="eyebrow">${leaf?'KNOWLEDGE POINT':'CHAPTER'}</p><h2 data-original>${esc(n.title)}</h2><p class="muted" data-original>${esc(ancestorNames(n).slice(1).join(' / '))}</p>${leaf?`<div class="completion-state">${check(n)}<span>${!loaded?'状态尚未读取':r?.done?'✓ 已完成':'未完成'}</span></div>${r?.completedAt?`<p class="source">完成日期 ${esc(r.completedAt.slice(0,10))}</p>`:''}`:`<p>${loaded?p.done:'—'} / ${p.total} 个考点已完成</p>${bar(p.percent)}${writable()?`<div class="toolbar" style="margin-top:16px"><button data-batch="${n.id}" data-value="true">本章全部完成</button><button data-batch="${n.id}" data-value="false">全部改为未完成</button></div>`:''}`}<h3>${supplement?'学习补充':'大纲要求'}</h3><p data-original>${esc(n.requirement||'展开本章查看具体考点要求。')}</p><div class="source"><h3>来源</h3><p>${supplement?'学习补充，参考':'用户提供的大纲：'}</p><p data-original>${esc(source.name)} · PDF 第 ${n.source.page} 页</p>${supplement?'<p>此细分便于学习，不是原大纲逐项列出的清单。</p>':''}</div>${leaf?`<h3>学习备注</h3>${writable()?`<form id="noteForm" data-node="${n.id}"><textarea id="pointNote" rows="4" maxlength="2000" aria-label="学习备注" placeholder="学到了哪里、还需回顾什么">${esc(r?.note||'')}</textarea><button type="submit">保存备注</button></form>`:`<p data-original>${esc(r?.note||'暂无备注。')}</p>`}`:''}<h3>学习入口</h3>${practiceLink(n)}</div></aside>`;
}
function practiceLink(n){
 const link={english2:'https://luliy.me/works/gpt-english-2-exams.html',math2:'https://luliy.me/works/math2/','408':'https://luliy.me/works/408/'}[n.subject];
 return link?`<a class="practice-link" href="${link}" target="_blank" rel="noopener">打开${esc(roots.get(n.subject).title)}真题 ↗</a><p class="source">科目练习入口；未声称题目已对应此考点。</p>`:'<p class="muted">政治目前通过知识点勾选和学习记录补录进度。</p>';
}
function subject(){
 const root=roots.get(route.subject),p=pct(root),n=nodeById.get(route.node);if(n?.subject!==route.subject)route.node='';
 const vocab=stats.find(x=>x.subject==='english2')?.vocabulary;
 return heading('SYLLABUS · '+route.subject.toUpperCase(),esc(root.title),'按模块、章节和考点逐层查看，学完后由本人确认完成。')+`<div class="progress-summary"><span>${loaded?p.done:'—'} / ${p.total} 个考点已完成 · ${loaded?p.percent+'%':'尚未读取进度'}</span>${bar(loaded?p.percent:0)}</div>${vocab?.available&&route.subject==='english2'?`<div class="panel" style="margin-top:22px"><h3>词汇进度（单独统计）</h3><p>已学 ${vocab.learned} / 5530 · 已掌握 ${vocab.mastered} · 待复习 ${vocab.due}</p><a href="../gpt-english-2-exams.html" target="_blank" rel="noopener">进入英语词汇学习 ↗</a></div>`:''}<div class="toolbar" style="margin-top:24px"><div class="segmented"><a href="${esc(subjectURL(route.subject,{view:'tree',node:''}))}" ${route.view==='tree'?'aria-current="page"':''}>目录树</a><a href="${esc(subjectURL(route.subject,{view:'map',node:''}))}" ${route.view==='map'?'aria-current="page"':''}>导图</a></div><input type="search" id="knowledgeSearch" aria-label="搜索考点" placeholder="搜索考点或要求" value="${esc(route.q)}"><label><input type="checkbox" id="unfinished" ${route.unfinished?'checked':''} ${loaded?'':'disabled'}>只看未完成</label></div><div class="knowledge-layout" data-node-selected="${!!route.node}"><section class="knowledge-surface" aria-label="${esc(root.title)}知识树">${route.view==='tree'?`<div class="tree">${root.children.map(tree).join('')||'<p class="empty">没有匹配的考点。</p>'}</div>`:mapHTML(root)}</section>${details(route.node?nodeById.get(route.node):null)}</div>`;
}
let graph=null;
function mapHTML(root){
 let row=0;const nodes=[],edges=[];
 function layout(n,depth){if(!matches(n))return null;const x=depth*270+24,children=(route.q||route.unfinished||expanded.has(n.id))?n.children.map(c=>layout(c,depth+1)).filter(Boolean):[];const y=children.length?(children[0].y+children.at(-1).y)/2:(row++)*100+25;const item={n,x,y};nodes.push(item);for(const c of children)edges.push([item,c]);return item;}
 layout(root,0);const width=Math.max(260,...nodes.map(x=>x.x+240)),height=Math.max(180,row*100+60);graph={width,height};
 return `<div class="map-controls"><button data-map="out" aria-label="缩小导图">−</button><button data-map="in" aria-label="放大导图">＋</button><button data-map="fit">适应屏幕</button><button data-map="reset">100%</button><small>拖动平移 · 双指缩放 · 键盘方向键平移</small></div><div class="map-viewport" tabindex="0" aria-label="知识导图，可拖动或使用方向键平移"><div class="map-stage" style="width:${width}px;height:${height}px"><svg width="${width}" height="${height}" aria-hidden="true">${edges.map(([a,b])=>`<path d="M${a.x+208},${a.y+39} C${a.x+240},${a.y+39} ${b.x-32},${b.y+39} ${b.x},${b.y+39}"/>`).join('')}</svg>${nodes.map(({n,x,y})=>{const p=pct(n);return `<div class="map-node ${p.done===p.total&&loaded?'done':''} ${route.node===n.id?'selected':''}" style="left:${x}px;top:${y}px">${n.children.length?'':check(n)}<button class="map-label" data-select-node="${n.id}" title="${esc(n.title)}"><span data-original>${esc(n.title)}</span><small>${loaded?p.done:'—'} / ${p.total}${n.children.length?' 个考点':''}</small></button>${n.children.length?`<button class="map-toggle" data-expand="${n.id}" aria-expanded="${expanded.has(n.id)}" aria-label="展开或收起${esc(n.title)}">${expanded.has(n.id)?'−':'＋'}</button>`:''}</div>`}).join('')}</div></div><p class="map-caption">${nodes.length?'目录树与导图使用同一份完成状态。':'没有匹配的考点。'} 完整名称与要求可在详情中查看。</p>`;
}
function attachMap(){
 const vp=$('.map-viewport'),stage=$('.map-stage');if(!vp||!stage)return;
 const id=route.subject,pos=mapPositions[id]||{x:0,y:0,s:1},pointers=new Map();let dragging=false,gesture=null;
 const apply=()=>{stage.style.transform=`translate(${pos.x}px,${pos.y}px) scale(${pos.s})`;mapPositions[id]={...pos};};
 const zoom=(s,cx=vp.clientWidth/2,cy=vp.clientHeight/2)=>{const ns=Math.min(2,Math.max(.12,s)),ratio=ns/pos.s;pos.x=cx-(cx-pos.x)*ratio;pos.y=cy-(cy-pos.y)*ratio;pos.s=ns;apply();};
 const fit=()=>{pos.s=Math.min(1,(vp.clientWidth-35)/graph.width,(vp.clientHeight-35)/graph.height);pos.s=Math.max(.12,pos.s);pos.x=(vp.clientWidth-graph.width*pos.s)/2;pos.y=(vp.clientHeight-graph.height*pos.s)/2;apply();};
 vp.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,label'))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});vp.setPointerCapture(e.pointerId);dragging=true;if(pointers.size===2){const [a,b]=[...pointers.values()];gesture={distance:Math.hypot(a.x-b.x,a.y-b.y),s:pos.s};}});
 vp.addEventListener('pointermove',e=>{if(!dragging||!pointers.has(e.pointerId))return;const prev=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2&&gesture){const [a,b]=[...pointers.values()],rect=vp.getBoundingClientRect();zoom(gesture.s*Math.hypot(a.x-b.x,a.y-b.y)/gesture.distance,(a.x+b.x)/2-rect.left,(a.y+b.y)/2-rect.top);}else{pos.x+=e.clientX-prev.x;pos.y+=e.clientY-prev.y;apply();}});
 const end=e=>{pointers.delete(e.pointerId);gesture=null;if(!pointers.size)dragging=false;};vp.addEventListener('pointerup',end);vp.addEventListener('pointercancel',end);
 vp.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();const r=vp.getBoundingClientRect();zoom(pos.s*Math.exp(-e.deltaY*.002),e.clientX-r.left,e.clientY-r.top);},{passive:false});
 vp.addEventListener('keydown',e=>{if(e.target!==vp)return;const moves={ArrowLeft:[35,0],ArrowRight:[-35,0],ArrowUp:[0,35],ArrowDown:[0,-35]};if(moves[e.key]){e.preventDefault();pos.x+=moves[e.key][0];pos.y+=moves[e.key][1];apply();}if(['+','=','-','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')fit();else zoom(pos.s*(e.key==='-'?.85:1.15));}});
 for(const b of document.querySelectorAll('[data-map]'))b.onclick=()=>{if(b.dataset.map==='fit')fit();else if(b.dataset.map==='reset')zoom(1);else zoom(pos.s*(b.dataset.map==='out'?.8:1.25));};
 if(mapPositions[id])apply();else{pos.s=Math.max(.75,Math.min(1,(vp.clientWidth-35)/graph.width,(vp.clientHeight-35)/graph.height));pos.x=Math.max(16,(vp.clientWidth-graph.width*pos.s)/2);pos.y=(vp.clientHeight-graph.height*pos.s)/2;apply();}
}
function records(){
 const tab=route.tab,nav=[['practice','练习记录'],['daily','每日行动'],['mocks','模考成绩'],['reviews','复盘'],['legacy','旧进度核对']].map(([id,t])=>`<a href="#/records/${id}" ${tab===id?'aria-current="page"':''}>${t}</a>`).join('');
 let content='';
 if(tab==='practice')content=`<div class="record-grid">${['english2','math2','408'].map(id=>{const s=stats.find(x=>x.subject===id);return `<div class="metric"><h3>${esc(roots.get(id).title)}</h3><strong>${s?.available?s.answered:'—'} <small>道独立题目</small></strong><p class="muted">${s?.available?s.attempts:'—'} 条留存提交记录</p><p class="muted">${s?.available?'同一题重做不重复计入独立题量。':'尚无可读取的同步记录。'}</p><a href="${{english2:'../gpt-english-2-exams.html',math2:'../math2/','408':'../408/'}[id]}" target="_blank" rel="noopener">进入练习 ↗</a></div>`}).join('')}</div><p class="muted" style="margin-top:18px">统计当前留存的同步记录，不代表完整历史总量；不根据旧计时器推算每日时长。真题作答不会自动勾选知识点。</p><div class="section-row"><h2>考点学习备注</h2></div>${Object.entries(data.topics).filter(([id,r])=>nodeById.has(id)&&(r.note||r.done)).sort((a,b)=>b[1].updatedAt.localeCompare(a[1].updatedAt)).map(([id,r])=>`<article class="record-article"><header><a href="${subjectURL(nodeById.get(id).subject,{node:id,q:'',unfinished:false})}" data-original>${esc(nodeById.get(id).title)}</a><small>${r.done?'✓ 已完成':'未完成'} · ${esc(r.updatedAt.slice(0,10))}</small></header><p data-original>${esc(r.note)}</p></article>`).join('')||'<p class="empty">尚无学习记录。</p>'}`;
 if(tab==='daily'){
  const selected=P.days.find(d=>d.date===route.day)||P.days.find(d=>d.date===today())||P.days[0];
  content=`<div class="toolbar"><label>计划日期 <input type="date" id="dailyDate" min="${P.start}" max="${P.examEnd}" value="${selected.date}"></label><span class="muted">原68天计划，打卡不直接计入知识树进度。</span></div><section class="panel"><h2>${esc(selected.date)} · ${esc(selected.phase)}</h2>${selected.tasks.map(t=>{const id='d'+selected.day+'-'+t.subject;return `<article class="task"><label class="point-check"><input type="checkbox" data-task="${id}" aria-label="完成${esc(t.label)}任务" ${data.tasks[id]?.done?'checked':''} ${writable()?'':'disabled'}></label><div><h3 data-original>${esc(t.label)} · ${esc(t.focus)}</h3><small data-original>${esc(t.duration)}</small><p data-original>${esc(t.actions)}</p><p data-original>${esc(t.output)}</p></div></article>`}).join('')}<h3 style="margin-top:20px">当日简记</h3>${writable()?`<form id="dailyNoteForm" class="form-stack" data-date="${selected.date}"><textarea id="dailyNote" rows="4" maxlength="4000" aria-label="当日简记">${esc(data.dailyNotes[selected.date]?.text||'')}</textarea><button type="submit">保存简记</button></form>`:`<p data-original>${esc(data.dailyNotes[selected.date]?.text||'暂无简记。')}</p>`}</section>`;
 }
 if(tab==='mocks')content=`<div class="section-row"><p>原目标：政治65 · 英语二60 · 数学二95 · 408为95，总分315。</p>${writable()?'<button data-new-mock>＋ 记录成绩</button>':''}</div><div class="panel table-wrap"><table><thead><tr><th>日期／类型</th><th>政治</th><th>英语二</th><th>数学二</th><th>408</th><th>总分</th><th>操作</th></tr></thead><tbody>${data.mocks.map(m=>`<tr><td>${esc(m.date)}<br>${esc(m.kind)}${m.note?`<p data-original>${esc(m.note)}</p>`:''}</td>${ids.map(id=>`<td>${m[id]??'—'}</td>`).join('')}<td>${ids.every(id=>m[id]!==null)?ids.reduce((a,id)=>a+m[id],0):'分科记录'}</td><td>${writable()?`<button data-delete-mock="${esc(m.id)}">删除</button>`:'公开'}</td></tr>`).join('')||'<tr><td colspan="7">暂无模考记录。</td></tr>'}</tbody></table></div>`;
 if(tab==='reviews')content=`<div class="section-row"><h2>复盘记录</h2>${writable()?'<button data-new-review>＋ 写复盘</button>':''}</div>${data.reviews.map(r=>`<article class="panel record-article"><h3>${esc(r.date)}</h3><p><b>做得好的：</b><span data-original>${esc(r.wins||'—')}</span></p><p><b>待解决：</b><span data-original>${esc(r.gaps||'—')}</span></p><p><b>下周优先：</b><span data-original>${esc(r.next||'—')}</span></p></article>`).join('')||'<p class="empty">暂无复盘记录。</p>'}`;
 if(tab==='legacy'){
  const titles=new Map(P.knowledge.flatMap(s=>s.groups.flatMap(g=>g.topics.map(t=>[t.id,t.title])))),old=Object.entries(data.legacyTopics).filter(([,r])=>!r.resolved);
  content=`<div class="panel"><h2>旧进度待确认</h2><p class="muted">旧条目较粗，拆成多个考点后不会自动全部完成。请根据原标记核对新知识树；历史记录始终保留。</p><div class="legacy-list">${old.map(([id,r])=>`<p><span data-original>${esc(titles.get(id)||id)}</span> · ${esc(r.status)} ${writable()?`<button data-resolve-legacy="${esc(id)}">已核对</button>`:''}</p>`).join('')||'<p>没有待核对的旧进度。</p>'}</div></div>`;
 }
 return heading('LEARNING RECORDS','学习记录','每日行动、模考、复盘与自动练习记录集中保留。')+`<nav class="subnav" aria-label="学习记录分类">${nav}</nav>`+(!loaded?'<p class="notice">尚未取得公开记录，以下不代表本人没有学习记录。</p>':'')+content;
}
function settings(){return heading('SETTINGS · SOURCES','设置与资料','沿用主站字体与简繁偏好，日夜模式独立保存；学习记录公开查看，编辑需管理员登录。')+`<section class="panel"><h2>目标初试日</h2><form id="dateForm" class="toolbar" style="margin-top:18px"><label>考试日期 <input type="date" id="examDate" value="${data.settings.examDate}" required ${writable()?'':'disabled'}></label><button type="submit" ${writable()?'':'disabled'}>保存日期</button></form><p class="muted">当前为自设目标日期，具体考试安排以正式通知和准考证为准。</p></section><section class="panel"><h2>数据与备份</h2><p class="muted">管理员的离线修改保留在本机，联网后同步。访客只读取公开账号记录。</p><div class="toolbar" style="margin-top:15px"><button data-export>导出看板记录</button>${writable()?'<label>导入备份 <input type="file" id="importFile" accept="application/json,.json"></label>':''}<button data-retry>重新读取／同步</button></div>${demo?'<p>当前为本地演示，不会读取或修改线上个人记录。</p>':''}</section><section class="panel"><h2>大纲与统计依据</h2><p>${esc(S.edition)} · 版本 ${esc(S.revision)}</p>${Object.values(S.sources).map(x=>`<p data-original>${esc(x.name)} · ${x.pages} 页</p>`).join('')}<p class="muted">保留来源页码；学习补充与原文要求分别标注。政治、数学及408的明显排版错字已校正。词频原表的频次不等同于本站真题频次。</p></section>`;}
function applyMode(mode){
 const dark=mode==='dark',root=document.documentElement;root.dataset.appearance=dark?'dark':'light';root.dataset.theme=root.dataset.appearance;
 const button=$('#themeToggle');button.textContent=dark?'日间模式':'夜间模式';button.setAttribute('aria-label',dark?'切换至日间模式':'切换至夜间模式');button.setAttribute('aria-pressed',String(dark));
 originalText.delete(button.firstChild);originalAttributes.delete(button);translate(button);document.querySelector('meta[name="theme-color"]').content=dark?'#151614':'#faf9f5';
}
function animateLiquid(){
 for(const card of document.querySelectorAll('.subject-card')){
  const id=card.dataset.subject,value=Number(card.dataset.progress),known=card.dataset.loaded==='true',previous=liquidHistory.get(id),fill=card.querySelector('.liquid-fill');
  if(known&&previous!==undefined&&previous!==value&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   fill.animate([{height:previous+'%'},{height:value+'%'}],{duration:800,easing:'cubic-bezier(.22,.7,.28,1)'});
   if(value>0&&value<100)card.querySelector('.liquid-wave').animate([{transform:'scaleY(1)'},{transform:'scaleY(1.6)',offset:.35},{transform:'scaleY(.7)',offset:.65},{transform:'scaleY(1)'}],{duration:800});
  }
  if(known)liquidHistory.set(id,value);
 }
}
function render(){
 const active=document.activeElement,focus=active?.id,selection=typeof active?.selectionStart==='number'?[active.selectionStart,active.selectionEnd]:null,scroll=scrollY;
 const next=parseRoute();if(route&&(route.q!==next.q||route.unfinished!==next.unfinished))delete mapPositions[next.subject];route=next;if(route.page==='subject'&&route.node){let p=parentById.get(route.node);while(p){expanded.add(p);p=parentById.get(p);}}
 document.body.dataset.pointView=String(route.page==='subject'&&!!route.node);frame();$('#view').innerHTML=route.page==='overview'?overview():route.page==='subject'?subject():route.page==='records'?records():settings();
 animateLiquid();applyMode(document.documentElement.dataset.appearance);attachMap();translate();if(focus&&document.getElementById(focus)){const el=document.getElementById(focus);el.focus({preventScroll:true});if(selection)el.setSelectionRange(...selection);window.scrollTo(0,scroll);}
}
function persist(){data.updatedAt=now();if(!put(key,data)){status('本机存储空间不足；请立即导出备份');return false;}pending=!demo;if(demo){lastUpdated=data.updatedAt;status('本地演示 · 已保存');return true;}status(navigator.onLine?'本机已保存 · 等待同步':'离线 · 本机已保存');clearTimeout(timer);timer=setTimeout(sync,1200);return true;}
function setUndo(before,message){undo=before;clearTimeout(undoTimer);$('#undoBar').hidden=false;$('#undoText').textContent=message;translate($('#undoBar'));undoTimer=setTimeout(()=>{$('#undoBar').hidden=true;undo=null;},20000);}
function mark(id,done){if(!writable())return;const leaves=leafMap.get(id)||[],before={};for(const n of leaves){before[n.id]=data.topics[n.id]?{...data.topics[n.id]}:null;const r=data.topics[n.id]||{};data.topics[n.id]={...r,done,completedAt:done?(r.done?r.completedAt:now()):'',updatedAt:now(),note:r.note||''};}setUndo(before,`已将 ${leaves.length} 个考点标记为${done?'完成':'未完成'}`);persist();render();}
function applyUndo(){if(!undo||!writable())return;for(const [id,record]of Object.entries(undo))data.topics[id]={...(record||{}),done:record?.done===true,completedAt:record?.completedAt||'',note:record?.note||'',updatedAt:now()};undo=null;$('#undoBar').hidden=true;persist();render();}
async function request(path,method='GET',body,authenticated=false){const response=await fetch(API+path,{method,headers:{...(authenticated?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(15000)});let value;try{value=await response.json()}catch{value={};}if(!response.ok){const e=new Error(value.error||'读取失败');e.status=response.status;throw e;}return value;}
async function refreshPublic(){
 if(demo||writable()||document.hidden||publicBusy)return;publicBusy=true;
 try{const r=await request('/api/study/kaoyan-dashboard/public');if(r.schemaVersion!==2)throw Error('公开数据格式暂不可用');if(writable())return;data=C.migrate(r.data||{},allLeaves);loaded=true;stats=r.stats||[];lastUpdated=r.updatedAt||'';publicError='';notice(r.available?'':'本人尚未保存看板记录，知识树已就绪。');status('公开进度 · 只读');render();}
 catch(e){publicError=e.status===404?'公开看板接口尚未更新；大纲可浏览，个人进度暂未读取。':'暂时无法读取公开进度；请稍后点击重新读取。';notice(publicError,true);status('公开记录暂不可用');}
 finally{publicBusy=false;}
}
async function sync(){
 if(demo||!writable()||busy)return;busy=true;clearTimeout(timer);const auth=token;
 try{
  for(let i=0;i<3;i++){
   const r=await request('/api/study/kaoyan-dashboard','GET',undefined,true);if(token!==auth)return;
   if(r.publicOwner!==true)throw Error('请先更新后台并配置公开看板管理员');
   revision=r.revision||0;const cloud=C.migrate(r.data?.[C.STATE_KEY]||{},allLeaves);data=C.mergeState(data,cloud);loaded=true;
   const snapshot=JSON.stringify(data);let saved=r;
   if(snapshot!==JSON.stringify(cloud)||!revision){try{saved=await request('/api/study/kaoyan-dashboard','PUT',{revision,data:{[C.STATE_KEY]:snapshot}},true);}catch(e){if(e.status===409&&i<2)continue;throw e;}}
   if(token!==auth)return;revision=saved.revision||revision;pending=JSON.stringify(data)!==snapshot;put(key,data);lastUpdated=new Date((saved.updatedAt||Date.now()/1000)*1000).toISOString();status(pending?'本机有新修改 · 等待同步':'已同步 · 公开进度已更新');notice('');
   try{const p=await request('/api/study/kaoyan-dashboard/public');if(token!==auth)return;stats=p.stats||[];}catch{notice('个人记录已保存；公开练习统计暂时无法刷新。');}
   render();break;
  }
 }catch(e){if(e.status===401){token='';editable=false;sessionStorage.removeItem(TOKEN);pending=false;status('登录已失效，请重新登录');notice('本机修改已保留；登录后可以继续同步。');loaded=false;data=C.emptyState();render();refreshPublic();}else{pending=true;status('本机已保存 · 同步待重试');notice((e.status===413?'记录超出同步容量，请导出备份。':e.message));}}
 finally{busy=false;if(pending&&writable()&&navigator.onLine){clearTimeout(timer);timer=setTimeout(sync,30000);}}
}
async function unlock(value){
 token=value;status('正在验证管理员身份…');try{const r=await request('/api/study/kaoyan-dashboard','GET',undefined,true);if(r.publicOwner!==true)throw Error('后台尚未更新或当前账号不是公开看板管理员');
  const old=read(C.STATE_KEY,null),cloudRaw=(()=>{try{return JSON.parse(r.data?.[C.STATE_KEY]||'null')}catch{return null}})();
  if(((old&&old.version!==2)||(cloudRaw&&cloudRaw.version!==2))&&!localStorageSafe('luliy-kaoyan-dashboard-v1-backup')){if(!put('luliy-kaoyan-dashboard-v1-backup',{local:old,cloud:cloudRaw,backedUpAt:now()}))throw Error('无法备份旧记录，请先导出浏览器数据');}
  data=C.mergeState(C.migrate(old||{},allLeaves),C.migrate(r.data?.[C.STATE_KEY]||{},allLeaves));editable=true;loaded=true;sessionStorage.setItem(TOKEN,value);revision=r.revision||0;render();await sync();
 }catch(e){token='';editable=false;status('管理员验证未完成');notice(e.message);render();}}
function login(){
 if(demo){notice('本地演示使用独立记录，不会写入线上。');return;}if(writable()){sync();return;}if(location.protocol!=='https:'){notice('管理员登录需 HTTPS。可使用本地演示预览编辑交互。');return;}
 popup=window.open('about:blank','luliy-dashboard-login','width=500,height=650');if(!popup){notice('请允许 Telegram 登录弹窗。');return;}
 request('/api/drive/auth/start','POST').then(r=>{const url=new URL(r.url);if(url.origin!=='https://oauth.telegram.org')throw Error('登录地址无效');popup.location=url.href;status('请在弹窗完成授权');}).catch(e=>{popup?.close();popup=null;notice(e.message);});
}
function dialog(title,html){$('#editorTitle').textContent=title;$('#editorBody').innerHTML=html;translate($('#editor'));$('#editor').showModal();}
const uid=()=>crypto.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
function newMock(){if(!writable())return;dialog('记录模考成绩',`<form id="mockForm" class="form-stack"><label>日期<input type="date" name="date" value="${today()}" required></label><label>类型<select name="kind"><option>分科限时测</option><option>整套模拟</option><option>首日诊断</option><option>阶段模考</option></select></label><p class="muted">分科记录可只填参加的科目；未填项不会算作0分。</p><div class="form-grid">${ids.map(id=>`<label>${esc(roots.get(id).title)}（/${['politics','english2'].includes(id)?100:150}）<input type="number" name="${id}" min="0" max="${['politics','english2'].includes(id)?100:150}" step="0.5"></label>`).join('')}</div><label>备注<textarea name="note" maxlength="1200" rows="3"></textarea></label><button type="submit" class="primary">保存记录</button></form>`);}
function newReview(){if(!writable())return;dialog('写复盘',`<form id="reviewForm" class="form-stack"><label>日期<input type="date" name="date" value="${today()}" required></label><label>做得好的事<textarea name="wins" rows="2" maxlength="1000"></textarea></label><label>待解决的问题<textarea name="gaps" rows="3" maxlength="1500"></textarea></label><label>下周优先项<textarea name="next" rows="2" maxlength="1000"></textarea></label><button type="submit" class="primary">保存复盘</button></form>`);}
function exportData(){const a=document.createElement('a'),blob=new Blob([JSON.stringify({format:'luliy-kaoyan-dashboard',version:2,syllabusRevision:S.revision,data,...(writable()?{upgradeBackup:read('luliy-kaoyan-dashboard-v1-backup',null)}:{})},null,2)],{type:'application/json'});a.href=URL.createObjectURL(blob);a.download='LULIY-考研看板-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
document.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;
 if(target.matches('[data-close-dialog]'))$('#editor').close();
 if(target.id==='loginButton')login();if(target.id==='undoButton')applyUndo();
 if(target.id==='themeToggle'){const next=document.documentElement.dataset.appearance==='dark'?'light':'dark';try{localStorage.setItem('luliy-dashboard-mode-v1',next)}catch{}applyMode(next);}
 if(target.id==='scriptToggle'){try{localStorage.setItem('luliy-chinese-script',localStorageSafe('luliy-chinese-script')==='traditional'?'simplified':'traditional')}catch{}render();status(writable()?(demo?'本地演示 · 已保存':'管理员已登录'):'公开进度 · 只读');}
 if(target.dataset.batch)mark(target.dataset.batch,target.dataset.value==='true');
 if(target.dataset.expand){const id=target.dataset.expand;expanded.has(id)?expanded.delete(id):expanded.add(id);put('luliy-dashboard-expanded-v2',[...expanded]);render();}
 if(target.dataset.selectNode)go(subjectURL(route.subject,{node:target.dataset.selectNode}));
 if(target.hasAttribute('data-new-mock'))newMock();if(target.hasAttribute('data-new-review'))newReview();
 if(target.hasAttribute('data-export'))exportData();if(target.hasAttribute('data-retry'))writable()?sync():refreshPublic();
 if(target.dataset.deleteMock&&writable()){const id=target.dataset.deleteMock;data.deletedMocks[id]={updatedAt:now()};data.mocks=data.mocks.filter(m=>m.id!==id);persist();render();}
 if(target.dataset.resolveLegacy&&writable()){data.legacyTopics[target.dataset.resolveLegacy]={...data.legacyTopics[target.dataset.resolveLegacy],resolved:true,updatedAt:now()};persist();render();}
});
let searchTimer,draftTimer;
document.addEventListener('input',e=>{if(e.target.id==='knowledgeSearch'){const value=e.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>go(subjectURL(route.subject,{q:value,node:''}),true),200);}if(writable()&&['pointNote','dailyNote'].includes(e.target.id)){if(e.target.id==='pointNote'){const id=$('#noteForm').dataset.node;data.topics[id]={done:false,completedAt:'',...data.topics[id],note:e.target.value.slice(0,2000),updatedAt:now()};}else data.dailyNotes[$('#dailyNoteForm').dataset.date]={text:e.target.value.slice(0,4000),updatedAt:now()};clearTimeout(draftTimer);draftTimer=setTimeout(persist,500);}});
document.addEventListener('toggle',e=>{const el=e.target;if(!el.matches?.('details[data-branch]'))return;const id=el.dataset.branch;if(el.open){const host=el.querySelector('[data-children]');if(host&&!host.children.length){host.innerHTML=nodeById.get(id).children.map(tree).join('');translate(host);}}if(el.dataset.expectedOpen!==String(Number(el.open))){el.dataset.expectedOpen=String(Number(el.open));if(el.open)expanded.add(id);else expanded.delete(id);put('luliy-dashboard-expanded-v2',[...expanded]);}},true);
document.addEventListener('change',async e=>{
 const el=e.target;if(el.dataset.point)mark(el.dataset.point,el.checked);
 if(el.id==='unfinished')go(subjectURL(route.subject,{unfinished:el.checked,node:''}),true);
 if(el.id==='dailyDate')go('#/records/daily?day='+el.value);
 if(el.dataset.task&&writable()){data.tasks[el.dataset.task]={done:el.checked,updatedAt:now()};persist();}
 if(el.id==='importFile'&&writable()&&el.files?.[0]){try{if(el.files[0].size>1024*1024)throw Error('备份大于1MB，无法导入');const value=JSON.parse(await el.files[0].text());if(value.format!=='luliy-kaoyan-dashboard'||![1,2].includes(value.version))throw Error('备份格式不匹配');data=C.mergeState(data,C.migrate(value.data,allLeaves));persist();render();notice('备份已合并，较新的记录优先。');}catch(error){notice(error.message);}}
});
document.addEventListener('submit',e=>{
 const form=e.target;if(!['noteForm','dailyNoteForm','dateForm','mockForm','reviewForm'].includes(form.id))return;e.preventDefault();if(!writable())return;
 if(form.id==='noteForm'){const id=form.dataset.node;data.topics[id]={done:false,completedAt:'',...data.topics[id],note:$('#pointNote').value.slice(0,2000),updatedAt:now()};}
 if(form.id==='dailyNoteForm')data.dailyNotes[form.dataset.date]={text:$('#dailyNote').value.slice(0,4000),updatedAt:now()};
 if(form.id==='dateForm'){const value=$('#examDate').value;if(!/^\d{4}-\d\d-\d\d$/.test(value))return;data.settings={examDate:value,updatedAt:now()};}
 if(form.id==='mockForm'){const fd=new FormData(form),m={id:uid(),date:fd.get('date'),kind:fd.get('kind'),note:fd.get('note'),createdAt:now(),updatedAt:now()};for(const id of ids)m[id]=fd.get(id)===''?null:Number(fd.get(id));if(ids.every(id=>m[id]===null)){notice('请至少填写一科成绩。');return;}data.mocks.unshift(m);$('#editor').close();}
 if(form.id==='reviewForm'){const fd=new FormData(form);data.reviews.unshift({id:uid(),date:fd.get('date'),wins:fd.get('wins'),gaps:fd.get('gaps'),next:fd.get('next'),createdAt:now(),updatedAt:now()});$('#editor').close();}
 persist();render();
});
window.addEventListener('message',async e=>{if(e.origin!==API||e.source!==popup||e.data?.type!=='luliy-drive-login'||typeof e.data.code!=='string')return;try{const r=await request('/api/drive/auth/exchange','POST',{code:e.data.code});if(!r.token?.startsWith('ld_'))throw Error('登录未完成');popup?.close();popup=null;await unlock(r.token);}catch(err){notice(err.message);}});
window.addEventListener('hashchange',()=>{clearTimeout(searchTimer);render();window.scrollTo(0,0);});
window.addEventListener('online',()=>writable()?sync():refreshPublic());
window.addEventListener('storage',e=>{if(e.key==='luliy-dashboard-mode-v1')applyMode(e.newValue==='dark'?'dark':'light');if(e.key==='luliy-chinese-script')render();if(e.key===key&&writable()&&!demo){data=C.mergeState(data,C.migrate(e.newValue,allLeaves));render();sync();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(publicTimer);publicTimer=0;}else{writable()?sync():refreshPublic();scheduleRefresh();}});
function scheduleRefresh(){clearInterval(publicTimer);publicTimer=setInterval(()=>{if(document.hidden)return;$('#todayLabel').textContent=today();if(route.page==='overview')render();if(writable()){if(!demo)sync();else if(route.page==='overview')render();}else refreshPublic();},60000);}
$('#editor').addEventListener('click',e=>{if(e.target===$('#editor')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
if(demo){data=C.migrate(read(key,{}),allLeaves);lastUpdated=data.updatedAt;status('本地演示 · 不会同步线上');notice('本地演示模式：可勾选、批量操作、切换导图；使用独立记录，不会修改线上数据。');}
render();scheduleRefresh();if(!demo){refreshPublic();try{const value=sessionStorage.getItem(TOKEN);if(value?.startsWith('ld_'))unlock(value);}catch{}}
})();
