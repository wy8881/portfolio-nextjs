'use client'
import { ANIMATION_DURATION } from "@/lib/animations"
import { ANIMATION_EASING } from "@/lib/animations"
import { motion } from "framer-motion"

export const ScrollIndicator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: ANIMATION_DURATION.pageTransition + 0.2,
        duration: ANIMATION_DURATION.pageTransition,
        ease: ANIMATION_EASING.easeInOut
      }}
      className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce z-10"
    >
      <span className="text-sm text-gray-800">Scroll to explore</span>
      <svg
        className="w-6 h-6 text-gray-800"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </motion.div>
  )
}