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
        background: "#F9FAFB",
        card: "#FFFFFF",
        charcoal: {
          DEFAULT: "#1F2937",
          light: "#374151",
          muted: "#4B5563",
          subtle: "#6B7280",
        },
        teal: {
          DEFAULT: "#0D9488",
          hover: "#0F766E",
          light: "#F0FDFA",
          border: "#99F6E4",
        },
        orange: {
          DEFAULT: "#F97316",
          hover: "#EA580C",
          light: "#FFF7ED",
          border: "#FFEDD5",
        },
        confidence: {
          high: "#16A34A",
          medium: "#D97706",
          low: "#F97316",
        },
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        bento: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        bentoHover: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        activeOrange: "0 0 0 3px rgba(249, 115, 22, 0.25)",
        activeTeal: "0 0 0 3px rgba(13, 148, 136, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
