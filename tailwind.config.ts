import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        EduhubSky:"#C3EBFA",
        EduhubSkyLight:"#EDF9FD",
        EduhubPurple: "#8576FF",
        EduhubPurpleLight:"#F1F0FF",
        EduhubBlue:"#7BC9FF",
        EduhubBlueLight:"#A3FFD6"

      }
    },
  },
  plugins: [],
  
};


export default config;
