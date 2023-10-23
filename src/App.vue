<script setup>
import VConsole from 'vconsole'
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import useRem from '@/utils/flexible/useRem.js'

// new VConsole()

const route = useRoute()
const router = useRouter()
const includeList = ref(['TabbarPage'])
const theme = ref('light')

const themeVars = reactive({})

useRem()

watch(
  () => route.path,
  (to, from) => {
    //监听路由变化，把配置路由中keepAlive为true的name添加到include动态数组中
    if (includeList.value.includes(route.name)) return
    if (route.meta.keepAlive) includeList.value.push(route.name)
  }
)

const client = ref(null)
const clientID = 'APP_12312312312312' //App_用户编号
const url = 'ws://152.136.150.207:2883/mqtt'
const topic = 'console/log/receive'

//连接成功
function onConnect() {
  //订阅主题
  client.value.subscribe(topic)
}

//连接断开
function onConnectionLost(responseObject) {
  console.log('Lost connection')
}

//收到消息
function onMessageArrived(message) {
  console.log('PUBLISH ' + message.destinationName + ' ' + message.payloadString)
}

//发送消息
function sendMessage(msg) {
  var message = new Paho.Message(msg)
  message.destinationName = 'cloud/device/control'
  client.value.send(message)
}

function initClient() {
  client.value = new Paho.MQTT.Client(url, clientID)
  client.value.onConnectionLost = onConnectionLost
  client.value.onMessageArrived = onMessageArrived
  client.value.connect({ userName: 'acematic', password: 'ACEMATIC2018_', onSuccess: onConnect })
  console.log('client', client.value)
}

initClient()
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
