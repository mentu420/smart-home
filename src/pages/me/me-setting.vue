<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navList = ref([
  { path: '', text: '多语言', icon: 'chat-o' },
  { path: '/me-about', text: '关于', icon: 'warning-o' },
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
        @click="
          () => {
            if (navItem.path != '') router.push(navItem.path)
          }
        "
      />
    </van-cell-group>
  </div>
</template>
