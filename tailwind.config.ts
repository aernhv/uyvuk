import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1a1a2e",
        deep: "#16213e",
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c97a",
          dark: "#a07830",
        },
        cream: "#f5f0e8",
        "warm-white": "#faf8f5",
        "dark-bg": "#0d0d0d",
        "dark-card": "#1e1e2e",
        "dark-border": "rgba(201, 168, 76, 0.15)",
      },
      fontFamily: {
        sans: ["Inter", "Cairo", "sans-serif"],
        serif: ["Playfair Display", "Cairo", "serif"],
        arabic: ["Cairo", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        goldPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(201, 168, 76, 0.3)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
        "dark-gradient": "linear-gradient(180deg, #0d0d0d 0%, #1a1a2e 100%)",
        "hero-gradient": "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
