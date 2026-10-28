import { useEffect, useRef, useState } from 'react';
import { NAV } from '../data';
import { useApp } from '../context';
import { celebrate, calm } from '../ui';

function useActiveSection(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const IDS = NAV.map(([id]) => id);

export default function Navbar({ onPalette }) {
  const { t, isDark, toggleTheme } = useApp();
  const active = useActiveSection(IDS);
  const taps = useRef(0);
  const timer = useRef();

  const brandClick = () => {
    taps.current += 1;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 900);
    if (taps.current >= 5) { taps.current = 0; if (!calm()) celebrate(); }
  };

  return (
    <nav className="sticky z-10 border-b border-line backdrop-blur-[10px]"
      style={{ top: 'env(safe-area-inset-top,0px)', background: 'color-mix(in srgb,var(--bg) 82%,transparent)' }}>
      <div className="wrap flex h-[60px] items-center justify-between">
        <a href="#top" onClick={brandClick} className="grad-text font-display text-[1.2rem] font-extrabold no-underline">Silambarasan G</a>
        <div className="flex items-center gap-4">
          {NAV.map(([id, k]) => (
            <a key={id} href={`#${id}`} className={`nav-link max-sm:hidden ${active === id ? 'act' : ''}`}>{t(k)}</a>
          ))}
          <button className="pill" type="button" onClick={onPalette} aria-label="Open command palette">Ctrl K</button>
          <button id="theme" type="button" onClick={toggleTheme} aria-label="Switch theme">{isDark ? '☀️' : '🌙'}</button>
        </div>
      </div>
    </nav>
  );
}