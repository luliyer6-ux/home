(async()=>{
async function readJSON(url){const c=new AbortController(),t=setTimeout(()=>c.abort(),20000);try{const r=await fetch(url,{signal:c.signal});if(!r.ok)throw Error('文件加载失败 '+r.status);return await r.json()}finally{clearTimeout(t)}}
try{
const manifest=await readJSON('./data/manifest.json');
const exams=Object.fromEntries(manifest.years.map(y=>[y,null])),answerKeys=manifest.answerKeys,assets=manifest.assets;
async function ensureYear(y){if(exams[y])return;const qs=await readJSON('./data/'+y+'.json');if(!Array.isArray(qs)||qs.length!==47)throw Error('题目资料不完整');exams[y]=qs}
let first='2026';try{const s=JSON.parse(localStorage.getItem('408-interactive-study-v2')||localStorage.getItem('408-interactive-answer-v1')||'{}');if(manifest.years.includes(String(s.settings?.year)))first=String(s.settings.year)}catch(e){}
await ensureYear(first);
const years=Object.keys(exams).sort((a,b)=>Number(a)-Number(b)),letters=['A','B','C','D'];
const STORE='408-interactive-study-v2',LEGACY='408-interactive-answer-v1',KEY_VERSION='user-pdf-20261010';
const $=id=>document.getElementById(id),plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v),escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ===== 考点演示(viz)集成 =====
 * 映射文件 works/408/viz/mapping.json 由考点演示侧产出,此处按需懒加载;
 * 加载失败或某题无映射时入口按钮保持隐藏,不抛错、不影响原有功能。
 * 不新增任何 localStorage key。 */
const VIZ={map:null,loading:null,failed:false,labels:{},subjects:{},entries:[]};
function vizModuleIdOk(id){return typeof id==='string'&&/^[a-z0-9][a-z0-9-]{0,40}$/.test(id)}
async function ensureVizMap(){
 if(VIZ.map||VIZ.failed)return VIZ.map;
 if(VIZ.loading)return VIZ.loading;
 VIZ.loading=(async()=>{try{
  const r=await fetch('./viz/mapping.json');
  if(!r.ok)throw Error('viz mapping missing');
  const m=await r.json(),out={};
  if(m&&typeof m==='object'&&m.modules&&typeof m.modules==='object')
   for(const [id,info] of Object.entries(m.modules))
    if(vizModuleIdOk(id)&&info&&typeof info.label==='string'){VIZ.labels[id]=info.label;VIZ.subjects[id]=String(info.subject||'其他')}
  const put=(y,q,ids)=>{y=String(y);const n=Number(q);
   if(!years.includes(y)||!Number.isInteger(n)||n<1||n>47)return;
   const list=(Array.isArray(ids)?ids:[ids]).filter(vizModuleIdOk);
   if(list.length){out[y+':'+n]=[...new Set(list)];VIZ.entries.push({year:y,question:n,modules:out[y+':'+n]})}};
  if(m&&typeof m==='object'){
   if(Array.isArray(m.entries))for(const e of m.entries){if(e&&typeof e==='object')put(e.year,e.question,e.modules)}
   else if(Array.isArray(m))for(const e of m){if(e&&typeof e==='object')put(e.year??e.y,e.question??e.q??e.n,e.modules??e.module)}
   else if(Array.isArray(m.links))for(const e of m.links){if(e&&typeof e==='object')put(e.year,e.question,e.modules)}
   else for(const [y,qs] of Object.entries(m)){
    if(y==='modules'||y==='meta'||y==='schema')continue;
    if(qs&&typeof qs==='object')for(const [q,ids] of Object.entries(qs))put(y,q,ids)}
  }
  VIZ.map=out;
 }catch(e){VIZ.failed=true;VIZ.map=null}
 return VIZ.map})();
 return VIZ.loading;
}
function vizModulesFor(y,q){const m=VIZ.map;return m?(m[String(y)+':'+Number(q)]||[]):[]}
function vizLabel(id){return VIZ.labels[id]||id}
let storageAvailable=true;
function readStore(key){try{const v=JSON.parse(localStorage.getItem(key)||'{}');return plain(v)?v:{}}catch(e){return {}}}
const saved=readStore(STORE),legacy=readStore(LEGACY),raw=plain(saved.byYear)?saved:legacy;
let store={byYear:plain(raw.byYear)?raw.byYear:{},history:Array.isArray(raw.history)?raw.history:[],settings:plain(raw.settings)?raw.settings:{}},year=years.includes(String(raw.settings?.year))?String(raw.settings.year):'2026',mode=raw.settings?.mode==='mock'?'mock':'practice';
try{const py=new URLSearchParams(location.search).get('year');if(py&&years.includes(py))year=py}catch(e){}
await ensureYear(year); /* 演示模块页"返回原题"带 ?year= 时确保该年数据已加载 */
let currentQ=0,wrongOnly=false,mockRunning=false,lastTick=Date.now(),clockVisible=!document.hidden,timerHandle=null,topicQueue=null,vizReturnFocus=null,topicReturnFocus=null;
function uid(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}
function fresh(){return {practice:Array(40).fill(null),mock:Array(40).fill(null),written:{practice:{},mock:{}},assessment:{practice:{},mock:{}},practiceDone:false,mockStarted:false,mockSubmitted:false,mockRemaining:null,mockElapsed:0,practiceElapsed:0,mockLimitMinutes:null,practiceQ:0,mockQ:0,practiceId:uid(),mockId:uid()}}
function cleanState(input){const r=plain(input)?input:{},s={...fresh(),...r};for(const name of ['practice','mock'])s[name]=Array.from({length:40},(_,i)=>letters.includes(r[name]?.[i])?r[name][i]:null);
 const cleanNotes=w=>plain(w)?Object.fromEntries(Object.entries(w).filter(([k,v])=>Number(k)>=41&&Number(k)<=47&&typeof v==='string').map(([k,v])=>[k,v.slice(0,200000)])):{};
 const old=plain(r.written)&&!plain(r.written.practice)&&!plain(r.written.mock)?cleanNotes(r.written):null;s.written={practice:old?{...old}:cleanNotes(r.written?.practice),mock:old?{...old}:cleanNotes(r.written?.mock)};
 const cleanAssessment=x=>plain(x)?Object.fromEntries(Object.entries(x).filter(([n,v])=>Number(n)>=41&&Number(n)<=47&&plain(v)).map(([n,v])=>[n,{level:['clear','partial','wrong'].includes(v.level)?v.level:'',cause:typeof v.cause==='string'?v.cause.slice(0,500):''}])):{};
 s.assessment={practice:cleanAssessment(r.assessment?.practice),mock:cleanAssessment(r.assessment?.mock)};
 for(const name of ['practiceDone','mockStarted','mockSubmitted'])s[name]=r[name]===true;
 for(const name of ['practiceQ','mockQ'])s[name]=Number.isInteger(r[name])&&r[name]>=0&&r[name]<47?r[name]:0;
 for(const name of ['mockElapsed','practiceElapsed'])s[name]=Number.isFinite(r[name])&&r[name]>=0?r[name]:0;
 s.mockRemaining=r.mockRemaining===null||r.mockRemaining===undefined?null:Number.isFinite(r.mockRemaining)&&r.mockRemaining>=0?r.mockRemaining:null;
 s.mockLimitMinutes=Number.isInteger(r.mockLimitMinutes)&&r.mockLimitMinutes>=1&&r.mockLimitMinutes<=300?r.mockLimitMinutes:null;
 for(const name of ['practiceId','mockId'])s[name]=typeof r[name]==='string'&&r[name].length<200?r[name]:s[name];delete s.mockDeadline;return s}
for(const y of years)if(plain(store.byYear[y]))store.byYear[y]=cleanState(store.byYear[y]);
function state(){if(!plain(store.byYear[year]))store.byYear[year]=fresh();return store.byYear[year]}
function active(){return state()[mode]}
function outcome(a=active(),y=year){return {correct:a.reduce((n,v,i)=>n+(v===answerKeys[y][i]?1:0),0),answered:a.filter(v=>letters.includes(v)).length}}
function validHistory(h){return plain(h)&&years.includes(String(h.year))&&['practice','mock'].includes(h.mode)&&Array.isArray(h.answers)&&h.answers.length===40&&h.answers.every(v=>v===null||letters.includes(v))&&typeof h.id==='string'&&h.id.length<200&&Number.isFinite(h.elapsed)&&h.elapsed>=0}
function normalizeHistory(h){const o=outcome(h.answers,String(h.year));return {...h,year:String(h.year),written:plain(h.written)?h.written:{},correct:o.correct,answered:o.answered,keyVersion:KEY_VERSION,regraded:typeof h.correct==='number'&&h.correct!==o.correct||h.regraded===true}}
store.history=store.history.filter(validHistory).map(normalizeHistory);
function addRecord(y,m,s,legacyRecord=false){const id=s[m+'Id'];if(store.history.some(h=>h.id===id))return;const a=s[m].slice(),o=outcome(a,y),h={id,year:y,mode:m,answers:a,written:{...s.written[m]},assessment:{...s.assessment?.[m]},correct:o.correct,answered:o.answered,elapsed:s[m+'Elapsed'],submittedAt:legacyRecord?null:new Date().toISOString(),keyVersion:KEY_VERSION,migrated:legacyRecord};if(legacyRecord&&store.history.some(v=>historyFingerprint(v)===historyFingerprint(h)))return;store.history.push(h)}
for(const y of years){const s=store.byYear[y];if(s){if(s.practiceDone)addRecord(y,'practice',s,true);if(s.mockSubmitted)addRecord(y,'mock',s,true)}}
function save(){store.settings={...store.settings,year,mode};try{localStorage.setItem(STORE,JSON.stringify(store));storageAvailable=true}catch(e){storageAvailable=false}}
function renderStatus(message=''){const s=state();$('status').textContent=!storageAvailable?'浏览器未允许本地保存，请导出备份以保留本次作答。':message||(mode==='mock'&&s.mockStarted&&!s.mockSubmitted?(mockRunning?'模拟进行中 · 离开页面会暂停':'模拟已暂停 · 点击“继续模拟”恢复'):'已自动保存 · 可导出备份迁移至其他设备')}
function done(){return mode==='mock'?state().mockSubmitted:state().practiceDone}
function revealed(){return done()||(mode==='practice'&&currentQ<40&&active()[currentQ]!==null)}
function canAnswer(){return mode==='mock'?mockRunning&&!done():!done()&&(currentQ>=40||active()[currentQ]===null)}
function visibleQuestions(){return Array.from({length:47},(_,i)=>i).filter(i=>!wrongOnly||(i<40?active()[i]!==answerKeys[year][i]:['wrong','partial'].includes(state().assessment[mode][i+1]?.level)))}
function rememberQuestion(){state()[mode+'Q']=currentQ;save()}
function gotoQuestion(q){if(!Number.isInteger(q)||q<0||q>=47)return;currentQ=q;rememberQuestion();renderGrid();renderQuestion();renderTopicQueue();$('questionArea').scrollIntoView?.({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
function moveQuestion(direction){const ids=visibleQuestions(),j=ids.indexOf(currentQ);if(ids[j+direction]!==undefined)gotoQuestion(ids[j+direction])}
function formatTime(seconds){const n=Math.ceil(Math.max(0,seconds||0));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function syncRun(){const now=Date.now(),delta=Math.max(0,(now-lastTick)/1000);lastTick=now;const s=state();if(mode==='mock'&&mockRunning){s.mockElapsed+=delta;if(s.mockRemaining!==null)s.mockRemaining=Math.max(0,s.mockRemaining-delta)}else if(mode==='practice'&&clockVisible&&!s.practiceDone)s.practiceElapsed+=delta}
function pauseMock(message='模拟已暂停 · 点击“继续模拟”恢复'){syncRun();if(!mockRunning){save();return}mockRunning=false;save();setModeControls();renderQuestion();renderTimer();renderStatus(message)}
function sourceFragment(fragment,kind='paper',caption=''){const id=kind==='paper'?`p-${year}-${fragment.p}`:fragment.asset,asset=assets[id];if(!asset)return '<p class="notice">原稿片段暂未匹配。</p>';const b=fragment.box,w=b[2]-b[0],h=b[3]-b[1];return `<figure class="source-fragment"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${b[0]} ${b[1]} ${w} ${h}" role="img" aria-label="${escapeHTML(caption||'原稿内容')}"><image width="${asset.w}" height="${asset.h}" data-src="${asset.src}"/></svg>${caption?`<figcaption>${escapeHTML(caption)}</figcaption>`:''}</figure>`}
function optionGraphic(f){return sourceFragment(f,'paper').match(/<svg[\s\S]*?<\/svg>/)?.[0]||''}
function renderGrid(){const ids=visibleQuestions(),a=active();$('qgrid').innerHTML=ids.length?ids.map(i=>{let c='qnum';if(i===currentQ)c+=' current';const picked=i<40?a[i]:state().written[mode][i+1];if(picked)c+=' answered';if(i<40&&(done()||mode==='practice'&&picked!==null))c+=a[i]===answerKeys[year][i]?' correct':a[i]===null?' blank-after':' wrong';if(i>=40){const level=state().assessment[mode][i+1]?.level;if(level==='clear')c+=' correct';if(level==='wrong'||level==='partial')c+=' wrong'}return `<button class="${c}" data-q="${i}" aria-label="第 ${i+1} 题" ${i===currentQ?'aria-current="true"':''}>${i+1}</button>`}).join(''):'<p class="empty">暂无待复习题目。</p>';$('qgrid').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>gotoQuestion(Number(b.dataset.q)))}
function renderQuestion(){const ids=visibleQuestions();if(!ids.length){$('questionArea').innerHTML='';$('prevQ').disabled=true;$('nextQ').disabled=true;return}if(!ids.includes(currentQ))currentQ=ids[0];const q=exams[year][currentQ],s=state(),picked=currentQ<40?active()[currentQ]:null,show=revealed(),locked=!canAnswer();
 let content=`<div class="question-title">第 ${q.n} 题 <span class="badge">${q.n<=40?'单项选择 · 2 分':'综合应用 · 自行核对'}</span><button id="vizOpen" class="viz-link-btn" hidden>关联学习</button></div><div class="stem">${q.preciseSource?q.stemSource.map(f=>sourceFragment(f,'paper')).join(''):q.stem.map(t=>`<p>${escapeHTML(t)}</p>`).join('')}</div>`;
 if(!q.preciseSource)content+=q.figures.map(f=>sourceFragment(f,'paper')).join('');
 if(q.n<=40){content+=q.imageOptions?'<p class="hint">本题选项为原题图形，点击图形或 A–D 作答。</p>':'';content+='<div class="options'+(q.optionImages?' image-options':'')+'">'+letters.map(l=>{let c='option';if(picked===l)c+=' chosen';if(show&&answerKeys[year][currentQ]===l)c+=' correct';if(show&&picked===l&&picked!==answerKeys[year][currentQ])c+=' incorrect';return `<button class="${c}" data-opt="${l}" aria-label="选项 ${l}" ${locked?'disabled':''}><span class="option-letter">${l}</span><span class="option-content">${q.optionImages?.[l]?optionGraphic(q.optionImages[l]):escapeHTML(q.options[l]||'原题图形选项 '+l)}</span></button>`}).join('')+'</div>';if(show){const ok=picked===answerKeys[year][currentQ];content+=`<div class="feedback ${ok?'ok':'bad'}">${picked?`你的答案：${picked} · ${ok?'正确':'错误'}`:'未作答'}　正确答案：<b>${answerKeys[year][currentQ]}</b></div>`}}
 else content+='<label class="response-label" for="writtenAnswer">我的作答</label><textarea id="writtenAnswer" rows="8" placeholder="记录解题过程、代码或答案要点…" '+(locked?'disabled':'')+'></textarea>';
 if(mode==='mock'&&!mockRunning&&!done())content+=`<p class="notice">${s.mockStarted?'模拟已暂停，请继续后作答。':'点击“开始模拟”后作答。'}</p>`;
 content+=`<details class="original"><summary>查看原题 · 第 ${q.source.map(f=>f.p+1).join('、')} 页（公式、图表可对照原稿）</summary>${q.source.map(f=>sourceFragment(f,'paper',`${year} 年 · 试卷第 ${f.p+1} 页`)).join('')}</details>`;
 if(q.dispute&&show)content+=`<p class="notice">${escapeHTML(q.dispute)}</p>`;
 const allowAnalysis=mode==='practice'?(q.n>40||show):done();
 if(allowAnalysis){content+=`<details class="analysis" ${q.n<=40?'open':''}><summary>答案与解析 · 离线可用</summary><p class="source-name">来源：${escapeHTML(q.analysisSource||'用户提供的解析 PDF')}</p>${q.analysis.map(f=>sourceFragment(f,'answer',`解析原稿 · 第 ${f.p+1} 页`)).join('')}${q.analysis.length?'':'<p class="notice">该题解析尚未完成定位。</p>'}</details>`}else content+='<p class="hint">'+(mode==='practice'?'作答后显示本题答案与解析。':'交卷后统一显示答案与解析。')+'</p>';
 if(q.n>40&&allowAnalysis){const record=s.assessment[mode][q.n]||{};content+=`<section class="subjective-review"><strong>对照解析后自评</strong><div class="subjective-options">${[['clear','已掌握'],['partial','部分掌握'],['wrong','仍不会']].map(([value,label])=>`<button type="button" data-level="${value}" aria-pressed="${record.level===value}">${label}</button>`).join('')}</div><label>错因或待复习点 <input id="subjectiveCause" maxlength="500" value="${escapeHTML(record.cause||'')}" placeholder="例如：地址转换步骤遗漏"></label><small>自评只用于复习，不计入客观题自动分数。</small></section>`}
 $('questionArea').innerHTML=content;$('questionArea').querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>selectAnswer(b.dataset.opt));
 wireVizButton(q);
 if(q.n>40){const el=$('writtenAnswer');el.value=s.written[mode][q.n]||'';el.addEventListener('input',()=>{if(!canAnswer())return;state().written[mode][q.n]=el.value;save();renderGrid();renderProgress()})}
 if(q.n>40&&allowAnalysis){const persist=()=>{const h=store.history.find(v=>v.id===s[mode+'Id']);if(h)h.assessment={...s.assessment[mode]};save()};$('questionArea').querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{const record=s.assessment[mode][q.n]||{};record.level=b.dataset.level;s.assessment[mode][q.n]=record;persist();renderGrid();renderQuestion();renderResult()});$('subjectiveCause').onchange=e=>{const record=s.assessment[mode][q.n]||{};record.cause=e.target.value.slice(0,500);s.assessment[mode][q.n]=record;persist()}}
 const j=ids.indexOf(currentQ);$('prevQ').disabled=j<=0;$('nextQ').disabled=j>=ids.length-1;document.title=`${year} 年 408 真题 · 第 ${q.n} 题`;hydrateImages()}
function selectAnswer(l){if(!letters.includes(l)||currentQ>=40||!canAnswer())return;active()[currentQ]=l;rememberQuestion();renderGrid();renderQuestion();renderProgress();renderStatus()}
function renderProgress(){const o=outcome(),notes=Object.values(state().written[mode]).filter(v=>v.trim()).length;$('progressText').textContent=`选择题 ${o.answered}/40 · 综合题 ${notes}/7`;$('progress').style.width=`${o.answered/40*100}%`}
function setModeControls(){const s=state();$('year').value=year;$('mode').value=mode;$('durationWrap').hidden=mode!=='mock';$('duration').disabled=s.mockStarted;$('start').hidden=mode!=='mock';$('start').disabled=s.mockSubmitted;$('start').textContent=mockRunning?'暂停模拟':s.mockStarted&&!s.mockSubmitted?'继续模拟':'开始模拟';$('submit').hidden=mode!=='mock';$('submit').disabled=!s.mockStarted||s.mockSubmitted;$('submit').textContent=s.mockSubmitted?'已交卷':'交卷';$('finishPractice').hidden=mode!=='practice';$('finishPractice').disabled=s.practiceDone;$('wrongToggle').disabled=!done();$('wrongToggle').textContent=wrongOnly?'全部题目':'错题';$('modeLabel').textContent=mode==='practice'?'逐题练习':'整套模拟'}
function renderResult(){const el=$('result');el.hidden=!done();if(!done()){el.innerHTML='';return}const o=outcome(),review=Object.values(state().assessment[mode]||{}),weak=review.filter(v=>v.level==='wrong'||v.level==='partial').length;el.innerHTML=`<strong>${o.correct} / 40 · ${o.correct*2} / 80</strong><p>正确率 ${Math.round(o.correct/40*100)}% · 已答 ${o.answered} 题 · 用时 ${formatTime(state()[mode+'Elapsed'])}</p><p class="hint">综合题已自评 ${review.filter(v=>v.level).length}/7，待复习 ${weak} 题。自评与客观分数分开显示。</p>`}
function renderTimer(){const s=state();$('timer').textContent=mode==='mock'&&s.mockStarted&&!s.mockSubmitted?(mockRunning?'':'已暂停 · ')+(s.mockRemaining===null?'不限时':formatTime(s.mockRemaining)):`用时 ${formatTime(s[mode+'Elapsed'])}`}
function render(){setModeControls();renderProgress();renderGrid();renderQuestion();renderResult();renderTimer();renderTopicQueue();save();renderStatus()}
function startMock(){syncRun();const s=state();if(s.mockSubmitted)return;if(mockRunning){pauseMock();return}if(!s.mockStarted){const t=$('duration').value.trim();if(t!==''&&(!/^\d+$/.test(t)||Number(t)<1||Number(t)>300)){renderStatus('限时请输入 1–300 的整数分钟，或留空不限时。');$('duration').focus();return}s.mockLimitMinutes=t===''?null:Number(t);s.mockRemaining=s.mockLimitMinutes===null?null:s.mockLimitMinutes*60;s.mockElapsed=0;s.mockStarted=true}if(s.mockRemaining!==null&&s.mockRemaining<=0){submitMock(true);return}mockRunning=true;lastTick=Date.now();save();render()}
function submitMock(auto=false){const s=state();if(!s.mockStarted||s.mockSubmitted)return;const blanks=40-outcome(s.mock).answered;if(!auto&&blanks&&!confirm(`还有 ${blanks} 道选择题未答，将按错误计。现在交卷吗？`))return;syncRun();mockRunning=false;s.mockSubmitted=true;wrongOnly=false;addRecord(year,'mock',s);render();renderStatus(auto?'计时结束，已自动交卷并保存成绩。':'已交卷并保存成绩。')}
function finishPractice(){const s=state();if(s.practiceDone)return;const blanks=40-outcome(s.practice).answered;if(blanks&&!confirm(`还有 ${blanks} 道选择题未答，将按错误计。完成练习吗？`))return;syncRun();s.practiceDone=true;wrongOnly=false;addRecord(year,'practice',s);render();renderStatus('练习成绩已记录。')}
function resetYear(){if(!confirm(`重新开始 ${year} 年的${mode==='practice'?'练习':'模拟'}？已保存的成绩历史会保留。`))return;syncRun();mockRunning=false;const s=state(),f=fresh();for(const k of Object.keys(f))if(k.startsWith(mode))s[k]=f[k];s.written[mode]={};s.assessment[mode]={};wrongOnly=false;currentQ=0;lastTick=Date.now();$('duration').value='';render()}
function restoreQuestion(){currentQ=state()[mode+'Q'];$('duration').value=state().mockLimitMinutes??''}
async function switchYear(y){if(y===year||!years.includes(y))return;pauseMock();$('year').disabled=true;renderStatus('正在加载 '+y+' 年题目…');try{await ensureYear(y)}catch(e){$('year').value=year;renderStatus('加载失败，请重新选择年份重试：'+e.message);return}finally{$('year').disabled=false}year=y;wrongOnly=false;restoreQuestion();lastTick=Date.now();render()}
function switchMode(m){if(m===mode||!['practice','mock'].includes(m))return;pauseMock();mode=m;if(m==='mock')topicQueue=null;wrongOnly=false;restoreQuestion();lastTick=Date.now();render()}
function toggleWrong(){if(!done())return;wrongOnly=!wrongOnly;const ids=visibleQuestions();if(ids.length&&!ids.includes(currentQ))currentQ=ids[0];rememberQuestion();setModeControls();renderGrid();renderQuestion()}
function historyAssessments(h){const labels={clear:'已掌握',partial:'部分掌握',wrong:'仍不会'};return Object.entries(h.assessment||{}).filter(([,v])=>v?.level||v?.cause).map(([n,v])=>`<p class="hint">综合题 ${escapeHTML(n)} · ${labels[v.level]||'未评'}${v.cause?' · 错因：'+escapeHTML(v.cause):''}</p>`).join('')}
function renderHistory(){const hs=[...store.history].sort((a,b)=>String(b.submittedAt||'').localeCompare(String(a.submittedAt||'')));$('historyList').innerHTML=hs.length?hs.map(h=>{const o=outcome(h.answers,h.year);return `<details class="history-record"><summary><b>${h.year} · ${h.mode==='practice'?'练习':'模拟'}</b><span>${o.correct*2}/80 · ${formatTime(h.elapsed)}</span></summary><p>${h.submittedAt?escapeHTML(new Date(h.submittedAt).toLocaleString('zh-CN')):'从旧版保存结果迁移'} · 正确 ${o.correct}/40 · 已答 ${o.answered}/40</p><div class="history-answers">${h.answers.map((a,i)=>`<span class="${a===answerKeys[h.year][i]?'ok':'bad'}">${i+1}. ${a||'未答'}<small>答案 ${answerKeys[h.year][i]}</small></span>`).join('')}</div><p class="hint">综合题作答 ${Object.values(h.written).filter(t=>typeof t==='string'&&t.trim()).length}/7</p>${historyAssessments(h)}${Object.entries(h.written).filter(([n,t])=>typeof t==='string'&&t.trim()).map(([n,t])=>`<details><summary>综合题 ${escapeHTML(n)}</summary><pre>${escapeHTML(t)}</pre></details>`).join('')}</details>`}).join(''):'<p class="empty">完成练习或交卷后，成绩会保存在这里。</p>';$('historyCount').textContent=String(hs.length)}
function openHistory(){renderHistory();$('historyDrawer').hidden=false;$('historyButton').setAttribute('aria-expanded','true')}
function closeHistory(){$('historyDrawer').hidden=true;$('historyButton').setAttribute('aria-expanded','false')}
function backupObject(){syncRun();save();return {schema:'408-study-backup',version:2,exportedAt:new Date().toISOString(),byYear:store.byYear,history:store.history,settings:{year,mode}}}
function exportBackup(){const text=JSON.stringify(backupObject(),null,2),url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='408学习备份_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);renderStatus('备份已导出，可在另一设备导入。')}
function historyFingerprint(h){return JSON.stringify([h.year,h.mode,h.answers,h.written,h.elapsed,h.submittedAt])}
function hasProgress(s){return ['practice','mock'].some(m=>Array.isArray(s[m])&&s[m].some(v=>letters.includes(v)))||s.practiceDone||s.mockStarted||s.mockSubmitted||Object.values(s.written||{}).some(notes=>plain(notes)&&Object.values(notes).some(t=>typeof t==='string'&&t.trim()))||Object.values(s.assessment||{}).some(group=>plain(group)&&Object.values(group).some(v=>v?.level||v?.cause))}
async function mergeBackup(input){if(!plain(input)||!(input.schema==='408-study-backup'&&input.version===2||plain(input.byYear)&&!input.schema))throw Error('这不是有效的 408 学习备份。');if(!plain(input.byYear)||input.history!==undefined&&!Array.isArray(input.history))throw Error('备份结构不完整。');if(years.includes(String(input.settings?.year)))await ensureYear(String(input.settings.year));pauseMock();let progress=0,conflicts=0,records=0;
 const hadProgress=Object.values(store.byYear).some(hasProgress),importedLegacy=[];for(const [y,r] of Object.entries(input.byYear)){if(!years.includes(y)||!plain(r))continue;const incoming=cleanState(r);if(!Array.isArray(input.history)){if(incoming.practiceDone)importedLegacy.push([y,'practice',incoming]);if(incoming.mockSubmitted)importedLegacy.push([y,'mock',incoming])}if(!plain(store.byYear[y])||!hasProgress(store.byYear[y])){store.byYear[y]=incoming;progress++}else{conflicts++;for(const m of ['practice','mock']){for(const [n,t] of Object.entries(incoming.written[m]))if(!store.byYear[y].written[m][n])store.byYear[y].written[m][n]=t;for(const [n,v] of Object.entries(incoming.assessment[m]))if(!store.byYear[y].assessment[m][n])store.byYear[y].assessment[m][n]=v}}}
 const knownId=new Set(store.history.map(h=>h.id)),knownFP=new Set(store.history.map(historyFingerprint));for(const h of input.history||[]){if(!validHistory(h))continue;const clean=normalizeHistory(h),fp=historyFingerprint(clean);if(!knownId.has(clean.id)&&!knownFP.has(fp)){store.history.push(clean);knownId.add(clean.id);knownFP.add(fp);records++}}
 for(const [y,m,s] of importedLegacy)addRecord(y,m,s,true);for(const y of years){const s=store.byYear[y];if(s){if(s.practiceDone)addRecord(y,'practice',s,true);if(s.mockSubmitted)addRecord(y,'mock',s,true)}}
 if(!hadProgress&&plain(input.settings)){if(years.includes(String(input.settings.year)))year=String(input.settings.year);if(['practice','mock'].includes(input.settings.mode))mode=input.settings.mode}restoreQuestion();render();renderHistory();renderStatus(`导入完成：新增 ${progress} 套进度、${records} 条成绩；${conflicts} 套已有进度保留当前作答。`);return {progress,conflicts,records}}
async function importFile(file){if(!file)return;try{if(file.size>30*1024*1024)throw Error('备份文件超过 30 MB，请检查所选文件。');await mergeBackup(JSON.parse(await file.text()))}catch(e){renderStatus('导入失败：'+e.message)}finally{$('importFile').value=''}}

function vizLoadModule(body,id,q){
 const src='./viz/index.html?module='+encodeURIComponent(id)+(q?'&year='+encodeURIComponent(year)+'&q='+q.n:'');
 body.innerHTML='<iframe title="考点演示 · '+escapeHTML(vizLabel(id))+'" src="'+src+'"></iframe>';
}
function openVizDrawer(mods,q){
 vizReturnFocus=document.activeElement;
 $('vizBack').textContent='返回原题';
 $('vizTitle').textContent=year+' 年第 '+q.n+' 题 · 关联学习';
 const body=$('vizBody');body.innerHTML='';
 if(mods.length===1){vizLoadModule(body,mods[0],q)}
 else{const list=document.createElement('div');list.className='viz-mod-list';
  mods.forEach((m,i)=>{const b=document.createElement('button');b.textContent='演示 '+(i+1)+' · '+vizLabel(m);b.onclick=()=>vizLoadModule(body,m,q);list.append(b)});
  body.append(list)}
 $('vizDrawer').hidden=false;$('vizClose').focus();
}
function closeViz(){if($('vizDrawer').hidden)return;$('vizDrawer').hidden=true;const b=$('vizBody');if(b)b.innerHTML='';if(vizReturnFocus?.isConnected)vizReturnFocus.focus();vizReturnFocus=null}
function wireVizButton(q){
 const btn=$('vizOpen');if(!btn)return;
 if(!(mode==='practice'||done()))return; /* 模拟交卷前隐藏入口 */
 ensureVizMap().then(()=>{
  const mods=vizModulesFor(year,q.n),b=$('vizOpen');
  if(!b||!mods.length)return; /* 无映射:优雅隐藏,不报错 */
  b.hidden=false;b.textContent=mods.length>1?'关联学习('+mods.length+')':'关联学习';
  b.onclick=()=>openVizDrawer(mods,q);
 });
}
function topicQuestions(id){return VIZ.entries.filter(e=>e.modules.includes(id)).sort((a,b)=>Number(b.year)-Number(a.year)||a.question-b.question)}
function topicWrong(e){const a=store.byYear[e.year]?.practice?.[e.question-1];return e.question<=40&&letters.includes(a)&&a!==answerKeys[e.year]?.[e.question-1]}
function topicStatus(e){const a=store.byYear[e.year]?.practice?.[e.question-1];if(e.question>40)return '综合题';if(!letters.includes(a))return '未答';return a===answerKeys[e.year]?.[e.question-1]?'正确':'错题'}
function renderTopics(){const subject=$('topicSubject').value,term=$('topicSearch').value.trim().toLocaleLowerCase();const ids=Object.keys(VIZ.labels).filter(id=>(!subject||VIZ.subjects[id]===subject)&&(!term||(VIZ.labels[id]+' '+VIZ.subjects[id]).toLocaleLowerCase().includes(term)));$('topicList').innerHTML=ids.length?ids.map(id=>{const qs=topicQuestions(id),wrong=qs.filter(topicWrong),label=escapeHTML(VIZ.labels[id]);return `<section class="topic-item"><h3>${label}</h3><p>${escapeHTML(VIZ.subjects[id])} · 关联 ${qs.length} 道真题${wrong.length?' · 错题 '+wrong.length+' 道':''}</p><div class="topic-actions"><button data-topic="${id}" data-action="demo">查看演示</button>${qs.length?`<button data-topic="${id}" data-action="practice">按年份练习</button>${wrong.length?`<button data-topic="${id}" data-action="wrong">回看错题</button>`:''}<button data-topic="${id}" data-action="questions" aria-expanded="false">查看题目</button>`:''}</div><div class="topic-questions" hidden>${qs.map(e=>`<button data-year="${e.year}" data-q="${e.question}" aria-label="${e.year} 年第 ${e.question} 题，${topicStatus(e)}">${e.year} · ${e.question} <small>${topicStatus(e)}</small></button>`).join('')}</div></section>`}).join(''):'<p class="empty">没有匹配的考点。</p>';for(const b of $('topicList').querySelectorAll('[data-topic]'))b.onclick=()=>{const id=b.dataset.topic,action=b.dataset.action;if(action==='demo'){openTopicDemo(id);return}if(action==='practice'||action==='wrong'){startTopicPractice(id,action==='wrong');return}const list=b.closest('.topic-item').querySelector('.topic-questions');list.hidden=!list.hidden;b.setAttribute('aria-expanded',String(!list.hidden))};for(const b of $('topicList').querySelectorAll('[data-year]'))b.onclick=()=>openTopicQuestion(b.dataset.year,Number(b.dataset.q))}
async function openTopics(){topicReturnFocus=document.activeElement;$('topicsDrawer').hidden=false;$('topicsButton').setAttribute('aria-expanded','true');$('topicList').innerHTML='<p class="empty">正在加载考点…</p>';$('topicSearch').focus();await ensureVizMap();if($('topicsDrawer').hidden)return;if(!VIZ.map){$('topicList').innerHTML='<p class="empty">考点暂时无法加载。请检查网络后刷新页面重试。</p>';return}renderTopics()}
function closeTopics(){if($('topicsDrawer').hidden)return;$('topicsDrawer').hidden=true;$('topicsButton').setAttribute('aria-expanded','false');if(topicReturnFocus?.isConnected)topicReturnFocus.focus();topicReturnFocus=null}
function openTopicDemo(id){closeTopics();vizReturnFocus=$('topicsButton');$('vizBack').textContent='关闭演示';$('vizTitle').textContent=vizLabel(id)+' · 考点演示';vizLoadModule($('vizBody'),id,null);$('vizDrawer').hidden=false;$('vizClose').focus()}
async function openTopicQuestion(y,n){closeTopics();if(mode!=='practice')switchMode('practice');if(wrongOnly){wrongOnly=false;setModeControls();renderGrid()}if(y!==year)await switchYear(y);if(year===y)gotoQuestion(n-1)}
async function startTopicPractice(id,wrong=false){const entries=topicQuestions(id).filter(e=>!wrong||topicWrong(e));if(!entries.length)return;topicQueue={id,entries};await openTopicQuestion(entries[0].year,entries[0].question);renderTopicQueue()}
function renderTopicQueue(){const el=$('topicQueue');el.hidden=!topicQueue;if(!topicQueue)return;const entries=topicQueue.entries,index=entries.findIndex(e=>e.year===year&&e.question===currentQ+1);$('topicQueueTitle').textContent=vizLabel(topicQueue.id);$('topicQueueCount').textContent=index<0?'当前题目不在该专题':`${index+1} / ${entries.length}`;$('topicPrev').disabled=index<=0;$('topicNext').disabled=index<0||index>=entries.length-1}
async function moveTopic(direction){if(!topicQueue)return;const entries=topicQueue.entries,index=entries.findIndex(e=>e.year===year&&e.question===currentQ+1),target=entries[index+direction];if(target)await openTopicQuestion(target.year,target.question)}
function hydrateImages(){
 const area=$('questionArea');
 const load=()=>area.querySelectorAll('image[data-src]').forEach(img=>{const detail=img.closest('details');if(!detail||detail.open){img.setAttribute('href',img.getAttribute('data-src'));img.removeAttribute('data-src')}});
 area.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',load));load();
}

$('year').innerHTML=years.map(y=>`<option value="${y}">${y} 年</option>`).join('');restoreQuestion();try{const qn=Number(new URLSearchParams(location.search).get('q'));if(Number.isInteger(qn)&&qn>=1&&qn<=47){currentQ=qn-1;rememberQuestion()}}catch(e){}render();try{if(new URLSearchParams(location.search).get('q')!==null)$('questionArea').scrollIntoView()}catch(e){}
$('year').onchange=()=>switchYear($('year').value);$('mode').onchange=()=>switchMode($('mode').value);$('start').onclick=startMock;$('submit').onclick=()=>submitMock(false);$('finishPractice').onclick=finishPractice;$('reset').onclick=resetYear;$('wrongToggle').onclick=toggleWrong;$('prevQ').onclick=()=>moveQuestion(-1);$('nextQ').onclick=()=>moveQuestion(1);$('historyButton').onclick=openHistory;$('historyClose').onclick=closeHistory;$('topicsButton').onclick=openTopics;$('topicsClose').onclick=closeTopics;$('topicSubject').onchange=renderTopics;$('topicSearch').oninput=renderTopics;$('topicPrev').onclick=()=>moveTopic(-1);$('topicNext').onclick=()=>moveTopic(1);$('topicExit').onclick=()=>{topicQueue=null;renderTopicQueue()};$('vizClose').onclick=closeViz;$('vizBack').onclick=closeViz;$('exportButton').onclick=exportBackup;$('importButton').onclick=()=>$('importFile').click();$('importFile').onchange=()=>importFile($('importFile').files[0]);$('topButton').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
$('qgridToggle').onclick=()=>{const expanded=document.body.classList.toggle('qgrid-open');$('qgridToggle').setAttribute('aria-expanded',String(expanded));$('qgridToggle').textContent=expanded?'收起题号':'展开题号'};
document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseMock();clockVisible=false}else{clockVisible=true;lastTick=Date.now()}save()});window.addEventListener('pagehide',()=>{pauseMock();clockVisible=false;save()});window.addEventListener('beforeunload',()=>{pauseMock();save()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('vizDrawer').hidden)closeViz();else if(!$('topicsDrawer').hidden)closeTopics();else closeHistory()}});
timerHandle=setInterval(()=>{syncRun();save();renderTimer();if(mode==='mock'&&mockRunning&&state().mockRemaining!==null&&state().mockRemaining<=0)submitMock(true)},1000);

}catch(e){const el=document.getElementById('status');el.textContent='加载失败，请检查网络后重试。';const b=document.createElement('button');b.textContent='重新加载';b.onclick=()=>location.reload();el.append(' ',b);console.error(e)}
})();
