import { HeroSection } from '@/components/home/hero/Hero'
import FeaturedProjects from '@/components/home/featuredProjects/FeaturedProjects'
import type { Metadata } from 'next'

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

export default function HomePage() {
  return (
    <>
      <section 
      aria-label="Hero section"
      className=" px-6 md:px-8 lg:px-12 pt-4 md:pt-6 pb-12 lg:pb-16"
      > 
        <HeroSection />
      </section>
      <section aria-label="Featured projects section">
        <FeaturedProjects />
      </section>
    </>
  )
}