<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { resetRouter } from '@/router/'

const router = useRouter()
const uploaderRef = ref(null)
const form = ref({})
const navList = ref([
  { text: '昵称', value: '李先生', path: '/meNickname' },
  { text: '手机号', value: '1888888888', path: '/mePhoneChange' },
  { text: '修改密码', value: '', path: '/mePasswordChange' },
])

const chooseFile = () => uploaderRef.value.chooseFile()
const afterRead = () => {}

const onLogout = async () => {
  router.push({ path: '/accountLogin' })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="个人信息" />
    <div class="flex justify-center">
      <div class="px-6 py-10">
        <van-image
          width="4rem"
          height="4rem"
          fit="cover"
          round
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          @click="chooseFile"
        />
        <p class="text-md text-center">修改头像</p>
      </div>
    </div>
    <ul class="m-3 overflow-hidden">
      <li
        v-for="(navItem, nvaIndex) in navList"
        :key="nvaIndex"
        class="van-hairline--bottom mb-2 flex items-center justify-between rounded-lg bg-white p-4 active:opacity-30"
        @click="router.push({ path: navItem.path })"
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
    <van-uploader ref="uploaderRef" class="invisible" :after-read="afterRead" />
  </div>
</template>
