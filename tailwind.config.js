/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00445b',
          '50': '#f0f7fa',
          '100': '#dcedf3',
          '200': '#bfdee9',
          '300': '#92c7d9',
          '400': '#5ea7c3',
          '500': '#3a8aad',
          '600': '#2a6f92',
          '700': '#245a77',
          '800': '#214b63',
          '900': '#003745',
        },
        secondary: {
          '50': '#f5f7fa',
          '100': '#ebeef3',
          '200': '#d2dae5',
          '300': '#adbace',
          '400': '#8295b2',
          '500': '#637999',
          '600': '#4f6280',
          '700': '#415068',
          '800': '#384457',
          '900': '#313a4a',
        },
        accent: {
          DEFAULT: '#2795ac',
          '50': '#fff8eb',
          '100': '#e6f3f7',
          '200': '#c0e1ea',
          '300': '#8cc7d7',
          '400': '#4aabca',
          '500': '#2795ac',
          '600': '#1a7a8f',
          '700': '#166274',
          '800': '#144e5d',
          '900': '#13424e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'navbar': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'header': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
