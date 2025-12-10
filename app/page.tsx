'use client'

import { useGitHubContributions } from '@/hooks/useGitHubContributions'
import { GitHubGrid } from '@/components/home/hero/GitHubGrid'
import { Hero } from '@/components/home/hero/HeroContext'

export default function TestPage() {
  const { contributions } = useGitHubContributions({ period: 30 })
  
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-12 lg:gap-16 px-6 py-8 md:py-12 lg:py-16 min-h-screen">
      <div className="flex-1 flex justify-center md:justify-end">
        {contributions && <GitHubGrid weeks={contributions.contributions} />}
      </div>
      <div className="flex-1 max-w-2xl">
        <Hero />
      </div>
      

    </div>
  )
}