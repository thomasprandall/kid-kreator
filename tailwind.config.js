/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'orange': '#ED7223',
      'yellow': '#F9BA1C',
      'black': '#000000',
      'white': '#FFFFFF',
      'tan': '#FCE5D2',
      'orange-light': '#F9BD8C',
      'warning': '#CC3300'
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
