/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '1156px', // Breakpoint for 1156px and above (1155px and below will be full width with no padding)
      },
    },
  },
}

