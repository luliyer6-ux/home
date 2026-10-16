/* One photo prologue prepares the real site in parallel; the eye is opt-in. */
(()=>{'use strict';
const root=document.documentElement,base=(document.currentScript?.src||'').replace(/[^/]*$/,''),query=new URLSearchParams(location.search),media=matchMedia('(prefers-reduced-motion: reduce)'),key='luliy_intro_seen_v1';
if(query.get('intro')==='0')return;
const home=()=>{const path=location.pathname.replace(/\/+$/,'');const entry=path===''||/^\/(?:index|optimized)\.html$/i.test(path)||(location.protocol==='file:'&&/\/(?:index|optimized)\.html$/i.test(path));return entry&&(!location.hash||/^#\/?(?:\?|$)/.test(location.hash))};
const wide=innerWidth>=innerHeight;
const photoFiles=['028a7efece46c088a4b3.jpg','1982d00386ea76976007.webp','2db47885e6b038279c67.jpg','307fceafdddbf5c3eb9d.webp','3346d3fd6aa97e896c8a.webp','37cca2f354ec875f822b.webp','4c634428dedfaaad9fe3.webp','a05158b9ac9d41495ba6.webp','66f0195b3268b8f223b5.webp','51d8aa192fa1e25ebfc8.png','4832a64192609350f901.webp','541f3773aab3baa245ef.webp','70198aad8b0ef8aaf332.jpg','5e03e2b4aea7e4e0e099.webp','72975f4403b24f44fe2b.webp','7568e5809d06f2ef9256.webp','797c80add68b4e8a3094.jpg','76579b4072eda18f617c.webp','7b4c0ab051ad44312c7f.webp','81e5b5829adca30de16f.webp','94e9e218d513b30ffcf3.webp','a664cee2bebd378a0fa6.webp','aac6e0dd39f855845c40.webp','b390d7a49ad8546f102e.webp','beab717d6ede520e2b73.webp','dd19e9869e757d5c0817.webp','df76eff43ae25f830757.jpg','e94109b210d06e9db290.webp','ecc9d141dd673055516d.webp','f7adcfc1d96e2209f69e.webp','feeccb59c79e9a171e13.webp'];
const portraitPhotos=new Set(['51d8aa192fa1e25ebfc8.png','4832a64192609350f901.webp','541f3773aab3baa245ef.webp']);
const recordCovers=new Set(['1982d00386ea76976007.webp','307fceafdddbf5c3eb9d.webp','3346d3fd6aa97e896c8a.webp','37cca2f354ec875f822b.webp','4c634428dedfaaad9fe3.webp','5e03e2b4aea7e4e0e099.webp','72975f4403b24f44fe2b.webp','7568e5809d06f2ef9256.webp','76579b4072eda18f617c.webp','7b4c0ab051ad44312c7f.webp','81e5b5829adca30de16f.webp','b390d7a49ad8546f102e.webp','beab717d6ede520e2b73.webp','ecc9d141dd673055516d.webp','f7adcfc1d96e2209f69e.webp','feeccb59c79e9a171e13.webp']);
const cfg=wide?{video:'intro-wide.mp4',poster:'poster-wide.jpg',w:1280,h:720,points:[[0,.502,.486,.096,.145],[1,.505,.486,.114,.174],[2,.507,.482,.145,.217],[3,.507,.476,.176,.268],[4,.508,.47,.219,.328],[5,.506,.468,.261,.397],[6,.505,.465,.305,.455],[7,.503,.462,.35,.515],[8,.502,.459,.399,.565],[10,.5,.455,.465,.635]]}:{video:'intro.mp4',poster:'poster.jpg',w:720,h:1280,points:[[0,.5,.51,.27,.15],[2,.5,.51,.30,.17],[3,.5,.503,.53,.245],[5,.5,.5,.65,.31],[7,.5,.495,.82,.39],[10,.5,.49,1,.48]]};
const lang=()=>{let x=document.documentElement.lang||'zh-Hant';try{x=localStorage.getItem('luliy_lang')||x}catch{}return /en/i.test(x)?'en':/ja/i.test(x)?'ja':/Hans|CN|zh-CN/i.test(x)?'zh-Hans':'zh-Hant'};
function eyeRequested(){return home()&&(query.get('intro')==='1'||query.get('intro')==='eye')}
function prologueRequested(){return home()&&!eyeRequested()}
const words={
 'zh-Hant':['世界上只有一種英雄主義，就是認清楚世界的真相後仍然熱愛生活','正在整理首頁空間','正在載入頁面資源','資源載入較慢，已先顯示輕量首頁。','重試 3D 空間','跳過'],
 'zh-Hans':['世界上只有一种英雄主义，就是认清楚世界的真相后仍然热爱生活','正在整理首页空间','正在加载页面资源','资源加载较慢，已先显示轻量首页。','重试 3D 空间','跳过'],
 en:['There is only one heroism in the world: to see the world as it is, and still love life.','Preparing the homepage space','Loading page resources','Loading is taking longer. The lightweight homepage is ready.','Retry 3D scene','Skip'],
 ja:['世界にただ一つの英雄主義がある。それは、世界の真実を見つめた後もなお、人生を愛することだ。','ホームの空間を準備中','ページのリソースを読み込み中','読み込みに時間がかかっています。軽量版を表示しました。','3D空間を再試行','スキップ']
};
const prologueWords={
 'zh-Hant':{lead:'世界上只有一種英雄主義，\n就是認清楚世界的真相後',end:'仍然熱愛生活',en:'To see the world as it is, and still love it.',enter:'點擊進入',skip:'跳過'},
 'zh-Hans':{lead:'世界上只有一种英雄主义，\n就是认清楚世界的真相后',end:'仍然热爱生活',en:'To see the world as it is, and still love it.',enter:'点击进入',skip:'跳过'},
 en:{lead:'There is only one heroism in the world:',end:'to see the truth, and still love life.',en:'To see the world as it is, and still love it.',enter:'Click to enter',skip:'Skip'},
 ja:{lead:'世界にただ一つの英雄主義がある。',end:'真実を見つめた後も、なお人生を愛すること。',en:'To see the world as it is, and still love life.',enter:'クリックして入る',skip:'スキップ'}
};
let eye,video,prologue,frame=0,finished=false,watchdog,prologueFinishTimer,failed=false,photoPromise=Promise.resolve([]),prologueUI,cancelReadiness;
const style=document.createElement('style');style.textContent=`
html.intro-pending,html.intro-pending body{overflow:hidden!important}html.intro-pending{background:var(--bg,#050505)}html.intro-pending:not(.intro-mounted) body{visibility:hidden!important}
#luliy-intro{position:fixed;inset:0;margin:0;padding:0;border:0;width:100vw;height:100vh;height:100dvh;overflow:hidden;background:transparent;color:white;z-index:2147483001}#luliy-intro video{position:absolute;inset:0;display:block;width:100%;height:100%;background:#000;-webkit-mask-image:radial-gradient(ellipse var(--intro-rx) var(--intro-ry) at var(--intro-x) var(--intro-y),transparent 93%,#000 100%);mask-image:radial-gradient(ellipse var(--intro-rx) var(--intro-ry) at var(--intro-x) var(--intro-y),transparent 93%,#000 100%)}#luliy-intro .li-skip{position:absolute;right:max(16px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));padding:7px 14px;border:1px solid #ffffff40;border-radius:999px;background:#0006;color:#fff;font:13px/1.4 system-ui;cursor:pointer}#luliy-intro .li-skip:focus-visible{outline:2px solid #e9d6ac;outline-offset:3px}#luliy-intro.is-revealing .li-skip{opacity:0;pointer-events:none;transition:opacity .25s}
#luliy-load-note{position:fixed;z-index:2147482000;left:50%;bottom:max(20px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:12px;max-width:calc(100vw - 28px);padding:12px 14px;border:1px solid color-mix(in srgb,var(--ink,#eee6d2) 18%,transparent);border-radius:12px;background:color-mix(in srgb,var(--bg,#050505) 92%,transparent);color:var(--ink,#eee6d2);font:13px/1.5 inherit;transform:translateX(-50%);box-shadow:0 8px 32px #0006}#luliy-load-note[hidden]{display:none}#luliy-load-note button{border:0;background:none;color:var(--accent,#c77a5b);font:inherit;white-space:nowrap;cursor:pointer}
#luliy-prologue{position:fixed;inset:0;z-index:2147483001;overflow:hidden;display:grid;place-items:center;background:#07080a;color:#eee6d2;font-family:inherit;opacity:0;transition:opacity .8s ease;isolation:isolate}#luliy-prologue.is-active{opacity:1}#luliy-prologue.is-leaving{opacity:0;transform:scale(1.018);transition:opacity 1s ease,transform 1.25s cubic-bezier(.2,.65,.2,1)}
#luliy-prologue .lp-photos{position:absolute;inset:-1px;z-index:-2;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));overflow:hidden;transform:scale(1.035)}#luliy-prologue .lp-photo{display:block;width:100%;height:100%;min-width:0;min-height:0;object-fit:cover;filter:grayscale(.5) brightness(.68) saturate(.5);-webkit-mask-image:radial-gradient(ellipse at center,rgba(0,0,0,.9) 18%,rgba(0,0,0,.62) 68%,transparent 112%);mask-image:radial-gradient(ellipse at center,rgba(0,0,0,.9) 18%,rgba(0,0,0,.62) 68%,transparent 112%);opacity:0;transition:opacity 1.2s ease}#luliy-prologue.is-active .lp-photo{opacity:.58}#luliy-prologue .lp-photo--person{filter:grayscale(.2) brightness(.78) saturate(.4)}#luliy-prologue.is-active .lp-photo--person{opacity:.72}#luliy-prologue .lp-photo--record{filter:grayscale(.78) brightness(.48) saturate(.3)}#luliy-prologue.is-active .lp-photo--record{opacity:.42}#luliy-prologue .lp-photo:nth-child(3n+1){object-position:center 42%}#luliy-prologue .lp-photo:nth-child(4n){object-position:center 58%}
#luliy-prologue .lp-shade{position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at 50% 47%,rgba(5,6,8,.62),rgba(5,6,8,.42) 48%,rgba(5,6,8,.56)),linear-gradient(180deg,rgba(4,5,7,.36),rgba(4,5,7,.22) 45%,rgba(4,5,7,.58));pointer-events:none}
#luliy-prologue .lp-photo:not(.is-loaded){opacity:0!important}#luliy-prologue .lp-photo.is-failed{visibility:hidden}#luliy-prologue .lp-enter[aria-busy="true"] .lp-ring-fg{stroke-dasharray:28 123;stroke-dashoffset:0;transform-origin:28px 28px;animation:lp-ring-spin 1.8s linear infinite}@keyframes lp-ring-spin{to{transform:rotate(360deg)}}
#luliy-prologue .lp-corner{position:absolute;top:max(26px,env(safe-area-inset-top));left:max(28px,env(safe-area-inset-left));right:max(28px,env(safe-area-inset-right));display:flex;justify-content:space-between;align-items:center;color:rgba(238,230,210,.64);font-family:inherit;font-size:11px;letter-spacing:.3em;text-transform:uppercase}.lp-corner strong{font-weight:500;color:#eee6d2;letter-spacing:.24em}
#luliy-prologue .lp-content{width:min(880px,calc(100% - 40px));padding:24px;text-align:center;transform:translateY(8px);transition:transform 1s cubic-bezier(.2,.65,.2,1)}#luliy-prologue.is-active .lp-content{transform:none}#luliy-prologue .lp-lead{font-size:clamp(19px,3.5vw,34px);font-weight:300;line-height:1.9;letter-spacing:.13em;color:rgba(238,230,210,.86);white-space:pre-line;text-wrap:balance}#luliy-prologue .lp-highlight{margin-top:10px;font-size:clamp(31px,7vw,74px);font-weight:400;line-height:1.35;letter-spacing:.12em;color:#e8c98c;text-shadow:0 0 32px rgba(232,184,106,.17);text-wrap:balance}#luliy-prologue .lp-rule{width:min(220px,42vw);height:1px;margin:clamp(24px,4vh,38px) auto 20px;background:linear-gradient(90deg,transparent,rgba(232,184,106,.76),transparent)}#luliy-prologue .lp-english{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:clamp(14px,2vw,19px);font-weight:300;letter-spacing:.08em;color:rgba(232,201,140,.8)}
#luliy-prologue .lp-enter{position:absolute;left:50%;bottom:calc(7vh + env(safe-area-inset-bottom));display:grid;justify-items:center;gap:8px;min-width:112px;min-height:92px;padding:8px 18px;transform:translateX(-50%);border:0;background:transparent;color:#e8c98c;font:inherit;cursor:pointer;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}#luliy-prologue .lp-ring{width:56px;height:56px;transform:rotate(-90deg)}#luliy-prologue .lp-ring circle{fill:none;stroke-width:1.3}#luliy-prologue .lp-ring .lp-ring-bg{stroke:rgba(232,201,140,.25)}#luliy-prologue .lp-ring .lp-ring-fg{stroke:#e8c98c;stroke-linecap:round;stroke-dasharray:151;stroke-dashoffset:151;filter:drop-shadow(0 0 5px rgba(232,184,106,.65));transition:stroke-dashoffset .18s ease}#luliy-prologue .lp-enter:not([aria-busy="true"]) .lp-ring-fg{stroke-dashoffset:0}#luliy-prologue .lp-enter span{font-size:11px;letter-spacing:.24em;color:rgba(238,230,210,.78)}#luliy-prologue .lp-skip{position:absolute;right:max(30px,env(safe-area-inset-right));bottom:calc(28px + env(safe-area-inset-bottom));min-width:44px;min-height:44px;padding:10px;border:0;background:transparent;color:rgba(238,230,210,.62);font:inherit;font-size:12px;letter-spacing:.12em;cursor:pointer}#luliy-prologue .lp-skip:hover{color:#e8c98c}#luliy-prologue :focus-visible{outline:2px solid #e8c98c;outline-offset:4px}#luliy-prologue:focus{outline:none}
#luliy-prologue .lp-sr-only{position:absolute!important;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
#luliy-prologue.lp-effects{--lp-cold:#aab2bd;--lp-gold:#e8b86a;--lp-amber:232,150,60;--lp-open:0vmax}
#luliy-prologue.lp-effects .lp-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;transform:none;gap:0}
#luliy-prologue.lp-effects .lp-corner{z-index:2;color:var(--lp-cold);opacity:.42;transition:color 3s ease,opacity 2s ease}
#luliy-prologue.lp-effects .lp-corner strong{color:inherit}
#luliy-prologue.lp-effects .lp-lead{margin:0;font-size:clamp(17px,4.4vw,32px);font-weight:300;line-height:2.1;letter-spacing:.2em;color:var(--lp-cold);white-space:normal;transition:opacity 2.5s ease-out}
#luliy-prologue.lp-effects .lp-glyphs,#luliy-prologue.lp-effects .lp-line{display:block}#luliy-prologue.lp-effects .lp-word{display:inline-block;white-space:nowrap}
#luliy-prologue.lp-effects .lp-char{display:inline-block;white-space:pre;opacity:0;filter:blur(8px);transform:translateY(6px);transition:opacity 1.4s ease-out,filter 1.4s ease-out,transform 1.4s ease-out;transition-delay:var(--lp-delay,0s)}
#luliy-prologue.lp-effects.lp-cold-on .lp-lead .lp-char,#luliy-prologue.lp-effects.lp-gold-on .lp-highlight .lp-char{opacity:1;filter:none;transform:none}
#luliy-prologue.lp-effects .lp-highlight{margin:clamp(18px,4vh,36px) 0 0;padding-left:.34em;font-size:clamp(34px,10vw,84px);font-weight:500;line-height:1.35;letter-spacing:.34em;color:var(--lp-gold);text-shadow:none;filter:drop-shadow(0 0 22px rgba(var(--lp-amber),.45))}
#luliy-prologue.lp-effects .lp-highlight .lp-char{transition-duration:2.2s}
#luliy-prologue.lp-effects.lp-gold-on .lp-highlight .lp-char{background:linear-gradient(110deg,#e8b86a 30%,#fff3d6 50%,#e8b86a 70%);background-size:300% 100%;background-clip:text;-webkit-background-clip:text;color:transparent;animation:lp-gold-sheen 2.4s ease-in-out both;animation-delay:calc(var(--lp-delay,0s) + .5s)}
@keyframes lp-gold-sheen{from{background-position:100% 0}to{background-position:0 0}}
#luliy-prologue.lp-effects.lp-glitch .lp-lead{text-shadow:-1.5px 0 rgba(110,200,255,.5),1.5px 0 rgba(255,90,90,.35)}
#luliy-prologue.lp-effects.lp-warm .lp-lead{opacity:.45}#luliy-prologue.lp-effects.lp-warm .lp-corner{color:var(--lp-gold)}
#luliy-prologue.lp-effects .lp-rule{width:0;max-width:100%;margin:clamp(18px,3.5vh,30px) auto 0;background:linear-gradient(90deg,transparent,rgba(232,184,106,.8),transparent);transition:width 2.4s cubic-bezier(.2,.6,.2,1)}
#luliy-prologue.lp-effects.lp-rule-on .lp-rule{width:min(60vw,320px)}
#luliy-prologue.lp-effects .lp-english{margin:clamp(14px,2.6vh,24px) 0 0;font-size:clamp(14px,2.6vw,20px);font-weight:300;letter-spacing:.14em;color:rgba(232,184,106,.78);opacity:0;transform:translateY(6px);transition:opacity 2s ease-out,transform 2s ease-out}
#luliy-prologue.lp-effects.lp-subtitle-on .lp-english{opacity:1;transform:none}
#luliy-prologue.lp-effects .lp-enter{z-index:2;opacity:0;transition:opacity 1.6s ease-out}
#luliy-prologue.lp-effects.lp-controls-on .lp-enter,#luliy-prologue.lp-effects .lp-enter:focus-visible{opacity:1}
#luliy-prologue.lp-effects .lp-skip{z-index:2}
#luliy-prologue .lp-atmosphere{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}#luliy-prologue .lp-atmosphere>*{position:absolute;pointer-events:none}
#luliy-prologue .lp-grid{inset:0;background-image:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(circle 26vmax at var(--lp-mx,50%) var(--lp-my,45%),#000,transparent);-webkit-mask-image:radial-gradient(circle 26vmax at var(--lp-mx,50%) var(--lp-my,45%),#000,transparent)}
#luliy-prologue .lp-spot{inset:0;background:radial-gradient(circle 24vmax at var(--lp-mx,50%) var(--lp-my,45%),rgba(190,200,215,.07),transparent)}
#luliy-prologue .lp-tint{inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(var(--lp-amber),.18),transparent 70%);opacity:0;transition:opacity 4s ease-out}
#luliy-prologue .lp-glow{left:50%;bottom:-38vh;width:150vw;height:80vh;margin-left:-75vw;background:radial-gradient(ellipse at 50% 100%,rgba(var(--lp-amber),.6),transparent 62%);opacity:0;transform:translateY(25%) scale(.8);transition:opacity 3.5s ease-out,transform 4.5s ease-out;filter:blur(8px)}
#luliy-prologue.lp-warm .lp-tint,#luliy-prologue.lp-warm .lp-glow{opacity:1}#luliy-prologue.lp-warm .lp-glow{transform:none}
#luliy-prologue .lp-halo{left:50%;bottom:calc(7vh - 30vmax + 32px);width:60vmax;height:60vmax;margin-left:-30vmax;border-radius:50%;background:radial-gradient(circle,rgba(255,200,120,.55),rgba(var(--lp-amber),0) 60%);opacity:0;transition:opacity 1.1s linear}
#luliy-prologue.lp-holding .lp-halo{opacity:.9}
#luliy-prologue .lp-grain{inset:-50%;opacity:.24}
#luliy-prologue .lp-specks{inset:0}#luliy-prologue .lp-specks i{position:absolute;width:var(--lp-speck-size,2px);height:var(--lp-speck-size,2px);border-radius:50%;background:var(--lp-cold);opacity:.16;animation:lp-speck-drift var(--lp-speck-duration,10s) ease-in-out infinite;animation-delay:var(--lp-speck-delay,0s);transition:background-color 4s ease}
#luliy-prologue.lp-warm .lp-specks i{background:var(--lp-gold)}
@keyframes lp-speck-drift{0%,100%{transform:translate3d(0,12px,0);opacity:.08}50%{transform:translate3d(14px,-42px,0);opacity:.4}}
#luliy-prologue .lp-frame{position:absolute;width:16px;height:16px;border:1px solid rgba(170,178,189,.28);opacity:0;transition:opacity 2s ease,border-color 3s ease}
#luliy-prologue .lp-frame.tl{top:max(20px,env(safe-area-inset-top));left:20px;border-right:0;border-bottom:0}#luliy-prologue .lp-frame.tr{top:max(20px,env(safe-area-inset-top));right:20px;border-left:0;border-bottom:0}
#luliy-prologue .lp-frame.bl{bottom:max(20px,env(safe-area-inset-bottom));left:20px;border-right:0;border-top:0}#luliy-prologue .lp-frame.br{bottom:max(20px,env(safe-area-inset-bottom));right:20px;border-left:0;border-top:0}
#luliy-prologue.lp-effects-ready .lp-frame{opacity:1}#luliy-prologue.lp-warm .lp-frame{border-color:rgba(232,184,106,.4)}
#luliy-prologue .lp-temperature{position:absolute;left:48px;bottom:calc(28px + env(safe-area-inset-bottom));font:10px/1.4 Georgia,serif;font-variant-numeric:tabular-nums;letter-spacing:.2em;color:var(--lp-cold);opacity:.42;transition:color 3s ease}
#luliy-prologue.lp-warm .lp-temperature{color:var(--lp-gold)}
#luliy-prologue .lp-flash{position:absolute;left:50%;top:82%;width:40vmax;height:40vmax;margin:-20vmax 0 0 -20vmax;border-radius:50%;background:radial-gradient(circle,#ffe6b8 0%,#e8a04a 38%,rgba(232,160,74,0) 70%);transform:scale(0);opacity:0;pointer-events:none;z-index:3}
#luliy-prologue.lp-exit .lp-flash{opacity:1;transform:scale(5);transition:transform 1s cubic-bezier(.5,0,.2,1),opacity .3s}
#luliy-prologue.lp-opening{-webkit-mask-image:radial-gradient(circle at 50% 82%,transparent var(--lp-open),#000 calc(var(--lp-open) + 18vmax));mask-image:radial-gradient(circle at 50% 82%,transparent var(--lp-open),#000 calc(var(--lp-open) + 18vmax))}
#luliy-prologue.lp-paused *{animation-play-state:paused!important}
#luliy-prologue.lp-static *{transition:none!important;animation:none!important}
#luliy-prologue.lp-effects[lang="en"] .lp-highlight{font-size:clamp(26px,5.5vw,64px);letter-spacing:.05em;padding-left:.05em}#luliy-prologue.lp-effects[lang="ja"] .lp-highlight{font-size:clamp(24px,4.5vw,56px);letter-spacing:.1em;padding-left:.1em}
@media(max-width:760px){#luliy-prologue.lp-effects .lp-content{padding:20px 0 84px}#luliy-prologue.lp-effects .lp-lead{font-size:clamp(16px,4.4vw,24px);letter-spacing:.1em}#luliy-prologue.lp-effects .lp-highlight{font-size:clamp(30px,9vw,60px);letter-spacing:.22em;padding-left:.22em}#luliy-prologue.lp-effects .lp-char{filter:blur(4px)}#luliy-prologue.lp-effects .lp-english{font-size:clamp(12px,3vw,18px);letter-spacing:.08em}#luliy-prologue .lp-grid,#luliy-prologue .lp-spot,#luliy-prologue .lp-specks{display:none}#luliy-prologue .lp-glow{filter:none}#luliy-prologue .lp-temperature{left:32px;bottom:calc(24px + env(safe-area-inset-bottom))}}
@media(prefers-reduced-motion:reduce){#luliy-intro .li-skip{transition:none!important}#luliy-prologue .lp-atmosphere,#luliy-prologue .lp-flash{display:none}#luliy-prologue.lp-effects .lp-char{filter:none}}
@media(max-width:760px){#luliy-prologue .lp-photos{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(8,minmax(0,1fr))}#luliy-prologue .lp-photo{filter:grayscale(.64) brightness(.6) saturate(.38)}#luliy-prologue.is-active .lp-photo{opacity:.5}#luliy-prologue .lp-photo--person{filter:grayscale(.26) brightness(.72) saturate(.34)}#luliy-prologue.is-active .lp-photo--person{opacity:.64}#luliy-prologue .lp-photo--record{filter:grayscale(.76) brightness(.42) saturate(.26)}#luliy-prologue.is-active .lp-photo--record{opacity:.35}#luliy-prologue .lp-shade{background:radial-gradient(ellipse at 50% 46%,rgba(5,6,8,.67),rgba(5,6,8,.49) 62%,rgba(5,6,8,.6)),linear-gradient(180deg,rgba(4,5,7,.38),rgba(4,5,7,.28) 45%,rgba(4,5,7,.61))}#luliy-prologue .lp-content{padding:20px 4px 80px}#luliy-prologue .lp-lead{letter-spacing:.075em}#luliy-prologue .lp-highlight{letter-spacing:.08em}#luliy-prologue .lp-enter{bottom:calc(4vh + env(safe-area-inset-bottom))}#luliy-prologue .lp-skip{right:max(12px,env(safe-area-inset-right));bottom:calc(12px + env(safe-area-inset-bottom))}}
@media(prefers-reduced-motion:reduce){#luliy-prologue,#luliy-prologue *{transition:none!important;animation:none!important}#luliy-prologue .lp-photo{opacity:.32!important}#luliy-prologue .lp-ring-fg{stroke-dashoffset:0!important}}
`;document.head.append(style);root.classList.add('intro-pending');
window.LuliyLayoutRect=target=>{const r=target.getBoundingClientRect();if(!root.classList.contains('intro-live-home'))return r;const s=parseFloat(root.style.getPropertyValue('--intro-scale'))||1,tx=parseFloat(root.style.getPropertyValue('--intro-tx'))||0,ty=parseFloat(root.style.getPropertyValue('--intro-ty'))||0;return new DOMRect((r.x-innerWidth/2-tx)/s+innerWidth/2,(r.y-innerHeight/2-ty)/s+innerHeight/2,r.width/s,r.height/s)};
function preloadPhotos(){
 return Promise.all([...prologue.querySelectorAll('.lp-photo')].map(img=>new Promise(resolve=>{
  let settled=false,timer;
  const done=ok=>{if(settled)return;settled=true;clearTimeout(timer);resolve(ok)};
  const loaded=()=>{img.classList.add('is-loaded');done(true)};
  const failed=()=>{img.classList.add('is-failed');done(false)};
  img.addEventListener('load',loaded,{once:true});img.addEventListener('error',failed,{once:true});
  timer=setTimeout(()=>done(false),3500);
  if(img.complete)(img.naturalWidth?loaded:failed)();
 })));
}
function waitForReady(){
 return new Promise(resolve=>{
  let done=false,prepStarted=false,pageReady=document.readyState==='complete',sceneReady=!home(),fontsReady=!document.fonts,poll,deadline;
  const end=value=>{if(done)return;done=true;clearInterval(poll);clearTimeout(deadline);window.removeEventListener('load',onLoad);document.removeEventListener('DOMContentLoaded',waitFonts);cancelReadiness=null;resolve(value)};
  const tryPrepare=()=>{
   if(done)return;pageReady=pageReady||document.readyState==='complete';
   if(!home())sceneReady=true;
   else if(!prepStarted){
    const hook=window.LuliyHomepagePrepare;
    if(typeof hook==='function'){
     prepStarted=true;prologueUI?.setStatus(words[lang()][1]);
     Promise.resolve().then(hook).then(ok=>{if(done)return;if(!ok)failed=true;sceneReady=true;tryPrepare()},()=>{if(done)return;failed=true;sceneReady=true;tryPrepare()});
    }else if(pageReady)sceneReady=true;
   }
   if(pageReady&&sceneReady&&fontsReady)end(true);
  };
  const onLoad=()=>{pageReady=true;tryPrepare()};
  const waitFonts=()=>{if(done)return;if(document.fonts)document.fonts.ready.then(()=>{fontsReady=true;tryPrepare()},()=>{fontsReady=true;tryPrepare()});else{fontsReady=true;tryPrepare()}};
  cancelReadiness=()=>end(false);
  poll=setInterval(tryPrepare,100);
  const expire=()=>{if(done)return;if(document.readyState==='loading'){deadline=setTimeout(expire,1000);return}failed=home();window.LuliyHomepageCancelPrepare?.();end(false)};
  deadline=setTimeout(expire,10000);
  window.addEventListener('load',onLoad,{once:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',waitFonts,{once:true});else waitFonts();
  tryPrepare();
 });
}
function point(t){let a=cfg.points[0],b=cfg.points.at(-1);for(let i=1;i<cfg.points.length;i++){if(t<=cfg.points[i][0]){a=cfg.points[i-1];b=cfg.points[i];break}a=b=cfg.points[i]}const k=b[0]===a[0]?0:Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));return a.map((v,i)=>i?v+(b[i]-v)*k:t)}
function geometry(t){const p=point(t),w=innerWidth,h=innerHeight,vw=video.videoWidth||cfg.w,vh=video.videoHeight||cfg.h,ratio=(w/h)/(vw/vh),cover=ratio>=1/1.3&&ratio<=1.3,s=cover?Math.max(w/vw,h/vh):Math.min(w/vw,h/vh);video.style.objectFit=cover?'cover':'contain';const x=(w-vw*s)/2+p[1]*vw*s,y=(h-vh*s)/2+p[2]*vh*s,rx=p[3]*vw*s,ry=p[4]*vh*s;return{x,y,rx,ry,scale:.93/Math.hypot(w/(2*rx),h/(2*ry))}}
function paint(g){eye.style.setProperty('--intro-x',g.x+'px');eye.style.setProperty('--intro-y',g.y+'px');eye.style.setProperty('--intro-rx',g.rx+'px');eye.style.setProperty('--intro-ry',g.ry+'px');root.style.setProperty('--intro-tx',(g.x-innerWidth/2)+'px');root.style.setProperty('--intro-ty',(g.y-innerHeight/2)+'px');root.style.setProperty('--intro-scale',String(g.scale))}
function tick(){if(finished||failed)return;paint(geometry(video.currentTime));frame=requestAnimationFrame(tick)}
function showRetry(){const w=words[lang()];let note=document.getElementById('luliy-load-note');if(!note){note=document.createElement('div');note.id='luliy-load-note';note.setAttribute('role','status');document.body.append(note)}note.innerHTML='';const text=document.createElement('span');text.textContent=w[3];const button=document.createElement('button');button.type='button';button.textContent=w[4];button.onclick=async()=>{button.disabled=true;button.textContent='…';const ok=await window.LuliyHomepageRetry?.();if(ok)note.hidden=true;else{button.disabled=false;button.textContent=w[4]}};note.append(text,button)}
const inert=new Map();let isolationObserver;
function isolate(){
 const protect=()=>{for(const node of document.body.children){if(node===prologue||node===eye||/^(SCRIPT|STYLE|LINK)$/.test(node.tagName))continue;if(!inert.has(node))inert.set(node,node.inert);node.inert=true}};
 protect();if(!isolationObserver){isolationObserver=new MutationObserver(protect);isolationObserver.observe(document.body,{childList:true})}
}
function finishIntro(remember){if(finished)return;finished=true;cancelReadiness?.();prologueUI?.destroy();clearTimeout(watchdog);clearTimeout(prologueFinishTimer);cancelAnimationFrame(frame);video?.pause();isolationObserver?.disconnect();eye?.remove();prologue?.remove();eye=null;video=null;prologue=null;for(const [node,value]of inert)if(node.isConnected)node.inert=value;inert.clear();root.classList.remove('intro-pending','intro-mounted','intro-live-home');for(const n of ['--intro-tx','--intro-ty','--intro-scale'])root.style.removeProperty(n);style.remove();if(remember)try{localStorage.setItem(key,'1')}catch{}if(failed&&home())showRetry();window.dispatchEvent(new CustomEvent('luliy:intro-complete'))}
function mountPrologueEffects({overlay,lead,ending,head,content,animated}){
 const tasks=new Set(),abort=new AbortController();let disposed=false,exiting=false,played=false,paused=document.hidden,pausedAnimations=[],pointerFrame=0,exitFrame=0,exitPromise,resolveExit;
 function arm(task){task.deadline=performance.now()+task.remaining;task.id=setTimeout(()=>{tasks.delete(task);if(!disposed)task.fn()},task.remaining)}
 function at(ms,fn){const task={remaining:ms,fn,id:0,deadline:0};tasks.add(task);if(!paused)arm(task);return task}
 function clearTasks(){for(const task of tasks)clearTimeout(task.id);tasks.clear()}
 function split(element,gap,maxStagger){
  const text=element.textContent,count=Array.from(text.replace(/\n/g,'')).length;gap=Math.min(gap,maxStagger/Math.max(1,count-1));
  const accessible=document.createElement('span');accessible.className='lp-sr-only';accessible.textContent=text.replace(/\n/g,' ');
  const visual=document.createElement('span');visual.className='lp-glyphs';visual.setAttribute('aria-hidden','true');let index=0;
  for(const line of text.split('\n')){
   const row=document.createElement('span');row.className='lp-line';
   for(const token of line.split(/([A-Za-z0-9’'-]+)/)){
    const word=/^[A-Za-z0-9’'-]+$/.test(token)&&token.length>1?document.createElement('span'):null;
    if(word){word.className='lp-word';row.append(word)}
    for(const ch of Array.from(token)){const glyph=document.createElement('span');glyph.className='lp-char';glyph.textContent=ch;glyph.style.setProperty('--lp-delay',(index++*gap)+'s');(word||row).append(glyph)}
   }
   visual.append(row);
  }
  element.replaceChildren(accessible,visual);
 }
 split(lead,.09,2.8);split(ending,.22,1.1);overlay.classList.add('lp-effects');overlay.dataset.phase='waiting-font';
 const atmosphere=document.createElement('div');atmosphere.className='lp-atmosphere';atmosphere.setAttribute('aria-hidden','true');
 atmosphere.innerHTML='<div class="lp-grid"></div><div class="lp-spot"></div><div class="lp-tint"></div><div class="lp-glow"></div><div class="lp-grain"></div><div class="lp-halo"></div><div class="lp-specks"></div><i class="lp-frame tl"></i><i class="lp-frame tr"></i><i class="lp-frame bl"></i><i class="lp-frame br"></i><span class="lp-temperature">7200K</span>';
 overlay.insertBefore(atmosphere,head);
 const flash=document.createElement('div');flash.className='lp-flash';flash.setAttribute('aria-hidden','true');overlay.append(flash);
 const temperature=atmosphere.querySelector('.lp-temperature');
 try{const grain=document.createElement('canvas');grain.width=grain.height=120;const ctx=grain.getContext('2d'),pixels=ctx.createImageData(120,120);for(let i=0;i<pixels.data.length;i+=4){const value=Math.random()*255;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=value;pixels.data[i+3]=22}ctx.putImageData(pixels,0,0);atmosphere.querySelector('.lp-grain').style.backgroundImage='url('+grain.toDataURL()+')'}catch{}
 const fine=matchMedia('(min-width: 761px) and (pointer: fine)').matches;
 if(animated&&fine){const specks=atmosphere.querySelector('.lp-specks');for(let i=0;i<18;i++){const speck=document.createElement('i');speck.style.cssText='left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;--lp-speck-size:'+(1+Math.random()*2)+'px;--lp-speck-duration:'+(8+Math.random()*6)+'s;--lp-speck-delay:'+(-Math.random()*10)+'s';specks.append(speck)}}
 const revealAll=()=>{overlay.classList.add('lp-effects-ready','lp-cold-on','lp-warm','lp-gold-on','lp-rule-on','lp-subtitle-on','lp-controls-on');temperature.textContent='2400K';overlay.dataset.phase='complete'};
 function glitch(){overlay.classList.add('lp-glitch');at(110,()=>overlay.classList.remove('lp-glitch'))}
 function play(){
  if(disposed||exiting||played)return;played=true;overlay.dataset.animationStarted=String(Math.round(performance.now()));overlay.dataset.phase='cold';
  at(100,()=>overlay.classList.add('lp-effects-ready'));
  at(400,()=>overlay.classList.add('lp-cold-on'));
  at(2500,glitch);at(3500,()=>{glitch();at(170,glitch)});
  at(4900,()=>{overlay.classList.add('lp-warm');overlay.dataset.phase='warming';for(let i=1;i<=18;i++)at(i*200,()=>{const ratio=1-Math.pow(1-i/18,2);temperature.textContent=(Math.round((7200-4800*ratio)/10)*10)+'K'})});
  at(5500,()=>{overlay.classList.add('lp-gold-on');overlay.dataset.phase='gold'});
  at(7600,()=>overlay.classList.add('lp-rule-on'));
  at(8000,()=>overlay.classList.add('lp-subtitle-on'));
  at(8800,()=>{overlay.classList.add('lp-controls-on');overlay.dataset.phase='complete'});
 }
 function visibility(){
  if(disposed||paused===document.hidden)return;paused=document.hidden;overlay.classList.toggle('lp-paused',paused);
  if(paused){const now=performance.now();for(const task of tasks){clearTimeout(task.id);task.remaining=Math.max(0,task.deadline-now)}pausedAnimations=overlay.getAnimations({subtree:true}).filter(animation=>animation.playState==='running');for(const animation of pausedAnimations)animation.pause()}
  else{for(const task of tasks)arm(task);for(const animation of pausedAnimations)if(animation.playState==='paused')animation.play();pausedAnimations=[]}
 }
 document.addEventListener('visibilitychange',visibility,{signal:abort.signal});if(paused)overlay.classList.add('lp-paused');
 if(fine&&animated)overlay.addEventListener('pointermove',event=>{if(disposed||exiting||paused)return;cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{const x=event.clientX/innerWidth,y=event.clientY/innerHeight;overlay.style.setProperty('--lp-mx',x*100+'%');overlay.style.setProperty('--lp-my',y*100+'%');content.style.transform='translate('+((x-.5)*-14)+'px,'+((y-.45)*-10)+'px)'})},{passive:true,signal:abort.signal});
 if(!animated){overlay.classList.add('lp-static');revealAll()}
 else{at(1500,play);try{const font=getComputedStyle(lead).font;if(document.fonts&&font)document.fonts.load(font,lead.textContent).then(play,play);else play()}catch{play()}}
 return {
  holding(value){overlay.classList.toggle('lp-holding',value)},
  exit(){
   if(exitPromise)return exitPromise;if(disposed||!animated||media.matches)return Promise.resolve();
   exiting=true;clearTasks();overlay.classList.remove('lp-glitch','lp-holding');overlay.classList.add('lp-warm','lp-exit');
   exitPromise=new Promise(resolve=>{resolveExit=resolve;const startAt=performance.now()+750;const open=now=>{if(disposed){resolve();return}if(now<startAt){exitFrame=requestAnimationFrame(open);return}overlay.classList.add('lp-opening');const k=Math.min(1,(now-startAt)/1900),ease=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;overlay.style.setProperty('--lp-open',ease*175+'vmax');if(k<1)exitFrame=requestAnimationFrame(open);else resolve()};exitFrame=requestAnimationFrame(open)});
   return exitPromise;
  },
  destroy(){if(disposed)return;disposed=true;abort.abort();clearTasks();cancelAnimationFrame(pointerFrame);cancelAnimationFrame(exitFrame);for(const animation of pausedAnimations)animation.cancel();pausedAnimations=[];resolveExit?.()}
 };
}
function showPrologue({animated=false}={}){
 const w=prologueWords[lang()];let ready=false,requested=false,leaving=false,effects;
 prologue=document.createElement('section');prologue.id='luliy-prologue';prologue.tabIndex=-1;prologue.lang=lang();
 prologue.setAttribute('role','dialog');prologue.setAttribute('aria-modal','true');prologue.setAttribute('aria-label',w.lead.replace('\n',' ')+w.end);
 const grid=document.createElement('div');grid.className='lp-photos';grid.setAttribute('aria-hidden','true');
 photoFiles.forEach(file=>{const img=document.createElement('img');img.className='lp-photo'+(portraitPhotos.has(file)?' lp-photo--person':'')+(recordCovers.has(file)?' lp-photo--record':'');img.alt='';img.decoding='async';img.src=base+'../assets/site/'+file;grid.append(img)});
 const shade=document.createElement('div');shade.className='lp-shade';shade.setAttribute('aria-hidden','true');
 const head=document.createElement('div');head.className='lp-corner';head.innerHTML='<strong>LULIY</strong><span>PROLOGUE · 序</span>';
 const content=document.createElement('div');content.className='lp-content';
 const lead=document.createElement('p');lead.className='lp-lead';lead.textContent=w.lead;
 const ending=document.createElement('h1');ending.className='lp-highlight';ending.textContent=w.end;
 const rule=document.createElement('div');rule.className='lp-rule';rule.setAttribute('aria-hidden','true');
 const english=document.createElement('p');english.className='lp-english';english.textContent=w.en;content.append(lead,ending,rule,english);
 const enter=document.createElement('button');enter.className='lp-enter';enter.type='button';enter.setAttribute('aria-label',w.enter);enter.setAttribute('aria-busy','true');
 enter.innerHTML='<svg class="lp-ring" viewBox="0 0 56 56" aria-hidden="true"><circle class="lp-ring-bg" cx="28" cy="28" r="24"/><circle class="lp-ring-fg" cx="28" cy="28" r="24"/></svg><span role="status" aria-live="polite"></span>';
 const label=enter.querySelector('span');label.textContent=words[lang()][2];
 const skip=document.createElement('button');skip.className='lp-skip';skip.type='button';skip.textContent=w.skip;
 prologue.append(grid,shade,head,content,enter,skip);document.body.append(prologue);isolate();
 const leave=()=>{if(!prologue||leaving)return;leaving=true;enter.disabled=true;skip.disabled=true;if(effects)effects.exit().then(()=>finishIntro(true),()=>finishIntro(true));else{prologue.classList.add('is-leaving');prologueFinishTimer=setTimeout(()=>finishIntro(true),media.matches?0:1250)}};
 const finish=()=>{requested=true;if(ready)leave()};
 enter.addEventListener('click',finish);skip.addEventListener('click',finish);
 prologue.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();finish()}else if(event.key==='Tab'){const buttons=[enter,skip],i=buttons.indexOf(document.activeElement);if(event.shiftKey&&i<=0){event.preventDefault();skip.focus()}else if(!event.shiftKey&&i===1){event.preventDefault();enter.focus()}}});
 const initialHash=location.hash;
 window.addEventListener('hashchange',()=>{if(prologue&&location.hash!==initialHash)finishIntro(false)},{once:true});
 try{effects=mountPrologueEffects({overlay:prologue,lead,ending,head,content,animated})}catch{prologue.classList.remove('lp-effects')}
 // Make the replacement opaque before revealing the body; no intermediate screen.
 prologue.classList.add('is-active');root.classList.add('intro-mounted');prologue.focus({preventScroll:true});
 const destroy=()=>{effects?.destroy()};
 return {setStatus:text=>{if(!ready)label.textContent=text},ready(){ready=true;enter.removeAttribute('aria-busy');label.textContent=w.enter;if(requested)leave();return requested},leave,destroy,detach(){destroy();prologue?.remove();prologue=null}};
}
function revealEye(){if(!eye||eye.dataset.revealing)return;eye.dataset.revealing='1';cancelAnimationFrame(frame);video.pause();const from=geometry(video.currentTime),x=innerWidth/2,y=innerHeight/2,far=Math.hypot(innerWidth,innerHeight)*.65,start=performance.now();eye.classList.add('is-revealing');function zoom(now){const k=Math.min(1,(now-start)/1800),e=k*k*(3-2*k);paint({x:from.x+(x-from.x)*e,y:from.y+(y-from.y)*e,rx:from.rx+(far-from.rx)*e,ry:from.ry+(far-from.ry)*e,scale:from.scale+(1-from.scale)*e});if(k<1)frame=requestAnimationFrame(zoom);else finishIntro(true)}frame=requestAnimationFrame(zoom)}
function skipEye(){if(!eye)return;eye.style.transition='opacity .25s';eye.style.opacity='0';setTimeout(()=>finishIntro(false),270)}
function showEye(){eye=document.createElement('div');eye.id='luliy-intro';eye.setAttribute('role','dialog');eye.setAttribute('aria-modal','true');eye.setAttribute('aria-label',lang()==='en'?'Enter the LULIY homepage':'進入 LULIY 首頁');eye.innerHTML='<video aria-hidden="true"></video><button class="li-skip" type="button"></button>';video=eye.querySelector('video');video.muted=true;video.playsInline=true;video.setAttribute('playsinline','');video.preload='auto';video.poster=base+cfg.poster;video.src=base+cfg.video;eye.querySelector('button').textContent=words[lang()][5];document.body.append(eye);isolate(eye);root.classList.add('intro-live-home');paint(geometry(0));tick();eye.querySelector('button').onclick=skipEye;eye.querySelector('button').focus({preventScroll:true});video.addEventListener('ended',revealEye);video.addEventListener('error',skipEye);video.addEventListener('loadedmetadata',()=>paint(geometry(video.currentTime)));watchdog=setTimeout(skipEye,22000);video.play()?.catch(skipEye);document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();skipEye()}},{capture:true});window.addEventListener('resize',()=>{if(!finished)paint(geometry(video.currentTime))});window.addEventListener('hashchange',()=>{if(!home())finishIntro(false)})}
async function run(){
 const playEye=eyeRequested()&&!media.matches,keepPrologue=prologueRequested()&&!media.matches;
 prologueUI=showPrologue({animated:keepPrologue});
 // Photo requests, page assets, fonts and the real homepage scene start together.
 photoPromise=preloadPhotos();const pagePromise=waitForReady();
 await Promise.all([pagePromise,photoPromise]);if(finished)return;
 const requested=prologueUI.ready();
 if(playEye&&!requested){prologueUI.detach();showEye()}
 else if(!keepPrologue)prologueUI.leave();
}
const start=()=>run().catch(()=>{failed=home();finishIntro(false)});
if(document.body)start();else{const observer=new MutationObserver(()=>{if(document.body){observer.disconnect();start()}});observer.observe(root,{childList:true})}
})();
