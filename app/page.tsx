import { HeroSection } from '@/components/home/hero/Hero'
import FeaturedProjects from '@/components/home/featuredProjects/FeaturedProjects'
import type { Metadata } from 'next'
import { getGithubData } from '@/lib/github'
import { g, p } from 'framer-motion/client'

export const metadata: Metadata = {
  title: "Yi's Portfolio",
  description: 'Master of Computer Science graduate specializing in full-stack development, data analysis, and machine learning. Based in Adelaide, Australia.',
  keywords: ['full-stack developer', 'React', 'Next.js', 'Spring Boot', 'Machine Learning', 'Adelaide'],
  icons: {
    icon: '/images/icon.svg',
  },
  openGraph: {
    title: "Yi's Portfolio",
    description: 'Full-stack developer and data enthusiast',
    url: 'https://yiwang.me',
    siteName: "Yi's Portfolio",
    locale: 'en_AU',
    type: 'website',
  },
}

export default async function HomePage() {
  const PERIOD = 60
  const contributionDataResponse = await getGithubData(PERIOD)

  return (
    <>
      <section 
      aria-label="Hero section"
      className=" px-6 md:px-8 lg:px-12 pt-4 md:pt-6 pb-12 lg:pb-16"
      > 
        <HeroSection contributionData={contributionDataResponse ?? undefined} period={PERIOD} />
        {/* <HeroSection/> */}
      </section>
      <section aria-label="Featured projects section">
        <FeaturedProjects />
      </section>
    </>
  )
}