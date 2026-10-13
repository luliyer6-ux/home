/* Study records are synchronized only after a Telegram administrator signs in. */
(()=>{'use strict';
const tag=document.currentScript,subject=tag?.dataset.subject;
const KEYS={english2:['gpt-e2-exams-e2-learning-v3','gpt-e2-exams-ckw-shengciben-v1','gpt-e2-exams-alltypes-v1','gpt-e2-exams-vocab5530-v1','gpt-e2-vocab-diagnostic-v1'],math2:['math2-interactive-study-v1'],'408':['408-interactive-study-v2']};
if(!KEYS[subject])return;
const ENDPOINT='https://tg-s3.luliyer6.workers.dev',TOKEN='luliy-drive-session';
const button=document.createElement('button');button.type='button';button.className='exam-sync-button';button.textContent='同步进度';button.setAttribute('aria-haspopup','dialog');
const dialog=document.createElement('dialog');dialog.className='exam-sync-dialog';dialog.innerHTML='<div class="exam-sync-head"><strong>跨设备学习进度</strong><button type="button" data-close aria-label="关闭">×</button></div><p data-status role="status"></p><div class="exam-sync-actions"><button type="button" data-login>Telegram 登录</button><button type="button" data-upload>以本机记录为准</button><button type="button" data-download>以云端记录为准</button></div><p>同步当前科目的答题与学习记录。数学解题照片仍需通过完整备份迁移。模型密钥不会上传。</p>';
document.body.append(dialog);
const header=subject==='english2'?document.querySelector('#topbar .tools'):subject==='math2'?document.querySelector('.top-actions'):document.querySelector('header .controls:last-child');
(header||document.body).append(button);
const status=dialog.querySelector('[data-status]'),upload=dialog.querySelector('[data-upload]'),download=dialog.querySelector('[data-download]'),login=dialog.querySelector('[data-login]');
let token='',revision=0,remote=null,busy=false,active=false,last='',popup=null;
try{token=sessionStorage.getItem(TOKEN)||''}catch{}
const local=()=>{const data={};for(const key of KEYS[subject]){let value=null;try{value=localStorage.getItem(key)}catch{}if(value!==null)data[key]=value}return data};
const same=(a,b)=>JSON.stringify(a||{})===JSON.stringify(b||{});
const say=s=>{status.textContent=s;button.title=s};
const auth=()=>({Authorization:'Bearer '+token});
async function request(method,body){const r=await fetch(ENDPOINT+'/api/study/'+subject,{method,headers:{...auth(),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(15000)});let data={};try{data=await r.json()}catch{}if(!r.ok){const e=Error(data.error||'同步服务暂不可用');e.status=r.status;throw e}return data}
function choose(){upload.hidden=!remote||same(local(),remote);download.hidden=!remote||same(local(),remote);login.hidden=!!token}
async function inspect(){if(!token){say('请先通过 Telegram 管理员账号登录。');choose();return}try{const result=await request('GET');revision=result.revision;remote=result.data||{};const here=local();if(revision===0){await push();return}if(same(here,remote)){active=true;last=JSON.stringify(here);say('已同步。');choose();return}active=false;say('本机与云端记录不同。请先导出备份，再选择保留哪一份。');choose()}catch(e){active=false;if(e.status===401){token='';try{sessionStorage.removeItem(TOKEN)}catch{}}say(e.message);choose()}}
async function push(){if(!token||busy)return;busy=true;try{const here=local(),result=await request('PUT',{revision,data:here});revision=result.revision;remote=here;last=JSON.stringify(here);active=true;say('已同步。');choose()}catch(e){active=false;say(e.status===409?'另一设备已有新记录。请先导出本机备份，再选择保留哪一份。':e.message);if(e.status===409)await inspect();else choose()}finally{busy=false}}
async function pull(){if(!remote)return;for(const key of KEYS[subject]){try{if(Object.hasOwn(remote,key))localStorage.setItem(key,remote[key]);else localStorage.removeItem(key)}catch{say('本机存储空间不足，请先导出备份。');return}}active=true;last=JSON.stringify(local());say('云端记录已保存到本机，即将刷新页面。');location.reload()}
async function beginLogin(){if(location.protocol!=='https:'){say('Telegram 登录需要正式 HTTPS 网站。本地预览可查看界面。');return}popup=window.open('about:blank','luliy-exam-login','width=500,height=650');if(!popup){say('请允许登录弹窗。');return}try{const r=await fetch(ENDPOINT+'/api/drive/auth/start',{method:'POST',signal:AbortSignal.timeout(15000)}),data=await r.json();if(!r.ok)throw Error(data.error||'无法启动登录');const u=new URL(data.url);if(u.origin!=='https://oauth.telegram.org')throw Error('登录地址无效');popup.location=u.href;say('请在弹窗完成 Telegram 授权。')}catch(e){popup.close();say(e.message)}}
window.addEventListener('message',async e=>{if(e.origin!==ENDPOINT||e.source!==popup||e.data?.type!=='luliy-drive-login'||typeof e.data.code!=='string')return;try{const r=await fetch(ENDPOINT+'/api/drive/auth/exchange',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:e.data.code})}),data=await r.json();if(!r.ok||!data.token?.startsWith('ld_'))throw Error('登录未完成');token=data.token;sessionStorage.setItem(TOKEN,token);await inspect()}catch(err){say(err.message)}finally{popup=null}});
button.onclick=()=>{dialog.showModal();if(active&&JSON.stringify(local())!==last)push();else inspect()};dialog.querySelector('[data-close]').onclick=()=>dialog.close();upload.onclick=()=>{if(remote&&revision&&!confirm('将本机记录写入云端，覆盖云端此科进度？建议先导出备份。'))return;push()};download.onclick=()=>{if(!confirm('将云端记录恢复到本机，覆盖本机此科进度？建议先导出备份。'))return;pull()};login.onclick=beginLogin;
setInterval(()=>{if(!active||busy||document.hidden)return;const value=JSON.stringify(local());if(value!==last)push()},5000);
document.addEventListener('visibilitychange',()=>{if(document.hidden||!active)return;if(JSON.stringify(local())!==last)push();else inspect()});
if(token)inspect();else{say('登录后可跨设备同步。');choose()}
})();
