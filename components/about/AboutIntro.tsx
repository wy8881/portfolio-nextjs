'use client'

import ProfileImage from './ProfileImage'
import { personalInfo } from '@/data/about/personal-info'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import { SectionLabel, H1, H2, BodyLarge } from '@/components/ui/Typography'

const AboutIntro = () => {
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
        <SectionLabel>ABOUT</SectionLabel>

        <H1>I'm {personalInfo.name}</H1>

        <H2>{personalInfo.title}</H2>

        <BodyLarge>{personalInfo.description}</BodyLarge>
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
          flex
          justify-center
          md:flex
          justify-end
        "
      >
        <ProfileImage />
      </motion.div>
    </div>
  )
}

export default AboutIntro

