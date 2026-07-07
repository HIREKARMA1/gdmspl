# GDMSPL — Next.js

Architecture portfolio site migrated from **React + Vite** to **Next.js 15 (App Router)** with **Tailwind CSS** and **GSAP**.

## Tech stack

- **Next.js 15** — App Router, static generation for project pages
- **Tailwind CSS** — layout, hero, header, footer, bento grid
- **GSAP** — text reveals and scroll animations (`src/lib/gsap.js`)
- **Lucide React** — icons

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
```

## Project structure

```
src/
├── app/                    # Next.js routes
│   ├── page.jsx            # Home (all sections)
│   ├── categories/
│   ├── projects/
│   ├── careers/
│   ├── contact/
│   ├── team/
│   └── project/[projectId]/
├── components/
│   ├── layout/             # Header, Footer
│   └── ui/                 # ProjectCard, buttons, TextAnimate
├── sections/               # Home page sections
├── sections/pages/         # Standalone route views
├── data/                   # projects.js, team.js
├── hooks/                  # useSectionScroll
├── assets/                 # Images (keep full asset library here)
├── styles/
│   ├── design-tokens.css
│   └── legacy/             # Section CSS (being migrated to Tailwind)
└── legacy-pages/           # Old Vite pages (reference only)
```

## Routes

| Route | Page |
|-------|------|
| `/` | Landing + Projects + About + Services + Team + Careers + Contact |
| `/categories?category=...` | Portfolio by category |
| `/projects` | All projects |
| `/project/[id]` | Project detail (24 static pages) |
| `/careers` | Careers |
| `/contact` | Contact |
| `/team` | Full team |

## Migration notes

- Old Vite entry (`main.jsx`, `App.jsx`) removed — use `src/app/` instead.
- `src/pages` renamed to `src/legacy-pages` to avoid conflicting with Next.js Pages Router.
- Legacy section CSS is imported in `globals.css` while Tailwind migration continues.
- Category navigation from Services uses query params: `/categories?category=Architecture`.

## Assets

Ensure `src/assets/` contains the full image library (project folders, team photos, logos). The build imports images from `src/data/projects.js`.
