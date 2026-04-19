export default function MdxCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-artifact text-primary rounded px-1.5 py-0.5 text-sm font-mono">
      {children}
    </code>
  )
}
