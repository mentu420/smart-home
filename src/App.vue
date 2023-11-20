<script setup>
import VConsole from 'vconsole'
import { ref, reactive, watch, onMounted, nextTick, inject } from 'vue'
import { $mqtt } from 'vue-paho-mqtt'
import { useRoute, useRouter } from 'vue-router'

import useMqtt from '@/hooks/useMqtt'
import commonRouters from '@/router/modules/common.js'
import userStore from '@/store/userStore'
import useRem from '@/utils/flexible/useRem.js'
import { initClient } from '@/utils/socket'
// initClient()

// new VConsole()

const app = inject('App')
const route = useRoute()
const router = useRouter()
const includeList = ref(['TabbarPage'])
const theme = ref('light')

const themeVars = reactive({})

useRem()

watch(
  () => route.path,
  (to, from) => {
    nextTick(init)
    //监听路由变化，把配置路由中keepAlive为true的name添加到include动态数组中
    if (includeList.value.includes(route.name)) return
    if (route.meta.keepAlive) includeList.value.push(route.name)
  }
)

function init() {
  const { useGetToken } = userStore()
  const { createMqtt, mqttSubscribe, getMqttStatus } = useMqtt(true)
  const isWhite = [...commonRouters.map((item) => item.path), '/']
  const status = getMqttStatus()
  if (isWhite.includes(route.path)) {
    if (status == 'connected') $mqtt.disconnect()
  } else {
    if (!useGetToken() || status == 'connected') return
    createMqtt(app)
    mqttSubscribe()
  }
}

onMounted(init)
</script>

<template>
  <van-config-provider :theme="theme" :theme-vars="themeVars">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive :include="includeList" :max="10">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </van-config-provider>
</template>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
}
#app {
  font-size: 14px;
}

:root:root {
  --van-primary-color: #e39334;
}
</style>
