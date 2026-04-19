export default function MdxH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-secondary font-medium mt-6 mb-2 leading-snug"
        style={{ fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' }}>
      {children}
    </h3>
  )
}
