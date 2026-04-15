import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── New design token colours ───────────────────────
        pv: {
          base:         '#070E1A',
          sidebar:      '#0A1628',
          card:         '#0F2040',
          elevated:     '#162B52',
          hover:        '#1E3A6B',
          gold:         '#C9A84C',
          'gold-light': '#E2C97E',
          accent:       '#3B8FD4',
          't1':         '#F2F5F9',
          't2':         '#94A8C0',
          't3':         '#4E6480',
          success:      '#2EAD6E',
          danger:       '#E05252',
          warning:      '#D4A017',
        },
        // ── Legacy vault tokens (keep for backward compat) ──
        vault: {
          bg:              '#070E1A',
          surface:         '#0F2040',
          elevated:        '#162B52',
          border:          'rgba(255,255,255,0.06)',
          'border-strong': 'rgba(255,255,255,0.11)',
          text:            '#F2F5F9',
          'text-secondary':'#94A8C0',
          muted:           '#4E6480',
          accent:          '#3B8FD4',
          'accent-light':  '#5BAAEC',
          'accent-dim':    '#1A5A99',
          success:         '#2EAD6E',
          warning:         '#D4A017',
          danger:          '#E05252',
          'danger-dim':    '#8B1A1A',
          gold:            '#C9A84C',
          'gold-dim':      'rgba(201,168,76,0.12)',
          'gold-light':    '#E2C97E',
          silver:          '#94A3B8',
        },
        // ── shadcn compatibility ───────────────────────────
        border:     'rgba(255,255,255,0.06)',
        input:      '#162B52',
        ring:       '#3B8FD4',
        background: '#070E1A',
        foreground: '#F2F5F9',
        primary: {
          DEFAULT:    '#3B8FD4',
          foreground: '#F2F5F9',
        },
        secondary: {
          DEFAULT:    '#162B52',
          foreground: '#94A8C0',
        },
        destructive: {
          DEFAULT:    '#E05252',
          foreground: '#F2F5F9',
        },
        muted: {
          DEFAULT:    '#0F2040',
          foreground: '#4E6480',
        },
        accent: {
          DEFAULT:    '#162B52',
          foreground: '#94A8C0',
        },
        popover: {
          DEFAULT:    '#0F2040',
          foreground: '#F2F5F9',
        },
        card: {
          DEFAULT:    '#0F2040',
          foreground: '#F2F5F9',
        },
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono:  ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'vault':           '0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
        'vault-lg':        '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'vault-glow':      '0 0 0 1px rgba(59,143,212,0.5), 0 0 24px rgba(59,143,212,0.2)',
        'vault-gold-glow': '0 0 0 1px rgba(201,168,76,0.5), 0 0 24px rgba(201,168,76,0.15)',
        'panel':           '-8px 0 40px rgba(0,0,0,0.4)',
        'float':           '0 4px 20px rgba(201,168,76,0.4)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(46,173,110,0.4)' },
          '50%':     { opacity: '0.7', boxShadow: '0 0 0 4px rgba(46,173,110,0)' },
        },
        'spin-ring': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'ticker-scroll': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-up-panel': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'fade-in':         'fade-in 0.2s ease-out',
        'slide-in-right':  'slide-in-right 0.3s ease-out',
        'shimmer':         'shimmer 2s linear infinite',
        'pulse-dot':       'pulse-dot 2s infinite',
        'spin-ring':       'spin-ring 3s linear infinite',
        'ticker-scroll':   'ticker-scroll 30s linear infinite',
        'slide-up-panel':  'slide-up-panel 0.25s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
