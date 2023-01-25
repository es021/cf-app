/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    fontSize: {
      xs: '10px',
      sm: '12px',
      base: '14px',
      xl: '16px',
      '2xl': '18px',
      '3xl': '20px',
      '4xl': '22px',
      '5xl': '24px',
    }
  },
  plugins: [],
  corePlugins: {
    backdropOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    ringOpacity: false,
    textOpacity: false
  }
}