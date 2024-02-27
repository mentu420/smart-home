<script setup>
import { ref } from 'vue'
import logoIcon from '@/assets/images/smart-logo.png'
import { useRouter } from 'vue-router'

defineOptions({ name: 'MeAbout' })

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray relative">
    <HeaderNavbar title="关于" />
    <div class="flex justify-center mt-[70px]">
      <div>
        <van-image class="w-[70px] h-[70px]" fit="contain" :src="logoIcon" />
        <div class="text-center mt-[30px]">
          <h3>智家365</h3>
          <p class="mt-2 text-gray-400">1.0.0</p>
        </div>
      </div>
    </div>
    <footer class="absolute bottom-6 w-full left-0 text-center text-[#6f6f6f] space-y-4">
      <p>
        <span class="text-[#f1900b]" @click.stop="router.push({ path: '/me-agreement' })">
          《软件许可及服务协议》
        </span>
        和
        <span class="text-[#f1900b]" @click.stop="router.push({ path: '/me-conceal' })">
          《隐私政策》
        </span>
      </p>
      <p class="mb-safe text-xs">Copyright ©2015-2024 ORVIBO Home.All Rights Reserved</p>
    </footer>
  </div>
</template>
