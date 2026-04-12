// components/home/hero/HeroContext.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

const heroData = {
  name: "Yi Wang",
  headline: { before: "I make the web feel ", accent: "alive." },
  bio: "Adelaide-based dev. CS grad. Overthinker of small details.",
  cta: {
    primary: { text: "View My Work", href: "/projects" },
    secondary: { text: "Contact Me", href: "/contact" },
  },
}

const FADE_UP_INITIAL = { opacity: 0, y: 20 }
const FADE_UP_ANIMATE = { opacity: 1, y: 0 }
const FADE_UP_TRANSITION = {
  duration: ANIMATION_DURATION.hero.cell,
  ease: ANIMATION_EASING.standard,
}

export function HeroContext() {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <motion.h1
        initial={FADE_UP_INITIAL}
        animate={FADE_UP_ANIMATE}
        transition={{ ...FADE_UP_TRANSITION, delay: 0.1 }}
        className="font-bold text-primary mb-3"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
      >
        {heroData.name}
      </motion.h1>

      <motion.h2
        initial={FADE_UP_INITIAL}
        animate={FADE_UP_ANIMATE}
        transition={{ ...FADE_UP_TRANSITION, delay: 0.2 }}
        className="font-bold text-primary mb-4 leading-tight"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
      >
        {heroData.headline.before}
        <span
          style={{
            color: 'var(--color-accent)',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          {heroData.headline.accent}
        </span>
      </motion.h2>

      <motion.p
        initial={FADE_UP_INITIAL}
        animate={FADE_UP_ANIMATE}
        transition={{ ...FADE_UP_TRANSITION, delay: 0.3 }}
        className="mb-8 max-w-sm"
        style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', color: 'var(--color-secondary)' }}
      >
        {heroData.bio}
      </motion.p>

      <motion.div
        initial={FADE_UP_INITIAL}
        animate={FADE_UP_ANIMATE}
        transition={{ ...FADE_UP_TRANSITION, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 items-center md:items-start"
      >
        <Link
          href={heroData.cta.primary.href}
          className="
            bg-primary text-background
            border-2 border-transparent
            px-8 py-3
            font-medium rounded-sm
            transition-all duration-200
            hover:bg-background hover:text-primary hover:border-primary
          "
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
        >
          {heroData.cta.primary.text}
        </Link>

        <Link
          href={heroData.cta.secondary.href}
          className="
            bg-secondary text-background
            border-2 border-secondary
            px-8 py-3
            font-medium rounded-sm
            transition-all duration-200
            hover:bg-background hover:text-secondary hover:border-secondary
          "
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
        >
          {heroData.cta.secondary.text}
        </Link>
      </motion.div>
    </div>
  )
}
