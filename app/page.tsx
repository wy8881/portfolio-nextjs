import { Hero } from '@/components/home/hero/Hero'
import FeaturedProjects from '@/components/home/featuredProjects/FeaturedProjects'
import type { Metadata } from 'next'
import { getGithubData } from '@/lib/github'

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
      className="relative flex px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 overflow-hidden min-h-dvh w-full bg-background"
      >
        <div className="flex-1 flex justify-center items-center">
          <Hero contributionData={contributionDataResponse ?? undefined} period={PERIOD} />
        </div>
      </section>
      <section aria-label="Featured projects section" className = "px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 bg-background">
        <FeaturedProjects />
      </section>
    </>
  )
}