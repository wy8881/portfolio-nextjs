'use client'

import DogImage from './DogImage'
import ContactInfoRow from './ContactInfoRow'
import { contactInfo } from '@/data/contact/contact-info'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import { SectionLabel, H1, H2, BodyLarge } from '@/components/ui/Typography'

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
            
            <div className="relative z-[2] bg-[var(--color-contact-card)] border-l-4 border-accent rounded-r-lg px-6 py-4 shadow-sm flex flex-col gap-2.5 w-fit">
              <div className="text-[10px] tracking-[2px] uppercase font-bold text-accent mb-1">
                Contact
              </div>
              <ContactInfoRow
                icon="bi-envelope"
                label="Email"
                text={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
              />
              <ContactInfoRow
                icon="bi-telephone"
                label="Phone"
                text={contactInfo.phone}
                href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}
              />
              <ContactInfoRow
                icon="bi-geo-alt"
                label="Location"
                text={contactInfo.location}
              />
            </div>
            
            {/* <div
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
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: ANIMATION_DURATION.pageTransition + 0.2,
              duration: ANIMATION_DURATION.pageTransition,
              ease: ANIMATION_EASING.easeInOut
            }}
            className="hidden md:flex justify-center items-center "
          >
            <DogImage />
          </motion.div>
        </div>
  )
}

export default ContactIntro

