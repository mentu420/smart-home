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
  console.log(length)
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

const onSave = async () => {
  const { useGetDeviceListSync, setModeColumns } = deviceStore()

  const deviceList = await useGetDeviceListSync()

  //ziyuanleixing 资源类型 1，设备；2，场景
  const checkList = deviceList
    .filter((deviceItem) => checkedDevice.value.includes(deviceItem.id))
    .map((checkItem) => ({
      ...checkItem,
      ziyuanleixing: 1,
      modeList: setModeColumns(checkItem.columns),
    }))

  const { smartType, fenlei, eventIndex, extend } = route.query
  if (smartType == 'actions') {
    const smartDeviceList = createSmartItem.value[smartType] || []

    const newDeviceList =
      smartDeviceList.length > 0
        ? [
            ...smartDeviceList.filter((item) => !checkedDevice.value.includes(item.id)),
            ...checkList,
          ]
        : checkList

    createSmartItem.value = {
      ...createSmartItem.value,
      [smartType]: newDeviceList,
    }
  } else {
    const newEvents = checkList.map((checkItem) => ({ leixing: 2, tiaojian: checkItem }))
    const orginEvents = createSmartItem.value[smartType] || []
    let mergeEvents = []
    if (extend) {
      //附加条件
      const fujiatiaojian = orginEvents.find((item, i) => i == eventIndex)[extend] || []
      mergeEvents = mergeEventsArray(fujiatiaojian, newEvents)
    } else {
      mergeEvents = mergeEventsArray(orginEvents, newEvents)
    }

    console.log('mergeEvents', mergeEvents)

    createSmartItem.value = {
      ...createSmartItem.value,
      [smartType]: !extend
        ? mergeEvents
        : orginEvents.map((item, i) => {
            if (i == eventIndex) return { ...item, fujiatiaojian: mergeEvents }
            return item
          }),
    }
  }

  router.go(smartType == 'actions' ? -3 : -4)
}

const init = () => {
  const { useGetFloorTree } = houseStore()
  const { fenlei, smartType, extend, eventIndex } = route.query
  const smartTypeData = createSmartItem.value[smartType] || []
  console.log('smartTypeData', smartTypeData)
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
    .filter((floorItem) => {
      return floorItem.roomList.some((roomItem) => {
        const roomIds = stringToArray(route.query.rooms)
        return roomIds == ''
          ? roomItem.deviceList.length > 0
          : roomIds.includes(roomItem.id) && roomItem.deviceList.length
      })
    })
    .map((floorItem) => {
      return {
        ...floorItem,
        roomList: floorItem.roomList.map((roomItem) => {
          return {
            ...roomItem,
            deviceList: roomItem.deviceList.filter((deviceItem) => {
              return deviceItem.classify == route.query.classify
            }),
          }
        }),
      }
    })
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="选择设备" />
    <!-- <div class="flex items-center justify-between p-4">
      <p class="text-gray-500">选择希望控制的设备</p>
      <van-button
        v-if="!isEvents"
        class="!px-6"
        size="small"
        type="primary"
        round
        @click="onAllChecked"
      >
        {{ checkedAll ? '反选' : '全选' }}
      </van-button>
    </div> -->
    <section class="px-4">
      <!-- <van-checkbox-group ref="checkboxGroup" v-model="checkedDevice" @change="onCheckChange"> -->
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
              @click="toggle(deviceItem.id)"
            >
              <template #icon>
                <IconFont class="text-primary mr-2" :icon="deviceItem.icon" />
              </template>
              <!-- <template #right-icon>
                  <van-checkbox
                    v-if="!isEvents"
                    :ref="(el) => (checkboxRefs[deviceItem.id] = el)"
                    v-model="deviceItem.checked"
                    :name="deviceItem.id"
                    @click.stop
                  ></van-checkbox>
                </template> -->
              <div class="flex justify-end items-center pr-4 text-gray-300">
                <IconFont icon="more-round" @click.stop="goDeviceConfig(deviceItem)" />
              </div>
            </van-cell>
          </van-cell-group>
        </div>
      </div>
      <!-- </van-checkbox-group> -->
    </section>
    <!-- <div class="h-24"></div>
    <footer v-if="!isEvents" class="fixed bottom-0 left-0 w-screen bg-white px-6 py-4">
      <van-button round type="primary" block :disabled="checkedDevice.length == 0" @click="onSave">
        下一步
      </van-button>
    </footer> -->
  </div>
</template>

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
</style>
