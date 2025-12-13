export type ProjectCategory = 'Full-Stack' | 'ML / Data' | 'IT Support' | 'Frontend'

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  category: ProjectCategory
  github?: string | null
  liveDemo?: string | null
  publication?: string | null
  featured?: boolean
}

export interface Certification {
  id: number
  name: string
  details?: string
  year: number
  badge?: string | null
}

