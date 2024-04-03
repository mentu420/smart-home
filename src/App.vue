<script setup>
import { storeToRefs } from 'pinia'
import VConsole from 'vconsole'
import { ref, reactive, watch, onMounted, nextTick, inject, onBeforeUnmount } from 'vue'
import { $mqtt } from 'vue-paho-mqtt'
import { useRoute, useRouter } from 'vue-router'

import MqttClient from '@/hooks/useMqtt'
import commonRouters from '@/router/modules/common.js'
import userStore from '@/store/userStore'
import useRem from '@/utils/flexible/useRem.js'
import { openUdpService, closeUdpService } from '@/utils/native/udpService'

// if (import.meta.env.MODE === 'development') new VConsole()

const app = inject('App')
const route = useRoute()
const router = useRouter()
const includeList = ref(['TabbarPage'])
const theme = ref('light')
const transitionName = ref('van-slide-left')
const isNativeBack = ref(false)
const { onLine } = storeToRefs(userStore())
const themeVars = reactive({
  uploaderDeleteIconSize: '1.2rem',
  primaryColor: '#07c160',
  navBarIconColor: '#333',
  checkboxCheckedIconColor: '#07c160',
})
// 禁止手势的路径
const disabledPaths = [
  '/tabbar/tabbar-house',
  '/tabbar/tabbar-smart',
  '/tabbar/tabbar-me',
  '/account-login',
]

watch(
  () => route.path,
  (to, from) => {
    if (!isNativeBack.value) {
      transitionName.value = router.isBack === true ? 'van-slide-right' : 'van-slide-left'
      router.isBack = false
    }
    isNativeBack.value = false
    //监听路由变化，把配置路由中keepAlive为true的name添加到include动态数组中
    if (includeList.value.includes(route.name)) return
    if (route.meta.keepAlive) includeList.value.push(route.name)
  }
)

// 原生手势返回
function h5Back() {
  if (disabledPaths.includes(route.path)) return
  router.goBack()
}
//安卓返回键处理
function onBackKeyForAndroid() {
  if (disabledPaths.includes(route.path)) return
  router.goBack()
}

const isWhite = [...commonRouters.map((item) => item.path), '/']

// 建立mqtt
const onConnect = () => {
  console.log('MQTT Connect')
  if (!onLine.value) {
    // mqttDisconnect()
  } else {
    // onMqttConnect()
    // onMqttAutoReconnect()
    // initClient()
    const client = new MqttClient()
  }
}

const onUpdService = () => {
  console.log('onUpdService', onLine.value)
  if (!onLine.value) {
    closeUdpService()
  } else {
    // openUdpService()
  }
}

// 函数挂载window 原生调用
const setNativeMethods = () => {
  window.h5Back = h5Back
  window.routerBack = onBackKeyForAndroid
}

function init() {
  // createMqttPlugin(app)
  onConnect()
  onUpdService()
}

watch(
  () => onLine.value,
  (val) => {
    console.log('在线状态变化', val)
    init()
  },
  { immediate: true }
)

useRem()
setNativeMethods()
</script>

<template>
  <van-config-provider :theme="theme" :theme-vars="themeVars" theme-vars-scope="global">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <keep-alive :include="includeList" :max="10">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </van-config-provider>
</template>

<style>
* {
  user-select: none;
}
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
}
#app {
  font-size: 14px;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  overscroll-behavior: none;
}

body,
html {
  /* 禁用橡皮筋效果 */
  overscroll-behavior: none;
}

#app::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
