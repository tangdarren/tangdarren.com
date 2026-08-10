/** @type {import('tailwindcss').Config} */
// Light theme palette. Token names (ink-*, mist-*, accent-*) are kept from the
// prior version so downstream JSX can stay stable, but their values now map
// to a bright, professional design:
//   ink-*   → light surface backgrounds (bg / cards / hovers / borders)
//   mist-*  → dark navy/charcoal text (primary → subtle)
//   accent  → primary blue, plus sparingly-used cyan / green / lavender
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces (light)
        ink: {
          950: '#F7F6F3', // Main page background (warm off-white)
          900: '#FFFFFF', // Card / panel background
          850: '#F1F0EC', // Header strips inside panels
          800: '#EBEAE6', // Secondary background, hover on cards
          700: '#E2E0DB', // Subtle dividers
          600: '#D8D6D0', // Standard border
          500: '#C9C6BF', // Stronger border
        },
        // Text (dark navy / charcoal)
        mist: {
          50: '#0B1220',  // Strongest heading
          100: '#172033', // Primary text
          200: '#293449', // Strong body text
          300: '#526077', // Secondary text
          400: '#6B7A91', // Muted labels
          500: '#94A3B8', // Placeholders / very muted
        },
        // Accents — primary blue, sparing cyan / green / lavender
        accent: {
          cyan: '#2563EB',     // PRIMARY BLUE (repurposed from prior name)
          blue: '#0891B2',     // Cyan accent (sparing use)
          green: '#16A34A',    // Green accent (sparing use)
          lavender: '#7C3AED', // Occasional lavender highlight
        },
        // Semantic brand ramp — for gradients and tinted surfaces
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
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
          'var(--font-jetbrains-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        // Light, natural shadows for cards on a bright background
        panel:
          '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.10)',
        card:
          '0 1px 2px 0 rgba(15, 23, 42, 0.05), 0 12px 32px -16px rgba(37, 99, 235, 0.18)',
        glow:
          '0 0 0 1px rgba(37, 99, 235, 0.25), 0 10px 28px -14px rgba(37, 99, 235, 0.35)',
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
