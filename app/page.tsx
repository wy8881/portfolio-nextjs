import { HeroSection } from '@/components/home/hero/hero'
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
    <section aria-label="Hero section"> 
      <HeroSection />
    </section>
  )
}