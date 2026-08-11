(() => {
  'use strict';
  const root = document.documentElement;
  const glass = [...document.querySelectorAll('.glass')];
  const canvas = document.getElementById('stars');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  if (!reduced && !coarse) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', (e) => {
      tx = (e.clientX / innerWidth - .5) * 2;
      ty = (e.clientY / innerHeight - .5) * 2;
      for (const el of glass) {
        const r = el.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
        el.style.setProperty('--mx', `${x}%`);
        el.style.setProperty('--my', `${y}%`);
      }
    }, { passive: true });
    const tick = () => {
      cx += (tx - cx) * .045;
      cy += (ty - cy) * .045;
      root.style.setProperty('--px', `${cx * -4}px`);
      root.style.setProperty('--py', `${cy * -3}px`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, stars = [];
  const resize = () => {
    w = innerWidth; h = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(18, Math.min(58, Math.round((w * h) / 36000)));
    stars = Array.from({ length: count }, () => ({x:Math.random()*w,y:Math.random()*h,r:.35+Math.random()*.8,a:.05+Math.random()*.16,s:.008+Math.random()*.026}));
  };
  const draw = () => {
    ctx.clearRect(0,0,w,h);
    for (const s of stars) {
      s.y -= s.s; if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
      ctx.beginPath(); ctx.fillStyle = `rgba(137,220,255,${s.a})`; ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  addEventListener('resize', resize, { passive:true });
  resize(); draw();
})();
