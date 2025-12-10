/**
 * Global animation constants
 * Used across navbar, hero, and other components for consistent timing
 */

export const ANIMATION_DURATION = {
  navbar: {
    routeTransition: 1,
    hover: 0.2,
  },
  hero: {
    cell: 1,
    hover: 0.5,
  },
  techCloud: {
    item: 0.6,
    stagger: 0.1,
  },
} as const

export const ANIMATION_EASING = {
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
  easeInOut: 'easeInOut' as const,
  easeOut: 'easeOut' as const,
} as const

