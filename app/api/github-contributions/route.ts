import { NextResponse } from 'next/server'
import { GitHubApiResponse } from '@/lib/types'
import type { ContributionData, ContributionDay } from '@/lib/types'

const GITHUB_USERNAME = 'wy8881'
const CACHE_DURATION = 3600

function getPreviousMonday(date: Date): Date {
  const dayOfWeek = date.getDay() 
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(date)
  monday.setDate(date.getDate() - daysToSubtract)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function reorganizeByMonday(contributions: ContributionDay[]): ContributionDay[][] {
  if (contributions.length === 0) return []

  
  const contributionMap = new Map<string, ContributionDay>()
  contributions.forEach(day => {
    contributionMap.set(day.date, day)
  })
  const firstDate = new Date(contributions[0].date)
  const lastDate = new Date(contributions[contributions.length - 1].date)
  

  const startMonday = getPreviousMonday(firstDate)
  const endMonday = getPreviousMonday(lastDate)
  const weeks: ContributionDay[][] = []
  const currentMonday = new Date(startMonday)
  
  while (currentMonday <= endMonday) {
    const week: ContributionDay[] = []
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(currentMonday)
      currentDate.setDate(currentMonday.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      
      if (contributionMap.has(dateStr)) {
        week.push(contributionMap.get(dateStr)!)
      } else {
        week.push({
          date: dateStr,
          count: 0,
          level: 0
        })
      }
    }
    
    weeks.push(week)
    
    currentMonday.setDate(currentMonday.getDate() + 7)
  }
  
  return weeks
}

function convertToWeeks(contributions: ContributionDay[]): ContributionDay[][] {
  if (contributions.length === 0) return []
  
  const weeks: ContributionDay[][] = []
  
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }
  return weeks
}

function filterDaysByDateRange(days: ContributionDay[], startDate: Date, endDate: Date): ContributionDay[] {
  return days.filter(day => {
    const dayDate = new Date(day.date)
    return dayDate >= startDate && dayDate <= endDate
  })
}

function calculateTotal(contributions: ContributionDay[]): number {
  return contributions.reduce((sum, day) => sum + day.count, 0)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') // days, e.g., 30, 90, 365
    const start = searchParams.get('start') // YYYY-MM-DD
    const end = searchParams.get('end') // YYYY-MM-DD
    
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    let startDate: Date
    let endDate: Date = today
    
    if (start && end) {
      startDate = new Date(start)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(end)
      endDate.setHours(23, 59, 59, 999)
    } else if (period) {
      const days = parseInt(period, 10)
      if (isNaN(days) || days <= 0) {
        return NextResponse.json<GitHubApiResponse>(
          { error: 'Invalid period parameter' },
          { status: 400 }
        )
      }
      startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)
    } else {
      startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)
      startDate.setHours(0, 0, 0, 0)
    }
    const mondayStart = getPreviousMonday(startDate)

    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`,
      {
        next: { 
          revalidate: CACHE_DURATION
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const rawData = await response.json()
    const filterDays = filterDaysByDateRange(rawData.contributions, mondayStart, endDate)
    const convertedWeeks = convertToWeeks(filterDays)
    const total = calculateTotal(filterDays)
    
    const processedData: ContributionData = {
      total,
      contributions: convertedWeeks
    }
    return NextResponse.json<GitHubApiResponse>({ data: processedData })

  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error)
    
    return NextResponse.json<GitHubApiResponse>(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    )
  }
}