import { useEffect, useRef, useState } from 'react';
import { calm } from '../ui';

export function Intro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(id);
  }, []);
  return show ? <div id="intro" aria-hidden="true"><b>SG</b></div> : null;
}

export function ProgressBar() {
  const ref = useRef(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.width = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
    };
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div id="prog" ref={ref} aria-hidden="true" />;
}

export function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(hover:hover)').matches || calm()) return undefined;
    const move = (e) => {
      const g = ref.current;
      if (!g) return;
      g.style.opacity = 1;
      g.style.transform = `translate(${e.clientX - 190}px,${e.clientY - 190}px)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div className="glow" ref={ref} aria-hidden="true" />;
}

export function BackToTop() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > 600);
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <button id="top-btn" type="button" aria-label="Back to top" className={on ? 'on' : ''}
      onClick={() => window.scrollTo({ top: 0, behavior: calm() ? 'auto' : 'smooth' })}>↑</button>
  );
}

export function Confetti() {
  const ref = useRef(null);
  useEffect(() => {
    const boom = () => {
      const cv = ref.current;
      if (!cv) return;
      const cx = cv.getContext('2d');
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
      const cols = ['#1783A6', '#F2B705', '#E8590C', '#3CB6DC', '#C2255C'];
      const ps = Array.from({ length: 140 }, (_, i) => ({
        x: cv.width / 2, y: cv.height / 3, vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 2,
        s: 5 + Math.random() * 6, c: cols[i % 5], r: Math.random() * 6,
      }));
      const t0 = performance.now();
      const f = (t) => {
        cx.clearRect(0, 0, cv.width, cv.height);
        ps.forEach((q) => {
          q.vy += 0.35; q.x += q.vx; q.y += q.vy; q.r += 0.2;
          cx.fillStyle = q.c; cx.save(); cx.translate(q.x, q.y); cx.rotate(q.r);
          cx.fillRect(-q.s / 2, -q.s / 2, q.s, q.s * 0.6); cx.restore();
        });
        if (t - t0 < 3200) requestAnimationFrame(f);
        else cx.clearRect(0, 0, cv.width, cv.height);
      };
      requestAnimationFrame(f);
    };
    window.addEventListener('sg-confetti', boom);
    return () => window.removeEventListener('sg-confetti', boom);
  }, []);
  return <canvas id="conf" ref={ref} aria-hidden="true" />;
}