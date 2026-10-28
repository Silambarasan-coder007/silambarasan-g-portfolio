import { useEffect, useState } from 'react';
import { useApp } from './context';
import { LINKS } from './data';
import { celebrate } from './ui';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import {
  About, Skills, Learning, Experience, Projects, Notes, Education,
} from './components/Sections';
import Playground from './components/Playground';
import GitHubStats from './components/GitHubStats';
import Contact from './components/Contact';
import CommandPalette from './components/CommandPalette';
import {
  BackToTop, Confetti, CursorGlow, Intro, ProgressBar,
} from './components/Overlays';

const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';

export default function App() {
  const { toggleTheme } = useApp();
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    let keys = [];
    const onKey = (e) => {
      keys = [...keys, e.key].slice(-10);
      if (keys.join() === KONAMI) celebrate();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id) => () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const cmds = [
    { label: 'Go to About', run: go('about') },
    { label: 'Go to Skills', run: go('skills') },
    { label: 'Go to Experience', run: go('experience') },
    { label: 'Go to Projects', run: go('projects') },
    { label: 'Go to Playground', run: go('playground') },
    { label: 'Go to Contact', run: go('contact') },
    { label: 'Toggle dark / light theme', run: toggleTheme },
    {
      label: 'Download resume',
      run: () => {
        const a = document.createElement('a');
        a.href = `${import.meta.env.BASE_URL}Silambarasan_G_Resume.pdf`;
        a.download = 'Silambarasan_G_Resume.pdf';
        a.click();
      },
    },
    { label: 'Open GitHub', run: () => window.open(LINKS.github, '_blank', 'noopener') },
    { label: 'Open LinkedIn', run: () => window.open(LINKS.linkedin, '_blank', 'noopener') },
    { label: 'Send email', run: () => { window.location.href = `mailto:${LINKS.email}`; } },
    { label: 'Celebrate 🎉', run: celebrate },
  ];

  return (
    <>
      <Intro />
      <Confetti />
      <CommandPalette open={palette} setOpen={setPalette} cmds={cmds} />
      <ProgressBar />
      <CursorGlow />
      <BackToTop />
      <Navbar onPalette={() => setPalette(true)} />
      <Hero />
      <main className="wrap">
        <About />
        <Skills />
        <Learning />
        <Experience />
        <Projects />
        <Playground />
        <Notes />
        <GitHubStats />
        <Education />
      </main>
      <Contact />
    </>
  );
}