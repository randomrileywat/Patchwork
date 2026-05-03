/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
        sans: ['IBM Plex Sans', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '50%': { transform: 'translateX(6px)' },
          '75%': { transform: 'translateX(-3px)' },
        },
        xpfloat: {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '20%': { opacity: 1 },
          '100%': { transform: 'translateY(-40px)', opacity: 0 },
        },
        flashTeal: {
          '0%': { backgroundColor: 'rgba(0,212,168,0.25)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        shake: 'shake 0.35s ease-in-out',
        xpfloat: 'xpfloat 1.2s ease-out forwards',
        flashTeal: 'flashTeal 0.9s ease-out',
      },
    },
  },
  plugins: [],
};
