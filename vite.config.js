import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint' //打包后文件分析
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

const timestamp = new Date().getTime()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
    }),
    visualizer({ open: false, brotliSize: true, filename: 'report.html' }),
    // legacy({
    //   // 需要兼容的目标列表，可以设置多个
    //   targets: ['defaults', 'not IE 11'],
    //   polyfills: ['es.promise.finally', 'es/map', 'es/set', 'esnext.global-this'],
    //   modernPolyfills: ['es.promise.finally'],
    //   // 默认为true，一般用在使用modernPolyfill为现代语法构建注入polyfill时设置为false, 解决Big integer literals are not available in the configured target environment
    //   renderLegacyChunks: false,
    // }),
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
