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
  '.px-safe': {
    paddingLeft: 'constant(safe-area-inset-left)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'constant(safe-area-inset-right)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  '.py-safe': {
    paddingTop: 'constant(safe-area-inset-top)',
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'constant(safe-area-inset-bottom)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  '.p-safe': {
    paddingLeft: 'constant(safe-area-inset-left)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'constant(safe-area-inset-right)',
    paddingRight: 'env(safe-area-inset-right)',
    paddingTop: 'constant(safe-area-inset-top)',
    paddingTop: 'env(safe-area-inset-top)',
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
  '.mx-safe': {
    marginLeft: 'constant(safe-area-inset-left)',
    marginLeft: 'env(safe-area-inset-left)',
    marginRight: 'constant(safe-area-inset-right)',
    marginRight: 'env(safe-area-inset-right)',
  },
  '.my-safe': {
    marginTop: 'constant(safe-area-inset-top)',
    marginTop: 'env(safe-area-inset-top)',
    marginBottom: 'constant(safe-area-inset-bottom)',
    marginBottom: 'env(safe-area-inset-bottom)',
  },
  '.m-safe': {
    marginLeft: 'constant(safe-area-inset-left)',
    marginLeft: 'env(safe-area-inset-left)',
    marginRight: 'constant(safe-area-inset-right)',
    marginRight: 'env(safe-area-inset-right)',
    marginTop: 'constant(safe-area-inset-top)',
    marginTop: 'env(safe-area-inset-top)',
    marginBottom: 'constant(safe-area-inset-bottom)',
    marginBottom: 'env(safe-area-inset-bottom)',
  },
  '.no-scrollbar': {
    '-ms-overflow-style': 'none' /* IE and Edge */,
    'scrollbar-width': 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
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
        primary: '#1989fa',
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
