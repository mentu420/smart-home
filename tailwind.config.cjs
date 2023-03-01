module.exports = {
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    // 拓展写在这个文件下，否则prettier会报错
    extend: {
      colors: {
        'page-gray': '#f7f7f7',
      },
    },
  },
}
