'use client'

import type { ContributionDay, ContributionLevel } from '@/lib/types'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

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

const GRID_STYLES = {
  cell: {
    4: {
      width: 'clamp(27px, 3vw, 40px)',
      height: 'clamp(27px, 3vw, 40px)',
    },
    12: {
      width: 'clamp(21px, 3vw, 32px)',
      height: 'clamp(21px, 3vw, 32px)',
    },
    52: {
      width: 'clamp(16px, 2vw, 24px)',
      height: 'clamp(16px, 2vw, 24px)',
    },
    100: {
      width: 'clamp(10px, 1vw, 16px)',
      height: 'clamp(10px, 1vw, 16px)',
    },
  },
  gap: {
    4: 'clamp(16px, 2vw, 24px)',
    12: 'clamp(11px, 1vw, 16px)',
    52: 'clamp(8px, 1vw, 12px)',
    100: 'clamp(5px,0.5vw, 8px)',
  },
  text: {
    4: 'clamp(8px, 1vw, 11px)',
    12: 'clamp(7px, 0.8vw, 10px)',
    52: 'clamp(6px, 0.75vw, 9px)',
    100: 'clamp(5px, 0.7vw, 8px)',
  },
  label: {
    4: 'clamp(53x, 7vw, 80px)',
    12: 'clamp(43px, 5vw, 64px)',
    52: 'clamp(32px, 4vw, 50px)',
    100: 'clamp(21px, 3vw, 32px)',
  },
  paddingLeft: {
    4: 'clamp(53px, 7vw, 80px)',
    12: 'clamp(43px, 5vw, 64px)',
    52: 'clamp(32px, 4vw, 48px)',
    100: 'clamp(21px, 3vw, 32px)',
  }
}

function getGridConfig(weekCount: number) {
  const key = weekCount <= 4 ? 4
    : weekCount <= 12 ? 12
    : weekCount <= 52 ? 52
    : 100
  
  return {
    cell: GRID_STYLES.cell[key],
    gap: GRID_STYLES.gap[key],
    text: GRID_STYLES.text[key],
    label: GRID_STYLES.label[key],
    paddingLeft: GRID_STYLES.paddingLeft[key],
  }
}

interface ContributionCellProps {
  day: ContributionDay
  delay: number
  cellStyle: { width: string; height: string }
}

function ContributionCell({ day, delay, cellStyle }: ContributionCellProps) {
  const color = getColorByLevel(day.level)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: ANIMATION_DURATION.hero.cell, 
        delay: Math.min(delay, 0.6), 
        ease: ANIMATION_EASING.standard
      }}
      whileHover={{
        scale: 1.2,
        transition: {
          duration: ANIMATION_DURATION.hero.hover,
          ease: ANIMATION_EASING.standard
        }
      }}
      className="rounded-full"
      style={{ 
        width: cellStyle.width,
        height: cellStyle.height,
        backgroundColor: color,
        willChange: 'transform, opacity'
      }}
      title={`${day.date}: ${day.count} contributions`}
      role="gridcell"
      aria-label={`${day.date}: ${day.count} contributions`}
      />
  )
}

interface GitHubGridProps {
  weeks: ContributionDay[][]
}

export function GitHubGrid({ weeks }: GitHubGridProps) {
  const weekCount = weeks.length
  const config = getGridConfig(weekCount)
  
  const monthLabels: { weekIndex: number; month: string }[] = []
  const seenMonths = new Set<string>()
  
  weeks.forEach((week, weekIndex) => {
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

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const yAxisDays = [1, 3, 5]

  return (
    <div 
      className="hidden md:flex flex-col w-full max-w-full overflow-x-auto"
      style={{ gap: config.gap }}
    >
      <div 
        className="flex"
        style={{ gap: config.gap, paddingLeft: config.paddingLeft }}
      >
        {weeks.map((week, weekIndex) => {
          const label = monthLabels.find(l => l.weekIndex === weekIndex)
          return (
            <div 
              key={weekIndex} 
              className="flex items-start justify-center text-text-secondary"
              style={{ width: config.label, fontSize: config.text }}
            >
              {label && <span>{label.month}</span>}
            </div>
          )
        })}
      </div>
      
      <div 
        className="flex items-start"
        style={{ gap: config.gap }}
      >
        <div 
          className="flex flex-col pt-[2px]"
          style={{ gap: config.gap }}
        >
          {dayLabels.map((dayLabel, dayIndex) => {
            const shouldShow = yAxisDays.includes(dayIndex)
            return (
              <div 
                key={dayIndex} 
                className="flex items-center text-text-secondary"
                style={{ 
                  height: config.cell.height,
                  width: config.label,
                  fontSize: config.text
                }}
              >
                {shouldShow && <span>{dayLabel}</span>}
              </div>
            )
          })}
        </div>
        
        <div 
          className="flex"
          style={{ gap: config.gap }}
        >
          {weeks.map((week, weekIndex) => (
            <div 
              key={weekIndex} 
              className="flex flex-col"
              style={{ gap: config.gap }}
            >
              {week.map((day, dayIndex) => (
                <ContributionCell 
                  key={day.date} 
                  day={day} 
                  delay={(weekIndex * 7 + dayIndex) * 0.01}
                  cellStyle={config.cell} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}