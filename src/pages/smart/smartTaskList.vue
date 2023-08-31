<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加条件" />
    <section class="p-4">
      <div
        class="mb-4 flex items-center rounded-lg bg-white p-3 active:opacity-50"
        @touchstart="() => {}"
        @click="
          router.push({
            path: '/smart-task-device-classify',
          })
        "
      >
        <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
          <IconPark size="1.8em" type="switch-one" fill="#fff" />
        </div>
        <div class="ml-3">
          <p>智能设备</p>
          <p class="text-sm text-gray-500">如“打开空调”“关闭空调”</p>
        </div>
      </div>
      <div
        class="flex items-center rounded-lg bg-white p-3 active:opacity-50"
        @touchstart="() => {}"
      >
        <div class="h-10 w-10 rounded-full bg-orange-300 p-2">
          <IconPark size="1.8em" type="application-effect" fill="#fff" />
        </div>
        <div class="ml-3">
          <p>控制场景</p>
          <p class="text-sm text-gray-500">如：“执行某个场景”</p>
        </div>
      </div>
    </section>
  </div>
</template>
