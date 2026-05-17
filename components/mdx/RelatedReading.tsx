import LinkCard from './LinkCard'

interface RelatedReadingProps {
  slugs: string[]
}

export default function RelatedReading({ slugs }: RelatedReadingProps) {
  return (
    <div className="mt-16 pt-8 border-t border-artifact">
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-xl font-bold text-primary shrink-0">Further Reading</h2>
        <div className="h-px flex-1" style={{ background: 'var(--color-artifact)' }} />
      </div>
      {slugs.map((slug) => (
        <LinkCard key={slug} href={`/blog/${slug}`} />
      ))}
    </div>
  )
}
