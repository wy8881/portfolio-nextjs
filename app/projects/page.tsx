import type { Metadata } from 'next'
import ProjectsHeader from '@/components/projects/ProjectsHeader'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import CertificationsSection from '@/components/projects/CertificationsSection'
import { projects } from '@/data/projects/projects'
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Projects - Yi Wang',
  description: 'Portfolio of full-stack projects, machine learning experiments, and IT support work by Yi Wang.',
}

export default function ProjectsPage() {
  return (
    <>
      <section aria-label="Projects header" className="relative flex justify-center items-center px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 overflow-hidden min-h-dvh w-full">
        <Image src="/images/projects/project-cover.webp" alt="Projects cover image" fill className="absolute top-0 left-0 w-full h-full object-cover -z-10 flex flex-col" sizes="100vw" quality={75} priority />
        <ProjectsHeader />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-0" />
      </section>
      <section aria-label="Projects cards section" className='bg-background px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32'>
          <ProjectsGrid projects={projects} />
      </section>
      <section className="bg-background px-6 md:px-12 lg:px-24 pb-16 md:pb-24 lg:pb-32" aria-label="Certifications section">
        <CertificationsSection />
      </section>
    </>
  )
}
