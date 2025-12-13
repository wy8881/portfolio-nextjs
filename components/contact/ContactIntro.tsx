'use client'

import DogImage from './DogImage'
import { contactInfo } from '@/data/contact/contact-info'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import Link from 'next/link'
import { SectionLabel, H1, H2, BodyLarge, Body } from '@/components/ui/Typography'

const ContactIntro = () => {
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
            <SectionLabel>CONTACT</SectionLabel>
            
            <H1>{contactInfo.title}</H1>
            
            <H2>{contactInfo.subtitle}</H2>
            
            <BodyLarge>{contactInfo.description}</BodyLarge>
            
            <div className="space-y-2 pt-4">
              <div className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-black before:font-semibold">
                <Body as="div">{contactInfo.email}</Body>
              </div>
              <div className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-black before:font-semibold">
                <Body as="div">{contactInfo.phone}</Body>
              </div>
              <div className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-black before:font-semibold">
                <Body as="div">{contactInfo.location}</Body>
              </div>
            </div>
            
            <div
              className="
                flex
                items-center
                gap-6
                pt-2
              "
            >
              {contactInfo.socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="
                    text-[#666666]
                    hover:text-[#000000]
                    transition-colors
                    duration-200
                    text-4xl
                  "
                >
                  <i className={link.icon}></i>
                </Link>
              ))}
            </div>
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
            <DogImage />
          </motion.div>
        </div>
  )
}

export default ContactIntro

