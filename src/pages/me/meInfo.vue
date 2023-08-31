<script setup>
import Vconsole from 'vconsole'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useLogout } from '@/hooks/useLogout'
import { useUploader } from '@/hooks/useUploader'
import userStore from '@/store/userStore'

const router = useRouter()
const clickCount = ref(0)
const navList = ref([
  { id: 0, text: '昵称', value: '李先生', path: '/meNickname' },
  { id: 1, text: '手机号', value: '1888888888', path: '/me-phone-change' },
  { id: 2, text: '修改密码', value: '', path: '/me-password-change' },
  { id: 3, text: '版本', value: '', path: '/meVersion' },
])
const avatar = ref('')

const afterRead = async (file) => {
  const url = await useUploader(file)
  console.log(url)
}

const onLogout = () => useLogout('退出成功')

const init = async () => {
  const { useUserInfoSync } = userStore()
  const userInfo = await useUserInfoSync()
  console.log(userInfo)
  navList.value = navList.value.map((item) => {
    if (item.path === '/meNickname') return { ...item, value: userInfo.xingming }
    if (item.path === '/me-phone-change') return { ...item, value: userInfo.shouji }
    return item
  })
  avatar.value = userInfo.touxiang
}

init()

const onNavItemClick = (navItem) => {
  if (navItem.id == 3) {
    clickCount.value++
    if (clickCount.value == 5) {
      new Vconsole()
      navList.value = [
        ...navList.value,
        { id: 4, text: '开发者模式', value: '', path: '/me-development' },
      ]
    }

    return
  }
  router.push({ path: navItem.path, query: { value: navItem.value } })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="个人信息" />
    <div class="flex justify-center">
      <div class="px-6 py-10">
        <van-uploader :after-read="afterRead">
          <van-image width="4rem" height="4rem" fit="cover" round :src="avatar" />
        </van-uploader>
        <p class="text-md text-center">修改头像</p>
      </div>
    </div>
    <ul class="m-3 overflow-hidden">
      <li
        v-for="(navItem, nvaIndex) in navList"
        :key="nvaIndex"
        class="van-hairline--bottom mb-2 flex items-center justify-between rounded-lg bg-white p-4 active:opacity-30"
        @click="onNavItemClick(navItem)"
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
  </div>
</template>
