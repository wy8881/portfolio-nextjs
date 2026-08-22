'use client'

import { useMergedDates } from '@/lib/hooks/useMergedDates'
import { computeStreaks, monthCount } from '@/lib/now-logic'
import type { NowItem } from '@/types/now'

export interface NowStatsProps {
  dates: string[]
  today: string
  collected: number
  total: number
  activeSlug: string | null
  activeItems: NowItem[]
}

const NowStats = ({ dates, today, collected, total, activeSlug, activeItems }: NowStatsProps) => {
  const { localDates, effectiveToday } = useMergedDates(activeSlug, activeItems, today)

  const all = [...dates, ...localDates]
  const streaks = computeStreaks(all, effectiveToday)

  const stats = [
    { label: 'Day streak', value: streaks.current },
    { label: 'Longest', value: streaks.longest },
    { label: 'This month', value: monthCount(all, effectiveToday) },
    { label: 'Collected', value: `${collected} / ${total}` },
  ]

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="text-xs uppercase tracking-wide text-secondary">{stat.label}</dt>
          <dd className="text-2xl font-semibold text-primary">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default NowStats
