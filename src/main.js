import '@vant/touch-emulator'
import 'tailwindcss/tailwind.css'
/**vant-ui 函数式组件样式**/
// import 'vant/es/dialog/style'
// import 'vant/es/image-preview/style'
// import 'vant/es/notify/style'
// import 'vant/es/toast/style'
import 'vant/lib/index.css'
import { createApp, provide } from 'vue'
import { createPahoMqttPlugin } from 'vue-paho-mqtt'
import Vue3TouchEvents from 'vue3-touch-events'

//重置样式
import '@/assets/styles/reset.css'
import SmartImage from '@/components/base/SmartImage.vue'
import IconFont from '@/components/iconfont/index'
import HeaderNavbar from '@/components/layout/HeaderNavbar.vue'
import ListLoad from '@/components/layout/ListLoad.vue'
import clickableActive from '@/directive/clickableActive.js'
import copy from '@/directive/copy.js'
import loadingClick from '@/directive/loadingClick.js'
import permission from '@/directive/permission.js'
import pointerDrag from '@/directive/pointerDrag.js'
import press from '@/directive/press.js'
import pinia from '@/store/'

import App from './App.vue'
import Router from './router'
import { useVant } from './vant'

const app = createApp(App)

app.provide('App', app)

useVant(app)

app
  .component(HeaderNavbar.name, HeaderNavbar)
  .component('ListLoad', ListLoad)
  .component('IconFont', IconFont)
  .component(SmartImage.name, SmartImage)

app
  .use(Router)
  .use(pinia)
  .use(Vue3TouchEvents)
  .directive('loading-click', loadingClick)
  .directive('clickable-active', clickableActive)
  .directive('copy', copy)
  .directive('press', press)
  .directive('permission', permission)
  .directive('pointer-drag', pointerDrag)
  .mount('#app')
