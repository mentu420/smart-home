<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'SmartTaskList' })

const route = useRoute()
const router = useRouter()

const disabledScene = computed(() => {
  const { smartType, fenlei } = route.query
  return smartType == 'actions' && fenlei == 1
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加任务" />
    <ul class="p-4">
      <li
        v-clickable-active
        class="mb-4 flex items-center rounded-lg bg-white p-3 active:opacity-50"
        @click="
          router.push({
            path: '/smart-task-device-classify',
            query: route.query,
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
      </li>
      <li
        v-clickable-active
        class="flex items-center rounded-lg bg-white p-3"
        :class="{ 'opacity-50': disabledScene }"
        @click="
          () => {
            if (disabledScene) return
            router.push({
              path: '/smart-task-scene-list',
              query: route.query,
            })
          }
        "
      >
        <div class="h-10 w-10 rounded-full bg-blue-400 p-2">
          <IconFont class="text-white text-xs" icon="reservation" />
        </div>
        <div class="ml-3">
          <p>控制场景</p>
          <p class="text-sm text-gray-500">如：“执行某个场景”</p>
        </div>
      </li>
    </ul>
  </div>
</template>
