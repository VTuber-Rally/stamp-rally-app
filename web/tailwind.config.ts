import tailwindAnimate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        navbar: "calc(4rem + env(safe-area-inset-bottom, 20px))",
      },
      colors: {
        secondary: "#9fe0ea",
        secondaryLight: "#b6e6ee",
        tertiary: "#ffa7c1",
        successOrange: "#fd9308",
        backgroundBlack: "rgba(0, 0, 0, 0.95)",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies import("tailwindcss").Config;
