export default function MdxCode({ children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  if ('data-language' in props) {
    return <code {...props}>{children}</code>
  }
  return (
    <code className="bg-artifact text-primary rounded px-1.5 py-0.5 text-sm font-mono">
      {children}
    </code>
  )
}
