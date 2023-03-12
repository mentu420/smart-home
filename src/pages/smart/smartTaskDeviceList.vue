<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备列表" />
    <div class="flex items-center justify-between p-4">
      <p class="text-gray-500">选择希望控制的设备</p>
      <p class="text-theme-color">全选</p>
    </div>

    <section class="p-4">
      <div
        class="mb-4 flex items-center justify-between rounded-lg bg-white p-3 active:opacity-50"
        @touchstart="() => {}"
      >
        <div class="flex space-x-2">
          <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
            <IconPark size="1.8em" type="switch-one" fill="#fff" />
          </div>
          <div>
            <p>智能设备</p>
            <p class="text-sm text-gray-500">设备房间</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <IconPark size="1.8em" type="switch-one" />
          <van-checkbox v-model="checked"></van-checkbox>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
</style>
