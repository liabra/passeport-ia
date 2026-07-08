import type { Config } from "tailwindcss";

/**
 * Design system « carte de randonnée ».
 * Toutes les couleurs et échelles sont exposées comme tokens Tailwind afin que
 * les composants n'utilisent jamais de valeurs codées en dur.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        papier: "#F2ECDB",
        "papier-profond": "#E7DFC8",
        carte: "#FBF8EF",
        encre: "#35322A",
        "encre-douce": "#6E6754",
        "rouge-gr": "#C6392C",
        foret: "#57724E",
        eau: "#5E8CA0",
        ocre: "#C9AE79",
      },
      fontFamily: {
        // Alimentées par next/font/google via des variables CSS.
        corps: ["var(--font-corps)", "system-ui", "sans-serif"],
        titre: ["var(--font-titre)", "Georgia", "serif"],
      },
      fontSize: {
        // Base 17px minimum (accessibilité).
        base: ["1.0625rem", { lineHeight: "1.6" }],
      },
      borderRadius: {
        carte: "1rem",
      },
      boxShadow: {
        // Ombre portée « dure » du design system.
        dure: "3px 3px 0 0 rgba(53, 50, 42, 0.9)",
        "dure-active": "1px 1px 0 0 rgba(53, 50, 42, 0.9)",
        carte: "0 2px 10px rgba(53, 50, 42, 0.12)",
      },
      keyframes: {
        "stamp-claque": {
          "0%": { transform: "scale(2.4) rotate(var(--stamp-rot, -8deg))", opacity: "0" },
          "60%": { transform: "scale(0.9) rotate(var(--stamp-rot, -8deg))", opacity: "1" },
          "100%": { transform: "scale(1) rotate(var(--stamp-rot, -8deg))", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.85" },
        },
        "barre-remplir": {
          from: { width: "0%" },
          to: { width: "var(--barre-target, 0%)" },
        },
      },
      animation: {
        "stamp-claque": "stamp-claque 420ms cubic-bezier(0.2, 0.9, 0.3, 1.3) both",
        "pulse-doux": "pulse 2.2s ease-in-out infinite",
        "barre-remplir": "barre-remplir 700ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
