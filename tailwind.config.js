/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bjj: {
          dark: '#08090c',
          card: '#12141c',
          panel: '#181b26',
          border: '#2a2f42',
          gold: {
            DEFAULT: '#f59e0b',
            light: '#fbbf24',
            dark: '#b45309',
            glow: '#fde68a'
          },
          red: {
            DEFAULT: '#ef4444',
            dark: '#991b1b',
            glow: '#f87171'
          },
          blue: {
            DEFAULT: '#3b82f6',
            dark: '#1e40af',
            glow: '#60a5fa'
          },
          tatame: {
            bg: '#0f172a',
            cell: '#1e293b',
            cellHover: '#334155',
            line: '#475569',
            border: '#f59e0b'
          }
        }
      },
      fontFamily: {
        title: ['Rajdhani', 'Cinzel', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'gold-glow': '0 0 20px -2px rgba(245, 158, 11, 0.45)',
        'red-glow': '0 0 20px -2px rgba(239, 68, 68, 0.45)',
        'blue-glow': '0 0 20px -2px rgba(59, 130, 246, 0.45)',
        'tatame': 'inset 0 0 40px 10px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.9)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
