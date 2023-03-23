<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import userStore from '@/store/userStore'

const router = useRouter()

const navList = ref([
  { path: '/meHouse', text: '家庭管理', icon: 'application' },
  { path: '/meConceal', text: '隐私政策', icon: 'personal-privacy' },
  { path: '/meAgreement', text: '软件许可及服务协议', icon: 'agreement' },
  { path: '/meAbout', text: '关于', icon: 'tag-one' },
])

const { userInfo = {} } = storeToRefs(userStore())

const init = async () => {
  const { useUserInfoSync } = userStore()
  useUserInfoSync()
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <div class="flex items-center px-6 py-10">
      <van-image
        width="4rem"
        height="4rem"
        fit="cover"
        round
        :src="userInfo?.touxiang"
        @click="router.push({ path: '/meInfo' })"
      />
      <h4 class="text-md ml-4">{{ userInfo?.xingming }}</h4>
    </div>

    <ul class="m-3 overflow-hidden rounded-lg">
      <li
        v-for="(navItem, nvaIndex) in navList"
        :key="nvaIndex"
        class="van-hairline--bottom flex items-center justify-between bg-white px-4 py-6 active:opacity-30"
        @click="router.push({ path: navItem.path })"
      >
        <div class="flex items-center">
          <IconPark size="24" :type="navItem.icon" />
          <p class="ml-4">{{ navItem.text }}</p>
        </div>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.me-grid-list:deep(.van-grid-item__content) {
  border-radius: 16px;
  overflow: hidden;
}
</style>
