const PAGE_TRANSITION_DURATION = 0.3

export const ANIMATION_DURATION = {
  pageTransition: PAGE_TRANSITION_DURATION,
  navbar: {
    routeTransition: PAGE_TRANSITION_DURATION,
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

