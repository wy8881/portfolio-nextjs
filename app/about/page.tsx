import type { Metadata } from 'next';
import AboutIntro from '@/components/about/AboutIntro';
import SkillsSection from '@/components/about/SkillsSection';
import TimelineSection from '@/components/about/TimelineSection';
export const metadata: Metadata = {
  title: 'About - Yi Wang',
  description: 'Full-stack developer and data enthusiast based in Adelaide. Learn about my experience, skills, and journey in software development and machine learning.',
};

export default function AboutPage() {
  return (
    <>
      <section
        aria-label="About intro section"
        className="relative flex justify-center items-center px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 overflow-hidden min-h-dvh w-full bg-background"
      >
        <AboutIntro />
      </section>
      <section aria-label="Skills section" className="bg-background px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32">
        <SkillsSection />
      </section>
      <section aria-label="Timeline section" className='bg-background px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 '>
        <TimelineSection />
      </section>
    </>
  );
}
