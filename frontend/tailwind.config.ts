import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#FAFBFC",
        surface: "#FFFFFF",
        primary: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        accent: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        status: {
          success: "#16A34A",
          caution: "#B45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      lineHeight: {
        relaxed: "1.65",
        loose: "1.8",
      },
    },
  },
  plugins: [],
};

export default config;
