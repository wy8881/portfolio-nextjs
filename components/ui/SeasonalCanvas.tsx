// components/ui/SeasonalCanvas.tsx
'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { createParticles, updateParticle, drawParticle, type Particle } from './particles'
import type { Season } from '@/lib/types'

const FADE_SECS = 0.6

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}
const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const getServerReducedMotion = () => false

export default function SeasonalCanvas() {
  return <Canvas />
}

function Canvas() {
  const { theme } = useTheme()
  const season = (theme as Season) ?? 'summer'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion)

  const stateRef = useRef<{
    season: Season
    particles: Particle[]
    rafId: number
    lastTime: number
  }>({
    season: season,
    particles: [],
    rafId: 0,
    lastTime: 0,
  })

  // Mount: set up canvas, RAF loop, ResizeObserver, visibility
  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const state = stateRef.current

    function resize() {
      const dpr = devicePixelRatio
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      // Respawn particles at new dimensions with fade-in
      state.particles.forEach(p => { p.alphaDir = -1 })
      const fresh = createParticles(state.season, canvas.width, canvas.height, dpr)
      fresh.forEach(p => { p.alpha = 0 })
      state.particles.push(...fresh)
    }

    function tick(timestamp: number) {
      const dpr = devicePixelRatio
      const dt = Math.min((timestamp - state.lastTime) / 1000, 0.05)
      state.lastTime = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      state.particles = state.particles.filter(p => {
        if (p.alphaDir === -1) {
          p.alpha = Math.max(0, p.alpha - dt / FADE_SECS)
          if (p.alpha <= 0) return false
        } else {
          p.alpha = Math.min(1, p.alpha + dt / FADE_SECS)
        }
        updateParticle(p, canvas.width, canvas.height, dpr)
        drawParticle(ctx, p, dpr)
        return true
      })

      state.rafId = requestAnimationFrame(tick)
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(state.rafId)
      } else {
        state.lastTime = performance.now()
        state.rafId = requestAnimationFrame(tick)
      }
    }

    const dpr = devicePixelRatio
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    state.particles = createParticles(state.season, canvas.width, canvas.height, dpr)
    state.particles.forEach(p => { p.alpha = 1 })

    state.lastTime = performance.now()
    state.rafId = requestAnimationFrame(tick)

    const ro = new ResizeObserver(resize)
    ro.observe(document.documentElement)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(state.rafId)
      ro.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [reducedMotion])

  // Season change: drop already-fading cohort, fade out active, spawn new
  useEffect(() => {
    const state = stateRef.current
    if (state.season === season) return
    state.season = season

    const canvas = canvasRef.current
    if (!canvas) return

    state.particles = state.particles.filter(p => p.alphaDir !== -1)
    state.particles.forEach(p => { p.alphaDir = -1 })

    const incoming = createParticles(season, canvas.width, canvas.height, devicePixelRatio)
    incoming.forEach(p => { p.alpha = 0 })
    state.particles.push(...incoming)
  }, [season])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}
