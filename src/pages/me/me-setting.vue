<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navList = ref([
  { path: '/me-conceal', text: '隐私政策', icon: 'miniprogram-o' },
  { path: '/me-agreement', text: '软件许可及服务协议', icon: 'certificate' },
])
</script>

<template>
  <div class="p-4 bg-page-gray min-h-screen">
    <HeaderNavbar title="设置" />
    <van-cell-group class="rounded-lg overflow-hidden">
      <van-cell
        v-for="navItem in navList"
        :key="navItem.path"
        :title="navItem.text"
        :icon="navItem.icon"
        is-link
        clickable
        @click="router.push({ path: navItem.path })"
      />
    </van-cell-group>
    <van-cell
      title="关于"
      class="rounded-lg overflow-hidden mt-4"
      icon="warning-o"
      is-link
      clickable
      @click="router.push({ path: '/me-about' })"
    />
  </div>
</template>
