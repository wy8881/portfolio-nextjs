'use client'

import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import { SectionLabel, H1, H2 } from '@/components/ui/Typography'

const ProjectsHeader = () => {
  return (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[55%_45%]
            lg:grid-cols-[60%_40%]
            items-center
            gap-8
            md:gap-12
            lg:gap-16
          "
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: ANIMATION_DURATION.pageTransition + 0.2,
              duration: ANIMATION_DURATION.pageTransition,
              ease: ANIMATION_EASING.easeInOut
            }}
            className="
              space-y-[clamp(1rem,3vw,2rem)]
              max-w-[580px]
            "
          >
            <SectionLabel>PROJECTS</SectionLabel>
            
            <H1>Projects & Experience</H1>
            
            <H2>Selected work & hands-on experience</H2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: ANIMATION_DURATION.pageTransition + 0.2,
              duration: ANIMATION_DURATION.pageTransition,
              ease: ANIMATION_EASING.easeInOut
            }}
            className="
              hidden
              md:flex justify-center
            "
          >
            <div
              className="
                relative
                w-[clamp(220px,85vw,380px)]
                md:w-[clamp(320px,35vw,480px)]
                aspect-square
                flex
                items-center
                justify-center
                rotate-[1deg]
                md:rotate-[2deg]
                hover:rotate-0
                transition-transform
                duration-[400ms]
                ease-out
              "
            >
              <code
                className="
                  font-mono
                  text-[clamp(4rem,10vw,8rem)]
                  font-light
                  text-[#E5E5E5]
                  select-none
                "
              >
                &lt;code/&gt;
              </code>
            </div>
          </motion.div>
        </div>
  )
}

export default ProjectsHeader

