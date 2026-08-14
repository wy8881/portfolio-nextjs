// Generates data/constellations.json from the vendored d3-celestial figure data.
// Source: https://github.com/ofrohn/d3-celestial — BSD-3-Clause, (c) 2015 Olaf Frohn.
// Run with: node scripts/build-constellations.mjs
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const RAD = Math.PI / 180

const lines = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/vendor/constellations.lines.json'), 'utf8'))
const names = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/vendor/constellations.json'), 'utf8'))
const nameById = new Map(names.features.map((f) => [f.id, f.properties.name]))

/**
 * Stereographic projection about the figure's own centroid.
 * Doing it per figure is what keeps constellations that straddle RA 12h (Virgo)
 * from tearing, and high-declination ones (Draco, Ursa Minor) from stretching.
 */
function project(points) {
  const vecs = points.map(([ra, dec]) => {
    const r = ra * RAD
    const d = dec * RAD
    return [Math.cos(d) * Math.cos(r), Math.cos(d) * Math.sin(r), Math.sin(d)]
  })
  const sum = vecs.reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0])
  const len = Math.hypot(...sum)
  const c = sum.map((v) => v / len)
  const ra0 = Math.atan2(c[1], c[0])
  const dec0 = Math.asin(c[2])

  return points.map(([ra, dec]) => {
    const r = ra * RAD
    const d = dec * RAD
    const dra = r - ra0
    const cosc = Math.sin(dec0) * Math.sin(d) + Math.cos(dec0) * Math.cos(d) * Math.cos(dra)
    const k = 2 / (1 + cosc)
    const x = k * Math.cos(d) * Math.sin(dra)
    const y = k * (Math.cos(dec0) * Math.sin(d) - Math.sin(dec0) * Math.cos(d) * Math.cos(dra))
    return [-x, -y] // RA increases leftward on a sky chart; screen y grows downward
  })
}

const key = (p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`
const constellations = {}

for (const f of lines.features) {
  const index = new Map()
  const raw = []
  const edges = []

  for (const seg of f.geometry.coordinates) {
    for (let i = 0; i < seg.length; i++) {
      const k = key(seg[i])
      if (!index.has(k)) {
        index.set(k, raw.length)
        raw.push(seg[i])
      }
      if (i > 0) edges.push([index.get(key(seg[i - 1])), index.get(k)])
    }
  }

  const flat = project(raw)
  const xs = flat.map((p) => p[0])
  const ys = flat.map((p) => p[1])
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const w = Math.max(...xs) - minX || 1
  const h = Math.max(...ys) - minY || 1
  const box = Math.max(w, h)
  const offX = (box - w) / 2
  const offY = (box - h) / 2

  constellations[f.id.toLowerCase()] = {
    name: nameById.get(f.id) ?? f.id,
    abbr: f.id,
    aspect: Number((w / h).toFixed(3)),
    stars: flat.map((p) => [
      Number(((p[0] - minX + offX) / box).toFixed(4)),
      Number(((p[1] - minY + offY) / box).toFixed(4)),
    ]),
    lines: edges,
  }
}

// Self-checks — a silently malformed catalog would break every consumer downstream.
const slugs = Object.keys(constellations)
if (slugs.length !== 88) throw new Error(`expected 88 constellations, got ${slugs.length}`)
for (const slug of slugs) {
  const c = constellations[slug]
  if (c.stars.length < 2) throw new Error(`${slug}: only ${c.stars.length} stars`)
  for (const [x, y] of c.stars) {
    if (!(x >= 0 && x <= 1 && y >= 0 && y <= 1)) throw new Error(`${slug}: point out of unit box: ${x},${y}`)
  }
  for (const [a, b] of c.lines) {
    if (!c.stars[a] || !c.stars[b]) throw new Error(`${slug}: edge references a missing star`)
  }
}

const out = {
  _source: {
    name: 'd3-celestial',
    url: 'https://github.com/ofrohn/d3-celestial',
    license: 'BSD-3-Clause',
    copyright: '(c) 2015 Olaf Frohn',
  },
  constellations,
}

fs.writeFileSync(path.join(ROOT, 'data/constellations.json'), JSON.stringify(out))
console.log(`wrote data/constellations.json — ${slugs.length} figures`)
