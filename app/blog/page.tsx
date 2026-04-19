import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { BlogPost } from '@/types/blog'

export const metadata: Metadata = {
  title: 'Blog - Yi Wang',
  description: 'Thoughts on full-stack development, machine learning, and things I\'m building.',
}

const CUSTOM_POSTS: BlogPost[] = [
  {
    slug: 'pretext-canvas-text-layout',
    title: 'Canvas Text Layout',
    date: '2026-04-10',
    description: 'How a canvas-based text layout engine inverts CSS — measuring text, carving slots around obstacles, and reflowing around moving objects in real time.',
    tags: ['canvas', 'text-layout', 'typescript', 'animation'],
    content: '',
  },
]

export default async function BlogPage() {
  const mdxPosts = await getAllPosts()
  const allPosts = [...CUSTOM_POSTS, ...mdxPosts].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="min-h-dvh pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4">Blog</h1>
        <p className="text-secondary mb-16">Thoughts on things I&apos;m building and learning.</p>

        {allPosts.length === 0 ? (
          <p className="text-secondary">No posts yet. Check back soon.</p>
        ) : (
          <ul className="flex flex-col gap-10">
            {allPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <time className="text-sm text-secondary">{post.date}</time>
                  <h2 className="text-xl font-semibold text-primary mt-1 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-secondary mt-2">{post.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-artifact text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
