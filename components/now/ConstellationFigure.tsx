'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useSyncExternalStore } from 'react'
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

// `useLocalCompletions` (owned by the parent) reads localStorage through its own
// useSyncExternalStore, whose getServerSnapshot is EMPTY so hydration matches the
// server HTML. That means *this* component's very first render — even though it
// already runs on the client — reflects the committed-only state, not yet the
// restored ticks; React corrects it with a second render immediately after.
// This hook gives that boundary a name: it mirrors the same getServerSnapshot=false
// / getSnapshot=true idiom SeasonalCanvas already uses for reduced motion, so
// `isHydrated` flips to true starting on that same corrective render — never
// before. Seeding the "seen" ref only once `isHydrated` is true (see below) skips
// the stale first render, so restored ticks never get mistaken for a fresh one.
const subscribeHydrated = () => () => {}
const getHydrated = () => true
const getServerHydrated = () => false

const ConstellationFigure = ({ figure, items, activeIndex, onActivate }: ConstellationFigureProps) => {
  const points = starPoints(figure, SIZE, PADDING)
  const lit = items.map((item) => item.completedAt !== null)

  const reduced = useReducedMotion()
  const isHydrated = useSyncExternalStore(subscribeHydrated, getHydrated, getServerHydrated)

  // react-hooks/refs (a React Compiler diagnostic surfaced through eslint-plugin-react-hooks)
  // flags reading a ref's value during render, because a compiled/memoized component could
  // skip re-rendering and miss the read. This project doesn't run the compiler (no
  // babel-plugin-react-compiler, no experimental.reactCompiler), and reading a ref during
  // render to diff against the previous commit is exactly the "usePrevious" pattern this
  // task calls for — deferring the read to an effect would arrive one render too late to
  // decide *this* render's animation props. Disabled deliberately, not overlooked.
  /* eslint-disable react-hooks/refs */
  const seen = useRef<boolean[] | null>(null)
  // Seeded only once hydration has settled (see `isHydrated` above), which already
  // includes any stored local ticks, so a reload renders the existing figure at
  // rest and only ticks made in this session animate.
  const previouslyLit = seen.current
  useEffect(() => {
    if (isHydrated) seen.current = lit
  })

  const isNew = (i: number) => previouslyLit !== null && !previouslyLit[i] && lit[i]
  const complete = lit.every(Boolean)
  // Gate the bloom on completion becoming true *this* session, not merely being
  // true — otherwise reloading an already-finished figure would replay it forever.
  const justCompleted = complete && previouslyLit !== null && !previouslyLit.every(Boolean)

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
              transition={drawing ? { duration: 0.3, ease: ANIMATION_EASING.standard } : undefined}
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
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={26}
                  fill="var(--color-accent)"
                  initial={false}
                  animate={{
                    opacity: isActive ? 0.32 : justCompleted && !reduced ? [0.18, 0.45, 0.18] : 0.18,
                  }}
                  transition={justCompleted && !reduced ? { duration: 0.9, delay: i * 0.05 } : { duration: 0.2 }}
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
                initial={isNew(i) && !reduced ? { opacity: 0, scale: 0.4 } : false}
                animate={{ opacity: isLit ? 1 : 0.55, scale: 1 }}
                transition={isNew(i) && !reduced ? { duration: 0.3, ease: ANIMATION_EASING.standard } : undefined}
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
