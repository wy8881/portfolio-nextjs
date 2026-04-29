import type { ReactNode } from 'react'
import { codeToHtml } from 'shiki'
import CSSDemoClient from './CSSDemoClient'

interface TabInput {
  label: string
  code: string
  lang?: string
}

interface CSSDemoProps {
  tabs: TabInput[]
  previews: ReactNode[]
}

export default async function CSSDemo({ tabs, previews }: CSSDemoProps) {
  const highlightedTabs = await Promise.all(
    tabs.map(async (tab) => ({
      label: tab.label,
      highlightedCode: await codeToHtml(tab.code, {
        lang: tab.lang ?? 'css',
        theme: 'tokyo-night',
      }),
    }))
  )

  return <CSSDemoClient tabs={highlightedTabs} previews={previews} />
}
