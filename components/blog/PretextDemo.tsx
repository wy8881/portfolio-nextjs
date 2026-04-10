'use client'

import { useEffect, useRef } from 'react'
import { layoutNextLine, layoutWithLines, prepareWithSegments, walkLineRanges } from '@chenglou/pretext'
import type { LayoutCursor } from '@chenglou/pretext'

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
const NARROW_DRAGON_SCALE = 0.58

const DRAGON_INIT = { fx: 0.52, fy: 0.22, r: 110 }

// ─── types ───────────────────────────────────────────────────────────────────

type Interval = { left: number; right: number }
type PositionedLine = { x: number; y: number; width: number; text: string }
type CircleObstacle = { cx: number; cy: number; r: number; hPad: number; vPad: number }
type RectObstacle = { x: number; y: number; w: number; h: number }
type Dragon = { x: number; y: number; r: number; vx: number; vy: number; paused: boolean }
type DragState = { startPointerX: number; startPointerY: number; startDragonX: number; startDragonY: number }

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
  prepared: ReturnType<typeof prepareWithSegments>,
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

function hitTestDragon(dragon: Dragon, px: number, py: number, radiusScale: number): boolean {
  const r = dragon.r * radiusScale
  const dx = px - dragon.x
  const dy = py - dragon.y
  return dx * dx + dy * dy <= r * r
}

// ─── component ───────────────────────────────────────────────────────────────

