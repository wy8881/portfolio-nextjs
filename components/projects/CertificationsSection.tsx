'use client'

import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import { certifications } from '@/data/projects/certifications'
import CertificationCard from './CertificationCard'
import { H3 } from '@/components/ui/Typography'

const CertificationsSection = () => {
  return (
    <div className="flex flex-col gap-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: ANIMATION_DURATION.pageTransition,
          ease: ANIMATION_EASING.easeInOut
        }}
      >
        <H3>CERTIFICATIONS</H3>
      </motion.div>
      
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          md:gap-6
          lg:gap-8
        "
      >
        {certifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              delay: index * 0.1,
              duration: ANIMATION_DURATION.pageTransition,
              ease: ANIMATION_EASING.easeInOut
            }}
          >
            <CertificationCard certification={certification} />
          </motion.div>
        ))}
        
      </div>
    </div>
  )
}

export default CertificationsSection

