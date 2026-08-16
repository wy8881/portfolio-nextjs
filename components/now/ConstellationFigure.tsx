'use client'

import { starPoints } from '@/lib/now-logic'
import type { Constellation, NowItem } from '@/types/now'

const SIZE = 1000
const PADDING = 70

export interface ConstellationFigureProps {
  figure: Constellation
  items: NowItem[]
  activeIndex: number | null
  onActivate: (index: number | null) => void
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

const ConstellationFigure = ({ figure, items, activeIndex, onActivate }: ConstellationFigureProps) => {
  const points = starPoints(figure, SIZE, PADDING)
  const lit = items.map((item) => item.completedAt !== null)

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
          return (
            <line
              key={`edge-${i}`}
              x1={points[a].x}
              y1={points[a].y}
              x2={points[b].x}
              y2={points[b].y}
              stroke={on ? 'var(--color-accent)' : 'var(--color-secondary)'}
              strokeWidth={on ? 3 : 2.5}
              strokeDasharray={on ? undefined : '10 14'}
              opacity={on ? 0.9 : 0.35}
            />
          )
        })}

        {points.map((point, i) => {
          const isLit = lit[i]
          const isActive = activeIndex === i
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
                <circle cx={point.x} cy={point.y} r={26} fill="var(--color-accent)" opacity={isActive ? 0.32 : 0.18} />
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r={isLit ? 11 : 9}
                fill={isLit ? 'var(--color-accent)' : 'none'}
                stroke={isLit ? 'none' : 'var(--color-secondary)'}
                strokeWidth={2.5}
                strokeDasharray={isLit ? undefined : '6 6'}
                opacity={isLit ? 1 : 0.55}
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
