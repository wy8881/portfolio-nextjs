# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Installation

This project uses **npm**.

- Do not install the latest version blindly — check compatibility with the existing dependency tree first.
- Do not install any package version released less than 7 days ago. Check with `npm view <package>@<version> time --json` before installing. If newer than 7 days, use the most recent version that is at least 7 days old.
- Prefer versions that resolve cleanly without peer dependency conflicts.
- Only use `--legacy-peer-deps` or `--force` if no compatible version exists and the user is informed.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** with TypeScript, Tailwind CSS v4, and Framer Motion.

### Routing / Pages

- `app/page.tsx` — Home (hero + featured projects)
- `app/about/page.tsx` — About (timeline, skills, photos)
- `app/projects/page.tsx` — Projects & certifications
- `app/blog/page.tsx` — Blog index; `app/blog/[slug]/page.tsx` — MDX post renderer via `next-mdx-remote`

Blog posts live as `.mdx` files in `content/blog/`. Server-side parsing is done in `lib/blog.ts` using `gray-matter`.

### Data Layer

Static data (no database) lives in `data/`:
- `data/projects/projects.ts`, `certifications.ts`
- `data/about/personal-info.ts`, `skills.ts`, `timeline.ts`
- `data/contact/contact-info.ts`

Types for each domain are in `types/`.

### Theming — Seasonal System

The site uses **seasons as themes** (`spring` | `summer` | `autumn` | `winter`) instead of light/dark mode. `next-themes` is configured with `attribute="data-season"` and `defaultTheme="summer"`.

CSS custom properties for each season are defined in `app/globals.css` using `[data-season="…"]` selectors. Use semantic token names (`text`, `background`, `primary`, `secondary`, `accent`, `artifact`, `nav-bg`, `nav-text`) rather than hardcoded colors.

`SeasonToggle` (fixed UI button) lets users switch seasons. `SeasonalCanvas` renders a full-viewport canvas animation of season-appropriate particles (cherry blossoms, fireflies, falling leaves, snowflakes) — it respects `prefers-reduced-motion` and halves particle count on mobile.

### Key Shared Components

- `components/ui/PhotoSlideshow.tsx` — Reusable polaroid-style image slideshow with fade transitions; accepts `SlideshowImage[]`.
- `components/ui/Typography.tsx` — Shared text style primitives.
- `components/ui/SeasonalCanvas.tsx` + `particles.ts` — Canvas particle engine.
- `lib/animations.ts` — Shared Framer Motion duration/easing constants.
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge).

### Path Aliases

`@/` maps to the project root (configured in `tsconfig.json`).
