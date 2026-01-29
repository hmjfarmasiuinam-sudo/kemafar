import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eaebf0',
          100: '#cdd0da',
          200: '#a3a6b8',
          300: '#757891',
          400: '#5F6074', // Payne's Gray (Secondary Level 2)
          500: '#40415a',
          600: '#1D1D44', // Space Cadet (Base/Identity Level 1)
          700: '#171739',
          800: '#12122e',
          900: '#0c0c24',
          950: '#070718',
        },
        secondary: {
          50: '#f4f4f6', // Very light gray tint
          100: '#e4e4e7', // Light gray
          200: '#c8c8ce', // Soft gray
          300: '#a5a6b0', // Mid gray
          400: '#828392', // Darker gray
          500: '#5F6074', // Payne's Gray (Base)
          600: '#4a4b5d',
          700: '#383949',
          800: '#282936',
          900: '#1D1D44', // Merges towards Primary at darkest
          950: '#111126',
        },
        accent: {
          50: '#fafaf6',
          100: '#F5F5DC', // Beige (Base)
          200: '#e9e0c6',
          300: '#dcd1a7',
          400: '#cfc089',
          500: '#c2af6b',
          600: '#9b8c56',
          700: '#746940',
          800: '#4d462b',
          900: '#262315',
          950: '#13110a',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'ping-slow': 'pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pingSlow: {
          '75%, 100%': {
            transform: 'scale(1.3)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
