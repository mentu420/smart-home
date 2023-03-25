<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUploader } from '@/hooks/useUploader'
import { resetRouter } from '@/router/'
import userStore from '@/store/userStore'

const router = useRouter()
const uploaderRef = ref(null)
const form = ref({})
const navList = ref([
  { text: '昵称', value: '李先生', path: '/meNickname' },
  { text: '手机号', value: '1888888888', path: '/mePhoneChange' },
  { text: '修改密码', value: '', path: '/mePasswordChange' },
])
const avatar = ref('')

const chooseFile = () => uploaderRef.value.chooseFile()
const afterRead = async (file) => {
  const url = await useUploader(file)
  console.log(url)
}

const onLogout = async () => {
  router.push({ path: '/accountLogin' })
}

const init = async () => {
  const { useUserInfoSync } = userStore()
  const userInfo = await useUserInfoSync()
  console.log(userInfo)
  navList.value = navList.value.map((item) => {
    if (item.path === '/meNickname') return { ...item, value: userInfo.xingming }
    if (item.path === '/mePhoneChange') return { ...item, value: userInfo.shouji }
    return item
  })
  avatar.value = userInfo.touxiang
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="个人信息" />
    <div class="flex justify-center">
      <div class="px-6 py-10">
        <van-image width="4rem" height="4rem" fit="cover" round :src="avatar" @click="chooseFile" />
        <p class="text-md text-center">修改头像</p>
      </div>
    </div>
    <ul class="m-3 overflow-hidden">
      <li
        v-for="(navItem, nvaIndex) in navList"
        :key="nvaIndex"
        class="van-hairline--bottom mb-2 flex items-center justify-between rounded-lg bg-white p-4 active:opacity-30"
        @click="router.push({ path: navItem.path, query: { value: navItem.value } })"
      >
        <div>{{ navItem.text }}</div>
        <div class="flex items-center">
          <div class="mr-2">{{ navItem.value }}</div>
          <van-icon name="arrow" />
        </div>
      </li>
    </ul>
    <div class="m-6">
      <van-button round block type="primary" @click="onLogout"> 退出登录 </van-button>
    </div>
    <van-uploader ref="uploaderRef" class="invisible h-0" :after-read="afterRead" />
  </div>
</template>
