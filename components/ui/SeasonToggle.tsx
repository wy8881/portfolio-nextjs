'use client'

import { useEffect, useRef, useState } from 'react'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

const SEASONS: { id: Season; emoji: string; label: string }[] = [
  { id: 'spring', emoji: '🌸', label: 'Spring' },
  { id: 'summer', emoji: '☀️', label: 'Summer' },
  { id: 'autumn', emoji: '🍂', label: 'Autumn' },
  { id: 'winter', emoji: '❄️', label: 'Winter' },
]

const ACCENT_COLORS: Record<Season, string> = {
  spring: '#e05c8a',
  summer: '#166534',
  autumn: '#f97316',
  winter: '#7eb8f7',
}

export default function SeasonToggle() {
  const [season, setSeason] = useState<Season>('summer')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('season') as Season | null
    if (stored) setSeason(stored)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectSeason(s: Season) {
    setSeason(s)
    setOpen(false)
    localStorage.setItem('season', s)
    document.documentElement.setAttribute('data-season', s)
  }

  const current = SEASONS.find(s => s.id === season)!
  const accentColor = ACCENT_COLORS[season]

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Expanded pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: '40px',
          padding: open ? '8px 8px' : '0',
          boxShadow: open ? '0 4px 24px rgba(0,0,0,0.18)' : 'none',
          overflow: 'hidden',
          maxWidth: open ? '360px' : '0px',
          opacity: open ? 1 : 0,
          transition: 'max-width 0.3s ease, opacity 0.2s ease, padding 0.3s ease',
          marginRight: open ? '8px' : '0',
          gap: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        {SEASONS.map(s => (
          <button
            key={s.id}
            onClick={() => selectSeason(s.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: s.id === season ? 700 : 400,
              background: s.id === season ? `${ACCENT_COLORS[s.id]}20` : 'transparent',
              color: s.id === season ? ACCENT_COLORS[s.id] : '#666',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: '18px' }}>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Collapsed circle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Switch season theme"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: `2px solid ${accentColor}`,
          background: '#fff',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          flexShrink: 0,
          transition: 'border-color 0.3s',
        }}
      >
        {current.emoji}
      </button>
    </div>
  )
}
