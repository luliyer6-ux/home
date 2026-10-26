
/* Locally rendered walnut, lacquer and brass turntable. No remote model or textures. */
(function(){
  'use strict';
  const radians=Math.PI/180;
  function create(host,options={}){
    let renderer;
    try{
      const T=window.LuliyThree||window.LuliyLoadThree();
      renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
      return mount(T,renderer,host,options);
    }catch(error){
      renderer?.dispose();renderer?.domElement.remove();
      host.classList.remove('lr-webgl-ready');
      return null;
    }
  }
  function createEmbedded(T,options={}){
    if(!T||!options.renderer||!options.camera||!options.host)throw new Error('Embedded turntable needs Three, renderer, camera and host');
    return mount(T,options.renderer,options.host,{...options,embedded:true});
  }
  function mount(T,renderer,host,{onPlay,onSeek,onSeekStart,onSeekEnd,onClamp,onFocus,onVolume,getVolume,onChange,rest,liftArmOnPause=false,parkGlassTransparent=false,embedded=false,camera:externalCamera,parkPosition=[4,-.887,1.7]}){
    const canvas=renderer.domElement;
    if(!embedded){
    canvas.className='lr-model-canvas';canvas.setAttribute('aria-hidden','true');host.prepend(canvas);
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
    }
    const scene=new T.Scene(),camera=externalCamera||new T.PerspectiveCamera(34,1,.1,100),model=new T.Group();
    scene.add(model);
    const geometries=new Map(),materials=new Set(),textures=new Set();
    const listeners=[],reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let disposed=false,contextLost=false,visible=true,raf=0,lastTime=0,width=1,height=1,settling=1;
    let clampOff=false,clampMotion=0,resting=false;
    let playing=false,ejected=false,discSpeed=0,armAngle=-.06,armLift=0,theme='dark',labelKey='';
    let weightStartYaw=.18,bleedLeft=0;
    let exchange=null,exchangeId=0,pendingTitle='',pendingNumber=1,pendingCover='',stageWidth=1,stageHeight=1;
    let playbackPosition=0,playbackDuration=0,armEngaged=false,labelSource='';
    const coverCache=new Map();
    let immersive=false,inlineBlend=1;const defaultRest=rest;
    const view={rx:48,rz:-12,zoom:1.2,tx:0,ty:.12,tz:0},targetView={...view};
    const listen=(el,type,fn,opts)=>{el.addEventListener(type,fn,opts);listeners.push(()=>el.removeEventListener(type,fn,opts));};
    function texture(c){const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(t);return t;}
    function paint(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return c;}
    let seed=61;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const walnut=texture(paint(1024,256,(c,w,h)=>{
      const data=c.createImageData(w,h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const bend=22*Math.sin(x*.004)+13*Math.sin(x*.015+y*.011)+4*Math.sin(x*.034),grain=y+bend;
        const rings=Math.sin(grain*.23+Math.sin(grain*.08+x*.002)*2),fine=Math.sin(grain*2.1+x*.006),pore=Math.pow(Math.max(0,Math.sin(grain*.89)),18);
        const v=rings*13+fine*4-pore*20+(random()-.5)*24,i=(y*w+x)*4;
        data.data[i]=Math.max(0,86+v*1.1);data.data[i+1]=Math.max(0,42+v*.65);data.data[i+2]=Math.max(0,23+v*.4);data.data[i+3]=255;
      }
      c.putImageData(data,0,0);
      for(let i=0;i<110;i++){c.strokeStyle=`rgba(20,8,3,${.06+random()*.12})`;c.lineWidth=.3+random();const y=random()*h;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(w*.35,y-8,w*.6,y+10,w,y+random()*4);c.stroke();}
    }));
    const studio=texture(paint(1024,512,(c,w,h)=>{
      c.fillStyle='#0b0b0d';c.fillRect(0,0,w,h);
      const panel=(x,y,pw,ph,color)=>{const g=c.createLinearGradient(x,0,x+pw,0);g.addColorStop(0,'#151413');g.addColorStop(.14,color);g.addColorStop(.55,color);g.addColorStop(1,'#151413');c.fillStyle=g;c.fillRect(x,y,pw,ph);};
      panel(25,75,220,355,'#fff7e8');panel(585,80,160,335,'#e6e9ec');
    }));studio.mapping=T.EquirectangularReflectionMapping;scene.environment=studio;scene.environmentIntensity=1.65;
    function material(params){const m=new T.MeshPhysicalMaterial(embedded?{envMap:studio,envMapIntensity:1.65,...params}:params);materials.add(m);return m;}
    const wood=material({map:walnut,bumpMap:walnut,bumpScale:.014,roughness:.43,metalness:0,clearcoat:.1,clearcoatRoughness:.38});
    const black=material({color:0x050607,roughness:.16,metalness:.72,clearcoat:.8,clearcoatRoughness:.16});
    const rubber=material({color:0x070809,roughness:.82,metalness:.05});
    const brass=material({color:0xd8b879,metalness:1,roughness:.18});
    const brightBrass=material({color:0xead1a0,metalness:1,roughness:.12});
    const brushed=material({color:0xb18a4c,metalness:1,roughness:.34});
    const steel=material({color:0x969ba1,metalness:1,roughness:.25});
    const armBlack=material({color:0x15191b,metalness:.82,roughness:.24,clearcoat:.5});
    function geo(kind,args){const key=kind+args.join(',');if(!geometries.has(key))geometries.set(key,new T[kind](...args));return geometries.get(key);}
    function mesh(g,m,pos,parent=model){const o=new T.Mesh(g,m);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
    const box=(x,y,z,m,pos,parent)=>mesh(geo('BoxGeometry',[x,y,z]),m,pos,parent);
    const cylinder=(r,h,m,pos,parent=model,segments=64)=>mesh(geo('CylinderGeometry',[r,r,h,segments]),m,pos,parent);
    const ring=(r,tube,m,pos,parent=model)=>{const o=mesh(geo('TorusGeometry',[r,tube,10,96]),m,pos,parent);o.rotation.x=-Math.PI/2;return o;};
    function rod(a,b,r,m,parent=model){const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start);const o=cylinder(r,delta.length(),m,start.clone().add(end).multiplyScalar(.5).toArray(),parent,20);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
    function faceText(text,sub,w,h,color='#d8bf91'){
      return texture(paint(w,h,(c)=>{c.fillStyle=color;c.textAlign='center';c.font='28px Georgia';c.fillText(text,w/2,h*.43);c.font='10px Georgia';c.fillText(sub,w/2,h*.72);}));
    }
    // Solid wood case, recessed piano-black deck and a fine brass reveal.
    box(6.65,.68,4.72,wood,[0,-.105,0]);
    box(6.58,.06,4.65,wood,[0,.265,0]);
    box(6.58,.05,4.65,wood,[0,-.47,0]);
    box(6.35,.045,4.43,brightBrass,[0,.312,0]);
    box(6.29,.04,4.37,black,[0,.35,0]);
    box(6.38,.055,4.44,rubber,[0,-.51,0]);
    for(const x of [-2.75,2.75])for(const z of [-1.82,1.82]){
      cylinder(.31,.10,black,[x,-.56,z]);cylinder(.28,.23,brass,[x,-.7,z]);
      ring(.279,.014,brightBrass,[x,-.595,z]);cylinder(.295,.075,rubber,[x,-.845,z]);
    }
    const badgeMap=faceText('L U L I Y','REFERENCE  /  DIRECT DRIVE',512,100);
    const badgeMaterial=new T.MeshBasicMaterial({map:badgeMap,transparent:true,depthWrite:false});materials.add(badgeMaterial);
    const badge=mesh(geo('PlaneGeometry',[1.48,.29]),badgeMaterial,[1.89,.375,1.79]);badge.rotation.x=-Math.PI/2;badge.castShadow=false;
    // A machined platter with a substantial reflective rim.
    const center=[-.79,0,-.1];
    cylinder(1.99,.07,rubber,[center[0],.405,center[2]],model,128);
    cylinder(1.975,.265,brass,[center[0],.555,center[2]],model,128);
    ring(1.972,.013,brightBrass,[center[0],.431,center[2]]);
    cylinder(1.982,.022,brightBrass,[center[0],.687,center[2]],model,128);
    ring(1.96,.011,brushed,[center[0],.702,center[2]]);
    const disc=new T.Group();disc.name='vinyl';disc.position.set(center[0],.714,center[2]);model.add(disc);
    const discBodyMaterial=material({color:0x070809,roughness:.82,metalness:.05});
    cylinder(1.935,.026,discBodyMaterial,[0,0,0],disc,128);
    const grooveCanvas=paint(1024,1024,(c,w,h)=>{
      c.fillStyle='#111213';c.fillRect(0,0,w,h);
      for(let r=166;r<510;r+=3.6){const band=Math.sin(r*.028)*.5+.5,v=30+band*12+random()*10;c.strokeStyle=`rgb(${v},${v+1},${v+2})`;c.lineWidth=1.1+random()*.5;c.beginPath();c.arc(w/2,h/2,r,0,Math.PI*2);c.stroke();}
      for(const r of [190,247,320,397,471]){c.strokeStyle='#08090a';c.lineWidth=2;c.beginPath();c.arc(w/2,h/2,r,0,Math.PI*2);c.stroke();}
    });
    const grooveMap=texture(grooveCanvas);
    const grainDirection=texture(paint(512,512,(c,w,h)=>{
      const data=c.createImageData(w,h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const a=Math.atan2(y-h/2,x-w/2)+Math.PI/2,i=(y*w+x)*4;
        data.data[i]=127.5+127.5*Math.cos(a);data.data[i+1]=127.5+127.5*Math.sin(a);data.data[i+2]=255;data.data[i+3]=255;
      }
      c.putImageData(data,0,0);
    }));grainDirection.colorSpace='';
    const vinylMaterial=material({map:grooveMap,bumpMap:grooveMap,bumpScale:.035,color:0x282828,metalness:.08,roughness:.56,anisotropy:.28,anisotropyMap:grainDirection,clearcoat:.025,clearcoatRoughness:.48});
    // Keep fine circular cuts readable at small sizes without additional meshes.
    vinylMaterial.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
        float cutRadius = length(vMapUv - vec2(0.5));
        float cutPhase = cutRadius * 172.0;
        float cutAA = max(fwidth(cutPhase), 0.05);
        float cutRidge = 1.0 - smoothstep(0.16 - cutAA * 0.45, 0.16 + cutAA * 0.45, abs(fract(cutPhase) - 0.5));
        outgoingLight *= mix(0.68, 1.03, cutRidge);
        #include <opaque_fragment>
      `);
    };
    const grooveDisc=mesh(geo('CircleGeometry',[1.933,128]),vinylMaterial,[0,.015,0],disc);grooveDisc.rotation.x=-Math.PI/2;
    const labelCanvas=paint(1024,1024,()=>{}),labelMap=texture(labelCanvas);
    const labelMaterial=material({map:labelMap,roughness:.7,metalness:0});
    const label=mesh(geo('CircleGeometry',[.635,96]),labelMaterial,[0,.017,0],disc);label.name='record-label';label.rotation.x=-Math.PI/2;
    function paintLabel(image){
      const c=labelCanvas.getContext('2d'),size=labelCanvas.width;c.clearRect(0,0,size,size);
      // The artwork changes inside the existing circular geometry only.
      c.fillStyle='#172126';c.fillRect(0,0,size,size);
      if(image){
        const crop=Math.min(image.naturalWidth||image.width,image.naturalHeight||image.height);
        c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
        c.drawImage(image,((image.naturalWidth||image.width)-crop)/2,((image.naturalHeight||image.height)-crop)/2,crop,crop,0,0,size,size);
      }
      labelMap.needsUpdate=true;settling=2;request();
    }
    function primeCover(source){
      if(!source||coverCache.has(source))return;
      const image=new Image(),entry={image,ready:false};coverCache.set(source,entry);
      image.crossOrigin='anonymous';image.decoding='async';
      image.onload=()=>{
        if(disposed)return;entry.ready=true;
        if(labelSource===source)paintLabel(image);
      };
      image.onerror=()=>{if(!disposed&&labelSource===source)paintLabel(null);};
      image.src=source;
    }
    function updateLabel(title,number,cover=''){
      const key=title+'|'+number+'|'+cover;if(key===labelKey)return;labelKey=key;labelSource=cover;
      primeCover(cover);const entry=coverCache.get(cover);paintLabel(entry?.ready?entry.image:null);
    }
    updateLabel('Listening room',1);
    cylinder(.085,.025,brass,[center[0],.751,center[2]],model,32);
    cylinder(.033,.18,brightBrass,[center[0],.845,center[2]],model,24);
    const tip=mesh(geo('SphereGeometry',[.032,16,8]),brightBrass,[center[0],.939,center[2]]);
    // A clear optical-glass clamp: the same silhouette, with physical
    // transmission and softly refracted artwork visible beneath its facets.
    const weight=new T.Group();weight.name='spindle-weight';model.add(weight);
    const weightHome=new T.Vector3(center[0],.735,center[2]);weight.position.copy(weightHome);
    const glassProperties={color:0xf1f7fa,metalness:0,roughness:parkGlassTransparent?.42:.13,transmission:parkGlassTransparent?.92:.98,thickness:.34,ior:1.46,attenuationColor:0xdbeef2,attenuationDistance:7,clearcoat:.8,clearcoatRoughness:parkGlassTransparent?.28:.045,envMapIntensity:.45,flatShading:true,transparent:parkGlassTransparent};
    const facet=material(glassProperties),softFacet=material({...glassProperties,roughness:parkGlassTransparent?.48:.16,thickness:.39});
    const glassBase=material({...glassProperties,roughness:parkGlassTransparent?.34:.1,thickness:.08});
    const weightBase=box(.78,.085,.78,glassBase,[0,.0425,0],weight);weightBase.castShadow=false;
    const shoulder=box(.72,.02,.72,glassBase,[0,.095,0],weight);shoulder.castShadow=false;
    const pyramidGeometry=geo('CylinderGeometry',[0,.51,.88,4,1,false]);
    const sides=pyramidGeometry.groups[0],perFacet=sides.count/4;
    const caps=pyramidGeometry.groups.filter(g=>g.materialIndex>0).map(g=>({...g}));pyramidGeometry.clearGroups();
    for(let i=0;i<4;i++)pyramidGeometry.addGroup(sides.start+i*perFacet,perFacet,i);
    caps.forEach(g=>pyramidGeometry.addGroup(g.start,g.count,4));
    const facets=[facet,softFacet,facet,softFacet,glassBase];
    const pyramid=mesh(pyramidGeometry,facets,[0,.54,0],weight);
    pyramid.name='glass-pyramid';pyramid.castShadow=false;pyramid.rotation.y=Math.PI/4;weight.rotation.y=.18;
    const weightStart=weightHome.clone(),discHome=disc.position.clone(),discStart=disc.position.clone();
    let incomingOrigin=null,outgoingOrigin=null;const weightPark=new T.Vector3(),outPoint=new T.Vector3(),inPoint=new T.Vector3(),controlPoint=new T.Vector3();
    const parkedView=camera.quaternion.clone(),parkedRotation=camera.quaternion.clone(),seatedRotation=camera.quaternion.clone(),verticalAxis=new T.Vector3(0,1,0),parkTop=new T.Vector3(),parkBottom=new T.Vector3();let parkedViewReady=false;
    const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
    const phase=(p,a,b)=>ease((p-a)/(b-a));
    function arc(object,from,to,t,lift){object.position.copy(from).lerp(to,t);object.position.y+=Math.sin(t*Math.PI)*lift;}
    function discOpacity(alpha){
      disc.visible=alpha>.001;
      for(const m of [discBodyMaterial,vinylMaterial,labelMaterial]){
        // A seated disc belongs to the opaque transmission buffer so the
        // glass can refract its cover, rather than the empty deck below it.
        const transparent=alpha<.999;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}
        m.opacity=alpha;m.depthWrite=alpha>.95;
      }
    }
    // Front-left speed control, small index marks and warm operating light.
    cylinder(.27,.037,rubber,[-2.72,.387,1.66]);cylinder(.24,.103,brass,[-2.72,.46,1.66]);
    cylinder(.224,.02,brightBrass,[-2.72,.518,1.66]);
    const volumeMarker=box(.012,.003,.078,black,[-2.72,.53,1.52]);
    let knobVolume=-1;
    function setVolume(value){const volume=Math.max(0,Math.min(1,Number(value)||0));if(volume===knobVolume)return;knobVolume=volume;const angle=(volume-.5)*Math.PI*1.5;volumeMarker.position.set(-2.72+Math.sin(angle)*.14,.53,1.66-Math.cos(angle)*.14);volumeMarker.rotation.y=-angle;settling=2;request();}
    for(let i=0;i<7;i++){const a=(-60+i*20)*radians;const mark=box(.014,.006,.04,brushed,[-2.72+Math.sin(a)*.345,.375,1.66-Math.cos(a)*.345]);mark.rotation.y=-a;}
    const ledMaterial=new T.MeshBasicMaterial({color:0x756142});materials.add(ledMaterial);
    const led=mesh(geo('CircleGeometry',[.024,16]),ledMaterial,[-2.23,.374,1.87]);led.rotation.x=-Math.PI/2;led.castShadow=false;
    // Arm bearing, gimbal, counterweight and a separate moving carbon arm.
    const px=2.22,pz=-1.25;
    cylinder(.49,.06,rubber,[px,.395,pz]);cylinder(.465,.095,brass,[px,.47,pz]);
    ring(.453,.013,brightBrass,[px,.518,pz]);cylinder(.28,.36,armBlack,[px,.71,pz]);
    cylinder(.285,.04,brass,[px,.56,pz]);cylinder(.3,.06,brass,[px,.88,pz]);
    const bearing=cylinder(.23,.25,brass,[px,1.075,pz]);bearing.rotation.x=Math.PI/2;
    const gimbal=mesh(geo('TorusGeometry',[.256,.061,12,48]),armBlack,[px,1.075,pz]);
    cylinder(.065,.44,brightBrass,[px,1.13,pz]);cylinder(.2,.065,brass,[px,1.376,pz]);
    cylinder(.163,.072,armBlack,[px,1.442,pz]);ring(.163,.008,brightBrass,[px,1.48,pz]);
    for(let i=0;i<30;i++){const a=i*Math.PI*2/30;const tooth=box(.013,.046,.013,brushed,[px+Math.cos(a)*.168,1.443,pz+Math.sin(a)*.168]);tooth.rotation.y=-a;}
    const arm=new T.Group();arm.name='tonearm';arm.position.set(px,.945,pz);arm.rotation.y=armAngle;model.add(arm);
    rod([0,.13,-.69],[0,.13,2.78],.048,armBlack,arm);
    rod([0,.13,-.78],[0,.13,-.41],.257,brass,arm);
    rod([0,.13,-.8],[0,.13,-.775],.267,brightBrass,arm);
    rod([0,.13,-.43],[0,.13,-.405],.267,brightBrass,arm);
    rod([0,.13,2.6],[0,.13,2.76],.064,brass,arm);
    const head=box(.255,.055,.48,armBlack,[0,.123,2.96],arm);
    box(.174,.18,.21,brushed,[0,-.003,3.052],arm);
    box(.142,.14,.185,black,[0,-.027,3.064],arm);
    for(const x of [-.078,.078]){cylinder(.023,.02,brightBrass,[x,.162,2.86],arm,16);box(.029,.004,.005,black,[x,.174,2.86],arm);}
    const stylus=rod([-.04,-.077,3.1],[-.04,-.19,3.13],.009,steel,arm);stylus.name='stylus';
    const pivotRadius=Math.hypot(px-center[0],pz-center[2]),stylusRadius=Math.hypot(-.04,3.13);
    const closestArmAngle=Math.atan2(center[0]-px,center[2]-pz)-Math.atan2(-.04,3.13);
    function angleForProgress(progress){
      const radius=1.84-(1.84-.66)*progress;
      return closestArmAngle+Math.acos(Math.max(-1,Math.min(1,(pivotRadius* pivotRadius+stylusRadius*stylusRadius-radius*radius)/(2*pivotRadius*stylusRadius))));
    }
    function trackingAngle(){return angleForProgress(playbackDuration>0?Math.max(0,Math.min(1,playbackPosition/playbackDuration)):0);}
    rod([.11,.11,2.97],[.26,.065,3.14],.016,brass,arm);
    for(const [x,color] of [[-.063,0x823329],[.063,0x386860]]){const wire=material({color,roughness:.5});rod([x,.088,2.7],[x,-.009,2.92],.008,wire,arm);}
    // Cue lever and the arm rest are independent of the moving arm.
    cylinder(.053,.38,brass,[2.41,.58,.93],model,20);
    box(.25,.06,.12,black,[2.41,.79,.93]);
    rod([px+.23,.84,pz+.14],[px+.55,.72,pz+.45],.017,brass);
    rod([px+.53,.72,pz+.43],[px+.66,.72,pz+.53],.038,armBlack);
    // Soft studio lighting and contact shadows. No animated light or render loop while idle.
    const roomAmbient=new T.AmbientLight(0xfff4de,.4);scene.add(roomAmbient);
    const key=new T.DirectionalLight(0xfff2db,2.5);key.position.set(-3,7,5);key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.camera.near=.5;key.shadow.camera.far=20;key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=3;scene.add(key);
    const rim=new T.DirectionalLight(0xffe1ae,1.6);rim.position.set(5,4,-4);scene.add(rim);
    const fill=new T.DirectionalLight(0xc5d3e5,.55);fill.position.set(-5,2,-1);scene.add(fill);
    const shadowMaterial=new T.ShadowMaterial({opacity:.34});materials.add(shadowMaterial);
    const ground=mesh(geo('PlaneGeometry',[18,18]),shadowMaterial,[0,-.887,0],scene);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
    const target=new T.Vector3(0,.12,0),direction=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),corner=new T.Vector3();
    const bounds=[];
    for(const x of [-3.33,3.33])for(const y of [-.5,.38])for(const z of [-2.36,2.36])bounds.push([x,y,z]);
    for(const x of [-3.05,3.05])for(const z of [-2.12,2.12])bounds.push([x,-.89,z]);
    for(const x of [1.7,2.8])for(const z of [-2.1,-.72])bounds.push([x,1.51,z]);
    for(const x of [-2.78,1.2])for(const z of [-2.09,1.89])bounds.push([x,.72,z]);
    bounds.push([center[0],1.74,center[2]]);
    function frameCamera(){
      const elevation=(78-view.rx)*radians,azimuth=(30+(view.rz+12))*radians;
      direction.set(Math.sin(azimuth)*Math.cos(elevation),Math.sin(elevation),Math.cos(azimuth)*Math.cos(elevation));
      right.set(Math.cos(azimuth),0,-Math.sin(azimuth));up.crossVectors(direction,right);camera.up.copy(up);
      target.set(view.tx,view.ty,view.tz);ground.visible=direction.y>.05;
      const tangent=Math.tan(camera.fov*radians/2);let distance=0,safeDistance=0;
      const horizontalLeft=stageWidth/2+bleedLeft-12,horizontalRight=stageWidth/2+20;
      const verticalTop=stageHeight*.44+64,verticalBottom=host.clientHeight-76+Math.max(0,(view.zoom-1)*340)-stageHeight*.44;
      for(const [x,y,z] of bounds){
        corner.set(x,y,z).sub(target);const depth=corner.dot(direction);
        const h=corner.dot(right),v=corner.dot(up);
        safeDistance=Math.max(safeDistance,depth+Math.abs(h)*stageHeight/(2*tangent*(h<0?horizontalLeft:horizontalRight)),depth+Math.abs(v)*stageHeight/(2*tangent*(v<0?verticalBottom:verticalTop)));
        distance=Math.max(distance,depth+Math.abs(corner.dot(right))/(tangent*camera.aspect*.94),depth+Math.abs(corner.dot(up))/(tangent*.92));
      }
      const framingZoom=host.closest(".lr-home")&&!immersive?.82:stageWidth<500?.72+Math.max(0,Math.min(1,(view.zoom-.7)/.65))*.26:.85+Math.max(0,Math.min(1,(view.zoom-.7)/.65))*.65;
      const inlineDistance=Math.max(distance/framingZoom,safeDistance),worldDistance=distance/view.zoom;
      camera.position.copy(target).addScaledVector(direction,worldDistance+(inlineDistance-worldDistance)*inlineBlend);camera.lookAt(target);camera.updateMatrixWorld();
    }
    function request(){if(embedded){if(!disposed)onChange?.();return;}if(!disposed&&!contextLost&&!raf&&visible&&!document.hidden)raf=requestAnimationFrame(draw);}
    const screenDepth=new T.Vector3();
    function worldAtScreen(x,y,out,reference=weightHome,r=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect())){
      screenDepth.copy(reference);if(embedded)model.localToWorld(screenDepth);screenDepth.project(camera);
      out.set((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2,screenDepth.z).unproject(camera);
      return embedded?model.worldToLocal(out):out;
    }
    function placeExchange(now){
      // A seated record needs no page geometry. Avoid five layout reads
      // per playback frame; parking and exchange alone need screen coordinates.
      let area,canvasArea;
      if(exchange||ejected||clampOff||clampMotion>.001){
        area=host.getBoundingClientRect();canvasArea=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect());const tray=rest?.getBoundingClientRect();
        if(embedded)weightPark.set(...parkPosition);
        else worldAtScreen(tray?tray.left+Math.min(78,tray.width*.3):area.right+55,tray?tray.bottom-20:area.bottom-40,weightPark,weightHome,canvasArea);
      }
      if(!exchange){
        if(parkGlassTransparent)for(const m of [facet,softFacet,glassBase])m.opacity=1-.58*(ejected?1:ease(clampMotion));
        disc.position.copy(discHome);disc.rotation.x=0;disc.rotation.z=0;disc.scale.setScalar(1);discOpacity(ejected?0:1);
        if(ejected)weight.position.copy(weightPark);else arc(weight,weightHome,weightPark,ease(clampMotion),.8);weight.rotation.y=(ejected||clampMotion>.001)?.18:disc.rotation.y+.18;
        const nextPhase=ejected?'empty':'seated';if(host.dataset.exchangePhase!==nextPhase)host.dataset.exchangePhase=nextPhase;return;
      }
      if(embedded){outPoint.set(-5,2.9,-3);if(outgoingOrigin)outPoint.copy(disc.parent.worldToLocal(outgoingOrigin.clone()));inPoint.set(-4.2,3,-2.5);if(incomingOrigin)inPoint.copy(disc.parent.worldToLocal(incomingOrigin.clone()));}
      else{
        worldAtScreen(area.left+stageWidth*.08,area.top+stageHeight*.09,outPoint,discHome,canvasArea);
        worldAtScreen(area.left+stageWidth*.13,area.top+stageHeight*.03,inPoint,discHome,canvasArea);
      }
      const raw=Math.max(0,Math.min(1,(now-exchange.start)/exchange.duration));
      const p=exchange.kind==='eject'?raw*.56:raw;
      const remove=phase(p,.07,.28),depart=phase(p,outgoingOrigin?.37:.29,.54),arrive=phase(p,.56,.8),replace=phase(p,.82,.98);
      // The transparent canvas has no opaque scenery to refract at the parking spot.
      if(parkGlassTransparent)for(const m of [facet,softFacet,glassBase])m.opacity=1-.58*remove*(1-replace);
      arc(weight,weightStart,weightPark,remove,.8*Math.min(1,weightStart.distanceTo(weightPark)));
      if(p>=.82)arc(weight,weightPark,weightHome,replace,.82);
      weight.rotation.y=weightStartYaw+(.18-weightStartYaw)*remove+Math.sin(remove*Math.PI)*.2-Math.sin(replace*Math.PI)*.18;
      if(p<.56){
        if(outgoingOrigin){const raised=discStart.clone();raised.y+=.85;if(p<.37){disc.position.copy(discStart);disc.position.y+=.85*phase(p,.29,.37);}else arc(disc,raised,outPoint,depart,.65);}else arc(disc,discStart,outPoint,depart,1.05);
        disc.rotation.x=-.1*depart;disc.rotation.z=.13*depart;
        discOpacity(exchange.fromEmpty?0:outgoingOrigin?1-phase(p,.53,.56):1-phase(p,.39,.54));
      }else{
        updateLabel(pendingTitle,pendingNumber,pendingCover);
        arc(disc,inPoint,discHome,arrive,.52);
        disc.rotation.x=-.2*(1-arrive);disc.rotation.z=.16*(1-arrive);
        discOpacity(incomingOrigin?1:phase(p,.56,.64));
      }
      disc.scale.setScalar(outgoingOrigin&&p<.56?1-.81*depart:1);
      const nextPhase=p<.07?'arm-return':p<.28?'unclamp':p<.56?'eject':p<.8?'insert':p<.98?'clamp':'seated';if(host.dataset.exchangePhase!==nextPhase)host.dataset.exchangePhase=nextPhase;
      renderer.shadowMap.needsUpdate=true;
    }
    function lockParkedGlass(now){
      if(!parkGlassTransparent||embedded)return;
      if(!parkedViewReady){parkedView.copy(camera.quaternion).invert().multiply(seatedRotation.setFromAxisAngle(verticalAxis,.18));parkedViewReady=true;}
      const raw=exchange?Math.max(0,Math.min(1,(now-exchange.start)/exchange.duration)):0,p=exchange?.kind==='eject'?raw*.56:raw;
      const blend=exchange?phase(p,.07,.28)*(1-phase(p,.82,.98)):ejected?1:ease(clampMotion);
      seatedRotation.setFromAxisAngle(verticalAxis,weight.rotation.y);
      parkedRotation.copy(camera.quaternion).multiply(parkedView);
      weight.quaternion.copy(parkedRotation);weight.scale.setScalar(1);weight.updateWorldMatrix(true,false);
      parkBottom.set(0,0,0);weight.localToWorld(parkBottom).project(camera);
      parkTop.set(0,1,0);weight.localToWorld(parkTop).project(camera);
      const projectedHeight=Math.abs(parkTop.y-parkBottom.y)*height/2,parkedScale=(stageWidth<500?48:66)/Math.max(1,projectedHeight);
      weight.quaternion.copy(seatedRotation).slerp(parkedRotation,blend);weight.scale.setScalar(1+(parkedScale-1)*blend);
    }
    function draw(now){
      raf=0;if(disposed||contextLost||!visible||document.hidden)return;
      const dt=Math.min(.05,lastTime?(now-lastTime)/1000:.016);lastTime=now;
      const lerp=reduce.matches?1:1-Math.exp(-dt*15);
      let movement=0;for(const k of ['rx','rz','zoom','tx','ty','tz']){view[k]+=(targetView[k]-view[k])*(immersive&&!reduce.matches?1-Math.exp(-dt*7):lerp);movement+=Math.abs(targetView[k]-view[k]);}
      clampMotion+=((clampOff?1:0)-clampMotion)*(reduce.matches?1:1-Math.exp(-dt*7));
      const exchangeProgress=exchange?Math.max(0,Math.min(1,(now-exchange.start)/exchange.duration)):1;
      const seeking=control?.kind==='arm'&&control.moved;
      const pausedArm=liftArmOnPause&&!playing&&!exchange&&!seeking;
      const armDestination=ejected||resting||clampOff||pausedArm||exchange&&(exchange.kind==='eject'||exchangeProgress<.9)||!armEngaged&&!exchange?-.06:trackingAngle();
      // Lift before sweeping off the vinyl; returning to playback stays raised until aligned.
      const nextArm=pausedArm&&Math.abs(armAngle-armDestination)>.02&&armLift<.08?armAngle:armDestination;
      if(Math.abs(armAngle-nextArm)>.0005)renderer.shadowMap.needsUpdate=true;
      armAngle+=(nextArm-armAngle)*(reduce.matches?1:1-Math.exp(-dt*7));arm.rotation.y=armAngle;
      const targetLift=((seeking||resting||clampOff||pausedArm||liftArmOnPause&&!exchange&&Math.abs(armAngle-armDestination)>.03)? .13:0)+(exchange?phase((now-exchange.start)/exchange.duration,0,.06)*(1-phase((now-exchange.start)/exchange.duration,.9,1))*.13:0);
      if(Math.abs(armLift-targetLift)>.001)renderer.shadowMap.needsUpdate=true;
      armLift+=(targetLift-armLift)*(reduce.matches?1:1-Math.exp(-dt*14));arm.position.y=.945+armLift;
      discSpeed+=((playing&&!exchange&&!reduce.matches?1:0)-discSpeed)*(1-Math.exp(-dt*5));
      if(discSpeed>.0001)disc.rotation.y-=dt*(Math.PI*2/1.8)*.7*discSpeed;
      weight.rotation.y=disc.rotation.y+.18;
      ledMaterial.color.set(playing?0xf4c87e:0x756142);
      if(!embedded)frameCamera();placeExchange(now);lockParkedGlass(now);
      if(!embedded){renderer.render(scene,camera);host.classList.add('lr-webgl-ready');}
      settling--;
      const active=Math.abs(armLift-targetLift)>.001||Math.abs(clampMotion-(clampOff?1:0))>.001||exchange||(playing&&!reduce.matches)||movement>.001||Math.abs(armAngle-nextArm)>.0005||discSpeed>.001||settling>0;
      if(active)request();return !!active;
    }
    function resize(){
      if(disposed)return;stageWidth=host.clientWidth;stageHeight=Math.max(180,host.clientHeight-64*inlineBlend);if(!stageWidth)return;
      const layout=host.closest('.lr-standalone .lr-layout')||host.parentElement,area=host.getBoundingClientRect(),layoutArea=layout.getBoundingClientRect();
      const homeFrame=!!host.closest(".lr-home")&&!immersive;const padX=homeFrame?0:Math.min(120,Math.max(0,area.left-8))*inlineBlend,padTop=homeFrame?0:80*inlineBlend;bleedLeft=padX;
      const nativeWidth=homeFrame?stageWidth:Math.max(stageWidth,layoutArea.right-area.left+Math.min(120,Math.max(0,area.left-8))+24);
      const nativeHeight=homeFrame?host.clientHeight:Math.max(host.clientHeight,(rest?.getBoundingClientRect().bottom||area.bottom)-area.top)+224;
      const nextWidth=Math.ceil(stageWidth+(nativeWidth-stageWidth)*inlineBlend),nextHeight=Math.ceil(host.clientHeight+(nativeHeight-host.clientHeight)*inlineBlend);
      if(width!==nextWidth||height!==nextHeight){width=nextWidth;height=nextHeight;const ratio=window.LuliyQuality.ratio(renderer,1.5,2200000,width,height);if(Math.abs(renderer.getPixelRatio()-ratio)>.01)renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);}canvas.style.width=width+'px';canvas.style.height=height+'px';
      canvas.style.left=-padX+'px';canvas.style.top=-padTop+'px';
      if(inlineBlend===0||homeFrame){camera.clearViewOffset();camera.aspect=width/height;}
      else camera.setViewOffset(stageWidth,stageHeight,-padX,-padTop+stageHeight*.06*inlineBlend,width,height);
      camera.updateProjectionMatrix();settling=2;request();
    }
    let resizeObserver=null,intersection=null;
    if(!embedded){
      resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resizeObserver.observe(host.parentElement);if(rest)resizeObserver.observe(rest);
      intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>.01;if(visible){lastTime=0;settling=2;request();}else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'0px',threshold:[0,.01]});intersection.observe(host);
      listen(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{lastTime=0;settling=2;request();}});
      listen(reduce,'change',()=>{settling=2;request();});
    }
    function project(point){const p=point.clone().project(camera),r=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect());return {x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};}
    let control=null;
    function localPointer(x,y){
      const r=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect()),origin=camera.getWorldPosition(new T.Vector3());
      const direction=new T.Vector3((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2,.5).unproject(camera).sub(origin).normalize();
      model.updateWorldMatrix(true,false);
      const normal=new T.Vector3(0,1,0).transformDirection(model.matrixWorld),planePoint=model.localToWorld(new T.Vector3(0,.945,0));
      const denominator=direction.dot(normal);if(Math.abs(denominator)<.00001)return null;
      const distance=planePoint.sub(origin).dot(normal)/denominator;if(distance<0)return null;
      return model.worldToLocal(origin.addScaledVector(direction,distance));
    }
    function hitControl(x,y){
      model.updateWorldMatrix(true,true);
      const normal=new T.Vector3(0,1,0).transformDirection(model.matrixWorld);
      if(camera.getWorldPosition(new T.Vector3()).sub(model.localToWorld(new T.Vector3(0,.945,0))).dot(normal)<0)return null;
      const clampPoint=project(weight.localToWorld(new T.Vector3(0,.45,0)));if(onClamp&&Math.hypot(x-clampPoint.x,y-clampPoint.y)<24)return 'clamp';
      const knob=project(model.localToWorld(new T.Vector3(-2.72,.53,1.66)));
      if(Math.hypot(x-knob.x,y-knob.y)<24)return 'volume';
      const a=project(arm.localToWorld(new T.Vector3(0,.13,0))),b=project(arm.localToWorld(new T.Vector3(0,.13,3.13)));
      const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;if(length<1)return null;
      const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/length));
      return Math.hypot(x-a.x-t*dx,y-a.y-t*dy)<16?'arm':null;
    }
    function beginControl(e){
      if(control)return true;
      if(exchange||ejected||e.button!==0)return false;
      const kind=hitControl(e.clientX,e.clientY);if(!kind||kind==='arm'&&!playbackDuration)return false;
      const point=localPointer(e.clientX,e.clientY);if(kind==='arm'&&!point)return false;
      control={kind,id:e.pointerId,x:e.clientX,y:e.clientY,position:playbackPosition,volume:getVolume?.()??.45,angle:liftArmOnPause&&!playing?trackingAngle():armEngaged?armAngle:trackingAngle(),pointerAngle:point?Math.atan2(point.x-px,point.z-pz):0,moved:false};
      host.classList.add('lr-control-dragging');return true;
    }
    function moveControl(e){
      if(!control||control.id!==e.pointerId)return false;
      if(Math.hypot(e.clientX-control.x,e.clientY-control.y)<3&&!control.moved)return true;
      if(!control.moved&&control.kind==='arm'){onSeekStart?.();host.classList.add('lr-arm-seeking');}
      control.moved=true;
      if(control.kind==='volume')onVolume?.(Math.max(0,Math.min(1,control.volume+(e.clientX-control.x-(e.clientY-control.y))/180)));
      else if(control.kind==='arm'){
        const point=localPointer(e.clientX,e.clientY);if(!point)return true;
        const delta=Math.atan2(point.x-px,point.z-pz)-control.pointerAngle;
        const angle=Math.max(angleForProgress(1),Math.min(angleForProgress(0),control.angle+Math.atan2(Math.sin(delta),Math.cos(delta))));
        const x=px-.04*Math.cos(angle)+3.13*Math.sin(angle),z=pz+.04*Math.sin(angle)+3.13*Math.cos(angle);
        const radius=Math.hypot(x-center[0],z-center[2]),ratio=Math.max(0,Math.min(1,(1.84-radius)/(1.84-.66)));
        playbackPosition=ratio*playbackDuration;armEngaged=true;settling=2;request();onSeek?.(ratio,false);
      }
      return true;
    }
    function endControl(e){
      if(!control||control.id!==e.pointerId)return false;
      const finished=control;control=null;host.classList.remove('lr-control-dragging','lr-arm-seeking');
      if(finished.kind==='arm'){
        if(e.type==='pointercancel'){playbackPosition=finished.position;onSeek?.(playbackPosition/playbackDuration,false);}
        else if(finished.moved)onSeek?.(playbackPosition/playbackDuration,true);
        else if(onFocus)onFocus('arm');else onPlay?.();
        if(finished.moved)onSeekEnd?.();
      }
      if(finished.kind==='clamp'&&!finished.moved&&e.type!=='pointercancel')onClamp?.();
      if(finished.kind==='volume'&&!finished.moved&&e.type!=='pointercancel')onFocus?.('volume');
      settling=2;request();return true;
    }
    function wheelControl(e){if(exchange||hitControl(e.clientX,e.clientY)!=='volume'||e.ctrlKey)return false;onVolume?.(Math.max(0,Math.min(1,(getVolume?.()??.45)-e.deltaY*(e.deltaMode===1?16:1)*.001)));return true;}
    if(!embedded){
      listen(canvas,'webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(raf);raf=0;host.classList.remove('lr-webgl-ready');canvas.hidden=true;});
      listen(canvas,'webglcontextrestored',()=>{if(disposed)return;contextLost=false;canvas.hidden=false;lastTime=0;renderer.shadowMap.needsUpdate=true;settling=2;resize();request();});
      resize();
    }
    function setTheme(next){if(next!==theme){theme=next;shadowMaterial.opacity=theme==='light'?.22:.34;roomAmbient.intensity=theme==='light'?.68:.4;key.intensity=theme==='light'?2.1:2.5;fill.intensity=theme==='light'?.82:.55;rim.intensity=theme==='light'?1.1:1.6;settling=2;request();}}
    return {
      object:model,environment:studio,update:draw,setIncomingOrigin(point){incomingOrigin=point?.clone()||null;},setOutgoingOrigin(point){outgoingOrigin=point?.clone()||null;},hitControl,beginControl,moveControl,endControl,wheelControl,setVolume,isSeeking:()=>control?.kind==='arm',
      setView(next){Object.assign(targetView,next);settling=2;request();},
      setPresentation(next){
        const nextImmersive=!!next.immersive,nextBlend=nextImmersive?Math.max(0,Math.min(1,Number(next.inlineBlend)||0)):1,nextRest=nextImmersive?next.rest:defaultRest;
        const changed=nextImmersive!==immersive||Math.abs(nextBlend-inlineBlend)>.0001||nextRest!==rest;
        immersive=nextImmersive;inlineBlend=nextBlend;rest=nextRest;if(changed){control=null;host.classList.remove('lr-control-dragging');resize();}
      },
      setTheme,
      setProgress(next,durationValue){
        if(typeof next==='number')next={position:next,duration:durationValue};
        if(control?.kind==='arm')return;
        const position=Math.max(0,Number(next.position)||0),duration=Math.max(0,Number(next.duration)||0);
        if(position===playbackPosition&&duration===playbackDuration)return;
        playbackPosition=position;playbackDuration=duration;
        if(!exchange&&!ejected&&position>0)armEngaged=true;
        settling=2;request();
      },
      setState(next){
        playing=!!next.playing;ejected=!!next.ejected;clampOff=!!next.clampOff;resting=!!next.resting;pendingTitle=next.title;pendingNumber=next.number;pendingCover=next.cover||'';primeCover(pendingCover);
        if(next.exchange&&next.exchange.id!==exchangeId){
          exchangeId=next.exchange.id;armEngaged=false;weightStart.copy(weight.position);discStart.copy(disc.position);weightStartYaw=.18+Math.atan2(Math.sin(weight.rotation.y-.18),Math.cos(weight.rotation.y-.18));
        }
        exchange=next.exchange||null;
        if(control?.kind!=='arm'&&Number.isFinite(next.position))playbackPosition=Math.max(0,next.position);
        if(Number.isFinite(next.duration))playbackDuration=Math.max(0,next.duration);
        if(ejected)armEngaged=false;
        else if(!exchange&&!resting&&!clampOff&&(playing||playbackPosition>0))armEngaged=true;
        if(!exchange&&!ejected)updateLabel(pendingTitle,pendingNumber,pendingCover);
        setTheme(next.theme);settling=2;request();
      },
      destroy(){if(disposed)return;disposed=true;control=null;host.classList.remove('lr-control-dragging');cancelAnimationFrame(raf);resizeObserver?.disconnect();intersection?.disconnect();listeners.forEach(off=>off());coverCache.forEach(({image})=>{image.onload=null;image.onerror=null;});coverCache.clear();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());model.removeFromParent();if(!embedded){renderer.dispose();renderer.forceContextLoss();canvas.remove();host.classList.remove('lr-webgl-ready');}}
    };
  }
  window.LuliyTurntable={create,createEmbedded};
})();

window.LuliyRecordMessages={
  "放入唱片": [
    "Place record",
    "レコードを置く"
  ],
  "背面资料": [
    "Sleeve notes",
    "ジャケット情報"
  ],
  "♡ 收藏": [
    "♡ Favorite",
    "♡ お気に入り"
  ],
  "♥ 已收藏": [
    "♥ Favorited",
    "♥ 登録済み"
  ],
  "关闭": [
    "Off",
    "オフ"
  ],
  "15 分钟": [
    "15 minutes",
    "15 分"
  ],
  "30 分钟": [
    "30 minutes",
    "30 分"
  ],
  "60 分钟": [
    "60 minutes",
    "60 分"
  ],
  "这首结束": [
    "End of song",
    "この曲の終わり"
  ],
  "黑胶底噪": [
    "Vinyl ambience",
    "レコードのノイズ"
  ],
  "唱针": [
    "Stylus",
    "針"
  ],
  "旋钮": [
    "Volume",
    "音量"
  ],
  "玻璃": [
    "Glass",
    "ガラス"
  ],
  "拿起玻璃": [
    "Lift glass",
    "ガラスを外す"
  ],
  "放回玻璃": [
    "Place glass",
    "ガラスを戻す"
  ],
  "全景": [
    "Overview",
    "全体"
  ],
  "拖入转盘": [
    "Drag to turntable",
    "ターンテーブルへ"
  ],
  "这首结束后停止": [
    "Stops at the end of this song",
    "この曲の終了時に停止"
  ],
  "写下这张唱片的故事。": [
    "Write your listening notes.",
    "このレコードの思い出を書きましょう。"
  ],
  "定时停止": [
    "Sleep timer",
    "スリープタイマー"
  ],
  "翻转唱片封套": [
    "Flip sleeve",
    "ジャケットを裏返す"
  ],
  "歌手": [
    "Artist",
    "アーティスト"
  ],
  "年份": [
    "Year",
    "年"
  ],
  "我的听歌笔记": [
    "My listening notes",
    "私のリスニングノート"
  ],
  "取消": [
    "Cancel",
    "キャンセル"
  ],
  "保存": [
    "Save",
    "保存"
  ],
  "播放顺序已更新。": [
    "Play order updated.",
    "再生順序を更新しました。"
  ],
  "当前浏览器无法启用底噪。": [
    "Vinyl ambience is unavailable in this browser.",
    "このブラウザーはノイズに対応していません。"
  ],
  "底噪暂时无法启用。": [
    "Vinyl ambience could not be enabled.",
    "ノイズを有効にできませんでした。"
  ],
  "浏览器未能保存，当前更改仅在本次访问有效。": [
    "Changes could not be saved; they remain for this visit.",
    "変更を保存できませんでした。今回の閲覧では有効です。"
  ]
};
/* Standalone additions; the homepage never attaches this interface. */
(function(){
'use strict';
let api,library={},instances=new Set(),timer=null,timerTick=0,audioContext=null,noiseGain=null,noiseEnabled=false;
const key='luliy-listening-library-v1',esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{library=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
library.favorites=Array.isArray(library.favorites)?library.favorites:[];library.notes=library.notes||{};library.order=Array.isArray(library.order)?library.order:[];
delete library.recent;delete library.lyrics;delete library.positions;
const glyphs={heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z',timer:'M12 8v5l3 2M9 2h6M18 4l2 2M21 13a9 9 0 1 1-18 0 9 9 0 0 1 18 0',noise:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18M12 11v2',arm:'M19 3v6L8 20l-4-4L16 7V3M3 21h7',knob:'M12 3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',glass:'M12 2 2 20h20L12 2zM12 2v18M2 20l10-6 10 6',lift:'M12 17V3M7 8l5-5 5 5M4 17v4h16v-4',flip:'M4 8h14l-4-4M18 8l-4 4M20 16H6l4 4M6 16l4-4',edit:'m15 4 5 5M4 20l4-1L21 6l-5-5L3 14z'};
const icon=n=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+glyphs[n]+'"/></svg>';
function tr(t){const v=window.LuliyRecordMessages?.[t];return v&&api?.state.lang!=='zh'?v[api.state.lang==='ja'?1:0]:t;}
function name(t){return t?.name?.[api.state.lang]||t?.name?.zh||'';}
function persist(){try{localStorage.setItem(key,JSON.stringify(library));}catch(e){instances.forEach(i=>i.message(tr('浏览器未能保存，当前更改仅在本次访问有效。')));}}
function order(){const indices=library.order.map(id=>api.tracks.findIndex(t=>t.id===id)).filter(i=>i>=0);return [...new Set([...indices,...api.tracks.map((_,i)=>i)])].filter(i=>!api.tracks[i].private&&!api.tracks[i].revoked);}
function update(){instances.forEach(i=>i.update());syncNoise();}
function clearTimer(){clearInterval(timerTick);timerTick=0;timer=null;update();}
function stopLater(value){clearInterval(timerTick);timer=value==='end'?{end:true}:Number(value)>0?{minutes:Number(value),until:Date.now()+Number(value)*60000}:null;if(timer?.until)timerTick=setInterval(()=>{if(Date.now()>=timer.until){clearTimer();api.softStop();}else update();},1000);update();}
function onEnded(){if(!timer?.end)return false;clearTimer();api.softStop();return true;}
async function enableNoise(){
 if(!audioContext){const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;audioContext=new A();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*3,audioContext.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+Math.random()*.04-.02)/1.025;data[i]=last+(Math.random()<.00007?(Math.random()-.5)*.2:0);}const source=audioContext.createBufferSource();source.buffer=buffer;source.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=2400;noiseGain=audioContext.createGain();noiseGain.gain.value=0;source.connect(filter).connect(noiseGain).connect(audioContext.destination);source.start();}
 await audioContext.resume();return true;
}
function syncNoise(){if(!noiseGain)return;const level=noiseEnabled&&instances.size&&api.state.playing&&!api.state.exchange&&!document.hidden?Math.min(api.state.volume*.025,.008):0;noiseGain.gain.setTargetAtTime(level,audioContext.currentTime,.2);}
function configure(value){api=value;document.addEventListener('visibilitychange',syncNoise);}
function attach(root,{on,focus,reset,clamp,album}){
 const meta=root.querySelector('.lr-meta'),scene=root.querySelector('.lr-scene'),shelf=root.querySelector('.lr-shelf'),heading=root.querySelector('.lr-shelf-heading'),cards=[...shelf.querySelectorAll('[data-lr-track]')];
 let lastIndex=-2,notificationTimer=0,editDialog=null,dragged=null,gesture=null,holdTimer=0,ghost=null,suppressUntil=0,lastWheel=0,disposed=false;
 const left=document.createElement('div');left.className='lr-console';left.append(scene);scene.append(root.querySelector('.lr-clamp-rest'));const gallery=document.createElement('div');gallery.className='lr-gallery';gallery.append(heading,shelf);const layout=root.querySelector('.lr-layout');layout.prepend(left);layout.append(gallery);
 const counter=meta.querySelector('.lr-counter'),top=document.createElement('div');top.className='lr-meta-top';counter.before(top);top.append(counter);
 const tools=document.createElement('div');tools.className='lr-listening-actions';tools.innerHTML='<button type="button" class="lr-icon-button" data-extra="favorite-current" aria-pressed="false">'+icon('heart')+'</button><label class="lr-sleep-label">'+icon('timer')+'<select class="lr-sleep" aria-label="定时停止"><option value="0">定时停止 · 关闭</option><option value="15">15 分钟</option><option value="30">30 分钟</option><option value="60">60 分钟</option><option value="end">这首结束</option></select></label><button type="button" class="lr-icon-button" data-extra="noise" aria-pressed="false">'+icon('noise')+'</button>';top.append(tools);
 const status=document.createElement('div');status.className='lr-listening-status';status.setAttribute('role','status');meta.querySelector('.lr-audio-status').after(status);
 const detail=document.createElement('span');detail.className='lr-detail-actions';for(const [action,label,glyph] of [['focus-arm','唱针','arm'],['focus-volume','旋钮','knob'],['focus-clamp','玻璃','glass'],['clamp','拿起玻璃','lift']])detail.innerHTML+='<button type="button" class="lr-icon-button" data-extra="'+action+'" aria-label="'+label+'" title="'+label+'">'+icon(glyph)+'</button>';scene.querySelector('.lr-view-controls').append(detail);
 const sleeveTools=document.createElement('span');sleeveTools.className='lr-sleeve-tools';sleeveTools.innerHTML='<button type="button" class="lr-icon-button" data-extra="flip" aria-label="翻转唱片封套" title="翻转唱片封套">'+icon('flip')+'</button><button type="button" class="lr-icon-button" data-extra="edit" aria-label="背面资料" title="背面资料">'+icon('edit')+'</button>';heading.querySelector('.lr-shelf-label').after(sleeveTools);
 shelf.classList.add('lr-arc-shelf');shelf.setAttribute('aria-roledescription','唱片轮播');
 const title=t=>{const info={...t,...library.notes[t.id]};return '<strong>'+esc(name(t))+'</strong><span>'+esc(info.artist||'')+'</span><span>'+esc(info.year||'')+'</span><span>'+esc(info.note||tr('写下这张唱片的故事。'))+'</span>';};
 cards.forEach(card=>{card.draggable=true;const back=document.createElement('span');back.className='lr-record-back';card.querySelector('.lr-cover').after(back);back.innerHTML=title(api.tracks[+card.dataset.lrTrack]);});
 const selectedIndex=()=>Math.max(0,api.state.index);
 function message(text){status.textContent=text;clearTimeout(notificationTimer);notificationTimer=setTimeout(()=>{notificationTimer=0;refreshStatus();},3500);}
 function refreshStatus(){if(notificationTimer)return;const minutes=timer?.until?Math.max(1,Math.ceil((timer.until-Date.now())/60000)):0;status.textContent=timer?.end?tr('这首结束后停止'):minutes?(api.state.lang==='zh'?'将在 '+minutes+' 分钟后停止':api.state.lang==='ja'?minutes+' 分後に停止':'Stops in '+minutes+' min'):'';}
 function syncPrivateCards(){for(const card of cards.filter(c=>c.dataset.privateRecord==='true')){if(!api.tracks[+card.dataset.lrTrack]?.private||api.tracks[+card.dataset.lrTrack]?.revoked){card.remove();cards.splice(cards.indexOf(card),1);lastIndex=-2;}}api.tracks.forEach((track,index)=>{if(!track.private||track.revoked)return;let card=cards.find(c=>+c.dataset.lrTrack===index);if(!card){card=document.createElement('button');card.type='button';card.className='lr-record';card.dataset.lrTrack=index;card.dataset.privateRecord='true';card.draggable=true;shelf.append(card);cards.push(card);lastIndex=-2;}const markup=window.LuliyRecords.mediaLibrary.cover(track.id)+'<span class="lr-record-back">'+title(track)+'</span><span class="lr-record-name">'+esc(name(track))+'</span><span class="lr-record-info">Drive / '+(Number(track.duration)>0?api.time(track.duration):'時長未知')+'</span><span class="lr-record-state" aria-hidden="true"></span>';if(card.innerHTML!==markup)card.innerHTML=markup;card.setAttribute('aria-label',name(track));card.setAttribute('aria-current',String(index===api.state.index));});}function arrange(){syncPrivateCards();const center=Math.max(0,cards.findIndex(c=>+c.dataset.lrTrack===selectedIndex())),n=cards.length;if(lastIndex===center)return;lastIndex=center;sleeveTools.querySelector('[data-extra="flip"]').setAttribute('aria-pressed','false');cards.forEach((card,i)=>{let offset=(i-center+n)%n;if(offset>n/2)offset-=n;const visible=Math.abs(offset)<=(window.LuliyMobilePhone?2:3);card.dataset.arcOffset=offset;card.dataset.arcVisible=String(visible);card.style.setProperty('--lr-arc',offset);card.style.setProperty('--lr-depth',Math.abs(offset));card.style.zIndex=String(10-Math.min(8,Math.abs(offset)));card.setAttribute('aria-hidden',String(!visible));card.inert=!visible;card.tabIndex=offset===0?0:-1;card.classList.remove('lr-record-flipped');});}
 function reorder(){return;const list=album.querySelector('ol');for(const index of order()){const row=list.querySelector('[data-lr-album-track="'+index+'"]')?.closest('li');if(!row)continue;row.draggable=true;row.dataset.orderTrack=index;list.append(row);}list.querySelectorAll('li').forEach((li,i)=>li.querySelector('small').textContent=String(i+1).padStart(2,'0'));}
 function update(){
  arrange();const id=api.current().id,favorite=tools.querySelector('[data-extra="favorite-current"]');favorite.setAttribute('aria-pressed',String(api.current().private?!!api.current().file?.favorite:library.favorites.includes(id)));sleeveTools.querySelectorAll('button').forEach(b=>b.disabled=!!api.current().private);favorite.setAttribute('aria-label',tr(library.favorites.includes(id)?'♥ 已收藏':'♡ 收藏'));favorite.title=favorite.getAttribute('aria-label');
  const noise=tools.querySelector('[data-extra="noise"]');noise.setAttribute('aria-pressed',String(noiseEnabled));noise.setAttribute('aria-label',tr('黑胶底噪'));noise.title=tr('黑胶底噪');
  const sleep=tools.querySelector('.lr-sleep');sleep.setAttribute('aria-label',tr('定时停止'));sleep.title=tr('定时停止');[...sleep.options].forEach((o,i)=>o.textContent=i===0?tr('定时停止')+' · '+tr('关闭'):tr(['','15 分钟','30 分钟','60 分钟','这首结束'][i]));sleep.value=timer?.end?'end':timer?.until?String(timer.minutes):'0';
  detail.querySelectorAll('button').forEach(b=>{const label=b.dataset.extra==='clamp'?(api.state.clampOff?'放回玻璃':'拿起玻璃'):({'focus-arm':'唱针','focus-volume':'旋钮','focus-clamp':'玻璃'})[b.dataset.extra];b.setAttribute('aria-label',tr(label));b.title=tr(label);});detail.querySelector('[data-extra="clamp"]').setAttribute('aria-pressed',String(api.state.clampOff));sleeveTools.querySelectorAll('button').forEach(b=>{const label=tr(b.dataset.extra==='flip'?'翻转唱片封套':'背面资料');b.setAttribute('aria-label',label);b.title=label;});cards.forEach((c,i)=>c.querySelector('.lr-record-back').innerHTML=title(api.tracks[+c.dataset.lrTrack]));refreshStatus();
 }
 function browse(direction){const pos=Math.max(0,cards.findIndex(c=>+c.dataset.lrTrack===selectedIndex()));api.play(+cards[(pos+direction+cards.length)%cards.length].dataset.lrTrack);}
 function flip(){const card=cards.find(c=>+c.dataset.lrTrack===selectedIndex());if(!card)return;card.classList.toggle('lr-record-flipped');sleeveTools.querySelector('[data-extra="flip"]').setAttribute('aria-pressed',String(card.classList.contains('lr-record-flipped')));}
 function edit(){if(editDialog)return;const t=api.current(),record={...t,...library.notes[t.id]};editDialog=document.createElement('dialog');editDialog.className='lr-edit-dialog lr-room';editDialog.dataset.theme=api.state.theme;editDialog.innerHTML='<form method="dialog"><h3>'+esc(name(t))+'</h3><label>'+tr('歌手')+'<input name="artist" maxlength="100" value="'+esc(record.artist||'')+'"></label><label>'+tr('年份')+'<input name="year" maxlength="12" value="'+esc(record.year||'')+'"></label><label>'+tr('我的听歌笔记')+'<textarea name="note" rows="4" maxlength="2000">'+esc(record.note||'')+'</textarea></label><div><button value="cancel">'+tr('取消')+'</button><button value="save">'+tr('保存')+'</button></div></form>';document.body.append(editDialog);editDialog.addEventListener('close',()=>{if(editDialog.returnValue==='save'){const form=editDialog.querySelector('form');library.notes[t.id]={artist:form.elements.artist.value,year:form.elements.year.value,note:form.elements.note.value};persist();api.notify();}editDialog.remove();editDialog=null;});editDialog.showModal();}
 on(root,'click',e=>{const control=e.target.closest('[data-extra]');if(!control)return;const action=control.dataset.extra;if(action==='favorite-current'){const id=api.current().id;library.favorites=library.favorites.includes(id)?library.favorites.filter(v=>v!==id):[...library.favorites,id];persist();api.notify();}else if(action==='noise'){if(noiseEnabled){noiseEnabled=false;update();}else enableNoise().then(ok=>{if(disposed)return;if(ok){noiseEnabled=true;update();}else message(tr('当前浏览器无法启用底噪。'));}).catch(()=>message(tr('底噪暂时无法启用。')));}else if(action==='clamp')clamp();else if(action==='edit')edit();else if(action==='flip')flip();else if(action.startsWith('focus-'))focus(action.slice(6));else if(action==='overview')reset();});
 on(tools.querySelector('.lr-sleep'),'change',e=>stopLater(e.target.value));
 on(shelf,'click',e=>{const card=e.target.closest('[data-lr-track]');if(!card||Date.now()<suppressUntil)return;const index=+card.dataset.lrTrack;if(index!==api.state.index)api.play(index);else flip();});
 on(shelf,'dblclick',e=>{const card=e.target.closest('[data-lr-track]');if(card){card.classList.remove('lr-record-flipped');api.play(+card.dataset.lrTrack);}});
 on(shelf,'keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home')api.play(0);else if(e.key==='End')api.play(+cards[cards.length-1].dataset.lrTrack);else browse(e.key==='ArrowRight'?1:-1);cards.find(c=>+c.dataset.lrTrack===selectedIndex())?.focus({preventScroll:true});});
 on(shelf,'wheel',e=>{if(e.ctrlKey)return;const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(!delta)return;e.preventDefault();if(performance.now()-lastWheel<350)return;lastWheel=performance.now();browse(Math.sign(delta));},{passive:false});
 function clearDrop(){scene.classList.remove('lr-drop-target');root.classList.remove('lr-sleeve-dragging');ghost?.remove();ghost=null;}
 on(shelf,'dragstart',e=>{const card=e.target.closest('[data-lr-track]');if(!card)return;dragged=+card.dataset.lrTrack;e.dataTransfer.setData('application/x-luliy-record',String(dragged));e.dataTransfer.effectAllowed='copy';root.classList.add('lr-sleeve-dragging');});
 on(scene,'dragover',e=>{if(dragged===null)return;e.preventDefault();scene.classList.add('lr-drop-target');});on(scene,'dragleave',e=>{if(!scene.contains(e.relatedTarget))scene.classList.remove('lr-drop-target');});on(scene,'drop',e=>{if(dragged===null)return;e.preventDefault();const index=dragged;dragged=null;clearDrop();api.play(index);});on(shelf,'dragend',()=>{dragged=null;suppressUntil=Date.now()+400;clearDrop();});
 // A horizontal touch swipe browses; holding a sleeve lifts it for a deck drop.
 on(shelf,'pointerdown',e=>{if(e.button!==0)return;const card=e.target.closest('[data-lr-track]');gesture={id:e.pointerId,x:e.clientX,y:e.clientY,index:card?+card.dataset.lrTrack:selectedIndex(),card,active:false};if(e.pointerType!=='mouse'&&card)holdTimer=setTimeout(()=>{if(!gesture)return;gesture.active=true;card.setPointerCapture(e.pointerId);root.classList.add('lr-sleeve-dragging');ghost=document.createElement('img');ghost.className='lr-drag-ghost';ghost.src=api.artwork(api.tracks[gesture.index]);document.body.append(ghost);ghost.style.left=gesture.x+'px';ghost.style.top=gesture.y+'px';},420);});
 on(shelf,'pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;if(!gesture.active){if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>8)clearTimeout(holdTimer);return;}e.preventDefault();ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';const r=scene.getBoundingClientRect();scene.classList.toggle('lr-drop-target',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);},{passive:false});
 function endGesture(e){clearTimeout(holdTimer);if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;if(g.card?.hasPointerCapture(e.pointerId))g.card.releasePointerCapture(e.pointerId);if(g.active){suppressUntil=Date.now()+500;const valid=scene.classList.contains('lr-drop-target')&&e.type!=='pointercancel';clearDrop();if(valid)api.play(g.index);}else if(e.type!=='pointercancel'&&Math.abs(e.clientX-g.x)>35&&Math.abs(e.clientX-g.x)>Math.abs(e.clientY-g.y)){suppressUntil=Date.now()+500;browse(e.clientX<g.x?1:-1);}}
 on(shelf,'pointerup',endGesture);on(shelf,'pointercancel',endGesture);
 let reorderIndex=null;
 function moveOrder(from,to){const indices=order(),a=indices.indexOf(from),b=indices.indexOf(to);if(a<0||b<0||a===b)return;indices.splice(a,1);indices.splice(b,0,from);library.order=indices.map(i=>api.tracks[i].id);persist();reorder();message(tr('播放顺序已更新。'));}

 on(album,'dragstart',e=>{const li=e.target.closest('[data-order-track]');if(!li)return;reorderIndex=+li.dataset.orderTrack;e.dataTransfer.setData('application/x-luliy-order',String(reorderIndex));e.dataTransfer.effectAllowed='move';});on(album,'dragover',e=>{if(reorderIndex===null)return;const li=e.target.closest('[data-order-track]');if(li){e.preventDefault();album.querySelectorAll('.lr-order-target').forEach(n=>n.classList.remove('lr-order-target'));li.classList.add('lr-order-target');}});on(album,'drop',e=>{const li=e.target.closest('[data-order-track]');if(li&&reorderIndex!==null){e.preventDefault();moveOrder(reorderIndex,+li.dataset.orderTrack);}reorderIndex=null;album.querySelectorAll('.lr-order-target').forEach(n=>n.classList.remove('lr-order-target'));});on(album,'dragend',()=>{reorderIndex=null;album.querySelectorAll('.lr-order-target').forEach(n=>n.classList.remove('lr-order-target'));});
 on(album,'click',e=>{const up=e.target.closest('[data-order-up]'),down=e.target.closest('[data-order-down]');if(!up&&!down)return;e.stopPropagation();const from=+(up?.dataset.orderUp??down.dataset.orderDown),indices=order(),destination=indices.indexOf(from)+(up?-1:1);if(destination>=0&&destination<indices.length)moveOrder(from,indices[destination]);});
 reorder();const instance={update,browse,message,destroy(){disposed=true;instances.delete(instance);clearTimeout(holdTimer);clearTimeout(notificationTimer);clearDrop();editDialog?.close();if(!instances.size){noiseEnabled=false;clearTimer();syncNoise();}}};instances.add(instance);update();return instance;
}
window.LuliyRecordExtras={configure,attach,update,volume:syncNoise,onPlay:syncNoise,onEnded,order,stopLater,sleepState:()=>timer?{...timer}:null,favorite:id=>library.favorites.includes(id),toggleFavorite:id=>{library.favorites=library.favorites.includes(id)?library.favorites.filter(v=>v!==id):[...library.favorites,id];persist();api.notify();}};
})();

/* Record player for user-selected audio files. */
(function () {
  'use strict';
  if (window.LuliyRecords) return;
  const texts = {"zh":{"room":"听觉的留白","library":"我的唱片","play":"播放","pause":"暂停","previous":"上一张唱片","next":"下一张唱片","eject":"弹出唱片","choose":"挑一张唱片","empty":"唱片已弹出。","view":"唱机视角","hint":"拖动旋转 · 双指缩放 · 方向键 / + − / Home","viewHelp":"唱机视角：拖动旋转，双指缩放；方向键调整，加减键缩放，Home 复位。","zoomIn":"放大视角","zoomOut":"缩小视角","reset":"复位视角","seek":"播放进度","volume":"音量","mute":"静音","unmute":"取消静音","shelfPrevious":"向前浏览唱片","shelfNext":"向后浏览唱片","ready":"选择一首，开始播放。","playing":"正在播放","paused":"已暂停","loading":"正在加载音频…","error":"音频暂时无法播放。","close":"关闭并停止迷你播放器","mini":"迷你播放器","album":"播放列表","openRecords":"打开播放列表","closeAlbum":"关闭播放列表","sequence":"顺序播放","shuffle":"随机播放","repeatOne":"单曲循环"},"en":{"room":"Room for listening","library":"My records","play":"Play","pause":"Pause","previous":"Previous record","next":"Next record","eject":"Eject record","choose":"Choose a record","empty":"The turntable is empty.","view":"Turntable view","hint":"Drag to turn · Pinch to zoom · Arrows / + − / Home","viewHelp":"Drag to rotate, pinch to zoom. Arrow keys rotate, plus and minus zoom, Home resets the view.","zoomIn":"Zoom in","zoomOut":"Zoom out","reset":"Reset view","seek":"Playback position","volume":"Volume","mute":"Mute","unmute":"Unmute","shelfPrevious":"Browse previous records","shelfNext":"Browse next records","ready":"Choose a record to listen.","playing":"Playing","paused":"Paused","loading":"Loading audio…","error":"Audio could not be played.","close":"Close and stop mini player","mini":"Mini player","album":"Playlist","openRecords":"Open playlist","closeAlbum":"Close playlist","sequence":"Play in order","shuffle":"Shuffle","repeatOne":"Repeat one"},"ja":{"room":"耳を澄ます余白","library":"私のレコード","play":"再生","pause":"一時停止","previous":"前のレコード","next":"次のレコード","eject":"レコードを取り出す","choose":"レコードを選ぶ","empty":"レコードを取り出しました。","view":"ターンテーブルの視点","hint":"ドラッグで回転 · ピンチで拡大縮小 · 矢印 / + − / Home","viewHelp":"ドラッグで回転、二本指で拡大縮小。方向キーで回転、プラス・マイナスで拡大縮小、Home でリセット。","zoomIn":"拡大","zoomOut":"縮小","reset":"視点をリセット","seek":"再生位置","volume":"音量","mute":"ミュート","unmute":"ミュート解除","shelfPrevious":"前のレコードを見る","shelfNext":"次のレコードを見る","ready":"レコードを選んで再生。","playing":"再生中","paused":"一時停止中","loading":"音声を読み込み中…","error":"音声を再生できません。","close":"閉じて再生を停止","mini":"ミニプレーヤー","album":"再生リスト","openRecords":"再生リストを開く","closeAlbum":"再生リストを閉じる","sequence":"順番に再生","shuffle":"シャッフル","repeatOne":"一曲リピート"}};
  for(const [lang,message] of Object.entries({zh:'正在换片…',en:'Changing record…',ja:'レコードを交換中…'}))texts[lang].changing=message;
  for(const [lang,message] of Object.entries({zh:'正在缓冲音频…',en:'Buffering audio…',ja:'音声をバッファ中…'}))texts[lang].buffering=message;
  for(const [lang,message] of Object.entries({zh:' 拖动唱臂调整进度；左下旋钮调节音量。',en:' Drag the tonearm to seek; drag the lower-left knob to adjust volume.',ja:' アームをドラッグして再生位置、左下のノブで音量を調整。'}))texts[lang].viewHelp+=message;
  texts.zh.error='音频未能播放 · 点击播放重试';texts.en.error='Audio unavailable · press play to retry';texts.ja.error='再生できません・再生ボタンで再試行';
  const suppliedTracks = window.LULIY_DATA?.collections?.records;
  const fallbackTracks = [{"id":"qingge","name":{"zh":"情歌","en":"Qing Ge","ja":"情歌"},"src":"https://cloud.luliy.me/api/audio?path=shared%2F%E6%83%85%E6%AD%8C%E4%B8%80%E4%B8%AA%E7%90%83.mp3","duration":251,"color":"#b9a39a"},{"id":"call-me-now","name":{"zh":"Call Me Now","en":"Call Me Now","ja":"Call Me Now"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FCall_Me_Now-Serlek-Yarim-bolmisun.mp3","duration":null,"color":"#989fa8"},{"id":"dark","name":{"zh":"dark","en":"dark","ja":"dark"},"src":"https://cloud.luliy.me/api/audio?path=shared%2Fdark.mp3","duration":166,"color":"#858d92"},{"id":"yesterday","name":{"zh":"Yesterday","en":"Yesterday","ja":"Yesterday"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FYesterday.mp3","duration":60,"color":"#b9ae94"},{"id":"someone-like-you","name":{"zh":"Echos","en":"Echos","ja":"Echos"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FSomeone%20Like%20You.mp3","duration":160,"color":"#aea195"},{"id":"one-to-two","name":{"zh":"1 to 2","en":"1 to 2","ja":"1 to 2"},"src":"https://cloud.luliy.me/api/audio?path=shared%2F1%20to%202%20.mp3","duration":null,"color":"#a69b9b"},{"id":"something-just-like-this-megamix","name":{"zh":"Something Just Like This (Megamix)","en":"Something Just Like This (Megamix)","ja":"Something Just Like This (Megamix)"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FSOMETHING%20JUST%20LIKE%20THIS%20(Megamix)%20.mp3","duration":null,"color":"#b6a184"},{"id":"sa-ye","name":{"zh":"撒野","en":"Sa Ye","ja":"撒野"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-%E6%92%92%E9%87%8E-%20%E5%8C%BA.mp3","duration":null,"color":"#a39993"},{"id":"zhe-shi-jie-na-me-duo-ren","name":{"zh":"这世界那么多人","en":"So Many People in This World","ja":"这世界那么多人"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-%E8%BF%99%E4%B8%96%E7%95%8C%E9%82%A3%E4%B9%88%E5%A4%9A%E4%BA%BA.mp3","duration":null,"color":"#949c9b"},{"id":"zui-hou-yi-ye","name":{"zh":"最后一页","en":"The Last Page","ja":"最后一页"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5-.mp3","duration":null,"color":"#ada59c"},{"id":"love-story","name":{"zh":"Love Story","en":"Love Story","ja":"Love Story"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-Love%20Story.mp3","duration":null,"color":"#b1a6a1"},{"id":"wendy","name":{"zh":"Wendy","en":"Wendy","ja":"Wendy"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2FWendy.mp3","duration":null,"color":"#a4aaa4"},{"id":"black-magic","name":{"zh":"Black Magic","en":"Black Magic","ja":"Black Magic"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FBlack%20Magic%20-%20Jonasu.mp3","duration":null,"color":"#94909e"},{"id":"dance-monkey","name":{"zh":"Dance Monkey","en":"Dance Monkey","ja":"Dance Monkey"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FDance%20Monkey%20-%20Tones%20And%20I.mp3","duration":null,"color":"#a28e85"}];
  const tracks = Array.isArray(suppliedTracks) && suppliedTracks.some(track => track?.src)
    ? suppliedTracks.filter(track => track?.id && track?.name && track?.src)
    : fallbackTracks;
  for (const lang of Object.keys(texts)) texts[lang].albumHint = tracks.length + (lang === 'zh' ? ' 首曲目' : lang === 'ja' ? ' 曲' : ' tracks');
  const paths = {play:'M8 5l11 7-11 7z',pause:'M8 5v14M16 5v14',previous:'M6 5v14M18 5L8 12l10 7z',next:'M18 5v14M6 5l10 7-10 7z',eject:'M5 15l7-10 7 10zM5 19h14',minus:'M5 12h14',plus:'M5 12h14M12 5v14',reset:'M4 9a8 8 0 1 1 0 6M4 3v6h6',left:'M15 5l-7 7 7 7',right:'M9 5l7 7-7 7',close:'M6 6l12 12M18 6L6 18',volume:'M4 9h4l5-4v14l-5-4H4zM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14',mute:'M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6',sequence:'M3 7h14m-3-3 3 3-3 3M3 17h14m-3-3 3 3-3 3',shuffle:'M3 6h3c5 0 7 12 12 12M17 15l3 3-3 3M3 18h3c2 0 3-2 4-4M14 9c2-2 3-3 6-3M17 3l3 3-3 3',repeat:'M4 8V6a2 2 0 0 1 2-2h13l-3-3M19 4l-3 3M20 16v2a2 2 0 0 1-2 2H5l3 3M5 20l3-3'};
  const icon = name => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[name]+'"/></svg>';
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const time = seconds => Number.isFinite(seconds) && seconds >= 0
    ? Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0') : '—:—';
  const durationLabel = seconds => Number(seconds)>0?time(seconds):'時長未知';
  const durationOf = track => Number(track?.duration) > 0 ? Number(track.duration) : 0;
  const mounts = new Set(),subscribers=new Map();
  const state = {index:0,playing:false,started:false,loading:false,buffering:false,error:false,position:0,volume:.45,muted:false,shuffle:false,repeatOne:false,lang:'zh',theme:'dark',generation:0,enhanced:false,clampOff:false,resting:false};
  let media=null,mini=null,previousVolume=.45,envelope=1,fadeSerial=0,listeningGain=1,listeningGainFrame=0;const extras=window.LuliyRecordExtras;const shuffleHistory=[];
  const storageKey='luliy-record-preferences';
  try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(Number.isFinite(saved.volume))state.volume=clamp(saved.volume,0,1);const index=tracks.findIndex(track=>track.id===saved.track);if(index>=0)state.index=index;state.shuffle=!!saved.shuffle;state.repeatOne=!!saved.repeatOne;}catch(e){}
  const savePreferences=()=>{try{localStorage.setItem(storageKey,JSON.stringify({track:current().private?null:current().id,shuffle:state.shuffle,repeatOne:state.repeatOne,position:current().private?0:elapsed(),volume:state.volume}));}catch(e){}};
  const dictionary = () => texts[state.lang];
  let mediaQueue=null;
  const current = () => tracks[state.index] || tracks[0];
  const currentSrc = () => { try { return new URL(current().src, location.href).href; } catch (e) { return current().src; } };
  const artwork = track => track.cover || track.image || window.LULIY_DATA?.recordCovers?.[track.id] || '';
  const elapsed = () => state.exchange ? state.position : media && state.index >= 0 && media.currentSrc === currentSrc() && Number.isFinite(media.currentTime)
    ? media.currentTime : state.position;
  // One duration source for main and mini players: the audio element's own
  // duration when it belongs to the current track, else the list duration,
  // else the last known duration (held, not reset to 0, while a new track
  // is still loading, so the bar does not flash empty on track switch).
  let lastDuration=0, progressRaf=0, draggingSeek=false;
  const displayDuration = () => {
    if(state.index<0)return 0;
    const fromMedia=media && media.src===currentSrc() && Number.isFinite(media.duration) && media.duration>0 ? media.duration : 0;
    const d=fromMedia || durationOf(current()) || lastDuration;
    if(d>0)lastDuration=d;
    return d;
  };
  function paintProgress(){mounts.forEach(m=>m.progress());updateMiniProgress();}
  function tickProgress(){
    progressRaf=0;
    if(!state.playing||document.hidden||draggingSeek)return;
    paintProgress();
    progressRaf=requestAnimationFrame(tickProgress);
  }
  function startProgressLoop(){if(!progressRaf&&state.playing&&!document.hidden&&!draggingSeek)progressRaf=requestAnimationFrame(tickProgress);}
  function stopProgressLoop(){if(progressRaf){cancelAnimationFrame(progressRaf);progressRaf=0;}}
  function snapshot(){
    const track=current(),empty=state.index<0;
    return {index:state.index,track:empty?null:track.id,name:track.name[state.lang]||track.name.zh,title:track.name.en||track.name.zh,number:Math.max(0,state.index)+1,cover:artwork(track),duration:durationOf(track),playing:state.playing,started:state.started,loading:state.loading,buffering:state.buffering,exchanging:state.exchange?.kind||null,exchange:state.exchange?{...state.exchange}:null,ejected:empty,clampOff:state.clampOff,resting:state.resting,error:state.error,position:elapsed(),volume:state.volume,muted:state.muted,lang:state.lang,theme:state.theme,shuffle:state.shuffle,repeatOne:state.repeatOne};
  }
  function publish(){if(!subscribers.size)return;const next=snapshot();subscribers.forEach((options,listener)=>listener(next));}
  function subscribe(listener,options={}){
    if(typeof listener!=='function')throw new TypeError('Record subscriber must be a function');
    subscribers.set(listener,options);if(typeof options.enhanced==='boolean')state.enhanced=options.enhanced;
    listener(snapshot());updateMini();
    return ()=>{subscribers.delete(listener);updateMini();};
  }

  function cover(index,extra) {
    const track=tracks[index],n=String(index+1).padStart(2,'0');
    if(track.private&&artwork(track))return '<span class="lr-cover lr-private-artwork" aria-hidden="true"><img src="'+esc(artwork(track))+'" alt=""></span>';
    const inner='<span class="lr-cover-art"><i></i><i></i><i></i></span><span class="lr-cover-top">LULIY / RECORDS</span><span class="lr-cover-number">'+n+'</span><span class="lr-cover-title" style="--title-size:'+(track.name.zh.length>24?'11':track.name.zh.length>12?'14':'21')+'cqw">'+esc(track.name.zh)+'</span><span class="lr-cover-bottom">VOL. '+n+' / PERSONAL COLLECTION</span>';
    const cls='lr-cover lr-art-'+index+' lr-composition-'+(index%4)+' '+(extra||'');
    if(track.id==='hot-together'&&artwork(track))return '<span class="'+cls+' lr-public-artwork" style="--lr-cover-bg:'+track.color+'" aria-hidden="true"><img src="'+esc(artwork(track))+'" alt="">'+inner+'</span>';
    return '<span class="'+cls+'" style="--lr-cover-bg:'+track.color+'" aria-hidden="true">'+inner+'</span>';
  }
  function button(action,label,shape,extra) {
    return '<button type="button" class="lr-icon-button '+(extra||'')+'" data-lr-action="'+action+'" data-lr-aria="'+label+'" aria-label="'+esc(dictionary()[label])+'" title="'+esc(dictionary()[label])+'">'+icon(shape)+'</button>';
  }
  function ensureAudio() {
    if(media)return;
    media=new Audio();media.preload='auto';media.volume=state.volume;
    for(const event of ['waiting','stalled'])media.addEventListener(event,()=>{if(state.playing&&!state.exchange&&media.src===currentSrc()&&!state.buffering){state.buffering=true;notify();}});
    media.addEventListener('playing',()=>{if(state.buffering){state.buffering=false;notify();}});
    media.addEventListener('loadedmetadata',()=>{
      if(state.index<0||media.src!==currentSrc())return;
      if(Number.isFinite(media.duration)&&media.duration>0)current().duration=media.duration;
      if(state.position>0&&Number.isFinite(media.duration))media.currentTime=Math.min(state.position,media.duration);
      notify();
    });
    media.addEventListener('durationchange',()=>{
      if(state.index<0||media.src!==currentSrc())return;
      if(Number.isFinite(media.duration)&&media.duration>0){current().duration=media.duration;notify();}
    });
    media.addEventListener('timeupdate',()=>{if(state.exchange||media.src!==currentSrc())return;state.position=media.currentTime;syncProgress();});
    media.addEventListener('ended',()=>{if(state.index<0||state.exchange||media.src!==currentSrc())return;if(extras?.onEnded())return;if(state.repeatOne&&!current().revoked){state.position=0;media.currentTime=0;play();}else advance(1);});
    media.addEventListener('error',()=>{if(!state.started)return;state.loading=false;state.buffering=false;state.playing=false;state.error=true;notify();});
  }
  // One shared clock keeps audio and every visible turntable in step. Selecting
  // another track during a change updates the destination without restarting it.
  let exchangePromise=null,exchangeResolve=null,exchangeTimer=null,exchangeSerial=0;
  function startExchange(kind,fromEmpty=false) {
    if(state.exchange?.kind==='swap'&&kind==='swap')return exchangePromise;
    clearTimeout(exchangeTimer);exchangeResolve?.();
    const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?100:kind==='eject'?2600:4600;
    const exchange={id:++exchangeSerial,start:performance.now(),duration,kind,fromEmpty};
    state.exchange=exchange;
    exchangePromise=new Promise(resolve=>{exchangeResolve=resolve;});
    if(document.hidden){ const done=exchangeResolve; state.exchange=null; exchangeResolve=null; notify(); if(done)done(); return exchangePromise; }
    exchangeTimer=setTimeout(()=>{
      if(state.exchange!==exchange)return;
      state.exchange=null;exchangeResolve?.();exchangeResolve=null;notify();
    },duration);
    notify();return exchangePromise;
  }
  // Buffer the already selected source during the mechanical exchange. Seeking
  // commits once on release, avoiding repeated remote range requests while dragging.
  function bufferedReady(generation){
    if(media.readyState>=4)return Promise.resolve();
    return new Promise((resolve,reject)=>{
      let timer=0;const started=performance.now();
      const finish=error=>{clearTimeout(timer);for(const event of ['progress','canplay','canplaythrough','error'])media.removeEventListener(event,check);error?reject(error):resolve();};
      const check=()=>{
        clearTimeout(timer);
        if(generation!==state.generation){finish();return;}
        if(media.error){finish(Error('Audio could not be loaded'));return;}
        let ahead=0;for(let i=0;i<media.buffered.length;i++)if(media.buffered.start(i)<=media.currentTime+.1&&media.buffered.end(i)>media.currentTime)ahead=media.buffered.end(i)-media.currentTime;
        const remaining=Number.isFinite(media.duration)?media.duration-media.currentTime:5;
        if(media.readyState>=4||media.readyState>=3&&ahead>=Math.min(5,remaining)){finish();return;}
        if(performance.now()-started>45000){finish(Error('Audio buffering timed out'));return;}
        timer=setTimeout(check,200);
      };
      for(const event of ['progress','canplay','canplaythrough','error'])media.addEventListener(event,check);check();
    });
  }
  function applyAudioVolume(){if(media)media.volume=clamp(state.volume*envelope*listeningGain,0,1);}
  function setListeningGain(value,duration=500){
    cancelAnimationFrame(listeningGainFrame);const to=clamp(Number(value)||0,0,1),from=listeningGain,start=performance.now();
    const step=now=>{const p=duration>0?clamp((now-start)/duration,0,1):1;listeningGain=from+(to-from)*(p*p*(3-2*p));applyAudioVolume();listeningGainFrame=p<1?requestAnimationFrame(step):0;};listeningGainFrame=requestAnimationFrame(step);
  }
  let pendingFade=null;
  function fadeTo(target,duration,generation=state.generation){
    const serial=++fadeSerial,from=envelope,start=performance.now();
    if(document.hidden){ envelope=target; applyAudioVolume(); return Promise.resolve(true); }
    return new Promise(resolve=>{
      pendingFade={resolve:resolve,target:target};
      function step(now){
        if(serial!==fadeSerial||generation!==state.generation){ if(pendingFade&&pendingFade.resolve===resolve)pendingFade=null; resolve(false); return; }
        const t=clamp((now-start)/duration,0,1);envelope=from+(target-from)*(t*t*(3-2*t));applyAudioVolume();
        if(t<1)requestAnimationFrame(step);else{ if(pendingFade&&pendingFade.resolve===resolve)pendingFade=null; resolve(true); }
      }
      requestAnimationFrame(step);
    });
  }
  async function playMediaWithRetry(){
    try{ await media.play(); }
    catch(error){
      if(error&&error.name==='NotAllowedError'){
        await new Promise(resolve=>setTimeout(resolve,800));
        await media.play();
        return;
      }
      throw error;
    }
  }
  async function softStop(){
    const generation=state.generation;
    if(state.playing&&!(await fadeTo(0,1000,generation)))return;
    if(generation!==state.generation)return;
    pause();state.resting=true;envelope=1;applyAudioVolume();notify();
  }
  let clampResume=false;
  async function toggleClamp(){
    if(state.exchange||state.index<0)return;
    if(!state.clampOff){clampResume=state.playing;pause();state.clampOff=true;state.resting=true;notify();}
    else{state.clampOff=false;notify();const generation=state.generation;await new Promise(r=>setTimeout(r,700));if(generation!==state.generation)return;state.resting=false;if(clampResume)play();else notify();}
  }
  let roomQueueSerial=0;
  async function play(index,resumePosition,forceSwap=false,keepQueue=false) {
    if(Number.isInteger(index)&&!keepQueue){if(!tracks[index]?.private){mediaQueue=null;shuffleHistory.length=0;}else if(!mediaQueue?.includes(tracks[index].id)){mediaQueue=tracks.filter(t=>t.private&&!t.revoked).map(t=>t.id);shuffleHistory.length=0;}}
    const roomOptions=[...subscribers.values()].filter(o=>typeof o.beforeExchange==='function');if(state.exchange?.kind==='swap'&&roomOptions.length){const ticket=++roomQueueSerial;await exchangePromise;if(ticket!==roomQueueSerial||!roomOptions.some(o=>[...subscribers.values()].includes(o)))return;return play(index,resumePosition,forceSwap,keepQueue);}

    const next=Number.isInteger(index)?clamp(index,0,tracks.length-1):(state.index<0?0:state.index);
    const changed=next!==state.index,fromEmpty=state.index<0,wasPlaying=state.playing;
    savePreferences();
    const generation=++state.generation;ensureAudio();
    const preparers=[...subscribers.values()].filter(options=>typeof options.beforeExchange==='function');const firstRoomPlay=!state.started&&preparers.length>0;if((changed||firstRoomPlay||forceSwap)&&preparers.length){await Promise.all(preparers.map(options=>options.beforeExchange()));if(generation!==state.generation||!preparers.some(options=>[...subscribers.values()].includes(options)))return;}
    const mechanical=(changed||state.exchange||firstRoomPlay||forceSwap)?startExchange('swap',fromEmpty):null;
    if(changed){state.index=next;state.position=Math.max(0,Number(resumePosition)||0);}
    state.clampOff=false;state.resting=false;state.started=true;state.loading=true;state.buffering=false;state.playing=false;state.error=false;ensureMini();notify();
    try {
      if(state.enhanced&&changed&&wasPlaying){if(!(await fadeTo(0,320,generation)))return;}
      if(generation!==state.generation)return;
      const selected=current();if(selected.resolveSource&&(changed||!selected.src||media.error||media.networkState===3)){const resolved=await selected.resolveSource();if(generation!==state.generation||current()!==selected)return;selected.src=resolved;}
      if(changed||media.src!==currentSrc()||media.error||media.networkState===3){media.pause();media.src=current().src;media.load();}
      if(mechanical){await mechanical;if(generation!==state.generation)return;}
      await bufferedReady(generation);if(generation!==state.generation)return;
      envelope=state.enhanced&&!document.hidden?0:1;applyAudioVolume();await playMediaWithRetry();
      if(generation!==state.generation)return;
      state.playing=true;state.loading=false;savePreferences();extras?.onPlay();notify();
      startProgressLoop();
      if(state.enhanced&&!document.hidden)fadeTo(1,700,generation);
    } catch(error) {
      if(generation!==state.generation)return;
      console.warn('Audio playback:',error.name,error.message);
      state.loading=false;state.buffering=false;state.playing=false;state.error=true;envelope=1;applyAudioVolume();notify();
    }
  }
  function advance(direction){const available=mediaLibrary.queue().map(t=>tracks.findIndex(x=>x.id===t.id));if(!available.length){pause();return;}let next;const pos=available.indexOf(state.index);if(state.shuffle&&available.length>1){const choices=available.filter(i=>i!==state.index);if(direction<0&&shuffleHistory.length){const prior=shuffleHistory.pop();next=available.includes(prior)?prior:choices[Math.floor(Math.random()*choices.length)];}else{next=choices[Math.floor(Math.random()*choices.length)];if(direction>0)shuffleHistory.push(state.index);}}else next=available[(pos+direction+available.length)%available.length];play(next,undefined,false,true);}
  function pause() {
    roomQueueSerial++;
    stopProgressLoop();
    state.position=elapsed();state.generation++;
    if(media)media.pause();
    state.playing=false;state.loading=false;state.buffering=false;fadeSerial++;envelope=1;applyAudioVolume();savePreferences();notify();
  }
  function toggle() {if(state.playing||state.loading)pause();else play();}
  function select(index) {
    if(!tracks[index]?.private)mediaQueue=null;
    if(index===state.index){toggle();return;}
    play(index);
  }
  function setOrder(shuffle){state.shuffle=shuffle;state.repeatOne=false;shuffleHistory.length=0;savePreferences();notify();}
  function setMode(mode){state[mode]=!state[mode];if(mode==='repeatOne'&&state.repeatOne){state.shuffle=false;shuffleHistory.length=0;}savePreferences();notify();}
  function eject() {
    if(state.index<0&&!state.exchange)return;
    pause();if(media){media.removeAttribute('src');media.load();}
    state.index=-1;state.position=0;state.started=false;state.error=false;lastDuration=0;startExchange('eject');
  }
  function seek(value) {
    const duration=displayDuration();
    state.position=clamp(Number(value)||0,0,duration);
    if(media&&media.currentSrc&&media.readyState>=1)media.currentTime=state.position;
    notify();
    startProgressLoop();
  }
  function setVolume(value) {
    state.volume=clamp(Number(value)||0,0,1);state.muted=state.volume===0;
    applyAudioVolume();savePreferences();
    mounts.forEach(m=>m.volume());
    extras?.volume?.();publish();
  }
  function mute() {
    if(state.volume>0){previousVolume=state.volume;setVolume(0);}else setVolume(previousVolume||.45);
  }
  function notify() {mounts.forEach(m=>m.update());updateMini();extras?.update();publish();updateMediaSession();}
  // timeupdate (~4 Hz) keeps the state and subscribers in step. A separate
  // rAF loop (tickProgress) repaints the sliders every frame while playing,
  // reading the audio clock directly, so the thumb moves continuously
  // instead of stepping between timeupdate events. The loop stops on pause,
  // on drag, and when the tab is hidden; timeupdate resumes it.
  function syncProgress() {if(document.hidden)return;paintProgress();publish();startProgressLoop();}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopProgressLoop();else syncProgress();});
  function ensureMini() {
    if(mini&&mini.isConnected)return;
    mini=document.createElement('aside');mini.className='lr-mini';mini.setAttribute('aria-label',dictionary().mini);
    mini.innerHTML='<button type="button" class="lr-mini-open" data-lr-mini="open"><span class="lr-mini-cover"></span><span class="lr-mini-copy"><span class="lr-mini-title"></span><span class="lr-mini-caption"></span></span></button><div class="lr-mini-controls"><button type="button" class="lr-mini-skip" data-lr-mini="previous"></button><button type="button" class="lr-mini-play" data-lr-mini="play"></button><button type="button" class="lr-mini-skip" data-lr-mini="next"></button><button type="button" class="lr-mini-close" data-lr-mini="close">'+icon('close')+'</button></div><div class="lr-mini-progress"><span class="lr-mini-elapsed">0:00</span><input type="range" min="0" max="1" step=".1" value="0" class="lr-mini-seek" data-lr-aria="seek"><span class="lr-mini-duration">—:—</span></div>';
    document.body.append(mini);
    mini.addEventListener('click',event=>{if(event.target.closest('.lr-mini-progress'))return;const action=event.target.closest('[data-lr-mini]');if(!action){document.dispatchEvent(new CustomEvent('luliy:records-open'));return;}if(action.dataset.lrMini==='close')eject();else if(action.dataset.lrMini==='open')document.dispatchEvent(new CustomEvent('luliy:records-open'));else if(action.dataset.lrMini==='play')toggle();else if(action.dataset.lrMini==='previous')advance(-1);else if(action.dataset.lrMini==='next')advance(1);});
    const seekInput=mini.querySelector('.lr-mini-seek');
    seekInput.addEventListener('pointerdown',()=>{draggingSeek=true;stopProgressLoop();});
    seekInput.addEventListener('pointerup',()=>{draggingSeek=false;});
    seekInput.addEventListener('pointercancel',()=>{draggingSeek=false;syncProgress();});
    seekInput.addEventListener('input',()=>{if(!draggingSeek){seek(seekInput.value);return;}mini.querySelector('.lr-mini-elapsed').textContent=time(+seekInput.value);});
    seekInput.addEventListener('change',()=>{draggingSeek=false;seek(seekInput.value);});
    updateMini();
  }
  function updateMini() {
    if(!mini)return;
    const d=dictionary(),track=current();mini.hidden=!state.started||Array.from(mounts).some(m=>m.controlsVisible)||Array.from(subscribers.values()).some(options=>options.controlsVisible);mini.dataset.theme=state.theme;mini.dataset.error=String(state.error);mini.setAttribute('aria-label',d.mini);
    const miniCover=mini.querySelector('.lr-mini-cover');
    mini.querySelector('.lr-mini-open').setAttribute('aria-label',d.openRecords);
    if(miniCover.dataset.index!==String(state.index)||miniCover._artwork!==artwork(track)){miniCover._artwork=artwork(track);miniCover.innerHTML=cover(Math.max(0,state.index));miniCover.dataset.index=String(state.index);}
    mini.querySelector('.lr-mini-title').textContent=track.name[state.lang];
    mini.querySelector('.lr-mini-caption').textContent=state.error?d.error:(state.loading?d.loading:state.buffering?d.buffering:state.playing?d.playing:d.paused);
    const playButton=mini.querySelector('.lr-mini-play');playButton.setAttribute('aria-label',state.playing?d.pause:d.play);playButton.setAttribute('aria-pressed',String(state.playing));
    playButton.innerHTML=icon(state.playing?'pause':'play')+'<svg class="lr-mini-ring" viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="18"/></svg>';
    mini.querySelector('[data-lr-mini="previous"]').innerHTML=icon('previous');mini.querySelector('[data-lr-mini="previous"]').setAttribute('aria-label',d.previous);
    mini.querySelector('[data-lr-mini="next"]').innerHTML=icon('next');mini.querySelector('[data-lr-mini="next"]').setAttribute('aria-label',d.next);
    mini.querySelector('.lr-mini-close').setAttribute('aria-label',d.close);mini.querySelector('.lr-mini-seek').setAttribute('aria-label',d.seek);updateMiniProgress();
  }
  let lastMiniSecond=-1,lastMiniDuration=-1;
  function updateMiniProgress() {
    if(!mini||mini.hidden)return;
    const duration=displayDuration(),position=elapsed(),seekInput=mini.querySelector('.lr-mini-seek');
    const second=Math.floor(position),secondChanged=second!==lastMiniSecond,durationChanged=duration!==lastMiniDuration;
    if(secondChanged)lastMiniSecond=second;if(durationChanged)lastMiniDuration=duration;
    if(!draggingSeek)seekInput.value=position;
    seekInput.max=duration||1;seekInput.disabled=!duration;seekInput.setAttribute('aria-valuetext',time(position)+' / '+time(duration));
    seekInput.style.setProperty('--lr-progress-pct',String(duration?position/duration*100:0)+'%');
    if(!draggingSeek&&secondChanged)mini.querySelector('.lr-mini-elapsed').textContent=time(position);
    if(durationChanged||secondChanged)mini.querySelector('.lr-mini-duration').textContent=duration?'−'+time(Math.max(0,duration-position)):'—:—';
    mini.style.setProperty('--lr-ring',String(113.1*(1-(duration?position/duration:0))));
  }
  function setLang(lang) {
    state.lang=texts[lang]?lang:'zh';notify();
  }
  function setTheme(theme) {
    state.theme=theme==='light'?'light':'dark';mounts.forEach(m=>{m.root.dataset.theme=state.theme;m.setModelTheme?.(state.theme);});if(mini)mini.dataset.theme=state.theme;publish();
  }
  /* The site loader (index.html inline script), copied verbatim: same L line-art, same
     colours, same reduced-motion / luliy-calm rules. Re-created per Records entry
     because the first-load loader removes itself from the DOM. */
  function createSiteLoader(){
    var a = 'dark';
  try { a = localStorage.getItem('luliy-appearance') || (localStorage.getItem('luliy-paper-ink') === 'light' ? 'cc' : 'dark'); } catch (e) {}
  var sky = function (c) { return 'linear-gradient(189deg,' + c[0] + ' .55%,' + c[1] + ' 30.38%,' + c[2] + ' 65.19%,' + c[3] + ' 100%)'; };
  var P = {
    forest: ['#1d2a25', '#17221e', '#111a17', '#0b110f'], espresso: ['#2a231d', '#211c17', '#181411', '#0f0d0b'],
    midnight: ['#1d212b', '#171a22', '#111319', '#0a0b0f'], oxblood: ['#2b181b', '#221316', '#190e10', '#10090a']
  }[document.documentElement.dataset.palette];
  var C = {
    cc: [sky(['#1f1f38', '#18182d', '#111222', '#0c0d1b']), 'rgba(234,223,190,.42)', '#f0d68f'],
    light: ['#faf9f5', 'rgba(20,20,19,.34)', '#9b7444'],
    dark: [P ? sky(P) : '#111110', 'rgba(242,237,228,.36)', '#d8b878']
  }[a] || null;
  if (!C) C = ['#111110', 'rgba(242,237,228,.36)', '#d8b878'];
  var shapes = ['M8.8 57.8a24 24 0 0 1-4.8-1l.2-.2c1-.6 2.3-2.2 3.1-3.4 1.4-2.2 1.9-4.4 2-8q.3-4.6 1.7-8a24 24 0 0 1 5-7.4l.1.8c.3 1.5 1 3.9 1.3 4.8q.2.3.4 0l.7-.1-.3-1a24 24 0 0 1-1.3-5.6l.4.9a34 34 0 0 0 5 9.3q2 2.3 3.6 2 1.3-.5 2.4-2 1.6-2.4 2.7-6l.6-2 1-3.5c.2-1 .1-1.4-.6-2.5l-1.2-1.8-.2-.3h-2.2l-.4-.2-1 .5c-.9.5-.9.5-1.2.5l-.7-.2.4-.3 1.1-.7c1.2-.7 1.3-.7 2-.6h1.3c1.3 0 1.2 0 2.1 1.4l1.4 2.5q.3.4.1.8c0 .7-.5 3-1 4.4q0 .6-.3 1.3c-.7 2.6-2 5.8-3.2 7.5q-3.2 4.4-7.3.3l-1.3-1.7-.1.5-.2 1.6-.3 1.2A35 35 0 0 1 14.3 53c0 .1 1.8-.1 3-.4l2.9-1c3-1 4.2-1.3 6.7-1.9q8.3-1.9 15 1.1l1.4.8-.7-.1A20 20 0 0 0 31 51a62 62 0 0 0-8.6 3.3 37 37 0 0 1-6.9 2.8q-3.7.9-6.7.6',
    'M26 37.3c0-1-.9-3.4-2-5.7l-.7-2.2-.2-2q-.2-2.9-1.2-4.7c-.6-1.4-2-3-3.7-4q-1-.6.1-.2a11 11 0 0 1 3.8 2.7v-.3q0-1 1-2.3l.2-.4.2-.3v-1c0-1 0-1.3.4-1.8q.3-.5.2 0v1.3l.1-.2.4-.4 1.1-.8 1.3-1q0-.5.3 0 .6 1.1 2.2 1.3 1 0 .2-.1-.8-.3-1.5-1l-1-1.2 1 .3q2.4 1.1 4 .9a3 3 0 0 0 2.2-1.5q.1-.2 0 .4-.3 3-1.7 3.5l-.4.2q-.2 0-1 2.1c-.3 1-.3 1-.6 1l-.8-.2-.3-.1-.1.2q-.2.4-.6.4-.2 0-.3.2-.2.3-.5.2t-.7.5-1 .5q-.9 0-1.7-1.2t-1.2-.8q-.7.3-.8 1.3c-.1.6 0 .8.4 1.9q.8 1.4 1 2.6l.5 4.4.9 2.3.7 1.9.1-.2.9-1.5c.8-1 2-3 2.5-3.8l.4-1.2q0-.4-.5-.9-.7-.6-1-1.4l-.7-.8q-.9-.9-.3-.8c.9.1 1.1.3 2 1.5l.5.7c1 1 1.2 1.7.5 3.3l-2.2 3.6q-1.2 1.6-1.9 3.4z',
    'M45 58q-2-.3-4.3-1a24 24 0 0 0-12.6-1.2l-1 .2s1.5-.6 2.5-.8q5.8-1.4 11-.2c4 .9 5.7 1.1 7.2 1q1 0 0-.2-2 0-5.1-1a26 26 0 0 0-14.4-.5l-1.1.3-3.8 1.4a29 29 0 0 1 11.3-4.3h3.5c1.7.2 2.9.4 5 1l4.7 1.2h2.4a8 8 0 0 0 5.3-3l.4-.5-.4 1.6q-1 3-3.7 4.6c-1.8 1-4.5 1.6-7 1.3',
    'm29.1 12.9-1.3-.6q-.6-.6-1.3-.4-.5.2-.4 0l.8-.3h1.4q1.4 0 1.8-.2h-.5l-2-.2q-.4 0-.1-.2a5 5 0 0 1 1.8-1q.7-.3 2.5 0a4 4 0 0 0 2 0c.2 0-1 1.4-1.7 2q-1.3 1-3 .9',
    'M17.5 16.8h-1.8l.4-.4q1-1 1.7-1.1l1.5-.1h.9l.3-.1-.5.7q-1.1 1.3-2.6 1',
    'm26.1 7.3-.5-.2.4-.3.5-.3-.6.2-.4.1.5-.6q1.2-1 3.2-.2.6.3.2.4-.6 0-1.3.5-1 .7-2 .4',
    'M23.8 10.4V10l-.3-.8c-.3-.7-.3-.9 0-1.5q.6-.9 1-1v.4l.3 1.2V9l-.2.4-.4.6q-.3.6-.4.4',
    'm21.4 16.2.3-.9q.4-.7 1.4-1l.6-.3q.3 0 0 .3-.4.6-1.4 1.3l-.7.5z',
    'm32.8 9-.2-.1q-1.1-.7-1.4-1.2L31 6.6l1 .4q.6.6.8 1.3z',
    'M22.3 10.3c-.3 0-.6-.7-.7-1.2l-.2-.7h.5l.7.3q.4 0 .7.8l.3.8z',
    'm21.3 13.7.9-1q.4-.4 1-.4.8 0 .7.2l-1 .9h-.7l-.6.2z',
    'M19.5 13.2v-1q.1-.8.8-1.1.6-.3.2.1l-.2.6-.4 1-.3.6q0 .4-.1-.2',
    'M26.9 10.1v-1Q27 8 28 7.7q.3 0 0 .3l-.2.7c-.1.6-.1.6-.6 1z',
    'm30.7 9-.8-.4c-.2-.2-.6-.9-.5-1l.9.3.3.3.4.5q.5.5-.3.3',
    'm24.7 11.5-.5-.2-.5-.1.2-.1.1-.1q.4-.5 1-.6l1.1.2-.2.3q-.5.6-1.2.6',
    'M25.1 14.4v-.5q.2-.8.7-.9l.4-.2q.5-.3.3.3-.1.6-.9 1l-.3.2z',
    'm14.2 13.4.2-.3q.3-.6.7-.7l1-.2c.1 0-.3.8-.5.9q-.2.3-1 .3z',
    'M32.1 13.4h-.2c0-.2.6-.7.9-.8l.6-.1h.5l-.3.4c-.6.4-.8.5-1.5.5',
    'M26.6 25.1q-.6-.3-.7-.7l1-.1q.2-.1.6.4l.3.3c0 .1-.8.2-1.2.1',
    'M21.3 13q-.3-.8.3-1.4.3-.4.3.2.1.5-.2.9l-.2.4q0 .3-.2-.1',
    'M35 9.8v-.6q0-.6.6-.8.4-.3.3.1 0 .5-.6 1-.3.5-.4.3',
    'M19.4 10.4q0-.5.5-.8l.5.1c0 .2-.9.8-1 .7',
    'm17.6 13.9-.2-.2-.1-.1v-.2q.4-.5.7 0 .2.2 0 .3-.4.4-.4.2'];
  var paths = function (cls, n) { return shapes.slice(0, n).map(function (d, i) { return '<path class="' + cls + '" pathLength="1" d="' + d + '" style="--i:' + i + '"/>'; }).join(''); };
  var css = '#luliy-loader{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:' + C[0] + ';transition:opacity 450ms cubic-bezier(.22,.61,.36,1);will-change:opacity;transform:translateZ(0)}' +
    '#luliy-loader.is-done{opacity:0;pointer-events:none}' +
    '#luliy-loader svg{width:88px;height:88px;overflow:visible;fill:none;stroke-linejoin:round;stroke-linecap:round;transform:translateZ(0)}' +
    '#luliy-loader .o{stroke:' + C[1] + ';stroke-width:.55;animation:luliy-loader-breathe 2.4s cubic-bezier(.65,0,.35,1) infinite alternate}' +
    '#luliy-loader .l{stroke:' + C[2] + ';stroke-width:1;stroke-dasharray:1 1;stroke-dashoffset:1;animation:luliy-loader-draw 3.6s cubic-bezier(.65,0,.35,1) infinite;animation-delay:calc(var(--i) * -.45s)}' +
    '#luliy-loader .t{stroke:' + C[2] + ';stroke-width:2.4;stroke-dasharray:1 1;stroke-dashoffset:1;animation:luliy-loader-draw-trail 3.6s cubic-bezier(.65,0,.35,1) infinite;animation-delay:calc(var(--i) * -.45s + .28s)}' +
    '@keyframes luliy-loader-breathe{from{opacity:.55}to{opacity:1}}@keyframes luliy-loader-draw{0%{stroke-dashoffset:1;opacity:0}8%{stroke-dashoffset:1;opacity:1}55%{stroke-dashoffset:0;opacity:1}75%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}@keyframes luliy-loader-draw-trail{0%{stroke-dashoffset:1;opacity:0}8%{stroke-dashoffset:1;opacity:.3}55%{stroke-dashoffset:0;opacity:.3}75%{stroke-dashoffset:0;opacity:.3}100%{stroke-dashoffset:0;opacity:0}}' +
    '@media(prefers-reduced-motion:reduce){#luliy-loader .o{animation:none;opacity:1}#luliy-loader .l,#luliy-loader .t{display:none}}' +
    'html.luliy-calm #luliy-loader .o{animation:none;opacity:1}html.luliy-calm #luliy-loader .l,html.luliy-calm #luliy-loader .t{display:none}';
    if (a === 'light') css = '#luliy-loader{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:' + C[0] + ';transition:opacity 450ms cubic-bezier(.22,.61,.36,1);will-change:opacity;transform:translateZ(0)}' +
      '#luliy-loader.is-done{opacity:0;pointer-events:none}' +
      '#luliy-loader img{width:120px;height:120px;object-fit:contain;animation:luliy-loader-breathe-img 2.4s cubic-bezier(.65,0,.35,1) infinite alternate}' +
      '@keyframes luliy-loader-breathe-img{from{opacity:.55;transform:scale(.96)}to{opacity:1;transform:scale(1)}}' +
      '@media(prefers-reduced-motion:reduce){#luliy-loader img{animation:none;opacity:1;transform:none}}' +
      'html.luliy-calm #luliy-loader img{animation:none;opacity:1;transform:none}';
  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  var el = document.createElement('div');
  el.id = 'luliy-loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<svg viewBox="0 0 60 60">' + paths('o') + paths('t', 4) + paths('l', 4) + '</svg>';
  if (a === 'light') el.innerHTML = '<img src="/assets/site/%5BIT-XIAOBIN%5D-1792981037054.png" alt="" aria-hidden="true">';
  document.documentElement.appendChild(el);
    return {el:el,style:style,done:function(){ el.classList.add('is-done'); setTimeout(function(){ el.remove(); style.remove(); },500); }};
  }
  const isIOS=()=>/iPhone|iPad|iPod/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  /* Records entry gate (standalone, all devices): hold the site loader up until the room
     is actually ready — WebGL first frame, track list, current cover, current duration —
     or 8 s, then fall through to the static preview the scene fallback already provides. */
  function startRecordGate(root){
    const started=Date.now();
    let done=false,coverSettled=false,interval=0,cap=0;
    const existing=document.getElementById('luliy-loader');
    const made=existing?null:createSiteLoader();
    const scene=()=>root.querySelector('.lr-scene');
    const coverArt=artwork(current());
    if(!coverArt)coverSettled=true;
    else{ const img=new Image(); img.onload=()=>{ coverSettled=true; }; img.onerror=()=>{ coverSettled=true; }; img.src=coverArt; }
    if(durationOf(current())<=0&&!current().private){
      try{
        ensureAudio();
        if(media&&media.src!==currentSrc()){ media.src=current().src; media.load(); }
      }catch(e){}
    }
    const ready=()=>tracks.length>0&&coverSettled&&scene()&&scene().classList.contains('lr-webgl-ready')&&(durationOf(current())>0||(media&&media.src===currentSrc()&&Number.isFinite(media.duration)&&media.duration>0));
    const finish=()=>{
      if(done)return; done=true;
      clearInterval(interval); clearTimeout(cap);
      if(made)made.done();
    };
    const check=()=>{
      if(done)return;
      if(ready()&&Date.now()-started>=700)finish();
    };
    interval=setInterval(check,120);
    cap=setTimeout(finish,8000);
    check();
    return {cancel(){ if(done)return; done=true; clearInterval(interval); clearTimeout(cap); if(made){ made.el.remove(); made.style.remove(); } }};
  }
  function mount(container,options) {
    if(typeof container==='string')container=document.querySelector(container);
    if(!container)throw new Error('LuliyRecords.mount needs a container');
    options=options||{};
    // Enhanced controls and presentation belong exclusively to the record page.
    const standalone=options.layout==='standalone';state.enhanced=standalone;
    state.lang=texts[options.lang]?options.lang:state.lang;
    if(options.theme)state.theme=options.theme==='light'?'light':'dark';
    else if(document.documentElement.dataset.theme)state.theme=document.documentElement.dataset.theme==='light'?'light':'dark';
    const d=dictionary(),root=document.createElement('section');root.className='lr-room '+(standalone?'lr-standalone':'lr-home');root.dataset.theme=state.theme;
    root.innerHTML='<div class="lr-layout"><div class="lr-scene" tabindex="0" role="group" data-lr-aria="viewHelp" aria-label="'+d.viewHelp+'">'+
      '<div class="lr-floor"></div><div class="lr-turntable"><div class="lr-plinth"></div><div class="lr-platter"></div><div class="lr-vinyl"><div class="lr-grooves"><div class="lr-disc-label"><span class="lr-label-title"></span><span class="lr-label-no"></span></div></div></div><div class="lr-spindle"></div><div class="lr-weight" aria-hidden="true"></div><div class="lr-arm-pivot"></div><button type="button" class="lr-tonearm" data-lr-action="play" aria-label="'+d.play+'"><span class="lr-headshell"></span></button><div class="lr-strobe"></div><div class="lr-speed">33 ⅓ RPM</div><div class="lr-cue"></div></div>'+
        '<div class="lr-view-controls">'+button('eject','eject','eject')+'<span class="lr-view-divider"></span>'+button('zoom-out','zoomOut','minus')+button('zoom-in','zoomIn','plus')+button('reset','reset','reset')+'</div></div>'+ 
      '<div class="lr-meta"><p class="lr-counter"></p><h3 class="lr-title"></h3><div class="lr-transport">'+button('previous','previous','previous')+'<button type="button" class="lr-primary" data-lr-action="play"></button>'+button('next','next','next')+'</div><div class="lr-track-progress"><span class="lr-elapsed">0:00</span><input type="range" class="lr-seek" data-lr-aria="seek" aria-label="'+d.seek+'" min="0" max="128" step=".1" value="0"><span class="lr-duration">2:08</span></div><div class="lr-sound-row"><div class="lr-play-modes">'+button('sequence','sequence','sequence')+button('shuffle','shuffle','shuffle')+'</div><div class="lr-volume"><button type="button" class="lr-icon-button lr-mute" data-lr-action="mute" aria-label="'+d.mute+'">'+icon('volume')+'</button><input class="lr-volume-range" data-lr-aria="volume" aria-label="'+d.volume+'" type="range" min="0" max="1" step=".01" value=".45"><span class="lr-volume-output">45%</span></div></div><div class="lr-audio-status" role="status" aria-live="polite"></div><div class="lr-clamp-rest" aria-hidden="true"><div class="lr-rest-weight"></div></div></div></div>'+
      '<div class="lr-shelf-heading"><span class="lr-shelf-label" data-lr-copy="library">'+d.library+'</span><div class="lr-shelf-nav">'+button('shelf-prev','shelfPrevious','left')+button('shelf-next','shelfNext','right')+'</div></div><div class="lr-shelf" role="group" aria-label="'+d.library+'">'+tracks.map((t,i)=>t.private?'':'<button type="button" class="lr-record" data-lr-track="'+i+'" aria-label="'+esc(t.name[state.lang])+'" aria-current="false">'+cover(i)+'<span class="lr-record-name">'+esc(t.name[state.lang])+'</span><span class="lr-record-info">'+String(i+1).padStart(2,'0')+' / '+durationLabel(t.duration)+'</span><span class="lr-record-state" aria-hidden="true"></span></button>').join('')+'</div>';
    container.append(root);
    const scene=root.querySelector('.lr-scene'),deck=root.querySelector('.lr-turntable'),shelf=root.querySelector('.lr-shelf');
    if(!standalone||new URLSearchParams(location.hash.split('?')[1]||'').get('exhibition')!=='1'){
      const entrance=document.createElement('a');entrance.className='lr-exhibition-entry';
      entrance.href='#/music?exhibition=1&lang='+state.lang;
      entrance.textContent=state.lang==='en'?'Enter exhibition':state.lang==='ja'?'展覧会へ':'进入展览';
      scene.querySelector('[data-lr-action="eject"]').after(entrance);
    }

    const seekInput=root.querySelector('.lr-seek'),volumeInput=root.querySelector('.lr-volume-range');
    const cleanups=[];let destroyed=false,suppressClick=false,shelfDrag=null,drag=null,pinch=null,progressVisible=true,view={rx:48,rz:-12,zoom:1.2,tx:0,ty:.12,tz:0};
    const pointers=new Map();let holdTimer=null,holdOrigin=null,world=null,placeholder=null,savedView=null,savedOverflow='',tourPosition=0,homeTour=null;
    const on=(node,type,callback,options)=>{node.addEventListener(type,callback,options);cleanups.push(()=>node.removeEventListener(type,callback,options));};
    let armResume=false;
    const knobOutput=document.createElement('output');knobOutput.className='lr-knob-output';knobOutput.hidden=true;scene.append(knobOutput);let knobTimer=0;const showKnobVolume=()=>{knobOutput.textContent=Math.round(state.volume*100)+'%';knobOutput.hidden=false;clearTimeout(knobTimer);knobTimer=setTimeout(()=>knobOutput.hidden=true,1000);};cleanups.push(()=>clearTimeout(knobTimer));
    const model=window.LuliyTurntable?.create(scene,{liftArmOnPause:standalone,parkGlassTransparent:standalone,onPlay:toggle,onClamp:standalone?toggleClamp:undefined,onSeekStart:standalone?()=>{armResume=state.playing;pause();}:undefined,onSeekEnd:standalone?()=>{if(armResume){armResume=false;play();}}:undefined,onFocus:standalone?focusDetail:undefined,onVolume:value=>{setVolume(value);if(standalone)showKnobVolume();},getVolume:()=>state.volume,onSeek:(ratio,commit)=>{const position=ratio*durationOf(current());if(commit)seek(position);else{seekInput.value=position;root.querySelector('.lr-elapsed').textContent=time(position);}},rest:root.querySelector('.lr-clamp-rest')});
    if(standalone){ const gate=startRecordGate(root); cleanups.push(()=>gate.cancel()); }
    const collection=document.createElement('div');collection.className='lr-collection';
    collection.innerHTML='<button type="button" class="lr-album-trigger" aria-expanded="false" aria-haspopup="dialog"><span data-lr-copy="album">'+d.album+'</span><small data-lr-copy="albumHint">'+d.albumHint+'</small><b aria-hidden="true">+</b></button><div class="lr-album-popup" popover="auto" role="dialog"><div class="lr-album-heading"><span data-lr-copy="album">'+d.album+'</span>'+button('repeat-one','repeatOne','repeat')+'<button type="button" class="lr-album-close" data-lr-aria="closeAlbum" aria-label="'+d.closeAlbum+'">×</button></div><ol>'+tracks.map((t,i)=>t.private?'':'<li><button type="button" data-lr-album-track="'+i+'"><small>'+String(i+1).padStart(2,'0')+'</small><span>'+esc(t.name[state.lang])+'</span><small>'+durationLabel(t.duration)+'</small></button></li>').join('')+'</ol></div>';
    root.append(collection);
    const albumTrigger=collection.querySelector('.lr-album-trigger'),albumPopup=collection.querySelector('.lr-album-popup');
    if(standalone){
      albumTrigger.classList.add('lr-playlist-icon','lr-icon-button');albumTrigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h12M4 12h12M4 18h7M18 15l4 3-4 3z"/></svg>';albumTrigger.setAttribute('data-lr-aria','openRecords');root.querySelector('.lr-transport').append(albumTrigger);
    }
    const closeAlbum=()=>{if(albumPopup.matches(':popover-open'))albumPopup.hidePopover();};
    {
      on(albumTrigger,'click',()=>{if(albumPopup.matches(':popover-open')){closeAlbum();return;}albumPopup.showPopover();const r=albumTrigger.getBoundingClientRect(),p=albumPopup.getBoundingClientRect();albumPopup.style.left=Math.max(16,Math.min(r.left,innerWidth-p.width-16))+'px';albumPopup.style.top=Math.max(16,Math.min(r.bottom+12,innerHeight-p.height-16))+'px';focusQueueCurrent(albumPopup.querySelector('ol'));});
      on(albumPopup,'toggle',()=>albumTrigger.setAttribute('aria-expanded',String(albumPopup.matches(':popover-open'))));
    }
    on(albumPopup,'click',e=>{const track=e.target.closest('[data-lr-album-track]');if(track){mediaLibrary.play(tracks[+track.dataset.lrAlbumTrack].id,mediaLibrary.queue().map(t=>t.id));}else if(e.target.closest('.lr-album-close')){closeAlbum();albumTrigger.focus({preventScroll:true});}});
    on(albumPopup,'keydown',e=>{if(e.key==='Escape'){closeAlbum();albumTrigger.focus({preventScroll:true});return;}if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;const choices=[...albumPopup.querySelectorAll('[data-lr-album-track]')],i=choices.indexOf(document.activeElement),n=e.key==='Home'?0:e.key==='End'?choices.length-1:(i+(e.key==='ArrowDown'?1:choices.length-1))%choices.length;choices[n].focus();e.preventDefault();});
    const detailMode=()=>!!(world||homeTour?.active||root.classList.contains('lr-detail-focused'));
    const updateView=()=>{root.style.setProperty('--lr-control-clearance',(detailMode()?0:Math.max(0,(view.zoom-1)*340))+'px');deck.style.setProperty('--lr-rx',view.rx+'deg');deck.style.setProperty('--lr-rz',view.rz+'deg');deck.style.setProperty('--lr-zoom',view.zoom);model?.setView(view);};
    const resetView=()=>{root.classList.remove('lr-detail-focused');model?.setPresentation({immersive:detailMode(),rest:world?.querySelector('.lr-clamp-rest')||root.querySelector('.lr-clamp-rest')});view={rx:48,rz:-12,zoom:1.2,tx:0,ty:.12,tz:0};updateView();};
    const clearHold=()=>{clearTimeout(holdTimer);holdTimer=null;holdOrigin=null;};
    function closeWorld(){
      if(!world)return;const dialog=world;world=null;clearHold();
      placeholder?.replaceWith(scene);placeholder=null;scene.classList.remove('lr-dragging');drag=null;pinch=null;pointers.clear();
      model?.setPresentation({immersive:false});view={...savedView};updateView();
      dialog.close();dialog.remove();document.body.classList.remove('lr-world-open');document.body.style.overflow=savedOverflow;
      if(homeTour&&!destroyed)updateHomeTour(true);
      if(!destroyed)scene.focus({preventScroll:true});
    }
    function openWorld(){
      if(world||destroyed||homeTour?.transfer)return;clearHold();closeAlbum();savedView={...view};savedOverflow=document.body.style.overflow;
      placeholder=document.createComment('turntable position');scene.before(placeholder);
      world=document.createElement('dialog');world.className='lr-world lr-room';world.dataset.theme=state.theme;
      world.setAttribute('aria-label',state.lang==='zh'?'唱片机沉浸展示':'Turntable immersive view');
      const close=document.createElement('button');close.type='button';close.className='lr-world-close';close.textContent='×';close.setAttribute('aria-label',state.lang==='zh'?'返回页面':'Return to page');
      const worldRest=document.createElement('div');worldRest.className='lr-clamp-rest lr-world-rest';worldRest.setAttribute('aria-hidden','true');
      world.append(scene,worldRest,close);document.body.append(world);document.body.classList.add('lr-world-open');document.body.style.overflow='hidden';
      world.showModal();drag=null;pinch=null;pointers.clear();scene.classList.remove('lr-dragging');
      view={rx:48,rz:-12,zoom:1.2,tx:0,ty:.12,tz:0};tourPosition=0;modelViewAngle=-12;
      model?.setPresentation({immersive:true,rest:worldRest});updateView();scene.focus({preventScroll:true});
      close.addEventListener('click',closeWorld);world.addEventListener('cancel',e=>{e.preventDefault();closeWorld();});
    }
    function focusDetail(kind){
      if(!kind){resetView();return;}
      const presets={volume:{rx:43,rz:290,zoom:3.5,tx:-2.72,ty:.5,tz:1.66},arm:{rx:40,rz:38,zoom:4.2,tx:2.0,ty:1.05,tz:.8},clamp:{rx:18,rz:-25,zoom:3.1,tx:-.63,ty:.72,tz:-.26}};
      Object.assign(view,presets[kind]||presets.arm);root.classList.add('lr-detail-focused');model?.setPresentation({immersive:true,rest:world?.querySelector('.lr-clamp-rest')||(homeTour?.active?homeTour.rest:root.querySelector('.lr-clamp-rest'))});updateView();
    }
    const detailViews=[
      {rx:48,rz:-12,zoom:1.2,tx:0,ty:.12,tz:0},
      {rx:18,rz:-25,zoom:3.1,tx:-.79,ty:.72,tz:-.1},
      {rx:40,rz:38,zoom:4.2,tx:-.79,ty:1.2,tz:-.1},
      {rx:48,rz:150,zoom:3.7,tx:2.22,ty:1.05,tz:-1.25},
      {rx:43,rz:290,zoom:3.5,tx:-2.72,ty:.5,tz:1.66},
      {rx:112,rz:375,zoom:2.5,tx:-2.4,ty:-.6,tz:1.6},
      {rx:65,rz:480,zoom:2.1,tx:0,ty:.05,tz:-1.9},
      {rx:48,rz:708,zoom:1.2,tx:0,ty:.12,tz:0}
    ];
    on(scene,'wheel',event=>{
      if(standalone&&model?.wheelControl(event)){event.preventDefault();showKnobVolume();return;}
      if(!world||event.ctrlKey)return;event.preventDefault();clearHold();
      tourPosition=Math.max(0,tourPosition+clamp(event.deltaY*(event.deltaMode===1?16:1)/850,-.45,.45));
      const span=detailViews.length-1;tourPosition=Math.min(span,tourPosition);applyDetailView(tourPosition/span);
      if(tourPosition>=span&&event.deltaY>0){closeWorld();requestAnimationFrame(()=>{if(!destroyed){const top=root.querySelector('.lr-layout').getBoundingClientRect().top+scrollY+1;window.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}});}
    },{passive:false});
    let modelViewAngle=-12;
    const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
    function applyDetailView(progress){
      const step=clamp(progress,0,1)*(detailViews.length-1),i=Math.min(detailViews.length-2,Math.floor(step)),t=smooth(step-i),a=detailViews[i],b=detailViews[i+1];
      for(const key of ['rx','rz','zoom','tx','ty','tz'])view[key]=a[key]+(b[key]-a[key])*t;
      modelViewAngle=view.rz;updateView();
    }
    function endHomeTour(){
      if(!homeTour)return;cancelHomeTransfer();homeTour.active=false;scene.classList.remove('lr-tour-scene');scene.style.removeProperty('left');scene.style.removeProperty('top');scene.style.removeProperty('width');scene.style.removeProperty('height');
      homeTour.slot.hidden=true;homeTour.track.classList.remove('lr-tour-active');homeTour.stage.style.opacity='';root.style.removeProperty('--lr-tour-reveal');root.classList.remove('lr-touring');
      root.querySelector('.lr-meta').inert=false;
      document.body.classList.remove('lr-home-tour-active');document.dispatchEvent(new CustomEvent('luliy:record-tour'));model?.setPresentation({immersive:false});
    }
    function cancelHomeTransfer(){
      const transfer=homeTour?.transfer;if(!transfer)return;clearTimeout(transfer.timer);transfer.fade.cancel();homeTour.transfer=null;
    }
    function completeHomeTransfer(){
      if(!homeTour||homeTour.transfer)return;
      // Render at a stable size while fading. Only resize once, behind the fade,
      // instead of reallocating WebGL and refraction buffers on every wheel tick.
      const fade=scene.animate([{opacity:1},{opacity:0}],{duration:180,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
      const transfer={fade,timer:0};homeTour.transfer=transfer;
      transfer.timer=setTimeout(()=>{
        if(destroyed||!homeTour||homeTour.transfer!==transfer)return;
        const top=homeTour.track.getBoundingClientRect().bottom+scrollY+1,layout=root.querySelector('.lr-layout');
        homeTour.completed=true;
        endHomeTour();view={rx:48,rz:708,zoom:1.2,tx:0,ty:.12,tz:0};updateView();
        window.scrollTo({top,behavior:'instant'});
        homeTour.reveal?.cancel();homeTour.reveal=layout.animate([{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}],{duration:360,easing:'cubic-bezier(.19,1,.22,1)'});
      },180);
    }
    function updateHomeTour(force=false){
      if(!homeTour||destroyed||world)return;
      const tour=homeTour,r=tour.track.getBoundingClientRect(),p=clamp(-r.top/r.height,0,1),active=!matchMedia('(prefers-reduced-motion: reduce)').matches&&r.top<innerHeight&&r.bottom>0;
      if(!active){if(p>=1)tour.completed=true;if(tour.active){endHomeTour();view={rx:48,rz:708,zoom:1.2,tx:0,ty:.12,tz:0};updateView();}return;}
      if(tour.completed&&p>=.8){const top=r.top+scrollY+r.height*.79;window.scrollTo({top,behavior:'instant'});return;}
      if(p<.8)tour.completed=false;
      if(!tour.active){tour.reveal?.cancel();tour.active=true;tour.slot.hidden=false;scene.classList.add('lr-tour-scene');root.classList.add('lr-touring');tour.track.classList.add('lr-tour-active');}
      if(p>=.8){completeHomeTransfer();return;}
      if(tour.transfer)cancelHomeTransfer();
      const q=0,target=tour.slot.getBoundingClientRect(),top=Math.max(0,r.top);
      scene.style.left=target.left*q+'px';scene.style.top=(top*(1-q)+target.top*q)+'px';scene.style.width=(innerWidth*(1-q)+target.width*q)+'px';scene.style.height=(innerHeight*(1-q)+target.height*q)+'px';
      tour.stage.style.top=top+'px';tour.stage.style.opacity=1-q;root.style.setProperty('--lr-tour-reveal',q);
      root.querySelector('.lr-meta').inert=q<.9;
      const hideNav=r.top<=80&&q<.7;if(document.body.classList.contains('lr-home-tour-active')!==hideNav){document.body.classList.toggle('lr-home-tour-active',hideNav);document.dispatchEvent(new CustomEvent('luliy:record-tour'));}
      const blend=smooth((q-.35)/.65);model?.setPresentation({immersive:true,inlineBlend:blend,rest:q<.5?tour.rest:root.querySelector('.lr-clamp-rest')});
      if(force||Math.abs(p-tour.lastProgress)>.0001){applyDetailView(clamp(p/.8,0,1));tour.lastProgress=p;}
    }
    function attachTour(track){
      if(!track)return;if(!model){track.hidden=true;return;}const slot=document.createElement('div');slot.className='lr-scene-slot';slot.hidden=true;slot.setAttribute('aria-hidden','true');scene.before(slot);
      track.innerHTML='<div class="lr-tour-stage" aria-hidden="true"><div class="lr-clamp-rest lr-tour-rest"></div></div>';
      homeTour={track,slot,stage:track.querySelector('.lr-tour-stage'),rest:track.querySelector('.lr-tour-rest'),active:false,lastProgress:-1,frame:0};
      const schedule=()=>{if(homeTour&&!homeTour.frame)homeTour.frame=requestAnimationFrame(()=>{homeTour.frame=0;updateHomeTour();});};on(window,'scroll',schedule,{passive:true});on(window,'resize',()=>{updateHomeTour(true);});on(matchMedia('(prefers-reduced-motion: reduce)'),'change',()=>updateHomeTour(true));
      cleanups.push(()=>{cancelAnimationFrame(homeTour?.frame);homeTour?.reveal?.cancel();endHomeTour();slot.remove();track.replaceChildren();homeTour=null;});updateHomeTour(true);
    }
    on(scene,'contextmenu',event=>event.preventDefault());
    const shelfBounds=()=>{if(destroyed||standalone)return;const fits=shelf.scrollWidth<=shelf.clientWidth+2;root.querySelector('[data-lr-action="shelf-prev"]').disabled=fits;root.querySelector('[data-lr-action="shelf-next"]').disabled=fits;};
    const moveShelf=direction=>{if(standalone){extension?.browse(direction);return;}const max=shelf.scrollWidth-shelf.clientWidth;if(max<=2)return;const next=direction>0?(shelf.scrollLeft>=max-12?0:Math.min(max,shelf.scrollLeft+shelf.clientWidth*.8)):(shelf.scrollLeft<=12?max:Math.max(0,shelf.scrollLeft-shelf.clientWidth*.8));shelf.scrollTo({left:next,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
    let lastWheel=0;
    on(shelf,'wheel',event=>{if(standalone||event.ctrlKey||shelf.scrollWidth<=shelf.clientWidth+2)return;const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;if(!delta)return;event.preventDefault();const now=performance.now();if(now-lastWheel<360)return;lastWheel=now;moveShelf(Math.sign(delta));},{passive:false});
    let lastProgressSecond=-1,lastProgressDuration=-1;
    function progress() {
      if(destroyed||model?.isSeeking())return;const position=elapsed(),track=current(),empty=state.index<0,duration=displayDuration();
      model?.setProgress({position:draggingSeek?+seekInput.value:position,duration});
      if(!progressVisible)return;
      const second=Math.floor(position),secondChanged=second!==lastProgressSecond,durationChanged=duration!==lastProgressDuration;
      if(secondChanged)lastProgressSecond=second;if(durationChanged)lastProgressDuration=duration;
      if(!draggingSeek)seekInput.value=position;
      seekInput.max=empty?1:duration||1;seekInput.disabled=empty||!duration;seekInput.setAttribute('aria-valuetext',time(position)+' / '+time(duration));
      seekInput.style.setProperty('--lr-progress-pct',String(duration?position/duration*100:0)+'%');
      if(!draggingSeek&&secondChanged)root.querySelector('.lr-elapsed').textContent=time(position);
      if(durationChanged||secondChanged)root.querySelector('.lr-duration').textContent=empty?'—:—':time(duration);
    }
    function updateVolume(){
      model?.setVolume(state.volume);
      const d=dictionary(),muteButton=root.querySelector('.lr-mute');
      if(muteButton.dataset.muted!==String(state.muted)){muteButton.dataset.muted=String(state.muted);muteButton.innerHTML=icon(state.muted?'mute':'volume');}
      muteButton.setAttribute('aria-label',state.muted?d.unmute:d.mute);muteButton.setAttribute('aria-pressed',String(state.muted));
      if(document.activeElement!==volumeInput)volumeInput.value=state.volume;
      root.querySelector('.lr-volume-output').textContent=Math.round(state.volume*100)+'%';
    }
    function update() {
      if(destroyed)return;const d=dictionary(),track=current(),empty=state.index<0;
      root.dataset.theme=state.theme;root.classList.toggle('lr-playing',state.playing);root.classList.toggle('lr-clamp-off',state.clampOff);root.classList.toggle('lr-resting',state.resting);root.classList.toggle('lr-ejected',empty);root.classList.toggle('lr-exchanging',!!state.exchange);root.classList.toggle('lr-ejecting',state.exchange?.kind==='eject');root.classList.toggle('lr-inserting',!!state.exchange?.fromEmpty);root.style.setProperty('--lr-exchange-duration',(state.exchange?.duration||4600)+'ms');
      model?.setState({playing:state.playing,ejected:empty,clampOff:state.clampOff,resting:state.resting,exchange:state.exchange,title:track.name.en||track.name.zh,number:Math.max(0,state.index)+1,cover:artwork(track),position:elapsed(),duration:durationOf(track),theme:state.theme});
      root.querySelectorAll('[data-lr-copy]').forEach(n=>n.textContent=d[n.dataset.lrCopy]);
      root.querySelectorAll('[data-lr-aria]').forEach(n=>{n.setAttribute('aria-label',d[n.dataset.lrAria]);if(n.tagName==='BUTTON')n.title=d[n.dataset.lrAria];});
      root.querySelector('.lr-counter').textContent=empty?'— / '+String(tracks.length).padStart(2,'0'):String(state.index+1).padStart(2,'0')+' / '+String(tracks.length).padStart(2,'0');
      root.querySelector('.lr-title').textContent=empty?d.choose:track.name[state.lang];
      
      deck.querySelector('.lr-label-title').textContent=track.name.en;deck.querySelector('.lr-label-no').textContent='LULIY / '+String(Math.max(0,state.index)+1).padStart(2,'0');
      deck.querySelector('.lr-disc-label').style.setProperty('--lr-cover-bg',track.color);
      deck.querySelector('.lr-disc-label').style.backgroundImage=artwork(track)?'url("'+artwork(track)+'")':'';
      root.querySelector('.lr-primary').innerHTML=icon(state.playing?'pause':'play')+'<span>'+esc(state.playing?d.pause:d.play)+'</span>';
      root.querySelectorAll('[data-lr-action="play"]').forEach(n=>{n.setAttribute('aria-label',state.playing?d.pause:d.play);n.setAttribute('aria-pressed',String(state.playing));});
      updateVolume();
      root.querySelector('[data-lr-action="sequence"]').setAttribute('aria-pressed',String(!state.shuffle&&!state.repeatOne));root.querySelector('[data-lr-action="shuffle"]').setAttribute('aria-pressed',String(state.shuffle&&!state.repeatOne));collection.querySelector('[data-lr-action="repeat-one"]').setAttribute('aria-pressed',String(state.repeatOne));
      root.querySelector('.lr-audio-status').textContent=state.error?d.error:state.exchange?d.changing:empty?d.empty:state.loading?d.loading:state.buffering?d.buffering:state.playing?d.playing:state.started?d.paused:d.ready;
      root.querySelectorAll('.lr-record').forEach(n=>{const i=+n.dataset.lrTrack;n.setAttribute('aria-current',String(i===state.index));n.setAttribute('aria-label',tracks[i].name[state.lang]);n.querySelector('.lr-record-name').textContent=tracks[i].name[state.lang];n.querySelector('.lr-record-info').textContent=String(i+1).padStart(2,'0')+' / '+durationLabel(tracks[i].duration);});
      shelf.setAttribute('aria-label',d.library);
      syncMusicMount(root,albumPopup);
      progress();shelfBounds();
    }
    const instance={root,update,progress,volume:updateVolume,controlsVisible:false,setModelTheme:theme=>model?.setTheme(theme),};
    mounts.add(instance);update();updateMini();
    const extension=standalone?extras?.attach(root,{on,focus:focusDetail,reset:resetView,clamp:toggleClamp,album:albumPopup}):null;cleanups.push(()=>extension?.destroy());
    on(root,'click',event=>{
      const record=event.target.closest('[data-lr-track]');
      if(record){if(suppressClick){event.preventDefault();return;}if(!standalone)select(Number(record.dataset.lrTrack));return;}
      const control=event.target.closest('[data-lr-action]');if(!control)return;
      const action=control.dataset.lrAction;
      if(action==='play')toggle();
      else if(action==='sequence')setOrder(false);else if(action==='shuffle')setOrder(true);
      else if(action==='repeat-one')setMode('repeatOne');
      else if(action==='previous')advance(-1);
      else if(action==='next')advance(1);
      else if(action==='eject')eject();
      else if(action==='mute')mute();
      else if(action==='reset')resetView();
      else if(action==='zoom-in'||action==='zoom-out'){view.zoom=clamp(view.zoom+(action==='zoom-in'?.12:-.12),.7,detailMode()?4.8:1.35);updateView();}
      else if(action==='shelf-prev'||action==='shelf-next')moveShelf(action==='shelf-next'?1:-1);
    });
    on(seekInput,'pointerdown',()=>{draggingSeek=true;stopProgressLoop();});on(seekInput,'pointerup',()=>{draggingSeek=false;});on(seekInput,'pointercancel',()=>{draggingSeek=false;syncProgress();});on(seekInput,'input',()=>{if(!draggingSeek){seek(seekInput.value);return;}root.querySelector('.lr-elapsed').textContent=time(+seekInput.value);model?.setProgress({position:+seekInput.value,duration:displayDuration()});});on(seekInput,'change',()=>{draggingSeek=false;seek(seekInput.value);});
    on(volumeInput,'input',()=>setVolume(volumeInput.value));
    on(scene,'keydown',event=>{
      if(event.target!==scene)return;if(event.key==='Enter'){event.preventDefault();openWorld();return;}let used=true;
      if(event.key==='ArrowLeft')view.rz-=5;else if(event.key==='ArrowRight')view.rz+=5;
      else if(event.key==='ArrowUp')view.rx-=5;else if(event.key==='ArrowDown')view.rx+=5;
      else if(event.key==='+'||event.key==='=')view.zoom=clamp(view.zoom+.1,.7,detailMode()?4.8:1.35);else if(event.key==='-')view.zoom=clamp(view.zoom-.1,.7,detailMode()?4.8:1.35);
      else if(event.key==='Home')resetView();else used=false;
      if(used){event.preventDefault();modelViewAngle=view.rz;updateView();}
    });
    on(scene,'pointerdown',event=>{
      if(event.target.closest('button,a')||event.button!==0)return;
      if(model?.beginControl(event)){clearHold();scene.setPointerCapture(event.pointerId);event.preventDefault();return;}
      clearHold();holdOrigin={x:event.clientX,y:event.clientY};if(!world)holdTimer=setTimeout(openWorld,600);
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pointers.size===2){const p=Array.from(pointers.values());pinch={distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),zoom:view.zoom};drag=null;scene.classList.add('lr-dragging');}
      else drag={id:event.pointerId,x:event.clientX,y:event.clientY,rx:view.rx,rz:view.rz,active:event.pointerType==='mouse',touch:event.pointerType!=='mouse'};
      if(event.pointerType==='mouse'){scene.setPointerCapture(event.pointerId);scene.classList.add('lr-dragging');}
    });
    on(scene,'pointermove',event=>{
      if(model?.moveControl(event)){event.preventDefault();return;}
      if(holdOrigin&&Math.hypot(event.clientX-holdOrigin.x,event.clientY-holdOrigin.y)>6)clearHold();
      if(!pointers.has(event.pointerId))return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pinch&&pointers.size===2){const p=Array.from(pointers.values());view.zoom=clamp(pinch.zoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/Math.max(1,pinch.distance),.7,detailMode()?4.8:1.35);updateView();event.preventDefault();return;}
      if(!drag||drag.id!==event.pointerId)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(!drag.active&&((detailMode()&&Math.hypot(dx,dy)>7)||(Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)))){drag.active=true;scene.setPointerCapture(event.pointerId);scene.classList.add('lr-dragging');}
      if(!drag.active)return;
      view.rz=drag.rz+dx*.23;view.rx=drag.rx-dy*.19;modelViewAngle=view.rz;updateView();event.preventDefault();
    });
    const endScene=event=>{const controlled=model?.endControl(event);if(!controlled&&drag&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<4&&root.classList.contains('lr-detail-focused'))resetView();clearHold();pointers.delete(event.pointerId);if(scene.hasPointerCapture(event.pointerId))scene.releasePointerCapture(event.pointerId);if(pointers.size<2)pinch=null;drag=null;scene.classList.remove('lr-dragging');};
    on(scene,'pointerup',endScene);on(scene,'pointercancel',endScene);
    on(shelf,'keydown',event=>{
      if(standalone)return;const record=event.target.closest('.lr-record');if(!record)return;const choices=[...shelf.querySelectorAll('.lr-record:not([hidden])')];let index=choices.indexOf(record);
      if(event.key==='ArrowRight')index=Math.min(choices.length-1,index+1);else if(event.key==='ArrowLeft')index=Math.max(0,index-1);else if(event.key==='Home')index=0;else if(event.key==='End')index=choices.length-1;else return;
      event.preventDefault();const target=choices[index];if(!target)return;target.focus({preventScroll:true});
      const rect=target.getBoundingClientRect(),bounds=shelf.getBoundingClientRect();if(rect.left<bounds.left)shelf.scrollLeft-=bounds.left-rect.left+8;else if(rect.right>bounds.right)shelf.scrollLeft+=rect.right-bounds.right+8;
    });
    on(shelf,'pointerdown',event=>{if(standalone||event.pointerType!=='mouse'||event.button!==0||event.target.closest('[data-lr-track]'))return;suppressClick=false;shelfDrag={id:event.pointerId,x:event.clientX,y:event.clientY,left:shelf.scrollLeft,active:false};});
    on(shelf,'pointermove',event=>{
      if(shelfDrag&&shelfDrag.id===event.pointerId){const dx=event.clientX-shelfDrag.x,dy=event.clientY-shelfDrag.y;if(!shelfDrag.active&&Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)){shelfDrag.active=true;suppressClick=true;shelf.setPointerCapture(event.pointerId);shelf.classList.add('lr-dragging');}if(shelfDrag.active){shelf.scrollLeft=shelfDrag.left-dx;event.preventDefault();return;}}
      if(standalone||matchMedia('(prefers-reduced-motion: reduce)').matches||event.pointerType!=='mouse')return;
      const record=event.target.closest('.lr-record');if(!record)return;const rect=record.getBoundingClientRect();record.style.setProperty('--lr-tilt-x',((event.clientX-rect.left)/rect.width-.5)*8+'deg');record.style.setProperty('--lr-tilt-y',-((event.clientY-rect.top)/rect.height-.5)*8+'deg');
    });
    const endShelf=event=>{if(!shelfDrag||shelfDrag.id!==event.pointerId)return;if(shelf.hasPointerCapture(event.pointerId))shelf.releasePointerCapture(event.pointerId);shelfDrag=null;shelf.classList.remove('lr-dragging');setTimeout(()=>{suppressClick=false;},0);};
    on(shelf,'pointerup',endShelf);on(shelf,'pointercancel',endShelf);on(shelf,'pointerleave',()=>root.querySelectorAll('.lr-record').forEach(n=>{n.style.removeProperty('--lr-tilt-x');n.style.removeProperty('--lr-tilt-y');}));
    on(shelf,'dragstart',event=>{if(!event.target.closest('[data-lr-track]'))event.preventDefault();});on(shelf,'scroll',shelfBounds,{passive:true});
    const visibility=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(([entry])=>{progressVisible=instance.controlsVisible=entry.isIntersecting;if(progressVisible)progress();updateMini();},{rootMargin:'80px 0px'}):null;if(visibility)visibility.observe(root.querySelector('.lr-transport'));
    const resize=typeof ResizeObserver!=='undefined'?new ResizeObserver(shelfBounds):null;if(resize)resize.observe(shelf);else on(window,'resize',shelfBounds);
    return {attachTour,destroy(){if(destroyed)return;destroyed=true;clearHold();closeWorld();mounts.delete(instance);cleanups.forEach(fn=>fn());if(resize)resize.disconnect();if(visibility)visibility.disconnect();model?.destroy();root.remove();updateMini();},setLang,setTheme};
  }
  let mediaSessionWired=false;
  function updateMediaSession(){
    if(!('mediaSession' in navigator))return;
    try{
      const track=current();
      const title=track.name?(track.name[state.lang]||track.name.zh||track.name.en||''):'';
      const art=artwork(track);
      let type='image/jpeg';
      if(/\.svg($|\?)/i.test(art))type='image/svg+xml';
      else if(/\.webp($|\?)/i.test(art))type='image/webp';
      else if(/\.png($|\?)/i.test(art))type='image/png';
      const artworkList=art?[{src:new URL(art,location.href).href,sizes:'300x300',type:type}]:[];
      navigator.mediaSession.metadata=new MediaMetadata({title:title,artist:'Luliy',album:'Luliy Records',artwork:artworkList});
      navigator.mediaSession.playbackState=state.playing?'playing':'paused';
    }catch(e){}
  }
  function setupMediaSession(){
    if(mediaSessionWired||!('mediaSession' in navigator))return;
    mediaSessionWired=true;
    try{
      navigator.mediaSession.setActionHandler('play',()=>{ if(!state.playing)toggle(); });
      navigator.mediaSession.setActionHandler('pause',()=>{ if(state.playing)toggle(); });
      navigator.mediaSession.setActionHandler('previoustrack',()=>advance(-1));
      navigator.mediaSession.setActionHandler('nexttrack',()=>advance(1));
      navigator.mediaSession.setActionHandler('seekto',details=>{ if(details&&Number.isFinite(details.seekTime))seek(details.seekTime); });
    }catch(e){}
  }
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)return;
    if(pendingFade){ const f=pendingFade; pendingFade=null; fadeSerial++; envelope=f.target; applyAudioVolume(); f.resolve(true); }
    if(state.exchange){ clearTimeout(exchangeTimer); const done=exchangeResolve; state.exchange=null; exchangeResolve=null; notify(); if(done)done(); }
  });
  document.addEventListener('error',event=>{
    const img=event.target;
    if(img&&img.tagName==='IMG'&&img.closest&&img.closest('.lr-public-artwork')){
      img.closest('.lr-cover').classList.add('lr-cover-failed'); img.remove();
    }
  },true);
  setupMediaSession();
  document.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.code!=='Space'||event.altKey||event.ctrlKey||event.metaKey||!state.started)return;
    if(event.target.closest('input,textarea,select,button,a,[contenteditable],dialog[open],[role="dialog"]')||document.querySelector('dialog[open]'))return;
    event.preventDefault();toggle();
  });
  if(typeof MutationObserver!=='undefined')new MutationObserver(()=>{
    const theme=document.documentElement.dataset.theme;
    if(theme==='light'||theme==='dark')setTheme(theme);
  }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  extras?.configure({tracks,state,current,artwork,elapsed,time,play,pause,seek,setVolume,softStop,toggleClamp,notify});
  let sourceRetryId='';
  function setPlaybackMode(mode){state.shuffle=mode==='shuffle';state.repeatOne=mode==='repeat';shuffleHistory.length=0;savePreferences();notify();}
  const mediaLibrary={
    view:syncQueueView,focusCurrent:focusQueueCurrent,
    upsert(track){const existing=tracks.find(t=>t.id===track.id);if(existing)Object.assign(existing,track,{revoked:false});else tracks.push({...track,private:true,revoked:false,src:''});notify();return tracks.findIndex(t=>t.id===track.id);},
    play(id,queue){mediaQueue=(queue||[id]).slice();const index=tracks.findIndex(t=>t.id===id&&!t.revoked);if(index<0)return Promise.reject(Error('曲目已不可用'));return play(index,undefined,false,true);},
    rename(id,nextId,file){const track=tracks.find(t=>t.id===id);if(!track)return;track.id=nextId;track.file={...track.file,...file};if(mediaQueue)mediaQueue=mediaQueue.map(x=>x===id?nextId:x);notify();},
    revoke(ids,stop=false){for(const t of tracks)if(ids.includes(t.id)){t.revoked=true;if(t===current()&&stop)eject();}if(mediaQueue)mediaQueue=mediaQueue.filter(id=>!ids.includes(id));notify();},
    clear(){if(current()?.private)eject();for(let i=tracks.length-1;i>=0;i--)if(tracks[i].private)tracks.splice(i,1);mediaQueue=null;sourceRetryId='';notify();},
    queue(){return (mediaQueue||(state.enhanced?extras?.order()||tracks.map((_,i)=>i):tracks.map((_,i)=>i)).filter(i=>!tracks[i].private&&!tracks[i].revoked).map(i=>tracks[i].id)).map(id=>tracks.find(t=>t.id===id&&!t.revoked)).filter(Boolean).map(t=>({...t}));},
    cover(id){const index=tracks.findIndex(t=>t.id===id);return index>=0?cover(index):'';},
    revision(){return state.generation;},
    all(){return tracks.filter(t=>t.private&&!t.revoked).map(t=>({...t}));},
    get(id){return tracks.find(t=>t.id===id);},
    init(){ensureAudio();media.addEventListener('playing',()=>{const id=current().id;setTimeout(()=>{if(current().id===id&&state.playing)sourceRetryId='';},15000)});media.addEventListener('error',()=>{const t=current();if(t.resolveSource&&state.started&&sourceRetryId!==t.id){sourceRetryId=t.id;const position=state.position;t.src='';play(state.index,position,false,true);} });}
  };
// Views receive one stable queue snapshot; they never rebuild on every audio tick.
function syncQueueView(container){const queue=mediaLibrary.queue(),fingerprint=state.lang+JSON.stringify(queue.map(t=>[t.id,t.name,t.file?.creator,t.cover]));if(container._queueFingerprint!==fingerprint){const focused=container.querySelector(':focus')?.dataset.queueId,scroll=container.scrollTop;container._queueFingerprint=fingerprint;container.replaceChildren();for(const t of queue){const row=document.createElement(container.tagName==='OL'?'li':'div'),b=document.createElement('button');b.type='button';b.className='lm-queue-track';b.dataset.queueId=t.id;const i=tracks.findIndex(x=>x.id===t.id);b.dataset.lrAlbumTrack=i;b.innerHTML='<span class="lm-queue-cover">'+cover(i)+'</span><span class="lm-queue-copy"><strong>'+esc(t.name[state.lang]||t.name.zh)+'</strong><small class="lm-queue-artist">'+esc(t.file?.creator||t.artist||'')+'</small></span><small class="lm-queue-state"></small>';b.onclick=e=>{e.stopPropagation();mediaLibrary.play(t.id,mediaLibrary.queue().map(x=>x.id));};row.append(b);container.append(row);}container.scrollTop=scroll;if(focused)[...container.querySelectorAll('[data-queue-id]')].find(b=>b.dataset.queueId===focused)?.focus({preventScroll:true});}for(const b of container.querySelectorAll('[data-queue-id]')){const active=state.index>=0&&b.dataset.queueId===current().id;b.setAttribute('aria-current',String(active));b.querySelector('.lm-queue-state').textContent=active?(state.error?'!':state.playing?'Ⅱ':'▶'):'';b.setAttribute('aria-label',b.querySelector('strong').textContent+(active?(state.lang==='en'?(state.playing?' · Playing':' · Paused'):state.lang==='ja'?(state.playing?' · 再生中':' · 一時停止'):(state.playing?' · 正在播放':' · 已暫停')):''));}}
function syncMusicMount(root,albumPopup){const queue=mediaLibrary.queue(),currentId=state.index<0?'':current().id,pos=queue.findIndex(t=>t.id===currentId);root.querySelector('.lr-counter').textContent=(pos<0?'—':String(pos+1).padStart(2,'0'))+' / '+String(queue.length).padStart(2,'0');root.querySelectorAll('[data-lr-copy="album"]').forEach(n=>n.textContent=state.lang==='en'?'Now playing queue':state.lang==='ja'?'再生キュー':'目前播放列表');albumPopup.setAttribute('aria-label',state.lang==='en'?'Now playing queue':'目前播放列表');syncQueueView(albumPopup.querySelector('ol'));if(root.classList.contains('lr-home')){const shelf=root.querySelector('.lr-shelf');for(const card of [...shelf.querySelectorAll('[data-private-record]')])if(!tracks[+card.dataset.lrTrack]?.private||tracks[+card.dataset.lrTrack]?.revoked)card.remove();for(let i=0;i<tracks.length;i++){const t=tracks[i];if(!t.private||t.revoked)continue;let card=shelf.querySelector('[data-lr-track="'+i+'"]');if(!card){card=document.createElement('button');card.type='button';card.className='lr-record';card.dataset.lrTrack=i;card.dataset.privateRecord='true';shelf.append(card);}const markup=cover(i)+'<span class="lr-record-name">'+esc(t.name[state.lang])+'</span><span class="lr-record-info">Drive</span>';if(card.innerHTML!==markup)card.innerHTML=markup;card.setAttribute('aria-current',String(i===state.index));card.setAttribute('aria-label',t.name[state.lang]);}}}
function focusQueueCurrent(container){const current=container.querySelector('[aria-current="true"]')||container.querySelector('[data-queue-id]');current?.scrollIntoView({block:'nearest'});current?.focus({preventScroll:true});}

  mediaLibrary.init();

  window.LuliyRecords={mediaLibrary,mode:setPlaybackMode,audio:()=>media,refresh:notify,mount,pause,setLang,setTheme,play,select,eject,toggle,advance,seek,setVolume,setListeningGain,toggleClamp,subscribe,getState:snapshot,tracks:()=>tracks.map(track=>({...track,name:{...track.name},cover:artwork(track)})),artwork:index=>artwork(tracks[Number.isInteger(index)?index:Math.max(0,state.index)]||current())};
})();

