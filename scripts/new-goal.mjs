// Starts a new constellation: node scripts/new-goal.mjs <starCount> [--figure <abbr>]
// Node strips the types from the imported .ts module, so the script, the tests,
// and the build all share exactly one copy of this logic.
import fs from 'node:fs'
import path from 'node:path'
import { pickFigure, nearestCounts, isActive, validateGoal } from '../lib/now-logic.ts'

const ROOT = process.cwd()
const NOW_DIR = path.join(ROOT, 'data/now')
const { constellations } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/constellations.json'), 'utf8'))

const args = process.argv.slice(2)
const forcedIndex = args.indexOf('--figure')
const forced = forcedIndex === -1 ? null : args[forcedIndex + 1]
const starCount = Number(args[0])

if (!Number.isInteger(starCount) || starCount < 2) {
  console.error('Usage: npm run now:new <starCount> [-- --figure <abbr>]')
  process.exit(1)
}

fs.mkdirSync(NOW_DIR, { recursive: true })
const files = fs.readdirSync(NOW_DIR).filter((f) => f.endsWith('.json'))
const goals = files.map((f) => {
  const slug = f.replace(/\.json$/, '')
  return validateGoal(slug, JSON.parse(fs.readFileSync(path.join(NOW_DIR, f), 'utf8')), constellations)
})

const stillGoing = goals.find(isActive)
if (stillGoing) {
  console.error(`${stillGoing.slug} is still active — finish it before starting another.`)
  process.exit(1)
}

const used = goals.map((g) => g.slug)
const chosen = forced
  ? (constellations[forced] ? { slug: forced, figure: constellations[forced] } : null)
  : pickFigure(constellations, used, starCount, Math.random)

if (!chosen) {
  const nearest = nearestCounts(constellations, used, starCount)
  console.error(`No unused figure has ${starCount} stars. Nearest available counts: ${nearest.join(', ')}`)
  process.exit(1)
}

if (chosen.figure.stars.length !== starCount) {
  console.error(`${chosen.figure.name} has ${chosen.figure.stars.length} stars, not ${starCount}.`)
  process.exit(1)
}

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Adelaide' }).format(new Date())
const goal = {
  startedAt: today,
  items: Array.from({ length: starCount }, (_, i) => ({
    id: `i${i + 1}`,
    text: `Item ${i + 1}`,
    completedAt: null,
  })),
}

const dest = path.join(NOW_DIR, `${chosen.slug}.json`)
if (fs.existsSync(dest)) {
  console.error(`${dest} already exists.`)
  process.exit(1)
}

fs.writeFileSync(dest, `${JSON.stringify(goal, null, 2)}\n`)
console.log(`Drew ${chosen.figure.name} (${chosen.figure.stars.length} stars) → data/now/${chosen.slug}.json`)
console.log('Replace the placeholder item text with your real chapters or modules.')
