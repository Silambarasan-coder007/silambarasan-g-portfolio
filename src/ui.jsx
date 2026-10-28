import { useEffect, useRef, useState } from 'react';
import { useApp } from './context';

export const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const celebrate = () => { if (!calm()) window.dispatchEvent(new Event('sg-confetti')); };

export function Reveal({ as: T = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <T ref={ref} className={`rv ${on ? 'show' : ''} ${className}`} {...rest}>{children}</T>;
}

export function Card({ className = '', children, ...rest }) {
  const move = (e) => {
    if (!window.matchMedia('(hover:hover)').matches || calm()) return;
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  };
  const leave = (e) => { e.currentTarget.style.transform = ''; };
  return (
    <Reveal className={`card ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
    </Reveal>
  );
}

export function Section({ id, k, children, hidden }) {
  const { t } = useApp();
  return (
    <section id={id} hidden={hidden} className="pb-1.5 pt-[60px]">
      <h2 className="mb-2 text-[clamp(1.8rem,5vw,2.5rem)]">{t(k)}</h2>
      <div className="mb-7 h-[5px] w-16 rounded-[5px] bg-grad" />
      {children}
    </section>
  );
}

export function Chips({ items, className = '' }) {
  return (
    <ul className={`m-0 flex list-none flex-wrap gap-2 p-0 ${className}`}>
      {items.map((i) => <li key={i} className="chip">{i}</li>)}
    </ul>
  );
}