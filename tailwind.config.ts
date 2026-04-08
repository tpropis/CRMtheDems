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
        // Privilege Vault AI Design System
        vault: {
          bg:        '#080B12',   // page background
          surface:   '#0E1220',   // card / panel surface
          elevated:  '#141824',   // elevated surfaces
          border:    '#1E2535',   // default borders
          'border-strong': '#2A3349', // stronger borders
          text:      '#E2E8F2',   // primary text
          'text-secondary': '#8B98B5', // secondary text
          muted:     '#4A5568',   // muted/disabled
          accent:    '#2563EB',   // primary accent (legal blue)
          'accent-light': '#3B82F6',
          'accent-dim': '#1D4ED8',
          success:   '#16A34A',
          warning:   '#D97706',
          danger:    '#DC2626',
          'danger-dim': '#991B1B',
          gold:      '#B8860B',   // premium accents
          silver:    '#94A3B8',   // secondary metallic
        },
        // Shadcn compatibility
        border: '#1E2535',
        input: '#1E2535',
        ring: '#2563EB',
        background: '#080B12',
        foreground: '#E2E8F2',
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#141824',
          foreground: '#E2E8F2',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#0E1220',
          foreground: '#8B98B5',
        },
        accent: {
          DEFAULT: '#141824',
          foreground: '#E2E8F2',
        },
        popover: {
          DEFAULT: '#0E1220',
          foreground: '#E2E8F2',
        },
        card: {
          DEFAULT: '#0E1220',
          foreground: '#E2E8F2',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'vault': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5)',
        'vault-lg': '0 4px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)',
        'vault-glow': '0 0 0 1px rgba(37,99,235,0.3), 0 0 20px rgba(37,99,235,0.1)',
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
