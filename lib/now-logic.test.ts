import test from 'node:test'
import assert from 'node:assert/strict'
import type { Constellation, Catalog, Goal } from '../types/now.ts'
import { starPoints, figureViewBox, DATE, validateGoal, isActive, findActive, resolveItems, addDays, dayOfWeek, dailyCounts, computeStreaks, monthCount, heatmapGrid, availableFigures, pickFigure, nearestCounts } from './now-logic.ts'

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

test('figureViewBox reduces to the full padded square for a figure spanning the whole box', () => {
  // `square`'s stars touch both corners of the unit box, so its tight bbox is already
  // the full padded square — the crop should be a no-op here.
  assert.deepEqual(figureViewBox(square, 100, 10), { x: 0, y: 0, width: 100, height: 100 })
})

test('figureViewBox crops tightly around a figure narrower than the padded square', () => {
  const wide: Constellation = {
    name: 'Wide',
    abbr: 'Wid',
    aspect: 5,
    stars: [[0, 0.4], [1, 0.6]],
    lines: [[0, 1]],
  }
  // points: (10, 42) and (90, 58) inside a 100x100/pad-10 box (inner = 80)
  assert.deepEqual(figureViewBox(wide, 100, 10), { x: 0, y: 32, width: 100, height: 36 })
})

test('figureViewBox does not divide by zero for a single-star figure', () => {
  const point: Constellation = { name: 'Point', abbr: 'Pt', aspect: 1, stars: [[0.5, 0.5]], lines: [] }
  assert.deepEqual(figureViewBox(point, 100, 10), { x: 40, y: 40, width: 20, height: 20 })
})

test('figureViewBox falls back to the full padded square when there are no stars', () => {
  assert.deepEqual(figureViewBox({ ...square, stars: [] }, 100, 10), { x: 0, y: 0, width: 100, height: 100 })
})

test('DATE matches YYYY-MM-DD and rejects other formats', () => {
  assert.equal(DATE.test('2026-08-14'), true)
  assert.equal(DATE.test('14/08/2026'), false)
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

test('addDays steps across month and year boundaries', () => {
  assert.equal(addDays('2026-08-31', 1), '2026-09-01')
  assert.equal(addDays('2026-01-01', -1), '2025-12-31')
  assert.equal(addDays('2024-02-28', 1), '2024-02-29')
})

test('addDays is immune to DST — Adelaide shifts on 2026-10-04', () => {
  assert.equal(addDays('2026-10-03', 1), '2026-10-04')
  assert.equal(addDays('2026-10-04', 1), '2026-10-05')
})

test('dayOfWeek counts Monday as 0', () => {
  assert.equal(dayOfWeek('2026-08-10'), 0) // Monday
  assert.equal(dayOfWeek('2026-08-16'), 6) // Sunday
})

test('dailyCounts sums completions per day across goals', () => {
  const goals: Goal[] = [
    { slug: 'cru', startedAt: '2026-08-01', items: [
      { id: 'a', text: 'A', completedAt: '2026-08-02' },
      { id: 'b', text: 'B', completedAt: '2026-08-02' },
      { id: 'c', text: 'C', completedAt: null },
    ] },
    { slug: 'cas', startedAt: '2026-08-01', items: [
      { id: 'd', text: 'D', completedAt: '2026-08-03' },
    ] },
  ]
  assert.deepEqual(dailyCounts(goals), { '2026-08-02': 2, '2026-08-03': 1 })
})

test('computeStreaks counts a run ending today', () => {
  const dates = ['2026-08-12', '2026-08-13', '2026-08-14']
  assert.deepEqual(computeStreaks(dates, '2026-08-14'), { current: 3, longest: 3 })
})

test('computeStreaks keeps the streak alive on the day after', () => {
  const dates = ['2026-08-12', '2026-08-13']
  assert.deepEqual(computeStreaks(dates, '2026-08-14'), { current: 2, longest: 2 })
})

test('computeStreaks breaks after a missed day', () => {
  const dates = ['2026-08-10', '2026-08-11']
  assert.deepEqual(computeStreaks(dates, '2026-08-14'), { current: 0, longest: 2 })
})

test('computeStreaks reports longest separately from current', () => {
  const dates = ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-13', '2026-08-14']
  assert.deepEqual(computeStreaks(dates, '2026-08-14'), { current: 2, longest: 3 })
})

test('computeStreaks counts a day once no matter how many items landed on it', () => {
  const dates = ['2026-08-13', '2026-08-13', '2026-08-14']
  assert.deepEqual(computeStreaks(dates, '2026-08-14'), { current: 2, longest: 2 })
})

test('computeStreaks handles no completions', () => {
  assert.deepEqual(computeStreaks([], '2026-08-14'), { current: 0, longest: 0 })
})

test('monthCount counts only the current calendar month', () => {
  const dates = ['2026-07-31', '2026-08-01', '2026-08-14', '2026-08-14']
  assert.equal(monthCount(dates, '2026-08-14'), 3)
})

test('heatmapGrid returns weeks of seven days ending with this week', () => {
  const grid = heatmapGrid({ '2026-08-13': 2 }, '2026-08-14', 4)
  assert.equal(grid.length, 4)
  assert.ok(grid.every((week) => week.length === 7))
  const last = grid[3]
  assert.equal(last[0]?.date, '2026-08-10') // Monday of the current week
  assert.equal(last[3]?.date, '2026-08-13')
  assert.equal(last[3]?.count, 2)
  assert.equal(last[4]?.date, '2026-08-14') // today, still rendered
  assert.equal(last[5], null) // tomorrow is not
})

test('heatmapGrid reports zero for days with no completions', () => {
  const grid = heatmapGrid({}, '2026-08-14', 1)
  assert.equal(grid[0][0]?.count, 0)
})

const pickCatalog: Catalog = {
  cru: { name: 'Crux', abbr: 'Cru', aspect: 1, stars: [[0, 0], [1, 1], [0, 1], [1, 0]], lines: [] },
  lyr: { name: 'Lyra', abbr: 'Lyr', aspect: 1, stars: [[0, 0], [1, 1], [0, 1], [1, 0]], lines: [] },
  cas: { name: 'Cassiopeia', abbr: 'Cas', aspect: 1, stars: [[0, 0], [0.5, 0.5]], lines: [] },
  ori: { name: 'Orion', abbr: 'Ori', aspect: 1, stars: [[0, 0], [1, 1], [0.5, 0.5]], lines: [] },
}

test('availableFigures matches the star count and skips used figures', () => {
  assert.deepEqual(availableFigures(pickCatalog, ['cru'], 4), ['lyr'])
})

test('pickFigure is deterministic under a seeded random', () => {
  assert.equal(pickFigure(pickCatalog, [], 4, () => 0)?.slug, 'cru')
  assert.equal(pickFigure(pickCatalog, [], 4, () => 0.99)?.slug, 'lyr')
})

test('pickFigure returns null when nothing matches', () => {
  assert.equal(pickFigure(pickCatalog, [], 9, () => 0), null)
})

test('nearestCounts suggests the closest available star counts', () => {
  assert.deepEqual(nearestCounts(pickCatalog, [], 9, 2), [4, 3])
})
