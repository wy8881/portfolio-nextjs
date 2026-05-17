'use client'

import { useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import type { Season } from '@/lib/types'

const SEASON_NOTES: Record<Season, { emoji: string; note: string }> = {
  spring: {
    emoji: '🌸',
    note: "Everything's in bloom. Including the ideas I've been sitting on all winter.\n\nBuilding slowly. Choosing carefully.",
  },
  summer: {
    emoji: '☀️',
    note: "Energy is high. Ideas everywhere, hard to pick one.\n\nShipping fast. Iterating faster.",
  },
  autumn: {
    emoji: '🍂',
    note: "Things are settling. Stripping back the noise.\n\nShipping what matters. Letting go of what doesn't.",
  },
  winter: {
    emoji: '❄️',
    note: "Quieter. Deeper. The best thinking happens here.\n\nDesigning. Reading. Preparing.",
  },
}

function subscribeToDocSeason(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-season'],
  })
  return () => observer.disconnect()
}

function getDocSeason(): Season {
  const val = document.documentElement.getAttribute('data-season')
  return (val as Season) ?? 'summer'
}

const getServerSeason = (): Season => 'summer'

export function SeasonCard() {
  const season = useSyncExternalStore(subscribeToDocSeason, getDocSeason, getServerSeason)

  const { emoji, note } = SEASON_NOTES[season]

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: ANIMATION_DURATION.hero.cell,
        delay: 0.3,
        ease: ANIMATION_EASING.easeOut,
      }}
      className="rounded-lg p-5 border-l-[3px] h-full flex flex-col justify-center"
      style={{
        backgroundColor: 'var(--color-artifact)',
        borderColor: 'var(--color-accent)',
      }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-secondary)' }}
      >
        {emoji} This season
      </p>
      <p
        className="text-sm leading-loose whitespace-pre-line"
        style={{ color: 'var(--color-primary)' }}
      >
        {note}
      </p>
    </motion.div>
  )
}
