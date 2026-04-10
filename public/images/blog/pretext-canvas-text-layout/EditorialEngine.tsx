'use client'

import { useEffect, useRef } from 'react'
import { layoutNextLine, layoutWithLines, prepareWithSegments, walkLineRanges } from '@chenglou/pretext'
import type { LayoutCursor, PreparedTextWithSegments } from '@chenglou/pretext'

// ─── constants ───────────────────────────────────────────────────────────────

const BODY_FONT = '18px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const BODY_LINE_HEIGHT = 30
const HEADLINE_FONT_FAMILY = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const HEADLINE_TEXT = 'THE FUTURE OF TEXT LAYOUT IS NOT CSS'
const GUTTER = 48
const COL_GAP = 40
const BOTTOM_GAP = 20
const DROP_CAP_LINES = 3
const MIN_SLOT_WIDTH = 50
const NARROW_BREAKPOINT = 760
const NARROW_GUTTER = 20
const NARROW_COL_GAP = 20
const NARROW_BOTTOM_GAP = 16
const NARROW_ORB_SCALE = 0.58
const NARROW_ACTIVE_ORBS = 3

// ─── types ───────────────────────────────────────────────────────────────────

type Interval = { left: number; right: number }
type PositionedLine = { x: number; y: number; width: number; text: string }
type CircleObstacle = { cx: number; cy: number; r: number; hPad: number; vPad: number }
type RectObstacle = { x: number; y: number; w: number; h: number }
type OrbColor = [number, number, number]
type OrbDefinition = { fx: number; fy: number; r: number; vx: number; vy: number; color: OrbColor }
type re = { x: number; y: number; r: number; vx: number; vy: number; paused: boolean }
type DragState = { orbIndex: number; startPointerX: number; startPointerY: number; startOrbX: number; startOrbY: number }

// ─── orb definitions ─────────────────────────────────────────────────────────

const ORB_DEFS: OrbDefinition[] = [
  { fx: 0.52, fy: 0.22, r: 110, vx: 0, vy: 0, color: [0, 0, 0] },
]

// ─── pure helpers ────────────────────────────────────────────────────────────

function carveTextLineSlots(base: Interval, blocked: Interval[]): Interval[] {
  let slots = [base]
  for (const interval of blocked) {
    const next: Interval[] = []
    for (const slot of slots) {
      if (interval.right <= slot.left || interval.left >= slot.right) { next.push(slot); continue }
      if (interval.left > slot.left) next.push({ left: slot.left, right: interval.left })
      if (interval.right < slot.right) next.push({ left: interval.right, right: slot.right })
    }
    slots = next
  }
  return slots.filter(s => s.right - s.left >= MIN_SLOT_WIDTH)
}

function circleIntervalForBand(
  cx: number, cy: number, r: number,
  bandTop: number, bandBottom: number,
  hPad: number, vPad: number,
): Interval | null {
  const top = bandTop - vPad
  const bottom = bandBottom + vPad
  if (top >= cy + r || bottom <= cy - r) return null
  const minDy = cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom
  if (minDy >= r) return null
  const maxDx = Math.sqrt(r * r - minDy * minDy)
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad }
}

function layoutColumn(
  prepared: PreparedTextWithSegments,
  startCursor: LayoutCursor,
  regionX: number, regionY: number, regionW: number, regionH: number,
  lineHeight: number,
  circleObstacles: CircleObstacle[],
  rectObstacles: RectObstacle[],
  singleSlotOnly = false,
): { lines: PositionedLine[]; cursor: LayoutCursor } {
  let cursor = startCursor
  let lineTop = regionY
  const lines: PositionedLine[] = []
  let textExhausted = false

  while (lineTop + lineHeight <= regionY + regionH && !textExhausted) {
    const bandTop = lineTop
    const bandBottom = lineTop + lineHeight
    const blocked: Interval[] = []

    for (const o of circleObstacles) {
      const interval = circleIntervalForBand(o.cx, o.cy, o.r, bandTop, bandBottom, o.hPad, o.vPad)
      if (interval !== null) blocked.push(interval)
    }
    for (const rect of rectObstacles) {
      if (bandBottom <= rect.y || bandTop >= rect.y + rect.h) continue
      blocked.push({ left: rect.x, right: rect.x + rect.w })
    }

    const slots = carveTextLineSlots({ left: regionX, right: regionX + regionW }, blocked)
    if (slots.length === 0) { lineTop += lineHeight; continue }

    const orderedSlots = singleSlotOnly
      ? [slots.reduce((best, slot) => (slot.right - slot.left > best.right - best.left ? slot : best))]
      : [...slots].sort((a, b) => a.left - b.left)

    for (const slot of orderedSlots) {
      const line = layoutNextLine(prepared, cursor, slot.right - slot.left)
      if (line === null) { textExhausted = true; break }
      lines.push({ x: Math.round(slot.left), y: Math.round(lineTop), text: line.text, width: line.width })
      cursor = line.end
    }

    lineTop += lineHeight
  }

  return { lines, cursor }
}

