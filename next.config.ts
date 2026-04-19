import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['three'],
  images: {
    qualities: [75, 90],
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [rehypePrettyCode, { theme: 'tokyo-night' }],
    ],
  },
})

export default withMDX(nextConfig)
