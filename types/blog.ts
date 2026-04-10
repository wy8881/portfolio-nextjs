export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  content: string
}

export interface BlogFrontmatter {
  title: string
  date: string
  description: string
  tags: string[]
}
