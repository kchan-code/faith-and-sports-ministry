import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          300: "#8ec1ff",
          400: "#599dff",
          500: "#3478f6",
          600: "#1f59db",
          700: "#1a47b1",
          800: "#1b3e8c",
          900: "#1c386f",
        },
        ink: {
          DEFAULT: "#11182a",
          muted: "#5b657b",
        },
        // Faith in Sports Family Ministry — dark-mode-first brand system
        onyx: "#050505",
        charcoal: "#101010",
        surface1: "#151515",
        surface2: "#1c1c1c",
        clean: "#f7f7f7",
        navy: {
          DEFAULT: "#183060",
          600: "#1f3d78",
          bright: "#4f79c9",
          deep: "#0e2148",
          ink: "#8aa9e0",
          ink2: "#b9cbec",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)"],
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        scripture: ["var(--font-scripture)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
