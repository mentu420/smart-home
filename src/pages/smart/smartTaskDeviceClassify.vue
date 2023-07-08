<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getDeviceList } from '@/apis/smartApi'
import DEVICE_INFO from '@/enums/deviceInfo'
import houseStore from '@/store/houseStore.js'

const router = useRouter()

const loading = ref(false)
const filterRef = ref(null)
const deviceTypeList = ref(DEVICE_INFO)
const { roomList } = storeToRefs(houseStore())
const deviceChecked = ref([])
const roomChecked = ref([])

const { useGetRoomListSync } = houseStore()
useGetRoomListSync()

const onSelectDevice = (item) => {
  if (deviceChecked.value.includes(item.classify)) {
    deviceChecked.value = deviceChecked.value.filter((classify) => classify != item.classify)
  } else {
    deviceChecked.value.push(item.classify)
  }
}

const onSelectAllDevice = () => {
  if (deviceChecked.value.length > 0 && deviceChecked.value.length == deviceTypeList.value.length) {
    deviceChecked.value = []
  } else {
    deviceChecked.value = deviceTypeList.value.map((item) => item.classify)
  }
}

const onSelectRoom = (item) => {
  if (roomChecked.value.includes(item.id)) {
    roomChecked.value = roomChecked.value.filter((id) => id != item.id)
  } else {
    roomChecked.value.push(item.id)
  }
}

const onSelectAllRoom = () => {
  if (roomChecked.value.length > 0 && roomChecked.value.length == roomList.value.length) {
    roomChecked.value = []
  } else {
    roomChecked.value = roomList.value.map((item) => item.id)
  }
}

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
          <ul class="min-h-full p-4">
            <li class="mb-6">
              <h4 class="mb-4">设备类型</h4>
              <div>
                <van-button
                  class="!mb-4 !mr-4"
                  round
                  size="small"
                  :type="deviceChecked.length == deviceTypeList.length ? 'primary' : 'default'"
                  @click="onSelectAllDevice"
                >
                  <p class="px-4">
                    {{ deviceChecked.length == deviceTypeList.length ? '取消' : '全部' }}
                  </p>
                </van-button>
                <van-button
                  v-for="deviceItem in deviceTypeList"
                  :key="deviceItem.classify"
                  class="!mb-2 !mr-2"
                  round
                  size="small"
                  :type="deviceChecked.includes(deviceItem.classify) ? 'primary' : 'default'"
                  @click="onSelectDevice(deviceItem)"
                >
                  <p class="px-4">{{ deviceItem.text }}</p>
                </van-button>
              </div>
            </li>
            <li class="mb-6">
              <h4 class="mb-4">房间</h4>
              <div>
                <van-button
                  class="!mb-4 !mr-4"
                  round
                  size="small"
                  :type="roomChecked.length == roomList.length ? 'primary' : 'default'"
                  @click="onSelectAllRoom"
                >
                  <p class="px-4">
                    {{ roomChecked.length == roomList.length ? '取消' : '全部' }}
                  </p>
                </van-button>
                <van-button
                  v-for="roomItem in roomList"
                  :key="roomItem.id"
                  class="!mb-2 !mr-2"
                  round
                  size="small"
                  :type="roomChecked.includes(roomItem.id) ? 'primary' : 'default'"
                  @click="onSelectRoom(roomItem)"
                >
                  <p class="px-4">{{ roomItem.text }}</p>
                </van-button>
              </div>
            </li>
          </ul>
          <div class="h-[80px]"></div>
          <div class="fixed bottom-0 left-0 flex w-screen space-x-4 p-4">
            <van-button block round type="default" @click="onRest">重置</van-button>
            <van-button block round type="primary" @click="onConfirm">确认</van-button>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <van-pull-refresh v-model="loading" class="min-h-screen" @refresh="onRefresh">
      <section class="p-4">
        <div
          v-for="item in 8"
          :key="item"
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
              <IconPark size="1.8em" type="tips" fill="#fff" />
            </div>
            <div class="ml-3">
              <p>设备名称</p>
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
.filter-bar:deep(.van-dropdown-item__content) {
  min-height: 100%;
}
</style>
