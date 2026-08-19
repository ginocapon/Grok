# Grok — Living Cinematic Videomaker Website

Production-ready bilingual personal website for Grok, filmmaker, director and editor.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** — cinematic dark design system
- **next-intl** — EN/IT bilingual routing
- **Framer Motion + GSAP** — motion (ready to extend)
- **JSON CMS** — `/data/` (Supabase-ready for production)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en)

## Routes

| Public | EN | IT |
|--------|----|----|
| Home | `/en` | `/it` |
| Projects | `/en/projects` | `/it/progetti` |
| Blog | `/en/blog` | `/it/blog` |
| About | `/en/about` | `/it/about` |
| Contact | `/en/contact` | `/it/contact` |
| Admin | `/admin` | (noindex) |

## CMS

Content lives in `/data/`:

- `site-settings.json` — hero, footer, contact copy
- `projects.json` — project archive
- `blog-articles.json` — blog posts
- `contacts.json` — form submissions
- `analytics.json` — privacy-conscious event tracking

**Rule:** Never invent projects, clients, or statistics. Add real content via CMS.

## GROK Engine

Evolution system in `/grok/`:

- `grok-config.json` — scan schedule (every 15 days)
- `grok-history.json` — scan reports
- `grok-approved.json` / `grok-rejected.json` — decision memory

Trigger scan: `POST /api/grok/scan`

## Hero Video

Upload showreel and set `hero.videoUrl` in `site-settings.json`. Poster uses `/images/grok-portrait.png`.

## Deploy — GitHub Pages (come linda-allenamenti)

Stesso sistema: workflow **Deploy GitHub Pages** su push a `main`.

### Setup (una tantum)

1. Push del codice su `github.com/ginocapon/Grok`
2. GitHub repo → **Settings → Pages**
3. Source: **GitHub Actions**
4. Push su `main` → tab **Actions** → vedi **Deploy GitHub Pages**

**URL live:** `https://ginocapon.github.io/Grok/`

### Locale vs produzione

| Funzione | Locale (`npm run dev`) | GitHub Pages |
|----------|------------------------|--------------|
| Sito pubblico | ✅ | ✅ |
| Admin CMS (`/admin`) | ✅ | ❌ (solo in locale) |
| Form contatti | API locale | FormSubmit (email) |
| Modifica contenuti | Admin o `/data/` | Modifica `/data/` + push su git |

Test build Pages in locale:

```bash
npm run build:pages
```

### Sviluppo locale

```bash
npm install
cp .env.example .env.local
npm run dev
```

## License

Private — Grok personal brand.
