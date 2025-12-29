import type { Metadata } from 'next'
import ProjectsHeader from '@/components/projects/ProjectsHeader'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import CertificationsSection from '@/components/projects/CertificationsSection'
import { projects } from '@/data/projects/projects'

export const metadata: Metadata = {
  title: 'Projects - Yi Wang',
  description: 'Portfolio of full-stack projects, machine learning experiments, and IT support work by Yi Wang.',
}

export default function ProjectsPage() {
  return (
      <div
        className="
          max-w-[clamp(320px,90vw,1280px)]
          mx-auto
          px-[clamp(1.5rem,5vw,4rem)]
        "
      >
        <section className="pb-24 md:pb-32 lg:pb-40"  aria-label="Projects header">
          <ProjectsHeader />
        </section>
        <section className="pb-16 md:pb-20 lg:pb-24" aria-label="Projects cards">
            <ProjectsGrid projects={projects} />
        </section>
        <section className="pb-20 md:pb-24 lg:pb-32" aria-label="Certifications section">
          <CertificationsSection />
        </section>
      </div>
  )
}
