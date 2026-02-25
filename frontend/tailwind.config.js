/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.08 0.01 260)',
        foreground: 'oklch(0.92 0.02 200)',
        card: {
          DEFAULT: 'oklch(0.11 0.015 260)',
          foreground: 'oklch(0.92 0.02 200)',
        },
        popover: {
          DEFAULT: 'oklch(0.10 0.015 260)',
          foreground: 'oklch(0.92 0.02 200)',
        },
        primary: {
          DEFAULT: 'oklch(0.65 0.22 25)',
          foreground: 'oklch(0.98 0.005 0)',
        },
        secondary: {
          DEFAULT: 'oklch(0.15 0.02 260)',
          foreground: 'oklch(0.85 0.03 200)',
        },
        muted: {
          DEFAULT: 'oklch(0.14 0.015 260)',
          foreground: 'oklch(0.55 0.02 220)',
        },
        accent: {
          DEFAULT: 'oklch(0.72 0.18 195)',
          foreground: 'oklch(0.08 0.01 260)',
        },
        destructive: {
          DEFAULT: 'oklch(0.55 0.22 25)',
          foreground: 'oklch(0.98 0.005 0)',
        },
        border: 'oklch(0.20 0.02 260)',
        input: 'oklch(0.14 0.015 260)',
        ring: 'oklch(0.65 0.22 25)',
        brand: {
          DEFAULT: 'oklch(0.65 0.22 25)',
          light: 'oklch(0.72 0.20 30)',
          dark: 'oklch(0.50 0.22 20)',
        },
        cyan: {
          DEFAULT: 'oklch(0.72 0.18 195)',
          light: 'oklch(0.80 0.15 195)',
          dark: 'oklch(0.58 0.20 195)',
        },
        surface: {
          DEFAULT: 'oklch(0.11 0.015 260)',
          raised: 'oklch(0.14 0.015 260)',
        },
        'text-primary': 'oklch(0.92 0.02 200)',
        'text-secondary': 'oklch(0.70 0.03 220)',
        'text-muted': 'oklch(0.50 0.02 220)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'brand-glow': '0 0 20px oklch(0.65 0.22 25 / 0.4), 0 0 40px oklch(0.65 0.22 25 / 0.2)',
        'brand-glow-sm': '0 0 10px oklch(0.65 0.22 25 / 0.3)',
        'cyan-glow': '0 0 20px oklch(0.72 0.18 195 / 0.4), 0 0 40px oklch(0.72 0.18 195 / 0.2)',
        'cyan-glow-sm': '0 0 10px oklch(0.72 0.18 195 / 0.3)',
        'glass': '0 8px 32px oklch(0.0 0.0 0 / 0.4)',
      },
      keyframes: {
        'flame-flicker': {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
          '25%': { transform: 'scaleY(1.05) scaleX(0.97)', opacity: '0.95' },
          '50%': { transform: 'scaleY(0.97) scaleX(1.02)', opacity: '1' },
          '75%': { transform: 'scaleY(1.03) scaleX(0.98)', opacity: '0.97' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px oklch(0.65 0.22 25 / 0.3)' },
          '50%': { boxShadow: '0 0 25px oklch(0.65 0.22 25 / 0.6), 0 0 50px oklch(0.65 0.22 25 / 0.3)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'flame': 'flame-flicker 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
