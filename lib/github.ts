import { ContributionData, ContributionDay } from '@/lib/types'

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

export async function getGithubData(period: number = 60) { 
    try{
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        
        const endDate: Date = today
        if (!period || period <= 0) {
            period = 30
        }
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - period)
        startDate.setHours(0, 0, 0, 0)
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
        return processedData


    } catch (error) {
        console.error('Error fetching GitHub contributions:', error)
        return null
    }
}