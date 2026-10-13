(()=>{'use strict';
const kind=document.body.dataset.exam;
if(kind==='408'){
 const nav=document.querySelector('.question-navigation'),head=nav?.querySelector('.grid-head'),grid=document.getElementById('qgrid');
 if(nav&&head&&grid){
  const toggle=document.createElement('button');toggle.className='exam-nav-toggle';toggle.type='button';toggle.setAttribute('aria-controls','qgrid');head.append(toggle);
  const narrow=matchMedia('(max-width:1100px)');let expanded=false;
  function update(){nav.classList.toggle('exam-nav-collapsed',narrow.matches&&!expanded);toggle.setAttribute('aria-expanded',String(expanded));toggle.textContent=expanded?'收起题号':'展开题号';}
  toggle.onclick=()=>{expanded=!expanded;update()};narrow.addEventListener('change',update);update();
 }
}
// Native dialogs already manage focus. These two older drawers need equivalent behavior.
const drawer=document.getElementById(kind==='english'?'drawer':kind==='408'?'historyDrawer':'');
if(!drawer)return;
const close=document.getElementById(kind==='english'?'drawerClose':'historyClose');
let active=false,returnFocus=null,trigger=null,inerted=[];
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!drawer.contains(b))trigger=b;},true);
const isOpen=()=>kind==='english'?drawer.classList.contains('on'):!drawer.hidden;
function focusables(){return [...drawer.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')].filter(e=>!e.disabled&&e.tabIndex>=0&&e.getClientRects().length&&!e.closest('[hidden],[inert]'));}
function sync(){
 const open=isOpen();if(open===active)return;active=open;
 if(open){
  returnFocus=trigger?.isConnected?trigger:document.activeElement;
  drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');
  inerted=[...document.body.children].filter(e=>e!==drawer&&!e.contains(drawer)&&!['scrim','tip'].includes(e.id)&&!e.inert&&!['SCRIPT','STYLE','LINK'].includes(e.tagName));
  inerted.forEach(e=>e.inert=true);close?.focus({preventScroll:true});
 }else{
  drawer.removeAttribute('aria-modal');inerted.forEach(e=>e.inert=false);inerted=[];
  if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
 }
}
new MutationObserver(sync).observe(drawer,{attributes:true,attributeFilter:['class','hidden']});
drawer.addEventListener('keydown',e=>{
 if(e.key==='Escape'){e.preventDefault();close?.click();return;}
 if(e.key!=='Tab')return;const nodes=focusables(),first=nodes[0],last=nodes.at(-1);if(!first){e.preventDefault();return;}
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
sync();
})();
