# Zooicha — The AI Product Page Builder for Shopify

Marketing site for **Zooicha**, an AI product-page builder for ecommerce and
dropshipping. Paste any product URL (AliExpress, Amazon, TikTok Shop, Temu) and
Zooicha generates a high-converting store page — AI copy, polished images,
reviews and offers — in seconds, then publishes to Shopify in one click.

Positioned as a faster, better-priced alternative to PagePilot, adding an AI
image studio, built-in A/B testing and conversion analytics.

Built with React + Vite and the [`motion`](https://motion.dev) animation
library. Single-page landing site with a live "paste-a-link" hero demo, feature
grid, a vs-PagePilot comparison table, pricing, testimonials and FAQ — plus an
interactive **Studio** at `#/studio`.

## The Studio

Visit `#/studio` (or paste a URL on the landing page and hit *Generate*) to try
the interactive builder: paste a product URL, watch the generation steps run,
then get an **editable, publishable product page** — title, headline and price
are live-editable, with desktop/mobile preview.

> Note: generation is simulated client-side (deterministic from the URL) — there
> is no backend scraping or real Shopify publishing yet. It demonstrates the
> intended product flow.

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
