import test from 'node:test'
import assert from 'node:assert/strict'
import type { Constellation } from '../types/now.ts'
import { starPoints } from './now-logic.ts'

const square: Constellation = {
  name: 'Square',
  abbr: 'Sqr',
  aspect: 1,
  stars: [[0, 0], [1, 1], [0.5, 0.5]],
  lines: [[0, 1]],
}

test('starPoints maps the unit box into the padded box', () => {
  const points = starPoints(square, 100, 10)
  assert.deepEqual(points[0], { x: 10, y: 10 })
  assert.deepEqual(points[1], { x: 90, y: 90 })
  assert.deepEqual(points[2], { x: 50, y: 50 })
})

test('starPoints keeps every point inside the box', () => {
  for (const p of starPoints(square, 100, 10)) {
    assert.ok(p.x >= 10 && p.x <= 90, `x out of range: ${p.x}`)
    assert.ok(p.y >= 10 && p.y <= 90, `y out of range: ${p.y}`)
  }
})

test('starPoints handles a figure with no stars', () => {
  assert.deepEqual(starPoints({ ...square, stars: [] }, 100, 10), [])
})
