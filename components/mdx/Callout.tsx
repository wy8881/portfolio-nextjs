interface CalloutProps {
  title?: string
  children: React.ReactNode
}

export default function Callout({ title = 'My Code', children }: CalloutProps) {
  return (
    <div
      className="border-l-2 border-accent pl-4 my-6 rounded-r-sm"
      style={{ background: 'color-mix(in srgb, var(--color-accent) 7%, transparent)' }}
    >
      <div className="py-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          {title}
        </p>
        <div className="text-sm text-secondary" style={{ lineHeight: '1.75' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
