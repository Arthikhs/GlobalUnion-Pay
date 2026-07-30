/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#7C3AED', 50: '#F5F3FF', 100: '#EDE9FE', 500: '#7C3AED', 600: '#6D28D9', 700: '#5B21B6', 900: '#2E1065' },
        secondary: { DEFAULT: '#06B6D4', 500: '#06B6D4', 600: '#0891B2' },
        accent:    { DEFAULT: '#F59E0B', 500: '#F59E0B' },
        success: '#22C55E',
        warning: '#F59E0B',
        danger:  '#EF4444',
        sidebar: '#0F0A1E',
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
