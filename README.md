# Silambarasan G – Portfolio (React + Tailwind CSS)

Same portfolio as the HTML version, rebuilt with React 18, Vite 5 and Tailwind CSS 3.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Build
```bash
npm run build      # output in dist/
npm run preview
```

## Deploy (free)
- **Vercel**: import the GitHub repo, framework preset "Vite", deploy.
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: run `npm run build`, then upload the contents of `dist/` to a repo named `<username>.github.io`.

## Where to edit
- `src/data.js`: all text (English + Tamil), skills, projects, links.
- `src/index.css`: theme colours (CSS variables) and effects.
- `tailwind.config.js`: Tailwind theme (colours, fonts, gradient).
- `public/Silambarasan_G_Resume.pdf`: replace to update the resume download.
- `src/assets/photo.jpg`: replace to change your photo.

## Notes
- Project "Code on GitHub" buttons point to your GitHub profile. Add each repo link in `PROJECTS` inside `src/data.js` when ready.
- The contact form opens the visitor's mail app (no server needed).
- GitHub stats and the weather tool need an internet connection and work on the hosted site.
