const LIMIT=4*1024*1024;
function reply(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
async function bounded(stream,limit=LIMIT){if(!stream)return '';const reader=stream.getReader(),chunks=[];let n=0;try{while(true){const {done,value}=await reader.read();if(done)break;n+=value.byteLength;if(n>limit){await reader.cancel();throw Error('备份过大（最多 4 MB）')}chunks.push(value)}}finally{reader.releaseLock()}const out=new Uint8Array(n);let offset=0;for(const v of chunks){out.set(v,offset);offset+=v.length}return new TextDecoder().decode(out)}
async function telegram(token,method,body){const form=body instanceof FormData;const r=await fetch(`https://api.telegram.org/bot${token}/${method}`,{method:'POST',headers:form?{}:{'Content-Type':'application/json'},body:form?body:JSON.stringify(body),signal:AbortSignal.timeout(25000)});const data=JSON.parse(await bounded(r.body));if(!r.ok||!data.ok){const code=data.error_code;throw Error(code===401?'机器人 Token 无效':code===429?'Telegram 请求频繁，请稍后重试':code===403?'请先在 Telegram 中启动机器人，并确认未屏蔽它':'Telegram 操作失败，请检查 Chat ID、机器人权限或网络')}return data.result}
function valid(data){return data&&typeof data==='object'&&Array.isArray(data.tasks)&&Array.isArray(data.subj)&&data.subj.length>0&&data.subj.length<=24&&data.hist&&typeof data.hist==='object'&&!Array.isArray(data.hist)&&data.tasks.length<=2000&&data.tasks.every(t=>t&&typeof t.name==='string'&&typeof t.cat==='string'&&Number.isFinite(t.hours)&&t.hours>=0&&t.hours<=24)}
async function latest(token,chat){const info=await telegram(token,'getChat',{chat_id:chat});if(info.type!=='private')throw Error('请使用你与机器人的私聊 Chat ID');const msg=info.pinned_message;if(!msg)return null;if(!msg.document||!String(msg.caption||'').startsWith('静钟同步备份 v1\n'))throw Error('当前置顶消息不是静钟备份，请先取消该消息的置顶');return {id:msg.document.file_id,message:msg.message_id,time:msg.date,size:msg.document.file_size||0}}
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname!=='/api/telegram')return env.ASSETS.fetch(request);
 if(request.method!=='POST')return reply({error:'仅支持 POST'},405);
 if(request.headers.get('Origin')!==url.origin)return reply({error:'来源不允许'},403);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply({error:'请求格式不正确'},415);
 const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');if(!/^\d{5,20}:[A-Za-z0-9_-]{25,100}$/.test(token))return reply({error:'请填写正确的 Bot Token'},401);
 try{const b=JSON.parse(await bounded(request.body));if(!/^\d{1,20}$/.test(String(b.chat)))throw Error('请填写私聊 Chat ID（纯数字）');const remote=await latest(token,b.chat);
  if(b.action==='check')return reply({ok:true,remote});
  if(b.action==='push'){
   if((remote?.id||null)!==(b.expected||null))return reply({error:'TG 中已有其他设备的新备份，请先恢复或确认覆盖',conflict:true,remote},409);
   if(!valid(b.data))throw Error('备份格式不正确');
   const data={app:'jingzhong-telegram',version:1,savedAt:new Date().toISOString(),data:{...b.data,timer:null}};
   const body=new FormData();body.set('chat_id',String(b.chat));body.set('disable_notification','true');body.set('caption','静钟同步备份 v1\n'+data.savedAt);body.set('document',new Blob([JSON.stringify(data)],{type:'application/json'}),'jingzhong-backup.json');
   const msg=await telegram(token,'sendDocument',body);await telegram(token,'pinChatMessage',{chat_id:b.chat,message_id:msg.message_id,disable_notification:true});
   return reply({ok:true,remote:{id:msg.document.file_id,message:msg.message_id,time:msg.date}});
  }
  if(b.action==='pull'){
   if(!remote)throw Error('TG 暂无静钟备份，请先在有数据的设备上传');if(remote.size>LIMIT)throw Error('备份文件过大');
   const file=await telegram(token,'getFile',{file_id:remote.id});if(!/^[A-Za-z0-9_/-]+\.[A-Za-z0-9]+$/.test(file.file_path||'')||file.file_path.includes('..'))throw Error('备份文件路径无效');
   const r=await fetch(`https://api.telegram.org/file/bot${token}/${file.file_path}`,{signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error('下载备份失败');const backup=JSON.parse(await bounded(r.body));if(backup.app!=='jingzhong-telegram'||backup.version!==1||!valid(backup.data))throw Error('不是有效的静钟同步备份');return reply({ok:true,remote,backup});
  }
  return reply({error:'未知操作'},400);
 }catch(e){return reply({error:e instanceof SyntaxError?'备份数据格式错误':e.name==='TimeoutError'?'Telegram 连接超时，请重试':e.message||'同步失败'},400)}
}};
