// components/home/hero/Hero.tsx
'use client'

import { HeroContext } from '@/components/home/hero/HeroContext'
import { ConfettiPanel } from '@/components/home/hero/ConfettiPanel'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: ANIMATION_DURATION.pageTransition,
        duration: ANIMATION_DURATION.pageTransition,
        ease: ANIMATION_EASING.easeInOut,
      }}
      className="
        h-full w-full max-w-5xl
        grid
        grid-cols-1
        md:grid-cols-[1fr_1fr]
        gap-10 md:gap-16
        items-center
      "
    >
      <HeroContext />
      <ConfettiPanel />
    </motion.div>
  )
}
