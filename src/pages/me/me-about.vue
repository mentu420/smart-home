<script setup>
import { ref } from 'vue'
import logoIcon from '@/assets/images/smart-logo.png'
import { useRouter } from 'vue-router'
import { getStorage, setStorage } from '@/utils/storage'
import Vconsole from 'vconsole'
import socketStore from '@/store/socketStore'
import { showConfirmDialog } from 'vant'

defineOptions({ name: 'MeAbout' })

const router = useRouter()

const isDev = ref(false)
const clickCount = ref(0)

const { VITE_APP_DEVELOPER, VITE_APP_VERSION, VITE_APP_APP_NAME } = import.meta.env

const onClick = async () => {
  clickCount.value++
  if (clickCount.value == 5) {
    try {
      await showConfirmDialog({ title: '提示', message: '是否打开开发者模式' })
      const { useSetShowLog } = socketStore()
      useSetShowLog(true)
      new Vconsole()
      setStorage(VITE_APP_DEVELOPER, 1)
      isDev.value = true
      clickCount.value = 0
    } catch (error) {
      //
    }
  }
}

const init = () => {
  isDev.value = getStorage(VITE_APP_DEVELOPER) ?? false

  console.log('isDev', isDev.value)
}

init()
</script>

<template>
  <div class="h-screen bg-page-gray">
    <HeaderNavbar title="关于" />
    <div class="flex justify-center my-[70px]">
      <div class="text-center">
        <van-image class="w-[70px] h-[70px]" fit="contain" :src="logoIcon" @click="onClick" />
        <div class="mt-[30px]">
          <h3>{{ VITE_APP_APP_NAME }}</h3>
          <p class="mt-2 text-gray-400">{{ VITE_APP_VERSION }}</p>
        </div>
      </div>
    </div>
    <van-cell-group v-if="isDev" inset>
      <van-cell
        class="!py-4"
        title="开发者模式"
        is-link
        @click="router.push({ path: '/me-development' })"
      />
    </van-cell-group>
    <footer class="fixed bottom-6 w-full left-0 text-center text-[#6f6f6f] space-y-4">
      <p>
        <span class="text-origin" @click.stop="router.push({ path: '/me-agreement' })">
          《软件许可及服务协议》
        </span>
        和
        <span class="text-origin" @click.stop="router.push({ path: '/me-conceal' })">
          《隐私政策》
        </span>
      </p>
      <p class="mb-safe text-xs">Copyright ©2022-2024 JoinedLinks.All Rights Reserved</p>
    </footer>
  </div>
</template>
