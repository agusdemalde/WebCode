# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npx astro check  # Type-check .astro files
```

Requires Node >= 22.12.0.

## Architecture

This is an **Astro 6** project with **Tailwind CSS v4** integrated via the `@tailwindcss/vite` plugin (not the legacy Astro integration). Tailwind is loaded globally through `src/styles/global.css` (`@import "tailwindcss"`), which must be imported in any layout or page that needs it.

- `src/pages/` — file-based routing; each `.astro` or `.md` file becomes a route
- `src/styles/global.css` — single Tailwind entry point
- `public/` — static assets served as-is
- TypeScript is configured in strict mode (`astro/tsconfigs/strict`)

Tailwind v4 uses CSS-first configuration (no `tailwind.config.js`); customizations go in `src/styles/global.css` using `@theme`.
