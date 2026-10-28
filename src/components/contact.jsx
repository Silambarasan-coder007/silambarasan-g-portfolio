import { useState } from 'react';
import { LINKS } from '../data';
import { useApp } from '../context';

export default function Contact() {
  const { t } = useApp();
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const body = `Hi Silambarasan,\n\n${f.msg}\n\n${f.name}\n${f.email}`;
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(`Portfolio message from ${f.name}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <footer id="contact" className="foot">
      <div className="wrap pb-10 pt-14">
        <h2 className="text-[clamp(1.9rem,6vw,3rem)]">{t('hLet')}</h2>
        <p className="mt-3 max-w-[50ch] opacity-90">{t('open')}</p>
        <div className="contact mt-5 flex flex-wrap gap-3">
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          <a href={`tel:${LINKS.phone}`}>{LINKS.phoneLabel}</a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={`${import.meta.env.BASE_URL}Silambarasan_G_Resume.pdf`} download="Silambarasan_G_Resume.pdf">{t('bRes')}</a>
        </div>
        <form className="msg mt-[30px] grid max-w-[520px] gap-3" onSubmit={submit}>
          <h3 className="text-[1.3rem]">{t('fmsg')}</h3>
          <input required placeholder="Your name" aria-label="Your name" value={f.name} onChange={set('name')} />
          <input type="email" required placeholder="Your email" aria-label="Your email" value={f.email} onChange={set('email')} />
          <textarea rows="4" required placeholder="Your message" aria-label="Your message" value={f.msg} onChange={set('msg')} />
          <button type="submit">Send message</button>
        </form>
        <p className="mt-8 text-[.9rem] opacity-70">© 2026 Silambarasan G · Puducherry, India</p>
      </div>
    </footer>
  );
}