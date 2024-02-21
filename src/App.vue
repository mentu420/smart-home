<script setup>
import VConsole from 'vconsole'
import { ref, reactive, watch, onMounted, nextTick, inject } from 'vue'
import { $mqtt } from 'vue-paho-mqtt'
import { useRoute, useRouter } from 'vue-router'

import useMqtt from '@/hooks/useMqtt'
import commonRouters from '@/router/modules/common.js'
import userStore from '@/store/userStore'
import useRem from '@/utils/flexible/useRem.js'

if (import.meta.env.MODE === 'development') new VConsole()

const app = inject('App')
const route = useRoute()
const router = useRouter()
const includeList = ref(['TabbarPage'])
const theme = ref('light')
const transitionName = ref('van-slide-left')
const isNativeBack = ref(false)
const themeVars = reactive({
  uploaderDeleteIconSize: '1.2rem',
  primaryColor: '#07c160',
  navBarIconColor: '#333',
  checkboxCheckedIconColor: '#07c160',
})

useRem()

function h5Back() {
  if (
    [
      '/tabbar/tabbar-house',
      '/tabbar/tabbar-smart',
      '/tabbar/tabbar-me',
      '/account-login',
    ].includes(route.path)
  )
    return
  router.goBack()
}

const setNativeMethods = () => {
  window.h5Back = h5Back
}

setNativeMethods()

watch(
  () => route.path,
  (to, from) => {
    if (!isNativeBack.value) {
      transitionName.value = router.isBack === true ? 'van-slide-right' : 'van-slide-left'
      router.isBack = false
    }
    isNativeBack.value = false
    nextTick(init)
    //监听路由变化，把配置路由中keepAlive为true的name添加到include动态数组中
    if (includeList.value.includes(route.name)) return
    if (route.meta.keepAlive) includeList.value.push(route.name)
  }
)

function init() {
  const { useGetToken } = userStore()
  const { createMqtt, mqttSubscribe, getMqttStatus } = useMqtt()
  const isWhite = [...commonRouters.map((item) => item.path), '/']
  const status = getMqttStatus()
  if (isWhite.includes(route.path)) {
    if (status == 'connected') $mqtt.disconnect()
  } else {
    if (!useGetToken() || status == 'connected') return
    createMqtt(app)
    mqttSubscribe(true)
  }
}

onMounted(init)
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
}

#app::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
