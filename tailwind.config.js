/** @type {import('tailwindcss').Config} */
// Semantic palette via CSS variables (see src/index.css).
// Token names stay stable; [data-mode="dark"] remaps the underlying RGB channels.
//   ink-*   → surface backgrounds / borders
//   mist-*  → text (primary → muted)
//   accent  → primary blue + sparing cyan / green / lavender
export default {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'rgb(var(--color-ink-950) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          850: 'rgb(var(--color-ink-850) / <alpha-value>)',
          800: 'rgb(var(--color-ink-800) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          500: 'rgb(var(--color-ink-500) / <alpha-value>)',
        },
        mist: {
          50: 'rgb(var(--color-mist-50) / <alpha-value>)',
          100: 'rgb(var(--color-mist-100) / <alpha-value>)',
          200: 'rgb(var(--color-mist-200) / <alpha-value>)',
          300: 'rgb(var(--color-mist-300) / <alpha-value>)',
          400: 'rgb(var(--color-mist-400) / <alpha-value>)',
          500: 'rgb(var(--color-mist-500) / <alpha-value>)',
        },
        accent: {
          cyan: 'rgb(var(--color-accent-cyan) / <alpha-value>)',
          blue: 'rgb(var(--color-accent-blue) / <alpha-value>)',
          green: 'rgb(var(--color-accent-green) / <alpha-value>)',
          lavender: 'rgb(var(--color-accent-lavender) / <alpha-value>)',
        },
        brand: {
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          200: 'rgb(var(--color-brand-200) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)',
          600: 'rgb(var(--color-brand-600) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-dm-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'var(--font-dm-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-dm-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 45%': { opacity: '1' },
          '55%, 100%': { opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        blink: 'blink 1.1s steps(1) infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
