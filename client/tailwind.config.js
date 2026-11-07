/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { pri: "#DFF0F7", sec: "#4A83B2", textPri: "#162836", textSec: "#8098ae" },
    },
  },
  plugins: [],
};
