import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts } from '@/lib/blog'
import { PostMetadata } from '@/types/blog'
import BlogPostLayout from '@/components/blog/BlogPostLayout'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const mod = await import(`@/content/blog/${slug}.mdx`)
    const metadata = mod.metadata as PostMetadata
    return {
      title: `${metadata.title} - Yi Wang`,
      description: metadata.description,
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  let Post: React.ComponentType
  let metadata: PostMetadata

  try {
    const mod = await import(`@/content/blog/${slug}.mdx`)
    Post = mod.default
    metadata = mod.metadata as PostMetadata
  } catch {
    notFound()
  }

  return (
    <BlogPostLayout
      title={metadata!.title}
      date={metadata!.date}
      description={metadata!.description}
      tags={metadata!.tags}
    >
      <article className="relative z-[2]">
        <Post />
      </article>
    </BlogPostLayout>
  )
}
