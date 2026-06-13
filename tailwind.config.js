/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Deep space palette
        void: "#080B14",
        cosmos: "#0D1117",
        nebula: "#161B27",
        aurora: "#1E2535",
        stardust: "#2A3347",
        // Accent: electric violet → cyan gradient
        pulse: "#7C3AED",
        glow: "#06B6D4",
        flare: "#A78BFA",
        shimmer: "#67E8F9",
        // Text
        starlight: "#F0F4FF",
        moonbeam: "#A8B3CF",
        twilight: "#5A6785",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fadeUp 0.3s ease-out",
        "slide-in": "slideIn 0.25s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        typing: "typing 1.2s steps(3, end) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-8px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(124,58,237,0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(124,58,237,0.8), 0 0 40px rgba(6,182,212,0.3)" },
        },
        typing: {
          "0%": { content: "'●'" },
          "33%": { content: "'● ●'" },
          "66%": { content: "'● ● ●'" },
          "100%": { content: "'●'" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cosmic-gradient": "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
      },
    },
  },
  plugins: [],
};
