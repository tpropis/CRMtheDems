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
        // Privilege Vault — Law Library palette
        // Warm parchment + deep forest + antique brass
        vault: {
          ink:       '#14120E',   // deepest text / headings (soft black with warm bias)
          bg:        '#F7F2E7',   // page canvas — warm parchment
          surface:   '#FFFFFF',   // cards / panels — pure paper
          elevated:  '#FBF6EA',   // elevated card / cream
          raised:    '#F2ECDA',   // modal / floating
          border:    '#E2DAC2',   // default hairline
          'border-strong': '#C9BE9F',
          text:      '#14120E',   // primary ink
          'text-secondary': '#52504A',
          muted:     '#8B8676',
          faint:     '#B5AE9C',
          accent:    '#1F4A3D',   // deep forest / library green
          'accent-light': '#2B6653',
          'accent-dim': '#15382D',
          'accent-soft': 'rgba(31,74,61,0.08)',
          success:   '#487A3A',   // muted olive
          warning:   '#B68A3E',   // brass — doubles as warning
          danger:    '#7A2D2A',   // oxblood
          'danger-dim': '#5A1F1D',
          gold:      '#B68A3E',   // antique brass — heritage accent
          'gold-dim': '#8A6A2D',
          'gold-light': '#D4AC5F',
          silver:    '#8A8472',
          sage:      '#C9D4C2',   // soft success tint
          oxblood:   '#7A2D2A',
        },
        // Shadcn compatibility (light mode)
        border: '#E2DAC2',
        input: '#E2DAC2',
        ring: '#1F4A3D',
        background: '#F7F2E7',
        foreground: '#14120E',
        primary: {
          DEFAULT: '#1F4A3D',
          foreground: '#FBF6EA',
        },
        secondary: {
          DEFAULT: '#F2ECDA',
          foreground: '#14120E',
        },
        destructive: {
          DEFAULT: '#7A2D2A',
          foreground: '#FBF6EA',
        },
        muted: {
          DEFAULT: '#FBF6EA',
          foreground: '#52504A',
        },
        accent: {
          DEFAULT: '#F2ECDA',
          foreground: '#14120E',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#14120E',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#14120E',
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
        'vault':        '0 1px 2px rgba(20,18,14,0.04), 0 1px 3px rgba(20,18,14,0.06)',
        'vault-lg':     '0 4px 12px rgba(20,18,14,0.06), 0 2px 4px rgba(20,18,14,0.04)',
        'vault-xl':     '0 10px 30px rgba(20,18,14,0.09), 0 4px 10px rgba(20,18,14,0.06)',
        'vault-glow':   '0 0 0 1px rgba(31,74,61,0.25), 0 0 24px rgba(31,74,61,0.08)',
        'vault-seal':   '0 0 0 1px rgba(182,138,62,0.35), 0 0 24px rgba(182,138,62,0.12)',
        'vault-hairline': 'inset 0 0 0 1px rgba(226,218,194,0.9)',
        'vault-inset':  'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(20,18,14,0.03)',
      },
      backgroundImage: {
        'vault-grid':
          'linear-gradient(rgba(201,190,159,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(201,190,159,0.35) 1px, transparent 1px)',
        'vault-radial':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(31,74,61,0.08), transparent 60%)',
        'vault-radial-gold':
          'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(182,138,62,0.10), transparent 70%)',
        'vault-paper':
          'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,255,255,0.6), transparent 70%)',
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
          '0%, 100%': { opacity: '0.9', boxShadow: '0 0 0 0 rgba(182,138,62,0.3)' },
          '50%':      { opacity: '1',   boxShadow: '0 0 0 10px rgba(182,138,62,0)' },
        },
        'ticker': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.24s cubic-bezier(0.22,1,0.36,1)',
        'rise-in':        'rise-in 0.4s cubic-bezier(0.22,1,0.36,1)',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        shimmer:          'shimmer 2s linear infinite',
        'seal-pulse':     'seal-pulse 3.2s ease-in-out infinite',
        ticker:           'ticker 45s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
