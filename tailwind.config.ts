import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0F9F5",
          100: "#D4F0E3",
          600: "#5a8c6b",
          700: "#3d6b50",
        },
        secondary: "#C5E0B8",
        cream: "#FAF8F5",
        accent: "#6CBFDB",
      },
    },
  },
  plugins: [],
};
export default config;
