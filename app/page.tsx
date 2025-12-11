import { HeroSection } from '@/components/home/hero/hero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yi Wang - Full-stack Developer & Data Enthusiast',
  description: 'Master of Computer Science graduate specializing in full-stack development, data analysis, and machine learning. Based in Adelaide, Australia.',
  keywords: ['full-stack developer', 'React', 'Next.js', 'Spring Boot', 'Machine Learning', 'Adelaide'],
  openGraph: {
    title: 'Yi Wang - Portfolio',
    description: 'Full-stack developer and data enthusiast',
    url: 'https://yiwang.me',
    siteName: 'Yi Wang Portfolio',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <section className="w-full"> 
      <HeroSection />
    </section>
  )
}