/* A quiet night sky and warm, full-size click fireworks. */
(function(){
 'use strict';
 const page=document.querySelector('.page-above');
 if(!page)return;
 const sky=document.createElement('canvas'),clicks=document.createElement('canvas');
 sky.className='subpage-stars';sky.setAttribute('aria-hidden','true');page.prepend(sky);
 clicks.className='click-stars';clicks.setAttribute('aria-hidden','true');document.body.append(clicks);
 const skyCtx=sky.getContext('2d',{alpha:true}),clickCtx=clicks.getContext('2d',{alpha:true});
 if(!skyCtx||!clickCtx)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
 let width=1,height=1,stars=[],skyFrame=0,clickFrame=0,layoutFrame=0,lastSky=0,active=false;
 const colors=['#c66d50','#d2b878','#eadfbe'];
 const bursts=[];
 let dirty=[];
 function clearDirty(){for(const area of dirty)clickCtx.clearRect(area.x-214,area.y-214,428,428);dirty=[];}
 function size(){
  if(skyFrame){cancelAnimationFrame(skyFrame);skyFrame=0;}
  width=Math.max(1,innerWidth);height=Math.max(1,innerHeight);
  for(const [canvas,ctx] of [[sky,skyCtx],[clicks,clickCtx]]){
   const ratio=Math.min(devicePixelRatio||1,canvas===sky?1:1.5);
   canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
   ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  let seed=474183;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const count=width<701?32:Math.min(110,Math.max(72,Math.round(width*height/18000)));
  stars=Array.from({length:count},()=>{
   let x=random();if(x>.26&&x<.74&&random()<.67)x=random()<.5?random()*.25:.75+random()*.25;
   return {x:x*width,y:random()*height,r:.42+random()*1.04,alpha:.14+random()*.29,phase:random()*6.283,speed:.00042+random()*.00055,gold:random()<.17};
  });
 }
 function routeVisible(){
  const path=(location.hash.slice(1)||'/').split('?')[0];
  return path!=='/'&&path!=='#main'&&page.getBoundingClientRect().bottom>innerHeight*.2;
 }
 function covered(){return document.body.classList.contains('study-intro-active')||document.body.classList.contains('study-single-page')||!!document.querySelector('dialog[open]')||document.body.classList.contains('lr-home-tour-active');}
 function sync(){
  active=routeVisible();sky.style.opacity=active?'1':'0';
  if(active&&!skyFrame&&!document.hidden&&!covered())skyFrame=requestAnimationFrame(drawSky);
  if((!active||document.hidden||covered())&&skyFrame){cancelAnimationFrame(skyFrame);skyFrame=0;}
 }
 function clearClicks(){
  if(clickFrame)cancelAnimationFrame(clickFrame);
  clickFrame=0;bursts.length=0;clearDirty();
 }
 function drawSky(now){
  skyFrame=0;if(document.hidden||!active||covered())return;
  if(!motion.matches&&!window.LuliyMobileLite&&now-lastSky<48){skyFrame=requestAnimationFrame(drawSky);return;}
  lastSky=now;skyCtx.clearRect(0,0,width,height);
  const light=document.documentElement.dataset.theme==='light';
  for(const star of stars){
   const shimmer=motion.matches||window.LuliyMobileLite ? .8 : .72+.28*Math.sin(now*star.speed+star.phase);
   const alpha=star.alpha*shimmer*(light?.49:1);
   skyCtx.fillStyle=star.gold?`rgba(${light?'150,108,55':'210,184,120'},${alpha})`:`rgba(${light?'80,78,73':'234,223,190'},${alpha})`;
   skyCtx.beginPath();skyCtx.arc(star.x,star.y+(motion.matches||window.LuliyMobileLite?0:Math.sin(now*.00018+star.phase)*1.8),star.r,0,Math.PI*2);skyCtx.fill();
  }
  if(!motion.matches&&!window.LuliyMobileLite)skyFrame=requestAnimationFrame(drawSky);
 }
 function drawClicks(now){
  clickFrame=0;clearDirty();
  for(let i=bursts.length-1;i>=0;i--){
   const burst=bursts[i],elapsed=Math.max(0,now-burst.at),p=Math.min(1,elapsed/burst.duration);
   if(p>=1){bursts.splice(i,1);continue;}
   dirty.push(burst);
   burst.shrink=(1-p)*(1-p)*(1-p);burst.spread=1-burst.shrink;
   const ringAlpha=.5*Math.max(0,1-elapsed/burst.ringFade);
   if(ringAlpha>0){
    clickCtx.beginPath();clickCtx.arc(burst.x,burst.y,.1+burst.spread*(burst.ringRadius-.1),0,Math.PI*2);
    clickCtx.strokeStyle=`rgba(210,184,120,${ringAlpha})`;clickCtx.lineWidth=6*burst.shrink;clickCtx.stroke();
   }
  }
  // Share three fill operations across all concurrent bursts.
  for(let color=0;color<colors.length;color++){
   clickCtx.fillStyle=colors[color];clickCtx.beginPath();
   for(const burst of bursts){
    for(const dot of burst.groups[color]){
     const r=.1+(dot.radius-.1)*burst.shrink;
     if(r<.35)continue;
     const x=burst.x+dot.dx*burst.spread,y=burst.y+dot.dy*burst.spread;
     clickCtx.moveTo(x+r,y);clickCtx.arc(x,y,r,0,Math.PI*2);
    }
   }
   clickCtx.fill();
  }
  clickCtx.textAlign='center';clickCtx.textBaseline='middle';
  for(const burst of bursts){
   if(burst.shrink<.015)continue;
   for(const word of burst.words){
    clickCtx.save();
    clickCtx.translate(burst.x+word.dx*burst.spread,burst.y+word.dy*burst.spread);
    clickCtx.scale(burst.shrink,burst.shrink);
    clickCtx.fillStyle=word.color;
    clickCtx.font=word.text==='Luliy'?'italic 24px "Times New Roman",serif':'28px "Luliy Canger Kai",serif';
    clickCtx.fillText(word.text,0,0);clickCtx.restore();
   }
  }
  if(bursts.length&&!document.hidden)clickFrame=requestAnimationFrame(drawClicks);
 }
 document.addEventListener('mousedown',event=>{
  if(document.body.classList.contains('study-intro-active'))return;
  if(motion.matches||!fine.matches||document.hidden||event.button!==0)return;
  if(event.target.closest('input,textarea,select,button,[role="button"],[contenteditable="true"],.lr-scene,canvas'))return;
  if(event.target.closest('a[href],[role="link"],[data-route],[data-href]'))return;
  const groups=colors.map(()=>[]),words=[];
  const count=bursts.length<10?30:12;
  for(let i=0;i<count;i++){
   const angle=Math.random()*Math.PI*2,distance=50+Math.random()*130;
   const color=Math.floor(Math.random()*colors.length),dot={dx:Math.cos(angle)*distance,dy:Math.sin(angle)*distance,radius:16+Math.random()*16};
   if(i<2)words.push({...dot,text:i===0?'Luliy':'离',color:colors[color]});
   else groups[color].push(dot);
  }
  bursts.push({x:event.clientX,y:event.clientY,at:performance.now(),groups,words,duration:1200+Math.random()*600,ringRadius:80+Math.random()*80,ringFade:600+Math.random()*200});
  if(bursts.length>64)bursts.shift();
  if(!clickFrame)clickFrame=requestAnimationFrame(drawClicks);
 },true);
 addEventListener('resize',()=>{if(!layoutFrame)layoutFrame=requestAnimationFrame(()=>{layoutFrame=0;size();sync();});},{passive:true});
 addEventListener('hashchange',()=>requestAnimationFrame(sync));
 let syncFrame=0;
 addEventListener('scroll',()=>{if(!syncFrame)syncFrame=requestAnimationFrame(()=>{syncFrame=0;sync();});},{passive:true});
 document.addEventListener('toggle',sync,true);
 const presentation=new MutationObserver(sync);presentation.observe(document.body,{attributes:true,attributeFilter:['class']});
 document.addEventListener('luliy:theme',()=>{lastSky=0;sync();});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){if(skyFrame)cancelAnimationFrame(skyFrame);skyFrame=0;clearClicks();}
  else sync();
 });
 motion.addEventListener('change',()=>{if(motion.matches)clearClicks();sync();});
 size();sync();
})();
