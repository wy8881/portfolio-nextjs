// components/ui/SeasonalCanvas.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { createParticles, updateParticle, drawParticle, type Particle } from './particles'
import type { Season } from '@/lib/types'

const FADE_SECS = 0.6

export default function SeasonalCanvas() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null
  }
  return <Canvas />
}

function Canvas() {
  const { theme } = useTheme()
  const season = (theme as Season) ?? 'summer'
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stateRef = useRef<{
    season: Season
    particles: Particle[]
    rafId: number
    lastTime: number
  }>({
    season: 'summer',
    particles: [],
    rafId: 0,
    lastTime: 0,
  })

  // Mount: canvas setup, RAF loop, ResizeObserver, visibility listener
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const state = stateRef.current

    function resize() {
      const dpr = devicePixelRatio
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
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

    resize()
    state.particles = createParticles(state.season, canvas.width, canvas.height, devicePixelRatio)
    state.particles.forEach(p => { p.alpha = 1 })

    state.lastTime = performance.now()
    state.rafId = requestAnimationFrame(tick)

    const ro = new ResizeObserver(resize)
    ro.observe(document.body)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(state.rafId)
      ro.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  // Season change: fade out old particles, spawn new ones
  useEffect(() => {
    const state = stateRef.current
    if (state.season === season) return
    state.season = season

    const canvas = canvasRef.current!
    state.particles.forEach(p => { p.alphaDir = -1 })

    const incoming = createParticles(season, canvas.width, canvas.height, devicePixelRatio)
    // alpha starts at 0, fades in via RAF loop
    state.particles.push(...incoming)
  }, [season])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
