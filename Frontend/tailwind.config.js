/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          text: 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          border: 'var(--color-border)',
        },
        light: {
          bg: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          text: 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          border: 'var(--color-border)',
        },
      },
    },
  },
  plugins: [],
};