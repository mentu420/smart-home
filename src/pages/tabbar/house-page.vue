<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import draggable from 'vuedraggable'

import { getHouseList } from '@/apis/houseApi.js'
import DeviceCardItem from '@/components/base/DeviceCardItem.vue'
import ScenenCardItem from '@/components/base/ScenenCardItem.vue'
import { mapLoad, getCityInfoByIp } from '@/hooks/useAMap'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'
import userStore from '@/store/userStore'

const router = useRouter()
const route = useRoute()

const useHouseStore = houseStore()
const useDeviceStore = deviceStore()
const useSceneStore = sceneStore()
const { houseList, currentHouse, roomList } = storeToRefs(useHouseStore)
const { deviceList } = storeToRefs(useDeviceStore)
const { getDeviceIcon } = useDeviceStore
const { getRoomSceneList, sceneList } = storeToRefs(useSceneStore)

const showHomeList = ref(false)
const loading = ref(false)
const showFloorConfig = ref(false)
const tabActive = ref(0)
const floorTree = ref([]) // 楼层树状结构数据
const currentFloorId = ref('') //当前楼层id
const dragOptions = ref({
  animation: 200,
  group: 'description',
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})
const collectList = ref([
  {
    id: 0,
    label: '常用场景',
    data: [],
    componentsKey: 'ScenenCardItem',
  },
  {
    id: 1,
    label: '常用设备',
    data: [],
    componentsKey: 'DeviceCardItem',
  },
]) //收藏的场景、设备

const weatherRef = ref(null)

const onMoreSelect = () => {}

const onConfigSelect = (action) => {
  console.log(action)
  tabActive.value = roomList.value.findIndex((value) => value.id == action.id) + 1
}

const toggleDrag = () => {
  dragOptions.value.disabled = !dragOptions.value.disabled
}

const openDeviceStatus = (item) => {
  console.log(item)
  router.push({
    path: '/smart-device-status',
    query: { id: item.id, name: item.label, classify: item.classify },
  })
}

// 初始化数据 hId 初始化房屋id
// 请求完所有数据后设置当前房屋数据
const onReload = async (hId) => {
  const { useGetHouseListSync, useGetRoomListSync, useGetFloorListSync, useGetFamilyListSync } =
    houseStore()
  const { useGetDeviceListSync } = deviceStore()
  const { useGetSceneListSync } = sceneStore()
  await Promise.all([
    useGetHouseListSync(true),
    useGetRoomListSync(true),
    useGetFloorListSync(true),
    useGetDeviceListSync(true),
    useGetSceneListSync(true),
    useGetFamilyListSync(true),
  ])
  console.log('准备设置当前房屋', hId)
  useHouseStore.setCurrentHouse(hId)
}

const onHouseSelect = async (action) => {
  try {
    loading.value = true
    const { useGetToken, useSetToken } = userStore()
    showHomeList.value = false
    const hId = action.id
    await getHouseList({ op: 5, fangwubianhao: hId })
    await onReload(hId)
    useSetToken({ ...useGetToken(), fangwubianhao: hId })
  } finally {
    loading.value = false
  }
}

const onFloorSelect = (action) => {
  console.log(action)
  currentFloorId.value = action.id
  showFloorConfig.value = false
}

const getFloorTree = () => {
  collectList.value = collectList.value.map((item) => {
    if (item.id == 0) {
      return { ...item, data: sceneList.value.filter((sceneItem) => sceneItem.shouye == 1) }
    }
    return { ...item, data: deviceList.value.filter((deviceItem) => deviceItem.shouye == 1) }
  })
  floorTree.value = useHouseStore.useGetFloorTree()
}

