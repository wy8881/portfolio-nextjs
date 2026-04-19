export default function MdxBlockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="border-l-2 border-accent italic my-5 pl-4 rounded-r-sm"
      style={{ background: 'color-mix(in srgb, var(--color-accent) 7%, transparent)' }}>
      <div className="py-2 text-secondary">
        {children}
      </div>
    </blockquote>
  )
}
