import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

interface H1Props extends TypographyProps {
  variant?: 'default' | 'hero' | 'compact'
}

/**
 * H1 Main Heading Component
 * Used for page main titles (e.g., "I'm Yi Wang", "Projects")
 * 
 * @example
 * <H1>I'm Yi Wang</H1>
 * <H1 variant="hero">Welcome</H1>
 * <H1 as="div" className="mb-4">Custom</H1>
 */
export function H1({ 
  children, 
  className, 
  variant = 'default',
  as: Component = 'h1' 
}: H1Props) {
  const variantStyles = {
    default: 'text-[clamp(2.5rem,5vw+1rem,5rem)]',
    hero: 'text-[clamp(3rem,6vw+1rem,6rem)]',
    compact: 'text-[clamp(2rem,4vw+1rem,4rem)]'
  }

  return (
    <Component
      className={cn(
        'font-sans',
        'font-bold',
        'leading-[1.1]',
        'tracking-[-0.02em]',
        'text-[#000000]',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * H2 Subtitle Component
 * Used for page subtitles (e.g., "Full-stack Developer & Data Enthusiast")
 * 
 * @example
 * <H2>Full-stack Developer & Data Enthusiast</H2>
 * <H2 as="p" className="text-center">Centered subtitle</H2>
 */
export function H2({ 
  children, 
  className, 
  as: Component = 'h2' 
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans',
        'text-[clamp(1.125rem,2vw+0.5rem,1.5rem)]',
        'font-medium',
        'leading-[1.4]',
        'text-[#555555]',
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * H3 Small Heading Component
 * Used for section subheadings
 * 
 * @example
 * <H3>Section Title</H3>
 * <H3 as="h2" className="mb-4">Custom heading</H3>
 */
export function H3({ 
  children, 
  className, 
  as: Component = 'h3' 
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans',
        'text-[clamp(1.5rem,3vw,2rem)]',
        'font-semibold',
        'leading-[1.2]',
        'text-[#000000]',
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * SectionLabel Component
 * Used for section top labels (e.g., "ABOUT", "PROJECTS", "CONTACT")
 * 
 * @example
 * <SectionLabel>ABOUT</SectionLabel>
 * <SectionLabel className="mb-4">PROJECTS</SectionLabel>
 */
export function SectionLabel({ 
  children, 
  className, 
  as: Component = 'div' 
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans',
        'text-sm',
        'font-normal',
        'tracking-[0.15em]',
        'uppercase',
        'text-[#888888]',
        'mb-2',
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * BodyLarge Component
 * Used for descriptive text (e.g., AboutIntro description)
 * 
 * @example
 * <BodyLarge>Based in Adelaide and looking for opportunities</BodyLarge>
 * <BodyLarge as="div" className="text-center">Centered description</BodyLarge>
 */
export function BodyLarge({ 
  children, 
  className, 
  as: Component = 'p' 
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans',
        'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)]',
        'font-normal',
        'leading-[1.7]',
        'text-[#666666]',
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * Body Component
 * Used for standard body text
 * 
 * @example
 * <Body>Standard paragraph text</Body>
 * <Body as="span" className="inline">Inline text</Body>
 */
export function Body({ 
  children, 
  className, 
  as: Component = 'p' 
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans',
        'text-[clamp(0.9375rem,1.5vw,1.0625rem)]',
        'font-normal',
        'leading-[1.7]',
        'text-[#666666]',
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * CardTitle Component
 * Used for card titles (e.g., Skills cards, Project cards)
 * 
 * @example
 * <CardTitle>Frontend Development</CardTitle>
 * <CardTitle as="h2" className="mb-2">Project Title</CardTitle>
 */
export function CardTitle({ 
  children, 
  className, 
  as: Component = 'h3' 
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans',
        'text-[clamp(1.125rem,2vw,1.375rem)]',
        'font-semibold',
        'leading-[1.3]',
        'text-[#000000]',
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * CardDescription Component
 * Used for card description text
 * 
 * @example
 * <CardDescription>A brief description of the project</CardDescription>
 * <CardDescription as="div" className="text-sm">Smaller description</CardDescription>
 */
export function CardDescription({ 
  children, 
  className, 
  as: Component = 'p' 
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans',
        'text-[clamp(0.9375rem,1.5vw,1.0625rem)]',
        'font-normal',
        'leading-[1.6]',
        'text-[#555555]',
        className
      )}
    >
      {children}
    </Component>
  )
}

