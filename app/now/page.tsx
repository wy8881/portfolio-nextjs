import type { Metadata } from 'next'
import { getNowData } from '@/lib/now'
import ActiveConstellation from '@/components/now/ActiveConstellation'
import NowStats from '@/components/now/NowStats'
import Heatmap from '@/components/now/Heatmap'
import CollectionWall from '@/components/now/CollectionWall'

export const metadata: Metadata = {
  title: 'Now - Yi Wang',
  description: 'What I am learning right now, tracked one star at a time.',
}

// The page depends on today's date for streaks and the heatmap, so it cannot be
// frozen at build time forever.
export const revalidate = 3600

export default function NowPage() {
  const { active, catalog, collected, counts, dates, today, stats } = getNowData()

  return (
    <div className="min-h-dvh pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-primary mb-4">Now</h1>
        <p className="text-secondary mb-16">
          What I&apos;m learning at the moment, one star at a time.
        </p>

        {active ? (
          <ActiveConstellation figure={catalog[active.slug]} goal={active} />
        ) : (
          <p className="text-secondary">Between constellations — the next one starts with npm run now:new.</p>
        )}

        <NowStats
          dates={dates}
          today={today}
          collected={stats.collected}
          total={stats.total}
          activeSlug={active?.slug ?? null}
          activeItems={active?.items ?? []}
        />

        <Heatmap
          counts={counts}
          today={today}
          activeSlug={active?.slug ?? null}
          activeItems={active?.items ?? []}
        />

        <CollectionWall catalog={catalog} collected={collected} activeSlug={active?.slug ?? null} />
      </div>
    </div>
  )
}
