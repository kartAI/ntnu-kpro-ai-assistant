import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto", "Poppins", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#24BD76",
          dark: "#034E31",
          light: "#C8EBDC",
        },
        secondary: {
          black: "#2E2D30",
          white: "#FFFFFF",
          lightgray: "#F5F5F5",
        },
        background: {
          light: "#CCE7FA",
          blue: "#DDF3EB",
          pink: "#FFD0D0",
          purple: "#EBE8FE",
          yellow: "#FFE9AE",
          darkgreen: "#003C2D",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
