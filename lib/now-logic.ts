// Pure logic for the /now page. NO VALUE IMPORTS — `import type` is erased before
// execution, so this file runs directly under `node --test`. A plain import would
// need the `@/` alias, which Node cannot resolve.
import type { Constellation, Point, Catalog, Goal, GoalFile, NowItem } from '@/types/now'

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
