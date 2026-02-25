import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0B1B2B',
          700: '#10314F',
          500: '#2DD4BF',
          100: '#E6F7FF',
        },
      },
    },
  },
  plugins: [],
};

export default config;
