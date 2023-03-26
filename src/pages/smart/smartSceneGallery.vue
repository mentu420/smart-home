<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const checked = ref(0)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="场景图库" />
    <ul class="grid grid-cols-2 gap-4 p-4">
      <li v-for="image in 8" :key="image" class="relative">
        <van-image
          class="h-20 w-full"
          fit="cover"
          radius="10"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
        <div class="absolute left-0 right-0 top-0 bottom-0 flex items-center">
          <p class="p-3 text-white">图片</p>
        </div>
        <div class="absolute right-0 top-0">
          <van-checkbox v-model="checked"></van-checkbox>
        </div>
      </li>
    </ul>
    <div class="p-6">
      <van-button type="primary" block round> 确定 </van-button>
    </div>
  </div>
</template>
