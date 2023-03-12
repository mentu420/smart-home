<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加条件" />
    <div class="px-6 py-4">
      <h4>触发事件</h4>
      <p>满足所触发条件时，场景将会执行</p>
    </div>
    <section class="p-4">
      <div
        class="mb-4 flex items-center rounded-lg bg-white p-3 active:opacity-50"
        @touchstart="() => {}"
      >
        <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
          <IconPark size="1.8em" type="press" theme="filled" fill="#fff" />
        </div>
        <div class="ml-3">
          <p>手动点击</p>
          <p class="text-sm text-gray-500">点击场景卡片时</p>
        </div>
      </div>
      <div
        class="flex items-center rounded-lg bg-white p-3 active:opacity-50"
        @touchstart="() => {}"
        @click="
          router.push({
            path: '/smartCondtionTime',
          })
        "
      >
        <div class="h-10 w-10 rounded-full bg-orange-300 p-2">
          <IconPark size="1.8em" type="time" fill="#fff" />
        </div>
        <div class="ml-3">
          <p>时间日程</p>
          <p class="text-sm text-gray-500">如：“每天8点时”</p>
        </div>
      </div>
    </section>
  </div>
</template>
