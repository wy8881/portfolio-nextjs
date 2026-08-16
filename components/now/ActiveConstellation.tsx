'use client'

import { useState } from 'react'
import ConstellationFigure from '@/components/now/ConstellationFigure'
import ItemList from '@/components/now/ItemList'
import { useLocalCompletions } from '@/lib/hooks/useLocalCompletions'
import { resolveItems } from '@/lib/now-logic'
import type { Constellation, Goal } from '@/types/now'

export interface ActiveConstellationProps {
  figure: Constellation
  goal: Goal
}

const ActiveConstellation = ({ figure, goal }: ActiveConstellationProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { overrides, toggle } = useLocalCompletions(goal.slug)
  const items = resolveItems(goal.items, overrides)
  const litCount = items.filter((item) => item.completedAt !== null).length

  return (
    <section aria-label={`${figure.name} progress`}>
      <ConstellationFigure figure={figure} items={items} activeIndex={activeIndex} onActivate={setActiveIndex} />

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
        onToggle={toggle}
      />

      <p className="text-xs text-secondary mt-6">
        Ticks are saved in this browser only — the published page shows what has been committed.
      </p>
    </section>
  )
}

export default ActiveConstellation
