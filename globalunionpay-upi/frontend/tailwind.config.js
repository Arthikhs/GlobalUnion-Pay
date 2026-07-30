/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#2563EB', 50: '#EFF6FF', 100: '#DBEAFE', 500: '#2563EB', 600: '#1D4ED8', 700: '#1E40AF', 900: '#1E3A8A' },
        secondary: { DEFAULT: '#0EA5E9', 500: '#0EA5E9', 600: '#0284C7' },
        accent:    { DEFAULT: '#38BDF8', 500: '#38BDF8' },
        success: '#22C55E',
        warning: '#F59E0B',
        danger:  '#EF4444',
        sidebar: '#020817',
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
