export default function MdxOl({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-decimal pl-6 mb-5 text-text" style={{ lineHeight: '1.75' }}>
      {children}
    </ol>
  )
}
