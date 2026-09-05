'use client'

import { useCallback, useEffect, useRef, useSyncExternalStore, type RefObject } from 'react'
import confetti from 'canvas-confetti'
import { CONFETTI_EFFECTS, type ConfettiFire, type EffectCleanup } from '@/lib/confetti-effects'
import type { EffectName } from '@/types/hero'

/** Used before hydration and if a token ever resolves empty. Matches summer. */
const FALLBACK_COLORS = ['#166534', '#1C1917', '#78716C', '#C3C3B9']

const COLOR_TOKENS = ['--color-accent', '--color-primary', '--color-secondary', '--color-artifact']

function subscribeToDocSeason(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-season'],
  })
  return () => observer.disconnect()
}
const getDocSeason = () => document.documentElement.getAttribute('data-season') ?? 'summer'
const getServerSeason = () => 'summer'

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}
const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const getServerReducedMotion = () => false

/**
 * Binds confetti to a panel-local canvas so bursts stay inside the hero card,
 * tinted with whatever season is currently active.
 */
export function useSeasonConfetti(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const season = useSyncExternalStore(subscribeToDocSeason, getDocSeason, getServerSeason)
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  )

  const fireRef = useRef<ConfettiFire | null>(null)
  const cleanupRef = useRef<EffectCleanup | null>(null)
  const colorsRef = useRef<string[]>(FALLBACK_COLORS)

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const instance = confetti.create(canvas, {
      resize: true,
      useWorker: false,
      disableForReducedMotion: true,
    })
    fireRef.current = instance

    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
      instance.reset()
      fireRef.current = null
    }
  }, [canvasRef, reducedMotion])

  // Re-read the palette whenever the season toggle flips data-season.
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    const colors = COLOR_TOKENS.map(token => styles.getPropertyValue(token).trim()).filter(Boolean)
    colorsRef.current = colors.length > 0 ? colors : FALLBACK_COLORS
  }, [season])

  const fire = useCallback(
    (effect: EffectName) => {
      const instance = fireRef.current
      if (reducedMotion || !instance) return

      // Cancel the previous effect's timers so repeat presses restart rather
      // than stack, but leave particles already in flight to finish.
      cleanupRef.current?.()
      cleanupRef.current = CONFETTI_EFFECTS[effect](instance, colorsRef.current)
    },
    [reducedMotion],
  )

  return { fire, reducedMotion }
}