export default function PretextDemo({ bodyText }: { bodyText: string }) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const container: HTMLDivElement = stage

    const preparedBody = prepareWithSegments(bodyText, BODY_FONT)

    const DROP_CAP_SIZE = BODY_LINE_HEIGHT * DROP_CAP_LINES - 4
    const DROP_CAP_FONT = `700 ${DROP_CAP_SIZE}px ${HEADLINE_FONT_FAMILY}`
    const DROP_CAP_TEXT = bodyText[0]!
    const preparedDropCap = prepareWithSegments(DROP_CAP_TEXT, DROP_CAP_FONT)
    let dropCapWidth = 0
    walkLineRanges(preparedDropCap, 9999, line => { dropCapWidth = line.width })
    const DROP_CAP_TOTAL_W = Math.ceil(dropCapWidth) + 10

    const dropCapEl = document.createElement('div')
    dropCapEl.className = 'drop-cap'
    dropCapEl.textContent = DROP_CAP_TEXT
    dropCapEl.style.cssText = `position:absolute;font:${DROP_CAP_FONT};line-height:${DROP_CAP_SIZE}px`
    stage.appendChild(dropCapEl)

    const dragonEl = document.createElement('img')
    dragonEl.src = '/images/blog/pretext-canvas-text-layout/dragon.svg'
    dragonEl.style.cssText = 'position:absolute;pointer-events:none'
    stage.appendChild(dragonEl)

    const linePool: HTMLSpanElement[] = []
    const headlinePool: HTMLSpanElement[] = []

    function syncPool<T extends HTMLElement>(pool: T[], count: number, create: () => T): void {
      while (pool.length < count) { const el = create(); container.appendChild(el); pool.push(el) }
      for (let i = 0; i < pool.length; i++) pool[i]!.style.display = i < count ? '' : 'none'
    }

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

    const dragon: Dragon = {
      x: DRAGON_INIT.fx * stage.clientWidth,
      y: DRAGON_INIT.fy * stage.clientHeight,
      r: DRAGON_INIT.r,
      vx: 0, vy: 0,
      paused: true,
    }
    let pointer = { x: -9999, y: -9999 }
    let drag: DragState | null = null
    let lastFrameTime: number | null = null
    let rafId: number | null = null

    function render(now: number): boolean {
      const pageWidth = stage.clientWidth
      const pageHeight = stage.clientHeight
      const isNarrow = pageWidth < NARROW_BREAKPOINT
      const gutter = isNarrow ? NARROW_GUTTER : GUTTER
      const colGap = isNarrow ? NARROW_COL_GAP : COL_GAP
      const bottomGap = isNarrow ? NARROW_BOTTOM_GAP : BOTTOM_GAP
      const dragonRadiusScale = isNarrow ? NARROW_DRAGON_SCALE : 1
      const dragonRadius = dragon.r * dragonRadiusScale

      const dt = Math.min((now - (lastFrameTime ?? now)) / 1000, 0.05)
      let stillAnimating = false

      // dragon follows cursor
      const dx = pointer.x - dragon.x
      const dy = pointer.y - dragon.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const stopDist = dragonRadius * Math.SQRT2
      if (dist > stopDist) {
        stillAnimating = true
        const step = Math.min(100 * dt, dist - stopDist)
        dragon.x += (dx / dist) * step
        dragon.y += (dy / dist) * step
      }

      // boundary clamp
      if (dragon.x - dragonRadius < 0)                     dragon.x = dragonRadius
      if (dragon.x + dragonRadius > pageWidth)              dragon.x = pageWidth - dragonRadius
      if (dragon.y - dragonRadius < gutter * 0.5)           dragon.y = dragonRadius + gutter * 0.5
      if (dragon.y + dragonRadius > pageHeight - bottomGap) dragon.y = pageHeight - bottomGap - dragonRadius

      // build circle obstacle
      const circleObstacles: CircleObstacle[] = [{
        cx: dragon.x, cy: dragon.y, r: dragonRadius,
        hPad: isNarrow ? 10 : 14, vPad: isNarrow ? 2 : 4,
      }]

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

      dragonEl.style.left = `${dragon.x - dragonRadius}px`
      dragonEl.style.top = `${dragon.y - dragonRadius}px`
      dragonEl.style.width = `${dragonRadius * 2}px`
      dragonEl.style.height = `${dragonRadius * 2}px`
      const α = Math.atan2(pointer.y - dragon.y, pointer.x - dragon.x)
      dragonEl.style.transform = pointer.x >= dragon.x
        ? `rotate(${α + Math.PI / 4}rad)`
        : `scaleX(-1) rotate(${5 * Math.PI / 4 - α}rad)`
      dragonEl.style.transformOrigin = 'center center'

      const isHovered = hitTestDragon(dragon, pointer.x, pointer.y, dragonRadiusScale)
      stage.style.cursor = drag !== null ? 'grabbing' : isHovered ? 'grab' : ''
      lastFrameTime = stillAnimating ? now : null

      return stillAnimating
    }

    function scheduleRender() {
      if (rafId !== null) return
      rafId = requestAnimationFrame(now => { rafId = null; if (render(now)) scheduleRender() })
    }

    function onPointerDown(e: PointerEvent) {
      const isNarrow = window.innerWidth < NARROW_BREAKPOINT
      const dragonRadiusScale = isNarrow ? NARROW_DRAGON_SCALE : 1
      if (hitTestDragon(dragon, e.clientX, e.clientY, dragonRadiusScale)) {
        e.preventDefault()
        drag = { startPointerX: e.clientX, startPointerY: e.clientY, startDragonX: dragon.x, startDragonY: dragon.y }
      }
      scheduleRender()
    }

    function onPointerMove(e: PointerEvent) {
      pointer = { x: e.clientX, y: e.clientY }
      if (drag !== null) {
        dragon.x = drag.startDragonX + (e.clientX - drag.startPointerX)
        dragon.y = drag.startDragonY + (e.clientY - drag.startPointerY)
      }
      scheduleRender()
    }

    function onPointerUp(e: PointerEvent) {
      if (drag !== null) {
        const dx = e.clientX - drag.startPointerX
        const dy = e.clientY - drag.startPointerY
        if (dx * dx + dy * dy < 16) dragon.paused = !dragon.paused
        else { dragon.x = drag.startDragonX + dx; dragon.y = drag.startDragonY + dy }
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
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    />
  )
}
