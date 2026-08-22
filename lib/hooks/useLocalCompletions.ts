'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { DATE, SITE_TIMEZONE } from '@/lib/now-logic'
import type { NowItem, Override, Overrides } from '@/types/now'

const EMPTY: Overrides = Object.freeze({})
const listeners = new Set<() => void>()

// getSnapshot must return a stable reference or React re-renders forever, so the
// parsed value is cached and only reparsed when the raw string actually changes.
const cache = new Map<string, { raw: string | null; parsed: Overrides }>()

const storageKey = (slug: string) => `now:${slug}`

function emit() {
  for (const listener of listeners) listener()
}

// Confirms one stored entry actually has the shape `resolveItems` expects — a raw string
// that fails `formatDate`'s `.split('-')` assumption (or a non-date `base`) would crash
// downstream rendering rather than just being ignored, so entries that don't match are
// dropped individually instead of discarding the whole container.
function isValidOverride(value: unknown): value is Override {
  if (typeof value !== 'object' || value === null) return false
  const { completedAt, base } = value as Record<string, unknown>
  if (typeof completedAt !== 'string' || !DATE.test(completedAt)) return false
  if (base !== null && (typeof base !== 'string' || !DATE.test(base))) return false
  return true
}

function read(slug: string | null): Overrides {
  if (!slug || typeof window === 'undefined') return EMPTY
  const raw = window.localStorage.getItem(storageKey(slug))
  const cached = cache.get(slug)
  if (cached && cached.raw === raw) return cached.parsed

  let parsed: Overrides = EMPTY
  if (raw) {
    try {
      const candidate: unknown = JSON.parse(raw)
      // JSON.parse succeeds on "null", "42", "[...]", etc. without throwing, so the
      // parsed value must be confirmed to be a genuine object before it is trusted
      // as Overrides — otherwise a corrupt key can crash resolveItems downstream.
      if (candidate !== null && typeof candidate === 'object' && !Array.isArray(candidate)) {
        const valid: Overrides = {}
        for (const [id, entry] of Object.entries(candidate as Record<string, unknown>)) {
          if (isValidOverride(entry)) valid[id] = entry
        }
        parsed = valid
      }
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
  return new Intl.DateTimeFormat('en-CA', { timeZone: SITE_TIMEZONE }).format(new Date())
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
      // An already-committed item has no override resolveItems will ever apply
      // (it short-circuits on a non-null committed completedAt) — writing one
      // anyway would just be permanent junk in localStorage.
      if (item.completedAt !== null) return
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
