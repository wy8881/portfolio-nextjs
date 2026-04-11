# Four Seasons Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four switchable season themes (Spring, Summer, Autumn, Winter) to the portfolio site, applied via CSS custom properties and a floating toggle button that persists selection in `localStorage`.

**Architecture:** Season palettes are defined as `[data-season="..."]` attribute blocks in `globals.css`. The `<html>` element carries a `data-season` attribute that is set on load from `localStorage` and updated by the `SeasonToggle` component. The toggle is a floating client component mounted once in `layout.tsx`.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, CSS custom properties, `localStorage`, React `useState`/`useEffect`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Add 4 `[data-season]` CSS variable blocks |
| `app/layout.tsx` | Modify | Add `data-season` init script + mount `<SeasonToggle />` |
| `components/ui/SeasonToggle.tsx` | Create | Floating toggle circle + horizontal pill expansion |
| `components/layout/navbar/Navbar.tsx` | Modify | Use CSS variable for nav link text colour |

---

## Task 1: Add season palette CSS variables

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add all four season palette blocks to globals.css**

Replace the existing `@theme inline` block and add `[data-season]` attribute selectors. Open `app/globals.css` and replace the entire file content with:

```css
@import "tailwindcss";
@import "bootstrap-icons/font/bootstrap-icons.css";

@theme inline {
  --color-text: #292524;
  --color-background: #E4E5D9;
  --color-primary: #1C1917;
  --color-secondary: #78716C;
  --color-accent: #166534;
  --color-artifact: #C3C3B9;
  --color-nav-bg: #166534;
  --color-nav-text: #f0fdf4;

  --font-inter: var(--font-inter), sans-serif;
}

/* ── Summer (default) ── */
[data-season="summer"] {
  --color-background: #E4E5D9;
  --color-text: #292524;
  --color-primary: #1C1917;
  --color-secondary: #78716C;
  --color-accent: #166534;
  --color-artifact: #C3C3B9;
  --color-nav-bg: #166534;
  --color-nav-text: #f0fdf4;
}

/* ── Spring ── */
[data-season="spring"] {
  --color-background: #fff0f5;
  --color-text: #5c1a3a;
  --color-primary: #5c1a3a;
  --color-secondary: #b07090;
  --color-accent: #e05c8a;
  --color-artifact: #fce4ec;
  --color-nav-bg: #fff0f580;
  --color-nav-text: #5c1a3a;
}

/* ── Autumn ── */
[data-season="autumn"] {
  --color-background: #fffbeb;
  --color-text: #1e3a5f;
  --color-primary: #1e3a5f;
  --color-secondary: #d4a017;
  --color-accent: #f97316;
  --color-artifact: #fef3c7;
  --color-nav-bg: #f5e8c8;
  --color-nav-text: #1e3a5f;
}

/* ── Winter ── */
[data-season="winter"] {
  --color-background: #0a0f1e;
  --color-text: #e8eef8;
  --color-primary: #e8eef8;
  --color-secondary: #4a6fa5;
  --color-accent: #7eb8f7;
  --color-artifact: #1a2540;
  --color-nav-bg: #0a0f1e80;
  --color-nav-text: #e8eef8;
}

body {
  line-height: 1.5;
}

p {
  line-height: 1.5;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tech-item {
  position: relative !important;
  left: auto !important;
  top: auto !important;
  transform: none !important;
}

@media (min-width: 1280px) {
  .tech-item {
    position: absolute !important;
    left: var(--tech-left) !important;
    top: var(--tech-top) !important;
    transform: translateX(-50%) !important;
  }
}
```

- [ ] **Step 2: Verify the CSS variable names match what Tailwind uses**

The existing code uses `text-text`, `text-accent`, `text-secondary`, `bg-background`, `bg-artifact` etc. in Tailwind classes. These map to `--color-text`, `--color-accent` etc. via Tailwind v4's `@theme inline`. The new `--color-nav-text` variable will be used directly via inline style in the navbar — not as a Tailwind class.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add four season CSS variable palettes"
```

---

## Task 2: Set initial data-season on html element

**Files:**
- Modify: `app/layout.tsx`

The `data-season` attribute must be set before the page renders to avoid a flash of the wrong theme. The safest way is an inline `<script>` that runs synchronously before React hydrates.

- [ ] **Step 1: Add inline script to layout.tsx**

Open `app/layout.tsx`. Add a `<script>` tag inside `<html>` before `<body>` that reads from `localStorage` and sets `data-season`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import SeasonToggle from "@/components/ui/SeasonToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Yi's Portfolio",
  description: "Full-stack developer specializing in React and Spring Boot",
  keywords: ["portfolio", "developer", "react", "nextjs", "spring boot"],
  icons: {
    icon: '/images/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var season = localStorage.getItem('season') || 'summer';
                document.documentElement.setAttribute('data-season', season);
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <SeasonToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: set initial data-season from localStorage before render"
```

---

## Task 3: Build the SeasonToggle component

