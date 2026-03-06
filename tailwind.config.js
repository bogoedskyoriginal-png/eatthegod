/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#eef6ff',
          100: '#dcecff',
          500: '#3b82f6',
          600: '#2563eb'
        }
      },
      boxShadow: {
        glass: '0 10px 30px -12px rgba(15, 23, 42, 0.25)'
      }
    }
  },
  plugins: []
};
