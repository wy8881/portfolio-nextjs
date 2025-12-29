import type { Metadata } from 'next';
import AboutIntro from '@/components/about/AboutIntro';
import SkillsSection from '@/components/about/SkillsSection';
import TimelineSection from '@/components/about/TimelineSection';
import { ScrollIndicator } from '@/components/ScrollIndicator';

export const metadata: Metadata = {
  title: 'About - Yi Wang',
  description: 'Full-stack developer and data enthusiast based in Adelaide. Learn about my experience, skills, and journey in software development and machine learning.',
};

export default function AboutPage() {
  return (
    <>
      <section 
        className="pb-12 md:pb-20 lg:pb-28"
        aria-label="About intro section"
      >
        <AboutIntro />
      </section>
        <section className="pb-12 md:pb-20 lg:pb-28" aria-label="Skills section">
          <SkillsSection />
        </section>
        <section aria-label="Timeline section">
          <TimelineSection />
        </section>
    </>
  );
}
