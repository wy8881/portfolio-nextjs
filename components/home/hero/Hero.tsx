'use client'
import { GitHubGrid } from '@/components/home/hero/GitHubGrid'
import { HeroContext } from '@/components/home/hero/HeroContext'
import { TechCloud } from '@/components/home/hero/TechCloud'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import { ContributionData } from '@/lib/types'

interface HeroSectionProps {
  contributionData?: ContributionData
  period?: number
}

export function HeroSection({contributionData, period = 60}: HeroSectionProps) {
  const hasContributions = !! contributionData
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: ANIMATION_DURATION.pageTransition,
        duration: ANIMATION_DURATION.pageTransition,
        ease: ANIMATION_EASING.easeInOut
      }}
      className={`
        items-stretch
        md:h-[500px]
        grid
        grid-cols-1
        ${hasContributions?"md:grid-cols-[18%_64%_18%]":"md:grid-cols-2"}
        md:grid-rows-[450px]
        `
    }
      role="region"
    >
      {hasContributions &&
        <div className="hidden md:flex justify-end items-center">
          <div className="w-full max-w-[200px]">
            <GitHubGrid weeks={contributionData.contributions} total={contributionData.total} period={period} />
          </div>
        </div>
      }

      <div className={`flex justify-center items-center w-full ${hasContributions ? '' : 'md:col-span-1'}`}>
        <HeroContext />
      </div>

      <div className={`hidden md:flex relative h-full w-full min-h-[300px] min-h-0 ${hasContributions ? '' : 'md:col-span-1'}`}>
        <TechCloud />
      </div>
    </motion.section>
  )
}

