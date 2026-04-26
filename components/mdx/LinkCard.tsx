import { getPostBySlug } from '@/lib/blog'

interface LinkCardProps {
  href: string
  title?: string
  description?: string
}

interface LinkData {
  title: string
  description: string
  label: string
  isExternal: boolean
}

async function fetchOgData(url: string): Promise<{ title: string; description: string } | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot)' },
      next: { revalidate: false },
    })
    if (!res.ok) return null

    const html = await res.text()

    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1]
      ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
      ?? null

    const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1]
      ?? html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1]
      ?? null

    if (!ogTitle) return null
    return { title: ogTitle.trim(), description: (ogDesc ?? '').trim() }
  } catch {
    return null
  }
}

async function resolveLinkData(href: string, titleProp?: string, descProp?: string): Promise<LinkData> {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')

  if (!isExternal) {
    const slug = href.replace(/^\/blog\//, '')
    const post = await getPostBySlug(slug)
    return {
      title: titleProp ?? post?.title ?? href,
      description: descProp ?? post?.description ?? '',
      label: 'yi.dev / blog',
      isExternal: false,
    }
  }

  const domain = new URL(href).hostname.replace(/^www\./, '')

  if (titleProp) {
    return {
      title: titleProp,
      description: descProp ?? '',
      label: domain,
      isExternal: true,
    }
  }

  const og = await fetchOgData(href)
  return {
    title: og?.title ?? domain,
    description: descProp ?? og?.description ?? '',
    label: domain,
    isExternal: true,
  }
}

export default async function LinkCard({ href, title, description }: LinkCardProps) {
  const data = await resolveLinkData(href, title, description)

  return (
    <a
      href={href}
      target={data.isExternal ? '_blank' : undefined}
      rel={data.isExternal ? 'noopener noreferrer' : undefined}
      className="block border-l-2 border-accent pl-4 pr-3 py-3 my-6 rounded-r-md no-underline transition-opacity hover:opacity-75"
      style={{ background: 'color-mix(in srgb, var(--color-artifact) 40%, transparent)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-primary leading-snug">
          {data.title}
        </span>
        {data.isExternal && (
          <svg
            className="shrink-0 mt-0.5 text-accent opacity-70"
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M9 2h5v5M14 2L8 8" />
          </svg>
        )}
      </div>
      {data.description && (
        <p className="text-xs text-secondary leading-relaxed mb-1.5">
          {data.description}
        </p>
      )}
      <span className="text-xs text-accent opacity-75">
        {data.isExternal ? data.label : `↗ ${data.label}`}
      </span>
    </a>
  )
}
