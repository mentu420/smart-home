<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import image1 from '@/assets/images/smart/smart-bg-2.jpg'

const router = useRouter()
const sceneList = ref([
  { text: '全局', list: [] },
  { text: '一楼 客厅', list: [] },
])
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <van-cell title="我的场景">
      <template #right-icon>
        <van-icon size="20" name="plus" @click="router.push({ path: '/sceneCreate' })" />
      </template>
    </van-cell>
    <div class="p-4">
      <section v-for="sceneItem in sceneList" :key="sceneItem.text" class="mb-6">
        <h4 class="mb-2 text-gray-600">{{ sceneItem.text }}</h4>
        <ul class="grid grid-cols-2 gap-4">
          <li
            v-for="(lightItem, lightIndex) in 4"
            :key="lightIndex"
            :style="{ backgroundImage: 'url(' + image1 + ')' }"
            class="flex items-center overflow-hidden rounded-lg bg-gray-300 bg-cover bg-center bg-no-repeat"
          >
            <div class="flex w-full items-center">
              <h4 class="h-full w-full space-x-2 bg-black bg-opacity-50 px-3 py-6 text-white">
                <label>场景操作</label>
              </h4>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
