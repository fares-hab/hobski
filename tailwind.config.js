/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // OPTIMIZATION: Add shimmer animation for skeleton loaders
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      // Optional: Add your brand colors for easier reference
      colors: {
        'hobski-blue': {
          50: '#E6F6FF',
          100: '#B7D0FF',
          200: '#3F60CF',
          300: '#377BD9',
          400: '#143269',
          500: '#0D2A5E',
        }
      }
    },
  },
  plugins: [],
}