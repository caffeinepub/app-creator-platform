/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background:  "oklch(var(--background) / <alpha-value>)",
        foreground:  "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT:    "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT:    "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT:    "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT:    "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT:    "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT:    "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT:    "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border:  "oklch(var(--border) / <alpha-value>)",
        input:   "oklch(var(--input) / <alpha-value>)",
        ring:    "oklch(var(--ring) / <alpha-value>)",
        brand: {
          DEFAULT: "var(--brand)",
          dim:     "var(--brand-dim)",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        xl:   "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        brand:    "0 4px 20px oklch(0.72 0.19 45 / 0.30)",
        "brand-lg": "0 8px 40px oklch(0.72 0.19 45 / 0.40)",
        glass:    "0 4px 24px oklch(0 0 0 / 0.40)",
      },
      keyframes: {
        "flame-flicker": {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)" },
          "25%":       { transform: "scaleY(1.04) scaleX(0.97)" },
          "50%":       { transform: "scaleY(0.97) scaleX(1.02)" },
          "75%":       { transform: "scaleY(1.02) scaleX(0.98)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0.8)", opacity: "0.5" },
          "40%":           { transform: "scale(1.2)", opacity: "1" },
        },
      },
      animation: {
        "flame-flicker": "flame-flicker 2s ease-in-out infinite",
        "fade-in":       "fade-in 0.3s ease forwards",
        "slide-up":      "slide-up 0.4s ease forwards",
        "bounce-dot":    "bounce-dot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
