<script setup>
import VConsole from 'vconsole'
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socketStore from '@/store/socketStore'
import useSize from '@/utils/flexible/useRem.js'
import '@/hooks/useNativeMethods'

// if (import.meta.env.MODE === 'development') new VConsole()

socketStore()
useSize()

const route = useRoute()
const router = useRouter()
const includeList = ref(['TabbarPage'])
const theme = ref('light')
const transitionName = ref('')
const themeVars = reactive({
  uploaderDeleteIconSize: '1.2rem',
  primaryColor: '#07c160',
  navBarIconColor: '#333',
  checkboxCheckedIconColor: '#07c160',
})

const ROUTER_TRANSITION = {
  FORWARD: 'page-in',
  REVERSE: 'page-out',
}

watch(
  () => route.path,
  (to, from) => {
    if (from === '/') {
      transitionName.value = null
    } else if (router.isBack) {
      transitionName.value = ROUTER_TRANSITION.REVERSE
    } else {
      transitionName.value = ROUTER_TRANSITION.FORWARD
    }
    router.isBack = false
    //监听路由变化，把配置路由中keepAlive为true的name添加到include动态数组中
    if (includeList.value.includes(route.name)) return
    if (route.meta.keepAlive) includeList.value.push(route.name)
  }
)
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

@keyframes page-out {
  0% {
    transform: translate3d(0%, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}

.page-in-enter-active,
.page-in-leave-active,
.page-out-enter-active,
.page-out-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  will-change: transform;
  backface-visibility: hidden;
  transition: transform 300ms ease-in-out; /* 调整动画时长为500ms，更自然 */
}

.page-in-enter-from {
  transform: translate3d(100%, 0, 0); /* 页面从右侧屏幕外开始 */
}

.page-in-enter-to {
  transform: translate3d(0, 0, 0); /* 页面回到视图中 */
}

.page-out-leave-from {
  transform: translate3d(0, 0, 0); /* 页面从视图中开始退出 */
  z-index: 1;
}

.page-out-leave-to {
  transform: translate3d(100%, 0, 0); /* 页面向左退出视图 */
  z-index: 1;
}
</style>
