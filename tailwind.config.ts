import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: "#E8E5E0",
        cream: "#F5F2EE",
        lime: "#C8E045",
        ink: "#1A1A1A",
        muted: "#8A8A8A",
      },
      borderRadius: {
        app: "28px",
        card: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
