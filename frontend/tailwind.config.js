/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Pastel Backgrounds
        pastel: {
          cyan: '#CDE9ED',
          blue: '#DCECF7',
          lavender: '#E9E3F7',
          app: '#F7F9FC',
        },
        // Pastel Accents
        accent: {
          blue: '#A8C9ED',
          purple: '#B9ACEB',
          cyan: '#B7E8EA',
          yellow: '#FFF18C',
        },
        // Enterprise Typography Palette
        brand: {
          text: '#303943',
          secondary: '#84909D',
          muted: '#AAB4BE',
          activeBg: '#EBF3FB',
        },
      },
      boxShadow: {
        glass: '0 8px 30px rgba(48, 57, 67, 0.04)',
        'glass-sm': '0 4px 20px rgba(48, 57, 67, 0.03)',
        'glass-md': '0 12px 35px rgba(48, 57, 67, 0.06)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
    },
  },
  plugins: [],
}
