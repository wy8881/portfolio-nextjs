interface CalloutProps {
  title?: string
  children: React.ReactNode
}

export default function Callout({ title = 'My Code', children }: CalloutProps) {
  return (
    <div
      className="border-l-2 pl-4 my-6 rounded-r-sm"
      style={{
        borderColor: 'var(--color-secondary)',
        background: 'color-mix(in srgb, var(--color-artifact) 35%, transparent)',
      }}
    >
      <div className="py-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-secondary)' }}>
          {title}
        </p>
        <div className="text-sm" style={{ color: 'var(--color-secondary)', lineHeight: '1.75' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
