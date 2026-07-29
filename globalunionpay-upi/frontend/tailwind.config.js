/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4F46E5', 50: '#EEEEFF', 500: '#4F46E5', 600: '#4338CA', 700: '#3730A3' },
        secondary: { DEFAULT: '#7C3AED', 500: '#7C3AED', 600: '#6D28D9' },
        accent: { DEFAULT: '#06B6D4', 500: '#06B6D4' },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      borderRadius: { xl: '20px', '2xl': '24px' },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(79,70,229,0.15)',
      },
    },
  },
  plugins: [],
}
