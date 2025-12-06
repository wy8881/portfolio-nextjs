'use client'

import Link from 'next/link'
import {useState, useEffect, useRef} from 'react'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {motion, AnimatePresence} from 'framer-motion'

type NavLink = {
    href: string
    label: string
}

type SocialLink = {
    href: string
    icon: string
    label: string
    ariaLabel: string
}

const NAV_LINKS: NavLink[] = [
    {href: '/', label: 'Home'},
    {href: '/about', label: 'About'},
    {href: '/projects', label: 'Projects'},
    {href: '/experience', label: 'Experience'},
    {href: '/skills', label: 'Skills'},
    {href: '/contact', label: 'Contact'},
]

const SOCIAL_LINKS: SocialLink[] = [
    {
        href: 'https://github.com/wy8881',
        icon: 'bi-github',
        label: 'GitHub',
        ariaLabel: 'Visit my GitHub Profile'
    },
    {
        href: 'https://linkedin.com/in/yi-wang-meow99',
        icon: 'bi-linkedin',
        label: 'LinkedIn',
        ariaLabel: 'Visit my LinkedIn Profile'
    },
    {
        href: 'https://gravatar.com/wy7382',
        icon: 'bi-wordpress',
        label: 'WordPress',
        ariaLabel: 'Visit my WordPress blog'
      },
]

const SpotlightButton = () => {
    const btnRef = useRef<HTMLButtonElement>(null)
    const spanRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const span = spanRef.current
        const btn = btnRef.current

        if (!span || !btn) return

        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const {width} = target.getBoundingClientRect()
            const offset = e.offsetX
            const left = `${((offset / width) * 100)}%`
            
            span.animate({left}, {duration: 250, fill: 'forwards'})
        }

        const handleMouseLeave = () => {
            span.animate({left:'50%'}, {duration: 100, fill:'forwards'})
        }

        btn.addEventListener('mousemove', handleMouseMove)
        btn.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove)
            btn.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return (
        <motion.button
            whileTap={{scale: 0.9}}
            ref={btnRef}
            className="
                relative w-full max-w-xs overflow-hidden
                rounded-full 
                bg-black dark:bg-white
                px-4 py-3
                text-lg front-medium
                text-white dark:text-black
                transition-colors duration-200
                hover:shadow-lg
            "
            aria-label="Contact Me"
        >
        <span className="pointer-events-none 
                        relative z-10 
                        mix-blend-difference">
        Contact Me
        </span>
        <span ref={spanRef}
              className="
                pointer-events-none absolute
                left-[50%] top-[50%]
                h-32 w-32
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                bg-slate-100 dark:bg-slate-800
              "
            />
        </motion.button>
        
    )
}

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <SpotlightButton />
        </header>
    )
}

export default Navbar