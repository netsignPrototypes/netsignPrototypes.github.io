module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      transitionDuration: {
        '0': '0ms',
        '15000': '15000ms',
       },
       fontSize: {
        'thumb1': ['1.15rem', '1.45rem'],
        'thumb2': ['1.35rem', '1.65rem'],
        'thumb3': ['1.55rem', '1.85rem'],
        'thumb4': ['1.75rem', '2.05rem'],
        'thumb5': ['1.95rem', '2.25rem'],
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ],
}
