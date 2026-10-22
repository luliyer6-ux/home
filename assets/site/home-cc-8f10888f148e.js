/* Walnut furniture and readable, selectable books for the standalone study. */
(function(){
'use strict';
// Keep the immutable grain canvases across homepage and room mounts; each scene owns its GPU texture.
let woodCanvasSource=null,leatherCanvasSource=null;
function create(T,{books=[],projects=[],projectCovers={},portraits=[],lang='zh',onChange=()=>{}}={}){
 const group=new T.Group();group.name='study-furniture';
 const geometries=new Set(),materials=new Set(),textures=new Set(),bookTargets=[],interactionTargets=[],drawers=[],geometryCache=new Map(),pendingImages=[];let disposed=false;
 const keepGeometry=g=>(geometries.add(g),g),keepMaterial=m=>(materials.add(m),m);
 const material=(color,roughness=.5,metalness=0,extra={})=>keepMaterial(new T.MeshStandardMaterial({color,roughness,metalness,...extra}));
 function texture(canvas){const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;textures.add(t);return t;}
 let seed=47291;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
 function woodTexture(){
  if(woodCanvasSource){const t=texture(woodCanvasSource);t.wrapS=t.wrapT=T.RepeatWrapping;return t;}
  const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');
  const image=x.createImageData(c.width,c.height);
  for(let y=0;y<c.height;y++)for(let p=0;p<c.width;p++){
   const stretch=y+6*Math.sin(p*.005)+2.7*Math.sin(p*.014+y*.023)+1.1*Math.sin(p*.034);
   const grain=Math.sin(stretch*1.62)+.39*Math.sin(stretch*3.77)+.22*Math.sin(stretch*7.94);
   const broad=Math.sin(y*.049+p*.002)*1.65+Math.sin(y*.172-p*.003)*.8;
   const pore=Math.pow(Math.max(0,Math.sin(stretch*2.75+p*.001)),12)*2.3;
   const noise=(random()-.5)*3,v=grain*3.1+broad-pore+noise,i=(y*c.width+p)*4;
   image.data[i]=77+v*.93;image.data[i+1]=55+v*.76;image.data[i+2]=40+v*.60;image.data[i+3]=255;
  }
  x.putImageData(image,0,0);
  x.globalAlpha=.085;
  for(let i=0;i<90;i++){const y=random()*512;x.strokeStyle=i%3?'#27211b':'#ab9675';x.lineWidth=.25+random()*.4;x.beginPath();for(let p=0;p<=1024;p+=8){const yy=y+Math.sin(p*.006+i)*4+Math.sin(p*.016+i)*1.3;p?x.lineTo(p,yy):x.moveTo(p,yy);}x.stroke();}
  woodCanvasSource=c;const t=texture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t;
 }
 const woodMap=woodTexture();
 const verticalWood=woodMap.clone();verticalWood.center.set(.5,.5);verticalWood.rotation=Math.PI/2;verticalWood.needsUpdate=true;textures.add(verticalWood);
 const walnut=material('#ffffff',.28,.035,{map:woodMap,bumpMap:woodMap,bumpScale:.012});
 const walnutDark=material('#c3b5a1',.38,.012,{map:woodMap,bumpMap:woodMap,bumpScale:.016});
 const walnutEdge=material('#cfbea4',.25,.025,{map:woodMap,bumpMap:woodMap,bumpScale:.008});
 const walnutBack=material('#c7bba7',.44,0,{map:woodMap,bumpMap:woodMap,bumpScale:.014});
 const walnutVertical=material('#e4d6c1',.32,.02,{map:verticalWood,bumpMap:verticalWood,bumpScale:.011});
 if(!leatherCanvasSource){leatherCanvasSource=document.createElement('canvas');leatherCanvasSource.width=leatherCanvasSource.height=256;const x=leatherCanvasSource.getContext('2d'),pixels=x.createImageData(256,256);for(let i=0;i<256*256;i++){const n=110+(random()-.5)*72;pixels.data[i*4]=pixels.data[i*4+1]=pixels.data[i*4+2]=n;pixels.data[i*4+3]=255;}x.putImageData(pixels,0,0);}
 const leatherGrain=texture(leatherCanvasSource);leatherGrain.wrapS=leatherGrain.wrapT=T.RepeatWrapping;leatherGrain.repeat.set(3,3);
 const leather=material('#302724',.42,.035,{bumpMap:leatherGrain,bumpScale:.016});
 const leatherSoft=material('#3e312a',.48,.022,{bumpMap:leatherGrain,bumpScale:.021});
 const seam=material('#80644d',.73,0);
 const bronze=material('#927d58',.24,.83);
 const darkMetal=material('#252321',.29,.77);
 const wheel=material('#181716',.65,.02);
 const shadowGap=material('#17100c',.85,0);
 const darkFelt=material('#241b14',.92,0);
 function mesh(geometry,mat,parent=group){const o=new T.Mesh(keepGeometry(geometry),keepMaterial(mat.clone()));o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function cached(key,make){if(!geometryCache.has(key))geometryCache.set(key,keepGeometry(make()));return geometryCache.get(key);}
 function box(w,h,d,mat,x,y,z,parent=group){const o=mesh(cached('box:'+w+':'+h+':'+d,()=>new T.BoxGeometry(w,h,d)),mat,parent);o.position.set(x,y,z);return o;}
 function roundGeometry(w,h,d,r){
  const g=new T.BoxGeometry(w,h,d,10,10,10),a=g.getAttribute('position'),hw=w/2,hh=h/2,hd=d/2;
  const edgeSample=(v,half)=>{const u=Math.abs(v)/half,s=Math.sign(v);return s*(u<=.4?(half-r)*u/.4:(half-r)+(u-.4)*r/.6);};
  for(let i=0;i<a.count;i++){
   const px=edgeSample(a.getX(i),hw),py=edgeSample(a.getY(i),hh),pz=edgeSample(a.getZ(i),hd),cx=Math.max(-hw+r,Math.min(hw-r,px)),cy=Math.max(-hh+r,Math.min(hh-r,py)),cz=Math.max(-hd+r,Math.min(hd-r,pz));
   let dx=px-cx,dy=py-cy,dz=pz-cz,len=Math.sqrt(dx*dx+dy*dy+dz*dz);
   if(len){dx*=r/len;dy*=r/len;dz*=r/len;}a.setXYZ(i,cx+dx,cy+dy,cz+dz);
  }
  g.computeVertexNormals();return g;
 }
 function roundBox(w,h,d,r,mat,x,y,z,parent=group){const o=mesh(cached('round:'+w+':'+h+':'+d+':'+r,()=>roundGeometry(w,h,d,r)),mat,parent);o.position.set(x,y,z);return o;}
 function cylinder(rt,rb,h,mat,x,y,z,parent=group,segments=32){const o=mesh(cached('cylinder:'+rt+':'+rb+':'+h+':'+segments,()=>new T.CylinderGeometry(rt,rb,h,segments)),mat,parent);o.position.set(x,y,z);return o;}
 function rod(start,end,r,mat,parent=group,rt=r){const a=new T.Vector3(...start),b=new T.Vector3(...end),direction=b.clone().sub(a),o=mesh(new T.CylinderGeometry(rt,r,direction.length(),16),mat,parent);o.position.copy(a.add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());return o;}
 function seamLine(start,end,parent,r=.006){return rod(start,end,r,seam,parent);}

 // The desk has a thick polished edge, recessed drawers, and substantial end panels.
 const desk=new T.Group();desk.name='walnut-desk';group.add(desk);
 roundBox(8.55,.29,2.9,.055,walnut,-1.35,3.105,-1.25,desk);
 box(8.42,.045,2.78,walnutEdge,-1.35,2.93,-1.25,desk);
 box(8.26,.08,2.64,walnutDark,-1.35,2.43,-1.25,desk);
 box(8.26,.09,2.64,walnutDark,-1.35,2.90,-1.25,desk);
 box(.30,2.7,2.67,walnutVertical,-5.46,1.35,-1.25,desk);
 box(.30,2.7,2.67,walnutVertical,2.76,1.35,-1.25,desk);
 box(8.0,1.02,.17,walnutDark,-1.35,1.62,-2.49,desk);
 box(.33,.035,2.69,darkFelt,-5.46,.03,-1.25,desk);
 box(.33,.035,2.69,darkFelt,2.76,.03,-1.25,desk);
 for(let i=0;i<3;i++){
  const dx=-4.09+i*2.74,drawer=new T.Group();drawer.name='study-drawer-'+i;drawer.position.set(dx,2.665,.087);desk.add(drawer);
  const front=box(2.65,.415,.056,walnut,0,0,0,drawer);front.name='study-drawer-front-'+i;
  box(2.58,.042,1.12,walnutDark,0,-.176,-.55,drawer);
  box(.055,.31,1.12,walnutDark,-1.277,-.03,-.55,drawer);box(.055,.31,1.12,walnutDark,1.277,-.03,-.55,drawer);
  box(2.54,.31,.044,walnutDark,0,-.03,-1.088,drawer);box(2.49,.013,1.04,darkFelt,0,-.148,-.55,drawer);box(2.47,.014,.045,darkFelt,0,-.13,-1.03,drawer);box(.045,.014,1.0,darkFelt,-1.23,-.13,-.55,drawer);box(.045,.014,1.0,darkFelt,1.23,-.13,-.55,drawer);
  box(2.68,.017,.055,shadowGap,dx,2.918,.099,desk);
  box(.016,.43,.044,shadowGap,dx+1.349,2.68,.100,desk);
  const handle=box(.46,.025,.073,bronze,0,.086,.075,drawer);handle.name='study-drawer-handle-'+i;
  drawers.push({object:drawer,home:{position:drawer.position.clone(),rotation:drawer.rotation.clone()},index:i});
  interactionTargets.push({object:front,handle,kind:'drawer',title:lang==='en'?'Desk drawer':'书桌抽屉',anchor:new T.Vector3(dx,2.68,.19),index:i});
 }

 // Physical contents travel with their own drawer; popups belong to the objects, not the handles.
 const paperMat=material('#ded3bb',.86),vinylMat=material('#080909',.68,.035);
 const drawerContents=[];
 function paperTexture(title,subtitle){const c=document.createElement('canvas');c.width=512;c.height=384;const x=c.getContext('2d');x.fillStyle='#e4dac5';x.fillRect(0,0,512,384);x.fillStyle='#39382f';x.font='28px serif';x.fillText(title,36,72,440);x.font='18px serif';x.fillText(subtitle,36,114,440);x.strokeStyle='#b9af99';for(let i=0;i<8;i++){x.beginPath();x.moveTo(36,158+i*24);x.lineTo(464,158+i*24);x.stroke();}return texture(c);}
 const recordData=window.LULIY_DATA?.collections?.records||[],recordMaps=window.LULIY_DATA?.recordCovers||{};
 for(let di=0;di<3;di++){
  const parent=drawers[di].object;
  for(let j=0;j<(di===1?recordData.length:2);j++){
   const item=new T.Group();item.name='study-drawer-item-'+di+'-'+j;item.position.set(di===1?-1.02+(j%7)*.34:-.59+j*1.16,-.112,di===1?-.86+Math.floor(j/7)*.30:-.53);item.rotation.y=di===1?0:(j-1)*.08;if(di===1)item.scale.setScalar(.40);parent.add(item);
   if(di===1){
    const record=recordData[j]||{},disc=cylinder(.35,.35,.022,vinylMat,0,.018,0,item,64);
    for(const radius of [.22,.27,.315,.343]){const groove=mesh(cached('drawer-groove:'+radius,()=>new T.TorusGeometry(radius,.002,4,64)),darkMetal,item);groove.rotation.x=Math.PI/2;groove.position.y=.030;}
    cylinder(.135,.135,.004,paperMat,0,.032,0,item,32);
    const cover=recordMaps[record.id];if(cover){const map=paperTexture(record.title||record.name||'LULIY','RECORDS'),label=mesh(new T.CircleGeometry(.135,32),material('#ffffff',.6,0,{map}),item);label.rotation.x=-Math.PI/2;label.position.y=.036;const img=new Image();pendingImages.push(img);img.onload=()=>{if(disposed)return;const x=map.image.getContext('2d');x.drawImage(img,0,0,512,384);map.needsUpdate=true;onChange();};img.src=cover;}
   }else{
    roundBox(di===0&&j===0?.32:.94,.025,.76,.009,paperMat,0,.018,0,item);
    const map=paperTexture(di===0?(j?'摘录':'书签'):(j?'随手笔记':'阅读手记'),'LULIY / THE STUDY');
    const face=mesh(new T.PlaneGeometry(di===0&&j===0?.30:.91,.73),material('#ffffff',.85,0,{map}),item);face.rotation.x=-Math.PI/2;face.position.y=.034;
    if(di===0)box(.055,.007,.34,bronze,j?.34:.09,.042,-.20,item);
   }
   const target={object:item,kind:'drawer-content',drawerIndex:di,index:j,title:di===1?String(recordData[j]?.name?.[lang]||recordData[j]?.name?.zh||recordData[j]?.title||'唱片'):(di===0?(j?'摘录':'书签'):(j?'随手笔记':'阅读手记'))};drawerContents.push(target);interactionTargets.push(target);
  }
 }

 // Objects on the desk are functional entrances, with finished backs for free orbit.
 const graphite=material('#242629',.30,.60),graphiteEdge=material('#48494a',.23,.74),screenRim=material('#0e1113',.40,.08),paper=material('#d9d0b9',.88),ink=material('#121b21',.29,.34);
 const laptop=new T.Group();laptop.name='laptop';laptop.position.set(-.59,3.267,-1.14);laptop.rotation.y=-.045;desk.add(laptop);
 roundBox(1.94,.09,1.27,.035,graphite,0,.034,0,laptop);box(1.81,.010,1.14,graphiteEdge,0,.085,-.006,laptop);
 const keyboardCanvas=document.createElement('canvas');keyboardCanvas.width=768;keyboardCanvas.height=384;const keyContext=keyboardCanvas.getContext('2d');
 keyContext.fillStyle='#303235';keyContext.fillRect(0,0,768,384);keyContext.fillStyle='#111315';
 for(let row=0;row<5;row++)for(let col=0;col<14;col++){const kx=25+col*51,ky=17+row*42;keyContext.fillRect(kx,ky,44,33);keyContext.fillStyle='#727578';keyContext.font='10px sans-serif';keyContext.fillText(row===4?'·':String.fromCharCode(65+(row*14+col)%26),kx+5,ky+11);keyContext.fillStyle='#111315';}
 keyContext.fillRect(187,225,396,133);keyContext.strokeStyle='#5b5e60';keyContext.lineWidth=2;keyContext.strokeRect(187,225,396,133);
 const keyboard=mesh(new T.PlaneGeometry(1.72,.90),material('#ffffff',.50,.05,{map:texture(keyboardCanvas)}),laptop);keyboard.rotation.x=-Math.PI/2;keyboard.position.set(0,.091,-.052);keyboard.castShadow=false;
 for(const sx of [-.90,.90])for(let i=0;i<7;i++)box(.025,.007,.007,screenRim,sx,.093,-.31+i*.065,laptop);
 const screen=new T.Group();screen.name='laptop-screen';screen.position.set(0,.09,-.567);screen.rotation.x=-.245;laptop.add(screen);
 roundBox(1.92,1.21,.063,.030,graphite,0,.605,0,screen);roundBox(1.82,1.103,.012,.006,screenRim,0,.622,.037,screen);
 const screenCanvas=document.createElement('canvas');screenCanvas.width=1024;screenCanvas.height=640;const sx=screenCanvas.getContext('2d');
 sx.fillStyle='#15191b';sx.fillRect(0,0,1024,640);sx.fillStyle='#d8ceb4';sx.font='500 29px Georgia, serif';sx.fillText('LULIY',57,57);sx.font='20px serif';sx.fillStyle='#ae9c7d';sx.fillText(lang==='en'?'SELECTED WORKS':'作品 · SELECTED WORKS',57,106);
 sx.strokeStyle='#4c493e';sx.lineWidth=1;sx.beginPath();sx.moveTo(57,126);sx.lineTo(967,126);sx.stroke();
 const preview=projects.length?projects.slice(0,4):[['CET4'],['Latter'],['408'],['活着']],screenMap=texture(screenCanvas);
 preview.forEach((project,i)=>{
  const title=String(Array.isArray(project)?project[0]:project.title||project.name||'作品'),px=57+i*230;
  sx.fillStyle=['#a99c7d','#7b675d','#6f8077','#766e59'][i%4];sx.fillRect(px,171,204,318);sx.fillStyle='#1e2523';sx.globalAlpha=.55;sx.fillRect(px+13,184,178,292);sx.globalAlpha=1;
  sx.strokeStyle='#c0b599';sx.strokeRect(px+25,199,154,258);sx.fillStyle='#ded4b9';sx.font='italic 27px Georgia, serif';sx.fillText(title,px+17,439,170);sx.font='17px Georgia, serif';sx.fillStyle='#b6a589';sx.fillText(String(i+1).padStart(2,'0')+' / '+title,px,527,210);
  const source=projectCovers[title]||projectCovers[title.toLowerCase()]||(!Array.isArray(project)&&(project.cover||project.image));
  if(source){const img=new Image();pendingImages.push(img);img.onload=()=>{if(disposed)return;const scale=Math.max(204/img.width,318/img.height),iw=204/scale,ih=318/scale;sx.drawImage(img,(img.width-iw)/2,(img.height-ih)/2,iw,ih,px,171,204,318);screenMap.needsUpdate=true;onChange();};img.src=source;}
 });
 sx.fillStyle='#96876d';sx.font='18px Georgia, serif';sx.fillText(lang==='en'?'Open a project from the screen':'点开屏幕，选择作品',57,596);screenMap.needsUpdate=true;
 const display=mesh(new T.PlaneGeometry(1.736,1.012),material('#ffffff',.48,.05,{map:screenMap,emissive:'#c9c7b6',emissiveMap:screenMap,emissiveIntensity:.34}),screen);display.position.set(0,.634,.045);display.castShadow=false;
 const webcam=cylinder(.013,.013,.004,screenRim,0,1.142,.045,screen,16);webcam.rotation.x=Math.PI/2;
 cylinder(.015,.015,1.72,darkMetal,0,.076,-.554,laptop,24).rotation.z=Math.PI/2;
 interactionTargets.push({object:laptop,kind:'computer',title:lang==='en'?'Works':'作品',anchor:new T.Vector3(-.59,4.01,-1.42)});

 const notebook=new T.Group();notebook.name='notebook';notebook.position.set(2.10,3.277,-.98);notebook.rotation.y=-.16;desk.add(notebook);
 roundBox(1.08,.041,.83,.016,leather,0,.016,0,notebook);box(1.00,.032,.76,paper,.02,.051,-.012,notebook);
 const notebookLid=new T.Group();notebookLid.name='notebook-lid';notebookLid.position.set(-.54,.075,0);notebook.add(notebookLid);roundBox(1.08,.018,.83,.008,leather,.54,0,0,notebookLid);
 for(let line=0;line<8;line++)box(.73,.001,.0016,material('#aaa18c',.85),.030,.068,-.28+line*.077,notebook);
 const noteCanvas=document.createElement('canvas');noteCanvas.width=512;noteCanvas.height=384;const nx=noteCanvas.getContext('2d');nx.fillStyle='#302d27';nx.fillRect(0,0,512,384);nx.strokeStyle='#857357';nx.lineWidth=1;nx.strokeRect(27,27,458,330);nx.fillStyle='#c4b795';nx.textAlign='center';nx.font='18px Georgia, serif';nx.fillText('LULIY / NOTES',256,85);nx.font='500 47px serif';nx.fillText(lang==='en'?'Articles':'文 章',256,206);nx.fillStyle='#8f8067';nx.font='16px serif';nx.fillText(lang==='en'?'Words kept close':'随手记下，也慢慢读',256,279);
 const noteCover=mesh(new T.PlaneGeometry(1.045,.801),material('#ffffff',.76,0,{map:texture(noteCanvas)}),notebookLid);noteCover.rotation.x=-Math.PI/2;noteCover.position.set(.54,.010,0);noteCover.castShadow=false;
 const insideCover=mesh(new T.PlaneGeometry(1.01,.78),paper,notebookLid);insideCover.rotation.x=Math.PI/2;insideCover.position.set(.54,-.010,0);insideCover.castShadow=false;
 const articleCanvas=document.createElement('canvas');articleCanvas.width=768;articleCanvas.height=576;const articleMap=texture(articleCanvas);
 const articleSheet=new T.Group();articleSheet.name='study-article-sheet';articleSheet.position.set(-.465,.077,-.01);notebook.add(articleSheet);const articlePage=mesh(new T.PlaneGeometry(.97,.73),material('#ffffff',.86,0,{map:articleMap,side:T.DoubleSide}),articleSheet);articlePage.name='study-article-page';articlePage.rotation.x=-Math.PI/2;articlePage.position.set(.485,0,0);articlePage.castShadow=false;
 function showArticle(entry={}){const x=articleCanvas.getContext('2d');x.fillStyle='#e8dfcd';x.fillRect(0,0,768,576);x.fillStyle='#776a53';x.font='22px Georgia';x.fillText('LULIY / ARTICLES',48,58);x.fillStyle='#282923';x.font='36px serif';const title=String(entry.title||'文章');for(let n=0;n<Math.ceil(title.length/16);n++)x.fillText(title.slice(n*16,(n+1)*16),48,118+n*48);x.font='22px serif';const text=String(entry.body||entry.description||entry.date||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ');for(let n=0;n<8;n++)x.fillText(text.slice(n*28,(n+1)*28),48,260+n*31);x.strokeStyle='#b8ac96';for(let n=0;n<7;n++){x.beginPath();x.moveTo(48,292+n*31);x.lineTo(716,292+n*31);x.stroke();}articleMap.needsUpdate=true;onChange();}showArticle();
 const ribbon=box(.045,.005,.18,material('#9e5c3d',.7),.34,.042,.448,notebook);ribbon.rotation.y=.05;
 interactionTargets.push({object:notebook,kind:'articles',title:lang==='en'?'Articles':'文章',anchor:new T.Vector3(2.10,3.38,-.98)});

 const pen=new T.Group();pen.name='fountain-pen';pen.position.set(2.35,3.320,-.30);pen.rotation.y=-.35;desk.add(pen);
 const penBody=cylinder(.043,.041,.74,ink,-.080,0,0,pen,28);penBody.rotation.z=Math.PI/2;
 const penCap=cylinder(.048,.046,.27,ink,-.552,0,0,pen,28);penCap.rotation.z=Math.PI/2;
 const band=cylinder(.050,.050,.025,bronze,-.402,0,0,pen,28);band.rotation.z=Math.PI/2;
 for(const x of [-.681,.277]){const ring=cylinder(.043,.043,.013,bronze,x,0,0,pen,24);ring.rotation.z=Math.PI/2;}
 rod([-.635,.043,.013],[-.424,.047,.013],.009,bronze,pen,.006);
 const grip=cylinder(.032,.041,.145,darkMetal,.325,0,0,pen,24);grip.rotation.z=-Math.PI/2;
 const nib=cylinder(0,.029,.16,bronze,.473,0,0,pen,3);nib.rotation.z=-Math.PI/2;nib.scale.z=.30;
 rod([.412,.008,0],[.549,.008,0],.0018,ink,pen);
 interactionTargets.push({object:pen,kind:'pen',title:lang==='en'?'Write · GitHub Issues':lang==='ja'?'書く・GitHub Issues':'写作 · GitHub Issues',anchor:new T.Vector3(2.275,3.320,-.327)});

 // A small framed photograph stands behind the notebook, facing the chair.
 const portraitFrame=new T.Group();portraitFrame.name='study-portrait-frame';portraitFrame.position.set(1.03,3.27,-2.15);portraitFrame.rotation.y=-.12;desk.add(portraitFrame);
 roundBox(.96,.08,.34,.025,walnut,0,.035,-.08,portraitFrame);
 roundBox(.85,1.02,.075,.025,walnutDark,0,.59,0,portraitFrame);
 box(.78,.95,.012,bronze,0,.59,.045,portraitFrame);
 box(.73,.90,.012,screenRim,0,.59,.054,portraitFrame);
 const portraitFace=mesh(new T.PlaneGeometry(.69,.85),material('#241f1a',.88,0,{side:T.DoubleSide}),portraitFrame);
 portraitFace.position.set(0,.59,.065);portraitFace.castShadow=false;
 interactionTargets.push({object:portraitFrame,kind:'portrait',title:lang==='en'?'About Luliy':'关于 Luliy',anchor:new T.Vector3(1.03,3.86,-2.15)});

 // A high backed leather swivel chair, with stitched pads and a five star base.
 const chair=new T.Group();chair.name='leather-swivel-chair';chair.position.set(.70,0,2.40);chair.rotation.y=-1.65;group.add(chair);
 cylinder(.15,.23,.85,darkMetal,0,.83,0,chair);
 cylinder(.12,.12,.83,bronze,0,1.25,0,chair);
 cylinder(.28,.35,.14,darkMetal,0,.40,0,chair);
 cylinder(.39,.40,.10,bronze,0,.45,0,chair);
 for(let i=0;i<5;i++){
  const a=i*Math.PI*2/5+.24,ex=Math.cos(a)*1.26,ez=Math.sin(a)*1.26;
  rod([Math.cos(a)*.23,.43,Math.sin(a)*.23],[ex,.28,ez],.07,darkMetal,chair,.045);
  rod([Math.cos(a)*.27,.47,Math.sin(a)*.27],[ex,.33,ez],.024,bronze,chair,.018);
  cylinder(.065,.065,.22,darkMetal,ex,.23,ez,chair,16);
  const castor=new T.Group();chair.add(castor);castor.position.set(ex,.17,ez);castor.rotation.y=-a;
  for(const sign of [-1,1]){const o=cylinder(.145,.145,.084,wheel,sign*.083,0,0,castor,24);o.rotation.z=Math.PI/2;const hub=cylinder(.052,.052,.009,darkMetal,sign*.13,0,0,castor,20);hub.rotation.z=Math.PI/2;}
 }
 roundBox(1.65,.18,1.63,.065,darkMetal,0,1.67,-.08,chair);
 roundBox(1.83,.28,1.70,.12,leather,0,1.88,-.09,chair);
 roundBox(1.69,.135,1.51,.067,leatherSoft,0,2.027,-.13,chair);
 seamLine([-.73,2.03,.62],[.73,2.03,.62],chair);
 seamLine([-.81,2.03,-.7],[-.81,2.03,.58],chair);
 seamLine([.81,2.03,-.7],[.81,2.03,.58],chair);
 const back=new T.Group();back.name='stitched-chair-back';back.position.set(0,2.17,.68);back.rotation.x=.105;chair.add(back);
 function curvedPad(w,h,d,r,mat,x,y,z,parent){const geometry=roundGeometry(w,h,d,r),a=geometry.getAttribute('position');for(let n=0;n<a.count;n++){const px=a.getX(n),py=a.getY(n);a.setZ(n,a.getZ(n)+.10*Math.pow(px/(w/2),2)-.055*Math.cos(py/h*Math.PI));}geometry.computeVertexNormals();const o=mesh(geometry,mat,parent);o.position.set(x,y,z);return o;}
 curvedPad(1.85,2.18,.18,.08,darkMetal,0,1.04,.045,back);
 curvedPad(1.76,1.83,.27,.12,leather,0,.88,-.052,back);
 for(let i=0;i<3;i++){
  curvedPad(1.60,.555,.13,.065,leatherSoft,0,.285+i*.586,-.218,back);
  seamLine([-.71,.031+i*.586,-.259],[.71,.031+i*.586,-.259],back,.006);
 }
 // A tailored leather rear panel keeps the chair convincing from every angle.
 roundBox(1.56,1.60,.15,.072,leatherSoft,0,.90,.170,back);
 for(const x of [-.69,.69])seamLine([x,.22,.222],[x,1.58,.222],back,.0045);
 for(const y of [.43,1.04,1.53]){seamLine([-.62,y,.239],[.62,y,.239],back,.004);}
 for(const x of [-.80,.80])roundBox(.12,1.75,.13,.052,leather,x,.90,.116,back);
 roundBox(1.76,.72,.30,.135,leather,0,2.02,-.026,back);
 roundBox(1.62,.58,.08,.038,leatherSoft,0,2.04,-.194,back);
 roundBox(1.57,.53,.115,.055,leatherSoft,0,2.05,.166,back);
 seamLine([-.69,2.292,-.212],[.69,2.292,-.212],back);
 for(const sign of [-1,1]){
  rod([sign*.79,1.70,.58],[sign*1.00,2.40,.34],.047,bronze,chair);
  rod([sign*.82,1.69,-.47],[sign*.98,2.37,-.38],.047,bronze,chair);
  rod([sign*.80,2.19,.78],[sign*.94,3.58,.92],.043,darkMetal,chair);
  roundBox(.33,.18,1.48,.072,leather,sign*1.00,2.46,-.04,chair);
  roundBox(.245,.038,1.31,.018,leatherSoft,sign*1.00,2.56,-.04,chair);
 }
 interactionTargets.push({object:chair,kind:'chair',title:lang==='en'?'Sit at the desk':'坐到书桌前',anchor:new T.Vector3(.70,2.1,2.40)});

 // A tall, built-in looking case: inset back, bevelled front stiles and shelves.
 const shelf=new T.Group();shelf.name='walnut-bookcase';shelf.position.set(4.18,0,-2.43);group.add(shelf);
 box(3.03,6.70,.16,walnutBack,0,3.35,-.465,shelf);
 box(.18,6.70,1.09,walnutVertical,-1.435,3.35,0,shelf);
 box(.18,6.70,1.09,walnutVertical,1.435,3.35,0,shelf);
 box(3.03,.19,1.09,walnut,0,6.605,0,shelf);
 box(3.03,.25,1.09,walnut,0,.165,0,shelf);
 roundBox(.07,6.55,.075,.012,walnutVertical,-1.524,3.40,.54,shelf);
 roundBox(.07,6.55,.075,.012,walnutVertical,1.524,3.40,.54,shelf);
 const shelfLevels=[.53,1.70,2.88,4.06,5.24];
 shelfLevels.forEach(y=>{box(2.74,.14,1.0,walnut,0,y-.07,.013,shelf);box(2.73,.039,.085,walnutEdge,0,y-.039,.526,shelf);});
 box(3.13,.075,1.16,walnutDark,0,.037,0,shelf);
 box(2.64,.072,.095,shadowGap,0,.27,.5,shelf);

 const bookColors=['#485752','#7e3f2e','#c6baa0','#536373','#947349','#393f42','#b2a892','#573f37','#5b5d42','#a09173','#49473f','#8f6650'];
 const pages=material('#c1b299',.95),pageLines=material('#a59781',.94),goldInk=material('#bba37a',.47,.12);
 function spineTexture(title,bg,index){
  const c=document.createElement('canvas');c.width=128;c.height=512;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,128,512);
  const light=x.createLinearGradient(0,0,128,0);light.addColorStop(0,'rgba(0,0,0,.25)');light.addColorStop(.20,'rgba(255,245,214,.075)');light.addColorStop(.85,'rgba(0,0,0,.02)');light.addColorStop(1,'rgba(0,0,0,.3)');x.fillStyle=light;x.fillRect(0,0,128,512);
  x.fillStyle=index%3===2?'#302f2a':'#e0d2b2';x.textAlign='center';x.textBaseline='middle';
  const chars=Array.from(String(title||''));
  if(/[\u3400-\u9fff]/.test(title)){
   const size=Math.min(39,Math.max(18,333/Math.max(1,chars.length)));x.font='500 '+size+'px "Noto Serif SC", "Microsoft YaHei", serif';const step=Math.min(42,343/Math.max(1,chars.length));chars.forEach((ch,i)=>x.fillText(ch,64,88+i*step));
  }else{
   x.save();x.translate(64,240);x.rotate(-Math.PI/2);x.font='500 31px Georgia, serif';const textWidth=x.measureText(title).width;if(textWidth>337)x.scale(337/textWidth,1);x.fillText(title,0,0);x.restore();
  }
  x.globalAlpha=.55;x.fillRect(25,45,78,1);x.fillRect(25,448,78,1);x.font='15px Georgia, serif';x.fillText(String(index+1).padStart(2,'0'),64,475);x.globalAlpha=1;return texture(c);
 }
 function coverTexture(title,bg){
  const c=document.createElement('canvas');c.width=384;c.height=640;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,384,640);
  x.strokeStyle='rgba(224,210,176,.44)';x.lineWidth=1.5;x.strokeRect(26,28,332,584);x.fillStyle='#e0d2b2';x.textAlign='center';x.font='19px Georgia, serif';x.fillText('LULIY / READING',192,95);
  const chars=Array.from(String(title||''));x.font='500 35px "Microsoft YaHei", serif';const rows=[];let line='';chars.forEach(ch=>{if(x.measureText(line+ch).width>276){rows.push(line);line=ch;}else line+=ch;});if(line)rows.push(line);rows.forEach((text,i)=>x.fillText(text,192,277+(i-(rows.length-1)/2)*53));
  x.fillStyle='rgba(224,210,176,.40)';x.fillRect(136,487,112,1);x.font='16px Georgia, serif';x.fillText('PRIVATE LIBRARY',192,537);return texture(c);
 }
 function hash(text){let n=2166136261;for(const ch of text){n^=ch.codePointAt(0);n=Math.imul(n,16777619);}return n>>>0;}
 function makeBook(book,index,w,h,d,key){
  const g=new T.Group();g.name='study-book-'+index;g.userData.studyBook={id:book.id||null,title:book.title,index};shelf.add(g);
  const color=bookColors[hash(key)%bookColors.length],cover=material(color,.69,.015),spine=material('#ffffff',.74,.01,{map:spineTexture(book.title,color,index)});
  box(w-.036,h-.028,d-.049,pages,0,0,-.019,g);
  box(.018,h+.018,d,cover,-w/2+.009,0,0,g);box(.018,h+.018,d,cover,w/2-.009,0,0,g);
  roundBox(w,h+.018,.057,.006,cover,0,0,d/2-.026,g);
  const face=mesh(new T.PlaneGeometry(w-.010,h-.003),spine,g);face.position.set(0,0,d/2+.004);face.castShadow=false;
  for(const y of [-h*.39,h*.39])box(w-.01,.008,.006,goldInk,0,y,d/2+.008,g);
  // Thin signatures catch grazing light along the top of the paper block.
  for(let n=0;n<3;n++)box(w-.05,.004,d-.08,pageLines,0,h/2-.013-n*.006,-.018,g);
  const titleFace=mesh(new T.PlaneGeometry(d-.024,h-.015),material('#ffffff',.76,.01,{map:coverTexture(book.title,color)}),g);titleFace.rotation.y=Math.PI/2;titleFace.position.x=w/2+.001;titleFace.castShadow=false;
  g.userData.studyBook.coverFace=titleFace;
  return g;
 }
 // Fixed slots retain each book's place when the live Library gains new entries.
 const layoutKey='luliy-study-book-layout-v2',seenKeys=new Set(),actual=[],titleKey=title=>String(title||'').trim().normalize('NFKC').toLowerCase(),linkedTitles=new Set(books.filter(book=>book?.id).map(book=>titleKey(book.title)));let stored={slots:{}};
 try{const saved=JSON.parse(localStorage.getItem(layoutKey)||'null');if(saved&&saved.slots&&typeof saved.slots==='object')stored=saved;}catch{}
 books.forEach((book,index)=>{if(!book?.title)return;const normalized=titleKey(book.title),key=book.id?'article:'+String(book.id):'physical:'+normalized;if(!normalized||seenKeys.has(key)||(!book.id&&linkedTitles.has(normalized)))return;seenKeys.add(key);if(stored.slots[key]===undefined){const previous=stored.slots['physical:'+normalized]??stored.slots[normalized];if(previous!==undefined)stored.slots[key]=previous;}actual.push({book,index,key});});
 const used=new Set();actual.slice(0,45).forEach(entry=>{const slot=Number(stored.slots[entry.key]);if(Number.isInteger(slot)&&slot>=0&&slot<45&&!used.has(slot)){entry.slot=slot;used.add(slot);}});
 const slotOrder=[3,4,5,2,6,1,7,0,8].flatMap(col=>[0,1,2,3,4].map(row=>row*9+col));
 actual.slice(0,45).forEach(entry=>{if(entry.slot!==undefined)return;const slot=slotOrder.find(candidate=>!used.has(candidate));entry.slot=slot;used.add(slot);stored.slots[entry.key]=slot;});
 function slotPosition(slot,height){const row=Math.floor(slot/9),col=slot%9;return new T.Vector3(-1.112+col*.278,shelfLevels[row]+height/2+.012,.092);}
 function saveBookLayout(){bookTargets.forEach(target=>{stored.slots[target.key]=target.slot;});try{localStorage.setItem(layoutKey,JSON.stringify(stored));}catch{}}
 function updateHome(target){const position=slotPosition(target.slot,target.height),rotation=target.object.rotation.clone();rotation.set(0,0,target.slot%9===8?-.015:0);target.home={position,rotation,parent:shelf};target.anchor.copy(position).add(shelf.position);target.anchor.z+=target.depth/2+.03;}
 actual.slice(0,45).forEach(({book,index,key,slot})=>{
  const fingerprint=hash(key),width=.218+(fingerprint%3)*.008,height=.90+(fingerprint%4)*.055,depth=.63+(fingerprint%3)*.035,object=makeBook(book,index,width,height,depth,key),target={object,id:book.id||null,title:book.title,index,key,slot,width,height,depth,anchor:new T.Vector3(),face:object.children[4],cover:book.cover||book.image||null};
  updateHome(target);object.position.copy(target.home.position);object.rotation.copy(target.home.rotation);bookTargets.push(target);
 });
 function setBookPlacement(index,slot){
  const target=bookTargets.find(entry=>entry.index===index);slot=Number(slot);if(!target||!Number.isInteger(slot)||slot<0||slot>=45)return false;
  const oldSlot=target.slot,other=bookTargets.find(entry=>entry!==target&&entry.slot===slot);target.slot=slot;updateHome(target);shelf.add(target.object);target.object.position.copy(target.home.position);target.object.rotation.copy(target.home.rotation);
  if(other){other.slot=oldSlot;updateHome(other);shelf.add(other.object);other.object.position.copy(other.home.position);other.object.rotation.copy(other.home.rotation);}
  saveBookLayout();group.updateMatrixWorld(true);onChange();return true;
 }
 saveBookLayout();
 // The camera can rotate around the furniture without revealing unfinished backs.
 group.updateMatrixWorld(true);
 return {group,bookTargets,interactionTargets,drawerContents,showArticle,articlePage,articleSheet,desk,chair,shelf,drawers,laptop,notebook,notebookLid,pen,portraitFrame,
  deskTurntablePosition:new T.Vector3(-3.93,3.588,-1.19),turntableScale:.38,
  deskBookPosition:new T.Vector3(.52,3.38,-.21),deskBookRotation:{x:0,y:0,z:Math.PI/2},
  setBookPlacement,saveBookLayout,
  bounds:{min:new T.Vector3(-5.625,0,-2.98),max:new T.Vector3(5.75,6.70,4.16)},
  dispose(){if(disposed)return;disposed=true;pendingImages.forEach(image=>{image.onload=null;image.onerror=null;});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());group.removeFromParent();}
 };
}
function portraitOverlay(T,host,src,onChange=()=>{}){
 const image=document.createElement('img');image.className='study-portrait-overlay';image.alt='';image.draggable=false;image.decoding='async';image.hidden=true;host.append(image);
 let ready=false,lastCheck=0,blocked=false;const cameraPoint=new T.Vector3(),origin=new T.Vector3(),direction=new T.Vector3(),localOrigin=new T.Vector3(),localDirection=new T.Vector3(),inverse=new WeakMap();
 const ray={far:0,set(o,d){origin.copy(o);direction.copy(d);},intersectObjects(meshes){
  for(const mesh of meshes){const box=mesh.geometry.boundingBox;if(!box)continue;const inv=inverse.get(mesh);localOrigin.copy(origin).applyMatrix4(inv);localDirection.copy(origin).add(direction).applyMatrix4(inv).sub(localOrigin);let near=-Infinity,far=Infinity;
   for(const axis of ['x','y','z']){const d=localDirection[axis],o=localOrigin[axis];if(Math.abs(d)<1e-9){if(o<box.min[axis]||o>box.max[axis]){far=-Infinity;break;}}else{const a=(box.min[axis]-o)/d,b=(box.max[axis]-o)/d;near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));}}
   if(far>=Math.max(0,near)&&Math.max(0,near)<this.far)return [mesh];
  }return [];
 }};
 image.onload=()=>{ready=true;onChange();};image.onerror=()=>{ready=false;image.hidden=true;};image.src=src||'';
 // Project all four corners: the photograph stays on the frame plane under perspective.
 function transform(points){
  const [a,b,c,d]=points,dx1=b.x-c.x,dx2=d.x-c.x,dx3=a.x-b.x+c.x-d.x,dy1=b.y-c.y,dy2=d.y-c.y,dy3=a.y-b.y+c.y-d.y,det=dx1*dy2-dx2*dy1;
  const g=Math.abs(det)>1e-8?(dx3*dy2-dx2*dy3)/det:0,h=Math.abs(det)>1e-8?(dx1*dy3-dx3*dy1)/det:0;
  return `matrix3d(${(b.x-a.x+g*b.x)/100},${(b.y-a.y+g*b.y)/100},0,${g/100},${(d.x-a.x+h*d.x)/123},${(d.y-a.y+h*d.y)/123},0,${h/123},0,0,1,0,${a.x},${a.y},0,1)`;
 }
 return {update(camera,object){
  if(!ready||!object){image.hidden=true;return;}object.updateWorldMatrix(true,false);
  const width=host.clientWidth,height=host.clientHeight;if(!width||!height){image.hidden=true;return;}
  camera.getWorldPosition(cameraPoint);const facing=new T.Vector3(0,0,1).transformDirection(object.matrixWorld),toward=cameraPoint.clone().sub(object.getWorldPosition(new T.Vector3()));
  if(facing.dot(toward)<=.05){image.hidden=true;return;}
  const corners=[[-.345,1.015],[.345,1.015],[.345,.165],[-.345,.165]].map(([x,y])=>object.localToWorld(new T.Vector3(x,y,.067)));
  const points=corners.map(p=>{const q=p.clone().project(camera);return{x:(q.x+1)*width/2,y:(1-q.y)*height/2,z:q.z};});
  if(points.some(p=>p.z<=-1||p.z>=1)){image.hidden=true;return;}
  let scene=object;while(scene.parent)scene=scene.parent;
  // Clip the DOM photograph against scene geometry on a small depth grid.
  const now=performance.now();if(now-lastCheck>50||image.hidden){
   lastCheck=now;const meshes=[];scene.traverseVisible(n=>{if(!n.isMesh)return;let parent=n;while(parent){if(parent===object)return;parent=parent.parent;}if(!n.geometry.boundingBox)n.geometry.computeBoundingBox();let inv=inverse.get(n);if(!inv){inv=n.matrixWorld.clone();inverse.set(n,inv);}inv.copy(n.matrixWorld).invert();meshes.push(n);});
   let path='',visibleCells=0;const cols=10,rows=12;
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const u=(col+.5)/cols,v=(row+.5)/rows,p=object.localToWorld(new T.Vector3(-.345+u*.69,1.015-v*.85,.067)),direction=p.sub(cameraPoint),distance=direction.length();ray.set(cameraPoint,direction.normalize());ray.near=0;ray.far=distance-.015;
    if(ray.intersectObjects(meshes,false).length)continue;
    const x=col*100/cols,y=row*123/rows,w=100/cols,h=123/rows;path+=`M${x},${y}h${w}v${h}h-${w}z`;visibleCells++;
   }
   blocked=!visibleCells;image.style.clipPath=blocked?'':`path('${path}')`;
  }
  image.hidden=blocked;if(!blocked)image.style.transform=transform(points);
 },destroy(){image.onload=image.onerror=null;image.remove();}};
}

window.LuliyStudyFurniture={create,portraitOverlay};
})();

(function(){
'use strict';
function create(T,furniture,{lang='zh',onChange=()=>{}}={}){
 const resources=[],images=[],root=new T.Group();root.name='study-decoration';furniture.group.add(root);let alive=true,coverId='',lampOn=true;
 const L=(zh,en,ja)=>lang==='en'?en:lang==='ja'?ja:zh;
 const mat=(color,roughness=.6,metalness=0,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness,metalness,...extra});resources.push(m);return m;};
 const leather=mat('#28211c',.82),edge=mat('#7e6247',.76),brass=mat('#aa8a53',.28,.76),dark=mat('#252622',.44,.4),paper=mat('#e1d4bc',.9);
 function mesh(g,m,parent=root){resources.push(g);const o=new T.Mesh(g,m);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,m,x,y,z,parent=root){const o=mesh(new T.BoxGeometry(w,h,d),m,parent);o.position.set(x,y,z);return o;}
 function cylinder(r,h,m,x,y,z,parent=root){const o=mesh(new T.CylinderGeometry(r,r,h,24),m,parent);o.position.set(x,y,z);return o;}
 function rod(a,b,r,m,parent=root){a=new T.Vector3(...a);b=new T.Vector3(...b);const delta=b.clone().sub(a),o=mesh(new T.CylinderGeometry(r,r,delta.length(),16),m,parent);o.position.copy(a.add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
 // A restrained writing surface connects the computer, notebook and pen.
 const pad=box(4.34,.024,1.86,leather,.52,3.269,-1.18);pad.name='study-desk-pad';
 for(const z of [-2.07,-.29])box(4.21,.002,.009,edge,.52,3.283,z);
 for(const x of [-1.58,2.62])box(.009,.002,1.78,edge,x,3.283,-1.18);
 for(let i=0;i<50;i++)for(const z of [-2.06,-.30])box(.028,.002,.003,edge,-1.53+i*.082,3.285,z);
 // The pen rests above the leather instead of hovering over the desk.
 const penRest=new T.Group();penRest.name='study-pen-rest';penRest.position.set(2.32,3.28,-.30);penRest.rotation.y=-.35;root.add(penRest);
 box(.33,.025,.18,dark,0,.012,0,penRest);for(const x of [-.12,.12])box(.025,.034,.14,brass,x,.039,0,penRest);furniture.pen.position.y=3.371;furniture.pen.rotation.z=.018;
 // A hinged task lamp; its warm light follows the adjustable head.
 const lamp=new T.Group();lamp.name='study-desk-lamp';lamp.position.set(2.35,3.275,-2.21);root.add(lamp);
 cylinder(.27,.045,dark,0,.023,0,lamp);cylinder(.22,.014,brass,0,.053,0,lamp);
 rod([0,.06,0],[-.12,.75,-.02],.026,dark,lamp);cylinder(.063,.05,brass,-.12,.76,-.02,lamp).rotation.z=Math.PI/2;
 rod([-.12,.75,-.02],[-.53,1.18,.05],.026,dark,lamp);
 const head=new T.Group();head.name='study-lamp-head';head.position.set(-.53,1.18,.05);head.rotation.z=-.20;lamp.add(head);
 const shade=mesh(new T.CylinderGeometry(.12,.28,.23,32,1,true),mat('#34382f',.38,.35,{side:T.DoubleSide}),head);shade.position.y=-.06;
 const bulb=cylinder(.21,.008,mat('#ffddb0',.4,0,{emissive:'#ffb969',emissiveIntensity:.7}),0,-.17,0,head);
 const light=new T.PointLight(0xffd2a0,2.8,3.2,2);light.position.set(0,-.23,0);head.add(light);
 const lampTarget={object:head,kind:'lamp',title:L('台灯 · 点击开关，拖动灯头','Lamp · click to switch, drag to aim','ライト・クリックで切替、ドラッグで調整')};furniture.interactionTargets.push(lampTarget);
 function setLamp(value){lampOn=!!value;light.intensity=lampOn?2.8:0;bulb.material.emissiveIntensity=lampOn?.7:0;onChange();}
 function aim(dx,dy){head.rotation.z=Math.max(-.65,Math.min(.5,head.rotation.z+dx*.008));head.rotation.x=Math.max(-.5,Math.min(.5,head.rotation.x+dy*.008));onChange();}
 // An album sleeve lives beside the turntable and follows the selected music.
 const sleeve=new T.Group();sleeve.name='study-current-sleeve';sleeve.position.set(-2.56,3.29,-2.17);sleeve.rotation.set(-.12,.12,-.025);root.add(sleeve);
 box(.90,.92,.026,mat('#605445',.85),0,.46,0,sleeve);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const context=canvas.getContext('2d'),map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;resources.push(map);
 const cover=mesh(new T.PlaneGeometry(.87,.89),mat('#ffffff',.82,0,{map}),sleeve);cover.position.set(0,.46,.015);cover.castShadow=false;
 const sleeveTarget={object:sleeve,kind:'record',title:L('当前唱片 · 曲目与听歌笔记','Current record · music and notes','レコード・曲とメモ')};furniture.interactionTargets.push(sleeveTarget);
 function updateRecord(state){if(!state)return;const id=state.track||'empty';if(id===coverId)return;coverId=id;context.fillStyle='#3e3931';context.fillRect(0,0,512,512);context.fillStyle='#d9c8a6';context.font='24px Georgia';context.fillText('LULIY / RECORDS',32,56);context.font='30px serif';context.fillText(state.name||L('选择一张唱片','Choose a record','レコードを選ぶ'),32,430,448);map.needsUpdate=true;sleeveTarget.title=state.name||sleeveTarget.title;
  if(state.cover){const image=new Image();images.push(image);image.onload=()=>{if(!alive||coverId!==id)return;context.drawImage(image,0,0,512,512);map.needsUpdate=true;onChange();};image.src=state.cover;}onChange();
 }
 // Fill only genuinely empty book slots, leaving the published books reachable.
 const occupied=new Set(furniture.bookTargets.map(b=>b.slot)),levels=[.53,1.70,2.88,4.06,5.24];
 for(let row=0;row<5;row++){
  let start=-1;for(let col=0;col<=6;col++)if([0,1,2].every(n=>!occupied.has(row*9+col+n))){start=col;break;}if(start<0)continue;
  const stack=new T.Group();stack.name='study-horizontal-books-'+row;stack.position.set(-1.112+(start+1)*.278,levels[row]+.018,.12);furniture.shelf.add(stack);
  for(let n=0;n<2+(row%2);n++){const book=new T.Group();book.rotation.y=(n-.8)*.035;stack.add(book);const c=mat(['#71614d','#4a5852','#686158'][n%3],.87);box(.64,.09,.64,paper,0,.053+n*.13,0,book);for(const y of [.005,.106])box(.68,.017,.68,c,0,y+n*.13,0,book);box(.68,.105,.025,c,0,.055+n*.13,.333,book);for(let k=0;k<3;k++)box(.57,.002,.005,edge,0,.04+n*.13+k*.016,.323,book);}
  box(.045,.42,.46,brass,-.43,.21,0,stack);box(.27,.028,.46,brass,-.32,.014,0,stack);
 }
 // Fine wear marks and upholstery compression, deliberately visible only nearby.
 for(let n=0;n<9;n++)box(.06+n*.013,.001,.003,edge,-4.8+n*.38,3.251,.16);
 for(const z of [-.15,.12,.39]){const crease=box(.53,.004,.007,mat('#251d19',.92),0,2.045,z,furniture.chair);crease.rotation.y=.03;}
 for(const entry of furniture.bookTargets){if(entry.slot%9===8){entry.home.rotation.z=-.035;entry.object.rotation.z=-.035;}}
 return {lamp,head,sleeve,getLamp:()=>lampOn,setLamp,aim,updateRecord,dispose(){alive=false;images.forEach(i=>i.onload=null);root.removeFromParent();resources.forEach(r=>r.dispose());}};
}
window.LuliyStudyDecor={create};
})();

(function(){
'use strict';
window.LuliyStudyInterior={create(T){
 const group=new T.Group();group.name='study-interior';const textures=[];
 const material=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
 const wood=material(0x493022,.72),wall=material(0x82776a),trim=material(0x433124),cloth=material(0xbcb3a4,.98),pillow=material(0xd8d0c2,1);
 function box(name,w,h,d,x,y,z,mat,parent=group){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.name=name;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function texture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);return t;}
 let seed=19;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const plaster=texture(256,256,(c,w,h)=>{c.fillStyle='#ddd8cf';c.fillRect(0,0,w,h);for(let i=0;i<9000;i++){c.fillStyle=random()>.5?'rgba(255,255,255,.025)':'rgba(60,48,35,.025)';c.fillRect(random()*w,random()*h,1,1);}});wall.map=plaster;
 const fabric=texture(256,256,(c,w,h)=>{c.fillStyle='#e0d9cd';c.fillRect(0,0,w,h);for(let i=0;i<w;i+=2){c.fillStyle=i%4?'#d9d1c4':'#e5ded3';c.fillRect(i,0,1,h);}for(let i=0;i<h;i+=3){c.fillStyle='rgba(85,70,53,.05)';c.fillRect(0,i,w,1);}});cloth.map=fabric;pillow.map=fabric;
 const grain=texture(512,512,(c,w,h)=>{c.fillStyle='#513b2e';c.fillRect(0,0,w,h);for(let i=0;i<1700;i++){const y=random()*h;c.strokeStyle='rgba('+(random()>.5?'20,10,5':'165,121,78')+','+(.04+random()*.13)+')';c.beginPath();c.moveTo(0,y);c.bezierCurveTo(w*.3,y+random()*5,w*.7,y-4,w,y+random()*6);c.stroke();}});grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(3,1);wood.map=grain;
 for(let i=0;i<24;i++)box('walnut-floor-plank',.66,.08,14,-6.45+i*.67,-.055,3.2,wood);
 box('study-back-wall',16.2,8,.16,1.2,4,-3.88,wall);box('study-window-wall',.16,8,14,-6.83,4,3.05,wall);
 box('back-skirt',16.2,.17,.09,1.2,.12,-3.76,trim);box('side-skirt',.09,.17,14,-6.72,.12,3.05,trim);
 const sky=texture(768,512,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#a4aebb');g.addColorStop(.5,'#d3b093');g.addColorStop(1,'#edc18e');c.fillStyle=g;c.fillRect(0,0,w,h);c.filter='blur(5px)';c.fillStyle='#f6d5a1';c.beginPath();c.arc(w*.35,h*.6,28,0,Math.PI*2);c.fill();for(let i=0;i<45;i++){const x=i*w/45,hh=30+random()*85;c.fillStyle=i%2?'#8b8580':'#96918b';c.fillRect(x,h*.84-hh,w/40,hh+h*.16);}c.fillStyle='#6f786b';for(let i=0;i<25;i++){c.beginPath();c.ellipse(random()*w,h*.96,25+random()*30,22+random()*45,0,0,Math.PI*2);c.fill();}c.filter='none';});
 const windowMat=new T.MeshBasicMaterial({map:sky});const win=new T.Mesh(new T.PlaneGeometry(5.1,4.7),windowMat);win.name='study-sunset-window';win.rotation.y=Math.PI/2;win.position.set(-6.73,4.5,-.35);group.add(win);
 for(const z of [-2.96,2.26])box('window-frame',.15,4.9,.11,-6.61,4.5,z,trim);for(const y of [2.1,6.9])box('window-frame',.15,.12,5.3,-6.61,y,-.35,trim);box('window-mullion',.15,4.8,.055,-6.60,4.5,-.35,trim);box('window-sill',.38,.12,5.5,-6.5,2.08,-.35,wood);
 const rugMap=texture(512,512,(c,w,h)=>{c.fillStyle='#786d5f';c.fillRect(0,0,w,h);for(let i=0;i<18000;i++){c.fillStyle=random()>.5?'rgba(230,221,199,.08)':'rgba(33,25,20,.09)';c.fillRect(random()*w,random()*h,1,2);}c.strokeStyle='#928472';c.lineWidth=4;c.strokeRect(13,13,w-26,h-26);});const rugMat=material(0xffffff);rugMat.map=rugMap;box('study-woven-rug',9,.035,6.4,-.5,.013,2.05,rugMat);
 const bed=new T.Group();bed.name='study-bed';bed.position.set(6.65,0,1.75);group.add(bed);
 box('bed-walnut-base',3,.32,5.5,0,.32,0,wood,bed);for(const x of [-1.2,1.2])for(const z of [-2.35,2.35])box('bed-foot',.18,.4,.18,x,.18,z,wood,bed);
 box('bed-headboard',3.15,1.65,.16,0,1.03,-2.66,wood,bed);box('bed-mattress',2.88,.37,5.22,0,.65,0,pillow,bed);box('bed-duvet',2.96,.18,4.16,0,.91,.52,cloth,bed);
 for(const x of [-.73,.73]){const p=new T.Mesh(new T.SphereGeometry(1,16,10),pillow);p.name='bed-pillow';p.scale.set(.64,.17,.48);p.position.set(x,.99,-1.9);p.castShadow=true;bed.add(p);}
 const throwMat=material(0x766e61);box('bed-folded-throw',2.96,.055,1.08,0,1.02,1.73,throwMat,bed);for(let i=0;i<7;i++)box('duvet-soft-fold',.025,.022,3.6,-1.2+i*.4,1.011,.48,cloth,bed);
 box('bedside-table',.8,.09,.78,4.68,1.08,-.25,wood);box('bedside-pedestal',.5,1.05,.5,4.68,.54,-.25,wood);
 const lampMat=material(0xd4b68c);box('bedside-lamp',.4,.38,.4,4.68,1.43,-.25,lampMat);const bedside=new T.PointLight(0xffc583,.7,4,2);bedside.position.set(4.68,1.6,-.25);group.add(bedside);
 const glow=new T.PointLight(0xffd2a0,1.5,9,2);glow.position.set(4.6,5.4,-3.48);group.add(glow);
 const windowLight=new T.DirectionalLight(0xffd1a0,2.1);windowLight.position.set(-6,7,-.6);windowLight.target.position.set(1,0,3);group.add(windowLight,windowLight.target);
 return {group,bed,setHover(v){bedside.intensity=v?1.6:.7;},setLighting(night){windowLight.intensity=night?.40:1.5;glow.intensity=night?1.4:1.2;},dispose(){textures.forEach(t=>t.dispose());group.traverse(n=>{n.geometry?.dispose();n.material?.dispose();});group.removeFromParent();}};
}};
})();

/* The study's object controls share one accessible, quietly styled panel. */
(function(){
'use strict';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='luliy-study-drawer-v1',prefsKey='luliy-study-preferences-v1';
const read=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||'null');return value&&typeof value==='object'?value:fallback;}catch(e){return fallback;}};
const persist=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}};
const shapes={close:'<path d="m6 6 12 12M18 6 6 18"/>',left:'<path d="m14 5-7 7 7 7"/>',right:'<path d="m10 5 7 7-7 7"/>',check:'<path d="m5 12 4 4L19 6"/>',book:'<path d="M4 4h7v16H4zM13 4h7v16h-7z"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',play:'<path d="m9 5 10 7-10 7z"/>',pause:'<path d="M9 5v14M15 5v14"/>',return:'<path d="M4 8h9a6 6 0 0 1 0 12M4 8l4-4M4 8l4 4"/>',trash:'<path d="M4 6h16M9 6V3h6v3M7 6l1 15h8l1-15M10 10v7M14 10v7"/>'};
const icon=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(shapes[name]||shapes.book)+'</svg>';
function create(host,options={}){
 const {lang='zh',projectCovers={},records,renderContent=null,onClose=()=>{},onOpen=()=>{},onArticle=()=>{},onBook=()=>{},onSelectTrack=()=>{},onReturnBook=()=>{},onOrganize=()=>{},onCamera=()=>{},onLighting=()=>{},onPreferences=()=>{},onNote=()=>{}}=options;
 const L=(zh,en,ja)=>lang==='en'?en:lang==='ja'?(ja||en):zh;
 let projects=options.projects||[],articles=options.articles||[],books=options.books||[],deskBook=null,audio={},kind='',payload=null,page=0,contentCleanup=()=>{},filters={},previousFocus=null,live=true,organizing=false;
 const prefs={lighting:'dusk',timerMinutes:0,sfx:false,duckMusic:false,...read(prefsKey,{})};
 if(!['dusk','night'].includes(prefs.lighting))prefs.lighting='dusk';
 if(![0,15,30,60].includes(Number(prefs.timerMinutes)))prefs.timerMinutes=0;
 prefs.sfx=!!prefs.sfx;prefs.duckMusic=!!prefs.duckMusic;
 const stored=read(storageKey,{}),drawer={bookmarks:Array.isArray(stored.bookmarks)?stored.bookmarks:[],excerpts:Array.isArray(stored.excerpts)?stored.excerpts:[],notes:typeof stored.notes==='string'?stored.notes:''};
 drawer.bookmarks=drawer.bookmarks.filter(item=>item&&item.id).slice(0,100);drawer.excerpts=drawer.excerpts.filter(item=>item&&item.id&&typeof item.text==='string').slice(0,100);
 const layer=document.createElement('div');layer.className='study-panels';layer.hidden=true;
 layer.innerHTML='<div class="study-panels-scrim" data-sp-close></div><section class="study-panels-dialog" role="dialog" aria-modal="true" tabindex="-1"><header class="study-panels-head"><div><span class="study-panels-kicker"></span><h2 class="study-panels-title"></h2></div><button type="button" class="study-panels-icon" data-sp-close aria-label="'+escape(L('关闭','Close','閉じる'))+'">'+icon('close')+'</button></header><div class="study-panels-content"></div><p class="study-panels-status" role="status" aria-live="polite"></p></section>';
 host.append(layer);
 const dialog=layer.querySelector('.study-panels-dialog'),heading=layer.querySelector('.study-panels-title'),kicker=layer.querySelector('.study-panels-kicker'),body=layer.querySelector('.study-panels-content'),status=layer.querySelector('.study-panels-status'),abort=new AbortController(),signal=abort.signal;
 heading.id='study-panels-title-'+Math.random().toString(36).slice(2,8);dialog.setAttribute('aria-labelledby',heading.id);
 const titles={record:L('唱片与听歌笔记','Record and listening notes','レコードとメモ'),projects:L('作品','Works','作品'),articles:L('文章','Articles','記事'),playlist:L('播放列表','Playlist','再生リスト'),drawer:L('抽屉','Drawer','引き出し'),settings:L('书房设置','Study settings','書斎の設定'),books:L('书架','Bookshelf','本棚'),book:L('书籍与笔记','Book and notes','本とメモ')};
 const kickers={record:'ON THE TURNTABLE',projects:'WORKS',articles:'NOTEBOOK',playlist:'RECORDS',drawer:'PERSONAL NOTES',settings:'THE STUDY',books:'LIBRARY',book:'ON THE DESK'};
 const titleOf=item=>Array.isArray(item.title)?item.title[lang==='en'?1:lang==='ja'?2:0]||item.title[0]:item.title||'';
 const trackList=()=>typeof records?.tracks==='function'?records.tracks():Array.isArray(records)?records:window.LuliyRecords?.tracks?.()||[];
 const trackName=track=>typeof track.name==='object'?track.name[lang]||track.name.zh||track.name.en:track.name||track.title||'';
 const duration=seconds=>Number.isFinite(Number(seconds))&&Number(seconds)>0?Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0'):'—';
 const empty=text=>'<p class="study-panels-empty">'+escape(text)+'</p>';
 const rowArticle=(article,index,extra='')=>'<button type="button" class="study-panels-row" data-sp-article="'+escape(article.id)+'"><span class="study-panels-number">'+String(index+1).padStart(2,'0')+'</span><span class="study-panels-row-copy"><strong>'+escape(titleOf(article))+'</strong>'+(extra?'<small>'+extra+'</small>':'')+'</span><time>'+escape(article.date||'')+'</time></button>';
 function renderProjects(){
  if(renderContent){contentCleanup=renderContent('projects',body)||(()=>{});return;}
  page=Math.min(page,Math.max(0,Math.ceil(projects.length/4)-1));
  const shown=projects.slice(page*4,page*4+4);
  const cards=shown.map((project,index)=>{const array=Array.isArray(project),title=array?project[0]:titleOf(project),text=array?project[lang==='en'?2:lang==='ja'?3:1]:project.description||'',url=array?project[4]:project.url,cover=(array?project[5]:project.cover)||projectCovers[String(title).toLowerCase()]||'',valid=typeof url==='string'&&/^(https?:\/\/|#\/|\/)/i.test(url),tag=valid?'a':'div';return '<'+tag+' class="study-panels-project" '+(valid?'href="'+escape(url)+'"'+(/^https?:/i.test(url)?' target="_blank" rel="noopener noreferrer"':''):'')+'>'+(cover?'<img src="'+escape(cover)+'" alt="'+escape(title)+'" loading="lazy" decoding="async">':'<span class="study-panels-project-fallback">'+escape(title)+'</span>')+'<span class="study-panels-project-caption"><small>'+String(page*4+index+1).padStart(2,'0')+'</small><strong>'+escape(title)+'</strong><span>'+escape(text)+'</span></span></'+tag+'>';}).join('');
  body.innerHTML='<div class="study-panels-project-grid">'+(cards||empty(L('还没有作品。','No works yet.','作品はまだありません。')))+'</div>'+(projects.length>4?'<div class="study-panels-pagination"><button type="button" class="study-panels-icon" data-sp-page="-1" aria-label="'+escape(L('上一组作品','Previous works','前の作品'))+'" '+(page===0?'disabled':'')+'>'+icon('left')+'</button><span>'+String(page+1).padStart(2,'0')+' / '+String(Math.ceil(projects.length/4)).padStart(2,'0')+'</span><button type="button" class="study-panels-icon" data-sp-page="1" aria-label="'+escape(L('下一组作品','Next works','次の作品'))+'" '+(page>=Math.ceil(projects.length/4)-1?'disabled':'')+'>'+icon('right')+'</button></div>':'');
 }
 function renderArticles(){
  if(renderContent){contentCleanup=renderContent('articles',body,filters)||(()=>{});return;}
  const pinned=articles.filter(article=>article.pinned),normal=articles.filter(article=>!article.pinned);
  body.innerHTML=(pinned.length?'<div class="study-panels-pinned">'+pinned.map((article,i)=>rowArticle(article,i,escape(L('置顶','Pinned','固定')))).join('')+'</div>':'')+(normal.length?'<div class="study-panels-rows">'+normal.map((article,i)=>rowArticle(article,i+(pinned.length),Array.isArray(article.labels)?escape(article.labels.join(' · ')):'')).join('')+'</div>':'')||empty(L('文章正在载入。','Articles are loading.','記事を読み込み中。'));
 }
 function renderRecord(){const track=payload||{},notes=read('luliy-study-record-notes',{}),index=trackList().findIndex(t=>t.id===track.id);body.innerHTML='<div class="study-record-detail">'+(track.cover?'<img src="'+escape(track.cover)+'" alt="" decoding="async">':'')+'<h3>'+escape(trackName(track))+'</h3>'+(track.artist?'<p>'+escape(track.artist)+'</p>':'')+(track.year?'<p>'+escape(track.year)+'</p>':'')+'<p>'+duration(track.duration)+'</p>'+(index>=0?'<button class="study-panels-text-button" data-sp-track="'+index+'">'+icon('play')+L('播放这张唱片','Play this record','再生')+'</button>':'')+'<label for="study-listening-note">'+L('我的听歌笔记','My listening notes','聴いたメモ')+'</label><textarea id="study-listening-note" data-sp-record-note="'+escape(track.id||'')+'" maxlength="4000" placeholder="'+L('写下这首歌带给你的感受…','Write what this music means to you…','この曲の思い出を書いて…')+'">'+escape(notes[track.id]||'')+'</textarea><small>'+L('仅保存在这台设备。','Saved on this device.','この端末に保存。')+'</small></div>'; }
 function renderPlaylist(){
  body.innerHTML='<div class="study-panels-playlist">'+(trackList().map((track,index)=>'<button type="button" class="study-panels-row study-panels-track" data-sp-track="'+index+'"><span class="study-panels-number">'+String(index+1).padStart(2,'0')+'</span><span class="study-panels-row-copy"><strong>'+escape(trackName(track))+'</strong></span><span class="study-panels-track-state" aria-hidden="true"></span><time>'+duration(track.duration)+'</time></button>').join('')||empty(L('还没有唱片。','No records yet.','レコードはまだありません。')))+'</div>';syncAudio();
 }
 function renderBooks(){body.innerHTML='<div class="study-panels-rows">'+(books.map((book,index)=>{const available=book.available!==false&&!!book.id;return '<button type="button" class="study-panels-row" data-sp-book="'+index+'" ><span class="study-panels-number">'+String(index+1).padStart(2,'0')+'</span><span class="study-panels-row-copy"><strong>'+escape(titleOf(book))+'</strong><small>'+escape(available?L('打开阅读','Read','読む'):L('待阅读 · 添加笔记','To read · add notes','未読・メモを追加'))+'</small></span></button>';}).join('')||empty(L('书架正在整理。','The bookshelf is being arranged.','本棚を準備中。')))+'</div>';}

 function bookNoteKey(book){return String(book.title||book.name||book.id||'').trim().normalize('NFKC').toLowerCase();}
 function renderBook(){
  const book=payload||{},available=book.available!==false&&!!book.id,key=bookNoteKey(book),notes=read('luliy-study-book-notes',{});
  body.innerHTML='<div class="study-record-detail study-book-detail">'+((book.cover||book.image)?'<img src="'+escape(book.cover||book.image)+'" alt="" decoding="async">':'')+'<h3>'+escape(titleOf(book))+'</h3><p>'+escape(available?L('已发布 · 可以阅读正文','Published · read the text','公開済み・本文を読めます'):L('待阅读','To read','未読'))+'</p>'+(available?'<button type="button" class="study-panels-text-button" data-sp-article="'+escape(book.id)+'">'+escape(L('打开阅读','Read','読む'))+'</button>':'')+'<label for="study-book-note">'+L('我的读书笔记','My reading notes','読書メモ')+'</label><textarea id="study-book-note" data-sp-book-note="'+escape(key)+'" maxlength="10000" placeholder="'+L('写下想读的原因、期待，或随手记一点想法…','Write why you want to read this book, or keep a thought…','読みたい理由や思いを書いて…')+'">'+escape(notes[key]||'')+'</textarea><small>'+L('自动保存 · 仅保存在这台设备。','Saved automatically on this device.','この端末に自動保存。')+'</small><a class="study-panels-text-button" href="https://blog.luliy.me/book.html" target="_blank" rel="noopener noreferrer">'+escape(L('现有书架','Existing bookshelf','本棚'))+'</a></div>';
 }

 function renderDrawer(){
  const bookmarks=drawer.bookmarks.map((article,index)=>'<div class="study-panels-saved-row">'+rowArticle(article,index)+'<button type="button" class="study-panels-icon" data-sp-remove-bookmark="'+escape(article.id)+'" aria-label="'+escape(L('移除书签','Remove bookmark','しおりを削除'))+'">'+icon('trash')+'</button></div>').join('');
  const excerpts=drawer.excerpts.map((entry,index)=>'<div class="study-panels-excerpt"><button type="button" class="study-panels-excerpt-title" data-sp-article="'+escape(entry.id)+'">'+escape(titleOf(entry))+'</button><blockquote>'+escape(entry.text)+'</blockquote><button type="button" class="study-panels-icon" data-sp-remove-excerpt="'+index+'" aria-label="'+escape(L('移除摘录','Remove excerpt','抜粋を削除'))+'">'+icon('trash')+'</button></div>').join('');
  body.innerHTML='<section class="study-panels-drawer-section"><h3>'+escape(L('书签','Bookmarks','しおり'))+'</h3>'+(bookmarks||empty(L('尚未保存书签。','No saved bookmarks.','しおりはまだありません。')))+'</section><section class="study-panels-drawer-section"><h3>'+escape(L('摘录','Excerpts','抜粋'))+'</h3>'+(excerpts||empty(L('尚未保存摘录。','No saved excerpts.','抜粋はまだありません。')))+'</section><section class="study-panels-drawer-section"><label for="study-private-note">'+escape(L('随手记','Quick notes','メモ'))+'</label><textarea id="study-private-note" class="study-panels-notes" maxlength="20000" placeholder="'+escape(L('记下一点想法…','Write a thought…','思いついたことを…'))+'">'+escape(drawer.notes)+'</textarea><small class="study-panels-note-location">'+escape(L('仅保存在这台设备。','Saved only on this device.','この端末だけに保存。'))+'</small></section>';
 }
 function renderSettings(){
  const camera=[['overview',L('全景','Overview','全景')],['bookshelf',L('书架','Bookshelf','本棚')],['turntable',L('唱片机','Turntable','ターンテーブル')],['seated',L('坐下','Seated','座る')]];
  body.innerHTML='<section class="study-panels-setting-section"><h3>'+escape(L('视角','Views','視点'))+'</h3><div class="study-panels-view-options">'+camera.map(([id,label])=>'<button type="button" class="study-panels-text-button" data-sp-view="'+id+'">'+escape(label)+'</button>').join('')+'</div></section><section class="study-panels-setting-section"><h3>'+escape(L('灯光','Lighting','照明'))+'</h3><div class="study-panels-segmented" role="group" aria-label="'+escape(L('灯光','Lighting','照明'))+'">'+[['dusk',L('暮光','Dusk','夕暮れ')],['night',L('夜读','Night','夜の読書')]].map(([id,label])=>'<button type="button" data-sp-light="'+id+'" aria-pressed="'+(prefs.lighting===id)+'">'+escape(label)+'</button>').join('')+'</div></section><section class="study-panels-setting-section"><label class="study-panels-setting-label" for="study-reading-timer">'+icon('clock')+escape(L('阅读计时','Reading timer','読書タイマー'))+'</label><select id="study-reading-timer" data-sp-pref="timerMinutes">'+[0,15,30,60].map(minutes=>'<option value="'+minutes+'" '+(Number(prefs.timerMinutes)===minutes?'selected':'')+'>'+escape(minutes?minutes+L(' 分钟',' minutes',' 分'):L('关闭','Off','オフ'))+'</option>').join('')+'</select></section><section class="study-panels-setting-section"><label class="study-panels-switch"><span>'+escape(L('轻微翻页与抽屉声','Quiet page and drawer sounds','小さなページ・引き出し音'))+'</span><input type="checkbox" data-sp-pref="sfx" '+(prefs.sfx?'checked':'')+'></label><label class="study-panels-switch"><span>'+escape(L('阅读时降低音乐音量','Lower music while reading','読書中は音量を下げる'))+'</span><input type="checkbox" data-sp-pref="duckMusic" '+(prefs.duckMusic?'checked':'')+'></label></section><section class="study-panels-setting-section"><button type="button" class="study-panels-text-button" data-sp-organize aria-pressed="'+organizing+'">'+escape(organizing?L('完成整理','Finish arranging','整理を完了'):L('整理书架','Arrange the bookshelf','本棚を整理'))+'</button></section>';
 }
 function render(){contentCleanup();contentCleanup=()=>{};status.textContent='';heading.textContent=titles[kind]||titles.settings;kicker.textContent=kickers[kind]||'';layer.dataset.kind=kind;({record:renderRecord,projects:renderProjects,articles:renderArticles,playlist:renderPlaylist,books:renderBooks,book:renderBook,drawer:renderDrawer,settings:renderSettings}[kind]||renderSettings)();}
 function open(next,data){if(!live)return;const wasOpen=!layer.hidden;if(!wasOpen)previousFocus=document.activeElement;kind=next;payload=data||null;page=0;filters={};render();layer.hidden=false;host.classList.add('study-panel-open');dialog.scrollTop=0;requestAnimationFrame(()=>{if(live&&!layer.hidden)dialog.focus({preventScroll:true});});onOpen(kind,payload);}
 function close({restoreFocus=true}={}){if(layer.hidden)return;const previous=kind;layer.hidden=true;contentCleanup();contentCleanup=()=>{};host.classList.remove('study-panel-open');kind='';payload=null;if(restoreFocus&&previousFocus?.isConnected)previousFocus.focus({preventScroll:true});onClose(previous);}
 function preferences(){persist(prefsKey,prefs);onPreferences({...prefs});}
 function saveDrawer(){persist(storageKey,drawer);}
 function changedBookmarks(){document.dispatchEvent(new CustomEvent('luliy:study-bookmarks-changed'));}
 function hasBookmark(id){return drawer.bookmarks.some(item=>item.id===String(id));}
 function toggleBookmark(article){if(!article?.id)return false;if(hasBookmark(article.id)){drawer.bookmarks=drawer.bookmarks.filter(item=>item.id!==String(article.id));saveDrawer();changedBookmarks();if(kind==='drawer')renderDrawer();return false;}bookmark(article);return true;}
 function bookmark(article){if(!article?.id)return false;const item={id:String(article.id),title:titleOf(article),date:article.date||''};const index=drawer.bookmarks.findIndex(entry=>entry.id===item.id);if(index<0)drawer.bookmarks.unshift(item);else drawer.bookmarks[index]=item;drawer.bookmarks=drawer.bookmarks.slice(0,100);saveDrawer();changedBookmarks();if(kind==='drawer')renderDrawer();return true;}
 function saveExcerpt(article,text){if(!article?.id||!String(text||'').trim())return false;const content=String(text).trim().slice(0,6000),entry={id:String(article.id),title:titleOf(article),text:content,date:article.date||''};if(!drawer.excerpts.some(item=>item.id===entry.id&&item.text===entry.text))drawer.excerpts.unshift(entry);drawer.excerpts=drawer.excerpts.slice(0,100);bookmark(article);saveDrawer();changedBookmarks();if(kind==='drawer')renderDrawer();return true;}
 function syncAudio(){if(kind!=='playlist')return;body.querySelectorAll('[data-sp-track]').forEach(row=>{const selected=Number(row.dataset.spTrack)===audio.index;row.classList.toggle('is-current',selected);row.setAttribute('aria-current',selected?'true':'false');const marker=row.querySelector('.study-panels-track-state');marker.innerHTML=selected?icon(audio.playing?'pause':'play'):'';if(selected){const time=row.querySelector('time');if(audio.duration)time.textContent=duration(audio.duration);}});}
 layer.addEventListener('click',event=>{
  if(event.target.closest('[data-sp-close]')){close();return;}
  const link=event.target.closest('a[href]');if(link&&['articles','projects'].includes(kind)){const raw=link.getAttribute('href');if(raw.startsWith('#/posts')){event.preventDefault();const params=new URL(raw.slice(1),'https://luliy.local').searchParams;filters={year:params.get('year')||'',tag:params.get('tag')||''};render();return;}if(raw.startsWith('#/article/')){event.preventDefault();const id=raw.split('/article/')[1].split('?')[0],article=articles.find(a=>a.id===id)||{id,title:link.querySelector('strong')?.textContent||link.textContent.trim()};close({restoreFocus:false});onArticle(article);return;}}
  const target=event.target.closest('button');if(!target)return;
  if(target.hasAttribute('data-sp-page')){page+=Number(target.dataset.spPage);renderProjects();return;}
  if(target.hasAttribute('data-sp-track')){onSelectTrack(Number(target.dataset.spTrack));return;}
  if(target.hasAttribute('data-sp-article')){const id=target.dataset.spArticle,article=[...articles,...books,...drawer.bookmarks,...drawer.excerpts].find(item=>String(item.id)===id)||{id,title:target.textContent.trim()};close({restoreFocus:false});onArticle(article);return;}
  if(target.hasAttribute('data-sp-book')){const book=books[Number(target.dataset.spBook)];if(book){close({restoreFocus:false});onBook(book);}return;}
  if(target.hasAttribute('data-sp-return')){const book=kind==='books'?deskBook:payload;close();onReturnBook(book);return;}
  if(target.hasAttribute('data-sp-view')){const view=target.dataset.spView;close();onCamera(view);return;}
  if(target.hasAttribute('data-sp-light')){prefs.lighting=target.dataset.spLight;preferences();onLighting(prefs.lighting);renderSettings();return;}
  if(target.hasAttribute('data-sp-organize')){organizing=!organizing;close();onOrganize(organizing);return;}
  if(target.hasAttribute('data-sp-remove-bookmark')){drawer.bookmarks=drawer.bookmarks.filter(item=>item.id!==target.dataset.spRemoveBookmark);saveDrawer();changedBookmarks();renderDrawer();return;}
  if(target.hasAttribute('data-sp-remove-excerpt')){drawer.excerpts.splice(Number(target.dataset.spRemoveExcerpt),1);saveDrawer();renderDrawer();}
 },{signal});
 layer.addEventListener('change',event=>{const field=event.target.closest('[data-sp-pref]');if(!field)return;const key=field.dataset.spPref;prefs[key]=field.type==='checkbox'?field.checked:Number(field.value);preferences();},{signal});
 layer.addEventListener('input',event=>{if(event.target.hasAttribute('data-sp-book-note')){const notes=read('luliy-study-book-notes',{});notes[event.target.dataset.spBookNote]=event.target.value;persist('luliy-study-book-notes',notes);return;}if(event.target.hasAttribute('data-sp-record-note')){const notes=read('luliy-study-record-notes',{});notes[event.target.dataset.spRecordNote]=event.target.value;persist('luliy-study-record-notes',notes);return;}if(event.target.matches('.study-panels-notes')){drawer.notes=event.target.value;saveDrawer();onNote(drawer.notes);}},{signal});
 layer.addEventListener('pointerdown',event=>event.stopPropagation(),{signal});
 layer.addEventListener('wheel',event=>{event.stopPropagation();if(kind!=='projects'||projects.length<=4)return;if(Math.abs(event.deltaX)>Math.abs(event.deltaY)&&Math.abs(event.deltaX)>24){event.preventDefault();const now=performance.now();if(now-(layer._lastPage||0)>320){layer._lastPage=now;page=Math.max(0,Math.min(Math.ceil(projects.length/4)-1,page+(event.deltaX>0?1:-1)));renderProjects();}}},{passive:false,signal});
 document.addEventListener('keydown',event=>{if(layer.hidden||document.querySelector('dialog[open]'))return;if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}if(event.key==='Tab'){const focusable=[...dialog.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]')].filter(element=>!element.hidden&&element.getClientRects().length);const first=focusable[0],last=focusable[focusable.length-1];if(!first){event.preventDefault();dialog.focus();}else if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===dialog)){event.preventDefault();first.focus();}}},{capture:true,signal});
 document.addEventListener('luliy:study-bookmark',event=>bookmark(event.detail?.article||event.detail),{signal});
 document.addEventListener('luliy:study-excerpt',event=>saveExcerpt(event.detail?.article,event.detail?.text),{signal});
 return{open,close,isOpen:()=>!layer.hidden,getKind:()=>kind,getPreferences:()=>({...prefs}),hasBookmark,toggleBookmark,getDrawer:()=>({bookmarks:drawer.bookmarks.map(item=>({...item})),excerpts:drawer.excerpts.map(item=>({...item})),notes:drawer.notes}),bookmark,saveExcerpt,updateAudio(next){audio=next||{};syncAudio();},updateContent(content={}){if(content.projects)projects=content.projects;if(content.articles)articles=content.articles;if(content.books)books=content.books;if(Object.prototype.hasOwnProperty.call(content,'deskBook'))deskBook=content.deskBook;if(!layer.hidden)render();},setOrganizing(value){organizing=!!value;if(kind==='settings')renderSettings();},destroy(){if(!live)return;close();contentCleanup();live=false;abort.abort();layer.remove();}};
}
window.LuliyStudyPanels={create};
})();

/* The same article loader and reading preferences, in a scrollable study window. */
(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(host,{entry,lang='zh',href=r=>'#'+r,onClose=()=>{},onBookmark=()=>{},isBookmarked=()=>false,onExcerpt=()=>{},onProgress=()=>{},notify=()=>{}}={}){
 const L=(zh,en,ja)=>lang==='en'?en:lang==='ja'?(ja||en):zh;
 const node=document.createElement('section');node.className='study-reader';node.setAttribute('role','dialog');node.setAttribute('aria-modal','true');node.setAttribute('aria-label',entry.title);
 const tocId='study-reader-toc';
 node.innerHTML=`<header class="study-reader-bar"><button type="button" data-study-read="close" aria-label="${L('回到书桌','Return to desk','机に戻る')}">←</button><span>${esc(entry.title)}</span><button type="button" data-study-read="bookmark" class="study-reader-bookmark" aria-label="${L('加入书签','Add bookmark','しおりを追加')}"></button><button type="button" data-study-read="excerpt" aria-label="${L('收下选中文字','Save selected text','選択した文章を保存')}">✎</button></header><div class="study-reader-scroll" tabindex="0"><div class="source-reading"><h1>${esc(entry.title)}</h1><div class="source-meta"><time>${esc(entry.date||'')}</time><span class="study-reader-metrics"></span><button type="button" data-reader="refresh" aria-label="${L('刷新正文','Refresh text','本文を更新')}">↻</button><a href="${esc(entry.url||'https://github.com/luliy6/luliy6.github.io/issues/'+String(entry.id).slice(1))}" target="_blank" rel="noopener noreferrer">${L('博客原文','Original post','元の記事')}</a></div><div class="source-layout"><article class="source-body" data-loading="true"><p>${L('正在载入正文…','Loading the text…','本文を読み込み中…')}</p></article><aside class="source-toc" id="${tocId}"><p><span>${L('目录','Contents','目次')}</span><button type="button" class="reader-toc-close" aria-label="${L('关闭目录','Close contents','目次を閉じる')}">×</button></p><nav></nav></aside></div></div></div><button type="button" class="study-reader-toc-toggle" aria-controls="${tocId}" aria-expanded="false" aria-label="${L('打开文章目录','Open article contents','目次を開く')}">☰</button><button type="button" class="study-reader-top" aria-label="${L('回到顶部','Back to top','先頭へ')}"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20"/><circle class="study-reader-ring" cx="22" cy="22" r="20"/></svg><span>↑</span></button>`;
 const scrim=document.createElement('div');scrim.className='study-reader-scrim';host.append(scrim,node);const scroller=node.querySelector('.study-reader-scroll'),body=node.querySelector('.source-body'),toc=node.querySelector('.source-toc'),nav=toc.querySelector('nav'),toggle=node.querySelector('.study-reader-toc-toggle'),top=node.querySelector('.study-reader-top'),ring=node.querySelector('.study-reader-ring');
 node.append(toc);
 const outsideY=scrollY,previousBody={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};document.body.style.position='fixed';document.body.style.top=-outsideY+'px';document.body.style.width='100%';document.body.style.overflow='hidden';
 const abort=new AbortController(),signal=abort.signal,previous=document.activeElement;let live=true,tools=()=>{},raf=0,resizeObserver=null,headings=[],links=[],busy=false;
 const circumference=2*Math.PI*20;ring.style.strokeDasharray=circumference;ring.style.strokeDashoffset=circumference;
 const behavior=()=>matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth';
 function closeToc(){toc.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}
 function update(){raf=0;if(!live)return;const total=scroller.scrollHeight-scroller.clientHeight,progress=total>0?Math.max(0,Math.min(1,scroller.scrollTop/total)):0;ring.style.strokeDashoffset=circumference*(1-progress);top.classList.toggle('is-visible',scroller.scrollTop>180);let current=0;const origin=scroller.getBoundingClientRect().top;headings.forEach((h,i)=>{if(h.getBoundingClientRect().top-origin<140)current=i;});links.forEach((link,i)=>{link.classList.toggle('current',i===current);if(i===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});onProgress(entry,scroller.scrollTop,progress);}
 function request(){if(!raf&&live)raf=requestAnimationFrame(update);}
 function guide(){headings=[...body.querySelectorAll('h1,h2,h3,h4,h5,h6')];nav.replaceChildren();links=headings.map((heading,i)=>{heading.id=heading.id||'study-heading-'+i;const b=document.createElement('button');b.type='button';b.className='reader-toc-item level-'+heading.tagName.toLowerCase();b.textContent=heading.textContent;b.addEventListener('click',()=>scroller.scrollTo({top:heading.getBoundingClientRect().top-scroller.getBoundingClientRect().top+scroller.scrollTop-40,behavior:behavior()}),{signal});nav.append(b);return b;});if(!links.length){const p=document.createElement('p');p.textContent=L('本文暂无章节','No sections in this article','この記事に見出しはありません');nav.append(p);}resizeObserver?.disconnect();resizeObserver=new ResizeObserver(request);resizeObserver.observe(body);request();}
 async function load(force=false){if(busy)return;busy=true;tools();body.dataset.loading='true';try{const fragment=await window.LuliyReader.load(entry,force);if(!live)return;body.replaceChildren(fragment);const first=body.querySelector(':scope > h1');if(first?.textContent.trim().replace(/\s/g,'')===entry.title.trim().replace(/\s/g,''))first.remove();const text=body.textContent||'',cjk=(text.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g)||[]).length,latin=(text.match(/[A-Za-zÀ-ž]+/g)||[]).length;node.querySelector('.study-reader-metrics').textContent=L(`约 ${Math.max(1,Math.ceil(cjk/350+latin/220))} 分钟阅读`,`${Math.max(1,Math.ceil(cjk/350+latin/220))} min read`);}catch(e){if(!live)return;body.innerHTML=`<p>${L('正文暂时无法载入，请打开博客原文。','The text is unavailable. Open the original post.','本文を読み込めません。元の記事をご覧ください。')}</p><p class="reader-load-actions"><button type="button" data-study-retry>${L('重试加载','Try again','再試行')}</button><a href="${esc(entry.url||'https://blog.luliy.me/')}" target="_blank" rel="noopener noreferrer">${L('打开博客原文','Original post','元の記事')}</a></p>`;body.querySelector('[data-study-retry]')?.addEventListener('click',()=>load(true),{once:true,signal});}finally{busy=false;if(live){body.dataset.loading='false';guide();tools=window.LuliyReaderTools.mount({body,entry,lang,href,notify,scroller,toc,onRefresh:()=>load(true)});}}}
 const bookmarkButton=node.querySelector('[data-study-read="bookmark"]');
 function syncBookmark(){const marked=isBookmarked(entry.id),label=marked?L('取消书签','Remove bookmark','しおりを解除'):L('加入书签','Add bookmark','しおりを追加');bookmarkButton.setAttribute('aria-label',label);bookmarkButton.setAttribute('title',label);bookmarkButton.setAttribute('aria-pressed',String(marked));bookmarkButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"'+(marked?' fill="currentColor"':'')+'/>'+(!marked?'<path d="M9 10h6m-3-3v6"/>':'')+'</svg><span>'+label+'</span>';}
 syncBookmark();document.addEventListener('luliy:study-bookmarks-changed',syncBookmark,{signal});scrim.addEventListener('click',onClose,{signal});
 node.addEventListener('click',e=>{const action=e.target.closest('[data-study-read]')?.dataset.studyRead;if(action==='close')onClose();else if(action==='bookmark'){const marked=onBookmark(entry);syncBookmark();notify(marked?L('已加入书签','Bookmark saved','しおりを追加しました'):L('已取消书签','Bookmark removed','しおりを解除しました'));}else if(action==='excerpt'){const selection=getSelection(),anchor=selection?.anchorNode,focus=selection?.focusNode;if(anchor&&focus&&body.contains(anchor)&&body.contains(focus)&&selection.toString().trim()){onExcerpt(entry,selection.toString().trim());notify(L('摘录已放入抽屉','Excerpt saved to drawer','抜粋を保存しました'));}else notify(L('先选中一段正文，再收下摘录','Select some article text first','先に本文を選択してください'));}}, {signal});
 toggle.addEventListener('click',()=>{const open=!toc.classList.contains('is-open');toc.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));},{signal});toc.querySelector('.reader-toc-close').addEventListener('click',closeToc,{signal});top.addEventListener('click',()=>scroller.scrollTo({top:0,behavior:behavior()}),{signal});scroller.addEventListener('scroll',request,{passive:true,signal});body.addEventListener('load',request,{capture:true,signal});
 document.addEventListener('click',e=>{if(!toc.contains(e.target)&&!toggle.contains(e.target))closeToc();},{signal});
 node.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();if(toc.classList.contains('is-open'))closeToc();else onClose();}if(e.key==='Tab'){const focusables=[...node.querySelectorAll('button,a,input,select,[tabindex="0"]')].filter(n=>n.getClientRects().length);const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}},{signal});
 node.querySelector('[data-study-read="close"]').focus({preventScroll:true});load();
 return {node,scroller,destroy(){if(!live)return;live=false;tools();abort.abort();resizeObserver?.disconnect();cancelAnimationFrame(raf);node.remove();scrim.remove();Object.assign(document.body.style,previousBody);window.scrollTo({top:outsideY,behavior:'instant'});if(previous?.isConnected)previous.focus({preventScroll:true});}};
}
window.LuliyStudyReader={mount};
})();

(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={chair:'M6 3h12v10H6zM4 13v5h16v-5M6 18v4m12-4v4',books:'M4 4h5v16H4zM10 4h4v16h-4zM16 5l4-1 4 15-4 1z',reset:'M4 10a8 8 0 1 1 1 8M4 4v6h6',world:'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',worldExit:'M4 9h5V4M15 4v5h5M20 15h-5v5M9 20v-5H4',prev:'M6 5v14M18 5 8 12l10 7z',next:'M18 5v14M6 5l10 7-10 7z',play:'m9 5 11 7-11 7z',pause:'M9 5v14M15 5v14',playlist:'M4 5h16M4 10h12M4 15h7m5-1 6 4-6 4z',projects:'M3 4h18v12H3zM1 20h22M9 16v4m6-4v4',articles:'M5 3h12v18H5zM8 7h6M8 11h6M8 15h4m5-10 4 2-3 6',drawer:'M3 5h18v15H3zM3 12h18M9 9h6M9 16h6',settings:'M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M8 8h8v8H8z',organize:'M4 6h16M4 12h16M4 18h16m-13-15-3 3 3 3m10 6 3 3-3 3'};
paths.more='M4 12h1m6 0h1m6 0h1';paths.back='M10 5l-7 7 7 7M3 12h18';
const icon=n=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[n]+'"/></svg>';
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch(e){return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}};
function mount(host,{books=[],projects=[],projectCovers={},portraits=[],articles=[],lang='zh',theme='dark',href=r=>'#'+r,initialView=null,renderContent=null,onBook=()=>{},onReady=()=>{}}={}){
 const L=(zh,en,ja)=>lang==='en'?en:lang==='ja'?(ja||en):zh;
 const labels={chair:L('坐到书桌前','Sit at the desk','机に座る'),books:L('书架','Bookshelf','本棚'),reset:L('回到全景','Overview','全景へ'),world:L('沉浸浏览','Immersive view','没入表示'),exit:L('退出沉浸浏览','Exit immersive view','没入表示を終了'),play:L('播放','Play','再生'),pause:L('暂停','Pause','一時停止'),prev:L('上一首','Previous track','前の曲'),next:L('下一首','Next track','次の曲'),playlist:L('播放列表','Playlist','再生リスト'),projects:L('电脑 · 作品','Computer · Works','パソコン・作品'),articles:L('笔记本 · 文章','Notebook · Articles','ノート・記事'),drawer:L('依次查看三个抽屉','Browse the three drawers','三つの引き出しを順に見る'),settings:L('书房设置','Study settings','書斎の設定'),organize:L('整理书架','Arrange books','本棚を整理')};
 labels.more=L('更多','More','その他');labels.back=L('返回上一视角','Previous view','前の視点');
 const button=(name,cls='')=>'<button class="'+cls+'" data-study-action="'+name+'" type="button" aria-label="'+esc(labels[name])+'" title="'+esc(labels[name])+'">'+icon(name)+'</button>';
 host.innerHTML='<div class="study-room-stage" tabindex="0" role="region" aria-label="'+esc(L('3D 书房','3D study','3D 書斎'))+'"></div><div class="study-room-dock"><div class="study-room-tools">'+button('books','study-room-books-toggle')+button('projects')+button('articles')+button('drawer')+button('organize')+button('chair')+button('reset')+button('settings')+button('world')+button('more','study-room-more')+'</div><div class="study-room-player"><div class="study-room-track"><strong></strong><small aria-live="polite"></small></div><div class="study-room-player-actions">'+button('prev')+button('play','study-room-play')+button('next')+'</div><input class="study-room-seek" type="range" min="0" max="1" step=".001" aria-label="'+L('播放进度','Playback position','再生位置')+'"><input class="study-room-volume" type="range" min="0" max="100" step="1" aria-label="'+L('音量','Volume','音量')+'"></div></div><button type="button" class="study-overview" data-study-action="overview" aria-label="'+esc(labels.reset)+'">'+icon('reset')+'<span>'+L('全景','Overview','全景')+'</span></button><button type="button" class="study-back" data-study-action="back" aria-label="'+esc(labels.back)+'" hidden>'+icon('back')+'</button><aside class="study-onboarding" hidden role="status"><span></span><button type="button" aria-label="'+L('知道了','Got it','了解')+'">×</button></aside><div class="study-room-hover" hidden></div><output class="study-room-value" hidden></output><div class="study-room-notice" role="status" aria-live="polite" hidden></div><output class="study-room-timer" hidden></output><div class="study-room-bookmark" hidden><button type="button" data-study-action="resume" aria-label="'+L('继续桌上的书','Resume the desk book','机の本を続ける')+'">▱</button></div>';
 const stage=host.querySelector('.study-room-stage'),tip=host.querySelector('.study-room-hover'),worldButton=host.querySelector('[data-study-action="world"]'),playButton=host.querySelector('.study-room-play'),trackTitle=host.querySelector('.study-room-track strong'),trackState=host.querySelector('.study-room-track small'),volume=host.querySelector('.study-room-volume'),seek=host.querySelector('.study-room-seek'),valueOutput=host.querySelector('.study-room-value'),notice=host.querySelector('.study-room-notice'),timerOutput=host.querySelector('.study-room-timer'),bookmark=host.querySelector('.study-room-bookmark');
 let drawerFlight=null;let exchangeFocusId=null,trackPreparation=new Map();let entranceAnimation=null,entranceDistance=1.055;let interior,resting=false,restTimers=[],restVeil=null;
 let renderer,furniture,decor,deck,portraitLayer,T,scene,camera,keyLight,fillLight,rimLight,ambientLight,frame=0,live=true,visible=true,immersive=false,previousOverflow='',lastTime=0,settling=4,audioState={},unsubscribe=()=>{},resizeObserver,intersection,contextLost=false;
 const inverseCache=new WeakMap();const abort=new AbortController(),signal=abort.signal,motion=matchMedia('(prefers-reduced-motion: reduce)'),pointers=new Map();
 const defaultView={yaw:.24,pitch:.3,zoom:1,focusX:1,focusY:2.8,focusZ:.7,distance:0,mode:'overview'},stored=initialView||read('luliy-study-view',null),view={...defaultView,...stored},target={...view};
 let sitting=target.mode==='seated',chairHome=null; let drag=null,hold=0,pinchDistance=0,held=false,control=null,resumeAfterSeek=false,fitPoints=[],fitCache=null,cameraDirty=true,readyFrame=0,firstFrame=false,lastHoverHit=0,flight=null,returnView=null,closedPanelView=null,reader=null,readerOpening=0,organizing=false,selectedBook=null,bookTween=null,returnTweens=[],hoverBook=null,hoverAmount=0,hoverTarget=0,chairTween=null,drawerTween=null,drawerTweens=[],drawerStates=[false,false,false],drawerReturn=null,drawerCursor=-1,articleTween=null,notebookTween=null,drawerOpen=false,notebookOpen=false,noticeTimer=0,valueTimer=0,timerInterval=0,timerEnd=0,soundContext=null,ducked=false,lastProgressSave=0,pendingProgress=null;
 let prefs={lighting:'dusk',timerMinutes:0,sfx:false,duckMusic:false};
 const panels=window.LuliyStudyPanels.create(host,{lang,projects,projectCovers,articles,books,renderContent,records:window.LuliyRecords?.tracks()||[],href,onClose:closePanel,onOpen:openPanel,onArticle:openArticle,onBook:pickBook,onSelectTrack:index=>window.LuliyRecords?.play(index),onReturnBook:returnBook,onOrganize:setOrganizing,onCamera:name=>{panels.close();if(name==='seated')toggleChair();else moveToView(name);},onLighting:setLighting,onPreferences:applyPreferences});
 prefs={...prefs,...panels.getPreferences()};
 const cameraHistory=[],backButton=host.querySelector('.study-back'),help=host.querySelector('.study-onboarding');let helpKey='',lampDrag=null;
 host.querySelector('.study-overview').remove();backButton.remove();
 const tools=host.querySelector('.study-room-tools');tools.id='studyRoomTools';tools.hidden=true;const toolsToggle=document.createElement('button');toolsToggle.className='study-room-tools-toggle';toolsToggle.type='button';toolsToggle.setAttribute('aria-label',L('书房功能','Study controls','書斎の操作'));toolsToggle.setAttribute('aria-expanded','false');toolsToggle.setAttribute('aria-controls',tools.id);toolsToggle.innerHTML=icon('more')+'<span>'+L('书房','Room','書斎')+'</span>';tools.before(toolsToggle);toolsToggle.addEventListener('click',()=>{tools.hidden=!tools.hidden;toolsToggle.setAttribute('aria-expanded',String(!tools.hidden));},{signal});
 const primary=new Set(['articles','projects','playlist','more']);host.querySelectorAll('.study-room-tools button').forEach(b=>{b.classList.toggle('is-secondary',!primary.has(b.dataset.studyAction));b.dataset.short=b.dataset.studyAction==='articles'?L('文章','Articles','記事'):b.dataset.studyAction==='projects'?L('作品','Works','作品'):b.dataset.studyAction==='more'?labels.more:'';});
 const shortLabels={books:L('书架','Books','本棚'),projects:L('电脑','Works','作品'),articles:L('文章','Articles','記事'),drawer:L('抽屉','Drawers','引出し'),organize:L('整理','Arrange','整理'),chair:L('坐下','Sit','座る'),reset:L('全景','Overview','全景'),settings:L('设置','Settings','設定'),world:L('全屏','Screen','全画面')};tools.querySelectorAll('button').forEach(b=>{if(shortLabels[b.dataset.studyAction])b.dataset.short=shortLabels[b.dataset.studyAction];});
 const musicShortcut=document.createElement('button');musicShortcut.type='button';musicShortcut.dataset.studyAction='music';musicShortcut.dataset.short=L('音乐','Music','音楽');musicShortcut.setAttribute('aria-label',labels.playlist);musicShortcut.title=labels.playlist;musicShortcut.innerHTML=icon('playlist');host.querySelector('.study-room-tools').insertBefore(musicShortcut,host.querySelector('.study-room-more'));
 function teach(key,text){if(read('luliy-study-hint:'+key,false))return;helpKey=key;help.querySelector('span').textContent=text;help.hidden=false;}
 function learned(key){save('luliy-study-hint:'+key,true);if(helpKey===key)help.hidden=true;}
 help.querySelector('button').addEventListener('click',()=>learned(helpKey),{signal});
 function syncBack(){backButton.hidden=!cameraHistory.length&&!reader&&!panels.isOpen();}
 function goBack(){if(reader){closeReader();return;}if(panels.isOpen()){panels.close();return;}const previous=cameraHistory.pop();if(previous)fly(previous,900,false);syncBack();}
 function message(text){notice.textContent=text;notice.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.hidden=true,2400);}
 function sound(kind){if(!prefs.sfx||!live)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;soundContext=soundContext||new C();soundContext.resume().catch(()=>{});const length=kind==='drawer'?.24:.16,b=soundContext.createBuffer(1,Math.ceil(soundContext.sampleRate*length),soundContext.sampleRate),data=b.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/data.length)*.025;const source=soundContext.createBufferSource(),filter=soundContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=kind==='drawer'?480:1400;source.buffer=b;source.connect(filter);filter.connect(soundContext.destination);source.start();}catch(e){}}
 function request(){if(renderer&&scene&&live&&!contextLost&&visible&&document.visibilityState==='visible'&&!frame)frame=requestAnimationFrame(draw);}
 function resize(){if(!renderer)return;const r=(window.LuliyLayoutRect?.(stage)||stage.getBoundingClientRect());if(!r.width||!r.height)return;camera.aspect=r.width/r.height;camera.updateProjectionMatrix();const ratio=window.LuliyQuality.ratio(renderer,innerWidth<760?1.25:1.5,2200000,r.width,r.height);if(Math.abs(renderer.getPixelRatio()-ratio)>.01)renderer.setPixelRatio(ratio);renderer.setSize(r.width,r.height,false);cameraDirty=true;fitCache=null;settling=3;request();}
 function overviewDistance(pose){const focus=new T.Vector3(pose.focusX,pose.focusY,pose.focusZ),direction=new T.Vector3(Math.sin(pose.yaw)*Math.cos(pose.pitch),Math.sin(pose.pitch),Math.cos(pose.yaw)*Math.cos(pose.pitch)),right=new T.Vector3(Math.cos(pose.yaw),0,-Math.sin(pose.yaw)),up=new T.Vector3(-Math.sin(pose.yaw)*Math.sin(pose.pitch),Math.cos(pose.pitch),-Math.cos(pose.yaw)*Math.sin(pose.pitch)),tangent=Math.tan(camera.fov*Math.PI/360),margin=camera.aspect<.95?.83:.90;let distance=10;for(const point of fitPoints){const p=point.clone().sub(focus);distance=Math.max(distance,p.dot(direction)+Math.max(Math.abs(p.dot(right))/(tangent*camera.aspect*margin),Math.abs(p.dot(up))/(tangent*margin)));}return distance;}
 function updateCamera(){if(!camera||!cameraDirty)return;cameraDirty=false;const focus=new T.Vector3(view.focusX,view.focusY,view.focusZ),direction=new T.Vector3(Math.sin(view.yaw)*Math.cos(view.pitch),Math.sin(view.pitch),Math.cos(view.yaw)*Math.cos(view.pitch));if(!view.distance&&(!fitCache||fitCache.yaw!==view.yaw||fitCache.pitch!==view.pitch||fitCache.aspect!==camera.aspect))fitCache={yaw:view.yaw,pitch:view.pitch,aspect:camera.aspect,distance:overviewDistance(view)};camera.clearViewOffset();camera.position.copy(focus).addScaledVector(direction,(view.distance||fitCache.distance)/view.zoom*entranceDistance);camera.lookAt(focus);camera.updateMatrixWorld(true);}
 function captureFit(){fitPoints=[];furniture.group.updateMatrixWorld(true);furniture.group.traverse(mesh=>{if(!mesh.isMesh)return;mesh.geometry.computeBoundingBox();const b=mesh.geometry.boundingBox;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])fitPoints.push(mesh.localToWorld(new T.Vector3(x,y,z)));});if(interior){interior.bed.updateMatrixWorld(true);for(const x of [-1.6,1.6])for(const y of [0,1.9])for(const z of [-2.8,2.8])fitPoints.push(interior.bed.localToWorld(new T.Vector3(x,y,z)));}fitCache=null;cameraDirty=true;}
 function fly(pose,duration=1000,remember=true){if(remember&&pose.mode!==target.mode){cameraHistory.push({...target});if(cameraHistory.length>12)cameraHistory.shift();}syncBack();host.classList.add('is-focusing');host.dataset.view=pose.mode||'overview';if(pose.mode==='seated')sitting=true;else if(pose.mode==='overview')sitting=false;syncChairButton();if(furniture){furniture.chair.visible=true;if(pose.mode==='seated'){chairTween={object:furniture.chair,from:furniture.chair.rotation.y,to:0,fromPosition:furniture.chair.position.clone(),toPosition:new T.Vector3(-.5,0,2.25),start:performance.now()};}else if(pose.mode==='overview'&&chairHome){chairTween={object:furniture.chair,from:furniture.chair.rotation.y,to:chairHome.rotation,fromPosition:furniture.chair.position.clone(),toPosition:chairHome.position.clone(),start:performance.now()};}}if(!renderer){Object.assign(target,pose);return;}const from={...view,distance:view.distance||overviewDistance(view)},to={...target,...pose};to.distance=to.distance||overviewDistance(to);const delta=((to.yaw-from.yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;to.yaw=from.yaw+delta;Object.assign(target,to);flight={from,to,start:performance.now(),duration:motion.matches?0:duration,final:{...pose,yaw:to.yaw}};tip.hidden=true;request();}
 function moveToView(name){if(name==='overview'){fly(defaultView);return;}if(!furniture)return;const d=furniture.deskTurntablePosition,small=camera.aspect<.95;
  const presets={bookshelf:{yaw:-.06,pitch:.12,zoom:1,focusX:4.18,focusY:3.5,focusZ:-2.25,distance:small?11.8:10,mode:'bookshelf'},turntable:{yaw:-.50,pitch:.60,zoom:1,focusX:d.x,focusY:d.y+.3,focusZ:d.z,distance:small?4.5:3.3,mode:'turntable'},seated:{yaw:0,pitch:.18,zoom:1,focusX:-.5,focusY:3.6,focusZ:-1.35,distance:small?4.2:3.3,mode:'seated'},projects:{yaw:-.08,pitch:.20,zoom:1,focusX:furniture.laptop.position.x,focusY:3.95,focusZ:-1.2,distance:small?6:4.6,mode:'projects'},articles:{yaw:-.2,pitch:.67,zoom:1,focusX:1.15,focusY:3.25,focusZ:-.2,distance:small?6:4.5,mode:'articles'}};if(presets[name])fly(presets[name]);}
 function setLighting(mode){if(!keyLight)return;const day=theme==='light',night=!day&&mode==='night';scene.background.set(day?0xe5ddcd:0x51483e);interior?.setLighting(night);keyLight.color.set(night?0xffcd95:0xffdfb6);keyLight.intensity=night?1.65:2.35;ambientLight.intensity=day?1.02:night?.55:.78;fillLight.intensity=night?.48:.72;rimLight.intensity=night?.95:1.25;renderer.shadowMap.needsUpdate=true;settling=3;host.dataset.lighting=mode;request();}
 function updateDuck(){const next=!!reader&&!!prefs.duckMusic;if(next===ducked)return;ducked=next;window.LuliyRecords?.setListeningGain(next?.28:1,650);}
 function startTimer(minutes){clearInterval(timerInterval);timerEnd=Number(minutes)>0?Date.now()+Number(minutes)*60000:0;timerOutput.hidden=!timerEnd;if(!timerEnd)return;const tick=()=>{const left=Math.max(0,Math.ceil((timerEnd-Date.now())/1000));timerOutput.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');if(!left){clearInterval(timerInterval);timerEnd=0;timerOutput.hidden=true;message(L('这一段阅读时间到了。','Your reading timer has finished.','読書タイマーが終了しました。'));sound('page');}};tick();timerInterval=setInterval(tick,1000);}
 function applyPreferences(next){const previous=prefs.timerMinutes;prefs={...prefs,...next};setLighting(prefs.lighting);updateDuck();if(next.timerMinutes!==undefined&&Number(next.timerMinutes)!==Number(previous))startTimer(next.timerMinutes);}
 function drawerState(open,index=0){if(!furniture?.drawers?.[index])return;drawerStates[index]=open;drawerOpen=drawerStates.some(Boolean);const d=furniture.drawers[index];drawerTweens=drawerTweens.filter(a=>a.index!==index);drawerTweens.push({index,object:d.object,from:d.object.position.z,to:d.home.position.z+(open?1.34:0),start:performance.now()});sound('drawer');request();}
 function focusDrawer(index){cancelPending();panels.close();const open=!drawerStates[index];drawerState(open,index);if(open){if(!drawerReturn)drawerReturn={...target};const d=furniture.drawers[index];fly({yaw:0,pitch:1.12,zoom:1,focusX:d.home.position.x,focusY:2.55,focusZ:.83,distance:Math.max(3.4,1.65/(Math.tan(camera.fov*Math.PI/360)*camera.aspect)),mode:'drawer-'+index},1100);}else if(drawerReturn){fly(drawerReturn);drawerReturn=null;}}
 function notebookState(open){notebookOpen=open;const cover=furniture?.notebookLid;if(!cover)return;notebookTween={object:cover,from:cover.rotation.z,to:open?1.9:0,start:performance.now()};sound('page');request();}
 function cancelPending(){clearTimeout(readerOpening);readerOpening=0;articleTween=null;if(furniture?.articleSheet)furniture.articleSheet.rotation.z=0;}
 function openPanel(kind){if(reader)return;cancelPending();if(!returnView)returnView={...target};closedPanelView=null;if(kind==='projects')moveToView('projects');else if(kind==='articles'){moveToView('articles');notebookState(true);}else if(kind==='books')moveToView('bookshelf');host.classList.add('is-panel-open');host.dataset.panel=kind;syncBack();host.querySelectorAll('[data-study-action]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.studyAction===kind)));}
 function closePanel(){host.classList.remove('is-panel-open');delete host.dataset.panel;host.querySelectorAll('[data-study-action]').forEach(b=>b.setAttribute('aria-expanded','false'));if(notebookOpen&&!reader)notebookState(false);if(returnView&&!reader){closedPanelView={...returnView};returnView=null;}syncBack();}
 function setOrganizing(enabled){organizing=enabled===undefined?!organizing:!!enabled;panels.setOrganizing(organizing);host.classList.toggle('is-organizing',organizing);host.querySelector('[data-study-action="organize"]').setAttribute('aria-pressed',String(organizing));if(organizing){cancelPending();panels.close();returnBook();moveToView('bookshelf');message(L('整理书架','Arrange books','本棚を整理'));}request();}
 function bookKey(book){return String(book?.title||'').trim().normalize('NFKC').toLowerCase();}
 function locate(book){return furniture?.bookTargets.find(b=>book?.id&&b.id===book.id)||furniture?.bookTargets.find(b=>bookKey(b)===bookKey(book));}
 function tweenBook(entry,position,rotation,kind){if(!entry)return;returnTweens=returnTweens.filter(t=>t.entry!==entry);bookTween={entry,from:entry.object.position.clone(),to:position.clone(),fromRotation:entry.object.rotation.clone(),toRotation:entry.object.rotation.clone().set(rotation.x,rotation.y,rotation.z),start:performance.now(),duration:motion.matches?0:1150,kind};resetHover();renderer.shadowMap.needsUpdate=true;sound('page');request();}
 function selectOnDesk(entry,animate=true){if(!entry)return;selectedBook=entry;const p=furniture.deskBookPosition.clone();entry.object.parent.worldToLocal(p);const rot=furniture.deskBookRotation;if(animate)tweenBook(entry,p,rot,'pick');else{entry.object.position.copy(p);entry.object.rotation.set(rot.x,rot.y,rot.z);}save('luliy-study-desk-book',{id:entry.id,title:entry.title});bookmark.hidden=false;panels.updateContent({deskBook:books[entry.index]||entry});renderer.shadowMap.needsUpdate=true;request();}
 function returnBook(){cancelPending();if(!selectedBook)return;const entry=selectedBook;selectedBook=null;bookmark.hidden=true;save('luliy-study-desk-book',null);panels.updateContent({deskBook:null});tweenBook(entry,entry.home.position,entry.home.rotation,'return');}
 function pickBook(book){cancelPending();if(!book)return;if(book.available===false||!book.id){setOrganizing(false);panels.open('book',book);return;}setOrganizing(false);const entry=locate(book),previous=selectedBook;panels.close();if(!returnView)returnView=closedPanelView||{...target};closedPanelView=null;if(previous&&previous!==entry){returnTweens.push({entry:previous,from:previous.object.position.clone(),to:previous.home.position.clone(),fromRotation:previous.object.rotation.clone(),toRotation:previous.home.rotation.clone(),start:performance.now(),duration:motion.matches?0:950});request();}moveToView('articles');if(entry)selectOnDesk(entry);if(book.id){clearTimeout(readerOpening);readerOpening=setTimeout(()=>{readerOpening=0;if(live)openArticle(book,true);},motion.matches?0:1200);}else panels.open('book',book);}
 function closeReader(){if(!reader)return;if(pendingProgress){save('luliy-study-reading-progress:'+pendingProgress.article.id,{position:pendingProgress.position,progress:pendingProgress.progress});pendingProgress=null;}reader.destroy();reader=null;host.classList.remove('is-reading');notebookState(false);updateDuck();returnView=null;syncBack();stage.focus({preventScroll:true});sound('page');}
 function resolveArticle(entry){return [...articles,...books].find(a=>a.id===entry.id)||{...entry,issueApiUrl:'https://api.github.com/repos/luliy6/luliy6.github.io/issues/'+String(entry.id).slice(1)};}
 function openArticle(entry,fromBook=false){if(!entry?.id)return;cancelPending();entry=resolveArticle(entry);if(fromBook||!renderer){finishArticle(entry,fromBook);return;}const retained=returnView||closedPanelView||{...target};panels.close();returnView={...retained};closedPanelView=null;furniture.showArticle(entry);notebookState(true);furniture.articleSheet.rotation.z=1.2;articleTween={start:performance.now()};moveToView('articles');readerOpening=setTimeout(()=>{readerOpening=0;if(live)finishArticle(entry,true);},motion.matches?0:1450);}
 function finishArticle(entry,fromBook=false){if(!entry?.id)return;clearTimeout(readerOpening);readerOpening=0;entry=resolveArticle(entry);if(!returnView)returnView=closedPanelView||{...target};const retained={...returnView};panels.close();returnView=retained;closedPanelView=null;reader?.destroy();host.classList.add('is-reading');notebookState(true);if(!fromBook)moveToView('articles');save('luliy-study-last-article',{id:entry.id,title:entry.title});reader=window.LuliyStudyReader.mount(host,{entry,lang,href,onClose:closeReader,onBookmark:article=>panels.toggleBookmark(article),isBookmarked:id=>panels.hasBookmark(id),onExcerpt:(article,text)=>panels.saveExcerpt(article,text),onProgress:(article,position,progress)=>{pendingProgress={article,position,progress};if(Date.now()-lastProgressSave>500){lastProgressSave=Date.now();save('luliy-study-reading-progress:'+article.id,{position,progress});}},notify:message});updateDuck();sound('page');}
 function showValue(text){valueOutput.textContent=text;valueOutput.hidden=false;clearTimeout(valueTimer);valueTimer=setTimeout(()=>valueOutput.hidden=true,1100);}
 function focusRecord(){cancelPending();panels.close();if(reader)closeReader();moveToView('turntable');}
 function prepareTrack(){if(!live||resting)return Promise.resolve();const old=furniture?.drawerContents.find(item=>item.drawerIndex===1&&item.index===audioState.index);if(old&&audioState.started){if(!drawerStates[1])drawerState(true,1);scene.updateMatrixWorld(true);const destination=old.object.getWorldPosition(new T.Vector3());destination.z+=Math.max(0,furniture.drawers[1].home.position.z+1.34-furniture.drawers[1].object.position.z);deck?.setOutgoingOrigin(destination);}else deck?.setOutgoingOrigin(null);focusRecord();return new Promise(resolve=>{const timer=setTimeout(()=>{trackPreparation.delete(timer);resolve();},motion.matches?0:1000);trackPreparation.set(timer,resolve);});}
 function handleAudio(next){if(drawerFlight&&next.exchanging==='swap')drawerFlight.exchange=next.exchange;if(drawerFlight&&drawerFlight.exchange&&!next.exchanging){finishDrawerFlight();}if(next.exchanging==='swap'&&next.exchange?.id!==exchangeFocusId){exchangeFocusId=next.exchange?.id;if(target.mode!=='turntable')focusRecord();}audioState=next;if(furniture)for(const item of furniture.drawerContents){if(item.drawerIndex===1)item.object.visible=!(next.started&&!next.ejected&&item.index===next.index)&&item.object!==drawerFlight?.source;}decor?.updateRecord(next);trackTitle.textContent=next.index>=0?(next.name||next.title):L('选择一首，开始播放。','Choose a record to play.','レコードを選んで再生。');trackState.textContent=next.error?L('音频未能播放 · 点击播放重试','Audio unavailable · press play to retry','再生できません・再生ボタンで再試行'):next.exchanging?L('正在换片…','Changing records…','レコードを交換中…'):next.buffering?L('正在缓冲…','Buffering…','バッファ中…'):next.loading?L('正在加载…','Loading…','読み込み中…'):next.playing?L('正在播放','Playing','再生中'):next.index>=0?L('已暂停','Paused','一時停止'):L('唱片机 · 我的收藏','Records from my collection','私のレコード');playButton.innerHTML=icon(next.playing?'pause':'play');playButton.setAttribute('aria-label',next.error?L('重试播放','Retry playback','再試行'):next.playing?labels.pause:labels.play);playButton.dataset.error=String(!!next.error);playButton.setAttribute('aria-busy',String(!!next.loading));volume.value=String(Math.round((next.volume??.45)*100));if(document.activeElement!==seek)seek.value=next.duration?next.position/next.duration:0;seek.disabled=!!next.exchanging||!next.duration;deck?.setState(next);deck?.setProgress(next.position||0,next.duration||0);panels.updateAudio(next);settling=Math.max(settling,3);request();}
 seek.addEventListener('input',()=>{const seconds=Number(seek.value)*(audioState.duration||0);window.LuliyRecords?.seek(seconds);showValue(Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0'));},{signal});
 function syncChairButton(){const b=host.querySelector('[data-study-action="chair"]');if(!b)return;const title=sitting?L('离开书桌','Leave the desk','机から離れる'):labels.chair;b.title=title;b.setAttribute('aria-label',title);b.setAttribute('aria-pressed',String(sitting));b.dataset.short=sitting?L('离开','Leave','離れる'):L('坐下','Sit','座る');} function toggleChair(){cancelPending();panels.close();if(reader)closeReader();moveToView(sitting?'overview':'seated');sound('drawer');} function action(name){if(resting)return;if(name==='overview')name='reset';if(name==='music')name='playlist';if(name==='more'){const open=host.classList.toggle('tools-expanded');const b=host.querySelector('.study-room-more');b.setAttribute('aria-expanded',String(open));return;}host.classList.remove('tools-expanded');host.querySelector('.study-room-more').setAttribute('aria-expanded','false');if(name==='back'){goBack();return;}if(name==='chair'){toggleChair();return;}if(name==='drawer'&&renderer){drawerCursor=(drawerCursor+1)%3;focusDrawer(drawerCursor);return;}if(['books','projects','articles','drawer','settings','playlist'].includes(name)){if(panels.isOpen()&&panels.getKind()===name)panels.close();else panels.open(name);return;}if(name==='organize'){setOrganizing();return;}if(name==='resume'){if(selectedBook)pickBook(books[selectedBook.index]||selectedBook);return;}if(name==='world'){setImmersive(!immersive);return;}if(name==='reset'){cameraHistory.length=0;cancelPending();drawerStates.forEach((open,index)=>{if(open)drawerState(false,index);});drawerReturn=null;drawerCursor=-1;panels.close();setOrganizing(false);fly(defaultView,1000,false);syncBack();return;}if(name==='play'){window.LuliyRecords?.toggle();return;}if(name==='prev'||name==='next')window.LuliyRecords?.advance(name==='prev'?-1:1);}
 function setImmersive(value){cancelPending();if(immersive===value)return;immersive=value;clearTimeout(hold);panels.close();tip.hidden=true;worldButton.innerHTML=icon(value?'worldExit':'world');worldButton.setAttribute('aria-label',value?labels.exit:labels.world);worldButton.title=value?labels.exit:labels.world;worldButton.setAttribute('aria-pressed',String(value));if(value){previousOverflow=document.body.style.overflow;document.body.classList.add('study-room-immersive');document.body.style.overflow='hidden';}else{document.body.classList.remove('study-room-immersive');document.body.style.overflow=previousOverflow;}requestAnimationFrame(()=>{if(live){resize();stage.focus({preventScroll:true});}});}
 function animate(now){let active=false;if(articleTween){const p=Math.min(1,(now-articleTween.start)/(motion.matches?1:1150)),e=p*p*(3-2*p);furniture.articleSheet.rotation.z=1.2*(1-e);renderer.shadowMap.needsUpdate=true;active=true;if(p===1)articleTween=null;}returnTweens=returnTweens.filter(a=>{const p=a.duration?Math.min(1,(now-a.start)/a.duration):1,e=p*p*(3-2*p);a.entry.object.position.copy(a.from).lerp(a.to,e);a.entry.object.position.y+=Math.sin(Math.PI*p)*.55;for(const n of ['x','y','z'])a.entry.object.rotation[n]=a.fromRotation[n]+(a.toRotation[n]-a.fromRotation[n])*e;renderer.shadowMap.needsUpdate=true;active=true;return p<1;});if(bookTween){const a=bookTween,p=a.duration?Math.min(1,(now-a.start)/a.duration):1,e=p*p*(3-2*p);a.entry.object.position.copy(a.from).lerp(a.to,e);a.entry.object.position.y+=Math.sin(Math.PI*p)*.75;for(const n of ['x','y','z'])a.entry.object.rotation[n]=a.fromRotation[n]+(a.toRotation[n]-a.fromRotation[n])*e;renderer.shadowMap.needsUpdate=true;active=true;if(p===1)bookTween=null;}if(hoverBook&&!bookTween&&!returnTweens.some(t=>t.entry===hoverBook)&&hoverBook!==selectedBook){hoverAmount+=(hoverTarget-hoverAmount)*.18;hoverBook.object.position.copy(hoverBook.home.position);hoverBook.object.position.z+=hoverAmount*.13;if(Math.abs(hoverTarget-hoverAmount)>.002)active=true;else if(!hoverTarget){hoverBook.face.material.emissive?.set(0x000000);hoverBook=null;hoverAmount=0;}}drawerTweens=drawerTweens.filter(a=>{const p=Math.min(1,(now-a.start)/(motion.matches?1:950)),e=p*p*(3-2*p);a.object.position.z=a.from+(a.to-a.from)*e;renderer.shadowMap.needsUpdate=true;active=true;return p<1;});for(const name of ['chairTween','drawerTween','notebookTween']){const a=name==='chairTween'?chairTween:name==='drawerTween'?drawerTween:notebookTween;if(!a)continue;const p=Math.min(1,(now-a.start)/(motion.matches?1:850)),e=p*p*(3-2*p);if(name==='chairTween'){a.object.rotation.y=a.from+(a.to-a.from)*e;if(a.fromPosition)a.object.position.copy(a.fromPosition).lerp(a.toPosition,e);}else if(name==='drawerTween')a.object.position.z=a.from+(a.to-a.from)*e;else a.object.rotation.z=a.from+(a.to-a.from)*e;renderer.shadowMap.needsUpdate=true;active=true;if(p===1){if(name==='chairTween')chairTween=null;else if(name==='drawerTween')drawerTween=null;else notebookTween=null;}}return active;}
 function draw(now){frame=0;if(!live||!visible||document.visibilityState!=='visible')return;const dt=Math.min(50,now-(lastTime||now));lastTime=now;let moving=false;if(entranceAnimation){const p=entranceAnimation.duration?Math.min(1,(now-entranceAnimation.start)/entranceAnimation.duration):1,e=p*p*(3-2*p);entranceDistance=1+.055*(1-e);renderer.toneMappingExposure=.12+1.06*e;cameraDirty=true;moving=p<1;if(p===1)entranceAnimation=null;}if(flight){const f=flight,p=f.duration?Math.min(1,(now-f.start)/f.duration):1,e=p*p*p*(p*(p*6-15)+10);for(const n of ['yaw','pitch','zoom','focusX','focusY','focusZ','distance'])view[n]=f.from[n]+(f.to[n]-f.from[n])*e;cameraDirty=true;moving=moving||p<1;if(p===1){Object.assign(view,f.final);Object.assign(target,view);flight=null;host.classList.remove('is-focusing');}}else{const easing=motion.matches?1:1-Math.exp(-dt/115);for(const n of ['yaw','pitch','zoom','focusX','focusY','focusZ','distance']){const delta=target[n]-view[n];if(Math.abs(delta)>.0002){view[n]+=delta*easing;moving=true;cameraDirty=true;}else view[n]=target[n];}}updateCamera();const drawerFlying=animateDrawerFlight(now);const furnitureMoving=animate(now),deckMoving=deck?.update(now);scene.updateMatrixWorld(true);positionBookmark();renderer.render(scene,camera);portraitLayer?.update(camera,furniture?.portraitFrame);if(!firstFrame){firstFrame=true;readyFrame=requestAnimationFrame(()=>{readyFrame=0;if(live)onReady();});}settling--;if(moving||drawerFlying||furnitureMoving||control||settling>0||(!reader&&(audioState.playing||audioState.exchanging||(!window.LuliyMobileLite&&deckMoving)))){if(!window.LuliyMobileLite||!audioState.playing||now-(scene.__luliyLastSpin||0)>=33){scene.__luliyLastSpin=now;request();}}}
 function buildFurniture(){finishDrawerFlight();const old=selectedBook&&{id:selectedBook.id,title:selectedBook.title},chairAngle=furniture?.chair.rotation.y;chairTween=drawerTween=notebookTween=null;drawerTweens=[];returnTweens=[];if(furniture)scene.remove(furniture.group);decor?.dispose();furniture?.dispose();furniture=window.LuliyStudyFurniture.create(T,{books,projects,projectCovers,portraits,lang,onChange:()=>{settling=3;request();}});scene.add(furniture.group);if(interior)furniture.interactionTargets.push({object:interior.bed,kind:'bed',title:L('休息一下 · 返回首页','Rest · Return home','休む・ホームへ')});decor=window.LuliyStudyDecor.create(T,furniture,{lang,onChange:()=>{if(renderer){renderer.shadowMap.needsUpdate=true;settling=3;request();}}});decor.setLamp(read('luliy-study-lamp',true));decor.updateRecord(audioState);chairHome={position:furniture.chair.position.clone(),rotation:furniture.chair.rotation.y};syncChairButton();if(chairAngle!==undefined)furniture.chair.rotation.y=chairAngle;furniture.chair.visible=true;if(sitting){furniture.chair.position.set(-.5,0,2.25);furniture.chair.rotation.y=0;}drawerStates.forEach((open,index)=>{if(open)furniture.drawers[index].object.position.z=furniture.drawers[index].home.position.z+1.34;});if(notebookOpen&&furniture.notebookLid)furniture.notebookLid.rotation.z=1.9;if(deck){deck.object.position.copy(furniture.deskTurntablePosition);deck.object.scale.setScalar(furniture.turntableScale);}selectedBook=null;bookmark.hidden=true;bookTween=null;hoverBook=null;captureFit();const remembered=old||read('luliy-study-desk-book',null);if(remembered){const entry=locate(remembered);if(entry&&books[entry.index]?.available!==false&&entry.id)selectOnDesk(entry,false);}renderer.shadowMap.needsUpdate=true;settling=4;request();}
 host.addEventListener('click',e=>{if(!e.target.closest('.study-room-tools')){host.classList.remove('tools-expanded');host.querySelector('.study-room-more').setAttribute('aria-expanded','false');}const b=e.target.closest('[data-study-action]');if(b)action(b.dataset.studyAction);},{signal});volume.addEventListener('input',()=>{window.LuliyRecords?.setVolume(Number(volume.value)/100);showValue(volume.value+'%');},{signal});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!reader&&!panels.isOpen()){if(readerOpening){cancelPending();if(returnView){fly(returnView,1000,false);returnView=null;syncBack();}}if(organizing)setOrganizing(false);else if(immersive)setImmersive(false);}},{signal});
 try{
  T=window.LuliyThree||window.LuliyLoadThree();renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.25:1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;stage.append(renderer.domElement);renderer.domElement.className='study-room-canvas';
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;},{signal});renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;renderer.shadowMap.needsUpdate=true;resize();},{signal});scene=new T.Scene();camera=new T.PerspectiveCamera(43,1,.1,120);
  ambientLight=new T.AmbientLight(0xe9e3d5,1);scene.add(ambientLight);keyLight=new T.DirectionalLight(0xffdfb6,3.7);keyLight.position.set(-5,11,6);keyLight.castShadow=true;keyLight.shadow.mapSize.set(innerWidth<760?512:1024,innerWidth<760?512:1024);keyLight.shadow.camera.left=-9;keyLight.shadow.camera.right=9;keyLight.shadow.camera.top=9;keyLight.shadow.camera.bottom=-9;keyLight.shadow.bias=-.001;keyLight.shadow.radius=3;scene.add(keyLight);fillLight=new T.DirectionalLight(0xc6d7ef,1.1);fillLight.position.set(8,6,5);scene.add(fillLight);rimLight=new T.DirectionalLight(0xe1ad69,2.2);rimLight.position.set(2,9,-6);scene.add(rimLight);
  scene.background=new T.Color(0x51483e);interior=window.LuliyStudyInterior.create(T);scene.add(interior.group);buildFurniture();portraitLayer=window.LuliyStudyFurniture.portraitOverlay(T,stage,portraits[0],request);
  deck=window.LuliyTurntable.createEmbedded(T,{renderer,camera,host:stage,liftArmOnPause:true,parkGlassTransparent:true,onChange:request,onPlay:()=>window.LuliyRecords.toggle(),onSeek:(ratio,commit)=>{if(commit)learned('turntable');showValue(Math.floor(ratio*(audioState.duration||0)/60)+':'+String(Math.floor(ratio*(audioState.duration||0)%60)).padStart(2,'0'));if(commit)window.LuliyRecords.seek(ratio*(audioState.duration||0));},onSeekStart:()=>{resumeAfterSeek=!!audioState.playing;if(resumeAfterSeek)window.LuliyRecords.pause();},onSeekEnd:()=>{if(resumeAfterSeek){resumeAfterSeek=false;window.LuliyRecords.toggle();}},onVolume:value=>{learned('turntable');window.LuliyRecords.setVolume(value);showValue(Math.round(value*100)+'%');},getVolume:()=>audioState.volume??.45,onClamp:()=>window.LuliyRecords.toggleClamp()});deck.object.position.copy(furniture.deskTurntablePosition);deck.object.scale.setScalar(furniture.turntableScale);scene.add(deck.object);scene.environment=deck.environment;
  setLighting(prefs.lighting);document.addEventListener('luliy:theme',e=>{theme=e.detail.theme;setLighting(prefs.lighting);},{signal});resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){lastTime=0;settling=3;request();}else{cancelAnimationFrame(frame);frame=0;}},{threshold:0});intersection.observe(host);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){lastTime=0;request();}else{cancelAnimationFrame(frame);frame=0;}},{signal});resize();host.classList.add('is-ready');
 }catch(e){deck?.destroy();portraitLayer?.destroy();furniture?.dispose();deck=null;furniture=null;renderer?.dispose();renderer?.domElement.remove();renderer=null;stage.hidden=true;host.classList.add('has-fallback');panels.open('books');readyFrame=requestAnimationFrame(()=>{readyFrame=0;if(live)onReady();});}
 if(window.LuliyRecords?.subscribe){window.LuliyRecords.setLang(lang);unsubscribe=window.LuliyRecords.subscribe(handleAudio,{controlsVisible:true,enhanced:true,beforeExchange:prepareTrack});}
 startTimer(prefs.timerMinutes);
 function intersect(object,origin,ray){let best=Infinity;object.traverseVisible(mesh=>{if(!mesh.isMesh||!mesh.visible)return;if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();let cached=inverseCache.get(mesh);if(!cached){cached={world:mesh.matrixWorld.clone(),inverse:mesh.matrixWorld.clone()};cached.world.copy(mesh.matrixWorld);cached.inverse.copy(mesh.matrixWorld).invert();inverseCache.set(mesh,cached);}else if(!cached.world.equals(mesh.matrixWorld)){cached.world.copy(mesh.matrixWorld);cached.inverse.copy(mesh.matrixWorld).invert();}const b=mesh.geometry.boundingBox,inverse=cached.inverse,a=origin.clone().applyMatrix4(inverse),d=origin.clone().add(ray).applyMatrix4(inverse).sub(a);let near=-Infinity,far=Infinity;for(const axis of ['x','y','z']){if(Math.abs(d[axis])<1e-9){if(a[axis]<b.min[axis]||a[axis]>b.max[axis])return;}else{const t1=(b.min[axis]-a[axis])/d[axis],t2=(b.max[axis]-a[axis])/d[axis];near=Math.max(near,Math.min(t1,t2));far=Math.min(far,Math.max(t1,t2));}}if(far<Math.max(0,near))return;best=Math.min(best,a.addScaledVector(d,Math.max(0,near)).applyMatrix4(mesh.matrixWorld).distanceTo(origin));});return best;}
 function hitAt(x,y){if(!renderer)return null;scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const r=(window.LuliyLayoutRect?.(stage)||stage.getBoundingClientRect()),origin=camera.getWorldPosition(new T.Vector3()),ray=new T.Vector3((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2,.5).unproject(camera).sub(origin).normalize();let best=null,distance=Infinity;const candidates=[...furniture.bookTargets.map(entry=>({kind:'book',title:entry.title+(books[entry.index]?.available===false?' · '+L('待阅读','To read','未読'):''),object:entry.object,entry})),...(furniture.interactionTargets||[]).filter(item=>item.kind!=='drawer-content'||drawerStates[item.drawerIndex]),...(deck?[{kind:'turntable',title:L('长按进入唱片页','Hold to open records'),object:deck.object}]:[]),{kind:'bookshelf',title:labels.books,object:furniture.shelf}];for(const candidate of candidates){const d=intersect(candidate.object,origin,ray);if(d<distance){best=candidate;distance=d;}}const penTarget=furniture.interactionTargets.find(c=>c.object===furniture.pen);if(penTarget){const a=furniture.pen.localToWorld(new T.Vector3(-.6,0,0)),b=furniture.pen.localToWorld(new T.Vector3(.5,0,0)),pa=a.clone().project(camera),pb=b.clone().project(camera),ax=r.left+(pa.x+1)*r.width/2,ay=r.top+(1-pa.y)*r.height/2,bx=r.left+(pb.x+1)*r.width/2,by=r.top+(1-pb.y)*r.height/2,t=Math.max(0,Math.min(1,((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2||1))),d=a.lerp(b,t).distanceTo(origin);if(Math.hypot(x-ax-t*(bx-ax),y-ay-t*(by-ay))<(innerWidth<760?22:14)&&d<distance+.04){best=penTarget;distance=d;}}if(best){const deckDistance=deck&&best.kind!=='turntable'?intersect(deck.object,origin,ray):Infinity;let blocker=Infinity;furniture.desk.children.forEach(n=>{if(!furniture.drawers?.some(d=>d.object===n))blocker=Math.min(blocker,intersect(n,origin,ray));});if(Math.min(deckDistance,blocker)<distance-.03)return null;}return best;}
 function positionBookmark(){if(!selectedBook||!camera)return;const r=(window.LuliyLayoutRect?.(stage)||stage.getBoundingClientRect()),h=host.getBoundingClientRect(),p=selectedBook.object.getWorldPosition(new T.Vector3()).project(camera);bookmark.style.left=(r.left-h.left+(p.x+1)*r.width/2+12)+'px';bookmark.style.top=(r.top-h.top+(1-p.y)*r.height/2-24)+'px';bookmark.style.bottom='auto';bookmark.hidden=p.z>1||p.z<-1||Math.abs(p.x)>1||Math.abs(p.y)>1;}
 function stopFlight(){host.classList.remove('is-focusing');if(flight){Object.assign(target,view);flight=null;}cameraDirty=true;}
 function finishDrawerFlight(){if(!drawerFlight)return;drawerFlight.source.visible=drawerFlight.source!==furniture?.drawerContents.find(item=>item.drawerIndex===1&&item.index===audioState.index)?.object;scene.remove(drawerFlight.object);drawerFlight=null;deck?.setIncomingOrigin(null);renderer.shadowMap.needsUpdate=true;}
 function sendDrawerRecord(hit){if(audioState.exchanging){window.LuliyRecords?.play(hit.index,undefined,true);message(L('已选择，当前换片完成后接着播放。','Selected — plays after this exchange.','交換後に再生します。'));return;}finishDrawerFlight();scene.updateMatrixWorld(true);const object=hit.object.clone(true),from=hit.object.getWorldPosition(new T.Vector3()),to=furniture.deskTurntablePosition.clone().add(new T.Vector3(-.5,1.4,.1));object.position.copy(from);scene.add(object);hit.object.visible=false;drawerFlight={object,source:hit.object,from,to,start:performance.now(),exchange:null};deck.setIncomingOrigin(to);window.LuliyRecords?.play(hit.index,undefined,true);request();}
 function animateDrawerFlight(now){if(!drawerFlight)return false;const f=drawerFlight,p=Math.min(1,(now-f.start)/1000),e=p*p*(3-2*p);f.object.position.copy(f.from).lerp(f.to,e);f.object.position.y+=Math.sin(e*Math.PI)*.6;f.object.scale.setScalar(.40+(1.935*furniture.turntableScale/.35-.40)*e);if(f.exchange&&(now-f.exchange.start)/f.exchange.duration>=.56){f.object.visible=false;f.source.visible=false;}return p<1;}
 function rest(){if(resting)return;resting=true;panels.close();window.LuliyRecords?.setListeningGain(0,1500);fly({yaw:-.18,pitch:.28,zoom:1,focusX:6.65,focusY:.95,focusZ:1.15,distance:6.5,mode:'rest'},1500);restVeil=document.createElement('div');restVeil.className='study-rest-veil';document.body.append(restVeil);restTimers.push(setTimeout(()=>restVeil?.classList.add('is-dark'),950));restTimers.push(setTimeout(()=>{window.LuliyRecords?.pause();sessionStorage.setItem('luliy-study-rest-return','1');location.hash=href('/');},2400));}
 function activate(hit){if(!hit||resting)return;const nearby=target.mode!=='overview'&&target.mode!=='seated';if(hit.kind==='turntable'){focusRecord();return;}if(!nearby&&['computer','laptop','projects'].includes(hit.kind)){moveToView('projects');return;}if(!nearby&&(hit.kind==='bookshelf'||hit.kind==='book')){moveToView('bookshelf');return;}if(hit.kind==='bed'){rest();return;}if(hit.kind==='pen'){window.open('https://github.com/luliy6/luliy6.github.io/issues','_blank','noopener,noreferrer');return;}if(hit.kind==='lamp'){decor.setLamp(!decor.getLamp());save('luliy-study-lamp',decor.getLamp());learned('lamp');return;}if(hit.kind==='record'){focusRecord();window.LuliyRecords?.play(Math.max(0,audioState.index||0));return;}if(hit.kind==='book'){pickBook(books[hit.entry.index]||hit.entry);return;}if(hit.kind==='portrait'){location.hash=href('/about');return;}if(hit.kind==='chair'){toggleChair();}else if(['computer','laptop','projects'].includes(hit.kind))panels.open('projects');else if(['pen','notebook','articles'].includes(hit.kind))panels.open('articles');else if(hit.kind==='drawer')focusDrawer(hit.index);else if(hit.kind==='drawer-content'){if(hit.drawerIndex===1){sendDrawerRecord(hit);}else panels.open('drawer');}else if(hit.kind==='bookshelf')panels.open('books');request();}
 function clearHold(){clearTimeout(hold);hold=0;}
 let hoverObject=null,hoverMaterials=[];function highlight(hit){interior?.setHover(hit?.kind==='bed');if(hoverObject===hit?.object)return;for(const [mat,color] of hoverMaterials)mat.emissive.copy(color);hoverMaterials=[];hoverObject=hit?.object||null;const lit=hit?.kind==='computer'?hoverObject?.getObjectByName('laptop-screen'):hit?.kind==='drawer'?hit.handle||hoverObject:hit?.kind==='lamp'?hoverObject:null;(lit||hoverObject)?.traverse(n=>{for(const mat of (Array.isArray(n.material)?n.material:[n.material]))if(mat?.emissive&&!hoverMaterials.some(x=>x[0]===mat)){hoverMaterials.push([mat,mat.emissive.clone()]);mat.emissive.set(hit?.kind==='computer'?0x28241c:hit?.kind==='drawer'?0x30200f:0x17120c);}});request();}function resetHover(){highlight(null);if(hoverBook){hoverBook.face.material.emissive?.set(0x000000);if(hoverBook!==selectedBook&&!bookTween)hoverBook.object.position.copy(hoverBook.home.position);}hoverBook=null;hoverAmount=hoverTarget=0;tip.hidden=true;}
 stage.addEventListener('pointerdown',e=>{if(!renderer||e.button>0||reader||resting)return;if(panels.isOpen()){panels.close();return;}cancelPending();tip.hidden=true;held=false;const hit=hitAt(e.clientX,e.clientY);if(hit?.kind==='lamp'){lampDrag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};stage.setPointerCapture(e.pointerId);teach('lamp',L('点击台灯开关；拖动灯头调整照明。','Click to switch the lamp; drag its head to aim.','クリックで点灯、ヘッドをドラッグして調整。'));return;}pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture(e.pointerId);if(pointers.size===2){clearHold();if(control){deck.endControl({pointerId:control.id,type:'pointercancel'});control=null;}const [a,b]=[...pointers.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);drag=null;stopFlight();resetHover();return;}const controlHit=target.mode==='turntable'?deck?.hitControl?.(e.clientX,e.clientY):null;if(controlHit&&deck.beginControl?.(e)){teach('turntable',L('拖动唱臂调进度；拖动或滚动旋钮调音量。','Drag the arm to seek; drag or scroll the knob for volume.','アームで再生位置、ノブで音量。'));control={kind:controlHit,id:e.pointerId,x:e.clientX,y:e.clientY};hold=setTimeout(()=>{if(control?.id===e.pointerId){held=true;deck.endControl?.({pointerId:e.pointerId,type:'pointercancel'});control=null;learned('turntable');location.hash=href('/music');}},750);request();return;}resetHover();stopFlight();drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,hit,book:organizing&&hit?.kind==='book'?hit.entry:null};if((!hit||hit.kind==='turntable')&&!organizing)hold=setTimeout(()=>{if(drag&&!drag.moved){held=true;if(hit?.kind==='turntable'){learned('turntable');location.hash=href('/music');}else setImmersive(true);}},750);stage.classList.add('is-dragging');},{signal});
 stage.addEventListener('pointermove',e=>{if(!renderer||reader||resting)return;if(lampDrag?.id===e.pointerId){const dx=e.clientX-lampDrag.x,dy=e.clientY-lampDrag.y;if(Math.abs(dx)+Math.abs(dy)>2)lampDrag.moved=true;lampDrag.x=e.clientX;lampDrag.y=e.clientY;decor.aim(dx,dy);learned('lamp');request();return;}if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(control){if(Math.hypot(e.clientX-control.x,e.clientY-control.y)>7)clearHold();deck.moveControl?.(e);request();return;}if(pointers.size===2){const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance)target.zoom=Math.max(.65,Math.min(2.35,target.zoom*distance/pinchDistance));pinchDistance=distance;request();return;}if(drag?.id===e.pointerId){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>7){drag.moved=true;clearHold();}if(drag.moved&&drag.book){const b=drag.book,r=(window.LuliyLayoutRect?.(stage)||stage.getBoundingClientRect()),point=new T.Vector3((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2,.5).unproject(camera),origin=camera.getWorldPosition(new T.Vector3()),ray=point.sub(origin).normalize(),homeWorld=b.object.parent.localToWorld(b.home.position.clone()),distance=(homeWorld.z-origin.z)/ray.z;if(Number.isFinite(distance)&&distance>0){const p=origin.addScaledVector(ray,distance);b.object.parent.worldToLocal(p);b.object.position.x=p.x;b.object.position.y=Math.max(.8,Math.min(6.9,p.y));b.object.position.z=b.home.position.z+.2;renderer.shadowMap.needsUpdate=true;settling=2;request();}}else if(drag.moved){target.yaw-=dx*.006;target.pitch=Math.max(-.28,Math.min(1.25,target.pitch+dy*.0045));request();}return;}if(e.pointerType==='touch'||panels.isOpen())return;const hitTime=performance.now();if(hitTime-lastHoverHit<32)return;lastHoverHit=hitTime;const hit=hitAt(e.clientX,e.clientY);if(hit?.kind==='turntable')teach('turntable',L('长按唱片机进入唱片页；拖动唱臂调进度，旋钮调音量。','Hold to open Records; drag the arm to seek and the knob for volume.','長押しでレコードへ。アームで再生位置、ノブで音量。'));highlight(hit);stage.style.cursor=hit?'pointer':'';tip.hidden=!hit;tip.classList.toggle('is-visible',!!hit);if(hit){tip.textContent=hit.title||labels[hit.kind]||'';if(target.mode==='overview'&&['turntable','computer','laptop','projects','bookshelf','book'].includes(hit.kind))tip.textContent+=' · '+L('点击靠近','Click to approach','クリックで近づく');else if(hit.kind==='drawer-content'&&hit.drawerIndex===1)tip.textContent+=' · '+L('点击播放','Click to play','クリックで再生');const r=host.getBoundingClientRect();tip.style.left=Math.min(r.width-220,Math.max(15,e.clientX-r.left+18))+'px';tip.style.top=Math.min(r.height-100,e.clientY-r.top+15)+'px';}if(hit?.kind==='book'&&hit.entry!==selectedBook){if(hoverBook!==hit.entry){resetHover();hoverBook=hit.entry;}hoverBook.face.material.emissive?.set(0x252019);hoverTarget=1;request();}else if(hoverBook){hoverBook.face.material.emissive?.set(0x000000);hoverTarget=0;request();}tip.hidden=!hit;},{signal});
 function endPointer(e,cancelled=false){if(lampDrag?.id===e.pointerId){if(!lampDrag.moved&&!cancelled){decor.setLamp(!decor.getLamp());save('luliy-study-lamp',decor.getLamp());}lampDrag=null;learned('lamp');return;}clearHold();pointers.delete(e.pointerId);if(control?.id===e.pointerId){deck.endControl?.(e);control=null;settling=20;request();}else if(drag?.id===e.pointerId){if(drag.book&&drag.moved){const book=drag.book;if(cancelled)book.object.position.copy(book.home.position);else{let nearest=null,distance=Infinity;for(const entry of furniture.bookTargets){if(entry===book)continue;const d=book.object.position.distanceTo(entry.home.position);if(d<distance){nearest=entry;distance=d;}}const r=(window.LuliyLayoutRect?.(stage)||stage.getBoundingClientRect()),origin=camera.getWorldPosition(new T.Vector3()),ray=new T.Vector3((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2,.5).unproject(camera).sub(origin).normalize(),t=(3.25-origin.y)/ray.y,p=origin.clone().addScaledVector(ray,t),onDesk=Number.isFinite(t)&&t>0&&p.x>-5.625&&p.x<2.925&&p.z>-2.7&&p.z<.2;if(onDesk){setOrganizing(false);selectOnDesk(book);}else if(nearest&&distance<1.7){furniture.setBookPlacement(book.index,nearest.slot);message(L('书架位置已保存','Book positions saved','本の配置を保存しました'));}else book.object.position.copy(book.home.position);renderer.shadowMap.needsUpdate=true;request();}}else if(!drag.moved&&!held&&!cancelled)activate(drag.hit);}drag=null;pinchDistance=0;if(pointers.size===1){const [id,p]=[...pointers.entries()][0];drag={id,x:p.x,y:p.y,startX:p.x,startY:p.y,moved:true};}else stage.classList.remove('is-dragging');save('luliy-study-view',target);}
 stage.addEventListener('pointerup',e=>endPointer(e),{signal});stage.addEventListener('pointercancel',e=>endPointer(e,true),{signal});stage.addEventListener('pointerleave',()=>{if(!drag&&!control){highlight(null);tip.hidden=true;stage.style.cursor='';if(hoverBook)hoverBook.face.material.emissive?.set(0x000000);hoverTarget=0;request();}},{signal});stage.addEventListener('dblclick',e=>{if(!reader&&!panels.isOpen()&&!hitAt(e.clientX,e.clientY))action('reset');},{signal});stage.addEventListener('contextmenu',e=>{if(held||immersive)e.preventDefault();},{signal});
 stage.addEventListener('wheel',e=>{if(!renderer||reader||panels.isOpen())return;if(deck.wheelControl?.(e)){learned('turntable');e.preventDefault();request();return;}stopFlight();const next=Math.max(.65,Math.min(2.35,target.zoom*Math.exp(-e.deltaY*.0011)));if(!immersive&&Math.abs(next-target.zoom)<.0001)return;e.preventDefault();target.zoom=next;tip.hidden=true;request();save('luliy-study-view',target);},{passive:false,signal});
 stage.addEventListener('keydown',e=>{if(e.target!==stage||reader||panels.isOpen())return;stopFlight();const step=.14;switch(e.key){case'ArrowLeft':target.yaw+=step;break;case'ArrowRight':target.yaw-=step;break;case'ArrowUp':target.pitch=Math.min(1.25,target.pitch+step);break;case'ArrowDown':target.pitch=Math.max(-.28,target.pitch-step);break;case'+':case'=':target.zoom=Math.min(2.35,target.zoom*1.12);break;case'-':target.zoom=Math.max(.65,target.zoom/1.12);break;case'Home':moveToView('overview');break;case'Enter':setImmersive(!immersive);break;default:return;}e.preventDefault();request();},{signal});
 return {beginEntrance(duration=1500){if(!renderer)return;entranceAnimation={start:performance.now(),duration:motion.matches?0:duration};settling=3;request();},getView:()=>({...target}),updateContent(next){books=next.books||books;articles=next.articles||articles;projects=next.projects||projects;panels.updateContent({books,articles,projects,projectCovers});if(renderer)buildFurniture();},destroy(){if(!live)return;if(immersive)setImmersive(false);closeReader();live=false;save('luliy-study-view',resting?defaultView:target);clearHold();clearTimeout(readerOpening);clearTimeout(noticeTimer);clearTimeout(valueTimer);clearInterval(timerInterval);restTimers.forEach(clearTimeout);if(restVeil&&resting&&location.hash===href('/')){const veil=restVeil;veil.style.pointerEvents='none';requestAnimationFrame(()=>requestAnimationFrame(()=>veil.classList.remove('is-dark')));setTimeout(()=>veil.remove(),1400);}else restVeil?.remove();trackPreparation.forEach((resolve,timer)=>{clearTimeout(timer);resolve();});trackPreparation.clear();abort.abort();panels.destroy();unsubscribe();window.LuliyRecords?.setListeningGain(1,0);cancelAnimationFrame(frame);cancelAnimationFrame(readyFrame);resizeObserver?.disconnect();intersection?.disconnect();soundContext?.close().catch(()=>{});finishDrawerFlight();decor?.dispose();interior?.dispose();deck?.destroy();portraitLayer?.destroy();furniture?.dispose();scene?.traverse(mesh=>{mesh.geometry?.dispose();if(Array.isArray(mesh.material))mesh.material.forEach(m=>m.dispose());else mesh.material?.dispose();mesh.shadow?.dispose();});renderer?.dispose();renderer?.forceContextLoss();renderer?.domElement.remove();host.replaceChildren();}};
}
window.LuliyStudyRoom={mount};
})();

/* The homepage study is a display object: orbit only, no content or audio actions. */
(function(){
'use strict';
function mountDisplay(host,{books=[],projects=[],projectCovers={},portraits=[],lang='zh'}={}){
 let T,renderer,scene,camera,furniture,decor,deck,portraitLayer,frame=0,active=false,live=true,ready=false,preparing=false,prepareFailed=false,prepareGeneration=0,preparePromise=null,resolvePrepare=null,firstPreparedFrame=false,drag=null,fitPoints=[],lastFrame=0,view={yaw:-.4,pitch:.30},target={...view};
 const abort=new AbortController(),signal=abort.signal,observer=new ResizeObserver(resize);
 function request(){if(live&&ready&&!frame&&document.visibilityState==='visible')frame=requestAnimationFrame(draw);}
 function resize(){if(!ready)return;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;const ratio=window.LuliyQuality.ratio(renderer,innerWidth<760?1:1.35,1800000,r.width,r.height);if(Math.abs(renderer.getPixelRatio()-ratio)>.01)renderer.setPixelRatio(ratio);renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();request();}
 function cameraPose(){const focus=new T.Vector3(-.15,3,-.6),direction=new T.Vector3(Math.sin(view.yaw)*Math.cos(view.pitch),Math.sin(view.pitch),Math.cos(view.yaw)*Math.cos(view.pitch)),right=new T.Vector3(Math.cos(view.yaw),0,-Math.sin(view.yaw)),up=new T.Vector3(-Math.sin(view.yaw)*Math.sin(view.pitch),Math.cos(view.pitch),-Math.cos(view.yaw)*Math.sin(view.pitch)),t=Math.tan(camera.fov*Math.PI/360);let distance=10;for(const point of fitPoints){const x=point.x-focus.x,y=point.y-focus.y,z=point.z-focus.z;distance=Math.max(distance,x*direction.x+y*direction.y+z*direction.z+Math.max(Math.abs(x*right.x+y*right.y+z*right.z)/(t*camera.aspect*.92),Math.abs(x*up.x+y*up.y+z*up.z)/(t*.92)));}camera.position.copy(focus).addScaledVector(direction,distance);camera.lookAt(focus);camera.updateMatrixWorld(true);}
 function draw(now){frame=0;if(!live||!ready)return;const dt=Math.min(50,lastFrame?now-lastFrame:16.67),ease=1-Math.exp(-dt/84);lastFrame=now;view.yaw+=(target.yaw-view.yaw)*ease;view.pitch+=(target.pitch-view.pitch)*ease;cameraPose();renderer.render(scene,camera);portraitLayer?.update(camera,furniture?.portraitFrame);if(!firstPreparedFrame){firstPreparedFrame=true;settle(true);}host.classList.add('is-ready');if(active&&Math.abs(view.yaw-target.yaw)+Math.abs(view.pitch-target.pitch)>.0002)request();}
 const pause=()=>new Promise(resolve=>{if(window.requestIdleCallback)requestIdleCallback(resolve,{timeout:500});else setTimeout(resolve,20);});
 async function init(token){if(ready||preparing||!live||prepareFailed)return;preparing=true;if(token===undefined)token=++prepareGeneration;const current=()=>live&&token===prepareGeneration;try{await pause();if(!current())return;if(!window.LuliyLoadThree&&window.LuliyThreeReady){await window.LuliyThreeReady();if(!current())return;}T=window.LuliyThree||window.LuliyLoadThree();renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1:1.35));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;scene=new T.Scene();camera=new T.PerspectiveCamera(43,1,.1,120);host.append(renderer.domElement);scene.add(new T.AmbientLight(0xe9e3d5,1));for(const [color,power,pos] of [[0xffdfb6,3.7,[-5,11,6]],[0xc6d7ef,1.1,[8,6,5]],[0xe1ad69,2.2,[2,9,-6]]]){const light=new T.DirectionalLight(color,power);light.position.set(...pos);scene.add(light);}await pause();if(!current())return;furniture=window.LuliyStudyFurniture.create(T,{books,projects,projectCovers,portraits,lang,onChange:request});scene.add(furniture.group);await pause();if(!current())return;decor=window.LuliyStudyDecor.create(T,furniture,{lang,onChange:request});decor.updateRecord(window.LuliyRecords?.getState());portraitLayer=window.LuliyStudyFurniture.portraitOverlay(T,host,portraits[0],request);await pause();if(!current())return;deck=window.LuliyTurntable.createEmbedded(T,{renderer,camera,host,onChange:request,liftArmOnPause:true,parkGlassTransparent:true});deck.object.position.copy(furniture.deskTurntablePosition);deck.object.scale.setScalar(furniture.turntableScale);scene.add(deck.object);scene.environment=deck.environment;await pause();if(!current())return;furniture.group.updateMatrixWorld(true);furniture.group.traverse(mesh=>{if(!mesh.isMesh)return;mesh.geometry.computeBoundingBox();const b=mesh.geometry.boundingBox;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])fitPoints.push(mesh.localToWorld(new T.Vector3(x,y,z)));});ready=true;themeLight();resize();observer.observe(host);request();}catch(e){if(current()){clearScene();prepareFailed=true;host.classList.remove('is-ready');host.classList.add('has-fallback');settle(false);}}finally{if(token===prepareGeneration)preparing=false;}}
 host.addEventListener('pointerdown',e=>{if(!ready||e.button>0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId);host.classList.add('is-dragging');},{signal});
 host.addEventListener('pointermove',e=>{if(drag?.id!==e.pointerId)return;target.yaw=Math.max(-.85,Math.min(.12,target.yaw-(e.clientX-drag.x)*.004));target.pitch=Math.max(.12,Math.min(.57,target.pitch+(e.clientY-drag.y)*.003));drag.x=e.clientX;drag.y=e.clientY;request();},{signal});
 function end(e){if(drag?.id!==e.pointerId)return;drag=null;host.classList.remove('is-dragging');}
 host.addEventListener('pointerup',end,{signal});host.addEventListener('pointercancel',end,{signal});host.addEventListener('click',e=>e.stopPropagation(),{signal});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();},{signal});
 function themeLight(){if(!scene)return;const day=document.documentElement.dataset.theme==='light';scene.children.filter(n=>n.isAmbientLight).forEach(n=>n.intensity=day?1.15:1);deck?.setTheme?.(day?'light':'dark');request();}
 document.addEventListener('luliy:theme',themeLight,{signal});

 function settle(value){const resolve=resolvePrepare;resolvePrepare=null;preparePromise=null;resolve?.(value);}
 function clearScene(){deck?.destroy();portraitLayer?.destroy();decor?.dispose();furniture?.dispose();renderer?.dispose();renderer?.forceContextLoss?.();renderer?.domElement.remove();deck=portraitLayer=decor=furniture=renderer=scene=camera=T=null;fitPoints=[];firstPreparedFrame=false;}
 function prepare(){if(ready)return Promise.resolve(true);if(!live||prepareFailed)return Promise.resolve(false);if(preparePromise)return preparePromise;preparePromise=new Promise(resolve=>{resolvePrepare=resolve;});init(++prepareGeneration);return preparePromise;}
 function retryPrepare(){if(ready)return Promise.resolve(true);prepareFailed=false;host.classList.remove('has-fallback');return prepare();}
 function cancelPrepare(){if(!preparePromise||firstPreparedFrame)return false;prepareGeneration++;preparing=false;ready=false;prepareFailed=true;clearScene();host.classList.remove('is-ready');host.classList.add('has-fallback');settle(false);return true;}
 return {prepare,retryPrepare,cancelPrepare,setActive(value){if(active===!!value)return;active=!!value;if(active){prepare();request();}else{cancelAnimationFrame(frame);frame=0;}},destroy(){live=false;prepareGeneration++;settle(false);abort.abort();observer.disconnect();cancelAnimationFrame(frame);deck?.destroy();portraitLayer?.destroy();decor?.dispose();furniture?.dispose();renderer?.dispose();renderer?.forceContextLoss();renderer?.domElement.remove();}};
}
window.LuliyStudyDisplay={mount:mountDisplay};
})();

/* Both displays read from the same project data as search. */
const LuliyProjects=(()=>{
  const isExam=project=>['./works/gpt-english-2-exams.html','./works/math-handbook/index.html','./works/408/','./works/math2/','./works/kaoyan-dashboard/','https://study.luliy.me/','https://408.luliy.me/'].includes(project[4])||project[4]==='https://study.luliy.me/';
  function examCards(projects,projectCard,L,esc){const exams=projects.filter(isExam);return exams.length?`<section class="works-exams-section section" aria-labelledby="worksExamsHeading"><div class="section-label works-web-heading"><span>EXAMS</span><h2 id="worksExamsHeading">${esc(L('考研行动与真题','Exam prep & papers','受験準備と過去問'))}</h2></div><div class="projects-list project-gallery-grid">${exams.map((project,index)=>projectCard(project,index,true)).join('')}</div></section>`:'';}

  function render({root,title,projectCard,projects,spaces,sectionLabel,wallPhotos,L,esc}){
    root.innerHTML=`<div class="shell subpage works-page">${title('WORKS','projects')}
      <div class="section-label works-web-heading"><span>HTML</span><h2>${esc(L('网页','Web','ウェブ'))}</h2></div>
      <div class="projects-list project-gallery-grid">${projects.filter(project=>!isExam(project)).map((project,index)=>projectCard(project,index,true)).join('')}</div>
      ${examCards(projects,projectCard,L,esc)}
      <section class="works-photo-wall section" aria-label="${esc(L('照片墙','Photo wall','写真の壁'))}">
        <div class="section-label"><span>PHOTO WALL</span><h2>${esc(L('照片墙','Photo wall','写真の壁'))}</h2></div>
        <div class="works-photo-grid">${wallPhotos.map((photo,index)=>`<button class="works-photo-tile" type="button" data-wall-photo="${index}" aria-label="${esc(L('查看照片','View photograph','写真を見る'))} ${String(index+1).padStart(2,'0')}"><img src="${esc(photo.src)}" alt="${esc(photo.title)}" loading="lazy" decoding="async"><span>${String(index+1).padStart(2,'0')}</span></button>`).join('')}</div>
      </section>
      <section class="section">${sectionLabel('MY SPACES','spaces')}${spaces()}</section>
    </div>`;
    return ()=>{};
  }
  function mount({root,projectCard,projects,L,esc}){
    root.innerHTML=`<section class="project-exhibition" aria-label="${esc(L('作品展览','Works exhibition','作品の展示'))}">
        <div class="project-exhibition-light" aria-hidden="true"></div>
        <div class="project-exhibition-window" tabindex="0" aria-label="${esc(L('滚动或使用方向键浏览作品','Scroll or use arrow keys to browse works','スクロールか矢印キーで作品を見る'))}">
          <div class="projects-list project-exhibition-track">${projects.filter(project=>!isExam(project)).map((project,index)=>`<div class="project-exhibit-item">${projectCard(project,index,true)}</div>`).join('')}</div>
        </div>
        <div class="project-exhibition-controls">
          <span class="project-exhibition-count" aria-live="polite"></span>
          <div><button type="button" class="project-exhibition-prev" aria-label="${esc(L('上一件作品','Previous work','前の作品'))}">←</button><button type="button" class="project-exhibition-next" aria-label="${esc(L('下一件作品','Next work','次の作品'))}">→</button></div>
        </div>
      </section>`;

    const stage=root.querySelector('.project-exhibition');
    const windowEl=stage.querySelector('.project-exhibition-window');
    const track=stage.querySelector('.project-exhibition-track');
    const items=[...stage.querySelectorAll('.project-exhibit-item')];
    const previous=stage.querySelector('.project-exhibition-prev');
    const next=stage.querySelector('.project-exhibition-next');
    const counter=stage.querySelector('.project-exhibition-count');
    const abort=new AbortController();
    let start=0,wheelTotal=0,lastMove=0,lastWheel=0,touchStart=null,suppressClickUntil=0,updateFrame=0;
    const shownCount=()=>Math.min(items.length,innerWidth<=700?1:innerWidth<=1000?2:4);

    function update(){
      if(!stage.isConnected||!items.length)return;
      const shown=shownCount(),limit=items.length-shown;
      start=Math.min(start,limit);
      const gap=parseFloat(getComputedStyle(track).columnGap)||0;
      track.style.transform=`translate3d(${-start*(items[0].offsetWidth+gap)}px,0,0)`;
      items.forEach((item,index)=>{
        const position=index-start,onStage=position>=0&&position<shown;
        item.dataset.edge=onStage&&shown>2?(position===0?'left':position===shown-1?'right':'center'):'center';
        item.inert=!onStage;
        item.setAttribute('aria-hidden',String(!onStage));
        if(!onStage&&item.contains(document.activeElement))windowEl.focus({preventScroll:true});
      });
      previous.disabled=start===0;
      next.disabled=start===limit;
      stage.classList.toggle('has-overflow',limit>0);
      counter.textContent=`${String(start+1).padStart(2,'0')}–${String(start+shown).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    }
    function move(direction){
      const limit=items.length-shownCount(),target=Math.max(0,Math.min(limit,start+direction));
      if(target===start)return false;
      start=target;lastMove=performance.now();wheelTotal=0;update();return true;
    }
    function requestUpdate(){if(!updateFrame)updateFrame=requestAnimationFrame(()=>{updateFrame=0;update();});}

    previous.addEventListener('click',()=>move(-1),{signal:abort.signal});
    next.addEventListener('click',()=>move(1),{signal:abort.signal});
    windowEl.addEventListener('wheel',event=>{
      const rawDelta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
      const delta=rawDelta*(event.deltaMode===1?16:event.deltaMode===2?windowEl.clientHeight:1),now=performance.now();
      if(Math.abs(delta)<2)return;
      const direction=Math.sign(delta),limit=items.length-shownCount();
      if(direction<0&&start===0||direction>0&&start===limit)return;
      event.preventDefault();
      if(now-lastWheel>180||wheelTotal&&Math.sign(wheelTotal)!==direction)wheelTotal=0;
      lastWheel=now;
      wheelTotal+=delta;
      if(Math.abs(wheelTotal)>55&&now-lastMove>430)move(Math.sign(wheelTotal));
    },{passive:false,signal:abort.signal});
    windowEl.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
        if(move(event.key==='ArrowRight'?1:-1))event.preventDefault();
      }
    },{signal:abort.signal});
    windowEl.addEventListener('pointerdown',event=>{
      if(event.pointerType==='touch')touchStart={x:event.clientX,y:event.clientY};
    },{signal:abort.signal});
    windowEl.addEventListener('pointerup',event=>{
      if(!touchStart)return;
      const dx=event.clientX-touchStart.x,dy=event.clientY-touchStart.y;
      touchStart=null;
      if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2&&move(dx<0?1:-1))suppressClickUntil=performance.now()+350;
    },{signal:abort.signal});
    windowEl.addEventListener('pointercancel',()=>{touchStart=null;},{signal:abort.signal});
    windowEl.addEventListener('click',event=>{
      if(performance.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();suppressClickUntil=0;}
    },{capture:true,signal:abort.signal});
    window.addEventListener('resize',requestUpdate,{passive:true,signal:abort.signal});
    requestUpdate();
    return ()=>{abort.abort();cancelAnimationFrame(updateFrame);updateFrame=0;};
  }
  return {render,mount};
})();

(()=>{
const KEY='luliy-chronicle-cache-v1',API='https://api.github.com/repos/luliy6/luliy6.github.io/issues?state=open&labels=chronicle-data&per_page=1';
let memory=null,pending=null;
const valid=d=>d&&Array.isArray(d.years)&&Array.isArray(d.categories)&&d.data&&typeof d.data==='object';
function cached(){if(memory)return memory;try{const d=JSON.parse(localStorage.getItem(KEY));if(valid(d))return d;}catch(e){}return null;}
async function request(url,json=true){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);try{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw Error('HTTP '+r.status);return json?await r.json():await r.text();}finally{clearTimeout(timer);}}
async function load(force=false){if(!force&&memory)return {data:memory};if(pending)return pending;pending=(async()=>{try{const issues=await request(API),body=issues[0]?.body||'',match=body.match(/<!--\s*chronicle:data:start\s*-->([\s\S]*?)<!--\s*chronicle:data:end\s*-->/),d=match?JSON.parse(match[1]):null;if(!valid(d))throw Error('Invalid chronicle');memory=d;try{if(JSON.stringify(d).length<600000)localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}return {data:d};}catch(error){const saved=cached();if(saved)return {data:saved,stale:true};try{const html=await request('https://blog.luliy.me/chronicle.html',false),doc=new DOMParser().parseFromString(html,'text/html'),d=JSON.parse(doc.querySelector('#luliy-chronicle-fallback')?.textContent||'null');if(valid(d))return {data:d,stale:true};}catch(e){}throw error;}finally{pending=null;}})();return pending;}
function mount({root,shelf,params,href,esc,L}){
 let live=true;const safe=value=>{try{const u=new URL(value,'https://blog.luliy.me/');return ['https:','http:'].includes(u.protocol)?u.href:'';}catch(e){return '';}};
 function link(item){const title=typeof item==='object'?item?.title||'':String(item||''),raw=typeof item==='object'?item?.url||'':'',url=raw?safe(raw):'',post=url?shelf.posts().find(p=>safe(p.url||p.bodyUrl||'')===url):null,issue=url.match(/^https:\/\/github.com\/luliy6\/luliy6.github.io\/issues\/(\d+)$/),id=post?.id||(issue?'P'+issue[1]:null);return url?`<a ${id?'class="study-entry chronicle-article"':''} href="${esc(id?href('/article/'+id):url)}" ${id?'':'target="_blank" rel="noopener noreferrer"'}>${esc(title)}</a>`:typeof item==='object'&&(item.note||item.description)?`<details><summary>${esc(title)}</summary><p>${esc(item.note||item.description)}</p></details>`:`<span>${esc(title)}</span>`;}
 const arr=v=>v?Array.isArray(v)?v:[v]:[];
 function paint({data,stale=false}){if(!live||!root.isConnected)return;const years=data.years.map(String),cats=data.categories.filter(c=>c&&typeof c.key==='string'),year=years.includes(params.get('year'))?params.get('year'):years[0],cat=cats.some(c=>c.key===params.get('category'))?params.get('category'):cats[0]?.key;
 const url=(y,c)=>href('/posts?'+new URLSearchParams({view:'chronicle',year:y,category:c}));
 const filters=`<nav class="post-filters" aria-label="年份">${years.map(y=>`<a href="${url(y,cat||'')}" ${year===y?'aria-current="page"':''}>${esc(y)}</a>`).join('')}</nav><nav class="post-filters" aria-label="编年史分类">${cats.map(c=>`<a href="${url(year,c.key)}" ${cat===c.key?'aria-current="page"':''}>${esc(c.label||c.key)}</a>`).join('')}</nav>`;
 const rows=arr(data.data[year]?.[cat]);let content='';
 if(cat==='posters')content=`<div class="chronicle-posters">${rows.map(p=>`<figure>${safe(p.image)?`<a href="${esc(safe(p.image))}" target="_blank" rel="noopener noreferrer"><img src="${esc(safe(p.image))}" alt="${esc(p.title||'')}" loading="lazy" decoding="async"></a>`:''}<figcaption>${link(p)}</figcaption></figure>`).join('')}</div>`;
 else content=`<div class="chronicle-timeline">${rows.map(row=>`<section class="chronicle-month"><h2>${esc(row.month||year)}</h2><div>${cat==='event'||cat==='travel'?`<p class="eyebrow">${esc(row.city||'')}</p><div class="chronicle-items">${arr(row.items).map(link).join('')}</div>`:[['读书',row.books||row.book],['视频 / 电影',row.watch||row.movie],['事件 / 新闻',row.shows||row.show],['讲座 / 成长',row.games||row.game]].filter(([,v])=>arr(v).length).map(([name,v])=>`<div class="chronicle-media"><h3>${esc(name)}</h3><div class="chronicle-items">${arr(v).map(link).join('')}</div></div>`).join('')}</div></section>`).join('')}</div>`;
 root.innerHTML=filters+`<div class="chronicle-status">${stale?L('正在显示已保存的记录。','Showing saved records.','保存済みの記録を表示中。'):L('来自你的编年史记录','From your chronicle','年代記の記録')} <button type="button" data-chronicle-retry>${L('刷新','Refresh','更新')}</button></div>`+(rows.length?content:`<p class="study-empty">${L('这一年此分类还没有记录。','No records in this category for this year.','この年の記録はまだありません。')}</p>`);root.querySelector('[data-chronicle-retry]').onclick=()=>run(true);
 }
 async function run(force=false){root.innerHTML=`<p class="study-empty" role="status">${L('正在读取编年史…','Loading chronicle…','年代記を読み込み中…')}</p>`;try{paint(await load(force));}catch(e){if(!live||!root.isConnected)return;root.innerHTML=`<p class="study-empty">${L('暂时无法读取编年史，请稍后重试。','Chronicle is temporarily unavailable. Please retry.','年代記を読み込めません。再試行してください。')}</p><button class="text-link" data-chronicle-retry>${L('重新加载','Retry','再試行')}</button>`;root.querySelector('button').onclick=()=>run(true);}}
 const saved=cached();if(saved){paint({data:saved,stale:!memory});load().then(paint).catch(()=>{});}else run();return ()=>{live=false;};
}
function mountFilters(root){const drawer=root.querySelector('.article-filter-drawer');if(!drawer)return ()=>{};const outside=e=>{if(drawer.open&&!drawer.contains(e.target))drawer.open=false;};const key=e=>{if(e.key==='Escape'&&drawer.open){drawer.open=false;drawer.querySelector('summary').focus();}};const choose=e=>{if(e.target.closest('a'))drawer.open=false;};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);drawer.addEventListener('click',choose);return ()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);drawer.removeEventListener('click',choose);};}
window.LuliyChronicle={mount,mountFilters};
})();

(function (global) {
  'use strict';

  // A work of generative art: the galaxy and heart are expressive forms,
  // rather than an astrophysical or biological simulation.
  var TAU = Math.PI * 2;

  function hostPalette(canvas) {
    var probe = document.createElement('span');
    probe.style.display = 'none';
    (canvas.parentNode || document.body || document.documentElement).appendChild(probe);
    var pixel = document.createElement('canvas');
    pixel.width = pixel.height = 1;
    var pixelContext = pixel.getContext('2d');
    function read(token, fallback) {
      probe.style.color = 'var(' + token + ',' + fallback + ')';
      var value = global.getComputedStyle(probe).color;
      // Modern browsers preserve oklch/color() in computed styles. Let their
      // colour parser convert inherited theme values into explicit sRGB.
      if (pixelContext) {
        pixelContext.clearRect(0, 0, 1, 1);
        pixelContext.fillStyle = value;
        pixelContext.fillRect(0, 0, 1, 1);
        var rgba = pixelContext.getImageData(0, 0, 1, 1).data;
        return 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
      }
      return value;
    }
    var palette = {
      background: read('--background', 'Canvas'),
      foreground: read('--foreground', 'CanvasText'),
      colors: [1, 5, 6].map(function (index) { return read('--viz-series-' + index, 'var(--foreground, CanvasText)'); })
    };
    probe.remove();
    return palette;
  }

  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
  function smooth(value) { value = clamp(value, 0, 1); return value * value * (3 - 2 * value); }
  function lerp(a, b, amount) { return a + (b - a) * amount; }
  function hash(text) {
    var value = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }
  function randomSource(seed) {
    return function () {
      seed += 0x6D2B79F5;
      var value = seed;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gaussian(random) {
    return Math.sqrt(-2 * Math.log(Math.max(0.000001, random()))) * Math.cos(TAU * random());
  }
  function parseColor(value, fallback) {
    if (Array.isArray(value) && value.length >= 3) {
      var scale = Math.max(value[0], value[1], value[2]) > 1 ? 255 : 1;
      return value.slice(0, 3).map(function (part) { return clamp(Number(part) / scale, 0, 1); });
    }
    if (typeof value !== 'string') return fallback.slice();
    var hex = value.trim().match(/^#([a-f\d]{3}|[a-f\d]{6}|[a-f\d]{8})$/i);
    if (hex) {
      var content = hex[1];
      if (content.length === 3) content = content.split('').map(function (part) { return part + part; }).join('');
      return [0, 2, 4].map(function (start) { return parseInt(content.slice(start, start + 2), 16) / 255; });
    }
    var rgb = value.trim().match(/^rgba?\(\s*([\d.]+)(%?)\s*[, ]\s*([\d.]+)(%?)\s*[, ]\s*([\d.]+)(%?)/i);
    if (rgb) return [1, 3, 5].map(function (index) { return clamp(Number(rgb[index]) / (rgb[index + 1] === '%' ? 100 : 255), 0, 1); });
    return fallback.slice();
  }
  function luminance(color) { return color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722; }
  function rgbString(color) { return 'rgb(' + color.map(function (part) { return Math.round(clamp(part, 0, 1) * 255); }).join(',') + ')'; }
  function graphemes(text) {
    if (global.Intl && global.Intl.Segmenter) {
      var segmenter = new global.Intl.Segmenter('zh', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), function (part) { return part.segment; });
    }
    return Array.from(text);
  }

  var VERTEX = [
    'precision highp float;',
    'attribute vec3 aNebula;',
    'attribute vec3 aGalaxy;',
    'attribute vec3 aHeart;',
    'attribute vec3 aText;',
    'attribute vec4 aData;',
    'uniform float uProgress;',
    'uniform float uTime;',
    'uniform vec2 uOrbit;',
    'uniform float uAspect;',
    'uniform float uFit;',
    'uniform float uPixelRatio;',
    'uniform float uBloom;',
    'uniform float uLight;',
    'uniform float uPointerActive;',
    'uniform float uPointerMode;',
    'uniform vec2 uPointer;',
    'uniform vec3 uColor0;',
    'uniform vec3 uColor1;',
    'uniform vec3 uColor2;',
    'uniform vec3 uForeground;',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'varying float vBloom;',
    'float ease(float x) { x = clamp(x, 0.0, 1.0); return x*x*(3.0-2.0*x); }',
    'void main() {',
    '  float stage0 = ease((uProgress-.22)/.20);',
    '  float stage1 = ease((uProgress-.50)/.20);',
    '  float stage2 = ease((uProgress-.80)/.14);',
    '  float angle = uTime * 0.035 + uOrbit.x;',
    '  float ca = cos(angle); float sa = sin(angle);',
    '  vec3 disk = vec3(aGalaxy.x*ca-aGalaxy.z*sa, aGalaxy.y, aGalaxy.x*sa+aGalaxy.z*ca);',
    '  vec3 galaxy = vec3(disk.x, disk.z*(0.43+uOrbit.y)+disk.y*0.85, disk.z*0.8-disk.y*0.43);',
    '  float ct = cos(-0.18); float st = sin(-0.18);',
    '  galaxy.xy = vec2(galaxy.x*ct-galaxy.y*st, galaxy.x*st+galaxy.y*ct);',
    '  float drift = sin(uTime*0.1+aData.z*6.2831853)*0.025;',
    '  vec3 nebula = aNebula + vec3(drift, cos(uTime*0.08+aData.z*9.0)*0.02, 0.0);',
    '  vec3 position = galaxy;',
    '  float perspective = 1.0 / (1.0 + position.z*0.14);',
    '  vec3 projected = vec3(position.x/uAspect, position.y, position.z*0.04) * uFit * perspective;',
    '  float ink0=ease(stage0*1.65-(aHeart.x+1.0)*.325);',
    '  float ink1=ease(stage1*1.65-(aText.x+1.0)*.325);',
    '  projected = mix(projected, aHeart, ink0);',
    '  projected = mix(projected, aText, ink1);',
    '  projected = mix(projected, vec3(nebula.x/uAspect,nebula.y,nebula.z*.04)*uFit*1.35,stage2);',
    '  vec2 delta = uPointer - projected.xy;',
    '  vec2 corrected = vec2(delta.x*uAspect, delta.y);',
    '  float influence = exp(-dot(corrected, corrected)*8.0)*uPointerActive;',
    '  float strength = mix(0.22, 0.74, uPointerMode);',
    '  vec2 swirl = vec2(-corrected.y/uAspect, corrected.x) * influence * 0.18;',
    '  float wave=sin(length(corrected)*30.0-uTime*3.0)*influence*.012;',
    '  projected.xy += (delta*influence*strength + swirl + normalize(corrected+vec2(.0001))*wave) * (1.0-stage0*0.8);',
    '  float dust = sin(uTime*0.36+aData.z*17.0)*0.0025*(1.0-stage2);',
    '  projected.xy += vec2(dust/uAspect, dust);',
    '  gl_Position = vec4(projected, 1.0);',
    '  float size = 1.15+aData.x*1.8;',
    '  size += step(0.983, aData.x)*2.7;',
    '  size *= mix(1.0, 0.80, stage2);',
    '  size *= 1.0 + uLight*(0.12+stage2*0.28);',
    '  gl_PointSize = (uBloom > 0.5 ? size*4.5 : size) * uPixelRatio * (1.0+influence*1.1);',
    '  float hue = fract(aData.y + uProgress*0.14);',
    '  vec3 color = hue < 0.5 ? mix(uColor0,uColor1,hue*2.0) : mix(uColor1,uColor2,(hue-0.5)*2.0);',
    '  float nucleus = (1.0-smoothstep(0.0,0.30,aData.w))*(1.0-stage0);',
    '  vColor = mix(color,uForeground,nucleus*0.35);',
    '  float twinkle = 0.82+0.18*sin(uTime*0.7+aData.z*30.0);',
    '  float opacity = (0.42+aData.x*0.24)*twinkle;',
    '  opacity *= mix(1.0,1.42,uLight);',
    '  opacity = min(0.98,opacity);',
    '  opacity *= 1.0+influence*0.45;',
    '  vAlpha = uBloom > 0.5 ? opacity*mix(0.095,0.045,uLight) : opacity;',
    '  vBloom = uBloom;',
    '}'
  ].join('\n');

  var FRAGMENT = [
    'precision mediump float;',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'varying float vBloom;',
    'void main() {',
    '  vec2 coordinate = gl_PointCoord * 2.0 - 1.0;',
    '  float radius2 = dot(coordinate, coordinate);',
    '  if (radius2 > 1.0) discard;',
    '  float glow = exp(-radius2*(vBloom > 0.5 ? 3.8 : 2.4)) * (1.0-smoothstep(0.55,1.0,radius2));',
    '  gl_FragColor = vec4(vColor, vAlpha*glow);',
    '}'
  ].join('\n');

  global.createLuliyGalaxyEngine = function createLuliyGalaxyEngine(options) {
    options = options || {};
    var canvas = options.canvas;
    if (!canvas || typeof canvas.getContext !== 'function') throw new Error('A canvas is required.');
    var inheritedPalette = hostPalette(canvas);
    var reducedMotion = !!options.reducedMotion;
    var playing = true;
    var destroyed = false;
    var lost = false;
    var frameId = 0;
    var width = 1, height = 1, aspect = 1, fit = 1, pixelRatio = 1;
    var targetProgress = 0, progress = 0;
    var orbit = {x:0,y:0};
    var elapsed = 0, lastFrame = 0, lastStats = 0;
    var fps = 0, frameSamples = 0, sampleDuration = 0;
    var message = 'Just Do It';
    var seed = hash(message);
    var pointer = { x: 0, y: 0, active: 0, targetActive:0, mode: 0 };
    var bg, colors, foreground, light;
    var buffers = [], attributes = {}, uniforms = {}, program = null;
    var nebula, galaxy, heart, textTargets, data;
    var spriteCache = [];
    var particleCount;
    var gl = null, context = null;
    var renderer = 'canvas2d';
    var raster = options.textCanvas || document.createElement('canvas');
    var rasterContext = raster.getContext('2d', { willReadFrequently: true });
    var resizeObserver = null;

    function compile(type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(error || 'The particle shader did not compile.');
      }
      return shader;
    }

    function initWebGL() {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' }) || canvas.getContext('experimental-webgl', { alpha: false, antialias: false, depth: false });
      if (!gl) return false;
      var vertex = compile(gl.VERTEX_SHADER, VERTEX);
      var fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'The particle program did not link.');
      gl.useProgram(program);
      ['aNebula', 'aGalaxy', 'aHeart', 'aText', 'aData'].forEach(function (name) { attributes[name] = gl.getAttribLocation(program, name); });
      ['uProgress', 'uTime', 'uOrbit', 'uAspect', 'uFit', 'uPixelRatio', 'uBloom', 'uLight', 'uPointerActive', 'uPointerMode', 'uPointer', 'uColor0', 'uColor1', 'uColor2', 'uForeground'].forEach(function (name) { uniforms[name] = gl.getUniformLocation(program, name); });
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      particleCount = window.LuliyMobilePhone ? 420 : window.LuliyMobileLite ? 900 : (innerWidth <= 700 ? 5000 : 12000);
      renderer = 'webgl';
      return true;
    }

    try {
      if (!initWebGL()) context = canvas.getContext('2d', { alpha: false });
    } catch (error) {
      // A shader failure leaves the original canvas committed to WebGL. A
      // sibling replacement allows a real Canvas2D fallback without crashing.
      if (program && gl) gl.deleteProgram(program);
      var replacement = canvas.cloneNode(false);
      if (canvas.parentNode) canvas.parentNode.replaceChild(replacement, canvas);
      canvas = replacement;
      gl = null;
      program = null;
      context = canvas.getContext('2d', { alpha: false });
    }
    if (!gl) particleCount = window.LuliyMobilePhone ? 300 : window.LuliyMobileLite ? 600 : 2000;

    function normalizePalette(palette) {
      palette = palette || inheritedPalette;
      bg = parseColor(palette.background, parseColor(inheritedPalette.background, [0, 0, 0]));
      light = luminance(bg) > 0.55;
      foreground = parseColor(palette.foreground, parseColor(inheritedPalette.foreground, [0, 0, 0]));
      var source = palette.colors && palette.colors.length ? palette.colors : inheritedPalette.colors;
      colors = [0, 1, 2].map(function (index) {
        var value = parseColor(source[index % source.length], parseColor(inheritedPalette.colors[index], foreground));
        if (light) {
          // Keep the same hues while giving stars ink-like contrast on paper.
          var factor = Math.min(0.8, 0.39 / Math.max(0.1, luminance(value)));
          return value.map(function (part) { return part * factor; });
        }
        return value;
      });
      spriteCache = [];
      if (!gl) buildSprites();
    }

    function buildSprites() {
      colors.forEach(function (color) {
        var sprite = document.createElement('canvas');
        sprite.width = sprite.height = 40;
        var c = sprite.getContext('2d');
        var rgb = color.map(function (part) { return Math.round(part * 255); }).join(',');
        var gradient = c.createRadialGradient(20, 20, 0, 20, 20, 20);
        gradient.addColorStop(0, 'rgba(' + rgb + ',0.92)');
        gradient.addColorStop(0.18, 'rgba(' + rgb + ',0.58)');
        gradient.addColorStop(0.5, 'rgba(' + rgb + ',0.13)');
        gradient.addColorStop(1, 'rgba(' + rgb + ',0)');
        c.fillStyle = gradient;
        c.fillRect(0, 0, 40, 40);
        spriteCache.push(sprite);
      });
    }

    function buildGeometry() {
      var random = randomSource(seed);
      nebula = new Float32Array(particleCount * 3);
      galaxy = new Float32Array(particleCount * 3);
      heart = new Float32Array(particleCount * 3);
      data = new Float32Array(particleCount * 4);
      for (var index = 0; index < particleCount; index += 1) {
        var n = index * 3, d = index * 4;
        var radial = Math.pow(random(), 0.68);
        if (index % 7 === 0) radial = Math.pow(random(), 2.8) * 0.30;
        var radius = radial * 1.34;
        var arm = index % 5;
        var angle = arm * TAU / 5 + radius * 4.1 + gaussian(random) * (0.045 + radial * 0.13);
        var spread = (0.025 + radial * 0.11) * gaussian(random);
        galaxy[n] = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * spread;
        galaxy[n + 1] = gaussian(random) * (0.015 + radial * 0.027);
        galaxy[n + 2] = Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * spread;

        var cloudAngle = angle * 0.72 + gaussian(random) * 0.24;
        var cloudRadius = radius * 1.14 + gaussian(random) * 0.25;
        nebula[n] = Math.cos(cloudAngle) * cloudRadius * 1.24 + gaussian(random) * 0.21;
        nebula[n + 1] = Math.sin(cloudAngle) * cloudRadius * 0.72 + gaussian(random) * 0.18;
        nebula[n + 2] = gaussian(random) * 0.52;

        data[d] = random();
        // Spatial colour bands reveal structure even with a small palette.
        data[d + 1] = (radial * 0.47 + arm * 0.115 + random() * 0.21) % 1;
        data[d + 2] = random();
        data[d + 3] = radial;
      }
      var savedMessage=message;message='Luliy';buildTypography();heart=textTargets.slice();message=savedMessage;buildTypography();
      if (gl) uploadGeometry();
    }

    function buildTypography() {
      textTargets = new Float32Array(particleCount * 3);
      var glyphs = graphemes(message.replace(/\s+/g, ' ').trim()).slice(0, 24);
      if (!glyphs.length) glyphs = graphemes('一句话的宇宙');
      var totalUnits = glyphs.reduce(function (sum, glyph) { return sum + (/[\u2e80-\u9fff\uf900-\ufaff\u3000-\u303f\uff00-\uffef]/.test(glyph) ? 1 : 0.59); }, 0);
      // Balance the rows: a nine-character wish becomes five plus four,
      // rather than eight characters followed by an isolated final glyph.
      var lineLimit = Math.min(aspect>1.1?10:6, Math.ceil(totalUnits / Math.ceil(totalUnits / (aspect>1.1?10:6))));
      var lines = [], line = '', lineUnits = 0;
      glyphs.forEach(function (glyph) {
        var units = /[\u2e80-\u9fff\uf900-\ufaff\u3000-\u303f\uff00-\uffef]/.test(glyph) ? 1 : 0.59;
        if (glyph === '\n' || (lineUnits + units > lineLimit && line.length)) {
          lines.push(line.trim());
          line = '';
          lineUnits = 0;
        }
        if (glyph !== '\n') { line += glyph; lineUnits += units; }
      });
      if (line.trim()) lines.push(line.trim());
      if (!lines.length) lines = ['一句话的宇宙'];
      raster.width = 1080;
      raster.height = Math.round(clamp(1080 / Math.max(0.5, aspect), 360, 1600));
      var rw = raster.width, rh = raster.height;
      rasterContext.clearRect(0, 0, rw, rh);
      var longest = Math.max.apply(null, lines.map(function (part) { return graphemes(part).reduce(function (sum, glyph) { return sum + (/[\u2e80-\u9fff\uf900-\ufaff\u3000-\u303f\uff00-\uffef]/.test(glyph) ? 1 : 0.59); }, 0); }));
      var fontSize = Math.min(rw * 0.82 / Math.max(1, longest), rh * 0.68 / (lines.length * 1.3));
      var fontStack = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif';
      rasterContext.font = (message==='Luliy'?'italic 500 ':'500 ') + Math.floor(fontSize) + 'px ' + (message==='Luliy'?'Georgia, serif':fontStack);
      rasterContext.textAlign = 'center';
      rasterContext.textBaseline = 'middle';
      rasterContext.fillStyle = '#fff';
      var lineHeight = fontSize * 1.3;
      if(message==='Luliy'){
        var symbol=document.querySelector('#header .brand-mark svg'),tail='uliy';
        var metrics=rasterContext.measureText(tail),symbolSize=fontSize*.92,gap=fontSize*.015;
        var groupWidth=symbolSize*.6+gap+metrics.width;
        var groupScale=Math.min(1,rw*.87/groupWidth);
        var baseline=rh/2+rasterContext.measureText('u').actualBoundingBoxDescent;
        rasterContext.save();rasterContext.translate(rw/2,rh/2);rasterContext.scale(groupScale,groupScale);rasterContext.translate(-groupWidth/2,-rh/2);
        rasterContext.save();rasterContext.translate(-symbolSize*.2,baseline-symbolSize*58/60);rasterContext.scale(symbolSize/60,symbolSize/60);
        if(symbol)Array.from(symbol.querySelectorAll('rect,path,ellipse')).forEach(function(shape){rasterContext.save();rasterContext.globalAlpha=Number(shape.getAttribute('opacity')||1);if(shape.tagName.toLowerCase()==='path')rasterContext.fill(new Path2D(shape.getAttribute('d')));else if(shape.tagName.toLowerCase()==='rect')rasterContext.fillRect(+shape.getAttribute('x'),+shape.getAttribute('y'),+shape.getAttribute('width'),+shape.getAttribute('height'));else{rasterContext.beginPath();rasterContext.ellipse(+shape.getAttribute('cx'),+shape.getAttribute('cy'),+shape.getAttribute('rx'),+shape.getAttribute('ry'),0,0,Math.PI*2);rasterContext.fill();}rasterContext.restore();});
        rasterContext.restore();rasterContext.textAlign='left';rasterContext.fillText(tail,symbolSize*.6+gap,rh/2);rasterContext.restore();
      }else lines.forEach(function (part, index) {
        rasterContext.fillText(part, rw / 2, rh / 2 + (index - (lines.length - 1) / 2) * lineHeight, rw * 0.87);
      });
      var pixels = rasterContext.getImageData(0, 0, rw, rh).data;
      var candidates = [];
      for (var y = 1; y < rh - 1; y += 2) {
        for (var x = 1; x < rw - 1; x += 2) {
          if (pixels[(y * rw + x) * 4 + 3] > 100) candidates.push(x, y);
        }
      }
      var random = randomSource(seed ^ 0xA1C39D7B);
      var count = candidates.length / 2;
      for (var index = 0; index < particleCount; index += 1) {
        var target = index * 3;
        if (count) {
          var sample = Math.floor(random() * count) * 2;
          textTargets[target] = (candidates[sample] + random() * 2 - rw / 2) / rw * 2;
          textTargets[target + 1] = -(candidates[sample + 1] + random() * 2 - rh / 2) / rh * 2;
          textTargets[target + 2] = 0;
        } else {
          // The scene is still complete when a text canvas cannot rasterize.
          var a = index / particleCount * TAU;
          textTargets[target] = Math.cos(a) * 0.55;
          textTargets[target + 1] = Math.sin(a) * 0.55;
        }
      }
    }

    function uploadGeometry() {
      buffers.forEach(function (buffer) { gl.deleteBuffer(buffer); });
      buffers = [];
      [[attributes.aNebula, nebula, 3], [attributes.aGalaxy, galaxy, 3], [attributes.aHeart, heart, 3], [attributes.aText, textTargets, 3], [attributes.aData, data, 4]].forEach(function (entry) {
        var buffer = gl.createBuffer();
        buffers.push(buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, entry[1], gl.STATIC_DRAW);
        gl.enableVertexAttribArray(entry[0]);
        gl.vertexAttribPointer(entry[0], entry[2], gl.FLOAT, false, 0, 0);
      });
    }

    function updateTypographyBuffer() {
      if (!gl || !buffers[3]) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[3]);
      gl.bufferData(gl.ARRAY_BUFFER, textTargets, gl.STATIC_DRAW);
    }

    function renderWebGL() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(bg[0], bg[1], bg[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.blendFunc(gl.SRC_ALPHA, light ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
      gl.uniform1f(uniforms.uProgress, progress);
      gl.uniform1f(uniforms.uTime, elapsed);
      gl.uniform2f(uniforms.uOrbit,orbit.x,orbit.y);
      gl.uniform1f(uniforms.uAspect, aspect);
      gl.uniform1f(uniforms.uFit, fit);
      gl.uniform1f(uniforms.uPixelRatio, pixelRatio);
      gl.uniform1f(uniforms.uLight, light ? 1 : 0);
      gl.uniform1f(uniforms.uPointerActive, pointer.active);
      gl.uniform1f(uniforms.uPointerMode, pointer.mode);
      gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y);
      gl.uniform3fv(uniforms.uColor0, colors[0]);
      gl.uniform3fv(uniforms.uColor1, colors[1]);
      gl.uniform3fv(uniforms.uColor2, colors[2]);
      gl.uniform3fv(uniforms.uForeground, foreground);
      gl.uniform1f(uniforms.uBloom, 1);
      gl.drawArrays(gl.POINTS, 0, particleCount);
      gl.uniform1f(uniforms.uBloom, 0);
      gl.drawArrays(gl.POINTS, 0, particleCount);
    }

    function renderCanvas() {
      if (!context) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = rgbString(bg);
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = light ? 'source-over' : 'lighter';
      var s0=smooth((progress-.22)/.20),s1=smooth((progress-.50)/.20),s2=smooth((progress-.80)/.14);
      var ca = Math.cos(elapsed*.035+orbit.x), sa = Math.sin(elapsed*.035+orbit.x);
      var ct = Math.cos(-0.18), st = Math.sin(-0.18);
      var beat = 1 + 0.026 * (Math.sin(elapsed * 2.5) + 0.32 * Math.sin(elapsed * 5));
      var ha = Math.sin(elapsed * 0.16) * 0.16, hc = Math.cos(ha), hs = Math.sin(ha);
      for (var index = 0; index < particleCount; index += 1) {
        var n = index * 3, d = index * 4;
        var gx = galaxy[n] * ca - galaxy[n + 2] * sa;
        var gy = (galaxy[n] * sa + galaxy[n + 2] * ca) * (0.43+orbit.y) + galaxy[n + 1] * 0.85;
        var gz = (galaxy[n] * sa + galaxy[n + 2] * ca) * 0.8 - galaxy[n + 1] * 0.43;
        var tx = gx * ct - gy * st, ty = gx * st + gy * ct;
        var perspective=fit/(1+gz*.14);
        var ink0=smooth(s0*1.65-(heart[n]+1)*.325),ink1=smooth(s1*1.65-(textTargets[n]+1)*.325);
        var x=lerp(lerp(tx/aspect*perspective,heart[n],ink0),textTargets[n],ink1);
        var y=lerp(lerp(ty*perspective,heart[n+1],ink0),textTargets[n+1],ink1);
        x=lerp(x,nebula[n]/aspect*fit*1.35,s2);y=lerp(y,nebula[n+1]*fit*1.35,s2);
        var dx = pointer.x - x, dy = pointer.y - y;
        var influence = Math.exp(-((dx * aspect) * (dx * aspect) + dy * dy) * 8) * pointer.active;
        var force = (pointer.mode ? 0.74 : 0.22) * influence * (1 - s2 * 0.62);
        x += dx * force - dy / aspect * influence * 0.18 * (1 - s2 * 0.62);
        y += dy * force + dx * aspect * influence * 0.18 * (1 - s2 * 0.62);
        var size = (3.3 + data[d] * 4.5) * (1 + influence * 0.7) * (1 - s2 * 0.12) * (light ? 1.12 + s2 * 0.28 : 1);
        var cx = (x + 1) * width / 2, cy = (1 - y) * height / 2;
        if (cx < -size || cx > width + size || cy < -size || cy > height + size) continue;
        context.globalAlpha = light ? 0.92 : 0.75;
        var hue = (data[d + 1] + progress * 0.14) % 1;
        context.drawImage(spriteCache[Math.min(2, Math.floor(hue * 3))], cx - size / 2, cy - size / 2, size, size);
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
    }

    function getStats() {
      return { renderer: renderer, particles: particleCount, particleCount: particleCount, fps: Math.round(fps), progress: progress, seed: seed.toString(16).padStart(8, '0'), playing: playing, reducedMotion: reducedMotion };
    }

    function emitStats(now, force) {
      if (typeof options.onStats === 'function' && (force || now - lastStats > 1000)) {
        lastStats = now;
        options.onStats(getStats());
      }
    }

    function draw(now) {
      frameId = 0;
      if (destroyed || lost || !nebula) return;
      var delta = lastFrame ? Math.min(0.06, Math.max(0, (now - lastFrame) / 1000)) : 1 / 60;
      lastFrame = now;
      if (playing && !reducedMotion && !window.LuliyMobileLite) {
        elapsed += delta;
        progress += (targetProgress - progress) * (1 - Math.exp(-delta * 6.5));
        if (Math.abs(targetProgress - progress) < 0.0001) progress = targetProgress;
      } else progress = targetProgress;
      pointer.active+=(pointer.targetActive-pointer.active)*(reducedMotion?1:1-Math.exp(-delta*8));
      if (gl) renderWebGL(); else renderCanvas();
      frameSamples += 1;
      sampleDuration += delta;
      if (sampleDuration >= 0.7) {
        fps = frameSamples / sampleDuration;
        frameSamples = 0;
        sampleDuration = 0;
      }
      emitStats(now, false);
      if (playing && !reducedMotion && !window.LuliyMobileLite && !destroyed) frameId = global.requestAnimationFrame(draw);
    }

    function requestRender() {
      if (!destroyed && !lost && !frameId) frameId = global.requestAnimationFrame(draw);
    }

    function resize() {
      if (destroyed) return;
      var bounds = (window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect());
      var nextWidth = Math.max(1, Math.round(bounds.width || canvas.clientWidth || 640));
      var nextHeight = Math.max(1, Math.round(bounds.height || canvas.clientHeight || 420));
      var nextRatio = Math.min(global.devicePixelRatio || 1, innerWidth<=700?1.25:1.5);
      var changed = width !== nextWidth || height !== nextHeight || pixelRatio !== nextRatio;
      width = nextWidth;
      height = nextHeight;
      aspect = width / height;
      fit = Math.min(0.96, aspect / 1.46);
      pixelRatio = nextRatio;
      if (canvas.width !== Math.round(width * pixelRatio)) canvas.width = Math.round(width * pixelRatio);
      if (canvas.height !== Math.round(height * pixelRatio)) canvas.height = Math.round(height * pixelRatio);
      if (changed && data) {
        buildGeometry();
      }
      requestRender();
    }

    function onContextLost(event) {
      event.preventDefault();
      lost = true;
      if (frameId) global.cancelAnimationFrame(frameId);
      frameId = 0;
    }
    function onContextRestored() {
      if (destroyed) return;
      lost = false;
      try {
        buffers = [];
        initWebGL();
        uploadGeometry();
        lastFrame = 0;
        requestRender();
      } catch (error) { lost = true; }
    }

    normalizePalette(options.palette);
    resize();
    buildGeometry();
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);
    global.addEventListener('resize', resize);
    if (global.ResizeObserver) {
      resizeObserver = new global.ResizeObserver(resize);
      resizeObserver.observe(canvas);
    }
    emitStats(performance.now(), true);
    requestRender();

    return {
      canvas: canvas,
      setOrbit: function(x,y){orbit.x=clamp(x,-.35,.35);orbit.y=clamp(y,-.14,.14);requestRender();},
      setProgress: function (value) {
        if (!Number.isFinite(Number(value)) || destroyed) return;
        targetProgress = clamp(Number(value), 0, 1);
        if (reducedMotion || !playing) progress = targetProgress;
        requestRender();
      },
      setMessage: function (value) {
        if (destroyed) return;
        var next = String(value == null ? '' : value).trim() || '一句话的宇宙';
        if (message === next) return;
        message = next;
        seed = hash(message);
        buildGeometry();
        emitStats(performance.now(), true);
        requestRender();
      },
      setPointer: function (x, y, active, mode) {
        pointer.x = clamp(Number(x) || 0, -1, 1);
        pointer.y = clamp(Number(y) || 0, -1, 1);
        pointer.targetActive = active ? 1 : 0;
        pointer.mode = mode === 'blackhole' || mode === 'black-hole' ? 1 : 0;
        requestRender();
      },
      setPalette: function (palette) { if (!destroyed) { normalizePalette(palette); requestRender(); } },
      setReducedMotion: function (value) {
        reducedMotion = !!value;
        lastFrame = 0;
        if (reducedMotion && frameId) { global.cancelAnimationFrame(frameId); frameId = 0; }
        requestRender();
      },
      setPlaying: function (value) {
        playing = !!value;
        lastFrame = 0;
        if (!playing && frameId) { global.cancelAnimationFrame(frameId); frameId = 0; }
        requestRender();
      },
      resize: resize,
      renderOnce: function () {
        if (destroyed || lost) return;
        if (frameId) { global.cancelAnimationFrame(frameId); frameId = 0; }
        progress = targetProgress;
        draw(performance.now());
      },
      getStats: getStats,
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        if (frameId) global.cancelAnimationFrame(frameId);
        global.removeEventListener('resize', resize);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);
        if (resizeObserver) resizeObserver.disconnect();
        if (gl) {
          buffers.forEach(function (buffer) { gl.deleteBuffer(buffer); });
          if (program) gl.deleteProgram(program);
        }
        buffers = [];
      }
    };
  };
})(window);

(function(){
'use strict';
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
function mount(o){
 const {entrance,stage,homeStudy,dust,copy,foot,plane,story,label,photoCaption,landingPortrait,shelfBackdrop,wide,library,projects,href,esc,motion,request}=o;
 const abort=new AbortController(),signal=abort.signal;let engine=null,drag=null,orbit={x:0,y:0},dark=false,current=0,visible=true,enginePlaying=null;
 const layer=document.createElement('div');layer.className='galaxy-home';layer.innerHTML=`<div class="galaxy-field"><canvas aria-label="银河逐渐写出 Luliy 与 Just Do It" role="img"></canvas><nav class="galaxy-orbits" aria-label="收藏银河"><svg viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true"><g transform="rotate(-12 400 300)"><ellipse cx="400" cy="300" rx="255" ry="95"/><ellipse cx="400" cy="300" rx="295" ry="120"/><ellipse cx="400" cy="300" rx="340" ry="145"/><ellipse cx="400" cy="300" rx="380" ry="170"/></g></svg><button data-galaxy-entry="books" class="orbit-0" aria-expanded="false"><i aria-hidden="true"></i><span>书房</span></button><button data-galaxy-entry="posts" class="orbit-1" aria-expanded="false"><i aria-hidden="true"></i><span>文章</span></button><button data-galaxy-entry="projects" class="orbit-2" aria-expanded="false"><i aria-hidden="true"></i><span>作品</span></button><button data-galaxy-entry="music" class="orbit-3" aria-expanded="false"><i aria-hidden="true"></i><span>唱片</span></button></nav></div><section class="galaxy-preview" aria-label="收藏预览" hidden></section><p class="galaxy-scroll-hint">划过星光 · 向下探索</p>`;
 stage.append(layer);const field=layer.querySelector('.galaxy-field'),canvas=field.querySelector('canvas'),nav=field.querySelector('nav'),preview=layer.querySelector('.galaxy-preview'),buttons=[...nav.querySelectorAll('button')];
 const labels={books:'书房',posts:'文章',projects:'作品',music:'唱片'},descriptions={books:'阅读与收藏，在自己的房间里。',posts:'最近写下的记录与思考。',projects:'做过的事，与正在探索的方向。',music:'为这一刻选一张唱片。'};
 function close(){preview.hidden=true;buttons.forEach(b=>b.setAttribute('aria-expanded','false'));}
 function show(id){let title=descriptions[id],sub='';try{const shelf=library(),item=id==='books'?shelf.books()[0]:id==='posts'?[...shelf.posts()].sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0]:id==='projects'?projects[0]:null;if(item){title=typeof item.title==='object'?(item.title.zh||item.title.en):item.title||item.name?.zh||item.name||title;sub=item.date||'';}if(id==='music'){const state=window.LuliyRecords?.getState();title=state?.name||window.LuliyRecords?.tracks()?.[0]?.name?.zh||title;sub=state?.playing?'正在播放':'你的唱片收藏';}}catch(e){}preview.innerHTML=`<p class="eyebrow">COLLECTION / ${labels[id]}</p><h3>${esc(String(title))}</h3>${sub?`<p>${esc(String(sub))}</p>`:''}<a href="${href('/'+id)}">进入${labels[id]} <span aria-hidden="true">↗</span></a><button aria-label="关闭收藏预览" data-close>×</button>`;preview.hidden=false;buttons.forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.galaxyEntry===id)));preview.querySelector('[data-close]').addEventListener('click',close,{once:true});}
 buttons.forEach(b=>{b.removeAttribute('aria-expanded');b.addEventListener('click',()=>{close();const id=b.dataset.galaxyEntry,target=id==='books'?entrance:document.querySelector({posts:'.home-articles',projects:'.home-works',music:'.home-records'}[id]);if(!target)return;const top=id==='books'?scrollY+entrance.getBoundingClientRect().top+entrance.offsetHeight-stage.offsetHeight:scrollY+target.getBoundingClientRect().top-88;target.setAttribute('tabindex','-1');target.focus({preventScroll:true});window.scrollTo({top:Math.max(0,top),behavior:motion.matches?'instant':'smooth'});},{signal});});
 stage.addEventListener('pointerdown',e=>{if(!e.target.closest('.galaxy-orbits,.galaxy-preview'))close();},{signal});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();},{signal});
 function setRunning(value){if(engine&&enginePlaying!==value){enginePlaying=value;engine.setPlaying(value);}}
 function prepare(){if(engine)return;try{engine=window.createLuliyGalaxyEngine({canvas,reducedMotion:motion.matches});engine.setPalette({background:'#050505',foreground:'#eef4ff',colors:['#72cce7','#9b8fea','#d3d5ff']});engine.setProgress(current);setRunning(visible&&!document.hidden);}catch(e){field.classList.add('galaxy-unavailable');field.setAttribute('aria-label','私人收藏');}}
 function configure(){const cc=document.documentElement.dataset.appearance==='cc';dark=document.documentElement.dataset.theme==='dark'&&!cc;entrance.classList.toggle('cc-opening',cc);entrance.classList.toggle('galaxy-opening',dark);entrance.style.height=dark?(motion.matches?'200svh':'400svh'):'';layer.hidden=!dark;if(dark)prepare();else{setRunning(false);close();}request();}
 canvas.addEventListener('pointerdown',e=>{if(e.button||motion.matches||!matchMedia('(pointer:fine)').matches||current>.2)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('is-dragging');},{signal});
 canvas.addEventListener('pointermove',e=>{if(!dark||motion.matches)return;const r=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect());engine?.setPointer((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2,current<.8);if(drag?.id===e.pointerId){orbit.x=Math.max(-.35,Math.min(.35,orbit.x+(e.clientX-drag.x)*.003));orbit.y=Math.max(-.14,Math.min(.14,orbit.y+(e.clientY-drag.y)*.002));engine?.setOrbit(orbit.x,orbit.y);drag.x=e.clientX;drag.y=e.clientY;}},{signal});
 function release(){drag=null;canvas.classList.remove('is-dragging');engine?.setPointer(0,0,false);}
 canvas.addEventListener('pointerup',release,{signal});canvas.addEventListener('pointercancel',release,{signal});canvas.addEventListener('pointerleave',()=>{if(!drag)release();},{signal});
 const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;setRunning(dark&&visible&&!document.hidden&&current<.97);},{threshold:0});observer.observe(stage);
 document.addEventListener('visibilitychange',()=>setRunning(dark&&visible&&!document.hidden&&current<.97),{signal});motion.addEventListener('change',()=>{engine?.setReducedMotion(motion.matches);configure();request();},{signal});document.addEventListener('luliy:theme',configure,{signal});configure();
 return {update(p,rect){if(!dark)return false;current=p;layer.dataset.phase=p<.22?'galaxy':p<.5?'signature':p<.8?'sentence':'room';if(visible&&rect.top<innerHeight&&rect.bottom>0)engine?.setProgress(motion.matches?(p<.45?0:p<.82?.75:1):p);setRunning(visible&&!document.hidden&&p<.97);
 const expand=motion.matches?(p>=.22?1:0):smooth(.12,.30,p),compact=innerWidth<=700;
 const scaleX=compact?1:.68+.32*expand,scaleY=(compact?.52:.82)+(compact?.48:.18)*expand;field.style.setProperty('--galaxy-touch-scale-x',scaleX);field.style.setProperty('--galaxy-touch-scale-y',scaleY);field.style.transform=`translateY(${(compact?39:8)*(1-expand)}%) scale(${scaleX},${scaleY})`;
 field.style.setProperty('--galaxy-edge',`${9*(1-expand)}%`);
 layer.dataset.fullscreen=String(expand>=.999);
 const stars=1-smooth(.16,.24,p);nav.style.opacity=stars;nav.inert=stars<.1;layer.querySelector('.galaxy-scroll-hint').style.opacity=stars;if(stars<.1)close();const cloud=1-smooth(.85,.97,p);field.style.opacity=cloud;field.inert=cloud<.05;
 const intro=1-smooth(.12,.30,p);copy.style.opacity=intro;copy.style.setProperty('--galaxy-copy-opacity',intro);copy.style.transform='none';copy.inert=intro<.05;foot.style.opacity=0;foot.inert=true;dust.setProgress(p);
 const room=smooth(.87,.99,p),mobile=innerWidth<=700;plane.style.opacity=room;plane.inert=room<.1;plane.style.left=(mobile?0:-7)+'%';plane.style.top=(mobile?32:29)+'%';plane.style.width=(mobile?98:76)+'%';plane.style.height=(mobile?46:65)+'%';if(p>.25&&rect.top<innerHeight&&rect.bottom>0)homeStudy.prepare();homeStudy.setActive(room>.08&&rect.top<innerHeight&&rect.bottom>0);
 const end=smooth(.94,1,p);wide.style.opacity=end;story.style.opacity=end;story.inert=end<.05;label.style.opacity=end;photoCaption.style.opacity=end;landingPortrait.style.opacity=end*.72;landingPortrait.style.transform=`translateY(${(1-end)*36}px)`;shelfBackdrop.style.opacity=end*.24;const header=document.querySelector('#header');header.classList.toggle('is-scrolled',p>.8);header.classList.remove('hero-immersive');return true;},destroy(){abort.abort();observer.disconnect();engine?.destroy();layer.remove();entrance.classList.remove('galaxy-opening');entrance.style.height='';}};
}
window.LuliyGalaxyHome={mount};
})();

(function(){
'use strict';
const D=window.LULIY_DATA,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let renderVersion=0;
let liveCoverCleanup=null,navigationToken=0,activeViewTransition=null;
let lang='zh',route='/',cleanup=[],activeScene=null,footerScene=null,directoryScene=null,frame=0,selected=0,searchButtons=[],searchToken=0,searchTimer=0,articleRestoreY=null,lbPhotos=[],lbIndex=0,lbScale=1,lbRotation=0,lbX=0,lbY=0,toastTimer=0,transitionSource=null,listReturn=null;
try{lang=localStorage.getItem('luliy-language')||'zh';}catch(e){}if(!['zh','en','ja'].includes(lang))lang='zh';
const words={
 home:['首页','Home','ホーム'],photos:['摄影','Photographs','写真'],projects:['作品','Works','作品'],posts:['文章','Articles','随筆'],about:['关于','About','私について'],spaces:['我的空间','My spaces','ブログ'],contact:['联系','Contact','連絡'],close:['关闭','Close','閉じる'],menu:['目录','Directory','目次'],theme:['切换纸墨','Paper / Ink','紙 / 墨'],search:['搜索','Search','検索'],allPhotos:['全部档案','All journeys','すべての記録'],allWorks:['全部作品','All works','すべての作品'],allPosts:['全部文章','All articles','すべての随筆'],exhibition:['现正展出','Now showing','開催中'],exhibitTitle:['把日常，留给光。','A place for the light.','日常に、光を。'],enter:['进入展览','Enter exhibition','展覧会へ'],demo:['演示素材 · 非本人拍摄','Demo imagery · not photographed by Luliy','デモ素材 · 本人撮影ではありません'],demoArticle:['排版示例 · 非已发表文章','Layout sample · not a published article','組版サンプル · 未発表の記事'],archive:['行旅档案','Journeys','旅の記録'],visitBlog:['打开博客','Visit blog','ブログへ'],soon:['Coming soon','Coming soon','Coming soon'],searchTitle:['想去哪里？','Where to?','どちらへ？'],searchPlaceholder:['搜索博客、项目、联系方式…','Search blogs, projects, contact…','ブログ・作品・連絡先を検索…'],searchHint:['↑ ↓ 选择 · Enter 打开 · Esc 关闭 · Ctrl / ⌘ K','↑ ↓ Select · Enter Open · Esc Close · Ctrl / ⌘ K','↑ ↓ 選択 · Enter 開く · Esc 閉じる · Ctrl / ⌘ K'],noResults:['没有找到，试试「博客」「摄影」或「主题」。','No results. Try “blog”, “photos” or “theme”.','見つかりません。「ブログ」「写真」「テーマ」で検索。'],copied:['邮箱已复制','Email copied','メールアドレスをコピーしました'],moreContact:['更多联系','More contact','連絡先'],qr:['博客二维码','Blog QR code','ブログ QR'],uses:['工具架','Uses','道具'],colophon:['网站说明','Colophon','奥付'],back:['返回','Back','戻る'],read:['阅读全文','Read article','続きを読む'],photoCount:['帧','frames','枚'],reading:['目录','Contents','目次'],top:['回到顶部 ↑','Back to top ↑','先頭へ ↑'],blogA:['主博客 · 更多的思考与记录','Main blog · thoughts and notes','メインブログ · 思索と記録'],blogB:['另一个空间 · 不同的视角','Another space · a different perspective','もう一つの場所 · 別の視点'],footerCopy:['在混沌的世界里，依然选择创造。','Keep creating in a world of uncertainty.','混沌とした世界でも、創り続ける。'],vault:['全集','The collection','全集'],qrTitle:['博客 A','Blog A','ブログ A'],error404:['这一页，尚未写下。','This page has not been written.','このページは、まだ白紙。']
};
Object.assign(words,{
 music:['\u5531\u7247','Records','\u30ec\u30b3\u30fc\u30c9'],allRecords:['\u8fdb\u5165\u5531\u7247\u67b6','Open record shelf','\u30ec\u30b3\u30fc\u30c9\u68daへ'],books:['\u4e66\u623f','Study room','\u66f8\u658e'],allBooks:['\u8fdb\u5165\u4e66\u623f','Enter the study room','\u66f8\u658eへ'],exhibitTitle:['在文字里，遇见世界。','A world between the lines.','言葉の中で、世界に出会う。'],enter:['\u8d70\u8fdb\u4e66\u623f','Enter the study room','\u66f8\u658eへ'],noResults:['\u6ca1\u6709\u627e\u5230\uff0c\u8bd5\u8bd5\u300c\u4e66\u623f\u300d\u300c\u4f5c\u54c1\u300d\u6216\u300c\u4e3b\u9898\u300d\u3002','No results. Try “study”, “works” or “theme”.','\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002\u300c\u66f8\u658e\u300d\u300c\u4f5c\u54c1\u300d\u300c\u30c6\u30fc\u30de\u300d\u3067\u691c\u7d22\u3002']
});
function L(a,b,c){return [a,b,c||b][lang==='zh'?0:lang==='en'?1:2];}function t(key){const a=words[key];return a?a[lang==='zh'?0:lang==='en'?1:2]:key;}function href(path){return '#'+path+(lang==='zh'?'':(path.includes('?')?'&':'?')+'lang='+lang);}
function photo(i){return D.photos[(i+D.photos.length)%D.photos.length];}
function photoTitle(p){return lang==='zh'?p.title:lang==='ja'?(p.titleJa||p.titleEn||p.title):(p.titleEn||p.title);}

function routeLink(path,key,cls='text-link'){return `<a class="${cls}" href="${href(path)}">${esc(t(key))}</a>`;}
function title(en,key){return ['books','projects','posts','music','about'].includes(key)?'':`<div class="page-title"><h1>${esc(t(key))}</h1><span>${en}</span></div>`;}
function sectionLabel(en,key){return `<div class="section-label"><span>${en}</span><h2>${esc(t(key))}</h2></div>`;}
function demoLabel(){return `<p class="demo-label">${esc(t('demo'))}</p>`;}
function notify(message){const box=$('#toast');box.textContent=message;box.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('show'),2600);}
function goto(path){if(location.hash===href(path)){render();window.scrollTo({top:0,behavior:'instant'});}else location.hash=href(path);}
function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';$('#themeToggle').setAttribute('aria-pressed',String(dark));$('#themeToggle').setAttribute('aria-label',L('切换为'+(dark?'浅色':'深色')+'主题','Switch to '+(dark?'light':'dark')+' theme',dark?'明るいテーマへ':'暗いテーマへ'));$('meta[name="theme-color"]').content=dark?'#050505':'#faf8f3';[activeScene,footerScene,directoryScene].forEach(s=>s?.setTheme(dark?'dark':'light'));document.dispatchEvent(new CustomEvent('luliy:theme',{detail:{theme:dark?'dark':'light'}}));}
function changeTheme(){const r=document.documentElement,choices=['dark','light','cc'],next=choices[(choices.indexOf(r.dataset.appearance||'dark')+1)%choices.length];r.dataset.appearance=next;r.dataset.theme=next==='dark'?'dark':'light';try{localStorage.setItem('luliy-appearance',next);localStorage.setItem('luliy-paper-ink',r.dataset.theme);}catch(e){}syncTheme();}
const modalFocus=new Map();
function closeOpenDialogs(){for(const d of $$('dialog[open]')){if(d.id)closeDialog(d.id);else if(d.dispatchEvent(new Event('cancel',{cancelable:true})))d.close();}}
function openDialog(id){const d=document.getElementById(id);if(!d||d.open)return;closeOpenDialogs();modalFocus.set(id,document.activeElement);d.showModal();if(id==='directory')window.LuliyDirectoryMotion?.open(d);document.body.style.overflow='hidden';if(id==='directory')requestAnimationFrame(()=>{if(!d.open)return;selectDirectory(Math.max(0,directoryKeys.indexOf(route.slice(1))),false);$('#directoryPortrait').src='assets/site/51d8aa192fa1e25ebfc8.png';});if(id==='searchDialog'){renderSearch();$('#searchInput').focus();}}
const directoryKeys=['books','projects','posts','music','about'];let directoryIndex=0,directoryWheel=0;
function selectDirectory(index,focus=false){directoryIndex=(index+directoryKeys.length)%directoryKeys.length;const key=directoryKeys[directoryIndex],art=$('#directoryArt'),links=$$('#directoryLinks a');art.dataset.preview=key;$('#directoryCaption').textContent=['THE STUDY','SELECTED WORKS','WORDS & IDEAS','THE RECORDS','LULIY · PORTRAIT'][directoryIndex]+' · '+String(directoryIndex+1).padStart(2,'0')+' / '+String(directoryKeys.length).padStart(2,'0');links.forEach((link,i)=>{link.classList.toggle('is-previewed',i===directoryIndex);if(i===directoryIndex)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});if(focus)links[directoryIndex]?.focus({preventScroll:true});}
$('#directory').addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<5)return;e.preventDefault();directoryWheel+=e.deltaY;if(Math.abs(directoryWheel)>48){selectDirectory(directoryIndex+(directoryWheel>0?1:-1));directoryWheel=0;}},{passive:false});
$('#directoryLinks').addEventListener('pointerover',e=>{const a=e.target.closest('a[data-scene]');if(a)selectDirectory(Number(a.dataset.scene));});
$('#directoryLinks').addEventListener('focusin',e=>{const a=e.target.closest('a[data-scene]');if(a)selectDirectory(Number(a.dataset.scene));});
$('#directory').addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();selectDirectory(directoryIndex+(e.key==='ArrowDown'?1:-1),true);}});
function finishDialog(d){const before=modalFocus.get(d.id);modalFocus.delete(d.id);if(d.id==='lightbox')resetLightboxGesture();if(d.id==='searchDialog'){clearTimeout(searchTimer);searchToken++;}if(!document.querySelector('dialog[open]'))document.body.style.overflow='';if(before?.isConnected)before.focus({preventScroll:true});if(d.id==='directory'&&directoryScene){directoryScene.destroy();directoryScene=null;}}
function closeDialog(id){const d=document.getElementById(id);if(!d?.open)return;d.close();finishDialog(d);}
$$('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d.id);});d.addEventListener('close',()=>{if(modalFocus.has(d.id)&&!d.open)finishDialog(d);});d.addEventListener('click',e=>{if(e.target!==d||['directory','lightbox'].includes(d.id))return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d.id);});});
function staticText(){
 document.documentElement.lang=lang==='zh'?'zh-CN':lang==='ja'?'ja':'en';$('#langTrigger').textContent=lang==='zh'?'中文':lang==='ja'?'日本語':'English';$('#directoryOpen').textContent=t('menu');$('#directoryTitle').textContent=t('menu');
 const articleId=route.startsWith('/article/')?route.split('/')[2]:null;
 const activeSection=route.startsWith('/books/')||articleId&&library().books().some(entry=>entry.id===articleId)?'books':route.startsWith('/article/')||route.startsWith('/post/')?'posts':route.slice(1);
 $('#chapterNav').innerHTML=['books','projects','posts','music','about'].map(k=>`<a href="${href('/'+k)}" ${activeSection===k?'aria-current="page"':''}>${esc(t(k))}</a>`).join('');
 $('#directoryLinks').innerHTML=['books','projects','posts','music','about'].map((k,i)=>`<a href="${href('/'+k)}" data-scene="${i}"><span>${esc(t(k))}</span><em aria-hidden="true">${['STUDY','WORKS','ARTICLES','RECORDS','ABOUT'][i]}</em></a>`).join('');
 $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));$('#searchTitle').textContent=t('searchTitle');$('#searchInput').placeholder=t('searchPlaceholder');$('#searchHint').textContent=t('searchHint');$('#usesLink').textContent=t('uses');$('#colophonLink').textContent=t('colophon');$('#contactTitle').textContent=t('about');$('#contactCopy').textContent=t('footerCopy');$('#copyEmail').textContent=L('复制主邮箱','Copy email','メールをコピー');$('#skipLink').textContent=L('跳到正文','Skip to content','本文へ');$('#vaultGate').setAttribute('aria-label',L('长按落款，进入全集','Hold signature to enter the collection','署名を長押しして全集へ'));$('.preview-project-list').innerHTML=projects.map(p=>esc(p[0])).join('<br>');syncTheme();
 const labels={'.brand':['Luliy 首页','Luliy home','Luliy ホーム'],'#chapterNav':['章节导航','Chapters','章のナビゲーション'],'#directoryLinks':['完整目录','Full directory','すべての目次'],'#searchOpen':['搜索与快捷命令','Search and commands','検索とコマンド'],'#searchResults':['搜索结果','Search results','検索結果'],'#lightbox':['照片查看器','Photo viewer','写真ビューアー'],'#lbRotate':['向右旋转照片','Rotate photograph clockwise','写真を右に回転'],'#lbReset':['复位照片','Reset photograph','写真をリセット'],'#lbPrev':['上一张照片','Previous photograph','前の写真'],'#lbNext':['下一张照片','Next photograph','次の写真'],'[data-close="lightbox"]':['关闭照片','Close photograph','写真を閉じる'],'[data-close="searchDialog"]':['关闭搜索','Close search','検索を閉じる'],'[data-close="contactDialog"]':['关闭联系窗口','Close contact dialog','連絡先を閉じる']};Object.entries(labels).forEach(([s,a])=>$(s)?.setAttribute('aria-label',L(...a)));$('#searchLabel').textContent=L('搜索页面、项目与命令','Search pages, projects and commands','ページ・作品・コマンドを検索');$('#usesLink').href=href('/uses');$('#colophonLink').href=href('/colophon');
}
function setLang(next){if(!['zh','en','ja'].includes(next))return;lang=next;try{localStorage.setItem('luliy-language',lang);}catch(e){}$('#langMenu').hidden=true;$('#langTrigger').setAttribute('aria-expanded','false');const current=new URL(location.hash.slice(1)||'/', 'https://luliy.local');current.searchParams.delete('lang');const query=current.searchParams.toString(),target=href(route+(query?'?'+query:''));if(location.hash===target)return;if(route.startsWith('/article/'))articleRestoreY=scrollY;location.hash=target;}

const defaultProjects=[
 ['CET4','\u82f1\u8bed\u56db\u7ea7\u5b66\u4e60\u4e0e\u8bcd\u6c47\u6574\u7406','CET-4 English study and vocabulary','\u82f1\u8a9e\u56db\u7d1a\u306e\u5b66\u7fd2\u3068\u8a9e\u5f59','https://luliy6.42web.io/'],
 ['Latter','\u4fe1\u4ef6\u4e0e\u6587\u5b57\u8bb0\u5f55','Letters and written notes','\u624b\u7d19\u3068\u6587\u7ae0\u306e\u8a18\u9332','https://luliy6.42web.io/Letter.html'],
 ['408','\u8ba1\u7b97\u673a\u4e13\u4e1a\u8bfe\u590d\u4e60\u4e0e\u6574\u7406','Computer science study notes','\u30b3\u30f3\u30d4\u30e5\u30fc\u30bf\u30fc\u30b5\u30a4\u30a8\u30f3\u30b9\u306e\u5b66\u7fd2','https://luliy6.42web.io/408.html']
];
const projects=(Array.isArray(D.collections?.projects)&&D.collections.projects.length?D.collections.projects:defaultProjects).concat([["考研进度看板", "政治、英语二、数学二与408大纲知识树、学习进度与复盘记录。", "Syllabus, progress and study records for Politics, English II, Mathematics II and CS408.", "政治・英語二・数学二・408の学習進度と復習記録。", "https://study.luliy.me/", "./assets/works/kaoyan-dashboard.svg"], ["英语二真题", "2010—2026 全题型真题，支持完整模拟、翻译作文批改与错因复习。", "English II papers 2010–2026, full mock exams, translation and writing feedback.", "2010–2026 年の全形式の過去問、模擬試験と作文添削。", "./works/gpt-english-2-exams.html", "./assets/works/gpt-english-2-exams.svg"], ["考研数学一工作台", "494 张公式卡、交互实验室、闪卡与复习记录。", "494 formula cards, interactive labs, flashcards and study records.", "494 枚の公式カード、実験室と復習記録。", "./works/math-handbook/index.html", "./assets/works/math-handbook.webp"], ["408 历年真题", "2009—2026 年真题，逐题练习、模拟考试与原稿解析。", "408 exam papers 2009–2026, practice, mock exams and explanations.", "2009–2026 年の408過去問、練習と模擬試験。", "./works/408/", "./assets/works/408.svg"], ["数学二真题", "1987—2025 年真题，逐题练习、整套模拟、答案速查与详细解析。", "Mathematics II papers 1987–2025, practice, mock exams and explanations.", "1987–2025 年の数学二過去問、演習、模擬試験、解答と詳しい解説。", "./works/math2/", "./assets/works/math2.svg"], ["22408 考研复习站", "政治、英语二、数学二与计算机 408 真题练习与复习工具。", "A public exam-preparation site for Politics, English II, Mathematics II and CS408.", "政治・英語 II・数学 II・CS408 の過去問演習と受験対策。", "https://22408-kaoyan-tools.pages.dev/", "./assets/works/408.svg"], ["静钟", "日程规划、番茄专注与白噪音，留一段安静的时间。", "A quiet daily planner, focus timer and ambient sound.", "一日の計画、集中タイマーと環境音。", "https://jin.luliy.me/", "./assets/works/jingzhong.svg"]]);
function projectCard(p,i,compact=false){const url=p[4],external=!!url&&/^(?:https?:\/\/|\.\/works\/)/i.test(url),tag=url?'a':'div',cover=p[5]||D.projectCovers?.[String(p[0]).toLowerCase()]||'';return `<${tag} class="project-card reveal" ${url?`href="${external?esc(url):href(url)}"`:''}${external?' target="_blank" rel="noopener noreferrer"':''}><div class="project-cover">${cover?`<img src="${esc(cover)}" alt="${esc(p[0])} 项目封面" loading="lazy" decoding="async">`:`<span class="project-cover-fallback">${esc(p[0])}</span>`}</div><div class="project-caption"><div class="project-title"><span class="numeral">${String(i+1).padStart(2,'0')}</span><h3>${esc(p[0])}</h3><span class="status ${url?'live':'soon'}">${url?L('在线','Live','公開中'):esc(t('soon'))}</span></div><p>${esc(L(p[1],p[2],p[3]))}</p></div></${tag}>`;}

function spaces(){return `<div class="space-links"><a class="space-link" href="https://blog.luliy.me" target="_blank" rel="noopener noreferrer"><h3>Blog A</h3><p>${esc(t('blogA'))}</p><small>blog.luliy.me</small></a><a class="space-link" href="https://mini.luliy.me" target="_blank" rel="noopener noreferrer"><h3>Blog B</h3><p>${esc(t('blogB'))}</p><small>mini.luliy.me</small></a><a class="space-link" href="#/drive"><h3>LULIY Drive</h3><p>${L('私人檔案、音樂與閱讀。','Private files, music and reading.','個人ファイル、音楽と読書。')}</p><small>luliy.me/drive</small></a></div>`;}
const articles=[{id:'curiosity',date:'2026.09.20',title:['在日常里，保持好奇','Staying curious in the everyday','日常の中で、好奇心を'],image:0},{id:'reading',date:'2026.09.19',title:['在字里行间，留下一点自己','A little of ourselves between the lines','行間に、自分の一片を'],image:4},{id:'making',date:'2026.09.18',title:['在混沌的世界里，依然选择创造','Keep creating in uncertainty','混沌の中でも、創り続ける'],image:2}];
function articleTitle(a){return L(...a.title);}
function journalRows(limit){return library().postsContent(limit);}

function sourceFingerprint(node){return node.textContent.replace(/\s+/g,'')+'|'+[...node.querySelectorAll('img')].map(img=>img.getAttribute('src')||'').join('|');}
function library(){return LuliyCollections.create({data:D.collections,lang,href});}
const openingScene='moon';
let introRendered=false,introStarted=performance.now();
function renderHome(){
 const homeSectionLabel=(en,key,path)=>`<a class="section-label" href="${href(path)}"><span>${en}</span><h2>${esc(t(key))}</h2></a>`;
 const shelf=library();
 $('#main').innerHTML=`<section class="entrance library-home ${introRendered?'intro-complete':''}" aria-label="${L('个人空间开篇','A personal opening','私の空間の序章')}"><div class="entrance-stage"><canvas class="ambient-dust" id="ambientDust" aria-hidden="true"></canvas><canvas class="moon-canvas" id="heroMoon" aria-hidden="true"></canvas><div class="opening-copy"><h1 class="signature" data-vault-gate role="button" tabindex="0" aria-label="${L('长按落款，进入全集','Hold signature to enter the collection','署名を長押しして全集へ')}"><span class="signature-word">Luliy</span><svg class="signature-ink" xmlns="http://www.w3.org/2000/svg" viewBox="0 -1822 3490 3153" aria-hidden="true" focusable="false"><defs><mask id="luliy-hand-L" maskUnits="userSpaceOnUse" x="-200" y="-1000" width="2000" height="2700"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path data-signature-stroke data-start="0" data-duration="760" d="M615 1223 Q687 1303 728 1367 C687 1280 669 1200 661 1136 C600 800 315 -170 175 -536" pathLength="1" stroke-width="125"/><path data-signature-stroke data-start="760" data-duration="320" d="M175 -536 C380 -404 937 -243 1238 -255 Q1350 -253 1409 -282" pathLength="1" stroke-width="100"/></g></mask><mask id="luliy-hand-u" maskUnits="userSpaceOnUse" x="-200" y="-1000" width="2000" height="2700"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path data-signature-stroke data-start="1080" data-duration="580" d="M90 389 C15 269 -30 84 27 24 C92 4 213 165 281 345 C257 230 251 101 327 76 C398 33 577 188 665 247" pathLength="1" stroke-width="110"/></g></mask><mask id="luliy-hand-l" maskUnits="userSpaceOnUse" x="-200" y="-1000" width="2000" height="2700"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path data-signature-stroke data-start="1660" data-duration="880" d="M25 270 C113 522 260 912 396 980 C494 1005 337 605 67 306 C10 181 -96 27 -84 -236 C-83 -391 -39 -417 159 -226 C297 -90 430 112 534 250" pathLength="1" stroke-width="80"/></g></mask><mask id="luliy-hand-i" maskUnits="userSpaceOnUse" x="-200" y="-1000" width="2000" height="2700"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path data-signature-stroke data-start="2540" data-duration="400" d="M51 332 C4 231 -33 104 29 74 C94 29 393 143 661 250" pathLength="1" stroke-width="100"/><path data-signature-stroke data-start="2940" data-duration="100" d="M110 498 L111 505" pathLength="1" stroke-width="112"/></g></mask><mask id="luliy-hand-y" maskUnits="userSpaceOnUse" x="-200" y="-1000" width="2000" height="2700"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path data-signature-stroke data-start="3040" data-duration="200" d="M63 385 C38 235 -57 12 64 42" pathLength="1" stroke-width="140"/><path data-signature-stroke data-start="3240" data-duration="600" d="M64 42 C147 40 374 398 444 378 C494 366 399 144 359 35 C292 -200 141 -720 61 -782 C-24 -814 57 -516 138 -434 C208 -281 334 -87 418 28" pathLength="1" stroke-width="120"/><path data-signature-stroke data-start="3840" data-duration="160" d="M418 28 C535 168 738 271 864 258" pathLength="1" stroke-width="80"/></g></mask></defs><g transform="scale(1 -1)"><g transform="translate(0 0)"><path d="M596 1221C598 1201 618 1188 635 1188C640 1188 645 1189 649 1192L660 1205L642 1136C524 607 245 -510 166 -510H165C134 -525 117 -548 117 -563C117 -574 125 -582 142 -582C154 -582 171 -578 192 -569C212 -560 234 -532 254 -517C389 -387 873 -283 1234 -276H1240C1311 -276 1345 -294 1401 -313C1403 -314 1406 -314 1408 -314C1424 -314 1438 -298 1438 -281C1438 -270 1432 -259 1416 -252C1386 -239 1339 -234 1281 -234C974 -234 357 -390 230 -485C226 -488 222 -491 218 -493C335 -257 648 677 681 1126C691 1259 745 1333 750 1347C754 1353 756 1359 756 1366C756 1382 744 1397 728 1397C718 1397 707 1390 697 1373C678 1310 614 1233 596 1221Z" fill="currentColor" mask="url(#luliy-hand-L)"/></g><g transform="translate(803 0)"><path d="M134 372C135 376 135 379 135 382C135 408 110 427 86 427C71 427 56 419 50 401C50 400 -43 221 -43 99C-43 54 -30 17 4 -1C13 -6 23 -8 33 -8C112 -8 212 124 265 216V208C265 149 276 88 319 65C328 60 339 58 351 58C462 58 683 234 683 235C684 239 685 242 685 245C685 258 676 269 664 269C660 269 655 267 650 264C649 263 428 84 348 84C342 84 336 85 332 87C309 99 302 136 302 178C302 245 320 321 320 322C320 348 299 371 281 371C271 371 261 363 258 343C255 287 98 65 38 49C36 49 33 48 31 48C16 48 9 61 9 82C9 139 57 256 134 372Z" fill="currentColor" mask="url(#luliy-hand-u)"/></g><g transform="translate(1463 0)"><path d="M72 334C119 466 199 687 261 793C292 846 322 890 348 920C371 946 389 962 399 962H400C402 962 404 959 407 953C408 950 409 946 409 941C409 835 134 391 72 334ZM41 244C162 325 447 747 447 927C447 942 445 955 441 966C433 987 420 998 403 999H402C379 999 351 979 320 944C293 912 261 866 229 811C96 628 -98 24 -98 -238C-98 -278 -94 -311 -84 -332C-68 -364 -46 -378 -19 -378C162 -378 557 239 558 241V242C558 256 550 264 539 264C530 264 519 258 509 243C508 241 131 -364 -16 -364C-34 -364 -49 -354 -59 -333C-66 -318 -70 -294 -70 -263C-70 -166 -33 7 41 244Z" fill="currentColor" mask="url(#luliy-hand-l)"/></g><g transform="translate(1991 0)"><path d="M91 312C92 315 92 318 92 321C92 342 71 357 50 357C35 357 21 350 13 333C-5 302 -39 217 -39 147C-39 109 -29 75 -1 57C8 46 27 42 52 42C219 42 680 243 681 243C683 245 683 247 683 249C683 259 670 273 652 273C645 273 638 271 630 265C630 265 187 74 70 74C60 74 52 75 47 79C33 88 27 105 27 126C27 196 91 312 91 312ZM127 546C124 547 122 547 119 547C103 547 86 533 78 512C75 505 74 498 74 491C74 474 82 460 95 455C98 454 101 454 104 454C120 454 137 468 144 489C147 496 148 503 148 510C148 527 140 541 127 546Z" fill="currentColor" mask="url(#luliy-hand-i)"/></g><g transform="translate(2636 0)"><path d="M444 398C352 398 157 78 67 62H65C55 62 51 71 49 87C48 96 47 104 47 113C47 192 87 288 106 362C106 364 107 367 107 369C107 392 73 413 48 413C34 413 23 407 20 392C0 313 -48 190 -48 100C-48 85 -47 70 -43 57C-40 27 -17 11 16 11C28 11 40 13 54 17C143 40 389 360 424 360H426C427 359 428 356 428 350C428 307 385 129 380 110C370 71 350 5 338 -38C260 -145 162 -305 111 -422C74 -507 45 -587 28 -649C24 -663 15 -699 15 -733C15 -764 23 -793 51 -802C53 -803 55 -803 58 -803C117 -803 210 -551 223 -517C271 -391 366 -144 407 -2C488 107 642 229 863 237C872 246 879 255 879 263C879 269 874 274 863 277C859 278 854 278 849 278C765 278 522 182 435 65C445 105 495 236 495 321C495 365 482 397 444 398ZM201 -493C148 -633 86 -744 66 -762V-759C66 -743 72 -712 83 -671C100 -610 128 -532 165 -447C196 -374 258 -237 301 -164C271 -259 232 -410 201 -493Z" fill="currentColor" mask="url(#luliy-hand-y)"/></g></g></svg><span class="signature-dot"><span class="signature-fallback" aria-hidden="true">.</span><span class="sr-only">.</span><img src="assets/site/541f3773aab3baa245ef.webp" alt="" aria-hidden="true" decoding="async" onload="this.parentNode.classList.add('is-loaded')"></span></h1><p class="opening-verse">${L('已有的事后必再有，<br>已行的事后必再行。','What has been will be again;<br>what has been done will be done again.','かつてあったことは、また起こる。<br>かつて行われたことは、また行われる。')}</p><div class="opening-blogs"><a href="https://blog.luliy.me" target="_blank" rel="noopener noreferrer">Blog A</a><a href="https://mini.luliy.me" target="_blank" rel="noopener noreferrer">Blog B</a><a href="${href('/posts')}" class="opening-writing-link">${L('阅读文章','Read articles','記事を読む')}</a></div></div><div class="opening-foot"><a class="text-link" href="${href('/books')}">${esc(t('enter'))}</a></div><div class="photo-plane"><div class="home-study-display" aria-label="3D 书房展示"><img class="study-model-poster" src="${D.scenes?.studyModel||''}" alt="${L('书房模型展示','Study model display','書斎の展示')}" decoding="async"></div><p class="study-photo-caption">${L('是的，我热爱阅读。','Yes, I love reading.','そう、私は読書が好き。')}</p></div><div class="wide-meta library-meta" aria-hidden="true"></div><a class="landing-label section-label" href="${href('/books')}"><span>STUDY ROOM</span><h2>${esc(t('books'))}</h2></a><div class="landing-story"><p class="eyebrow">A ROOM FOR READING</p><h2><a class="home-title-link" href="${href('/books')}">${L('要有自己的房间','A room of my own','自分だけの部屋がほしい')}</a></h2><a class="study-landing-external" href="https://blog.luliy.me/book.html" target="_blank" rel="noopener noreferrer">${L('现有书架','Existing bookshelf','今の本棚')}</a></div><img class="study-landing-shelf-backdrop" src="${D.collections.shelfPhotos?.[2]||''}" alt="" aria-hidden="true" decoding="async"><img class="study-landing-portrait" src="https://cloud.luliy.me/api/image?path=shared%2Fwei.png" alt="" aria-hidden="true" decoding="async"></div></section><div class="shell"><section class="section home-wide-section home-works" data-ghost="WORKS">${homeSectionLabel('WORKS','projects','/projects')}<div class="home-works-exhibit" id="homeWorksExhibit"></div></section><section class="section home-wide-section home-feature-section home-articles" data-ghost="ARTICLES">${homeSectionLabel('ARTICLES','posts','/posts')}<div class="home-pinned"${shelf.pinnedContent()?'':' hidden'}>${shelf.pinnedContent()}</div><div class="article-feature-body"><img class="home-corner-image" src="https://cloud.luliy.me/api/image?path=shared%2FWritten.png" alt="" aria-hidden="true" loading="lazy" decoding="async"><div class="article-feature-index">${shelf.postsContent(6,true)}</div></div></section><section class="section music-section home-wide-section home-feature-section home-records" id="recordsHome" data-ghost="RECORDS">${homeSectionLabel('RECORDS','music','/music')}<div class="record-feature-body"><div class="record-mount" id="recordMount"></div><img class="home-corner-image" src="https://cloud.luliy.me/api/image?path=shared%2Flisten.png" alt="" aria-hidden="true" loading="lazy" decoding="async"></div></section></div>`;
 const firstOpening=!introRendered;introRendered=true;
 setupHome();setupRecords();cleanup.push(LuliyProjects.mount({root:$('#homeWorksExhibit'),projectCard,projects,L,esc}));
 if(firstOpening)introStarted=performance.now();cleanup.push(window.LuliySignatureMount({firstOpening}));
}
function setupHome(){
 const entrance=$('.entrance'),stage=$('.entrance-stage'),plane=$('.photo-plane'),copy=$('.opening-copy'),foot=$('.opening-foot'),wide=$('.wide-meta'),story=$('.landing-story'),label=$('.landing-label'),landingPortrait=$('.study-landing-portrait'),photoCaption=$('.study-photo-caption'),shelfBackdrop=$('.study-landing-shelf-backdrop');
 const homeStudy=window.LuliyStudyDisplay.mount($('.home-study-display'),{books:studyData(library()).books,projects,projectCovers:D.projectCovers||{},portraits:D.scenes?.studyPortraits||[],lang});window.LuliyHomepagePrepare=()=>homeStudy.prepare();window.LuliyHomepageCancelPrepare=()=>homeStudy.cancelPrepare();window.LuliyHomepageRetry=()=>homeStudy.retryPrepare();cleanup.push(()=>{delete window.LuliyHomepagePrepare;delete window.LuliyHomepageCancelPrepare;delete window.LuliyHomepageRetry;homeStudy.destroy();});
 activeScene=LuliyMoon.mount($('#heroMoon'),{scene:openingScene,surface:D.scenes?.moon,portrait:D.scenes?.portrait,lich:D.scenes?.lich,study:D.collections?.shelfPhotos?.[2]});
 activeScene.setTheme(document.documentElement.dataset.theme);
 const dust=LuliyAmbient.mount($('#ambientDust'),stage);
 let raf=0;const abort=new AbortController();
 const clamp=v=>Math.max(0,Math.min(1,v));const smooth=(a,b,v)=>{const q=clamp((v-a)/(b-a));return q*q*(3-2*q);};
 const heroCanvas=$('#heroMoon'),finePointer=matchMedia('(pointer:fine)');
 let pointerX=0,pointerY=0,shiftX=0,shiftY=0,parallaxStrength=1,parallaxFrame=0;
 function easePointer(){parallaxFrame=0;if(document.hidden||!heroCanvas.isConnected)return;const x=pointerX*9*parallaxStrength,y=pointerY*6*parallaxStrength;shiftX+=(x-shiftX)*.13;shiftY+=(y-shiftY)*.13;heroCanvas.style.translate=`${shiftX.toFixed(2)}px ${shiftY.toFixed(2)}px`;if(Math.abs(x-shiftX)+Math.abs(y-shiftY)>.05)parallaxFrame=requestAnimationFrame(easePointer);}
 function requestParallax(){if(parallaxStrength<.001||document.hidden)return;if(!parallaxFrame&&!motion.matches&&finePointer.matches)parallaxFrame=requestAnimationFrame(easePointer);}
 function onPointer(e){if(motion.matches||!finePointer.matches||parallaxStrength<.001)return;const bounds=(window.LuliyLayoutRect?.(stage)||stage.getBoundingClientRect());pointerX=clamp((e.clientX-bounds.left)/bounds.width)*2-1;pointerY=clamp((e.clientY-bounds.top)/bounds.height)*2-1;dust.setPointer(e.clientX-bounds.left,e.clientY-bounds.top);requestParallax();}
 function clearPointer(){pointerX=pointerY=0;dust.clearPointer();requestParallax();}

 const galaxy=LuliyGalaxyHome.mount({entrance,stage,homeStudy,dust,copy,foot,plane,story,label,photoCaption,landingPortrait,shelfBackdrop,wide,library,projects,href,esc,motion,request});cleanup.push(galaxy.destroy);
 function updateCCMoon(p,rect){
  activeScene?.setJourney(-1);activeScene?.setMorph(0);activeScene?.setProgress(0);activeScene?.setScene('moon');activeScene?.setTheme('dark');
  entrance.style.setProperty('--cc-moon-opacity',String(1-smooth(.48,.68,p)));
  parallaxStrength=0;cancelAnimationFrame(parallaxFrame);parallaxFrame=0;shiftX=shiftY=0;heroCanvas.style.translate='0px 0px';
  const intro=1-smooth(.20,.38,p);copy.style.opacity=intro;copy.style.setProperty('--galaxy-copy-opacity',intro);copy.style.transform='none';copy.inert=intro<.05;foot.style.opacity=0;foot.inert=true;
  dust.setProgress(0);
  const room=smooth(.60,.90,p),mobile=innerWidth<=700;plane.style.opacity=room;plane.inert=room<.1;plane.style.left=(mobile?0:-7)+'%';plane.style.top=(mobile?32:29)+'%';plane.style.width=(mobile?98:76)+'%';plane.style.height=(mobile?46:65)+'%';
  if(p>.35&&rect.top<innerHeight&&rect.bottom>0)homeStudy.prepare();homeStudy.setActive(room>.08&&rect.top<innerHeight&&rect.bottom>0);
  const end=smooth(.88,1,p);wide.style.opacity=end;story.style.opacity=end;story.inert=end<.05;label.style.opacity=end;photoCaption.style.opacity=end;landingPortrait.style.opacity=end*.72;landingPortrait.style.transform=`translateY(${(1-end)*36}px)`;shelfBackdrop.style.opacity=end*.24;
  const header=document.querySelector('#header');header.classList.toggle('is-scrolled',p>.8);header.classList.remove('hero-immersive');
 }

 function update(){raf=0;if(!entrance.isConnected)return;const rect=entrance.getBoundingClientRect(),travel=entrance.offsetHeight-stage.offsetHeight,p=clamp(-rect.top/Math.max(1,travel));if(document.documentElement.dataset.appearance==='cc'){updateCCMoon(p,rect);return;}if(galaxy.update(p,rect))return;activeScene?.setJourney(motion.matches?-1:p);activeScene?.setMorph(0);activeScene?.setProgress(motion.matches?0:smooth(.43,.86,p));dust.setProgress(p);parallaxStrength=1-smooth(.22,.58,p);if(parallaxStrength<.001){cancelAnimationFrame(parallaxFrame);parallaxFrame=0;shiftX=shiftY=0;heroCanvas.style.translate='0px 0px';}else requestParallax();const intro=1-smooth(.38,.55,p);copy.style.opacity=intro;copy.style.transform=`translateY(${-p*80}px)`;foot.style.opacity=intro;copy.inert=intro<.05;foot.inert=intro<.05;const roomOpacity=smooth(.91,.995,p);plane.style.opacity=roomOpacity;plane.inert=roomOpacity<.1;if(p>.20&&rect.bottom>0&&rect.top<innerHeight)homeStudy.prepare();homeStudy.setActive(roomOpacity>.08&&rect.bottom>0&&rect.top<innerHeight);const land=1,mobile=innerWidth<=700;/* Keep the study clearly on the left while allowing the model to use its full stage. */plane.style.left=(mobile?0:-7)*land+'%';plane.style.top=(mobile?32:29)*land+'%';plane.style.width=(100-(mobile?2:24)*land)+'%';plane.style.height=(100-(mobile?54:35)*land)+'%';const metaOpacity=smooth(.985,1.,p);wide.style.opacity=metaOpacity;wide.inert=metaOpacity<.05;const storyOpacity=smooth(.985,1.,p);story.style.opacity=storyOpacity;story.inert=storyOpacity<.05;label.style.opacity=storyOpacity;photoCaption.style.opacity=storyOpacity;shelfBackdrop.style.opacity=storyOpacity*.24;landingPortrait.style.opacity=storyOpacity*.72;landingPortrait.style.transform=`translateY(${(1-storyOpacity)*36}px)`;const header=$('#header');header.classList.toggle('is-scrolled',p>.58);header.classList.toggle('hero-immersive',p>.58&&p<.995);}
 function request(){if(!raf)raf=requestAnimationFrame(update);}
 window.addEventListener('scroll',request,{passive:true,signal:abort.signal});
 window.addEventListener('resize',request,{passive:true,signal:abort.signal});
 motion.addEventListener('change',request,{signal:abort.signal});
 stage.addEventListener('pointermove',onPointer,{passive:true,signal:abort.signal});
 stage.addEventListener('pointerleave',clearPointer,{signal:abort.signal});
 window.addEventListener('blur',clearPointer,{signal:abort.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);cancelAnimationFrame(parallaxFrame);raf=parallaxFrame=0;}else{request();requestParallax();}},{signal:abort.signal});
 document.addEventListener('luliy:theme',e=>dust.setTheme(e.detail.theme),{signal:abort.signal});
 cleanup.push(()=>{abort.abort();cancelAnimationFrame(raf);cancelAnimationFrame(parallaxFrame);dust.destroy();heroCanvas.style.translate='';});
 update();
}
function animateScroll(target,duration){if(motion.matches){scrollTo(0,target);return;}const start=scrollY,begin=performance.now(),abort=new AbortController();let id=0;const stop=()=>{cancelAnimationFrame(id);abort.abort();};['wheel','touchstart','pointerdown','keydown'].forEach(k=>window.addEventListener(k,stop,{once:true,passive:true,signal:abort.signal}));function step(now){const q=Math.min(1,(now-begin)/duration),ease=1-Math.pow(1-q,5);scrollTo({top:start+(target-start)*ease,behavior:'instant'});if(q<1)id=requestAnimationFrame(step);else abort.abort();}id=requestAnimationFrame(step);cleanup.push(stop);}
const wallPhotos=[
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'_看图王_看图王.jpg'),title:'照片 01',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'.jpg'),title:'照片 02',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'9.png'),title:'照片 03',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'9b6feba7gy1i9snyrv0huj22tc4801l0.jpg'),title:'照片 04',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'9b6feba7gy1i9snz2pzxkj22tc480b2c_105324.jpg'),title:'照片 05',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'IMG_2913.JPEG'),title:'照片 06',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'IMG_2893.JPEG'),title:'照片 07',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'footer-smile-transparent.png'),title:'照片 08',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'ChatGPT Image Feb 9, 2026, 01_44_34 AM_upscayl_2x_high-fidelity-4x.png'),title:'照片 09',credit:''},
 {src:'https://cloud.luliy.me/api/image?path='+encodeURIComponent('shared/照片墙/'+'ChatGPT Image Feb 9, 2026, 01_44_34 AM_upscayl_2x_high-fidelity-4x_upscayl_1x_upscayl-standard-4x.png'),title:'照片 10',credit:''}
];
function renderProjects(){cleanup.push(LuliyProjects.render({root:$('#main'),title,projectCard,projects,spaces,sectionLabel,wallPhotos,L,esc}));}

function postsMarkup(shelf,year='',tag=''){return `<div class="shell subpage post-archive">${title('ARTICLES','posts')}${shelf.postsPage(year,tag)}<div class="section-more"><a class="text-link" href="https://blog.luliy.me/" target="_blank" rel="noopener noreferrer">${L('访问博客一','Visit Blog A','ブログ A へ')}</a></div></div>`;}
function renderPosts(){const params=new URL(location.hash.slice(1)||'/', 'https://luliy.local').searchParams,view=params.get('view')==='chronicle'?'chronicle':'archive',shelf=library();
 const tabs=`<nav class="article-modes" aria-label="${L('文章浏览方式','Browse writing','記事の表示')}">${[['archive',L('文章','Articles','記事')],['chronicle',L('编年史','Chronicle','年代記')]].map(([key,name])=>`<a href="${href('/posts?view='+key)}" ${view===key?'aria-current="page"':''}>${name}</a>`).join('')}</nav>`;
 $('#main').innerHTML=`<div class="shell subpage post-archive">${title('ARTICLES','posts')}${tabs}${view==='chronicle'?'<div id="chronicleBrowse" aria-live="polite"></div>':shelf.postsPage(params.get('year')||'',params.get('tag')||'',view,params.get('group')||'',true)}<div class="section-more"><a class="text-link" href="https://blog.luliy.me/${view==='chronicle'?'chronicle.html':view==='archive'?'archive.html':''}" target="_blank" rel="noopener noreferrer">${L('查看原博客','Original blog','元のブログ')}</a></div></div>`;
 if(view!=='chronicle'){const host=$('#main .post-archive'),bar=host.querySelector('.article-filter-bar'),tabs=host.querySelector('.article-modes');if(bar&&tabs){const toolbar=document.createElement('div');toolbar.className='article-browse-toolbar';tabs.before(toolbar);toolbar.append(tabs,bar);host.classList.add('has-compact-toolbar');}cleanup.push(LuliyChronicle.mountFilters($('#main')));}
 if(view==='chronicle')cleanup.push(LuliyChronicle.mount({root:$('#chronicleBrowse'),shelf,params,href,esc,L}));
}
function renderStudyContent(kind,root,filters={}){if(kind==='projects')return LuliyProjects.render({root,title,projectCard,projects,spaces,sectionLabel,wallPhotos,L,esc});const shelf=library();root.innerHTML=postsMarkup(shelf,filters.year||'',filters.tag||'');return shelf.hydrateCovers(root);}

function articleSections(a){
 const intro=L('一个喜欢写作、阅读、技术与理财的普通人。正在努力把生活过成自己喜欢的样子。这里是我的互联网小宇宙，记录成长、思考与热爱。','An ordinary person who enjoys writing, reading, technology and personal finance. Working toward a life I love. This is my small corner of the internet, for growth, thought and the things I care about.','書くこと、読むこと、技術、資産形成が好きな一人。自分の好きな暮らしに近づきながら、成長と思索と好きなものを記録していく。');
 const paragraphs=a.id==='curiosity'?[L('好奇不一定指向很远的地方。它也可以是一页没有读完的书、一条刚刚记下的问题，或是走过熟悉街道时，忽然停下的一次目光。','Curiosity does not always point somewhere far away. It can begin with an unfinished page, a question written down, or a moment of looking again on a familiar street.','好奇心は、遠い場所にだけ向かうものではない。読みかけの一頁、書き留めた問い、いつもの道で立ち止まる一瞬にも宿る。'),L('把这些零散的瞬间放在一起，记录就有了意义。不是为了给每一天一个答案，而是让那些值得继续想下去的事情，有一个可以回来的地方。','Collected together, small moments give a notebook its purpose. Not to answer every day, but to give unfinished thoughts somewhere to return to.','小さな瞬間を集めると、記録に意味が生まれる。毎日に答えを出すためではなく、考え続けたいことに戻れる場所をつくるために。')]:a.id==='reading'?[L('阅读时，句子与自己的经验相遇。同一本书会在不同的时刻，留下不同的划线。那些边角的笔记，往往比整齐的摘要更接近当时的自己。','A sentence meets our own experience as we read. The same book invites different underlines at different times. A note in the margin can feel closer to who we were than a perfect summary.','読書の中で、文は自分の経験に出会う。同じ本でも、読む時期によって線を引く場所が変わる。余白のメモは、整った要約よりも、その時の自分に近い。'),L('不必急着把所有读过的东西变成结论。留下一个问题，或者记住一个画面，也是一种收获。','Not everything we read needs to become a conclusion. Keeping a question, or remembering an image, can be enough.','読んだものすべてを、急いで結論にしなくてもいい。問いを残すことも、風景を覚えていることも、収穫になる。')]:[L('一个小工具、一段文字、一张整理好的清单，都可以是创造的开始。先让它真实地发生，再在使用中慢慢打磨。','A small tool, a paragraph, a carefully arranged list: any of these can be a beginning. Let it exist first, then refine it through use.','小さな道具、一段落の文章、整理したリスト。どれも創造の始まりになれる。まず形にして、使いながら少しずつ磨いていく。'),L('作品不必一次完成。给未完成的事情一个位置，也给日后的自己留一点余地。','A work does not have to arrive all at once. Give unfinished things a place, and leave room for your future self.','作品は一度に完成しなくてもいい。未完成のものにも居場所を与え、未来の自分のために余地を残す。')];
 return [{id:'opening',heading:L('从这里出发','A place to begin','ここから'),html:`<p>${esc(intro)}</p><p>${esc(paragraphs[0])}</p>`},{id:'notes',heading:L('给思考一点留白','Room for thought','考える余白'),html:`<p>${esc(paragraphs[1])}</p><blockquote>${L('保持好奇，持续前进。','Keep curious, keep going.','好奇心を持って、進み続ける。')}</blockquote><figure><button data-lightbox="${a.image}" style="padding:0;width:100%"><img src="${photo(a.image).src}" alt="${esc(photoTitle(photo(a.image)))}" loading="lazy"></button><figcaption>${esc(t('demo'))} · ${esc(photo(a.image).credit)}</figcaption></figure>`},{id:'practice',heading:L('慢慢积累','Little by little','少しずつ'),html:`<p>${L('把想法写下来，把喜欢的东西收好，把正在做的事继续做下去。留下可阅读的痕迹，也为新的想法保留空间。','Write the thought down, keep what you love, and continue the work already begun. Leave a readable trace, with room for the next idea.','考えを書き留め、好きなものを大切にし、始めたことを続ける。読める足跡と、新しい考えのための余白を残す。')}</p><ul><li>${L('写作：把模糊的感受变得清晰。','Writing: make a vague feeling clearer.','書くこと：曖昧な感覚を、少し明確に。')}</li><li>${L('阅读：让熟悉的问题出现新的角度。','Reading: find a new angle on an old question.','読むこと：慣れた問いに、新しい角度を。')}</li><li>${L('创造：让一个小想法成为可以使用的东西。','Making: turn a small idea into something usable.','つくること：小さな発想を、使えるものに。')}</li></ul><p>${L('正式的文章与记录，欢迎继续前往','For published writing, continue to','公開記事と記録は、こちらへ：')} <a href="https://blog.luliy.me" target="_blank" rel="noopener">Blog A</a> / <a href="https://mini.luliy.me" target="_blank" rel="noopener">Blog B</a>。</p>`}];
}
function renderArticle(id){const a=articles.find(x=>x.id===id);if(!a){render404();return;}const sections=articleSections(a),next=articles[(articles.indexOf(a)+1)%articles.length];$('#main').innerHTML=`<div class="shell article-head"><p class="eyebrow">ARTICLES · ${esc(t('demoArticle'))}</p><h1>${esc(articleTitle(a))}</h1><div class="article-meta"><a class="reader-return" href="${href('/posts')}" aria-label="${L('返回文章列表','Back to articles','記事一覧へ戻る')}" title="${L('返回文章列表','Back to articles','記事一覧へ戻る')}">←</a><time>${a.date}</time><span>LULIY</span><span>${L('约 3 分钟','3 min read','約3分')}</span></div></div><div class="shell article-cover"><img src="${photo(a.image).src}" alt="${esc(photoTitle(photo(a.image)))}"></div><div class="reading-shell"><article class="article-body">${sections.map(s=>`<section id="article-${s.id}"><h2>${esc(s.heading)}</h2>${s.html}</section>`).join('')}<div class="article-end">${routeLink('/posts','back')}<a class="text-link" href="${href('/post/'+next.id)}">${esc(articleTitle(next))}</a></div></article><aside class="article-toc"><p>${esc(t('reading'))}</p><nav>${sections.map(s=>`<a href="#article-${s.id}" data-article-anchor="${s.id}">${esc(s.heading)}</a>`).join('')}</nav></aside></div>`;mountReadingGuide($('.article-body'));mountDemoSectionLinks(a.id);}
function mountDemoSectionLinks(articleId){
 const body=$('.article-body'),url=new URL(location.hash.slice(1)||'/', 'https://luliy.local'),section=url.searchParams.get('section');
 body.querySelectorAll('h2,h3,h4,h5,h6').forEach((heading,index)=>{
  if(!heading.id)heading.id='heading-'+(heading.closest('section')?.id||index);
  const button=document.createElement('button');button.type='button';button.className='reader-heading-link';button.textContent='⌁';button.title=L('复制本节链接','Copy section link','この節のリンクをコピー');button.setAttribute('aria-label',button.title);
  button.addEventListener('click',async()=>{const base=location.href.split('#')[0]+href('/post/'+articleId);const link=base+(base.includes('?')?'&':'?')+'section='+encodeURIComponent(heading.id);let ok=false;try{await navigator.clipboard.writeText(link);ok=true;}catch(e){const field=document.createElement('textarea');field.value=link;field.style.cssText='position:fixed;opacity:0';document.body.append(field);field.select();ok=document.execCommand('copy');field.remove();}notify(ok?L('章节链接已复制','Section link copied','節のリンクをコピーしました'):L('请从地址栏复制链接','Copy the link from the address bar','アドレスバーからコピーしてください'));});
  heading.append(button);
 });
 if(section)requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=[...body.querySelectorAll('h2,h3,h4,h5,h6')].find(h=>h.id===section);target?.scrollIntoView({block:'start'});}));
}
function renderAbout(){
 const fallback=`<p>${L('一个喜欢写作、阅读、技术与理财的普通人。','An ordinary person who enjoys writing, reading, technology and personal finance.','書くこと、読むこと、技術、資産形成が好きな一人。')}</p><p>${L('正在努力把生活过成自己喜欢的样子。','Working toward a life I love.','自分の好きな暮らしに、少しずつ近づく。')}</p>`;
 $('#main').innerHTML=`<div class="shell subpage about-page">${title('ABOUT','about')}<div class="about-grid"><div class="about-intro"><div class="signature">Luliy<span class="signature-dot"><span class="signature-fallback" aria-hidden="true">.</span><span class="sr-only">.</span><img src="assets/site/541f3773aab3baa245ef.webp" alt="" aria-hidden="true" decoding="async" onload="this.parentNode.classList.add('is-loaded')"></span></div><p class="about-epigraph">高余冠之岌岌兮，长余佩之陆离。</p></div><aside class="about-visual-sticky" aria-label="${L('关于照片','About photograph','プロフィール写真')}"><img src="${esc(D.scenes?.aboutPhoto||'')}" alt="" decoding="async" fetchpriority="high" onerror="this.hidden=true"></aside><div class="about-copy"><div class="about-live" id="aboutLive" aria-live="polite"><p>${L('正在打开博客的关于页…','Opening the blog profile…','ブログのプロフィールを読み込み中…')}</p></div><p class="about-source"><a href="https://blog.luliy.me/about.html" target="_blank" rel="noopener noreferrer">${L('博客关于页原文','Original blog profile','ブログの原文')}</a></p></div></div>${spaces()}<section class="section"><div class="section-heading"><h3>${esc(t('contact'))}</h3><button class="text-link" data-contact>${esc(t('moreContact'))}</button></div><p>${esc(t('footerCopy'))}</p></section></div>`;
 LuliyReader.load({bodyUrl:'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/about.html?refresh='+Date.now(),url:'https://blog.luliy.me/about.html'}).then(fragment=>{const host=$('#aboutLive');if(route==='/about'&&host)host.replaceChildren(fragment);}).catch(()=>{const host=$('#aboutLive');if(route==='/about'&&host)host.innerHTML=fallback+`<p>${L('博客内容暂时无法读取，请打开原文。','The live profile is temporarily unavailable. Open the original page.','ブログの本文を読み込めません。原文をご覧ください。')}</p>`;});
}
function setupRecords(){
 const el=$('#recordMount');if(!el)return;let instance=null;
 const home=!!el.closest('.home-records'),tour=!home&&new URLSearchParams(location.hash.split('?')[1]||'').get('exhibition')==='1'?document.createElement('div'):null;
 if(tour){tour.className='lr-tour-track';tour.id='recordTour';el.before(tour);}
 let preparing=false,alive=true,frame=0;el.dataset.mountState='loading';el.setAttribute('aria-busy','true');
 function placeholder(failed=false){el.replaceChildren();const status=document.createElement('p');status.className='records-loading';status.setAttribute('role','status');status.textContent=failed?L('唱片載入失敗','Records failed to load','読み込みに失敗しました'):L('正在準備唱片…','Preparing records…','レコードを準備しています…');el.append(status);if(failed){const retry=document.createElement('button');retry.type='button';retry.className='text-link';retry.textContent=L('重試','Retry','再試行');retry.onclick=prepare;el.append(retry);}}
 placeholder();
 function prepare(){if(!alive||preparing||instance)return;preparing=true;el.dataset.mountState='loading';el.setAttribute('aria-busy','true');placeholder();const go=()=>{frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{if(!alive)return;try{if(!window.LuliyRecords)throw Error('Records unavailable');el.replaceChildren();instance=LuliyRecords.mount(el,{lang,theme:document.documentElement.dataset.theme,layout:home?'home':'standalone'});const portrait=el.parentElement.querySelector(':scope > .home-corner-image');if(portrait){portrait.loading='eager';const layout=el.querySelector('.lr-layout'),group=document.createElement('div');group.className='home-player-group';group.append(layout.querySelector('.lr-scene'),layout.querySelector('.lr-meta'));layout.append(group,portrait);}if(tour)instance.attachTour(tour);el.dataset.mountState='ready';io.disconnect();}catch(error){instance?.destroy();instance=null;el.dataset.mountState='error';placeholder(true);console.error('Records mount failed',error);}finally{preparing=false;el.setAttribute('aria-busy','false');}});});};if(!window.LuliyLoadThree&&window.LuliyThreeReady)window.LuliyThreeReady().then(go,go);else go();}
 const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))prepare();},{rootMargin:home?'1400px':'650px'});io.observe(el);if(tour)io.observe(tour);
 cleanup.push(()=>{alive=false;cancelAnimationFrame(frame);io.disconnect();instance?.destroy();tour?.remove();});
}

function renderMusic(){$('#header').classList.remove('music-nav-hidden');$('#header').classList.add('inner-nav-collapsed');$('#main').innerHTML=`<div class=\"shell subpage music-page\">${title('RECORDS','music')}<div class=\"record-mount\" id=\"recordMount\"></div></div>`;document.querySelector('.music-page')?.classList.toggle('is-exhibition',new URLSearchParams(location.hash.split('?')[1]||'').get('exhibition')==='1');setupRecords();}
let studyView=null,activeStudy=null;
function studyData(shelf,category){
 const notes=category?shelf.entries(category):shelf.books(),physical=(D.collections.personalShelves||[]).flatMap(section=>section.books||[]),books=notes.map(book=>({...book,available:!!book.url,source:'book.html'}));
 const key=title=>String(title).normalize('NFKC').replace(/[\s《》〈〉]/g,'').toLowerCase();
 if(!category)physical.forEach(name=>{if(!books.some(book=>key(book.title)===key(name)))books.push({id:null,title:name,physical:true,available:false,readingState:'want'});});
 const pinned=shelf.pins(),pinIds=new Set(pinned.map(pin=>pin.id)),posts=[...pinned,...shelf.posts().map(entry=>({...entry,pinned:pinIds.has(entry.id)}))],seen=new Set();
 const articles=posts.filter(entry=>{if(seen.has(entry.id))return false;seen.add(entry.id);return true;});
 return {books,articles,projects,projectCovers:D.projectCovers||{},portraits:D.scenes?.studyPortraits||[]};
}
function renderBooks(category){
 const shelf=library(),topic=category?shelf.categories.find(item=>item.id===category):null;
 if(category&&!topic){render404();return;}
 $('#main').innerHTML='<div class="study-room-intro" role="status" aria-label="Luliy的房间"><span>Luliy的房间</span></div><section class="study-room" id="studyRoom"></section>';
 const intro=$('.study-room-intro'),started=performance.now(),host=$('#studyRoom'),returning=!!window.__luliyRoomVisited;intro.classList.toggle('is-returning',returning);host.classList.add('is-entering');
 let room=null,alive=true,paintFrame=0,mountFrame=0,revealTimer=0,removeTimer=0;
 document.body.classList.add('study-intro-active');host.inert=true;
 function revealRoom(){if(!alive)return;const duration=motion.matches?0:returning?850:1500,minHold=motion.matches?160:returning?350:1000;revealTimer=setTimeout(()=>{if(!alive)return;window.__luliyRoomVisited=true;room?.beginEntrance(duration);host.classList.add('is-revealing');intro.classList.add('is-done');removeTimer=setTimeout(()=>{if(!alive)return;intro.remove();host.inert=false;host.classList.remove('is-entering');document.body.classList.remove('study-intro-active');},duration);},Math.max(0,minHold-(performance.now()-started)));}
 // Paint the title before constructing the scene; reveal only after its first rendered frame.
 paintFrame=requestAnimationFrame(()=>{mountFrame=requestAnimationFrame(()=>{if(!alive)return;room=activeStudy=LuliyStudyRoom.mount(host,{...studyData(library(),category),lang,theme:document.documentElement.dataset.theme,href,initialView:studyView,renderContent:renderStudyContent,onReady:revealRoom});});});
 cleanup.push(()=>{alive=false;cancelAnimationFrame(paintFrame);cancelAnimationFrame(mountFrame);clearTimeout(revealTimer);clearTimeout(removeTimer);document.body.classList.remove('study-intro-active');if(room){studyView=room.getView();room.destroy();if(activeStudy===room)activeStudy=null;}});
}
function mountReadingGuide(body){
 const layout=body.closest('.source-layout,.reading-shell'),aside=layout?.querySelector('.source-toc,.article-toc'),nav=aside?.querySelector('nav');
 if(!layout||!aside||!nav)return;
 if(!aside.id)aside.id='readerToc';
 let toggle=layout.querySelector('.reader-toc-toggle'),top=layout.querySelector('.reader-back-top');
 if(!toggle||!top){const float=document.createElement('div');float.className='reader-float';float.innerHTML=`<button type="button" class="reader-toc-toggle" aria-controls="${aside.id}" aria-expanded="false" aria-label="${L('打开文章目录','Open article contents','記事の目次を開く')}">☰</button><button type="button" class="reader-back-top" aria-label="${L('回到文章顶部','Back to article top','記事の先頭へ')}">↑</button>`;layout.append(float);toggle=float.firstElementChild;top=float.lastElementChild;}
 toggle.innerHTML='<span aria-hidden="true">☰</span>';
 // The blog's reading-progress ring, fitted to the existing return-to-top control.
 const ringCirc=2*Math.PI*20;
 top.innerHTML=`<svg class="reader-progress-ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="reader-ring-bg" cx="22" cy="22" r="20"></circle><circle class="reader-ring-fg" cx="22" cy="22" r="20"></circle></svg><span aria-hidden="true">↑</span>`;
 const ring=top.querySelector('.reader-ring-fg');ring.style.strokeDasharray=ringCirc;ring.style.strokeDashoffset=ringCirc;
 const tocHeader=aside.querySelector(':scope > p');
 if(tocHeader){tocHeader.innerHTML=`<span>${L('目录','Contents','目次')}</span><button type="button" class="reader-toc-close" aria-label="${L('关闭文章目录','Close article contents','目次を閉じる')}">×</button>`;}
 if(body.classList.contains('article-body')&&tocHeader&&window.LuliyReaderTools){
  const button=document.createElement('button');button.type='button';button.className='reader-color-toggle';button.textContent='Aa';button.setAttribute('aria-label',L('正文颜色设置','Text color settings','本文の色設定'));button.setAttribute('aria-expanded','false');
  tocHeader.insertBefore(button,tocHeader.querySelector('.reader-toc-close'));
  const panel=document.createElement('div');panel.className='reader-color-panel';panel.hidden=true;panel.append(window.LuliyReaderTools.colorPalette(lang));tocHeader.after(panel);
  button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));});
 }
 const headings=[...body.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>h.textContent.trim());
 aside.hidden=toggle.hidden=headings.length<2&&!body.closest('.source-reading');nav.replaceChildren();
 if(!headings.length&&body.closest('.source-reading')){const empty=document.createElement('span');empty.className='reader-toc-empty';empty.textContent=L('本文暂无章节','No sections in this article','この記事に見出しはありません');nav.append(empty);}
 const tree=document.createElement('ul');tree.className='reader-toc-tree';nav.append(tree);
 const nodes=[],stack=[];
 const links=headings.map((heading,index)=>{
  if(!heading.id)heading.id='reading-heading-'+index;
  const level=Number(heading.tagName.slice(1));while(stack.length&&stack.at(-1).level>=level)stack.pop();
  const parent=stack.at(-1)||null,item=document.createElement('li'),row=document.createElement('div'),children=document.createElement('ul');
  row.className='reader-toc-row';children.id=aside.id+'-branch-'+index;children.hidden=true;
  const button=document.createElement('button');button.type='button';button.className='reader-toc-item level-'+heading.tagName.toLowerCase();
  const label=heading.cloneNode(true);label.querySelectorAll('button,.reader-heading-link').forEach(el=>el.remove());button.textContent=label.textContent.trim();button.title=button.textContent;
  button.addEventListener('click',()=>{window.scrollTo({top:heading.getBoundingClientRect().top+scrollY-118,behavior:motion.matches?'instant':'smooth'});});
  row.append(button);item.append(row,children);(parent?parent.children:tree).append(item);
  const node={level,item,row,children,parent,button,fold:null};nodes.push(node);stack.push(node);return button;
 });
 nodes.forEach(node=>{if(!node.children.children.length){node.children.remove();return;}
  const fold=document.createElement('button');fold.type='button';fold.className='reader-toc-fold';fold.setAttribute('aria-expanded','false');fold.setAttribute('aria-controls',node.children.id);
  fold.setAttribute('aria-label',L('展开或折叠：','Expand or collapse: ','展開・折りたたむ：')+node.button.textContent);
  fold.innerHTML='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m4 2 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  fold.addEventListener('click',()=>{node.children.hidden=!node.children.hidden;fold.setAttribute('aria-expanded',String(!node.children.hidden));});
  node.row.prepend(fold);node.fold=fold;
 });
 function revealBranch(index){const active=nodes[index];if(!active)return;const open=new Set();if(active.fold)open.add(active);for(let parent=active.parent;parent;parent=parent.parent)open.add(parent);
  nodes.forEach(node=>{if(!node.fold)return;node.children.hidden=!open.has(node);node.fold.setAttribute('aria-expanded',String(open.has(node)));});
 }
 let current=-1,raf=0,measureDirty=true,articleTop=0,headingTops=[],revealActive=false,lastRing=-1;const abort=new AbortController();
 function update(){raf=0;if(!body.isConnected||document.hidden)return;if(measureDirty){measureDirty=false;articleTop=body.getBoundingClientRect().top+scrollY;headingTops=headings.map(heading=>heading.getBoundingClientRect().top+scrollY);}const distance=document.documentElement.scrollHeight-innerHeight,progress=distance>0?Math.max(0,Math.min(1,scrollY/distance)):0;if(progress!==lastRing){lastRing=progress;ring.style.strokeDashoffset=ringCirc*(1-progress);}top.classList.toggle('is-visible',scrollY>Math.max(280,articleTop-250));if(!headings.length)return;let low=0,high=headingTops.length;while(low<high){const middle=(low+high)>>>1;if(headingTops[middle]<=scrollY+145)low=middle+1;else high=middle;}const index=Math.max(0,low-1);if(index!==current){current=index;revealBranch(index);links.forEach((link,i)=>{link.classList.toggle('current',i===index);if(i===index)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});revealActive=true;}if(revealActive&&aside.classList.contains('is-open')){revealActive=false;const active=links[index],box=nav.getBoundingClientRect(),item=active.getBoundingClientRect();if(item.top<box.top||item.bottom>box.bottom)nav.scrollTop+=item.top-box.top-box.height*.32;}}
 function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(update);}
 function invalidate(){measureDirty=true;request();}
 const observer=new ResizeObserver(invalidate);observer.observe(body);
 const mutations=new MutationObserver(invalidate);mutations.observe(body,{childList:true,subtree:true});
 body.addEventListener('load',invalidate,{capture:true,signal:abort.signal});document.fonts?.addEventListener('loadingdone',invalidate,{signal:abort.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else invalidate();},{signal:abort.signal});
 toggle.addEventListener('click',()=>{const open=!aside.classList.contains('is-open');aside.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));if(open){revealActive=true;request();}},{signal:abort.signal});
 aside.querySelector('.reader-toc-close')?.addEventListener('click',()=>{aside.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.focus();},{signal:abort.signal});
 top.addEventListener('click',()=>window.scrollTo({top:0,behavior:motion.matches?'instant':'smooth'}),{signal:abort.signal});
 document.addEventListener('click',e=>{if(aside.classList.contains('is-open')&&!aside.contains(e.target)&&!toggle.contains(e.target)){aside.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}},{signal:abort.signal});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&aside.classList.contains('is-open')){aside.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.focus();}},{signal:abort.signal});
 window.addEventListener('scroll',request,{passive:true,signal:abort.signal});window.addEventListener('resize',invalidate,{passive:true,signal:abort.signal});cleanup.push(()=>{abort.abort();observer.disconnect();mutations.disconnect();cancelAnimationFrame(raf);});update();
}
function readingMetrics(body){
 const copy=body.cloneNode(true);
 copy.querySelectorAll('pre,code,script,style,nav,.article-end').forEach(node=>node.remove());
 const text=copy.textContent||'',cjk=(text.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g)||[]).length;
 const latin=(text.match(/[A-Za-zÀ-ž]+(?:['’-][A-Za-zÀ-ž]+)*/g)||[]).length;
 return {count:cjk+latin,minutes:Math.max(1,Math.ceil(cjk/350+latin/220))};
}
function articleSeries(entry,shelf){
 const all=[...shelf.posts(),...shelf.books()],labels=entry.labels.filter(label=>!/^(library|pinned(?:-\d+)?|在读|reading)$/i.test(label));
 const groups=labels.map(label=>({label,items:all.filter(item=>item.labels.includes(label)).sort((a,b)=>(a.date||'').localeCompare(b.date||'')||Number(a.id.slice(1))-Number(b.id.slice(1)))})).filter(group=>group.items.length>1).sort((a,b)=>b.items.length-a.items.length);
 if(!groups.length)return '';
 const group=groups[0],index=group.items.findIndex(item=>item.id===entry.id),before=group.items[index-1],after=group.items[index+1];
 return `<nav class="reader-series" aria-label="${L('同系列文章','Articles in this series','同じシリーズの記事')}"><div>${before?`<a href="${href('/article/'+before.id)}"><small>← ${L('上一篇','Previous','前の記事')}</small><strong>${esc(before.title)}</strong></a>`:'<span></span>'}${after?`<a href="${href('/article/'+after.id)}"><small>${L('下一篇','Next','次の記事')} →</small><strong>${esc(after.title)}</strong></a>`:'<span></span>'}</div></nav>`;
}
function renderGmeekArticle(id){
 const version=renderVersion;
 const shelf=library(),book=shelf.books().find(x=>x.id===id),entry=book||shelf.posts().find(x=>x.id===id)||shelf.pinnedEntry(id);
 if(!entry){if(!shelf.loaded())$('#main').innerHTML=`<div class="shell subpage"><p class="page-intro">${L('正在打开文章…','Opening the article…','記事を読み込み中…')}</p></div>`;else render404();return;}
 const back=book?'/books':'/posts',backHref=listReturn?.articleId===id?listReturn.hash:href(back),number=String(shelf.sequence(id)||1).padStart(3,'0');
 const category=`${book?'THE STUDY':'BLOG A'} · ${esc(entry.labels.join(' / ')||L('阅读笔记','Reading notes','読書ノート'))}`;
 const original=esc(entry.url||'https://github.com/luliy6/luliy6.github.io/issues/'+id.slice(1));
 $('#main').innerHTML=`<div class="shell source-reading"><h1>${esc(entry.title)}</h1><div class="source-meta"><a class="reader-return" href="${backHref}" aria-label="${L('返回列表','Back to the list','一覧へ戻る')}" title="${L('返回列表','Back to the list','一覧へ戻る')}">←</a><span class="source-category">${category}</span><time>${esc(entry.date)}</time><span id="sourceReadingTime">${L('计算阅读时间…','Calculating reading time…','読書時間を計算中…')}</span><button type="button" class="reader-refresh" data-reader="refresh" aria-label="${L('刷新正文','Refresh text','本文を更新')}" title="${L('刷新正文','Refresh text','本文を更新')}">↻</button><a href="${original}" target="_blank" rel="noopener noreferrer">${L('博客原文','Original post','元の記事')}</a></div><div class="source-layout"><article class="source-body" id="sourceArticleBody" data-loading="true" aria-live="polite"><p>${L('正在载入正文…','Loading the text…','本文を読み込み中…')}</p></article><aside class="source-toc" id="readerToc" aria-label="${L('文章目录','Article contents','記事の目次')}"><p>${L('目录','Contents','目次')}</p><nav aria-label="${L('文章章节','Article sections','記事の節')}"></nav></aside><div class="reader-float"><button type="button" class="reader-toc-toggle" aria-controls="readerToc" aria-expanded="false" aria-label="${L('打开文章目录','Open article contents','記事の目次を開く')}">☰</button><button type="button" class="reader-back-top" aria-label="${L('回到文章顶部','Back to article top','記事の先頭へ')}">↑</button></div></div>${articleSeries(entry,shelf)}<div class="source-end"><a href="${backHref}">← ${L('返回列表','Back to the list','一覧へ戻る')}</a><a href="https://github.com/luliy6/luliy6.github.io/issues/${entry.id.slice(1)}" target="_blank" rel="noopener noreferrer">${L('查看讨论','View discussion','議論を見る')}</a></div></div>`;
 LuliyReader.load(entry).then(fragment=>{const host=$('#sourceArticleBody');if(version===renderVersion&&route==='/article/'+id&&host){host.dataset.loading='false';host.replaceChildren(fragment);const first=host.querySelector(':scope > h1');if(first?.textContent.trim().replace(/\s+/g,'')===entry.title.trim().replace(/\s+/g,''))first.remove();host.dataset.sourceText=sourceFingerprint(host);const metrics=readingMetrics(host);$('#sourceReadingTime').textContent=L(`${metrics.count.toLocaleString('zh-CN')} 字 · 约 ${metrics.minutes} 分钟阅读`,`${metrics.count.toLocaleString('en-US')} words · ${metrics.minutes} min read`,`${metrics.count.toLocaleString('ja-JP')} 字 · 約 ${metrics.minutes} 分`);host.querySelector('[data-article-retry]')?.addEventListener('click',()=>{if(version===renderVersion){articleRestoreY=scrollY;render();}},{once:true});mountReadingGuide(host);cleanup.push(LuliyReaderTools.mount({body:host,entry,lang,href,notify,onRefresh:async()=>{await LuliyReader.load(entry,true);if(version!==renderVersion||route!=='/article/'+id)return;articleRestoreY=scrollY;render();notify(L('正文已刷新','Article refreshed','本文を更新しました'));}}));requestAnimationFrame(()=>{if(version!==renderVersion||route!=='/article/'+id)return;pageScroll();if(articleRestoreY!==null){scrollTo({top:articleRestoreY,behavior:'instant'});articleRestoreY=null;}});}}).catch(error=>{const host=$('#sourceArticleBody');if(version===renderVersion&&route==='/article/'+id&&host){host.dataset.loading='false';$('#sourceReadingTime').textContent=L('阅读时间待正文载入','Reading time unavailable','読書時間を取得できません');host.innerHTML=`<p>${esc(LuliyReader.describe(error))}</p><p class="reader-load-actions"><button type="button" data-article-retry>${L('重试加载','Try again','再試行')}</button><a href="${original}" target="_blank" rel="noopener noreferrer">${L('打开博客原文','Open the original post','元の記事を開く')}</a></p>`;host.querySelector('[data-article-retry]')?.addEventListener('click',()=>{if(version===renderVersion){articleRestoreY=scrollY;render();}},{once:true});mountReadingGuide(host);cleanup.push(LuliyReaderTools.mount({body:host,entry,lang,href,notify,onRefresh:async()=>{await LuliyReader.load(entry,true);if(version!==renderVersion||route!=='/article/'+id)return;articleRestoreY=scrollY;render();notify(L('正文已刷新','Article refreshed','本文を更新しました'));}}));}});
}

function renderUtility(kind){const key=kind==='uses'?'uses':kind==='vault'?'vault':'colophon';let body='';if(kind==='uses'){body=`<p class="page-intro">${L('写作与整理的工具。尚未提供的个人设备信息，留待日后补上。','Tools for writing and collecting. Personal equipment details can be added later.','書くこと、整理することのための道具。個人の機材情報は、また後ほど。')}</p><div class="utility-list"><div><h2>${L('写作','Writing','書く')}</h2><p>Gmeek · <a href="https://blog.luliy.me" target="_blank" rel="noopener">Blog A</a> · <a href="https://mini.luliy.me" target="_blank" rel="noopener">Blog B</a></p></div><div><h2>${L('阅读与记录','Reading & notes','読む・記録')}</h2><p><a href="${href('/books')}">${esc(t('books'))}</a> · Favorites / Timeline — Coming soon</p></div></div>`;}else if(kind==='vault'){body=`<p class="page-intro">${L('所有入口，收在这里。','All the doorways, in one place.','すべての入口を、ここに。')}</p><div class="vault-grid">${['books','projects','posts','music','about','uses','colophon'].map(k=>`<a href="${href('/'+k)}">${esc(t(k))}</a>`).join('')}</div><section class="section">${spaces()}</section>`;}else{body=window.LuliySiteInfo(lang,href)+`<section class="section"><h2 style="font-size:28px;margin-bottom:25px">${L('文章示例配图','Sample article images','サンプル記事の画像')}</h2><ul class="credits-list">${D.photos.map(p=>`<li>${esc(photoTitle(p))} — ${esc(p.credit)} · <a href="${esc(p.source)}" target="_blank" rel="noopener">Unsplash</a></li>`).join('')}</ul><p class="list-note"><a href="https://unsplash.com/license" target="_blank" rel="noopener">Unsplash License</a></p></section>`;}
 $('#main').innerHTML=`<div class="shell subpage">${title(kind.toUpperCase(),key)}${body}</div>`;
 if(kind==='colophon'){const credit=document.createElement('p');credit.className='list-note';credit.textContent=L('尾页肖像由 Luliy 提供；月球由页面实时绘制。','The closing portrait was supplied by Luliy; the moon is drawn live on the page.','末尾の肖像は Luliy 提供。月はページ内で描画しています。');$('#main>.shell').append(credit);const lunar=document.createElement('p');lunar.className='list-note';lunar.innerHTML=`${L('月面影像数据：','Lunar surface map: ','月面データ：')}<a href="https://svs.gsfc.nasa.gov/4720" target="_blank" rel="noopener noreferrer">NASA Scientific Visualization Studio · CGI Moon Kit</a>`;$('#main>.shell').append(lunar);}
}
function render404(){$('#main').innerHTML=`<div class="shell subpage not-found"><h1>404</h1><p>${esc(t('error404'))}</p>${routeLink('/','home')}</div>`;}
function reveal(){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');io.unobserve(e.target);}}),{threshold:.04});$$('.reveal').forEach(el=>{el.classList.add('pending');io.observe(el);});cleanup.push(()=>io.disconnect());}
function render(){renderVersion++;liveCoverCleanup?.();liveCoverCleanup=null;cleanup.forEach(fn=>fn());cleanup=[];if(activeScene){activeScene.destroy();activeScene=null;}const u=new URL(location.hash.slice(1)||'/', 'https://luliy.local');route=u.pathname.replace(/\/$/,'')||'/';document.body.classList.toggle('record-single-page',route==='/music');document.body.classList.toggle('study-single-page',route==='/books'||route.startsWith('/books/'));if(!route.startsWith('/article/'))articleRestoreY=null;const urlLang=u.searchParams.get('lang');if(['zh','en','ja'].includes(urlLang))lang=urlLang;if(route==='/photos'||route.startsWith('/album/')){route='/books';history.replaceState(null,'',href(route));}syncFooterPortrait();staticText();$('#directoryOpen').hidden=false;$('#main').className='';switch(route){case'/':renderHome();break;case'/books':renderBooks();break;case'/projects':renderProjects();break;case'/posts':renderPosts();break;case'/music':renderMusic();break;case'/about':renderAbout();break;case'/uses':renderUtility('uses');break;case'/colophon':renderUtility('colophon');break;case'/drive':window.LuliyDriveRender?.();break;case'/vault':renderUtility('vault');break;default:if(route.startsWith('/books/'))renderBooks(route.split('/')[2]);else if(route.startsWith('/article/'))renderGmeekArticle(route.split('/')[2]);else if(route.startsWith('/post/'))renderArticle(route.split('/')[2]);else render404();}
 $$('.signature-dot img').forEach(img=>img.decode().then(()=>img.parentElement?.classList.add('is-loaded')).catch(()=>{}));
 const article=articles.find(a=>route==='/post/'+a.id),source=[...library().books(),...library().posts()].find(x=>route==='/article/'+x.id),category=library().categories.find(c=>route==='/books/'+c.id);document.title='Luliy'+((({books:'Study',projects:'Works',project:'Works',work:'Works',posts:'Articles',article:'Articles',post:'Articles',music:'Records',about:'About',drive:'Drive',uses:'Uses',colophon:'Colophon',vault:'Vault'})[route.split('/')[1]])?' '+({books:'Study',projects:'Works',project:'Works',work:'Works',posts:'Articles',article:'Articles',post:'Articles',music:'Records',about:'About',drive:'Drive',uses:'Uses',colophon:'Colophon',vault:'Vault'})[route.split('/')[1]]:route==='/'?'':' 404');if(source&&/^\/(article|post)\//.test(route))document.title=source.title+' · Luliy Articles';else if(article&&/^\/(article|post)\//.test(route))document.title=articleTitle(article)+' · Luliy Articles';const description=document.querySelector('meta[name="description"]');if(description)description.content=source?(source.summary||source.title+' · Luliy 的文章與思考'):'Luliy 的個人博客：文章、閱讀、作品與音樂。';for(const property of ['og:title','twitter:title']){let meta=document.querySelector('meta[property="'+property+'"],meta[name="'+property+'"]');if(!meta){meta=document.createElement('meta');meta.setAttribute(property.startsWith('og:')?'property':'name',property);document.head.append(meta);}meta.content=document.title;}reveal();cleanup.push(window.LuliyFooterSignatureMount());cleanup.push(window.LuliySignatureDecorMount());cleanup.push(library().hydrateCovers($('#main')));requestAnimationFrame(pageScroll);
}
function pageScroll(){frame=0;const h=document.documentElement,progress=scrollY/Math.max(1,h.scrollHeight-innerHeight);$('.reading-progress').style.transform=`scaleX(${Math.max(0,Math.min(1,progress))})`;const exposure=scrollY+innerHeight-$('.page-above').offsetHeight,inFooter=exposure>80,innerPage=route!=='/',header=$('#header');$('#contact').classList.toggle('is-revealed',exposure>70);if(exposure>70)$('#contact').classList.add('is-written');header.classList.toggle('at-footer',inFooter&&!innerPage);header.classList.toggle('inner-nav-collapsed',innerPage);header.classList.remove('music-nav-hidden');header.inert=document.body.classList.contains('lr-home-tour-active')||(inFooter&&!innerPage);if(innerPage){header.classList.remove('hero-immersive');header.classList.toggle('is-scrolled',scrollY>20);}}
document.addEventListener('luliy:record-tour',pageScroll);
function searchEntries(){const commands=['books','projects','posts','music','about','uses','colophon','vault'].map(k=>({name:t(k),detail:k,run:()=>goto('/'+k)}));library().categories.forEach(c=>commands.push({name:c.name,detail:c.en+' '+t('books'),run:()=>goto('/books/'+c.id)}));commands.unshift({name:t('home'),detail:'Home Luliy',run:()=>goto('/')});commands.push({name:'Blog A',detail:'blog.luliy.me',url:'https://blog.luliy.me'},{name:'Blog B',detail:'mini.luliy.me',url:'https://mini.luliy.me'},{name:t('theme'),detail:'Theme Light Dark \u4e3b\u9898',run:changeTheme},{name:'Email',detail:'mail@luliy.me',run:()=>openDialog('contactDialog')});projects.forEach(p=>commands.push({name:p[0],detail:L(p[1],p[2],p[3]),url:p[4],disabled:!p[4]}));[...library().books(),...library().posts()].forEach(p=>commands.push({name:p.title,detail:p.labels.join(' · '),run:()=>goto('/article/'+p.id)}));return commands;}

function selectSearch(index,focus=false){if(!searchButtons.length)return;selected=(index+searchButtons.length)%searchButtons.length;searchButtons.forEach((b,i)=>b.setAttribute('aria-selected',String(i===selected)));if(focus)searchButtons[selected].focus({preventScroll:true});searchButtons[selected].scrollIntoView({block:'nearest'});}
function renderSearch(){
 const query=$('#searchInput').value.trim().toLocaleLowerCase(),token=++searchToken,entries=searchEntries().filter(c=>(c.name+' '+c.detail).toLocaleLowerCase().includes(query));
 clearTimeout(searchTimer);$('#searchResults').replaceChildren();searchButtons=[];selected=0;
 function append(c){const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='search-result';b.disabled=!!c.disabled;b.innerHTML=`<span>${esc(c.name)}<small>${esc(c.detail)}</small></span><small>${c.disabled?'Coming soon':c.url?'':'↵'}</small>`;if(!c.disabled){const i=searchButtons.length;searchButtons.push(b);b.onfocus=()=>selectSearch(i);b.onclick=()=>{closeDialog('searchDialog');if(c.url)window.open(c.url,'_blank','noopener,noreferrer');else c.run?.();};}li.append(b);$('#searchResults').append(li);}
 entries.forEach(append);
 if(!entries.length)$('#searchResults').innerHTML=`<li class="empty-result">${query.length>=2?L('正在搜索正文…','Searching article text…','本文を検索中…'):esc(t('noResults'))}</li>`;
 $('#searchCount').textContent=entries.length+' '+L('项结果','results','件');selectSearch(0);$('#searchResults').scrollTop=0;
 if(query.length<2)return;
 searchTimer=setTimeout(()=>library().searchText(query).then(matches=>{if(token!==searchToken||!$('#searchDialog').open)return;const known=new Set(entries.map(entry=>entry.name));let added=0;matches.forEach(({entry,snippet})=>{if(known.has(entry.title))return;known.add(entry.title);if(!added++&&!entries.length)$('#searchResults').replaceChildren();append({name:entry.title,detail:snippet,run:()=>goto('/article/'+entry.id)});});if(!searchButtons.length)$('#searchResults').innerHTML=`<li class="empty-result">${esc(t('noResults'))}</li>`;$('#searchCount').textContent=searchButtons.length+' '+L('项结果','results','件');}).catch(()=>{}),350);
}
function openSearch(){$('#searchInput').value='';openDialog('searchDialog');}
window.LuliyLightbox={open:(items,index=0)=>openLightbox(items,index),close:()=>closeDialog('lightbox')};
let lbLoadVersion=0;
$('#lightbox').addEventListener('close',()=>{lbLoadVersion++;$('#lbImage').removeAttribute('src');for(const p of lbPhotos)p.dispose?.();lbPhotos=[];});
function openLightbox(items,index=0){lbPhotos.forEach(p=>p.dispose?.());lbPhotos=items;lbIndex=index;openDialog('lightbox');showLightbox();}
function showLightbox(){const p=lbPhotos[lbIndex];if(!p)return;let download=$('#lightbox').querySelector('.lm-photo-download');if(p.download){if(!download){download=document.createElement('button');download.className='lm-photo-download';download.textContent='下載';$('#lbCaption').after(download);}download.onclick=()=>p.download();}else download?.remove();resetLightboxGesture();const image=$('#lbImage');image.getAnimations().forEach(a=>a.cancel());lbScale=1;lbRotation=0;lbX=lbY=0;image.style.visibility='hidden';image.onload=()=>{if(!$('#lightbox').open)return;image.style.visibility='';transformImage();};image.onerror=()=>{if($('#lightbox').open)$('#lbCaption').textContent=L('照片暂时无法载入，请稍后重试。','The photograph could not be loaded. Please try again.','写真を読み込めません。もう一度お試しください。');};const version=++lbLoadVersion;image.removeAttribute('src');if(p.resolveSource){Promise.resolve(p.resolveSource()).then(src=>{if(version===lbLoadVersion&&$('#lightbox').open)image.src=src;}).catch(()=>{if(version===lbLoadVersion&&$('#lightbox').open){$('#lbCaption').textContent='照片載入失敗，請重試。';let retry=$('#lightbox').querySelector('.lm-photo-retry');if(!retry){retry=document.createElement('button');retry.className='lm-photo-retry';retry.textContent='重試';retry.onclick=()=>showLightbox();$('#lbCaption').after(retry);}}});}else image.src=p.src;$('#lightbox').querySelector('.lm-photo-retry')?.remove();image.alt=photoTitle(p);$('#lbCount').textContent=String(lbIndex+1).padStart(2,'0')+' / '+String(lbPhotos.length).padStart(2,'0');$('#lbCaption').textContent=photoTitle(p);$('#lbCredit').textContent=p.credit||'';if(image.complete&&image.naturalWidth)image.style.visibility='';transformImage();}
function transformImage(refit=true){const image=$('#lbImage'),stage=$('#lbStage');if(refit&&image.naturalWidth&&image.naturalHeight){const quarterTurn=Math.abs(lbRotation%180)===90,stageWidth=stage.clientWidth,stageHeight=stage.clientHeight,fit=Math.min(stageWidth/(quarterTurn?image.naturalHeight:image.naturalWidth),stageHeight/(quarterTurn?image.naturalWidth:image.naturalHeight));image.style.width=`${image.naturalWidth*fit}px`;image.style.height=`${image.naturalHeight*fit}px`;image.style.maxWidth='none';image.style.maxHeight='none';}image.style.transform=`translate(${lbX}px,${lbY}px) rotate(${lbRotation}deg) scale(${lbScale})`;const zoom=$('#lbZoom'),symbol=lbScale>1?'−':'＋';if(zoom.textContent!==symbol)zoom.textContent=symbol;zoom.setAttribute('aria-label',lbScale>1?L('完整显示照片','Fit photograph','全体表示'):L('查看原始尺寸','Original size','原寸表示'));}
function nextImage(n){lbIndex=(lbIndex+n+lbPhotos.length)%lbPhotos.length;showLightbox();}
$('#lbNext').onclick=()=>nextImage(1);$('#lbPrev').onclick=()=>nextImage(-1);$('#lbZoom').onclick=()=>{const image=$('#lbImage');lbScale=lbScale>1?1:Math.max(1,Math.min(20,Math.max(image.naturalWidth/Math.max(1,image.clientWidth),image.naturalHeight/Math.max(1,image.clientHeight))));lbX=lbY=0;transformImage();};$('#lbRotate').onclick=()=>{lbRotation=(lbRotation+90)%360;lbX=lbY=0;transformImage();};$('#lbReset').onclick=()=>{lbScale=1;lbRotation=0;lbX=lbY=0;transformImage();};$('#lbImage').ondblclick=()=>$('#lbZoom').click();window.addEventListener('resize',()=>{if($('#lightbox').open)transformImage();});
const pointers=new Map();let dragStart=null,pinchDistance=1,pinchScale=1,lightboxFrame=0;
function resetLightboxGesture(){const stage=$('#lbStage'),ids=[...pointers.keys()];pointers.clear();dragStart=null;pinchDistance=1;cancelAnimationFrame(lightboxFrame);lightboxFrame=0;for(const id of ids)if(stage.hasPointerCapture(id))stage.releasePointerCapture(id);}
function requestImageTransform(){if(!lightboxFrame)lightboxFrame=requestAnimationFrame(()=>{lightboxFrame=0;if($('#lightbox').open)transformImage(false);});}
$('#lbStage').addEventListener('pointerdown',e=>{if(e.button!==0||pointers.size>=2)return;$('#lbImage').getAnimations().forEach(a=>a.cancel());pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId);if(pointers.size===1)dragStart={x:e.clientX,y:e.clientY,oldX:lbX,oldY:lbY,background:e.target===e.currentTarget};if(pointers.size===2){const [a,b]=[...pointers.values()];pinchDistance=Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));pinchScale=lbScale;dragStart=null;}});
$('#lbStage').addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const [a,b]=[...pointers.values()];lbScale=Math.max(1,Math.min(20,pinchScale*Math.hypot(a.x-b.x,a.y-b.y)/pinchDistance));requestImageTransform();}else if(dragStart&&lbScale>1){lbX=dragStart.oldX+e.clientX-dragStart.x;lbY=dragStart.oldY+e.clientY-dragStart.y;requestImageTransform();}});
function endPointer(e){if(!pointers.has(e.pointerId))return;const drag=pointers.size===1?dragStart:null;pointers.delete(e.pointerId);if(pointers.size===1){const remaining=[...pointers.values()][0];dragStart={x:remaining.x,y:remaining.y,oldX:lbX,oldY:lbY,gestureOnly:true};}else dragStart=null;if(drag&&!drag.gestureOnly){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(drag.background&&Math.hypot(dx,dy)<8)closeDialog('lightbox');else if(lbScale===1){if(Math.abs(dy)>90&&Math.abs(dy)>Math.abs(dx)*1.25)closeDialog('lightbox');else if(Math.abs(dx)>65&&Math.abs(dy)<100)nextImage(dx<0?1:-1);}}}
$('#lbStage').addEventListener('pointerup',endPointer);$('#lbStage').addEventListener('pointercancel',resetLightboxGesture);$('#lbStage').addEventListener('wheel',e=>{e.preventDefault();lbScale=Math.max(1,Math.min(20,lbScale-e.deltaY*.002));if(lbScale===1)lbX=lbY=0;requestImageTransform();},{passive:false});
$('#lightbox').addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;if(e.key==='ArrowRight'){e.preventDefault();nextImage(1);}if(e.key==='ArrowLeft'){e.preventDefault();nextImage(-1);}if(e.key==='+'||e.key==='='){e.preventDefault();$('#lbZoom').click();}if(e.key.toLowerCase()==='r'){e.preventDefault();$('#lbRotate').click();}if(e.key==='Home'){e.preventDefault();$('#lbReset').click();}});
$('#searchDialog').addEventListener('keydown',e=>{if(e.isComposing)return;if(e.key==='Escape'){e.preventDefault();closeDialog('searchDialog');}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();selectSearch(selected+(e.key==='ArrowDown'?1:-1),true);}else if(e.key==='Enter'&&e.target===$('#searchInput')){e.preventDefault();searchButtons[selected]?.click();}});$('#searchInput').oninput=renderSearch;
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close]');if(close){closeDialog(close.dataset.close);return;}
 const lng=e.target.closest('[data-lang]');if(lng){setLang(lng.dataset.lang);return;}
 if(e.target.closest('button[data-theme]')){changeTheme();return;}
 if(e.target.closest('[data-search]')){openSearch();return;}
 if(e.target.closest('[data-contact]')){openDialog('contactDialog');return;}
 if(e.target.closest('[data-go-contact]')){closeOpenDialogs();window.scrollTo({top:document.documentElement.scrollHeight,behavior:motion.matches?'instant':'smooth'});$('#contact').focus({preventScroll:true});return;}
 const wall=e.target.closest('[data-wall-photo]');if(wall){openLightbox(wallPhotos,+wall.dataset.wallPhoto);return;}
 const pic=e.target.closest('[data-lightbox]');if(pic){openLightbox(D.photos,+pic.dataset.lightbox);return;}
 const articleImage=e.target.closest('.source-body img,.article-body img');if(articleImage){openLightbox([{src:articleImage.currentSrc||articleImage.src,title:articleImage.alt||'',credit:''}],0);return;}
 const anchor=e.target.closest('[data-article-anchor]');if(anchor){e.preventDefault();$('#article-'+anchor.dataset.articleAnchor)?.scrollIntoView({behavior:motion.matches?'instant':'smooth'});return;}
 const link=e.target.closest('a[href^="#/"]');if(link){if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;closeOpenDialogs();if(link.hash===location.hash){e.preventDefault();if(link.closest('.study-tabs,.post-filters'))return;scrollTo({top:0,behavior:motion.matches?'instant':'smooth'});}}
 if(!e.target.closest('.lang-wrap')){$('#langMenu').hidden=true;$('#langTrigger').setAttribute('aria-expanded','false');}
});
$('#qrOpen').onclick=()=>openDialog('qrDialog');$('#themeToggle').onclick=changeTheme;$('#directoryOpen').onclick=()=>openDialog('directory');$('#studyGlobalOpen').onclick=()=>openDialog('directory');$('#searchOpen').onclick=openSearch;$('#langTrigger').onclick=()=>{const open=$('#langMenu').hidden;$('#langMenu').hidden=!open;$('#langTrigger').setAttribute('aria-expanded',String(open));};
$('#copyEmail').onclick=async()=>{try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText('mail@luliy.me');else throw Error('clipboard unavailable');notify(t('copied'));}catch(e){const field=document.createElement('textarea');field.value='mail@luliy.me';field.style.cssText='position:fixed;opacity:0';$('#contactDialog').append(field);field.select();const ok=document.execCommand('copy');field.remove();notify(ok?t('copied'):L('请长按邮箱地址复制','Select the email address to copy','メールアドレスを選択してコピーしてください'));}};
let holdTimer=0,holdGate=null;
function cancelVaultHold(){clearTimeout(holdTimer);holdGate?.classList.remove('holding');holdGate=null;}
function vault(gate){cancelVaultHold();gate?.classList.remove('holding');$('#vaultVeil').classList.add('visible');setTimeout(()=>{goto('/vault');scrollTo({top:0,behavior:'instant'});setTimeout(()=>$('#vaultVeil').classList.remove('visible'),150);},motion.matches?0:560);}
document.addEventListener('pointerdown',e=>{const gate=e.target.closest('[data-vault-gate]');if(!gate||e.button!==0)return;cancelVaultHold();holdGate=gate;gate.classList.add('holding');holdTimer=setTimeout(()=>vault(gate),780);});
['pointerup','pointerleave','pointercancel'].forEach(type=>document.addEventListener(type,e=>{if(!holdGate||e.target.closest('[data-vault-gate]')!==holdGate)return;cancelVaultHold();},true));
document.addEventListener('click',e=>{const gate=e.target.closest('[data-vault-gate]');if(gate&&e.detail===0)vault(gate);});
document.addEventListener('keydown',e=>{const gate=e.target.closest('[data-vault-gate]');if(gate&&(e.key==='Enter'||e.key===' ')){e.preventDefault();vault(gate);}});
window.addEventListener('blur',cancelVaultHold);
window.addEventListener('scroll',cancelVaultHold,{passive:true});
document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-vault-gate]'))e.preventDefault();});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!e.isComposing){e.preventDefault();$('#searchDialog').open?closeDialog('searchDialog'):openSearch();}if(e.key==='Escape'&&!$('#langMenu').hidden){$('#langMenu').hidden=true;$('#langTrigger').setAttribute('aria-expanded','false');$('#langTrigger').focus();}});
document.addEventListener('click',event=>{const row=event.target.closest('a.study-entry[href*="/article/"],a.home-pinned-link[href*="/article/"]');if(!row||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;transitionSource=row.querySelector('.study-entry-copy strong,strong');listReturn={hash:location.hash||'#/',y:scrollY,articleId:row.getAttribute('href').split('/article/')[1]?.split('?')[0]};},true);
window.addEventListener('hashchange',()=>{
 const token=++navigationToken,targetHash=location.hash;
 activeViewTransition?.skipTransition();activeViewTransition=null;
 if(targetHash==='#main'){$('#main').focus();delete document.documentElement.dataset.vtDir;return;}
 closeOpenDialogs();
 const source=transitionSource;transitionSource=null;
 const targetRoute=new URL(targetHash.slice(1)||'/', 'https://luliy.local').pathname.replace(/\/$/,'')||'/';
 const detailPath=p=>/^\/(?:article|post|books\/[^/]+)/.test(p);
 document.documentElement.dataset.vtDir=/^\/books(?:\/|$)/.test(targetRoute)?'study':detailPath(targetRoute)?'post':detailPath(route)?'home':'';
 const canAnimate=!motion.matches&&typeof document.startViewTransition==='function';
 const animate=source?.isConnected&&targetRoute.startsWith('/article/')&&canAnimate;
 const restore=listReturn?.hash===targetHash&&route.startsWith('/article/')?listReturn.y:null;
 const filterChange=(route===targetRoute)||(/^\/books(?:\/|$)/.test(route)&&/^\/books(?:\/|$)/.test(targetRoute));
 const routeAnimate=route!==targetRoute&&!filterChange&&canAnimate;
 const routeFallback=route!==targetRoute&&!filterChange&&!motion.matches&&!canAnimate,filterY=filterChange?scrollY:null;
 let targetTitle=null;
 const update=()=>{
  if(token!==navigationToken||location.hash!==targetHash)return;
  render();
  if(routeFallback){const main=$('#main');main.classList.add('route-enter');main.addEventListener('animationend',()=>main.classList.remove('route-enter'),{once:true});}
  let restReturn=false;try{restReturn=location.hash==='#/'&&sessionStorage.getItem('luliy-study-rest-return')==='1';if(restReturn)sessionStorage.removeItem('luliy-study-rest-return');}catch(e){}const entrance=document.querySelector('.entrance');scrollTo({top:restReturn&&entrance?Math.max(0,entrance.offsetTop+entrance.offsetHeight-innerHeight):restore??filterY??0,behavior:'instant'});
  if(restore!==null)requestAnimationFrame(()=>{if(token===navigationToken&&location.hash===targetHash)scrollTo({top:restore,behavior:'instant'});});
  if(animate){source.style.viewTransitionName='';targetTitle=$('#main .source-reading h1');if(targetTitle)targetTitle.style.viewTransitionName='article-title';}
  $('#main').focus({preventScroll:true});
 };
 const finish=()=>{
  targetTitle?.style.removeProperty('view-transition-name');source?.style.removeProperty('view-transition-name');
  if(token===navigationToken){activeViewTransition=null;delete document.documentElement.dataset.vtDir;}
 };
 if(animate||(filterChange&&canAnimate)||routeAnimate){
  if(animate)source.style.viewTransitionName='article-title';
  const transition=document.startViewTransition(update);activeViewTransition=transition;
  transition.ready.catch(()=>{});transition.finished.then(finish,finish);
 }else{update();finish();}
});window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(pageScroll);},{passive:true});window.addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(pageScroll);});
let footerPortrait='',footerInView=false;const footerImage=new Image();footerImage.crossOrigin='anonymous';function mountFooterScene(){if(!footerInView||footerScene||!footerImage.complete||!footerImage.naturalWidth)return;footerScene=LuliyMoon.mount($('#footerMoon'),{scene:'portrait',portrait:footerPortrait,portraitLayout:route==='/'?'default':'footer-side'});footerScene.setTheme(document.documentElement.dataset.theme);$('#contact').classList.add('portrait-ready');}function syncFooterPortrait(){const home=route==='/',next=home?(D.scenes?.footerPortrait||D.scenes?.portrait):(D.scenes?.sidePortrait||D.scenes?.portrait);$('#contact').classList.toggle('footer-home',home);if(next===footerPortrait)return;footerPortrait=next;if(footerScene){footerScene.destroy();footerScene=null;}$('#contact').classList.remove('portrait-ready');$('#footerMoon').dataset.portrait=next;(window.LuliyFooterSrc||function(i,s){i.src=s})(footerImage,next);}footerImage.onload=mountFooterScene;const footerIO=new IntersectionObserver(([e])=>{footerInView=e.isIntersecting;mountFooterScene();},{threshold:0});footerIO.observe($('#contact'));
render();
const liveLibrary=library();
function updateHomeLibrary(){
 const shelf=library(),pinned=$('#main .home-pinned'),index=$('#main .article-feature-index'),anchor=$('#recordsHome'),anchorTop=anchor?.getBoundingClientRect().top,position=scrollY;
 if(pinned){const content=shelf.pinnedContent();pinned.innerHTML=content;pinned.hidden=!content;}
 if(index)index.innerHTML=shelf.postsContent(6,true);
 liveCoverCleanup?.();liveCoverCleanup=shelf.hydrateCovers(index||$('#main'));
 if(anchor&&anchorTop<innerHeight){const shift=anchor.getBoundingClientRect().top-anchorTop;if(shift)scrollTo({top:position+shift,behavior:'instant'});}
}
function applyLibraryRefresh(before){
 const changed=before!==liveLibrary.revision();
 if(route==='/'){if(changed)updateHomeLibrary();return;}
 if(route==='/books'||route.startsWith('/books/')||route==='/posts'){
  if(changed&&activeStudy&&(route==='/books'||route.startsWith('/books/')))activeStudy.updateContent(studyData(library(),route==='/books'?null:route.split('/')[2]));
  else if(changed){const position=scrollY;render();scrollTo({top:position,behavior:'instant'});}
  else{liveCoverCleanup?.();liveCoverCleanup=library().hydrateCovers($('#main'));}
  return;
 }
 if(!route.startsWith('/article/'))return;
 const id=route.split('/')[2],entry=[...liveLibrary.books(),...liveLibrary.posts()].find(item=>item.id===id)||liveLibrary.pinnedEntry(id),host=$('#sourceArticleBody');
 if(!entry){if(!host&&liveLibrary.loaded())render();return;}
 if(!host){articleRestoreY=scrollY;render();return;}
 // Refresh the text only when it changed, and never reset a later page.
 const version=renderVersion;
 if(host.dataset.loading==='true')return;
 LuliyReader.load(entry,true).then(fragment=>{
  if(version!==renderVersion||route!=='/article/'+id||!host.isConnected)return;
  const fresh=document.createElement('div');fresh.append(fragment);
  const first=fresh.querySelector(':scope > h1');if(first?.textContent.trim().replace(/\s+/g,'')===entry.title.trim().replace(/\s+/g,''))first.remove();
  if(sourceFingerprint(fresh)!==host.dataset.sourceText){articleRestoreY=scrollY;render();}
 }).catch(()=>{});
}
const firstRevision=liveLibrary.revision();
liveLibrary.refresh().then(()=>applyLibraryRefresh(firstRevision));
setInterval(()=>{
 if(document.visibilityState!=='visible'||document.querySelector('dialog[open]'))return;
 const before=liveLibrary.revision();liveLibrary.refresh(true).then(()=>applyLibraryRefresh(before));
},60000);
document.addEventListener('click',e=>{if(e.target.closest('[data-study-refresh]'))liveLibrary.refresh(true).then(()=>{if(route==='/books'||route.startsWith('/books/')){const y=scrollY;render();scrollTo({top:y,behavior:'instant'});}});});
document.addEventListener('luliy:records-open',()=>{if(route!=='/music')goto('/music');else $('#recordMount')?.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});});
})();


