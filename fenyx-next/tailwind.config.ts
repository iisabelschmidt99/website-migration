import type { Config } from "tailwindcss";

/**
 * Fenyx Design-Tokens – 1:1 aus dem Webflow-Original übernommen
 * (css/fenyx-office-dev.css, :root-Variablen).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Markenfarben (--base-color-brand--*)
        signal: {
          DEFAULT: "#c8ff00", // Fenyx Neongrün
          soft: "#4c6225",
          fade: "#7c9a2b",
        },
        // Neutrale Farben (--base-color-neutral--*)
        abyss: {
          DEFAULT: "#132735", // --abyss
          deep: "#0b171f",    // --abyss-deep
        },
        mist: {
          DEFAULT: "#8da4ba", // --mist
          soft: "#dceaf5",    // --mist-soft
          ash: "#a1b1c0",     // --mist-ash
        },
        "black-gradient": "#020405",
        // Systemfarben (--base-color-system--*)
        system: {
          error: "#f8e4e4",
          "error-dark": "#3b0b0b",
          success: "#cef5ca",
          "success-dark": "#114e0b",
          warning: "#fcf8d8",
          "warning-dark": "#5e5515",
          focus: "#2d62ff",
        },
      },
      fontFamily: {
        // Body / Fließtext = Roobert
        sans: ["var(--font-roobert)", "Arial", "sans-serif"],
        // Überschriften / Display = Telegraf  ->  Klasse: font-heading
        heading: ["var(--font-telegraf)", "Arial", "sans-serif"],
      },
      // Heading-Größen wie im Webflow-Original (font-weight überall 700)
      fontSize: {
        "h1": ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
        "h2": ["2.3rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h3": ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
        "h4": ["1.5rem", { lineHeight: "1.4", fontWeight: "700" }],
        "h5": ["1.25rem", { lineHeight: "1.5", fontWeight: "700" }],
        "h6": ["1rem", { lineHeight: "1.5", fontWeight: "700" }],
      },
      borderRadius: {
        DEFAULT: "0",
        none: "0",
      },
      letterSpacing: {
        fenyx: "-0.04em",
      },
      gridTemplateColumns: {
        14: "repeat(14, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};

export default config;
