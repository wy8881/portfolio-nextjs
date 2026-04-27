interface TakeawayProps {
  title?: string
  children: React.ReactNode
}

export default function Takeaway({ title = 'Takeaway', children }: TakeawayProps) {
  return (
    <div className="border-l-2 border-accent pl-4 my-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
        {title}
      </p>
      <div className="text-secondary text-sm" style={{ lineHeight: '1.75' }}>
        {children}
      </div>
    </div>
  )
}
