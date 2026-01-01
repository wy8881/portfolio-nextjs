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
        h-full
        w-full
        flex
        flex-col
        bg-white
        border-2
        border-black
        rounded-2xl
        p-[clamp(1.5rem,3vw,2rem)]
        transition-all
        duration-300
        ease-out
        hover:translate-y-[-4px]
        hover:shadow-[8px_8px_0px_0px_#000000]
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
            className="
              px-3
              py-1
              border
              border-[#CCCCCC]
              rounded
              text-xs
              text-[#666666]
              bg-[#F5F5F5]
            "
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
              text-black
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
              text-black
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
            className="text-black hover:underline transition-all duration-200"
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

