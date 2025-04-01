<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'
import { stringToArray } from '@/utils/common'

defineOptions({ name: 'SmartTaskDeviceList' })

const route = useRoute()
const router = useRouter()
const checkedDevice = ref([])
const checkboxRefs = ref({})
const checkedAll = ref(false)
const checkboxGroup = ref(null)
const floorTree = ref([])
const { createSmartItem } = storeToRefs(smartStore())

const isEvents = computed(() => route.query.smartType == 'events')

const toggle = (id) => {
  checkboxRefs.value[id]?.toggle()
}

const onAllChecked = () => {
  checkedAll.value = !checkedAll.value
  checkboxGroup.value?.toggleAll(checkedAll.value)
}

const onCheckChange = (values) => {
  const length = floorTree.value
    .map((floorItem) =>
      floorItem.roomList.map((roomItem) => {
        return roomItem.deviceList.length
      })
    )
    .flat(2)
    .reduce((a, b) => a + b, 0)
  checkedAll.value = values.length == length
}

const goDeviceConfig = (item) => {
  const path = isEvents.value ? '/smart-condtion-device-mode' : '/smart-task-device-config'

  router.push({
    path,
    query: { ...route.query, id: item.id },
  })
}

//合并事件列表
const mergeEventsArray = (origin, newArr) => {
  const alreadyIds = origin
    .filter((item) => newArr.some((option) => option.id == item.id))
    .map((item) => item.id)
    .filter(Boolean)
  return [...origin, ...newArr.filter((item) => !alreadyIds.includes(item.id))]
}

const init = () => {
  const { useGetFloorTree } = houseStore()
  const { smartType, extend, eventIndex } = route.query
  const smartTypeData = createSmartItem.value[smartType] || []
  if (smartType == 'actions') {
    // action 根据ziyuanbianhao区分设备、场景
    checkedDevice.value = smartTypeData.map((item) => item.id && item.ziyuanleixing == 1)
  } else {
    if (extend) {
      //附加条件
      checkedDevice.value =
        smartTypeData.find((item, i) => i == eventIndex)[extend]?.map((item) => item.tiaojian.id) ||
        []
    } else {
      checkedDevice.value = smartTypeData.map((item) => item.tiaojian.id)
    }
  }

  floorTree.value = useGetFloorTree()
    .map((floorItem) => {
      const roomIds = stringToArray(route.query.rooms)
      return {
        ...floorItem,
        roomList: floorItem.roomList
          .filter((roomItem) => (roomIds.length > 0 ? roomIds.includes(roomItem.id) : true))
          .map((roomItem) => {
            return {
              ...roomItem,
              deviceList: roomItem.deviceList.filter((deviceItem) => {
                return deviceItem.classify == route.query.classify
              }),
            }
          }),
      }
    })
    .filter((floorItem) => {
      return floorItem.roomList.some((roomItem) => {
        return roomItem.deviceList.length > 0
      })
    })
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="选择设备" />
    <section class="px-4">
      <div v-for="floorItem in floorTree" :key="floorItem.id">
        <h3 class="p-4">{{ floorItem.label }}</h3>
        <div class="rounded-lg overflow-hidden">
          <van-cell-group v-for="roomItem in floorItem.roomList" :key="roomItem.id">
            <van-cell
              v-for="deviceItem in roomItem.deviceList"
              :key="deviceItem.id"
              :title="deviceItem.label"
              :label="roomItem.label"
              center
              clickable
              @click="goDeviceConfig(deviceItem)"
            >
              <template #icon>
                <SmartImage class="w-[28px] h-[28px]" :src="deviceItem?.iconUrl">
                  <template #error>
                    <IconFont class="mr-2" :icon="deviceItem.icon" />
                  </template>
                </SmartImage>
              </template>
              <div class="flex justify-end items-center pr-4 text-gray-300">
                <IconFont icon="more-round" />
              </div>
            </van-cell>
          </van-cell-group>
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
