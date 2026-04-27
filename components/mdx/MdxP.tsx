export default function MdxP({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text mb-5" style={{ lineHeight: '1.75' }}>
      {children}
    </p>
  )
}
