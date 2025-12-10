'use client'

import type { ContributionDay, ContributionLevel } from '@/lib/types'
import { motion } from 'framer-motion'

const getColorByLevel = (level: ContributionLevel): string => {
  const colorMap: Record<ContributionLevel, string> = {
    0: '#eef1f4',    
    1: '#c8d0d9',   
    2: '#9eabb8',   
    3: '#6c7a89',  
    4: '#2b333a',   

    
  }
  return colorMap[level]
}

interface ContributionCellProps {
  day: ContributionDay
  delay: number
}

function ContributionCell({ day, delay }: ContributionCellProps) {
  const color = getColorByLevel(day.level)
  return (
    <motion.div
      initial={{ opacity: 0, x:-20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeInOut' }}
      whileHover={{ scale: 1.1 }}
      className="
        w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4
        rounded-sm cursor-pointer
        transition-transform
      "
      style={{ backgroundColor: color }}
      title={`${day.date}: ${day.count} contributions`}
      role="gridcell"
      aria-label={`${day.date}: ${day.count} contributions`}
      />

  )
}

interface GitHubGridProps {
  weeks: ContributionDay[][]
  month?: number 
}

export function GitHubGrid({ weeks, month = 1}: GitHubGridProps) {
  const cutoffDate = new Date()
  cutoffDate.setMonth(cutoffDate.getMonth() - month)
  cutoffDate.setHours(0, 0, 0, 0)
  
  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today
  
  const filteredWeeks = weeks
    .map(week => 
      week.filter(day => {
        const dayDate = new Date(day.date)
        dayDate.setHours(0, 0, 0, 0)
        return dayDate >= cutoffDate && dayDate <= today
      })
    )
    .filter(week => week.length > 0)
  
  const monthLabels: { weekIndex: number; month: string }[] = []
  const seenMonths = new Set<string>()
  
  filteredWeeks.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const firstDay = new Date(week[0].date)
      const monthKey = `${firstDay.getFullYear()}-${firstDay.getMonth()}`
      
      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey)
        const monthName = firstDay.toLocaleDateString('en-US', { month: 'short' })
        monthLabels.push({ weekIndex, month: monthName })
      }
    }
  })

  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-1 pt-[2px]">
        {filteredWeeks.map((week, weekIndex) => {
          const label = monthLabels.find(l => l.weekIndex === weekIndex)
          return (
            <div 
              key={weekIndex} 
              className="h-3 md:h-3.5 lg:h-4 flex items-center text-xs text-text-secondary"
            >
              {label && <span>{label.month}</span>}
            </div>
          )
        })}
      </div>
      
      <div className="flex gap-1">
        {filteredWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <ContributionCell 
                key={day.date} 
                day={day} 
                delay={weekIndex * 0.1 + dayIndex * 0.05} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}