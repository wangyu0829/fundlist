/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    colors: {
      white: '#ffffff',
      'white-light': '#f7f7f7',
      'blue-dark': '#2578f3',
      blue: '#1fb6ff',
      // 'blue-light': '#e6f7ff',
      purple: '#7e5bef',
      pink: '#ff49db',
      orange: '#ff7849',
      green: '#13ce66',
      'green-light': '#e6f7ff',
      yellow: '#ffc82c',
      'gray-dark': '#273444',
      gray: '#8492a6',
      'gray-light': '#d4d4e4',
      black: '#000000',
      'black-light': '#4f4f4f'
    },
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem'
    },
    fontWeight: {
      thin: '100',
      hairline: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      'extra-bold': '800',
      black: '900'
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      92: '23rem',
      96: '24rem'
    },
    borderRadius: {
      none: '0',
      sm: '.125rem',
      DEFAULT: '.25rem',
      lg: '.5rem',
      full: '9999px'
    },
    opacity: {
      0: '0',
      10: '0.1',
      20: '0.2',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      80: '0.8',
      90: '0.9',
      100: '1'
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif']
    },
    backgroundSize: ({ theme }) => ({
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
      ...theme('spacing')
    }),
    extend: {
      colors: {
        // primary: {
        //   DEFAULT: '#1fb6ff',
        // },
        // secondary: {
        //   DEFAULT: '#7e5bef',
        // },
        // tertiary: {
        //   DEFAULT: '#ff49db',
        // },
        // quaternary: {
        //   DEFAULT: '#ff7849',
        // },
        // quinary: {
        //   DEFAULT: '#13ce66',
        // },
        // senary: {
        //   DEFAULT: '#ffc82c',
        // },
        // 'gray-dark': {
        //   DEFAULT: '#273444',
        // },
        // gray: {
        //   DEFAULT: '#8492a6',
        // },
        // 'gray-light': {
        //   DEFAULT: '#d3dce6',
        // },
        'hover-red': {
          DEFAULT: '#cf0a2c'
        }
      },
      zIndex: {
        1: 1
      },
      flexBasis: {
        '3/3': '100%',
        '1/7': '14.2857143%'
      },
      transitionProperty: {
        height: 'height',
        'max-height': 'max-height',
        spacing: 'margin, padding'
      }
    }
  },
  plugins: []
}
