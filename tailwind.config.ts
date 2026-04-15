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
        // Privilege Vault AI — Navy Design System
        vault: {
          bg:             '#0A1628',
          surface:        '#12294A',
          elevated:       '#1A3560',
          border:         '#2B4A7A',
          'border-strong':'#3A6099',
          text:           '#FFFFFF',
          'text-secondary':'#C8D0DC',
          muted:          '#7A8899',
          accent:         '#2B7CC1',
          'accent-light': '#4A9DD4',
          'accent-dim':   '#1A5A99',
          success:        '#1E8A4A',
          warning:        '#B07A10',
          danger:         '#C83232',
          'danger-dim':   '#8B1A1A',
          gold:           '#C9A84C',
          'gold-dim':     '#8A6A20',
          'gold-light':   '#E8C870',
          silver:         '#94A3B8',
        },
        // shadcn compatibility
        border:     '#2B4A7A',
        input:      '#1A3560',
        ring:       '#2B7CC1',
        background: '#0A1628',
        foreground: '#FFFFFF',
        primary: {
          DEFAULT:    '#2B7CC1',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT:    '#1A3560',
          foreground: '#C8D0DC',
        },
        destructive: {
          DEFAULT:    '#C83232',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT:    '#12294A',
          foreground: '#7A8899',
        },
        accent: {
          DEFAULT:    '#1A3560',
          foreground: '#C8D0DC',
        },
        popover: {
          DEFAULT:    '#12294A',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT:    '#12294A',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cambria', 'Georgia', 'Times New Roman', 'serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'vault':          '0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
        'vault-lg':       '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'vault-glow':     '0 0 0 1px rgba(43,124,193,0.5), 0 0 24px rgba(43,124,193,0.2)',
        'vault-gold-glow':'0 0 0 1px rgba(201,168,76,0.5), 0 0 24px rgba(201,168,76,0.15)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
