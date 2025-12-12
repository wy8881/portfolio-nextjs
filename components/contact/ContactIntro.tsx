'use client'

import DogImage from './DogImage'
import { contactInfo } from '@/data/contact/contact-info'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import Link from 'next/link'

const ContactIntro = () => {
  return (
    <section
      className="w-full"
      aria-label="Contact introduction"
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
              CONTACT
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
              {contactInfo.title}
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
              {contactInfo.subtitle}
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
              {contactInfo.description}
            </p>
            
            <div
              className="
                space-y-2
                text-[clamp(1rem,1.5vw+0.5rem,1.125rem)]
                text-[#666666]
                leading-[1.6]
                pt-4
              "
            >
              <div
                className="
                  relative
                  pl-5
                  before:content-['•']
                  before:absolute
                  before:left-0
                  before:text-black
                  before:font-semibold
                "
              >
                {contactInfo.email}
              </div>
              <div
                className="
                  relative
                  pl-5
                  before:content-['•']
                  before:absolute
                  before:left-0
                  before:text-black
                  before:font-semibold
                "
              >
                {contactInfo.phone}
              </div>
              <div
                className="
                  relative
                  pl-5
                  before:content-['•']
                  before:absolute
                  before:left-0
                  before:text-black
                  before:font-semibold
                "
              >
                {contactInfo.location}
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
    </section>
  )
}

export default ContactIntro

