import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'dark' | 'light' | 'icon-only' | 'mono-ink' | 'mono-cream'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showTagline?: boolean
}

const sizes = {
  sm: { icon: 26, text: 'text-[13px]', tag: 'text-[9px]' },
  md: { icon: 34, text: 'text-[15px]', tag: 'text-[10px]' },
  lg: { icon: 46, text: 'text-[19px]', tag: 'text-[11px]' },
  xl: { icon: 60, text: 'text-[24px]', tag: 'text-[12px]' },
}

/**
 * Privilege Vault logo — three-column classical mark.
 *
 * Icon: a disciplined architectural glyph — capital rule (architrave) sits
 * above three Doric shafts with micro-caps and base plinths, closed by a
 * stylobate rule below. Reads as "jurisprudence" instantly and holds its
 * shape from 16px favicon up to 200px hero.
 *
 * Wordmark: "Privilege Vault" in Fraunces serif with a fine letterspace and
 * an optional small-caps sub-label.
 */
export function Logo({ variant = 'dark', size = 'md', className, showTagline = false }: LogoProps) {
  const { icon: iconSize, text: textSize, tag: tagSize } = sizes[size]

  // Palette mapping:
  //   dark variant  → used on LIGHT parchment backgrounds (app, marketing)
  //   light variant → used on DARK forest / ink backgrounds
  const onLight = variant === 'dark' || variant === 'mono-ink'
  const mono = variant === 'mono-ink' || variant === 'mono-cream'

  const inkColor    = onLight ? '#14120E' : '#FBF6EA' // columns
  const ruleColor   = onLight ? '#14120E' : '#FBF6EA' // capital + base rules
  const accent      = mono ? (onLight ? '#14120E' : '#FBF6EA') : '#B68A3E' // brass tick
  const wordColor   = onLight ? '#14120E' : '#FBF6EA'
  const tagColor    = mono ? wordColor : '#B68A3E'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Privilege Vault"
      >
        {/* Upper taenia (thin rule above the architrave) */}
        <rect x="7" y="5" width="34" height="1.25" fill={ruleColor} />

        {/* Architrave / capital */}
        <rect x="4" y="7.5" width="40" height="3" rx="0.5" fill={ruleColor} />

        {/* Column caps (abacus line just below architrave) */}
        <rect x="7.5" y="11.75" width="6" height="1" fill={ruleColor} />
        <rect x="21" y="11.75" width="6" height="1" fill={ruleColor} />
        <rect x="34.5" y="11.75" width="6" height="1" fill={ruleColor} />

        {/* Three column shafts */}
        <rect x="8.25" y="13.25" width="4.5" height="21" fill={inkColor} />
        <rect x="21.75" y="13.25" width="4.5" height="21" fill={inkColor} />
        <rect x="35.25" y="13.25" width="4.5" height="21" fill={inkColor} />

        {/* Column bases (small plinth line) */}
        <rect x="7.5" y="34.5" width="6" height="1" fill={ruleColor} />
        <rect x="21" y="34.5" width="6" height="1" fill={ruleColor} />
        <rect x="34.5" y="34.5" width="6" height="1" fill={ruleColor} />

        {/* Stylobate / base */}
        <rect x="4" y="36.5" width="40" height="3" rx="0.5" fill={ruleColor} />

        {/* Lower taenia */}
        <rect x="7" y="40.75" width="34" height="1.25" fill={ruleColor} />

        {/* Brass seal tick on the center column — heritage accent */}
        <rect x="23.25" y="22.5" width="1.5" height="3" fill={accent} />
      </svg>

      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <span
            className={cn('font-display font-medium tracking-[0.02em]', textSize)}
            style={{ color: wordColor, fontFeatureSettings: '"ss01"' }}
          >
            Privilege Vault
          </span>
          {showTagline && (
            <span
              className={cn('font-mono font-medium uppercase tracking-[0.22em] mt-1', tagSize)}
              style={{ color: tagColor }}
            >
              Legal Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Compact monogram — three miniature columns inside a square frame.
 * Use for favicon, collapsed sidebar, notification avatars.
 */
export function LogoMark({
  size = 32,
  variant = 'dark',
}: {
  size?: number
  variant?: 'dark' | 'light' | 'mono-ink' | 'mono-cream'
}) {
  const onLight = variant === 'dark' || variant === 'mono-ink'
  const mono = variant === 'mono-ink' || variant === 'mono-cream'
  const ink = onLight ? '#14120E' : '#FBF6EA'
  const accent = mono ? ink : '#B68A3E'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Architrave */}
      <rect x="3" y="6" width="26" height="2" rx="0.4" fill={ink} />
      {/* Three shafts */}
      <rect x="6" y="9.5" width="3" height="13" fill={ink} />
      <rect x="14.5" y="9.5" width="3" height="13" fill={ink} />
      <rect x="23" y="9.5" width="3" height="13" fill={ink} />
      {/* Base */}
      <rect x="3" y="24" width="26" height="2" rx="0.4" fill={ink} />
      {/* Brass tick */}
      <rect x="15.5" y="14.5" width="1" height="3" fill={accent} />
    </svg>
  )
}

export default Logo
