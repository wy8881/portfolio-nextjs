export type EffectName = 'stars' | 'hearts' | 'realistic' | 'schoolPride' | 'fireworks'

export interface HeroQuestion {
  id: number
  text: string
  effect: EffectName
  affirmation: string
}

export interface SupportResource {
  name: string
  detail: string
  href: string
}
