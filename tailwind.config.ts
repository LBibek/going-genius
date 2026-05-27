import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          glow: "var(--primary-glow)",
        },
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        muted: {
          DEFAULT: "var(--muted)",
          light: "var(--muted-light)",
        },
        border: {
          DEFAULT: "var(--border)",
          active: "var(--border-active)",
        },
        glass: {
          DEFAULT: "var(--glass)",
          hover: "var(--glass-hover)",
          border: "var(--glass-border)",
          heavy: "var(--glass-heavy)",
        },
        card: {
          bg: "var(--card-bg)",
        },
        input: {
          bg: "var(--input-bg)",
          focus: "var(--input-bg-focus)",
        },
        backgroundAlt: "var(--background-alt)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        gridMove: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "60px 60px" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "spin-slow": "spin 0.6s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "grid-move": "gridMove 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
