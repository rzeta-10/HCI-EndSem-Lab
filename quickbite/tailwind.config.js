/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        doodle: ["'Baloo 2'", "cursive"],
        hand: ["'Patrick Hand'", "cursive"],
      },
      boxShadow: {
        doodle: "6px 6px 0 rgba(36, 39, 51, 0.85)",
      },
      colors: {
        "veg-green": "#0C8B51",
        "nonveg-red": "#C8102E",
        "egg-yellow": "#D89B0D",
        "upi-blue": "#097CF6",
        "gpay-green": "#1AA260",
        "phonepe-purple": "#5F259F",
        "paytm-blue": "#002970",
        "bhim-navy": "#00539B",
      },
    },
  },
  plugins: [],
};
