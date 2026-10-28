import { useEffect, useRef, useState } from 'react';
import { Card, Section } from '../ui';

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const id = useRef(0);
  const add = () => {
    const v = text.trim();
    if (!v) return;
    id.current += 1;
    setTasks((t) => [...t, { id: id.current, text: v, done: false }]);
    setText('');
  };
  const done = tasks.filter((t) => t.done).length;
  return (
    <Card>
      <h3 className="mb-3">To-do list</h3>
      <div className="flex gap-2">
        <input className="min-w-0 flex-1" type="text" placeholder="Add a task" aria-label="New task" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button className="mini" type="button" onClick={add}>Add</button>
      </div>
      <ul id="todo">
        {tasks.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}
            onClick={() => setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}>
            <span>{t.text}</span>
            <button type="button" aria-label="Delete task"
              onClick={(e) => { e.stopPropagation(); setTasks((all) => all.filter((x) => x.id !== t.id)); }}>✕</button>
          </li>
        ))}
      </ul>
      <p className="m-0 text-[.92rem] text-muted">{tasks.length ? `${tasks.length - done} left · ${done} done` : 'No tasks yet'}</p>
    </Card>
  );
}

const fmt = (r) => (Number.isFinite(r) ? String(+r.toFixed(8)) : 'Error');
const calc = (a, b, o) => {
  if (o === '+') return a + b;
  if (o === '-') return a - b;
  if (o === '×') return a * b;
  if (o === '÷') return b === 0 ? NaN : a / b;
  return b;
};
const KEYS = [
  ['C', 'op'], ['⌫', 'op'], ['÷', 'op'], ['×', 'op'],
  ['7'], ['8'], ['9'], ['-', 'op', '−'],
  ['4'], ['5'], ['6'], ['+', 'op'],
  ['1'], ['2'], ['3'], ['=', 'eq'],
  ['0'], ['.'],
];

function Calculator() {
  const [s, setS] = useState({ cur: '0', acc: null, op: null, fresh: false });
  const press = (k) => setS((p) => {
    let { cur, acc, op, fresh } = p;
    if (cur === 'Error' && k !== 'C') return p;
    if (k === 'C') return { cur: '0', acc: null, op: null, fresh: false };
    if (k === '⌫') return { ...p, cur: cur.length > 1 ? cur.slice(0, -1) : '0' };
    if ('+-×÷'.includes(k)) {
      if (op && !fresh) cur = fmt(calc(acc, parseFloat(cur), op));
      return { cur, acc: parseFloat(cur), op: k, fresh: true };
    }
    if (k === '=') {
      if (!op) return p;
      return { cur: fmt(calc(acc, parseFloat(cur), op)), acc, op: null, fresh: true };
    }
    if (fresh) { cur = '0'; fresh = false; }
    if (k === '.' && cur.includes('.')) return { ...p, cur, fresh };
    cur = cur === '0' && k !== '.' ? k : cur + k;
    return { cur, acc, op, fresh };
  });
  return (
    <Card>
      <h3 className="mb-3">Calculator</h3>
      <div id="disp" aria-live="polite">{s.cur}</div>
      <div className="keys">
        {KEYS.map(([k, cls, label]) => (
          <button key={k} type="button" className={cls || ''} onClick={() => press(k)}
            style={k === '=' ? { gridRow: 'span 2' } : k === '0' ? { gridColumn: 'span 2' } : undefined}>
            {label || k}
          </button>
        ))}
      </div>
    </Card>
  );
}

const wcode = (c) => {
  if (c === 0) return ['☀️', 'Clear sky'];
  if (c <= 2) return ['⛅', 'Partly cloudy'];
  if (c === 3) return ['☁️', 'Cloudy'];
  if (c <= 48) return ['🌫️', 'Fog'];
  if (c <= 57) return ['🌦️', 'Drizzle'];
  if (c <= 67) return ['🌧️', 'Rain'];
  if (c <= 77) return ['❄️', 'Snow'];
  if (c <= 82) return ['🌧️', 'Showers'];
  return ['⛈️', 'Thunderstorm'];
};

function Weather() {
  const [city, setCity] = useState('Puducherry');
  const [state, setState] = useState({ msg: 'Search a city to see the live weather.' });
  const search = async (name) => {
    const q = (name ?? city).trim();
    if (!q) return;
    setState({ msg: 'Loading…' });
    try {
      const g = await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(q)}`);
      if (!g.ok) throw new Error('geo');
      const gj = await g.json();
      if (!gj.results || !gj.results.length) { setState({ msg: 'City not found. Check the spelling and try again.' }); return; }
      const c = gj.results[0];
      const w = await fetch(`https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&latitude=${c.latitude}&longitude=${c.longitude}`);
      if (!w.ok) throw new Error('wx');
      const k = (await w.json()).current;
      setState({ data: { place: c.name + (c.country ? `, ${c.country}` : ''), k, w: wcode(k.weather_code) } });
    } catch (e) {
      setState({ msg: 'Weather could not load. Check your internet connection and try again.' });
    }
  };
  useEffect(() => { search('Puducherry'); /* eslint-disable-next-line */ }, []);
  const { data, msg } = state;
  return (
    <Card>
      <h3 className="mb-3">Weather</h3>
      <div className="flex gap-2">
        <input className="min-w-0 flex-1" type="text" placeholder="City name" aria-label="City" value={city}
          onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} />
        <button className="mini" type="button" onClick={() => search()}>Search</button>
      </div>
      <div className="wx mt-3" aria-live="polite">
        {data ? (
          <>
            <div className="t">{data.w[0]} {Math.round(data.k.temperature_2m)}°C</div>
            <p>{data.place} · {data.w[1]}</p>
            <p>Humidity {data.k.relative_humidity_2m}% · Wind {Math.round(data.k.wind_speed_10m)} km/h</p>
          </>
        ) : <p>{msg}</p>}
      </div>
    </Card>
  );
}

export default function Playground() {
  return (
    <Section id="playground" k="hPlay">
      <p className="m-0 mb-[18px] max-w-[62ch] text-muted">Three small tools built with React. Try them right here.</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-4">
        <Todo />
        <Calculator />
        <Weather />
      </div>
    </Section>
  );
}