import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surfaceStrong: "var(--color-surface-strong)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primary-hover)",
        onPrimary: "var(--color-on-primary)",
        accentSoft: "var(--color-accent-soft)",
        ink: "var(--color-ink)",
        inkMuted: "var(--color-ink-muted)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        theme: "var(--theme-radius)",
      },
    },
  },
  plugins: [],
};

export default config;
