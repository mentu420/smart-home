<script setup>
import VConsole from 'vconsole'
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import useRem from '@/utils/flexible/useRem.js'

// new VConsole()

const route = useRoute()
const router = useRouter()
const includeList = ref(['Tabbar'])
const theme = ref('light')

const themeVars = reactive({
  sliderActiveBackground: '#ff976a',
  buttonPrimaryBackground: '#ff976a',
  buttonPrimaryBorderColor: '#ff976a',
  navBarIconColor: '#999',
})

useRem()

watch(
  () => route.path,
  (to, from) => {
    //监听路由变化，把配置路由中keepAlive为true的name添加到include动态数组中
    if (includeList.value.includes(route.name)) return
    if (route.meta.keepAlive) includeList.value.push(route.name)
  }
)
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
/* @tailwind base; */
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
}
#app {
  font-size: 14px;
}
</style>
