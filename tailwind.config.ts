import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e0e7ff",
          100: "#c7d2fe",
          200: "#a5b4fc",
          300: "#818cf8",
          400: "#6366f1",
          500: "#4338ca",
          600: "#3730a3",
          700: "#312e81",
          800: "#1e1b4b",
          900: "#0f0d2e",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
