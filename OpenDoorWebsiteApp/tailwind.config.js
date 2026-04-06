/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        church: {
          stone: '#D4C4A0',
          brick: '#C8B59B',
          green: '#9EC630',
          dark: '#2D3748',
          light: '#F7FAFC',
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '820': '51.25rem', // 820px equivalent
      }
    },
  },
  plugins: [],
}
