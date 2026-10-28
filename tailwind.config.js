/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        a: 'var(--a)',
        b: 'var(--b)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        grad: 'linear-gradient(120deg,#1783A6,#F2B705)',
      },
      boxShadow: {
        glow: '0 18px 40px var(--glow)',
      },
    },
  },
  plugins: [],
};
