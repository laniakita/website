import type { Config } from 'tailwindcss';
import sharedConfig from '@ahiakea/tailwindcss-config';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  presets: [sharedConfig],
  theme: {
    extend: {
      screens: {
        'narrow-phone': '300px',
        'small-phone': '350px',
        phone: '385px',
        phablet: '412px',
        'beeg-phablet': '430px',
        fold: '500px',
        'not-tablet': '600px',
      },
      colors: {
        'ctp-midnight': '#07070D',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-zeroxproto)'],
      },
    },
  },
};
export default config;
