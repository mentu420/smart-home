import '@vant/touch-emulator'
import { createPinia } from 'pinia'
/**vant-ui 函数式组件样式**/
// import 'vant/lib/index.css'
import { createApp } from 'vue'
import Vue3TouchEvents from 'vue3-touch-events'

//重置样式
import '@/assets/styles/reset.css'
import HeaderNavbar from '@/components/layout/HeaderNavbar.vue'
import ListLoad from '@/components/layout/ListLoad.vue'
import copy from '@/directive/copy.js'
import loadingClick from '@/directive/loadingClick.js'
import press from '@/directive/press.js'

import App from './App.vue'
import Router from './router'
// import { useVant } from './vant'

const pinia = createPinia()
const app = createApp(App)

// useVant(app)

app.component(HeaderNavbar.name, HeaderNavbar).component('ListLoad', ListLoad)

app
  .use(Router)
  .use(pinia)
  .use(Vue3TouchEvents)
  .directive('loading-click', loadingClick)
  .directive('copy', copy)
  .directive('press', press)
  .mount('#app')
