# Seasonal Canvas Effects — Design Spec

**Date:** 2026-04-12
**Branch:** `feat/seasonal-canvas-effects`
**Status:** Approved

---

## Overview

A `SeasonalCanvas` component renders a fixed full-screen `<canvas>` (pointer-events: none) that continuously animates seasonal ambient particles. It sits behind all page content and responds to the active season set by `SeasonToggle`.

Four seasonal effects:

| Season  | Effect              | Motion                                      |
|---------|---------------------|---------------------------------------------|
| 🌸 Spring | Sakura blossoms   | Fall downward, wobble & rotate              |
| ☀️ Summer | Emerald fireflies | Float upward, blink glow pulse              |
| 🍂 Autumn | Falling leaves    | Fall with wide side-swing, warm colours     |
| ❄️ Winter | Snowflakes        | Fall slowly, gentle drift, 6-arm drawn      |

~40 particles per season. Respects `prefers-reduced-motion` — canvas is not mounted if set.

---

## Architecture & Components

### New files

**`components/ui/SeasonContext.tsx`**
React context + provider. Holds `season: Season` state, reads initial value from `localStorage` on mount, exposes `setSeason(s: Season)`. Sets `document.documentElement.setAttribute('data-season', s)` on change so CSS variables continue working.

**`components/ui/SeasonalCanvas.tsx`**
Fixed full-screen `<canvas>` component. Reads `season` from context. Runs the matching particle system via a `requestAnimationFrame` loop. Pauses when tab is hidden. Handles resize via `ResizeObserver`. Does not mount at all when `prefers-reduced-motion` is set.

Uses raw Canvas 2D API — no Three.js or R3F. All effects are flat 2D; a full R3F canvas would add unnecessary overhead.

### Modified files

**`components/ui/SeasonToggle.tsx`**
Replace direct `localStorage` + `setAttribute` calls with `setSeason` from `SeasonContext`.

**`app/layout.tsx`**
Wrap children with `<SeasonProvider>`. Add `<SeasonalCanvas />` inside the provider. Remove the existing `ThemeProvider` from `next-themes` — `SeasonContext` takes over its role of setting `data-season` and persisting to `localStorage`.

### Data flow

```
SeasonProvider (context)
  ├── SeasonToggle    — reads + writes season
  └── SeasonalCanvas  — reads season, runs particle system
```

---

## Particle Systems

### Shared particle shape

```ts
type Particle = {
  x: number; y: number
  vx: number; vy: number
  rot: number; rotSpeed: number
  size: number
  opacity: number
  wobble: number; wobbleSpeed: number
  alpha: number  // cross-fade multiplier, 0→1 on spawn, 1→0 on season exit
}
```

### Spring — Sakura blossoms
- Shape: 5-petal bezier flower with notched tips + yellow stamen dot
- Colours: `#fda4af`, `#f9a8d4`, `#fbcfe8`, `#fce7f3`, `#f472b6`
- Motion: falls downward, slow rotation, gentle horizontal wobble
- Count: ~36

### Summer — Emerald fireflies
- Shape: radial gradient glow halo + bright core dot
- Colours: `hsl(145, 85–90%, 22–30%)` — matches `--color-accent: #166534`
- Motion: floats upward, `phase` drives blink via `Math.sin`, lazy side drift
- Count: ~36

### Autumn — Falling leaves
- Shape: teardrop bezier body + midrib stroke
- Colours: `#f97316`, `#fb923c`, `#dc2626`, `#b45309`, `#d97706`, `#ea580c`
- Motion: falls downward with wide swing amplitude, faster rotation than spring
- Count: ~40

### Winter — Snowflakes
- Shape: 6 arms drawn with line strokes + branch ticks at 35% and 60% along each arm
- Colours: `#bfdbfe`, `#93c5fd`, `#dbeafe`
- Motion: slowest fall speed, minimal drift, gentle rotation
- Count: ~42

---

## Season Transition

On season change, all current particles have their `alpha` multiplier eased to 0 over 600ms. New season particles spawn with `alpha` easing from 0 to 1 over 600ms. The cross-fade is driven by the existing RAF loop — no extra timers.

---

## Accessibility & Performance

**Reduced motion:** check `window.matchMedia('(prefers-reduced-motion: reduce)')` on mount. If true, do not mount the `<canvas>` element.

**Tab visibility:** listen to `document.visibilitychange` — cancel RAF when hidden, resume when visible.

**Resize:** `ResizeObserver` on the canvas parent — update `canvas.width/height` and re-initialise particle positions.

**Drawing:** all draw calls wrapped in `ctx.save() / ctx.restore()` — no state leaks between particles.

---

## Z-index & Layering

| Element        | Position | z-index |
|----------------|----------|---------|
| SeasonalCanvas | fixed    | 0       |
| Page content   | static   | 1+      |
| Navbar         | fixed    | 50      |
| SeasonToggle   | fixed    | 100     |

---

## Files Summary

| File | Change |
|------|--------|
| `components/ui/SeasonContext.tsx` | **New** — season context + provider |
| `components/ui/SeasonalCanvas.tsx` | **New** — canvas + all 4 particle systems |
| `components/ui/SeasonToggle.tsx` | **Modify** — use context `setSeason` |
| `app/layout.tsx` | **Modify** — add `SeasonProvider` + `SeasonalCanvas` |
