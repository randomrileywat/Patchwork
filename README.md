# Patchwork

Personal AVIXA CTS-D exam prep tool — dark-mode, gamified, single-user. Built with React + Vite + Tailwind + Zustand. All data lives in `localStorage`; there is no backend.

## Features

- 4 question types (multiple choice, multi-select, flashcards, scenarios, drag-match)
- Per-topic mastery tracking with rolling-20 accuracy
- XP, daily streaks, session bonuses, level-up bonuses
- **Weak Area Arena** — 1.5× XP gamified mode targeting your 3 weakest topics
- Review queue for flagged or missed questions
- Dashboard with session history + mastery-trend charts (Recharts)
- 150+ seed CTS-D questions across all four AVIXA domains

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173/Patchwork/).

## Production build

```bash
npm run build
npm run preview   # to verify locally
```

## Deployment (GitHub Pages)

The included `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. To enable:

1. In the repo on GitHub: **Settings → Pages → Source: GitHub Actions**.
2. Push to `main`. The workflow builds and deploys to `https://<username>.github.io/Patchwork/`.

The site uses `HashRouter` for clean GitHub Pages routing (no 404s on deep links).

## Tech stack

- React 18 + Vite 5
- Tailwind CSS v3 (dark mode permanently on)
- Zustand (with `persist` to localStorage)
- Recharts
- React Router v6 (HashRouter)
- Lucide icons
- Google Fonts: JetBrains Mono + IBM Plex Sans

## License

MIT — see [LICENSE](LICENSE).