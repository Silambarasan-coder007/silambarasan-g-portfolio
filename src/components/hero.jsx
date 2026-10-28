import { useEffect, useRef, useState } from 'react';
import photo from '../assets/photo.jpg';
import { ROLES } from '../data';
import { useApp } from '../context';
import { calm } from '../ui';

function useTyped(words) {
  const [txt, setTxt] = useState(words[0]);
  useEffect(() => {
    if (calm()) return undefined;
    let r = 0; let c = 0; let del = false; let id;
    const tick = () => {
      const w = words[r];
      setTxt(w.slice(0, c));
      let d = 85;
      if (!del && c < w.length) { c += 1; }
      else if (!del) { del = true; d = 1500; }
      else if (c > 0) { c -= 1; d = 40; }
      else { del = false; r = (r + 1) % words.length; d = 300; }
      id = setTimeout(tick, d);
    };
    tick();
    return () => clearTimeout(id);
  }, [words]);
  return txt;
}

function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const cx = cv.getContext('2d');
    let W; let H; let P = []; let run = true; let raf;
    const size = () => {
      const r = cv.getBoundingClientRect();
      W = cv.width = r.width; H = cv.height = r.height;
      const n = Math.min(48, Math.floor(W / 22));
      P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
    };
    const draw = () => {
      if (!run) return;
      cx.clearRect(0, 0, W, H);
      const col = getComputedStyle(document.documentElement).getPropertyValue('--a').trim() || '#1783A6';
      cx.fillStyle = col; cx.strokeStyle = col;
      for (let i = 0; i < P.length; i += 1) {
        const a = P[i];
        if (!calm()) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
        cx.globalAlpha = 0.55; cx.beginPath(); cx.arc(a.x, a.y, 2, 0, 6.3); cx.fill();
        for (let j = i + 1; j < P.length; j += 1) {
          const b = P[j]; const dx = a.x - b.x; const dy = a.y - b.y; const d = dx * dx + dy * dy;
          if (d < 9000) { cx.globalAlpha = 0.22 * (1 - d / 9000); cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
        }
      }
      if (!calm()) raf = requestAnimationFrame(draw);
    };
    size(); draw();
    const onResize = () => { size(); if (calm()) draw(); };
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver(([e]) => {
      const v = e.isIntersecting;
      if (v && !run) { run = true; draw(); }
      run = v;
    });
    io.observe(cv);
    return () => { run = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); io.disconnect(); };
  }, []);
  return <canvas id="pt" ref={ref} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full" />;
}

export default function Hero() {
  const { t } = useApp();
  const role = useTyped(ROLES);
  const delay = (i) => ({ animationDelay: `${i * 0.12}s` });
  return (
    <header id="top" className="relative overflow-hidden pb-[72px] pt-[84px] max-sm:pt-14">
      <div className="orb o1" aria-hidden="true" />
      <div className="orb o2" aria-hidden="true" />
      <Particles />
      <div className="wrap relative z-[1] grid grid-cols-[1fr_auto] items-center gap-10 max-[760px]:grid-cols-1">
        <div>
          <p className="in m-0 mb-2.5 font-medium text-muted" style={delay(0)}>{t('hello')}</p>
          <h1 className="in grad-text text-[clamp(2.8rem,11vw,5.8rem)] font-extrabold tracking-[-.025em]" style={delay(1)}>Silambarasan G</h1>
          <p className="in m-0 mt-4 min-h-[1.4em] font-display text-[clamp(1.2rem,4vw,1.8rem)] font-bold" style={delay(2)}>
            <span>{role}</span><span className="caret" aria-hidden="true" />
          </p>
          <p className="in mb-7 mt-5 max-w-[56ch] text-[1.08rem] text-muted" style={delay(3)}>{t('lead')}</p>
          <div className="in flex flex-wrap gap-3" style={delay(4)}>
            <a className="btn btn-main" href="#projects">{t('bProj')}</a>
            <a className="btn btn-alt" href="#contact">{t('bGet')}</a>
            <a className="btn btn-alt" href={`${import.meta.env.BASE_URL}Silambarasan_G_Resume.pdf`} download="Silambarasan_G_Resume.pdf">{t('bRes')}</a>
          </div>
        </div>
        <figure className="in m-0 max-[760px]:order-first" style={delay(1)}>
          <div className="ring">
            <img src={photo} alt="Portrait of Silambarasan G" width="260" height="293" />
          </div>
        </figure>
      </div>
    </header>
  );
}