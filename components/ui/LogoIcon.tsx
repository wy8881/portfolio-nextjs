interface LogoIconProps {
  className?: string
  style?: React.CSSProperties
}

export default function LogoIcon({ className, style }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* Circle outline */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
      {/* Left arm — tapers from tip at upper-left to stem junction */}
      <path fill="currentColor" d="M 21 20 C 10 30 38 50 46 56 C 40 48 28 30 21 20 Z" />
      {/* Right arm — mirror of left */}
      <path fill="currentColor" d="M 79 20 C 90 30 62 50 54 56 C 60 48 72 30 79 20 Z" />
      {/* Stem + serifs */}
      <path fill="currentColor" d="M 46 50 L 46 80 L 40 80 L 40 82 L 60 82 L 60 80 L 54 80 L 54 50 Z" />
    </svg>
  )
}
