module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'eslint-config-prettier',
    'eslint:recommended', // 使用推荐的eslint
    'plugin:vue/vue3-recommended', // 使用插件支持vue3
    'plugin:vue/vue3-essential',
    'plugin:import/recommended',
    //1.继承.prettierrc.js文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
    requireConfigFile: false,
    parser: '@babel/eslint-parser',
  },
  // eslint-plugin-vue
  plugins: [
    'vue', // 引入vue的插件 vue <==> eslint-plugin-vue
  ],
  globals: {
    // script setup
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    AMap: 'readonly',
    BMap: 'readonly',
    BMAP_ANIMATION_BOUNCE: 'readonly',
    BMAP_STATUS_SUCCESS: 'readonly',
    Paho: 'readonly',
    jdwl: 'readonly',
    showToast: 'readonly',
    showDialog: 'readonly',
    showConfirmDialog: 'readonly',
    showNotify: 'readonly',
    showLoadingToast: 'readonly',
    closeToast: 'readonly',
  },
  // 这里时配置规则的,自己看情况配置
  rules: {
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-v-html': 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'import/order': 0, // 执行模块导入顺序中的约定
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
  },
}
