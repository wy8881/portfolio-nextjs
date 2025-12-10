'use client'

import type { ContributionDay, ContributionLevel } from '@/lib/types'
import { motion } from 'framer-motion'
import { Fragment } from 'react'
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
  cellSize: {
    4: 'clamp(27px, 3vw, 40px)',
    12: 'clamp(21px, 3vw, 32px)',
    52: 'clamp(16px, 2vw, 24px)',
    100: 'clamp(10px, 1vw, 16px)',
  },
  gap: {
    4: 'clamp(16px, 2vw, 24px)',
    12: 'clamp(11px, 1vw, 16px)',
    52: 'clamp(8px, 1vw, 12px)',
    100: 'clamp(5px, 0.5vw, 8px)',
  },
  labelWidth: {
    4: 'clamp(106px, 14vw, 160px)',
    12: 'clamp(86px, 10vw, 128px)',
    52: 'clamp(64px, 8vw, 100px)',
    100: 'clamp(42px, 6vw, 64px)',
  },
  labelFontSize: {
    4: 'clamp(16px, 2vw, 22px)',
    12: 'clamp(14px, 1.6vw, 20px)',
    52: 'clamp(12px, 1.5vw, 18px)',
    100: 'clamp(10px, 1.4vw, 16px)',
  },
}

function getGridConfig(weekCount: number) {
  const key = weekCount <= 4 ? 4
    : weekCount <= 12 ? 12
    : weekCount <= 52 ? 52
    : 100
  
  return {
    cellSize: GRID_STYLES.cellSize[key],
    gap: GRID_STYLES.gap[key],
    labelWidth: GRID_STYLES.labelWidth[key],
    labelFontSize: GRID_STYLES.labelFontSize[key],
  }
}

interface ContributionCellProps {
  day: ContributionDay
  delay: number
  cellSize: string
}

function ContributionCell({ day, delay, cellSize }: ContributionCellProps) {
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
        width: cellSize,
        height: cellSize,
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
      className="hidden md:grid w-full max-w-full overflow-x-auto"
      style={{
        gridTemplateColumns: `${config.labelWidth} repeat(${weeks.length}, ${config.cellSize})`,
        gridTemplateRows: `auto repeat(7, ${config.cellSize})`,
        gap: config.gap
      }}
    >
      <div />
      {weeks.map((week, weekIndex) => {
        const label = monthLabels.find(l => l.weekIndex === weekIndex)
        return (
          <motion.div 
            key={weekIndex} 
            className="text-text-secondary text-center"
            style={{ fontSize: config.labelFontSize }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: ANIMATION_DURATION.hero.cell,
              delay: weekIndex * 0.05,
              ease: ANIMATION_EASING.standard
            }}
          >
            {label && <span>{label.month}</span>}
          </motion.div>
        )
      })}
      
      {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
        <Fragment key={dayIndex}>
          <motion.div 
            className="text-text-secondary flex items-center"
            style={{ fontSize: config.labelFontSize }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: ANIMATION_DURATION.hero.cell,
              delay: dayIndex * 0.05,
              ease: ANIMATION_EASING.standard
            }}
          >
            {yAxisDays.includes(dayIndex) && <span>{dayLabels[dayIndex]}</span>}
          </motion.div>
          
          {weeks.map((week, weekIndex) => {
            const day = week[dayIndex]
            if (!day) return <div key={`empty-${weekIndex}`} />
            return (
              <ContributionCell 
                key={`${day.date}-${weekIndex}`}
                day={day} 
                delay={(weekIndex * 7 + dayIndex) * 0.01}
                cellSize={config.cellSize} />
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}