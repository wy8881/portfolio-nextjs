'use client'

import type { ContributionDay, ContributionLevel } from '@/lib/types'
import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

const getColorByLevel = (level: ContributionLevel): string => {
  const colorMap: Record<ContributionLevel, string> = {
    0: '#eceff2',    
    1: '#d6dce1',   
    2: '#aeb7bf',   
    3: '#7a8692',  
    4: '#4f5963',   
  }
  return colorMap[level]
}

const GRID_STYLES = {
  cellSize: {
    4: 'clamp(28px, 3vw, 40px)',
    12: 'clamp(22px, 2.5vw, 32px)',
    52: 'clamp(16px, 2vw, 24px)',
    100: 'clamp(12px, 1.2vw, 18px)',
  },
  gap: {
    4: 'clamp(20px, 2.5vw, 30px)',
    12: 'clamp(14px, 1.5vw, 20px)',
    52: 'clamp(10px, 1.2vw, 15px)',
    100: 'clamp(6px, 0.8vw, 10px)',
  },
  labelWidth: {
    4: 'clamp(53px, 7vw, 80px)',
    12: 'clamp(43px, 5vw, 64px)',
    52: 'clamp(32px, 4vw, 50px)',
    100: 'clamp(21px, 3vw, 32px)',
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

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0,
    },
  },
}

const cellVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.hero.cell,
      ease: ANIMATION_EASING.standard,
    },
  },
}

const labelVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.hero.cell,
      ease: ANIMATION_EASING.standard,
    },
  },
}

interface ContributionCellProps {
  day: ContributionDay
  cellSize: string
}

function ContributionCell({ day, cellSize }: ContributionCellProps) {
  const color = getColorByLevel(day.level)
  return (
    <motion.div
      variants={cellVariants}
      whileHover={{
        scale: 1.2,
        transition: {
          duration: ANIMATION_DURATION.hero.hover,
          ease: ANIMATION_EASING.standard
        }
      }}
      className="rounded-md will-change-transform"
      style={{ 
        width: cellSize,
        height: cellSize,
        backgroundColor: color,
      }}
      title={`${day.date}: ${day.count} contributions`}
      role="gridcell"
      aria-label={`${day.date}: ${day.count} contributions`}
      />
  )
}

interface GitHubGridProps {
  weeks: ContributionDay[][]
  total: number
  period: number
}

export function GitHubGrid({ weeks, total, period }: GitHubGridProps) {
  const weekCount = weeks.length
  const config = getGridConfig(weekCount)

  return (
    <div className="hidden md:block w-full">
      <div className="relative">
        <div className="overflow-x-auto hide-scrollbar">
          <motion.div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, ${config.cellSize})`,
              gridTemplateRows: `repeat(7, ${config.cellSize})`,
              gap: config.gap,
              width: 'max-content',
              minWidth: '100%',
            }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
              <Fragment key={dayIndex}>
                {weeks.map((week, weekIndex) => {
                  const day = week[dayIndex]
                  if (!day) return <div key={`empty-${weekIndex}`} />
                  return (
                    <ContributionCell 
                      key={`${day.date}-${weekIndex}`}
                      day={day} 
                      cellSize={config.cellSize} />
                  )
                })}
              </Fragment>
          ))}
          </motion.div>
        </div>
        <div 
          className="absolute top-0 left-0 bottom-0 w-8 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.7), transparent)',
          }}
        />
        <div 
          className="absolute top-0 right-0 bottom-0 w-8 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(255, 255, 255, 0.7), transparent)',
          }}
        />
      </div>
      <div className="mt-3 text-sm text-text-secondary text-left">
        {total} contributions during the last {period} days
      </div>
    </div>
  )
}