import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0d1b2a",
        panel: "#f3f8ff",
        accent: "#0a9396",
        warm: "#ee9b00"
      }
    }
  },
  plugins: []
};

export default config;
