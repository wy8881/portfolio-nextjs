export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
    date: string
    count: number
    level: ContributionLevel
}

export interface ContributionWeek {
    contributionDays: ContributionDay[]
}

export interface ContributionData {
    total: number
     contributions: ContributionDay[][]
}

export interface GitHubApiResponse {
    data?: ContributionData
    error?: string
}
