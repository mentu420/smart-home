<script setup>
import { ref, onMounted } from 'vue'

import LoopAnime from '@/components/anime/loopAnime.vue'

defineOptions({ name: 'HouseAddDevice' })

const animeRef = ref(null)
const textList = ['正在扫描附件的设备...', '为发现附近的设备！']
const action = ref(0)

const onStart = () => {
  action.value = 0
  animeRef.value.play()
  onPause()
}

const onPause = () => {
  setTimeout(() => {
    action.value = 1
    animeRef.value.pause()
  }, 10 * 1000)
}

onMounted(() => {
  onPause()
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加设备" />
    <div class="flex h-80 items-center justify-center">
      <LoopAnime ref="animeRef" />
    </div>
    <div class="text-center">{{ textList[action] }}</div>
    <div v-if="action == 1" class="m-10">
      <van-button round block type="primary" @click="onStart">重新扫描</van-button>
    </div>
  </div>
</template>
