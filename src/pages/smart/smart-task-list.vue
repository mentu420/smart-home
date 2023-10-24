<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'SmartTaskList' })

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加条件" />
    <section class="p-4">
      <div
        v-clickable-active
        class="mb-4 flex items-center rounded-lg bg-white p-3 active:opacity-50"
        @click="
          router.push({
            path: '/smart-task-device-classify',
          })
        "
      >
        <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
          <IconFont class="text-white text-xs" icon="lamp-fill" />
        </div>
        <div class="ml-3">
          <p>智能设备</p>
          <p class="text-sm text-gray-500">如“打开空调”“关闭空调”</p>
        </div>
      </div>
      <div v-clickable-active class="flex items-center rounded-lg bg-white p-3 active:opacity-50">
        <div class="h-10 w-10 rounded-full bg-orange-300 p-2">
          <IconFont class="text-white text-xs" icon="reservation" />
        </div>
        <div class="ml-3">
          <p>控制场景</p>
          <p class="text-sm text-gray-500">如：“执行某个场景”</p>
        </div>
      </div>
    </section>
  </div>
</template>
