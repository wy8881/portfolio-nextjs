'use client'

import Link from 'next/link'
import { Project } from '@/types/projects'
import { CardTitle, CardDescription } from '@/components/ui/Typography'

interface ProjectCardProps {
  project: Project
  isSmallScreen?: boolean
}

const ProjectCard = ({ project, isSmallScreen=false }: ProjectCardProps) => {
  return (
    <div
      className="

        flex
        flex-col
        h-full
        bg-artifact
        border-2
        border-primary
        rounded-2xl
        p-[clamp(1.5rem,3vw,2rem)]
        transition-all
        duration-300
        ease-out
        hover:translate-y-[-4px]
        hover:shadow-[8px_8px_0px_0px_var(--color-accent)]
        gap-3
      "
    >
      <CardTitle>{project.title}</CardTitle>

      <div
        className="
          flex
          flex-wrap
          gap-2
        "
      >
        {!isSmallScreen && project.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded text-xs"
            style={{
              background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)',
              color: 'var(--color-accent)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      {!isSmallScreen && <CardDescription className="flex-grow mb-6">{project.description}</CardDescription>}

      <div
        className="
          flex
          gap-6
          text-[0.9375rem]
          mt-auto
        "
      >
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-accent
              hover:underline
              transition-all
              duration-200
            "
          >
            GitHub →
          </a>
        )}
        {project.liveDemo && (
          <Link
            href={project.liveDemo}
            className="
              text-accent
              hover:underline
              transition-all
              duration-200
            "
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View live demo for ${project.title}`}
          >
            Live Demo →
          </Link>
        )}
        {project.publication && (
          <Link
            href={project.publication}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline transition-all duration-200"
            aria-label={`View publication for ${project.title}`}
          >
            View Publication →
          </Link>
        )}
      </div>
    </div>
  )
}

export default ProjectCard

