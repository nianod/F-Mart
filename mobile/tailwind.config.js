/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        tomato: '#15803D',
        ink: '#0A0A0A',
        cream: '#FFFFFF',
        orange: { 50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 700: '#15803D' },
      },
    },
  },
  plugins: [],
};