function hitTestOrbs(orbs: Orb[], px: number, py: number, activeCount: number, radiusScale: number): number {
  for (let i = activeCount - 1; i >= 0; i--) {
    const orb = orbs[i]!
    const r = orb.r * radiusScale
    const dx = px - orb.x
    const dy = py - orb.y
    if (dx * dx + dy * dy <= r * r) return i
  }
  return -1
}

// ─── component ───────────────────────────────────────────────────────────────

export default function EditorialEngine({ bodyText }: { bodyText: string }) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    // ── prepare text ──
    const preparedBody = prepareWithSegments(bodyText, BODY_FONT)

    const DROP_CAP_SIZE = BODY_LINE_HEIGHT * DROP_CAP_LINES - 4
    const DROP_CAP_FONT = `700 ${DROP_CAP_SIZE}px ${HEADLINE_FONT_FAMILY}`
    const DROP_CAP_TEXT = bodyText[0]!
    const preparedDropCap = prepareWithSegments(DROP_CAP_TEXT, DROP_CAP_FONT)
    let dropCapWidth = 0
    walkLineRanges(preparedDropCap, 9999, line => { dropCapWidth = line.width })
    const DROP_CAP_TOTAL_W = Math.ceil(dropCapWidth) + 10

    // ── DOM setup ──
    const dropCapEl = document.createElement('div')
    dropCapEl.className = 'drop-cap'
    dropCapEl.textContent = DROP_CAP_TEXT
    dropCapEl.style.cssText = `position:absolute;font:${DROP_CAP_FONT};line-height:${DROP_CAP_SIZE}px`
    stage.appendChild(dropCapEl)

    const dragonEl = document.createElement('img')
    dragonEl.src = '/dragon.svg'
    dragonEl.style.cssText = 'position:absolute;pointer-events:none'
    stage.appendChild(dragonEl)
    const orbEls = [dragonEl]

    const linePool: HTMLSpanElement[] = []
    const headlinePool: HTMLSpanElement[] = []

    function syncPool<T extends HTMLElement>(pool: T[], count: number, create: () => T): void {
      while (pool.length < count) { const el = create(); stage.appendChild(el); pool.push(el) }
      for (let i = 0; i < pool.length; i++) pool[i]!.style.display = i < count ? '' : 'none'
    }

    // ── headline fit cache ──
    let cachedHeadlineWidth = -1, cachedHeadlineMaxSize = -1, cachedHeadlineFontSize = 24
    let cachedHeadlineLines: PositionedLine[] = []

    function fitHeadline(maxWidth: number, maxSize: number): { fontSize: number; lines: PositionedLine[] } {
      if (maxWidth === cachedHeadlineWidth && maxSize === cachedHeadlineMaxSize) {
        return { fontSize: cachedHeadlineFontSize, lines: cachedHeadlineLines }
      }
      cachedHeadlineWidth = maxWidth
      cachedHeadlineMaxSize = maxSize
      let lo = 20, hi = maxSize, best = lo
      let bestLines: PositionedLine[] = []
      while (lo <= hi) {
        const size = Math.floor((lo + hi) / 2)
        const font = `700 ${size}px ${HEADLINE_FONT_FAMILY}`
        const lineHeight = Math.round(size * 0.93)
        const prepared = prepareWithSegments(HEADLINE_TEXT, font)
        let breaksWord = false
        walkLineRanges(prepared, maxWidth, line => { if (line.end.graphemeIndex !== 0) breaksWord = true })
        if (!breaksWord) {
          best = size
          const result = layoutWithLines(prepared, maxWidth, lineHeight)
          bestLines = result.lines.map((line, i) => ({ x: 0, y: i * lineHeight, text: line.text, width: line.width }))
          lo = size + 1
        } else {
          hi = size - 1
        }
      }
      cachedHeadlineFontSize = best
      cachedHeadlineLines = bestLines
      return { fontSize: best, lines: bestLines }
    }

    // ── app state ──
    const W0 = window.innerWidth, H0 = window.innerHeight
    const orbs: Orb[] = ORB_DEFS.map((def, i) => ({
      x: def.fx * W0, y: def.fy * H0, r: def.r,
      vx: def.vx, vy: def.vy, paused: i === 0,
    }))
    let pointer = { x: -9999, y: -9999 }
    let drag: DragState | null = null
    let lastFrameTime: number | null = null
    let rafId: number | null = null

    // ── render ──
    function render(now: number): boolean {
      const pageWidth = document.documentElement.clientWidth
      const pageHeight = document.documentElement.clientHeight
      const isNarrow = pageWidth < NARROW_BREAKPOINT
      const gutter = isNarrow ? NARROW_GUTTER : GUTTER
      const colGap = isNarrow ? NARROW_COL_GAP : COL_GAP
      const bottomGap = isNarrow ? NARROW_BOTTOM_GAP : BOTTOM_GAP
      const orbRadiusScale = isNarrow ? NARROW_ORB_SCALE : 1
      const activeOrbCount = isNarrow ? Math.min(NARROW_ACTIVE_ORBS, orbs.length) : orbs.length

      const dt = Math.min((now - (lastFrameTime ?? now)) / 1000, 0.05)
      let stillAnimating = false
      const draggedOrbIndex = drag?.orbIndex ?? -1

      // physics
      for (let i = 0; i < orbs.length; i++) {
        if (i >= activeOrbCount) continue
        const orb = orbs[i]!
        const radius = orb.r * orbRadiusScale
        if (orb.paused || i === draggedOrbIndex) continue
        stillAnimating = true
        orb.x += orb.vx * dt
        orb.y += orb.vy * dt
        if (orb.x - radius < 0)                    { orb.x = radius;                  orb.vx =  Math.abs(orb.vx) }
        if (orb.x + radius > pageWidth)             { orb.x = pageWidth - radius;      orb.vx = -Math.abs(orb.vx) }
        if (orb.y - radius < gutter * 0.5)          { orb.y = radius + gutter * 0.5;   orb.vy =  Math.abs(orb.vy) }
        if (orb.y + radius > pageHeight - bottomGap){ orb.y = pageHeight - bottomGap - radius; orb.vy = -Math.abs(orb.vy) }
      }

      // dragon follows cursor
      const dragon = orbs[0]!
      const dx = pointer.x - dragon.x
      const dy = pointer.y - dragon.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const stopDist = dragon.r * orbRadiusScale * Math.SQRT2
      if (dist > stopDist) {
        stillAnimating = true
        const step = Math.min(100 * dt, dist - stopDist)
        dragon.x += (dx / dist) * step
        dragon.y += (dy / dist) * step
      }

      // orb-orb repulsion
      for (let i = 0; i < activeOrbCount; i++) {
        const a = orbs[i]!
        for (let j = i + 1; j < activeOrbCount; j++) {
          const b = orbs[j]!
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = (a.r + b.r) * orbRadiusScale + (isNarrow ? 12 : 20)
          if (dist >= minDist || dist <= 0.1) continue
          const force = (minDist - dist) * 0.8
          const nx = dx / dist, ny = dy / dist
          if (!a.paused && i !== draggedOrbIndex) { a.vx -= nx * force * dt; a.vy -= ny * force * dt }
          if (!b.paused && j !== draggedOrbIndex) { b.vx += nx * force * dt; b.vy += ny * force * dt }
        }
      }

      // build circle obstacles
      const circleObstacles: CircleObstacle[] = orbs.slice(0, activeOrbCount).map(orb => ({
        cx: orb.x, cy: orb.y, r: orb.r * orbRadiusScale,
        hPad: isNarrow ? 10 : 14, vPad: isNarrow ? 2 : 4,
      }))

      // headline
      const headlineWidth = Math.min(pageWidth - gutter * 2, 1000)
      const { fontSize: headlineSize, lines: headlineLines } = fitHeadline(headlineWidth, isNarrow ? 38 : 92)
      const headlineLineHeight = Math.round(headlineSize * 0.93)
      const headlineFont = `700 ${headlineSize}px ${HEADLINE_FONT_FAMILY}`
      const headlineHeight = headlineLines.length * headlineLineHeight

      // body layout
      const bodyTop = gutter + headlineHeight + (isNarrow ? 14 : 20)
      const bodyHeight = pageHeight - bodyTop - bottomGap
      const columnCount = pageWidth > 1000 ? 3 : pageWidth > 640 ? 2 : 1
      const totalGutter = gutter * 2 + colGap * (columnCount - 1)
      const columnWidth = Math.floor((Math.min(pageWidth, 1500) - totalGutter) / columnCount)
      const contentLeft = Math.round((pageWidth - (columnCount * columnWidth + (columnCount - 1) * colGap)) / 2)

      const dropCapRect: RectObstacle = { x: contentLeft - 2, y: bodyTop - 2, w: DROP_CAP_TOTAL_W, h: DROP_CAP_LINES * BODY_LINE_HEIGHT + 2 }

      const allBodyLines: PositionedLine[] = []
      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 1 }
      for (let col = 0; col < columnCount; col++) {
        const colX = contentLeft + col * (columnWidth + colGap)
        const rects = col === 0 ? [dropCapRect] : []
        const result = layoutColumn(preparedBody, cursor, colX, bodyTop, columnWidth, bodyHeight, BODY_LINE_HEIGHT, circleObstacles, rects, isNarrow)
        allBodyLines.push(...result.lines)
        cursor = result.cursor
      }

      // commit to DOM
      syncPool(headlinePool, headlineLines.length, () => {
        const el = document.createElement('span')
        el.style.cssText = 'position:absolute'
        el.className = 'headline-line'
        return el
      })
      for (let i = 0; i < headlineLines.length; i++) {
        const el = headlinePool[i]!, line = headlineLines[i]!
        el.textContent = line.text
        el.style.left = `${gutter + line.x}px`
        el.style.top = `${gutter + line.y}px`
        el.style.font = headlineFont
        el.style.lineHeight = `${headlineLineHeight}px`
      }

      syncPool(linePool, allBodyLines.length, () => {
        const el = document.createElement('span')
        el.style.cssText = 'position:absolute'
        el.className = 'line'
        return el
      })
      for (let i = 0; i < allBodyLines.length; i++) {
        const el = linePool[i]!, line = allBodyLines[i]!
        el.textContent = line.text
        el.style.left = `${line.x}px`
        el.style.top = `${line.y}px`
        el.style.font = BODY_FONT
        el.style.lineHeight = `${BODY_LINE_HEIGHT}px`
      }

      dropCapEl.style.left = `${contentLeft}px`
      dropCapEl.style.top = `${bodyTop}px`

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i]!, el = orbEls[i]!
        if (i >= activeOrbCount) { el.style.display = 'none'; continue }
        const radius = orb.r * orbRadiusScale
        el.style.display = ''
        el.style.left = `${orb.x - radius}px`
        el.style.top = `${orb.y - radius}px`
        el.style.width = `${radius * 2}px`
        el.style.height = `${radius * 2}px`
        el.style.opacity = '1'
        const α = Math.atan2(pointer.y - dragon.y, pointer.x - dragon.x)
        if (pointer.x >= dragon.x) {
          el.style.transform = `rotate(${α + Math.PI / 4}rad)`
        } else {
          el.style.transform = `scaleX(-1) rotate(${5 * Math.PI / 4 - α}rad)`
        }
        el.style.transformOrigin = 'center center'
      }

      const hoveredIndex = hitTestOrbs(orbs, pointer.x, pointer.y, activeOrbCount, orbRadiusScale)
      stage.style.cursor = drag !== null ? 'grabbing' : hoveredIndex !== -1 ? 'grab' : ''
      lastFrameTime = stillAnimating ? now : null

      return stillAnimating
    }

    function scheduleRender() {
      if (rafId !== null) return
      rafId = requestAnimationFrame(now => { rafId = null; if (render(now)) scheduleRender() })
    }

    // ── events ──
    function onPointerDown(e: PointerEvent) {
      const isNarrow = window.innerWidth < NARROW_BREAKPOINT
      const activeOrbCount = isNarrow ? Math.min(NARROW_ACTIVE_ORBS, orbs.length) : orbs.length
      const orbRadiusScale = isNarrow ? NARROW_ORB_SCALE : 1
      const orbIndex = hitTestOrbs(orbs, e.clientX, e.clientY, activeOrbCount, orbRadiusScale)
      if (orbIndex !== -1) {
        e.preventDefault()
        drag = { orbIndex, startPointerX: e.clientX, startPointerY: e.clientY, startOrbX: orbs[orbIndex]!.x, startOrbY: orbs[orbIndex]!.y }
      }
      scheduleRender()
    }

    function onPointerMove(e: PointerEvent) {
      pointer = { x: e.clientX, y: e.clientY }
      if (drag !== null) {
        const orb = orbs[drag.orbIndex]!
        orb.x = drag.startOrbX + (e.clientX - drag.startPointerX)
        orb.y = drag.startOrbY + (e.clientY - drag.startPointerY)
      }
      scheduleRender()
    }

    function onPointerUp(e: PointerEvent) {
      if (drag !== null) {
        const dx = e.clientX - drag.startPointerX
        const dy = e.clientY - drag.startPointerY
        const orb = orbs[drag.orbIndex]!
        if (dx * dx + dy * dy < 16) orb.paused = !orb.paused
        else { orb.x = drag.startOrbX + dx; orb.y = drag.startOrbY + dy }
        drag = null
      }
      scheduleRender()
    }

    stage.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('resize', scheduleRender)

    scheduleRender()

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      stage.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', scheduleRender)
      stage.innerHTML = ''
    }
  }, [bodyText])

  return (
    <div
      ref={stageRef}
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}
    />
  )
}
