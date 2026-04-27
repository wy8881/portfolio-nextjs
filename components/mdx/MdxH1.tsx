export default function MdxH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-primary font-bold mt-8 mb-3 leading-tight"
        style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
      {children}
    </h1>
  )
}
