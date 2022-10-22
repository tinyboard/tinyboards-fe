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
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      red: colors.red,
      blue: colors.sky,
      yellow: colors.yellow,
      orange: colors.orange,
      green: colors.green,
      purple: colors.violet,
    },
    fontFamily: {
      'sans': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      'serif': ['Spectral', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular', 'menlo'],
    },
    extend: {
      borderRadius: {
        'md': '6px'
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.07)',
        'inner-xs': 'inset 0 1px 2px rgba(0,0,0,.03)',
        'inner-white': 'inset 0 1px 0 rgba(255,255,255,.25)'
      },
      fontSize: {
        'xs': '11px',
        'sm': '12px',
        'base': '14px'
      },
      maxWidth: {
        '8xl': '90rem'
      }
    },
    variants: {
      margin: ['responsive', 'first']
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
