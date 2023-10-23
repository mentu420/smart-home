import path from 'path'

import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint' //打包后文件分析

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Components({
    //   resolvers: [VantResolver()],
    // }),
    vue(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
    }),
    visualizer({ open: false, brotliSize: true, filename: 'report.html' }),
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
