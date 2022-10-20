/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "fluor-green": "#06ff79",
        "dark-green": "#045C2DFF",
        "light-green": "#23a95f",
        "soft-black": "#021b0d",
        "back-black": "#0e1008",
        "custom-gray": "#a6a6a2",
      },
    },
  },
  plugins: [],
};
