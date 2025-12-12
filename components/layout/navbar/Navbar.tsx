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
                                className="rounded-full object-cover aspect-square" 
                                style={{ 
                                    width: 'clamp(40px, 4vw, 56px)',
                                    height: 'clamp(40px, 4vw, 56px)'
                                }}
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
                            transition={{ duration: ANIMATION_DURATION.pageTransition, ease: ANIMATION_EASING.easeInOut }}
                            className="hidden md:flex items-center"
                        >
                        <Link href="/" style={{ paddingLeft: 'clamp(4rem, 6vw, 6rem)', paddingRight: 'clamp(4rem, 6vw, 6rem)' }}>
                            <Image 
                                src={logo} 
                                alt='Logo' 
                                width={160} 
                                height={160}
                                className="rounded-full object-cover aspect-square" 
                                style={{ 
                                    width: 'clamp(40px, 4vw, 56px)',
                                    height: 'clamp(40px, 4vw, 56px)'
                                }}
                            />
                        </Link>
                        <div 
                            className='ml-auto flex items-center'
                            style={{ 
                                gap: 'clamp(3rem, 5vw, 5rem)',
                                paddingLeft: 'clamp(4rem, 5vw, 6rem)',
                                paddingRight: 'clamp(4rem, 5vw, 6rem)'
                            }}
                        >
                            <div 
                                className="flex"
                                style={{ gap: 'clamp(1rem, 1.5vw, 2rem)' }}
                            >
                                {NAV_LINKS.map((link) => {
                                    const isActive = pathname === link.href
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={`
                                                font-normal
                                                transition-all
                                                ${isActive
                                                    ? 'text-nav-link-active pb-1 border-b-2'
                                                    : 'text-nav-link-inactive hover:text-text-secondary '
                                                }`
                                            }
                                            style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                            </div>
                            <div 
                                className='flex items-center'
                                style={{ gap: 'clamp(1rem, 1.5vw, 2rem)' }}
                            >
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
                                        '
                                        style={{ fontSize: 'clamp(20px, 2vw, 30px)' }}
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