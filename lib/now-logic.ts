// Pure logic for the /now page. NO VALUE IMPORTS — `import type` is erased before
// execution, so this file runs directly under `node --test`. A plain import would
// need the `@/` alias, which Node cannot resolve.
import type { Constellation, Point } from '@/types/now'

/** Maps normalised 0–1 catalog coordinates into a padded square of `size` pixels. */
export function starPoints(figure: Constellation, size: number, padding: number): Point[] {
  const inner = size - padding * 2
  return figure.stars.map(([x, y]) => ({
    x: padding + x * inner,
    y: padding + y * inner,
  }))
}
