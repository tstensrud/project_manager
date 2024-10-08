/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "primary-color": "#000000",
      "secondary-color": "#FFFFFF",
      "tertiary-color": "#F3F5F8",
      "accent-color": "#0460FD",
      "default-border-color": "black",
      "table-border-color": "#4747478f",
      "navbar-active-bg-color" : "#045ffd2a",
      "navbar-hover-bg-color": "#045ffd2a",

      "table-hover": "#f0f8ff",
      "marked-row": "#d72f597a",
      "grey-text": "#40475A",
      "system-summary": "rgba(89, 113, 157, 0.2)",
    
      "form-border-color": "#00000036",

      "supply-color" : "#2ba972",
      "extract-color" : "#a92b3c",
      "heating-color" : "#FF7F27",
      "deleted-row" : "#aa4444",
      "background-shade": "rgba(0, 0, 0, 0.356)",

      "dark-primary-color": "#ECEBF0",
      "dark-secondary-color": "#161618",
      "dark-tertiary-color": "#1F1F21",
      "dark-accent-color": "#0059B3",
      "dark-default-border-color": "rgb(43, 53, 64)",
      "dark-table-header-color" : "#171B26",
      "dark-table-hover": "#1e2a35",
      "dark-marked-row": "#1e7e3659",
      "dark-grey-text": "rgba(212, 212, 212, 0.644)",
      "dark-system-summary": "rgba(89, 113, 157, 0.2)",
      "dark-navbar-hover-bg-color" : "#3b3b3d41",
      "dark-navbar-active-bg-color" : "#3B3B3D",
      "dark-form-background-color": "#0c1219",
    }
    ,
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "Inter",
          "system-ui",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ]
      },
      keyframes: {
        fadeOut: {
          '0%': {'opacity': "1"},
          '100%': {'opacity': "0"}
        },
        slide: {
          '0%' : {left: '-30%'},
          '50%': {left: '50%'},
          '100%': {left: '100%'},
        },
        slideInFromLeft: {
          '0%': {left: '-100%'},
          '100%': {left: '0'}
        },
        slideOutToLeft: {
          '0%': {left: '0'},
          '100%': {left: '-100%'}
        },
        slideInFromTop: {
          '0%': {top: '-100%'},
          '100%': {top: '8px'}
        },
        slideOutToTop: {
          '0%': {top: '8px'},
          '100%': {top: '-100%'}
        }
      },
      animation: {
        fade: 'fadeOut 5s forwards',
        slide: 'slide 3.0s linear infinite',
        slideInFromLeft: 'slideInFromLeft 0.5s ease-in forwards',
        slideOutToLeft: 'slideOutToLeft 0.5s ease-in forwards',
        slideInFromTop: 'slideInFromTop 0.5s ease-in forwards',
        slideOutToTop: 'slideOutToTop 0.5s ease-in forwards'
      }
    },
  },
  plugins: [],
}