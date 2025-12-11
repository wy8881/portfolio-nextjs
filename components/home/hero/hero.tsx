'use client'

import { useGitHubContributions } from '@/hooks/useGitHubContributions'
import { GitHubGrid } from '@/components/home/hero/GitHubGrid'
import { Hero } from '@/components/home/hero/HeroContext'
import { TechCloud } from '@/components/home/hero/TechCloud'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

export function HeroSection() {
  const { contributions, isLoading, isError } = useGitHubContributions({ period: 30 })

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: ANIMATION_DURATION.pageTransition,
        duration: ANIMATION_DURATION.pageTransition,
        ease: ANIMATION_EASING.easeInOut
      }}
      className="
        grid 
        grid-cols-1
        md:grid-cols-[18%_64%_18%]
        lg:grid-cols-[1.2fr_3fr_1.2fr]
        gap-4 md:gap-6 lg:gap-8
        px-6 md:px-8 lg:px-12
        pt-4 md:pt-6 pb-12 lg:pb-16
        items-stretch
      "
      aria-label="Hero Section"
      role="region"
    >
      <div className="hidden md:flex justify-end items-center pr-4 md:pr-6">
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-text-secondary">Loading...</div>
          </div>
        )}
        {isError && null}
        {!isLoading && !isError && contributions && (
          <div className="w-[90%] max-w-full">
            <GitHubGrid weeks={contributions.contributions} total={contributions.total} period={30} />
          </div>
        )}
      </div>

      <div className="flex justify-center items-center w-full">
        <Hero />
      </div>

      <div className="hidden md:flex justify-center items-stretch h-full">
        <TechCloud />
      </div>
    </motion.section>
  )
}

