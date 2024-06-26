<script setup>
import { storeToRefs } from 'pinia'

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { setUserConfig, getUserConfig } from '@/apis/commonApi'
import SmartUploader from '@/components/common/SmartUploader.vue'
import { useLogout } from '@/hooks/useLogout'
import userStore from '@/store/userStore'
import { getWebUrlName } from '@/utils/common'
import { showConfirmDialog } from 'vant'

defineOptions({ name: 'MeInfo' })

const router = useRouter()
const { userInfo } = storeToRefs(userStore())
const avatar = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')

const onLogout = async () => {
  if (userInfo.value?.shifouyishezhimim == 0) {
    router.push({ path: '/me-not-password' })
    return
  }
  await showConfirmDialog({ title: '提示', message: '是否退出登录？' })
  useLogout('退出成功')
}

const onEditAvatar = async (fileList) => {
  const { url } = fileList[0]
  avatar.value = url
  await setUserConfig({ params: { op: 2 }, data: { touxiang: getWebUrlName(url) } })
  userInfo.value = { ...userInfo.value, touxiang: url }
}

const navList = ref([
  { id: 0, text: '昵称', value: userInfo.value?.xingming, path: '/me-nickname' },
  { id: 1, text: '手机号', value: userInfo.value?.shouji, path: '/me-phone-change' },
  { id: 2, text: '修改密码', value: '', path: '/me-password-change' },
  { id: 3, text: '注销账号', value: '', path: '' },
])

const onCancelAccount = async () => {
  try {
    await showConfirmDialog({ title: '提示', message: '是否注销账号？' })
    const { code } = await getUserConfig({ params: { op: 9 } })
    if (code != 0) return
    useLogout('注销成功')
  } catch (error) {
    //
  }
}

const onNavItemClick = async (navItem) => {
  if (navItem.id == 3) {
    onCancelAccount()
    return
  }
  router.push({ path: navItem.path, query: { value: navItem.value } })
}

const init = () => {
  avatar.value = userInfo.value?.touxiang
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="个人信息" />
    <div class="flex justify-center">
      <div class="px-6 py-10">
        <SmartUploader
          reupload
          accept="image/*"
          string-separator=","
          :max-count="1"
          :deletable="false"
          @success="onEditAvatar"
        >
          <template #default="slotProps">
            <div class="w-[80px] h-[80px] flex justify-center items-center bg-page-gray">
              <van-loading v-if="slotProps.loading" />
              <SmartImage v-else class="w-[80px] h-[80px]" fit="cover" round :src="avatar" />
            </div>
          </template>
        </SmartUploader>
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
      <van-button v-loading-click="onLogout" plain round block> 退出登录 </van-button>
    </div>
  </div>
</template>
