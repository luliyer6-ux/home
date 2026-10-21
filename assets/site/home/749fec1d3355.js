(function(){
'use strict';
const profiles=new WeakMap();
const compact=(navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||navigator.connection?.saveData;
function attach(renderer){
 if(profiles.has(renderer))return;
 const profile={scale:compact?.8:1,last:0,samples:0,slow:0,lastChange:0};profiles.set(renderer,profile);
 const render=renderer.render.bind(renderer);
 renderer.render=function(...args){
  const now=performance.now(),gap=now-profile.last;profile.last=now;
  const start=performance.now();render(...args);const cost=performance.now()-start;
  if(document.hidden||gap>100||gap<5)return;
  profile.samples++;if(gap>29||cost>20)profile.slow++;
  if(profile.samples>=90){
   if(profile.slow/profile.samples>.35&&now-profile.lastChange>4000&&profile.scale>.55){
    profile.scale=Math.max(.55,profile.scale*.8);profile.lastChange=now;
    renderer.setPixelRatio(Math.max(.65,renderer.getPixelRatio()*.8));
   }
   profile.samples=profile.slow=0;
  }
 };
}
window.LuliyQuality={attach,ratio(renderer,limit,pixels,width,height){attach(renderer);return Math.max(.65,Math.min((window.LuliyMobileLite?(window.LuliyMobilePhone?.8:.9):devicePixelRatio)||1,limit,Math.sqrt((window.LuliyMobileLite?450000:pixels)/Math.max(1,width*height)))*profiles.get(renderer).scale);}};
})();

/* A restrained, hero-only dust layer behind the lunar portrait. */
(function(global){
'use strict';
function mount(canvas,stage){
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)return {setProgress(){},setPointer(){},clearPointer(){},setTheme(){},destroy(){}};
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let width=1,height=1,ratio=1,progress=0,theme=document.documentElement.dataset.theme||'dark';
 let particles=[],visible=true,disposed=false,frame=0,last=0;
 let pointer={x:-1000,y:-1000,active:false};
 const clamp=v=>Math.max(0,Math.min(1,v));
 const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
 function seedParticles(){
  let seed=348673;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const count=width<=700?Math.round(Math.min(42,Math.max(27,width*height/9000))):Math.round(Math.min(108,Math.max(70,width*height/14000)));
  particles=Array.from({length:count},()=>({x:random()*width,y:random()*height,r:.45+random()*.78,speed:.002+random()*.006,alpha:.10+random()*.20,phase:random()*6.283,tint:random()}));
  canvas.dataset.dustCount=String(count);
 }
 function resize(){
  if(disposed)return;
  const box=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect());width=Math.max(1,box.width);height=Math.max(1,box.height);
  ratio=Math.min(devicePixelRatio||1,1.5);const pixelWidth=Math.round(width*ratio),pixelHeight=Math.round(height*ratio);if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;
  ctx.setTransform(ratio,0,0,ratio,0,0);seedParticles();request();
 }
 function draw(now){
  frame=0;if(disposed||!visible||document.hidden)return;
  if(!reduce.matches&&now-last<80){frame=requestAnimationFrame(draw);return;}
  const delta=Math.min(55,last?now-last:16);last=now;
  ctx.clearRect(0,0,width,height);
  const fade=1-smooth(.28,.67,progress),isLight=theme==='light';
  if(fade>.005){
   for(const p of particles){
    if(!reduce.matches){p.y-=p.speed*delta;if(p.y<0)p.y+=height;}
    const x=p.x+Math.sin(now*.00032+p.phase)*1.8,y=p.y;
    let pushX=0,pushY=0;
    if(pointer.active&&!reduce.matches){const dx=x-pointer.x,dy=y-pointer.y,dist=Math.hypot(dx,dy)||1,force=(1-smooth(36,175,dist))*5;pushX=dx/dist*force;pushY=dy/dist*force;}
    const alpha=p.alpha*fade;
    ctx.fillStyle=isLight?`rgba(78,73,64,${alpha*.425})`:p.tint>.8?`rgba(196,164,119,${alpha*.8})`:`rgba(191,196,196,${alpha})`;
    ctx.beginPath();ctx.arc(x+pushX,y+pushY,p.r,0,Math.PI*2);ctx.fill();
   }
  }
  {const v=String(fade>.005);if(canvas.dataset.dustVisible!==v)canvas.dataset.dustVisible=v;}
  if(!reduce.matches&&progress<.67)frame=requestAnimationFrame(draw);
 }
 function request(){if(disposed||!visible||document.hidden||frame)return;frame=requestAnimationFrame(draw);}
 const size=new ResizeObserver(resize);size.observe(canvas);
 // The sticky stage stays in view while the opening story is visible.
 const stageObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0;}},{threshold:0});
 stageObserver.observe(stage);
 const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();};
 const onMotion=()=>{cancelAnimationFrame(frame);frame=0;request();};
 document.addEventListener('visibilitychange',onVisibility);
 reduce.addEventListener('change',onMotion);
 resize();
 return {
  setProgress(value){const next=clamp(Number(value)||0);if(next!==progress){progress=next;request();}},
  setPointer(x,y){pointer.x=x;pointer.y=y;pointer.active=true;request();},
  clearPointer(){pointer.active=false;request();},
  setTheme(value){const next=value==='light'?'light':'dark';if(next!==theme){theme=next;request();}},
  destroy(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);size.disconnect();stageObserver.disconnect();document.removeEventListener('visibilitychange',onVisibility);reduce.removeEventListener('change',onMotion);ctx.clearRect(0,0,width,height);}
 };
}
global.LuliyAmbient={mount};
})(window);
