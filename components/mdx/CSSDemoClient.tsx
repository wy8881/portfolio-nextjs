'use client'

import { useState } from 'react'

interface Tab {
  label: string
  highlightedCode: string
}

interface CSSDemoClientProps {
  tabs: Tab[]
  previews: React.ReactNode[]
}

export default function CSSDemoClient({ tabs, previews }: CSSDemoClientProps) {
  const [active, setActive] = useState(0)

  return (
    <div className="my-6 overflow-hidden rounded-r-md border border-artifact">
      {/* Tab bar */}
      <div className="flex border-b border-artifact bg-artifact/30 px-3 gap-1">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="cursor-pointer border-b-2 bg-transparent px-3 py-2 font-mono text-xs transition-colors"
            style={{
              borderBottomColor: i === active ? 'var(--color-accent)' : 'transparent',
              color: i === active ? 'var(--color-primary)' : 'var(--color-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-2">
        {/* Left: preview */}
        <div className="flex items-center justify-center p-6 border-r border-artifact min-h-40">
          {previews[active]}
        </div>

        {/* Right: code — matches MdxPre shell exactly */}
        <div
          className="border-l-2 border-accent overflow-x-auto"
          style={{ background: 'var(--color-code-bg)' }}
        >
          <pre
            className="p-4 text-sm leading-relaxed overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: tabs[active].highlightedCode }}
          />
        </div>
      </div>
    </div>
  )
}
