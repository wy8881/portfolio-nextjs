'use client'

import { useMergedDates } from '@/lib/hooks/useMergedDates'
import { heatmapGrid } from '@/lib/now-logic'
import type { NowItem } from '@/types/now'

const WEEKS = 52
// Empty cells must read as a faint substrate, not compete with lit ones — so this
// stays well below LEVELS[0] in every season. See the opacity note below.
const EMPTY_OPACITY = 0.12
const LEVELS = [0.3, 0.5, 0.7, 0.9]

export interface HeatmapProps {
  counts: Record<string, number>
  today: string
  activeSlug: string | null
  activeItems: NowItem[]
}

const Heatmap = ({ counts, today, activeSlug, activeItems }: HeatmapProps) => {
  const { localDates, effectiveToday } = useMergedDates(activeSlug, activeItems, today)

  // Local ticks count toward today immediately — otherwise the streak would look
  // broken on the very day you kept it alive.
  const merged = { ...counts }
  for (const date of localDates) {
    merged[date] = (merged[date] ?? 0) + 1
  }

  const grid = heatmapGrid(merged, effectiveToday, WEEKS)

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
                      // legible marks (see ConstellationFigure's unlit stars). It must
                      // render lighter than every lit tier — EMPTY_OPACITY sits well
                      // under LEVELS[0] across all four seasons (verified in the task
                      // report), so an empty day never outweighs a 1-star day the way a
                      // flat 0.45 did.
                      background: cell.count === 0 ? 'var(--color-secondary)' : 'var(--color-accent)',
                      opacity: cell.count === 0 ? EMPTY_OPACITY : LEVELS[Math.min(cell.count - 1, LEVELS.length - 1)],
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
