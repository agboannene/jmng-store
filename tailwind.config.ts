import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        onyx: { DEFAULT: '#121014', soft: '#1D1A22' },
        ivory: { DEFAULT: '#FAF7F1', deep: '#F1EADF' },
        gold: { light: '#F1E3C3', DEFAULT: '#C6A15B', deep: '#9A7B2E' },
        emerald: { DEFAULT: '#0E5E4A', tint: '#DFF0E8' },
        blush: { DEFAULT: '#F6D9D0', deep: '#C98A7A' },
        clay: { DEFAULT: '#B4432F', tint: '#FBE7E1' },
        stone: { border: '#E8E2D6', muted: '#6E675C' },
      },
      fontFamily: {
        display: ['Fraunces', 'Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { sm: '8px', md: '12px', lg: '16px', xl: '24px' },
      boxShadow: {
        card: '0 1px 2px rgba(18,16,20,.06), 0 8px 24px -12px rgba(18,16,20,.18)',
        pop: '0 12px 40px -12px rgba(18,16,20,.30)',
      },
    },
  },
  plugins: [],
};
export default config;
