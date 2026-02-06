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
      // Theme-aware colors using CSS variables
      colors: {
        // Semantic theme colors (switch automatically with theme)
        'theme': {
          'bg-primary': 'var(--color-bg-primary)',
          'bg-secondary': 'var(--color-bg-secondary)',
          'bg-card': 'var(--color-bg-card)',
          'bg-card-alt': 'var(--color-bg-card-alt)',
          'bg-nav': 'var(--color-bg-nav)',
          'bg-tab-active': 'var(--color-bg-tab-active)',
          'bg-tab-inactive': 'var(--color-bg-tab-inactive)',
          'bg-accent': 'var(--color-bg-accent)',
          'bg-accent-invert': 'var(--color-bg-accent-invert)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-muted': 'var(--color-text-muted)',
          'text-on-accent': 'var(--color-text-on-accent)',
          'text-on-card': 'var(--color-text-on-card)',
          'text-on-card-muted': 'var(--color-text-on-card-muted)',
          'text-tab-inactive': 'var(--color-text-tab-inactive)',
          'border': 'var(--color-border)',
          'border-muted': 'var(--color-border-muted)',
          'input-bg': 'var(--color-input-bg)',
          'input-border': 'var(--color-input-border)',
          'input-border-focus': 'var(--color-input-border-focus)',
          'hover-bg': 'var(--color-hover-bg)',
        },
        // Static hobski brand colors (for reference)
        'hobski-blue': {
          50: '#E6F6FF',
          100: '#B7D0FF',
          200: '#3F60CF',
          300: '#377BD9',
          400: '#143269',
          500: '#0D2A5E',
        }
      },
      // Add text colors shorthand
      textColor: {
        'primary': 'var(--color-text-primary)',
        'secondary': 'var(--color-text-secondary)',
        'muted': 'var(--color-text-muted)',
        'on-accent': 'var(--color-text-on-accent)',
        'on-card': 'var(--color-text-on-card)',
      },
      // Add background colors shorthand
      backgroundColor: {
        'primary': 'var(--color-bg-primary)',
        'secondary': 'var(--color-bg-secondary)',
        'card': 'var(--color-bg-card)',
        'nav': 'var(--color-bg-nav)',
        'accent': 'var(--color-bg-accent)',
      },
      // Add border colors shorthand
      borderColor: {
        'theme': 'var(--color-border)',
        'theme-muted': 'var(--color-border-muted)',
      },
    },
  },
  plugins: [],
}