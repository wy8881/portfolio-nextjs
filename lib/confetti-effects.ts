import confetti from 'canvas-confetti'
import type { EffectName } from '@/types/hero'

export type ConfettiFire = confetti.CreateTypes

/** Stops an in-flight effect. Single-shot effects return a no-op. */
export type EffectCleanup = () => void

type Effect = (fire: ConfettiFire, colors: string[]) => EffectCleanup

const NO_CLEANUP: EffectCleanup = () => {}

const randomInRange = (min: number, max: number) => Math.random() * (min - max) + max

/**
 * Drawn as a path rather than an emoji so the season palette applies —
 * a green heart would fight the winter theme.
 */
const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

let heartShape: confetti.Shape | null = null
function getHeartShape(): confetti.Shape {
  heartShape ??= confetti.shapeFromPath({ path: HEART_PATH })
  return heartShape
}

/** A spark of insight: three quick gold-tinted pops that hang, then fade. */
const stars: Effect = (fire, colors) => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors,
  }

  const shoot = () => {
    fire({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ['star'] })
    fire({ ...defaults, particleCount: 10, scalar: 0.75, shapes: ['circle'] })
  }

  const timers = [0, 100, 200].map(delay => window.setTimeout(shoot, delay))
  return () => timers.forEach(window.clearTimeout)
}

/** Soft and slow — low gravity so the hearts drift rather than drop. */
const hearts: Effect = (fire, colors) => {
  fire({
    particleCount: 45,
    spread: 70,
    startVelocity: 32,
    gravity: 0.55,
    decay: 0.94,
    ticks: 220,
    scalar: 1.6,
    shapes: [getHeartShape()],
    colors,
  })
  return NO_CLEANUP
}

/** The classic layered burst: five overlapping shots of varying weight. */
const realistic: Effect = (fire, colors) => {
  const count = 200
  const shoot = (particleRatio: number, opts: confetti.Options) => {
    fire({
      origin: { y: 0.7 },
      colors,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  shoot(0.25, { spread: 26, startVelocity: 55 })
  shoot(0.2, { spread: 60 })
  shoot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  shoot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  shoot(0.1, { spread: 120, startVelocity: 45 })

  return NO_CLEANUP
}

/** Two edge cannons firing at each other — the room cheering for you. */
const schoolPride: Effect = (fire, colors) => {
  const end = Date.now() + 1200
  let rafId = 0
  let cancelled = false

  const frame = () => {
    if (cancelled) return
    fire({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
    fire({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) rafId = requestAnimationFrame(frame)
  }
  frame()

  return () => {
    cancelled = true
    cancelAnimationFrame(rafId)
  }
}

/** Everything, all at once: random bursts across the panel for three seconds. */
const fireworks: Effect = (fire, colors) => {
  const end = Date.now() + 3000
  const defaults = { startVelocity: 28, spread: 360, ticks: 60, particleCount: 45, colors }

  const interval = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(interval)
      return
    }
    fire({ ...defaults, origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.2 } })
    fire({ ...defaults, origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.2 } })
  }, 250)

  return () => window.clearInterval(interval)
}

export const CONFETTI_EFFECTS: Record<EffectName, Effect> = {
  stars,
  hearts,
  realistic,
  schoolPride,
  fireworks,
}
