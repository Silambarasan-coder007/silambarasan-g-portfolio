import { useEffect, useRef, useState } from 'react';
import { Card, Chips, Reveal, Section, calm } from '../ui';
import { useApp } from '../context';
import {
  JOBS, LEARNING, LINKS, METERS, NOTES, PROJECTS, PROJECT_TOOLS, SKILL_GROUPS, STATS,
} from '../data';

function Counter({ to, d = 0 }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (calm()) { setV(to); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const f = (t) => {
        const k = Math.min((t - t0) / 1100, 1);
        setV(to * (1 - (1 - k) ** 3));
        if (k < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <b ref={ref} className="grad-text block font-display text-[1.6rem] font-extrabold">{v.toFixed(d)}</b>;
}

export function About() {
  const { t } = useApp();
  return (
    <Section id="about" k="hAbout">
      <p className="m-0 max-w-[70ch] text-muted">{t('about')}</p>
      <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
        {STATS.map((s) => (
          <Reveal key={s.label} className="panel px-[18px] py-4">
            <Counter to={s.n} d={s.d || 0} />
            <span className="text-[.92rem] text-muted">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" k="hSkills">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
        {SKILL_GROUPS.map(([title, items]) => (
          <Reveal key={title} className="panel p-5">
            <h3 className="mb-3 text-[1.1rem]">{title}</h3>
            <Chips items={items} />
          </Reveal>
        ))}
        <Reveal className="panel col-[1/-1] p-5">
          <h3 className="mb-3 text-[1.1rem]">Proficiency</h3>
          <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
            {METERS.map(([name, v]) => (
              <div key={name}>
                <div className="mb-1.5 flex justify-between font-medium"><span>{name}</span><span>{v}%</span></div>
                <div className="track"><div className="fill" style={{ '--w': `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function Learning() {
  return (
    <Section id="learning" k="hLearn">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4">
        {LEARNING.map(([h, p]) => (
          <Card key={h}><h3 className="mb-1 mt-1.5 text-[1.25rem]">{h}</h3><p className="m-0 mt-1 text-muted">{p}</p></Card>
        ))}
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" k="hExp">
      <div className="tl">
        {JOBS.map((j) => (
          <Reveal key={j.title} className="job">
            <h3 className="text-[1.2rem]">{j.title}</h3>
            <p className="mb-2 mt-0.5 text-[.92rem] font-bold text-a">{j.when}</p>
            <ul className="m-0 list-disc pl-[18px] text-muted">
              {j.points.map((p) => <li key={p} className="mb-[5px]">{p}</li>)}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects" k="hProj">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4">
        {PROJECTS.map((p) => (
          <Card key={p.title}>
            <div className={`thumb ${p.thumb}`} aria-hidden="true">
              {Array.from({ length: 7 }, (_, i) => <span key={i} />)}
            </div>
            <h3 className="mb-1 mt-1.5 text-[1.25rem]">{p.title}</h3>
            <p className="m-0 mb-3 text-[.92rem] font-bold text-a">{p.sub}</p>
            <ul className="m-0 list-disc pl-[18px] text-muted">
              {p.points.map((x) => <li key={x} className="mb-[5px]">{x}</li>)}
            </ul>
            <Chips items={PROJECT_TOOLS} className="mt-3.5" />
            <details className="cs">
              <summary>Case study</summary>
              <dl>
                <div><dt>Goal</dt><dd>{p.goal}</dd></div>
                <div><dt>What I built</dt><dd>{p.built}</dd></div>
                <div><dt>Tools</dt><dd>HTML5, CSS3, JavaScript (ES6+)</dd></div>
              </dl>
            </details>
            <div className="acts mt-3.5 flex flex-wrap gap-2.5">
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer">Code on GitHub</a>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function Notes() {
  return (
    <Section id="notes" k="hNotes">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4">
        {NOTES.map(([h, p]) => (
          <Card key={h}><h3 className="mb-1 mt-1.5 text-[1.25rem]">{h}</h3><p className="m-0 mt-1 text-muted">{p}</p></Card>
        ))}
      </div>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" k="hEdu">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <Card>
          <h3 className="mb-1 mt-1.5 text-[1.25rem]">B.Tech, Information Technology</h3>
          <p className="m-0 mb-3 text-[.92rem] font-bold text-a">Nov 2022 – Apr 2026 · CGPA 7.5</p>
          <p className="my-1 text-muted">Christ College of Engineering and Technology, Moolakulam</p>
          <p className="my-1 text-muted">Coursework: Data Structures, Web Development, Databases, Software Engineering</p>
        </Card>
        <Card>
          <h3 className="mb-1 mt-1.5 text-[1.25rem]">Frontend Development Certificate</h3>
          <p className="m-0 mb-3 text-[.92rem] font-bold text-a">Sep 2025</p>
          <p className="my-1 text-muted">Practical knowledge of HTML5, CSS3, JavaScript (ES6+) and responsive web design.</p>
        </Card>
      </div>
    </Section>
  );
}