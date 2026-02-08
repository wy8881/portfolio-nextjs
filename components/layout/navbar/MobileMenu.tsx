"use client"

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

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

type MobileMenuProps = {
    isOpen: boolean
    onClose: () => void
    pathname: string
    navLinks: NavLink[]
    socialLinks: SocialLink[]
}

const overlayVariants = {
    closed: { opacity: 0, pointerEvents: "none" as const },
    open: { opacity: 1, pointerEvents: "auto" as const },
  }

const panelVariants = {
    closed: { y: -20, opacity: 0 },
    open: { y: 0, opacity: 1 },
}

const backgroundVariants = {
    open: () => ({
      clipPath: `circle(150vh at calc(100% - 40px) 0)`,
      transition: { type: 'spring' as const, stiffness: 20, restDelta: 2 },
    }),
    closed: {
      clipPath: `circle(30px at calc(100% - 40px) 0)`,
      transition: { type: 'spring' as const, stiffness: 400, damping: 40 },
    },
  }

const containerVariants = {
    open: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 1,
        }
    },
    closed: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        }
    },
}

const linkVariants = {
    open: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
            x: { stiffness: 500, damping: 30, velocity: -100 },
            y: { stiffness: 500, damping: 30, velocity: -100 },
            opacity: { duration: 0.4 },
        },
    },
    closed: {
        x: 30,
        y: -30,
        opacity: 0,
        transition: {
            x: { stiffness: 500, damping: 30 },
            y: { stiffness: 500, damping: 30 },
            opacity: { duration: 0.3 },
        },
    },
}

const menuListVariants = {
    open: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
        }
    },
    closed: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        }
    },
}

const MobileMenu = ({ isOpen, onClose, pathname, navLinks, socialLinks }: MobileMenuProps) => {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [isOpen])
    return (
        <div className="md:hidden">
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed">
                    <motion.div
                    key="mobile-menu-background"
                    className="fixed inset-0 left-1/2 bg-[#363740] overflow-hidden z-20"
                    variants={backgroundVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.25, ease: "easeOut" }}/>

                    <motion.div
                        key="mobile-menu-overlay"
                        className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm md:hidden"
                        variants={overlayVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />


                <motion.div
                    key="mobile-menu-panel"
                    className="
                    fixed top-20 right-0 bottom-0 z-30
                    w-1/2
                    shadow-lg
                    -mt-[1.25rem]
                    px-6 pt-6 pb-6
                    "
                    variants={panelVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation menu"
                    id="mobile-menu"
                >
                    <motion.ul
                        className="flex flex-col gap-4"
                        variants={ menuListVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        {navLinks.map((link, index) => {
                            const isActive = pathname === link.href
                            return (
                                <motion.li
                                    key={link.label}
                                    variants={linkVariants}
                                >
                                    <Link
                                        href={link.href}
                                        aria-label={link.label}
                                        onClick={onClose}
                                        className={`
                                            text-base font-normal
                                            transition-colors duration-200
                                            ${isActive
                                                ? 'text-nav-link-active inline-block pb-1 border-b-2 border-nav-link-active'
                                                : 'text-nav-link-inactive hover:text-secondary block'
                                            }`
                                        }
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            )
                        })}
                        <div className="flex gap-6 pt-4">
                            {socialLinks.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    variants={linkVariants}
                                >
                                    <Link
                                        aria-label={link.ariaLabel}
                                        href={link.href}
                                        rel='noopener noreferrer'
                                        className="
                                            flex items-center justify-center
                                            text-2xl
                                            text-nav-link-inactive
                                            hover:text-secondary
                                            transition-colors
                                            duration-200
                                        "
                                        target='_blank'
                                    >
                                        <i className={link.icon}></i>
                                    </Link>
                                </motion.li>
                            ))}
                        </div>
                    </motion.ul>
                    </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    )
}

export default MobileMenu

