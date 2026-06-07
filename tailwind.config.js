/** @type {import('tailwindcss').Config} */

function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `hsl(${variable} / ${opacityValue})`
      : `hsl(${variable})`;
}

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: withOpacity("var(--border)"),
        input: withOpacity("var(--input)"),
        ring: withOpacity("var(--ring)"),
        background: withOpacity("var(--background)"),
        foreground: withOpacity("var(--foreground)"),
        primary: {
          DEFAULT: withOpacity("var(--primary)"),
          foreground: withOpacity("var(--primary-foreground)"),
        },
        secondary: {
          DEFAULT: withOpacity("var(--secondary)"),
          foreground: withOpacity("var(--secondary-foreground)"),
        },
        destructive: {
          DEFAULT: withOpacity("var(--destructive)"),
          foreground: withOpacity("var(--destructive-foreground)"),
        },
        muted: {
          DEFAULT: withOpacity("var(--muted)"),
          foreground: withOpacity("var(--muted-foreground)"),
        },
        accent: {
          DEFAULT: withOpacity("var(--accent)"),
          foreground: withOpacity("var(--accent-foreground)"),
        },
        card: {
          DEFAULT: withOpacity("var(--card)"),
          foreground: withOpacity("var(--card-foreground)"),
        },
        popover: {
          DEFAULT: withOpacity("var(--popover)"),
          foreground: withOpacity("var(--popover-foreground)"),
        },
        danger: withOpacity("var(--destructive)"),
        surface: "#FFFFFF",
      },
      fontFamily: {
        heading: ["Nunito", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
