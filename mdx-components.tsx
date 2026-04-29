import type { MDXComponents } from 'mdx/types'
import Takeaway from '@/components/mdx/Takeaway'
import Callout from '@/components/mdx/Callout'
import LinkCard from '@/components/mdx/LinkCard'
import FlowCompare from '@/components/mdx/FlowCompare'
import MdxH1 from '@/components/mdx/MdxH1'
import MdxH2 from '@/components/mdx/MdxH2'
import MdxH3 from '@/components/mdx/MdxH3'
import MdxP from '@/components/mdx/MdxP'
import MdxA from '@/components/mdx/MdxA'
import MdxCode from '@/components/mdx/MdxCode'
import MdxPre from '@/components/mdx/MdxPre'
import MdxBlockquote from '@/components/mdx/MdxBlockquote'
import MdxHr from '@/components/mdx/MdxHr'
import MdxStrong from '@/components/mdx/MdxStrong'
import MdxUl from '@/components/mdx/MdxUl'
import MdxOl from '@/components/mdx/MdxOl'
import MdxLi from '@/components/mdx/MdxLi'
import MdxTable from '@/components/mdx/MdxTable'
import MdxTh from '@/components/mdx/MdxTh'
import MdxTd from '@/components/mdx/MdxTd'
import CSSDemo from '@/components/mdx/CSSDemo'
import GridExpandPreview from '@/components/mdx/GridExpandPreview'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Takeaway,
    Callout,
    LinkCard,
    FlowCompare,
    CSSDemo,
    GridExpandPreview,
    h1: MdxH1,
    h2: MdxH2,
    h3: MdxH3,
    p: MdxP,
    a: MdxA,
    code: MdxCode,
    pre: MdxPre,
    blockquote: MdxBlockquote,
    hr: MdxHr,
    strong: MdxStrong,
    ul: MdxUl,
    ol: MdxOl,
    li: MdxLi,
    table: MdxTable,
    th: MdxTh,
    td: MdxTd,
    ...components,
  }
}
