(() => {
  'use strict';

  const canvas = document.getElementById('gl');
  const boot = document.getElementById('boot');
  const panel = document.getElementById('glassContent');
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: 'high-performance'
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  if (!gl) {
    document.body.classList.add('no-webgl');
    boot?.classList.add('is-done');
    return;
  }

  const vs = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos,0.0,1.0);
    }
  `;

  const fs = `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D uTex;
    uniform vec2 uRes;
    uniform vec2 uImg;
    uniform vec2 uMouse;
    uniform vec4 uPanel;
    uniform float uTime;
    uniform float uMotion;
    uniform float uPixelRatio;

    float hash21(vec2 p){
      p = fract(p*vec2(123.34,345.45));
      p += dot(p,p+34.345);
      return fract(p.x*p.y);
    }

    float noise(vec2 p){
      vec2 i=floor(p);
      vec2 f=fract(p);
      f=f*f*(3.0-2.0*f);
      float a=hash21(i);
      float b=hash21(i+vec2(1.,0.));
      float c=hash21(i+vec2(0.,1.));
      float d=hash21(i+vec2(1.,1.));
      return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
    }

    float fbm(vec2 p){
      float v=0.0;
      float a=.52;
      mat2 m=mat2(1.6,1.2,-1.2,1.6);
      for(int i=0;i<5;i++){
        v+=a*noise(p);
        p=m*p+0.11;
        a*=.5;
      }
      return v;
    }

    vec2 coverUv(vec2 uv, vec2 screen, vec2 image){
      float rs=screen.x/screen.y;
      float ri=image.x/image.y;
      vec2 scale=vec2(1.0);
      if(rs>ri) scale.y=ri/rs;
      else scale.x=rs/ri;
      return (uv-.5)*scale+.5;
    }

    float sdRoundBox(vec2 p, vec2 b, float r){
      vec2 q=abs(p)-b+r;
      return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r;
    }

    vec3 sampleBg(vec2 uv){
      vec2 cuv=coverUv(uv,uRes,uImg);
      vec3 c=texture2D(uTex,cuv).rgb;
      c=pow(c,vec3(.96));
      c*=.64;
      float vign=smoothstep(.92,.18,length(uv-.5));
      c*=mix(.62,1.0,vign);
      return c;
    }

    void main(){
      vec2 uv=vUv;
      vec2 frag=uv*uRes;
      vec3 bg=sampleBg(uv);

      vec2 pc=uPanel.xy;
      vec2 ps=uPanel.zw;
      vec2 p=(frag-pc);
      float radius=min(ps.x,ps.y)*.065;
      float d=sdRoundBox(p,ps*.5,radius);

      float aa=1.5*uPixelRatio;
      float inside=1.0-smoothstep(-aa,aa,d);

      vec2 nUv=uv*vec2(uRes.x/uRes.y,1.0);
      float t=uTime*.12*uMotion;
      float n1=fbm(nUv*2.7+vec2(t,-t*.6));
      float n2=fbm(nUv*5.1+vec2(-t*.45,t*.7)+1.7);
      float n=n1*.72+n2*.28;

      float eps=.0025;
      float nx=fbm((nUv+vec2(eps,0.))*2.7+vec2(t,-t*.6))-fbm((nUv-vec2(eps,0.))*2.7+vec2(t,-t*.6));
      float ny=fbm((nUv+vec2(0.,eps))*2.7+vec2(t,-t*.6))-fbm((nUv-vec2(0.,eps))*2.7+vec2(t,-t*.6));
      vec2 normal=normalize(vec2(nx,ny)+.0001);

      vec2 m=uMouse*uRes;
      float md=length((frag-m)/max(ps.x,ps.y));
      float pressure=exp(-md*md*7.0);
      vec2 mouseDir=normalize((frag-m)+vec2(.001));

      float edge=exp(-abs(d)*.055);
      float innerEdge=exp(-abs(d)*.018);
      float flow=(n-.48);

      vec2 refractOffset = (
          normal*(5.0 + 13.0*innerEdge)
        + mouseDir*pressure*10.0
        + vec2(flow,-flow*.55)*7.0
      ) / uRes;

      float chroma=(1.5+edge*7.0)/uRes.x;
      vec2 rOff=refractOffset+normal*chroma;
      vec2 bOff=refractOffset-normal*chroma;

      vec3 glass;
      glass.r=sampleBg(uv+rOff).r;
      glass.g=sampleBg(uv+refractOffset).g;
      glass.b=sampleBg(uv+bOff).b;

      vec2 local=(frag-pc)/ps;
      float lens=max(0.0,1.0-dot(local,local));
      vec2 lensUv=uv + (pc/uRes-uv)*lens*.006*inside;
      vec3 lensSample=sampleBg(lensUv+refractOffset*.75);
      glass=mix(glass,lensSample,.32);

      glass=mix(glass,glass+vec3(.018,.055,.078),.72);

      vec2 lp=(frag-m)/ps;
      float spec=pow(max(0.0,1.0-length(lp*vec2(.78,1.05))),5.0);
      spec*=inside;

      float caust=sin((n*9.0 + uv.y*5.0 - uTime*.33*uMotion)*6.2831);
      caust=pow(max(0.0,caust),6.0)*inside*.16;

      float rim=exp(-abs(d)*.11);
      float rim2=exp(-abs(d)*.035);
      vec3 rimColor=vec3(.48,.88,1.0)*(rim*.58+rim2*.12);

      float topSpec=smoothstep(.65,.04,abs(d))*smoothstep(.92,.18,uv.y);
      topSpec*=smoothstep(.05,.85,uv.x);
      float bottomGlow=smoothstep(.18,.78,uv.y)*inside*.055;

      vec3 glassFinal=glass;
      glassFinal += vec3(.68,.92,1.0)*spec*.16;
      glassFinal += vec3(.40,.86,1.0)*caust;
      glassFinal += vec3(.10,.42,.72)*bottomGlow;
      glassFinal += rimColor;
      glassFinal += vec3(1.0)*topSpec*.015;
      glassFinal=mix(glassFinal,glassFinal*vec3(.91,.96,1.03),.38);

      vec3 col=mix(bg,glassFinal,inside);
      float halo=exp(-max(d,0.0)*.012)*(1.0-inside);
      col += vec3(.02,.16,.30)*halo*.17;
      float grain=hash21(frag+uTime)-.5;
      col+=grain*.006;
      float vig=1.0-smoothstep(.36,.84,length(uv-.5));
      col*=mix(.78,1.0,vig);

      gl_FragColor=vec4(col,1.0);
    }
  `;

  const compile=(type,src)=>{
    const s=gl.createShader(type);
    gl.shaderSource(s,src);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'shader error');
    return s;
  };

  let prog;
  try{
    prog=gl.createProgram();
    gl.attachShader(prog,compile(gl.VERTEX_SHADER,vs));
    gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog)||'link error');
  }catch(err){
    console.error(err);
    boot?.classList.add('is-done');
    return;
  }

  gl.useProgram(prog);
  const pos=gl.getAttribLocation(prog,'aPos');
  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);

  const U={};
  ['uTex','uRes','uImg','uMouse','uPanel','uTime','uMotion','uPixelRatio'].forEach(n=>U[n]=gl.getUniformLocation(prog,n));

  const tex=gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.uniform1i(U.uTex,0);

  const image=new Image();
  image.src='assets/tervyxa-hero.png';

  let W=1,H=1,dpr=1;
  let mx=.5,my=.5,tx=.5,ty=.5;
  let panelData=[0,0,100,100];
  let start=performance.now();

  const updatePanel=()=>{
    const r=panel.getBoundingClientRect();
    panelData=[r.left+r.width/2,H-(r.top+r.height/2),r.width,r.height];
  };

  const resize=()=>{
    dpr=Math.min(devicePixelRatio||1,coarse?1.35:1.8);
    W=innerWidth;
    H=innerHeight;
    canvas.width=Math.floor(W*dpr);
    canvas.height=Math.floor(H*dpr);
    canvas.style.width=W+'px';
    canvas.style.height=H+'px';
    gl.viewport(0,0,canvas.width,canvas.height);
    updatePanel();
  };

  addEventListener('resize',resize,{passive:true});
  addEventListener('pointermove',e=>{tx=e.clientX/W;ty=1-e.clientY/H},{passive:true});
  addEventListener('pointerleave',()=>{tx=.5;ty=.5});

  const render=(now)=>{
    mx+=(tx-mx)*.075;
    my+=(ty-my)*.075;
    gl.uniform2f(U.uRes,W,H);
    gl.uniform2f(U.uImg,image.naturalWidth||1920,image.naturalHeight||1080);
    gl.uniform2f(U.uMouse,mx,my);
    gl.uniform4f(U.uPanel,panelData[0],panelData[1],panelData[2],panelData[3]);
    gl.uniform1f(U.uTime,(now-start)/1000);
    gl.uniform1f(U.uMotion,reduced?0.0:1.0);
    gl.uniform1f(U.uPixelRatio,dpr);
    gl.drawArrays(gl.TRIANGLES,0,6);
    requestAnimationFrame(render);
  };

  image.onload=()=>{
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
    resize();
    requestAnimationFrame(render);
    setTimeout(()=>boot?.classList.add('is-done'),reduced?100:1150);
  };

  image.onerror=()=>boot?.classList.add('is-done');
})();
