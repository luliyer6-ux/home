/* Pure shared source; build emits a classic browser wrapper and a Worker ES module. */
export const STATE_KEY='luliy-kaoyan-dashboard-v1';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const entries=x=>Object.entries(object(x));
const text=(x,n=4000)=>typeof x==='string'?x.slice(0,n):'';
const iso=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\dT/.test(x)&&Number.isFinite(Date.parse(x))?x:'';
const date=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\d$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x?x:'';
const safe=s=>{try{return object(typeof s==='string'?JSON.parse(s):s)}catch{return {}}};
export function emptyState(){return {version:2,tasks:{},dailyNotes:{},topics:{},legacyTopics:{},mocks:[],reviews:[],deletedMocks:{},baseline:null,settings:{examDate:'2026-12-19',updatedAt:''},updatedAt:''};}
export function publicState(input){
 const raw=safe(input),s=emptyState();s.updatedAt=iso(raw.updatedAt);
 for(const [k,v]of entries(raw.tasks))if(/^d\d+-(?:politics|english2|math2|408|review|exam)$/.test(k))s.tasks[k]={done:v?.done===true,updatedAt:iso(v?.updatedAt)};
 for(const [k,v]of entries(raw.dailyNotes))if(date(k))s.dailyNotes[k]={text:text(v?.text),updatedAt:iso(v?.updatedAt)};
 for(const [k,v]of entries(raw.topics)){
  if(!/^(politics|english2|math2|408)-[a-f0-9]{12}$/.test(k))continue;
  s.topics[k]={done:v?.done===true,completedAt:iso(v?.completedAt),updatedAt:iso(v?.updatedAt),note:text(v?.note,2000)};
 }
 for(const [k,v]of entries(raw.legacyTopics))if(/^[a-z0-9-]{1,100}$/.test(k))s.legacyTopics[k]={status:text(v?.status,30),updatedAt:iso(v?.updatedAt),resolved:v?.resolved===true};
 for(const m of (Array.isArray(raw.mocks)?raw.mocks:[]).slice(0,500)){
  if(!m||!text(m.id,100)||!date(m.date))continue;
  const x={id:text(m.id,100),date:m.date,kind:text(m.kind,60),note:text(m.note,1200),updatedAt:iso(m.updatedAt),createdAt:iso(m.createdAt)};
  for(const [k,max]of [['politics',100],['english2',100],['math2',150],['408',150]])x[k]=typeof m[k]==='number'&&Number.isFinite(m[k])&&m[k]>=0&&m[k]<=max?m[k]:null;
  s.mocks.push(x);
 }
 for(const r of (Array.isArray(raw.reviews)?raw.reviews:[]).slice(0,500))if(r&&text(r.id,100)&&date(r.date))s.reviews.push({id:text(r.id,100),date:r.date,wins:text(r.wins,1000),gaps:text(r.gaps,1500),next:text(r.next,1000),createdAt:iso(r.createdAt),updatedAt:iso(r.updatedAt)});
 for(const [k,v]of entries(raw.deletedMocks))if(/^[a-zA-Z0-9-]{1,100}$/.test(k))s.deletedMocks[k]={updatedAt:iso(v?.updatedAt)};
 s.settings={examDate:date(raw.settings?.examDate)||'2026-12-19',updatedAt:iso(raw.settings?.updatedAt)};
 if(date(raw.baseline?.date)&&Number.isFinite(raw.baseline?.total))s.baseline={date:raw.baseline.date,total:Math.min(500,Math.max(0,raw.baseline.total)),updatedAt:iso(raw.baseline.updatedAt)};
 return s;
}
export function migrate(input,leaves=[]){
 const raw=safe(input),out=publicState(raw),ids=new Set(leaves.map(n=>n.id));
 if(raw.version!==2)for(const [id,v]of entries(raw.topics)){
  if(ids.has(id))out.topics[id]={done:v?.status==='已掌握'||v?.done===true,updatedAt:iso(v?.updatedAt),completedAt:iso(v?.updatedAt),note:''};
  else if(/^[a-z0-9-]{1,100}$/.test(id))out.legacyTopics[id]={status:text(v?.status,30),updatedAt:iso(v?.updatedAt),resolved:false};
 }
 for(const [oldId,r]of entries(out.legacyTopics)){
  const leaf=leaves.find(n=>n.legacyIds?.includes(oldId));
  if(leaf&&!r.resolved){const previous=out.topics[leaf.id];if(!previous||previous.updatedAt<r.updatedAt)out.topics[leaf.id]={done:r.status==='已掌握',completedAt:r.status==='已掌握'?r.updatedAt:'',updatedAt:r.updatedAt,note:previous?.note||''};out.legacyTopics[oldId]={...r,resolved:true};}
 }
 return out;
}
export function mergeState(a,b){
 a=publicState(a);b=publicState(b);const out=emptyState();
 const later=(x,y)=>String(x?.updatedAt||'')>=String(y?.updatedAt||'')?x:y;
 for(const field of ['tasks','dailyNotes','topics','legacyTopics','deletedMocks']){
  out[field]={...a[field]};for(const [k,v]of entries(b[field]))out[field][k]=k in out[field]?later(out[field][k],v):v;
 }
 for(const field of ['mocks','reviews']){const map=new Map();for(const v of [...a[field],...b[field]])map.set(v.id,map.has(v.id)?later(map.get(v.id),v):v);out[field]=[...map.values()].sort((x,y)=>y.date.localeCompare(x.date));}
 out.mocks=out.mocks.filter(m=>!out.deletedMocks[m.id]||out.deletedMocks[m.id].updatedAt<m.updatedAt);
 out.baseline=!a.baseline?b.baseline:!b.baseline?a.baseline:later(a.baseline,b.baseline);
 out.settings=later(a.settings,b.settings);out.updatedAt=a.updatedAt>b.updatedAt?a.updatedAt:b.updatedAt;return out;
}
export function summarize(subject,snapshot,now=Date.now()){
 const keys={english2:['gpt-e2-exams-e2-learning-v3','gpt-e2-exams-alltypes-v1','gpt-e2-exams-vocab5530-v1'],math2:['math2-interactive-study-v1'],'408':['408-interactive-study-v2']};
 const has=k=>{try{const value=JSON.parse(snapshot?.[k]);return !!value&&typeof value==='object'&&!Array.isArray(value);}catch{return false;}};
 const result={subject,available:(subject==='english2'?keys.english2.slice(0,2):keys[subject]||[]).some(has),answered:0,attempts:0,latestAt:'',vocabulary:null};
 const questions=new Set(),attempts=new Set();
 const questionId=(prefix,key)=>/^\d{4}:/.test(String(key))?String(key):prefix+':'+key;
 const answers=(a,prefix,start=1)=>{for(const [k,v]of Object.entries(objectOrArray(a)))if(typeof v==='string'&&/^[A-GTF]$/.test(v))questions.add(questionId(prefix,Array.isArray(a)?Number(k)+start:k));};
 const record=(id,at)=>{attempts.add(String(id));if(typeof at==='number')at=Number.isFinite(at)&&Math.abs(at)<=8.64e15?new Date(at).toISOString():'';if(iso(at)>result.latestAt)result.latestAt=at;};
 const parse=k=>safe(snapshot?.[k]);
 if(subject==='math2'){
  const d=parse(keys.math2[0]);for(const [y,v]of entries(d.years)){answers(v?.answers,y);for(const [id,done]of entries(v?.done))if(done===true)questions.add(questionId(y,id));}
  for(const h of Array.isArray(d.history)?d.history:[]){answers(h.answers,h.year);for(const [id,grade]of entries(h.self))if(typeof grade==='number'&&Number.isFinite(grade))questions.add(questionId(h.year,id));record(h.id||JSON.stringify([h.year,h.mode,h.date,h.answers,h.self]),h.date);}
 }else if(subject==='408'){
  const d=parse(keys['408'][0]);for(const [y,v]of entries(d.byYear)){
   answers(v?.practice,y);answers(v?.mock,y);
   for(const mode of ['practice','mock'])for(const [n,t]of entries(v?.written?.[mode]))if(text(t).trim())questions.add(y+':'+n);
  }
  for(const h of Array.isArray(d.history)?d.history:[]){answers(h.answers,h.year);for(const [n,t]of entries(h.written))if(text(t).trim())questions.add(h.year+':'+n);record(h.id||JSON.stringify([h.year,h.mode,h.submittedAt,h.answers]),h.submittedAt);}
 }else if(subject==='english2'){
  const d=parse(keys.english2[1]);for(const [id,v]of entries(d.tasks)){
   const y=id.split(':')[0];answers(v?.answers,y);
   if(v?.submitted&&!v.attempts?.length)record('task:'+id+':'+v.updatedAt,v.updatedAt);
   for(const a of Array.isArray(v?.attempts)?v.attempts:[]){if(/:(translation|smallWriting|largeWriting)$/.test(id)&&text(a.text,20000).trim())questions.add(y+':'+id.split(':')[1]);record('submission:'+a.id,a.at);}
  }
  const subjective=(m,y)=>{for(const [type,value]of entries(m?.subjective))if(['translation','smallWriting','largeWriting'].includes(type)&&text(value,20000).trim())questions.add(y+':'+type);};
  const mockIds=new Set();for(const [y,m]of entries(d.mocks)){answers(m?.answers,y);subjective(m,y);if(m?.status==='done'){record('mock:'+m.id,m.finishedAt);mockIds.add(m.id);}}
  for(const h of Array.isArray(d.mockHistory)?d.mockHistory:[]){answers(h.answers,h.year);subjective(h,h.year);if(!mockIds.has(h.id))record('mock:'+h.id,h.finishedAt);}
  const old=parse(keys.english2[0]);for(const sub of ['cloze','reading'])for(const [y,modes]of entries(old.sessions?.[sub]))for(const [,v]of entries(modes))answers(v?.answers,y);
  for(const h of Array.isArray(old.records)?old.records:[])record('legacy:'+(h.id||JSON.stringify(h)),h.date);
  const vocab=parse(keys.english2[2]);let learned=0,mastered=0,due=0;
  for(const [id,r]of entries(vocab.records))if(/^v5530-\d{4}$/.test(id)&&(Number(r?.known)||0)+(Number(r?.unknown)||0)>0){learned++;if(r.mastered===true)mastered++;if(!r.mastered&&Number(r.due)<=now)due++;}
  result.vocabulary={available:has(keys.english2[2]),total:5530,learned:Math.min(5530,learned),mastered:Math.min(5530,mastered),due};
 }
 result.answered=questions.size;result.attempts=attempts.size;return result;
}
function objectOrArray(v){return Array.isArray(v)?v:object(v);}
