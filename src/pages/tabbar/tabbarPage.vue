<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { transformBind } from '@vue/compiler-core'
import { ref } from 'vue'

const tabIndex = ref(0)

const tabs = ref([
  { text: '家', icon: 'home', index: 0, path: '/tabbar/tabbarHome' },
  { text: '智能', icon: 'config', index: 1, path: '/tabbar/tabbarSmart' },
  { text: '我的', icon: 'people', index: 2, path: '/tabbar/tabbarMe' },
])
</script>

<template>
  <div>
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
      active-color="#000"
      placeholder
      :border="false"
      :safe-area-inset-bottom="true"
    >
      <van-tabbar-item
        v-for="tabItem in tabs"
        :key="tabItem.index"
        :name="tabItem.index"
        :to="tabItem.path"
      >
        <template #icon>
          <icon-park v-if="tabIndex == tabItem.index" :type="tabItem.icon" theme="filled" />
          <icon-park v-else :type="tabItem.icon" theme="outline" />
        </template>
        {{ tabItem.text }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
