// Pure logic for the /now page. NO VALUE IMPORTS — `import type` is erased before
// execution, so this file runs directly under `node --test`. A plain import would
// need the `@/` alias, which Node cannot resolve.
import type { Constellation, Point, Catalog, Goal, GoalFile, NowItem, Overrides, Streaks, HeatmapCell } from '@/types/now'

/** Maps normalised 0–1 catalog coordinates into a padded square of `size` pixels. */
export function starPoints(figure: Constellation, size: number, padding: number): Point[] {
  const inner = size - padding * 2
  return figure.stars.map(([x, y]) => ({
    x: padding + x * inner,
    y: padding + y * inner,
  }))
}

const DATE = /^\d{4}-\d{2}-\d{2}$/

/** Validates one goal file. Throws with the filename so a bad file fails `next build` loudly. */
export function validateGoal(slug: string, raw: unknown, catalog: Catalog): Goal {
  const where = `data/now/${slug}.json`
  const figure = catalog[slug]
  if (!figure) throw new Error(`${where}: "${slug}" is not a constellation abbreviation`)
  if (typeof raw !== 'object' || raw === null) throw new Error(`${where}: expected an object`)

  const { startedAt, items } = raw as Partial<GoalFile>
  if (typeof startedAt !== 'string' || !DATE.test(startedAt)) {
    throw new Error(`${where}: startedAt must be a YYYY-MM-DD date`)
  }
  if (!Array.isArray(items)) throw new Error(`${where}: items must be an array`)
  if (items.length !== figure.stars.length) {
    throw new Error(`${where}: ${items.length} items but ${figure.name} has ${figure.stars.length} stars`)
  }

  const seen = new Set<string>()
  for (const item of items as NowItem[]) {
    if (!item || typeof item.id !== 'string' || item.id === '') throw new Error(`${where}: every item needs an id`)
    if (seen.has(item.id)) throw new Error(`${where}: duplicate item id "${item.id}"`)
    seen.add(item.id)
    if (typeof item.text !== 'string' || item.text.trim() === '') {
      throw new Error(`${where}: item "${item.id}" has no text`)
    }
    if (item.completedAt !== null) {
      if (typeof item.completedAt !== 'string' || !DATE.test(item.completedAt)) {
        throw new Error(`${where}: item "${item.id}" has invalid completedAt "${item.completedAt}"`)
      }
      if (item.completedAt < startedAt) {
        throw new Error(`${where}: item "${item.id}" completed before the goal started`)
      }
    }
  }

  return { slug, startedAt, items: items as NowItem[] }
}

export function isActive(goal: Goal): boolean {
  return goal.items.some((item) => item.completedAt === null)
}

/** One constellation runs at a time; this is where that rule is actually enforced. */
export function findActive(goals: Goal[]): Goal | null {
  const active = goals.filter(isActive)
  if (active.length > 1) {
    throw new Error(
      `More than one goal is active: ${active.map((g) => g.slug).join(', ')} — only one constellation runs at a time`
    )
  }
  return active[0] ?? null
}

/**
 * Committed data always wins. A local override applies only while its `base`
 * still matches what the file says — once the real date is committed, the
 * override no longer matches and drops itself. No cleanup step needed.
 */
export function resolveItems(items: NowItem[], overrides: Overrides): NowItem[] {
  return items.map((item) => {
    if (item.completedAt !== null) return item
    const override = overrides[item.id]
    if (!override || override.base !== item.completedAt) return item
    return { ...item, completedAt: override.completedAt }
  })
}

const DAY_MS = 86_400_000

/** Day arithmetic through UTC so a DST shift can never add or eat a day. */
export function addDays(date: string, delta: number): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d) + delta * DAY_MS).toISOString().slice(0, 10)
}

/** 0 = Monday … 6 = Sunday. */
export function dayOfWeek(date: string): number {
  const [y, m, d] = date.split('-').map(Number)
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7
}

export function dailyCounts(goals: Goal[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const goal of goals) {
    for (const item of goal.items) {
      if (item.completedAt) counts[item.completedAt] = (counts[item.completedAt] ?? 0) + 1
    }
  }
  return counts
}

export function computeStreaks(dates: string[], today: string): Streaks {
  const days = [...new Set(dates)].sort()
  if (days.length === 0) return { current: 0, longest: 0 }

  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    run = days[i] === addDays(days[i - 1], 1) ? run + 1 : 1
    if (run > longest) longest = run
  }

  // A streak stays alive until the day after the last completion — otherwise
  // it would read as broken all morning before you got to today's chapter.
  const last = days[days.length - 1]
  let current = 0
  if (last === today || last === addDays(today, -1)) {
    current = 1
    for (let i = days.length - 1; i > 0; i--) {
      if (days[i - 1] !== addDays(days[i], -1)) break
      current++
    }
  }

  return { current, longest }
}

export function monthCount(dates: string[], today: string): number {
  const prefix = today.slice(0, 7)
  return dates.filter((date) => date.startsWith(prefix)).length
}

export function heatmapGrid(
  counts: Record<string, number>,
  today: string,
  weeks: number
): (HeatmapCell | null)[][] {
  const monday = addDays(today, -dayOfWeek(today))
  const start = addDays(monday, -(weeks - 1) * 7)
  const grid: (HeatmapCell | null)[][] = []

  for (let w = 0; w < weeks; w++) {
    const week: (HeatmapCell | null)[] = []
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d)
      week.push(date > today ? null : { date, count: counts[date] ?? 0 })
    }
    grid.push(week)
  }

  return grid
}

export function availableFigures(catalog: Catalog, used: string[], starCount: number): string[] {
  const taken = new Set(used)
  return Object.keys(catalog)
    .filter((slug) => !taken.has(slug) && catalog[slug].stars.length === starCount)
    .sort()
}

/** `random` is injected so the scaffolder is deterministic under test. */
export function pickFigure(
  catalog: Catalog,
  used: string[],
  starCount: number,
  random: () => number
): { slug: string; figure: Constellation } | null {
  const slugs = availableFigures(catalog, used, starCount)
  if (slugs.length === 0) return null
  const slug = slugs[Math.min(slugs.length - 1, Math.floor(random() * slugs.length))]
  return { slug, figure: catalog[slug] }
}

export function nearestCounts(catalog: Catalog, used: string[], starCount: number, limit = 3): number[] {
  const taken = new Set(used)
  const counts = new Set<number>()
  for (const [slug, figure] of Object.entries(catalog)) {
    if (!taken.has(slug)) counts.add(figure.stars.length)
  }
  return [...counts]
    .sort((a, b) => Math.abs(a - starCount) - Math.abs(b - starCount) || a - b)
    .slice(0, limit)
}
