import { useEffect, useState } from 'react';
import { Card, Section } from '../ui';
import { LINKS } from '../data';

export default function GitHubStats() {
  const [d, setD] = useState(null);
  useEffect(() => {
    let off = false;
    const u = LINKS.githubUser;
    const J = (r) => (r.ok ? r.json() : Promise.reject(new Error('gh')));
    Promise.all([
      fetch(`https://api.github.com/users/${u}`).then(J),
      fetch(`https://api.github.com/users/${u}/repos?per_page=100&sort=updated`).then(J),
    ]).then(([prof, all]) => {
      if (off) return;
      const repos = all.filter((r) => !r.fork);
      const langs = {};
      repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
      const ks = Object.keys(langs).sort((x, y) => langs[y] - langs[x]).slice(0, 5);
      const tot = ks.reduce((s, k) => s + langs[k], 0);
      setD({ prof, repos: repos.slice(0, 4), langs: ks.map((k) => [k, Math.round((langs[k] / tot) * 100)]) });
    }).catch(() => {});
    return () => { off = true; };
  }, []);
  if (!d) return null;
  return (
    <Section id="github" k="hGit">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        <Card>
          <h3 className="mb-2.5">Profile</h3>
          <div className="grad-text font-display text-[2rem] font-extrabold">{d.prof.public_repos} repositories</div>
          <p className="m-0 mt-1 text-muted">{d.prof.followers} followers · {d.prof.following} following</p>
        </Card>
        <Card>
          <h3 className="mb-2.5">Top languages</h3>
          {d.langs.map(([k, v]) => (
            <div key={k} className="mb-2.5">
              <div className="mb-1.5 flex justify-between font-medium"><span>{k}</span><span>{v}%</span></div>
              <div className="track"><div className="fill" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="mb-2.5">Latest repositories</h3>
          {d.repos.map((r) => (
            <a key={r.id} className="my-1.5 block font-bold text-a no-underline hover:underline" href={r.html_url} target="_blank" rel="noopener noreferrer">{r.name}</a>
          ))}
        </Card>
      </div>
    </Section>
  );
}