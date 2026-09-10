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
        background: "#F7FAF8",
        card: "#FFFFFF",
        charcoal: {
          DEFAULT: "#15261D",
          light: "#23382C",
          muted: "#475D51",
          subtle: "#6E8578",
        },
        // 5-Color Ayurvedic Botanical Palette (User Swatches)
        palette: {
          sage: "#A8D5BA",    // Swatch 1: Soft sage / mint tint
          mint: "#6BBF8A",    // Swatch 2: Fresh jade green
          herbal: "#4B9B6E",  // Swatch 3: Medium herbal green
          emerald: "#2E7D5C", // Swatch 4: Deep forest / emerald
          pine: "#1B5E3A",    // Swatch 5: Dark botanical pine
        },
        // Primary brand mapping (formerly teal) -> Deep emerald / Pine
        teal: {
          DEFAULT: "#2E7D5C",
          hover: "#1B5E3A",
          light: "#EAF5EF",
          border: "#A8D5BA",
          dark: "#1B5E3A",
        },
        // Secondary accent mapping (formerly orange) -> Dark pine / Herbal
        orange: {
          DEFAULT: "#1B5E3A",
          hover: "#14462B",
          light: "#F0F7F3",
          border: "#A8D5BA",
          hoverText: "#1B5E3A",
        },
        confidence: {
          high: "#1B5E3A",
          medium: "#2E7D5C",
          low: "#B45309",
        },
        border: {
          DEFAULT: "#E3ECE6",
          light: "#EDF4EF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        bento: "0 1px 3px 0 rgba(27, 94, 58, 0.05), 0 1px 2px -1px rgba(27, 94, 58, 0.05)",
        bentoHover: "0 4px 6px -1px rgba(27, 94, 58, 0.08), 0 2px 4px -2px rgba(27, 94, 58, 0.05)",
        activeOrange: "0 0 0 3px rgba(27, 94, 58, 0.22)",
        activeTeal: "0 0 0 3px rgba(46, 125, 92, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
