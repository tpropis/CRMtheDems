import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'dark' | 'light' | 'icon-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: { icon: 28, text: 'text-sm' },
  md: { icon: 36, text: 'text-base' },
  lg: { icon: 48, text: 'text-xl' },
  xl: { icon: 64, text: 'text-2xl' },
}

// SVG recreation of the Privilege Vault AI logo:
// A Greek column with P and V letters forming the pillar structure
export function Logo({ variant = 'dark', size = 'md', className }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size]
  const isDark = variant === 'dark'

  // For dark backgrounds (sidebar/app): silver/white pillar
  // For light backgrounds (marketing): navy pillar
  const pillarColor = isDark ? '#C8D4E8' : '#0D1B35'
  const pillarShadow = isDark ? '#7A8FAD' : '#3B5280'
  const accentBlue = '#3B82F6'
  const capColor = isDark ? '#E2E8F2' : '#0A1628'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Icon: Column/Pillar with PV */}
      <svg
        width={iconSize}
        height={Math.round(iconSize * 1.15)}
        viewBox="0 0 56 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Capital top bar - wider */}
        <rect x="4" y="0" width="48" height="6" rx="1" fill={capColor} />
        {/* Capital second bar */}
        <rect x="8" y="7" width="40" height="4" rx="0.5" fill={pillarColor} />

        {/* Left column shaft - P letter */}
        <path
          d="M10 14 L10 60 L18 60 L18 38 C24 38 30 35 30 26 C30 18 24 14 18 14 Z
             M18 20 C21 20 23 22 23 26 C23 30 21 32 18 32 L18 20 Z"
          fill={pillarColor}
        />

        {/* Right column shaft - V letter */}
        <path
          d="M28 14 L36 14 L44 44 L52 14 L52 14"
          stroke="none"
          fill="none"
        />
        <path
          d="M30 14 L38 14 L44 50 L50 14 L58 14"
          stroke="none"
          fill="none"
        />

        {/* V shape (right side of pillar) */}
        <path
          d="M32 14 L40 14 L46 60 L46 60 L38 60 Z"
          fill={pillarShadow}
          opacity="0.7"
        />
        <path
          d="M40 14 L48 14 L48 60 L40 60 Z"
          fill={pillarColor}
          opacity="0.4"
        />

        {/* Refined PV combined mark */}
        {/* Left pillar (P form) */}
        <rect x="10" y="12" width="8" height="50" rx="0.5" fill={pillarColor} />
        {/* P crossbar */}
        <path
          d="M18 12 Q28 12 28 22 Q28 32 18 32 L18 12"
          fill={pillarColor}
        />
        {/* P inner cutout */}
        <path
          d="M20 17 Q25 17 25 22 Q25 27 20 27 L20 17"
          fill={isDark ? '#0E1220' : '#F1F5F9'}
        />

        {/* Right pillar (V form) */}
        <path
          d="M32 12 L38 12 L44 62 L38 62 Z"
          fill={pillarColor}
        />
        <path
          d="M38 12 L46 12 L46 62 L44 62 L38 12"
          fill={pillarShadow}
          opacity="0.6"
        />
      </svg>

      {/* Wordmark */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <span
            className={cn('font-bold tracking-[0.12em] uppercase', textSize)}
            style={{ color: isDark ? '#E2E8F2' : '#0A1628', letterSpacing: '0.1em' }}
          >
            Privilege Vault
          </span>
          <span
            className={cn('font-semibold tracking-[0.2em] uppercase', {
              'text-xs': size === 'sm',
              'text-sm': size === 'md',
              'text-base': size === 'lg',
              'text-lg': size === 'xl',
            })}
            style={{ color: accentBlue }}
          >
            AI
          </span>
        </div>
      )}
    </div>
  )
}

// Compact monogram for favicon/collapsed sidebar
export function LogoMark({ size = 32, dark = true }: { size?: number; dark?: boolean }) {
  const pillarColor = dark ? '#C8D4E8' : '#0D1B35'
  const accentBlue = '#3B82F6'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified PV pillar mark */}
      <rect x="2" y="1" width="36" height="4" rx="1" fill={pillarColor} />
      <rect x="5" y="6" width="30" height="3" rx="0.5" fill={pillarColor} opacity="0.7" />
      <rect x="7" y="10" width="6" height="29" rx="0.5" fill={pillarColor} />
      <path d="M13 10 Q22 10 22 18 Q22 26 13 26 L13 10" fill={pillarColor} />
      <path d="M15 14 Q19 14 19 18 Q19 22 15 22 L15 14" fill={dark ? '#0E1220' : '#E2E8F2'} />
      <path d="M24 10 L30 10 L34 39 L28 39 Z" fill={accentBlue} opacity="0.8" />
      <path d="M30 10 L36 10 L36 39 L34 39 L30 10" fill={accentBlue} opacity="0.5" />
    </svg>
  )
}

export default Logo
