import type { HeroQuestion } from '@/types/hero'

/**
 * Five small good things. Every "no" moves to the next one, and the
 * celebration grows as you go, so the further in you get the louder it is.
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
    text: 'Have you had a delicious dessert today?',
    effect: 'realistic',
    affirmation: 'Dessert is a perfectly good reason for a day to exist.',
  },
  {
    id: 3,
    text: 'Have you read a good article today?',
    effect: 'schoolPride',
    affirmation: 'Something worth reading found you. Good day.',
  },
  {
    id: 4,
    text: 'Have you heard a good joke today?',
    effect: 'fireworks',
    affirmation: 'A good laugh is the whole point, really.',
  },
]

export const closingMessage = 'A quiet one, then. There is always tomorrow.'
