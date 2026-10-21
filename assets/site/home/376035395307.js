(()=>{
 'use strict';
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)'),touch=matchMedia('(max-width:1024px),(pointer:coarse)');
 const cc=()=>root.dataset.appearance==='cc';
 const tr=(zh,hant,en,ja)=>root.lang.startsWith('en')?en:root.lang.startsWith('ja')?ja:/Hant/i.test(root.lang)?hant:zh;
 let ambient=null,frame=0,last=0,points=[],visible=true,lastKeyboard=false;
 const frameEl=document.createElement('div');frameEl.className='cc-frame';frameEl.setAttribute('aria-hidden','true');
 const wraps=new Map(),fallbacks=new Map();let prepared=new WeakSet();
 const letterIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){letterIO.unobserve(e.target);write(e.target)}}),{threshold:.08});
 function resize(){
  if(!ambient)return;const ratio=Math.min(devicePixelRatio||1,1.25);ambient.width=Math.round(innerWidth*ratio);ambient.height=Math.round(innerHeight*ratio);
  let seed=21717;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  points=Array.from({length:touch.matches?160:720},()=>({x:rnd(),y:rnd(),r:.3+rnd()*.85,s:.2+rnd()*.8,p:rnd()*6.28}));
 }
 function request(){if(!frame&&cc()&&!document.hidden&&visible&&!reduce.matches)frame=requestAnimationFrame(draw)}
 function draw(now){frame=0;if(!cc()||document.hidden||!visible||reduce.matches)return;
  if(now-last<(touch.matches?65:40)){request();return}last=now;
  const c=ambient.getContext('2d'),w=ambient.width,h=ambient.height;c.clearRect(0,0,w,h);c.fillStyle=getComputedStyle(root).getPropertyValue('--ink')||'#e8e3d9';
  points.forEach(p=>{c.globalAlpha=.16+.32*(.5+.5*Math.sin(now*.0003+p.p));c.beginPath();c.arc(p.x*w,((p.y+now*.000002*p.s)%1)*h,p.r,0,6.29);c.fill()});
  request();
 }
 function write(block){
  if(!cc()||reduce.matches||!block.isConnected)return;
  const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.textContent.trim()&&!n.parentElement.closest('button,input,textarea,select,code,pre,svg,canvas,.signature,.contact-signature,.cc-written,[contenteditable],.sr-only,[aria-hidden="true"]')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  let delay=0;const step=touch.matches?12:24;
  nodes.forEach(node=>{const wrapper=document.createElement('span');wrapper.className='cc-written';const text=node.textContent;wraps.set(wrapper,text);
   const chars=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)].map(s=>s.segment):Array.from(text);
   const frag=document.createDocumentFragment();chars.forEach(char=>{const span=document.createElement('span');span.className='cc-letter';span.textContent=char;span.style.setProperty('--cc-letter-delay',Math.min(delay,9000)+'ms');frag.append(span);delay+=/[，。！？,.!?]/.test(char)?90:step});
   wrapper.append(frag);node.replaceWith(wrapper);
  });
 }
 function restoreWords(){letterIO.disconnect();for(const [w,text]of wraps){if(w.isConnected)w.replaceWith(document.createTextNode(text))}wraps.clear();prepared=new WeakSet();}
 function words(){if(!cc()||reduce.matches)return;document.querySelectorAll('#main h1,#main h2,#main h3,#main p,#main li,#main .study-entry-copy strong,#main .project-title h3').forEach(e=>{
  if(prepared.has(e)||e.closest('.signature,.contact-signature,.scene-static-status,.ld,[contenteditable],pre,code'))return;
  prepared.add(e);letterIO.observe(e);
 });}
 function mountCC(){
  if(!ambient){ambient=document.createElement('canvas');ambient.className='cc-ambient';ambient.setAttribute('aria-hidden','true');document.body.prepend(ambient);resize()}
  if(!frameEl.isConnected)document.body.append(frameEl);
  const stage=document.querySelector('.cc-opening .entrance-stage');
  if(stage&&!stage.querySelector('.cc-skip')){
   const skip=document.createElement('button');skip.type='button';skip.className='cc-skip';skip.textContent=tr('跳过展览，查看内容','跳過展覽，查看內容','Skip exhibition · view content','展示をスキップ');
   skip.onclick=()=>{const target=document.querySelector('.home-works,.home-articles');target?.scrollIntoView({behavior:'instant'});const link=target?.querySelector('a');link?.focus({preventScroll:true})};stage.append(skip);
  }
  const skipLabel=tr('跳过展览，查看内容','跳過展覽，查看內容','Skip exhibition · view content','展示をスキップ');
  const currentSkip=stage?.querySelector('.cc-skip');if(currentSkip&&currentSkip.textContent!==skipLabel)currentSkip.textContent=skipLabel;
  words();request();
 }
 function syncCC(){if(cc()){mountCC()}else{cancelAnimationFrame(frame);frame=0;restoreWords();if(ambient)ambient.getContext('2d').clearRect(0,0,ambient.width,ambient.height)}
  if(reduce.matches){cancelAnimationFrame(frame);frame=0;restoreWords()}
 }
 function ready(host,kind){
  if(host.classList.contains('has-fallback'))return false;
  if(kind==='records')return host.classList.contains('lr-webgl-ready')||host.dataset.exchangePhase;
  if(kind==='study')return host.classList.contains('is-ready')||!!host.querySelector('canvas');
  return !!host.querySelector('canvas');
 }
 function staticScene(host,kind){
  if(fallbacks.has(host))return;
  host.classList.add('scene-static-host');
  const poster=document.createElement('div');poster.className='scene-static-poster';poster.setAttribute('aria-hidden','true');
  const img=document.createElement('img');img.alt='';img.src='/assets/fallback/fallback-'+kind+'.svg';poster.append(img);
  const status=document.createElement('div');status.className='scene-static-status';
  const label=document.createElement('span');label.setAttribute('role','status');
  const link=document.createElement('a');link.href=kind==='records'?'#/music':kind==='study'?'#/books':'#/posts';
  const retry=document.createElement('button');retry.type='button';
  status.append(label,link,retry);host.append(poster,status);
  let timer=0,active=false,failed=false,forced=new URLSearchParams(location.hash.split('?')[1]||'').get('scene')==='static';
  function labels(){label.textContent=tr('静态预览 · 场景暂不可用','靜態預覽 · 場景暫不可用','Static preview · scene unavailable','静的プレビュー');link.textContent=kind==='records'?tr('唱片与播放控制','唱片與播放控制','Records & controls','レコードと操作'):kind==='study'?tr('进入书房','進入書房','Open study','書斎へ'):tr('阅读文章','閱讀文章','Read articles','記事を読む');retry.textContent=tr('重试场景','重試場景','Retry scene','再試行')}
  function set(value){active=value;host.classList.toggle('scene-static-active',value);labels()}
  function check(){if(forced||failed)return set(true);if(ready(host,kind))set(false);else if(host.classList.contains('has-fallback'))set(true)}
  const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!timer){check();timer=setTimeout(()=>{timer=0;if(!ready(host,kind)||forced)set(true)},8000)}else if(!entries.some(e=>e.isIntersecting)){clearTimeout(timer);timer=0}},{threshold:.01});io.observe(host);
  const mo=new MutationObserver(check);mo.observe(host,{attributes:true,attributeFilter:['class','data-exchange-phase'],childList:true});
  host.addEventListener('webglcontextlost',()=>{failed=true;set(true)},true);
  host.addEventListener('webglcontextrestored',()=>{failed=false;check()},true);
  retry.onclick=()=>{forced=false;failed=false;set(false);if(kind==='study'&&window.LuliyHomepageRetry)window.LuliyHomepageRetry().then(ok=>{if(!ok)set(true)});else window.dispatchEvent(new HashChangeEvent('hashchange'))};
  check();fallbacks.set(host,Object.assign(()=>{clearTimeout(timer);io.disconnect();mo.disconnect();poster.remove();status.remove()},{refresh:labels}));
 }
 function scenes(){
  for(const [host,dispose]of fallbacks)if(!host.isConnected){dispose();fallbacks.delete(host)}
  document.querySelectorAll('.galaxy-field').forEach(h=>staticScene(h,'galaxy'));
  document.querySelectorAll('.home-study-display,.study-room-stage').forEach(h=>staticScene(h,'study'));
  document.querySelectorAll('.lr-scene').forEach(h=>staticScene(h,'records'));
 }
 /* Native dialog already traps focus. Supplement only visible custom aria-modal panels. */
 function focusables(parent){return [...parent.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]')].filter(e=>!e.disabled&&e.tabIndex>=0&&!e.closest('[hidden],[inert]')&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden')}
 document.addEventListener('keydown',e=>{
  lastKeyboard=true;
  if(e.key!=='Tab')return;
  const modal=[...document.querySelectorAll('[aria-modal="true"]')].reverse().find(e=>e.tagName!=='DIALOG'&&e.getClientRects().length&&!e.closest('[hidden],[inert]'));
  if(!modal)return;const items=focusables(modal);if(!items.length){e.preventDefault();modal.tabIndex=-1;modal.focus();return}
  const first=items[0],last=items.at(-1);if(e.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))){e.preventDefault();first.focus()}
 });
 document.addEventListener('pointerdown',()=>lastKeyboard=false,{passive:true});
 let scanTimer=0;
 const gates=new Map();
 function gatePending(){
  for(const [el,observer]of gates)if(!el.isConnected){observer.disconnect();gates.delete(el)}
  document.querySelectorAll('#main .reveal.pending').forEach(el=>{
   const style=getComputedStyle(el);
   if(gates.has(el)||el.inert||(Number(style.opacity)>.05&&style.visibility!=='hidden'&&style.display!=='none'))return;
   el.inert=true;
   const observer=new MutationObserver(()=>{if(!el.classList.contains('pending')){el.inert=false;observer.disconnect();gates.delete(el)}});
   observer.observe(el,{attributes:true,attributeFilter:['class']});gates.set(el,observer);
  });
 }
 function scan(){scanTimer=0;scenes();gatePending();if(cc())mountCC();document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(b=>{if(!b.textContent.trim()&&b.title)b.setAttribute('aria-label',b.title)})}
 function schedule(ms=90){clearTimeout(scanTimer);scanTimer=setTimeout(scan,ms)}
 function start(){
  const main=document.querySelector('#main');if(main)new MutationObserver(ms=>{if(ms.every(m=>m.target.closest?.('.cc-written,.cc-letter,.scene-static-status,.cc-moon')))return;schedule()}).observe(main,{childList:true,subtree:true});
  new MutationObserver(()=>{syncCC();fallbacks.forEach(dispose=>dispose.refresh());schedule()}).observe(root,{attributes:true,attributeFilter:['data-appearance','lang']});
  syncCC();scan();
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else request()});
 addEventListener('resize',resize);
 addEventListener('hashchange',()=>{restoreWords();schedule(180);if(lastKeyboard)setTimeout(()=>document.querySelector('#main')?.focus({preventScroll:true}),220)});
 reduce.addEventListener('change',syncCC);
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
