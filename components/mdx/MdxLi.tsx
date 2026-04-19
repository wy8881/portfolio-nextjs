export default function MdxLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="mb-1 text-text" style={{ lineHeight: '1.75' }}>
      {children}
    </li>
  )
}
