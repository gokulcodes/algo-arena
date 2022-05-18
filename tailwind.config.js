module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nerd': ['Space Mono', 'monospace'] 
      },
      animation: {
        opac: 'opac 0.5s ease-in-out',
        pop: "pop 0.5s ease-in-out"
      },
      keyframes: {
        opac: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pop: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
