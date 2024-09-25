/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "primary-color": "black",
      "secondary-color": "white",
      "tertiary-color": "#EFF1F6",
      "accent-color": "#ec2828",
      "default-border-color": "black",
      "table-footer": "#161F29",
      "table-row-even": "#ececec",
      "table-button-border": "#1f1c2e",
      "table-button-background": "rgb(18, 28, 38)",
      "table-border-color": "rgb(43, 53, 64)",
      "table-hover": "#12499c1f",
      "marked-row": "#d72f597a",
      "grey-text": "rgb(112, 112, 112)",
      "system-summary": "rgba(89, 113, 157, 0.2)",
      "background-shade": "rgba(0, 0, 0, 0.356)",
    
      "form-border-color": "#00000036",
      "form-focus-border-color": "black",
      "form-background-color": "white",
      "form-element-hover": "black",
      "form-focus-color": "black",
      "form-table-button-border-color": "#00000036",

      "supply-color" : "#2ba972",
      "extract-color" : "#a92b3c",
      "heating-color" : "#FF7F27",
      "deleted-row" : "#aa4444",

      "dark-primary-color": "white",
      "dark-secondary-color": "rgb(18, 28, 38)",
      "dark-tertiary-color": "#0c1219",
      "dark-accent-color": "#00FFA7",
      "dark-default-border-color": "rgb(43, 53, 64)",
      "dark-inner-card-backgrounnd-color": "rgba(33, 50, 68, 0.432)",
      "dark-table-footer": "#161F29",
      "dark-table-button-border": "#1f1c2e",
      "dark-table-button-background": "rgb(18, 28, 38)",
      "dark-table-border-color": "rgb(43, 53, 64)",
      "dark-table-hover": "#4949495e",
      "dark-marked-row": "#1e7e3659",
      "dark-grey-text": "rgba(212, 212, 212, 0.644)",
      "dark-system-summary": "rgba(89, 113, 157, 0.2)",
      "dark-background-shade": "rgba(255, 255, 255, 0.329)",
    
      "dark-form-border-color": "rgb(43, 53, 64)",
      "dark-form-focus-border-color": "#00FFA7",
      "dark-form-background-color": "#0c1219",
      "dark-form-element-hover": "#00FFA7",
      "dark-form-focus-color": "#00FFA7",
      "dark-form-table-button-border-color": "rgb(43, 53, 64)",
    }
    ,
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
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
        }
      },
      animation: {
        fade: 'fadeOut 5s forwards',
        slide: 'slide 3.0s linear infinite'
      }
    },
  },
  plugins: [],
}