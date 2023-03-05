import path from 'path'

import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint' //打包后文件分析

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
    }),
    visualizer({ open: true, brotliSize: true, filename: 'report.html' }),
    [
      'import',
      {
        libraryName: '@icon-park/vue-next',
        libraryDirectory: 'es/icons',
        camel2DashComponentName: false,
      },
    ],
  ],
  base: './',
  resolve: {
    // 配置路径别名
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',
    port: '4679',
    // proxy: {
    //   "^/api": {
    //     target: "https://atom.musiyoujia.com",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
})
