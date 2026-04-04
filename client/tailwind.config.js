/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148, 163, 184, 0.15), 0 24px 80px rgba(15, 23, 42, 0.45)"
      },
      colors: {
        brand: {
          50: "#eefcf4",
          100: "#d8f8e7",
          200: "#b3f1d0",
          300: "#7de5b0",
          400: "#41d28c",
          500: "#1db56d",
          600: "#11965a",
          700: "#117749",
          800: "#125d3c",
          900: "#114d33"
        }
      }
    }
  },
  plugins: []
};

