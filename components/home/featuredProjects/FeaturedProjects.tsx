'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/data/projects/projects'
import { ANIMATION_EASING } from '@/lib/animations'
import FeaturedProjectCard from './FeaturedProjectCard'
import { H3 } from '@/components/ui/Typography'

const FeaturedProjects = () => {
  const featuredProjects = projects.filter((project) => project.featured === true)

  return (
    <div className="flex flex-col gap-12">
      <H3>Featured Projects</H3>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
          md:gap-8
          mb-8
          md:mb-12
        "
      >
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: ANIMATION_EASING.standard,
            }}
          >
            <FeaturedProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.6,
          delay: featuredProjects.length * 0.1 + 0.2,
          ease: ANIMATION_EASING.standard,
        }}
        className="
          flex
          justify-center
          md:justify-end
        "
      >
        <Link
          href="/projects"
          className="
            text-black
            text-[0.9375rem]
            hover:underline
            transition-all
            duration-200
          "
        >
          View All Projects →
        </Link>
      </motion.div>
    </div>
  )
}

export default FeaturedProjects

