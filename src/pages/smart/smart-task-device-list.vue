<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'

defineOptions({ name: 'SmartTaskDeviceList' })

const route = useRoute()
const router = useRouter()
const deviceChecked = ref([])
const deviceList = ref([])
const checkboxRefs = ref([])
const checkedAll = ref(false)
const checkboxGroup = ref(null)
const floorTree = ref([])
const { sceneCreateItem } = storeToRefs(sceneStore())

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
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
  router.push({
    path: '/smart-task-device-config',
    query: { id: item.id, classify: item.classify },
  })
}

const onSave = async () => {
  const { useGetDeviceListSync, setModeColumns } = deviceStore()
  const deviceList = await useGetDeviceListSync()
  console.log('deviceChecked', deviceChecked.value, deviceList)
  const checkList = deviceList.filter((deviceItem) => deviceChecked.value.includes(deviceItem.id))
  console.log('checkList', checkList)
  sceneCreateItem.value = {
    ...sceneCreateItem.value,
    deviceList: [
      ...(sceneCreateItem.value.deviceList || []),
      ...checkList.map((checkItem) => {
        return { ...checkItem, modeList: setModeColumns(checkItem.columns) }
      }),
    ],
  }
  router.push({ path: '/smart-scene-create' })
}

const init = () => {
  const { useGetFloorTree } = houseStore()
  floorTree.value = useGetFloorTree()
    .filter((floorItem) => {
      return floorItem.roomList.some((roomItem) => {
        return roomItem.deviceList.length > 0
      })
    })
    .map((floorItem) => {
      return {
        ...floorItem,
        roomList: floorItem.roomList.map((roomItem) => {
          return {
            ...roomItem,
            deviceList: roomItem.deviceList.filter((deviceItem) => {
              const { deviceList = [] } = sceneCreateItem.value
              const ids = deviceList.map((item) => item.id)
              return (
                deviceItem.classify == route.query.classify && //过滤类型
                !ids.includes(deviceItem.id) //过滤已经选择了的设备
              )
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
    <div class="flex items-center justify-between p-4">
      <p class="text-gray-500">选择希望控制的设备</p>
      <van-button class="!px-6" size="small" type="primary" round @click="onAllChecked">
        {{ checkedAll ? '反选' : '全选' }}
      </van-button>
    </div>
    <section class="px-4">
      <van-checkbox-group ref="checkboxGroup" v-model="deviceChecked" @change="onCheckChange">
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
              >
                <template #icon>
                  <IconFont class="text-primary mr-2" :icon="deviceItem.icon" />
                </template>
                <template #right-icon>
                  <van-checkbox
                    :ref="(el) => (checkboxRefs[deviceIndex] = el)"
                    v-model="deviceItem.checked"
                    :name="deviceItem.id"
                    @click.stop
                  ></van-checkbox>
                </template>
                <div class="flex justify-end items-center pr-4 text-gray-300">
                  <IconFont icon="more-round" @click="goDeviceConfig(deviceItem)" />
                </div>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
      </van-checkbox-group>
    </section>
    <div class="h-24"></div>
    <footer class="fixed bottom-0 left-0 w-screen bg-white px-6 py-4">
      <van-button round type="primary" block :disabled="deviceChecked.length == 0" @click="onSave">
        下一步
      </van-button>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
</style>
