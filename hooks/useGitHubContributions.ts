'use client'

import useSWR from 'swr'
import type { GitHubApiResponse, ContributionData } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useGitHubContributions() {
  const { data, error, isLoading } = useSWR<GitHubApiResponse>(
    '/api/github-contributions',
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