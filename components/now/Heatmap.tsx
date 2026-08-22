'use client'

import { useLocalCompletions } from '@/lib/hooks/useLocalCompletions'
import { heatmapGrid, resolveItems } from '@/lib/now-logic'
import type { NowItem } from '@/types/now'

const WEEKS = 52
const LEVELS = [0.12, 0.35, 0.6, 0.85]

export interface HeatmapProps {
  counts: Record<string, number>
  today: string
  activeSlug: string | null
  activeItems: NowItem[]
}

const Heatmap = ({ counts, today, activeSlug, activeItems }: HeatmapProps) => {
  const { overrides } = useLocalCompletions(activeSlug)

  // Local ticks count toward today immediately — otherwise the streak would look
  // broken on the very day you kept it alive.
  const merged = { ...counts }
  for (const item of resolveItems(activeItems, overrides)) {
    const committed = activeItems.find((i) => i.id === item.id)?.completedAt ?? null
    if (item.completedAt && !committed) merged[item.completedAt] = (merged[item.completedAt] ?? 0) + 1
  }

  const grid = heatmapGrid(merged, today, WEEKS)

  return (
    <section aria-label="Daily activity" className="mt-16">
      <h2 className="text-sm uppercase tracking-wide text-secondary mb-4">Last 52 weeks</h2>
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-[3px] min-w-max">
          {grid.map((week, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {week.map((cell, d) =>
                cell === null ? (
                  <div key={d} className="w-[10px] h-[10px]" />
                ) : (
                  <div
                    key={d}
                    title={`${cell.date} — ${cell.count} ${cell.count === 1 ? 'star' : 'stars'}`}
                    className="w-[10px] h-[10px] rounded-[2px]"
                    style={{
                      // --color-artifact is a surface/panel token tuned to blend with the
                      // season background (e.g. autumn's artifact #fef3c7 on #fffbeb
                      // background is nearly invisible) — not a foreground mark color.
                      // --color-secondary is what the rest of /now uses for faint-but-
                      // legible marks (see ConstellationFigure's unlit stars).
                      background: cell.count === 0 ? 'var(--color-secondary)' : 'var(--color-accent)',
                      opacity: cell.count === 0 ? 0.45 : LEVELS[Math.min(cell.count - 1, LEVELS.length - 1)],
                    }}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Heatmap
