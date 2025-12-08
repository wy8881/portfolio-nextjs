    'use client'

    import Link from 'next/link'
    import logo from '@/public/imges/icon_black.svg'
    import Image from 'next/image'
    import {usePathname} from 'next/navigation'
    import {motion, AnimatePresence} from 'framer-motion'
    import { useState } from 'react'
    import BurgerButton from '@/components/layout/navbar/BurgerButton'


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
            <AnimatePresence mode='wait'>
                <motion.nav 
                key={pathname}
                className="fixed top-0 left-0 right-0 z-50 bg-nav-bg"
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.5   , ease: 'easeInOut' }}
            >
                <div className="max-w-7xl mx-auto px-6 py-5 md:py-2 lg:py-4">
                    <div className="flex items-center justify-between md:hidden">
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
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ 
                                    duration: 0.3,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                className="md:hidden overflow-hidden"
                            >
                                <motion.div
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: -20 }}
                                    transition={{ 
                                        duration: 0.3,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                    className="py-6 space-y-4"
                                >
                                    {NAV_LINKS.map((link, index) => {
                                        const isActive = pathname === link.href
                                        return (
                                            <motion.div
                                                key={link.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ 
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`
                                                        block text-base font-normal
                                                        transition-all duration-200
                                                        ${isActive
                                                            ? 'text-nav-link-active'
                                                            : 'text-nav-link-inactive hover:text-secondary'
                                                        }`
                                                    }
                                                >
                                                    {link.label}
                                                </Link>
                                            </motion.div>
                                        )
                                    })}
                                    <div className="flex gap-6 pt-4">
                                        {SOCIAL_LINKS.map((link, index) => (
                                            <motion.div
                                                key={link.label}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ 
                                                    duration: 0.3,
                                                    delay: NAV_LINKS.length * 0.05 + index * 0.05,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    aria-label={link.ariaLabel}
                                                    className='
                                                        text-nav-link-inactive
                                                        hover:text-secondary
                                                        transition-all duration-200
                                                        text-2xl
                                                    '
                                                >
                                                    <i className={link.icon}></i>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="hidden md:flex items-center">
                        <Link href="/" className='px-6 md:px-20 lg:px-22'>
                            <Image 
                                src={logo} 
                                alt='Logo' 
                                width={160} 
                                height={160}
                                className="rounded-full w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-cover aspect-square" 
                            />
                        </Link>
                        <div className='ml-auto flex items-center gap-12 md:gap-16 lg:gap-20 px-18 md:px-20 lg:px-22'>
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
                                                transition-all duration-200
                                                ${isActive
                                                    ? 'text-nav-link-active pb-1 border-b-2'
                                                    : 'text-nav-link-inactive hover:text-secondary'
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
                                            hover:text-secondary
                                            transition-all duration-200
                                            text-xl md:text-2xl lg:text-3xl
                                        '

                                    >
                                        <i className={link.icon}></i>
                                    </Link>
                                ))}

                            </div>
                        </div>
                    </div>

                </div>
            </motion.nav>

        </AnimatePresence>
            
        )
    }

    export default Navbar