const init = async () => {
  try {
    const { useGetToken } = userStore()
    const token = useGetToken()
    await onReload(token.fangwubianhao)
    getFloorTree()
    currentFloorId.value = floorTree.value[0]?.id
  } catch (err) {
    console.warn(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  init()
})

onActivated(getFloorTree)

watch(
  () => route.path,
  (to, from) => {
    console.log(to, from)
    if (to == '/tabbar/tabbar-house' && ['/account-login', '/phone-login'].includes(from)) {
      init()
    }
  }
)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <van-pull-refresh v-model="loading" @refresh="init">
      <template v-if="dragOptions.disabled">
        <div class="flex justify-between p-4">
          <van-popover v-model:show="showHomeList" :actions="houseList" placement="bottom-start">
            <van-cell-group>
              <van-cell
                v-for="houseItem in houseList"
                :key="houseItem.id"
                @click="onHouseSelect(houseItem)"
              >
                <template #title>
                  <div class="flex justify-center items-center">
                    <van-icon v-if="currentHouse?.id == houseItem.id" name="location" />
                    <label>{{ houseItem.label }}</label>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
            <template #reference>
              <div class="flex items-center space-x-4">
                <h3>{{ currentHouse?.label }}</h3>
                <van-icon name="arrow-down" />
              </div>
            </template>
          </van-popover>
          <div class="space-x-4">
            <van-icon size="20" name="bell" />
            <van-icon size="20" name="plus" @click="router.push({ path: '/house-ddd-device' })" />
            <!-- <van-popover
              :actions="[
                { text: '添加设备', value: 0 },
                { text: '拖拽排序', value: 1 },
              ]"
              placement="bottom-end"
              @select="onMoreSelect"
            >
              <template #reference>
                <van-icon size="20" name="plus" />
              </template>
            </van-popover> -->
          </div>
        </div>
        <div
          v-if="currentHouse?.huanjingzhuangtai"
          ref="weatherRef"
          class="min-h-10 flex items-end p-4"
        >
          <h2>{{ currentHouse?.huanjingzhuangtai?.WenDu }}</h2>
          <p class="ml-1 mr-4 text-sm">℃</p>
          <!-- <h2 class="mr-2 text-lg">{{ currentHouse?.huanjingzhuangtai?.ShiDu }}</h2> -->
        </div>
      </template>
      <div class="relative">
        <van-tabs
          v-model:active="tabActive"
          background="#f7f7f7"
          shrink
          sticky
          line-width="0"
          animated
          swipeable
        >
          <template #nav-right>
            <div class="w-[70px] flex-shrink-0"></div>
          </template>
          <van-tab title="全屋">
            <section class="p-4">
              <template v-for="collectItem in collectList" :key="collectItem.id">
                <h4 class="mb-2 text-gray-600">{{ collectItem.label }}</h4>
                <div class="grid grid-cols-2 gap-4">
                  <component
                    :is="collectItem.componentsKey"
                    v-for="commonItem in collectItem.data"
                    :key="commonItem.id"
                  >
                    <div v-if="collectItem.id == 0" class="space-x-2 text-white">
                      <label>{{ commonItem.label }}</label>
                    </div>
                  </component>
                </div>
              </template>
            </section>
          </van-tab>
          <van-tab
            v-for="(roomItem, roomIndex) in floorTree.find(
              (floorItem) => floorItem.id == currentFloorId
            )?.roomList"
            :key="roomIndex"
            :title="roomItem.label"
          >
            <section class="p-4">
              <div class="grid grid-cols-2 gap-4">
                <ScenenCardItem
                  v-for="(sceneItem, sceneIndex) in roomItem.sceneList"
                  :key="sceneIndex"
                >
                  <label>{{ sceneItem.label }}</label>
                </ScenenCardItem>
              </div>

              <template v-if="roomItem.deviceList.length > 0">
                <div class="flex items-center py-4">
                  <h4 class="text-gray-600">照明</h4>
                  <label class="ml-2 text-xs text-gray-400">2个灯亮</label>
                </div>
                <div class="mb-4 grid grid-cols-2 gap-4">
                  <ScenenCardItem
                    v-for="(sceneItem, sceneIndex) in ['全开', '全关']"
                    :key="sceneIndex"
                  >
                    <label>{{ sceneItem }}</label>
                  </ScenenCardItem>
                </div>
              </template>

              <div class="grid grid-cols-2 gap-4">
                <DeviceCardItem
                  v-for="(deviceItem, deviceIndex) in roomItem.deviceList"
                  :key="deviceIndex"
                  :label="deviceItem.label"
                  :icon="getDeviceIcon(deviceItem.classify)"
                  @click-right-icon="openDeviceStatus(deviceItem)"
                ></DeviceCardItem>
              </div>
            </section>
          </van-tab>
        </van-tabs>
        <div class="absolute right-0 top-0 bg-page-gray">
          <div class="flex h-[44px] w-[70px] flex-auto items-center justify-center space-x-4">
            <!-- <van-button v-if="!dragOptions.disabled" size="mini" type="primary" @click="toggleDrag">
                完成
              </van-button> -->
            <!-- <template v-else> -->
            <!-- <IconPark type="add-item" theme="outline" size="20" @click="toggleDrag" /> -->
            <van-popover
              v-model:show="showFloorConfig"
              placement="bottom-end"
              @select="onConfigSelect"
            >
              <template #reference>
                <div class="flex items-center px-2 py-1 rounded-md bg-white space-x-1">
                  <p class="w-[40px] truncate text-xs shrink-0 text-center">
                    {{ floorTree.find((floorItem) => floorItem.id == currentFloorId)?.label }}
                  </p>
                  <van-icon name="arrow-down" />
                </div>
              </template>
              <van-cell-group class="w-[50vw]">
                <van-cell
                  v-for="floorItem in floorTree"
                  :key="floorItem.id"
                  @click="onFloorSelect(floorItem)"
                >
                  <template #title>
                    <div class="flex justify-center items-center">
                      <van-icon v-if="currentFloorId == floorItem.id" name="location" />
                      <label>{{ floorItem.label }}</label>
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-popover>
            <!-- </template> -->
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
