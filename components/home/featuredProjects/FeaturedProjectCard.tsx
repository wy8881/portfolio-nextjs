'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types/projects'
import { CardTitle } from '@/components/ui/Typography'

interface FeaturedProjectCardProps {
  project: Project
}

const FeaturedProjectCard = ({ project }: FeaturedProjectCardProps) => {
  const displayTitle = project.shortTitle || project.title

  return (
    <div
      className="
        flex
        flex-col
        bg-white
        border-2
        border-black
        rounded-2xl
        overflow-hidden
        transition-all
        duration-300
        ease-out
        hover:translate-y-[-4px]
        hover:shadow-[8px_8px_0px_0px_#000000]
        aspect-[4/3] 
      "
    >
      {project.coverImage && (
        <div
          className="
            relative
            w-full
            h-[300px]
            md:h-[350px]
            overflow-hidden
          "
        >
          <Image
            src={project.coverImage}
            alt={displayTitle}
            fill
            className="
              object-cover
              rounded-t-2xl
            "
            priority={true}
          />
        </div>
      )}

      <div
        className="
          p-[clamp(1.5rem,3vw,2rem)]
        "
      >
        <CardTitle className="mb-4">{displayTitle}</CardTitle>

        <div
          className="
            flex
            gap-6
            text-[0.9375rem]
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
              aria-label={`View live demo for ${displayTitle}`}
            >
              Live Demo →
            </Link>
          )}
          {project.publication && (
            <Link
              href={project.publication}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-black
                hover:underline
                transition-all
                duration-200
              "
              aria-label={`View publication for ${displayTitle}`}
            >
              View Publication →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturedProjectCard

