<script setup>
import { ref } from 'vue'

defineOptions({ name: 'LaunchPage' })

const images = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
])
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <van-swipe class="w-screen h-screen" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(imageItem, imageIndex) in images" :key="imageIndex">
        <van-image class="w-screen h-screen" fit="cover" :src="imageItem" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
