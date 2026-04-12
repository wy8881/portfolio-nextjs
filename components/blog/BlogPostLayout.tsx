import Link from 'next/link'

interface BlogPostLayoutProps {
  title: string
  date: string
  description: string
  tags: string[]
  children: React.ReactNode
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export default function BlogPostLayout({ title, date, description, tags, children }: BlogPostLayoutProps) {
  return (
    <div className="min-h-dvh bg-background pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">

        <time className="text-sm text-secondary block mb-2">{formatDate(date)}</time>
        <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-secondary mb-6">{description}</p>

        <div className="flex gap-2 mb-10 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-artifact text-accent">
              {tag}
            </span>
          ))}
        </div>

        <hr className="border-artifact mb-10" />

        {children}

        <Link href="/blog" className="text-sm text-secondary hover:text-accent transition-colors mt-12 inline-block">
          ← Back to blog
        </Link>

      </div>
    </div>
  )
}
