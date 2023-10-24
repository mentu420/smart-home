<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import sceneStore from '@/store/sceneStore'

defineOptions({ name: 'SmartCondtion' })

const router = useRouter()
const { sceneCreateItem } = storeToRefs(sceneStore())

const addPressEvent = () => {
  if (sceneCreateItem.value.fenlei === 1) return
  sceneCreateItem.value = { ...sceneCreateItem.value, fenlei: 1 }
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加条件" />
    <div class="px-6 py-4">
      <h4>触发事件</h4>
      <p>满足所触发条件时，场景将会执行</p>
    </div>
    <section class="p-4">
      <button
        v-clickable-active
        :disabled="sceneCreateItem.fenlei && sceneCreateItem.fenlei == 1"
        class="mb-4 flex w-full items-center rounded-lg bg-white p-3 active:opacity-50 disabled:opacity-50"
        @click="addPressEvent"
      >
        <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
          <IconFont class="text-white text-xs" icon="press-down" />
        </div>
        <div class="ml-3 text-left">
          <p>手动点击</p>
          <p class="text-sm text-gray-500">点击场景卡片时</p>
        </div>
      </button>
      <button
        v-clickable-active
        class="flex w-full items-center rounded-lg bg-white p-3 active:opacity-50"
        @click="
          router.push({
            path: '/smart-condtion-time',
          })
        "
      >
        <div class="h-10 w-10 rounded-full bg-yellow-400 p-2">
          <IconFont class="text-white text-xs" icon="calendar" />
        </div>
        <div class="ml-3 text-left">
          <p>时间日程</p>
          <p class="text-sm text-gray-500">如：“每天8点时”</p>
        </div>
      </button>
    </section>
  </div>
</template>
