export interface Constellation {
  name: string
  abbr: string
  aspect: number
  stars: [number, number][]
  lines: [number, number][]
}

export type Catalog = Record<string, Constellation>

export interface CatalogFile {
  _source: { name: string; url: string; license: string; copyright: string }
  constellations: Catalog
}

export interface NowItem {
  id: string
  text: string
  completedAt: string | null
}

/** The on-disk shape of data/now/<abbr>.json */
export interface GoalFile {
  startedAt: string
  items: NowItem[]
}

/** A goal file plus the slug taken from its filename. */
export interface Goal extends GoalFile {
  slug: string
}

export interface Point {
  x: number
  y: number
}

/** An SVG viewBox, in the same pixel space as `Point`. */
export interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

export interface Override {
  completedAt: string
  base: string | null
}

export type Overrides = Record<string, Override>

export interface Streaks {
  current: number
  longest: number
}

export interface HeatmapCell {
  date: string
  count: number
}
