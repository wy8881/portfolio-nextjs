'use client'

import type { NowItem } from '@/types/now'

export interface ItemListProps {
  items: NowItem[]
  committed: NowItem[]
  activeIndex: number | null
  onActivate: (index: number | null) => void
  onToggle: (item: NowItem) => void
}

const ItemList = ({ items, committed, activeIndex, onActivate, onToggle }: ItemListProps) => (
  <ul className="flex flex-col gap-1 mt-10">
    {items.map((item, i) => {
      const done = item.completedAt !== null
      const localOnly = done && committed[i].completedAt === null
      return (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onToggle(committed[i])}
            onPointerEnter={() => onActivate(i)}
            onPointerLeave={() => onActivate(null)}
            onFocus={() => onActivate(i)}
            onBlur={() => onActivate(null)}
            aria-pressed={done}
            className="w-full flex items-center gap-3 text-left py-2 px-3 rounded-lg transition-colors"
            style={{ background: activeIndex === i ? 'var(--color-artifact)' : 'transparent' }}
          >
            <span
              className="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: done ? 'var(--color-accent)' : 'var(--color-secondary)',
                background: done ? 'var(--color-accent)' : 'transparent',
                opacity: done ? 1 : 0.55,
              }}
            />
            <span className="flex-1 text-sm" style={{ color: 'var(--color-text)', opacity: done ? 0.6 : 1 }}>
              {item.text}
            </span>
            {localOnly && <span className="text-xs text-secondary">this device</span>}
          </button>
        </li>
      )
    })}
  </ul>
)

export default ItemList
