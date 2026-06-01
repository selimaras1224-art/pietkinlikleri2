/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Akademik koyu tema paleti: uzay siyahı, derin lacivert ve vurgular
        space: '#05070f',
        midnight: '#0b1226',
        deep: '#0f1b3d',
        neon: {
          DEFAULT: '#38e1ff',
          soft: '#7ef0ff',
          glow: '#22d3ee',
        },
        gold: {
          DEFAULT: '#f5c84b',
          soft: '#ffd97a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 24px rgba(56, 225, 255, 0.35)',
        gold: '0 0 24px rgba(245, 200, 75, 0.35)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at 20% 10%, rgba(56,225,255,0.12), transparent 40%), radial-gradient(circle at 80% 30%, rgba(245,200,75,0.10), transparent 45%), radial-gradient(circle at 50% 100%, rgba(99,102,241,0.10), transparent 50%)',
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll-digits': 'scrollDigits 60s linear infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
      },
      keyframes: {
        scrollDigits: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
