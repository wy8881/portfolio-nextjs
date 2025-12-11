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
    <main className="w-full">
      <div
        className="
          max-w-[clamp(320px,90vw,1280px)]
          mx-auto
          px-[clamp(1.5rem,5vw,4rem)]
        "
      >
        <AboutIntro />
        <SkillsSection />
        <TimelineSection />
      </div>
    </main>
  );
}
