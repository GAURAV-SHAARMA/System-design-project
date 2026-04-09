/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slatebase: '#0f172a',
        emeraldaccent: '#10b981',
        goldaccent: '#f59e0b',
        skyaccent: '#38bdf8'
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 80px rgba(15, 23, 42, 0.18)'
      }
    }
  },
  plugins: []
};
