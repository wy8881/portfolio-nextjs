'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ANIMATION_EASING } from '@/lib/animations'
import { starPoints } from '@/lib/now-logic'
import type { Constellation, NowItem } from '@/types/now'

const SIZE = 1000
const PADDING = 70

export interface ConstellationFigureProps {
  figure: Constellation
  items: NowItem[]
  activeIndex: number | null
  onActivate: (index: number | null) => void
  /**
   * Ids of items toggled lit during *this* session (owned by `ActiveConstellation`,
   * which is the only thing that knows for certain — it's the one calling `toggle`).
   * Starts empty on every load, so nothing restored from localStorage is ever in it,
   * and nothing restored ever animates. Only ids in this set count as "new" for the
   * pop-in / draw-in / bloom animations below.
   */
  newlyLitIds: Set<string>
}

function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const ConstellationFigure = ({ figure, items, activeIndex, onActivate, newlyLitIds }: ConstellationFigureProps) => {
  const points = starPoints(figure, SIZE, PADDING)
  const lit = items.map((item) => item.completedAt !== null)

  const reduced = useReducedMotion()

  // A star counts as "new" only if the parent recorded it as toggled this session —
  // never derived from comparing renders, so there's nothing to get wrong about which
  // render is the "real" post-hydration one.
  const isNew = (i: number) => newlyLitIds.has(items[i].id)
  const complete = lit.every(Boolean)
  // The completing tick happened *this* session iff at least one item was toggled this
  // session — a reload that restores an already-finished figure never touches this set.
  const bloom = complete && newlyLitIds.size > 0 && !reduced

  return (
    <div className="relative w-full" onPointerLeave={() => onActivate(null)}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-auto"
        role="group"
        aria-label={`${figure.name} — ${lit.filter(Boolean).length} of ${items.length} stars lit`}
      >
        {figure.lines.map(([a, b], i) => {
          const on = lit[a] && lit[b]
          // TypeScript rejects an explicit prop followed by a spread that may carry the
          // same key (TS2783), even though JSX's later-wins semantics are exactly what's
          // wanted here — so the conditional is resolved once, up front, and passed as
          // plain `initial`/`transition` props instead of a spread over a static `false`.
          const drawing = on && !reduced && (isNew(a) || isNew(b))
          return (
            <motion.line
              key={`edge-${i}`}
              x1={points[a].x}
              y1={points[a].y}
              x2={points[b].x}
              y2={points[b].y}
              stroke={on ? 'var(--color-accent)' : 'var(--color-secondary)'}
              strokeWidth={on ? 3 : 2.5}
              strokeDasharray={on ? undefined : '10 14'}
              initial={drawing ? { pathLength: 0, opacity: 0.9 } : false}
              animate={{ pathLength: 1, opacity: on ? 0.9 : 0.35 }}
              transition={reduced ? { duration: 0 } : drawing ? { duration: 0.3, ease: ANIMATION_EASING.standard } : undefined}
            />
          )
        })}

        {points.map((point, i) => {
          const isLit = lit[i]
          const isActive = activeIndex === i
          const isNewStar = !reduced && isNew(i)
          const label = isLit
            ? `${items[i].text} — finished ${formatDate(items[i].completedAt as string)}`
            : `${items[i].text} — not finished yet`

          return (
            <g
              key={items[i].id}
              tabIndex={0}
              role="button"
              aria-label={label}
              onPointerEnter={() => onActivate(i)}
              onFocus={() => onActivate(i)}
              onBlur={() => onActivate(null)}
              onClick={() => onActivate(isActive ? null : i)}
              className="cursor-pointer focus:outline-none"
            >
              {isLit && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={26}
                  fill="var(--color-accent)"
                  initial={false}
                  animate={{
                    opacity: isActive ? 0.32 : bloom ? [0.18, 0.45, 0.18] : 0.18,
                  }}
                  transition={reduced ? { duration: 0 } : bloom ? { duration: 0.9, delay: i * 0.05 } : { duration: 0.2 }}
                />
              )}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isLit ? 11 : 9}
                fill={isLit ? 'var(--color-accent)' : 'none'}
                stroke={isLit ? 'none' : 'var(--color-secondary)'}
                strokeWidth={2.5}
                strokeDasharray={isLit ? undefined : '6 6'}
                initial={isNewStar ? { opacity: 0, scale: 0.4 } : false}
                animate={{ opacity: isLit ? 1 : 0.55, scale: 1 }}
                transition={reduced ? { duration: 0 } : isNewStar ? { duration: 0.3, ease: ANIMATION_EASING.standard } : undefined}
                style={{ transformOrigin: `${point.x}px ${point.y}px` }}
              />
              {/* Generous invisible hit area — the visible star is far too small to hover on a phone. */}
              <circle cx={point.x} cy={point.y} r={40} fill="transparent" />
            </g>
          )
        })}
      </svg>

      {activeIndex !== null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none px-3 py-2 rounded-lg text-xs whitespace-nowrap max-w-[80%] overflow-hidden text-ellipsis"
          style={{
            left: `${(points[activeIndex].x / SIZE) * 100}%`,
            top: `${(points[activeIndex].y / SIZE) * 100 - 2}%`,
            background: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
        >
          <span className="font-medium">{items[activeIndex].text}</span>
          <span className="opacity-75">
            {items[activeIndex].completedAt
              ? ` · ${formatDate(items[activeIndex].completedAt as string)}`
              : ' · not yet'}
          </span>
        </div>
      )}
    </div>
  )
}

export default ConstellationFigure
