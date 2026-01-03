/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        background: '#000000',
        card: '#1C1C1E',
        subtext: '#A1A1AA',
        success: '#22C55E',
        error: '#EF4444',
      }
    },
  },
  plugins: [],
};
