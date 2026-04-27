import React from 'react'

export default function MdxPre({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) {
  return (
    <div className="relative my-5 border-l-2 border-accent overflow-x-auto rounded-r-md"
         style={{ background: 'var(--color-code-bg)' }}>
      <pre {...props} className="p-4 text-sm leading-relaxed overflow-x-auto">
        {children}
      </pre>
    </div>
  )
}
