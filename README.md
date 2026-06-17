# Zooicha — The AI Website Builder

Marketing site for **Zooicha**, an AI website builder that turns a single
sentence into a complete, responsive, ready-to-publish website.

Built with React + Vite and the [`motion`](https://motion.dev) animation
library. Single-page landing site with a live hero demo, feature grid,
pricing, testimonials and FAQ.

## Develop

```bash
npm install
npm run dev      # start the dev server (Vite)
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

## Project structure

- `index.html` — document shell, fonts and meta tags
- `src/main.jsx` — React entry point
- `src/App.jsx` — the full landing page (sections + hero demo)
- `src/App.css` — component styles
- `src/index.css` — design tokens (colors, type, layout) and resets
- `public/favicon.svg` — gradient "Z" mark

## Deploy

Configured for [Netlify](netlify.toml): build with `npm run build`,
publish `dist/`, with an SPA fallback redirect.
