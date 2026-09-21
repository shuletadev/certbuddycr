import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0A0C10",
          secondary: "#12151B",
          tertiary: "#1A1E27",
          elevated: "#161A22",
        },
        border: {
          primary: "#23272F",
          secondary: "#1A1E25",
          focus: "#2F81FF",
        },
        text: {
          primary: "#F5F6F8",
          secondary: "#9AA3B2",
          tertiary: "#7C8695",
          inverse: "#0A0C10",
        },
        azure: {
          400: "#5B9DFF",
          500: "#2F81FF",
          600: "#1F6BE0",
          glow: "rgba(47,129,255,0.45)",
        },
        violet: {
          400: "#C084FC",
          500: "#A855F7",
          600: "#8B3DE8",
          glow: "rgba(168,85,247,0.45)",
        },
        status: {
          success: "#34D399",
          warning: "#FBBF24",
          error: "#F87171",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        display: ["4rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h3: ["1.75rem", { lineHeight: "1.2" }],
        h4: ["1.25rem", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        caption: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      spacing: {
        "0.5": "2px",
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      backdropBlur: {
        xs: "6px",
        glass: "20px",
      },
      boxShadow: {
        "glow-azure": "0 0 24px rgba(47,129,255,0.35), 0 0 64px rgba(47,129,255,0.12)",
        "glow-azure-lg": "0 0 40px rgba(47,129,255,0.45), 0 0 96px rgba(47,129,255,0.18)",
        "glow-violet": "0 0 24px rgba(168,85,247,0.35), 0 0 64px rgba(168,85,247,0.12)",
        "glow-violet-lg": "0 0 40px rgba(168,85,247,0.45), 0 0 96px rgba(168,85,247,0.18)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.4)",
        "panel-lg": "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 24px 64px rgba(0,0,0,0.5)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "180ms",
        normal: "280ms",
        slow: "450ms",
        slower: "700ms",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "gradient-azure-violet": "linear-gradient(135deg, #2F81FF 0%, #A855F7 100%)",
        "gradient-radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(47,129,255,0.15), transparent 60%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
