/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        section: "calc(100vw - 17.5rem)",
        "confirm-modal": "28rem",
      },
      maxWidth: {
        "confirm-modal": "calc(100vw - 2rem)",
      },
      height: {
        pcMenu: "calc(100vh - 11rem)",
        mobileMenu: "calc(100vh - 14rem)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translate3d(0,2.5rem,0)" },
          "100%": { opacity: 1, transform: "translateZ(0)" },
        },
        showLeft: {
          "0%": { transform: "translate3d(-100%,0,0)", opacity: 0.8 },
          "100%": { transform: "translateZ(0)", opacity: 1 },
        },
        hideLeft: {
          "0%": { transform: "translateZ(0)", opacity: 1 },
          "100%": { transform: "translate3d(-100%,0,0)", opacity: 0.8 },
        },
        fadeInUp: {
          "0%": { transform: "translate3d(0,10%,0)", opacity: 0 },
          "100%": { transform: "translateZ(0)", opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        fadeOut: "fadeOut 0.2s ease-in-out",
        fadeUp: "fadeUp 0.2s cubic-bezier(.08,.82,.17,1)",
        showLeft: "showLeft 0.3s ease-in-out",
        hideLeft: "hideLeft 0.3s ease-in-out",
        fadeInUp: "fadeInUp 0.2s ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
