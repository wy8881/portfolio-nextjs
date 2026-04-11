'use client'

import { useEffect, useRef, useState } from 'react'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

function getInitialSeason(): Season {
  if (typeof window === 'undefined') return 'summer'
  return (localStorage.getItem('season') as Season) || 'summer'
}

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
  const [season, setSeason] = useState<Season>(getInitialSeason)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
      className="fixed bottom-6 right-6 z-[100] flex items-center justify-end"
    >
      {/* Grid wrapper — animates width to fit-content */}
      <div
        className={`grid transition-[grid-template-columns,opacity,margin] duration-300 ease-in-out ${
          open ? 'grid-cols-[1fr] opacity-100 mr-2' : 'grid-cols-[0fr] opacity-0 mr-0'
        }`}
      >
        {/* Inner pill */}
        <div className="overflow-hidden flex items-center bg-white rounded-[40px] p-2 gap-1 whitespace-nowrap shadow-[0_4px_24px_rgba(0,0,0,0.18)]">
          {SEASONS.map(s => (
            <button
              key={s.id}
              onClick={() => selectSeason(s.id)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border-0 cursor-pointer text-[13px] transition-colors"
              style={{
                fontWeight: s.id === season ? 700 : 400,
                background: s.id === season ? `${ACCENT_COLORS[s.id]}20` : 'transparent',
                color: s.id === season ? ACCENT_COLORS[s.id] : '#666',
              }}
            >
              <span className="text-lg">{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Circle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Switch season theme"
        className="w-14 h-14 rounded-full bg-white cursor-pointer text-2xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors"
        style={{ border: `2px solid ${accentColor}` }}
      >
        {current.emoji}
      </button>
    </div>
  )
}
