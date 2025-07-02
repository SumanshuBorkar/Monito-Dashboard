/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'online': '#10B981',
        'offline': '#EF4444',
        'degraded': '#F59E0B',
      }
    },
  },
  plugins: [],
}
