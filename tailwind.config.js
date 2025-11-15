/** @type {import('tailwindcss').Config} */

const colors = require('./node_modules/tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./pages/*.vue",
    "./plugins/**/*.{js,ts}"
    ],
  safelist: ['lite-youtube'],
  theme: {
    colors: {
      primary: ({ opacityVariable, opacityValue }) => {
        if (opacityValue !== undefined) {
          return `rgba(var(--color-primary), ${opacityValue})`
        }
        if (opacityVariable !== undefined) {
          return `rgba(var(--color-primary), var(${opacityVariable}, 1))`
        }
        return `rgb(var(--color-primary))`
      },
      'primary-hover': ({ opacityVariable, opacityValue }) => {
        if (opacityValue !== undefined) {
          return `rgba(var(--color-primary-hover), ${opacityValue})`
        }
        if (opacityVariable !== undefined) {
          return `rgba(var(--color-primary-hover), var(${opacityVariable}, 1))`
        }
        return `rgb(var(--color-primary-hover))`
      },
      secondary: ({ opacityVariable, opacityValue }) => {
        if (opacityValue !== undefined) {
          return `rgba(var(--color-secondary), ${opacityValue})`
        }
        if (opacityVariable !== undefined) {
          return `rgba(var(--color-secondary), var(${opacityVariable}, 1))`
        }
        return `rgb(var(--color-secondary))`
      },
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.zinc,
      red: colors.red,
      blue: colors.sky,
      yellow: colors.yellow,
      orange: colors.orange,
      green: colors.green,
      pink: colors.pink,
    },
    fontFamily: {
      'sans': ['Mona Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      'serif': ['Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular', 'menlo'],
    },
    extend: {
      borderRadius: {
        'md': '6px'
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.07)',
        'inner-xs': 'inset 0 1px 2px rgba(0,0,0,.03)',
        'inner-white': 'inset 0 1px 0 rgba(255,255,255,.4)'
      },
      fontSize: {
        'xs': '11px',
        'sm': ['12px', '16px'],
        'base': ['14px', '20px'],
        'lg': ['16px', '24px']
      },
      maxWidth: {
        '8xl': '90rem'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              fontWeight: 'normal',
              color: theme('colors.secondary'),
              textDecoration: 'none'
            },
            blockquote: {
              borderLeftWidth: '2px',
              fontStyle: 'normal',
              fontWeight: 'normal'
            },
            img: {
              display: 'inline-block'
            }
          }
        }
      })
    },
    variants: {
      margin: ['responsive', 'first']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
    ]
}
