'use client'

import useSWR from 'swr'
import type { GitHubApiResponse, ContributionData } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface UseGitHubContributionsOptions {
  period?: number // days, e.g., 30, 90, 365
  start?: string // YYYY-MM-DD
  end?: string // YYYY-MM-DD
}

export function useGitHubContributions(options?: UseGitHubContributionsOptions) {
  const { period, start, end } = options || {}
  
  const params = new URLSearchParams()
  if (period) {
    params.set('period', period.toString())
  }
  if (start) {
    params.set('start', start)
  }
  if (end) {
    params.set('end', end)
  }
  
  const queryString = params.toString()
  const url = `/api/github-contributions${queryString ? `?${queryString}` : ''}`
  console.log('url', url)
  
  const { data, error, isLoading } = useSWR<GitHubApiResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  )

  return {
    contributions: data?.data ?? null,
    isLoading,
    isError: !!error || !!data?.error,
    errorMessage: data?.error || error?.message
  }
}