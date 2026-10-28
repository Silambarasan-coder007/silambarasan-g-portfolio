import { useEffect, useRef, useState } from 'react';

export default function CommandPalette({ open, setOpen, cmds }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef(null);
  const shown = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) { setQ(''); setSel(0); setTimeout(() => input.current && input.current.focus(), 0); }
  }, [open]);

  const run = (i) => {
    const c = shown[i];
    setOpen(false);
    if (c) setTimeout(c.run, 50);
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); return; }
      if (!open) return;
      const n = Math.max(shown.length, 1);
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => (s + 1) % n); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (s - 1 + n) % n); }
      else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div id="pal" hidden={!open} role="dialog" aria-modal="true" aria-label="Command palette"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="pbox">
        <input ref={input} type="text" placeholder="Type a command or search" autoComplete="off" aria-label="Command"
          value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} />
        <ul id="plist">
          {shown.map((c, i) => (
            <li key={c.label} className={i === sel ? 'on' : ''} onClick={() => run(i)}>{c.label}</li>
          ))}
        </ul>
        <p className="mx-1 mb-0 mt-2 text-[.85rem] text-muted">Up and down to move · Enter to run · Esc to close</p>
      </div>
    </div>
  );
}