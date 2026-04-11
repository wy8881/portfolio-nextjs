# Four Seasons Theme — Design Spec

**Date:** 2026-04-11  
**Status:** Approved

---

## Overview

Replace the single static theme with four switchable season themes — Spring, Summer, Autumn, Winter. Each season has its own full color palette applied sitewide via CSS custom properties on the `<html>` element. A floating toggle button lets users switch between seasons. Selection persists in `localStorage`.

---

## Color Palettes

Each season defines 6 CSS variables:

| Variable | Purpose |
|---|---|
| `--color-background` | Page background |
| `--color-text` | Body text |
| `--color-primary` | Headings / strong text |
| `--color-secondary` | Muted text |
| `--color-accent` | Buttons, links, highlights |
| `--color-artifact` | Cards, borders, subtle surfaces |
| `--color-nav-bg` | Navbar background |

### 🌸 Spring — Cherry Blossom

| Variable | Value |
|---|---|
| `--color-background` | `#fff0f5` |
| `--color-text` | `#5c1a3a` |
| `--color-primary` | `#5c1a3a` |
| `--color-secondary` | `#b07090` |
| `--color-accent` | `#e05c8a` |
| `--color-artifact` | `#fce4ec` |
| `--color-nav-bg` | `#fff0f580` (blur) |

### ☀️ Summer — Sage Green *(current theme)*

| Variable | Value |
|---|---|
| `--color-background` | `#E4E5D9` |
| `--color-text` | `#292524` |
| `--color-primary` | `#1C1917` |
| `--color-secondary` | `#78716C` |
| `--color-accent` | `#166534` |
| `--color-artifact` | `#C3C3B9` |
| `--color-nav-bg` | `#166534` (solid, white nav text) |

### 🍂 Autumn — Warm Cream

| Variable | Value |
|---|---|
| `--color-background` | `#fffbeb` |
| `--color-text` | `#1e3a5f` |
| `--color-primary` | `#1e3a5f` |
| `--color-secondary` | `#d4a017` |
| `--color-accent` | `#f97316` |
| `--color-artifact` | `#fef3c7` |
| `--color-nav-bg` | `#f5e8c8` (solid amber) |

### ❄️ Winter — Midnight Snow

| Variable | Value |
|---|---|
| `--color-background` | `#0a0f1e` |
| `--color-text` | `#e8eef8` |
| `--color-primary` | `#e8eef8` |
| `--color-secondary` | `#4a6fa5` |
| `--color-accent` | `#7eb8f7` |
| `--color-artifact` | `#1a2540` |
| `--color-nav-bg` | `#0a0f1e80` (blur) |

---

## Season Toggle Component

### Behaviour

- **Default state:** 56px circle fixed at `bottom-right`, showing the current season emoji
- **On click:** expands horizontally to the left into a rounded pill showing all four seasons
- **Active season** is highlighted inside the pill
- **Clicking outside** collapses the pill back to the circle
- **On season select:** applies new theme instantly, saves to `localStorage`
- **On load:** reads `localStorage`, defaults to Summer if no value stored

### Visual

```
Collapsed:   [🍂]

Expanded:  [🌸 Spring] [☀️ Summer] [🍂 Autumn ✓] [❄️ Winter]
```

- Border colour on the circle matches the active season's `--color-accent`
- Pill background is white with `border-radius: 40px`
- Expand/collapse animated with CSS transition

### Placement

Fixed, `bottom: 24px`, `right: 24px`, `z-index: 100`

---

## Implementation Approach

### Theme application

Add `data-season="summer"` to `<html>`. Define all four palettes in `globals.css` as `[data-season="spring"] { ... }` blocks. No JS theme library needed — pure CSS variable swaps.

### Summer navbar special case

Summer's navbar is `#166534` (solid green). Nav text colour must switch to white (`#f0fdf4`) for Summer only. All other seasons use their `--color-text` for nav links.

### Navbar blur

Spring and Winter navbars use `backdrop-filter: blur`. The existing `bg-nav-bg/50 backdrop-blur-xl` class on the navbar already handles this — it just needs the `--color-nav-bg` variable to carry the right colour.

### SeasonToggle component

New client component: `components/ui/SeasonToggle.tsx`  
- Reads/writes `localStorage` key `season`  
- Sets `document.documentElement.dataset.season`  
- Renders the circle + pill UI  
- Mounted once in `app/layout.tsx`

---

## Files to change

| File | Change |
|---|---|
| `app/globals.css` | Add 4 `[data-season]` palette blocks |
| `app/layout.tsx` | Mount `<SeasonToggle />`, set initial `data-season` |
| `components/ui/SeasonToggle.tsx` | New toggle component |
| `components/layout/navbar/Navbar.tsx` | Use CSS variable for nav text colour |
