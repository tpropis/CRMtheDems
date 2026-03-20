import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c2d1ff',
          300: '#9ab3ff',
          400: '#6d8dff',
          500: '#4361ff',
          600: '#2b3ef5',
          700: '#1e2de1',
          800: '#1e27b6',
          900: '#1e2690',
          950: '#141855',
        },
        slate: {
          850: '#1a2234',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
