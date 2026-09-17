/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#F5F0E6',
        ink: '#1C1917',
        sage: '#5F7A61',
        'sage-dark': '#4B6350',
        brick: '#9A4A2E',
        'brick-dark': '#7A3A24',
        rule: '#E5DECF',
      },
      fontFamily: {
        'serif': ['Lora', 'Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      spacing: {
        '820': '51.25rem', // 820px equivalent
      }
    },
  },
  plugins: [],
}
