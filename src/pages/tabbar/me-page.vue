<script setup>
import { storeToRefs } from 'pinia'
import { computed, onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'

import userStore from '@/store/userStore'

defineOptions({ name: 'MePage' })

const router = useRouter()

const navList = computed(() => {
  const list = [
    { path: '/me-house-list', text: '家庭管理', icon: 'wap-home-o' },
    { path: '/me-setting', text: '设置', icon: 'setting-o' },
    { path: '/me-host-list', text: '主机', icon: 'desktop-o' },
  ]
  return list
})

const { userInfo = {} } = storeToRefs(userStore())

const init = () => {
  const { useUserInfoSync } = userStore()
  useUserInfoSync()
}

init()

onActivated(init)
</script>

<template>
  <div class="bg-page-gray p-safe">
    <div class="flex items-center px-6 py-10" @click="router.push({ path: '/me-info' })">
      <SmartImage width="4rem" height="4rem" fit="cover" round :src="userInfo?.touxiang" />
      <h4 class="text-md ml-4">{{ userInfo?.xingming }}</h4>
    </div>

    <ul class="p-3">
      <li
        v-for="(navItem, nvaIndex) in navList"
        :key="nvaIndex"
        class="flex items-center justify-between bg-white px-4 py-6 active:opacity-30 mb-4 overflow-hidden rounded-lg"
        @click="router.push({ path: navItem.path })"
      >
        <div class="flex items-center">
          <van-icon :name="navItem.icon" size="2em" />
          <p class="ml-4">{{ navItem.text }}</p>
        </div>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>
