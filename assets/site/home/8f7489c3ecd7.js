(()=>{'use strict';
const root=document.documentElement,buttons=[document.getElementById('studyGlobalOpen'),document.querySelector('#directory .plain-close')].filter(Boolean);
if(!buttons.length)return;
const HOLD=650,SLOP=12;let press=null,suppressUntil=0,busy=false,noticeTimer=0;
const messages={
 en:{hint:'Click for the directory. Hold, then release to toggle full screen. Shift+Enter also works.',unsupported:'This browser does not support website full screen. Use the browser menu instead.',failed:'Full screen could not be changed. Please try again.',reader:'Exit the reader’s full screen first.',entered:'Full screen. Press Escape to exit.',exited:'Exited full screen.'},
 ja:{hint:'クリックで目次。長押しして離すと全画面を切り替えます。Shift+Enterでも操作できます。',unsupported:'このブラウザーは全画面表示に対応していません。ブラウザーのメニューをご利用ください。',failed:'全画面を切り替えられませんでした。もう一度お試しください。',reader:'先にリーダーの全画面を終了してください。',entered:'全画面表示。Escapeで終了します。',exited:'全画面表示を終了しました。'},
 hans:{hint:'短按操作目录；长按后松开切换全屏，也可按 Shift+Enter。',unsupported:'当前浏览器不支持网页全屏，可使用浏览器菜单。',failed:'暂时无法切换全屏，请重试。',reader:'请先退出阅读器全屏。',entered:'已进入全屏，按 Esc 可退出。',exited:'已退出全屏。'},
 hant:{hint:'短按操作目錄；長按後鬆開切換全螢幕，也可按 Shift+Enter。',unsupported:'目前瀏覽器不支援網頁全螢幕，可使用瀏覽器選單。',failed:'暫時無法切換全螢幕，請重試。',reader:'請先退出閱讀器全螢幕。',entered:'已進入全螢幕，按 Esc 可退出。',exited:'已退出全螢幕。'}
};
function text(key){const lang=root.lang;let variant=/^en/.test(lang)?'en':/^ja/.test(lang)?'ja':/Hant/i.test(lang)?'hant':'hans';return messages[variant][key];}
const state=()=>document.fullscreenElement||document.webkitFullscreenElement;
const hint=()=>buttons.forEach(b=>{b.title=text('hint');b.setAttribute('aria-description',text('hint'));b.setAttribute('aria-keyshortcuts','Shift+Enter');});
function announce(key){let el=document.getElementById('directoryFullscreenStatus');if(!el){el=document.createElement('div');el.id='directoryFullscreenStatus';el.className='directory-fullscreen-status';el.setAttribute('role','status');el.setAttribute('aria-live','polite');}const dialog=document.getElementById('directory'),host=dialog?.open?dialog:document.body;if(el.parentElement!==host)host.append(el);el.textContent=text(key);el.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{el.hidden=true;},2400);}
function reset(){if(!press)return;clearTimeout(press.timer);press.button.classList.remove('directory-holding','directory-hold-ready');press=null;}
async function toggle(){
 if(busy)return;const current=state();if(current&&current!==root){announce('reader');return;}
 const enter=root.requestFullscreen||root.webkitRequestFullscreen,exit=document.exitFullscreen||document.webkitExitFullscreen;
 if(!enter||!exit||document.fullscreenEnabled===false){announce('unsupported');return;}
 busy=true;try{await(current?exit.call(document):enter.call(root));announce(current?'exited':'entered');}catch{announce('failed');}finally{busy=false;}
}
for(const button of buttons)button.addEventListener('pointerdown',e=>{
 if(e.button!==0||e.isPrimary===false)return;suppressUntil=0;reset();press={button,id:e.pointerId,x:e.clientX,y:e.clientY,start:performance.now(),timer:0};button.classList.add('directory-holding');press.timer=setTimeout(()=>{if(press)press.button.classList.add('directory-hold-ready');},HOLD);
});
document.addEventListener('pointermove',e=>{if(press&&e.pointerId===press.id&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>SLOP){suppressUntil=performance.now()+800;press.button.classList.remove('directory-hold-ready');reset();}},{passive:true});
document.addEventListener('pointerup',e=>{
 if(!press||e.pointerId!==press.id)return;const b=press.button,r=b.getBoundingClientRect(),held=performance.now()-press.start>=HOLD,inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;b.classList.remove('directory-hold-ready');reset();
 if(held){suppressUntil=performance.now()+800;if(inside)toggle();}
},true);
document.addEventListener('pointercancel',()=>{if(press){suppressUntil=performance.now()+800;press.button.classList.remove('directory-hold-ready');reset();}},true);
document.addEventListener('click',e=>{if(e.detail!==0&&performance.now()<suppressUntil&&buttons.some(b=>b.contains(e.target))){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('contextmenu',e=>{if(press&&buttons.some(b=>b.contains(e.target)))e.preventDefault();});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.shiftKey&&buttons.some(b=>b===document.activeElement)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)toggle();}},true);
function cancel(){if(press)press.button.classList.remove('directory-hold-ready');reset();}
window.addEventListener('blur',cancel);window.addEventListener('pagehide',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
function sync(){root.dataset.siteFullscreen=String(state()===root);}
document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);new MutationObserver(hint).observe(root,{attributes:true,attributeFilter:['lang']});hint();sync();
})();
