<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLogout } from '@/hooks/useLogout'
import userStore from '@/store/userStore'

defineOptions({ name: 'TabbarPage' })

const route = useRoute()
const tabIndex = ref(0)
const tabs = ref([
  {
    text: '家',
    inactiveIcon: 'wap-home-o',
    activeIcon: 'wap-home',
    index: 0,
    path: '/tabbar/tabbar-house',
  },
  {
    text: '智能',
    inactiveIcon: 'home-o',
    activeIcon: 'home',
    index: 1,
    path: '/tabbar/tabbar-smart',
  },
  {
    text: '我的',
    inactiveIcon: 'user-circle-o',
    activeIcon: 'user-circle',
    index: 2,
    path: '/tabbar/tabbar-me',
  },
])

const init = () => {
  const { useGetToken } = userStore()
  const token = useGetToken()
  if (!token) {
    useLogout()
    return
  }

  const tabItem = tabs.value.find((item) => item.path == route.path)
  if (route.path != tabItem.path) return
  tabIndex.value = tabItem.index
}

init()
</script>

<script>
export default {
  name: 'TabbarPage',
}
</script>

<template>
  <div class="bg-page-gray min-h-screen">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>

    <van-tabbar
      v-model="tabIndex"
      route
      placeholder
      z-index="99"
      active-color="#000"
      inactive-color="#999"
      :border="false"
      :safe-area-inset-bottom="true"
    >
      <van-tabbar-item
        v-for="tabItem in tabs"
        :key="tabItem.index"
        :name="tabItem.index"
        :to="tabItem.path"
        :icon="tabItem.inactiveIcon"
      >
        {{ tabItem.text }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
