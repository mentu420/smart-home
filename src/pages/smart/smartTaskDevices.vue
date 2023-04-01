<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getDeviceList } from '@/apis/smartApi'

const router = useRouter()

const loading = ref(false)
const filterRef = ref(null)

const onRefresh = async () => {
  try {
    const { data } = await getDeviceList({ op: 1 })
    loading.value = false
    console.log(data)
  } finally {
    loading.value = false
  }
}

const onRest = () => {}

const onConfirm = () => {
  filterRef.value.toggle(false)
  onRefresh()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备分类列表" />
    <div class="flex items-center justify-between p-4">
      <p class="text-gray-500">选择希望控制的设备</p>
      <van-dropdown-menu class="filter-bar">
        <van-dropdown-item ref="filterRef" title="筛选">
          <ul class="p-4">
            <li class="mb-6">
              <h4 class="mb-4">房间</h4>
              <div>
                <van-button
                  v-for="roomItem in ['全部', '客厅', '主卧']"
                  :key="roomItem"
                  class="mr-4 mb-4"
                  round
                  size="small"
                >
                  <p class="px-4">{{ roomItem }}</p>
                </van-button>
              </div>
            </li>
            <li class="mb-6">
              <h4 class="mb-4">房间</h4>
              <div>
                <van-button
                  v-for="catgoryItem in ['全部', '卫浴', '影音', '环境', '照明', '节能', '其他']"
                  :key="catgoryItem"
                  class="mr-4 mb-4"
                  round
                  size="small"
                >
                  <p class="px-4">{{ catgoryItem }}</p>
                </van-button>
              </div>
            </li>
          </ul>
          <div class="flex space-x-4 p-4">
            <van-button block round type="default" @click="onRest">重置</van-button>
            <van-button block round type="primary" @click="onConfirm">确认</van-button>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <van-pull-refresh v-model="loading" class="min-h-screen" @refresh="onRefresh">
      <section class="p-4">
        <div
          class="mb-4 flex items-center justify-between rounded-lg bg-white p-3 active:opacity-50"
          @touchstart="() => {}"
          @click="
            router.push({
              path: '/smartTaskDeviceList',
            })
          "
        >
          <div class="flex flex-1 items-center">
            <div class="h-10 w-10 rounded-full bg-orange-400 p-2">
              <IconPark size="1.8em" type="switch-one" fill="#fff" />
            </div>
            <div class="ml-3">
              <p>智能设备</p>
              <p class="text-sm text-gray-500">如“打开空调”“关闭空调”</p>
            </div>
          </div>
          <div class="flex flex-shrink-0 items-center space-x-2">
            <p>50</p>
            <van-icon name="arrow" />
          </div>
        </div>
      </section>
    </van-pull-refresh>
  </div>
</template>

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
</style>
