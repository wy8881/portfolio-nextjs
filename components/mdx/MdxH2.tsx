export default function MdxH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-accent font-semibold mt-8 mb-3 leading-snug"
        style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}>
      {children}
    </h2>
  )
}
