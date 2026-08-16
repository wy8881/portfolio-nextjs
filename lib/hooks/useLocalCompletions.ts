'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { NowItem, Overrides } from '@/types/now'

const EMPTY: Overrides = Object.freeze({})
const listeners = new Set<() => void>()

// getSnapshot must return a stable reference or React re-renders forever, so the
// parsed value is cached and only reparsed when the raw string actually changes.
const cache = new Map<string, { raw: string | null; parsed: Overrides }>()

const storageKey = (slug: string) => `now:${slug}`

function emit() {
  for (const listener of listeners) listener()
}

function read(slug: string | null): Overrides {
  if (!slug || typeof window === 'undefined') return EMPTY
  const raw = window.localStorage.getItem(storageKey(slug))
  const cached = cache.get(slug)
  if (cached && cached.raw === raw) return cached.parsed

  let parsed: Overrides = EMPTY
  if (raw) {
    try {
      parsed = JSON.parse(raw) as Overrides
    } catch {
      parsed = EMPTY
    }
  }
  cache.set(slug, { raw, parsed })
  return parsed
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

/** Today in the author's timezone, so a late-night tick lands on the right day. */
export function localToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Adelaide' }).format(new Date())
}

export function useLocalCompletions(slug: string | null) {
  const overrides = useSyncExternalStore(
    subscribe,
    () => read(slug),
    () => EMPTY // server render is exactly the committed state, so hydration matches
  )

  const toggle = useCallback(
    (item: NowItem) => {
      if (!slug) return
      const current = read(slug)
      const next = { ...current }
      if (next[item.id]) {
        delete next[item.id]
      } else {
        next[item.id] = { completedAt: localToday(), base: item.completedAt }
      }
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
      cache.delete(slug)
      emit()
    },
    [slug]
  )

  return { overrides, toggle }
}
