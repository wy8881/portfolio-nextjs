# Contact Info Card Redesign

**Date:** 2026-04-11
**Scope:** `ContactIntro.tsx` card div + `globals.css` theme token addition

## Problem

The current contact info card uses `bg-artifact` (`#C3C3B9` in summer), which is only marginally different from the page background (`#E4E5D9`). The card does not stand out visually. The green-tinted box shadow and bullet pseudo-elements are decorative but do not solve the contrast issue.

## Design Decision

**Style B:** Light/dark card background with a bold left accent border and Bootstrap Icons per row.

- Card background uses a new `--color-contact-card` CSS custom property, set per theme
- Left border uses the existing `--color-accent` token (already theme-aware)
- Each contact row uses a Bootstrap Icon (`bi-envelope`, `bi-telephone`, `bi-geo-alt`) in `text-accent`
- A small uppercase "CONTACT" label sits above the rows in `text-accent`
- Bullet pseudo-elements (`before:content-['•']`) are removed
- Social links remain commented out

## Theme Token Values

Add `--color-contact-card` to `globals.css`:

| Theme   | `--color-contact-card` | Rationale |
|---------|------------------------|-----------|
| Summer  | `#fafaf8`              | Near-white with warm tint, clear against sage `#E4E5D9` |
| Spring  | `#ffffff`              | Pure white, clean against blush `#fff0f5` |
| Autumn  | `#ffffff`              | Pure white, clean against cream `#fffbeb` |
| Winter  | `#1e3a5f`              | Medium navy, clearly distinct against near-black `#0a0f1e` |

## Files Changed

### `app/globals.css`

1. Add to `@theme` block:
   ```css
   --color-contact-card: #fafaf8;
   ```

2. Add to each `[data-season]` block:
   ```css
   [data-season="summer"]  { --color-contact-card: #fafaf8; }
   [data-season="spring"]  { --color-contact-card: #ffffff; }
   [data-season="autumn"]  { --color-contact-card: #ffffff; }
   [data-season="winter"]  { --color-contact-card: #1e3a5f; }
   ```

### `components/contact/ContactIntro.tsx`

Replace the current card `<div>` (line 44) with:

```tsx
<div className="border-l-4 border-accent rounded-r-lg px-6 py-4 shadow-sm flex flex-col gap-2.5 w-fit"
     style={{ background: 'var(--color-contact-card)' }}>
  <div className="text-[10px] tracking-[2px] uppercase font-bold text-accent mb-1">
    Contact
  </div>
  <div className="flex items-center gap-2.5">
    <i className="bi bi-envelope text-accent text-sm" />
    <Body as="div">{contactInfo.email}</Body>
  </div>
  <div className="flex items-center gap-2.5">
    <i className="bi bi-telephone text-accent text-sm" />
    <Body as="div">{contactInfo.phone}</Body>
  </div>
  <div className="flex items-center gap-2.5">
    <i className="bi bi-geo-alt text-accent text-sm" />
    <Body as="div">{contactInfo.location}</Body>
  </div>
</div>
```

**Note:** Use `bg-[var(--color-contact-card)]` as a Tailwind arbitrary value class, consistent with how other theme colors are used in the codebase. The inline style shown above is equivalent but less idiomatic here.

## What Is Not Changing

- `data/contact/contact-info.ts` — data source untouched
- `motion` animation wrapper — untouched
- Grid layout and responsive breakpoints — untouched
- Social links — remain commented out
- `DogImage` component — untouched
