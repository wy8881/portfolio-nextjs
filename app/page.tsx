import { Hero } from '@/components/home/hero/Hero'
import FeaturedProjects from '@/components/home/featuredProjects/FeaturedProjects'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Yi's Portfolio",
  description: 'Master of Computer Science graduate specializing in full-stack development, data analysis, and machine learning. Based in Adelaide, Australia.',
  keywords: ['full-stack developer', 'React', 'Next.js', 'Spring Boot', 'Machine Learning', 'Adelaide'],
  icons: {
    icon: '/images/icon.webp',
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
      className="relative flex px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 overflow-hidden min-h-dvh w-full bg-background"
      >
        <div className="flex-1 flex justify-center items-center">
          <Hero />
        </div>
      </section>
      <section aria-label="Featured projects section" className = "px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 bg-background">
        <FeaturedProjects />
      </section>
    </>
  )
}