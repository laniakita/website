const catppuccin = require('@catppuccin/tailwindcss');
const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter-tight)'],
        mono: ['var(--font-zeroxproto)'],
      },

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

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translate3d(0rem,1rem,0rem)' },
          to: { opacity: '1', transform: 'translate3d(0rem,0rem,0rem)' },
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translate3d(0rem,-100%,0rem)' },
          to: { opacity: '1', transform: 'translate3d(0rem,0rem,0rem)' },
        },
        marquee: {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(-100%, 0)' },
        },
        upDog: {
          '0%': { transform: 'translateY(140%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease 1s forwards',
        'fade-in-up': 'fade-in-up 0.2s ease 1s forwards',
        'fade-in-down': 'fade-in-down 1s ease 1s forwards',
        marquee: 'marquee 5s linear infinite',
        upDog: 'upDog 1.5s ease 1s forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [catppuccin({ prefix: 'ctp' }), addDynamicIconSelectors()],
};
