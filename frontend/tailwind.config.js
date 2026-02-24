/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background:  'oklch(0.07 0.015 265)',
        foreground:  'oklch(0.92 0.010 265)',
        border:      'oklch(0.22 0.025 265)',
        ring:        'oklch(0.60 0.18 275)',
        input:       'oklch(0.13 0.020 265)',

        text: {
          DEFAULT: 'oklch(0.92 0.010 265)',
          muted:   'oklch(0.55 0.020 265)',
        },

        surface: {
          1: 'oklch(0.10 0.018 265)',
          2: 'oklch(0.13 0.020 265)',
          3: 'oklch(0.16 0.022 265)',
        },

        indigo: {
          DEFAULT: 'oklch(0.60 0.18 275)',
          light:   'oklch(0.72 0.14 275)',
          dark:    'oklch(0.45 0.20 275)',
          400:     'oklch(0.68 0.16 275)',
          500:     'oklch(0.60 0.18 275)',
          600:     'oklch(0.52 0.20 275)',
        },

        cyan: {
          DEFAULT: 'oklch(0.75 0.14 200)',
          light:   'oklch(0.85 0.10 200)',
          300:     'oklch(0.82 0.12 200)',
          400:     'oklch(0.75 0.14 200)',
          500:     'oklch(0.68 0.16 200)',
        },

        purple: {
          400: 'oklch(0.68 0.18 300)',
        },

        green: {
          400: 'oklch(0.70 0.15 145)',
        },

        red: {
          400: 'oklch(0.62 0.20 25)',
          500: 'oklch(0.55 0.22 25)',
        },

        yellow: {
          500: 'oklch(0.75 0.15 75)',
        },

        primary: {
          DEFAULT:    'oklch(0.60 0.18 275)',
          foreground: 'oklch(0.98 0.005 265)',
        },
        secondary: {
          DEFAULT:    'oklch(0.13 0.020 265)',
          foreground: 'oklch(0.92 0.010 265)',
        },
        muted: {
          DEFAULT:    'oklch(0.13 0.020 265)',
          foreground: 'oklch(0.55 0.020 265)',
        },
        accent: {
          DEFAULT:    'oklch(0.16 0.022 265)',
          foreground: 'oklch(0.92 0.010 265)',
        },
        destructive: {
          DEFAULT:    'oklch(0.55 0.20 25)',
          foreground: 'oklch(0.98 0.005 265)',
        },
        card: {
          DEFAULT:    'oklch(0.10 0.018 265)',
          foreground: 'oklch(0.92 0.010 265)',
        },
        popover: {
          DEFAULT:    'oklch(0.13 0.020 265)',
          foreground: 'oklch(0.92 0.010 265)',
        },
      },

      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      borderRadius: {
        sm:   '6px',
        DEFAULT: '8px',
        md:   '10px',
        lg:   '12px',
        xl:   '16px',
        '2xl': '20px',
        '3xl': '24px',
        full: '9999px',
      },

      boxShadow: {
        'glow-sm': '0 0 12px oklch(0.60 0.18 275 / 0.25)',
        'glow':    '0 0 20px oklch(0.60 0.18 275 / 0.35), 0 0 40px oklch(0.60 0.18 275 / 0.15)',
        'glow-lg': '0 0 32px oklch(0.60 0.18 275 / 0.45), 0 0 64px oklch(0.60 0.18 275 / 0.20)',
        'glow-cyan': '0 0 20px oklch(0.75 0.14 200 / 0.30)',
      },

      animation: {
        'fade-up':    'fade-up 0.5s ease forwards',
        'fade-in':    'fade-in 0.4s ease forwards',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'slide-in':   'slide-in-up 0.3s ease forwards',
      },

      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        'slide-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
