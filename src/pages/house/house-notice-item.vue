<script setup>
import { ref } from 'vue'

import LoopAnime from '@/components/anime/loopAnime.vue'

defineOptions({ name: 'HouseNoticeItem' })

const animeRef = ref(null)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="消息详情" />
    <div class="flex items-center justify-center">
      <LoopAnime ref="animeRef" />
    </div>
    <div class="text-center">正在扫描附件的设备...</div>
  </div>
</template>
