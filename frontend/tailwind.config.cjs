/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './source/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora : ['Sora', 'sans-serif'],
        sans : ['DM Sans', 'sans-serif'],
        mono : ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          light:   '#2E5490',
          dark:    '#0F2340',
        },
        accent: {
          DEFAULT: '#F4A100',
          light:   '#FFB733',
        },
      },
    },
  },
  plugins: [],
};
