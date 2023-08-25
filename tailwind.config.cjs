/* eslint-disable no-dupe-keys */
// https://github.com/sonofmagic/weapp-tailwindcss-webpack-plugin/blob/main/demo/uni-app/tailwind.config.js
const plugin = require('tailwindcss/plugin')
const newUtilities = {
  '.pt-safe': {
    paddingTop: 'constant(safe-area-inset-top)',
    paddingTop: 'env(safe-area-inset-top)',
  },
  '.pl-safe': {
    paddingLeft: 'constant(safe-area-inset-left)',
    paddingLeft: 'env(safe-area-inset-left)',
  },
  '.pr-safe': {
    paddingRight: 'constant(safe-area-inset-right)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  '.pb-safe': {
    paddingBottom: 'constant(safe-area-inset-bottom)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  '.mt-safe': {
    marginTop: 'constant(safe-area-inset-top)',
    marginTop: 'env(safe-area-inset-top)',
  },
  '.ml-safe': {
    marginLeft: 'constant(safe-area-inset-left)',
    marginLeft: 'env(safe-area-inset-left)',
  },
  '.mr-safe': {
    marginRight: 'constant(safe-area-inset-right)',
    marginRight: 'env(safe-area-inset-right)',
  },
  '.mb-safe': {
    marginBottom: 'constant(safe-area-inset-bottom)',
    marginBottom: 'env(safe-area-inset-bottom)',
  },
}

// module.exports = {
//   content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
//   theme: {
//     // 拓展写在这个文件下，否则prettier会报错
//     extend: {
//       colors: {
//         'page-gray': '#f7f7f7',
//         'text-primary': '#E9B065',
//       },
//     },
//   },
// }
module.exports = {
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    // 拓展写在这个文件下，否则prettier会报错
    extend: {
      colors: {
        'page-gray': '#f7f7f7',
        primary: '#e39334',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [
    plugin(function ({ addBase, addUtilities, addComponents, matchUtilities, theme }) {
      addUtilities(newUtilities)
      // matchUtilities(
      //   {
      //     'pb-safe': (value) => ({
      //       paddingBottom: `calc(constant(safe-area-inset-bottom) + ${value})`,
      //       paddingBottom: `calc(env(safe-area-inset-bottom) + ${value})`,
      //     }),
      //   },
      //   { values: '0px' }
      // )
    }),
  ],
  corePlugins: {
    preflight: false,
  },
  darkMode: 'media', //深色模式
}
