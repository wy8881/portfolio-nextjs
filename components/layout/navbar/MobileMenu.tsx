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
        <AnimatePresence>
            {isOpen && (
                <>
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
                    absolute top-full left-0 right-0 z-20 md:hidden
                    bg-nav-bg shadow-lg
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
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link, index) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    aria-label={link.label}
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
                            )
                        })}
                        <div className="flex gap-6 pt-4">
                            {socialLinks.map((link, index) => (
                                <Link
                                    key={link.label}
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
                            ))}
                        </div>
                    </div>
                </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default MobileMenu

