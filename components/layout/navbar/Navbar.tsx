    'use client'

    import Link from 'next/link'
    import logo from '@/public/images/icon_black.svg'
    import Image from 'next/image'
    import {usePathname} from 'next/navigation'
    import {motion, AnimatePresence} from 'framer-motion'
    import { useState } from 'react'
    import BurgerButton from '@/components/layout/navbar/BurgerButton'
    import MobileMenu from '@/components/layout/navbar/MobileMenu'
    import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'


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
        {href: '/about', label: 'About'},
        {href: '/projects', label: 'Projects'},
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

    const Navbar = () => {
        const pathname = usePathname()
        const [isOpen, setIsOpen] = useState(false)
        
        return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-nav-bg"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 lg:py-6 relative">
                    <div className="flex items-center justify-between md:hidden relative z-30">
                        <Link href="/">
                            <Image 
                                src={logo} 
                                alt='Logo' 
                                width={160} 
                                height={160}
                                className="rounded-full w-10 h-10 object-cover aspect-square" 
                            />
                        </Link>
                        <BurgerButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
                    </div>
                    <MobileMenu 
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        pathname={pathname}
                        navLinks={NAV_LINKS}
                        socialLinks={SOCIAL_LINKS}
                    />
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ y: '-50%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '-50%', opacity: 0 }}
                            transition={{ duration: ANIMATION_DURATION.navbar.routeTransition, ease: ANIMATION_EASING.easeInOut }}
                            className="hidden md:flex items-center"
                        >
                        <Link href="/" className='md:px-20 lg:px-24'>
                            <Image 
                                src={logo} 
                                alt='Logo' 
                                width={160} 
                                height={160}
                                className="rounded-full w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-cover aspect-square" 
                            />
                        </Link>
                        <div className='ml-auto flex items-center gap-12 md:gap-16 lg:gap-20 px-16 md:px-20 lg:px-24'>
                            <div className="flex gap-4 md:gap-6 lg:gap-8">
                                {NAV_LINKS.map((link) => {
                                    const isActive = pathname === link.href
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={`
                                                text-sm md:text-base lg:text-lg
                                                font-normal
                                                transition-all
                                                ${isActive
                                                    ? 'text-nav-link-active pb-1 border-b-2'
                                                    : 'text-nav-link-inactive hover:text-text-secondary '
                                                }`
                                            }
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                            </div>
                            <div className='flex items-center gap-4 md:gap-6 lg:gap-8'>
                                {SOCIAL_LINKS.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        aria-label={link.ariaLabel}
                                        className='
                                            text-nav-link-inactive
                                            hover:text-text-secondary
                                            transition-all duration-200
                                            text-xl md:text-2xl lg:text-3xl
                                        '

                                    >
                                        <i className={link.icon}></i>
                                    </Link>
                                ))}

                            </div>
                        </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </header>
        )
    }

    export default Navbar