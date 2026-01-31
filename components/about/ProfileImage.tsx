'use client'

import Image from 'next/image'
import { personalInfo } from '@/data/about/personal-info'
import catPic from '@/public/images/about/profile-cats.jpg'

interface ProfileImageProps {
  className?: string
}

const ProfileImage = ({ className = '' }: ProfileImageProps) => {
  return (
    <div
      className={`
        relative
        flex
        justify-center
        md:justify-end
        items-center
        p-8
        md:p-12
        ${className}
      `}
    >
      <div
        className="
          relative
          inline-block
          max-w-[clamp(198px,76.5vw,323px)]
          md:max-w-[clamp(238px,34vw,340px)]
          lg:max-w-[clamp(272px,29.75vw,408px)]
          rotate-[1deg]
          md:rotate-[2deg]
          shadow-[0_8px_16px_rgba(0,0,0,0.12),0_20px_40px_rgba(0,0,0,0.08)]
          md:shadow-[0_8px_16px_rgba(0,0,0,0.12),0_20px_40px_rgba(0,0,0,0.08),0_4px_8px_rgba(0,0,0,0.06)]
          hover:rotate-0
          hover:scale-[1.02]
          hover:shadow-[0_12px_24px_rgba(0,0,0,0.15),0_24px_48px_rgba(0,0,0,0.1)]
          transition-all
          duration-[400ms]
          ease-out
          md:-ml-[60px]
          lg:-ml-[70px]
        "
        aria-label={personalInfo.image.alt}
      >
        <div
          className="
            absolute
            -top-3
            left-1/2
            -translate-x-1/2
            md:left-[20%]
            md:translate-x-0
            w-20
            h-7
            bg-gradient-to-r
            from-gray-200/70
            via-gray-100/70
            to-gray-200/70
            -rotate-[6deg]
            md:-rotate-[8deg]
            rounded-sm
            z-10
          "
          aria-hidden="true"
        />
        <div
          className="
            absolute
            -top-2
            right-[15%]
            hidden
            md:block
            w-[70px]
            h-7
            bg-gradient-to-r
            from-gray-200/70
            via-gray-100/70
            to-gray-200/70
            rotate-[12deg]
            rounded-sm
            z-10
          "
          aria-hidden="true"
        />
        <Image
          src={catPic}
          alt={personalInfo.image.alt}
          width={480}
          height={480}
          priority
          quality={90}
          className="w-full h-auto rounded-2xl block"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 40vw, 35vw"
          placeholder="blur"
        />
      </div>
    </div>
  )
}

export default ProfileImage

