import '@vant/touch-emulator'
import { createPinia } from 'pinia'
/**vant-ui 函数式组件样式**/
import 'vant/es/dialog/style'
import 'vant/es/image-preview/style'
import 'vant/es/notify/style'
import 'vant/es/toast/style'
import { createApp } from 'vue'
import Vue3TouchEvents from 'vue3-touch-events'

//重置样式
import '@/assets/styles/reset.css'
import IconPark from '@/components/base/IconPark.vue'
import HeaderNavbar from '@/components/layout/HeaderNavbar.vue'
import ListLoad from '@/components/layout/ListLoad.vue'
import copy from '@/directive/copy.js'
import loadingClick from '@/directive/loadingClick.js'
import permission from '@/directive/permission.js'
import press from '@/directive/press.js'

import App from './App.vue'
import Router from './router'
// import { useVant } from './vant'

const pinia = createPinia()
const app = createApp(App)

// useVant(app)

app
  .component(HeaderNavbar.name, HeaderNavbar)
  .component('ListLoad', ListLoad)
  .component('IconPark', IconPark)

app
  .use(Router)
  .use(pinia)
  .use(Vue3TouchEvents)
  .directive('loading-click', loadingClick)
  .directive('copy', copy)
  .directive('press', press)
  .directive('permission', permission)
  .mount('#app')
