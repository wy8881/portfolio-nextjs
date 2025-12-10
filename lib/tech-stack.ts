export interface TechItem {
  name: string
  fontSize: string
  xPosition: string
  yPosition: string
  color: string
  fontWeight: string
}

export const TECH_STACK: TechItem[] = [
  {
    name: 'React',
    fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
    xPosition: '12%',
    yPosition: '12%',
    color: 'text-gray-500',
    fontWeight: 'font-light',
  },
  {
    name: 'TypeScript',
    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
    xPosition: '66%',
    yPosition: '25%',
    color: 'text-gray-500',
    fontWeight: 'font-light',
  },
  {
    name: 'Next.js',
    fontSize: 'clamp(1.25rem, 1.5vw, 1.5rem)',
    xPosition: '37%',
    yPosition: '35%',
    color: 'text-gray-600',
    fontWeight: 'font-medium',
  },
  {
    name: 'Python',
    fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
    xPosition: '16%',
    yPosition: '48%',
    color: 'text-gray-500',
    fontWeight: 'font-light',
  },
  {
    name: 'Spring Boot',
    fontSize: 'clamp(1.125rem, 1.3vw, 1.25rem)',
    xPosition: '62%',
    yPosition: '58%',
    color: 'text-gray-600',
    fontWeight: 'font-medium',
  },
  {
    name: 'MongoDB',
    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
    xPosition: '32%',
    yPosition: '68%',
    color: 'text-gray-500',
    fontWeight: 'font-light',
  },
  {
    name: 'Tailwind CSS',
    fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
    xPosition: '69%',
    yPosition: '82%',
    color: 'text-gray-500',
    fontWeight: 'font-light',
  },
  {
    name: 'AWS',
    fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
    xPosition: '22%',
    yPosition: '75%',
    color: 'text-gray-500',
    fontWeight: 'font-light',
  },
]

