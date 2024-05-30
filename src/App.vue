<script setup>
import VConsole from 'vconsole'
import { ref, reactive, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socketStore from '@/store/socketStore'
import useSize from '@/utils/flexible/useRem.js'

socketStore()

// if (import.meta.env.MODE === 'development') new VConsole()

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

// 函数挂载window 原生调用
const setNativeMethods = () => {
  window.h5Back = h5Back
  window.routerBack = onBackKeyForAndroid
}

useSize()
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

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  user-select: none;
}
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
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
