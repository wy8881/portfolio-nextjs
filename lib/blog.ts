import fs from 'fs'
import path from 'path'
import { BlogPost, PostMetadata } from '@/types/blog'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const mod = await import(`@/content/blog/${slug}.mdx`)
      const metadata = mod.metadata as PostMetadata

      return {
        slug,
        title: metadata.title,
        date: metadata.date,
        description: metadata.description,
        tags: metadata.tags ?? [],
        content: '',
      } satisfies BlogPost
    })
  )

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const mod = await import(`@/content/blog/${slug}.mdx`)
  const metadata = mod.metadata as PostMetadata

  return {
    slug,
    title: metadata.title,
    date: metadata.date,
    description: metadata.description,
    tags: metadata.tags ?? [],
    content: '',
  }
}
