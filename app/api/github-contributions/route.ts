import { NextResponse } from 'next/server'
import { GitHubApiResponse } from '@/lib/types'
import type { ContributionData, ContributionDay } from '@/lib/types'

const GITHUB_USERNAME = 'wy8881'
const CACHE_DURATION = 3600

function convertToWeeks(contributions: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = []
  
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }
  
  return weeks
}

export async function GET() {
  try {
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
    const processedData: ContributionData = {
      total: rawData.total,
      contributions: convertToWeeks(rawData.contributions)
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