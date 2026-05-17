import LinkCard from './LinkCard'

interface RelatedReadingProps {
  slugs: string[]
}

export default function RelatedReading({ slugs }: RelatedReadingProps) {
  return (
    <div className="mt-16 pt-8 border-t border-artifact">
      <h2 className="text-xl font-bold text-primary mb-6">Further Reading</h2>
      {slugs.map((slug) => (
        <LinkCard key={slug} href={`/blog/${slug}`} />
      ))}
    </div>
  )
}
