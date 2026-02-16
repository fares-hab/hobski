# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hobski is a mentor-learner connection platform built as a React SPA. Stack: React 19, Vite 7, Tailwind CSS 3, Framer Motion, GSAP, Supabase (database/auth), Resend (email). Deployed on Vercel.

## Commands

- `npm run dev` — Start dev server (port 5173)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build (port 4173)
- `ANALYZE=true npm run build` — Build with bundle analysis

## Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_RESEND_API_KEY`

## Architecture

**Routing:** `App.jsx` is the root — defines routes via React Router DOM. All route components are lazy-loaded with `React.lazy()` + `Suspense`. Vercel rewrites all paths to `index.html` for SPA support.

**Theme system:** Light/dark mode managed at App level, toggled via `.dark` class on `<html>`. Colors defined as CSS variables in `src/index.css` (`:root` and `:root.dark`). Tailwind config extends these as semantic color classes (`theme.bg-*`, `theme.text-*`). Theme persists in localStorage under key `hobski-theme`.

**Components (`src/components/`):** LandingPage (hero + sections), Navigation (shared header, memoized), About, LearnerSignup/MentorSignup (multi-page forms with validation), ImageWithSkeleton (reusable loader).

**Utilities (`src/lib/`):** `supabase.js` (client init), `email.js` (Resend API integration).

**Performance patterns:** Vendor code splitting (react, animation, UI chunks in `vite.config.js`), image skeleton loaders with shimmer animation, memoized components, passive event listeners, WebP images.

## Conventions

- Functional components with hooks; props-based (no React Context)
- Tailwind utility classes for styling; custom semantic theme classes for dark mode
- ES modules throughout (`type: "module"`)
- ESLint flat config (v9) — unused vars starting with uppercase are allowed (component convention)
- Mobile-first responsive design with `sm:`, `md:`, `lg:` breakpoints
