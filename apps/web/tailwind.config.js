import catppuccin from '@catppuccin/tailwindcss';
import tailwindProse from '@tailwindcss/typography';
import { addDynamicIconSelectors } from '@iconify/tailwind';

const accent = 'ctp-mauve';
const invertAccent = 'ctp-mauve';
const linkColor = 'ctp-mauve';
const invertLinkColor = 'ctp-mauve';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'selector',
  /*
  darkMode: [
    'variant',
    ['@media (prefers-color-scheme: dark) { &:where(:not([color-scheme="light"]) }', '&:is(.dark *)'],
  ],*/
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter-tight)'],
        mono: ['var(--font-zeroxproto)'],
      },
      fontSize: {
        '2-75xl': [
          '1.78125rem',
          {
            lineHeight: '2.1875rem',
          },
        ],
        '2-5xl': [
          '1.6875rem',
          {
            lineHeight: '2.125rem',
          },
        ],
        '2-25xl': [
          '1.59375rem',
          {
            lineHeight: '2.0625rem',
          },
        ],
        '1-5xl': [
          '1.375rem',
          {
            lineHeight: '1.875rem',
          },
        ],
        '1-25xl': [
          '1.3125rem',
          {
            lineHeight: '1.8125rem',
          },
        ],
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
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': false,
            'blockquote p:first-of-type::after': false,
            /*
            blockquote: {
              fontStyle: '',
              backgroundColor: 'var(--tw-prose-quotes-bg)',
              padding: '1.5rem 2rem 1.5rem 2rem',
            },
            */
            'aside :is( h2, h3, h4, h5, h6)': {
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
            },
            'h1 a': {
              fontWeight: 900,
            },
            'h2 a': {
              fontWeight: 900,
            },
            'h3 a': {
              fontWeight: 900,
            },
            'h4 a': {
              fontWeight: 900,
            },
            'h5 a': {
              fontWeight: 900,
            },
            del: {
              color: 'var(--tw-prose-del)',
            },
            'del a': {
              color: 'var(--tw-prose-del-links)',
            },
            'del code': {
              color: 'var(--tw-prose-del-code)',
            },
            'del strong': {
              color: 'var(--tw-prose-del-strong)',
            },
            '.sr-only': {
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              border: 0,
              margin: '-1px',
              padding: 0,
              width: '1px',
              height: '1px',
            },
            '#footnote-label': {
              overflow: 'hidden',
              width: '100%',
              height: '1px',
              marginTop: '3rem',
              marginBottom: '3rem',
              backgroundColor: 'var(--footnote-divider-line)',
            },
            pre: {
              overflowX: 'auto',
            },
            'pre > code': {
              float: 'left',
              minWidth: '100%',
              paddingRight: '4rem',
            },
            'div.code-line:empty': {
              /* it is necessary because there is no even eol character in div code-lines */
              //height: '15.5938px', /* calculated height */
            },
            'span.code-line': {
              minWidth: '100%',
              display: 'inline-block',
            },
            '.code-line': {
              paddingLeft: '12px',
              paddingRight: 'calc(4rem + 12px)',
              marginLeft: '-12px',
              marginRight: 'calc(-4rem - 12px)',
              borderLeft: '4px solid transparent' /* prepare for highlighted code-lines */,
            },
            '.code-line.inserted': {
              backgroundColor: 'var(--code-line-inserted)' /* inserted code-line (+) color */,
            },
            '.code-line.deleted': {
              backgroundColor: 'var(--code-line-deleted)' /* deleted code-line (-) color */,
            },
            '.highlighted-code-line': {
              backgroundColor: 'var(--code-line-highlighted)',
              borderLeft: '4px solid var(--code-line-highlight-indicator)',
            },
            '.numbered-code-line::before': {
              content: 'attr(data-line-number)',
              marginLeft: '-8px',
              marginRight: '16px',
              paddingRight: '1ch',
              paddingLeft: '3ch', // Note: assumes codeblock < 1000 lines
              borderRight: '0.05rem solid var(--code-line-border)',
              width: '1rem',
              color: 'var(--code-line-number)',
              display: 'inline-flex',
              justifyContent: 'end',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-del': 'var(--tw-prose-invert-del)',
            '--tw-prose-del-links': 'var(--tw-prose-invert-del-links)',
            '--tw-prose-del-code': 'var(--tw-prose-invert-del-code)',
            '--tw-prose-del-strong': 'var(--tw-prose-invert-del-strong)',
            '--code-line-inserted': 'var(--invert-code-line-inserted)',
            '--code-line-deleted': 'var(--invert-code-line-deleted)',
            '--code-line-highlighted': 'var(--code-line-invert-highlighted)',
          },
        },
        catppuccin: {
          css: {
            '--footnote-divider-line': theme('colors.ctp-text.DEFAULT'),
            '--code-line-highlighted': theme('colors.ctp-mantle.DEFAULT'),
            '--code-line-invert-highlighted': theme('colors.ctp-surface0.DEFAULT'),
            '--code-line-highlight-indicator': theme('colors.ctp-sapphire.DEFAULT'),
            '--code-line-inserted': 'rgba(64, 160, 43, 0.2)',
            '--invert-code-line-inserted': 'rgba(166, 227, 161, 0.2)',
            '--code-line-deleted': 'rgba(210, 15, 57, 0.2)',
            '--invert-code-line-deleted': 'rgba(243, 139, 168, 0.2)',
            '--code-line-border': theme('colors.ctp-overlay0.DEFAULT'),
            '--code-line-number': theme('colors.ctp-overlay0.DEFAULT'),
            '--tw-prose-del': theme('colors.ctp-overlay0.DEFAULT'),
            '--tw-prose-invert-del': theme('colors.ctp-overlay0.DEFAULT'),
            '--tw-prose-body': theme(`colors.ctp-text.DEFAULT`),
            '--tw-prose-headings': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-lead': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-links': theme(`colors.${linkColor}.DEFAULT`),
            '--tw-prose-bold': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-counters': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-bullets': theme(`colors.ctp-text.DEFAULT`),
            '--tw-prose-hr': theme(`colors.${accent}.DEFAULT`),
            '--tw-prose-quotes': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-quotes-bg': theme('colors.ctp-base.DEFAULT'),
            '--tw-prose-quote-borders': theme(`colors.${accent}.DEFAULT`),
            '--tw-prose-captions': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-code': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-pre-bg': theme('colors.ctp-base.DEFAULT'),
            '--tw-prose-th-borders': theme(`colors.${accent}.DEFAULT`),
            '--tw-prose-td-borders': theme(`colors.${accent}.DEFAULT`),
            '--tw-prose-invert-body': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-headings': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-lead': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-links': theme(`colors.${invertLinkColor}.DEFAULT`),
            '--tw-prose-invert-bold': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-counters': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-bullets': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-hr': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-quotes': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-quote-borders': theme(`colors.${invertAccent}.DEFAULT`),
            '--tw-prose-invert-captions': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-code': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-pre-code': theme('colors.ctp-text.DEFAULT'),
            '--tw-prose-invert-pre-bg': theme('colors.ctp-base.DEFAULT'),
            '--tw-prose-invert-th-borders': theme(`colors.${invertAccent}.DEFAULT`),
            '--tw-prose-invert-td-borders': theme(`colors.${invertAccent}.DEFAULT`),
          },
        },
      }),
    },
  },
  plugins: [tailwindProse, catppuccin({ prefix: 'ctp' }), addDynamicIconSelectors()],
};
