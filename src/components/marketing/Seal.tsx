import { cn } from '@/lib/utils'

/**
 * Privilege Vault seal — brass disc with three-column monogram, reads as
 * a firm seal / legal notary. Sits on parchment backgrounds.
 */
export function Seal({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('', className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="seal-inner" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FBF6EA" />
          <stop offset="100%" stopColor="#F2ECDA" />
        </radialGradient>
        <linearGradient id="seal-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4AC5F" />
          <stop offset="55%" stopColor="#B68A3E" />
          <stop offset="100%" stopColor="#8A6A2D" />
        </linearGradient>
      </defs>

      {/* Outer rings */}
      <circle cx="32" cy="32" r="30" stroke="url(#seal-ring)" strokeWidth="1" opacity="0.95" />
      <circle cx="32" cy="32" r="27" stroke="url(#seal-ring)" strokeWidth="0.5" opacity="0.45" />

      {/* Inner disc */}
      <circle cx="32" cy="32" r="24" fill="url(#seal-inner)" />

      {/* Three columns inside the seal */}
      <g transform="translate(17, 20)">
        {/* Architrave */}
        <rect x="0" y="0" width="30" height="2" rx="0.4" fill="#14120E" />
        {/* Column caps */}
        <rect x="2" y="3" width="4.5" height="0.8" fill="#14120E" />
        <rect x="12.75" y="3" width="4.5" height="0.8" fill="#14120E" />
        <rect x="23.5" y="3" width="4.5" height="0.8" fill="#14120E" />
        {/* Shafts */}
        <rect x="2.75" y="4" width="3" height="15" fill="#14120E" />
        <rect x="13.5" y="4" width="3" height="15" fill="#14120E" />
        <rect x="24.25" y="4" width="3" height="15" fill="#14120E" />
        {/* Column bases */}
        <rect x="2" y="19.2" width="4.5" height="0.8" fill="#14120E" />
        <rect x="12.75" y="19.2" width="4.5" height="0.8" fill="#14120E" />
        <rect x="23.5" y="19.2" width="4.5" height="0.8" fill="#14120E" />
        {/* Stylobate */}
        <rect x="0" y="20.4" width="30" height="2" rx="0.4" fill="#14120E" />
      </g>

      {/* Tick marks around ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180
        const x1 = 32 + Math.cos(angle) * 28.5
        const y1 = 32 + Math.sin(angle) * 28.5
        const x2 = 32 + Math.cos(angle) * 29.7
        const y2 = 32 + Math.sin(angle) * 29.7
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#8A6A2D"
            strokeWidth="0.5"
            opacity="0.6"
          />
        )
      })}
    </svg>
  )
}
