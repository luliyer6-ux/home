/* An original, self-contained lunar study. No remote assets or dependencies. */
(function (global) {
  'use strict';
  const vertex = `attribute vec2 a;varying vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
  // Both the photograph and its particles use the same scroll-driven camera.
  const portraitGeometry = `uniform float portraitLayout;vec4 portraitFrame(){
    float mobile=step(resolution.x,700.);
    float zoom=1.+1.35*smoothstep(0.,.65,progress);
    float h=mix(min(resolution.y*.98,resolution.x*.72),min(resolution.y*.59,resolution.x*1.27),mobile)*zoom;
    vec2 center=mix(vec2(.745,.49),vec2(.5,.705),mobile);
    center=mix(center,mix(vec2(.58,.50),vec2(.5,.56),mobile),smoothstep(0.,.85,progress));
    float side=portraitLayout*(1.-mobile);
    h*=mix(1.,1.65,side);
    center=mix(center,vec2(.84,.29),side);
    if(journey>=0.&&portraitLayout<.5){
      h=mix(min(resolution.y*.82,resolution.x*.70),min(resolution.y*.50,resolution.x*.98),mobile);
      h*=1.+.12*smoothstep(.70,.84,journey);
      center=mix(vec2(.72,.50),vec2(.55,.55),mobile);
    }
    return vec4(center*resolution,h*.752,h);
  }`;
  const fragment = `
  precision highp float;
  varying vec2 uv;
  uniform vec2 resolution;
  uniform sampler2D surface, portraitImage, earthImage;
  uniform float time, progress, lightTheme, scene, transition, morph, journey;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
  float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<3;i++){s+=a*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p+vec2(3.1,7.3);a*=.5;}return s;}
  vec2 mapSphere(vec3 n){return vec2(atan(n.z,n.x)/6.2831853+.5,asin(clamp(n.y,-1.,1.))/3.14159265+.5);}
  vec4 over(vec4 a,vec4 b){float alpha=b.a+a.a*(1.-b.a);return vec4((b.rgb*b.a+a.rgb*a.a*(1.-b.a))/max(.00001,alpha),alpha);}
  ${portraitGeometry}
  void main(){
    vec2 px=uv*resolution;
    float mobile=step(resolution.x,700.);
    float p=smoothstep(0.,1.,progress);
    vec2 center=mix(vec2(.70,.49),vec2(.60,.69),mobile)*resolution;
    center.x=mix(center.x,resolution.x*.53,p);
    float radius=mix(min(resolution.x*.27,resolution.y*.35),min(resolution.x*.38,resolution.y*.225),mobile);
    radius*=1.+p*.45;
    vec2 pos=(px-center)/radius;
    float rr=dot(pos,pos);
    vec4 result=vec4(0.);
    float scripted=step(0.,journey),j=clamp(journey,0.,1.);
    float fade=scripted>.5?1.-smoothstep(.82,.95,j):1.-smoothstep(.57,1.,p);
    float dissolve=scripted>.5?0.:max(smoothstep(.08,.72,progress),transition);
    if(scene<.5&&lightTheme>.5){float halo=exp(-max(0.,sqrt(rr)-1.)*18.)*(1.-smoothstep(1.0,1.30,sqrt(rr)));result=vec4(vec3(.88,.65,.29),halo*.13*fade*(1.-morph));}
    if(rr<1.006 && (scene<1.5 || morph>0.)){
      vec3 norm=vec3(pos,sqrt(max(0.,1.-rr)));
      float angle=.13+time*.018+p*.8;
      vec3 rot=vec3(norm.x*cos(angle)+norm.z*sin(angle),norm.y,-norm.x*sin(angle)+norm.z*cos(angle));
      vec2 st=mapSphere(rot);
      vec3 tex=texture2D(surface,st).rgb;
      if(scene>.5)tex=texture2D(earthImage,vec2(fract(st.x+.12),st.y)).rgb;
      float dx=texture2D(surface,st+vec2(.00065,0.)).r-texture2D(surface,st-vec2(.00065,0.)).r;
      float dy=texture2D(surface,st+vec2(0.,.0013)).r-texture2D(surface,st-vec2(0.,.0013)).r;
      vec3 rough=normalize(norm+vec3(-dx*.65,-dy*.65,0.));
      vec3 sun=normalize(vec3(-.55,.55,1.));
      float diffuse=max(0.,dot(rough,sun));
      float rim=pow(max(0.,norm.z),.17);
      float shade=(.51+.86*pow(diffuse,.8))*rim;
      vec3 lunar=vec3(.81,.82,.79)*pow(tex.r,.62)*shade;
      lunar+=vec3(.035)*pow(max(0.,norm.z),2.);
      if(scene>.5){float grey=dot(tex,vec3(.299,.587,.114));lunar=mix(vec3(grey),tex,.46)*(.20+.96*diffuse);lunar+=vec3(.08,.14,.17)*pow(1.-norm.z,3.)*.38;}

      float mask=(1.-smoothstep(.992,1.006,rr))*fade;
      mask*=smoothstep(-.8,.2,pos.x+1.-dissolve*2.5+(fbm(pos*11.)-.5)*.28);
      if(scene<.5)mask*=smoothstep(-.78,.13,pos.x+(fbm(pos*15.)-.5)*.22);
      if(scripted>.5&&scene<.5){float front=mix(-1.30,1.30,smoothstep(.22,.78,j));float ragged=sin(pos.y*17.+pos.x*9.)*.07+sin(pos.y*31.-pos.x*13.)*.035;mask*=smoothstep(front-.28,front+.28,pos.x+ragged);}
      result=vec4(lunar,mask*(scene<.5?1.-morph:1.));
    }
    if(scene>1.5 || morph>0.){
      dissolve=max(smoothstep(.20,.78,progress),transition);
      vec4 frame=portraitFrame();vec2 size=frame.zw,c=frame.xy;
      vec2 st=(px-c)/size+.5;
      if(st.x>0.&&st.x<1.&&st.y>0.&&st.y<1.){
        vec4 portraitTexel=texture2D(portraitImage,st);
        float lum=portraitTexel.r;
        float edge=(1.-smoothstep(.62,1.08,length((st-vec2(.5,.55))/vec2(.53,.63))))*smoothstep(.08,.38,st.y)*(1.-smoothstep(.80,1.,st.y));
        float faceCore=1.-smoothstep(.70,1.,length((st-vec2(.50,.50))/vec2(.35,.33)));
        edge*=portraitTexel.a*mix(1.,max(faceCore,smoothstep(.015,.14,lum)),lightTheme);
        float grain=(noise(px*.6)-.5)*.035;
        vec3 col=mix(vec3(.07)+vec3(.67,.68,.65)*lum,vec3(.10)+vec3(.78,.77,.73)*lum,lightTheme)+grain;
        float portraitVisible=smoothstep(.48,.62,j)*(1.-smoothstep(.70,.85,j));
        edge*=scripted>.5?portraitVisible:1.-smoothstep(.06+st.y*.12,.70,dissolve);
        result=over(result,vec4(col,edge*fade*.93*(scripted>.5?1.:(scene<1.5?morph:1.))));
      }
    }
    // Soft, layered cloud banks sit below the lunar center and drift independently.
    vec2 q=vec2(uv.x*2.4,uv.y*4.8);
    float drift=time*.008;
    float wave=fbm(vec2(q.x*.62+drift*.65,q.y*.58));
    float filament=fbm(q*vec2(.78,1.65)+vec2(drift,-wave*1.55));
    float line=mix(.39,.43,mobile)+.045*sin(uv.x*5.1+wave*4.)+.025*(filament-.5);
    float horizontal=smoothstep(0.,.12,uv.x)*(1.-smoothstep(.80,1.05,uv.x));
    float lowerCenter=line-.15+.05*sin(uv.x*4.5+filament*2.4);
    float middleCenter=line-.02+.03*sin(uv.x*4.3+wave*3.);
    float upperCenter=line+.12+.035*cos(uv.x*6.4-wave*2.2);
    float lowerBand=exp(-pow((uv.y-lowerCenter)/(.11+.018*wave),2.));
    float middleBand=exp(-pow((uv.y-middleCenter)/(.06+.01*filament),2.));
    float upperBand=exp(-pow((uv.y-upperCenter)/(.085+.014*filament),2.));
    float cloudShape=(lowerBand*.75+middleBand*.72+upperBand*.32)*smoothstep(.10,.64,filament)*horizontal;
    float feather=noise(px*.18)*.14+.91;
    // Let the cloud banks dissolve while their particle counterparts gather.
    float cloudFade=scripted>.5?1.-smoothstep(.20,.48,j):1.-smoothstep(.08,.56,morph);
    float density=min(.7,cloudShape*.78*fade*feather*cloudFade)*mix(1.,.333,lightTheme);
    vec3 cloud=mix(vec3(.38,.39,.39),vec3(.78,.74,.65),lightTheme);
    result=over(result,vec4(cloud,density));
    // A broken high wisp adds depth without restoring the old straight stripe.
    float wispCenter=line+.19+.04*sin(uv.x*8.+wave*4.);
    float wisp=exp(-pow((uv.y-wispCenter)/.03,2.))*smoothstep(.33,.82,fbm(q*vec2(1.3,2.1)+vec2(drift*.8,5.)))*horizontal;
    result=over(result,vec4(mix(vec3(.25,.27,.25),vec3(.82,.77,.67),lightTheme),wisp*.19*fade*cloudFade*mix(1.,.333,lightTheme)));
    // Premultiply the final colour so transparent photograph pixels remain
    // invisible on every browser/GPU compositor, including hosted pages.
    gl_FragColor=vec4(result.rgb*result.a,result.a);
  }`;

  const pointVertex=`precision highp float;attribute vec3 seed;uniform vec2 resolution;uniform sampler2D surface,portraitImage,earthImage,studyImage,lichImage;uniform float time,progress,scene,transition,morph,lightTheme,pixelRatio,journey;varying vec4 tint;
  ${portraitGeometry}
  void main(){
    float mobile=step(resolution.x,700.);vec2 q=seed.xy,xy=(q-.5)*2.;float rr=dot(xy,xy);float mask=1.;vec3 col;vec2 base;
    float p=smoothstep(0.,1.,progress),d=journey>=0.?0.:max(smoothstep(.08,.72,progress),transition);
    vec2 center=mix(vec2(.70,.49),vec2(.60,.69),mobile)*resolution;center.x=mix(center.x,resolution.x*.53,p);
    float radius=mix(min(resolution.x*.27,resolution.y*.35),min(resolution.x*.38,resolution.y*.225),mobile)*(1.+p*.45);
    if(scene>1.5){d=max(smoothstep(.20,.78,progress),transition);vec4 frame=portraitFrame();base=frame.xy+(q-.5)*frame.zw;vec4 portraitTexel=texture2D(portraitImage,q);float lum=portraitTexel.r;mask=portraitTexel.a*(1.-smoothstep(.62,1.08,length((q-vec2(.5,.55))/vec2(.53,.63))))*smoothstep(.08,.38,q.y)*smoothstep(.08,.6,lum);col=mix(vec3(.38)+vec3(lum*.38),vec3(.14,.17,.17),lightTheme);}
    else{vec3 n=vec3(xy,sqrt(max(0.,1.-rr)));float angle=.13+time*.018+p*.8;vec3 rot=vec3(n.x*cos(angle)+n.z*sin(angle),n.y,-n.x*sin(angle)+n.z*cos(angle));vec2 st=vec2(atan(rot.z,rot.x)/6.2831853+.5,asin(clamp(rot.y,-1.,1.))/3.14159265+.5);col=scene>.5?texture2D(earthImage,vec2(fract(st.x+.12),st.y)).rgb:texture2D(surface,st).rgb;float grey=dot(col,vec3(.299,.587,.114));col=mix(vec3(grey),col,scene>.5?.4:0.);col=mix(col*.85+.08,vec3(.78,.51,.17),lightTheme);mask=1.-smoothstep(.96,1.,rr);base=center+xy*radius;}
    vec3 moonSurfaceColor=col;
    float tipMarker=(1.-step(1.e-6,seed.x))*(1.-step(1.e-6,seed.y))*(1.-step(1.e-6,seed.z));
    float a=seed.z*6.2831853;
    float cloudRank=fract(seed.x*17.31+seed.y*41.17+seed.z*9.73);
    float cloudParticle=step(.83,cloudRank);
    float stream=scene<.5&&journey>=0.?fract(q.x+time*(.004+.006*seed.z)):q.x;
    float trail=1.-stream;
    float plume=scene<.5?smoothstep(.04,.20,seed.z):0.;
    if(scene<.5)mask=mix(mask,1.,plume);
    float tailLength=mix(radius*2.20,min(radius*3.16,center.x*.92),mobile);
    float plumeX=mix(center.x-radius*1.04,center.x-tailLength,trail);
    plumeX+=(seed.z-.5)*radius*.27*pow(1.-trail,1.8);
    base.x=mix(base.x,plumeX,plume);
    base.x+=plume*radius*(journey>=0.?.64:.12)*pow(stream,4.);
    float plumeSpread=1.,plumeEdge=0.;
    if(scene<.5){float taper=pow(max(0.,1.-trail),.72);plumeSpread=.025+.94*taper;float arc=(sin(trail*3.14159)*.055+sin(trail*5.+q.y*1.5)*.014)*taper;base.y=center.y+(base.y-center.y)*plumeSpread+radius*arc*plume;}
    base.y+=(seed.z-.5)*radius*plume*.10;
    base+=vec2(sin(time*.34+a+q.y*12.),cos(time*.23+a))*plume*4.;
    if(scene<.5){plumeEdge=(base.y-center.y)/(radius*plumeSpread);float tilt=.1745329,ct=cos(tilt),st=sin(tilt);vec2 delta=base-center;base=center+vec2(ct*delta.x-st*delta.y,st*delta.x+ct*delta.y);}
    if(scene<.5&&tipMarker>.5){float tilt=.1745329;base=center+vec2(-cos(tilt)*tailLength,-sin(tilt)*tailLength);mask=1.;col=vec3(.88,.82,.66);plume=1.;plumeEdge=0.;}
    base.x-=d*resolution.x*(.15+.44*(1.-q.x));
    base.y+=d*resolution.y*(seed.z-.5)*.18;
    if(scene<.5 && morph>0.){vec4 frame=portraitFrame();vec2 target=frame.xy+(q-.5)*frame.zw;vec4 texel=texture2D(portraitImage,q);float photoMask=texel.a*(1.-smoothstep(.62,1.08,length((q-vec2(.5,.55))/vec2(.53,.63))))*smoothstep(.08,.38,q.y)*smoothstep(.04,.5,texel.r);vec3 portraitColor=vec3(.22)+texel.rgb*.55;if(cloudParticle>.5){float band=fract(q.y*4.);float offset=band<.30?-.15:band<.58?-.02:band<.84?.12:.19;float cloudLine=.33+.10*mobile+.045*sin(q.x*5.1+cloudRank*3.)+.025*(seed.z-.5);float cloudY=clamp(cloudLine+offset+.018*sin(q.x*11.+q.y*7.),.08,.76);vec2 cloudBase=vec2(mix(.18,.86,q.x)*resolution.x,cloudY*resolution.y);float cloudAngle=.1745329,cloudCt=cos(cloudAngle),cloudSt=sin(cloudAngle);vec2 cloudDelta=cloudBase-center;cloudBase=center+vec2(cloudCt*cloudDelta.x-cloudSt*cloudDelta.y,cloudSt*cloudDelta.x+cloudCt*cloudDelta.y);float gather=smoothstep(.18,.97,morph);base=mix(cloudBase,target,gather);col=mix(mix(vec3(.43,.45,.44),vec3(.52,.53,.50),lightTheme),portraitColor,gather);}else{base=mix(base,target,morph);col=mix(col,portraitColor,morph);}mask=mix(mask,photoMask,morph);}
    float portraitBurst=smoothstep(.10,.34,morph)*(1.-smoothstep(.66,.94,morph))*.88;
    float moonEnergy=max((plume*.50+smoothstep(.03,.62,d)*.48)*(1.-smoothstep(.42,.86,morph)),portraitBurst);
    float cloudEnergy=smoothstep(.035,.24,morph)*(1.-smoothstep(.64,.90,morph))*.58;
    float energy=mix(moonEnergy,cloudEnergy,cloudParticle);
    float alpha=mask*energy*(1.-smoothstep(.70,1.,progress))*(1.-smoothstep(.78,1.,transition));
    if(scene<.5){float densityRamp=pow(clamp(1.-trail,0.,1.),1.10);float particleRank=fract(seed.z*17.31);float localDensity=mix(.025,.86,densityRamp);alpha*=step(particleRank,localDensity)*.68;if(cloudParticle>.5)alpha*=.68;else{alpha*=1.-.35*smoothstep(.38,.98,1.-q.x);alpha*=1.-smoothstep(.22,1.52,abs(plumeEdge));float moonBlend=smoothstep(center.x-radius*.70,center.x+radius*.18,base.x);alpha*=1.-.72*moonBlend;}}
    if(scene<.5)alpha*=mix(smoothstep(.06,.16,base.x/resolution.x),1.,mobile);
    if(scene<.5&&journey>=0.){
      float j=clamp(journey,0.,1.),surge=smoothstep(.12,.78,j),consume=smoothstep(.22,.84,j);
      float rank=fract(seed.z*17.31+seed.y*11.73),nearMoon=pow(smoothstep(.06,.83,stream),.78);
      float density=clamp(.010+.72*nearMoon+.06*surge*pow(nearMoon,.45),0.,1.);
      float edge=1.-smoothstep(.30,1.42,abs(plumeEdge));
      float lunarRadius=length((base-center)/radius);
      float insideDisc=1.-smoothstep(.99,1.02,lunarRadius);
      float visibleMoon=smoothstep(-.78,.13,(base.x-center.x)/radius);
      vec2 lunarPos=(base-center)/radius;float front=mix(-1.30,1.30,smoothstep(.22,.78,j));float ragged=sin(lunarPos.y*17.+lunarPos.x*9.)*.07+sin(lunarPos.y*31.-lunarPos.x*13.)*.035;float solidRemain=smoothstep(front-.28,front+.28,lunarPos.x+ragged);float contact=1.-insideDisc*visibleMoon*solidRemain*.9;
      float flowEnvelope=smoothstep(.01,.09,stream)*(1.-smoothstep(.96,1.,stream));
      float moonAlpha=plume*edge*contact*step(rank,density)*flowEnvelope*mix(.58,.84,surge);
      col=mix(col,mix(vec3(mix(.40,.93,pow(stream,1.2))),vec3(.83,.57,.23),lightTheme),plume*.82);
      float reach=radius*consume*(.10+.42*q.x);
      base.x+=reach;
      base.y+=(seed.z-.5)*radius*consume*.18;
      // Cloud grains start in the drifting banks, then join the same advancing current.
      if(cloudParticle>.5){
        float band=fract(q.y*4.);
        float offset=band<.30?-.15:band<.58?-.02:band<.84?.12:.19;
        vec2 cloudBase=vec2(q.x*resolution.x,(.39+.045*sin(q.x*5.1+seed.z*4.)+offset+(q.y-.5)*.075)*resolution.y);
        cloudBase+=vec2(sin(time*.14+a)*8.,cos(time*.11+a)*4.);
        float gather=smoothstep(.25,.58,j);
        base=mix(cloudBase,base,gather);
        moonAlpha=mix(.38*step(rank,.72)*(1.-smoothstep(.80,1.,q.x)),moonAlpha,gather)*smoothstep(.20,.38,j);
        col=mix(vec3(.55,.57,.56),col,gather);
      }
      if(cloudParticle<.5&&seed.z<.20){
        vec2 moonPos=xy;float grainRagged=sin(moonPos.y*17.+moonPos.x*9.)*.07+sin(moonPos.y*31.-moonPos.x*13.)*.035;
        float boundary=moonPos.x+grainRagged-front;float release=1.-smoothstep(-.22,.24,boundary);
        float grainMask=(1.-smoothstep(.96,1.,rr))*smoothstep(-.78,.13,moonPos.x)*smoothstep(.16,.28,j);
        float grainAlpha=grainMask*(1.-smoothstep(.05,.50,abs(boundary)))*.68;
        vec2 grainBase=center+xy*radius+vec2(-radius*release*.18,(seed.y-.5)*radius*release*.09);
        base=grainBase;moonAlpha=grainAlpha;col=moonSurfaceColor*.78+vec3(.08);
      }
      float screenReveal=smoothstep(.56,.72,j),portraitReveal=smoothstep(.57,.70,j),roomEnter=smoothstep(.93,.985,j);
      vec2 screenTarget=q*resolution;
      vec4 frame=portraitFrame();vec2 portraitTarget=frame.xy+(q-.5)*frame.zw;
      float burstRank=fract(seed.x*13.29+seed.y*7.11+seed.z*23.31);
      vec4 photoTexel=texture2D(portraitImage,q);
      float portraitMask=photoTexel.a*(1.-smoothstep(.62,1.08,length((q-vec2(.5,.55))/vec2(.53,.63))))*smoothstep(.08,.38,q.y)*smoothstep(.025,.48,photoTexel.r);
      base=mix(base,screenTarget,screenReveal);
      float characterGroup=step(.45,seed.z);
      float portraitParticle=characterGroup*step(burstRank,portraitMask*.98);
      base=mix(base,portraitTarget,portraitReveal*portraitParticle);
      // Keep the human portrait on the right; the reference face occupies the left.
      // Crop the sampled region above the logo and credits, without displaying the reference rectangle.
      vec4 lichTexel=texture2D(lichImage,q);
      float lichLum=dot(lichTexel.rgb,vec3(.299,.587,.114));
      float logoFree=smoothstep(.60,.66,q.x)+smoothstep(.25,.30,q.y);
      float lichMask=smoothstep(.025,.25,lichLum)*(1.-smoothstep(.76,1.05,length((q-vec2(.56,.55))/vec2(.62,.66))))*clamp(logoFree,0.,1.);
      float lichHeight=min(resolution.y*.84,resolution.x*.46/1.2440945);
      vec2 lichSize=vec2(lichHeight*1.2440945,lichHeight);
      vec2 lichTarget=vec2(resolution.x*mix(.29,.30,mobile),resolution.y*.51)+(q-.5)*lichSize;
      float lichParticle=(1.-characterGroup)*step(burstRank,lichMask*.98);
      base=mix(base,lichTarget,portraitReveal*lichParticle);
      float disperse=smoothstep(.86,.995,j);
      base+=vec2(sin(a+q.y*9.),cos(a+q.x*8.))*resolution*vec2(.075,.12)*disperse*disperse;

      float cloudFill=step(burstRank,mix(.61,.97,smoothstep(.66,.81,j)))*mix(.72,.96,smoothstep(.66,.81,j));
      float portraitDots=max(portraitMask*portraitParticle*1.65,lichParticle*(.05+2.10*pow(lichLum,.65)));
      alpha=mix(moonAlpha,cloudFill*.58,screenReveal);
      alpha=mix(alpha,max(cloudFill*.10,portraitDots),portraitReveal);
      // Individual grains fade at staggered times; no rectangular convergence or shrinking image.
      alpha*=1.-smoothstep(.87+seed.z*.045,.96+seed.z*.04,j);
      col=mix(col,vec3(.24)+photoTexel.rgb*.68,portraitReveal*portraitParticle);
      col=mix(col,vec3(.83,.81,.75),screenReveal*(1.-portraitReveal)*.45);
      col=mix(col,pow(lichTexel.rgb,vec3(.68))*1.50+vec3(.05),portraitReveal*lichParticle);
    }
    if(scene<.5&&lightTheme>.5){float lightArrival=journey>=0.?smoothstep(.10,.34,journey):smoothstep(.04,.24,progress);alpha*=lightArrival;}
    tint=vec4(col,alpha);gl_Position=vec4(base/resolution*2.-1.,0.,1.);gl_PointSize=(mix(1.20+seed.z*1.75+d*.9,2.80,tipMarker)+(scene<.5&&journey>=0.?smoothstep(.20,.72,journey)*.55+smoothstep(.72,.98,stream)*.40:0.))*pixelRatio;
  }`;
  const pointFragment=`precision mediump float;varying vec4 tint;void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(tint.rgb,tint.a*(1.-smoothstep(.15,.5,r)));}`;

  let surfaceCache;
  function makeSurface() {
    if(surfaceCache)return surfaceCache;
    const width = 1024, height = 512;
    const c = document.createElement('canvas'); c.width = width; c.height = height;
    const context = c.getContext('2d', { willReadFrequently: true });
    let seed = 752849;
    const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    const grids = [8,16,32,64,128,256].map(size => ({size, values: Float32Array.from({length:size*size}, random)}));
    const smooth = x => x*x*(3-2*x);
    function value(g,x,y) {
      const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy),s=g.size,v=g.values;
      const a=v[((iy%s+s)%s)*s+((ix%s+s)%s)], b=v[((iy%s+s)%s)*s+((ix+1)%s+s)%s];
      const d=v[((iy+1)%s+s)%s*s+((ix%s+s)%s)], e=v[((iy+1)%s+s)%s*s+((ix+1)%s+s)%s];
      return (a+(b-a)*fx)*(1-fy)+(d+(e-d)*fx)*fy;
    }
    const im = context.createImageData(width,height), data=im.data;
    for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
      let n=0, weight=.5;
      for (let k=0;k<grids.length;k++) {const g=grids[k];n+=value(g,x/width*g.size,y/height*g.size)*weight;weight*=.52;}
      const maria=value(grids[0],x/width*5.8+1.7,y/height*5.1);
      const broad=Math.max(0,Math.min(1,(maria-.37)*3.7));
      const g=Math.round(94+n*130+broad*40+(random()-.5)*11);
      const at=(y*width+x)*4;data[at]=data[at+1]=data[at+2]=g;data[at+3]=255;
    }
    context.putImageData(im,0,0);
    // Every crater is generated from a fixed seed. Faint rays and irregular pits
    // are baked only once, leaving the animation to a single small GPU pass.
    for(let i=0;i<2100;i++) {
      const x=random()*width,y=random()*height;
      const r=i<38?8+random()*20:.6+Math.pow(random(),3)*7;
      const stretch=1/Math.max(.45,Math.cos((y/height-.5)*Math.PI));
      context.save();context.translate(x,y);context.scale(stretch,1);
      if(i<12){context.globalAlpha=.045;context.strokeStyle='#faf8ed';context.lineWidth=.8;for(let ray=0;ray<13;ray++){const a=random()*Math.PI*2;context.beginPath();context.moveTo(Math.cos(a)*r,Math.sin(a)*r);context.lineTo(Math.cos(a)*r*(2+random()*3),Math.sin(a)*r*(2+random()*3));context.stroke();}}
      context.globalAlpha=i<38?.31:.22;
      let g=context.createRadialGradient(-r*.19,-r*.2,r*.05,0,0,r);
      g.addColorStop(0,'#77776f');g.addColorStop(.56,'#585852');g.addColorStop(.73,'#95958b');g.addColorStop(.85,'#e3e3d6');g.addColorStop(1,'rgba(182,182,169,0)');
      context.fillStyle=g;context.beginPath();context.arc(0,0,r,0,Math.PI*2);context.fill();
      context.globalAlpha=.18;context.strokeStyle='#e0e0d4';context.lineWidth=Math.max(.5,r*.12);context.beginPath();context.arc(-r*.04,-r*.03,r*.77,.73*Math.PI,1.75*Math.PI);context.stroke();
      context.restore();
    }
    surfaceCache=c;
    return c;
  }

  function fallback(canvas,options={}) {
    const ctx=canvas.getContext('2d');
    let progress=0,morph=0,journey=-1,theme='dark',scene=options.scene||'moon',disposed=false,visible=true;
    const portrait=new Image(),earth=new Image();portrait.crossOrigin=earth.crossOrigin='anonymous';portrait.onload=earth.onload=()=>{if(!disposed)draw();};if(options.portrait)portrait.src=options.portrait;if(options.earth)earth.src=options.earth;
    function draw(){
      if(disposed||!visible||document.hidden)return;
      const {width,height}=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect()),pixelWidth=Math.max(1,Math.round(width)),pixelHeight=Math.max(1,Math.round(height));if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;
      if(!ctx)return;
      ctx.clearRect(0,0,width,height);
      const mobile=width<=700,r=mobile?Math.min(width*.38,height*.225):Math.min(width*.27,height*.35);
      const x=width*(mobile?.6:.70),y=height*(mobile?.31:.49);
      const smoothAt=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
      const portraitVisible=0;
      ctx.globalAlpha=journey>=0&&scene==='moon'?1-smoothAt(.22,.96,journey):1-progress;const grad=ctx.createRadialGradient(x-r*.32,y-r*.3,r*.1,x,y,r);const daylight=false;grad.addColorStop(0,daylight?'#fae2ab':'#b9bcb2');grad.addColorStop(.78,daylight?'#e7bb70':'#73786e');grad.addColorStop(1,daylight?'#dca75a':'#383e36');if(daylight){const halo=ctx.createRadialGradient(x,y,r*.96,x,y,r*1.12);halo.addColorStop(0,'#dca75a25');halo.addColorStop(1,'#dca75a00');ctx.fillStyle=halo;ctx.fillRect(x-r*1.12,y-r*1.12,r*2.24,r*2.24);}
      if((scene==='portrait'||morph>0||portraitVisible>0)&&portrait.complete&&portrait.naturalWidth){const smooth=(end)=>{const v=Math.min(1,progress/end);return v*v*(3-2*v);},zoom=1+1.35*smooth(.65),travel=smooth(.85),side=options.portraitLayout==='footer-side'&&!mobile,h=(mobile?Math.min(height*.59,width*1.27):Math.min(height*.98,width*.72))*zoom*(side?1.65:1),w=h*.752,cx=width*(side?.84:mobile?.5:.745-(.745-.58)*travel),cy=height*(side?.71:mobile?.295+(.44-.295)*travel:.51-(.51-.50)*travel);ctx.globalAlpha=scene==='portrait'?1:portraitVisible||morph;ctx.drawImage(portrait,cx-w/2,cy-h/2,w,h);ctx.globalCompositeOperation='destination-in';const fade=ctx.createRadialGradient(cx,cy-h*.08,h*.08,cx,cy,h*.5);fade.addColorStop(0,'#000');fade.addColorStop(.6,'#000b');fade.addColorStop(1,'#0000');ctx.fillStyle=fade;ctx.fillRect(0,0,width,height);ctx.globalCompositeOperation='source-over';}
      else{ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();if(scene==='earth'&&earth.complete&&earth.naturalWidth){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();ctx.globalAlpha=(1-progress)*.7;ctx.drawImage(earth,x-r,y-r,r*2,r*2);ctx.restore();}}ctx.globalAlpha=1;canvas.dataset.moonReady='true';canvas.dataset.scene=scene;canvas.dataset.renderer='2d';
    }
    const observer=new ResizeObserver(draw);observer.observe(canvas);
    const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)draw();},{rootMargin:'100px'});visibility.observe(canvas);
    const onVisibility=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',onVisibility);
    draw();return {setProgress(p){progress=Math.max(0,Math.min(1,p));draw();},setMorph(value){morph=Math.max(0,Math.min(1,value));draw();},setJourney(value){journey=Number.isFinite(value)?Math.max(-1,Math.min(1,value)):-1;draw();},setTheme(t){theme=t;draw();},setScene(value){scene=value;draw();},resize:draw,destroy(){if(disposed)return;disposed=true;observer.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',onVisibility);portrait.onload=earth.onload=null;ctx?.clearRect(0,0,canvas.width,canvas.height);}};
  }

  function mountRenderer(canvas,options={}) {
    if(!(canvas instanceof HTMLCanvasElement))throw new TypeError('LuliyMoon.mount requires a canvas.');
    const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'low-power'});
    if(!gl)return fallback(canvas,options);
    function compile(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(sh);gl.deleteShader(sh);throw new Error(error);}return sh;}
    const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment),program=gl.createProgram();
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const at=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,makeSurface());
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const uniform={};['resolution','surface','time','progress','lightTheme','portraitLayout'].forEach(k=>uniform[k]=gl.getUniformLocation(program,k));
    ['portraitImage','earthImage','scene','transition','morph','journey'].forEach(k=>uniform[k]=gl.getUniformLocation(program,k));
    gl.uniform1i(uniform.surface,0);
    const extraTextures=[],images=[];
    if(options.surface){const moonMap=new Image();images.push(moonMap);moonMap.onload=()=>{if(disposed)return;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);const powerOfTwo=n=>n>0&&(n&(n-1))===0;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,powerOfTwo(moonMap.naturalWidth)&&powerOfTwo(moonMap.naturalHeight)?gl.REPEAT:gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,moonMap);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);canvas.dataset.assetsReady=String(images.every(i=>i.complete&&i.naturalWidth>0));request();};moonMap.src=options.surface;}
    function imageTexture(src,unit,uniformName){const tex=gl.createTexture();extraTextures.push(tex);gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([80,90,92,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);if(uniform[uniformName])gl.uniform1i(uniform[uniformName],unit);if(src){const im=new Image();im.crossOrigin='anonymous';images.push(im);im.onload=()=>{if(disposed)return;gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);canvas.dataset.assetsReady=String(images.every(i=>i.complete&&i.naturalWidth>0));request();};im.src=src;}}
    imageTexture(options.portrait,1,'portraitImage');imageTexture(options.earth,2,'earthImage');
    const pvs=compile(gl.VERTEX_SHADER,pointVertex),pfs=compile(gl.FRAGMENT_SHADER,pointFragment),pp=gl.createProgram();gl.attachShader(pp,pvs);gl.attachShader(pp,pfs);gl.linkProgram(pp);if(!gl.getProgramParameter(pp,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(pp));
    const points=gl.createBuffer(),count=innerWidth<=700?175:280,values=new Float32Array(count*count*3);let particleSeed=1273941;const randomParticle=()=>((particleSeed=(Math.imul(particleSeed,1664525)+1013904223)>>>0)/4294967296);for(let i=0;i<count*count*3;i++)values[i]=randomParticle();values[0]=values[1]=values[2]=0;gl.bindBuffer(gl.ARRAY_BUFFER,points);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);const pa=gl.getAttribLocation(pp,'seed'),pu={};['resolution','surface','portraitImage','earthImage','studyImage','lichImage','time','progress','scene','transition','morph','lightTheme','pixelRatio','portraitLayout','journey'].forEach(k=>pu[k]=gl.getUniformLocation(pp,k));
    const studyTexture=gl.createTexture();extraTextures.push(studyTexture);gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,studyTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([56,56,54,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.useProgram(pp);gl.uniform1i(pu.studyImage,3);gl.useProgram(program);
    if(options.study){const studyPhoto=new Image();studyPhoto.crossOrigin='anonymous';images.push(studyPhoto);studyPhoto.onload=()=>{if(disposed)return;gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,studyTexture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,studyPhoto);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);canvas.dataset.assetsReady=String(images.every(i=>i.complete&&i.naturalWidth>0));request();};studyPhoto.src=options.study;}
    gl.useProgram(pp);pu.lichImage=gl.getUniformLocation(pp,'lichImage');
    imageTexture(options.lich,4,'lichImage');gl.uniform1i(pu.lichImage,4);gl.useProgram(program);
    let p=0,morph=0,journey=-1,theme=document.documentElement.dataset.theme||'dark',frame=0,disposed=false,visible=true,dirty=true,drawn=0,start=performance.now(),width=0,height=0;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const sceneIds={moon:0,earth:1,portrait:2};let scene=sceneIds[options.scene]??0,targetScene=scene,switchStart=-1;
    function draw(now=performance.now()) {
      frame=0;if(disposed||!visible||document.hidden||gl.isContextLost())return;
      // 30fps is enough for contemplative cloud motion. Avoid offscreen GPU work.
      if(dirty||now-drawn>=32||motion.matches){
        dirty=false;
        let transition=0;if(switchStart>=0){const t=Math.min(1,(now-switchStart)/1450);transition=Math.sin(t*Math.PI);if(t>=.5)scene=targetScene;if(t===1)switchStart=-1;}
        {const ds=canvas.dataset,set=(k,v)=>{if(ds[k]!==v)ds[k]=v;};set('scene',Object.keys(sceneIds).find(k=>sceneIds[k]===scene));set('transition',String(transition));set('morph',String(morph));set('journey',String(journey));}
        gl.disable(gl.BLEND);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);gl.uniform2f(uniform.resolution,width,height);gl.uniform1f(uniform.time,motion.matches?0:(now-start)/1000);gl.uniform1f(uniform.progress,p);gl.uniform1f(uniform.lightTheme,theme==='light'?1:0);gl.uniform1f(uniform.scene,scene);gl.uniform1f(uniform.transition,transition);gl.uniform1f(uniform.morph,morph);gl.uniform1f(uniform.journey,journey);gl.uniform1f(uniform.portraitLayout,options.portraitLayout==='footer-side'?1:0);
        gl.drawArrays(gl.TRIANGLES,0,6);
        if(!motion.matches&&(scene===0||p>.08||transition>.01)){gl.useProgram(pp);gl.bindBuffer(gl.ARRAY_BUFFER,points);gl.enableVertexAttribArray(pa);gl.vertexAttribPointer(pa,3,gl.FLOAT,false,0,0);gl.uniform2f(pu.resolution,width,height);gl.uniform1i(pu.surface,0);gl.uniform1i(pu.portraitImage,1);gl.uniform1i(pu.earthImage,2);gl.uniform1i(pu.studyImage,3);gl.uniform1i(pu.lichImage,4);gl.uniform1f(pu.time,(now-start)/1000);gl.uniform1f(pu.progress,p);gl.uniform1f(pu.scene,scene);gl.uniform1f(pu.transition,transition);gl.uniform1f(pu.morph,morph);gl.uniform1f(pu.journey,journey);gl.uniform1f(pu.lightTheme,theme==='light'?1:0);gl.uniform1f(pu.pixelRatio,canvas.width/width);gl.uniform1f(pu.portraitLayout,options.portraitLayout==='footer-side'?1:0);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.POINTS,0,count*count);gl.disable(gl.BLEND);}
        drawn=now;if(canvas.dataset.moonReady!=='true')canvas.dataset.moonReady='true';
      }
      if(visible&&!motion.matches&&!document.hidden&&p<1&&morph<.98)frame=requestAnimationFrame(draw);
    }
    function request(){if(disposed)return;dirty=true;if(visible&&!document.hidden&&!gl.isContextLost()&&!frame)frame=requestAnimationFrame(draw);}
    function resize(){if(disposed)return;const box=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect()),ratio=Math.min(devicePixelRatio||1,1.25,Math.sqrt(2000000/Math.max(1,box.width*box.height)));width=Math.max(1,box.width);height=Math.max(1,box.height);const pixelWidth=Math.round(width*ratio),pixelHeight=Math.round(height*ratio);if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;gl.viewport(0,0,canvas.width,canvas.height);request();}
    const size=new ResizeObserver(resize);size.observe(canvas);
    const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});observer.observe(canvas);
    const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();};
    const onMotion=()=>{cancelAnimationFrame(frame);frame=0;request();};
    document.addEventListener('visibilitychange',onVisibility);motion.addEventListener('change',onMotion);
    resize();
    return {
      setProgress(value){const next=Math.max(0,Math.min(1,Number(value)||0));if(next!==p){p=next;request();}},
      setMorph(value){const next=Math.max(0,Math.min(1,Number(value)||0));if(next!==morph){morph=next;request();}},
      setJourney(value){const next=Number.isFinite(value)?Math.max(-1,Math.min(1,value)):-1;if(next!==journey){journey=next;request();}},
      setTheme(value){const next=value==='light'?'light':'dark';if(next!==theme){theme=next;request();}},
      setScene(value){const next=sceneIds[value]??0;if(next===targetScene)return;targetScene=next;if(motion.matches){scene=targetScene;switchStart=-1;}else switchStart=performance.now();request();},
      resize,
      destroy(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);size.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);motion.removeEventListener('change',onMotion);images.forEach(i=>i.onload=null);extraTextures.forEach(t=>gl.deleteTexture(t));gl.deleteBuffer(points);gl.deleteProgram(pp);gl.deleteShader(pvs);gl.deleteShader(pfs);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);delete canvas.dataset.moonReady;}
    };
  }
  // A restored GPU context invalidates every texture, shader and buffer. Keep
  // the public scene handle stable while rebuilding its original resources.
  function mount(canvas,options={}){
    let renderer=mountRenderer(canvas,options),disposed=false,lost=false;
    const state={Progress:0,Morph:0,Journey:-1,Theme:document.documentElement.dataset.theme||'dark',Scene:options.scene||'moon'};
    const set=(name,value)=>{if(disposed)return;state[name]=value;if(!lost)renderer['set'+name](value);};
    function onLost(event){event.preventDefault();if(disposed||lost)return;lost=true;renderer.destroy();}
    function onRestored(){
      if(disposed||!lost)return;
      renderer=mountRenderer(canvas,{...options,scene:state.Scene});lost=false;
      ['Progress','Morph','Journey','Theme'].forEach(name=>renderer['set'+name](state[name]));
    }
    canvas.addEventListener('webglcontextlost',onLost);
    canvas.addEventListener('webglcontextrestored',onRestored);
    return {
      setProgress(value){set('Progress',value);},setMorph(value){set('Morph',value);},setJourney(value){set('Journey',value);},setTheme(value){set('Theme',value);},setScene(value){set('Scene',value);},
      resize(){if(!disposed&&!lost)renderer.resize();},
      destroy(){if(disposed)return;disposed=true;canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestored);renderer.destroy();}
    };
  }
  global.LuliyMoon={mount};
})(window);
