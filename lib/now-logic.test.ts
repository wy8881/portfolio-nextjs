import test from 'node:test'
import assert from 'node:assert/strict'
import type { Constellation, Catalog, Goal } from '../types/now.ts'
import { starPoints, validateGoal, isActive, findActive, resolveItems } from './now-logic.ts'

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

const catalog: Catalog = {
  cru: { name: 'Crux', abbr: 'Cru', aspect: 1, stars: [[0, 0], [1, 1], [0, 1], [1, 0]], lines: [[0, 1]] },
  cas: { name: 'Cassiopeia', abbr: 'Cas', aspect: 1, stars: [[0, 0], [0.5, 0.5]], lines: [[0, 1]] },
}

const valid = {
  startedAt: '2026-08-01',
  items: [
    { id: 'i1', text: 'Ch 1', completedAt: '2026-08-02' },
    { id: 'i2', text: 'Ch 2', completedAt: null },
    { id: 'i3', text: 'Ch 3', completedAt: null },
    { id: 'i4', text: 'Ch 4', completedAt: null },
  ],
}

test('validateGoal accepts a well-formed file', () => {
  const goal = validateGoal('cru', valid, catalog)
  assert.equal(goal.slug, 'cru')
  assert.equal(goal.items.length, 4)
})

test('validateGoal rejects an unknown slug', () => {
  assert.throws(() => validateGoal('xyz', valid, catalog), /"xyz" is not a constellation abbreviation/)
})

test('validateGoal rejects a star-count mismatch', () => {
  assert.throws(() => validateGoal('cas', valid, catalog), /4 items but Cassiopeia has 2 stars/)
})

test('validateGoal rejects duplicate ids', () => {
  const dup = { ...valid, items: valid.items.map((i, n) => (n === 1 ? { ...i, id: 'i1' } : i)) }
  assert.throws(() => validateGoal('cru', dup, catalog), /duplicate item id "i1"/)
})

test('validateGoal rejects empty text', () => {
  const blank = { ...valid, items: valid.items.map((i, n) => (n === 2 ? { ...i, text: '  ' } : i)) }
  assert.throws(() => validateGoal('cru', blank, catalog), /item "i3" has no text/)
})

test('validateGoal rejects a malformed date', () => {
  const bad = { ...valid, items: valid.items.map((i, n) => (n === 0 ? { ...i, completedAt: '12/08/2026' } : i)) }
  assert.throws(() => validateGoal('cru', bad, catalog), /invalid completedAt "12\/08\/2026"/)
})

test('validateGoal rejects completion before the start date', () => {
  const early = { ...valid, items: valid.items.map((i, n) => (n === 0 ? { ...i, completedAt: '2026-07-30' } : i)) }
  assert.throws(() => validateGoal('cru', early, catalog), /completed before the goal started/)
})

test('isActive is true while any item is unfinished', () => {
  const goal = validateGoal('cru', valid, catalog)
  assert.equal(isActive(goal), true)
  const done: Goal = { ...goal, items: goal.items.map((i) => ({ ...i, completedAt: '2026-08-05' })) }
  assert.equal(isActive(done), false)
})

test('findActive returns the single active goal, or null', () => {
  const goal = validateGoal('cru', valid, catalog)
  assert.equal(findActive([goal])?.slug, 'cru')
  assert.equal(findActive([]), null)
})

test('findActive throws when two goals are active', () => {
  const a = validateGoal('cru', valid, catalog)
  const b: Goal = { ...a, slug: 'cas' }
  assert.throws(() => findActive([a, b]), /more than one goal is active: cru, cas/i)
})

const items = [
  { id: 'a', text: 'A', completedAt: '2026-08-02' },
  { id: 'b', text: 'B', completedAt: null },
]

test('resolveItems keeps the committed date when there is one', () => {
  const merged = resolveItems(items, { a: { completedAt: '2026-08-09', base: null } })
  assert.equal(merged[0].completedAt, '2026-08-02')
})

test('resolveItems applies a fresh override', () => {
  const merged = resolveItems(items, { b: { completedAt: '2026-08-09', base: null } })
  assert.equal(merged[1].completedAt, '2026-08-09')
})

test('resolveItems drops a stale override', () => {
  // base says the file used to hold a date; the file now says null, so the
  // override is from a previous state and must not resurrect itself
  const merged = resolveItems(items, { b: { completedAt: '2026-08-09', base: '2026-08-03' } })
  assert.equal(merged[1].completedAt, null)
})

test('resolveItems ignores overrides for unknown ids', () => {
  const merged = resolveItems(items, { zzz: { completedAt: '2026-08-09', base: null } })
  assert.deepEqual(merged, items)
})

test('resolveItems does not mutate its input', () => {
  const before = JSON.stringify(items)
  resolveItems(items, { b: { completedAt: '2026-08-09', base: null } })
  assert.equal(JSON.stringify(items), before)
})
