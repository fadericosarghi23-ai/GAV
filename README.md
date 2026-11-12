# GAV SRLS, sito web

Vite + React + TypeScript, Tailwind v4, struttura shadcn (`components.json`, `src/components/ui`, alias `@/`), framer-motion, GSAP + Lenis.

## Comandi
- `npm ci` installa le dipendenze
- `npm run dev` sviluppo
- `npm run build` controllo tipi e build in `dist/`
- `npm run import:content` reimporta testi e foto da gavsrls.it (`--skip-existing` per non riconvertire le foto)

## Dove sono le cose
- `src/content/content.json`: tutti i contenuti importati dal vecchio sito (non modificare a mano: rigenerare con lo script)
- `src/lib/site.ts`: servizi, navigazione, didascalie della galleria (scritte da Altalogik, da confermare)
- `public/brand/logo-gav.svg`: logo vettorializzato dal PNG originale (`scripts/vectorize-logo.mjs`)
- `netlify.toml`: build, Node 22, redirect 301 dai vecchi URL WordPress, fallback SPA
- Modulo contatti: Netlify Forms (`preventivo`), con campo anti-spam nascosto
