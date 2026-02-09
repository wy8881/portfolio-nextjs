import { Hero } from '@/components/home/hero/Hero'
import FeaturedProjects from '@/components/home/featuredProjects/FeaturedProjects'
import type { Metadata } from 'next'
import { getGithubData } from '@/lib/github'
import Image from 'next/image'
import { g, i, p } from 'framer-motion/client'

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
      className="relative flex pt-20 md:pt-26 lg:pt-32 pb-10 md:pb-16 lg:pb-20 overflow-hidden min-h-screen w-full"
      > 
        <Image src="/images/home/hero-cover.jpg" alt="Hero background image" fill className="absolute top-0 left-0 w-full h-full object-cover -z-10 flex flex-col" priority/>
        <div className="flex-1 flex justify-center items-center"> 
          <Hero contributionData={contributionDataResponse ?? undefined} period={PERIOD} />
        </div>
      </section>
      <section aria-label="Featured projects section">
        <FeaturedProjects />
      </section>
    </>
  )
}