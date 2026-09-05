'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ANIMATION_EASING } from '@/lib/animations'
import { starPoints, figureViewBox } from '@/lib/now-logic'
import type { Constellation, NowItem } from '@/types/now'

const SIZE = 1000
const PADDING = 70

// The tooltip's own max-width is a fixed pixel value (not a percentage of the wrapper)
// so `clamp()` below can guarantee containment using simple arithmetic: as long as the
// wrapper is wider than TOOLTIP_MAX_WIDTH (true for any realistic phone viewport once the
// page's own horizontal padding is subtracted), the whole tooltip box stays inside the
// wrapper's bounds for every star position, with nothing cut off.
const TOOLTIP_MAX_WIDTH = 200
const TOOLTIP_HALF_WIDTH = TOOLTIP_MAX_WIDTH / 2

export interface ConstellationFigureProps {
  figure: Constellation
  items: NowItem[]
  /**
   * The committed items, positionally aligned with `items`. Toggling needs these
   * rather than the merged ones: `useLocalCompletions.toggle` decides whether an
   * item is togglable at all by checking that its *committed* date is still null,
   * and records that value as the override's base. Handing it a merged item would
   * make every locally-lit star look permanently committed and unclickable.
   */
  committed: NowItem[]
  activeIndex: number | null
  onActivate: (index: number | null) => void
  /** Same handler the list rows use, so a star and its row do exactly one thing. */
  onToggle: (item: NowItem) => void
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

const ConstellationFigure = ({
  figure,
  items,
  committed,
  activeIndex,
  onActivate,
  onToggle,
  newlyLitIds,
}: ConstellationFigureProps) => {
  const points = starPoints(figure, SIZE, PADDING)
  // A wide or tall figure only fills a thin band of the fixed SIZE x SIZE square (the
  // catalog normalises every figure's longer axis to span the full unit box, so the
  // shorter axis can be a small fraction of it) — crop the viewBox to the figure's actual
  // footprint instead of always rendering the full square.
  const viewBox = figureViewBox(figure, SIZE, PADDING)
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
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
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
              initial={false}
              // `initial` only applies at mount, and this line is mounted from first
              // paint — a tick just changes props on an already-mounted element. A
              // constant animate.pathLength of 1 would never change value, so "drawing
              // in" has to be expressed as an in-place keyframe animation instead: the
              // target becomes the array [0, 1] only while `drawing` is true, which
              // framer-motion runs as a fresh tween on that value each time it appears.
              animate={{ pathLength: drawing ? [0, 1] : 1, opacity: on ? 0.9 : 0.35 }}
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
              aria-pressed={isLit}
              onPointerEnter={() => onActivate(i)}
              onFocus={() => onActivate(i)}
              onBlur={() => onActivate(null)}
              // Clicking a star does exactly what clicking its row does. The tooltip
              // is left to hover and focus, which already cover every way of reaching
              // a star — including a tap, since pointerenter fires on touch too.
              onClick={() => onToggle(committed[i])}
              // `role="button"` on a <g> is a claim, not a behaviour: SVG elements get
              // no free keyboard activation the way a real <button> does, so without
              // this the star is focusable and announced as a button but cannot be
              // operated from the keyboard at all.
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                onToggle(committed[i])
              }}
              className="cursor-pointer focus:outline-none"
            >
              {isLit && (
                // Hover/idle only — this value's target is always a plain number, on
                // purpose. If it ever also had to become the bloom's keyframe array
                // conditionally, a hover flipping `isActive` mid-bloom would flip the
                // *type* of the target (number <-> array) on the same motion value,
                // which skips framer-motion's array shallow-compare and replays the
                // bloom. Keeping this element's target type fixed avoids that.
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={26}
                  fill="var(--color-accent)"
                  initial={false}
                  animate={{ opacity: isActive ? 0.32 : 0.18 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.2 }}
                />
              )}
              {bloom && (
                // A separate element, mounted only while `bloom` is true (which already
                // folds in `!reduced`, so this never mounts under reduced motion). Its
                // target is *always* the same keyframe array for as long as it's
                // mounted — array-to-array on every re-render, so framer-motion's
                // shallow-compare recognises "unchanged" and re-renders (e.g. a hover
                // on a different star) leave it alone. It mounts once, when the figure
                // completes, plays once, and settles.
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={26}
                  fill="var(--color-accent)"
                  initial={{ opacity: 0.18 }}
                  animate={{ opacity: [0.18, 0.45, 0.18] }}
                  transition={{ duration: 0.9, delay: i * 0.05 }}
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
                initial={false}
                // Same reasoning as the edge line above: this circle is mounted from
                // first paint, so `initial` is dead on a tick, and a constant
                // animate.scale of 1 would never change value. The pop is the keyframe
                // array [0.4, 1], present only while `isNewStar` is true.
                animate={{ opacity: isLit ? 1 : 0.55, scale: isNewStar ? [0.4, 1] : 1 }}
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
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none px-3 py-2 rounded-lg text-xs whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
          style={{
            // Percentages are of the viewBox's own width/height, not the fixed SIZE
            // constant — the viewBox is cropped to the figure's footprint (see above), so
            // dividing by SIZE would misplace the tooltip for anything but a perfectly
            // square figure. Horizontally, `left` is clamped via CSS clamp() so the
            // tooltip's box (bounded by its fixed TOOLTIP_MAX_WIDTH) can never extend past
            // the wrapper's edges — this is what stops a star near the edge of a narrow
            // phone viewport from pushing the page into horizontal scroll. Clamping (rather
            // than `overflow-x: clip` on the wrapper) was chosen because clipping would
            // slice the already near-max-width tooltip text for an edge star instead of
            // just repositioning it, which would fail "remains fully readable".
            left: `clamp(${TOOLTIP_HALF_WIDTH}px, ${((points[activeIndex].x - viewBox.x) / viewBox.width) * 100}%, calc(100% - ${TOOLTIP_HALF_WIDTH}px))`,
            top: `${((points[activeIndex].y - viewBox.y) / viewBox.height) * 100 - 2}%`,
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
