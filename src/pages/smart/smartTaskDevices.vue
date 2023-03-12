<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="添加条件" />
    <div class="flex items-center justify-between p-4">
      <p class="text-gray-500">选择希望控制的设备</p>
      <van-dropdown-menu class="filter-bar">
        <van-dropdown-item title="筛选">
          <ul class="p-4">
            <li class="mb-6">
              <h4 class="mb-4">房间</h4>
              <div class="space-x-4">
                <van-button
                  v-for="roomItem in ['全部', '客厅', '主卧']"
                  :key="roomItem"
                  round
                  size="small"
                >
                  <p class="px-4">{{ roomItem }}</p>
                </van-button>
              </div>
            </li>
          </ul>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>

    <section class="p-4">
      <div
        class="mb-4 flex items-center rounded-lg bg-white p-3 active:opacity-50"
        @touchstart="() => {}"
        @click="
          router.push({
            path: '/smartTaskDeviceList',
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

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
</style>
