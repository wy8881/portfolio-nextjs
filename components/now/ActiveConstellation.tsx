'use client'

import { useState } from 'react'
import ConstellationFigure from '@/components/now/ConstellationFigure'
import ItemList from '@/components/now/ItemList'
import { useLocalCompletions } from '@/lib/hooks/useLocalCompletions'
import { resolveItems } from '@/lib/now-logic'
import type { Constellation, Goal, NowItem } from '@/types/now'

export interface ActiveConstellationProps {
  figure: Constellation
  goal: Goal
}

const ActiveConstellation = ({ figure, goal }: ActiveConstellationProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  // Ids ticked lit during this page load, kept only for `ConstellationFigure`'s
  // animations. Starts empty every time — including on a reload that restores
  // stored ticks from `overrides` below — so it's the one thing that can say
  // "this happened in this session" with certainty, without depending on which
  // render React happens to settle hydration on.
  const [tickedThisSession, setTickedThisSession] = useState<Set<string>>(() => new Set())
  const { overrides, toggle } = useLocalCompletions(goal.slug)
  const items = resolveItems(goal.items, overrides)
  const litCount = items.filter((item) => item.completedAt !== null).length

  const handleToggle = (item: NowItem) => {
    // Mirror useLocalCompletions.toggle's own guard: a committed item is a no-op
    // there, so it must be a no-op here too, or a click on an already-finished,
    // non-togglable item would wrongly mark it "new".
    if (item.completedAt !== null) return
    setTickedThisSession((prev) => {
      const next = new Set(prev)
      if (overrides[item.id]) {
        // Currently lit via a local override — this toggle is about to unlight it.
        next.delete(item.id)
      } else {
        // Currently unlit — this toggle is about to light it.
        next.add(item.id)
      }
      return next
    })
    toggle(item)
  }

  return (
    <section aria-label={`${figure.name} progress`}>
      <ConstellationFigure
        figure={figure}
        items={items}
        committed={goal.items}
        activeIndex={activeIndex}
        onActivate={setActiveIndex}
        onToggle={handleToggle}
        newlyLitIds={tickedThisSession}
      />

      <div className="flex items-baseline justify-between mt-6">
        <h2 className="text-xl font-semibold text-primary">{figure.name}</h2>
        <p className="text-sm text-secondary">
          {litCount} / {items.length} stars
        </p>
      </div>

      <ItemList
        items={items}
        committed={goal.items}
        activeIndex={activeIndex}
        onActivate={setActiveIndex}
        onToggle={handleToggle}
      />

      <p className="text-xs text-secondary mt-6">
        Ticks are saved in this browser only — the published page shows what has been committed.
      </p>
    </section>
  )
}

export default ActiveConstellation
