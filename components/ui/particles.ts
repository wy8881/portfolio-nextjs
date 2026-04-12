// components/ui/particles.ts
import type { Season } from '@/lib/types'

export type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  rotSpeed: number
  size: number        // radius in physical px (pre-multiplied by DPR)
  opacity: number
  wobble: number
  wobbleSpeed: number
  alpha: number       // cross-fade: 0→1 fade-in, 1→0 fade-out
  alphaDir: 1 | -1   // +1 fading in, -1 fading out
  color: string
  season: Season
  // Firefly-specific fields (ignored by spring/autumn/winter)
  phase: number
  blinkSpeed: number
  hue: number
  glowR: number
}

const SPRING_COLORS = ['#fda4af', '#f9a8d4', '#fbcfe8', '#fce7f3', '#f472b6'] as const
const AUTUMN_COLORS = ['#f97316', '#fb923c', '#dc2626', '#b45309', '#d97706', '#ea580c'] as const
const WINTER_COLORS = ['#bfdbfe', '#93c5fd', '#dbeafe'] as const

const COUNTS: Record<Season, number> = {
  spring: 36,
  summer: 36,
  autumn: 40,
  winter: 42,
}

const SIZES: Record<Season, [number, number]> = {
  spring: [4, 8],
  summer: [2, 4],
  autumn: [5, 11],
  winter: [4, 11],
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randItem<T>(arr: readonly [T, ...T[]]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeParticle(season: Season, W: number, H: number, dpr: number): Particle {
  const [sMin, sMax] = SIZES[season]
  const hue = rand(135, 155)

  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: rand(-0.3, 0.3) * dpr,
    vy: season === 'summer'
      ? -rand(0.2, 0.55) * dpr   // float upward
      : rand(0.35, 1.1) * dpr,   // fall downward
    rot: Math.random() * Math.PI * 2,
    rotSpeed: rand(-0.04, 0.04),
    size: rand(sMin, sMax) * dpr,
    opacity: rand(0.55, 1.0),
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: rand(0.015, 0.035),
    alpha: 0,
    alphaDir: 1,
    color: season === 'spring'
      ? randItem(SPRING_COLORS)
      : season === 'autumn'
        ? randItem(AUTUMN_COLORS)
        : season === 'winter'
          ? randItem(WINTER_COLORS)
          : `hsl(${hue},88%,26%)`,
    season,
    phase: Math.random() * Math.PI * 2,
    blinkSpeed: rand(0.03, 0.06),
    hue,
    glowR: rand(18, 32) * dpr,
  }
}

export function createParticles(season: Season, W: number, H: number, dpr: number): Particle[] {
  const mobile = W / dpr < 768
  const count = mobile ? Math.floor(COUNTS[season] / 2) : COUNTS[season]
  return Array.from({ length: count }, () => makeParticle(season, W, H, dpr))
}

/**
 * Advances physics for one frame. Does NOT mutate `alpha` or `alphaDir` —
 * those are driven by the caller (SeasonalCanvas) to control cross-fade timing.
 */
export function updateParticle(p: Particle, W: number, H: number, dpr: number): void {
  p.wobble += p.wobbleSpeed

  if (p.season === 'summer') {
    p.phase += p.blinkSpeed
    p.x += p.vx + Math.sin(p.wobble * 0.6) * 0.4 * dpr
    p.y += p.vy
    if (p.y < -p.size * 2) { p.y = H + p.size; p.x = Math.random() * W }
  } else {
    const swingAmp = p.season === 'autumn' ? 1.4 : 0.6
    p.x += p.vx + Math.sin(p.wobble) * swingAmp * dpr
    p.y += p.vy
    p.rot += p.rotSpeed
    if (p.y > H + p.size * 2) { p.y = -p.size * 2; p.x = Math.random() * W }
  }

  if (p.x > W + p.size * 2) p.x = -p.size * 2
  if (p.x < -p.size * 2) p.x = W + p.size * 2
}

export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, dpr: number): void {
  ctx.save()
  switch (p.season) {
    case 'spring': drawSakura(ctx, p); break
    case 'summer': drawFirefly(ctx, p); break
    case 'autumn': drawLeaf(ctx, p, dpr); break
    case 'winter': drawSnowflake(ctx, p, dpr); break
  }
  ctx.restore()
}

function drawSakura(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  ctx.globalAlpha = p.opacity * p.alpha
  for (let i = 0; i < 5; i++) {
    ctx.save()
    ctx.rotate((i / 5) * Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.3, -p.size * 0.45, -p.size * 0.95, 0, -p.size)
    ctx.bezierCurveTo( p.size * 0.45, -p.size * 0.95,  p.size * 0.5, -p.size * 0.3, 0, 0)
    ctx.fill()
    ctx.restore()
  }
  ctx.fillStyle = '#fbbf24'
  ctx.globalAlpha = p.opacity * p.alpha * 0.9
  ctx.beginPath()
  ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2)
  ctx.fill()
}

function drawFirefly(ctx: CanvasRenderingContext2D, p: Particle): void {
  // Fireflies use absolute canvas coords (p.x, p.y) rather than translate/rotate
  // because the radial gradient origin must be in canvas space, not local space.
  const blink = Math.max(0, Math.sin(p.phase))
  const a = p.alpha * (0.08 + 0.92 * blink)

  const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowR)
  glow.addColorStop(0,   `hsla(${p.hue},88%,26%,${a * 0.75})`)
  glow.addColorStop(0.4, `hsla(${p.hue},85%,30%,${a * 0.3})`)
  glow.addColorStop(1,   `hsla(${p.hue},80%,35%,0)`)
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.glowR, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalAlpha = p.alpha * (0.25 + 0.75 * blink)
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
  ctx.fill()
}

function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle, dpr: number): void {
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  ctx.globalAlpha = p.opacity * p.alpha
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.moveTo(0,  p.size)
  ctx.bezierCurveTo( p.size * 0.6,  p.size * 0.6,  p.size * 0.7, -p.size * 0.2, 0, -p.size)
  ctx.bezierCurveTo(-p.size * 0.7, -p.size * 0.2, -p.size * 0.6,  p.size * 0.6, 0,  p.size)
  ctx.fill()
  ctx.globalAlpha = p.opacity * p.alpha * 0.25
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = dpr
  ctx.beginPath()
  ctx.moveTo(0,  p.size * 0.8)
  ctx.lineTo(0, -p.size * 0.8)
  ctx.stroke()
}

function drawSnowflake(ctx: CanvasRenderingContext2D, p: Particle, dpr: number): void {
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  ctx.globalAlpha = p.opacity * p.alpha
  ctx.strokeStyle = p.color
  ctx.lineWidth = dpr
  ctx.lineCap = 'round'
  for (let i = 0; i < 6; i++) {
    ctx.save()
    ctx.rotate((i * Math.PI) / 3)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -p.size)
    ctx.moveTo(0, -p.size * 0.35)
    ctx.lineTo( p.size * 0.2,  -p.size * 0.55)
    ctx.moveTo(0, -p.size * 0.35)
    ctx.lineTo(-p.size * 0.2,  -p.size * 0.55)
    ctx.moveTo(0, -p.size * 0.6)
    ctx.lineTo( p.size * 0.15, -p.size * 0.75)
    ctx.moveTo(0, -p.size * 0.6)
    ctx.lineTo(-p.size * 0.15, -p.size * 0.75)
    ctx.stroke()
    ctx.restore()
  }
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.arc(0, 0, p.size * 0.12, 0, Math.PI * 2)
  ctx.fill()
}
