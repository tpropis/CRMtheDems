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
        // Privilege Vault AI Design System — Sovereign Custodian
        vault: {
          ink:       '#05070D',   // deepest canvas (hero base)
          bg:        '#080B12',   // page background
          surface:   '#0E1220',   // card / panel surface
          elevated:  '#141A2C',   // elevated surfaces
          raised:    '#1A2138',   // floating / modal
          border:    '#1E2535',   // default hairline
          'border-strong': '#2A3349',
          text:      '#E6ECF5',   // primary text
          'text-secondary': '#8B98B5',
          muted:     '#4A5568',
          faint:     '#384055',
          accent:    '#2563EB',
          'accent-light': '#3B82F6',
          'accent-dim': '#1D4ED8',
          'accent-soft': 'rgba(59,130,246,0.12)',
          success:   '#16A34A',
          warning:   '#D97706',
          danger:    '#DC2626',
          'danger-dim': '#991B1B',
          gold:      '#C9A65A',   // seal gold — heritage accent
          'gold-dim': '#8F7433',
          silver:    '#94A3B8',
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
        display: ['Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        'widest-2': '0.18em',
      },
      boxShadow: {
        'vault': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5)',
        'vault-lg': '0 4px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)',
        'vault-glow': '0 0 0 1px rgba(37,99,235,0.3), 0 0 20px rgba(37,99,235,0.1)',
        'vault-seal': '0 0 0 1px rgba(201,166,90,0.35), 0 0 24px rgba(201,166,90,0.08)',
        'vault-hairline': 'inset 0 0 0 1px rgba(42,51,73,0.8)',
      },
      backgroundImage: {
        'vault-grid':
          'linear-gradient(rgba(30,37,53,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(30,37,53,0.45) 1px, transparent 1px)',
        'vault-radial':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.14), transparent 60%)',
        'vault-radial-gold':
          'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,166,90,0.06), transparent 70%)',
      },
      backgroundSize: {
        'vault-grid': '56px 56px',
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
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
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
        'seal-pulse': {
          '0%, 100%': { opacity: '0.9', boxShadow: '0 0 0 0 rgba(201,166,90,0.25)' },
          '50%': { opacity: '1', boxShadow: '0 0 0 10px rgba(201,166,90,0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.24s cubic-bezier(0.22,1,0.36,1)',
        'rise-in': 'rise-in 0.4s cubic-bezier(0.22,1,0.36,1)',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'seal-pulse': 'seal-pulse 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
