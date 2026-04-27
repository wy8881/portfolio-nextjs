export default function MdxUl({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc pl-6 mb-5 text-text" style={{ lineHeight: '1.75' }}>
      {children}
    </ul>
  )
}
