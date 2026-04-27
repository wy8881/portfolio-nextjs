import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['three'],
  images: {
    qualities: [75, 90],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [
      ['rehype-pretty-code', { theme: 'tokyo-night' }],
    ],
  },
})

export default withMDX(nextConfig)
