'use client'

import ConstellationFigure from '@/components/now/ConstellationFigure'
import type { Constellation, NowItem } from '@/types/now'

/**
 * `app/now/page.tsx` is a Server Component (it reads goal files from disk via
 * `getNowData`). Next.js refuses to pass function props — even an inert no-op —
 * from a Server Component into a Client Component instance: "Event handlers
 * cannot be passed to Client Component props." This wrapper reproduces the same
 * stub values `app/now/page.tsx` specifies (`activeIndex={null}`, a no-op
 * `onActivate`) but defines them on the client side of that boundary, so the
 * Server Component only ever passes serialisable data (`figure`, `items`) down.
 * Task 10 replaces this wrapper with `<ActiveConstellation />`, which owns real
 * hover/focus/tap state plus local-completion overrides.
 */
export interface ConstellationFigureClientProps {
  figure: Constellation
  items: NowItem[]
}

const ConstellationFigureClient = ({ figure, items }: ConstellationFigureClientProps) => (
  <ConstellationFigure figure={figure} items={items} activeIndex={null} onActivate={() => {}} />
)

export default ConstellationFigureClient
