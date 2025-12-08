"use client"        
import { motion } from "framer-motion"

type BurgerButtonProps = {
    isOpen: boolean
    toggle: () => void
}

const burgerVariants = {
    closed: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    },
    open: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
}

const lineVariants = {
    closed: {
        rotate: 0,
        y: 0,
        opacity: 1
    },
    open: {
        opacity: 1
    }
}

const topLine = {
    closed: { ...lineVariants.closed },
    open: { rotate: 45, y: 12, ...lineVariants.open }
}

const middleLine = {
    closed: { ...lineVariants.closed },
    open: { opacity: 0 }
}

const bottomLine = {
    closed: { ...lineVariants.closed },
    open: { rotate: -45, y: -12, ...lineVariants.open }
}

const BurgerButton = ({ isOpen, toggle }: BurgerButtonProps) => {
    return (
        <motion.button
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={toggle}
            className="md:hidden flex flex-col justify-center items-center gap-2.5 w-10 h-10 relative z-30"
            variants={burgerVariants}
            animate={isOpen ? "open" : "closed"}
        >
            <motion.span 
                className="block h-[2px] w-6 bg-nav-link-inactive rounded-full origin-center"
                variants={topLine}
                transition={{ 
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                }}
            />
            <motion.span 
                className="block h-[2px] w-6 bg-nav-link-inactive rounded-full origin-center"
                variants={middleLine}
                transition={{ 
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                }}
            />
            <motion.span 
                className="block h-[2px] w-6 bg-nav-link-inactive rounded-full origin-center"
                variants={bottomLine}
                transition={{ 
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                }}
            />
        </motion.button>
    )
}

export default BurgerButton;