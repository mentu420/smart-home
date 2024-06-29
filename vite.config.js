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
  define: {
    'process.env': {},
  },
  plugins: [
    vue(),
    // AutoImport({
    //   resolvers: [VantResolver()],
    // }),
    // Components({
    //   resolvers: [VantResolver()],
    // }),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
    }),
    visualizer({ open: false, brotliSize: true, filename: 'report.html' }),
    legacy({
      // 需要兼容的目标列表，可以设置多个
      targets: ['defaults', 'not IE 11'],
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
  build: {
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames: `assets/[name]-${timestamp}.js`,
        // 块文件名
        chunkFileNames: `assets/[name]-[hash]-${timestamp}.js`,
        // 资源文件名 css 图片等等
        assetFileNames: `assets/[name]-[hash]-${timestamp}.[ext]`,
      },
    },
  },
})
