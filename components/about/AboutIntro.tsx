'use client'

import ProfileImage from './ProfileImage'
import { personalInfo } from '@/data/about/personal-info'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'

const AboutIntro = () => {
  return (
    <section
      className="w-full"
      aria-label="About introduction"
    >
      <div
        className="
          pt-[clamp(4rem,10vh+2rem,9rem)]
          pb-[clamp(3rem,10vh,8rem)]
        "
      >
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
            <div
              className="
                font-sans
                text-sm
                font-normal
                tracking-[0.15em]
                uppercase
                text-[#888888]
                mb-2
              "
            >
              ABOUT
            </div>
            
            <h1
              className="
                font-sans
                text-[clamp(2.5rem,5vw+1rem,5rem)]
                font-bold
                leading-[1.1]
                tracking-[-0.02em]
                text-[#000000]
              "
            >
              I'm {personalInfo.name}
            </h1>
            
            <h2
              className="
                font-sans
                text-[clamp(1.125rem,2vw+0.5rem,1.5rem)]
                font-medium
                leading-[1.4]
                text-[#555555]
              "
            >
              {personalInfo.title}
            </h2>
            
            <p
              className="
                font-sans
                text-[clamp(1rem,1.5vw+0.5rem,1.25rem)]
                font-normal
                leading-[1.7]
                text-[#666666]
              "
            >
              {personalInfo.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: ANIMATION_DURATION.pageTransition + 0.2,
              duration: ANIMATION_DURATION.pageTransition,
              ease: ANIMATION_EASING.easeInOut
            }}
          >
            <ProfileImage />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutIntro

