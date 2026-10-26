/* Logo opening (2026-10-26).
   The L logo video blooms open once, then the homepage reveals.
   This TEMPORARILY replaces the original opening (intro.js).
   To restore the original: in index.html, swap this script tag back to
   intro/intro.js?v=7172b464ca (and remove this file's tag).
   intro.js and its assets (intro.mp4 / intro-wide.mp4 / posters) are untouched.
   Trigger mirrors intro.js: ?intro=0 skips, ?intro=1 always shows,
   returning visitors skip for a week (localStorage luliy_intro_seen_v1),
   homepage only, reduced-motion skips. */
(()=>{'use strict';
const root=document.documentElement;
const query=new URLSearchParams(location.search);
const key='luliy_intro_seen_v1';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(query.get('intro')==='0')return;
if(reduced.matches)return;
try{const seen=Number(localStorage.getItem(key))||0;if(query.get('intro')!=='1'&&seen>1&&Date.now()-seen<7*864e5)return;}catch{}
const home=()=>{const path=location.pathname.replace(/\/+$/,'');const entry=path===''||/^\/(?:index|optimized)\.html$/i.test(path)||(location.protocol==='file:'&&/\/(?:index|optimized)\.html$/i.test(path));return entry&&(!location.hash||/^\#\/?(?:\?|$)/.test(location.hash));};
if(!home())return;
const base=(document.currentScript&&document.currentScript.src||'').replace(/[^/]*$/,'');
const videoSrc=base+'luliy-logo-video-web.mp4';
root.classList.add('intro-pending');
let finished=false, overlay=null, video=null, style=null;
function finish(remember){
  if(finished)return; finished=true;
  try{video&&video.pause();}catch(e){}
  if(overlay)overlay.classList.add('is-done');
  setTimeout(()=>{
    try{overlay&&overlay.remove();}catch(e){}
    try{style&&style.remove();}catch(e){}
    root.classList.remove('intro-pending');
    if(remember){try{localStorage.setItem(key,String(Date.now()));}catch(e){}}
    window.dispatchEvent(new CustomEvent('luliy:intro-complete'));
  },650);
}
function mount(){
  style=document.createElement('style');
  style.textContent=
    'html.intro-pending,html.intro-pending body{overflow:hidden!important}'+
    '#luliy-logo-intro{position:fixed;inset:0;z-index:2147483000;background:#040a12;display:grid;place-items:center;transition:opacity 600ms ease}'+
    '#luliy-logo-intro.is-done{opacity:0;pointer-events:none}'+
    '#luliy-logo-intro video{width:100vw;height:100vh;height:100dvh;object-fit:contain;background:#040a12}'+
    '#luliy-logo-intro .li-skip{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:8px 14px;font-size:13px;letter-spacing:.08em;cursor:pointer}';
  document.head.appendChild(style);
  overlay=document.createElement('div');
  overlay.id='luliy-logo-intro';
  overlay.setAttribute('aria-hidden','true');
  video=document.createElement('video');
  video.src=videoSrc;
  video.muted=true; video.playsInline=true; video.preload='auto';
  video.setAttribute('aria-hidden','true');
  overlay.appendChild(video);
  const skip=document.createElement('button');
  skip.type='button'; skip.className='li-skip'; skip.textContent='跳過';
  overlay.appendChild(skip);
  (document.body||document.documentElement).appendChild(overlay);
  video.addEventListener('ended',()=>finish(true));
  video.addEventListener('error',()=>finish(false));
  skip.addEventListener('click',()=>finish(true));
  overlay.addEventListener('click',()=>finish(true));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')finish(true);});
  setTimeout(()=>finish(true),16000);
  const p=video.play&&video.play();
  if(p&&p.catch)p.catch(()=>finish(false));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})();
