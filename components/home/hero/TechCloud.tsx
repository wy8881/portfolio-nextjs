'use client'

import { motion } from 'framer-motion'
import { TECH_STACK } from '@/lib/tech-stack'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

export function TechCloud() {
  return (
    <div className="relative w-full h-full min-h-[400px]">
      {TECH_STACK.map((tech, index) => (
        <motion.div
          key={tech.name}
          className={`absolute ${tech.color} ${tech.fontWeight}`}
          style={{
            left: tech.xPosition,
            top: tech.yPosition,
            fontSize: tech.fontSize,
            transform: 'translateX(-50%)',
          }}
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: ANIMATION_DURATION.techCloud.item,
            delay: tech.delay,
            ease: ANIMATION_EASING.easeOut,
          }}
          whileHover={{
            scale: 1.04,
            opacity: 1,
          }}
          role="text"
          aria-label={`Technology: ${tech.name}`}
        >
          {tech.name}
        </motion.div>
      ))}
    </div>
  )
}

