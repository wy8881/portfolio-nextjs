---
name: now-page
description: Use when updating yi's portfolio /now page — lighting up a star for today, marking a learning item complete, naming upcoming stars, setting up a goal, starting a new constellation, or editing any file under data/now/.
---

# Now page — lighting stars and setting up goals

## Overview

`/now` is a constellation tracker. Each `data/now/<abbr>.json` file is one goal — one
real IAU constellation whose `items` array maps **1:1** to that figure's stars, in star
order (`id` `i1`, `i2`, …). Setting an item's `completedAt` lights that star.

Core rules:

- **One goal is active at a time.** The active goal is the single `data/now/*.json` file
  with at least one item still at `completedAt: null`. `npm run build` throws if two are
  active.
- **The committed JSON is the public truth.** The in-browser click that lights a star
  writes only to that device's `localStorage` — never the repo. Every permanent change
  is a hand edit to the JSON file, never a component.
- **`npm run build` is the gate.** It runs `validateGoal` against every data file; a bad
  file aborts the build and names itself.
- **Dates are `YYYY-MM-DD` in Australia/Adelaide.** Use `TZ=Australia/Adelaide date +%F`,
  never the bare `date` — the host may be on another day, and Adelaide wins.
- **Stars need not be lit in order.** `validateGoal` enforces no sequence: a later star
  can be lit while an earlier one is still dark.

## Reading the prompt

| The prompt… | Workflow | Which star | Its label |
|---|---|---|---|
| is empty | A | first item with `completedAt: null` | already set — ask only if blank |
| says what was learned ("finished the X chapter") | A | first item with `completedAt: null` | set `text` to that |
| names a star ("light up i3") | A | that exact item | from the prompt, else **ask** |
| lines up upcoming topics, no completion | B | — | — |
| "start the next constellation" / current figure fully lit | B | — | — |

Ambiguous about which star, or what to call it? Ask before editing.

## Workflow A — Light up a star

1. Open the active goal file in `data/now/`.
2. Pick the item: the one the prompt names, else the first with `completedAt: null`.
   If every item is already lit there is no active goal — that is really Workflow B, so
   confirm with the user.
3. The item's `text` must be non-empty — `validateGoal` rejects a lit star with blank
   text. Use the prompt's label; if it gave none and `text` is blank, **ask**.
4. Set `completedAt` to `TZ=Australia/Adelaide date +%F`. It must be ≥ the file's
   `startedAt`.
5. `npm run build` — it must pass.
6. Ship it (below).

## Workflow B — Name upcoming stars / start a constellation

**Name upcoming stars in the current figure** — set `text` on items that still have
`text: ""` (an empty string is an unnamed star), lowest `id` first. Leave `completedAt`
as `null`, and don't touch items that already have text. Then `npm run build` and ship
it.

**Start a new constellation** — only when the active figure is fully lit, or there is no
goal file at all:

```
npm run now:new <starCount> [-- --figure <abbr>]
```

`<starCount>` is an integer ≥ 2; with `--figure`, that constellation must have exactly
that many stars. The script draws an unused figure, writes `data/now/<abbr>.json` with
placeholder item text, and refuses while a goal is still active. Replace the placeholder
text with real chapter/module names, then `npm run build` and ship it.

## What `npm run build` (validateGoal) enforces

`lib/now-logic.ts`, per file, naming `data/now/<slug>.json` on failure:

| Rule |
|---|
| `items.length` equals the figure's star count |
| every item has a unique non-empty `id` |
| a lit item (`completedAt` set) has non-empty `text` |
| `completedAt` is `null` or `YYYY-MM-DD`, and ≥ `startedAt` |
| `startedAt` is `YYYY-MM-DD` |
| exactly one goal file is active across all of `data/now/` |

## Ship it

One star — or one goal-setup — per branch and PR. Pattern: commit `ab870d2`, PR #15.
Below, `<Star>` is the item's `text` and the branch slug is its kebab-case.

```
git checkout main && git pull        # unrelated working-tree changes tag along — don't stage them
git checkout -b chore/complete-<star-slug>
# edit data/now/<abbr>.json
npm run build                        # must pass
git add data/now/<abbr>.json         # this path only — never `git add -A`
```

Commit with a title, a one-line body, and the two trailers from the session's
attribution guidance:

```
git commit -F - <<'MSG'
chore: mark <Star> as finished

<one line: what the star covers; note the date sits after startedAt>

Co-Authored-By: Claude <model> <noreply@anthropic.com>
Claude-Session: <session url>
MSG
```

Push, then open the PR with an explicit body — `--fill` will not add the 🤖 line:

```
git push -u origin HEAD
gh pr create --title "chore: mark <Star> as finished" \
  --body $'<summary>\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)'
```

Merge the PR, then `git checkout main && git pull`. For goal setup, title the commit
`chore: <describe>` instead.

## Common mistakes

- **Bare `date`** — that is UTC. Always `TZ=Australia/Adelaide date +%F`.
- **Lighting a star whose `text` is blank** — fill it first, or the build fails.
- **`git add -A` / `git add .`** — the tree often carries unrelated uncommitted work
  (blog edits). Stage the one JSON file by name.
- **Overwriting a named star** when asked to line up upcoming stars — only fill
  `text: ""` items.
- **`git add -f docs/`** — `docs/` is gitignored on purpose.
