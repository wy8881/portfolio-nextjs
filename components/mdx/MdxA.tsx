export default function MdxA({ href, children }: { href?: string; children: React.ReactNode }) {
  return (
    <a href={href}
       className="text-accent underline transition-opacity hover:opacity-70"
       style={{ textUnderlineOffset: '2px' }}>
      {children}
    </a>
  )
}
