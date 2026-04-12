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
    <>
      <section aria-label="Projects header" className="relative flex justify-center items-center py-16 md:py-24 lg:py-32 overflow-hidden min-h-dvh w-full">
        <ProjectsHeader />
      </section>
      <section aria-label="Projects cards section" className="py-16 md:py-24 lg:py-32">
          <ProjectsGrid projects={projects} />
      </section>
      <section className="pb-16 md:pb-24 lg:pb-32" aria-label="Certifications section">
        <CertificationsSection />
      </section>
    </>
  )
}
