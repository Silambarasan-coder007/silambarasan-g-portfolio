import { createContext, useContext, useEffect, useState } from 'react';
import { EN } from './data';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const read = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } };

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => read('theme'));

  useEffect(() => {
    const r = document.documentElement;
    if (theme) r.setAttribute('data-theme', theme);
    else r.removeAttribute('data-theme');
  }, [theme]);

  const isDark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    write('theme', next);
  };
  const t = (k) => EN[k];

  return <Ctx.Provider value={{ isDark, toggleTheme, t }}>{children}</Ctx.Provider>;
}