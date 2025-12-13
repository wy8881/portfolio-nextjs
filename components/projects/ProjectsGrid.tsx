'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIMATION_EASING } from '@/lib/animations'
import { Project, ProjectCategory } from '@/types/projects'
import ProjectCard from './ProjectCard'
import FilterTabs from './FilterTabs'

interface ProjectsGridProps {
  projects: Project[]
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'All'>('All')
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter))
    }
  }, [activeFilter, projects])

  return (
    <div>
      <FilterTabs onFilterChange={setActiveFilter} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
            md:gap-6
            lg:gap-8
          "
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                delay: index * 0.1,
                duration: 0.3,
                ease: ANIMATION_EASING.easeInOut
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ProjectsGrid

