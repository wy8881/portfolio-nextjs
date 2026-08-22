'use client'

import { useLocalCompletions } from '@/lib/hooks/useLocalCompletions'
import { resolveItems } from '@/lib/now-logic'
import type { NowItem } from '@/types/now'

export interface MergedDates {
  /** Dates from local-only ticks on the active goal — resolved but not yet committed. */
  localDates: string[]
  /**
   * `today`, clamped forward past any local date.
   *
   * `today` is baked into the page at ISR generation (`revalidate = 3600`), while a local
   * tick's date is computed client-side, on this device, at the moment it's made. Between
   * midnight in the site's timezone and the next regeneration — up to an hour, every night
   * — the server-rendered `today` is still yesterday while a fresh tick already carries
   * today's date. Treating that tick's date as "in the future" would drop it from the
   * heatmap entirely and read the streak as broken on the very day it was extended.
   *
   * On the server there are no local dates, so `localDates` is empty and this reduces to
   * `today` unchanged — the clamp is a no-op and server/client markup always matches.
   */
  effectiveToday: string
}

/**
 * Shared by `Heatmap` and `NowStats`, both of which need to merge the active goal's
 * uncommitted local overrides over committed data and derive a clamped "today" from the
 * result — logic that used to be reimplemented slightly differently in each component.
 */
export function useMergedDates(activeSlug: string | null, activeItems: NowItem[], today: string): MergedDates {
  const { overrides } = useLocalCompletions(activeSlug)

  const localDates = resolveItems(activeItems, overrides)
    .filter((item, i) => item.completedAt !== null && activeItems[i].completedAt === null)
    .map((item) => item.completedAt as string)

  const effectiveToday = localDates.reduce((max, d) => (d > max ? d : max), today)

  return { localDates, effectiveToday }
}
