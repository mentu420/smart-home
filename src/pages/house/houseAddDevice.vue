<script setup>
import { ref } from 'vue'

import LoopAnime from '@/components/loopAnime.vue'

const animeRef = ref(null)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加设备" />
    <div class="flex items-center justify-center">
      <!-- <van-image
        width="20rem"
        height="20rem"
        fit="contain"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      /> -->
      <LoopAnime ref="animeRef" />
    </div>
    <div class="text-center">正在扫描附件的设备...</div>
  </div>
</template>
