'use client'

import { motion } from 'framer-motion'
import { TECH_STACK } from '@/lib/tech-stack'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

const containerVariants = {
  hidden: { 
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_DURATION.techCloud.stagger,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: {
    x: 150,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.techCloud.item,
      ease: ANIMATION_EASING.easeOut,
    },
  },
}

export function TechCloud() {
  return (
    <motion.div
      className="hidden md:block relative w-full h-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      aria-label="Technology Cloud"
    >
      {TECH_STACK.map((tech) => (
        <div
          key={tech.name}
          className="absolute"
          style={{
            left: tech.xPosition,
            top: tech.yPosition,
            transform: 'translateX(-50%)',
          }}
        >
          <motion.div
            className={`${tech.color} ${tech.fontWeight} will-change-transform`}
            style={{
              fontSize: tech.fontSize,
            }}
            variants={itemVariants}
            whileHover={{
              scale: 1.1,
              opacity: 1,
              transition: {
                duration: ANIMATION_DURATION.hero.hover,
                ease: ANIMATION_EASING.easeOut,
              },
            }}
            role="text"
            aria-label={`Technology: ${tech.name}`}
          >
            {tech.name}
          </motion.div>
        </div>
      ))}
    </motion.div>
  )
}

