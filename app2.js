(() => {
  'use strict';

  const canvas = document.getElementById('gl');
  const boot = document.getElementById('boot');
  const panel = document.getElementById('glassContent');
  const gl = canvas.getContext('webgl', {alpha:false,antialias:true,premultipliedAlpha:false,powerPreference:'high-performance'});
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (!gl) { boot?.classList.add('is-done'); return; }

  const vs = `attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*.5+.5;gl_Position=vec4(aPos,0.,1.);}`;
  const fs = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTex;
    uniform vec2 uRes,uImg,uMouse;
    uniform vec4 uPanel;
    uniform float uTime,uMotion,uPixelRatio;

    float hash21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.52;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*noise(p);p=m*p+.11;a*=.5;}return v;}
    float sdRoundBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return min(max(q.x,q.y),0.)+length(max(q,0.))-r;}

    vec2 coverUv(vec2 uv,vec2 s,vec2 im){float rs=s.x/s.y,ri=im.x/im.y;vec2 sc=vec2(1.);if(rs>ri)sc.y=ri/rs;else sc.x=rs/ri;return(uv-.5)*sc+.5;}
    vec3 sampleScene(vec2 uv){vec2 cuv=coverUv(uv,uRes,uImg);vec3 c=texture2D(uTex,cuv).rgb;c=pow(c,vec3(.97));c*=.78;float vign=1.-smoothstep(.42,.88,length(uv-.5));c*=mix(.62,1.,vign);return c;}

    void main(){
      vec2 uv=vUv,frag=uv*uRes;
      vec3 bg=sampleScene(uv);
      vec2 pc=uPanel.xy,ps=uPanel.zw,p=frag-pc,lp=p/ps;
      float t=uTime*uMotion;
      float boundaryNoise=(fbm(lp*vec2(3.2,4.0)+vec2(t*.055,-t*.035))-.5)*13.0+sin(lp.y*14.0+t*.22)*2.2;
      float radius=min(ps.x,ps.y)*.10;
      float d=sdRoundBox(p,ps*.5-vec2(4.),radius)+boundaryNoise;
      float aa=max(1.3,uPixelRatio*1.1);
      float inside=1.-smoothstep(-aa,aa,d);

      vec2 fieldUv=uv*vec2(uRes.x/uRes.y,1.);
      float f1=fbm(fieldUv*2.2+vec2(t*.035,-t*.024));
      float f2=fbm(fieldUv*5.4+vec2(-t*.026,t*.031)+1.73);
      float flow=f1*.72+f2*.28;
      float eps=.0022;
      float nx=fbm((fieldUv+vec2(eps,0.))*2.2+vec2(t*.035,-t*.024))-fbm((fieldUv-vec2(eps,0.))*2.2+vec2(t*.035,-t*.024));
      float ny=fbm((fieldUv+vec2(0.,eps))*2.2+vec2(t*.035,-t*.024))-fbm((fieldUv-vec2(0.,eps))*2.2+vec2(t*.035,-t*.024));
      vec2 normal=normalize(vec2(nx,ny)+vec2(.0001));

      vec2 m=uMouse*uRes;
      vec2 fromMouse=(frag-m)/max(ps.x,ps.y);
      float md=length(fromMouse);
      float pressure=exp(-md*md*9.0);
      vec2 mouseDir=normalize((frag-m)+vec2(.001));
      float ripple=sin(md*46.0-t*4.2)*exp(-md*8.5)*pressure;
      float edge=exp(-abs(d)*.072),innerEdge=exp(-abs(d)*.025);
      vec2 refr=(normal*(8.0+22.0*innerEdge)+mouseDir*(pressure*16.0+ripple*8.0)+vec2(flow-.48,(.48-flow)*.7)*10.0)/uRes;
      float chroma=(1.8+edge*11.0)/uRes.x;

      vec3 glass;
      glass.r=sampleScene(uv+refr+normal*chroma).r;
      glass.g=sampleScene(uv+refr).g;
      glass.b=sampleScene(uv+refr-normal*chroma).b;

      float lens=max(0.,1.-dot(lp*vec2(.9,1.05),lp*vec2(.9,1.05)));
      vec2 lensUv=uv+(pc/uRes-uv)*lens*.008*inside;
      glass=mix(glass,sampleScene(lensUv+refr*.72),.30);
      glass=mix(glass,glass+vec3(.015,.052,.075),.70);

      float caust=sin((flow*8.5+lp.y*5.2-t*.24)*6.2831853);
      caust=pow(max(0.,caust),8.0)*inside*.18;
      float caust2=sin((f2*7.0-lp.x*4.2+t*.18)*6.2831853);
      caust2=pow(max(0.,caust2),10.0)*inside*.10;
      float spec=pow(max(0.,1.-length(fromMouse*vec2(.72,1.05))),5.0)*inside;
      float rim=exp(-abs(d)*.13),rimSoft=exp(-abs(d)*.035);
      vec3 rimColor=vec3(.55,.91,1.)*(rim*.72+rimSoft*.13);

      vec3 gf=glass;
      gf+=vec3(.72,.95,1.)*spec*.18;
      gf+=vec3(.38,.84,1.)*(caust+caust2);
      gf+=rimColor;
      gf=mix(gf,gf*vec3(.91,.97,1.05),.42);

      vec3 col=mix(bg,gf,inside);
      float halo=exp(-max(d,0.)*.018)*(1.-inside);
      col+=vec3(.015,.14,.28)*halo*.22;
      float grain=hash21(frag+uTime)-.5;
      col+=grain*.0045;
      gl_FragColor=vec4(col,1.);
    }`;

  const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader error');return s;};
  let prog;
  try{prog=gl.createProgram();gl.attachShader(prog,compile(gl.VERTEX_SHADER,vs));gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog)||'link error');}
  catch(err){console.error(err);boot?.classList.add('is-done');return;}

  gl.useProgram(prog);
  const pos=gl.getAttribLocation(prog,'aPos');
  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);

  const U={};['uTex','uRes','uImg','uMouse','uPanel','uTime','uMotion','uPixelRatio'].forEach(n=>U[n]=gl.getUniformLocation(prog,n));
  const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.uniform1i(U.uTex,0);

  const image=new Image();
  image.src='assets/tervyxa-original.webp';
  let W=1,H=1,dpr=1,mx=.5,my=.5,tx=.5,ty=.5,panelData=[0,0,100,100],start=performance.now();
  const updatePanel=()=>{const r=panel.getBoundingClientRect();panelData=[r.left+r.width/2,H-(r.top+r.height/2),r.width,r.height];};
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,coarse?1.25:1.7);W=innerWidth;H=innerHeight;canvas.width=Math.floor(W*dpr);canvas.height=Math.floor(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px';gl.viewport(0,0,canvas.width,canvas.height);updatePanel();};
  addEventListener('resize',resize,{passive:true});
  addEventListener('pointermove',e=>{tx=e.clientX/W;ty=1-e.clientY/H},{passive:true});
  addEventListener('pointerleave',()=>{tx=.5;ty=.5});
  const render=now=>{mx+=(tx-mx)*.075;my+=(ty-my)*.075;updatePanel();gl.uniform2f(U.uRes,W,H);gl.uniform2f(U.uImg,image.naturalWidth||1280,image.naturalHeight||720);gl.uniform2f(U.uMouse,mx,my);gl.uniform4f(U.uPanel,panelData[0],panelData[1],panelData[2],panelData[3]);gl.uniform1f(U.uTime,(now-start)/1000);gl.uniform1f(U.uMotion,reduced?0.:1.);gl.uniform1f(U.uPixelRatio,dpr);gl.drawArrays(gl.TRIANGLES,0,6);requestAnimationFrame(render);};
  image.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);resize();requestAnimationFrame(render);setTimeout(()=>boot?.classList.add('is-done'),reduced?80:900);};
  image.onerror=()=>boot?.classList.add('is-done');
})();
