import legacy from '@vitejs/plugin-legacy'
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
    legacy({
      // 需要兼容的目标列表，可以设置多个
      targets: ['defaults', 'not IE 11'],
      // additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      // renderLegacyChunks: true,
      // // 下面的数组可以自定义添加低版本转换的方法
      // polyfills: [
      //   'es.symbol',
      //   'es.array.filter',
      //   'es.promise',
      //   'es.promise.finally',
      //   'es/map',
      //   'es/set',
      //   'es.array.for-each',
      //   'es.object.define-properties',
      //   'es.object.define-property',
      //   'es.object.get-own-property-descriptor',
      //   'es.object.get-own-property-descriptors',
      //   'es.object.keys',
      //   'es.object.to-string',
      //   'web.dom-collections.for-each',
      //   'esnext.global-this',
      //   'esnext.string.match-all',
      // ],
    }),
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
