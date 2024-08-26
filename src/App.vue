<script setup>
import VConsole from 'vconsole'
import { ref, reactive, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import socketStore from '@/store/socketStore'
import useSize from '@/utils/flexible/useRem.js'
import '@/hooks/useNativeMethods'
import routerStore from './store/routerStore'
import { storeToRefs } from 'pinia'
import { ROUTER_TRANSITION } from '@/enums/routerTransition'

// if (import.meta.env.MODE === 'development') new VConsole()

socketStore()
useSize()

const route = useRoute()
const router = useRouter()
const includeList = ref(['TabbarPage'])
const theme = ref('light')
const isNativeBack = ref(false)
const themeVars = reactive({
  uploaderDeleteIconSize: '1.2rem',
  primaryColor: '#07c160',
  navBarIconColor: '#333',
  checkboxCheckedIconColor: '#07c160',
})
const { transitionName } = storeToRefs(routerStore())

watch(
  () => route.path,
  (to, from) => {
    if (!isNativeBack.value) {
      // transitionName.value = router.isBack === true ? 'van-slide-right' : 'van-slide-left'
      const { setRouterTrainsition } = routerStore()
      setRouterTrainsition(router.isBack ? ROUTER_TRANSITION.REVERSE : ROUTER_TRANSITION.FORWARD)
      router.isBack = false
    }
    isNativeBack.value = false
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

@mixin transition-active {
  position: absolute !important;
  height: 100%;
  top: 0;
  will-change: transform;
  backface-visibility: hidden;
}

.fade-in-enter-active,
.fade-in-leave-active,
.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  @include transition-active;
  transition: transform 220ms;
}

.fade-in-enter-active,
.fade-in-leave-active {
  @include transition-active;
  transform-style: preserve-3d;
  transition: all 500ms;
}

.pop-out-leave-to,
.pop-in-enter {
  z-index: 20;
  transform: translate3d(100%, 0, 0);
}

.pop-out-enter,
.pop-in-leave-to {
  z-index: -1;
  transform: translate3d(-15%, 0, 0);
}

.fade-in-enter {
  opacity: 0;
  transform: scaleX(0.95);
}

.fade-in-enter-to {
  opacity: 1;
}

.fade-in-leave {
  opacity: 0.5;
}

.fade-in-leave-to {
  opacity: 0;
  transform: scaleX(0.95);
}

.slider-out-enter-active,
.slider-out-leave-active,
.slider-in-enter-active,
.slider-in-leave-active {
  @include transition-active;
  transition: transform 220ms;
  -webkit-font-smoothing: subpixel-antialiased;
}

.slider-out-leave-to,
.slider-in-enter {
  transform: translate3d(100%, 0, 0);
}

.slider-out-enter,
.slider-in-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.rotate-out-enter-active,
.rotate-out-leave-active,
.rotate-in-enter-active,
.rotate-in-leave-active {
  @include transition-active;
  transform-style: preserve-3d;
  transition: transform 500ms;
}

/** 3d返回 **/
.rotate-out-leave-to,
    /** 3d进入 **/
  .rotate-in-enter {
  transform: translate3d(50%, 0, 0) rotateY(90deg);
}

/** 3d返回 **/
.rotate-out-enter-to,
    /** 3d进入 **/
  .rotate-in-enter-to {
  transform: rotateY(0deg);
}

/** 3d返回 **/
.rotate-out-enter,
    /** 3d进入 **/
  .rotate-in-leave-to {
  transform: translate3d(-50%, 0, 0) rotateY(-90deg);
}
</style>
