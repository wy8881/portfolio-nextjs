'use client'

import { useGitHubContributions } from '@/hooks/useGitHubContributions'
import { GitHubGrid } from '@/components/home/hero/GitHubGrid'
import { Hero } from '@/components/home/hero/HeroContext'
import { TechCloud } from '@/components/home/hero/TechCloud'

export function HeroSection() {
  const { contributions, isLoading, isError } = useGitHubContributions({ period: 30 })
  
  return (
    <section 
      className="
        grid 
        grid-cols-1
        md:grid-cols-[15%_70%_15%]
        lg:grid-cols-[1fr_3fr_1fr]
        gap-4 md:gap-6 lg:gap-8
        px-4 md:px-6 lg:px-8
        pt-4 md:pt-6 pb-12 lg:pb-16
        items-stretch
        "
    aria-label="Hero Section"
    role="region"
    >
      <div className="hidden md:flex justify-center items-center">
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-text-secondary">Loading...</div>
          </div>
        )}
        {isError && null}
        {!isLoading && !isError && contributions && (
          <GitHubGrid weeks={contributions.contributions} />
        )}
      </div>

      <div className="flex justify-center items-center w-full">
        <Hero />
      </div>

      <div className="hidden md:flex justify-center items-stretch h-full">
        <TechCloud />
      </div>
    </section>
  )
}

