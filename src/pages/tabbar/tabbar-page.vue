<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLogout } from '@/hooks/useLogout'
import userStore from '@/store/userStore'

defineOptions({ name: 'TabbarPage' })

const route = useRoute()
const tabIndex = ref(0)

const tabs = ref([
  { text: '家', icon: 'wap-home-o', index: 0, path: '/tabbar/tabbar-house' },
  { text: '智能', icon: 'home-o', index: 1, path: '/tabbar/tabbar-smart' },
  { text: '我的', icon: 'user-circle-o', index: 2, path: '/tabbar/tabbar-me' },
])

const onChange = (index) => {
  console.log('onChange', index)
}

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
  <div class="pb-sfa">
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
      active-color="#e39334"
      placeholder
      z-index="99"
      :border="false"
      :safe-area-inset-bottom="true"
      @change="onChange"
    >
      <van-tabbar-item
        v-for="tabItem in tabs"
        :key="tabItem.index"
        :name="tabItem.index"
        :to="tabItem.path"
        :icon="tabItem.icon"
      >
        {{ tabItem.text }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
