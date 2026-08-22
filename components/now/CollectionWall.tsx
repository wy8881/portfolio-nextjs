import { starPoints } from '@/lib/now-logic'
import type { Catalog } from '@/types/now'
import type { CollectedGoal } from '@/lib/now'

const GLYPH = 100
const GLYPH_PADDING = 12

export interface CollectionWallProps {
  catalog: Catalog
  collected: CollectedGoal[]
  activeSlug: string | null
}

const CollectionWall = ({ catalog, collected, activeSlug }: CollectionWallProps) => {
  const bySlug = new Map(collected.map((goal) => [goal.slug, goal]))
  // Collected figures cluster at the front, newest first, so the trophies are not lost
  // among 85 faint silhouettes; only the uncollected remainder falls back to alphabetical.
  const slugs = Object.keys(catalog).sort((a, b) => {
    const goalA = bySlug.get(a)
    const goalB = bySlug.get(b)
    if (goalA && goalB) return goalB.finishedAt.localeCompare(goalA.finishedAt)
    if (goalA) return -1
    if (goalB) return 1
    return catalog[a].name.localeCompare(catalog[b].name)
  })

  return (
    <section aria-label="Collection" className="mt-16">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm uppercase tracking-wide text-secondary">Collection</h2>
        <p className="text-sm text-secondary">
          {collected.length} / {slugs.length}
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {slugs.map((slug) => {
          const figure = catalog[slug]
          const goal = bySlug.get(slug)
          const isCollected = Boolean(goal)
          const isActive = slug === activeSlug
          const points = starPoints(figure, GLYPH, GLYPH_PADDING)
          const color = isCollected ? 'var(--color-accent)' : 'var(--color-secondary)'
          const opacity = isCollected ? 1 : isActive ? 0.6 : 0.3

          return (
            <div
              key={slug}
              title={
                goal
                  ? `${figure.name} — ${goal.startedAt} to ${goal.finishedAt}`
                  : isActive
                    ? `${figure.name} — in progress`
                    : figure.name
              }
              className="aspect-square rounded-lg p-1"
              style={{ background: isActive ? 'var(--color-artifact)' : 'transparent' }}
            >
              <svg viewBox={`0 0 ${GLYPH} ${GLYPH}`} className="w-full h-full" role="img" aria-label={figure.name}>
                {figure.lines.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={points[a].x}
                    y1={points[a].y}
                    x2={points[b].x}
                    y2={points[b].y}
                    stroke={color}
                    strokeWidth={1.2}
                    opacity={opacity}
                  />
                ))}
                {points.map((point, i) => (
                  <circle key={i} cx={point.x} cy={point.y} r={2.2} fill={color} opacity={opacity} />
                ))}
              </svg>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default CollectionWall
