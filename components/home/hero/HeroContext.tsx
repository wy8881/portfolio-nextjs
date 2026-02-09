'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

const heroData = {
  name: "Yi Wang",
  role: "Full-Stack Developer",
  description: "Building thoughtful web applications with modern technologies.",
  cta: {
    primary: { text: "View My Work", href: "/projects" },
    secondary: { text: "Contact Me", href: "/contact" }
  }
}

export function HeroContext() {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_DURATION.hero.cell,
          delay: 0.1,
          ease: ANIMATION_EASING.standard
        }}
        className="font-bold text-primary mb-2"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
      >
        {heroData.name}
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_DURATION.hero.cell,
          delay: 0.3,
          ease: ANIMATION_EASING.standard
        }}
        className="font-medium text-secondary mb-4"
        style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}
      >
        {heroData.role}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_DURATION.hero.cell,
          delay: 0.4,
          ease: ANIMATION_EASING.standard
        }}
        className="text-secondary mb-8 max-w-2xl mx-auto"
        style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}
      >
        {heroData.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_DURATION.hero.cell,
          delay: 0.5,
          ease: ANIMATION_EASING.standard
        }}
        className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center justify-center"
      >
        <Link
          href={heroData.cta.primary.href}
          className="
            bg-primary text-background
            border-2 border-transparent
            px-8 py-3
            font-normal
            transition-all duration-200
            hover:bg-background
            hover:text-primary
            hover:border-primary
            rounded-sm
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
            font-normal
            transition-all duration-200
            hover:bg-background hover:text-secondary hover:border-secondary
            rounded-sm
          "
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
        >
          {heroData.cta.secondary.text}
        </Link>
      </motion.div>
    </div>
  )
}

