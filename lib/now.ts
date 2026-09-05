import fs from 'fs'
import path from 'path'
import catalogFile from '@/data/constellations.json'
import type { Catalog, Goal, NowItem } from '@/types/now'
import { dailyCounts, findActive, isActive, SITE_TIMEZONE, validateGoal } from '@/lib/now-logic'

export { SITE_TIMEZONE }

const NOW_DIR = path.join(process.cwd(), 'data/now')

/** Today in the author's timezone — the server runs in UTC, which is 9.5h behind. */
export function today(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: SITE_TIMEZONE }).format(new Date())
}

export function getCatalog(): Catalog {
  return (catalogFile as unknown as { constellations: Catalog }).constellations
}

export function getGoals(): Goal[] {
  if (!fs.existsSync(NOW_DIR)) return []
  const catalog = getCatalog()
  return fs
    .readdirSync(NOW_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const slug = file.replace(/\.json$/, '')
      let raw: unknown
      try {
        raw = JSON.parse(fs.readFileSync(path.join(NOW_DIR, file), 'utf8'))
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new Error(`data/now/${slug}.json: ${message}`)
      }
      return validateGoal(slug, raw, catalog)
    })
}

export interface CollectedGoal {
  slug: string
  startedAt: string
  finishedAt: string
  items: NowItem[]
}

export interface NowData {
  catalog: Catalog
  active: Goal | null
  collected: CollectedGoal[]
  counts: Record<string, number>
  dates: string[]
  today: string
  stats: { collected: number; total: number }
}

export function getNowData(): NowData {
  const catalog = getCatalog()
  const goals = getGoals()
  const active = findActive(goals)

  const collected: CollectedGoal[] = goals
    .filter((goal) => !isActive(goal))
    .map((goal) => ({
      slug: goal.slug,
      startedAt: goal.startedAt,
      finishedAt: goal.items.reduce((latest, item) => (item.completedAt! > latest ? item.completedAt! : latest), ''),
      items: goal.items,
    }))
    .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))

  const counts = dailyCounts(goals)
  const dates = goals.flatMap((goal) =>
    goal.items.map((item) => item.completedAt).filter((date): date is string => date !== null)
  )
  const now = today()

  return {
    catalog,
    active,
    collected,
    counts,
    dates,
    today: now,
    stats: {
      collected: collected.length,
      total: Object.keys(catalog).length,
    },
  }
}
