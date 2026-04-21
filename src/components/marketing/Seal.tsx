import { cn } from '@/lib/utils'

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
          <stop offset="0%" stopColor="#1A2138" />
          <stop offset="100%" stopColor="#0E1220" />
        </radialGradient>
        <linearGradient id="seal-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D39A" />
          <stop offset="100%" stopColor="#8F7433" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="32" cy="32" r="30" stroke="url(#seal-ring)" strokeWidth="1" opacity="0.9" />
      <circle cx="32" cy="32" r="27" stroke="url(#seal-ring)" strokeWidth="0.5" opacity="0.45" />
      {/* Inner disc */}
      <circle cx="32" cy="32" r="24" fill="url(#seal-inner)" />
      {/* Monogram PV — abstract column */}
      <g transform="translate(22, 18)">
        <rect x="0" y="0" width="20" height="2" fill="#E6ECF5" />
        <rect x="2" y="3" width="16" height="1.2" fill="#E6ECF5" opacity="0.75" />
        <rect x="3" y="6" width="3" height="22" fill="#E6ECF5" />
        <path d="M6 6 Q13 6 13 12 Q13 18 6 18 L6 6 Z" fill="#E6ECF5" />
        <path d="M7.5 9 Q10.5 9 10.5 12 Q10.5 15 7.5 15 Z" fill="#0E1220" />
        <path d="M12 6 L17 6 L20 28 L15 28 Z" fill="#C9A65A" opacity="0.9" />
      </g>
      {/* Tick marks around ring */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const x1 = 32 + Math.cos(angle) * 28.5
        const y1 = 32 + Math.sin(angle) * 28.5
        const x2 = 32 + Math.cos(angle) * 30
        const y2 = 32 + Math.sin(angle) * 30
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#C9A65A"
            strokeWidth="0.6"
            opacity="0.6"
          />
        )
      })}
    </svg>
  )
}
