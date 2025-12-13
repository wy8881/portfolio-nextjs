'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import { ProjectCategory } from '@/types/projects'

interface FilterTabsProps {
  onFilterChange: (filter: ProjectCategory | 'All') => void
}

const filters: (ProjectCategory | 'All')[] = ['All', 'Full-Stack', 'Frontend', 'ML / Data', 'IT Support']

const FilterTabs = ({ onFilterChange }: FilterTabsProps) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'All'>('All')

  const handleFilterClick = (filter: ProjectCategory | 'All') => {
    setActiveFilter(filter)
    onFilterChange(filter)
  }

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
        md:gap-4
        mb-[clamp(3rem,5vw,4rem)]
      "
    >
      {filters.map((filter, index) => (
        <motion.button
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: ANIMATION_EASING.easeInOut
          }}
          onClick={() => handleFilterClick(filter)}
          className={`
            px-6
            py-3
            border-2
            rounded-full
            font-sans
            text-[clamp(0.875rem,1.5vw,1rem)]
            font-medium
            cursor-pointer
            transition-all
            duration-200
            ease-out
            ${
              activeFilter === filter
                ? 'bg-black text-white border-black'
                : 'bg-transparent text-[#666666] border-[#E5E5E5] hover:border-black hover:-translate-y-0.5'
            }
          `}
          aria-label={`Filter by ${filter}`}
        >
          {filter}
        </motion.button>
      ))}
    </div>
  )
}

export default FilterTabs