**Files:**
- Create: `components/ui/SeasonToggle.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

const SEASONS: { id: Season; emoji: string; label: string }[] = [
  { id: 'spring', emoji: '🌸', label: 'Spring' },
  { id: 'summer', emoji: '☀️', label: 'Summer' },
  { id: 'autumn', emoji: '🍂', label: 'Autumn' },
  { id: 'winter', emoji: '❄️', label: 'Winter' },
]

const ACCENT_COLORS: Record<Season, string> = {
  spring: '#e05c8a',
  summer: '#166534',
  autumn: '#f97316',
  winter: '#7eb8f7',
}

export default function SeasonToggle() {
  const [season, setSeason] = useState<Season>('summer')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('season') as Season | null
    if (stored) setSeason(stored)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectSeason(s: Season) {
    setSeason(s)
    setOpen(false)
    localStorage.setItem('season', s)
    document.documentElement.setAttribute('data-season', s)
  }

  const current = SEASONS.find(s => s.id === season)!
  const accentColor = ACCENT_COLORS[season]

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Expanded pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: '40px',
          padding: open ? '8px 8px' : '0',
          boxShadow: open ? '0 4px 24px rgba(0,0,0,0.18)' : 'none',
          overflow: 'hidden',
          maxWidth: open ? '360px' : '0px',
          opacity: open ? 1 : 0,
          transition: 'max-width 0.3s ease, opacity 0.2s ease, padding 0.3s ease',
          marginRight: open ? '8px' : '0',
          gap: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        {SEASONS.map(s => (
          <button
            key={s.id}
            onClick={() => selectSeason(s.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: s.id === season ? 700 : 400,
              background: s.id === season ? `${ACCENT_COLORS[s.id]}20` : 'transparent',
              color: s.id === season ? ACCENT_COLORS[s.id] : '#666',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: '18px' }}>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Collapsed circle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Switch season theme"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: `2px solid ${accentColor}`,
          background: '#fff',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          flexShrink: 0,
          transition: 'border-color 0.3s',
        }}
      >
        {current.emoji}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify the component renders**

Run `npm run dev` and visit `http://localhost:3000`. You should see the season toggle circle at bottom-right. Clicking it should expand the pill horizontally to the left. Selecting a season should change the page colours immediately.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SeasonToggle.tsx
git commit -m "feat: add SeasonToggle floating component"
```

---

## Task 4: Update navbar to use CSS variable nav text colour

**Files:**
- Modify: `components/layout/navbar/Navbar.tsx`

Summer's navbar is dark green — nav links need to be white. Other seasons keep their text colour. The `--color-nav-text` CSS variable handles this per season.

- [ ] **Step 1: Update nav link text colour to use CSS variable**

In `Navbar.tsx`, find the nav link `className` block around line 114 and update the active/inactive text classes to use inline style instead of Tailwind colour classes:

```tsx
{NAV_LINKS.map((link) => {
  const isActive = pathname === link.href
  return (
    <Link
      key={link.label}
      href={link.href}
      className={`font-normal transition-all ${isActive ? 'pb-1 border-b-2' : ''}`}
      style={{
        fontSize: 'clamp(14px, 1.2vw, 18px)',
        color: 'var(--color-nav-text)',
        opacity: isActive ? 1 : 0.75,
        borderColor: isActive ? 'var(--color-nav-text)' : 'transparent',
      }}
    >
      {link.label}
    </Link>
  )
})}
```

- [ ] **Step 2: Update social icon link colours the same way**

Find the social links map around line 132 and update:

```tsx
{SOCIAL_LINKS.map((link) => (
  <Link
    key={link.label}
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={link.ariaLabel}
    style={{
      fontSize: 'clamp(20px, 2vw, 30px)',
      color: 'var(--color-nav-text)',
      opacity: 0.75,
      transition: 'opacity 0.2s',
    }}
  >
    <i className={link.icon}></i>
  </Link>
))}
```

- [ ] **Step 3: Verify navbar text colour switches correctly**

Run `npm run dev`. Switch to Summer — navbar should be dark green with white text. Switch to other seasons — navbar text should match that season's text colour.

- [ ] **Step 4: Commit**

```bash
git add components/layout/navbar/Navbar.tsx
git commit -m "feat: use CSS variable nav text colour for season themes"
```

---

## Task 5: Smoke test all seasons

- [ ] **Step 1: Test each season visually**

Run `npm run dev`. For each season, verify:

| Season | Background | Navbar bg | Navbar text | Accent |
|---|---|---|---|---|
| Summer | sage green `#E4E5D9` | dark green `#166534` | white | green |
| Spring | blush `#fff0f5` | blush blur | rose | pink |
| Autumn | cream `#fffbeb` | amber `#f5e8c8` | navy | orange |
| Winter | near-black `#0a0f1e` | dark blur | snow white | ice blue |

- [ ] **Step 2: Test localStorage persistence**

Select Winter. Refresh the page. The site should load in Winter — no flash of Summer before switching.

- [ ] **Step 3: Test toggle behaviour**

- Circle shows current season emoji ✓
- Click circle → pill expands left ✓
- Active season highlighted in pill ✓
- Click another season → pill collapses, theme switches ✓
- Click outside → pill collapses ✓

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: four seasons theme switcher complete"
```
