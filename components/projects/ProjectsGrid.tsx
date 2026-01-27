'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, wrap } from 'framer-motion'
import { ANIMATION_EASING } from '@/lib/animations'
import { Project, ProjectCategory } from '@/types/projects'
import ProjectCard from './ProjectCard'
import FilterTabs from './FilterTabs'
import AnimatedProjectCard from './AnimatedProjectCard'
import CarouselButton from '@/components/CarouselButton'

interface ProjectsGridProps {
  projects: Project[]
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'All'>('All')
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter))
    }
    setSelectedProjectIndex(0)
  }, [activeFilter, projects])

  function setProject(newDirection: 1 | -1) {
    if (filteredProjects.length === 0) return
    const nextIndex = wrap(0, filteredProjects.length, selectedProjectIndex + newDirection)
    setSelectedProjectIndex(nextIndex)
    setDirection(newDirection)
  }

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
            hidden
            md:grid
            grid-cols-1
            md:grid-cols-2
            xxl:grid-cols-3
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
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="hidden sm:flex md:hidden items-center justify-center gap-10">
        <CarouselButton direction="left" onClick={() => setProject(-1)} />
        <div className="w-[400px] h-[400px]">
          <AnimatePresence
            custom={direction}
            mode="wait"
            initial={false}
          >
            {filteredProjects.length > 0 && (
              <AnimatedProjectCard
                key={filteredProjects[selectedProjectIndex].id}
                project={filteredProjects[selectedProjectIndex]}
              />
            )}
          </AnimatePresence>
        </div>
        <CarouselButton direction="right" onClick={() => setProject(1)} />
      </div>

      <div className="sm:hidden flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-[400px] aspect-square">
          <AnimatePresence
            custom={direction}
            mode="wait"
            initial={false}
          >
            {filteredProjects.length > 0 && (
              <AnimatedProjectCard
                key={filteredProjects[selectedProjectIndex].id}
                project={filteredProjects[selectedProjectIndex]}
                isSmallScreen={true}
                onSwipe={setProject}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-4">
          {filteredProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > selectedProjectIndex ? 1 : -1)
                setSelectedProjectIndex(i)
              }}
              className={`h-2 rounded-full transition-all ${
                i === selectedProjectIndex ? 'w-3 bg-black' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsGrid

