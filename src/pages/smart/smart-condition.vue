<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import smartStore from '@/store/smartStore'

defineOptions({ name: 'SmartCondtion' })

const router = useRouter()
const route = useRoute()

const { createSmartItem } = storeToRefs(smartStore())

const addPressEvent = () => {
  const { events = [] } = createSmartItem.value
  if (events.find((item) => item.leixing == 0)) return
  createSmartItem.value = {
    ...createSmartItem.value,
    events: [...events, { isor: 0, leixing: 0, tiaojian: {}, fujiatiaojian: [] }],
  }
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加条件" />
    <div class="px-6 py-4">
      <h4>触发事件</h4>
      <p>满足所触发条件时，自动化将会执行</p>
    </div>
    <ul class="p-4 space-y-4">
      <li
        v-clickable-active
        class="flex w-full items-center rounded-lg bg-white p-3 active:opacity-50 disabled:opacity-50"
        :class="{
          'opacity-50': createSmartItem?.events?.filter((item) => item.leixing == 0).length > 0,
        }"
        @click="addPressEvent"
      >
        <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
          <IconFont class="text-white text-xs" icon="press-down" />
        </div>
        <div class="ml-3 text-left">
          <p>手动点击</p>
          <p class="text-sm text-gray-500">点击场景卡片时</p>
        </div>
      </li>
      <li
        v-clickable-active
        class="flex w-full items-center rounded-lg bg-white p-3 active:opacity-50"
        @click="router.push({ path: '/smart-condtion-time', query: route.query })"
      >
        <div class="h-10 w-10 rounded-full bg-yellow-400 p-2">
          <IconFont class="text-white text-xs" icon="calendar" />
        </div>
        <div class="ml-3 text-left">
          <p>时间日程</p>
          <p class="text-sm text-gray-500">如：“每天8点时”</p>
        </div>
      </li>
      <li
        v-clickable-active
        class="flex w-full items-center rounded-lg bg-white p-3 active:opacity-50 disabled:opacity-50"
      >
        <div class="h-10 w-10 rounded-full bg-green-400 p-2">
          <IconFont class="text-white text-xs" icon="game" />
        </div>
        <div class="ml-3 text-left">
          <p>智能设备</p>
          <p class="text-sm text-gray-500">如"开灯时"检测到烟雾时</p>
        </div>
      </li>
    </ul>
  </div>
</template>
