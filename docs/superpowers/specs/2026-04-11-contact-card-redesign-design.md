# Contact Info Card Redesign

**Date:** 2026-04-11
**Scope:** `ContactIntro.tsx` card div + `globals.css` theme token + new `ContactInfoRow` component

## Problem

The current contact info card uses `bg-artifact` (`#C3C3B9` in summer), which is only marginally different from the page background (`#E4E5D9`). The card does not stand out visually. The green-tinted box shadow and bullet pseudo-elements are decorative but do not solve the contrast issue.

## Design Decision

**Style B:** Light/dark card background with a bold left accent border and Bootstrap Icons per row.

- Card background uses a new `--color-contact-card` CSS custom property, set per theme
- Left border uses the existing `--color-accent` token (already theme-aware)
- Each contact row is rendered by a new `ContactInfoRow` component
- Each row receives `icon`, `text`, `label`, and optional `href`
- The icon is `aria-hidden="true"` (decorative — text conveys the meaning)
- `label` renders as a `sr-only` prefix so screen readers announce e.g. "Email: wy7382@gmail.com"
- Email and phone rows pass an `href` (`mailto:` and `tel:` respectively) to render as links — enables tap-to-email/call on mobile and announces as interactive to screen readers
- Location renders as plain text (no href)
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

### `components/contact/ContactInfoRow.tsx` (new file)

```tsx
interface ContactInfoRowProps {
  icon: string    // Bootstrap Icon class e.g. "bi-envelope" — rendered aria-hidden="true"
  text: string    // Display value e.g. "wy7382@gmail.com"
  label: string   // sr-only prefix e.g. "Email" — screen readers announce "Email: wy7382@gmail.com"
  href?: string   // Optional link — mailto: for email, tel: for phone, omit for location
}
```

Renders a single row: `aria-hidden` icon (`text-accent`) + optional link wrapper + `sr-only` label + text (`Body` component).

### `components/contact/ContactIntro.tsx`

Replace the current card `<div>` (line 44) with:

```tsx
<div className="bg-[var(--color-contact-card)] border-l-4 border-accent rounded-r-lg px-6 py-4 shadow-sm flex flex-col gap-2.5 w-fit">
  <div className="text-[10px] tracking-[2px] uppercase font-bold text-accent mb-1">
    Contact
  </div>
  <ContactInfoRow icon="bi-envelope"  label="Email"    text={contactInfo.email}    href={`mailto:${contactInfo.email}`} />
  <ContactInfoRow icon="bi-telephone" label="Phone"    text={contactInfo.phone}    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} />
  <ContactInfoRow icon="bi-geo-alt"   label="Location" text={contactInfo.location} />
</div>
```

## What Is Not Changing

- `data/contact/contact-info.ts` — data source untouched
- `types/contact.ts` — untouched
- `motion` animation wrapper — untouched
- Grid layout and responsive breakpoints — untouched
- Social links — remain commented out
- `DogImage` component — untouched
