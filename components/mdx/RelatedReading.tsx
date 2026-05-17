import LinkCard from './LinkCard'

interface RelatedReadingProps {
  slugs: string[]
}

export default function RelatedReading({ slugs }: RelatedReadingProps) {
  return (
    <div className="my-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
        Further Reading
      </p>
      <hr className="border-artifact mb-2" />
      {slugs.map((slug) => (
        <LinkCard key={slug} href={`/blog/${slug}`} />
      ))}
    </div>
  )
}
