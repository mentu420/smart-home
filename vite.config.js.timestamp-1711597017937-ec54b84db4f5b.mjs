// vite.config.js
import legacy from "file:///D:/workspace/github/smart-home/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import vue from "file:///D:/workspace/github/smart-home/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { visualizer } from "file:///D:/workspace/github/smart-home/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { VantResolver } from "file:///D:/workspace/github/smart-home/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { defineConfig } from "file:///D:/workspace/github/smart-home/node_modules/vite/dist/node/index.js";
import eslintPlugin from "file:///D:/workspace/github/smart-home/node_modules/vite-plugin-eslint/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    // Components({
    //   resolvers: [VantResolver()],
    // }),
    vue(),
    eslintPlugin({
      include: ["src/**/*.js", "src/**/*.vue", "src/*.js", "src/*.vue"]
    }),
    visualizer({ open: false, brotliSize: true, filename: "report.html" }),
    legacy({
      // 需要兼容的目标列表，可以设置多个
      targets: ["defaults", "not IE 11"]
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
    })
  ],
  base: "./",
  resolve: {
    // 配置路径别名
    alias: {
      "@": "/src"
    }
  },
  server: {
    host: "0.0.0.0",
    port: "4679"
    // proxy: {
    //   "^/api": {
    //     target: "https://atom.musiyoujia.com",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcZ2l0aHViXFxcXHNtYXJ0LWhvbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHdvcmtzcGFjZVxcXFxnaXRodWJcXFxcc21hcnQtaG9tZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovd29ya3NwYWNlL2dpdGh1Yi9zbWFydC1ob21lL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xyXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBlc2xpbnRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tZXNsaW50JyAvL1x1NjI1M1x1NTMwNVx1NTQwRVx1NjU4N1x1NEVGNlx1NTIwNlx1Njc5MFxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICAvLyBDb21wb25lbnRzKHtcclxuICAgIC8vICAgcmVzb2x2ZXJzOiBbVmFudFJlc29sdmVyKCldLFxyXG4gICAgLy8gfSksXHJcbiAgICB2dWUoKSxcclxuICAgIGVzbGludFBsdWdpbih7XHJcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyouanMnLCAnc3JjLyoqLyoudnVlJywgJ3NyYy8qLmpzJywgJ3NyYy8qLnZ1ZSddLFxyXG4gICAgfSksXHJcbiAgICB2aXN1YWxpemVyKHsgb3BlbjogZmFsc2UsIGJyb3RsaVNpemU6IHRydWUsIGZpbGVuYW1lOiAncmVwb3J0Lmh0bWwnIH0pLFxyXG4gICAgbGVnYWN5KHtcclxuICAgICAgLy8gXHU5NzAwXHU4OTgxXHU1MTdDXHU1QkI5XHU3Njg0XHU3NkVFXHU2ODA3XHU1MjE3XHU4ODY4XHVGRjBDXHU1M0VGXHU0RUU1XHU4QkJFXHU3RjZFXHU1OTFBXHU0RTJBXHJcbiAgICAgIHRhcmdldHM6IFsnZGVmYXVsdHMnLCAnbm90IElFIDExJ10sXHJcbiAgICAgIC8vIGFkZGl0aW9uYWxMZWdhY3lQb2x5ZmlsbHM6IFsncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJ10sXHJcbiAgICAgIC8vIHJlbmRlckxlZ2FjeUNodW5rczogdHJ1ZSxcclxuICAgICAgLy8gLy8gXHU0RTBCXHU5NzYyXHU3Njg0XHU2NTcwXHU3RUM0XHU1M0VGXHU0RUU1XHU4MUVBXHU1QjlBXHU0RTQ5XHU2REZCXHU1MkEwXHU0RjRFXHU3MjQ4XHU2NzJDXHU4RjZDXHU2MzYyXHU3Njg0XHU2NUI5XHU2Q0Q1XHJcbiAgICAgIC8vIHBvbHlmaWxsczogW1xyXG4gICAgICAvLyAgICdlcy5zeW1ib2wnLFxyXG4gICAgICAvLyAgICdlcy5hcnJheS5maWx0ZXInLFxyXG4gICAgICAvLyAgICdlcy5wcm9taXNlJyxcclxuICAgICAgLy8gICAnZXMucHJvbWlzZS5maW5hbGx5JyxcclxuICAgICAgLy8gICAnZXMvbWFwJyxcclxuICAgICAgLy8gICAnZXMvc2V0JyxcclxuICAgICAgLy8gICAnZXMuYXJyYXkuZm9yLWVhY2gnLFxyXG4gICAgICAvLyAgICdlcy5vYmplY3QuZGVmaW5lLXByb3BlcnRpZXMnLFxyXG4gICAgICAvLyAgICdlcy5vYmplY3QuZGVmaW5lLXByb3BlcnR5JyxcclxuICAgICAgLy8gICAnZXMub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicsXHJcbiAgICAgIC8vICAgJ2VzLm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyxcclxuICAgICAgLy8gICAnZXMub2JqZWN0LmtleXMnLFxyXG4gICAgICAvLyAgICdlcy5vYmplY3QudG8tc3RyaW5nJyxcclxuICAgICAgLy8gICAnd2ViLmRvbS1jb2xsZWN0aW9ucy5mb3ItZWFjaCcsXHJcbiAgICAgIC8vICAgJ2VzbmV4dC5nbG9iYWwtdGhpcycsXHJcbiAgICAgIC8vICAgJ2VzbmV4dC5zdHJpbmcubWF0Y2gtYWxsJyxcclxuICAgICAgLy8gXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgYmFzZTogJy4vJyxcclxuICByZXNvbHZlOiB7XHJcbiAgICAvLyBcdTkxNERcdTdGNkVcdThERUZcdTVGODRcdTUyMkJcdTU0MERcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogJy9zcmMnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcG9ydDogJzQ2NzknLFxyXG4gICAgLy8gcHJveHk6IHtcclxuICAgIC8vICAgXCJeL2FwaVwiOiB7XHJcbiAgICAvLyAgICAgdGFyZ2V0OiBcImh0dHBzOi8vYXRvbS5tdXNpeW91amlhLmNvbVwiLFxyXG4gICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgIC8vICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXHJcbiAgICAvLyAgIH0sXHJcbiAgICAvLyB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1IsT0FBTyxZQUFZO0FBQ3ZTLE9BQU8sU0FBUztBQUNoQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGtCQUFrQjtBQUd6QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJUCxJQUFJO0FBQUEsSUFDSixhQUFhO0FBQUEsTUFDWCxTQUFTLENBQUMsZUFBZSxnQkFBZ0IsWUFBWSxXQUFXO0FBQUEsSUFDbEUsQ0FBQztBQUFBLElBQ0QsV0FBVyxFQUFFLE1BQU0sT0FBTyxZQUFZLE1BQU0sVUFBVSxjQUFjLENBQUM7QUFBQSxJQUNyRSxPQUFPO0FBQUE7QUFBQSxNQUVMLFNBQVMsQ0FBQyxZQUFZLFdBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQXNCbkMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQTtBQUFBLElBRVAsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBLElBQ1A7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
