<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CLASSIFY_EXECL } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'SmartTaskDeviceClassify' })

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const filterRef = ref(null)
const floorTree = ref([]) // 楼层数据
const classifyChecked = ref([]) // 大类classify
const checkedRoom = ref([]) // 房间
const { deviceList } = storeToRefs(deviceStore())

const isAll = (fId) => {
  const allIds = floorTree.value
    .find((item) => item.id == fId)
    .roomList.map((roomItem) => roomItem.id)
  return allIds.every((id) => checkedRoom.value.includes(id))
}

const searchList = computed(() => {
  const { getDeviceIcon } = deviceStore()
  return CLASSIFY_EXECL.map((item) => {
    return {
      ...item,
      count: deviceList.value?.filter((deviceItem) => {
        return checkedRoom.value.length > 0
          ? checkedRoom.value.includes(deviceItem.rId) && deviceItem.classify == item.classify
          : deviceItem.classify == item.classify
      }).length,
      icon: getDeviceIcon(item.classify),
    }
  }).filter((item) => {
    return classifyChecked.value.length > 0
      ? classifyChecked.value.includes(item.classify) && item.count > 0
      : item.count > 0
  })
})

const onSelectDevice = (classify) => {
  if (classifyChecked.value.includes(classify)) {
    classifyChecked.value = classifyChecked.value.filter((item) => item != classify)
  } else {
    classifyChecked.value = [...classifyChecked.value, classify]
  }
}

const onSelectClassify = () => {
  classifyChecked.value =
    classifyChecked.value.length > 0 && classifyChecked.value.length == CLASSIFY_EXECL.length
      ? []
      : CLASSIFY_EXECL.map((item) => item.classify)
}

const selectRoomItem = (rId) => {
  if (checkedRoom.value.includes(rId)) {
    checkedRoom.value = checkedRoom.value.filter((id) => id != rId)
  } else {
    checkedRoom.value = [...checkedRoom.value, rId]
  }
}

const onFloorSelectRoom = (fId) => {
  const allIds = floorTree.value
    .find((item) => item.id == fId)
    .roomList.map((roomItem) => roomItem.id)
  if (isAll(fId)) {
    checkedRoom.value = checkedRoom.value.filter((id) => !allIds.includes(id))
  } else {
    checkedRoom.value = [...new Set([...checkedRoom.value, ...allIds])]
  }
}

const onRefresh = async () => {
  try {
    loading.value = true
    const { useGetRoomListSync, useGetFloorListSync } = houseStore()
    const { useGetDeviceListSync } = deviceStore()
    await Promise.all([
      useGetRoomListSync(true),
      useGetFloorListSync(true),
      useGetDeviceListSync(true),
    ])
    init()
  } finally {
    loading.value = false
  }
}

const onRest = () => {
  classifyChecked.value = []
  checkedRoom.value = []
}

const goTaskDeviceList = (item) => {
  router.push({
    path: '/smart-task-device-list',
    query: { classify: item.classify, rooms: checkedRoom.value.join(','), ...route.query },
  })
}

const init = () => {
  const { useGetFloorTree } = houseStore()
  const floorList = useGetFloorTree()
  floorTree.value = floorList.filter((item) => item.roomList.length > 0)
}

init()
</script>

<template>
  <div class="bg-page-gray">
    <HeaderNavbar title="设备分类列表" />
    <van-pull-refresh v-model="loading" class="min-h-screen" @refresh="onRefresh">
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
                    :type="classifyChecked.length == CLASSIFY_EXECL.length ? 'primary' : 'default'"
                    @click="onSelectClassify"
                  >
                    <p class="px-4">
                      {{ classifyChecked.length == CLASSIFY_EXECL.length ? '取消' : '全部' }}
                    </p>
                  </van-button>
                  <van-button
                    v-for="deviceItem in CLASSIFY_EXECL"
                    :key="deviceItem.classify"
                    class="!mb-2 !mr-2"
                    round
                    size="small"
                    :type="classifyChecked.includes(deviceItem.classify) ? 'primary' : 'default'"
                    @click="onSelectDevice(deviceItem.classify)"
                  >
                    <p class="px-4">{{ deviceItem.classifyName }}</p>
                  </van-button>
                </div>
              </li>
              <li class="mb-6">
                <div v-for="floorItem in floorTree" :key="floorItem.id">
                  <h4 class="mb-4">{{ floorItem.label }}</h4>
                  <div>
                    <van-button
                      class="!mb-4 !mr-4"
                      round
                      size="small"
                      :type="isAll(floorItem.id) ? 'primary' : 'default'"
                      @click="onFloorSelectRoom(floorItem.id)"
                    >
                      <p class="px-4">
                        {{ isAll(floorItem.id) ? '取消' : '全部' }}
                      </p>
                    </van-button>
                    <van-button
                      v-for="roomItem in floorItem.roomList"
                      :key="roomItem.id"
                      class="!mb-2 !mr-2"
                      round
                      size="small"
                      :type="checkedRoom.includes(roomItem.id) ? 'primary' : 'default'"
                      @click="selectRoomItem(roomItem.id)"
                    >
                      <p class="px-4">{{ roomItem.label }}</p>
                    </van-button>
                  </div>
                </div>
              </li>
            </ul>
            <div class="h-[80px]"></div>
            <div class="fixed bottom-0 left-0 flex w-screen space-x-4 p-4">
              <van-button block round type="default" @click="onRest">重置</van-button>
              <van-button block round @click="filterRef.toggle()">确认</van-button>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>

      <div class="p-4 space-y-4">
        <van-cell
          v-for="searchItem in searchList"
          :key="searchItem.classify"
          :title="searchItem.classifyName"
          :value="searchItem.count"
          is-link
          class="rounded-lg overflow-hidden"
          @click="goTaskDeviceList(searchItem)"
        >
          <template #icon>
            <IconFont class="text-primary mr-2" :icon="searchItem.icon" />
          </template>
        </van-cell>
      </div>
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
