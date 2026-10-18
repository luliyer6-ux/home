(function(){
  'use strict';
  window.LuliySignatureMount=function({firstOpening}){
    const signature=document.querySelector('#main .library-home .opening-copy .signature');
    const word=signature?.querySelector('.signature-word');
    const ink=signature?.querySelector('.signature-ink');
    const stage=signature?.closest('.entrance-stage');
    if(!word||!ink||!stage)return ()=>{};
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    const mobile=matchMedia('(max-width:700px)');
    const lite=matchMedia('(max-width:1024px),(pointer:coarse)');
    const animations=[];
    const dot=signature.querySelector('.signature-dot');
    const events=new AbortController();
    let clockTimer=0;
    const clock=document.createElement('time');
    clock.className='home-signature-clock';clock.hidden=true;signature.append(clock);
    const tick=()=>{const now=new Date();clock.dateTime=now.toISOString();clock.textContent=now.toLocaleTimeString('en-GB',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});};
    const toggleClock=()=>{const enabled=!signature.classList.contains('shows-clock');signature.classList.toggle('shows-clock',enabled);clock.hidden=!enabled;clearInterval(clockTimer);if(enabled){tick();clockTimer=setInterval(tick,1000);}dot?.setAttribute('aria-pressed',String(enabled));};
    if(dot){
      dot.tabIndex=0;dot.setAttribute('role','button');dot.setAttribute('aria-label','點擊切換目前時間；按 Enter 或空白鍵切換');dot.setAttribute('aria-pressed','false');dot.title='點擊切換目前時間';
      dot.addEventListener('pointerdown',e=>e.stopPropagation(),{signal:events.signal});
      dot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();if(!e.repeat)toggleClock();}},{signal:events.signal});
      dot.addEventListener('click',e=>{e.stopPropagation();toggleClock();},{signal:events.signal});
      dot.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();},{signal:events.signal});
    }
    let disposed=false,timeout,offset=0,shift=0,frame,stopInk=()=>{};
    signature.dataset.writing=firstOpening&&!reduced.matches?'pending':'complete';
    const measure=()=>{
      if(disposed||!signature.isConnected)return;
      const style=getComputedStyle(signature),size=parseFloat(style.fontSize);
      const range=document.createRange();range.selectNodeContents(word);
      const text=(window.LuliyLayoutRect?.(range)||range.getBoundingClientRect()),box=(window.LuliyLayoutRect?.(signature)||signature.getBoundingClientRect()),screen=(window.LuliyLayoutRect?.(stage)||stage.getBoundingClientRect());
      ink.style.left=(text.left-box.left)+'px';
      ink.style.top=(text.top-box.top)+'px';
      ink.style.width=(3.49*size)+'px';ink.style.height=(3.153*size)+'px';
      // hhea ascent 1822; visible font bounds -803..1397 (units/em 1000).
      offset=mobile.matches?0:screen.top+screen.height*.42-(text.top-offset+1.525*size);
      signature.style.setProperty('--signature-offset-y',offset+'px');
      const copy=signature.closest('.opening-copy');
      const blog=copy.querySelector('.opening-blogs a[href="https://mini.luliy.me"]');
      const anchor=(blog?(window.LuliyLayoutRect?.(blog)||blog.getBoundingClientRect()):null);
      // Use the permanent Blog B link as the axis. The trailing picture is
      // decorative punctuation, so align the visible Luliy ink itself.
      const axis=anchor?anchor.left+anchor.width/2:text.left-shift+1.816*size;
      shift=axis-(text.left-shift+1.816*size);
      signature.style.setProperty('--signature-offset-x',shift+'px');
      copy.style.setProperty('--signature-word-width',(3.49*size)+'px');
      copy.style.setProperty('--signature-verse-x',(axis-(window.LuliyLayoutRect?.(copy)||copy.getBoundingClientRect()).left-1.745*size)+'px');
      const shadows=style.textShadow.match(/(?:rgba?\([^)]*\)|#[\da-f]+)\s+-?[\d.]+px\s+-?[\d.]+px\s+[\d.]+px/gi)||[];
      ink.style.filter=shadows.map(s=>{const m=s.match(/^(.*?)\s+(-?[\d.]+px)\s+(-?[\d.]+px)\s+([\d.]+px)$/);return 'drop-shadow('+m[2]+' '+m[3]+' '+m[4]+' '+m[1]+')'}).join(' ')||'none';
    };
    const complete=()=>{stopInk();stopInk=()=>{};if(!disposed)signature.dataset.writing='complete';};
    const cancel=()=>{animations.forEach(a=>a.cancel());complete();};
    const motionChange=()=>{if(reduced.matches)cancel();};
    reduced.addEventListener('change',motionChange);
    const observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure)});
    const themeObserver=new MutationObserver(measure);
    themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    observer.observe(stage);window.addEventListener('resize',measure);
    (async()=>{
      try{
        // Wait for the covering prologue before starting the handwriting clock.
        if(firstOpening&&!reduced.matches&&document.documentElement.classList.contains('intro-pending')){
          await new Promise(resolve=>{
            const done=()=>{window.removeEventListener('luliy:intro-complete',done);events.signal.removeEventListener('abort',done);resolve();};
            window.addEventListener('luliy:intro-complete',done,{once:true});
            events.signal.addEventListener('abort',done,{once:true});
            if(!document.documentElement.classList.contains('intro-pending'))done();
          });
        }
        if(disposed)return;
        if(!firstOpening||reduced.matches){complete();return;}
        const font='400 '+getComputedStyle(signature).fontSize+' "Amalfi Coast"';
        const faces=await Promise.race([
          document.fonts.load(font,'Luliy'),
          new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('font timeout')),2500)}),
        ]);
        clearTimeout(timeout);
        if(disposed)return;
        if(!faces.length)throw new Error('font unavailable');
        measure();
        if(!firstOpening||reduced.matches){complete();return;}
        signature.dataset.writing='writing';
        ink.querySelectorAll('[data-signature-stroke]').forEach(path=>{
          animations.push(path.animate([
            {strokeDashoffset:1,opacity:0,offset:0},
            {strokeDashoffset:.999,opacity:1,offset:.001},
            {strokeDashoffset:0,opacity:1,offset:1},
          ],{
            delay:(lite.matches?120+Number(path.dataset.start)*.42:1500+Number(path.dataset.start)),
            duration:lite.matches?Math.max(180,Number(path.dataset.duration)*.42):Number(path.dataset.duration),
            easing:'linear',fill:'both'
          }));
        });
        stopInk=window.LuliySignatureCanvas(signature,ink,animations);
        await Promise.all(animations.map(a=>a.finished));complete();
      }catch(_){complete();}
    })();
    return ()=>{disposed=true;events.abort();clearInterval(clockTimer);clock.remove();stopInk();clearTimeout(timeout);cancelAnimationFrame(frame);animations.forEach(a=>a.cancel());observer.disconnect();themeObserver.disconnect();window.removeEventListener('resize',measure);reduced.removeEventListener('change',motionChange);signature.dataset.writing='complete';};
  };
})();

