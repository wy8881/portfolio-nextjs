import type { HeroQuestion, SupportResource } from '@/types/hero'

/**
 * The ladder. Each "no" drops to an easier question, and the reward gets
 * bigger as the bar gets lower — clearing "I got out of bed" earns more
 * celebration than "I learned something", because on the days that's all
 * you have, that is the achievement.
 */
export const heroQuestions: HeroQuestion[] = [
  {
    id: 0,
    text: 'Have you learned something new today?',
    effect: 'stars',
    affirmation: 'Then today taught you something. That counts.',
  },
  {
    id: 1,
    text: 'Have you been kind to someone today?',
    effect: 'hearts',
    affirmation: 'Someone had a better day because of you.',
  },
  {
    id: 2,
    text: 'Have you eaten something today?',
    effect: 'realistic',
    affirmation: 'You looked after yourself. That is not nothing.',
  },
  {
    id: 3,
    text: 'Did you get out of bed today?',
    effect: 'schoolPride',
    affirmation: 'Some days that is the whole victory. Take it.',
  },
  {
    id: 4,
    text: 'Have you survived today?',
    effect: 'fireworks',
    affirmation: 'You are still here. That is the only thing today needed.',
  },
]

export const supportMessage =
  'Then today was heavier than it should have been. You do not have to carry it on your own.'

export const supportResources: SupportResource[] = [
  {
    name: 'Lifeline',
    detail: '13 11 14 — 24/7 crisis support, Australia',
    href: 'tel:131114',
  },
  {
    name: 'Beyond Blue',
    detail: '1300 22 4636 — 24/7 mental health support, Australia',
    href: 'tel:1300224636',
  },
  {
    name: 'Find a Helpline',
    detail: 'Free, confidential support wherever you are',
    href: 'https://findahelpline.com',
  },
]
