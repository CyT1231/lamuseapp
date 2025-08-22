/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#D8B4A0", dark: "#B89583" } },
      borderRadius: { '2xl': '1rem' }
    },
  },
  plugins: [],
}
