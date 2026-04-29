'use client'

import { useState } from 'react'

export default function GridExpandPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 13, width: '100%', maxWidth: 200 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          marginBottom: 8,
          color: 'var(--color-accent)',
          background: 'transparent',
          border: '1px solid var(--color-accent)',
          borderRadius: 4,
          padding: '2px 10px',
          cursor: 'pointer',
          fontSize: 11,
          fontFamily: 'monospace',
        }}
      >
        {open ? 'collapse .wrapper' : 'expand .wrapper'}
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 300ms ease',
          overflow: 'hidden',
          border: `1px dashed ${open ? 'var(--color-accent)' : 'var(--color-secondary)'}`,
          borderRadius: 4,
        }}
      >
        <div style={{ minHeight: 0, overflow: 'hidden', padding: open ? 8 : '0 8px', color: 'var(--color-primary)', fontSize: 12 }}>
          hidden content
        </div>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-secondary)' }}>
        {open ? 'height: natural' : 'height: 0'}
      </div>
    </div>
  )
}
