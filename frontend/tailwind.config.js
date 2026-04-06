/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'church-purple': '#030b1f',
        'church-purple-mid': '#050f2c',
        'church-purple-light': '#1a0533',
        'church-gold': '#c9952a',
        'church-gold-light': '#f0c060',
        'church-dark': '#020710',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'accent': ['Cinzel', 'serif'],
        'body': ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
