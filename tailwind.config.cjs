/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        heroku: {
          purple: "#5A1BA9",
          light: "#AD7BEE",
          dark: "#401075",
          black: "#1B1B1B",
          white: "#FFFFFF",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#5A1BA9",
        background: "#FFFFFF",
        foreground: "#111827",
        primary: {
          DEFAULT: "#5A1BA9",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#111827",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#F9FAFB",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#AD7BEE",
          foreground: "#111827",
        },
        nav: {
          DEFAULT: "#AD7BEE",
          foreground: "#111827",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        progress: {
          "0%": { transform: " translateX(0) scaleX(0)" },
          "40%": { transform: "translateX(0) scaleX(0.4)" },
          "100%": { transform: "translateX(100%) scaleX(0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        progress: "progress 1s infinite linear",
      },
      transformOrigin: {
        "left-right": "0% 50%",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: "#111827",
            '[class~="lead"]': {
              color: "#111827",
            },
            a: {
              color: "#111827",
            },
            strong: {
              color: "#111827",
            },
            "a strong": {
              color: "#111827",
            },
            "blockquote strong": {
              color: "#111827",
            },
            "thead th strong": {
              color: "#111827",
            },
            "ol > li::marker": {
              color: "#111827",
            },
            "ul > li::marker": {
              color: "#111827",
            },
            dt: {
              color: "#111827",
            },
            blockquote: {
              color: "#111827",
            },
            h1: {
              color: "#111827",
            },
            "h1 strong": {
              color: "#111827",
            },
            h2: {
              color: "#111827",
            },
            "h2 strong": {
              color: "#111827",
            },
            h3: {
              color: "#111827",
            },
            "h3 strong": {
              color: "#111827",
            },
            h4: {
              color: "#111827",
            },
            "h4 strong": {
              color: "#111827",
            },
            kbd: {
              color: "#111827",
            },
            code: {
              color: "#111827",
            },
            "a code": {
              color: "#111827",
            },
            "h1 code": {
              color: "#111827",
            },
            "h2 code": {
              color: "#111827",
            },
            "h3 code": {
              color: "#111827",
            },
            "h4 code": {
              color: "#111827",
            },
            "blockquote code": {
              color: "#111827",
            },
            "thead th code": {
              color: "#111827",
            },
            pre: {
              color: "#111827",
            },
            "pre code": {
              color: "#111827",
            },
            "thead th": {
              color: "#111827",
            },
            figcaption: {
              color: "#111827",
            },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
