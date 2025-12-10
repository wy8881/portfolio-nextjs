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

export function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-6 py-12 md:py-16 lg:py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_DURATION.hero.cell,
          ease: ANIMATION_EASING.standard
        }}
        className="font-bold text-text-primary mb-2"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
      >
        {heroData.name}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{
          duration: ANIMATION_DURATION.hero.cell,
          delay: 0.2,
          ease: ANIMATION_EASING.standard
        }}
        className="h-[3px] bg-gradient-to-r from-transparent via-text-primary to-transparent mb-6"
        style={{ width: 'clamp(8rem, 20vw, 16rem)' }}
      />

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
        className="text-text-secondary mb-8 max-w-2xl mx-auto"
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
        className="flex flex-col sm:flex-row gap-4 items-center justify-center"
      >
        <Link
          href={heroData.cta.primary.href}
          className="
            bg-cta-bg text-cta-text
            px-8 py-3
            font-normal
            transition-all duration-200
            hover:opacity-90
            rounded-sm
          "
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
        >
          {heroData.cta.primary.text}
        </Link>

        <Link
          href={heroData.cta.secondary.href}
          className="
            bg-background text-text-primary
            border-2 border-text-primary
            px-8 py-3
            font-normal
            transition-all duration-200
            hover:bg-text-primary hover:text-background
            rounded-sm
          "
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
        >
          {heroData.cta.secondary.text}
        </Link>
      </motion.div>
    </section>
  )
}

